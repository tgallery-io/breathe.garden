import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { BreatheGarden } from "../types/contracts/BreatheGarden";
import type { SpaceAdventures } from "../types/contracts/SpaceAdventures";
import type { SpaceCoins } from "../types/contracts/SpaceCoins";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    spaceAdventures: SpaceAdventures;
    spaceCoins: SpaceCoins;
    BreatheGarden: BreatheGarden;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
}
