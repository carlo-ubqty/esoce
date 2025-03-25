import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    // Create a GlobalSignOutCommand
    const command = new GlobalSignOutCommand({ AccessToken: accessToken });

    // Send the command to Cognito
    await client.send(command);

    return NextResponse.json({ message: "User logged out successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
