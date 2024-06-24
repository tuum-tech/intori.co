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
yarn install

npm run dev

# To check for linting, typescript, and nextjs errors
npm run build
```

## Populate fake user answers

Your `NEXTAUTH_URL` must start with `http://localhost` and you must be logged in with Farcaster.

Go to `/api/test` to populate 3 fake user answers with your authenticated FID.
