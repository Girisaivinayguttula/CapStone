# CABA Bakery

Modern single‑page e‑commerce web application built with Angular 18, Angular Material, and a modular, component‑driven architecture. It showcases product browsing, shopping cart, checkout flow, authentication, guarded routes, UI feedback (spinner + modals), and clean separation of concerns via services and guards.

## ✨ Key Features

- Responsive layout with reusable `navbar`, `footer`, and shared UI elements
- Product listing (shop) and detail display patterns (extensible)
- Add to cart, cart management, and checkout flow scaffold
- Authentication (login / signup components) with route protection via `AdminGuard`
- Orders & order history view structure
- Popup / modal service + dynamic popup component
- Global loading spinner service & component
- About Us & Home marketing pages
- Centralized environment configs (`environment.ts`, `environment.prod.ts`)
- Clean folder segmentation: Components / Services / Guards / Assets
- Linting with ESLint + Angular ESLint rules
- Unit testing setup (Jasmine + Karma)

## 🗂️ Project Structure (Core Folders)

```
src/
	app/
		Component/        # All visual + feature components (aboutus, cart, checkout, etc.)
		Services/         # Injectable services (auth, products, spinner, popup, common)
		guards/           # Route guards (e.g., admin.guard.ts)
		environments/     # Environment config files
	assests/images/     # Static images (branding, product placeholders)
	styles.css          # Global styles
	main.ts             # App bootstrap
```

> Note: Folder `assests` appears to be a misspelling; consider renaming to `assets` (and updating angular.json) for convention alignment.

## 🛠️ Tech Stack

- Angular 18 (`@angular/core` ^18.2.0)
- Angular Material & CDK
- RxJS 7.8
- TypeScript 5.5
- Zone.js 0.14
- Jasmine + Karma (unit tests)
- ESLint (Angular & TypeScript rules)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- (Optional) Angular CLI globally: `npm install -g @angular/cli`

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```
Serves at: http://localhost:4200 (default). The dev server reloads on file changes.

### Run Unit Tests

```bash
npm test
```
Runs Karma + Jasmine in watch mode.

### Lint the Codebase

If an npm script is later added (recommended):
```bash
npm run lint
```
Currently you can invoke ESLint directly (example):
```bash
npx eslint "src/**/*.ts"
```

### Production Build

```bash
npm run build
```
Outputs the production bundle to `dist/` (optimize, minify, AOT by default in Angular 18).

## 🔐 Authentication & Guards

- `auth.service.ts`: Placeholder for login/signup logic (extend with real backend calls / JWT storage)
- `admin.guard.ts`: Protects routes intended only for admin users; integrate with auth state once implemented.

## 🧩 Services Overview

| Service | Purpose |
|---------|---------|
| `login.service.ts` | Handles login logic (credentials submission placeholder) |
| `auth.service.ts`  | Auth state abstraction / token patterns (extendable) |
| `products.service.ts` | Product retrieval logic (mock or future API integration) |
| `spinner.service.ts` | Central show/hide loading indicator |
| `popup-modal.service.ts` | Opens/closes popup component instances |
| `common.service.ts` | Shared utility methods (cross-cutting concerns) |

## 🧱 Adding a New Component

1. Generate with Angular CLI (recommended):
	 ```bash
	 npx ng generate component Component/feature-name
	 ```
2. Declare route in `app.routes.ts` if it needs navigation.
3. (Optional) Add service with: `npx ng generate service Services/feature`.
4. Add UI references via navbar / links.

## 🌐 Environments

Use `environment.ts` for dev and `environment.prod.ts` for production toggles (e.g., API base URLs, feature flags). Access inside code:

```ts
import { environment } from '../environments/environment';
console.log(environment.production);
```

## 🧪 Testing Notes

- Keep unit tests close to their components (`*.spec.ts`).
- Mock services using Jasmine spies to isolate UI logic.
- Suggested future addition: integration tests (Cypress / Playwright) for cart + checkout flow.

## 📦 Deployment (General Outline)

1. Build: `npm run build`
2. Deploy contents of `dist/` to hosting provider (e.g., Netlify, Vercel, Firebase Hosting, S3 + CloudFront, Azure Static Web Apps)
3. Ensure correct fallback for SPA routing (rewrite all 404s to `/index.html`).

## 🔄 Suggested Next Improvements

- Implement real backend integration (REST / GraphQL)
- Add JWT handling + refresh logic
- Persist cart to localStorage or backend
- Add product detail + search + filters
- Form validation + error states
- Accessibility audit (ARIA roles, focus management)
- E2E test suite (Playwright or Cypress)
- CI pipeline (GitHub Actions) for lint + test + build

## 🐞 Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 4200 in use | `npx ng serve --port 4300` |
| Styles not applying | Verify component style encapsulation / path |
| Asset 404 | Confirm correct folder name (`assets` vs `assests`) & `angular.json` config |
| Guard blocks route unexpectedly | Log auth state in `admin.guard.ts` to verify condition |

## 📜 License

MIT License (add `LICENSE` file if distributing publicly).

## 🙌 Contributing

1. Fork & branch: `feat/short-description`
2. Maintain coding style (ESLint clean)
3. Write/adjust tests for changes
4. Open PR with a concise description

## 🧾 Script Reference (from `package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| start | `ng serve` | Run dev server |
| build | `ng build` | Production build (configuration dependent) |
| watch | `ng build --watch --configuration development` | Rebuild on change |
| test  | `ng test`  | Run unit tests (Karma) |

## 📣 Notes

- Replace placeholder logic in services with actual API calls as backend matures.
- Consider state management (e.g., NgRx, Signals, or simple service store) as complexity increases.

---

Feel free to tailor branding, feature depth, and deployment steps as the project evolves.

