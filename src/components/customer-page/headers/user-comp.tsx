"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { useSignout } from "@/hooks/use-sign-out";
import { UserType } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCompProps {
  user: UserType;
}

export const AuthButtons = () => {
  return (
    <div className="flex justify-center gap-3">
      <Button asChild size={"lg"}>
        <SheetClose asChild>
          <Link href={"/auth/signup"}>ລົງທະບຽນ</Link>
        </SheetClose>
      </Button>
      <Button asChild variant={"outline"} size={"lg"}>
        <SheetClose asChild>
          <Link href={"/auth/signin"}>ເຂົ້າສູ່ລະບົບ</Link>
        </SheetClose>
      </Button>
    </div>
  );
};

export const SignoutButton = ({ isMobile = false }) => {
  const { isPending, handleSignout } = useSignout();
  if (isMobile) {
    return (
      <SheetClose asChild>
        <Button
          onClick={handleSignout}
          disabled={isPending}
          size={"lg"}
          variant={"outline"}
          className="text-red-500 font-bold"
        >
          ອອກຈາກລະບົບ
        </Button>
      </SheetClose>
    );
  } else {
    return (
      <Button
        onClick={handleSignout}
        disabled={isPending}
        size={"lg"}
        variant={"outline"}
        className="text-red-500 font-bold w-full mt-2 cursor-pointer"
      >
        ອອກຈາກລະບົບ
      </Button>
    );
  }
};

export const UserAvatar = ({ user }: UserCompProps) => (
  <div className="px-4">
    <Card className="border-primary/50">
      <CardContent className="flex flex-col items-center gap-3">
        {/* Picture */}
        <Image
          alt={user.name || "Profile"}
          src={user.picture || "/images/no-user-image.webp"}
          width={128}
          height={128}
          priority
          className="rounded-full border-2 border-primary object-cover"
        />

        {/* Name and Email */}
        <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
      </CardContent>
    </Card>
  </div>
);

export const UserAvatarSmall = ({ user }: UserCompProps) => (
  <Avatar className="border-2 border-primary">
    <AvatarImage src={user.picture || undefined} alt={user.name || "user"} />
    <AvatarFallback className="text-primary-foreground bg-primary font-bold">
      {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

export const UserDropdownAvatar = ({ user }: UserCompProps) => (
  <Avatar className="size-16 border-2 border-primary">
    <AvatarImage src={user.picture || undefined} alt={user.name || "user"}/>
    <AvatarFallback className="text-xl font-bold">
    {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)