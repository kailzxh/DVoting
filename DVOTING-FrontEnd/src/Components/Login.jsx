import React, { useState } from "react";
import { ethers, providers } from "ethers";
import '../index.css' 

const Login = (props)=>{
    return <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h1 className="text-green-800 text-xl">Welcome to DVoting</h1>
        <button className="flex justify-center items-center  px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700" onClick={props.connectWallet}>Connect</button>
    </div>
}
export default Login;