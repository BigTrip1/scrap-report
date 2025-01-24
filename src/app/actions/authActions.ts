"use server";

import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ActionResult } from "@/types";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";

import { IUser } from "@/types";
// import { generateToken } from '@/lib/tokens'
import { isJcbEmail, stringifyForComponent } from "@/lib/helper_functions";
import { generateToken } from "@/lib/token";
// import { sendVerificationEmail } from '@/lib/mail'
import connectDB from "@/lib/db";

// import { sendVerificationEmail } from '@/lib/mail'

export const signInUser = async (
  data: LoginSchema
): Promise<ActionResult<string>> => {
  try {
    await connectDB();
    const existingUser = await User.findOne({ email: data.email });

    if (!existingUser) return { status: "error", error: "Invalid credentials" };

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return {
      status: "success",
      data: "Logged in",
    };
  } catch (error) {
    // console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
};

export const signOutUser = async () => {
  await connectDB();
  // let loggedInUser = await getLoggedInUser()

  // if (loggedInUser) {
  //   socket.emit('logout', loggedInUser._id)
  // }

  await signOut({ redirectTo: "/" });
};

export const registerUser = async (
  data: RegisterSchema
): Promise<ActionResult<IUser>> => {
  try {
    await connectDB();
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { name, email, password } = validated.data;

    if (!isJcbEmail(email))
      return { status: "error", error: "Must be a JCB email address" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) return { status: "error", error: "Email already in use" };

    const token = generateToken(1);

    const user = await (
      await User.create({
        name,
        email,
        password: hashedPassword,
        varificationToken: token.string,
        varificationTokenExpires: token.expires,
      })
    ).toObject();

    return {
      status: "success",
      data: user as unknown as IUser,
    };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  await connectDB();
  const foundUser = await User.findOne({ email }).lean();
  if (!foundUser) return null;
  return foundUser as unknown as IUser;
};

export const getLoggedInUser = async (): Promise<IUser | null> => {
  await connectDB();
  const session = await auth();

  if (!session?.user?.id) return null;

  const foundUser = await User.findById(session.user.id).lean();
  if (!foundUser) return null;

  return foundUser as unknown as IUser;
};

export const verifyEmail = async (
  token: string
): Promise<ActionResult<string>> => {
  try {
    await connectDB();
    const foundUser = await User.findOne({ varificationToken: token });

    if (!foundUser) return { status: "error", error: "Invalid token" };

    const hasExpired = new Date() > foundUser.varificationTokenExpires;

    if (hasExpired) return { status: "error", error: "Token has expired" };

    await User.findByIdAndUpdate(foundUser._id, {
      emailVerified: true,
      emailVerifiedAt: Date.now(),
      varificationToken: null,
      varificationTokenExpires: null,
    });

    return { status: "success", data: "Success" };
  } catch (error) {
    console.log(error);
    throw error;
    // return { status: 'error', error: 'Something went wrong' }
  }
};
