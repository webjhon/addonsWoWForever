# Publicação, benchmark e rebranding de addons Forever

Conhecimento original da entrega Tonho QuestGlow,18/11/2026. Usar a skill .agents/skills/publish-wow-addon/SKILL.md para deploy/CurseForge. Evidência de gameplay PARTIAL_CLIENT_TESTED: Forever1.60.1 build70959/interface16001, ptBR, Alliance nível2, mundo aberto. Metadados Neutral/Both significam que o procedimento é compartilhável; não certificam gameplay Horde. Contexto: products/TonhoQuestGlow/DEPLOYMENT-CONTEXT.md; medidas em BENCHMARK.json; relatório por cenário em TEST-REPORT.md.

## Pacote público limpo sem perder validação

O installable deve conter somente TOC, módulos runtime, arte própria e documentos de usuário/licença. Blueprints, referências, relatórios de testes, caminhos absolutos, caches, logs, credenciais e metadados da fábrica ficam fora do ZIP. O perfil distribution:public mantém os validadores de autoria Tonho Contrabando, proteção de APIs/valores secretos, interatividade e duas facções. Testar allowlist, integridade CRC/hash e identidade dos arquivos. Não ofuscar Lua nem apagar avisos MIT/terceiros para esconder origem. Um pacote local pronto não comprova submissão/moderação externa.

## Rebranding e duas instalações

Título visível, pasta/TOC, frames, caminhos de assets, comandos e SavedVariables são identidades distintas. A mudança AURANPC→TonhoQuestGlow preservou /auranpc como alias e adicionou /tqg e /questglow. Migração opcional depende de AURANPCDB estar disponível na primeira sessão; depois a tabela TonhoQuestGlowDB é preservada e o renderizador antigo deve ser desativado. Verificar IsAddOnLoaded dos dois para não medir duplicação. Nesta sessão o novo diretório foi descoberto após reload: não presumir a necessidade universal de reiniciar todo o cliente. Conferir hashes instalados contra addon gerado pelo empacotador, incluindo branding injetado.

## Benchmark de memória atribuído ao addon

UpdateAddOnMemoryUsage seguido de GetAddOnMemoryUsage pelo nome mede memória atribuída, não RAM total do computador/processo ou VRAM. Registrar amostras brutas, intervalos, estado cold/warm, placas, janelas e build. Tonho QuestGlow sozinho: seis amostras/10s após reload,2025–2469KiB; oito amostras/30s durante painel, bag, movimento e início de combate,3622–9269KiB. Referência AURANPC aquecida7671–8225KiB. Não comparar percentuais com aquecimento/GC diferentes, nem chamar crescimento curto de vazamento. Não modificar comportamento aprovado por otimização especulativa quando custo não foi demonstrado alto. Nenhum CPU profiling, RSS, VRAM, dungeon/Horde ou longa duração foi medido nesta entrega. Instrumentação temporária não entra no produto.

## Screenshot, ferramentas e restauração

Captura de produto deve mostrar detecção real: o lobo da quest em movimento, carne na bag e loot, itens comuns sem marca e limpeza após coleta. Demonstração só prova desenho. Recortar chat e nomes de terceiros, sem reconstruir estados; manifesto registra cena/versão/hash/recorte. Auto-loot pode esconder a janela: testar desligado e restaurar a preferência. A sessão restaurou autoInteract0/autoLootDefault1 e confirmou. Um travamento de controle do aplicativo CurseForge por cerca22min exigiu recuperação, verificação do personagem vivo/logado e nova observação; não declarar observação contínua. Atividade manual autorizada para manter sessão não vira recurso anti-AFK no addon.

## CurseForge e estados de publicação

Reconsultar requisitos oficiais atuais: nome/resumo inglês, descrição funcional inglês antes de traduções, ícone original400×400PNG, ZIP instalável, licença, changelog e categorias pertinentes. Marcar apenas flavor/versão realmente compatíveis; não selecionar Retail/Classic para contornar falta de Forever. Login no portal de autores é independente do app desktop. O seletor de logo não respondeu à automação, e o usuário completou esse envio. O fluxo waitForEvent(filechooser) antes do botão Choose File funcionou posteriormente para ZIP e galeria; tentativa sem confirmação visível não conta como upload. Texto longo deve usar paste/fill, pois typeText atingiu timeout e deixou descrição parcial antes de ser substituída. Preparar kit completo e pedir intervenção pontual quando necessário. Separar READY, SUBMITTED, UNDER_REVIEW e PUBLISHED; registrar URL/ID apenas quando observados. Publicar exige autorização vigente e acordos/CAPTCHA podem exigir ação do usuário. GitHub PR/Actions e aprovação de merge são estados independentes.

Fontes documentais oficiais consultadas18/11/2026: https://support.curseforge.com/support/solutions/articles/9000197279 ; https://support.curseforge.com/support/solutions/articles/9000197241 ; https://support.curseforge.com/support/solutions/articles/9000199552 ; https://us.forums.blizzard.com/en/wow/t/ui-add-on-development-policy/24534 . Essas fontes sustentam regras documentais, não testes do jogo.

Resultado observado: projeto CurseForge1815151 criado e arquivo9689104 submetido como Release para Forever1.60.1, com seis capturas reais legendadas. Estado inicialmente Uploading, aprovação pública não confirmada. Registro operacional em products/TonhoQuestGlow/curseforge/METADATA.json. IDs históricos não são destino automático de futuros produtos.
