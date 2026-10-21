// Turns profile.json into the full HTML page. No dependencies.

export const isTodo = (v) => typeof v === "string" && v.trim().startsWith("TODO");

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Text that may be a placeholder: placeholders get a dashed outline.
const t = (v) => (isTodo(v) ? `<span class="todo">${esc(v)}</span>` : esc(v ?? ""));

const visible = (list = []) => list.filter((x) => !x.hidden);

const external = (url) => /^https?:\/\//.test(url);

function title(text, url) {
  if (!url || isTodo(url)) return t(text);
  const attrs = external(url) ? ' target="_blank" rel="noopener"' : "";
  return `<a href="${esc(url)}"${attrs}>${t(text)}<span class="arrow" aria-hidden="true">↗</span></a>`;
}

function tags(list = []) {
  if (!list.length) return "";
  return `<ul class="tags">${list.map((x) => `<li>${t(x)}</li>`).join("")}</ul>`;
}

// One row: mono date/status on the left, title + detail on the right.
function entry({ when, heading, url, sub, body, extra, tagList, link }) {
  const linkNote = isTodo(link) ? `<p class="meta">${t(link)}</p>` : "";
  return `
      <article class="entry">
        <div class="when">${t(when)}</div>
        <div class="what">
          <h3>${title(heading, isTodo(link) ? null : link || url)}</h3>
          ${sub ? `<p class="sub">${t(sub)}</p>` : ""}
          ${body ? `<p>${t(body)}</p>` : ""}
          ${extra ? `<p class="meta">${t(extra)}</p>` : ""}
          ${linkNote}
          ${tags(tagList)}
        </div>
      </article>`;
}

function section(id, label, inner) {
  return `
    <section id="${id}" aria-labelledby="${id}-h">
      <h2 id="${id}-h">${label}</h2>
      ${inner}
    </section>`;
}

function railLink({ label, url }) {
  if (isTodo(url)) return `<li><span class="todo" title="${esc(url)}">${esc(label)}</span></li>`;
  const href = url.includes("@") && !url.startsWith("mailto:") ? `mailto:${url}` : url;
  const attrs = external(href) ? ' target="_blank" rel="noopener"' : "";
  return `<li><a href="${esc(href)}"${attrs}>${esc(label)}</a></li>`;
}

export function render(p) {
  const nav = [
    ["about", "About"],
    ["now", "Now"],
    ["research", "Research"],
    ["projects", "Projects"],
    ["education", "Education"],
    ["honors", "Honors"],
    ["skills", "Skills"],
  ];

  const now = section(
    "now",
    "Now",
    `<p class="meta">Updated ${esc(p.now.updated)}</p>
      <ul class="plain">${p.now.items.map((x) => `<li>${t(x)}</li>`).join("")}</ul>`
  );

  const research = section(
    "research",
    "Research",
    visible(p.research)
      .map((r) =>
        entry({
          when: r.dates,
          heading: r.title,
          link: r.link,
          sub: `${r.org} · ${r.role}`,
          body: r.summary,
          extra: r.result,
          tagList: r.tags,
        })
      )
      .join("") +
      `<h3 class="minor">Interested in</h3>
      <ul class="plain">${p.interests.map((x) => `<li>${t(x)}</li>`).join("")}</ul>`
  );

  const projects = section(
    "projects",
    "Projects",
    visible(p.projects)
      .map((x) =>
        entry({ when: x.status, heading: x.title, link: x.link, body: x.summary, tagList: x.tags })
      )
      .join("")
  );

  const cw = p.coursework;
  const course = (c) =>
    `<li><span class="code">${esc(c.code)}</span> ${t(c.name)}${
      c.current ? ' <span class="pill">now</span>' : ""
    }${cw.showGrades && c.grade && !isTodo(c.grade) ? ` <span class="grade">${esc(c.grade)}</span>` : ""}</li>`;

  const education = section(
    "education",
    "Education",
    visible(p.education)
      .map((e) => entry({ when: e.dates, heading: e.title, sub: e.detail }))
      .join("") +
      `<h3 class="minor">Selected coursework</h3>
      <div class="courses">
        ${cw.groups
          .map(
            (g) => `<div><p class="group">${esc(g.label)}</p><ul class="plain">${g.courses
              .map(course)
              .join("")}</ul></div>`
          )
          .join("")}
      </div>
      <p class="meta">${t(cw.note)}</p>`
  );

  const honors = section(
    "honors",
    "Honors &amp; activities",
    [...visible(p.honors), ...visible(p.activities)]
      .map((h) => entry({ when: h.dates, heading: h.title, sub: h.detail }))
      .join("")
  );

  const skills = section(
    "skills",
    "Skills",
    `<dl class="skills">${p.skills
      .map((s) => `<dt>${esc(s.label)}</dt><dd>${s.items.map(t).join(" · ")}</dd>`)
      .join("")}</dl>`
  );

  const photo =
    p.photo && !isTodo(p.photo)
      ? `<img class="photo" src="${esc(p.photo)}" alt="${esc(p.name)}" width="88" height="88">`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.name)}</title>
  <meta name="description" content="${esc(p.site.description)}">
  <meta property="og:title" content="${esc(p.name)}">
  <meta property="og:description" content="${esc(p.site.description)}">
  <meta property="og:url" content="${esc(p.site.url)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="layout">
    <header class="rail">
      ${photo}
      <h1>${esc(p.name)}</h1>
      <p class="headline">${t(p.headline)}</p>
      <p class="tagline">${t(p.tagline)}</p>
      <hr class="metal">
      <nav aria-label="Sections">
        <ul>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join("")}</ul>
      </nav>
      <ul class="links">${p.links.map(railLink).join("")}</ul>
    </header>

    <main id="main">
      ${section("about", "About", `<p class="lead">${t(p.about)}</p>`)}
      ${now}
      ${research}
      ${projects}
      ${education}
      ${honors}
      ${skills}
      <footer>
        <hr class="metal">
        <p>${t(p.personal)}</p>
        <p class="meta">${esc(p.fullName)} · ${esc(p.location)} · Built from one JSON file, no framework.</p>
      </footer>
    </main>
  </div>
</body>
</html>
`;
}
