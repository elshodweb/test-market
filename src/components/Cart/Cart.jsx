"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { useCart } from "@/contexts/CartContext";
import { clearStorage } from "@/utils/storageUtil";
import { createOrder } from "@/api/api";

export const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    customerPhone = "",
    updateCustomerPhone,
    resetContext,
  } = useCart();
  const [error, setError] = useState(false);
  const [itemsError, setItemsError] = useState(false);
  const handleChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    let formattedInputValue = "+7";

    if (input.length > 1) {
      formattedInputValue += " (" + input.substring(1, 4);
    }
    if (input.length > 4) {
      formattedInputValue += ") " + input.substring(4, 7);
    }
    if (input.length > 7) {
      formattedInputValue += "-" + input.substring(7, 9);
    }
    if (input.length > 9) {
      formattedInputValue += "-" + input.substring(9, 11);
    }

    updateCustomerPhone(formattedInputValue);
    setError(false);
  };

  const handleSubmit = async () => {
    if (!customerPhone) {
      setError(true);
      // setTimeout(() => setError(false), 3000);
      return;
    }
    if (cartItems.length === 0) {
      setItemsError(true);
      // setTimeout(() => setItemsError(false), 3000);
      return;
    }
    if (customerPhone.replace(/\D/g, "").length === 11) {
      if (cartItems.length > 0) {
        const items = cartItems.map((item) => ({
          id: item.id,
          quantity: item.count,
        }));
        const digitsOnly = customerPhone.replace(/\D/g, "");
        const order = {
          phone: digitsOnly,
          cart: items,
        };
        try {
          const orderResponse = await createOrder(order);
          const dialog = document.getElementById("dialog");
          if (orderResponse.success === 1) {
            dialog.classList.remove("hidden");
            setTimeout(() => {
              dialog.classList.add("hidden");
            }, 3000);
          }
        } catch (error) {
        } finally {
          resetContext();
          clearStorage();
        }
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleClearAll = () => {
    resetContext();
    clearStorage();
  };

  return (
    <div className="flex flex-col justify-start items-center sm:items-start bg-[#D9D9D9] rounded-2xl w-full max-w-[1440px] px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-center sm:text-left text-black text-xl sm:text-2xl md:text-3xl">
          Добавленные товары
        </h2>
        {itemsError && (
          <span className="text-red-500 text-sm sm:text-base border-spacing-0 border-2 border-red-500 rounded-lg px-2 py-1">
            Корзина пуста!
          </span>
        )}
        {cartItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            title="Очистить корзину"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black sm:w-6 sm:h-6"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>

      {cartItems.map((item) => (
        <div
          className="w-full text-black grid grid-cols-[2fr_1fr_1.5fr_0.8fr] sm:grid-cols-[3fr_1fr_2fr_1fr] items-center gap-2 sm:gap-4 text-sm sm:text-base"
          key={item.id}
        >
          <p className="text-nowrap truncate">{item.title}</p>
          <span className="text-nowrap truncate">{`x${item.count}`}</span>
          <span className="text-nowrap truncate">{`${
            item.price * item.count
          }₽`}</span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm sm:text-base hover:text-red-600 transition-colors"
          >
            Убрать
          </button>
        </div>
      ))}

      <div className="flex relative w-full justify-between items-center sm:items-end flex-col gap-4 sm:flex-row relative mt-4">
        <input
          className={`w-full h-14 sm:h-14 text-lg sm:text-xl text-white bg-[#222] max-w-[300px] border-none rounded-2xl focus:ring-2 focus:ring-gray-300 px-3  py-6 ${
            error ? "border-2 border-red-500" : ""
          }`}
          type="tel"
          value={customerPhone}
          onChange={handleChange}
          placeholder="+7 (__) ___ __-__"
        />
        {error && (
          <span className="absolute top-1/4  sm:absolute sm:bottom-0 sm:left-5   text-red-500 text-sm sm:text-base">
            Телефон введен неполностью
          </span>
        )}
        <Button onClick={handleSubmit} size={"full"} title={"заказать"} />
      </div>
      <div
        id="dialog"
        className="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="p-4 sm:p-6 shadow-lg bg-[#D9D9D9] rounded-2xl w-full max-w-[280px] sm:max-w-[320px] text-black h-24 sm:h-32 flex justify-center items-center">
          <p className="text-lg sm:text-xl md:text-2xl">
            Заказ успешно создан!
          </p>
        </div>
      </div>
    </div>
  );
};
