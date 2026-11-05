# Cátedra de Filosofia Africana

Next.js + Payload CMS + PostgreSQL/Supabase + Supabase Storage + Render.

## Estado
Implementados: feed, pesquisa, categorias, paginação, notícias completas, galerias, partilha manual no Facebook, Open Graph e apresentação. CMS com editor, rascunhos, autosave, histórico e administradores autenticados. A identidade visual e os artigos de demonstração são propostas, não conteúdos oficiais. Supabase e Render ainda não estão ligados a contas reais.

## Demonstração local
Node.js 22 e npm. Executar `npm ci`, copiar `.env.example` para `.env.local` e executar `npm run dev`. Abrir http://localhost:3000. DEMO_MODE=true apresenta exemplos e bloqueia /admin e /api. Para gerir publicações, concluir a configuração real.

## Supabase
1. Criar um projecto, numa região próxima do Render.
2. Copiar a ligação PostgreSQL **Session pooler**, porta 5432, com SSL conforme indicado pelo Supabase, para DATABASE_URL.
3. Executar `supabase-setup.sql` no SQL Editor antes das migrações. O Payload usa o schema `cms`. **Não adicionar cms aos schemas expostos da API Supabase.** Os visitantes lêem pelo Payload, nunca directamente pela API Supabase. Não são usadas chaves service_role no navegador.
4. Criar bucket público `catedra-media`. Definir limite de 10 MB e MIME types image/jpeg, image/png, image/webp.
5. Gerar credenciais S3 e preencher S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID e S3_SECRET_ACCESS_KEY. Nunca usar prefixo NEXT_PUBLIC em segredos.
6. MEDIA_PUBLIC_URL: https://PROJECT.supabase.co/storage/v1/object/public/catedra-media.
7. Definir PAYLOAD_SECRET aleatório de pelo menos 32 caracteres, NEXT_PUBLIC_SITE_URL e DEMO_MODE=false.
8. O bucket é público, incluindo fotografias de rascunhos quando conhecidas as URLs. Não colocar dados privados nele.

## Tabelas e primeiro administrador
Usar variáveis no ambiente ou num ficheiro `.env` (os comandos CLI não devem depender de `.env.local`). Executar `npm run db:migrate`.

Definir ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 14 caracteres) e executar `npm run bootstrap`. Remover ADMIN_PASSWORD depois. O comando não altera administradores existentes. A criação inicial pela Internet está bloqueada. Todos os utilizadores desta versão são administradores; acrescentar papéis diferenciados antes de distribuir acessos a editores com permissões limitadas.

## Render
1. Enviar o código para um repositório Git privado. Incluir package-lock.json e src/migrations; excluir node_modules, .next e ficheiros .env.
2. Criar um Blueprint a partir de render.yaml. Este selecciona um serviço Starter **pago**: confirmar o custo na conta antes de activar.
3. Preencher as variáveis solicitadas. NEXT_PUBLIC_SITE_URL deve ser a URL HTTPS definitiva, por exemplo https://NOME.onrender.com.
4. Build: npm ci e npm run build. Pre-deploy: npm run db:migrate. Start: npm run start, respeitando PORT do Render.
5. Executar bootstrap num ambiente privado ligado à mesma base, antes da entrega.
6. Testar login, upload, rascunho, publicação e edição, incluindo leitura sem sessão. Monitorizar memória de Next.js + Payload e ajustar o plano conforme necessário.
7. Ao ligar domínio próprio, actualizar NEXT_PUBLIC_SITE_URL e fazer deploy.

As páginas são dinâmicas: publicar no CMS não exige novo deploy. Alterar código, schema ou configuração exige deploy.

## Rotina do cliente
Entrar em /admin → Publicações → Criar. Preencher título, resumo, categoria, capa, descrição acessível, texto e galeria opcional. Guardar rascunho ou publicar. Abrir a notícia no site e usar “Copiar texto e ligação” ou “Partilhar no Facebook”. Manter o campo Endereço depois de partilhar para preservar os links.

O “Ver mais” nativo do Facebook não é substituído. O visitante chega pela ligação externa. Testar a pré-visualização com o Sharing Debugger da Meta após o lançamento.

## Antes da entrega definitiva
- Configurar um adaptador de email transaccional no Payload para recuperação de palavra-passe. Sem ele, o sistema não envia emails reais.
- Fazer backup da base e dos objectos do Storage separadamente; testar restauração.
- Não apagar imagens usadas por notícias sem as substituir.
- Confirmar apresentação institucional, contactos, identidade visual e direitos de imagem com a Cátedra.
- Actualizar dependências com testes; manter os pacotes Payload na mesma versão.
- Para novos campos, gerar e versionar migração com npm run db:create-migration. Nunca activar push de schema em produção.

## Verificação
Executar npm test, npm run typecheck e npm run build. Os testes cobrem regras de acesso e slugs. A compilação não valida por si só autenticação, migrações e uploads contra Supabase real.

Não inclui publicação automática no Facebook, comentários, newsletter nem registo público.
