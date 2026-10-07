const header = document.querySelector(".site-header");
const progress = document.querySelector("#scrollProgress");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");

function updateScrollUi() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("scrolled", y > 24);
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
}

window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const interest = document.querySelector("#interest");
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    if (interest) interest.value = link.dataset.interest || "";
  });
});

const form = document.querySelector("#interestForm");
const result = document.querySelector("#formResult");
const smsLink = document.querySelector("#smsLink");
const copyButton = document.querySelector("#copyMessage");
const copyStatus = document.querySelector("#copyStatus");
let generatedMessage = "";

function buildMessage(data) {
  const needs = String(data.get("needs") || "").trim() || "希望进一步沟通具体方案";
  return [
    "陶朋您好，我从红领巾劳动吧合作介绍页了解到项目，想咨询合作。",
    `合作方向：${data.get("interest")}`,
    `单位名称：${data.get("unit")}`,
    `所在地区：${data.get("region")}`,
    `联系人：${data.get("name")}`,
    `联系电话：${data.get("phone")}`,
    `合作设想：${needs}`,
  ].join("\n");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  generatedMessage = buildMessage(new FormData(form));
  smsLink.href = `sms:17366186124?&body=${encodeURIComponent(generatedMessage)}`;
  result.hidden = false;
  copyStatus.textContent = "";
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyButton?.addEventListener("click", async () => {
  if (!generatedMessage) return;
  try {
    await navigator.clipboard.writeText(generatedMessage);
    copyStatus.textContent = "已复制，可粘贴到微信或其他沟通工具。";
  } catch {
    const area = document.createElement("textarea");
    area.value = generatedMessage;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    copyStatus.textContent = "已复制，可粘贴到微信或其他沟通工具。";
  }
});
