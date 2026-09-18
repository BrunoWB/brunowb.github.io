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
      'NestJS',
      'HTML5 / Canvas',
      'Tailwind CSS',
      'Angular',
      'Node.js',
      'gRPC',
      'Java (Spring Boot)',
      'Highcharts',
      'MySQL',
      'Git / GitHub Actions',
      'Jest / Puppeteer',
      'Agile / Scrum',
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
        en: "Bachelor's",
        fr: 'Baccalauréat',
        pt: 'Bacharelado',
      },
      major: {
        en: 'Software Engineer',
        fr: 'Ingénieur Logiciel',
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
          en: 'Montreal, Quebec, Canada · Hybrid',
          fr: 'Montréal, Québec, Canada · Hybride',
          pt: 'Montreal, Quebec, Canadá · Híbrido',
        },
        skills: ['TypeScript', 'React 19', 'NestJS', 'HTML5 / Canvas', 'Git / GitHub Actions', 'Jest / Puppeteer'],
        bullets: {
          en: [
            'Architected and developed scalable frontend applications and modular UI architectures using React, TypeScript, HTML Canvas, and NestJS.',
            'Worked on a high-performance HTML Canvas framework to handle complex real-time visual rendering.',
            'Integrated multi-provider LLM pipelines and streaming conversational interfaces to power intelligent, low-latency AI workflows.',
            'Standardized CI/CD automation and quality assurance using GitHub Actions, Jest, and Puppeteer, significantly reducing deployment friction and regressions.',
            'Collaborated across engineering and product teams to drive technical design decisions and improve frontend delivery velocity.',
          ],
          fr: [
            'Conception et développement d\'applications front-end évolutives et d\'architectures d\'interface modulaires avec React, TypeScript, HTML Canvas et NestJS.',
            'Développement d\'un framework HTML Canvas haute performance pour la gestion d\'un rendu visuel complexe en temps réel.',
            'Intégration de pipelines LLM multi-fournisseurs et d\'interfaces conversationnelles en continu pour propulser des flux de travail IA intelligents à faible latence.',
            'Standardisation de l\'automatisation CI/CD et de l\'assurance qualité via GitHub Actions, Jest et Puppeteer, réduisant nettement les frictions de déploiement et les régressions.',
            'Collaboration transversale avec les équipes d\'ingénierie et de produit pour guider les choix de conception technique et accroître la vélocité de livraison front-end.',
          ],
          pt: [
            'Arquitetura e desenvolvimento de aplicações front-end escaláveis e arquiteturas modulares de UI utilizando React, TypeScript, HTML Canvas e NestJS.',
            'Desenvolvimento de framework em HTML Canvas de alta performance para gerenciar renderizações visuais complexas em tempo real.',
            'Integração de pipelines com múltiplos provedores de LLM e interfaces conversacionais com streaming para fluxos de IA inteligentes e de baixa latência.',
            'Padronização da automação de CI/CD e garantia de qualidade utilizando GitHub Actions, Jest e Puppeteer, reduzindo atritos de deploy e regressões.',
            'Colaboração com equipes de engenharia e produto para direcionar decisões técnicas de arquitetura e elevar a velocidade de entrega no front-end.',
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
          en: 'Quebec, Canada · On-site',
          fr: 'Québec, Canada · Sur site',
          pt: 'Quebec, Canadá · Presencial',
        },
        skills: ['Angular', 'Node.js', 'gRPC', 'Highcharts', 'HTML5 / Canvas', 'Agile / Scrum'],
        bullets: {
          en: [
            'Led frontend architecture for an enterprise medical monitoring dashboard visualizing high-frequency, real-time biometrics using Angular, HTML5, and gRPC, enhancing accessibility to critical health data.',
            'Engineered resilient Node.js microservices with gRPC to reliably ingest, decode, and stream device telemetry data to client interfaces with minimal latency.',
            'Implemented interactive time-series health metrics visualization using Highcharts and custom charting solutions.',
            'Maintained automated CI/CD deployment pipelines using Bitbucket Pipelines and Jira in an agile, regulated health-tech environment.',
          ],
          fr: [
            'Direction de l\'architecture front-end d\'un tableau de bord médical d\'entreprise pour la visualisation biométrique haute fréquence en temps réel (Angular, HTML5, gRPC), améliorant l\'accès aux données de santé critiques.',
            'Conception de microservices Node.js résilients avec gRPC pour ingérer, décoder et diffuser la télémétrie des appareils vers les interfaces clientes avec une latence minimale.',
            'Mise en œuvre de visualisations interactives de séries temporelles de mesures de santé via Highcharts et des solutions graphiques sur mesure.',
            'Maintenance de pipelines de déploiement CI/CD automatisés avec Bitbucket Pipelines et Jira au sein d\'un environnement health-tech agile et réglementé.',
          ],
          pt: [
            'Liderança da arquitetura front-end de dashboard médico corporativo para visualização de biometria de alta frequência em tempo real com Angular, HTML5 e gRPC, otimizando o acesso a dados de saúde essenciais.',
            'Engenharia de microsserviços resilientes em Node.js com gRPC para ingestão, decodificação e streaming confiáveis de telemetria médica com latência mínima.',
            'Implementação de visualização interativa de séries temporais de métricas de saúde com Highcharts e soluções gráficas personalizadas.',
            'Manutenção de pipelines de deploy CI/CD automatizados utilizando Bitbucket Pipelines e Jira em ambiente health-tech ágil e regulamentado.',
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
          en: 'Montreal, Canada Area · On-site',
          fr: 'Région de Montréal, Canada · Sur site',
          pt: 'Grande Montreal, Canadá · Presencial',
        },
        skills: ['Java (Spring Boot)', 'Angular', 'Agile / Scrum'],
        bullets: {
          en: [
            'Built and maintained enterprise RESTful APIs using Java (Spring Boot) with OpenAPI/Swagger specifications for robust client integration.',
            'Developed dynamic, responsive user interfaces leveraging Angular and FreeMarker template engines.',
            'Integrated frontend components with backend enterprise microservices, optimizing data delivery and API response handling.',
            'Collaborated closely with UX/UI design teams to translate complex design systems into robust, accessible components compliant with WCAG standards.',
          ],
          fr: [
            'Conception et maintenance d\'APIs REST d\'entreprise en Java (Spring Boot) avec spécifications OpenAPI/Swagger pour une intégration client robuste.',
            'Développement d\'interfaces utilisateur dynamiques et réactives exploitant Angular et le moteur de templates FreeMarker.',
            'Intégration de composants front-end avec des microservices d\'entreprise backend, optimisant la transmission des données et le traitement des APIs.',
            'Collaboration étroite avec les équipes de design UX/UI pour décliner des systèmes de design complexes en composants robustes, modulaires et conformes aux normes WCAG.',
          ],
          pt: [
            'Construção e manutenção de APIs RESTful corporativas em Java (Spring Boot) com especificações OpenAPI/Swagger para integração robusta de clientes.',
            'Desenvolvimento de interfaces de usuário dinâmicas e responsivas utilizando Angular e motor de templates FreeMarker.',
            'Integração de componentes front-end com microsserviços corporativos de back-end, otimizando transporte de dados e respostas de API.',
            'Colaboração contínua com times de design UX/UI para converter design systems complexos em componentes modulares e acessíveis conforme padrões WCAG.',
          ],
        },
      },
      {
        id: '3a-distribuidora',
        role: {
          en: 'Freelance Web Services',
          fr: 'Services Web Indépendants',
          pt: 'Serviços Web Freelancer',
        },
        company: '3A Distribuidora',
        period: {
          en: '2014 – 2016',
          fr: '2014 – 2016',
          pt: '2014 – 2016',
        },
        location: {
          en: 'Greater Rio de Janeiro, Brazil',
          fr: 'Région métropolitaine de Rio de Janeiro, Brésil',
          pt: 'Grande Rio de Janeiro, Brasil',
        },
        skills: ['TypeScript'],
        bullets: {
          en: [
            'Developed custom web applications, graphic design collateral, and corporate web portals for 3A Distribuidora and Barcellos Sports using TypeScript and WordPress.',
            'Configured and managed ERP database connections, automating routine business workflows and client data management.',
          ],
          fr: [
            'Développement d\'applications web sur mesure, de supports graphiques et de portails d\'entreprise pour 3A Distribuidora et Barcellos Sports avec TypeScript et WordPress.',
            'Configuration et gestion des connexions aux bases de données ERP, automatisant les processus d\'affaires courants et la gestion des données clients.',
          ],
          pt: [
            'Desenvolvimento de aplicações web customizadas, identidade visual corporativa e portais corporativos para 3A Distribuidora e Barcellos Sports com TypeScript e WordPress.',
            'Configuração e gerenciamento de integrações de banco de dados com ERP, automatizando fluxos operacionais e gestão de dados de clientes.',
          ],
        },
      },
      {
        id: 'allus-dev',
        role: {
          en: 'Frontend & Magento Backend Developer',
          fr: 'Développeur Front-End & Back-End Magento',
          pt: 'Desenvolvedor Front-End e Back-End Magento',
        },
        company: 'Allus',
        period: {
          en: '2014',
          fr: '2014',
          pt: '2014',
        },
        location: {
          en: 'Greater Rio de Janeiro, Brazil',
          fr: 'Région métropolitaine de Rio de Janeiro, Brésil',
          pt: 'Grande Rio de Janeiro, Brasil',
        },
        skills: ['MySQL', 'HTML5 / Canvas'],
        bullets: {
          en: [
            'Engineered custom e-commerce web applications and themes utilizing Magento, PHP, XML, and PHTML.',
            'Built high-converting responsive landing pages and user interfaces using HTML5, CSS3, Bootstrap, jQuery, and JavaScript.',
            'Implemented database queries and schema tuning in MySQL to optimize catalog performance and reporting efficiency.',
          ],
          fr: [
            'Conception d\'applications e-commerce sur mesure et de thèmes personnalisés exploitant Magento, PHP, XML et PHTML.',
            'Développement de landing pages et d\'interfaces réactives à fort taux de conversion avec HTML5, CSS3, Bootstrap, jQuery et JavaScript.',
            'Optimisation de requêtes et ajustement de schémas de bases de données MySQL pour accroître l\'efficacité des rapports et la vitesse du catalogue.',
          ],
          pt: [
            'Desenvolvimento de aplicações e-commerce sob medida e criação de temas utilizando Magento, PHP, XML e PHTML.',
            'Construção de landing pages responsivas e interfaces com alta taxa de conversão utilizando HTML5, CSS3, Bootstrap, jQuery e JavaScript.',
            'Estruturação e otimização de consultas e esquemas em MySQL para acelerar a geração de relatórios e desempenho do catálogo.',
          ],
        },
      },
      {
        id: 'allus-trainee',
        role: {
          en: 'Backend Developer Trainee',
          fr: 'Stagiaire Développeur Back-End',
          pt: 'Estagiário Desenvolvedor Back-End',
        },
        company: 'Allus',
        period: {
          en: '2012 – 2013',
          fr: '2012 – 2013',
          pt: '2012 – 2013',
        },
        location: {
          en: 'Greater Rio de Janeiro, Brazil',
          fr: 'Région métropolitaine de Rio de Janeiro, Brésil',
          pt: 'Grande Rio de Janeiro, Brasil',
        },
        skills: ['MySQL'],
        bullets: {
          en: [
            'Developed ERP-to-web platform integration modules using C# and ASP.NET for internal business operations.',
            'Implemented Magento SOAP API integrations to sync product catalogs and order workflows with client ERP systems.',
          ],
          fr: [
            'Développement de modules d\'intégration ERP vers plateformes web avec C# et ASP.NET pour les opérations d\'entreprise internes.',
            'Mise en œuvre d\'intégrations via les APIs SOAP de Magento pour synchroniser les catalogues de produits et les commandes avec les ERP clients.',
          ],
          pt: [
            'Desenvolvimento de módulos de integração entre plataformas web e ERP com C# e ASP.NET para operações internas de negócios.',
            'Implementação de integrações via SOAP API no Magento para sincronizar catálogos de produtos e fluxos de pedidos com sistemas ERP.',
          ],
        },
      },
      {
        id: 'barcellos-sports',
        role: {
          en: 'Web Designer',
          fr: 'Concepteur Web / Graphiste',
          pt: 'Web Designer',
        },
        company: 'Barcellos Sports',
        period: {
          en: '2011 – 2012',
          fr: '2011 – 2012',
          pt: '2011 – 2012',
        },
        location: {
          en: 'Rio de Janeiro, Brazil',
          fr: 'Rio de Janeiro, Brésil',
          pt: 'Rio de Janeiro, Brasil',
        },
        skills: [],
        bullets: {
          en: [
            'Designed user-facing web interfaces, visual assets, and digital marketing materials for athletic products and cycling gear using Adobe Photoshop and Illustrator.',
            'Crafted engaging visuals and promotional layouts optimized to improve user interaction and conversion rates.',
          ],
          fr: [
            'Conception d\'interfaces web, d\'actifs visuels et de supports de marketing numérique pour équipements sportifs et cyclistes avec Adobe Photoshop et Illustrator.',
            'Création de visuels attractifs et de maquettes promotionnelles optimisées pour renforcer l\'engagement et les taux de conversion.',
          ],
          pt: [
            'Criação de interfaces web, peças visuais e materiais de marketing digital para vestuário e produtos esportivos de ciclismo com Adobe Photoshop e Illustrator.',
            'Elaboração de designs promocionais e layouts interativos orientados à otimização da experiência do usuário e conversão de vendas.',
          ],
        },
      },
    ],
  },
};
