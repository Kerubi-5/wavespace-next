import { useState, useEffect } from "react";
import Menu from "./../components/Menu";
import { ethers } from "ethers";
import abi from "../utils/WavePortal.json";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalWaves, setTotalWaves] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

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

  const getWavePortalContract = async () => {
    try {
      const { ethereum } = window;
      const contractAddress = "0x2Cca99E47D843DCdA9d5Afca65087CaA85D1ac8F";
      const contractABI = abi.abi;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, contractABI, signer);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const wavePortalContract = await getWavePortalContract();

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      /*
       * Execute the actual wave from your smart contract
       */
      const waveTxn = await wavePortalContract.wave(msg, {
        gasLimit: 300000,
      });

      setIsLoading(true);
      setMsg("");
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(
        "To prevent spamming, you can only send a message every 15 minutes"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const getTotalWaves = async () => {
      try {
        const wavePortalContract = await getWavePortalContract();
        const totalWaves = await wavePortalContract.getTotalWaves();
        setTotalWaves(totalWaves.toNumber());
      } catch (error) {
        console.log("getTotalWaves ~ error", error);
      }
    };
    getTotalWaves();
  }, [isLoading, currentAccount]);

  useEffect(() => {
    const getAllWaves = async () => {
      try {
        const wavePortalContract = await getWavePortalContract();
        const waves = await wavePortalContract.getAllWaves();

        setAllWaves(
          waves.map((item) => {
            return {
              address: item.waver,
              msg: item.message,
              time: new Date(item.timestamp * 1000),
            };
          })
        );
      } catch (error) {
        console.log("getAllWaves ~ error", error);
      }
    };
    getAllWaves();
  }, [isLoading, currentAccount]);

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          time: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    const waveEmitter = async () => {
      if (window.ethereum) {
        const wavePortalContract = await getWavePortalContract();

        wavePortalContract.on("NewWave", onNewWave);
      }

      return () => {
        if (wavePortalContract) {
          wavePortalContract.off("NewWave", onNewWave);
        }
      };
    };

    waveEmitter();
  }, []);

  return (
    <>
      <div
        className={`absolute w-full h-[250px] top-0 bg-white z-50 break-words text-clip overflow-auto p-4 shadow-sm ${
          error === "" && "hidden"
        }`}
      >
        <div
          className="absolute top-2 right-2 p-4 cursor-pointer"
          onClick={() => setError("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="">
          <h2 className="text-lg font-bold text-red-600">Error:</h2>
          <p>{error}</p>
        </div>
      </div>
      <Menu connectWallet={connectWallet} currentAccount={currentAccount} />
      <div className="container mx-auto px-4 text-center py-9 font-roboto bg-gray-100 m-5 rounded-xl shadow-md relative">
        <div className="flex items-center gap-2 px-4">
          <h2 className="text-xl font-semibold">Total Waves:</h2>
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white">
            {totalWaves}
          </span>
        </div>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500">
            Hey There
          </h1>
          <p className="text-base font-semibold text-gray-500">
            <span>👋</span> My name is John Kim, Click the button below to wave
            at me!
          </p>

          <div
            className={`${
              isLoading ? "bg-gray-200" : "bg-white"
            } inline-flex mt-5 rounded-md`}
          >
            <input
              className="outline-none px-2 bg-transparent"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              disabled={isLoading && "disabled"}
            />
            <button
              className={`font-semibold px-4 py-2 ${
                isLoading
                  ? "bg-gray-500"
                  : "bg-gradient-to-r from-purple-500 to-blue-500"
              } rounded-r-md text-white inline-flex items-center`}
              onClick={wave}
              disabled={isLoading && "disabled"}
            >
              Send Message
              {isLoading ? (
                <svg
                  role="status"
                  className="ml-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-xl container mx-auto shadow-md space-y-4">
        {allWaves.map((item) => {
          console.log(item.time);
          return (
            <div
              className="bg-gray-50 shadow-sm p-4 rounded-md break-all"
              key={item.time}
            >
              <div>Address: {item.address}</div>
              <div>
                Time: {item.time.toLocaleString("en-GB", { timeZone: "UTC" })}
              </div>
              <div>Message: {item.msg}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
