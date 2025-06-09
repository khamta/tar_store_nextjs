import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Sparkle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden ">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground via-muted to-primary/80 opacity-45" />
        <div className="container mx-auto relative px-4 py-16 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* left content */}
                <div className="max-w-xl">
                    <div className="inline-flex border border-primary/60 rounded-full items-center gap-2 px-4 py-1.5 mb-6">
                        <Sparkle size={14} />
                        <span>ຍິນດີຕ້ອນຮັບທຸກເວັບໄຊ໌ Tar Store</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold">ຊັອບສິນຄ້າໄອທີ
                        <span className="block mt-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent md:py-2">
                            ລາຄາຄຸ້ມຄ່າ
                        </span>
                    </h1>
                    <p className="mt-6 text-lg ">
                        ຮ້ານຄ້າອອນໄລນ໌ອັນດັບ 1 ສຳຫຼັບສິນຄ້າໄອທີຄົບວົງຈອນ ພ້ອມບໍລິການຈັດສົ່ງໄວ ແລະ ລາຄາທີ່ຄຸ້ມຄ່າ
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button className="group shadow-lg shadow-primary/20" asChild>
                            <Link href={'/products'}>
                            <ShoppingBag size={20} />
                            <span>ຊັອບເລີຍ</span>
                            <ArrowRight size={16} className="opacity-70 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button variant={'outline'} asChild className="border-primary/30 hover:border-primary/5 transition-colors">
                            <Link href={'/about'}>ກ່ຽວກັບເຮົາ</Link>
                        </Button>
                    </div>
                </div>
                {/* left content */}

                {/* right content */}
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-[400px] lg:size-[500px] rounded-full bg-primary/10" />
                        <div className="absolute size-[320px] lg:size-[400px] rounded-full border-2 border-primary/20"/>
                    </div>

                    <div className="relative z-10 flex items-center">
                        <div className="relative size-[400px]">
                            <Image
                            alt="Tech Gadgets"
                            src={"/images/banner.jpg"}
                            fill
                            className="object-cover rounded-lg scale-110 hover:scale-105 transition-all duration-700 hover:shadow-primary hover:shadow-md"
                            />
                            <div className="absolute -top-5 -right-10 p-3 bg-card rounded-lg shadow-lg border border-border/70 delay-500">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-blue-500" />
                                    <span className="text-xs font-medium">ຮັບປະກັນ 1 ປີ ເຕັມ</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-5 -left-10 p-3 bg-card rounded-lg shadow-lg border border-border/70 delay-500">
                                       <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-green-500" />
                                    <span className="text-xs font-medium">ຫລຸດສູງສຸດ 50%</span>
                                </div></div>
                        </div>
                    </div>
                </div>
                {/* right content */}
            </div>
        </div>
    </div>
  )
}

export default Hero