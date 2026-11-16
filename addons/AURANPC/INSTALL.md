# AURANPC — instalação e uso

Extraia `AURANPC-1.0.0-candidate.zip` e copie a pasta `AURANPC` para `_forever_/Interface/AddOns/`. O arquivo `AURANPC.toc` deve estar diretamente nessa pasta. Reinicie o cliente ou use `/reload`.

AURANPC habilita automaticamente **o círculo nativo de unidades de quest** para Alliance níveis1–60. Não é necessário selecionar NPCs nem manter um painel aberto. O motor do jogo identifica as unidades relevantes, mantém o indicador no cenário e acompanha o movimento. Mundo aberto e dungeons party usam o mesmo recurso.

- `/auranpc`: abrir status/opções e créditos Tonho Contrabando.
- `/auranpc on`: reativar gerenciamento, inclusive após conflito com outro ajuste.
- `/auranpc off`: pausar e restaurar somente a configuração que o addon alterou.
- `/auranpc status`: imprimir estado e build observada.

Se o círculo já estava habilitado antes do addon, pausar preserva essa configuração original. Se outro addon o desligar, AURANPC informa conflito nas opções e cede controle; não cria disputa contínua de configurações. Alterações em combate aguardam o fim do combate. Preferências são separadas por personagem.

Antes de remover/desativar o addon no gerenciador, use `/auranpc off` para restaurar o ajuste anterior; código desativado não consegue executar restauração.

## Limites importantes

O destaque é o **círculo nativo no chão**, normalmente amarelo, não um efeito de partículas3D novo nem um contorno personalizável do corpo inteiro. O jogo determina cor, formato e quais unidades participam. Não há API verificada para aplicar livremente uma aura3D a todo NPC de qualquer quest. Não se promete círculo em todo doador/entregador de quest, quests não aceitas ou NPC sem marca nativa. Não são alterados nameplates, arquivos de gráficos ou restrições de instância.

Ativar a configuração não comprova que um círculo foi renderizado. Caso o cliente não exponha o ajuste público ou o bloqueie, o addon informa indisponibilidade. Runtime e aparência em Forever70938 ainda precisam de teste real. Nenhum teste em jogo foi realizado nesta candidata.

## Verificação no cliente pendente

1. Confirmar `/dump GetBuildInfo()` e carregamento sem erros; abrir `/auranpc` e conferir créditos/ícone pixel art.
2. Com uma quest aceita de matar/coletar, verificar um NPC reconhecido pelo jogo: círculo no chão, cor e atualização após progresso/entrega.
3. Observar esse NPC andando, sem selecioná-lo e com placas de nome desligadas. Confirmar que o círculo pertence à unidade e permanece enquanto ela se move.
4. Repetir em dungeon party; verificar comportamento com friendly NPCs e alvos sem relevância. Ausência de marca nativa não é substituída por um efeito inventado.
5. Testar combate, reload, desativação, logout e outro personagem; conferir restauração do ajuste anterior e conflitos com outros addons.

Status: candidata técnica; **não CLIENT_VERIFIED**.
