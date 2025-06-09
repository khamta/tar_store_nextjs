import { z } from "zod"

// Define Constants
const MIN_TITLE_LENGTH = 3;
const MIN_DESC_LENGTH = 10;

// Define Error Message
const ERROR_MESSAGE = {
    title: `ຊື່ສິນຄ້າຕ້ອງມີຕົວອັກສອນຢ່າງນ້ອຍ ${MIN_TITLE_LENGTH} ຕົວ`,
    description: `ຄຳອະທິບາຍຕ້ອງມີຢ່າງນ້ອຍ ${MIN_DESC_LENGTH} ຕົວອັກສອນ`,
    categoryId: "ຕ້ອງເລືອກ ໝວດໝູ່ກ່ອນ!!",
    basePrice: "ລາຄາຕ້ອງມີຫລາຍກວ່າ 0 ຂຶ້ນໄປ",
    price: "ລາຄາຕ້ອງມີຫລາຍກວ່າ 0 ຂຶ້ນໄປ",
    stock: "ສະຕັອກຕ້ອງມີຫລາຍກວ່າ 0 ຂຶ້ນໄປ"
}

// Create product schema
export const productSchema = z.object({
    title: z.string().min(MIN_TITLE_LENGTH, { message: ERROR_MESSAGE.title }),
    description: z.string().min(MIN_DESC_LENGTH, { message: ERROR_MESSAGE.description }),
    categoryId: z.string().min(1, { message: ERROR_MESSAGE.categoryId }),
    cost: z.coerce.number().nonnegative().optional(),
    basePrice: z.coerce.number().positive({ message: ERROR_MESSAGE.basePrice }),
    price: z.coerce.number().positive({ message: ERROR_MESSAGE.price }),
    stock: z.coerce.number().positive({ message: ERROR_MESSAGE.stock}),
})
