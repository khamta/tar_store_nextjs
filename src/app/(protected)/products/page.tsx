import { getProducts } from "@/features/products/db/products";
import Pagination from "@/components/shared/pagination";
import ProductListCustomer from "@/features/products/components/product-list-customer";

interface ProductAdminPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ProductPage = async ({ searchParams }: ProductAdminPageProps) => {
  const page = parseInt((await searchParams).page || "1");

  const limit = 8;

  const { products, totalCount } = await getProducts(page, limit);
  return (
    <section className="container mx-auto px-4 py-10">
      <ProductListCustomer products={products} />

      <Pagination
        totalCount={totalCount}
        page={page}
        limit={limit}
        path="/products"
      />
    </section>
  );
};

export default ProductPage;
