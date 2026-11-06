import {test, beforeEach} from 'node:test'
import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_publishable_test'
const backend=await import('../src/lib/backend.ts')
const stored=new Map()
globalThis.window={}
globalThis.sessionStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)}
beforeEach(()=>stored.clear())
const response=data=>new Response(JSON.stringify(data),{status:200})
const authenticate=()=>stored.set('catedra-editor-session',JSON.stringify({access_token:'user-token',refresh_token:'refresh',expires_at:Date.now()/1000+3600,user:{id:'user-id'}}))

test('public listing continues beyond API caps and never uses an editor token',async()=>{
 authenticate()
 let count=0
 globalThis.fetch=async(url,init)=>{
  assert.equal(init.headers.Authorization,undefined)
  assert.equal(new URL(url).searchParams.get('published'),'eq.true')
  assert.equal(new URL(url).searchParams.get('offset'),String(count*2))
  return response(count++<3?[{id:count+'a'},{id:count+'b'}]:[])
 }
 assert.equal((await backend.publicPosts()).length,6)
})
test('anonymous writes are blocked before making a request',async()=>{
 globalThis.fetch=()=>{throw Error('Unexpected request')}
 await assert.rejects(()=>backend.savePost({title:'Test'}),/sessão/)
})
test('stale edits report a conflict and use the original timestamp',async()=>{
 authenticate()
 globalThis.fetch=async(url,init)=>{
  assert.equal(init.method,'PATCH')
  assert.equal(init.headers.Authorization,'Bearer user-token')
  assert.equal(new URL(url).searchParams.get('updated_at'),'eq.2026-11-06T10:00:00Z')
  return response([])
 }
 await assert.rejects(()=>backend.savePost({title:'New'},{id:'post',updated_at:'2026-11-06T10:00:00Z'}),/alterada/)
})
test('invalid uploads are rejected before network access',async()=>{
 await assert.rejects(()=>backend.upload(new File(['x'],'test.svg',{type:'image/svg+xml'})),/JPG/)
 await assert.rejects(()=>backend.upload(new File([new Uint8Array(10*1024*1024+1)],'test.jpg',{type:'image/jpeg'})),/10 MB/)
})
test('simultaneous requests share one token refresh',async()=>{
 stored.set('catedra-editor-session',JSON.stringify({access_token:'old',refresh_token:'refresh',expires_at:1,user:{id:'user-id'}}))
 let refreshes=0
 globalThis.fetch=async url=>{
  if(url.includes('/auth/')){refreshes++;return response({access_token:'new',refresh_token:'next',expires_in:3600,user:{id:'user-id'}})}
  return response([])
 }
 await Promise.all([backend.api('/rest/v1/catedra_posts'),backend.api('/rest/v1/catedra_posts')])
 assert.equal(refreshes,1)
})
