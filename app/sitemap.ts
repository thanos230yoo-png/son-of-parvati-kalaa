import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://son-of-parvati-kalaa.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://son-of-parvati-kalaa.vercel.app/kalimaa",
      lastModified: new Date(),
    },
    {
      url: "https://son-of-parvati-kalaa.vercel.app/durgamaa",
      lastModified: new Date(),
    },
    {
      url: "https://son-of-parvati-kalaa.vercel.app/shiva",
      lastModified: new Date(),
    },
    {
      url: "https://son-of-parvati-kalaa.vercel.app/krishna",
      lastModified: new Date(),
    },
  ];
}