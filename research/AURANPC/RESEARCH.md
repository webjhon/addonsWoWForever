# AURANPC — pesquisa, capacidade e revisão crítica

Referências consultadas em16/11/2026. Target: Forever / Alliance /1–60 / interface16001. Executável instalado1.60.1.70938; sem processo WoW ativo na inspeção. Isso não confirma GetBuildInfo em execução.

## Fontes versionadas e direitos

- UI Blizzard, branch **forever**, commit **bebcb6bf309cf41b41bd74f8ca651e6a105b2676**, 13/11/2026: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_SettingsDefinitions_Frame/Nameplates.lua . A tela de opções altera `ShowQuestUnitCircles` entre0/1 nos modos de nomes de NPC. Evidência de integração no Forever, não de renderização nesta sessão.
- CVarDocumentation da mesma referência: namespace `C_CVar`; GetCVar retorna string/nil; GetCVarInfo fornece valor, default e flags locked/secure/readOnly; SetCVar exige CVar válido, público, não secure/readOnly e retorna bool. O addon não registra CVar faltante, não altera flags de segurança e exige readback.
- UnitDocumentation da mesma referência: `UnitIsQuestBoss(unit)` retorna bool com restrições de segredo. É usado como contexto opcional do alvo, não como base de uma lista inventada de todos os NPCs de quest.
- QuestLogDocumentation da mesma referência: GetNumQuestLogEntries retorna entradas exibidas e número de quests; usar segunda saída como contagem, nunca confundir headers com quests.
- GetInstanceInfo/UnitLevel/UnitFactionGroup/UnitGUID/combate/zone: documentação e snapshot MIT Thunderz96/forever-addon-kit8dc297689059dd204bf8663a05aaa36d6a628b76 (build69893) como referência de presença; runtime70938 UNVERIFIED. Eventos sem payload consumido também permanecem sujeitos à validação real.
- Discussão no domínio Blizzard sobre círculo amarelo: https://us.forums.blizzard.com/en/wow/t/yellow-circle-under-quest-mobs/984796 . Referência de comportamento histórico, não confirmação de cor/abrangência na build atual. A aparência é nativa e não configurada pelo addon.

Somente resumos originais e nomes/assinaturas factuais registrados. Nenhuma implementação Blizzard, guia comercial ou arte de terceiros copiada. Ícone original gerado por código; Hunter compartilhado da fábrica. Nenhum arquivo privado de Zygor/RestedXP foi aberto.

## Avaliação de capacidade

`ShowQuestUnitCircles`: **SUPPORTED_WITH_LIMITATIONS na referência Forever**, **UNVERIFIED no runtime70938**. Não expõe criação arbitrária de aura3D. Seleção de NPC, movimento, cor e renderização pertencem ao motor do jogo, não à UI Lua. Apenas a configuração e sua leitura podem ser testadas no mock. Não há exceção para restrições de dungeon nem marcador desenhado por coordenadas de tela.

Mudanças de CVar: condicionadas a valor0/1 não secreto, flags públicas desbloqueadas e fora de combate. Preservar ajuste original apenas se o addon o mudou; não disputar alterações externas. Estado e preferência por GUID; configuração nativa pode ser compartilhada e por isso a recuperação guarda o proprietário do ajuste.

## Revisão como jogador

O produto fica fora do caminho: ligar o addon é suficiente; não é preciso apontar todos os NPCs ou administrar listas. A função central é uma integração do recurso que já existe no cliente, não um renderer3D novo. O painel só serve para status/pausa/conflitos e não é apresentado como demonstração da aura no mundo.

Quests alteram o contexto sem repetição de escrita. Mudança de zona preserva a ativação; a relevância e posição dos círculos mudam no próprio jogo. Pausa/desinstalação não deve substituir configuração nativa que já estava ativa; a documentação explica que pausar gerenciamento não necessariamente desliga um círculo habilitado antes.

Riscos que impedem aprovação visual definitiva: ausência de jogo real; círculos podem não abranger certos NPCs, doadores, entregadores ou situações de instância; cor/renderização são definidas pelo cliente; outro addon pode desativar o ajuste. Estados indisponível/conflito são explícitos, sem fallback enganoso em nameplate.

Resultado da revisão: candidata de integração nativa útil para o pedido de círculo de quest. Não satisfaz uma exigência distinta de aura3D personalizada em qualquer NPC arbitrário. Acompanhamento do movimento, cor amarela e dungeon só podem ser promovidos a CLIENT_VERIFIED depois do roteiro de INSTALL.md no jogo.
