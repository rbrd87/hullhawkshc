# Hull Hawks

A modern Hull Hawks Hockey Club website built with Next.js, React, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Data

The UI currently uses clearly-labelled demo data so the design can be developed independently of the England Hockey API.

The integration boundary is `lib/hockey.ts`.

Once Hull Hawks has the authorised England Hockey GMS API details, `getHawksData()` can be replaced with the real request. The intended production caching policy is 24 hours:

```ts
const response = await fetch(url, {
  next: { revalidate: 86_400 },
});
```

This means a visitor gets a fast cached response and Next.js revalidates the upstream data when the cache has expired.

## Known England Hockey pages

- Club: https://yne.englandhockey.co.uk/clubs/hull-hawks-hc/info
- Team: https://yne.englandhockey.co.uk/teams/hull-hawks-1-womens
- Competition: YNE Peak & Wold Women's Division 1 (2026/27)
