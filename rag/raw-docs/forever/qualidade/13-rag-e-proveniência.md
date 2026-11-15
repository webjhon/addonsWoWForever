# Recuperação do RAG — instruções práticas para o agente

1. Identificar a intenção (quest, classe, talento, Hunter pet, rota, Legacy, API, interface).
2. Consultar documentos da mesma área e `query_alliance_records` para fatos estruturados.
3. Cada documento inclui `.meta.json` com URL, source_id e estado da evidência.
4. Não converter resumos do anúncio em dados internos do cliente; nomes anunciados não determinam IDs ou coordenadas.
5. Para uma funcionalidade técnica, buscar documentação de API e verificar build antes do blueprint.
6. Evidências `OFFICIAL_DOCUMENTATION` comprovam o comunicado, **não a execução da implementação no cliente**.
7. Se houver ausência de fonte ou contraditório, registrar gap, devolver plano seguro e exigir teste manual da build.
8. Armazenar uma decisão auditável, nunca registrar texto gerado pelo modelo como fonte verificada.

Este documento é uma política original de engenharia do repositório, não cópia da documentação da Blizzard.
