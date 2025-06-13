"use client";

import ProductCardAll from "@/components/customer-page/products/product-card-all";
import SearchInput from "@/components/shared/search-input";
import { ProductType } from "@/types/product";
import { Sparkle } from "lucide-react";
import { useEffect, useState } from "react";

interface ProudctProps {
  products: ProductType[];
}

const ProductListCustomer = ({ products }: ProudctProps) => {
  const [filteredProducts, setFillteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFillteredProducts(result);
  }, [products, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-2 border border-primary/60 rounded-full">
            <Sparkle size={14} />
            <span>ສິນຄ້າທັງໝົດ</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">ສິນຄ້າທີ່ມີໃນຮ້ານ</h2>
        </div>
        <SearchInput
          placeholder="ຄົ້ນຫາສິນຄ້າ....."
          onChange={(event) => handleSearch(event)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCardAll key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListCustomer;
