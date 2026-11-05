const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
let role = ''
try { role = JSON.parse(Buffer.from(publicKey.split('.')[1] || '', 'base64url').toString()).role || '' } catch {}
if (publicKey.startsWith('sb_secret_') || role === 'service_role') {
  throw new Error('Chave privada detectada. Use apenas a chave publishable ou anon do Supabase.')
}
if (process.env.RENDER === 'true' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey)) {
  throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY antes do deploy.')
}
export default { output:'export', outputFileTracingRoot:process.cwd(), trailingSlash:true, images:{unoptimized:true}, poweredByHeader:false, experimental:{cpus:2} }
