export const site={name:'Cátedra de Filosofia Africana',description:'Reflexões, publicações e actividades sobre filosofia africana.',demo:false}
export const siteURL=(process.env.NEXT_PUBLIC_SITE_URL||process.env.RENDER_EXTERNAL_URL||'http://localhost:3000').replace(/\/$/,'')
export const categories:Record<string,string>={reflexoes:'Reflexões',noticias:'Notícias',actividades:'Actividades',publicacoes:'Publicações'}
