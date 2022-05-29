import { prisma } from "~/libs/prisma.server";
import bcryptjs from "bcryptjs";
import { getUserSession } from "~/libs/session.server";

export type { User } from "~/generated";

export async function getUser(request: {
    username: string;
    password: string;
}) {
    const { username, password } = request;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        throw new Error("User not found");
    }
    const isPassword = await bcryptjs.compare(password, user.passwordHash);
    if (!isPassword) {
        throw new Error("Invalid password");
    }
    return user;
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
}

export function createUser(request: { username: string, password: string }) {
    const { username, password } = request;
    const passwordHash = bcryptjs.hashSync(password, 10);
    return prisma.user.create({
        data: {
            username, passwordHash
        }
    });
}

export function userExists(username: string) {
    return prisma.user.findFirst({ where: { username } });
}
