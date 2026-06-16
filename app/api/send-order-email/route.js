import nodemailer from "nodemailer";

export async function POST(req) {
    console.log("EMAIL API HIT");

    const {
        orderId,
        amount,
        paymentMethod,
        customerEmail,
        customerPhone,
    } = await req.json();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "harshitrajeev118@gmail.com",

        subject: `🛒 New Order Received - ${orderId}`,

        html: `
            <div style="font-family: Arial, sans-serif; padding:20px">

                <h2>🛒 New Order Received</h2>

                <hr>

                <p><strong>Order ID:</strong> ${orderId}</p>

                <p><strong>Payment Method:</strong> ${paymentMethod}</p>

                <p><strong>Amount:</strong> ₹${amount}</p>

                <p><strong>Customer Email:</strong> ${customerEmail}</p>

                <p><strong>Customer Phone:</strong> ${customerPhone}</p>

                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

                <hr>

                <h3 style="color: green;">
                    Order Received Successfully
                </h3>

            </div>
        `,
    });

    return Response.json({
        success: true,
    });
}