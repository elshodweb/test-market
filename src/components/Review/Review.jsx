"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { Loader } from "../UI/Loader/Loader";

export const Review = ({ reviews }) => {
  const [localReviews, setLocalReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reviews) {
      const sanitizedReviews = reviews.map((review) => ({
        ...review,
        sanitizedText: DOMPurify.sanitize(review.text),
      }));
      setLocalReviews(sanitizedReviews);
    }
  }, [reviews]);

  useEffect(() => {
    if (localReviews.length > 0) {
      setIsLoading(false);
    }
  }, [localReviews]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-[1440px] px-4 sm:px-6 md:px-8">
      {isLoading ? (
        <>
          <div className="flex items-center justify-center bg-[#D9D9D9] rounded-2xl w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
            <Loader />
          </div>
          <div className="flex items-center justify-center bg-[#D9D9D9] rounded-2xl w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
            <Loader />
          </div>
          <div className="flex items-center justify-center bg-[#D9D9D9] rounded-2xl w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
            <Loader />
          </div>
        </>
      ) : (
        localReviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col justify-start mx-auto sm:mx-0 items-start bg-[#D9D9D9] rounded-2xl w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] px-4 sm:px-6 py-4 sm:py-6 gap-3"
          >
            <div
              dangerouslySetInnerHTML={{ __html: review.sanitizedText }}
              className="text-center sm:text-left text-black text-base sm:text-lg md:text-xl lg:text-2xl"
            />
          </div>
        ))
      )}
    </div>
  );
};
