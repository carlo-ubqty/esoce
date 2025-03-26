import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/lib/cognito";
import User from "@/models/User";

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Ensure required environment variables exist
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Cognito Client ID or Client Secret is missing.");
    }

    // Generate the secret hash
    const secretHash = generateSecretHash(clientId, clientSecret, email);

    // Create parameters for Cognito sign-up
    const params = {
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
      ],
    };

    // Create and send the SignUpCommand
    const command = new SignUpCommand(params);
    await client.send(command);

    // Save user in MariaDB
    await User.create({ email, name });

    return NextResponse.json({
      message: "User registered successfully. Check email for verification.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
