import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email, code, newPassword } = await req.json();

    // Ensure required environment variables exist
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Cognito Client ID or Client Secret is missing.");
    }

    // Generate the secret hash
    const secretHash = generateSecretHash(email, clientId, clientSecret);

    // Prepare parameters for password reset confirmation
    const params = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash, // Include the secret hash
    };

    // Execute the Cognito command
    const command = new ConfirmForgotPasswordCommand(params);
    await client.send(command);

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
