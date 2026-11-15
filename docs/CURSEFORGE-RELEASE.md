# Checklist de entrega CurseForge

**O ZIP local é um candidato**, não uma publicação validada.

- Confirme que `## Interface: 16001` corresponde ao cliente em uso (`/dump select(4, GetBuildInfo())`).
- Descompacte o ZIP e confirme que `.toc` está na raiz da pasta do addon, sem pasta extra.
- Verifique o ícone in-game gerado em `assets/Icon.tga` e `## IconTexture: Interface\AddOns\Addon\assets\Icon.tga`.
- Teste o recurso em personagem Alliance no intervalo 1–60; teste comportamento fora de escopo quando aplicável.
- Teste comando, logout, reload, reinício, combate, mudanças de resolução e conflitos básicos.
- Considere a validação visual em cliente real; mocks não reproduzem todo o ambiente.
- Prepare descrição e notas de versão, screenshots próprias, arquivo PNG de arte separado em `releases/Addon-icon.png`, tags e licença.
- Marque a versão correta **Forever** no projeto CurseForge; não selecionar Classic Era por engano.
- Revise copyright de sprites, fontes, textures, dados de guia e exemplos terceiros.
- Nunca afirmar publicação automática: o projeto apenas prepara o candidato.
