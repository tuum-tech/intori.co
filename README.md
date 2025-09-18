# Intori App
> Your data, connected

[intori.co](https://www.intori.co/)

## Getting Started

First, setup your `.env.local`

```bash
cp .env.example .env.local

# Edit .env.local and add your own values
```

Run the dev server:

```bash
npm install

npm run dev

# To check for linting, typescript, and nextjs errors
npm run build
```

## The Database
The database schema and migrations are managed in the miniapp repo: https://github.com/tuum-tech/intori-frames-v2-app

When changes are migrated there, you can sync the prisma generated types and client here by running:

```bash
npm run db:pull
```
