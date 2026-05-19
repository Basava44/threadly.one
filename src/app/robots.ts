import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/threadly-admin/", "/cart/"],
    },
    sitemap: "https://threadly.one/sitemap.xml",
  };
}
