import type { LinksFunction } from '@remix-run/node';
import { Outlet, Link, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from 'remix';
import { existUserSession, requireUser, requireUserId } from '~/libs/session.server';
import { Joke, getJokes } from '~/models/joke.server';
import { getUser, getUserById } from '~/models/user.server';

import stylesUrl from '~/styles/jokes.css';

type LoaderData = {
  user?: Awaited<ReturnType<typeof getUser>>;
  jokeListItems: Awaited<ReturnType<typeof getJokes>>;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    jokeListItems: await getJokes(),
    user: await existUserSession(request) ? await requireUser(request) : undefined,
  };
  return json<LoaderData>(data);
};

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data?.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data?.jokeListItems?.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>
                    {'joke-'}
                    {joke.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
