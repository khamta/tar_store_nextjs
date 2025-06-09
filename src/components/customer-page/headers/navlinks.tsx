import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import Link from "next/link"

const NAV_LINKS = [
    { title: 'ໜ້າຫຼັກ', href: '/' },
    { title: 'ສິນຄ້າທັງໝົດ', href: '/products' },
    { title: 'ກ່ຽວກັບ', href: '/about' },
    { title: 'ຕິດຕໍ່ພວກເຮົາ', href: '/contact' },
]

export const MobileNavLinks = () => (
    <div className="flex flex-col gap-2">
        {NAV_LINKS.map((link, index) => (
            <SheetClose key={index} asChild>
                <Button variant={'secondary'} size={'lg'} asChild>
                    <Link href={link.href}> {link.title} </Link>
                </Button>
            </SheetClose>
        ))}
    </div>
)

export const DesktopNavLinks = () => (
    <div className="flex items-center gap-1">
        {NAV_LINKS.map((link, index) => (
            <Button key={index} variant={'ghost'} size={'sm'} asChild>
                <Link href={link.href}>{link.title}</Link>
            </Button>
        ))}
    </div>
)