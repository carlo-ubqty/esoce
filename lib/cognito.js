import crypto from "crypto";

export function generateSecretHash(clientId, clientSecret, username) {
  return crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
}
