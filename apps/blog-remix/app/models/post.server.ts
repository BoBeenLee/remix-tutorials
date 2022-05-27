import { prisma } from "~/libs/prisma.server";

export type { Post } from "~/generated";

export async function getPosts() {
    return prisma.post.findMany();
}

export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: {
    title: string;
    slug: string;
    markdown: string;
}) {
    return prisma.post.create({ data: post });
}

export async function updatePost(post: {
    title: string;
    slug: string;
    markdown: string;
}) {
    return prisma.post.update({
        data: post,
        where: {
            slug: post.slug
        }
    });
}

export async function deletePost(post: {
    slug: string;
}) {
    return prisma.post.delete({
        where: {
            slug: post.slug
        }
    });
}