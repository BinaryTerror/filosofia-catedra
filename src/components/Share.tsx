'use client'
import { useState } from 'react'
export function Share({title,summary}:{title:string;summary:string}) {
 const [message,setMessage]=useState('')
 async function copy(){try{await navigator.clipboard.writeText(title+'\n\n'+summary+'\n\nLeia mais: '+location.href);setMessage('Texto e ligação copiados.')}catch{setMessage('Não foi possível copiar. Copie o endereço na barra do navegador.')}}
 return <div className="share"><button onClick={copy}>Copiar texto e ligação ↗</button><button className="outline" onClick={()=>window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank','noopener,noreferrer')}>Partilhar no Facebook</button><span role="status">{message}</span></div>
}
