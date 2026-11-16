# Falha legado AllianceDungeonTrail — 16/11/2026

Main d187e520: Actions45/46. O teste estrutural antigo esperava o blueprint1.0, com autoria antiga e progresso manual, compatível com o contrato anterior mas rejeitado corretamente pelos novos validadores.

Solução: reconstrução2.0 orientada a snapshots/eventos e25 cenários comportamentais em Fengari, mantendo `src/guards.ts`, `src/product-quality.ts` e requisitos do empacotador intactos. Rejeições de autoria/contrato continuam testadas. A candidata é empacotada somente após a suíte específica passar.

Aprendizados: não converter ausência do diário em entrega; não atribuir XP externa ao segmento anterior; reload dentro da dungeon não é nova entrada válida; instância deve ser identificada por dado próprio, não por quest carregada; IDs Map não são UIMapIDs; preservar marcações externas e descartar waypoint obsoleto.

Fontes: research/AllianceDungeonTrail/API-CAPABILITIES.json, REBUILD-ACCEPTANCE.md, PRODUCT-REVIEW.md e relatórios executados. Testes no cliente continuam pendentes.
