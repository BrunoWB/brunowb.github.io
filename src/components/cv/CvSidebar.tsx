import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TypewriterText } from '../common/TypewriterText';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriterController } from '../../context/TypewriterContext';
import { cvData } from '../../data/cvData';

export const CvSidebar: React.FC = () => {
  const { t } = useLanguage();
  const { currentStep, isSkipped } = useTypewriterController();

  const isStep1Active = currentStep >= 1 || isSkipped;

  return (
    <aside className="w-full lg:w-[32%] flex flex-col gap-6 text-[var(--text-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] pr-0 lg:pr-6 pb-6 lg:pb-0">
      {/* Profile Summary */}
      <div>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-primary)] mb-2 border-b border-[var(--border-subtle)] pb-1">
          {t(cvData.profile.title)}
        </h3>
        <TypewriterText
          text={t(cvData.profile.summary)}
          step={1}
          speed={14}
          delay={40}
          as="p"
          cursor={false}
          className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]"
        />
      </div>

      {/* Skills */}
      <div className={`transition-opacity duration-300 ${isStep1Active ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-secondary)] mb-2.5 border-b border-[var(--border-subtle)] pb-1">
          {t(cvData.skills.title)}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {cvData.skills.items.map((skill, idx) => (
            <span
              key={skill}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-all duration-200 bg-[var(--brand-primary)]/10 text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] ${
                isStep1Active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 20}ms` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className={`transition-opacity duration-300 ${isStep1Active ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-accent)] mb-2 border-b border-[var(--border-subtle)] pb-1">
          {t(cvData.education.title)}
        </h3>
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-[var(--text-primary)]">
            {t(cvData.education.entry.degree)} - {t(cvData.education.entry.major)}
          </p>
          <p className="text-[var(--text-muted)]">
            {cvData.education.entry.institution} | {cvData.education.entry.location}
          </p>
          <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--text-muted)] border border-[var(--border-subtle)]">
            {cvData.education.entry.date}
          </span>
        </div>
      </div>

      {/* Languages */}
      <div className={`transition-opacity duration-300 ${isStep1Active ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-primary)] mb-2 border-b border-[var(--border-subtle)] pb-1">
          {t(cvData.languages.title)}
        </h3>
        <ul className="flex flex-col gap-1.5 text-xs sm:text-sm">
          {cvData.languages.items.map((langItem) => (
            <li key={langItem.name.en} className="flex justify-between items-center">
              <span className="font-semibold text-[var(--text-secondary)]">
                {t(langItem.name)}
              </span>
              {langItem.level && (
                <span className="text-xs text-[var(--text-muted)]">
                  {t(langItem.level)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Get in Touch (Contact + QR Code) */}
      <div className={`transition-opacity duration-300 ${isStep1Active ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-secondary)] mb-2 border-b border-[var(--border-subtle)] pb-1">
          {t(cvData.contact.title)}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-xs space-y-1">
            <p className="font-medium text-[var(--text-secondary)]">
              <a
                href={`https://${cvData.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand-primary)] hover:underline"
              >
                {cvData.contact.linkedin}
              </a>
            </p>
            <p className="text-[var(--text-muted)] font-mono">
              <a href={`mailto:${cvData.contact.email}`} className="hover:underline">
                {cvData.contact.email}
              </a>
            </p>
            <p className="text-[var(--text-muted)] font-mono">
              <a href={`tel:${cvData.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline">
                {cvData.contact.phone}
              </a>
            </p>
          </div>

          {/* Real Scannable LinkedIn QR Code */}
          <a
            href={cvData.contact.qrUrl || `https://${cvData.contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-18 h-18 sm:w-22 sm:h-22 p-1.5 rounded-lg border border-[var(--border-subtle)] bg-white flex items-center justify-center flex-shrink-0 shadow-sm hover:border-[var(--brand-primary)] hover:shadow-md transition-all duration-200 group cursor-pointer"
            title={`Scan or click to visit ${cvData.contact.qrUrl || cvData.contact.linkedin}`}
            aria-label="Scan or open LinkedIn profile"
          >
            <QRCodeSVG
              value={cvData.contact.qrUrl || `https://${cvData.contact.linkedin}`}
              size={76}
              level="M"
              bgColor="#ffffff"
              fgColor="#03141a"
              className="w-full h-full"
            />
          </a>
        </div>
      </div>
    </aside>
  );
};
