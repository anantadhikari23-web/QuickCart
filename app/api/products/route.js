import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";

export async function GET() {
    try {
        console.log("=== PRODUCTS ROUTE ===");
        console.log(process.env.MONGODB_URI);

        await connectDB();

        const products = await Product.find();

        return NextResponse.json(products);
    } catch (error) {
        console.error("PRODUCTS ERROR:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}