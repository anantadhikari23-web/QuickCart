'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCYS || "₹";
    const router = useRouter();

    const { user } = useUser();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // Fetch Products
    const fetchProductData = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();

            console.log("PRODUCTS:", data);

            setProducts(data);

        } catch (error) {
            console.log("PRODUCT FETCH ERROR:", error);
        }
    };

    // Sync User to MongoDB
    const fetchUserData = async () => {
        try {

            console.log("CLERK USER:", user);

            if (!user) return;

            if (user?.publicMetadata?.role === "seller") {
                setIsSeller(true);
            }

            const res = await fetch("/api/user/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.id,
                    name: user.fullName || "User",
                    email: user.primaryEmailAddress?.emailAddress || "",
                    imageUrl: user.imageUrl || "",
                }),
            });

            const data = await res.json();

            console.log("USER SYNC RESPONSE:", data);

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems || {});
            }

        } catch (error) {
            console.log("USER SYNC ERROR:", error);
        }
    };

    // Cart Functions
    const addToCart = (itemId) => {

        let cartData = { ...cartItems };

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
    };

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);
    };

    const getCartCount = () => {
        let totalCount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalCount += cartItems[item];
            }
        }

        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {

            const itemInfo = products.find(
                (product) => product._id === item
            );

            if (itemInfo && cartItems[item] > 0) {
                totalAmount += itemInfo.price * cartItems[item];
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        console.log("USER CHANGED:", user);

        if (user) {
            fetchUserData();
        }
    }, [user]);

    useEffect(() => {
        console.log("CART UPDATED:", cartItems);
    }, [cartItems]);

    const value = {
        user,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};