# paul-yj-zeng-18.github.io

Personal website of Paul Zeng. One file, `profile.json`, holds all the content; a small Node script renders it into a static page. No framework and no dependencies, just Node 20+.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Builds and serves at http://localhost:4321, rebuilding when you save |
| `npm run build` | Writes the site to `dist/` |
| `npm run todos` | Lists every placeholder still on the page |
| `npm run check` | Fails if any placeholder remains (run before launch) |

## Editing content

Everything lives in `profile.json`:

- Any string starting with `TODO` is a placeholder. It shows on the page with a dashed orange outline so nothing unfinished slips through.
- `"hidden": true` keeps an item in the data but off the page (used for Mirror and the high-school entry).
- `coursework.showGrades` toggles grades next to course codes.
- `photo`: set to a file in `public/` (e.g. `"photo.jpg"`), or `null` for text only.

The same file is meant to feed the résumé later, so keep it complete even where the site hides things.

## Layout

```
src/render.mjs     profile.json -> HTML
src/styles.css     silver / metallic theme, light + dark
public/            copied as-is (favicon, cv.pdf, photo)
build.mjs          build script
scripts/           placeholder check, local preview server
.github/workflows/ deploy to GitHub Pages on push to main
```

## Deploying

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**. On a free GitHub plan the repository must be public for Pages to serve it.

## Before launch

- [ ] `npm run check` passes
- [ ] `cv.pdf` added to `public/`
- [ ] Decide: photo or text only; show Mirror or not
- [ ] Check the page on a phone
