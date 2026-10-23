type Profile = { email: string | null; account_completed_at: string | null }
type CompletionDependencies = {
  readProfile: () => Promise<Profile | null>
  complete: () => Promise<{ error: unknown }>
  notify: (email: string) => Promise<unknown>
}

export async function finishAccount({ readProfile, complete, notify }: CompletionDependencies) {
  const profile = await readProfile()
  if (!profile) return { ok: false }
  if (profile.account_completed_at) return { ok: true }
  const { error } = await complete()
  if (error) return { ok: false }
  if (profile.email) {
    try { await notify(profile.email) } catch { console.warn('[account-completion] notification failed') }
  }
  return { ok: true }
}