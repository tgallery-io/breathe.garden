import { ethers } from 'ethers'
import { State } from 'reducers'
import { showToaster } from '../Toaster/Toaster.actions'
import { ERROR } from '../Toaster/Toaster.constants'
const abi = require('../../../abi/BreatheGarden.json')

declare var window: any

export const CONNECT = 'CONNECT'
export const connect =
  ({ forcePermission = false }: { forcePermission?: boolean }) =>
  async (dispatch: any, getState: any) => {
    const state: State = getState()

    try {
      if (!state.wallet) {
        dispatch(showToaster(ERROR, 'Metamask not available', ''))
        throw new Error('Metamask not available')
      } else {
        let provider: ethers.providers.Web3Provider
        let signer: ethers.providers.JsonRpcSigner
        let address: string
        let contractWithSigner: ethers.Contract

        provider = new ethers.providers.Web3Provider(window.ethereum)

        await provider.send('eth_requestAccounts', [])

        // window.ethereum
        //   .request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: `0x${Number(4).toString(80001)}` }],
        //   })
        //   .catch(() => {})

        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881',
              rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
              chainName: 'Polygon Mumbai',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 16,
              },
              blockExplorerUrls: null,
            },
          ],
        })

        signer = provider.getSigner()
        address = await signer.getAddress()

        const contract = new ethers.Contract('0xed9B1544354d4185a656975e3563C16A082B0598', abi, provider)
        contractWithSigner = contract.connect(signer)

        dispatch({
          type: CONNECT,
          address,
          provider,
          signer,
          contractWithSigner,
        })
      }
    } catch (err: any) {
      dispatch(showToaster(ERROR, 'Failed to connect Metamask', err.message))
      console.error(`Failed to connect Metamask: ${err.message}`)
    }
  }
