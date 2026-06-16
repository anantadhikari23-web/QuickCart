import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: String,
        orderId: String,
        amount: Number,
        paymentMethod: String,
        customerPhone: String,
        status: {
            type: String,
            default: "Confirmed",
        },
    },
    { timestamps: true }
);

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default Order;