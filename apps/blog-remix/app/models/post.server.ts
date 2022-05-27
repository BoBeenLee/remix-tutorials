import { prisma } from "~/libs/prisma.server";

export type { Post } from "~/generated";

export async function getPosts() {
    return prisma.post.findMany();
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}