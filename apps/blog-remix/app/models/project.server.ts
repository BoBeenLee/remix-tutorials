
export interface Project {
    id?: string;
    title: string;
    description: string;
    tasks: Array<{
        id: string;
        name: string;
    }>;
}

export const createProject = async (project: Project) => {
    return project;
};


export const findProject = async (projectId: string): Promise<Project> => {
    return Promise.resolve({
        title: "test",
        description: "test",
        tasks: []
    });
};