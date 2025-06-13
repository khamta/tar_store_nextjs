"use client"; // ถ้าใช้ App Router ต้องใส่

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const ImageSlid = () => {
  const images = [
    "/images/Samsung.webp",
    "/images/Banner.webp",
    "/images/banner.jpg",
  ];

  return (
    <div className="mb-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="rounded-xl shadow-lg overflow-hidden"
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <Image
              src={url}
              alt={`Slide ${index + 1}`}
              className="w-full h-[500px] object-cover"
              width={500}
              height={500}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ImageSlid;
