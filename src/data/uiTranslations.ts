import type { LocalizedString } from '../types/cv';

export interface UiTranslations {
  hero: {
    greetings: {
      en: string;
      fr: string;
      pt: string;
    };
    subtitle: LocalizedString;
    cvButton: LocalizedString;
    scrollButton: LocalizedString;
  };
  projects: {
    webTitle: LocalizedString;
    webSubtitle: LocalizedString;
    otherTitle: LocalizedString;
    otherSubtitle: LocalizedString;
  };
  coffee: {
    button: LocalizedString;
  };
  theme: {
    toggleDark: LocalizedString;
    toggleLight: LocalizedString;
  };
  cvModal: {
    close: LocalizedString;
    skipPrompt: LocalizedString;
    downloadPdf: LocalizedString;
  };
}

export const uiTranslations: UiTranslations = {
  hero: {
    greetings: {
      en: 'Hello',
      fr: 'Bonjour',
      pt: 'Olá!',
    },
    subtitle: {
      en: 'Spacetime drifter powered by coffee',
      fr: "Voyageur de l'espace-temps alimenté par le café",
      pt: 'Viajante do espaço-tempo movido a café',
    },
    cvButton: {
      en: 'Curriculum Vitae',
      fr: 'Curriculum Vitae',
      pt: 'Currículo',
    },
    scrollButton: {
      en: 'Scroll for projects',
      fr: 'Défiler pour les projets',
      pt: 'Role para ver os projetos',
    },
  },
  projects: {
    webTitle: {
      en: 'Web Projects',
      fr: 'Projets Web',
      pt: 'Projetos Web',
    },
    webSubtitle: {
      en: 'Explorations, tools, and interactive applications',
      fr: 'Explorations, outils et applications interactives',
      pt: 'Explorações, ferramentas e aplicativos interativos',
    },
    otherTitle: {
      en: 'Projects',
      fr: 'Projets',
      pt: 'Projetos',
    },
    otherSubtitle: {
      en: 'Open source software, desktop apps, and system utilities',
      fr: 'Logiciels open source, outils de bureau et utilitaires système',
      pt: 'Softwares de código aberto, ferramentas desktop e utilitários de sistema',
    },
  },
  coffee: {
    button: {
      en: 'Buy me a coffee',
      fr: 'Energisez-moi avec un café !',
      pt: 'Um cafézinho pro dev?',
    },
  },
  theme: {
    toggleDark: {
      en: 'Switch to Light Mode',
      fr: 'Passer au mode clair',
      pt: 'Alternar para modo claro',
    },
    toggleLight: {
      en: 'Switch to Dark Mode',
      fr: 'Passer au mode sombre',
      pt: 'Alternar para modo escuro',
    },
  },
  cvModal: {
    close: {
      en: 'Close (Esc)',
      fr: 'Fermer (Échap)',
      pt: 'Fechar (Esc)',
    },
    skipPrompt: {
      en: 'Press Space or click anywhere to reveal all',
      fr: 'Appuyez sur Espace ou cliquez pour tout afficher',
      pt: 'Pressione Espaço ou clique para revelar tudo',
    },
    downloadPdf: {
      en: 'Download CV PDF',
      fr: 'Télécharger le CV PDF',
      pt: 'Baixar CV em PDF',
    },
  },
};
