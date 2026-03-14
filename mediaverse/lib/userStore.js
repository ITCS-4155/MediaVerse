import bcrypt from "bcryptjs";
import { prisma } from "./prisma.js";

export async function createUser({ name, email, password }) {
  const cleanEmail = email.toLowerCase().trim();

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
      data: {
          name: name.trim(),
          email: cleanEmail,
          password: passwordHash,
      }
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function verifyUser(email, password) {
  const cleanEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return { id: user.id, name: user.name, email: user.email };
}