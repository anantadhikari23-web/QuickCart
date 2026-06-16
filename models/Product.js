import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId: Number,
        name: String,
        description: String,
        rating: Number,
        price: Number,
        image: String,
    },
    { timestamps: true }
);

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);

export default Product;