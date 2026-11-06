'use client'
import Link from 'next/link'
import {useState,useEffect} from 'react'
import {categories} from '@/lib/site'
import {publicPosts,photo,articleURL,type Post} from '@/lib/backend'
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
export function Feed(){
 const [posts,setPosts]=useState<Post[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true),[q,setQ]=useState(''),[category,setCategory]=useState(''),[page,setPage]=useState(1)
 async function load(){setLoading(true);setError('');try{setPosts(await publicPosts())}catch(e){setError(e instanceof Error?e.message:'Erro ao carregar publicações.')}finally{setLoading(false)}}
 useEffect(()=>{void load()},[])
 const filtered=posts.filter(p=>(!category||category===p.category)&&normalize(p.title+' '+p.summary).includes(normalize(q)));const pages=Math.max(1,Math.ceil(filtered.length/9));const current=Math.min(page,pages)
 return <section className="feed"><div className="section-top"><h2>Notícias e perspectivas</h2><span>Publicações da Cátedra</span></div><div className="filters"><nav aria-label="Categorias">{[['','Todas'],...Object.entries(categories)].map(([k,v])=><button key={k} type="button" aria-pressed={category===k} className={category===k?'active':''} onClick={()=>{setCategory(k);setPage(1)}}>{v}</button>)}</nav><form onSubmit={e=>e.preventDefault()} role="search"><label className="sr" htmlFor="q">Pesquisar publicações</label><input id="q" value={q} onChange={e=>{setQ(e.target.value);setPage(1)}} placeholder="Pesquisar…"/><button aria-label="Pesquisar">↗</button></form></div>{loading?<p role="status">A carregar publicações…</p>:error?<div role="alert"><p>{error}</p><button onClick={load}>Tentar novamente</button></div>:filtered.length?<div className="grid">{filtered.slice((current-1)*9,current*9).map(p=><Link className="card" key={p.id} href={articleURL(p.slug)}><div className="card-img"><img src={photo(p.cover_path)} alt={p.cover_alt} loading="lazy"/></div><div className="eyebrow">{categories[p.category]}</div><h3>{p.title}</h3><p>{p.summary}</p><span className="read">Continuar a ler ↗</span></Link>)}</div>:<div className="empty">{q||category?'Nenhuma publicação encontrada.':'As primeiras publicações aparecerão aqui.'}</div>}{pages>1&&<nav className="pagination" aria-label="Paginação"><button disabled={current===1} onClick={()=>setPage(current-1)}>← Anterior</button><span>{current} / {pages}</span><button disabled={current===pages} onClick={()=>setPage(current+1)}>Seguinte →</button></nav>}</section>
}
