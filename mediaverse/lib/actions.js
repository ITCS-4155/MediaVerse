"use server";

import { createUser, verifyUser } from "./userStore.js";
import { setSession, clearSession } from "./auth.js";
import { redirect } from "next/navigation";

export async function signUpAction(formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const user = await createUser({ name, email, password });
        await setSession(user);
    } catch (e) {
        console.error("THE REAL ERROR:", e);
    }
    redirect("/settings");
}

export async function loginAction(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        return { error: "Please provide both an email and a password." };
    }

    try {
        const user = await verifyUser(email, password);

        if (!user) {
            return { error: "Invalid email or password." };
        }

        await setSession(user);

    } catch (e) {
        console.log("Login Error:", e);
        return { error: "An error occurred during login." };
    }
    redirect("/settings");
}

export async function logoutAction() {
    await clearSession();
    redirect("/login");
}