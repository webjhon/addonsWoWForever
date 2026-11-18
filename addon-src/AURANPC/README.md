# AURANPC 2.1.1 — NPCs, loot e itens nas bolsas

Tonho Contrabando • Alliance e Horde • níveis1–60.

O addon desenha seus próprios marcadores amarelos: nos NPCs associados às quests ativas, nas linhas de loot relacionadas a quests pendentes e nos itens de quests atuais nas bolsas. Os selos têm exclamação amarela e borda sólida; o loot pode pulsar. Não usa raid marks nem envia mensagens ao grupo e não coleta, move ou usa itens automaticamente.

Instalação: extraia a pasta AURANPC do ZIP em _forever_/Interface/AddOns/. Substitua a pasta antiga e recarregue o jogo. /auranpc abre as opções; /auranpc status mostra contadores; /auranpc items detalha quests, nomes de objetivos, botões descobertos e adaptador de bolsas. Preferências anteriores por personagem são preservadas; as opções novas começam ligadas: Itens no loot, Selos nas bolsas e Pulso dos itens no loot. Desativação geral remove todos os destaques.

A relação é identificada por questID público presente no diário, título público exato e único de quest no tooltip, ou flags públicas independentes de item ligado a quest ativa. O nome público exato do item também é comparado aos objetivos de tipo item das quests atuais; isso cobre Carne Dura de Lobo mesmo sem questID/QuestTitle e com isActive=false. A classificação genérica de item de missão não basta. Itens que só iniciam quests não aceitas não recebem selo. Itens comuns também podem ser reconhecidos quando o tooltip os relaciona a uma quest aceita. Itens nas bolsas mantêm o selo durante a entrega pendente; loot extra não é destacado para uma quest já pronta. Abandono/entrega limpam relações e um frame reciclado não deve herdar o selo do item anterior.

Suporte de UI: loot padrão e bolsas padrão, separadas ou combinadas, do Forever. Addons que herdam os métodos padrão podem ser descobertos pelos post-hooks; interfaces de terceiros totalmente próprias não têm compatibilidade garantida. Dados secretos/ausentes, frames proibidos e relações desconhecidas podem impedir um selo. Sem promessa de cobertura100%. Auto-loot pode fechar a janela antes de o efeito ser visível; o addon não interfere nisso.

Fontes locais extraídas do cliente1.60.1.70959 e testes automatizados/mock. Teste real parcial em18/11/2026, Alliance nível1, Vila Norte: Carne Dura de Lobo marcada na bag e no loot, coleta2/8→3/8, mudança de slot, reload e controles. Horde e dungeons desta versão ainda não foram testadas no cliente. Consulte LIVE-ITEMS-TEST.md, CLIENT-TEST.md e TEST-REPORT.md.
