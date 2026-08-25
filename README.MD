# Rishi Garg — Developer Portfolio

A premium, dark-first developer portfolio built with plain HTML5, CSS3, and vanilla JavaScript. No frameworks, no build step — open `index.html` in a browser or serve the folder statically.

## Structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── resume/          
└── README.md
```

## Running locally

Any static server works, for example:

```bash
cd portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Things to configure before publishing

1. **Resume** — drop a PDF at `assets/resume/Rishi_Garg_Resume.pdf`. The "Download Resume" button checks for the file and warns if it's missing instead of pretending to work.
2. **Project GitHub links** — real repository URLs are not invented. Add them in `script.js` inside `initProjectRepoLinks()`:
   ```js
   const REPOS = [
     { title: 'Analytics Dashboard Backend Service', url: 'https://github.com/your-username/your-repo' },
   ];
   ```
   Until a URL is added, the button stays labeled "GitHub link — add repository URL" and does nothing on click.
3. **Live demo buttons** — not included, since no live project URLs were provided. Add a `<a class="btn btn--small btn--primary">Live Demo</a>` next to a project's GitHub button once a real deployed URL exists.
4. **Contact form** — validates in the browser only. Wire it to a real backend or a service (Formspree, EmailJS, your own API route) to actually deliver messages, and update the note text in `index.html` once it does.

## Design notes

- **Palette**: near-black background (`#050505`) with emerald (`#10B981`) and cyan (`#22D3EE`) accents; a full light theme is included via `[data-theme="light"]` (not a simple inversion).
- **Type**: Manrope for display headings, Inter for body copy, JetBrains Mono for code, terminal, and structural labels (eyebrows, tags).
- **Signature element**: the hero's floating editor + terminal workspace, with a real typing animation and blinking cursor, in place of a generic hero image.
- **Motion**: scroll-reveal, a scroll progress bar, active-section highlighting, animated stat counters (numeric fields only), and magnetic primary buttons. All motion respects `prefers-reduced-motion`.

## Data integrity

Every figure, project detail, and credential on this site comes directly from the resume it was built from. Nothing — job titles, metrics, repository links, problem counts — has been invented. Where information wasn't available (repo URLs, solved-problem counts, live demo links), the UI is left configurable rather than filled with placeholder numbers.
