// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

error BreatheGardenError();

contract BreatheGarden is ERC721URIStorage, ChainlinkClient, ConfirmedOwner {
    using Counters for Counters.Counter;
    using Chainlink for Chainlink.Request;

    Counters.Counter private _tokenIds;
    mapping(address => mapping(uint256 => uint256)) public ownedTokens;
    mapping(uint256 => address) private _creators;

    mapping(string => uint256) public _cityToPollution;
    mapping(bytes32 => string) public _requestIdToCity;
    mapping(uint256 => string) public _tokenIdToCity;

    bytes32 private jobId;
    uint256 private fee;

    constructor() ERC721("Breathe Garden", "BG") ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    function _getMetadata(uint256 _pollution) private pure returns (string memory) {
        if (_pollution >= 0 && _pollution < 49) return "https://breathe.garden/metadata/low-pollution.json";
        else if (_pollution >= 50 && _pollution < 99) return "https://breathe.garden/metadata/medium-pollution.json";
        else if (_pollution >= 100) return "https://breathe.garden/metadata/high-pollution.json";
        else return "https://breathe.garden/metadata/high-pollution.json";
    }

    function requestPollutionData(string memory _city) public returns (bytes32) {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        string memory url = string(
            abi.encodePacked("https://api.waqi.info/feed/", _city, "/?token=3ab5a02399daca6b7295bbb2579b8d199e480792")
        );

        req.add("get", url);

        // {
        //     "status": "ok",
        //     "data": {
        //         "aqi": 15,
        //         "idx": 5722,
        req.add("path", "data,aqi"); // Chainlink nodes 1.0.0 and later support this format

        bytes32 requestId = sendChainlinkRequest(req, fee);
        _requestIdToCity[requestId] = _city;

        return requestId;
    }

    function fulfill(bytes32 _requestId, uint256 _pollution) public recordChainlinkFulfillment(_requestId) {
        string memory city = _requestIdToCity[_requestId];
        _cityToPollution[city] = _pollution;
        updateTokens();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function mint(string memory city) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        address owner = msg.sender;
        _safeMint(owner, tokenId);
        _tokenIdToCity[tokenId] = city;
        _addTokenToOwnerEnumeration(owner, tokenId);
        _creators[tokenId] = owner;
        _cityToPollution[city] = 0; //Temporary value
        string memory metadataURI = "https://breathe.garden/loading.json";
        _setTokenURI(tokenId, metadataURI);
        requestPollutionData(city);
        return tokenId;
    }

    function updateTokens() public {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 currentIndex = 0;
        for (uint256 i = 1; i < numberOfExistingTokens + 1; i++) {
            updateToken(currentIndex);
            currentIndex += 1;
        }
    }

    function updateToken(uint256 tokenId) public {
        string memory city = _tokenIdToCity[tokenId];
        uint256 pollution = _cityToPollution[city];
        string memory metadataURI = _getMetadata(pollution);
        _setTokenURI(tokenId, metadataURI);
    }

    function _addTokenToOwnerEnumeration(address owner, uint256 tokenId) private {
        uint256 length = balanceOf(owner);
        ownedTokens[owner][length] = tokenId;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        //require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return ownedTokens[owner][index];
    }

    function throwError() external pure {
        revert BreatheGardenError();
    }

    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensCreated = 0;

        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            numberOfTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }

    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }
}
