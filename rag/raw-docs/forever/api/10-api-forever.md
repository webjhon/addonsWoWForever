# API de addons do WoW Forever

Uma referência comunitária gerada da `APIDocumentation` do próprio cliente lista **interface 16001**, build **70790**, com 410 sistemas, 6.621 funções, 1.816 eventos e 801 tipos no snapshot de **5 de novembro de 2026**. Esses números são um catálogo documental: não significam que todas as APIs sejam utilizáveis livremente em combate ou que continuem iguais nas próximas builds.

## Workflow técnico
1. Ler `config/wow-version.json` e confirmar a build ativa no cliente real.
2. Localizar a API exata na documentação apropriada à versão.
3. Conferir argumentos, retorno, eventos e uso de valores protegidos.
4. Examinar implementações da UI da Blizzard para entender padrões quando permitido.
5. Criar stub/teste isolado e validar em mock.
6. Para afirmar compatibilidade de fato, executar testes no jogo.

## Atenção
O cliente Forever combina jogabilidade 1–60 com APIs da família Mainline e seus controles modernos; usar código antigo de Classic por analogia pode falhar. Não presumir que macros, spells ou distância de alvo possam ser consultados ou executados de qualquer contexto. Não inventar o retorno de uma API.

**Para o catálogo completo de funções e eventos:** acessar a fonte externa (URL indicada nos metadados); o conteúdo técnico extenso não foi redistribuído dentro deste pacote.
