import Web3 from "web3";
import { ACADEMICHAIN_REGISTRY_ABI } from "./registryAbi";

export function getRegistryAddress() {
  return process.env.REACT_APP_ACADEMCHAIN_REGISTRY_ADDRESS || "";
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask is not installed.");

  const web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

  if (!accounts || accounts.length === 0) {
    throw new Error("No wallet account was returned.");
  }

  return { web3, account: accounts[0] };
}

export async function registerCredentialOnChain(credentialHash) {
  const address = getRegistryAddress();

  if (!address) {
    throw new Error("Contract address is not configured. Add REACT_APP_ACADEMCHAIN_REGISTRY_ADDRESS to .env.local.");
  }

  const { web3, account } = await connectWallet();
  const contract = new web3.eth.Contract(ACADEMICHAIN_REGISTRY_ABI, address);

  const receipt = await contract.methods
    .registerCredential(credentialHash)
    .send({ from: account });

  return { transactionHash: receipt.transactionHash, account };
}