import React from 'react';

// Ordered by length descending so longer composite terms match before sub-terms
export const SKILL_PATTERNS: { pattern: string; canonical: string }[] = [
  { pattern: 'Java (Spring Boot)', canonical: 'Java (Spring Boot)' },
  { pattern: 'Spring Boot', canonical: 'Java (Spring Boot)' },
  { pattern: 'HTML5 / Canvas', canonical: 'HTML5 / Canvas' },
  { pattern: 'HTML Canvas', canonical: 'HTML5 / Canvas' },
  { pattern: 'Canvas HTML', canonical: 'HTML5 / Canvas' },
  { pattern: 'Bitbucket Pipelines', canonical: 'Git / GitHub Actions' },
  { pattern: 'GitHub Actions', canonical: 'Git / GitHub Actions' },
  { pattern: 'OpenAPI/Swagger', canonical: 'OpenAPI' },
  { pattern: 'Adobe Photoshop and Illustrator', canonical: 'Photoshop' },
  { pattern: 'Adobe Photoshop', canonical: 'Photoshop' },
  { pattern: 'Adobe Illustrator', canonical: 'Illustrator' },
  { pattern: 'Tailwind CSS', canonical: 'Tailwind CSS' },
  { pattern: 'TypeScript', canonical: 'TypeScript' },
  { pattern: 'Highcharts', canonical: 'Highcharts' },
  { pattern: 'FreeMarker', canonical: 'FreeMarker' },
  { pattern: 'JavaScript', canonical: 'JavaScript' },
  { pattern: 'Bootstrap', canonical: 'Bootstrap' },
  { pattern: 'Puppeteer', canonical: 'Jest / Puppeteer' },
  { pattern: 'Bitbucket', canonical: 'Git / GitHub Actions' },
  { pattern: 'WordPress', canonical: 'WordPress' },
  { pattern: 'RESTful APIs', canonical: 'REST APIs' },
  { pattern: 'APIs RESTful', canonical: 'REST APIs' },
  { pattern: 'REST APIs', canonical: 'REST APIs' },
  { pattern: 'APIs REST', canonical: 'REST APIs' },
  { pattern: 'React 19', canonical: 'React 19' },
  { pattern: 'Angular', canonical: 'Angular' },
  { pattern: 'Node.js', canonical: 'Node.js' },
  { pattern: 'Magento', canonical: 'Magento' },
  { pattern: 'ASP.NET', canonical: 'ASP.NET' },
  { pattern: 'Swagger', canonical: 'OpenAPI' },
  { pattern: 'OpenAPI', canonical: 'OpenAPI' },
  { pattern: 'NestJS', canonical: 'NestJS' },
  { pattern: 'jQuery', canonical: 'jQuery' },
  { pattern: 'HTML5', canonical: 'HTML5 / Canvas' },
  { pattern: 'CSS3', canonical: 'CSS3' },
  { pattern: 'MySQL', canonical: 'MySQL' },
  { pattern: 'React', canonical: 'React 19' },
  { pattern: 'PHTML', canonical: 'PHTML' },
  { pattern: 'gRPC', canonical: 'gRPC' },
  { pattern: 'Java', canonical: 'Java (Spring Boot)' },
  { pattern: 'Jest', canonical: 'Jest / Puppeteer' },
  { pattern: 'Jira', canonical: 'Agile / Scrum' },
  { pattern: 'LLMs', canonical: 'LLMs' },
  { pattern: 'WCAG', canonical: 'WCAG' },
  { pattern: 'SOAP API', canonical: 'SOAP API' },
  { pattern: 'PHP', canonical: 'PHP' },
  { pattern: 'XML', canonical: 'XML' },
  { pattern: 'ERP', canonical: 'ERP' },
  { pattern: 'LLM', canonical: 'LLM' },
  { pattern: 'C#', canonical: 'C#' },
];

const ESCAPED_PATTERNS = SKILL_PATTERNS.map((p) =>
  p.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|');

const SKILL_REGEX = new RegExp(
  `(?<=^|[\\s(/])(${ESCAPED_PATTERNS})(?=$|[\\s.,;:!?)])`,
  'gi'
);

/**
 * Formats bullet text, rendering skill terms slightly bolder for skimming,
 * and applying an active chip-style highlight when the job is hovered without layout shift.
 */
export const formatSkillsInText = (
  text: string,
  isJobHighlighted: boolean,
  hoveredSkill: string | null
): React.ReactNode => {
  if (!text) return text;
  const parts = text.split(SKILL_REGEX);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    const match = SKILL_PATTERNS.find(
      (p) => p.pattern.toLowerCase() === part.toLowerCase()
    );

    if (!match) {
      return part;
    }

    const isSpecificSkillMatch =
      hoveredSkill &&
      (match.canonical.toLowerCase() === hoveredSkill.toLowerCase() ||
        match.pattern.toLowerCase() === hoveredSkill.toLowerCase());

    const shouldHighlight =
      isSpecificSkillMatch || (isJobHighlighted && !hoveredSkill);

    return (
      <span
        key={index}
        className={`font-semibold rounded-[3px] transition-all duration-200 px-1 -mx-1 inline-block ${
          shouldHighlight
            ? 'bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/40 shadow-sm dark:shadow-[0_0_8px_rgba(0,229,255,0.25)]'
            : 'text-[var(--text-primary)]'
        }`}
      >
        {part}
      </span>
    );
  });
};

