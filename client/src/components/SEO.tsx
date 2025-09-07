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
}) => {
  const siteTitle = 'Empire Report';
  const fullTitle = title.includes(siteTitle)
    ? title
    : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific tags */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: fullTitle,
          description: description,
          url: url,
          image: image,
          ...(type === 'article' &&
            author && {
              author: {
                '@type': 'Person',
                name: author,
              },
            }),
          ...(type === 'article' &&
            publishedTime && {
              datePublished: publishedTime,
            }),
          ...(type === 'website' && {
            potentialAction: {
              '@type': 'SearchAction',
              target:
                'https://empire-reports.com/blogs?searchQuery={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        })}
      </script>
    </Helmet>
  );
};
