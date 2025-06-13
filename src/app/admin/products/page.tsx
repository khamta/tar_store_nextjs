import ProductList from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/db/products";

interface ProductAdminPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ProductAdminPage = async ({ searchParams }: ProductAdminPageProps) => {
  const page = parseInt((await searchParams).page || "1");

  const limit = 5;

  const { products, totalCount } = await getProducts(page, limit);

  return (
    <div className="p-4 sm:p-6 ">
      {/* product header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">ຈັດການສິນຄ້າ</h1>
          <p className="text-muted-foreground text-sm">
            ຈັດການສິນຄ້າ ແລະ ລາຍລະອຽດສິນຄ້າຂອງທ່ານ
          </p>
        </div>
      </div>

      {/* main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4">
        {/* product list */}
        <div className="lg:col-span-3">
          <ProductList
            products={products}
            totalCount={totalCount}
            page={page}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductAdminPage;
