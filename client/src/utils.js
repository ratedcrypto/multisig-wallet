import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Wallet from './contracts/Wallet.json';

// old way of connecting to Metamask
// const getWeb3 = () => {
//   return new Promise((resolve, reject) => {
//     // Wait for loading completion to avoid race conditions with web3 injection timing.
//     window.addEventListener('load', async () => {
//       // Modern dapp browsers...
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum);
//         try {
//           // Request account access if needed
//           await window.ethereum.enable();
//           // Acccounts now exposed
//           resolve(web3);
//         } catch (error) {
//           reject(error);
//         }
//       }
//       // Legacy dapp browsers...
//       else if (window.web3) {
//         // Use Mist/MetaMask's provider.
//         const web3 = window.web3;
//         console.log('Injected web3 detected.');
//         resolve(web3);
//       }
//       // Fallback to localhost; use dev console port by default...
//       else {
//         const provider = new Web3.providers.HttpProvider(
//           'http://localhost:9545'
//         );
//         const web3 = new Web3(provider);
//         console.log('No web3 instance injected, using Local web3.');
//         resolve(web3);
//       }
//     });
//   });
// };

const getWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      try {
        const web3 = new Web3(window.ethereum);
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    reject('Install Metamask');
  });
};

const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = Wallet.networks[networkId];
  return new web3.eth.Contract(
    Wallet.abi,
    contractDeployment && contractDeployment.address
  );
};

export { getWeb3, getWallet };
