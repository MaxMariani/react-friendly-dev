import { useState } from "react";
import type { Route } from "./+types/index";
import type { Project } from "~/types/Project";
import ProjectCard from "~/components/ProjectCard";
import Pagination from "~/components/Pagination";

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch("http://localhost:8000/projects");
  const data = await res.json();
  return { projects: data };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { projects } = loaderData as { projects: Project[] };

  //Get unique categories
  const categories = ['All', ...new Set(projects.map((project) => project.category))]
  //Filter projects based on categories
  const filteredProjects = selectedCategory === 'All' ? projects :
    projects.filter((project) => project.category === selectedCategory)

  console.log(categories);

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  //Get current pages projects
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <h2 className="text-3xl text-white fond-bold mb-8">🚀Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {currentProjects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ProjectsPage;
