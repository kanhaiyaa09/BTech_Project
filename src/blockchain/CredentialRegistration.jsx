import React, { useState } from "react";
import { createCredentialHash } from "./hashCredential";
import { registerCredentialOnChain } from "./registry";

const CredentialRegistration = ({ credential }) => {
  const [hash, setHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const register = async () => {
    try {
      setBusy(true);
      setStatus("Creating credential fingerprint...");

      const result = await createCredentialHash(credential);
      setHash(result.hash);

      setStatus("Waiting for MetaMask...");
      const chainResult = await registerCredentialOnChain(result.hash);

      setTxHash(chainResult.transactionHash);
      setStatus("Credential registered successfully.");
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Credential registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <button className="generate" onClick={register} disabled={busy}>
        {busy ? "Registering..." : "Register Credential 🔗"}
      </button>
      {hash && <p style={{ wordBreak: "break-all", fontSize: "11px" }}><strong>SHA-256:</strong> {hash}</p>}
      {txHash && <p style={{ wordBreak: "break-all", fontSize: "11px" }}><strong>Transaction:</strong> {txHash}</p>}
      {status && <p style={{ fontSize: "12px" }}>{status}</p>}
    </div>
  );
};

export default CredentialRegistration;
