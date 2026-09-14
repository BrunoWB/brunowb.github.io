export interface LocalizedString {
  en: string;
  fr: string;
  pt: string;
}

export interface TimelinePosition {
  id: string;
  role: LocalizedString;
  company?: string;
  period?: LocalizedString;
  location?: LocalizedString;
  skills?: string[];
  bullets?: {
    en: string[];
    fr: string[];
    pt: string[];
  };
}

export interface CvDictionary {
  header: {
    name: string;
    title: LocalizedString;
    avatarUrl: string;
  };
  profile: {
    title: LocalizedString;
    location: LocalizedString;
    summary: LocalizedString;
  };
  skills: {
    title: LocalizedString;
    items: string[];
  };
  education: {
    title: LocalizedString;
    entry: {
      date: string;
      degree: LocalizedString;
      major: LocalizedString;
      institution: string;
      location: string;
    };
  };
  contact: {
    title: LocalizedString;
    linkedin: string;
    email: string;
    phone: string;
    qrUrl?: string;
  };
  languages: {
    title: LocalizedString;
    items: { name: LocalizedString; level?: LocalizedString }[];
  };
  experience: {
    title: LocalizedString;
    positions: TimelinePosition[];
  };
}

export type SupportedLanguage = 'en' | 'fr' | 'pt';
