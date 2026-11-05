import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { pt } from '@payloadcms/translations/languages/pt'
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Users, Media, Posts } from './collections'
const dirname = path.dirname(fileURLToPath(import.meta.url))
const demo = process.env.DEMO_MODE === 'true'
if (!demo && !process.env.DATABASE_URL) throw new Error('DATABASE_URL é obrigatório')
if (!demo && !process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET é obrigatório')
const storageReady = Boolean(process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.MEDIA_PUBLIC_URL)
if (!demo && !storageReady) throw new Error('Configure Supabase Storage antes de iniciar')
export default buildConfig({
 serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
 secret: process.env.PAYLOAD_SECRET || 'demo-only-not-for-production-0123456789',
 admin: { user:'users', importMap: { baseDir: dirname }, meta: { titleSuffix:' | Cátedra' } },
 i18n: { supportedLanguages: { pt }, fallbackLanguage:'pt' },
 collections: [Users, Media, Posts],
 editor: lexicalEditor(),
 db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || 'postgres://localhost/catedra' }, push: false, schemaName:'cms', migrationDir:path.resolve(dirname,'migrations') }),
 sharp,
 typescript: { outputFile: path.resolve(dirname,'payload-types.ts') },
 plugins: storageReady ? [s3Storage({
   collections: { media: { disableLocalStorage:true, generateFileURL: ({filename}) => process.env.MEDIA_PUBLIC_URL + '/' + encodeURIComponent(filename) } },
   bucket: process.env.S3_BUCKET || 'catedra-media',
   config: { endpoint:process.env.S3_ENDPOINT,region:process.env.S3_REGION || 'eu-west-1',forcePathStyle:true,
     credentials: {accessKeyId:process.env.S3_ACCESS_KEY_ID!,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY!} }
 })] : [],
})
