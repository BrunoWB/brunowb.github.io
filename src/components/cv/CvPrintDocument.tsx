import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import avatarImg from '../../assets/avatar.png';
import { useLanguage } from '../../context/LanguageContext';
import { usePrintMode, type PrintMode } from '../../context/PrintModeContext';
import { cvData } from '../../data/cvData';
import { formatSkillsInText } from './cvSkillHighlighter';

export interface CvPrintDocumentProps {
  mode?: PrintMode;
}

export const CvPrintDocument: React.FC<CvPrintDocumentProps> = ({ mode: propMode }) => {
  const { t, effectiveLang } = useLanguage();
  const { printMode: contextMode } = usePrintMode();

  const mode = propMode ?? contextMode;
  const isDigital = mode === 'digital';

  // Digital PDF version excludes the 2 oldest legacy jobs for a concise modern showcase
  const positions = isDigital
    ? cvData.experience.positions.slice(0, -2)
    : cvData.experience.positions;

  // Shared Paper Content (Title Bar + Two-Column Body)
  const cardBody = (
    <>
      {/* Paper Title & Contact Row */}
      <div className="pt-2 pb-2.5 pl-32 pr-6 border-b border-[rgba(0,139,163,0.22)] flex justify-between items-baseline min-h-[40px]">
        <div>
          <h2 className="text-base font-bold tracking-wide text-[#008ba3] leading-snug">
            {t(cvData.header.title)}
          </h2>
        </div>

        {/* Location & Contact Meta */}
        <div className="text-right text-[10px] leading-tight text-[#48737e] flex items-baseline gap-3">
          <span className="font-semibold text-[#062630]">{t(cvData.profile.location)}</span>
          <span className="font-mono">{cvData.contact.email}</span>
          <span className="font-mono">{cvData.contact.phone}</span>
        </div>
      </div>

      {/* Main Two-Column Body */}
      <div className="p-4 flex gap-5">
        {/* Left Column (31% width) */}
        <aside className="w-[31%] flex-shrink-0 flex flex-col gap-3">
          {/* Profile Summary */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#008ba3] border-b border-[#008ba3]/25 pb-0.5 mb-1.5">
              {t(cvData.profile.title)}
            </h3>
            <p className="text-[10px] leading-[1.38] text-[#164e5b]">
              {t(cvData.profile.summary)}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#7e22ce] border-b border-[#7e22ce]/25 pb-0.5 mb-1.5">
              {t(cvData.skills.title)}
            </h3>
            <div className="flex flex-wrap gap-1">
              {cvData.skills.items.map((skill) => (
                <span
                  key={skill}
                  className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded bg-[#008ba3]/10 text-[#062630] border border-[rgba(0,139,163,0.25)] leading-tight"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#c2410c] border-b border-[#c2410c]/25 pb-0.5 mb-1.5">
              {t(cvData.education.title)}
            </h3>
            <div className="text-[10px] leading-tight">
              <p className="font-bold text-[#062630]">
                {t(cvData.education.entry.degree)} – {t(cvData.education.entry.major)}
              </p>
              <p className="text-[#48737e] text-[9.5px] mt-0.5">
                {cvData.education.entry.institution} | {cvData.education.entry.location}
              </p>
              <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#008ba3]/10 text-[#48737e] border border-[rgba(0,139,163,0.2)]">
                {cvData.education.entry.date}
              </span>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#008ba3] border-b border-[#008ba3]/25 pb-0.5 mb-1.5">
              {t(cvData.languages.title)}
            </h3>
            <ul className="flex flex-col gap-1 text-[9.5px]">
              {cvData.languages.items.map((lang) => (
                <li key={lang.name.en} className="flex justify-between items-center">
                  <span className="font-semibold text-[#164e5b]">{t(lang.name)}</span>
                  {lang.level && (
                    <span className="text-[9px] text-[#48737e]">{t(lang.level)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch & LinkedIn QR Code */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#7e22ce] border-b border-[#7e22ce]/25 pb-0.5 mb-1.5">
              {t(cvData.contact.title)}
            </h3>
            <div className="flex items-center justify-between gap-2 text-[9px]">
              <div className="space-y-0.5 leading-tight font-medium text-[#164e5b]">
                <p className="text-[#008ba3] font-mono">{cvData.contact.linkedin}</p>
                <p className="text-[#48737e] font-mono">{cvData.contact.email}</p>
                <p className="text-[#48737e] font-mono">{cvData.contact.phone}</p>
              </div>
              <div className="p-1 rounded-md border border-[rgba(0,139,163,0.25)] bg-white flex-shrink-0">
                <QRCodeSVG
                  value={cvData.contact.qrUrl || `https://${cvData.contact.linkedin}`}
                  size={44}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#062630"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column (69% width): Work Experience */}
        <section className="flex-1 pl-4 border-l border-[rgba(0,139,163,0.18)]">
          <div className="border-b border-[#008ba3]/25 pb-0.5 mb-2">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#008ba3]">
              {t(cvData.experience.title)}
            </h3>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-4">
            {/* Continuous Vertical Timeline Line */}
            <div
              className="absolute left-[3.5px] top-1.5 bottom-1.5 w-[1.5px] bg-[#cbd5e1]"
              aria-hidden="true"
            />

            <div className="space-y-2">
              {positions.map((pos) => {
                const bullets = pos.bullets
                  ? pos.bullets[effectiveLang] || pos.bullets.en
                  : [];
                const hasPeriodOrLoc = Boolean(pos.period || pos.location);

                const isOpportunity = pos.id === 'open-for-opportunities';

                return (
                  <div key={pos.id} className="relative">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-[16px] top-[4px] w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${
                        isOpportunity ? 'bg-[#10b981]' : 'bg-[#008ba3]'
                      }`}
                      aria-hidden="true"
                    />

                    {/* Role & Company */}
                    <div>
                      <span
                        className={`text-[11px] font-bold leading-tight ${
                          isOpportunity ? 'text-emerald-700' : 'text-[#062630]'
                        }`}
                      >
                        {pos.company ? `${t(pos.role)} | ${pos.company}` : t(pos.role)}
                      </span>

                      {/* Period & Location */}
                      {hasPeriodOrLoc && (
                        <div className="text-[9px] font-semibold text-[#008ba3] leading-none mt-0.5 mb-0.5">
                          {[
                            pos.period ? t(pos.period) : '',
                            pos.location ? t(pos.location) : '',
                          ]
                            .filter(Boolean)
                            .join(' | ')}
                        </div>
                      )}
                    </div>

                    {/* Bullets */}
                    {bullets.length > 0 && (
                      <ul className="mt-0.5 space-y-0.5 text-[9.2px] leading-[1.32] text-[#164e5b] list-disc pl-3.5">
                        {bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>
                            {formatSkillsInText(bullet, false, null)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );

  return (
    <div
      aria-hidden="true"
      data-print-mode={mode}
      className={`hidden print:block cv-print-sheet text-[#062630] ${
        isDigital ? 'cv-print-digital' : 'cv-print-paper bg-white w-full mx-auto'
      }`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {isDigital ? (
        /* Pretty Print / Digital Mode: Transparent Header showing Cosmic Background behind Name & Straddling Avatar */
        <div className="relative w-full overflow-visible">
          {/* Transparent Top Banner Area */}
          <div className="relative bg-transparent h-16 w-full px-6 flex items-center overflow-visible">
            {/* Avatar Circle - Straddles boundary between cosmic background and white paper sheet */}
            <div className="absolute left-6 top-4 z-20">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-[#e0f2f6] overflow-hidden">
                <img
                  src={avatarImg}
                  alt={cvData.header.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name "BRUNO BARCELLOS" directly on the cosmic background */}
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase pl-26 select-none leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {cvData.header.name}
            </h1>
          </div>

          {/* Floating White Paper Sheet */}
          <div className="cv-card rounded-2xl bg-white overflow-hidden border-2 border-[rgba(0,210,235,0.45)] shadow-2xl">
            {cardBody}
          </div>
        </div>
      ) : (
        /* Standard Paper Mode: Self-contained white card with dark header banner */
        <div className="cv-card rounded-2xl bg-white overflow-hidden border border-[rgba(0,139,163,0.32)] shadow-none">
          {/* Big Top Banner - Dark Spacetime with Name and Straddling Avatar */}
          <div className="relative bg-[#03141a] h-16 w-full px-6 flex items-center overflow-visible">
            {/* Avatar Circle */}
            <div className="absolute left-6 top-3 z-20">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-[#e0f2f6] overflow-hidden">
                <img
                  src={avatarImg}
                  alt={cvData.header.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name "BRUNO BARCELLOS" */}
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase pl-26 select-none leading-none">
              {cvData.header.name}
            </h1>
          </div>

          {cardBody}
        </div>
      )}
    </div>
  );
};
