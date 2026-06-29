const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const topLinks = document.querySelectorAll('a[href="#top"]');
const revealItems = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const year = document.querySelector("#year");
const preloader = document.querySelector("[data-preloader]");
const loaderWord = document.querySelector("[data-loader-word]");
const GREETING_INTERVAL_MS = 45;
const GREETING_DURATION_MS = 1250;

const greetings = [
  "Halo",
  "Hello",
  "Hola",
  "Bonjour",
  "Olá",
  "Ciao",
  "Hallo",
  "Salam",
  "مرحبا",
  "שלום",
  "नमस्ते",
  "வணக்கம்",
  "你好",
  "こんにちは",
  "안녕하세요",
  "สวัสดี",
  "Xin chào",
  "សួស្តី",
  "မင်္ဂလာပါ",
  "Привет",
  "Γεια",
  "გამარჯობა",
  "Selam",
  "Hej",
  "Kia ora",
  "Mabuhay",
  "Ahoj",
  "Salut",
];

const nonLatinScriptPattern =
  /[\u0400-\u04ff\u0590-\u05ff\u0600-\u06ff\u0900-\u097f\u0b80-\u0bff\u1000-\u109f\u1780-\u17ff\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u10a0-\u10ff]/;

const setLoaderWord = (word) => {
  if (!loaderWord) return;

  const visibleLength = Array.from(word.replace(/\s/g, "")).length;
  const isScript = nonLatinScriptPattern.test(word);

  loaderWord.textContent = word;
  loaderWord.classList.toggle("is-script", isScript);
  loaderWord.classList.toggle("is-long", visibleLength > (isScript ? 5 : 7));
};

const revealPage = () => {
  document.body.classList.add("preload-done");
  document.body.classList.remove("is-loading");

  window.setTimeout(() => {
    document.body.classList.add("photo-floating");
  }, 1500);
};

const finishPreloader = () => {
  if (!preloader) {
    revealPage();
    return;
  }

  setLoaderWord("Hello");
  preloader.classList.add("is-final");

  window.setTimeout(() => {
    preloader.classList.remove("is-final");
    preloader.classList.add("is-clearing");
  }, 430);

  window.setTimeout(() => {
    preloader.classList.add("is-cracking");
  }, 820);

  window.setTimeout(() => {
    revealPage();
  }, 1900);

  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    preloader.setAttribute("aria-hidden", "true");
  }, 2240);

  window.setTimeout(() => {
    preloader.remove();
  }, 2520);
};

const startPreloader = () => {
  if (!preloader || !loaderWord) {
    revealPage();
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    setLoaderWord("Hello");
    revealPage();
    preloader.remove();
    return;
  }

  let greetingIndex = 0;
  setLoaderWord(greetings[greetingIndex]);

  const greetingTimer = window.setInterval(() => {
    greetingIndex += 1;
    setLoaderWord(greetings[greetingIndex % greetings.length]);
  }, GREETING_INTERVAL_MS);

  window.setTimeout(() => {
    window.clearInterval(greetingTimer);
    finishPreloader();
  }, GREETING_DURATION_MS);
};

if (year) {
  year.textContent = new Date().getFullYear();
}

if (document.readyState !== "loading") {
  startPreloader();
} else {
  window.addEventListener("DOMContentLoaded", startPreloader, { once: true });
}

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

topLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  });
});

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

let pointerFrame = null;

hero.addEventListener("pointermove", (event) => {
  if (pointerFrame) return;

  pointerFrame = requestAnimationFrame(() => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    hero.style.setProperty("--mx", `${x.toFixed(1)}%`);
    hero.style.setProperty("--my", `${y.toFixed(1)}%`);
    pointerFrame = null;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  revealObserver.observe(item);
});
