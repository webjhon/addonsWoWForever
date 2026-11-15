# Contrato de escopo Alliance 1–60

Todo blueprint precisa declarar `game:"WoW Forever"`, `faction:"Alliance"`, `purpose:"leveling"`, níveis `1`–`60` e `interfaceVersion` igual à configuração. O validador rejeita divergências.

Toda query operacional SQL filtra `faction IN ('Alliance','Neutral')`, `alliance_access=1`, e interseção do nível. Áreas neutras não ganham acesso automaticamente: devem ser marcadas explicitamente acessíveis à Alliance com evidência.

A base contém registros **sintéticos** de Horde para testes negativos. Eles não são conhecimentos disponíveis ao agente no domínio operacional. A fábrica não deve desenvolver módulos para Horde, raids de endgame ou PvP competitivo como objetivo principal.

As rotas, novos talentos Legacy, zonas, quests, dungeons, combinações raça/classe, flight masters e pets devem ser versionados e confirmados para Forever; faltando evidência, registrar lacuna em `memory` e omitir números exatos.
