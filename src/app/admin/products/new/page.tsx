import { getCategories } from "@/features/categories/db/categories"
import ProductForm from "@/features/products/components/product-form"

const NewProductPage = async () => {
  const categories = await getCategories()
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold">ເພີ່ມສິນຄ້າໃໝ່</h1>
            <p className="text-muted-foreground text-sm">ສ້າງສິນຄ້າໃໝ່</p>
        </div>
        
        <ProductForm categories={categories} />
    </div>
  )
}

export default NewProductPage