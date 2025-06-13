"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import {
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteProductModal from "./delete-product-modal";
import { useEffect, useState } from "react";
import RestoreProductModal from "./restore-product-modal";
import ProductDetailModal from "./product-detail-modal";
import Pagination from "../../../components/shared/pagination";
import SearchInput from "@/components/shared/search-input";

interface ProductListProps {
  products: ProductType[];
  totalCount: number;
  page: number;
  limit: number;
}

const ProductList = ({
  products,
  totalCount,
  page,
  limit,
}: ProductListProps) => {

  const [activeTab, setActiveTab] = useState("all");
  const [filteredProducts, setFillteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  useEffect(() => {
    let result = [...products];
    if (activeTab === "active") {
      result = result.filter((p) => p.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((p) => p.status === "Inactive");
    } else if (activeTab === "low-stock") {
      result = result.filter((p) => p.stock <= p.lowStock);
    }

    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFillteredProducts(result);
  }, [products, activeTab, searchTerm]);

  const hadleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModal(true);
  };

  const handleRestoreClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsRestoreModal(true);
  };

  const handleDetailClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDetailModal(true);
  };

   

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">ສິນຄ້າ</CardTitle>
            <Button asChild>
              <Link href={"/admin/products/new"}>
                <Plus size={16} />
                <span>ເພີ່ມສິນຄ້າໃໝ່</span>
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={hadleTabChange}>
            <TabsList className="grid grid-cols-4 my-4">
              <TabsTrigger value="all">ທັງໝົດ</TabsTrigger>
              <TabsTrigger value="active">ໃຊ້ງານຢູ່</TabsTrigger>
              <TabsTrigger value="inactive">ຖືກລົບແລ້ວ</TabsTrigger>
              <TabsTrigger value="low-stock">ໃກ້ໝົດສະຕັອກ</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant={"outline"} className="sm:px-3 py-1">
                  <span className="font-semibold text-blue-600">
                    {" "}
                    {products.length}{" "}
                  </span>{" "}
                  ທັງໝົດ
                </Badge>
                <Badge variant={"outline"} className="sm:px-3 py-1">
                  <span className="font-semibold text-green-600">
                    {" "}
                    {products.filter((p) => p.status === "Active").length}{" "}
                  </span>{" "}
                  ໃຊ້ງານຢູ່
                </Badge>
                <Badge variant={"outline"} className="sm:px-3 py-1">
                  <span className="font-semibold text-gray-600">
                    {products.filter((p) => p.status === "Inactive").length}
                  </span>{" "}
                  ຖືກລົບແລ້ວ
                </Badge>
                <Badge variant={"outline"} className="sm:px-3 py-1">
                  <span className="font-semibold text-amber-600">
                    {" "}
                    {products.filter((p) => p.stock <= p.lowStock).length}{" "}
                  </span>{" "}
                  ໃກ້ໝົດສະຕັອກ
                </Badge>
              </div>
              <div className="relative w-full lg:w-64">
                <Search
                  size={16}
                  className="absolute left-2 top-2.5 text-muted-foreground"
                />
                <SearchInput
                  placeholder="ຄົ້ນຫາສິນຄ້າ....."
                  onChange={(event) => handleSearch(event)}
                />
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ຮູບພາບ</TableHead>
                <TableHead>ຊື່ສິນຄ້າ</TableHead>
                <TableHead>ໝວດໝູ່</TableHead>
                <TableHead>ລາຄາ</TableHead>
                <TableHead>ສະຕັອກ</TableHead>
                <TableHead>ສະຖານະ</TableHead>
                <TableHead className="text-right">ອັອບຊັ່ນ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TableRow key={index} className="cursor-pointer">
                    <TableCell onClick={() => handleDetailClick(product)}>
                      <Image
                        alt={product.title}
                        src={
                          product.mainImage?.url ||
                          "/images/no-product-image.png"
                        }
                        width={40}
                        height={40}
                        className="object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell onClick={() => handleDetailClick(product)}>
                      <div className="font-medium"> {product.title} </div>
                      <div className="text-xs text-muted-foreground">
                        {product.sku || "ບໍ່ມີ sku"}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleDetailClick(product)}>
                      <div className="text-sm"> {product.category.name} </div>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={() => handleDetailClick(product)}
                    >
                      <div className="text-sm font-medium">
                        {product.price.toLocaleString("th-TH")}
                      </div>
                      {product.basePrice !== product.price && (
                        <div className="text-xs line-through text-muted-foreground">
                          {product.basePrice.toLocaleString("th-TH")}
                        </div>
                      )}
                    </TableCell>
                    <TableCell onClick={() => handleDetailClick(product)}>
                      <div
                        className={cn("text-sm", {
                          "text-amber-500": product.stock <= product.lowStock,
                        })}
                      >
                        {product.stock}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleDetailClick(product)}>
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {" "}
                        {product.status === "Active"
                          ? "ກຳລັງໃຊ້ງານ"
                          : "ສິນຄ້ານີ້ຖືກລົບແລ້ວ"}{" "}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="size-8"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Pencil size={15} />
                              <span>ແກ້ໄຂ</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {product.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 size={15} className="text-destructive" />
                              <span className="text-destructive">ລົບ</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleRestoreClick(product)}
                            >
                              <RefreshCcw
                                size={15}
                                className="text-orange-500"
                              />
                              <span className="text-orange-500">ກູ້ຄືນ</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-40 text-muted-foreground"
                  >
                    ບໍ່ພົບສິນຄ້າ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
         <Pagination totalCount={totalCount} page={page} limit={limit} path={'/admin/products'} />
        </CardContent>
      </Card>

      <DeleteProductModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        product={selectedProduct}
      />

      <RestoreProductModal
        open={isRestoreModal}
        onOpenChange={setIsRestoreModal}
        product={selectedProduct}
      />

      <ProductDetailModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductList;
