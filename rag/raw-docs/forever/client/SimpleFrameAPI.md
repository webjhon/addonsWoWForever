# Cliente Forever 70938: SimpleFrameAPI

Documento SimpleFrameAPIDocumentation.lua; SHA256 c00bc77ee27f8fd81ba8b8d1bfd85fbd0ad817b22457adbe5adca6876a1d604a. Extraído do CASC local selecionado por manifesto.

Tipo ScriptObject; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

SimpleFrameAPI.AbortDrag() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.AddRoleset(roleset:string) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.CanChangeAttribute() -> canChangeAttributes:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.ClearAlphaGradient() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.ClearAttribute(attributeName:cstring) -> cleared:bool. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.ClearAttributes() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.CreateFontString(name:cstring?, drawLayer:DrawLayer?, templateName:cstring?) -> line:SimpleFontString. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.CreateLine(name:cstring?, drawLayer:DrawLayer?, templateName:cstring?, subLevel:number?) -> line:SimpleLine. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.CreateMaskTexture(name:cstring?, drawLayer:DrawLayer?, templateName:cstring?, subLevel:number?) -> maskTexture:SimpleMaskTexture. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.CreateTexture(name:cstring?, drawLayer:DrawLayer?, templateName:cstring?, subLevel:number?) -> texture:SimpleTexture. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.CreateVectorGraphics(name:cstring?, drawLayer:DrawLayer?, templateName:cstring?, subLevel:number?) -> vectorGraphics:SimpleVectorGraphics. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.DesaturateHierarchy(desaturation:number, excludeRoot:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.DisableDrawLayer(layer:DrawLayer) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.DoesClipChildren() -> clipsChildren:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.DoesHyperlinkPropagateToParent() -> canPropagate:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.EnableDrawLayer(layer:DrawLayer) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.EnableGamePadButton(enable:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.EnableGamePadStick(enable:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.EnableKeyboard(enable:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.ExecuteAttribute(attributeName:cstring, arguments:cstring?) -> success:bool, returns:cstring?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.GetAlpha() -> alpha:SingleColorValue. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetAttribute(attributeName:cstring) -> value:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.GetBoundsRect() -> left:uiUnit, bottom:uiUnit, width:uiUnit, height:uiUnit. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetChildren() -> children:SimpleFrame. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetClampRectInsets() -> left:uiUnit, right:uiUnit, top:uiUnit, bottom:uiUnit. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetDontSavePosition() -> dontSave:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetEffectiveAlpha() -> effectiveAlpha:SingleColorValue. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetEffectiveScale() -> effectiveScale:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetEffectivelyFlattensRenderLayers() -> flatten:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetFlattensRenderLayers() -> flatten:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetFrameLevel() -> frameLevel:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetFrameStrata() -> strata:FrameStrata. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetHighestFrameLevel(iterateAllChildren:bool) -> frameLevel:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.GetHitRectInsets() -> left:uiUnit, right:uiUnit, top:uiUnit, bottom:uiUnit. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetHyperlinksEnabled() -> enabled:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetID() -> id:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetNumChildren() -> numChildren:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetNumRegions() -> numRegions:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetOnUpdateMode() -> onUpdateMode:OnUpdateMode. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetPropagateKeyboardInput() -> propagate:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetRaisedFrameLevel() -> frameLevel:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetRegions() -> regions:SimpleRegion. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetResizeBounds() -> minWidth:uiUnit, minHeight:uiUnit, maxWidth:uiUnit, maxHeight:uiUnit. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetRolesetNames() -> rolesets:table. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetScale() -> frameScale:number. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.GetWindow() -> window:SimpleWindow. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.HasAlphaGradient() -> hasAlphaGradient:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.HasFixedFrameLevel() -> isFixed:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.HasFixedFrameStrata() -> isFixed:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.Hide() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.InterceptStartDrag(delegate:SimpleFrame) -> success:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.IsClampedToScreen() -> clampedToScreen:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsDrawLayerEnabled(layer:DrawLayer) -> isEnabled:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.IsEventRegistered(eventName:cstring) -> isRegistered:bool, units:UnitTokenType?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.IsFrameBuffer() -> isFrameBuffer:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsGamePadButtonEnabled() -> enabled:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsGamePadStickEnabled() -> enabled:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsHighlightLocked() -> locked:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsIgnoringChildrenForBounds() -> ignore:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsIgnoringParentAlpha() -> ignore:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsIgnoringParentScale() -> ignore:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsKeyboardEnabled() -> enabled:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsMovable() -> isMovable:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsObjectLoaded() -> isLoaded:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsResizable() -> resizable:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsRolesetFiltered() -> isRolesetFiltered:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsShown() -> isShown:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsToplevel() -> isTopLevel:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsUserPlaced() -> isUserPlaced:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsUsingParentLevel() -> usingParentLevel:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.IsVisible() -> isVisible:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.LockHighlight() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.Lower() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.Raise() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.RegisterAllEvents() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.RegisterEvent(eventName:cstring) -> registered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.RegisterEventCallback(eventName:cstring, cb:FrameEventCallbackType) -> registered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.RegisterForDrag(buttons:MouseButton) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.RegisterUnitEvent(eventName:cstring, units:UnitTokenType) -> registered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.RegisterUnitEventCallback(eventName:cstring, cb:FrameEventCallbackType, units:UnitTokenType) -> registered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.RemoveRoleset(roleset:string) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.ResizeToBoundsRect() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.RotateTextures(radians:number, x:number, y:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetAlpha(alpha:SingleColorValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleFrameAPI.SetAlphaFromBoolean(value:bool, alphaIfTrue:SingleColorValue, alphaIfFalse:SingleColorValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleFrameAPI.SetAlphaGradient(index:number, gradient:vector2) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetAttribute(attributeName:cstring, value:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetAttributeNoHandler(attributeName:cstring, value:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetClampRectInsets(left:uiUnit, right:uiUnit, top:uiUnit, bottom:uiUnit) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetClampedToScreen(clampedToScreen:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.SetClipsChildren(clipsChildren:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetDontSavePosition(dontSave:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetDrawLayerEnabled(layer:DrawLayer, isEnabled:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetFixedFrameLevel(isFixed:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetFixedFrameStrata(isFixed:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetFlattensRenderLayers(flatten:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetFrameLevel(frameLevel:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetFrameStrata(strata:FrameStrata) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetHighlightLocked(locked:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetHitRectInsets(left:uiUnit, right:uiUnit, top:uiUnit, bottom:uiUnit) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.SetHyperlinkPropagateToParent(canPropagate:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetHyperlinksEnabled(enabled:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.SetID(id:number) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleFrameAPI.SetIgnoreParentAlpha(ignore:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetIgnoreParentScale(ignore:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.SetIgnoringChildrenForBounds(ignore:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetIsFrameBuffer(isFrameBuffer:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameAPI.SetMovable(movable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetOnUpdateMode(onUpdateMode:OnUpdateMode) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetPropagateKeyboardInput(propagate:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
SimpleFrameAPI.SetResizable(resizable:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetResizeBounds(minWidth:uiUnit, minHeight:uiUnit, maxWidth:uiUnit?, maxHeight:uiUnit?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetRolesets(rolesetsString:cstring?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetScale(scale:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetShown(shown:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetToplevel(topLevel:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetUserPlaced(userPlaced:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetUsingParentLevel(usingParentLevel:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.SetWindow(window:SimpleWindow?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.Show() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.StartMoving(alwaysStartFromMouse:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.StartSizing(resizePoint:FramePoint?, alwaysStartFromMouse:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameAPI.StopMovingOrSizing() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.UnlockHighlight() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.UnregisterAllEvents() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleFrameAPI.UnregisterEvent(eventName:cstring) -> registered:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
