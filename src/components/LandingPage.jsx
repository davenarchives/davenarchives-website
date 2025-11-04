import { useEffect, useRef } from "react";
import tvFrame from "../assets/retrotelevision.png";
import catPlayGif from "../assets/cattyping.gif";
import catSleepGif from "../assets/catsleeping.gif";
import "../styles/landing.css";

const panelConfigs = [
  {
    id: "start",
    variant: "tutorial",
    eyebrow: "STUCK IN TUTORIAL HELL?",
    body: [
      { content: "You've watched 999 hours of JavaScript tutorials..." },
      {
        content: (
          <>
            but still can't{" "}
            <span className="tutorial-banner__accent">CENTER A DIV.</span>
          </>
        ),
        modifier: "tutorial-banner__body--tight",
      },
    ],
    footer: {
      href: "#solution",
      content: "oh no. 😢",
    },
  },
  {
    id: "solution",
    variant: "solution",
    eyebrow: "SOLUTION",
    body: [
      { content: "Embrace the chaos." },
      {
        content: (
          <>
            Welcome to <span>VIBE CODING.</span>
          </>
        ),
        modifier: "solution-banner__body--accent",
      },
    ],
    footer: {
      href: "#stop-watching",
      content: "but like how? 🤔",
    },
  },
  {
    id: "stop-watching",
    variant: "stop",
    eyebrow: "STOP WATCHING",
    body: [
      {
        content: (
          <>
            Tutorials you'll forget{" "}
            <span className="stop-banner__accent">TOMORROW.</span>
          </>
        ),
      },
    ],
    footer: {
      href: "#start-building",
      content: "what? why? 🤨",
    },
  },
  {
    id: "start-building",
    variant: "build",
    eyebrow: "START BUILDING",
    body: [
      {
        content: (
          <>
            Stuff that <span className="build-banner__accent">BARELY WORKS</span>{" "}
            &mdash; and fix it live.
          </>
        ),
      },
      {
        content: (
          <>
            Learn coding fundamentals by{" "}
            <span className="build-banner__accent">BREAKING THEM.</span>
          </>
        ),
        modifier: "build-banner__body--accent",
      },
    ],
    footer: {
      href: "#have-fun",
      content: "is that possible? 😳",
    },
  },
  {
    id: "have-fun",
    variant: "fun",
    eyebrow: "HAVE FUN",
    body: [
      {
        content: (
          <>
            Stop learning.{" "}
            <span className="fun-banner__accent">START DOING.</span>
          </>
        ),
      },
      { content: "Make weird stuff that works!" },
    ],
    footer: {
      href: "#blogs",
      content: "hell yeah! 😎",
    },
  },
];

