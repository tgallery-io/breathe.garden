import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { BreatheGarden } from "../../types/contracts/BreatheGarden";
import type { BreatheGarden__factory } from "../../types/factories/contracts/BreatheGarden__factory";

task("deploy:BreatheGarden")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const breatheGardenFactory: BreatheGarden__factory = <BreatheGarden__factory>(
      await ethers.getContractFactory("BreatheGarden")
    );
    const breatheGarden: BreatheGarden = <BreatheGarden>await breatheGardenFactory.connect(signers[0]).deploy();
    await breatheGarden.deployed();
    console.log("BreatheGarden deployed to: ", breatheGarden.address);
  });
