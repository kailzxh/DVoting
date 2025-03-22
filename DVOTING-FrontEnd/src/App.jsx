import { useState , useEffect} from 'react'
import { ethers } from 'ethers'
import { ContractABI, ContractAddress } from './Constants/constants'
import Login from './Components/Login'
import './index.css' // Make sure this path is correct

function App() {
  const [provider , setProvider] = useState(null);
const [account ,setAccount] = useState(null);
const [connected , setConnected] = useState(false);
 async function connectToMetamaskWallet(){
    if(window.ethereum){
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
         setProvider(provider);
         await provider.send("eth_requestAccounts",[]);
         const signer = provider.getSigner();
          const address =await signer.getAddress();
         console.log("metamask connectes :"+address);
         setConnected(true);
        }
        catch(err){
            console.error(err);
        }
            
    }
    else{
        console.error("metamask is not detected in your browser");
    }
}
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <Login connectWallet={connectToMetamaskWallet}/>
    </div>
  )
}

export default App 