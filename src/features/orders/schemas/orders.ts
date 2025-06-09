import { z } from "zod";

const MIN_ADDRESS_LENGTH = 10;
const MAX_ADDRESS_LENGTH = 255;
const PHONE_LENGTH = 10;
const PHONE_REGEX = /^((20)[0-9]{8})$/;

const ERROR_MESSAGE = {
  address: {
    min: `ທີ່ຢູ່ຕ້ອງມີຄວາມຍາວຢ່າງນ້ອຍ ${MIN_ADDRESS_LENGTH} ຕົວອັກສອນ`,
    max: `ທີ່ຢູ່ຕ້ອງບໍ່ເກີນ ${MAX_ADDRESS_LENGTH} ຕົວອັກສອນ`,
  },
  phone: {
    length: `ເບີໂທຕ້ອງມີ ${PHONE_LENGTH} ຕົວເລກ`,
    regex: "ເບີໂທບໍ່ຖືກຕ້ອງ",
  },
};

export const checkoutSchema = z.object({
  address: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.min })
    .max(MAX_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.max }),

  phone: z
    .string()
    .min(PHONE_LENGTH, { message: ERROR_MESSAGE.phone.length })
    .max(PHONE_LENGTH, { message: ERROR_MESSAGE.phone.length })
    .regex(PHONE_REGEX, { message: ERROR_MESSAGE.phone.regex }),

  note: z.string().optional(),
});
