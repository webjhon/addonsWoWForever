# Fontes, direitos autorais e confiabilidade

`knowledge/sources/manifest.json` lista **candidatos** para revisão (URLs não garantem licença, validade ou atualização). A ferramenta `npm run sources:check` pode verificar disponibilidade de links via HEAD quando houver rede; isso **não** equivale a verificar o conteúdo. Nenhum scraper reprocessa websites automaticamente na versão inicial.

## Evidência

- `CONFIRMED_IN_CLIENT`: testado em jogo na build registrada.
- `EXPORTED_FROM_CLIENT`: presente em dump da interface, sem confirmação funcional.
- `OFFICIAL_DOCUMENTATION`: documentação publicada pelo titular e pertinente à build.
- `COMMUNITY_VERIFIED`: evidência comunitária reproduzível.
- `COMMUNITY_UNVERIFIED`: hipótese comunitária não reproduzida.
- `INFERRED`: inferência, nunca conclusão confirmada.
- `UNKNOWN`/`UNVERIFIED`: falta comprovação.
- `SYNTHETIC_TEST`: exclusivamente fixtures, **não é gameplay real**.

Para cada documento, usar sidecar `.md.meta.json` com `source_id`, `domain`, `title`, `uri`, `build`, `evidence`, `license`, `faction`, `alliance_access`. Somente ingestão de material original, licenciado ou autorizado. O indexador pula domínios especificamente negados e fontes com `reviewed:false` quando referenciadas pelo manifesto.

## Zygor e RestedXP

As pastas estão no `.gitignore`. Só armazene materiais que tem direito de usar e **não faça commit, distribuição nem indexação automática de conteúdo protegido**. Extrair ideias genéricas de UX em notas próprias não equivale a copiar rotas, dados proprietários, código ou interface gráfica protegidos.
