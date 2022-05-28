import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

import { getRandomJoke, Joke } from '~/models/joke.server';

type LoaderData = { randomJoke: Joke };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = { randomJoke: await getRandomJoke() };
  return json(data);
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}
