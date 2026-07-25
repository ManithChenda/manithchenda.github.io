# Personal Portfolio Website

An about/CV page, a bilingual blog, projects, publications, teaching, talks, a
bookshelf, and a set of self-contained interactive audio visualizations — in a
minimalist terminal aesthetic, with a dark/light theme and English/Khmer language.

Built with **Jekyll**, hosted on **GitHub Pages**. No build tooling, no framework,
no bundler — GitHub builds it from source on every push.

Live at <https://manithchenda.github.io/>.

---

## Stack

| | |
|---|---|
| Generator | Jekyll (GitHub Pages' native build) |
| Templating | Liquid — layouts in `_layouts/`, partials in `_includes/` |
| Content | YAML in `_data/`, Markdown in `_posts/` |
| Styling | one hand-written stylesheet, `assets/css/site.css` |
| JavaScript | one file, `assets/js/toggles.js` (~70 lines) |
| Fonts | JetBrains Mono + Noto Serif Khmer, from Google Fonts |

Runtime JavaScript is limited to the theme toggle and remembering the language
preference. Everything else — routing, the language switch, all nine views — is
static HTML generated at build time.

## Structure

```
_config.yml               site config (url, baseurl, markdown, post defaults)
_layouts/
  default.html            <html>, <head>, terminal chrome, footer
  page.html               default + <main class="wrap">
  post.html               blog post view (680px column)
_includes/
  head.html               <title>, meta, Open Graph, hreflang, fonts, CSS/JS
  header.html             sticky header
  nav.html                8 nav pills (from _data/nav.yml)
  theme-lang-toggle.html  EN · ខ្មែរ switch + theme button
  footer.html             $ © … line
  page-header.html        shared `~/<page>` H1 + intro
  views/                  one include per screen: about, blog, projects,
                          publications, teaching, talks, bookshelf, viz
_data/                    ui.yml + education, experience, skills, publications,
                          teaching, talks, projects, books, vizzes, nav
                          (every item keeps its en:/km: sub-map)
_posts/                   YYYY-MM-DD-<slug>-{en,km}.md
assets/css/site.css       all styling; design tokens at the top
assets/js/toggles.js      the only runtime JS
assets/*.png              theme-swapped portraits
viz/*.html                standalone interactive visualizations
index.html … viz.html     English pages
km/index.html … km/viz.html   Khmer pages
```

## Pages

Nine views, each at a real URL, in two languages:

| view | English | ខ្មែរ |
|---|---|---|
| about / CV | `/` | `/km/` |
| blog index | `/blog/` | `/km/blog/` |
| blog post | `/blog/<slug>/` | `/km/blog/<slug>/` |
| projects | `/projects/` | `/km/projects/` |
| publications | `/publications/` | `/km/publications/` |
| teaching | `/teaching/` | `/km/teaching/` |
| talks | `/talks/` | `/km/talks/` |
| bookshelf | `/bookshelf/` | `/km/bookshelf/` |
| viz | `/viz/` | `/km/viz/` |

Standalone artifacts stay at `/viz/<artifact_name>.html`.

---

## How it works

### Language is a URL tree, not client state

The obvious approach — swap every string in JavaScript with no page load — cannot
give you a correct `<html lang>` per language, and cannot give you linkable,
indexable URLs. For an academic site that people cite and share, those matter more
than avoiding a page load.

So every view exists twice, at an English URL and a Khmer URL, and the
`EN · ខ្មែរ` switch is a plain link to the counterpart page. Each page carries an
`alt_url` in its front matter pointing at its twin; `_includes/theme-lang-toggle.html`
turns that into the link, and `_layouts/default.html` exposes it to JS as
`data-alt-url`.

`assets/js/toggles.js` still records the choice in `localStorage`, so:

- landing on `/` or `/km/` with a remembered language sends you to your language;
- any deeper link always renders the language of the URL you asked for;
- `?lang=en` / `?lang=km` forces and records a language.

The cost is that every page needs a twin file. They are thin — front matter plus a
single `{% include %}` — because all nine views live in `_includes/views/` and read
`page.lang`.

### Theme

`data-theme` on `<html>`, seeded from `prefers-color-scheme`, persisted to
`localStorage`. The script is deliberately **blocking** in `<head>` rather than
deferred, so the attribute is set before first paint and there is no flash of the
wrong theme. All colours are CSS custom properties scoped to
`:root[data-theme="…"]`, so the toggle is one attribute write.

The portrait is theme-swapped. Both images ship and CSS hides one, because the
theme is client state and cannot be resolved at build time.

### Typography across two scripts

Khmer is treated as a sibling design rather than a mirror: `html[data-lang="km"]`
switches the whole body to Noto Serif Khmer and loosens `line-height` from 1.75 to
2.05.

Terminal glyphs — `~/`, `//`, `:~$`, dates, years, tags, stack labels — stay in
JetBrains Mono in both languages, via a `.mono` utility class.

There is a second class, `.mono-prose`. A few *localised* strings are set in
monospace by the design (the footer line, `9 min`, `open ↗`), but JetBrains Mono
has no Khmer glyphs, so those use `'JetBrains Mono', 'Noto Serif Khmer', …` —
identical in English, legible in Khmer.

### Responsive

One breakpoint that matters: at ≤900px the eight nav pills take a full-width row of
their own rather than fraying mid-row beside the terminal handle. Below 560px,
padding and the CV grid columns tighten. Verified at 360 / 768 / 1200px.

---

## Editing

### Text and lists

`_data/*.yml`. Every entry carries an `en:` and a `km:` sub-map, so the two
languages can be edited independently:

```yaml
- years: "2025–now"
  en:
    module: "Internet of Things · Scientific Python"
    org: "TUX Global Institute, Phnom Penh"
  km:
    module: "អ៊ិនធឺណិតនៃវត្ថុ · ភាសា Python សម្រាប់វិទ្យាសាស្ត្រ"
    org: "វិទ្យាស្ថាន TUX Global ភ្នំពេញ"
```

Chrome labels and page intros live in `_data/ui.yml` under top-level `en:` / `km:`
maps. Nav order and the two URL trees are in `_data/nav.yml`.

### Adding a blog post

Two files per post, one per language, both in `_posts/`:

```
_posts/2026-08-01-my-new-post-en.md
_posts/2026-08-01-my-new-post-km.md
```

English file:

```markdown
---
lang: en
slug: my-new-post
title: "A title"
date: 2026-08-01
read: 7
tags: [embedded, hardware]
excerpt: "One or two sentences — this is what the blog index shows."
permalink: /blog/my-new-post/
alt_url: /km/blog/my-new-post/
---

Body in Markdown. Headings, lists, code, blockquotes, tables and images are all
styled in the terminal palette.
```

Khmer file: identical, with `lang: km`, the Khmer `title`/`excerpt`/body, and the
two URLs swapped (`permalink: /km/blog/my-new-post/`, `alt_url: /blog/my-new-post/`).

Rules that matter:

- The **filename date must match the `date:` field**, and the two files must share
  the same `slug`.
- `permalink` and `alt_url` are required — they are what ties the two language
  versions together and what the `EN · ខ្មែរ` switch follows.
- `layout: post` and `view: blog` come from `defaults:` in `_config.yml`; you do not
  need to repeat them.
- Posts appear only in their own language's blog index, newest first, automatically.
- To publish in one language only, just write the one file — but then the language
  switch on that post will 404, so point `alt_url` at `/blog/` (or `/km/blog/`)
  instead.

### Design tokens

Colours (both themes), the type scale and spacing are CSS custom properties at the
top of `assets/css/site.css`.

## Running locally

Not required to publish — GitHub builds the site itself. Useful for checking a post
before pushing:

```bash
bundle install && bundle exec jekyll serve
```

Then <http://localhost:4000>.

Needs **Ruby ≥ 2.7** (the `github-pages` gem's floor). macOS system Ruby is 2.6, so
you will need `brew install ruby` or a version manager like `rbenv`. This has no
bearing on publishing — GitHub builds with its own toolchain.

---

## Deploying to GitHub Pages

Done once. After that, publishing is `git push`.

### 0. Decide which kind of site this is

This fixes the repo name, the URL, and one config value.

| | **User site** | **Project site** |
|---|---|---|
| Repo name | exactly `<username>.github.io` | anything, e.g. `portfolio` |
| Live URL | `https://<username>.github.io/` | `https://<username>.github.io/<repo>/` |
| `baseurl:` | `""` | `"/<repo>"` |
| Limit | one per account | any number |

This site is a user site: repo `manithchenda.github.io`, `baseurl: ""`.

### 1. Set the site URL

In `_config.yml` — the only values you must change:

```yaml
url: "https://<username>.github.io"   # no trailing slash
baseurl: ""                           # or "/<repo>" for a project site
```

Getting these wrong does not break the pages, but canonical, `hreflang` and Open
Graph tags will be missing or wrong.

### 2. Make it a git repository

```bash
git init && git branch -M main && git add -A
```

Now look at what is staged, **before** committing:

```bash
git status --short
```

Expect ~64 files, and **no** `_site/`, `.jekyll-cache/` or `.claude/`. If any
appear, fix `.gitignore` first — unstaging later is more work than not staging now.
Then:

```bash
git commit -m "Academic portfolio site"
```

### 3. Create the empty repo on GitHub

At <https://github.com/new>:

- **Repository name** — exactly what step 0 decided. For a user site, a mismatch
  makes Pages treat it as a project site and every link 404s.
- **Public** — required for Pages on a free account. (Private repos can serve Pages
  only on a paid plan.)
- Do **not** tick "Add a README", ".gitignore" or "license" — this directory
  already has them, and an initialised repo makes the first push conflict.

Or, with the `gh` CLI, steps 3 and 4 in one:

```bash
gh repo create <repo> --public --source=. --remote=origin --push
```

### 4. Push

```bash
git remote add origin https://github.com/<username>/<repo>.git && git push -u origin main
```

### 5. Turn Pages on

In the repository: **Settings** → **Pages** → **Build and deployment**:

- **Source**: `Deploy from a branch`
- **Branch**: `main`, folder `/ (root)`
- **Save**

Do not choose "GitHub Actions" as the source — that path expects a workflow file
this repo does not need.

### 6. Wait for the build, then check it

The **Actions** tab shows a `pages build and deployment` run; the first takes one
to three minutes.

- Green check → visit the site.
- Red X → open the run and read the `build` step. Almost always a YAML syntax error
  in `_config.yml` or `_data/*.yml`; the log names the file and line.

Once live, confirm:

- `/` and `/km/` both load, and the `EN · ខ្មែរ` switch moves between them
- the theme toggle works and survives a page reload
- `/blog/hearing-machines/` renders
- `/viz/waveform.html` animates, and its `cd ../viz` link returns to `/viz/`
- the portrait appears (a broken image means `baseurl` is wrong)
- view source and check `<link rel="canonical">` points at your real domain

### From then on

```bash
git add -A && git commit -m "New post" && git push
```

Every push to `main` rebuilds and redeploys within a couple of minutes. Nothing to
build locally, nothing to upload.

### Things that will bite

- **Never add `.nojekyll`.** It switches the Jekyll build off, and GitHub serves the
  raw source files instead of the site.
- **Do not commit `_site/`.** It is generated; GitHub builds its own copy.
- **Renaming a user-site repo breaks it.** The name *is* the URL.
- **`.gitignore` only filters files git is not already tracking.** Once a path is
  committed, adding a rule for it does nothing — you need `git rm --cached <path>`.
  Check `git status --short` before the first commit, not after.
- **A custom domain** goes in Settings → Pages → Custom domain. It adds a `CNAME`
  file to the repo; set `url:` to the new domain and `baseurl: ""` afterwards.

---

## Licensing

There is no `LICENSE` file, so this is **all rights reserved** by default: you may
view and fork the repo on GitHub, but not reuse the code elsewhere.

If you want to reuse the build, ask — or, if you are adapting this README for your
own site, the usual split for a personal site is MIT for the code (`_layouts/`,
`_includes/`, `assets/css/`, `assets/js/`, `viz/*.html`) and all-rights-reserved or
CC BY-NC for the content (`_data/*.yml`, `_posts/`, `assets/*.png`). Putting MIT on
the whole repo would let anyone republish the bio, CV, posts and portrait verbatim
under their own name.

## Credits

Design and content by CHENDA Manith. The terminal aesthetic is inspired by a Unix-like CLI.
