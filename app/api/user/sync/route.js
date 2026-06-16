import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/user";

export async function POST(req) {
    try {
        console.log("USER SYNC HIT");

        const body = await req.json();
        console.log("BODY:", body);

        const { id, name, email, imageUrl } = body;

        await connectDB();

        let user = await User.findById(id);

        if (!user) {
            user = await User.create({
                _id: id,
                name,
                email,
                imageUrl,
                cartItems: {},
            });

            console.log("NEW USER CREATED");
        } else {
            console.log("USER ALREADY EXISTS");
        }

        return NextResponse.json({
            success: true,
            user,
        });

    } catch (error) {
        console.log("USER SYNC ERROR:", error);

        return NextResponse.json({
            success: false,
            error: error.message,
        });
    }
}