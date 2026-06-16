import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";

export async function POST(req) {
    try {

        await connectDB();

        const data = await req.json();

        const order = await Order.create(data);

        return NextResponse.json({
            success: true,
            order
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            error: error.message
        });

    }
}