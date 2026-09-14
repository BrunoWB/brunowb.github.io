import React from 'react';
import { projectsData } from '../../data/projectsData';
import { uiTranslations } from '../../data/uiTranslations';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectCard } from './ProjectCard';

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();

  const webProjects = projectsData.filter((p) => p.category === 'web');
  const otherProjects = projectsData.filter((p) => p.category === 'other');

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen bg-[var(--bg-section)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] shadow-[0_-10px_25px_rgba(0,0,0,0.04)] dark:shadow-[0_-25px_60px_rgba(0,0,0,0.25)] transition-colors duration-300"
    >
      {/* Divider Line separating top header from projects */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28">
        {/* Category 1: Web Projects */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
            {t(uiTranslations.projects.webTitle)}
          </h2>
          <p className="text-base text-[var(--text-secondary)]">
            {t(uiTranslations.projects.webSubtitle)}
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-16">
          {webProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Category 2: Other / Desktop Projects */}
        <div className="mb-10 pt-6">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
            {t(uiTranslations.projects.otherTitle)}
          </h2>
          <p className="text-base text-[var(--text-secondary)]">
            {t(uiTranslations.projects.otherSubtitle)}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
