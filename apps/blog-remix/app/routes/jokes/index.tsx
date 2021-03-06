import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link, useCatch } from '@remix-run/react';

import { getRandomJoke, Joke } from '~/models/joke.server';

type LoaderData = { randomJoke: Joke };

export const loader: LoaderFunction = async () => {
  const randomJoke = await getRandomJoke();
  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    });
  }
  const data: LoaderData = { randomJoke };
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no jokes to display.
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div className="error-container">I did a whoopsies. {error.message}</div>;
}
