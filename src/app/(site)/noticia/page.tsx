import {Suspense} from 'react'
import {Reader} from '@/components/Reader'
export const metadata={title:'Publicação'}
export default function Page(){return <Suspense fallback={<p role="status">A carregar...</p>}><Reader/></Suspense>}
