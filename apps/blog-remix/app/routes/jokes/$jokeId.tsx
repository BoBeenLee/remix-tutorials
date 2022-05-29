import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
import { ActionFunction, redirect } from 'remix';

import { deleteJoke, getJoke, Joke } from '~/models/joke.server';
import { deletePost } from '~/models/post.server';

type LoaderData = { joke: Joke };

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await getJoke(params.jokeId ?? '');
  if (!joke) throw new Error('Joke not found');
  const data: LoaderData = { joke };
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method === 'DELETE') {
    await deleteJoke(params.jokeId ?? '');
    return redirect('/jokes');
  }
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
      <Form method="delete">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Deleting...' : 'Delete Post'}
        </button>
      </Form>
    </div>
  );
}
