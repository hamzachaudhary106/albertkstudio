import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { business } from "../data/content";
import { siteUrl } from "../data/seo";

type SeoProps = {
  title: string;
  description: string;
  /** Append the business name to the title. Defaults to true. */
  brandSuffix?: boolean;
};

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Updates document title, meta description, and canonical URL per route.
 * Keeps the static index.html tags as sensible defaults for the home page.
 */
export default function Seo({ title, description, brandSuffix = true }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = brandSuffix ? `${title} | ${business.name}` : title;
    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    const canonicalHref = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);

    setMeta('meta[property="og:url"]', "property", "og:url", canonicalHref);
  }, [title, description, brandSuffix, pathname]);

  return null;
}
