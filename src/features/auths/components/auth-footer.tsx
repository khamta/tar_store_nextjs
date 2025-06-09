import Link from "next/link";

interface AuthFooterProps {
    type: "signup" | "signin";
}

const authTextMap = {
    signup: {
        footerText: 'ມີບັນຊີຢູ່ແລ້ວ?',
        linkText: 'ເຂົ້າສູ່ບັນຊີ',
        linkHref: '/auth/signin',
    },
    signin: {
        footerText: 'ຍັງບໍ່ມີບັນຊີ? ',
        linkText: 'ສ້າງບັນຊີ',
        linkHref: '/auth/signup',
    }
}

const AuthFooter = ({ type }: AuthFooterProps) => {

    const { footerText, linkText, linkHref } = authTextMap[type];
  return (
    <div className="flex items-center justify-between w-full">
        <p className="text-center text-muted-foreground text-sm my-2">
            {footerText}
            <Link href={linkHref} className="text-primary hover:underline"> {linkText} </Link>
        </p>
        {type === "signin" && (
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          ລືມລະຫັດຜ່ານ?
        </Link>
      )}
    </div>
  )
}

export default AuthFooter