# Alliance Dungeon Trail 1.0.0

Addon original para WoW Forever, Alliance, leveling 1–60. Interface alvo: 16001. Candidato instalável; validação dentro do jogo pendente.

## Instalação

1. Feche o WoW ou volte à seleção de personagens.
2. Extraia `AllianceDungeonTrail-1.0.0-candidate.zip` em `_forever_/Interface/AddOns/`.
3. Confira a estrutura: `Interface/AddOns/AllianceDungeonTrail/AllianceDungeonTrail.toc`. Evite uma segunda pasta `AllianceDungeonTrail` envolvendo a primeira.
4. Ative **Alliance Dungeon Trail** na lista de addons. Não precisa de bibliotecas externas ou de outro addon.
5. Entre com um personagem Alliance de nível 1–60 e digite `/adt`.

Os dados ficam em `AllianceDungeonTrailDB`, separados pelo GUID de cada personagem. Desinstalar a pasta não apaga o SavedVariables automaticamente.

## Como usar

Escolha uma dungeon no painel esquerdo. A faixa indicada é uma sugestão de planejamento, não uma afirmação do nível mínimo de entrada nem uma garantia de que o grupo consegue completá-la. Entre os níveis 1 e 12, prepare o personagem com quests externas.

Em **Quests**, veja onde obter cada missão, requisitos conhecidos e a referência interna. Obtenha as quests manualmente. No portal, pressione **Registrar entrada**. A entrada é manual e o addon não verifica qual instância você realmente acessou. O nome da run ativa aparece no Plano mesmo se você consultar outra dungeon.

Durante a run, objetivos importados do diário são atualizados por eventos. Os checks manuais indicam apenas a sua conferência. A ausência de uma missão no diário não significa conclusão. Ao terminar, pressione **Finalizar** antes de viajar ou entregar quests externas. Se saiu, trocou de grupo ou houve XP fora da dungeon, use **Descartar**. Reload/logout descarta a amostra ativa e preserva os checks.

Use o modo padrão **com quests** na primeira visita. Ative **repetição** antes de iniciar runs comparáveis sem entregas. Depois de duas amostras válidas, o Plano estima runs até o próximo nível e, por heurística, até a próxima faixa. O cálculo não usa valores fictícios de XP e não garante leveling exclusivo em dungeons. O histórico usado exige mesmo dia/build e nível próximo; mudanças de grupo, bônus, conteúdo e XP futura podem alterar o resultado.

O addon oculta a janela e adia leituras durante combate; a XP é reconciliada depois. Não movimenta seu personagem, luta, aceita/entrega quests ou reinicia instâncias.

## Quests em português e conteúdo adicional

Os nomes curados permanecem em inglês para facilitar conferência com as fontes. Quests com ID conhecido funcionam independentemente do título traduzido. Para as demais, abra **Diário** e use o ID real mostrado pelo cliente:

- `/adt vincular N ID`: liga a sugestão de número N à quest presente no diário.
- Clique em uma quest do Diário ou use `/adt adicionar ID`: adiciona uma quest à dungeon selecionada.
- `/adt nota N texto`: guarda uma referência pessoal de NPC, boss, objeto ou sala para a quest N.
- `/adt fonte N`: mostra a fonte pesquisada da quest N no seu chat local.
- `/adt entrar`, `/adt fim`, `/adt descartar`: equivalentes aos botões.
- `/adt ocultar`: esconde; `/adt`: abre novamente.

Não existe seta indoor nesta edição. Use as referências textuais, o diário, o mapa disponível no próprio jogo e as informações do grupo.

## Cobertura e limites

27 entradas de dungeon e 63 quests selecionadas. O catálogo não cobre todas as quests existentes. Shadowfang Keep, Alcaz Prison, Blackmaw Hold e Shaper's Terrace não têm quests curadas nesta edição; use Diário e notas pessoais. Disponibilidade de novas dungeons tardias, pré-quests completas e diferenças da build atual exigem confirmação no cliente. Os dados comunitários não são apresentados como fatos confirmados no jogo.

Cliente instalado observado: versão de arquivo 1.60.1.70938. Snapshot público de API consultado: 1.60.1.69893 / interface 16001. Essa diferença é material. Leia `TEST-REPORT.md` para os testes realizados e pendentes.

## Smoke test no jogo — ainda NÃO executado

1. Confirme `/dump GetBuildInfo()` e `/dump select(4, GetBuildInfo())` (alvo 16001).
2. Verifique ícone, janela, acentos, escala, arraste, scroll em ambas as colunas e `/adt`.
3. Pegue uma quest Alliance conhecida, vincule o ID se necessário e observe os objetivos progredirem; confira os estados pronta/entregue.
4. Registre entrada, ganhe XP, suba um nível, finalize e compare com a XP real.
5. Faça duas runs comparáveis em modo repetição; confira a estimativa. Descarte uma terceira e verifique que ela não entra na média.
6. Teste combate, reload, logout, outro personagem, personagem Horde e nível 60. Confirme ausência de erros Lua/taint.
7. Confira referências e disponibilidade de cada dungeon antes de confiar no percurso completo. Envie build, dungeon, quest ID e erro observado para correção.

## Licença

Código, interface e ícone originais sob a licença MIT do repositório. Fontes externas são referências factuais; não há código, passos ou artes de guias proprietários redistribuídos.
