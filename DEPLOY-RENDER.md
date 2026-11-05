# Publicar no Render

## Pendências

- Preencher `DATABASE_URL` no `.env`: Supabase → Connect → Session pooler. Copiar a URI PostgreSQL completa, com a palavra-passe da base e SSL conforme o painel. O endereço HTTPS da API não serve como ligação PostgreSQL.
- Confirmar a região e as credenciais S3 no painel Supabase. Renovar a chave secreta partilhada no chat e actualizar o `.env` e o Render.
- Executar `supabase-setup.sql` no SQL Editor do projecto. Manter o schema `cms` fora dos schemas expostos na Data API.
- Confirmar o bucket público `catedra-media`, limite de 10 MB e tipos image/jpeg, image/png e image/webp.
- Criar o primeiro commit e enviar a branch `main` para o remoto `origin`. O repositório Git começa dentro de `catedra`; `package.json` e `render.yaml` devem ficar na raiz do repositório. Não enviar `.env`.

## Serviço

No Render, criar um Blueprint a partir do repositório GitHub e do `render.yaml`. O ficheiro selecciona o plano Starter pago. Esta aplicação precisa de um Web Service Node, não de um Static Site.

Configuração já definida:

- Build: `npm ci && npm run build`
- Pre-deploy: `npm run db:migrate`
- Start: `npm run start`
- Health check: `/`

Preencher no Render `DATABASE_URL`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` e `MEDIA_PUBLIC_URL` com os valores reais. `S3_BUCKET` já está definido como `catedra-media`. `PAYLOAD_SECRET` é gerado pelo Blueprint; manter esse valor estável. `DEMO_MODE` deve ser `false`.

Definir `NEXT_PUBLIC_SITE_URL` como o endereço HTTPS real atribuído ao serviço Render. Não usar localhost em produção. O Render não recebe automaticamente as variáveis do `.env` local.

## Administrador e verificação

Depois das migrações, definir temporariamente `ADMIN_EMAIL` e `ADMIN_PASSWORD` (pelo menos 14 caracteres) num ambiente privado ligado à mesma base e executar `npm run bootstrap`. Remover `ADMIN_PASSWORD` depois. O bootstrap só permite criar o primeiro administrador.

Testar `/admin`, login, upload, rascunho, publicação e leitura sem sessão. Configurar email transaccional antes de depender da recuperação de palavra-passe. Confirmar backups da base e do Storage.

## Material do cartaz

O texto de apresentação e os quatro princípios estão integrados na página inicial e em “A Cátedra”. Falta o PDF ou o seu URL para disponibilizar o documento mencionado no QR. O cartaz original não está incluído como imagem.

## Referências

- https://render.com/docs/deploy-nextjs-app
- https://supabase.com/docs/guides/database/connecting-to-postgres
