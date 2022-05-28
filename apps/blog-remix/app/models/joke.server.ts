import { prisma } from "~/libs/prisma.server";

export type { Joke } from "~/generated";

export function getJokes() {
    return prisma.joke.findMany({
        take: 5,
        select: { id: true, name: true },
        orderBy: { createdAt: "desc" },
    });
}


export function getJoke(id: string) {
    return prisma.joke.findUnique({ where: { id } });
}

export function createJoke(request: { name: string, content: string }) {
    return prisma.joke.create({ data: request });
}

export function deleteJoke(id: string) {
    return prisma.joke.delete({ where: { id } });
}

export async function getRandomJoke() {
    const count = await prisma.joke.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    const [randomJoke] = await prisma.joke.findMany({
        take: 1,
        skip: randomRowNumber,
    });
    return randomJoke;
}