import 'dotenv/config'
import {getPayload} from 'payload'
import config from '../src/payload.config'
const email=process.env.ADMIN_EMAIL,password=process.env.ADMIN_PASSWORD
if(!email||!password||password.length<14)throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 14 caracteres).')
const payload=await getPayload({config})
const users=await payload.find({collection:'users',limit:1})
if(users.totalDocs)throw new Error('Já existe administrador. Não foi alterado.')
await payload.create({collection:'users',data:{name:'Administrador',email,password}})
console.log('Administrador criado. Remova ADMIN_PASSWORD do ambiente.')
process.exit(0)
