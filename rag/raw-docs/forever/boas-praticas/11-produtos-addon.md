# Backlog orientado por funcionalidades observáveis

A fábrica deve propor addons diferentes, conforme necessidades concretas do jogador da Alliance entre nível 1–60, mas sem depender de suposições sobre APIs ou IDs.

## Ideias com dependências verificáveis
1. **XP Pulse**: progresso de experiência e tempo de sessão; exige APIs e eventos de XP, interface compacta e SavedVariables.
2. **Dungeon Roadmap**: índice de masmorras por intervalo de nível; usa faixas publicadas e informa que a elegibilidade de quests requer validação.
3. **Legacy Planner**: catálogo de perks, decisões por personagem, dúvidas de progressão; ferramenta informativa inicialmente, podendo integrar dados do cliente quando API validada.
4. **Alliance Class Trainer**: alertas e roteiros de treinamento; requer dados reais de spells, custos e instrutores por build.
5. **Hunter Pet Journal**: caderno de pets e famílias; exige catálogo validado antes de fornecer localização exata.
6. **Quest Readiness**: pré-requisitos de chains; não lançar sem QuestIDs e relações com evidência.
7. **Camping Companion**: estados de descanso e benefícios disponíveis; precisa de observação real e proteção contra API secreta.

## Critério de qualidade
Não gerar um addon como concluído apenas por existir código Lua. Cada pacote deve conter instalação correta, ícone original, testes, descrição de capacidade, limites e indicação explícita de 'não testado no cliente' até haver evidência.
