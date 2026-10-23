import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export const completeRegistration = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ fullName: z.string().trim().max(120) }))
  .handler(async ({ data, context }) => {
    const { finishAccount } = await import('./account-completion')
    return finishAccount({
      readProfile: async () => {
        const { data: profile, error } = await context.supabase.from('profiles')
          .select('email, account_completed_at').eq('id', context.userId).maybeSingle()
        if (error) return null
        return profile
      },
      complete: async () => context.supabase.rpc('complete_account', { _full_name: data.fullName }),
      notify: async (email) => {
        const { notifyAdmin } = await import('./admin-notification')
        const { sendTemplateEmail } = await import('./email-templates/send-email')
        await notifyAdmin(sendTemplateEmail, 'registration', email, context.userId)
      },
    })
  })