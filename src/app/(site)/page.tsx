import Link from 'next/link'
import {Feed} from '@/components/Feed'
export default function Home(){return <><section className="intro"><div><div className="eyebrow">PENSAMENTO · CULTURA · SOCIEDADE</div><h1>África como lugar<br/>de <em>pensamento.</em></h1></div><p>Ideias que se encontram.<br/>Saberes que se partilham.<br/>Um diálogo aberto com o nosso tempo.</p></section><Feed/><section className="statement"><span className="eyebrow">UM ESPAÇO DE ENCONTRO</span><h2>O conhecimento cresce<br/>quando entra em diálogo.</h2><Link href="/sobre/">Conhecer a Cátedra ↗</Link></section></>}
