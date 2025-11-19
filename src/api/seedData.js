/**
 * Seed data for MirageJS mock server
 * This data will be loaded when the app starts
 */

export const seedData = {
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin',
    },
  ],

  pages: [
    {
      id: 'page-1',
      slug: 'home',
      title: {
        en: 'Home',
        ar: 'الرئيسية',
        ku: 'سەرەکی',
      },
      visible: true,
      showInNavbar: true,
      navbarParentId: null,
      order: 1,
      sections: ['section-1', 'section-2'],
    },
    {
      id: 'page-2',
      slug: 'about',
      title: {
        en: 'About Us',
        ar: 'من نحن',
        ku: 'دەربارەی ئێمە',
      },
      visible: true,
      showInNavbar: true,
      navbarParentId: null,
      order: 2,
      sections: ['section-3', 'section-4'],
    },
    {
      id: 'page-3',
      slug: 'services',
      title: {
        en: 'Services',
        ar: 'خدماتنا',
        ku: 'خزمەتگوزاری',
      },
      visible: true,
      showInNavbar: true,
      navbarParentId: null,
      order: 3,
      sections: ['section-5'],
    },
    {
      id: 'page-4',
      slug: 'contact',
      title: {
        en: 'Contact',
        ar: 'اتصل بنا',
        ku: 'پەیوەندی',
      },
      visible: true,
      showInNavbar: true,
      navbarParentId: null,
      order: 4,
      sections: ['section-6'],
    },
  ],

  sections: [
    {
      id: 'section-1',
      pageId: 'page-1',
      type: 'header',
      content: {
        title: {
          en: 'Welcome to Our Dynamic CMS',
          ar: 'مرحباً بك في نظام إدارة المحتوى الديناميكي',
          ku: 'بەخێربێن بۆ سیستەمی بەڕێوەبردنی ناوەڕۆکی دینامیکی',
        },
        details: {
          en: '<p>Build amazing multilingual websites with ease. Support for Arabic, English, and Kurdish with full RTL support.</p>',
          ar: '<p>قم ببناء مواقع ويب متعددة اللغات مذهلة بسهولة. دعم للعربية والإنجليزية والكردية مع دعم كامل للكتابة من اليمين إلى اليسار.</p>',
          ku: '<p>ماڵپەڕی سەرنجڕاکێش و فرە زمانە بە ئاسانی دروست بکە. پشتگیری بۆ عەرەبی، ئینگلیزی، و کوردی لەگەڵ پشتگیری تەواو بۆ نووسینی راست بۆ چەپ.</p>',
        },
        image: null,
        button: {
          text: {
            en: 'Get Started',
            ar: 'ابدأ الآن',
            ku: 'دەست پێبکە',
          },
          link: '/about',
        },
        shareText: {
          en: 'Check out our amazing CMS platform!',
          ar: 'تحقق من منصة إدارة المحتوى المذهلة لدينا!',
          ku: 'سەیری پلاتفۆرمی سیستەمی بەڕێوەبردنی ناوەڕۆکمان بکە!',
        },
      },
      layout: {
        imagePosition: 'center',
        bg: 'gradient',
        padding: 'xl',
        textAlign: 'center',
      },
      order: 1,
    },
    {
      id: 'section-2',
      pageId: 'page-1',
      type: 'features',
      content: {
        title: {
          en: 'Key Features',
          ar: 'الميزات الرئيسية',
          ku: 'تایبەتمەندییە سەرەکییەکان',
        },
        details: {
          en: '<p>Everything you need to build a powerful multilingual website</p>',
          ar: '<p>كل ما تحتاجه لبناء موقع ويب قوي متعدد اللغات</p>',
          ku: '<p>هەموو ئەوەی پێویستە بۆ دروستکردنی ماڵپەڕێکی بەهێز و فرە زمانە</p>',
        },
        features: [
          {
            icon: '🌐',
            title: {
              en: 'Multi-language Support',
              ar: 'دعم متعدد اللغات',
              ku: 'پشتگیری فرە زمانە',
            },
            description: {
              en: 'Full support for Arabic, English, and Kurdish with RTL',
              ar: 'دعم كامل للعربية والإنجليزية والكردية مع الكتابة من اليمين إلى اليسار',
              ku: 'پشتگیری تەواو بۆ عەرەبی، ئینگلیزی، و کوردی لەگەڵ نووسینی راست بۆ چەپ',
            },
          },
          {
            icon: '🎨',
            title: {
              en: 'Drag & Drop Builder',
              ar: 'منشئ السحب والإفلات',
              ku: 'دروستکەری ڕاکێشان و ڕاگرتن',
            },
            description: {
              en: 'Intuitive interface to create and arrange content',
              ar: 'واجهة بديهية لإنشاء المحتوى وترتيبه',
              ku: 'ڕووکاری ئاسان بۆ دروستکردن و ڕێکخستنی ناوەڕۆک',
            },
          },
          {
            icon: '📊',
            title: {
              en: 'Survey Builder',
              ar: 'منشئ الاستبيانات',
              ku: 'دروستکەری ڕاپرسی',
            },
            description: {
              en: 'Create surveys and collect responses with analytics',
              ar: 'إنشاء الاستبيانات وجمع الردود مع التحليلات',
              ku: 'ڕاپرسی دروست بکە و وەڵامەکان کۆبکەرەوە لەگەڵ شیکاری',
            },
          },
          {
            icon: '🎯',
            title: {
              en: 'Dynamic Pages',
              ar: 'صفحات ديناميكية',
              ku: 'پەڕە دینامیکییەکان',
            },
            description: {
              en: 'Manage all your pages and content from admin panel',
              ar: 'إدارة جميع الصفحات والمحتوى من لوحة الإدارة',
              ku: 'هەموو پەڕە و ناوەڕۆکەکانت بەڕێوە ببە لە پانێلی بەڕێوەبەر',
            },
          },
        ],
      },
      layout: {
        bg: 'light',
        padding: 'lg',
      },
      order: 2,
    },
    {
      id: 'section-3',
      pageId: 'page-2',
      type: 'image-left',
      content: {
        title: {
          en: 'Our Story',
          ar: 'قصتنا',
          ku: 'چیرۆکەکەمان',
        },
        details: {
          en: '<p>We started with a vision to make website building accessible to everyone, regardless of language or technical expertise. Our platform combines powerful features with an intuitive interface, allowing you to focus on your content while we handle the complexity.</p>',
          ar: '<p>بدأنا برؤية لجعل بناء المواقع متاحًا للجميع، بغض النظر عن اللغة أو الخبرة التقنية. تجمع منصتنا بين الميزات القوية والواجهة البديهية، مما يسمح لك بالتركيز على المحتوى الخاص بك بينما نتعامل نحن مع التعقيد.</p>',
          ku: '<p>ئێمە بە بینینێک دەستمان پێکرد بۆ ئەوەی دروستکردنی ماڵپەڕ بۆ هەمووان ئاسان بکەین، جگە لە زمان یان شارەزایی تەکنیکی. پلاتفۆرمەکەمان تایبەتمەندی بەهێز و ڕووکاری ئاسان تێکەڵ دەکات، ڕێگات پێدەدات سەرنج لەسەر ناوەڕۆکەکەت بدەیت لەکاتێکدا ئێمە ئاڵۆزییەکە بەڕێوە دەبەین.</p>',
        },
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM0OThkYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+T3VyIFN0b3J5PC90ZXh0Pjwvc3ZnPg==',
        button: null,
        shareText: {
          en: 'Learn about our journey',
          ar: 'تعرف على رحلتنا',
          ku: 'ئاگاداری گەشتەکەمان بە',
        },
      },
      layout: {
        imagePosition: 'left',
        bg: 'white',
        padding: 'lg',
      },
      order: 1,
    },
    {
      id: 'section-4',
      pageId: 'page-2',
      type: 'testimonials',
      content: {
        title: {
          en: 'What Our Users Say',
          ar: 'ماذا يقول مستخدمونا',
          ku: 'بەکارهێنەرەکانمان چی دەڵێن',
        },
        details: {
          en: '<p>Real feedback from our community</p>',
          ar: '<p>تعليقات حقيقية من مجتمعنا</p>',
          ku: '<p>فیدباکی ڕاستەقینە لە کۆمەڵگەکەمانەوە</p>',
        },
        testimonials: [
          {
            name: 'Sarah Ahmed',
            role: {
              en: 'Content Manager',
              ar: 'مدير المحتوى',
              ku: 'بەڕێوەبەری ناوەڕۆک',
            },
            text: {
              en: 'This platform has transformed how we manage our multilingual content. The RTL support is flawless!',
              ar: 'لقد غيرت هذه المنصة طريقة إدارتنا للمحتوى متعدد اللغات. دعم الكتابة من اليمين إلى اليسار لا تشوبه شائبة!',
              ku: 'ئەم پلاتفۆرمە شێوازی بەڕێوەبردنی ناوەڕۆکی فرە زمانەمان گۆڕیوە. پشتگیری نووسینی راست بۆ چەپ تەواو بێ کێشەیە!',
            },
            avatar: '👩‍💼',
          },
          {
            name: 'Ahmad Hassan',
            role: {
              en: 'Business Owner',
              ar: 'صاحب عمل',
              ku: 'خاوەنی بزنس',
            },
            text: {
              en: 'Finally, a CMS that understands the needs of multilingual businesses in our region.',
              ar: 'أخيرًا، نظام إدارة محتوى يفهم احتياجات الشركات متعددة اللغات في منطقتنا.',
              ku: 'دواجار، سیستەمێکی بەڕێوەبردنی ناوەڕۆک کە پێداویستی بزنسە فرە زمانەکان لە هەرێمەکەماندا تێدەگات.',
            },
            avatar: '👨‍💼',
          },
        ],
      },
      layout: {
        bg: 'light',
        padding: 'lg',
      },
      order: 2,
    },
    {
      id: 'section-5',
      pageId: 'page-3',
      type: 'features',
      content: {
        title: {
          en: 'Our Services',
          ar: 'خدماتنا',
          ku: 'خزمەتگوزارییەکانمان',
        },
        details: {
          en: '<p>Comprehensive solutions for your digital presence</p>',
          ar: '<p>حلول شاملة لتواجدك الرقمي</p>',
          ku: '<p>چارەسەری تەواو بۆ ئامادەبوونی دیجیتاڵیت</p>',
        },
        features: [
          {
            icon: '💻',
            title: {
              en: 'Website Building',
              ar: 'بناء المواقع',
              ku: 'دروستکردنی ماڵپەڕ',
            },
            description: {
              en: 'Create stunning websites with our visual builder',
              ar: 'إنشاء مواقع مذهلة باستخدام المنشئ المرئي الخاص بنا',
              ku: 'ماڵپەڕی سەرنجڕاکێش دروست بکە بە دروستکەری بینراوەکەمان',
            },
          },
          {
            icon: '📱',
            title: {
              en: 'Mobile Optimization',
              ar: 'تحسين الجوال',
              ku: 'باشکردنی مۆبایل',
            },
            description: {
              en: 'Fully responsive designs that work on all devices',
              ar: 'تصاميم متجاوبة بالكامل تعمل على جميع الأجهزة',
              ku: 'دیزاینی وەڵامدەرەوەی تەواو کە لەسەر هەموو ئامێرێک کار دەکات',
            },
          },
          {
            icon: '🔍',
            title: {
              en: 'SEO Optimization',
              ar: 'تحسين محركات البحث',
              ku: 'باشکردنی بزوێنەری گەڕان',
            },
            description: {
              en: 'Built-in SEO tools to improve your visibility',
              ar: 'أدوات تحسين محركات البحث المدمجة لتحسين ظهورك',
              ku: 'ئامرازی باشکردنی بزوێنەری گەڕانی ناوخۆیی بۆ باشکردنی دیارییت',
            },
          },
        ],
      },
      layout: {
        bg: 'white',
        padding: 'lg',
      },
      order: 1,
    },
    {
      id: 'section-6',
      pageId: 'page-4',
      type: 'cta',
      content: {
        title: {
          en: 'Get In Touch',
          ar: 'تواصل معنا',
          ku: 'پەیوەندیمان پێوە بکە',
        },
        details: {
          en: '<p>Have questions? We\'re here to help. Reach out to us and let\'s build something amazing together.</p>',
          ar: '<p>هل لديك أسئلة؟ نحن هنا للمساعدة. تواصل معنا ودعنا نبني شيئًا مذهلاً معًا.</p>',
          ku: '<p>پرسیارت هەیە؟ ئێمە لێرەین بۆ یارمەتیدان. پەیوەندیمان پێوە بکە و با شتێکی سەرنجڕاکێش پێکەوە دروست بکەین.</p>',
        },
        button: {
          text: {
            en: 'Contact Us',
            ar: 'اتصل بنا',
            ku: 'پەیوەندی بکە',
          },
          link: 'mailto:contact@example.com',
        },
        shareText: {
          en: 'Contact us for more information',
          ar: 'اتصل بنا لمزيد من المعلومات',
          ku: 'پەیوەندیمان پێوە بکە بۆ زانیاری زیاتر',
        },
      },
      layout: {
        bg: 'gradient',
        padding: 'xl',
        textAlign: 'center',
      },
      order: 1,
    },
  ],

  surveys: [
    {
      id: 'survey-1',
      slug: 'customer-satisfaction',
      title: {
        en: 'Customer Satisfaction Survey',
        ar: 'استبيان رضا العملاء',
        ku: 'ڕاپرسی ڕەزامەندی کڕیار',
      },
      description: {
        en: 'Help us improve by sharing your feedback',
        ar: 'ساعدنا على التحسين من خلال مشاركة ملاحظاتك',
        ku: 'یارمەتیمان بدە بۆ باشترکردن بە هاوبەشکردنی فیدباکەکەت',
      },
      isPublic: true,
      questions: [
        {
          id: 'q1',
          type: 'text',
          question: {
            en: 'What is your name?',
            ar: 'ما هو اسمك؟',
            ku: 'ناوت چییە؟',
          },
          required: true,
        },
        {
          id: 'q2',
          type: 'single-choice',
          question: {
            en: 'How satisfied are you with our platform?',
            ar: 'ما مدى رضاك عن منصتنا؟',
            ku: 'چەند ڕازی بوویت لە پلاتفۆرمەکەمان؟',
          },
          required: true,
          options: [
            {
              id: 'opt1',
              text: {
                en: 'Very Satisfied',
                ar: 'راضٍ جدًا',
                ku: 'زۆر ڕازیم',
              },
            },
            {
              id: 'opt2',
              text: {
                en: 'Satisfied',
                ar: 'راضٍ',
                ku: 'ڕازیم',
              },
            },
            {
              id: 'opt3',
              text: {
                en: 'Neutral',
                ar: 'محايد',
                ku: 'بێلایەن',
              },
            },
            {
              id: 'opt4',
              text: {
                en: 'Dissatisfied',
                ar: 'غير راضٍ',
                ku: 'ڕازی نیم',
              },
            },
          ],
        },
        {
          id: 'q3',
          type: 'multi-choice',
          question: {
            en: 'Which features do you use most? (Select all that apply)',
            ar: 'ما هي الميزات التي تستخدمها أكثر؟ (حدد كل ما ينطبق)',
            ku: 'کام تایبەتمەندییەکان زیاتر بەکاردێنیت؟ (هەموو ئەوانەی دەگونجێن دیاری بکە)',
          },
          required: false,
          options: [
            {
              id: 'feat1',
              text: {
                en: 'Page Builder',
                ar: 'منشئ الصفحات',
                ku: 'دروستکەری پەڕە',
              },
            },
            {
              id: 'feat2',
              text: {
                en: 'Survey Builder',
                ar: 'منشئ الاستبيانات',
                ku: 'دروستکەری ڕاپرسی',
              },
            },
            {
              id: 'feat3',
              text: {
                en: 'Multi-language Support',
                ar: 'دعم متعدد اللغات',
                ku: 'پشتگیری فرە زمانە',
              },
            },
            {
              id: 'feat4',
              text: {
                en: 'Rich Text Editor',
                ar: 'محرر النصوص الغني',
                ku: 'دەستکاریکەری دەقی دەوڵەمەند',
              },
            },
          ],
        },
      ],
      createdAt: new Date('2024-01-15').toISOString(),
    },
  ],
};

