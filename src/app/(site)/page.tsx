import Welcome from '@/components/Welcome'
import Link from 'next/link'
import {listPosts} from '@/lib/posts'
import {categories} from '@/lib/demo'
export const dynamic='force-dynamic'
export default async function Home({searchParams}:{searchParams:Promise<{q?:string;categoria?:string;pagina?:string}>}){
 const s=await searchParams; const q=(s.q||'').slice(0,120),category=categories[s.categoria||'']?s.categoria||'':''
 const page=Math.max(1,parseInt(s.pagina||'1')||1)
 const result=await listPosts(q,category,page)
 const [feature,...rest]=result.docs
 const filtered=Boolean(q||category||page>1)
 const cards=filtered?result.docs:rest
 function href(cat:string,p=1){return '/?'+new URLSearchParams({...(cat?{categoria:cat}:{}),...(q?{q}:{}),...(p>1?{pagina:String(p)}:{})}).toString()}
 return <><Welcome/>
 {!filtered&&feature&&<Link className="feature" href={'/noticias/'+feature.slug}><div className="feature-image"><img src={feature.cover?.url||'/editorial.svg'} alt={feature.cover?.alt||''}/><span className="image-tag">EM DESTAQUE</span></div><div className="feature-text"><span className="eyebrow">{categories[feature.category]}</span><h2>{feature.title}</h2><p>{feature.summary}</p><span className="read">Ler publicação <b>↗</b></span></div></Link>}
 <section className="feed" id="publicacoes"><div className="section-top"><h2>O que estamos a pensar</h2><span>Publicações e perspectivas</span></div><div className="filters"><nav aria-label="Categorias"><Link className={!category?'active':''} href={href('')}>Todas</Link>{Object.entries(categories).map(([k,v])=><Link key={k} href={href(k)} className={category===k?'active':''}>{v}</Link>)}</nav><form action="/"><input type="hidden" name="categoria" value={category}/><label className="sr" htmlFor="q">Pesquisar publicações</label><input id="q" name="q" placeholder="Pesquisar…" defaultValue={q}/><button aria-label="Pesquisar">↗</button></form></div>
 {cards.length?<div className="grid">{cards.map(p=><Link className="card" key={p.id} href={'/noticias/'+p.slug}><div className="card-img"><img src={p.cover?.url||'/editorial.svg'} alt={p.cover?.alt||''} loading="lazy"/></div><div className="eyebrow">{categories[p.category]} {p.demo?' · EXEMPLO':''}</div><h3>{p.title}</h3><p>{p.summary}</p><span className="read">Continuar a ler ↗</span></Link>)}</div>:<div className="empty">{filtered?'Nenhuma publicação encontrada. Experimente outra pesquisa.':'As próximas publicações aparecerão aqui.'}</div>}
 {result.totalPages>1&&<nav className="pagination" aria-label="Paginação">{page>1&&<Link href={href(category,page-1)}>← Anterior</Link>}<span>Página {page} de {result.totalPages}</span>{page<result.totalPages&&<Link href={href(category,page+1)}>Seguinte →</Link>}</nav>}</section>
 <section className="statement"><span className="eyebrow">UM ESPAÇO DE ENCONTRO</span><h2>O conhecimento cresce<br/>quando entra em diálogo.</h2><Link href="/sobre">Conhecer a Cátedra ↗</Link></section></>
}
