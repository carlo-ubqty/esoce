import { NextResponse } from "next/server";
import UserType from "@/models/UserType"; // Import the UserType model

export async function GET() {
    try {
        // Fetch all user types
        const userTypes = await UserType.findAll({
            attributes: ["user_type_id", "user_type_name"], // Select relevant fields
        });

        return NextResponse.json(userTypes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user types" }, { status: 500 });
    }
}
