# Identidade obrigatória — Tonho Contrabando

**Crédito exato em todos os addons:** `Tonho Contrabando`.

- TOC obrigatório: `## Author: Tonho Contrabando`.
- Arte padrão original: `design-system/branding/TonhoHunter.png` e `TonhoHunter.tga` (Hunter em pixel art). Ela acompanha cada addon como `assets/TonhoHunter.tga`, mas NÃO substitui a identidade visual específica `assets/Icon.tga` do addon.
- Créditos na primeira abertura de cada addon por sessão: janela modal de apresentação com **CRÉDITOS A** e **Tonho Contrabando**, pixel-art Hunter e botão Continuar.
- A fábrica insere `TonhoBranding.lua` no TOC ANTES dos arquivos de produto e copia textura para cada pasta de addon no ZIP. Código deve registrar sua janela principal via `ns.TonhoBranding:RegisterWindow(mainFrame)` imediatamente após criar a janela (ou chamar `ns.TonhoBranding:Show()` na primeira interação de addon sem janela).
- O splash não surge todo login sem o addon ser aberto e não deve comprometer uso de combate. Fechamento é por clique do jogador; aparece no primeiro abrir da sessão.
- O namespace de cada addon é isolado; vários addons instalados não devem compartilhar estado global de créditos.

**Importante:** O teste automatizado verifica presença, integração e arquivos; a renderização real no WoW precisa ser testada em cliente para confirmar textura, fontes, escala e comportamento. Se o addon abrir sozinho na inicialização, o splash abrirá junto. Se não houver `RegisterWindow` ou `Show`, o validador bloqueará o empacotamento.
