# AURANPC 2.0 — contrato antes da implementação

Benefício: localizar visualmente criaturas necessárias às quests aceitas pelo próprio personagem Alliance 1–60, com destaque original amarelo de alto contraste preso à placa individual, persistente durante movimento. Acompanhamento automático, sem marcar progresso manualmente.

1. Aceitar quest, mostrar NPC associado: marcador e alerta local surgem. Progredir um objetivo: só seus NPCs desaparecem; completar/abandonar/entregar: remove tudo imediatamente.
2. Entrar em dungeon, nascer placa e mover NPC: ancoragem acompanha a placa; removê-la ou reutilizar token nunca deixa destaque no NPC errado.
3. Reload/personagem diferente: reconstrói pelo diário, configurações por GUID; tokens e progresso não são persistidos.
4. Secret values, tabelas restritas, placas proibidas e APIs ausentes: não acessar/comparar valores restritos, esconder marcador obsoleto e explicar diagnóstico.
5. Sem quests próprias, Horde ou nível fora de 1–60: nenhum destaque real. Não usa alvo/raid marks/mensagens de grupo nem modifica outras pessoas.
6. Demonstração usa o mesmo renderizador, mas fica identificada como demonstração; diagnóstico distingue correspondências de frames realmente mostrados.
7. Visibilidade: borda fixa opaca + pulso adicional, grande exclamação e seta para a placa; faixa local e som opcional. Opções persistentes de escala, pulso, som e auxílio de placas.

Limites: não projeta aura 3D no mundo; usa frames próprios sobre placas acessíveis. Alcance/offscreen/oclusão/placas proibidas limitam cobertura. Não garante 100%. Placas inimigas podem ser habilitadas localmente com opção reversível; isso não substitui a renderização. Não altera ShowQuestUnitCircles.

Evidência: ForeverAuras 1.4.3 (GPL2), padrões de eventos/ancoragem analisados por autorização, sem copiar código/arte. Gethe/wow-ui-source forever bebcb6bf309cf41b41bd74f8ca651e6a105b2676: NamePlate/TooltipInfo/QuestLog. EverythingQuests 9c1ce1e44238d8c6c8ca36d8f49836fde70b564f: associações numéricas MIT; object IDs excluídos. API/associações no executável instalado 1.60.1.70938 permanecem UNVERIFIED até teste real.

Teste no jogo: NOT_RUN, usuário só poderá testar depois. Mock e análise estática não aprovam compatibilidade visual/segurança do cliente.
