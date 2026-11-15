# Matriz de capacidades do cliente

Comando: `npm run capability -- xp-display` (fixture `UNVERIFIED`). Uma funcionalidade desconhecida também retorna `UNVERIFIED` sem falsa confirmação. `SUPPORTED` requer evidência explícita ao cadastrar; `PROHIBITED` bloqueia a jornada.

Estados: `SUPPORTED`, `SUPPORTED_WITH_LIMITATIONS`, `UNVERIFIED`, `UNSUPPORTED`, `PROHIBITED`.

Para adicionar dados verdadeiros, insira IDs, APIs/eventos, build e evidências verificáveis com `setCapability(db, c)`; armazene a origem da prova. `GetBuildInfo()` em jogo determina a build ativa; ela não é preenchida por suposição.

WoW Forever utiliza APIs da família Mainline (não Classic Era puro); algumas leituras são restritas em combate ou envolvem secret values. O teste headless não reproduz o ambiente de segurança real. Não desenvolver bots nem contornos de ações protegidas.
