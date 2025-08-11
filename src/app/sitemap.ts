import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://meisho-maru.com';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/reservation`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/admin/schedule`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.4,
    },
  ];
}