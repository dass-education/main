const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".global-nav");
const progress = document.querySelector(".scroll-progress span");

const navHome = navigation?.parentNode;
const navNextSibling = navigation?.nextSibling;
let lockedScrollY = 0;

const lockPageScroll = () => {
  lockedScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.classList.add("menu-open");
};

const unlockPageScroll = () => {
  document.body.classList.remove("menu-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, lockedScrollY);
};

const moveNavToViewport = () => {
  if (navigation && navigation.parentNode !== document.body) {
    document.body.appendChild(navigation);
  }
};

const restoreNavHome = () => {
  if (!navigation || !navHome || navigation.parentNode === navHome) return;
  if (navNextSibling && navNextSibling.parentNode === navHome) {
    navHome.insertBefore(navigation, navNextSibling);
  } else {
    navHome.appendChild(navigation);
  }
};

const closeMenu = () => {
  const wasOpen = menuButton?.getAttribute("aria-expanded") === "true";
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  header?.classList.remove("is-menu-open");
  if (wasOpen) unlockPageScroll();
  restoreNavHome();
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
    return;
  }

  lockPageScroll();
  moveNavToViewport();
  menuButton.setAttribute("aria-expanded", "true");
  navigation?.classList.add("is-open");
  header?.classList.add("is-menu-open");
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && menuButton?.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }
});

const updateScroll = () => {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("is-scrolled", scrollTop > 30);
  if (progress) progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6%" },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
