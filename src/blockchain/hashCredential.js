export async function createCredentialHash(credential) {
  const canonicalCredential = JSON.stringify({
    version: 1,
    template: credential.template || "",
    title: credential.title || "",
    learner: credential.learner || "",
    description: credential.description || "",
    issuer: credential.issuer || "",
    logo: credential.logo || ""
  });

  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalCredential)
  );

  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return { hash: "0x" + hex, source: canonicalCredential };
}