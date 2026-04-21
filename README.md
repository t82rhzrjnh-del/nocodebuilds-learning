# nocodebuilds-learning

A Next.js app for learning Claude skills, MCPs, API usage, and beginner-to-agency workflows in one place.

It includes:

- A daily learning tracker with progress saved in localStorage
- A practical MCP reference with "where to use it" and "first prompt" guidance
- A live MCP radar fed by GitHub repository search
- A merged Beginner to Agency journey for turning learning into offers and delivery
- Lightweight agency and infrastructure ideas for monetising skills, MCPs, and Claude workflows

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file if you want higher GitHub API limits for the MCP radar route:

```bash
GITHUB_TOKEN=your_github_token_here
```

This is optional. Without it, the app still works, but the GitHub search route may hit rate limits faster.

## Key App Areas

### Daily Tasks

The Daily section breaks learning into a one-day-at-a-time flow with:

- task checkboxes
- notes per day
- exact steps
- common blockers
- quick jump arrows to the relevant section

Progress is stored in the browser using localStorage.

### MCP Radar

The live radar is served from [app/api/mcp-radar/route.ts](app/api/mcp-radar/route.ts).

It searches GitHub for recent MCP-related repositories, filters for relevance, and classifies each repo into a likely monetisation path such as:

- content and creative production
- sales and outreach automation
- knowledge and internal ops systems
- browser automation services
- dev workflow and shipping infrastructure

## Deploy To Vercel

### Option 1: Import from GitHub

1. Push the repo to GitHub.
2. Go to Vercel and choose `Add New Project`.
3. Import `t82rhzrjnh-del/nocodebuilds-learning`.
4. Let Vercel auto-detect Next.js.
5. Add `GITHUB_TOKEN` in the project environment variables if you want better MCP radar reliability.
6. Deploy.

### Option 2: Vercel CLI

Install the CLI:

```bash
npm i -g vercel
```

Run deployment from the project folder:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

If you use the MCP radar in production, add `GITHUB_TOKEN` in the Vercel project settings.

## Notes

- `node_modules`, `.next`, logs, and `.env.local` are ignored in git.
- The app is designed as a single-page learning and reference experience.
- The MCP radar depends on GitHub Search API availability.