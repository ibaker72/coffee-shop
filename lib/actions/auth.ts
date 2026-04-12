"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";

interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export async function signUp(
  input: SignUpInput
): Promise<ActionResult<{ email: string }>> {
  const email = input.email.toLowerCase().trim();
  const name = input.name.trim();

  if (!email || !name || !input.password) {
    return { success: false, error: "All fields are required." };
  }

  if (input.password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return { success: true, data: { email } };
}
