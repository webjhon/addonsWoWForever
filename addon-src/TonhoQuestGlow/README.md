# Tonho QuestGlow

Por Tonho Contrabando. WoW Forever, interface16001, Alliance e Horde, níveis1–60.

Destaques amarelos próprios para NPCs de objetivos pendentes, itens de quest no loot e itens necessários nas bolsas. Efeitos individuais ao jogador: não usam marcas de raide e não enviam mensagens ao grupo. O addon não coleta, usa ou move itens nem executa combate.

## Instalação

Extraia a pasta TonhoQuestGlow em _forever_/Interface/AddOns/. Reinicie o cliente se a pasta nova não aparecer na lista. Desative AURANPC antes de ativar Tonho QuestGlow para evitar dois renderizadores. Não remova seu backup antigo até conferir as preferências. Para migrar preferências, faça um primeiro reload com a pasta nova e AURANPC ainda habilitado; depois desative AURANPC e recarregue novamente antes de jogar. Os dados legados disponíveis nessa sessão são copiados para TonhoQuestGlowDB. Se o addon antigo já estiver desligado na primeira abertura, um perfil novo será criado. Não há leitura de arquivos de conta pelo addon.

## Comandos

- /tqg ou /questglow: abrir/fechar opções. /auranpc permanece como alias.
- /tqg open ou /tqg abrir: abrir.
- /tqg close ou /tqg fechar: fechar.
- /tqg status: resumo do funcionamento.
- /tqg items: diagnóstico dos selos de itens.
- /tqg test: demonstração visual por10 segundos, sem simular detecção.

## Configurações

Destaques gerais, pulso dos NPCs, som privado, faixa de alerta, auxílio de placas inimigas, loot, selos nas bolsas e pulso do loot têm controles próprios. Escala e altura dos marcadores são ajustáveis. Preferências são salvas por personagem. O auxílio de placas só altera a opção fora de combate e respeita mudanças externas.

## Compatibilidade

NPCs dependem de placas acessíveis e do alcance do cliente; não é aura3D nem destaque através de paredes. Itens usam relações públicas com quests aceitas; dados secretos ou desconhecidos não são adivinhados. UI padrão de loot/bolsas; outras interfaces exigem teste específico. Auto-loot pode fechar a janela antes de o efeito ser visto.

Associações numéricas comunitárias são fallback e podem ter lacunas. A implementação atende ambas as facções; a verificação real disponível é parcial, em Alliance/ptBR, mundo aberto, build70959. Horde e dungeons desta distribuição não foram certificadas no cliente. Sem garantia100%.
