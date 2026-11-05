import type { Metadata } from 'next'
import Link from 'next/link'
import './style.css'
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'Cátedra de Filosofia Africana',template:'%s | Cátedra de Filosofia Africana'},description:'Reflexões, publicações e actividades sobre filosofia africana.',robots:process.env.DEMO_MODE==='true'?{index:false,follow:false}:undefined}
export default function Layout({children}:{children:React.ReactNode}) {
 return <html lang="pt-MZ"><body><a className="skip" href="#conteudo">Saltar para o conteúdo</a>
 {process.env.DEMO_MODE==='true'&&<div className="demo">Pré-visualização · Conteúdos ilustrativos, sujeitos a aprovação da Cátedra</div>}
 <header><Link href="/" className="brand"><span className="mark">cfa<span>✳</span></span><span>CÁTEDRA DE<br/>FILOSOFIA AFRICANA</span></Link><nav aria-label="Navegação principal"><Link href="/">Publicações</Link><Link href="/sobre">A Cátedra</Link><a href="https://www.facebook.com/people/C%C3%A1tedra-de-Filosofia-Africana/61596000720059/" target="_blank" rel="noreferrer">Facebook ↗</a></nav></header>
 <main id="conteudo">{children}</main><footer><div className="footer-brand">Pensar. Dialogar.<br/><em>Construir conhecimento.</em></div><div>Cátedra de Filosofia Africana<br/><small>Um espaço dedicado ao pensamento africano.</small></div><div><Link href="/sobre">Sobre o projecto</Link><Link href="/admin">Área de gestão ↗</Link></div></footer></body></html>
}
