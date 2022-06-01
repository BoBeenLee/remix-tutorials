import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useParams,
  useTransition,
} from '@remix-run/react';
import { ActionFunction, MetaFunction, redirect } from 'remix';

import { deleteJoke, getJoke, Joke } from '~/models/joke.server';
import { deletePost } from '~/models/post.server';

type LoaderData = { joke: Joke };

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await getJoke(params.jokeId ?? '');
  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }
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

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{params.jokeId}"?
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry. ${error.message}`}</div>
  );
}
