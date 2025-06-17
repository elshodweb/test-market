"use client";
import Image from "next/image";
import { FormCounter } from "@/components/FormCounter/FormCounter";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { useCart } from "@/contexts/CartContext";

export const Card = ({ product }) => {
  const { description, id, image_url, price, title } = product;

  const {
    cartItems,
    addToCart,
    removeFromCart,
    customerPhone = "",
    updateCustomerPhone,
    resetContext,
  } = useCart();

  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  // Initialize count from cart items when component mounts
  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    if (cartItem) {
      setCount(cartItem.count);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (count > 0) {
      addToCart(product, count);
    } else {
      removeFromCart(product.id);
    }
  }, [count]);



  return (
    <div className="flex flex-col justify-start items-center bg-[#D9D9D9] rounded-2xl w-full h-full px-3 sm:px-4 py-3 sm:py-4 gap-2 sm:gap-3">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={image_url}
          alt={title}
          fill
          unoptimized={true}
          className="rounded-2xl object-cover"
        />
      </div>
      <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl title text-left w-full">
        {title}
      </h2>
      <p className="w-full text-black text-sm sm:text-base md:text-lg desc">
        {description}
      </p>
      <span className="text-black text-lg sm:text-xl md:text-2xl mt-auto">{`ценa: ${price}₽`}</span>
      {count >= 1 ? (
        <FormCounter
          setCount={setCount}
          count={count}
          increment={increment}
          decrement={decrement}
        />
      ) : (
        <Button onClick={increment} size={"full"} title={"купить"} />
      )}
    </div>
  );
};
