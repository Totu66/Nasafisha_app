<<<<<<< HEAD
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

# Vue-template
Let's build with vue

## Initialising the repository
> cd app
> npm install
> npm run dev

=> Open a new terminal and initialize the json server
> npm install -g json-server
> json-server --watch data/db.json
=======
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
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
