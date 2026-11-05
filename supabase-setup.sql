-- Executar uma vez no SQL Editor do projecto Supabase, ANTES das migrações.
-- O Payload liga como utilizador privilegiado do servidor, nunca como anon.
CREATE SCHEMA IF NOT EXISTS cms;
REVOKE ALL ON SCHEMA cms FROM PUBLIC, anon, authenticated;
-- Não expor cms na configuração de schemas da Data API Supabase.
