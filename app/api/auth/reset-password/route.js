import { CognitoIdentityServiceProvider } from "aws-sdk";
import crypto from "crypto";

const cognito = new CognitoIdentityServiceProvider();

// Function to generate the secret hash
function generateSecretHash(username, clientId, clientSecret) {
  return crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
}

export async function POST(req) {
  try {
    const { email, code, newPassword } = await req.json();

    // Ensure required environment variables exist
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Cognito Client ID or Client Secret is missing.");
    }

    // Generate the Secret Hash
    const secretHash = generateSecretHash(email, clientId, clientSecret);

    const params = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash, // Include the secret hash
    };

    await cognito.confirmForgotPassword(params).promise();

    return Response.json({ message: "Password reset successful." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
