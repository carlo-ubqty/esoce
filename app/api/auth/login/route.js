import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { generateSecretHash } from "@/lib/cognito"; // Import secret hash function

AWS.config.update({ region: process.env.AWS_REGION });

const cognito = new AWS.CognitoIdentityServiceProvider();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const secretHash = generateSecretHash(
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET,
        email
    );

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash, // Include secret hash
      },
    };

    const response = await cognito.initiateAuth(params).promise();

    return NextResponse.json({
      token: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
