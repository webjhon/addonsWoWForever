---
name: apply-reference-patterns
description: Considerar padrões funcionais analisados de Zygor e RestedXP ao projetar qualquer addon original da fábrica Forever.
---

# Aplicar padrões de referência

Antes de escolher arquitetura e critérios de aceitação, consulte npm run patterns:context -- "descrição". Em knowledge/lessons/reference-patterns.json estão 12 padrões, evidência estática e critérios propostos; research/reference-patterns/ANALYSIS.md explica as decisões. Não leia nem importe guias pagos para executar esta skill.

- Para todo addon, considere separação sinais/decisão/view, ciclo de observadores e compatibilidade/dados versionados. Para guia/quests, considere elegibilidade, progresso fora de ordem, objetivos paralelos e escolha de plano. Para navegação, prioridade de destino, geometria pública e falhas de mapa. Para UI, controles recuperáveis, limpeza de frames e feedback econômico.
- O contexto marca domínios pertinentes por descrição/APIs; revise o resultado contra o pedido real. No plano do produto/PR, registre adotado, adaptado ou não aplicável e o motivo para cada padrão. Seleção automática sugere, não comprova implementação. Não aumente o addon com recursos irrelevantes só porque existem nas referências.
- Converta os padrões adotados em cenários observáveis do addon solicitado. Inclua perda de dados, ações fora da ordem, desativação/reload e preferência explícita quando pertinentes. Uma lista de padrões ou um painel bonito não substitui comportamento reativo.
- Implemente do zero; use dados factuais próprios com fontes apropriadas. Não reutilize código, DSL, rotas, textos, coordenadas extraídas, marcas ou arte dos guias. Não carregue market-references em prompts/RAG em massa. Dependências requerem avaliação própria.
- Não transportar automação de abandono, aceite/entrega ou outros atos protegidos. Skip manual registra decisão do jogador, nunca quest concluída. Não copiar leitura/decodificação de valores secretos. Linha reta e catálogo de salas não equivalem a pathfinding.
- STATIC_REFERENCE_ANALYSIS é evidência de inspeção, não CLIENT_VERIFIED nem comprovação de API. Há código condicionado/inativo nas referências: verificar ponto de entrada e build antes de concluir que funciona. Combine com verify-wow-client e as skills de UI/NPC pertinentes; teste a implementação original na build alvo.
