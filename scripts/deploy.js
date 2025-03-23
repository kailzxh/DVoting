const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    // Deploy without .deployed()
    const votingContract = await Voting.deploy(
        ["Kailash", "Mark", "Mike", "Leblon"],
        120
    );
    // Use .target instead of .address
    console.log("Contract deployed to:", votingContract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });