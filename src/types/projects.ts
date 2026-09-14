import type { LocalizedString } from './cv';

export interface ProjectItem {
  id: string;
  title: string;
  repo: string;
  repoUrl: string;
  liveUrl?: string;
  category: 'web' | 'other';
  tag: LocalizedString;
  description: LocalizedString;
  visualType: 'corne' | 'bwpx' | 'screen-manager';
}
