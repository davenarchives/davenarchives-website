import type { MarkdownInstance, ImageMetadata } from "astro";
import deathCover from "../assets/blog-post/death.jpg";
import fearCover from "../assets/blog-post/fear.avif";
import manCover from "../assets/blog-post/man.jpg";
import prayerCover from "../assets/blog-post/prayer.jpg";
import paradoxicalCover from "../assets/blog-post/paradoxical.jpg";
import rainCover from "../assets/blog-post/rain.jpg";

export type BlogFrontmatter = {
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
  coverAlt?: string;
  readingTimeMinutes?: number;
};

type BlogContentModule = MarkdownInstance<BlogFrontmatter>;

type BlogMedia = {
  image: ImageMetadata;
  fallbackAlt?: string;
};

const blogMediaBySlug: Record<string, BlogMedia> = {
  death: {
    image: deathCover,
    fallbackAlt: "Silhouette facing a starry night sky with a soft glow",
  },
  fear: {
    image: fearCover,
    fallbackAlt: "Abstract dark gradient with the word fear",
  },
  man: {
    image: manCover,
    fallbackAlt: "Silhouette of a man under starlight representing body, mind, and spirit",
  },
  prayer: {
    image: prayerCover,
    fallbackAlt: "Hands held in prayer over soft light",
  },
  paradoxical: {
    image: paradoxicalCover,
    fallbackAlt: "Pink neon collage of intersecting geometric panels",
  },
  rain: {
    image: rainCover,
    fallbackAlt: "Rain falling over a field with a faint rainbow",
  },
};

const blogContentModules = import.meta.glob<BlogContentModule>(
  "../content/blogs/*.md",
  { eager: true }
);

export type BlogEntry = {
  slug: string;
  url: string;
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  coverAlt: string;
  readingTimeMinutes?: number;
  image: ImageMetadata;
  Content: BlogContentModule["default"];
};

const parsedBlogEntries: BlogEntry[] = Object.entries(blogContentModules)
  .map(([, module]): BlogEntry | undefined => {
    const normalizedPath = module.file.replace(/\\/g, "/");
    const slug = normalizedPath
      .split("/")
      .pop()
      ?.replace(/\.(md|mdx)$/, "");

    if (!slug) {
      return undefined;
    }

    const media = blogMediaBySlug[slug];
    if (!media) {
      return undefined;
    }

    const { frontmatter } = module;
    const publishDate = new Date(frontmatter.publishDate);
    if (Number.isNaN(publishDate.getTime())) {
      return undefined;
    }

    return {
      slug,
      url: `/blogs/${slug}`,
      title: frontmatter.title,
      description: frontmatter.description,
      publishDate,
      tags: frontmatter.tags,
      coverAlt:
        frontmatter.coverAlt ??
        media.fallbackAlt ??
        `${frontmatter.title} cover art`,
      readingTimeMinutes: frontmatter.readingTimeMinutes,
      image: media.image,
      Content: module.default,
    } satisfies BlogEntry;
  })
  .filter((entry): entry is BlogEntry => entry !== undefined)
  .sort(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  );

export const blogsPerPage = 6;
const totalBlogs = parsedBlogEntries.length;
export const blogTotalPages = Math.max(
  1,
  Math.ceil(totalBlogs / blogsPerPage)
);
export const blogPageNumbers = Array.from(
  { length: blogTotalPages },
  (_, index) => index + 1
);

export type BlogsPageData = {
  currentPage: number;
  blogs: BlogEntry[];
  totalPages: number;
  pageNumbers: number[];
};

export function getAllBlogs(): BlogEntry[] {
  return parsedBlogEntries;
}

export function getBlogBySlug(slug?: string | null): BlogEntry | undefined {
  if (!slug) {
    return undefined;
  }

  return parsedBlogEntries.find((entry) => entry.slug === slug);
}

export function getBlogsPage(pageNumber: number): BlogsPageData {
  const normalized = Number.isFinite(pageNumber)
    ? Math.trunc(pageNumber)
    : 1;
  const clampedPage = Math.min(
    blogTotalPages,
    Math.max(1, normalized || 1)
  );
  const blogs = parsedBlogEntries.slice(
    (clampedPage - 1) * blogsPerPage,
    clampedPage * blogsPerPage
  );

  return {
    currentPage: clampedPage,
    blogs,
    totalPages: blogTotalPages,
    pageNumbers: blogPageNumbers,
  };
}
