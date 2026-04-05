import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// We need to test the module with different env var states,
// so we re-import after modifying process.env each time.

describe('isSupabaseConfigured()', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.resetModules()
  })

  it('returns false when both env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const { isSupabaseConfigured } = await import('../supabase/client')
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when only URL is set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const { isSupabaseConfigured } = await import('../supabase/client')
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when only ANON_KEY is set', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'some-anon-key'

    const { isSupabaseConfigured } = await import('../supabase/client')
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns true when both env vars are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'some-anon-key'

    const { isSupabaseConfigured } = await import('../supabase/client')
    expect(isSupabaseConfigured()).toBe(true)
  })
})

describe('createClient()', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.resetModules()
  })

  it('returns a Supabase client object when configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'some-anon-key'

    const { createClient } = await import('../supabase/client')
    const client = createClient()

    expect(client).toBeDefined()
    expect(client).toHaveProperty('auth')
    expect(client).toHaveProperty('from')
  })

  it('handles missing env vars gracefully (does not throw on import)', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Importing the module should not throw
    const mod = await import('../supabase/client')
    expect(mod.createClient).toBeDefined()
    expect(mod.isSupabaseConfigured).toBeDefined()
  })
})
