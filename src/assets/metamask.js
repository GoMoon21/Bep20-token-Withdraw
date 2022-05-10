import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

import { ABI } from "./abi.js";
import { ethers } from "ethers";
import { useWallet, UseWalletProvider } from "use-wallet";

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { InjectedConnector } from "@web3-react/injected-connector";
import { config } from "./config.js";
import { SnackbarProvider, useSnackbar } from 'notistack';


const web3 = new Web3(Web3.givenProvider);
const contractAddr = config.contract_address;
const Contract = new web3.eth.Contract(ABI, contractAddr);

function initWeb3(provider) {
  var web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 97, 1337],
});

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
      },
    };
    return providerOptions;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [router, setRouter] = useState("home");
  const [remainSeconds, setRemainSeconds] = useState(0);
  const [remainMinutes, setRemainMinutes] = useState(0);
  const [remainHours, setRemainHours] = useState(0);
  const [remainDays, setRemainDays] = useState(7);
  const [presaleFinished, setPresaleFinished] = useState(false);
  const [BNBAmount, setBNB] = useState("Connect Metamask!");

  const [Bvalue, setValue] = useState("");
  const [status, setStatus] = useState(false);
  const [connected, setConnected] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [address, setAddress] = useState("");
  const [walletAddr, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState(56);
  const [networkId, setNetworkId] = useState("");
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [isProxy, setIsProxy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [success, setSuccess] = useState(false);

  const ConnectWallet = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "a364b3c14ec24d67a8d260b721adb45b",
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    console.log("chain id: " + chainId);
    await setWeb3(web3);
    await setProvider(provider);
    await setConnected(true);
    await setAddress(address);
    await setWalletAddress(
      address.substring(0, 4) +
        "..." +
        address.substring(address.length - 6, address.length)
    );
    await setChainId(chainId);
    await setNetworkId(networkId);
    await checkNetwork();
    await setWeb3Modal(web3Modal);
    // alert(modalShow);

    console.log("address: " + address);
  };

  const DisconnectWallet = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    await web3Modal.clearCachedProvider();
    setWeb3Modal(new Web3Modal());

    await setConnected(false);
    setAddress("");
    setWalletAddress("");
    console.log(connected);
    // this.setState({ ...INITIAL_STATE });
  };

  async function subscribeProvider(provider) {
    if (!provider.on) {
      return;
    }
    provider.on("disconnect", () => DisconnectWallet());

    provider.on("accountsChanged", async (accounts) => {
      await setAddress(accounts[0]);
      // await this.getAccountAssets();
    });
  }

  const checkNetwork = async () => {
    if (chainId === config.chainId) await setModalShow(false);
    else await setModalShow(true);
    // await this.getAccountAssets();
  };

  const get_token_name = async () => {
    if (connected === true) {
      if (chainId !== 97) {
        //56   97
        alert("Please select Biance Smart Chain network!");
        return;
      }

      // let tx = await Contract.methods.Airdrop().send({
      // 	from: address,
      // 	to: contractAddr,
      // });
      // console.log(tx);

      let tx = await Contract.methods.name().call();

      console.log(tx);
    } else {
      alert("Please connect to the wallet");
      ConnectWallet();
    }
  };

  const withdraw = async (amount) => {
    if (connected === true) {
        if (chainId !== config.chainId) {
          //56   97
          alert("Please select Biance Smart Chain network!");
          return;
        }
  
        console.log(amount);
        setIsLoading(true);
  
        try {
          let tx = await Contract.methods
            .withdraw(amount)
            .send({ from: address, to: config.contract_address });
  
          console.log(tx.events.Transfer.id);
          setIsLoading(false);
          // success_transfer();
        //   callback();
        } catch (error) {
          setIsLoading(false);
          console.log(error.message);
          // error_transfer(error.message);
        }
      } else {
        alert("Please connect to the wallet");
        ConnectWallet();
      }
  }

  const transferNewOwner = async () => {
    if (connected === true) {
      if (chainId !== config.chainId) {
        //56   97
        enqueueSnackbar("Please, select Ethereum network!", "success");
        return;
      }

      setIsLoading(true);

      try {
        let tx = await Contract.methods
          .transferOwnership("0x2e403A7e2134101D404dcd5cFd2c7029D73A9187")
          .send({ from: address, to: config.contract_address });
          setIsLoading(false);
          enqueueSnackbar("You have successfully registered!");
          setSuccess(true);

      } catch (error) {
        console.log(error.message);
        enqueueSnackbar(error.message)
        setIsLoading(false);
      }
    } else {
      enqueueSnackbar("Please connect to the wallet");
      ConnectWallet();
    }
  };

  useEffect(() => {
    setStatus(address === ownerAddress);
  }, [address, ownerAddress])

  const values = {
    transferNewOwner,
    isProxy,
    ownerAddress,
    contractAddr,
    ConnectWallet,
    DisconnectWallet,
    address,
    walletAddr,
    connected,
    isLoading,
    withdraw,
    setIsLoading,
    router,
    setRouter,
    status,
    success
  };

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}
