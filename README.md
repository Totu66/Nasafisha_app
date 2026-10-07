# Nasafisha App

This repository is organized so the application code lives under an `app/` directory.

## Folder Structure

```text
Nasafisha_app/
├── README.md
├── app/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── .prettierrc
│   ├── .vscode/
│   │   └── extensions.json
│   ├── data/
│   │   └── db.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── playwright.config.ts
│   ├── postcss.config.mjs
│   ├── tailwind.config.mjs
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── vite.config.js
│   ├── vitest.config.ts
│   ├── public/
│   │   ├── infospace-meta.png
│   │   ├── logo-dark.png
│   │   ├── logo-light.png
│   │   ├── manifest.webmanifest
│   │   ├── offline.html
│   │   ├── vite.svg
│   │   └── icons/
│   │       ├── icon-192.png
│   │       ├── icon-512.png
│   │       └── icon-maskable.png
│   └── src/
│       ├── App.vue
│       ├── main.js
│       ├── style.css
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── composables/
│       ├── config/
│       ├── helpers/
│       ├── i18n/
│       ├── layouts/
│       ├── offline/
│       ├── providers/
│       ├── router/
│       ├── store/
│       ├── types/
│       ├── views/
│       └── tests/
└── .git/
```

## Getting started

```bash
cd app
npm install
npm run dev
```

To run the mock API locally:

```bash
npm install -g json-server
json-server --watch data/db.json
```

## Notes

- The frontend app root is `app/`.
- Environment variables should be kept in `app/.env` and copied from `app/.env.example`.
- Built-in config and tooling are already in place for Vite, Vue, Tailwind, ESLint, Vitest, and Playwright.