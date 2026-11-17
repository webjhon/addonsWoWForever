# Inspeção reproduzível do cliente Forever

A inspeção de 17/11/2026 leu a instalação autorizada, sem modificá-la. Identidade: produto wowf, versão 1.60.1.70938; texto/áudio ptBR; executável PE x64. Os hashes e tamanhos estão em `knowledge/client/current.json`. Não houve execução do jogo nem certificação de APIs nesta tarefa.

## Uso no circuito

`npm run client:context` apresenta o contexto revisado, também incluído no LLM e na etapa LOCAL_CLIENT_EVIDENCE do orquestrador. Um build explicitamente configurado e diferente interrompe a jornada. Build configurado como null significa compatibilidade desconhecida, não correspondência confirmada. O contexto é uma fotografia histórica: não detecta atualizações da instalação sem uma nova inspeção.

`npm run client:inspect -- "<raiz do cliente>" "<diretório extraído>"` gera `.data/client-intake.json`. Não substitui automaticamente o banco revisado. O segundo argumento é opcional; sem ele só examina os arquivos permitidos da instalação. Compare versão, hashes, documentação, schema e origem antes de promover fatos. O catálogo de 795 assinaturas em `knowledge/client/api-signatures.json` permite pesquisar nomes, argumentos, retornos, nilabilidade e restrições sem publicar Lua bruto. Prefixos SimpleFrameAPI etc. identificam tipos documentais: são métodos de objetos, não namespaces globais.

## Extração CASC efetivamente realizada

Ferramenta pública MIT: [TACTSharp/TACTTool 0.2.0-alpha1](https://github.com/wowdev/TACTSharp/releases/tag/0.2.0-alpha1), executável win-x64 em `.data/tools/tact/bin`. O comando abaixo reproduz a seleção exata, usando as chaves públicas da instalação obtidas por parseBuildInfo. Execute com acesso à rede restrito, sem arquivo WoW.txt e sem importar chaves de criptografia. Diretório de saída exclusivamente no workspace.

```powershell
& '.data/tools/tact/bin/TACTTool.exe' -b '<buildKey>' -c '<cdnKey>' -p wowf -d '<raiz do cliente>' -l ptBR -m list -i 'research/client/manifest.txt' -o '.data/client-extract/raw'
```

Os IDs das seis tabelas foram selecionados do [listfile público wowdev](https://github.com/wowdev/wow-listfile/releases/latest/download/verified-listfile.csv), e confirmados pela extração local. O manifesto e os hashes são a referência reproduzível; nomes sozinhos não provam existência. O formato é `ID;dbfilesclient/nome.db2`, sem prefixo `id;`. Confirme existência, tamanho e hash de cada saída; um exit code zero pode não extrair nada. Nome inexistente pode tentar baixar listfile; não amplie a seleção indiscriminadamente. O modo name observado pode ignorar `-o`; use list. CascLib 3.0 retornou erro 2 para este armazenamento wowf, enquanto TACTTool o abriu: não diagnosticar corrupção a partir da primeira ferramenta.

## O que os dados permitem

Os 18 documentos locais incluem quests, mapas, nameplates, unidades, gossip, instâncias, inventário, spellbook, CVars, addons, profiling e objetos gráficos. Os dez documentos já referenciados pela fábrica coincidiram byte a byte com o snapshot Gethe versionado. Isso fortalece a origem documental dos 33 contratos existentes, mantendo todos UNVERIFIED em runtime.

As tabelas locais têm 81 registros Map, 9 ChrClasses, 58 ChrRaces, 27 CreatureFamily, 17.991 SpellName e 154 SkillLine conforme os cabeçalhos. Não são contagens de masmorras, classes jogáveis, raças disponíveis ou spells utilizáveis. O parser WDC5 lê metadados estruturais conforme o [leitor primário DBCD](https://github.com/wowdev/DBCD/blob/master/DBCD.IO/Readers/WDC5Reader.cs); não descomprime linhas nem exporta textos. O schema WOWSTATIC_1_60_1_70399 é distinto do build do executável 70938. LayoutHash deve orientar uma próxima leitura com schema correspondente; min/max IDs não comprovam presença de IDs intermediários. Map não fornece sozinho mapas indoor ou rotas.

Os caches WDB forneceram 1.534 registros de criaturas, 2.016 objetos e 251 quests. O parser valida assinatura, build, locale, comprimentos, limites e terminador; não interpreta payload sem schema. Cache é resposta do servidor já encontrada pelo cliente, não catálogo completo ou prova de aceitação/conclusão. Os [formatos WDB](https://www.azerothcore.org/wiki/client-cache-wdb) ajudam a interpretar essa distinção, mas schemas antigos não são aplicados aos payloads Forever.

## Limites e proteção de dados

Não foram extraídos contas, personagens, SavedVariables, chats, tokens, logs pessoais, petitioncache, npccache ou pagetextcache. Config.wtf é filtrado somente para textLocale/audioLocale; valores ausentes continuam desconhecidos. Nenhuma alteração/injeção no executável, loader ou mecanismos de proteção foi feita. O código não baixa ferramentas, listfiles, conteúdo ou chaves automaticamente. A inspeção abre os arquivos somente para leitura e escreve resultados no workspace; arquivos de cache podem ser atualizados pelo jogo independentemente.

Não redistribuir arquivos brutos de cliente, textos de quests, guias, arte ou tabelas completas. Publicamos resumos originais, assinaturas factuais e hashes. Presença de API não comprova dados públicos, disponibilidade em combate, ausência de taint ou funcionamento de navegação. Para essas conclusões, planejar teste específico com verify-wow-client e manter o escopo de evidência.
