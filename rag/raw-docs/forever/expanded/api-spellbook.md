# Livro de magias: habilidades disponíveis e build alvo

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

Não inferir spellID, rank, custo ou nível a partir de nome conhecido de Vanilla. Um assistente de treinamento precisa de dados da build e leituras públicas do livro de magias. Recomendação informativa não executa rotação.

## Reconciliação e falhas

Atualizar por sinais de nível/treinamento e validar a capacidade específica. Quando uma habilidade estiver indisponível ou desconhecida, explicar isso. Não converter documentação de função em tabela completa de talentos do Forever.

## Contrato: C_SpellBook.GetSpellBookItemInfo

Argumentos: spellBookItemSlotIndex: luaIndex; spellBookItemSpellBank: SpellBookSpellBank. Retornos: spellBookItemInfo: SpellBookItemInfo. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/SpellBookDocumentation.lua.

## Contrato: C_SpellBook.IsSpellInSpellBook

Argumentos: spellID: number; spellBank: SpellBookSpellBank; includeOverrides: bool. Retornos: isInSpellBook: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/SpellBookDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
