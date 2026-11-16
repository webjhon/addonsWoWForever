# Falhas e decisões de ingestão — 15/11/2026

- **Indexador TXT criava fragmentos extras na segunda execução.** A saída antecipada de cache com `continue` pulava a condição de último fragmento. Um teste com duas execuções isoladas reproduziu a falha (`changed: 5` na segunda execução). A condição final agora é respeitada também no cache; a regressão passou. Bancos locais criados por versões antigas podem conter fragmentos históricos extras; esta correção impede novos fragmentos, mas não declara uma migração retroativa desses bancos.
- **Entrada CLI do indexador não executava corretamente no Windows.** Comparar `URL.pathname` a um caminho Windows não é equivalente a converter a URL. A guarda agora usa `fileURLToPath` e o teste executa o comando real em processo filho.
- **Ajv 8.17.1 apresentou aviso no npm audit.** Antes da entrega foi substituído por 8.20.0, versão corrigida indicada pelo registro. O relatório final deve refletir a auditoria executada, não a instalação inicial.
- **Fragmentos Classic/Retail em páginas Forever.** A presença de `/forever/` não confirma que comentários antigos ou todas as tabelas reflitam a build atual. São mantidas divergências e campos desconhecidos.
- **Completude falsa por limite de listagem.** O índice público de quests limita o número exibido. Não há um crawler nem declaração de que o site inteiro foi extraído.
- **Direitos sobre o site.** JSON local armazena fatos pontuais e referências, não texto de guias ou comentários. O código de ingestão não faz downloads nem transforma acesso público em autorização de redistribuição.
- **IDs e grafos.** Nenhum UIMapID ou pré-requisito direto foi inventado para preencher lacunas. IDs editoriais e IDs do jogo são separados; um grafo parcial não é uma rota de leveling completa.
