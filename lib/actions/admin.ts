"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET || "your-secret-key";

/**
 * Creates a unique invitation token and logs the activity.
 */
export async function createInvitation(email: string, roleId: string) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token = jwt.sign({ email, roleId, expiresAt: expiresAt.getTime() }, JWT_SECRET);

    const invitation = await prisma.invitation.create({
        data: {
            email,
            roleId,
            token,
            expiresAt,
        },
    });

    // Log activity
    if (session.user.id) {
        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action: "INVITE_USER",
                details: `Invited ${email} with role ${roleId}`,
            },
        });
    }

    revalidatePath("/admin/settings/users");
    return { success: true, token: invitation.token };
}

/**
 * Creates a new role in the system.
 */
export async function createRole(name: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Only Super Admins can create roles");
    }

    const roleName = name.toUpperCase().replace(/\s+/g, "_");

    const role = await prisma.role.create({
        data: {
            name: roleName,
        },
    });

    if (session.user.id) {
        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE_ROLE",
                details: `Created role ${roleName}`,
            },
        });
    }

    revalidatePath("/admin/settings/roles");
    return { success: true, role };
}

/**
 * Updates the permissions for a specific role.
 */
export async function updateRolePermissions(roleId: string, permissionIds: string[]) {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const role = await prisma.role.update({
        where: { id: roleId },
        data: {
            permissions: {
                set: permissionIds.map(id => ({ id })),
            },
        },
    });

    if (session.user.id) {
        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE_PERMISSIONS",
                details: `Updated permissions for role ${role.name}`,
            },
        });
    }

    revalidatePath("/admin/settings/roles");
    return { success: true };
}

/**
 * Seed missing permissions if needed (Utility)
 */
export async function ensurePermissions() {
    const required = [
        "EDIT_CAR",
        "DELETE_CAR",
        "MANAGE_USERS",
        "VIEW_ACTIVITY",
        "MODERATE_COMMENTS",
        "VIEW_CAR_DETAILS"
    ];

    for (const name of required) {
        await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    return { success: true };
}
