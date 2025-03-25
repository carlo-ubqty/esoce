import { CognitoIdentityProviderClient, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Function to generate the secret hash
function generateSecretHash(username, clientId, clientSecret) {
  return crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("Forgot Password Request for:", email); // Log input email

    // Ensure required environment variables exist
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Cognito Client ID or Client Secret is missing.");
      throw new Error("Cognito Client ID or Client Secret is missing.");
    }

    // Generate the Secret Hash
    const secretHash = generateSecretHash(email, clientId, clientSecret);

    // Create Cognito forgot password command
    const command = new ForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
      SecretHash: secretHash, // Include the secret hash
    });

    await client.send(command);

    return Response.json({ message: "Verification code sent to email." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}