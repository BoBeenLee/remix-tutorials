import { redirect } from '@remix-run/node'; // or "@remix-run/cloudflare"
import { Form, useActionData, useTransition } from '@remix-run/react';
import { ProjectView } from '@remix-tutorials/components';
import { ActionFunction, json } from 'remix';

import { createProject, Project } from '~/models/project.server';

type ActionData = Project | undefined;

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const newProject = Object.fromEntries(body);
  try {
    const project = await createProject(newProject as any);
    return redirect(`/projects/${project.id}`);
  } catch (e) {
    console.error(e);
    return json("Sorry, we couldn't create the project", {
      status: 500,
    });
  }
};

export default function NewProject() {
  const transition = useTransition();
  const error = useActionData();

  return transition.submission ? (
    <ProjectView
      project={Object.fromEntries(transition.submission.formData) as any}
    />
  ) : (
    <>
      <h2>New Project</h2>
      <Form method="post">
        <label>
          Title: <input type="text" name="title" />
        </label>
        <label htmlFor="description">Description:</label>
        <textarea name="description" id="description" />
        <button type="submit">Create Project</button>
      </Form>
      {error ? <p>{error}</p> : null}
    </>
  );
}
