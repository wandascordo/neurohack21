<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Neurohack 21 decisions
- Public legal routes share LegalPage with BookChrome and no resource navigation; legacy legal URLs permanently redirect to canonical routes to preserve existing links.
- Global notification appearance is centralized in the shared Sonner wrapper and theme tokens — all resources must use the same toast styling.
- All user state lives in Lovable Cloud tables with per-user RLS (no localStorage) — progress must sync across devices.
- Signed-in screens live under src/routes/_authenticated/ (client-only gate redirecting to /); admin panel at /admin checks has_role('admin') from user_roles — roles never stored on profiles.
- Undelivered screens use neutral structure with titles, known content hierarchy and navigation only; each Figma plugin export becomes the exact reference for its corresponding screen after explicit receipt confirmation — avoids inventing final content or design.
- The Cover export governs only the public portada; preserve the existing email-link authentication and layout, using the user-provided video background and SVG logo with a video still as fallback.
- Reading memory: set_last_read(slug, anchor, label) stores the last section + visible h2 anchor on profiles; reading_progress rows mark sections read (end reached); % = read module/reto pages over total, all via src/lib/progreso.ts — position and completion stay separate so revisiting never lowers progress.
- User actions are logged to user_activity_events via logEvent() in src/lib/progreso.ts — one append-only audit trail readable by the user and admins.
- Supabase query builders are lazy: always await or .then() rpc/insert calls, never `void` them — un-awaited calls are never sent.
- Store long Figma module transcriptions in dedicated src/lib/moduloN.ts files and render them with the shared book block renderer — keeps exact chapter text separate from navigation and preserves the established reading layout.
- Notes and maintenance-plan placeholder routes use non-nested file routes under the authenticated layout and shared BookChrome — keeps the existing Registro Diario screen unchanged while rendering each destination independently.
- Registro Diario: src/lib/registro-contenido.ts defines the explicit day fields and src/lib/registro.ts owns persistence and completion; Day 8 retains its original Figma config, and references read existing notes/logs/assessment moments — stable IDs keep wording independent of saved answers.
- Daily practice display corrections live in registro-presentacion and ratings share EscalaFoco; retain saved field IDs and completion checks so visual changes never invalidate records.
- Golden-rule dismissal uses an activity event keyed to the latest completed_at; existing per-user storage synchronizes dismissal without a new table or browser storage.
- Completed daily logs retain their status when saved edits clear fields; completion validation applies to first completion, and summaries derive checks from saved values rather than status alone.
- Focus self-assessments are unlimited: every completion inserts a focus_assessments row ordered by assessed_at; Tracker and Mis resultados share ResultadoCard, and Registro Diario 'Hecha' uses the total row count — moment is never set nor used to gate.
- Onboarding uses two steps inside the existing shared modal; only Listo with the opt-out checkbox selected calls complete_onboarding, preserving account-level dismissal and temporary session closing.
