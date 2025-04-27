import { ethers } from "hardhat";

async function main() {
  const MedicalRecord = await ethers.getContractFactory("MedicalRecord");
  const medicalRecord = await MedicalRecord.deploy();

  await medicalRecord.waitForDeployment();

  console.log(
    `MedicalRecord contract deployed to: ${await medicalRecord.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
