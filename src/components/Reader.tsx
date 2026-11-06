'use client'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useEffect,useState} from 'react'
import {publicPost,photo,type Post} from '@/lib/backend'
import {categories} from '@/lib/site'
import {Share} from './Share'
export function Reader(){const params=useSearchParams();const slug=params.get('slug');const [p,setP]=useState<Post>(),[error,setError]=useState(''),[loading,setLoading]=useState(true)
 useEffect(()=>{setLoading(true);setError('');setP(undefined);if(!slug){setError('Publicação não encontrada.');setLoading(false);return}let alive=true;publicPost(slug).then(p=>{if(!alive)return;if(!p)setError('Publicação não encontrada ou ainda não publicada.');else {setP(p);document.title=p.title+' | Cátedra de Filosofia Africana'}}).catch(()=>{if(alive)setError('Não foi possível carregar. Actualize a página para tentar novamente.')}).finally(()=>{if(alive)setLoading(false)});return ()=>{alive=false}},[slug])
 if(loading)return <section className="about" role="status">A carregar a publicação…</section>
 if(error||!p)return <section className="about"><h1>Publicação</h1><p role="alert">{error}</p><Link href="/">← Voltar ao feed</Link></section>
 return <article className="article"><Link className="back" href="/">← Todas as publicações</Link><header className="article-header"><span className="eyebrow">{categories[p.category]}</span><h1>{p.title}</h1><p>{p.summary}</p><time dateTime={p.created_at}>{new Intl.DateTimeFormat('pt-MZ',{dateStyle:'long',timeZone:'Africa/Maputo'}).format(new Date(p.created_at))}</time></header><img className="article-cover" src={photo(p.cover_path)} alt={p.cover_alt}/><div className="prose">{p.body.split(/\n\s*\n/).map((text,i)=><p key={i} style={{whiteSpace:'pre-wrap'}}>{text}</p>)}</div><Share title={p.title} summary={p.summary}/></article>}
