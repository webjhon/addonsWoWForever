# Conhecimento específico Horde

Este diretório recebe fatos revisados, não cópias do catálogo Alliance. Registre os shards no manifesto knowledge/packs/wowhead-forever/manifest.json e valide com npm run knowledge:validate. O schema aceita os mesmos tipos factuais, limites e fontes de cada campo.

Para fatos exclusivos Horde, declare faction:Horde, alliance_access:false e horde_access:true com field_sources.horde_access. Registros com elegibilidade desconhecida permanecem fora das consultas operacionais. A cobertura atual de quests Horde comprovadas é zero; os testes sintéticos da infraestrutura não alimentam este banco. Consulte docs/FACTION-SUPPORT.md.
