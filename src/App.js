import './App.css';
import WalletConnect from "@walletconnect/client";
import Web3Modal from "web3modal";
import {ethers, Wallet, BigNumber} from "ethers";
import React, { useState, useEffect } from "react";
import Card from "./components/card";

 const providerOptions = {
    metamask: {
        options: {
            appName: "RSVPool",
            infuraId: {80001: "https://polygon-mumbai.g.alchemy.com/v2/DUYdoPXnuC7G4bDs9yaX1aUsqldIhjg0"},
        }
    }
 }

const contractABI = require("./utils/EventManager.json");
//const YOUR_CONTRACT_ADDRESS = "0xc96d8111e4a2C897aF8AC8b5800FEF3C97f1Bfc3";
//const YOUR_CONTRACT_ADDRESS = "0xC3a7d9502F7D25dc7b0064986753166E219404aB";
//const YOUR_CONTRACT_ADDRESS = "0x35db639B07a42432e5d3Cf483Dd63a66745156A1";
//const YOUR_CONTRACT_ADDRESS = "0x59031EbeF14f810c86D2Fb85Bcce30aC7bcfd54B";
//const YOUR_CONTRACT_ADDRESS = "0x9147Db0993c7cD7A445a4C4eb08E54BeA0d6364a";
//const YOUR_CONTRACT_ADDRESS = "0x2e5A94A0393f6A6B64440435b8AF92fb443B294B";
const YOUR_CONTRACT_ADDRESS = "0xe48534279e11f067C1fdf5ceCefcA6e4b2Cf09F2";
const MY_ADDRESS = "0x41Cf3732e81578fEEed1105825A10077cB64871D"
function App() {
     const [web3Provider, setWeb3Provider] = useState(null);
     const [eventCount, setEventCount] = useState(0);

    let getContractWithoutSigner = () => {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        let provider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/DUYdoPXnuC7G4bDs9yaX1aUsqldIhjg0");
        let contract = new ethers.Contract(
            YOUR_CONTRACT_ADDRESS,
            contractABI.abi,
            provider.getSigner(MY_ADDRESS),
        );
        return contract;
    };
    let getContract = () => {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        let contract = new ethers.Contract(
            YOUR_CONTRACT_ADDRESS,
            contractABI.abi,
            signer
        );
        return contract;
    };

    async function rsvpForEvent(eventId) {
        const tx = await getContract().rsvp(eventId, {value: BigNumber.from("100000000000000000")});
        await tx.wait();
        console.log(tx);
    }

    async function createEvent() {
        const tx = await getContract().createEvent(web3Provider.provider.selectedAddress);
        await tx.wait();
        console.log(tx);
    }

    async function attendEvent(eventId) {
        const tx = await getContract().attend(eventId);
        await tx.wait();
        console.log(tx);
    }
    async function connectWallet() {
        try {
            let web3modal = new Web3Modal({
                cacheProvider: false,
                providerOptions,
            });
            const web3ModalInstance = await web3modal.connect();
            const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
            if(web3ModalProvider) {
                setWeb3Provider(web3ModalProvider);
            }
            console.log(web3ModalProvider);
        } catch(error) {
            console.error(error);
        }
    }

    const getEventCards = () => {
        let content = [];
        for(let i = 1; i < eventCount + 1; i++) {
            content.push(<Card eventId = {i}
                               rsvpForEvent = {() => rsvpForEvent(i)}
                               attendEvent = {() => attendEvent(i)}/>);
        }
        return content;
    }

    useEffect(() => {
        getContractWithoutSigner().eventCount().then((res) => {
            const toNumber = res.toNumber();
            console.log(toNumber);
            if(eventCount !== toNumber) {
                setEventCount(toNumber);
            }
        })
    });

    return (
    <div className="App container">
        <nav className="navbar navbar-light bg-light justify-content-between">
            <a className="navbar-brand">RSVPool</a>
                {web3Provider == null ? (
                    //run if null
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={connectWallet}>
                        Connect wallet
                    </button>
                ) : (
                    <div>
                        <p>Connected!</p>
                        <p>Address: {web3Provider.provider.selectedAddress}</p>
                    </div>
                )}
            <button className="btn btn-outline-success my-2 my-sm-0" onClick={createEvent}>
                Create Event
            </button>
        </nav>

            <div>
                {getEventCards()}
            </div>
    </div>
  );
}

export default App;
