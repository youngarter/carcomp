"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.AUTH_SECRET || "your-secret-key";

export async function signupFromInvitation(formData: FormData) {
    const token = formData.get("token") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!token || !name || !password) {
        throw new Error("Missing required fields");
    }

    // Verify token
    let decoded: any;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired invitation token");
    }

    const { email, roleId } = decoded;

    // Check if invitation exists and matches
    const invitation = await prisma.invitation.findUnique({
        where: { token },
    });

    if (!invitation || invitation.email !== email) {
        throw new Error("Invitation not found");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already registered");
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            roleId,
        },
    });

    // Delete invitation
    await prisma.invitation.delete({
        where: { id: invitation.id },
    });

    // Log activity
    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "USER_REGISTER",
            details: "completed registration from invitation",
        },
    });

    redirect("/api/auth/signin");
}
