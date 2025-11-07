import type { ImageMetadata } from "astro";
import anisekaiImage from "../assets/project-card/anisekai.png";
import pptxGeneratorImage from "../assets/project-card/pptxgenerator.png";
import pdFlashgenImage from "../assets/project-card/pdflashgen.png";
import happyBirdImage from "../assets/project-card/happybird.png";
import ticTacToeImage from "../assets/project-card/tictactoe.png";
import chattRoomImage from "../assets/project-card/chatroom.png";
import draftedImage from "../assets/project-card/drafted.png";
import liveAgeClockImage from "../assets/project-card/liveageclock.png";
import imgBackgroundRemoverImage from "../assets/project-card/imgbgremover.png";
import devCheatSheetsImage from "../assets/project-card/devcheatsheets.png";

export type FeaturedProject = {
  id: string;
  type: "featured";
  title: string;
  description: string;
  image: ImageMetadata;
  tags: string[];
  href?: string;
};

export type PlaceholderProject = {
  id: string;
  type: "placeholder";
};

export type Project = FeaturedProject | PlaceholderProject;

export const projectsPerPage = 9;

export const featuredProjects: FeaturedProject[] = [
  {
    id: "anisekai",
    type: "featured",
    title: "ANISEKAI",
    description:
      "A mobile app to track, collect, and discover your favorite anime and manga.",
    image: anisekaiImage,
    tags: ["reactnative", "expo", "convex", "gemini"],
    href: "/projects/anisekai",
  },
  {
    id: "pptx-generator",
    type: "featured",
    title: "PPTX GENERATOR",
    description:
      "Full-stack React + FastAPI app that turns any topic into an AI-generated PPTX deck with Gemini.",
    image: pptxGeneratorImage,
    tags: ["react", "fastapi", "gemini", "python", "unsplash"],
    href: "/projects/pptx-generator",
  },
  {
    id: "pdflashgen",
    type: "featured",
    title: "PDFLASHGEN",
    description:
      "Transforms uploaded PDFs/TXTs lecture notes into Q and A flashcards with Gemini AI.",
    image: pdFlashgenImage,
    tags: ["nextjs", "react", "fastapi", "python", "gemini", "pypdf2"],
    href: "/projects/pdflashgen",
  },
  {
    id: "happy-bird",
    type: "featured",
    title: "HAPPY BIRD",
    description:
      "Happy Bird is a static web remake of Flappy Bird that runs entirely in vanilla HTML/CSS/JS.",
    image: happyBirdImage,
    tags: ["html", "css", "javascript"],
    href: "/projects/happybird",
  },
  {
    id: "tictactoe",
    type: "featured",
    title: "TIC TAC TOE",
    description:
      "A full-stack application that matches players in a live lobby with multi-round modes to choose from.",
    image: ticTacToeImage,
    tags: ["nodejs", "express", "socketio", "html", "css", "javascript"],
    href: "/projects/tictactoe",
  },
  {
    id: "chattroom",
    type: "featured",
    title: "CHATTROOM",
    description:
      "Real-time group chat app using React + Firebase with Google sign-in, and profanity filtering.",
    image: chattRoomImage,
    tags: ["react", "firebase", "jest"],
    href: "/projects/chattroom",
  },
  {
    id: "devcheatsheets",
    type: "featured",
    title: "DEVCHEATSHEETS",
    description:
      "A collection of cheatsheets for programming languages and dev tools.",
    image: devCheatSheetsImage,
    tags: ["html", "css", "javascript"],
    href: "/projects/devcheatsheets",
  },
  {
    id: "drafted",
    type: "featured",
    title: "DRAFTED",
    description:
      "Anonymous message-sharing web app embedded with Spotify music link.",
    image: draftedImage,
    tags: ["php", "mysql", "html", "css", "javascript"],
    href: "/projects/drafted",
  },
  {
    id: "live-age-clock",
    type: "featured",
    title: "LIVE AGE CLOCK",
    description:
      "A web tool that calculates and continuously displays a person's age based on their birthdate.",
    image: liveAgeClockImage,
    tags: ["html", "css", "javascript"],
    href: "/projects/live-age-clock",
  },
  {
    id: "img-background-remover",
    type: "featured",
    title: "IMG BG REMOVER",
    description:
      "A single-page web application that removes image backgrounds using the remove.bg REST API.",
    image: imgBackgroundRemoverImage,
    tags: ["html", "css", "javascript"],
    href: "/projects/img-background-remover",
  },
];

const minimumTotalProjects = projectsPerPage * 2;
const totalSlots = Math.max(
  minimumTotalProjects,
  Math.ceil(featuredProjects.length / projectsPerPage) * projectsPerPage
);
const placeholderCount = Math.max(0, totalSlots - featuredProjects.length);

export const placeholderProjects: PlaceholderProject[] = Array.from(
  { length: placeholderCount },
  (_, index) => ({
    id: `placeholder-${index + 1}`,
    type: "placeholder",
  })
);

export const allProjects: Project[] = [
  ...featuredProjects,
  ...placeholderProjects,
];

export const totalPages = Math.max(
  1,
  Math.ceil(allProjects.length / projectsPerPage)
);

export const pageNumbers = Array.from(
  { length: totalPages },
  (_, index) => index + 1
);

export type ProjectsPageData = {
  currentPage: number;
  projects: Project[];
  totalPages: number;
  pageNumbers: number[];
};

export function getProjectsPage(pageNumber: number): ProjectsPageData {
  const normalized = Number.isFinite(pageNumber) ? Math.trunc(pageNumber) : 1;
  const clampedPage = Math.min(
    totalPages,
    Math.max(1, normalized || 1)
  );
  const projects = allProjects.slice(
    (clampedPage - 1) * projectsPerPage,
    clampedPage * projectsPerPage
  );

  return {
    currentPage: clampedPage,
    projects,
    totalPages,
    pageNumbers,
  };
}
