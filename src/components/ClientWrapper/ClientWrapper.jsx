"use client";
import React from "react";
import {CartProvider} from "@/contexts/CartContext";


const ClientWrapper = ({ children }) => {
    return (
        <CartProvider>
                {children}
        </CartProvider>
    );
};

export default ClientWrapper;
