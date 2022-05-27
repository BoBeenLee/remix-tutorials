import { json, LoaderFunction } from '@remix-run/node'; // or "@remix-run/cloudflare"
import { useLoaderData } from '@remix-run/react';

import { ProjectView } from '@remix-tutorials/components';
import { findProject } from "~/models/project.server";

export const loader: LoaderFunction = async ({ params }) => {
  return json(await findProject(params.id ?? ""));
}

export default function ProjectRoute() {
  const project = useLoaderData();
  return <ProjectView project={project} />;
}
