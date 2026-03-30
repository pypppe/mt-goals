document.title = "Monkeytype Goals";

const favicon = document.querySelector("link[rel='icon']") || document.createElement("link");
favicon.rel = "icon";
favicon.href = "/images/mtg.png";
document.head.appendChild(favicon);

function setMeta(attributes) {
  const selector = Object.entries(attributes)
    .filter(([key]) => key !== "content")
    .map(([key, value]) => `[${key}="${value}"]`)
    .join("");

  const existing = document.querySelector(`meta${selector}`);
  const tag = existing || document.createElement("meta");

  for (const [key, value] of Object.entries(attributes)) {
    tag.setAttribute(key, value);
  }

  if (!existing) document.head.appendChild(tag);
}

setMeta({ property: "og:title",       content: "Monkeytype Goals" });
setMeta({ property: "og:description", content: "The best website to monitor & track your Monkeytype goals for free. Fully open-source, no tracking, no fluff." });
setMeta({ property: "og:image",       content: "https://www.mtgoals.cc/images/readme_picture.png" });
setMeta({ property: "og:url",         content: "https://www.mtgoals.cc/" });
setMeta({ property: "og:type",        content: "website" });

setMeta({ name: "theme-color",        content: "#e2b714" });

setMeta({ name: "twitter:card",        content: "summary_large_image" });
setMeta({ name: "twitter:title",       content: "Monkeytype Goals" });
setMeta({ name: "twitter:description", content: "The best website to monitor & track your Monkeytype goals. No data-tracking, No extensions, fully open-source. No fluff." });
setMeta({ name: "twitter:image",       content: "https://www.mtgoals.cc/images/readme_picture.png" });
