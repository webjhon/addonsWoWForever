# Instalação do pacote de atualização 0.2 da fábrica

Este ZIP é uma **ATUALIZAÇÃO PARCIAL**, não a fábrica inteira. Os arquivos foram preparados tomando como base os fontes de `webjhon/addonsWoWForever` (branch main).

1. Faça um backup da pasta do repositório local, ou use uma branch nova.
2. Abra o ZIP: selecione os **arquivos e pastas na raiz** (`AGENTS.md`, `src/`, `tools/`, `design-system/`, `docs/` etc.) e copie diretamente para a raiz da sua pasta `addonsWoWForever`.
3. Mescle as pastas, substituindo **somente os arquivos de mesmo nome** que constam neste pacote. **Não** crie `addonsWoWForever/addonsWoWForever/`.
4. **Não substitua modificações simultâneas** que outro agente tenha feito nos mesmos caminhos. Faça a comparação no GitHub Desktop antes do commit.
5. Execute no repositório, ou peça ao Codex para executar, `npm test`, `npm run example` e `npm run doctor`; os testes do novo addon também rodam durante seu build. Teste o splash no cliente real antes de publicação.
6. Crie PR da branch de atualização, reveja arquivos e aprove manualmente. Não faça push direto na main caso esteja recebendo atualizações de outra ferramenta.

O pacote **não altera** `.gitignore`, `market-references/`, os addons existentes nem os conteúdos do RAG. As instruções de agente aplicam-se ao próximo addon. Blueprints antigos sem contrato de interatividade/autor obrigatório serão recusados no empacotamento, de propósito.

Se você estiver trabalhando numa branch Codex diferente, faça merge/rebase supervisionado; NÃO resolva conflitos aceitando automaticamente todos os arquivos.

**Não garante perfeição automaticamente**: sinais detectados por análise estática e testes locais ainda exigem revisão humana e teste no WoW real.
