# Política da memória persistente

A tabela `memories` guarda `decision`, `project`, `failure`, `preference`, `gap` e `probe`, com evidência, build, addon e data. Ela é separada do histórico curto `context/session-history.json`, que registra apenas etapas e resultados das sessões.

Uma decisão arquitetural (ADR) registra motivo e trade-off; uma falha descreve sintoma, causa e correção; uma lacuna permanece `UNVERIFIED` até haver evidência. Os registros não são auto-verificados simplesmente por terem sido gerados por IA. Nunca armazenar chaves, tokens ou dados privados de jogadores em logs de projeto.

O SQLite local fica em `.data/factory.sqlite` e não é publicado no GitHub. Para preservar conhecimento entre máquinas, use uma migração/backup autorizado, sem versionar o banco pessoal.
