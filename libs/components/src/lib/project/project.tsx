interface ProjectViewProps {
  project: ProjectViewItem;
}

interface ProjectViewItem {
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    name: string;
  }>;
}

export function ProjectView({ project }: ProjectViewProps) {
  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <ul>
        {project.tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}
