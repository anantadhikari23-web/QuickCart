// src/inngest/client.ts
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

export const inngest = new Inngest({ id: "quickcart-next" });

// Create User
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            console.log("User Created Event:", event.data);

            const {
                email_addresses,
                first_name,
                last_name,
                id,
                image_url,
            } = event.data;

            const userData = {
                _id: id,
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                email: email_addresses[0].email_address,
                imageUrl: image_url,
            };

            await connectDB();
            await User.create(userData);

            console.log("User saved to MongoDB:", userData);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
);

// Update User
export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        try {
            console.log("User Updated Event:", event.data);

            const {
                email_addresses,
                first_name,
                last_name,
                id,
                image_url,
            } = event.data;

            const userData = {
                _id: id,
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                email: email_addresses[0].email_address,
                imageUrl: image_url,
            };

            await connectDB();
            await User.findByIdAndUpdate(id, userData);

            console.log("User updated in MongoDB:", userData);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
);

// Delete User
export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-from-clerk",
    },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            const { id } = event.data;

            await connectDB();
            await User.findByIdAndDelete(id);

            console.log("User deleted from MongoDB:", id);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
);