import bcrypt from "bcryptjs";

const usersByEmail = new Map();

export async function createUser({ name, email, password }) {
  const cleanEmail = email.toLowerCase().trim();

  if (usersByEmail.has(cleanEmail)) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: cleanEmail,
    passwordHash,
  };

  usersByEmail.set(cleanEmail, user);

  return { id: user.id, name: user.name, email: user.email };
}

export async function verifyUser(email, password) {
  const cleanEmail = email.toLowerCase().trim();
  const user = usersByEmail.get(cleanEmail);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return { id: user.id, name: user.name, email: user.email };
}