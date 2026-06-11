# AGENTS.md — JobsSync Project Context

## Goal
Integrate Gemini API for CV parsing and intelligent offer–candidate matching, cache results, add validation & security fixes, and prepare all data structures for future database migration.

## Constraints & Preferences
- All data must be structured for future BD migration (schemas, DataService abstraction)
- localStorage used as intermediate persistence (seed data on first load); matching results cached in `resultados_matching`
- Users: `admin/admin` (reclutador), `carlos/carlos` (candidato)
- Timer is per-offer total, not per-question; auto-submits when time runs out with animation end
- Candidate can only apply once per offer
- Candidate dashboard filter: date (hoy, semana, mes, todos), score (asc/desc)
- Recruiter dashboard filter: date, score (asc/desc), encuesta (todas/respondidas/no respondidas)
- Timeline limit field in OfferForm: single input per offer, default empty = unlimited
- Curriculum tab shows only upload button (profile data already in "Mi Perfil Parseado")
- Gemini API key used client-side via `NEXT_PUBLIC_` (planned to move server-side)
- Matching cache is cleared on refresh button click or new CV upload; normal page load uses cache

## Progress
### Done
- Recruiter dashboard: added filter bar (fecha, score asc/desc, encuesta) for both global and per-offer views
- Candidate dashboard: fixed Curriculum tab — properly closed IIFE and Grid div
- Candidate dashboard: timer now ticks correctly (removed `tiempoRestante` from useEffect deps)
- Candidate dashboard: replaced timer bar transition with CSS `@keyframes` animation for smooth shrinkage, auto-submit via `onAnimationEnd`
- Candidate dashboard: fixed auto-submit stale closure via `respuestasRef`/`preguntasRef`
- Candidate dashboard: simplified Curriculum tab — removed `ProfileInfo`, kept only upload card
- Created `scripts/schema.sql` (MySQL): 11 tables (`usuarios`, `perfiles_candidato`, `perfiles_hard_skills`, `perfiles_soft_skills`, `skills_catalog`, `ofertas`, `ofertas_skills`, `ofertas_requisitos`, `preguntas`, `aplicaciones`, `respuestas`) + full seed data
- Installed `@google/genai` (v2.8.0+)
- Created `src/lib/geminiService.js` with `parseCV(fileBlob, onProgress)` (PDF → Gemini Files API → structured JSON) and `getMatches(profileData, ofertas)` (prompt con pesos 50/30/20)
- Added `fromGeminiProfile(geminiData, userId)` mapper in `schemas.js`
- Modified `src/app/upload/page.jsx` — saves real File as base64 in `sessionStorage` before navigation
- Rewrote `src/app/loading/page.jsx` — calls real `parseCV()`, shows dynamic progress logs, saves profile, redirects to dashboard
- Added `getMatchesConGemini(profileId)` in `dataService.js` with fallback to rule-based `calcularMatch()`
- Modified candidate dashboard `loadData()` to use Gemini matching with try/catch fallback
- Fixed `FileDropZone.jsx` — added hidden `<input type="file">`, drag-and-drop handlers, file type/size validation, shows selected file name
- Fixed Gemini API error 400: replaced raw `{ type: "document", ... }` with `createPartFromUri(file.uri, file.mimeType)`
- Added matching cache layer: `getResultadosMatching`, `saveResultadosMatching`, `clearResultadosMatching` in `dataService.js` (key `resultados_matching`)
- Modified `loadData()` to check cache first → if exists, show without Gemini call
- Modified `handleRefresh()` to pass `forceGemini=true` and update cache
- Modified `loading/page.jsx` to call `clearResultadosMatching(user.id)` after new CV upload
- Added toast alert in candidate dashboard header when Gemini matching API is called (auto-hides after 4s)
- Completed full code audit: 34 findings (3 critical, 6 high, 15 medium, 10 low)
- Validation fixes applied:
  - Email regex + password min 4 chars + `type="email"` on login page
  - Null-safety: reordered `setProfile(p)` after `if (!p) return` in candidate dashboard
  - NaN timeLimit: added `&& !isNaN()` guard in OfferForm.jsx
  - NaN protection: `Number(profile.experiencia_anios) || 0` + fallback `|| 0` in `calcularMatch`
  - Error Boundary component wrapping root layout
  - Gemini response validation: checks for required fields in `parseCV` + `Array.isArray` guard in `getMatches`
  - `crypto.randomUUID()` fallback → `generateId()` with try/catch + timestamp fallback
  - Magic numbers → exported `MATCH_WEIGHTS` constants in dataService.js
  - Hardcoded model → `MODEL` constant in geminiService.js
  - File type validation: `ACCEPTED_MIME_TYPES` guard in `parseCV`

