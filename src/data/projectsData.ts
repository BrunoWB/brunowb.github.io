import type { ProjectItem } from '../types/projects';

const rawBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const projectsData: ProjectItem[] = [
  {
    id: 'scyan-zmk-studio',
    title: 'Scyan ZMK Studio',
    repo: 'BrunoWB/scyan-zmk-studio',
    repoUrl: 'https://github.com/BrunoWB/scyan-zmk-studio',
    liveUrl: 'https://brunowb.github.io/scyan-zmk-studio/',
    category: 'web',
    tag: {
      en: 'Web App',
      fr: 'Application Web',
      pt: 'App Web',
    },
    description: {
      en: 'Interactive display layout designer, widget builder, and real-time simulator for ZMK keyboards.',
      fr: 'Studio web interactif pour la disposition d\'écrans, la création de widgets et la simulation en temps réel pour claviers ZMK.',
      pt: 'Studio web interativo para design de telas, criação de widgets e simulação em tempo real para teclados ZMK.',
    },
    visualType: 'corne',
    preview: {
      type: 'video',
      src: `${base}previews/scyan-zmk-studio.webm`,
      poster: `${base}previews/scyan-zmk-studio-poster.webp`,
    },
  },
  {
    id: 'bwpx-editor',
    title: 'Pixel Editor',
    repo: 'BrunoWB/bwpx-editor',
    repoUrl: 'https://github.com/BrunoWB/bwpx-editor',
    liveUrl: 'https://brunowb.github.io/bwpx-editor/',
    category: 'web',
    tag: {
      en: 'Pixel Sandbox',
      fr: 'Bac à sable Pixel',
      pt: 'Sandbox Pixel',
    },
    description: {
      en: 'High-performance pixel editor and canvas sandbox for sprites, retro game art, and embedded display assets.',
      fr: 'Éditeur de pixels et sandbox canvas haute performance pour sprites, pixel art rétro et ressources graphiques embarquées.',
      pt: 'Editor de pixels e sandbox em canvas de alta performance para sprites, pixel art retrô e recursos gráficos embarcados.',
    },
    visualType: 'bwpx',
    preview: {
      type: 'video',
      src: `${base}previews/bwpx-editor.webm`,
      poster: `${base}previews/bwpx-editor-poster.webp`,
    },
  },
  {
    id: 'plasma-screen-manager',
    title: 'Screen Manager',
    repo: 'BrunoWB/plasma-screen-manager',
    repoUrl: 'https://github.com/BrunoWB/plasma-screen-manager',
    liveUrl: 'https://store.kde.org/p/2371012/',
    category: 'other',
    tag: {
      en: 'Plasma 6 Applet',
      fr: 'Applet Plasma 6',
      pt: 'Applet Plasma 6',
    },
    description: {
      en: 'Fast multi-monitor management, inline display renaming, and presentation mode widget for KDE Plasma 6.',
      fr: 'Widget de gestion multi-écrans rapide, renommage direct des affichages et mode présentation pour KDE Plasma 6.',
      pt: 'Widget de gerenciamento rápido de múltiplos monitores, renomeação de telas e modo apresentação para KDE Plasma 6.',
    },
    visualType: 'screen-manager',
    preview: {
      type: 'image',
      src: `${base}previews/plasma-screen-manager.webp`,
    },
  },
];
