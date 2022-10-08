import Head from "next/head";
import { Web3Provider } from "@ethersproject/providers";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { useViewerConnection } from "@self.id/react"; // easy way to connect and disconect to the ceramic network
import Web3Modal from "web3modal";
import { EthereumAuthProvider } from "@self.id/web";
export default function Home() {
  const [connection, connect, disconnect] = useViewerConnection();
  // Getting an helper function to get the provider
  const web3ModalRef = useRef();

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new Web3Provider(provider);
    return wrappedProvider;
  };

  const connectToSelfId = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  };

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address)
  }

  useEffect(() => {
    if (connection.status !== "connected") {
      // We are checking that if the user has not yet been connected to Ceramic, we are going to initialize the web3Modal.
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false
      });
    }
  });
  return;
}
