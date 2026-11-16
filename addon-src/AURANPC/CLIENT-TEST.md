# Validação no Forever — NOT_RUN

Usuário só poderá executar depois. Primeiro use `/auranpc test`: conferir borda fixa, pulso, exclamação, texto e desaparecimento após 10s. Abra `/auranpc`: ajustar escala/altura para seu conjunto de placas. Não confundir demonstração com detecção.

Com uma quest aceita de abate/coleta e objetivo pendente, aproxime NPCs correspondentes ao ar livre, de frente, com placas visíveis. Confira contador **Desenhados**, compare NPCs da quest e outros NPCs. Mova a câmera e observe o NPC andando. Mate/saqueie até terminar um objetivo: somente NPCs desse objetivo devem deixar de destacar. Abandone/entregue: não pode sobrar marcador.

Repita em dungeon durante combate, com e sem addon de placas. Confira erros Lua/taint e ausência de marcação compartilhada com colegas. Quest sem mapeamento só pode usar tooltip se o título real for público e único. Se placas forem proibidas, deve informar restrição e não desenhar errado.

Faça `/reload`, retome a quest, troque personagem: não deve importar progresso alheio. Desligue auxílio de placas e confirme restauração da preferência anterior. Troque pulso/faixa/som e ajuste posição. Em grupos densos, avaliar sobreposição e consumo de CPU; não garantir legibilidade sem esse teste.

Registrar build/interface por `/dump GetBuildInfo()`, quest ID, NPC ID se público, dungeon/área, addon de placas, `/auranpc status`, erro Lua e resultado observado. Somente depois promover a CLIENT_VERIFIED.
