import { prisma } from "~/libs/prisma.server";

export async function getPosts() {
    return prisma.post.findMany();
}