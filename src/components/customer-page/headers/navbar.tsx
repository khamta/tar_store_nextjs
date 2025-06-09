import { UserType } from "@/types/user";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";
import { DesktopNavLinks } from "./navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktop-user-menu";
import { getCartItemCount } from "@/features/carts/db/carts";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = async ({ user }: NavbarProps) => {
 const itemCount = user ? await getCartItemCount(user.id) : 0;
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />
        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount} />
        ) : (
          <Button size={"sm"} asChild>
            <Link href={"/auth/signin"}>ເຂົ້າສູ່ລະບົບ</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
