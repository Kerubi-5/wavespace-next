import { useState, useEffect } from "react";
import Menu from "./../components/Menu";
import { ethers } from "ethers";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <Menu connectWallet={connectWallet} currentAccount={currentAccount} />
      <div className="container mx-auto px-4 text-center py-9 font-roboto bg-gray-50 m-5 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500">
          Hey There
        </h1>
        <p className="text-base font-semibold text-gray-500">
          <span>👋</span> My name is John Kim, Click the button below to wave at
          me!
        </p>
        <button className="font-semibold px-4 py-2 m-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-white mt-5">
          Wave at Me
        </button>
      </div>
    </>
  );
}
