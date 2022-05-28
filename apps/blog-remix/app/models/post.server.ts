import { prisma } from "~/libs/prisma.server";

export type { Post } from "~/generated";

export function getPosts() {
    return prisma.post.findMany();
}

export function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}

export function createPost(post: {
    title: string;
    slug: string;
    markdown: string;
}) {
    return prisma.post.create({ data: post });
}

export function updatePost(post: {
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

export function deletePost(post: {
    slug: string;
}) {
    return prisma.post.delete({
        where: {
            slug: post.slug
        }
    });
}