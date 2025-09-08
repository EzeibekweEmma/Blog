import { Helmet } from 'react-helmet-async';
import { SEOProps } from '../interface';

export const SEO: React.FC<SEOProps> = ({
  title = 'Empire Report - Travel Guides & Global News',
  description = 'Discover the world with Empire Report. Get travel guides, breaking news, cultural stories, and visual journeys. Where adventure meets awareness.',
  keywords = 'travel guides, global news, travel blog, breaking news, cultural stories, travel tips, world news',
  image = 'https://empire-reports.com/og-image.jpg',
  url = 'https://empire-reports.com',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  categories,
  tags,
}) => {
  const siteTitle = 'Empire Report';
  const fullTitle = title.includes(siteTitle)
    ? title
    : `${title} | ${siteTitle}`;

  // Ensure description is within optimal length (150-160 characters)
  const optimizedDescription =
    description.length > 160
      ? description.substring(0, 157) + '...'
      : description;

  // Generate breadcrumb structured data for articles
  const generateBreadcrumbSchema = () => {
    if (type === 'article' && url.includes('/blogs/')) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://empire-reports.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blogs',
            item: 'https://empire-reports.com/blogs',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title.replace(' | Empire Report', ''),
            item: url,
          },
        ],
      };
    }
    return null;
  };

  // Generate main structured data
  const generateMainSchema = () => {
    if (type === 'article') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title.replace(' | Empire Report', ''),
        description: optimizedDescription,
        image: {
          '@type': 'ImageObject',
          url: image,
          width: 1200,
          height: 630,
        },
        author: {
          '@type': 'Person',
          name: author || 'Empire Report Team',
          url: 'https://empire-reports.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Empire Report',
          logo: {
            '@type': 'ImageObject',
            url: 'https://empire-reports.com/logo.png',
            width: 512,
            height: 512,
          },
          url: 'https://empire-reports.com',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        url: url,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        ...(categories && {
          articleSection: categories,
        }),
        ...(tags && {
          keywords: tags.join(', '),
        }),
        inLanguage: 'en-US',
        isAccessibleForFree: true,
      };
    }

    // Website schema for homepage and category pages
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Empire Report',
      alternateName: 'Empire Reports',
      url: 'https://empire-reports.com',
      description: optimizedDescription,
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate:
            'https://empire-reports.com/blogs?searchQuery={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Empire Report',
        url: 'https://empire-reports.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://empire-reports.com/logo.png',
        },
      },
    };
  };

  const mainSchema = generateMainSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Language and Location */}
      <meta name="language" content="en" />
      <meta httpEquiv="Content-Language" content="en" />
      <html lang="en" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={title.replace(' | Empire Report', '')}
      />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Empire Report" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />
      <meta
        name="twitter:image:alt"
        content={title.replace(' | Empire Report', '')}
      />
      <meta name="twitter:site" content="@EmpireReport" />
      <meta name="twitter:creator" content="@EmpireReport" />

      {/* Article-specific Open Graph tags */}
      {type === 'article' && (
        <>
          <meta
            property="article:author"
            content={author || 'Empire Report Team'}
          />
          <meta
            property="article:publisher"
            content="https://empire-reports.com"
          />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {categories &&
            categories.map((category: string) => (
              <meta
                key={category}
                property="article:section"
                content={category}
              />
            ))}
          {tags &&
            tags.map((tag: string) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Additional SEO Tags */}
      <meta name="author" content={author || 'Empire Report Team'} />
      <meta name="publisher" content="Empire Report" />
      <meta name="theme-color" content="#2c586a" />

      {/* Prevent automatic phone number detection */}
      <meta name="format-detection" content="telephone=no" />

      {/* Main Structured Data */}
      <script type="application/ld+json">{JSON.stringify(mainSchema)}</script>

      {/* Breadcrumb Structured Data for articles */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};
