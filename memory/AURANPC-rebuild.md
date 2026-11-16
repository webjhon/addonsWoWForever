# AURANPC — decisão e falha conhecida, 2026-11-16

Relato do usuário: versão anterior/pulsar não destacou mobs dentro nem fora de dungeons. Usuário confirmou nome AURANPC e só poderá testar a reconstrução depois. Não há evidência suficiente para atribuir a falha antiga a uma API específica, pois não há log da sessão.

Decisão: abandonar dependência de círculos nativos. Implementar moldura amarela e pulso originais ancorados a placas públicas individuais, cache de objetivos reais por questID/tipo/ordinal, associações numéricas MIT e fallback conservador por título único. Inspiração autorizada ForeverAuras só para arquitetura, sem código/arte incorporados. Não usar raid marks, chat/comm de grupo ou automação de alvo.

Riscos: ancoragem/tooltip/secret model precisam de teste no Forever70938; placas proibidas não têm bypass; dados comunitários incompletos; densidade de marcadores e legibilidade exigem sessão real. Sem aura3D e sem garantia100%. Qualidade automatizada não aprova produto no jogo. Não converter NOT_RUN em CLIENT_VERIFIED em próximas tarefas.

Evidência persistente: research/AURANPC/ACCEPTANCE.md, API-CAPABILITIES.json, npc-data-provenance.json, TEST-REPORT.md e package-verification.json. Candidato2.0.0, feature branch, aprovação por PR sem merge automático.

Teste real posterior: falha2.0.0 reproduzida em Stockade70938; GUID e textos de tooltip secretos mesmo fora de combate. C_QuestLog.UnitIsRelatedToActiveQuest retornou true público. Correção2.0.1 desenhou destaque real e acompanhou NPC; reload/configuração/pulso/desativar/reativar observados. PARTIAL_CLIENT_TESTED, nunca promover restante a CLIENT_VERIFIED. Ver LIVE-SESSION-2026-11-16.md.
