import crypto from "crypto";

// ⚠️ Store this key securely (e.g., in an environment variable or key vault)
const key = Buffer.from("1234567890abcdef1234567890abcdef", "utf8"); 
const algorithm = "aes-256-gcm";

function encrypt(text) {
  const iv = crypto.randomBytes(12); // GCM recommends 12-byte IVs
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return base64-encoded combined string
  return (
    iv.toString("base64") +
    ":" +
    authTag.toString("base64") +
    ":" +
    encrypted.toString("base64")
  );
}

function decrypt(encryptedData) {
    const key = Buffer.from("1234567890abcdef1234567890abcdef", "utf8"); 
    const algorithm = "aes-256-gcm";

  const [ivB64, tagB64, dataB64] = encryptedData.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encryptedText = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// ✅ Example usage
const secretMessage = "MySuperSecretPassword123!";
const encrypted = encrypt(secretMessage);
console.log("Encrypted:", encrypted);

const decrypted = decrypt(encrypted);
console.log("Decrypted:", decrypted);
