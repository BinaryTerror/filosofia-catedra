import { demoPosts } from './demo'
export type Article={id:number|string;slug:string;title:string;summary:string;category:string;publishedAt?:string|null;cover?:any;content?:any;gallery?:any;demo?:boolean}
export async function listPosts(q='',category='',page=1):Promise<{docs:Article[],totalPages:number,page:number}> {
 if(process.env.DEMO_MODE==='true') return {docs:demoPosts.filter(p=>(!category||p.category===category)&&(!q||(p.title+' '+p.summary).toLowerCase().includes(q.toLowerCase()))),totalPages:1,page:1}
 const [{getPayload},{default:config}]=await Promise.all([import('payload'),import('@payload-config')])
 const payload=await getPayload({config})
 const and:any[]=[{_status:{equals:'published'}}]
 if(category) and.push({category:{equals:category}})
 if(q) and.push({or:[{title:{like:q}},{summary:{like:q}}]})
 const result=await payload.find({collection:'posts',overrideAccess:false,where:{and},sort:'-publishedAt',depth:2,limit:9,page})
 return {docs:result.docs as unknown as Article[],totalPages:result.totalPages,page:result.page||1}
}
export async function getPost(slug:string):Promise<Article|undefined>{
 if(process.env.DEMO_MODE==='true') return demoPosts.find(p=>p.slug===slug)
 const [{getPayload},{default:config}]=await Promise.all([import('payload'),import('@payload-config')])
 const payload=await getPayload({config})
 const result=await payload.find({collection:'posts',overrideAccess:false,where:{and:[{slug:{equals:slug}},{_status:{equals:'published'}}]},limit:1,depth:2})
 return result.docs[0] as unknown as Article|undefined
}
