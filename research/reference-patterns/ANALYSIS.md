# Zygor e RestedXP — análise funcional para a fábrica

Inspeção estática em 2026-11-16 dos snapshots locais: Zygor1.6 Forever e RestedXPv4.11.36. Não foi realizado teste novo no jogo. O catálogo knowledge/lessons/reference-patterns.json registra arquivos, intervalos e SHA256; não contém trechos de código nem dados de guias.

## O que podemos aproveitar

Padrões abstratos de produto/arquitetura, com implementação, identidade e dados originais. Nada desta análise concede compatibilidade de API ou licença de redistribuição de conteúdo de terceiros.

### Sinais, decisão e apresentação separados

Observado: Zygor atualiza o cache de quests e agenda a atualização do passo/painel; RestedXP agrega conclusão dos elementos ativos antes de avançar.

Adaptação original: Implementar snapshot legível → reconciliador → próxima ação → view. Separar PENDENTE, DESCONHECIDO, CONCLUÍDO e IGNORADO.

Aceitação: Evento duplicado não avança duas vezes; ausência de dados não conclui objetivo.

Evidência: market-references/zygor/QuestTracking.lua:409–417; market-references/restedxp/GuideWindow.lua:677–747.

### Elegibilidade antes da recomendação

Observado: Zygor avalia requisitos de raça/classe e condições; RestedXP filtra guias aplicáveis no carregamento.

Adaptação original: Avaliar facção, nível, classe, pré-requisitos e contexto com dados próprios. Não confundir passo inaplicável com quest entregue.

Aceitação: Personagem inelegível não recebe a ação; requisito desconhecido aparece como desconhecido.

Evidência: market-references/zygor/Step.lua:169–222; market-references/restedxp/GuideLoader.lua:36–112.

### Objetivos paralelos com uma prioridade principal

Observado: Ambos mantêm passos persistentes junto da progressão principal, chamados sticky nas referências.

Adaptação original: Mostrar uma próxima ação principal e poucos objetivos ainda relevantes em paralelo; cada um segue seu sinal real.

Aceitação: Concluir objetivo paralelo não perde o principal; objetivo ausente não permanece indefinidamente.

Evidência: market-references/zygor/Step.lua:716–748; market-references/restedxp/GuideWindow.lua:686–747.

### Inscrever, liberar e limitar trabalho

Observado: Zygor registra/remove observadores por objetivo; RestedXP limpa callbacks/eventos ao liberar elementos e agenda tarefas por referência.

Adaptação original: Registrar apenas o necessário; cancelar observadores/timers quando desativado ou contexto muda; agrupar rajadas e limitar geometria separada de leitura de quests.

Aceitação: Trocar guia repetidamente não multiplica callbacks; desativado não continua lendo diário por frame.

Evidência: market-references/zygor/Goal.lua:3847–3864; market-references/restedxp/GuideWindow.lua:267–314; market-references/restedxp/RXPGuides.lua:2068–2105.

### Retomar a próxima ação válida sem loops

Observado: Zygor busca próximo passo válido/completável e detecta revisitas no percurso; RestedXP separa progresso e elementos ativos.

Adaptação original: Reconciliar após login/reload/quest feita fora de ordem; usar IDs estáveis, limite de transições e detecção de ciclos. Skip manual muda intenção, não verdade da quest.

Aceitação: Reload retoma pelo diário; grafo cíclico para com diagnóstico; completar fora de ordem não exige checklist manual.

Evidência: market-references/zygor/Step.lua:676–706; market-references/restedxp/GuideWindow.lua:677–747.

### Sugestões contextuais e escolha explícita

Observado: Zygor apresenta guias sugeridos conforme condição/status; RestedXP remove um guia ativo carregando um guia vazio.

Adaptação original: Distinguir sugerido, escolhido e contexto atual. Permitir trocar/remover guia sem abandonar quests e explicar por que uma sugestão foi feita.

Aceitação: Troca preserva quests; remover limpa overlays/intenção; eventos não ressuscitam a escolha removida.

Evidência: market-references/zygor/GuideMenu.lua:445–467; market-references/restedxp/GuideLoader.lua:314–335.

### Destino válido com prioridades explícitas

Observado: Zygor pode escolher waypoint próximo entre objetivos visíveis elegíveis; RestedXP considera waypoints ativos antes dos de baixa prioridade.

Adaptação original: Escolher destino pela etapa aplicável e prioridade, usando proximidade somente como desempate quando faz sentido. Não substituir boss por entrada nem inventar waypoint.

