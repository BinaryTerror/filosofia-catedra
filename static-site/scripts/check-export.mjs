import fs from 'node:fs'
import assert from 'node:assert/strict'
for(const name of ['index.html','sobre/index.html','noticia/index.html','admin/index.html','404.html','robots.txt'])assert.ok(fs.existsSync('out/'+name),name)
assert.ok(!fs.existsSync('out/api'))
const admin=fs.readFileSync('out/admin/index.html','utf8');assert.ok(admin.includes('noindex'))
console.log('Exportação estática verificada: feed, notícia, painel e 404. Não existem rotas de servidor.')
