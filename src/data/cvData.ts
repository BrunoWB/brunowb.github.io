import type { CvDictionary } from '../types/cv';

export const cvData: CvDictionary = {
  header: {
    name: 'BRUNO BARCELLOS',
    title: {
      en: 'Software Engineer',
      fr: 'Ingénieur Logiciel',
      pt: 'Engenheiro de Software',
    },
    avatarUrl: 'https://github.com/BrunoWB.png',
  },
  profile: {
    title: {
      en: 'Profile',
      fr: 'Profil',
      pt: 'Perfil',
    },
    location: {
      en: 'Montreal, Quebec, Canada',
      fr: 'Montréal, Québec, Canada',
      pt: 'Montreal, Quebec, Canadá',
    },
    summary: {
      en: "I'm a Software Developer specializing in modern, accessible interfaces and collaborating with UX/UI teams to deliver quality products. With a background in sports and martial arts, I excel in staying calm under pressure and managing time-sensitive tasks.",
      fr: "Développeur de logiciels spécialisé dans les interfaces modernes et accessibles, collaborant avec les équipes UX/UI pour concevoir des produits de haute qualité. Fort d'un parcours dans le sport et les arts martiaux, je sais garder mon calme sous pression et mener à bien les projets critiques.",
      pt: "Desenvolvedor de software especializado em interfaces modernas e acessíveis, colaborando com equipes de UX/UI para entregar produtos de alta qualidade. Com histórico em esportes e artes marciais, mantenho a calma sob pressão e executo tarefas críticas com precisão.",
    },
  },
  skills: {
    title: {
      en: 'Skills',
      fr: 'Compétences',
      pt: 'Habilidades',
    },
    items: [
      'TypeScript',
      'React 19',
      'HTML5',
      'CSS3 / SASS',
      'Tailwind CSS',
      'Angular',
      'Node.js',
      'MySQL',
      'gRPC',
      'Git / GitHub',
      'Agile / Scrum',
      'Jest / Puppeteer',
    ],
  },
  education: {
    title: {
      en: 'Education',
      fr: 'Formation',
      pt: 'Formação',
    },
    entry: {
      date: '2016',
      degree: {
        en: 'Software Engineer',
        fr: 'Ingénieur Logiciel',
        pt: 'Bacharelado',
      },
      major: {
        en: 'Information Systems',
        fr: "Systèmes d'Information",
        pt: 'Sistemas de Informação',
      },
      institution: 'Unilasalle-RJ',
      location: 'Rio de Janeiro',
    },
  },
  contact: {
    title: {
      en: 'Get in Touch',
      fr: 'Contact',
      pt: 'Contato',
    },
    linkedin: 'linkedin.com/in/brunowbarcellos',
    email: 'brunowbarcellos@gmail.com',
    phone: '(438) 820-8770',
    qrUrl: 'https://www.linkedin.com/in/brunowbarcellos',
  },
  languages: {
    title: {
      en: 'Languages',
      fr: 'Langues',
      pt: 'Idiomas',
    },
    items: [
      {
        name: { en: 'English', fr: 'Anglais', pt: 'Inglês' },
        level: { en: 'Fluent', fr: 'Courant', pt: 'Fluente' },
      },
      {
        name: { en: 'French', fr: 'Français', pt: 'Francês' },
        level: { en: 'Fluent', fr: 'Courant', pt: 'Fluente' },
      },
      {
        name: { en: 'Portuguese', fr: 'Portugais', pt: 'Português' },
        level: { en: 'Fluent', fr: 'Courant', pt: 'Fluente' },
      },
      {
        name: { en: 'Spanish', fr: 'Espagnol', pt: 'Espanhol' },
        level: { en: 'Beginner', fr: 'Débutant', pt: 'Iniciante' },
      },
      {
        name: { en: 'Japanese', fr: 'Japonais', pt: 'Japonês' },
        level: { en: 'Beginner', fr: 'Débutant', pt: 'Iniciante' },
      },
    ],
  },
  experience: {
    title: {
      en: 'Work Experience',
      fr: 'Expérience Professionnelle',
      pt: 'Experiência Profissional',
    },
    positions: [
      {
        id: 'open-for-opportunities',
        role: {
          en: 'Open for Opportunities',
          fr: 'Ouvert aux opportunités',
          pt: 'Aberto a oportunidades',
        },
      },
      {
        id: 'datagrid-ai',
        role: {
          en: 'Software Engineer',
          fr: 'Ingénieur Logiciel',
          pt: 'Engenheiro de Software',
        },
        company: 'Datagrid AI',
        period: {
          en: '2022 – 2026',
          fr: '2022 – 2026',
          pt: '2022 – 2026',
        },
        location: {
          en: 'Quebec, Canada',
          fr: 'Québec, Canada',
          pt: 'Quebec, Canadá',
        },
        bullets: {
          en: [
            'Front End development using TypeScript, React, and CSS with custom HTML Canvas performance visualization.',
            'Lead development of an Angular medical dashboard for real-time biometrics visualization, enhancing user accessibility to critical health data.',
            'Engineered a reliable Node.js server utilizing gRPC for seamless data transmission from devices to dashboards.',
            'Implemented chatbots integrated with various Large Language Models (LLMs) and REST APIs with automated testing using Jest and GitHub Actions.',
          ],
          fr: [
            'Développement Front End avec TypeScript, React et CSS, avec visualisations performantes sur HTML Canvas.',
            'Direction du développement d\'un tableau de bord médical Angular pour la visualisation biométrique en temps réel de données critiques.',
            'Conception d\'un serveur Node.js hautement fiable exploitant gRPC pour la transmission fluide des données entre appareils et tableaux de bord.',
            'Mise en œuvre d\'agents conversationnels intégrés aux LLMs et création d\'APIs REST avec tests automatisés via Jest et GitHub Actions.',
          ],
          pt: [
            'Desenvolvimento Front-End com TypeScript, React e CSS, utilizando framework customizado em HTML Canvas para renderização de alta performance.',
            'Liderança no desenvolvimento de dashboard médico em Angular para visualização de biometria em tempo real.',
            'Engenharia de servidor Node.js com gRPC para comunicação de dados em tempo real entre dispositivos e dashboards.',
            'Implementação de chatbots integrados a múltiplos LLMs e APIs REST com testes automatizados via Jest e GitHub Actions.',
          ],
        },
      },
      {
        id: 'hexoskin',
        role: {
          en: 'Software Engineer',
          fr: 'Ingénieur Logiciel',
          pt: 'Engenheiro de Software',
        },
        company: 'Hexoskin',
        period: {
          en: '2020 – 2022',
          fr: '2020 – 2022',
          pt: '2020 – 2022',
        },
        location: {
          en: 'Quebec, Canada',
          fr: 'Québec, Canada',
          pt: 'Quebec, Canadá',
        },
        bullets: {
          en: [
            'Development of REST APIs with Spring Boot for efficient biometric data interaction and processing.',
            'Utilized FreeMarker for dynamic content generation and automated reporting.',
            'Built Angular frontends integrating seamlessly with backend health data ingestion services.',
          ],
          fr: [
            'Développement d\'APIs REST avec Spring Boot pour l\'interaction et le traitement des données biométriques.',
            'Utilisation de FreeMarker pour la génération de contenu dynamique et les rapports de santé.',
            'Création d\'interfaces Angular intégrées de façon transparente aux microservices backend.',
          ],
          pt: [
            'Desenvolvimento de APIs REST com Spring Boot para interação eficiente e processamento de dados biométricos.',
            'Utilização de FreeMarker para geração dinâmica de relatórios e conteúdos.',
            'Construção de front-ends Angular perfeitamente integrados com serviços de backend de dados de saúde.',
          ],
        },
      },
      {
        id: 'nurun',
        role: {
          en: 'Software Engineer',
          fr: 'Ingénieur Logiciel',
          pt: 'Engenheiro de Software',
        },
        company: 'Nurun',
        period: {
          en: '2019 – 2020',
          fr: '2019 – 2020',
          pt: '2019 – 2020',
        },
        location: {
          en: 'Quebec, Canada',
          fr: 'Québec, Canada',
          pt: 'Quebec, Canadá',
        },
        bullets: {
          en: [
            'Delivered custom web services and enterprise client applications with strict accessibility and performance standards.',
            'Collaborated with UX/UI design teams to translate complex design systems into robust, maintainable components.',
          ],
          fr: [
            'Conception et livraison de services web sur mesure pour des clients d\'envergure, respectant les normes d\'accessibilité et de performance.',
            'Collaboration étroite avec les équipes UX/UI pour transcrire des systèmes de design complexes en composants modulaires.',
          ],
          pt: [
            'Entrega de soluções web personalizadas para grandes clientes corporativos, atendendo a rígidos critérios de acessibilidade e performance.',
            'Colaboração contínua com times de UX/UI na conversão de design systems complexos em componentes reutilizáveis.',
          ],
        },
      },
      {
        id: '3a-distribuidora',
        role: {
          en: 'Freelance Web Developer',
          fr: 'Développeur Web Indépendant',
          pt: 'Desenvolvedor Web Freelance',
        },
        company: '3A Distribuidora',
        period: {
          en: '2014 – 2016',
          fr: '2014 – 2016',
          pt: '2014 – 2016',
        },
        location: {
          en: 'Rio de Janeiro, Brazil',
          fr: 'Rio de Janeiro, Brésil',
          pt: 'Rio de Janeiro, Brasil',
        },
        bullets: {
          en: [
            'Developed and optimized Magento eCommerce platforms with PHTML/XML for improved user conversion and transactional reliability.',
            'Created visually appealing, responsive WordPress landing pages and custom themes.',
          ],
          fr: [
            'Développement et optimisation de plateformes de commerce électronique Magento en PHTML/XML, améliorant la conversion et la fiabilité.',
            'Création de pages d\'atterrissage et de thèmes WordPress fonctionnels et ergonomiques.',
          ],
          pt: [
            'Desenvolvimento e otimização de plataformas de e-commerce Magento com PHTML/XML para maximizar conversão e confiabilidade de transações.',
            'Criação de landing pages e temas customizados em WordPress com layout responsivo.',
          ],
        },
      },
      {
        id: 'allus',
        role: {
          en: 'Fullstack Developer',
          fr: 'Développeur Fullstack',
          pt: 'Desenvolvedor Fullstack',
        },
        company: 'Allus',
        period: {
          en: '2014',
          fr: '2014',
          pt: '2014',
        },
        location: {
          en: 'Rio de Janeiro, Brazil',
          fr: 'Rio de Janeiro, Brésil',
          pt: 'Rio de Janeiro, Brasil',
        },
        bullets: {
          en: [
            'Delivered custom web services for enterprise clients, focusing on Web Design, Graphic Design, and ERP/Database management.',
            'Implemented database queries and schema tuning in MySQL to boost reporting efficiency.',
          ],
          fr: [
            'Fourniture de services web sur mesure pour des clients d\'entreprise, axés sur le design web, l\'infographie et la gestion de bases de données ERP.',
            'Optimisation de requêtes de bases de données et de schémas MySQL pour accroître la vitesse des rapports d\'activité.',
          ],
          pt: [
            'Desenvolvimento de serviços web sob medida com foco em Web Design, Design Gráfico e integração de sistemas ERP/Banco de Dados.',
            'Estruturação de consultas e modelagem MySQL para acelerar processos de relatórios corporativos.',
          ],
        },
      },
    ],
  },
};
