import React from 'react';
import type { ProjectItem } from '../../types/projects';
import { useLanguage } from '../../context/LanguageContext';
import { CorneSvg } from './visuals/CorneSvg';
import { BwpxSvg } from './visuals/BwpxSvg';
import { ScreenMgrSvg } from './visuals/ScreenMgrSvg';

export const ProjectCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const { t } = useLanguage();

  const renderVisual = () => {
    switch (project.visualType) {
      case 'corne':
        return <CorneSvg />;
      case 'bwpx':
        return <BwpxSvg />;
      case 'screen-manager':
        return <ScreenMgrSvg />;
      default:
        return null;
    }
  };

  const primaryLink = project.liveUrl || project.repoUrl;

  return (
    <article className="group relative rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 cursor-pointer bg-white/85 dark:bg-[rgba(8,40,50,0.6)] border border-slate-200 dark:border-cyan-500/20 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_12px_30px_rgba(0,210,235,0.2)] hover:bg-white dark:hover:bg-[rgba(12,50,62,0.85)] shadow-md">
      {/* Primary Clickable Area */}
      <a
        href={primaryLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Open ${project.title}`}
      />

      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-none">
        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            {project.title}
          </h3>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View GitHub repository"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-700 dark:text-cyan-300 opacity-90 hover:opacity-100 hover:underline mb-3 pointer-events-auto transition-all font-medium"
          >
            <svg
              className="w-3.5 h-3.5 fill-current flex-shrink-0"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>{project.repo}</span>
          </a>

          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-[#a4cdd4] mb-4">
            {t(project.description)}
          </p>

          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full border bg-cyan-50 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/25">
            {t(project.tag)}
          </span>
        </div>

        {/* Visual Column */}
        <div className="flex-shrink-0 flex items-center justify-center self-center md:self-auto mt-2 md:mt-0">
          {renderVisual()}
        </div>
      </div>
    </article>
  );
};
