import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-primary rounded-md">
      <div className="bg-muted p-6 rounded-full mb-6">
        <ShoppingBag size={64} />
      </div>
      <h2 className="text-xl font-semibold mb-2">ບໍ່ມີສິນຄ້າໃນກະຕ່າ</h2>

      <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
        ທ່ານຍັງບໍ່ໄດ້ເພີ່ມສິນຄ້າລົງໃນກະຕ່າ ເລີ່ມຊັອບປິ່ງເພື່ອຫາສິນຄ້າທີ່ໜ້າສົນໃຈ
      </p>

      <Button asChild>
        <Link href={"/products"}>
          <Search size={16} />
          <span>ຄົ້ນຫາສິນຄ້າ</span>
        </Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
