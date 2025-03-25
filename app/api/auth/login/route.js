import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/lib/cognito"; // Import secret hash function

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Ensure required environment variables exist
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Cognito Client ID or Client Secret is missing.");
    }

    // Generate the secret hash
    const secretHash = generateSecretHash(clientId, clientSecret, email);

    // Create parameters for Cognito authentication
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash, // Include secret hash
      },
    };

    // Create and send the InitiateAuthCommand
    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);

    return NextResponse.json({
      token: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
