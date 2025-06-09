import { db } from "@/lib/db";
import { signupSchema, signinSchema, resetPasswordSchema } from "../schemas/auths";
import { hash, genSalt, compare } from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { getUserById } from "@/features/users/db/users";
import { revalidateUserCache } from "@/features/users/db/cache";
import EmailTemplate from "../components/email-template";
import { JWTExpired } from "jose/errors";
import { Resend } from 'resend'

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface signinInput {
  email: string;
  password: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

const generateJwtToken = async (userId: string, exp: string = "30d") => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() // iat: ms
    .setExpirationTime(exp) // exp: ms
    .sign(secret);
};

const setCookieToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = await signupSchema.safeParse(input);
    if (!success) {
      return {
        message: "ບໍ່ສາມາດສະໝັກສະມາຊິກໄດ້",
        error: error.flatten().fieldErrors,
      };
    }
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user) {
      return {
        message: "ອີເມວນີ້ໄດ້ຖືກໃຊ້ແລ້ວ",
      };
    }

    // ເຂົ້າລະຫັດລະຫັດຜ່ານ
    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = await generateJwtToken(newUser.id);
    await setCookieToken(token);

    revalidateUserCache(newUser.id)
  } catch (error) {
    console.error("error signup user", error);
    return {
      message: "ບໍ່ສາມາດສະໝັກສະມາຊິກ",
    };
  }
};

export const signin = async (input: signinInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return {
        message: "ອີເມລ໌ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ",
      };
    }
    if (user.status !== "Active") {
      return {
        message: "ບັນຊີຂອງທ່ານບໍ່ພ້ອມໃຊ້ງານ",
      };
    }

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword) {
      return {
        message: "ອີເມລ໌ ຫລື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ",
      };
    }

    const token = await generateJwtToken(user.id);
    await setCookieToken(token);
  } catch (error) {
    console.error("error signin user", error);
    return {
      message: "ບໍ່ສາມາດເຂົ້າລະບົບ",
    };
  }
};

export const authCheck = async () => {
  const head = await headers();
  const userId = head.get("x-user-id");
  return userId ? await getUserById(userId) : null;
};

export const signout = async () => {
  try {
    (await cookies()).delete('token')
    
  } catch (error) {
    console.error('Error signout user', error)
    return {
      message: 'ເກີດຂໍ້ຜິດພາດໃນການອອກຈາກລະບົບ'
    }
  }
}

export const sendResetPasswordEmail = async (email: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "ບໍ່ພົບບັນຊື່ຜູ້ໃຊ້ນີ້",
      };
    }

    const token = await generateJwtToken(user.id, "15m");

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Tar Store <onboarding@resend.dev>",
      to: email,
      subject: "ຣີເຊັດລະຫັດຜ່ານຂອງທ່ານ",
      react: EmailTemplate({ fname: user.name || user.email, resetLink }),
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return {
      message: "ເກີດຂໍ້ຜິດພາດ",
    };
  }
};

export const resetPassword = async (input: ResetPasswordInput) => {
  try {
    const { success, data, error } = resetPasswordSchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ",
        error: error.flatten().fieldErrors,
      };
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(input.token, secret);

    if (input.password !== input.confirmPassword) {
      return { message: "ລະຫັດຜ່ານບໍ່ຕົງກັນ" };
    }

    const salt = await genSalt(10);
    const hashedPasword = await hash(data.password, salt);

    const updatedUser = await db.user.update({
      where: { id: payload.id as string },
      data: {
        password: hashedPasword,
      },
    });

    revalidateUserCache(updatedUser.id);
  } catch (error) {
    console.log("Error resetting password:", error);

    if (error instanceof JWTExpired) {
      return {
        message: "ຄຳຂໍຂອງທ່ານໝົດອາຍຸແລ້ວ",
      };
    }

    return {
      message: "ເກີດຂໍ້ຜິດພາດໃນການກູ້ຄືນລະຫັດຜ່ານ",
    };
  }
};