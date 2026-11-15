# Hunter no Forever — diferenças relevantes para addons

A Blizzard descreveu diferenças importantes da classe em relação ao Classic antigo. Aimed Shot torna-se habilidade básica no nível 20; Arcane Shot deixa de compartilhar tempo de recarga com Aimed Shot; Multi-Shot compartilha com Aimed Shot. As armadilhas podem ser usadas em combate, com recarga aumentada. Famílias de pets ganham mais identidade e recebem atributos de equipamentos do Hunter; foi anunciada a nova família Fox.

Hunter continua com foco em dano à distância, uso do pet como apoio, e limitações importantes de alcance; a Blizzard descreveu uma zona morta dentro de 8 jardas para ataques à distância. Isso é informação de design de combate, **não comprovação de que addons possam ler distância exata em combate**.

## Implicações para um addon
- Pet skills, family abilities e capturas exigem fonte específica de dados de pets Forever.
- Para alertas de alcance, verificar APIs reais e secret values da build antes de escolher indicadores ou cálculos.
- Ao sugerir prioridades de treino, verificar spellIDs, nível e instrutor atualizados.
- Não extrapolar conteúdo do Petopia Classic sem validação.
- Evitar automatizar combate ou ações protegidas.
