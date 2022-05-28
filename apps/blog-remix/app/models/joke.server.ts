import { prisma } from "~/libs/prisma.server";

export type { Joke } from "~/generated";

export async function getJokes() {
    return prisma.joke.findMany();
}
