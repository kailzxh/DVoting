import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constants/constants';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './index.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    
    initialize();
    getCandidates();
    getRemainingTime();
    getCurrentStatus();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function vote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      const tx = await contractInstance.vote(number);
      await tx.wait();
      await getCandidates();
      await checkCanVote();
    } catch (error) {
      console.error("Voting failed:", error);
    }
  }

  async function checkCanVote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(!voteStatus);
    } catch (error) {
      console.error("Check vote status failed:", error);
    }
  }

  async function getCandidates() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const candidatesList = await contractInstance.getAllVotesOfCandidates();
      // App.js
const formattedCandidates = candidatesList.map((candidate, index) => ({
  index: index,
  name: candidate[0], // Access struct field by index
  voteCount: candidate[1].toNumber()

      }));
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Fetch candidates failed:", error);
    }
  }

  async function getCurrentStatus() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);
    } catch (error) {
      console.error("Get voting status failed:", error);
    }
  }

  async function getRemainingTime() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const time = await contractInstance.getRemainingTime();
      setRemainingTime(time.toNumber());
    } catch (error) {
      console.error("Get remaining time failed:", error);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      checkCanVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        await checkCanVote();
        await getCandidates();
        await getCurrentStatus();
        await getRemainingTime();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {votingStatus === "Voting is in progress" ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={canVote}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
}

export default App;