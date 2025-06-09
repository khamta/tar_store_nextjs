"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { CategoryType } from "@/types/category";
import { Save } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { productAction } from "../actions/products";
import ErrorMessage from "@/components/shared/error-message";
import ProductImageUpload from "./product-image-upload";
import { ProductType } from "@/types/product";

interface ProductFormProps {
  categories: CategoryType[];
  product?: ProductType | null;
}

const ProductForm = ({ categories, product }: ProductFormProps) => {
  // Price State
  const [basePrice, setBasePrice] = useState(product ? product.basePrice.toString() : "");
  const [salePrice, setSalePrice] = useState(product ? product.price.toString() : "");

  // Image State
  const [productImages, setProductImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  const { errors, formAction, isPending, clearErrors } = useForm(
    productAction,
    "/admin/products"
  );

  const calculateDiscount = () => {
    const basePriceNum = parseFloat(basePrice) || 0;
    const salePriceNum = parseFloat(salePrice) || 0;

    if (basePriceNum === 0 || salePriceNum === 0) return "0%";
    if (basePriceNum <= salePriceNum) return "0%";

    const discount = ((basePriceNum - salePriceNum) / basePriceNum) * 100;

    return `${discount.toFixed(2)}%`;
  };

  const handleImageChange = (
    images: File[],
    mainIndex: number,
    deletedIds: string[] = []
  ) => {
    setProductImages(images);
    setMainImageIndex(mainIndex);
    setDeleteImageIds(deletedIds);
  };

  const handleSubmit = async (formData: FormData) => {
    if (product) {
      formData.append("product-id", product.id);
    }

    if (productImages.length > 0) {
      productImages.forEach((file) => {
        formData.append("images", file);
      });
    }
    formData.append("main-image-index", mainImageIndex.toString());

    if (deleteImageIds.length > 0) {
      formData.append("deleted-image-ids", JSON.stringify(deleteImageIds));
    }

    return formAction(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">ຂໍ້ມູນສິນຄ້າ</CardTitle>
        <CardDescription>ປ້ອນລາຍລະອຽດຂອງສິນຄ້າໃໝ່...</CardDescription>
      </CardHeader>
      <Form
        action={handleSubmit}
        onChange={clearErrors}
        className="flex flex-col gap-4"
      >
        <CardContent className="flex flex-col gap-6">
          {/* Basic information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ຂໍ້ມູນພື້ນຖານ</h3>

            {/* Product Title */}
            <div className="flex flex-col gap-2">
              <InputForm
                label="ຊື່ສິນຄ້າ"
                id="title"
                placeholder="ປ້ອນຊື່ສິນຄ້າ....."
                required
                defaultValue={product?.title}
              />
              {/* Error message */}
              {errors.title && <ErrorMessage error={errors.title[0]} />}
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                ຄຳອະທິບາຍ <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="ປ້ອນຄຳອະທິບາຍກ່ຽວກັບສິນຄ້າ......"
                className="min-h-20"
                defaultValue={product?.description}
              />
              {/* Error message */}
              {errors.description && (
                <ErrorMessage error={errors.description[0]} />
              )}
            </div>

            {/* Category Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-id">
                ໝວດໝູ່ <span className="text-red-500">*</span>
              </Label>
              <Select name="category-id" defaultValue={product?.categoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.status === "Active")
                    .map((c, index) => (
                      <SelectItem key={index} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Error Message */}
              {errors.categoryId && (
                <ErrorMessage error={errors.categoryId[0]} />
              )}
            </div>
          </div>

          {/* Product image section */}
          <ProductImageUpload
            onImageChange={handleImageChange}
            existingImages={product?.images}
          />

          {/* Pricing information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ຂໍ້ມູນລາຄາສິນຄ້າ</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cost */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="ຕົ້ນທຶນ"
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={product?.cost}
                />
                {/* Error Message */}
                {errors.cost && <ErrorMessage error={errors.cost[0]} />}
              </div>
              {/* Base Price */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="ລາຄາປົກກະຕິ"
                  id="base-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={product?.basePrice || basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                />
                {/* Error Message */}
                {errors.basePrice && (
                  <ErrorMessage error={errors.basePrice[0]} />
                )}
              </div>
              {/* Sale Price */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="ລາຄາຂາຍແທ້"
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={product?.price || basePrice}
                  onChange={(event) => setSalePrice(event.target.value)}
                />
                {/* Error Message */}
                {errors.price && <ErrorMessage error={errors.price[0]} />}
              </div>
              {/* Discount */}
              <div className="flex flex-col gap-2">
                <Label>ສ່ວນຫລຸດ</Label>
                <div className="h-9 px-3 rounded-md border border-input bg-gray-50 flex items-center">
                  {calculateDiscount()}
                </div>
              </div>
            </div>
          </div>

          {/* Stock information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ຂໍ້ມູນສະຕັອກ</h3>
            {/* Stock */}
            <div className="flex flex-col gap-2">
              <InputForm
                label="ຈຳນວນສະຕັອກ"
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                required
                defaultValue={product?.stock}
              />
              {/* Error Message */}
              {errors.stock && <ErrorMessage error={errors.stock[0]} />}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitBtn
            name={product ? "ແກ້ໄຂ" : "ບັນທຶກ"}
            icon={Save}
            className="w-full"
            pending={isPending}
          />
        </CardFooter>
      </Form>
    </Card>
  );
};

export default ProductForm;
