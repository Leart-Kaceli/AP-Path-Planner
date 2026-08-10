This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

![AP Path Planner CI](https://github.com/Leart-Kaceli/AP-Path-Planner/actions/workflows/ci.yml/badge.svg)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Local Development

Install dependencies:

```bash
npm install

## Firebase Emulator Testing

Start the Authentication and Firestore emulators:

```bash
npm run emulators

## Production Monitoring

AP Path Planner uses:

- Vercel Web Analytics for page-view and visitor reporting
- Vercel Speed Insights for Core Web Vitals
- Firebase Performance Monitoring for page-load and network traces
- Next.js client instrumentation for global browser errors
- A same-origin API endpoint for structured client-error logs

Client-error reports intentionally exclude:

- User email addresses
- Firebase user IDs
- Course contents
- Assignment contents
- Grade data
- Form values

## Monitoring Verification

After deployment:

1. Open the production application.
2. Navigate through several routes.
3. Check Vercel Analytics.
4. Check Vercel Speed Insights.
5. Check Firebase Performance.
6. Check Vercel logs for server errors.
7. Run deployed Playwright tests.

## Deployed Tests

Run smoke and accessibility tests against a live URL:

```bash
npx cross-env DEPLOYMENT_URL=https://your-domain.example npm run test:deployed
