# Validação de entrega — 6 de novembro de 2026

## Alterações

- Aplicação estática promovida à raiz; removidos os ficheiros do servidor Payload deste checkout. A cópia local anterior, incluindo alterações por guardar e configuração privada, foi preservada em `../catedra-payload-backup-20261106/`, fora do Git.
- Render configurado para publicar `out`, sem servidor Node nem migrações Payload.
- Removida a eliminação automática da imagem depois de um erro ao guardar: uma falha de rede pode ocorrer depois de a base já ter confirmado a gravação.
- Listagem por páginas, sem o corte anterior nas primeiras 1000 publicações.
- Leitor reage a mudanças do parâmetro `slug`, sem reutilizar o artigo anterior.
- Submissão sem botão explícito preserva o estado de publicação existente.
- Ajustes de quebra de texto e dimensões dos formulários em ecrãs pequenos.
- PostCSS e Sharp fixados em versões corrigidas; validação automática no GitHub Actions.

## Verificações

`npm run verify` executa cinco testes de chamadas ao backend, compilação estática, TypeScript e verificação dos ficheiros exportados. O build vem antes do TypeScript para gerar os tipos de rotas num checkout limpo.

Os testes usam respostas simuladas para verificar paginação, ausência de credenciais de editor nas leituras públicas, bloqueio de escrita sem sessão, conflitos de edição, restrições de upload e renovação concorrente da sessão.

`npm audit`: zero vulnerabilidades após a actualização. Foi aberta a exportação local no Edge; sem configuração Supabase, o feed apresenta o erro de configuração e permite tentar novamente.

## Pendências externas

Não foi aplicado SQL nem feita publicação no Render. É necessário configurar as duas variáveis públicas no Render e preparar o Supabase conforme o README. Login real, upload, publicação e isolamento de rascunhos por RLS precisam de teste contra esse projecto antes da entrega ao cliente. Os testes simulados não comprovam as políticas instaladas na base real.

Conteúdos e contas do Payload não são importados automaticamente. Os links das notícias usam `/noticia/?slug=...`; pré-visualizações individuais no Facebook continuam a exigir um serviço de metadados ou pré-geração.
