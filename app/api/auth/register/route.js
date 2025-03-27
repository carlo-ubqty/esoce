import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, SignUpCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/lib/cognito";
import Candidate from "@/models/Candidate";
import { sequelize } from "@/lib/db"; // Import Sequelize instance

// Initialize Cognito Client
const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  let cognitoUserCreated = false;

  try {
    const { email, password, userType, firstName, surname, nickName, name, politicalParty, positionSought, province, cityMunicipality, district, region, contactNo, partyList } = await req.json();

    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    if (!clientId || !clientSecret || !userPoolId) {
      throw new Error("Cognito environment variables are missing.");
    }

    // Generate secret hash for Cognito
    const secretHash = generateSecretHash(clientId, clientSecret, email);

    // Sign up user in Cognito
    const signUpParams = {
      ClientId: clientId,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "custom:userType", Value: userType },
      ],
    };

    const signUpCommand = new SignUpCommand(signUpParams);
    await client.send(signUpCommand);
    cognitoUserCreated = true; // Mark user as created in Cognito

    // Start a transaction for MariaDB
    const transaction = await sequelize.transaction();
    try {
      // Save user in MariaDB
      await Candidate.create(
          {
            email,
            firstName,
            surname,
            nickName,
            fullName: `${firstName} ${surname}`.trim(),
            politicalParty,
            positionSought,
            province,
            district,
            region,
            contactNo,
            partyList,
            cityMunicipality,
          },
          { transaction }
      );

      // Commit transaction if everything is successful
      await transaction.commit();

      return NextResponse.json({
        message: "User registered successfully. Check email for verification.",
      });
    } catch (dbError) {
      // Rollback MariaDB transaction
      await transaction.rollback();

      // If MariaDB insert fails, delete the user from Cognito
      if (cognitoUserCreated) {
        await client.send(
            new AdminDeleteUserCommand({
              UserPoolId: userPoolId,
              Username: email,
            })
        );
      }

      throw new Error(`Database Error: ${dbError.message}`);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
