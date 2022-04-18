import Link from "next/link";
import ConnectMetaMaskButton from "../components/web3/Connect";
import React, { useEffect, useState } from "react";
import web3_conf from "../services/web3";
import lottery from "../services/lottery";

export default function IndexPage() {
  const [contract, SetContract] = useState({});
  const [manger, setManger] = useState();
  const [account, SetAccount] = useState("");
  const [playersCount, setPlayersCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    (async () => {
      web3 = await web3_conf.inject();

      const lotteryContract = await lottery.getContract(web3);
      console.log(lotteryContract);
      window.contract = lotteryContract;
    
      await SetContract(lotteryContract);

      const manager = await contract.methods.manager().call();
      await setManger(manager);

      await web3.eth.getAccounts().then((accArray) => SetAccount(accArray[0]));
      await web3.eth.getBalance(contract.options.address).then( (balance) => setBalance(web3.utils.fromWei(balance, 'ether')) )

      await GetPlayers();
    })();
  }, [SetContract, setPlayersCount, setManger, setBalance]);

  const setWeb3 = async () => {
    return await web3_conf.inject();
  };

  const enterLottaryHandle = () => {
    console.log(web3);
    try {
      contract.methods
        .enter()
        .send({
          from: account,
          gas: "1000000",
          value: web3.utils.toWei("0.012", "ether"),
        })
        .then( () => {
          GetPlayers();
          web3.eth.getBalance(contract.options.address).then( (balance) => setBalance(web3.utils.fromWei(balance, 'ether')) );
        });
    } catch (err) {
      console.log("Enter Player: " + err);
    }
  };

  const GetPlayers = async () => {
    try {
      contract.methods.getPlayers().call().then( (result) => setPlayersCount(result.length) )
    } catch (err) {
      console.log("Enter Player: " + err);
    }
  };

  const pickWinner = () => {
    console.log(web3);
    try {
      contract.methods
        .pickWinner()
        .send({ from: account, gas: "1000000" })
        .then((result) => {
          setPlayersCount(result);
          web3.eth.getBalance(contract.options.address).then( (balance) => setBalance(web3.utils.fromWei(balance, 'ether')) );
        });
    } catch (err) {
      console.log("Enter Player: " + err);
    }
  };

  return (
    <div>
      <ul>
        <li>
          {" "}
          <button onClick={enterLottaryHandle}>Enter</button>{" "}
        </li>
        <li>
          {" "}
          <button onClick={GetPlayers}>Get Players <span></span></button>{" "}
        </li>
        <li>
          {" "}
          <button onClick={pickWinner}>Pick Winner</button>{" "}
        </li>
        <li>Players count:{playersCount > 0 ? playersCount : ` 0`}</li>
        <li>Manager Hash :{manger ? manger : ` undefined`}</li>
        <li>Price to WIN :{balance ? balance : ` 0`}</li>
      </ul>
    </div>
  );
}
