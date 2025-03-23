import { NextResponse } from "next/server";
import AWS from "aws-sdk";

AWS.config.update({ region: process.env.AWS_REGION });

const cognito = new AWS.CognitoIdentityServiceProvider();

export async function POST(req) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    const params = { AccessToken: accessToken };
    await cognito.globalSignOut(params).promise();

    return NextResponse.json({ message: "User logged out successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
