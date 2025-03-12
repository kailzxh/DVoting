const hre = require("hardhat");

async function main() {
    
    const Voting = await hre.ethers.getContractFactory("Voting");

    
    const votingContract = await Voting.deploy(["Kailash", "Mark", "Mike", "Leblon"], 120);

   
    await votingContract.waitForDeployment();  

   
    console.log("Contract deployed at:", await votingContract.getAddress());
}


main()
    .then(() => process.exit(0)) 
    .catch(error => {
        console.error("Deployment failed:", error);
        process.exit(1); 
    });
