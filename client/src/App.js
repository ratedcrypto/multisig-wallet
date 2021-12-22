import React, { useState, useEffect } from 'react';
import { getWeb3, getWallet } from './utils';
import Header from './Header';
import ContractDetails from './ContractDetails';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [quorum, setQuorum] = useState(undefined);
  const [approvers, setApprovers] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const wallet = await getWallet(web3);
      const accounts = await web3.eth.getAccounts();
      const quorum = await wallet.methods.quorum().call();
      const approvers = await wallet.methods.getApprovers().call();
      const transfers = await wallet.methods.getTransfers().call();
      setWeb3(web3);
      setWallet(wallet);
      setAccounts(accounts);
      setQuorum(quorum);
      setApprovers(approvers);
      setTransfers(transfers);
    };

    init();
  }, []);

  const createTransfer = async (transfer) => {
    await wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({ from: accounts[0] });
    const transfers = await wallet.methods.getTransfers().call();
    setTransfers(transfers);
  };

  const approveTransfer = async (transferId) => {
    await wallet.methods
      .approveTransfer(transferId)
      .send({ from: accounts[0] });
    const transfers = await wallet.methods.getTransfers().call();
    setTransfers(transfers);
  };

  return (
    <div className="App ">
      {typeof web3 !== 'undefined' &&
      typeof wallet !== 'undefined' &&
      typeof accounts !== 'undefined' &&
      typeof approvers !== 'undefined' &&
      typeof quorum !== 'undefined' ? (
        <>
          <Header></Header>
          <div className="container-fluid">
            <ContractDetails
              approvers={approvers}
              quorum={quorum}
            ></ContractDetails>
            <NewTransfer createTransfer={createTransfer} />
            <TransferList
              transfers={transfers}
              approveTransfer={approveTransfer}
            />
          </div>
        </>
      ) : (
        <div>Loading..</div>
      )}
    </div>
  );
}

export default App;
