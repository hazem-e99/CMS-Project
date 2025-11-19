import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShareButton } from './ShareButton';

/**
 * Section Renderer Component
 * Renders different section types dynamically
 */
export const SectionRenderer = ({ section }) => {
  const { i18n } = useTranslation();

  const getLocalizedContent = (content) => {
    if (typeof content === 'object' && content !== null) {
      return content[i18n.language] || content.en || '';
    }
    return content || '';
  };

  const backgroundStyles = {
    white: 'bg-white dark:bg-gray-900',
    light: 'bg-gray-50 dark:bg-gray-800',
    dark: 'bg-gray-800 dark:bg-gray-900 text-white',
    gradient: 'bg-linear-to-r from-blue-600 to-purple-600 text-white',
    image: 'text-white',
  };

  const paddingStyles = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const textAlignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const bgType = section.layout?.bg;
  const bg = backgroundStyles[bgType] || backgroundStyles.white;
  const padding = paddingStyles[section.layout?.padding] || paddingStyles.md;
  const textAlign = textAlignStyles[section.layout?.textAlign] || textAlignStyles.left;
  const hasBackgroundImage = bgType === 'image' && section.layout?.backgroundImage;
  const backgroundStyle = hasBackgroundImage
    ? {
        backgroundImage: `url(${section.layout.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;
  const sectionClasses = `${bg} ${padding} ${textAlign} ${
    hasBackgroundImage ? 'relative overflow-hidden bg-cover bg-center' : ''
  }`;

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'header':
        return <HeaderSection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'image-left':
        return <ImageTextSection section={section} getLocalizedContent={getLocalizedContent} imagePosition="left" />;
      case 'image-right':
        return <ImageTextSection section={section} getLocalizedContent={getLocalizedContent} imagePosition="right" />;
      case 'cta':
        return <CTASection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'features':
        return <FeaturesSection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'testimonials':
        return <TestimonialsSection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'faq':
        return <FAQSection section={section} getLocalizedContent={getLocalizedContent} />;
      case 'rich':
        return <RichSection section={section} getLocalizedContent={getLocalizedContent} />;
      default:
        return null;
    }
  };

  return (
    <section className={sectionClasses} style={backgroundStyle}>
      {hasBackgroundImage && <div className="absolute inset-0 bg-black/60" aria-hidden="true" />}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hasBackgroundImage ? 'relative z-10' : ''}`}>
        {renderContent()}
        {section.content?.shareText && (
          <div className="mt-8 flex justify-center">
            <ShareButton
              title={getLocalizedContent(section.content.title)}
              text={getLocalizedContent(section.content.shareText)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Hero Section
const HeroSection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const button = section.content?.button;
  const image = section.content?.image;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-12 shadow-2xl">
      <div className="absolute inset-0 opacity-10">
        <div className="w-64 h-64 bg-white rounded-full blur-3xl absolute -top-10 -left-10" />
        <div className="w-72 h-72 bg-white rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>
      <div className="relative grid md:grid-cols-2 gap-10 items-center">
        <div>
          {title && <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{title}</h1>}
          {details && (
            <div
              className="text-lg md:text-xl text-indigo-100 mb-8"
              dangerouslySetInnerHTML={{ __html: details }}
            />
          )}
          {button?.text && (
            <a
              href={button.link || '#'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              {getLocalizedContent(button.text)}
            </a>
          )}
        </div>
        {image && (
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
            <img
              src={image}
              alt={title || 'Hero image'}
              className="relative z-10 rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Header Section
const HeaderSection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const button = section.content?.button;

  return (
    <div className="text-center">
      {title && <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>}
      {details && (
        <div
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
      {button?.text && (
        <a
          href={button.link || '#'}
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {getLocalizedContent(button.text)}
        </a>
      )}
    </div>
  );
};

// Image + Text Section
const ImageTextSection = ({ section, getLocalizedContent, imagePosition }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const image = section.content?.image;
  const button = section.content?.button;

  const isRTL = document.documentElement.dir === 'rtl';
  const effectivePosition = isRTL ? (imagePosition === 'left' ? 'right' : 'left') : imagePosition;

  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${effectivePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
      <div className={effectivePosition === 'right' ? 'md:order-2' : ''}>
        {image && (
          <img
            src={image}
            alt={title || 'Section image'}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        )}
      </div>
      <div className={effectivePosition === 'right' ? 'md:order-1' : ''}>
        {title && <h2 className="text-3xl font-bold mb-4 dark:text-white">{title}</h2>}
        {details && (
          <div
            className="text-gray-600 dark:text-gray-300 mb-6"
            dangerouslySetInnerHTML={{ __html: details }}
          />
        )}
        {button?.text && (
          <a
            href={button.link || '#'}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {getLocalizedContent(button.text)}
          </a>
        )}
      </div>
    </div>
  );
};

// CTA Section
const CTASection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const button = section.content?.button;

  return (
    <div className="text-center">
      {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
      {details && (
        <div
          className="text-lg mb-8 max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
      {button?.text && (
        <a
          href={button.link || '#'}
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          {getLocalizedContent(button.text)}
        </a>
      )}
    </div>
  );
};

// Features Section
const FeaturesSection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const features = section.content?.features || [];

  return (
    <div>
      {title && <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">{title}</h2>}
      {details && (
        <div
          className="text-center text-gray-600 dark:text-gray-300 mb-12"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow dark:bg-gray-800">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              {getLocalizedContent(feature.title)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {getLocalizedContent(feature.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Testimonials Section
const TestimonialsSection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);
  const testimonials = section.content?.testimonials || [];

  return (
    <div>
      {title && <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">{title}</h2>}
      {details && (
        <div
          className="text-center text-gray-600 dark:text-gray-300 mb-12"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">{testimonial.avatar}</div>
              <div>
                <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getLocalizedContent(testimonial.role)}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "{getLocalizedContent(testimonial.text)}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection = ({ section, getLocalizedContent }) => {
  const [openIndex, setOpenIndex] = React.useState(null);
  const title = getLocalizedContent(section.content?.title);
  const faqs = section.content?.faqs || [];

  return (
    <div className="max-w-3xl mx-auto">
      {title && <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{title}</h2>}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-semibold dark:text-white">
                {getLocalizedContent(faq.question)}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                {getLocalizedContent(faq.answer)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Rich HTML Section
const RichSection = ({ section, getLocalizedContent }) => {
  const title = getLocalizedContent(section.content?.title);
  const details = getLocalizedContent(section.content?.details);

  return (
    <div className="max-w-4xl mx-auto">
      {title && <h2 className="text-3xl font-bold mb-6 dark:text-white">{title}</h2>}
      {details && (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
    </div>
  );
};