### In Progress
- None (all validation fixes applied)

### Blocked
- Todos los issues arquitectónicos (HTTP→HTTPS, SQL injection, CSRF, rate limiting, auth tokens, plaintext passwords) — inherentes a localStorage, se resuelven migrando a backend real
- Remaining architectural findings: HTTP→HTTPS, SQL injection (localStorage model), CSRF, rate limiting, auth tokens, plaintext passwords — all inherent to localStorage-only architecture, resolved when migrating to proper backend

## Key Decisions
- `DataService` abstraction with localStorage allows swapping to API calls (BD) by changing one class — no component changes needed
- `fromGeminiProfile()` bridges Gemini output format to existing profile schema, no breaking changes
- Matching cache (`resultados_matching`) avoids redundant Gemini calls on reload; refresh button always forces recalc
- CV upload → loading page → Gemini PDF extraction → profile save → dashboard (instead of fake 4.5s terminal)
- CSS `@keyframes` animation for timer bar (smooth continuous shrink) instead of 1s-transition steps
- Matching prompts use semantic normalization (e.g., "sé filetear carne" → "Carnicería"), 50% skills / 30% experience / 20% location

## Next Steps
- Remove dead code: `useFileUpload.js`, `useTerminalSimulation.js`, `TerminalSimulator.jsx`, `candidatos.js`, `ofertas.js`, empty `terminal-logs.js`
- Remove dead code: `useFileUpload.js`, `useTerminalSimulation.js`, `TerminalSimulator.jsx`, `candidatos.js`, `ofertas.js`, empty `terminal-logs.js`

## Critical Context
- Build passes with 0 errors on Next.js 16.2.6 (Turbopack)
- Gemini API key in `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY` — visible client-side; must move to server routes
- `@google/genai` v2.8.0 is the new SDK (replaces deprecated `@google/generative-ai`)
- `createPartFromUri(uri, mimeType)` is the correct way to pass Files API documents to Gemini (not raw `{type:"document"}`)
- Timer animation uses CSS `@keyframes timerShrink_${ofertaId}` injected dynamically; `onAnimationEnd` triggers auto-submit
- Lock file and `node_modules` in `.gitignore`

## Relevant Files
- `/home/pilon/Proyects/JobsSync/.env.local`: Gemini API key (`NEXT_PUBLIC_GEMINI_API_KEY`)
- `/home/pilon/Proyects/JobsSync/src/lib/geminiService.js`: Gemini client — `parseCV()`, `getMatches()`, schemas, prompts, validation
- `/home/pilon/Proyects/JobsSync/src/lib/dataService.js`: DataService class — `MATCH_WEIGHTS` constants, `getMatchesConGemini()`, caching, `calcularMatch()` fallback
- `/home/pilon/Proyects/JobsSync/src/data/schemas.js`: `fromGeminiProfile()` mapper, `generateId()` helper
- `/home/pilon/Proyects/JobsSync/src/app/upload/page.jsx`: real file upload via FileReader → `sessionStorage`
- `/home/pilon/Proyects/JobsSync/src/app/loading/page.jsx`: real Gemini parsing with dynamic progress logs
- `/home/pilon/Proyects/JobsSync/src/app/dashboard/candidato/page.jsx`: caching logic (`loadData` with/without `forceGemini`), toast alert, timer animation, curriculum tab
- `/home/pilon/Proyects/JobsSync/src/app/dashboard/reclutador/page.jsx`: filter bar (fecha, score, encuesta)
- `/home/pilon/Proyects/JobsSync/src/components/ui/FileDropZone.jsx`: hidden file input, drag-and-drop, validation
- `/home/pilon/Proyects/JobsSync/src/components/ui/ErrorBoundary.jsx`: Error Boundary component wrapping root layout
- `/home/pilon/Proyects/JobsSync/scripts/schema.sql`: MySQL schema + seed data (11 tables)
