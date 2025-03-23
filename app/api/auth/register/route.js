import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { generateSecretHash } from "@/lib/cognito"; // Import secret hash function

AWS.config.update({ region: process.env.AWS_REGION });

const cognito = new AWS.CognitoIdentityServiceProvider();

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    const secretHash = generateSecretHash(
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET,
        email
    );

    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
      ],
    };

    await cognito.signUp(params).promise();

    return NextResponse.json({
      message: "User registered successfully. Check email for verification.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
