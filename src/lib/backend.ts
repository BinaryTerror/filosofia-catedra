export type Post={id:string;slug:string;title:string;summary:string;body:string;category:string;cover_path:string;cover_alt:string;published:boolean;created_at:string;updated_at:string}
type Session={access_token:string;refresh_token:string;expires_at:number;user:{id:string;email?:string}}
const url=(process.env.NEXT_PUBLIC_SUPABASE_URL||'').replace(/\/$/,'')
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||''
export const configured=Boolean(url&&key)
const storageKey='catedra-editor-session'
let refreshing:Promise<Session>|null=null
function read():Session|null {if(typeof window==='undefined')return null;try{return JSON.parse(sessionStorage.getItem(storageKey)||'null')}catch{return null}}
function save(s:any){const session={...s,expires_at:s.expires_at||Math.floor(Date.now()/1000)+s.expires_in};sessionStorage.setItem(storageKey,JSON.stringify(session));return session as Session}
async function raw(path:string,init:RequestInit={},token?:string){
 if(!configured)throw Error('Ligação ao Supabase por configurar. Consulte o guia de instalação.')
 const response=await fetch(url+path,{...init,headers:{apikey:key,...(token?{Authorization:'Bearer '+token}:{}),...init.headers}})
 const text=await response.text();let data:any;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!response.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.error||'Não foi possível concluir o pedido.')
 return data
}
export async function session():Promise<Session|null>{
 const s=read();if(!s)return null
 if(s.expires_at>Date.now()/1000+60)return s
 if(!refreshing)refreshing=raw('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})}).then(save).catch(e=>{sessionStorage.removeItem(storageKey);throw e}).finally(()=>{refreshing=null})
 return refreshing
}
export async function login(email:string,password:string){return save(await raw('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}))}
export async function logout(){const s=read();try{if(s)await raw('/auth/v1/logout',{method:'POST'},s.access_token)}finally{sessionStorage.removeItem(storageKey)}}
export async function api(path:string,init:RequestInit={}){const s=await session();if(!s)throw Error('A sessão terminou. Entre novamente.');return raw(path,init,s.access_token)}
export async function isAdmin(){const s=await session();if(!s)return false;const rows=await api('/rest/v1/catedra_admins?select=user_id&user_id=eq.'+encodeURIComponent(s.user.id));return rows.length===1}
// Fetch all pages even when the API caps the response size.
async function allPosts(select:string, admin=false):Promise<Post[]> {
 const posts:Post[]=[]
 const request=admin?api:raw
 while(true){
  const rows:Post[]=await request('/rest/v1/catedra_posts?select='+select+(admin?'':'&published=eq.true')+'&order=created_at.desc,id.desc&limit=100&offset='+posts.length)
  posts.push(...rows)
  if(rows.length===0)return posts
 }
}
export const publicPosts=()=>allPosts('id,slug,title,summary,category,cover_path,cover_alt,published,created_at,updated_at')
export async function publicPost(slug:string){const rows=await raw('/rest/v1/catedra_posts?select=*&published=eq.true&slug=eq.'+encodeURIComponent(slug)+'&limit=1');return rows[0] as Post|undefined}
export const adminPosts=()=>allPosts('*',true)
export function photo(path:string){return url+'/storage/v1/object/public/catedra-site/'+path.split('/').map(encodeURIComponent).join('/')}
export function articleURL(slug:string){return '/noticia/?slug='+encodeURIComponent(slug)}
export async function upload(file:File){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Use uma fotografia JPG, PNG ou WebP.')
 if(file.size>10*1024*1024)throw Error('A fotografia deve ter no máximo 10 MB.')
 const s=await session();if(!s)throw Error('Entre novamente.')
 const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp'
 const path=s.user.id+'/'+crypto.randomUUID()+'.'+ext
 await api('/storage/v1/object/catedra-site/'+path,{method:'POST',headers:{'Content-Type':file.type,'x-upsert':'false'},body:file})
 return path
}
export async function removePhoto(path:string){await api('/storage/v1/object/catedra-site',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({prefixes:[path]})})}
export async function savePost(value:Partial<Post>,original?:Post){
 const data=await api('/rest/v1/catedra_posts'+(original?'?id=eq.'+original.id+'&updated_at=eq.'+encodeURIComponent(original.updated_at):''),{method:original?'PATCH':'POST',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(value)})
 if(!data?.length)throw Error('Esta publicação foi alterada por outra pessoa. Reabra-a antes de guardar.')
 return data[0] as Post
}
export async function deletePost(p:Post){const rows=await api('/rest/v1/catedra_posts?id=eq.'+p.id+'&updated_at=eq.'+encodeURIComponent(p.updated_at),{method:'DELETE',headers:{Prefer:'return=representation'}});if(!rows?.length)throw Error('A publicação mudou. Actualize a lista antes de apagar.')}
