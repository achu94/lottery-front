import Web3 from "web3";

const inject = () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
    return new Web3(window.ethereum);
}

export default {
    inject : inject,
}