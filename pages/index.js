import Head from "next/head";
import { Web3Provider } from "@ethersproject/providers";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { useViewerConnection } from "@self.id/react"; // easy way to connect and disconect to the ceramic network
import { useViewerRecord } from "@self.id/react";
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
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

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
  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}> Ceramic Demo</span>
        {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ) : (
          <buttton
            onClick={connectToSelfId}
            className={styles.buttton}
            disabled={connection.status === "connecting"}
          >
            Connect
          </buttton>
        )}
      </div>
      <div className={styles.content}>
        <div classname={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span classname={styles.subtitle}>
                Your 3ID is ==: {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : (
            <span className={styles.subtitle}>
              connect to your wallet to access your 3ID
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
function RecordSetter() {
  const [name, setName] = useState("");
  const record = useViewerRecord("basicProfile");
  const updateRecordName = async (name) => {
    await record.merge({
      name: name
    });
  };
  return (
    <div className={styles.content}>
      <div className={styles.mt2}>
        {record.content ? (
          <div className={styles.flexCol}>
            <span className={styles.subtitle}>
              Hello {record.content.name} !
            </span>
            <span>
              The above name was loaded from ceramic network. try updating it
              below
            </span>
          </div>
        ) : (
          <span>
            You do not have the profile record attachted to your 3ID. Create a
            basic profile by setting a profile below.
          </span>
        )}
      </div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.mt2}
      />
      <button className={styles.button} onClick={() => updateRecordName(name)}>
        Update
      </button>
    </div>
  );
}
