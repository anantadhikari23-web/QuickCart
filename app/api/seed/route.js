import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import { products } from "@/assets/productData";

export async function GET() {
    try {
        await connectDB();

        await Product.deleteMany();

        const formattedProducts = products.map((item) => ({
            productId: item.id,
            name: item.name,
            description: item.description,
            rating: item.rating,
            price: Number(
                item.price.replace("₹", "").replace(/,/g, "")
            ),
            image: item.imgSrc.src,
        }));

        await Product.insertMany(formattedProducts);

        return NextResponse.json({
            success: true,
            count: formattedProducts.length,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
        });
    }
}