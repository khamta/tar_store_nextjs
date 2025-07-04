import { z } from "zod"

// Define Constants
const MIN_NAME_LENGTH = 2

// Define Error Message
const ERROR_MESSAGE = {
    name: `ໝວດໝູ່ຕ້ອງມີຕົວອັກສອນຢ່າງນ້ອຍ ${MIN_NAME_LENGTH} ຕົວ`
}

// Main Category Schema
export const categorySchema = z.object({
    name: z.string()
    .min(MIN_NAME_LENGTH, { message: ERROR_MESSAGE.name })
})