Aceitação: Objetivo inaplicável ou já concluído não vence pela proximidade; entrada não vira posição interna.

Evidência: market-references/zygor/Step.lua:764–803; market-references/restedxp/map.lua:1023–1056; market-references/restedxp/map.lua:1111–1146.

### Direção própria e estado indisponível

Observado: RestedXP calcula orientação/distância a partir de posição/rumo e trata falta de dados ou continente errado.

Adaptação original: Desenhar seta original; mostrar destino e distância quando públicos. Ocultar geometria inválida e oferecer referência textual própria. Rota em grafo exige dados independentes; linha reta não contorna obstáculos.

Aceitação: Movimento e giro alteram a seta; falta de mapa/rumo elimina direção antiga; chegada não conclui quest.

Evidência: market-references/restedxp/map.lua:94–169; market-references/zygor/Pointer.lua:73–96.

### Configuração e controles recuperáveis

Observado: Zygor expõe fechamento de aba; RestedXP permite recuperar posição da seta e configurar escala, bloqueio e passos concluídos.

Adaptação original: Distinguir esconder painel, esconder overlay, pausar e remover plano. Posição/escala/fontes acessíveis, restauração e explicação do estado. Validar hit-testing no jogo.

Aceitação: Fechar/reabrir e reset funcionam sem reload obrigatório nem abandono de quest; última opção é alcançável.

Evidência: market-references/zygor/Tabs.lua:631–640; market-references/restedxp/map.lua:1149–1157; market-references/restedxp/SettingsPanel.lua:331–349; market-references/restedxp/GuideWindow.lua:191–191.

### Reutilização com limpeza de contexto

Observado: Zygor reutiliza abas disponíveis; RestedXP libera vínculo entre frame, elemento, eventos e callbacks.

Adaptação original: Usar pool apenas quando necessário, limpando referência anterior e handlers. Persistir intenção por personagem, não snapshots de conclusão nem callbacks.

Aceitação: Após reciclagem, clique/evento atua na unidade/guia atual; repetição não aumenta frames sem limite.

Evidência: market-references/zygor/Tabs.lua:161–186; market-references/restedxp/GuideWindow.lua:302–314.

### Separar mecanismo, dados e compatibilidade

Observado: RestedXP trata guias com identidade/versão no loader. Os dois TOCs declaram 16001, mas isso não prova cada API em runtime.

Adaptação original: Dados de conteúdo próprios com procedência/build e migração explícita; adaptadores de capacidade. Não importar DSL, guias, APIs antigas ou suposições Classic como compatibilidade Forever.

Aceitação: Atualização preserva intenção válida, invalida IDs removidos e mantém capacidade não testada como UNVERIFIED.

Evidência: market-references/restedxp/GuideLoader.lua:128–195; market-references/zygor/ZygorGuidesViewerForever.toc:1–19; market-references/restedxp/RXPGuides.toc:1–23.

### Atualizar só a informação visual que mudou

Observado: RestedXP evita reescrever distância quando não mudou e condiciona rotação; Zygor agenda atualização da view depois de atualizar o cache.

Adaptação original: Separar frequência visual da frequência do reconciliador; dar destaque à próxima ação sem recriar toda interface a cada evento. Medir, não prometer desempenho por analogia.

Aceitação: Ticker de geometria não consulta diário; objetivo muda no evento; feedback mantém legibilidade com pulso desligado.

Evidência: market-references/restedxp/map.lua:139–167; market-references/zygor/QuestTracking.lua:409–417.

## Decisões e limites

Inspeção estática de módulos selecionados; não auditoria completa nem teste dos addons no jogo.

market-references/zygor/ErrorLogger.lua começa com retorno imediato; presença de funções abaixo não prova execução.

Skip e etapas inaplicáveis podem avançar o guia das referências; implementação nova deve distinguir isso de conclusão autoritativa da quest.

Não incorporar: Guias, rotas, coordenadas, DSL e textos de terceiros; Automação de abandono/aceite/entrega, combate ou movimentação; Telemetria e comunicação de grupo como padrão; Marca, skin e arte dos produtos; APIs ou compatibilidade presumidas pelo TOC.

O caminho conhecido neste snapshot é market-references/, embora o usuário o chame REFERENCES. README antigo descrevia pastas vazias; a análise constatou arquivos locais. Entradas de runtime não lerão esses arquivos: utilizarão apenas este resumo original e o catálogo. Assim, a fábrica funciona sem instalar/distribuir os addons de referência.
