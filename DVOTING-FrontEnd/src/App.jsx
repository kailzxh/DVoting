import { useState , useEffect} from 'react'
import { ethers } from 'ethers'
import { ContractABI, ContractAddress } from './Constants/constants'
import './index.css' // Make sure this path is correct

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <h1 className="text-6xl font-black text-white bg-blue-500 p-8 rounded-lg shadow-xl animate-bounce">
        TAILWIND TEST 🚀
      </h1>
    </div>
  )
}

export default App