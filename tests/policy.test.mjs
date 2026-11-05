import {test} from 'node:test'
import assert from 'node:assert/strict'
import {authenticated,publishedOnly,slugify} from '../src/lib/policy.mjs'
test('visitantes não podem escrever',()=>assert.equal(authenticated({req:{user:null}}),false))
test('administradores autenticados podem escrever',()=>assert.equal(authenticated({req:{user:{id:1}}}),true))
test('rascunhos nunca são públicos',()=>assert.deepEqual(publishedOnly({req:{user:null}}),{_status:{equals:'published'}}))
test('administrador pode consultar rascunhos',()=>assert.equal(publishedOnly({req:{user:{id:1}}}),true))
test('slugs portugueses são normalizados',()=>assert.equal(slugify('Educação e Filosofia: África!'),'educacao-e-filosofia-africa'))
