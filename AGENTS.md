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
- Placeholder screens use src/components/Placeholder.tsx until Figma designs arrive — no invented visual style.