const CalloutPanel = ({ config }) => {
  const { id, variant, eyebrow, body, footer } = config;
  const sectionClassName = `callout-section ${variant}-section reveal-on-scroll`;
  const bannerClassName = `callout-banner ${variant}-banner`;
  const eyebrowClassName = `callout-banner__eyebrow ${variant}-banner__eyebrow`;
  const footerClassName = `callout-banner__footer ${variant}-banner__footer`;
  const footerLinkClassName = `callout-banner__footer-link ${variant}-banner__footer-link`;

  return (
    <section id={id} className={sectionClassName}>
      <div className={bannerClassName}>
        <p className={eyebrowClassName} data-reveal-order="1">
          {eyebrow}
        </p>
        {body.map((line, index) => (
          <p
            key={`${variant}-line-${index}`}
            className={[
              "callout-banner__body",
              `${variant}-banner__body`,
              line.modifier ?? "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-reveal-order={index + 2}
          >
            {line.content}
          </p>
        ))}
        <p className={footerClassName} data-reveal-order={body.length + 2}>
          <a className={footerLinkClassName} href={footer.href}>
            {footer.content}
          </a>
        </p>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const pageRef = useRef(null);
  const tvFrameSrc = tvFrame?.src ?? tvFrame;
  const catPlaySrc = catPlayGif?.src ?? catPlayGif;
  const catSleepSrc = catSleepGif?.src ?? catSleepGif;

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const triggers = Array.from(
      page.querySelectorAll(".hover-gif-trigger")
    );
    const hoverGif = page.querySelector("#hover-gif");
    const hoverGifImage = hoverGif?.querySelector("img");

    if (!triggers.length || !hoverGif || !hoverGifImage) {
      return;
    }

    const gifSources = {
      play: hoverGif.dataset.gifPlay || hoverGifImage.src,
      sleep: hoverGif.dataset.gifSleep || hoverGifImage.src,
    };

    let gifWidth = 0;
    let gifHeight = 0;
    let lastTrigger = null;
    let pendingFrame = 0;

    const measureGif = () => {
      gifWidth =
        hoverGifImage.offsetWidth ||
        hoverGifImage.naturalWidth ||
        gifWidth;
      gifHeight =
        hoverGifImage.offsetHeight ||
        hoverGifImage.naturalHeight ||
        gifHeight;
    };

    if (hoverGifImage.complete) {
      measureGif();
    } else {
      hoverGifImage.addEventListener("load", measureGif, { once: true });
    }

    const positionAboveText = (event, { lockY = false } = {}) => {
      if (!gifWidth || !gifHeight) measureGif();
      const currentTarget =
        event && event.currentTarget instanceof HTMLElement
          ? event.currentTarget
          : null;
      const target = currentTarget || lastTrigger;
      const rect = target?.getBoundingClientRect();
      const clientX =
        (event && typeof event.clientX === "number" && event.clientX) ??
        (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
      const clientY = lockY
        ? null
        : (event && typeof event.clientY === "number" && event.clientY) ??
          rect?.top ??
          window.innerHeight / 2;
      const x = clientX - gifWidth / 2;
      const referenceY = clientY ?? rect?.top ?? window.innerHeight / 2;
      const y = referenceY - gifHeight + 54;
      hoverGif.style.transform = `translate(${Math.round(x)}px, ${Math.round(
        Math.max(y, 12)
      )}px)`;
    };

    const handleMouseMove = (event) => {
      if (!hoverGif.classList.contains("visible")) return;
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(() => {
        positionAboveText(event, { lockY: true });
        pendingFrame = 0;
      });
    };

    const handleViewportChange = () => {
      if (!lastTrigger) return;
      positionAboveText(null);
    };

    const handleEnter = (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) return;
      const gifType = target.getAttribute("data-gif");
      const nextSrc = (gifType && gifSources[gifType]) || gifSources.play;
      if (nextSrc && hoverGifImage.src !== nextSrc) {
        hoverGifImage.src = nextSrc;
        measureGif();
      }
      lastTrigger = target;
      hoverGif.classList.add("visible");
      positionAboveText(event);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, {
        passive: true,
      });
    };

    const handleLeave = () => {
      hoverGif.classList.remove("visible");
      if (pendingFrame) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = 0;
      }
      lastTrigger = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("mouseenter", handleEnter);
      trigger.addEventListener("mouseleave", handleLeave);
      trigger.addEventListener("focus", handleEnter);
      trigger.addEventListener("blur", handleLeave);
    });

    return () => {
      triggers.forEach((trigger) => {
        trigger.removeEventListener("mouseenter", handleEnter);
        trigger.removeEventListener("mouseleave", handleLeave);
        trigger.removeEventListener("focus", handleEnter);
        trigger.removeEventListener("blur", handleLeave);
      });
      hoverGif.classList.remove("visible");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const revealSections = Array.from(
      page.querySelectorAll(".reveal-on-scroll")
    );

    if (!revealSections.length) return;

    const applyDelays = (section) => {
      const revealItems = section.querySelectorAll("[data-reveal-order]");
      revealItems.forEach((item, index) => {
        const orderAttr = item.dataset.revealOrder;
        const order = orderAttr ? parseFloat(orderAttr) : index + 1;
        const delay = Math.max(order * 0.12 - 0.05, 0);
        item.style.setProperty("--reveal-delay", `${delay}s`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          applyDelays(section);
          if (entry.isIntersecting) {
            section.classList.add("is-visible");
          } else {
            section.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -20% 0px",
      }
    );

    revealSections.forEach((section) => {
      applyDelays(section);
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="page">
      <header className="site-header">
        <div className="logo">
          <svg
            className="logo-mark"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 17h36l-18-9-18 9zm6 3v15h6V20h-6zm10 0 v15 h4V20h-4zm8 0 v15 h6V20h-6z M8 38 v-3 h32 v3 H8z"
              fill="#f8b318"
            />
          </svg>
          <span className="logo-type">DAVENARCHIVES</span>
        </div>
        <nav className="site-nav">
          <a href="#blogs">blogs</a>
          <a href="#projects">projects</a>
          <label className="search">
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            >
              <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input type="search" placeholder="Search" />
          </label>
        </nav>
      </header>
      <main className="hero">
        <section className="hero-copy">
          <h1>
            <span className="line">THE ART OF</span>
            <span className="line line--accent">VIBE CODING.</span>
          </h1>
          <p className="tagline">
            <span className="tagline-line">
              Turn syntax errors into happy accidents —
            </span>
            <span className="tagline-line tagline-line--accent">
              <span className="highlight highlight--yellow hover-gif-trigger" data-gif="play">
                vibe harder
              </span>, {" "}
              <span className="highlight highlight--pink hover-gif-trigger" data-gif="sleep">
                code faster.
              </span>
            </span>
          </p>
          <a className="cta" href="#start">LEARN MORE</a>
        </section>
        <section className="hero-visual" aria-label="Retro television">
          <img className="tv" src={tvFrameSrc} alt="" role="presentation" />
        </section>
      </main>
      {panelConfigs.map((panel) => (
        <CalloutPanel key={panel.id} config={panel} />
      ))}
      <div className="hover-gif" id="hover-gif" data-gif-play={catPlaySrc} data-gif-sleep={catSleepSrc} aria-hidden="true">
        <img src={catPlaySrc} alt="Cat typing enthusiastically" />
      </div>
    </div>
  );
};

export default LandingPage;
