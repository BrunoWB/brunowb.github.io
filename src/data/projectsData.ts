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
      en: 'Interactive 2-Atlas display layout designer, widget builder, and sprite editor for ZMK keyboards.',
      fr: 'Studio web interactif pour la disposition d\'écrans 2-Atlas, widgets et graphismes de claviers ZMK.',
      pt: 'Studio web interativo para layouts de display 2-Atlas, widgets e gráficos de teclados ZMK.',
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
      en: 'High-performance 1-bit monochrome pixel editor and canvas sandbox for OLED displays, retro sprites, and embedded firmware.',
      fr: 'Éditeur de pixels monochrome 1-bit et sandbox canvas haute performance pour écrans OLED, sprites rétro et firmwares embarqués.',
      pt: 'Editor de pixels monocromático 1-bit e sandbox em canvas de alta performance para telas OLED, sprites retrô e firmware embarcado.',
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
