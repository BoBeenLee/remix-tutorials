import { redirect, ActionFunction, json } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { marked } from 'marked';
import { LoaderFunction } from 'remix';
import invariant from 'tiny-invariant';
import { updatePost, getPost } from '~/models/post.server';

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

interface LoaderData {
  post: Awaited<ReturnType<typeof getPost>>;
  html: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  const errors: ActionData = {
    title: title ? null : 'Title is required',
    slug: slug ? null : 'Slug is required',
    markdown: markdown ? null : 'Markdown is required',
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await updatePost({
    title: title?.toString?.() ?? '',
    slug: slug?.toString?.() ?? '',
    markdown: markdown?.toString?.() ?? '',
  });

  return redirect('/posts/admin');
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug ?? '');
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function EditPost() {
  const errors = useActionData<ActionData>();
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);
  const { post, html } = useLoaderData<LoaderData>();
  
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{' '}
          <input type="text" name="title" className={inputClassName} defaultValue={post?.title} />
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
        </label>
      </p>
      <p>
        <label>
          Post Slug:{' '}
          <input type="text" name="slug" className={inputClassName} defaultValue={post?.slug} />
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={post?.markdown}
        />
        {errors?.markdown ? (
          <em className="text-red-600">{errors.markdown}</em>
        ) : null}
      </p>
      <p className="text-right">
        <button
          type="submit"
          disabled={isCreating}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating ? 'Updating...' : 'Update Post'}
        </button>
      </p>
    </Form>
  );
}
