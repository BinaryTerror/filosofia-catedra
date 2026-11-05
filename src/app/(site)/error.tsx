'use client'
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="about"><h1>Não foi possível carregar.</h1><p>Tente novamente dentro de instantes.</p><button onClick={reset}>Tentar novamente</button></section>}
