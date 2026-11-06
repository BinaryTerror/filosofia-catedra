# Site estático no Render, COM painel de publicação

Esta versão substitui o servidor Payload por um painel próprio em /admin/.
Next.js é exportado para HTML/CSS/JavaScript. O navegador comunica com Supabase Auth, PostgreSQL e Storage. Não existe servidor Node a executar em produção. Publicar não exige mexer no código nem fazer novo deploy.

## 1. Supabase (uma vez)
1. Abrir o projecto existente e executar todo o ficheiro supabase-setup.sql no SQL Editor. Cria tabelas com RLS e o bucket público catedra-site. Não apaga os conteúdos antigos do Payload.
2. Em Authentication > Users > Add user > Create new user, criar a conta do administrador, com email e palavra-passe forte. Confirmar o email nessa criação.
3. Copiar o UUID da conta e executar no SQL Editor:

   INSERT INTO public.catedra_admins(user_id) VALUES ('UUID-REAL-DA-CONTA') ON CONFLICT DO NOTHING;

4. Em Authentication, manter o fornecedor Email activado e desactivar novas inscrições públicas, pois apenas o responsável técnico cria contas. Não usar a opção de convite sem configurar email transaccional.
5. Copiar a Project URL e a chave PUBLICÁVEL (sb_publishable_...) em Project Settings > API Keys. A chave anon legada também é aceite. NUNCA usar service_role, sb_secret, palavra-passe PostgreSQL ou chaves S3 neste site.
6. A Data API deve estar activada e incluir o schema public. O SQL controla o acesso às novas tabelas. Não expor o schema cms antigo.
7. Não criar políticas que permitam escrita a qualquer pessoa. As permissões do painel são verificadas pela base de dados, não apenas pela página de login.

## 2. GitHub e estrutura
A raiz contém apenas o site estático: `src/`, `public/`, `scripts/`, `tests/` e ficheiros de build. O Payload anterior permanece no histórico Git. As alterações locais antigas foram preservadas fora do repositório em `../catedra-payload-backup-20261106/`.

Não enviar `.env`, `.env.local`, `node_modules`, `.next` ou `out`.

## 3. Render
Criar NEW > STATIC SITE, ligado ao mesmo repositório e branch main.

- Root Directory: deixar vazio (raiz)
- Build Command: npm ci && npm run verify
- Publish Directory: out
- NODE_VERSION: 22.22.0
- SKIP_INSTALL_DEPS: true (evita instalação duplicada)
- NEXT_PUBLIC_SUPABASE_URL: https://tptgtitvtoncbfhdywwz.supabase.co
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: a chave publicável/anon do mesmo projecto

Não há Start Command, porta, DATABASE_URL, PAYLOAD_SECRET ou variáveis S3.
O ficheiro .node-version também fixa Node 22.22.0.
Se usar Blueprint, seleccionar render.yaml na raiz.

O novo Static Site pode receber um endereço diferente do Web Service anterior. Abrir a URL que o Render devolver. Não foi feito nenhum deploy remoto nesta entrega.
Não suspender/apagar o serviço anterior antes de verificar este. Depois da migração, suspender o Web Service antigo para não manter custos desnecessários, preservando os dados conforme necessário.

## 4. Publicar sem código
Abrir https://ENDERECO-DO-STATIC-SITE.onrender.com/admin/ e entrar com a conta criada no Supabase Auth (não com a antiga conta Payload).

Nova publicação → fotografia → descrição da fotografia → título → frase/resumo → texto completo → Publicar.

Também permite guardar rascunho, editar, retirar uma notícia do site e apagar. Após guardar uma publicação, “Abrir notícia e partilhar” leva à notícia, onde se pode copiar o texto e link ou partilhar no Facebook.
O endereço permanece igual nas edições. As alterações guardadas aparecem quando o leitor abre/actualiza o site. Não há envio automático ao Facebook.

## O que mudou e limitações claras
- A autenticação usa Supabase Auth. As contas antigas do Payload não são migradas automaticamente.
- As tabelas e bucket desta versão são novos. Notícias antigas do Payload, se já existirem, precisam de importação. Nada é apagado do Supabase antigo pelo SQL.
- Todos os administradores autorizados podem gerir todas as publicações. Só o SQL Editor pode conceder/revogar a função de administrador.
- O painel guarda uma fotografia por publicação. JPG, PNG ou WebP, máximo 10 MB. Não inclui galeria nesta versão.
- Gravação por botão: não existe autosave. O painel avisa ao sair com alterações não guardadas; uma falha ao guardar preserva o formulário.
- A sessão fica na aba do navegador. Fechar a aba pode exigir novo login. Não há recuperação de palavra-passe na interface; o responsável técnico usa o Supabase.
- O bucket é público: as imagens dos rascunhos podem ser vistas se a URL for conhecida. Não enviar ficheiros privados.
- Fotografias substituídas ou de notícias apagadas não são apagadas automaticamente, para evitar remover imagens ainda utilizadas. Limpar ficheiros sem uso com cuidado no Storage.
- O feed e painel carregam todas as paginas de registos, em lotes de 100. A pesquisa ocorre no navegador.
- Notícia: /noticia/?slug=ENDERECO. O conteúdo é carregado no navegador. O link funciona, mas a pré-visualização automática do Facebook NÃO recebe título e imagem individuais de cada notícia, pois não executa necessariamente JavaScript. Publicar foto + resumo + link manualmente no Facebook. Pré-visualização automática individual e SEO completo exigem pré-geração de cada notícia ou serviço de metadados, não incluídos.
- Identidade visual e texto “Sobre” são preliminares e precisam de confirmação pelo cliente. Não há notícias fictícias no feed.

## Testes antes de entregar
1. Entrar como administrador e enviar uma fotografia.
2. Guardar rascunho e verificar numa janela anónima que não aparece.
3. Publicar e abrir o link numa janela anónima.
4. Editar e conferir que o link permanece e o texto muda ao actualizar.
5. Sair e confirmar que não se consegue escrever no painel.
6. Criar uma conta de teste sem a linha em catedra_admins e verificar que não tem acesso de escrita.
7. Testar retirar de publicação e apagar, usando notícia de teste.
8. Fazer novo deploy e confirmar que conteúdos persistem no Supabase.

## Local
Copiar .env.example para .env.local, preencher a chave pública, executar npm ci e npm run dev.
Para verificar: npm run build e npm run check:export.
As verificações de compilação não provam que o Supabase real está configurado. Os testes de login, upload e políticas exigem o projecto real.

## Manutenção
Backups separados da base e das imagens. Monitorizar limites do Supabase e tráfego/builds do Render. A publicação depende da disponibilidade do Supabase, mesmo sendo o alojamento estático. Revisar actualizações de dependências antes da produção definitiva.
