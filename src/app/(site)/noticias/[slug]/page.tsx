import Link from 'next/link'
import {notFound} from 'next/navigation'
import {RichText} from '@payloadcms/richtext-lexical/react'
import {getPost} from '@/lib/posts'
import {categories} from '@/lib/demo'
import {Share} from '@/components/Share'
export const dynamic='force-dynamic'
type Props={params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props){
 const p=await getPost((await params).slug);if(!p)return {title:'Publicação não encontrada'}
 return {title:p.title,description:p.summary,alternates:{canonical:'/noticias/'+p.slug},openGraph:{type:'article' as const,title:p.title,description:p.summary,url:'/noticias/'+p.slug,images:p.cover?.url?[{url:p.cover.url,alt:p.cover.alt||p.title}]:[]}}
}
export default async function Article({params}:Props){
 const p=await getPost((await params).slug);if(!p)notFound()
 return <article className="article"><Link className="back" href="/">← Todas as publicações</Link><header className="article-header"><span className="eyebrow">{categories[p.category]}{p.demo?' · CONTEÚDO DE DEMONSTRAÇÃO':''}</span><h1>{p.title}</h1><p>{p.summary}</p>{p.publishedAt&&<time dateTime={p.publishedAt}>{new Intl.DateTimeFormat('pt-MZ',{dateStyle:'long',timeZone:'Africa/Maputo'}).format(new Date(p.publishedAt))}</time>}</header><figure><img className="article-cover" src={p.cover?.url||'/editorial.svg'} alt={p.cover?.alt||''}/>{p.cover?.credit&&<figcaption>{p.cover.credit}</figcaption>}</figure><div className="prose">{p.demo?<><p>Esta publicação é um exemplo para apresentar a experiência de leitura. Não corresponde a um anúncio ou texto oficial da Cátedra.</p><h2>Um lugar para as ideias</h2><p>Aqui ficará o texto completo preparado pela equipa editorial, com espaço para reflexão, imagens e referências. Cada publicação terá um endereço próprio para partilhar com os leitores no Facebook.</p></>:p.content&&<RichText data={p.content}/>}</div>{p.gallery?.length>0&&<div className="gallery">{p.gallery.map((g:any,i:number)=><figure key={i}><img src={g.image?.url} alt={g.image?.alt||''} loading="lazy"/>{g.image?.credit&&<figcaption>{g.image.credit}</figcaption>}</figure>)}</div>}<Share title={p.title} summary={p.summary}/></article>
}
