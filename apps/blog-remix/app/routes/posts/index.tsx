import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json, Link, useLoaderData } from 'remix';
import { getPosts } from '~/models/post.server';

import stylesUrl from '~/styles/posts.css';

interface LoaderData {
  posts: Awaited<ReturnType<typeof getPosts>>;
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
