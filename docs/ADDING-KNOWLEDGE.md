# Acrescentar conhecimento confiável

## Texto de referência

Crie `rag/raw-docs/minha-fonte.md` apenas com texto original, licenciado ou cuja indexação seja autorizada e um arquivo `minha-fonte.md.meta.json`:

```json
{"source_id":"my-source-v1","domain":"api","title":"Título","faction":"Alliance","evidence":"EXPORTED_FROM_CLIENT","build":"BUILD-VERIFICADA","uri":"https://exemplo.com/fonte","license":"authorized"}
```

Depois execute `npm run index`. O índice é idempotente por ID/hash do conteúdo; o domínio e os filtros seguem os metadados. Sem build verificada, deixe `build` ausente e marque `UNVERIFIED`/`COMMUNITY_UNVERIFIED`.

## Dados estruturados

Use `upsertEntity(db,{id,kind,name,faction,alliance_access,min_level,max_level,source_id,evidence,build,payload})` em uma rotina de ingestão autorizada. Entidades válidas podem ser `quest`, `zone`, `npc`, `class`, `ability`, `pet`, `item`, `flight_master` etc. Use `linkEntities(db, {id,from_id,to_id,relation,source_id})` para a malha de dependências.

**Jamais** preencher automaticamente identificadores/coords não confirmados nem importar Horde para consumo do agente. Registros de Horde estão presentes apenas em fixtures negativas.

## Dados que faltam de propósito

Bases reais de quests/rotas/Flight Masters, dungeons novas, talentos Legacy, combinações raça/classe e pet spawns não foram inventadas. É necessário curar fontes por build, verificar licença e executar ingestão separada antes de desenvolver addons que dependam desses detalhes.
