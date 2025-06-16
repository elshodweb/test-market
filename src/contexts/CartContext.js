import { createContext, useContext, useState, useEffect } from 'react';
import {getFromStorage, setInStorage} from "@/utils/storageUtil";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [customerPhone, setCustomerPhone] = useState('');

    useEffect(() => {
        const items = getFromStorage('cartItems');
        if (items) {
            setCartItems(items);
        }
    }, []);

    useEffect(() => {
        const items = getFromStorage('customerPhone');
        if (items) {
            setCustomerPhone(items);
        }
    }, []);

    const addToCart = (item, count) => {
        let newCartItems
        const foundItem = cartItems.find(i => i.id === item.id)
        if (!foundItem) {
            newCartItems = [...cartItems, {...item, count:1}];
        }
        else newCartItems = cartItems.map(i => {
            if (i.id === item.id) {
                return {...i, count}
            }
            return i
        })

        setCartItems(newCartItems);

        setInStorage('cartItems', newCartItems);
    };

    const resetContext = () => {
        setCartItems([])
        setCustomerPhone('')
    }

    const removeFromCart = (id) => {
        const newCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(newCartItems);
        setInStorage('cartItems', newCartItems);
    };

    const updateCustomerPhone = (phone) => {
        setCustomerPhone(phone);
        setInStorage('customerPhone', phone);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        customerPhone,
        updateCustomerPhone,
        resetContext
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
