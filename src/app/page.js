"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, getReviews } from "@/api/api";
import { Card } from "@/components/Card/Card";
import { Cart } from "@/components/Cart/Cart";
import { Review } from "@/components/Review/Review";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef();
  const sentinelRef = useRef(null);

  const loadProducts = useCallback(async () => {
    if (isLoading || page * 20 > total) return;

    setIsLoading(true);
    const newProducts = await getProducts(page, 20);
    setProducts((prevProducts) => {
      return [
        ...(prevProducts ? prevProducts : []),
        ...(newProducts && newProducts.items && newProducts?.items?.length > 0
          ? newProducts.items
          : []),
      ];
    });
    setTotal(newProducts.total);
    setIsLoading(false);
  }, [isLoading, page, total]);

  useEffect(() => {
    const fetchData = async () => {
      const [productsData, reviewsData] = await Promise.all([
        getProducts(1, 20),
        getReviews(),
      ]);
      setProducts(productsData.items);
      //   console.log("reviewsData:", reviewsData);

      setReviews(reviewsData);
      setTotal(productsData.total);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
    };

    fetchProducts();
  }, [page]);

  useEffect(() => {
    const callback = (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.current.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.current.unobserve(currentSentinel);
      }
    };
  }, [isLoading]);

  //   useEffect(() => {
  //     console.log("products:", products);
  //   }, [products]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-16 sm:gap-24 md:gap-32 px-4 sm:px-6 md:px-8">
      <Review reviews={reviews} />
      <div className="w-full max-w-[1440px] flex flex-col justify-center items-center gap-8 sm:gap-12">
        <Cart />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
          {products &&
            products?.length > 0 &&
            products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
        </div>
        <div ref={sentinelRef} className="h-20" />
      </div>
    </main>
  );
}
