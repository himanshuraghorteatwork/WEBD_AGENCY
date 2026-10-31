# WEB-D Agency

Responsive agency website built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide icons, and self-hosted Inter. The frontend was built first; the Express/SQLite backend is separate in `server/`.

## Development

Node.js 24+ is required (uses built-in SQLite).

```sh
npm ci
cp .env.example .env  # only if .env does not already exist
npm run server       # terminal 1: API on port 3001
npm run dev          # terminal 2: frontend on port 5173
```

The provided local .env enables SQLite at `.data/agency.sqlite`. Without DATABASE_PATH, submission routes return an explicit unavailable error and never claim success. Database files and credentials are gitignored. Back up the database and use persistent disk in deployment. No external database credentials are needed for SQLite.

```sh
npm run build
npm test
npm run server  # serves the production dist and API together
```

## Admin

Generate a password hash with `node server/password.js` (hidden interactive input; minimum 14 characters). Put the output in `ADMIN_PASSWORD_HASH` in the server environment and restart the server. Visit `/admin`. No default credentials exist. Sessions use random opaque HttpOnly, SameSite=Strict cookies with an eight-hour expiry, login rate limiting and same-origin write checks. Set NODE_ENV=production and serve via HTTPS for Secure cookies. Sessions are in memory and intentionally end on restart. Use a single server instance or add a shared session store for horizontal deployment.

The dashboard provides JSON record management for leads, projects, portfolio, services, pricing and inquiries. This is a functional structured-data editor, not a visual CMS. Lead submissions appear in Leads; Inquiries supports separately managed contact records. Add/edit records as JSON arrays; pricing, services, and portfolio publish to the homepage on reload. Empty public collections use the local defaults in `src/data.ts`. Keep record IDs to retain their identity. Projects and inquiries are internal records.

Pricing defaults to “Custom quote” rather than invented fees. Change `src/data.ts` or save pricing records in admin. Portfolio entries are clearly labeled demonstration concepts with working in-page previews, not fictitious client projects. Testimonial content is explicitly a placeholder. Social profile links are omitted until real URLs are provided.

## AI

Set `AI_API_KEY` on the server and optionally `AI_MODEL` (default gpt-4.1-mini). The server calls https://api.openai.com; allow that destination in the deployment's network settings. Keys are never exposed through VITE_ variables. Without credentials or on upstream failure, the chatbot provides a clearly disclosed guided response. It asks visitors to submit their contact and project details through the validated inquiry form; it never claims chat messages are saved as leads. Live AI has not been tested without credentials.

## Launch configuration

- Replace the temporary text wordmark with the actual logo (no uploaded asset was present).
- Set PUBLIC_SITE_URL to the actual HTTPS origin; the server generates `/sitemap.xml` and `/robots.txt`. No invented domain is included.
- Add a canonical URL, og:url, and a branded social image after the domain/logo are available. Basic metadata and Open Graph title/description/type are included.
- Review legal pages and supply the business's registered identity, jurisdiction, retention policy, contact and genuine social profiles before commercial launch.
- Configure the admin hash, persistent database disk, backups, HTTPS and AI key if needed. The SQLite runtime currently emits Node's experimental API warning.

## Validation

`npm test` starts an isolated server with a temporary database and exercises invalid/valid lead submission, unauthorized access, origin checks, login/logout, stored leads, editable pricing, invalid content, chat fallback and sitemap generation. It does not use production credentials or data. Chromium validation also exercised mobile menu, portfolio filtering and modal, chatbot, and end-to-end inquiry submission at 390/768/1440px without horizontal overflow or runtime errors.

Respect reduced-motion preferences; animations and smooth scrolling are disabled and reveal content stays visible. Use the existing checkout for cloud tasks; do not create worktrees unless explicitly requested.
