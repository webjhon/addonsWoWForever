# Cliente Forever 70938: Container

Documento ContainerDocumentation.lua; SHA256 dd3e4741d45720384f814d3f78ce975dab3951458ae894e728ed3aedc8ae56b3. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_Container. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_Container.CalculateTotalNumberOfFreeBagSlots() -> totalFreeSlots:number. SecretArguments=null; HasRestrictions=null.
C_Container.ContainerIDToInventoryID(containerID:BagIndex) -> inventoryID:luaIndex. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.ContainerRefundItemPurchase(containerIndex:BagIndex, slotIndex:luaIndex, isEquipped:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetBackpackAutosortDisabled() -> isDisabled:bool. SecretArguments=null; HasRestrictions=null.
C_Container.GetBackpackSellJunkDisabled() -> isDisabled:bool. SecretArguments=null; HasRestrictions=null.
C_Container.GetBagName(bagIndex:BagIndex) -> name:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetBagSlotFlag(bagIndex:BagIndex, flag:BagSlotFlags) -> isSet:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetBankAutosortDisabled() -> isDisabled:bool. SecretArguments=null; HasRestrictions=null.
C_Container.GetContainerFreeSlots(containerIndex:BagIndex) -> freeSlots:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemCooldown(containerIndex:BagIndex, slotIndex:luaIndex) -> startTime:number, duration:number, enable:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemDurability(containerIndex:BagIndex, slotIndex:luaIndex) -> durability:number, maxDurability:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemEquipmentSetInfo(containerIndex:BagIndex, slotIndex:luaIndex) -> inSet:bool, setList:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemID(containerIndex:BagIndex, slotIndex:luaIndex) -> containerID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemInfo(containerIndex:BagIndex, slotIndex:luaIndex) -> containerInfo:ContainerItemInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemLink(containerIndex:BagIndex, slotIndex:luaIndex) -> itemLink:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemPurchaseCurrency(containerIndex:BagIndex, slotIndex:luaIndex, itemIndex:luaIndex, isEquipped:bool) -> currencyInfo:ItemPurchaseCurrency. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemPurchaseInfo(containerIndex:BagIndex, slotIndex:luaIndex, isEquipped:bool) -> info:ItemPurchaseInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemPurchaseItem(containerIndex:BagIndex, slotIndex:luaIndex, itemIndex:luaIndex, isEquipped:bool) -> itemInfo:ItemPurchaseItem. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerItemQuestInfo(containerIndex:BagIndex, slotIndex:luaIndex) -> questInfo:ItemQuestInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerNumFreeSlots(bagIndex:BagIndex) -> numFreeSlots:number, bagFamily:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetContainerNumSlots(containerIndex:BagIndex) -> numSlots:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetInsertItemsLeftToRight() -> isEnabled:bool. SecretArguments=null; HasRestrictions=null.
C_Container.GetItemCooldown(itemID:number) -> startTime:number, duration:number, enable:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.GetMaxArenaCurrency() -> maxCurrency:number. SecretArguments=null; HasRestrictions=null.
C_Container.GetSortBagsRightToLeft() -> isEnabled:bool. SecretArguments=null; HasRestrictions=null.
C_Container.HasContainerItem(containerIndex:BagIndex, slotIndex:luaIndex) -> hasItem:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.IsBattlePayItem(containerIndex:BagIndex, slotIndex:luaIndex) -> isBattlePayItem:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.IsContainerFiltered(containerIndex:BagIndex) -> isFiltered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.PickupContainerItem(containerIndex:BagIndex, slotIndex:luaIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.PlayerHasHearthstone() -> itemID:number?. SecretArguments=null; HasRestrictions=null.
C_Container.SetBackpackAutosortDisabled(disable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetBackpackSellJunkDisabled(disable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetBagPortraitTexture(texture:SimpleTexture, bagIndex:BagIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetBagSlotFlag(bagIndex:BagIndex, flag:BagSlotFlags, isSet:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetBankAutosortDisabled(disable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetInsertItemsLeftToRight(enable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetItemSearch(searchString:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SetSortBagsRightToLeft(enable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.ShowContainerSellCursor(containerIndex:BagIndex, slotIndex:luaIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SocketContainerItem(containerIndex:BagIndex, slotIndex:luaIndex) -> success:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SortAccountBankBags() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_Container.SortBags() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_Container.SortBank(bankType:BankType) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.SortBankBags() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_Container.SplitContainerItem(containerIndex:BagIndex, slotIndex:luaIndex, amount:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.UseContainerItem(containerIndex:BagIndex, slotIndex:luaIndex, unitToken:UnitToken?, bankType:BankType?, reagentBankOpen:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Container.UseHearthstone() -> used:bool. SecretArguments=null; HasRestrictions=null.
