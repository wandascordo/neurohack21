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
- All user state lives in Lovable Cloud tables with per-user RLS (no localStorage) — progress must sync across devices.
- Signed-in screens live under src/routes/_authenticated/ (client-only gate redirecting to /); admin panel at /admin checks has_role('admin') from user_roles — roles never stored on profiles.
- Undelivered screens use neutral structure with titles, known content hierarchy and navigation only; each Figma plugin export becomes the exact reference for its corresponding screen after explicit receipt confirmation — avoids inventing final content or design.
- The Cover export governs only the public portada; preserve the existing email-link authentication and layout, using the user-provided video background and SVG logo with a video still as fallback.
