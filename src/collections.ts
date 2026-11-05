import type { CollectionConfig } from 'payload'
import { authenticated, publishedOnly, slugify } from './lib/policy.mjs'
export const Users: CollectionConfig = {
 slug:'users', labels:{singular:'Administrador',plural:'Administradores'},
 auth:{tokenExpiration:7200,maxLoginAttempts:5,lockTime:600000},
 admin:{useAsTitle:'email'},
 access:{read:authenticated,create:authenticated,update:authenticated,delete:authenticated},
 fields:[{name:'name',label:'Nome',type:'text',required:true}]
}
export const Media: CollectionConfig = {
 slug:'media',labels:{singular:'Ficheiro',plural:'Fotografias'},
 access:{read:()=>true,create:authenticated,update:authenticated,delete:authenticated},
 upload:{mimeTypes:['image/jpeg','image/png','image/webp'],filesRequiredOnCreate:true},
 fields:[{name:'alt',label:'Descrição da imagem (acessibilidade)',type:'text',required:true},{name:'credit',label:'Crédito / autor',type:'text'}]
}
export const Posts: CollectionConfig = {
 slug:'posts',labels:{singular:'Publicação',plural:'Publicações'},
 admin:{useAsTitle:'title',defaultColumns:['title','category','_status','updatedAt'],
  description:'Escreva, adicione fotografias e publique. Copie o endereço da notícia para partilhar no Facebook.'},
 access:{read:publishedOnly,create:authenticated,update:authenticated,delete:authenticated,readVersions:authenticated},
 versions:{drafts:{autosave:{interval:1500}},maxPerDoc:30},
 hooks:{beforeValidate:[({data,operation})=>{
   if(data && operation==='create' && !data.slug) data.slug=slugify(data.title)
   if(data?._status==='published' && !data.publishedAt) data.publishedAt=new Date().toISOString()
   return data
 }]},
 fields:[
  {name:'title',label:'Título',type:'text',required:true,maxLength:160},
  {name:'slug',label:'Endereço da publicação',type:'text',required:true,unique:true,
   validate:(value:unknown)=>typeof value==='string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use letras minúsculas sem acentos, números e hífen.',
   admin:{description:'Gerado na criação. Mantenha-o depois de partilhar para não quebrar o link.'}},
  {name:'summary',label:'Resumo para o feed e Facebook',type:'textarea',required:true,maxLength:300},
  {name:'category',label:'Categoria',type:'select',required:true,defaultValue:'reflexoes',options:[
    {label:'Reflexões',value:'reflexoes'},{label:'Notícias',value:'noticias'},{label:'Actividades',value:'actividades'},{label:'Publicações',value:'publicacoes'}]},
  {name:'cover',label:'Fotografia de capa',type:'upload',relationTo:'media',required:true},
  {name:'content',label:'Texto completo',type:'richText',required:true},
  {name:'gallery',label:'Galeria',type:'array',fields:[{name:'image',label:'Fotografia',type:'upload',relationTo:'media',required:true}]},
  {name:'publishedAt',label:'Data de publicação',type:'date',admin:{position:'sidebar'}},
 ]
}
