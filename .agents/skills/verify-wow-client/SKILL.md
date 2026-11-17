---
name: verify-wow-client
description: Validar uma funcionalidade de addon no cliente real do WoW Forever, reproduzir falhas e registrar evidência com escopo e limites.
---

# verify-wow-client

Use ao planejar a prova de utilidade e ao testar uma candidata no jogo. Leia os casos factuais em [lições](../../../knowledge/seed-docs/forever-live-client-lessons.md) a partir da raiz do repositório; o caminho canônico é knowledge/seed-docs/forever-live-client-lessons.md.

- Defina antes do código o resultado visível e a transição real que o demonstram. Um modo demonstração comprova desenho, não detecção. Separe coleta → associação/decisão → desenho → recuperação para localizar falhas.
- Registre build/interface, versão e contexto (mapa/instância, combate, quest/alvo). Compare os arquivos instalados com o candidato; recarregue após alterações. Instalações paralelas ou scripts antigos podem invalidar o diagnóstico.
- Observe primeiro o estado e os contadores; consulte apenas as APIs indispensáveis. Se um valor é secreto, descarte-o antes de comparar, formatar ou extrair partes. pcall não transforma valor secreto em público. Não atribua causa sem a leitura real que a sustenta.
- Use os controles e comandos do próprio addon para configurar/diagnosticar. Quando uma consulta de leitura exigir confirmação de scripts do cliente, o usuário resolve o aviso; não automatize a confirmação nem contorne a restrição.
- Siga a autorização de movimento do usuário e a ferramenta de controle disponível. Captura antiga não autoriza clique: reobserve após reload, troca de janela ou entrada concorrente; não digite comandos sem confirmar o foco do chat. Não fixe IDs de janela, coordenadas da tela ou personagens nesta skill.
- Reproduza o problema, aplique uma correção focal e repita o mesmo cenário. Acrescente uma regressão do comportamento que o mock não cobria. Depois rode os checks da fábrica e confira o conteúdo final instalado/empacotado.
- Registre ações realmente observadas e pendências em relatório por cenário. PARTIAL_CLIENT_TESTED é uma descrição de escopo, não promoção dos metadados globais clientVerified. Ausência de erro visível não prova ausência de taint. Não declare quests/combate/instâncias testados por analogia.
- Preserve somente recortes relevantes e sem chat/dados de terceiros como evidência de produto. Rotule mocks. Deixe opções e personagem em estado seguro e documentado.

Evidências originais: research/AURANPC/LIVE-SESSION-2026-11-16.md; research/AllianceDungeonTrail/LIVE-TEST.md. A sessão antiga não autoriza controle de um jogo em uma tarefa futura.

Faction coverage: new/revised addons support Alliance and Horde. Plan and record acceptance separately for both, including unknown faction and reload/character changes. Shared rendering/API lessons may be reused; historical Alliance observations do not certify Horde quests, routing or live behavior. Apply docs/FACTION-SUPPORT.md.
