import { z } from 'zod';

// Define Constants
const MIN_NAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;
const SPECIAL_CHAR = '!@#$%^&*(),.?":{}|<>';

// Define Error Messages
const ERROR_MESSAGE = {
    name: `ຊື່ຕ້ອງມີຄວາມຍາວຢ່າງນ້ອຍ ${MIN_NAME_LENGTH} ຕົວອັກສອນ`,
    email: {
        format: 'ກາລຸນາປ້ອນອີເມລ໌ໃຫ້ຖືກຕ້ອງ',
        domain: 'ອີເມວຕ້ອງເປັນ @gmail.com, @yahoo.com, @hotmail.com',
    },
    password: {
        length: `ລະຫັດຜ່ານຕ້ອງມີຄວາມຍາວຢ່າງນ້ອຍ ${MIN_PASSWORD_LENGTH} ຕົວອັກສອນ`,
        uppercase: 'ລະຫັດຜ່ານຕ້ອງມີຕົວພິມໃຫຍ່ຢ່າງນ້ອຍ 1 ຕົວ A-Z',
        lowercase: 'ລະຫັດຜ່ານຕ້ອງມີຕົວພິມນ້ອຍຢ່າງນ້ອຍ 1 ຕົວ a-z',
        number: 'ລະຫັດຜ່ານຕ້ອງມີເລກ 0-9 ຢ່າງນ້ອຍ 1 ຕົວ',
        specialChar: `ລະຫັດຜ່ານຕ້ອງມີສັນຍາຫລັກເພີ່ມເຂົ້າ ${SPECIAL_CHAR} ຢ່າງນ້ອຍ 1 ຕົວ`,
    },
    confirmPassword: 'ລະຫັດຜ່ານບໍ່ຕົງກັນ',
}

// Define valid schema
const VALID_EMAIL = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
]

// Check Email
const isValidEmailDomain = (email: string) => {
    const domain = email ? email.split('@')[1] : '';
    return VALID_EMAIL.includes(domain);
}

// Password Schema
const passwordSchema = z.string()
    .min(MIN_PASSWORD_LENGTH, { message: ERROR_MESSAGE.password.length })
    .regex(/[A-Z]/, { message: ERROR_MESSAGE.password.uppercase })
    .regex(/[a-z]/, { message: ERROR_MESSAGE.password.lowercase })
    .regex(/[0-9]/, { message: ERROR_MESSAGE.password.number })
    .regex(
        new RegExp(`[${SPECIAL_CHAR}]`),
        { message: ERROR_MESSAGE.password.specialChar }
    );

    // Main Signup Schema
export const signupSchema = z.object({
    name: z.string()
    .optional()
    .refine(
        (name) => !name || name.length >= MIN_NAME_LENGTH,
        { message: ERROR_MESSAGE.name }
    ),
    email: z.string()
    .email({ message: ERROR_MESSAGE.email.format })
    .refine(
        (email) => isValidEmailDomain(email),
        { message: ERROR_MESSAGE.email.domain }
    ),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: ERROR_MESSAGE.confirmPassword,
        path: ['confirmPassword'],
    }
)

// Main Signin Schema
export const signinSchema = z.object({
    email: z.string()
    .email({ message: ERROR_MESSAGE.email.format })
    .refine(
        (email) => isValidEmailDomain(email),
        { message: ERROR_MESSAGE.email.domain }
    ),
    password: passwordSchema,
})

// Main reset password
export const resetPasswordSchema = z.object({
    password: passwordSchema,
})