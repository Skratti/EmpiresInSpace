print '07 Merges.sql'
go
IF OBJECT_ID('[engine].shipModulesMerge', 'P') IS NOT NULL  DROP procedure [engine].shipModulesMerge;
IF OBJECT_ID('[engine].shipInsert', 'P') IS NOT NULL  DROP procedure [engine].shipInsert;
IF type_id('[engine].shipModulesMergeType') IS NOT NULL  DROP TYPE [engine].shipModulesMergeType; 


go 
CREATE TYPE [engine].shipModulesMergeType AS TABLE
    ( shipId Int ,
	moduleId SMALLINT ,
	posX TINYINT ,
	posY TINYINT,		
	hitpoints SMALLINT,
	active	bit 	)
go

create procedure [engine].shipModulesMerge
	(@shipModules [engine].shipModulesMergeType READONLY,
	@shipId int,
	@shipModulesVersionId bigint)
as
begin	
	/*
		declare @shipModules [engine].shipModulesMergeType;
		insert into @shipModules(shipId,posX,posY, moduleId ) select 1699,2,2,5
		begin tran
		select * from [dbo].[shipModules] where shipId = 1699
		exec [engine].shipModulesMerge @shipModules, 1699
		select * from [dbo].[shipModules] where shipId = 1699
		rollback tran
	*/
	begin tran;

	if NOT (SELECT COUNT(Ships.[id]) from dbo.Ships where dbo.Ships.id = @shipId and dbo.Ships.shipModulesVersionId < @shipModulesVersionId) = 1
	begin
		rollback tran;
		return;
	end
	
	update dbo.Ships 
	set dbo.Ships.shipModulesVersionId = @shipModulesVersionId
	where  dbo.Ships.id = @shipId;

	with modules as (select * from dbo.shipModules where shipId = @shipId)
	MERGE  modules AS shipModules
	USING @shipModules AS newShipModules
	ON (shipModules.shipId = newShipModules.shipId
		and shipModules.posX = newShipModules.posX
		and shipModules.posY = newShipModules.posY)
	WHEN MATCHED AND shipModules.moduleId <> newShipModules.moduleId
		THEN UPDATE SET shipModules.moduleId = newShipModules.moduleId
	WHEN NOT MATCHED THEN
		INSERT (shipId,moduleId,posX,posY,hitpoints,active)
			VALUES (newShipModules.shipId,newShipModules.moduleId,newShipModules.posX,newShipModules.posY,newShipModules.hitpoints,newShipModules.active)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

	commit tran;
end
go


IF OBJECT_ID('[engine].shipStockMerge', 'P') IS NOT NULL  DROP procedure [engine].shipStockMerge;
IF type_id('[engine].shipStockMergeType') IS NOT NULL  DROP TYPE [engine].shipStockMergeType; 

go
CREATE TYPE [engine].shipStockMergeType AS TABLE
    ( shipId Int ,
	goodsId SMALLINT ,
	amount Int)
go

create procedure [engine].shipStockMerge
	(@shipStocks [engine].shipStockMergeType READONLY,
	@shipId int,
	@shipStockVersionId bigint)
as
begin	
	/*
		declare @shipStocks [engine].shipStockMergeType;
		insert into @shipStocks(shipId,goodsId,amount ) select 1699,1,2
		begin tran
		select * from [dbo].[shipStock] where shipId = 1699
		exec [engine].shipStockMerge @shipStocks, 1699
		select * from [dbo].[shipStock] where shipId = 1699
		rollback tran
	*/

	if NOT (SELECT COUNT(Ships.[id]) from dbo.Ships where dbo.Ships.id = @shipId and dbo.Ships.shipStockVersionId < @shipStockVersionId) = 1
	begin
		return;
	end

	begin tran;
	update dbo.Ships 
	set dbo.Ships.shipStockVersionId = @shipStockVersionId
	where  dbo.Ships.id = @shipId;

	with stocks as (select * from dbo.shipStock where shipId = @shipId)
	MERGE  stocks AS shipStocks
	USING @shipStocks AS newShipStocks
	ON (shipStocks.shipId = newShipStocks.shipId
		and shipStocks.goodsId = newShipStocks.goodsId)
	WHEN MATCHED AND shipStocks.amount <> newShipStocks.amount
		THEN UPDATE SET shipStocks.amount = newShipStocks.amount
	WHEN NOT MATCHED THEN
		INSERT (shipId,goodsId,amount)
			VALUES (newShipStocks.shipId,newShipStocks.goodsId,newShipStocks.amount)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

	commit tran;
end
go

IF OBJECT_ID('[engine].shipMerge', 'P') IS NOT NULL  DROP procedure [engine].shipMerge;
IF type_id('[engine].shipMergeType') IS NOT NULL  DROP TYPE [engine].shipMergeType; 


go 
CREATE TYPE [engine].shipMergeType AS TABLE
    ( id INT,	
	userId int  , 	
	[name] nvarchar(63) ,	
	energy SMALLINT ,
	crew int ,	
	scanRange TINYINT ,
	attack SMALLINT ,
	defense SMALLINT,
	hitpoints SMALLINT,
	damageReduction tinyInt,
	cargoroom SMALLINT  ,
	fuelroom SMALLINT  ,		
	max_hyper Decimal(8,5) ,
	max_impuls Decimal(8,5) ,
	hyper Decimal(8,5) ,
	impuls Decimal(8,5) ,
	colonizer BIT ,
	[population] bigint,    
	shipHullsImage int,
	hullId TINYINT,
	systemX TINYINT,
	systemY TINYINT,
	spaceX  INT ,
	spaceY  INT,
	systemId INT,
	templateId INT ,
	refitCounter TINYINT,
	noMovementCounter TINYINT,
	objectId int , --one of the objects which are allowed by the table [ShipHullsImages]
	versionId bigint,
	experience int)
go

create procedure [engine].shipMerge
	(@ships [engine].shipMergeType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	
	MERGE  [dbo].[ships]
	USING @ships AS newShips
	ON ( [dbo].[ships].id = newShips.id and [dbo].[ships].versionId < newShips.versionId )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].[ships].userId = newShips.userId  , 	
			[dbo].[ships].[name] = newShips.[name]  , 	
			[dbo].[ships].energy  = newShips.energy  , 	
			[dbo].[ships].crew  = newShips.crew  , 	
			[dbo].[ships].scanRange  = newShips.scanRange  , 	
			[dbo].[ships].attack  = newShips.attack   ,
			[dbo].[ships].defense = newShips.defense  ,
			[dbo].[ships].hitpoints = newShips.hitpoints  ,
			[dbo].[ships].damageReduction = newShips.damageReduction  ,
			[dbo].[ships].cargoroom = newShips.cargoroom    ,
			[dbo].[ships].fuelroom = newShips.fuelroom    ,		
			[dbo].[ships].max_hyper = newShips.max_hyper   ,
			[dbo].[ships].max_impuls = newShips.max_impuls   ,
			[dbo].[ships].hyper = newShips.hyper   ,
			[dbo].[ships].impuls = newShips.impuls   ,
			[dbo].[ships].colonizer = newShips.colonizer   ,
			[dbo].[ships].[population] = newShips.[population]  ,    
			[dbo].[ships].shipHullsImage = newShips.shipHullsImage  ,
			[dbo].[ships].hullId = newShips.hullId  ,
			[dbo].[ships].systemX = newShips.systemX  ,
			[dbo].[ships].systemY = newShips.systemY ,
			[dbo].[ships].spaceX  = newShips.spaceX   ,
			[dbo].[ships].spaceY  = newShips.spaceY  ,
			[dbo].[ships].systemId = newShips.systemId,
			[dbo].[ships].templateId = newShips.templateId   ,
			[dbo].[ships].refitCounter = newShips.refitCounter   ,
			[dbo].[ships].noMovementCounter = newShips.noMovementCounter   ,
			[dbo].[ships].objectId = newShips.objectId   , --one of the objects which are allowed by the table [ShipHullsImages]
			[dbo].[ships].versionId = newShips.versionId,
			[dbo].[ships].experience = newShips.experience 
			; 	
end
go


create procedure [engine].shipInsert
	(@ships [engine].shipMergeType READONLY,
	 @shipStocks [engine].shipStockMergeType READONLY,
	 @shipModules [engine].shipModulesMergeType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	

	MERGE  [dbo].[ships]
	USING @ships AS newShips
	ON ( [dbo].[ships].id = newShips.id and [dbo].[ships].versionId < newShips.versionId )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].[ships].userId			= newShips.userId  , 	
			[dbo].[ships].[name]			= newShips.[name]  , 	
			[dbo].[ships].energy			= newShips.energy  , 	
			[dbo].[ships].crew				= newShips.crew  , 	
			[dbo].[ships].scanRange			= newShips.scanRange  , 	
			[dbo].[ships].attack			= newShips.attack   ,
			[dbo].[ships].defense			= newShips.defense  ,
			[dbo].[ships].hitpoints			= newShips.hitpoints  ,
			[dbo].[ships].damageReduction	= newShips.damageReduction  ,
			[dbo].[ships].cargoroom			= newShips.cargoroom    ,
			[dbo].[ships].fuelroom			= newShips.fuelroom    ,		
			[dbo].[ships].max_hyper			= newShips.max_hyper   ,
			[dbo].[ships].max_impuls		= newShips.max_impuls   ,
			[dbo].[ships].hyper				= newShips.hyper   ,
			[dbo].[ships].impuls			= newShips.impuls   ,
			[dbo].[ships].colonizer			= newShips.colonizer   ,
			[dbo].[ships].[population]		= newShips.[population]  ,    
			[dbo].[ships].shipHullsImage	= newShips.shipHullsImage  ,
			[dbo].[ships].hullId			= newShips.hullId  ,
			[dbo].[ships].systemX			= newShips.systemX  ,
			[dbo].[ships].systemY			= newShips.systemY ,
			[dbo].[ships].spaceX			= newShips.spaceX   ,
			[dbo].[ships].spaceY			= newShips.spaceY  ,
			[dbo].[ships].systemId			= newShips.systemId,
			[dbo].[ships].templateId		= newShips.templateId   ,
			[dbo].[ships].refitCounter		= newShips.refitCounter   ,
			[dbo].[ships].noMovementCounter = newShips.noMovementCounter   ,
			[dbo].[ships].objectId			= newShips.objectId   ,				--one of the objects which are allowed by the table [ShipHullsImages]
			[dbo].[ships].versionId			= newShips.versionId,
			[dbo].[ships].experience		= newShips.experience 			
	when not matched then
		insert ( [id]      ,[userId]      ,[name]      ,[systemX]      ,[systemY]      ,[spaceX]      ,[spaceY]
				  ,[hitpoints]      ,[damageReduction]      ,[attack]      ,[defense]      ,[scanRange]
				  ,[max_hyper]      ,[max_impuls]      ,[hyper]      ,[impuls]      ,[colonizer]
				  ,[hullId]      ,[systemId]      ,[templateId]      ,[objectId]      ,[versionId]      ,
				  [energy]	  ,[crew]      ,[cargoroom]      ,[fuelroom]      ,[population]
				  ,[shipHullsImage]      ,[refitCounter], noMovementCounter , experience)
		values ( newShips.id, newShips.userId  , newShips.[name]  , 	newShips.systemX  ,			newShips.systemY ,			newShips.spaceX   ,			newShips.spaceY  ,
				newShips.hitpoints  ,	newShips.damageReduction  ,newShips.attack   ,			newShips.defense  , newShips.scanRange  , 	
				newShips.max_hyper   ,			newShips.max_impuls   ,			newShips.hyper   ,			newShips.impuls   ,			newShips.colonizer   ,
				newShips.hullId  ,	newShips.systemId,	newShips.templateId   ,newShips.objectId   ,newShips.versionId,	
			newShips.energy  , 	newShips.crew  , newShips.cargoroom    ,	newShips.fuelroom    ,	newShips.[population]  ,   
			newShips.shipHullsImage  ,	newShips.refitCounter, newShips.noMovementCounter , newShips.experience );		

	with stocks as (select * from dbo.shipStock where shipId = (select id from @ships))
	MERGE  stocks AS shipStocks
	USING @shipStocks AS newShipStocks
	ON (shipStocks.shipId = newShipStocks.shipId
		and shipStocks.goodsId = newShipStocks.goodsId)
	WHEN MATCHED AND shipStocks.amount <> newShipStocks.amount
		THEN UPDATE SET shipStocks.amount = newShipStocks.amount
	WHEN NOT MATCHED THEN
		INSERT (shipId,goodsId,amount)
			VALUES (newShipStocks.shipId,newShipStocks.goodsId,newShipStocks.amount)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

	with modules as (select * from dbo.shipModules where shipId = (select id from @ships))
	MERGE  modules AS shipModules
	USING @shipModules AS newShipModules
	ON (shipModules.shipId = newShipModules.shipId
		and shipModules.posX = newShipModules.posX
		and shipModules.posY = newShipModules.posY)
	WHEN MATCHED AND shipModules.moduleId <> newShipModules.moduleId
		THEN UPDATE SET shipModules.moduleId = newShipModules.moduleId
	WHEN NOT MATCHED THEN
		INSERT (shipId,moduleId,posX,posY,hitpoints,active)
			VALUES (newShipModules.shipId,newShipModules.moduleId,newShipModules.posX,newShipModules.posY,newShipModules.hitpoints,newShipModules.active)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

end
go


IF OBJECT_ID('[engine].colonyStockMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyStockMerge;
IF OBJECT_ID('[engine].coloniesStockMerge', 'P') IS NOT NULL  DROP procedure [engine].coloniesStockMerge;
IF OBJECT_ID('[engine].colonyFullMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyFullMerge;
IF type_id('[engine].colonyStockMergeType') IS NOT NULL  DROP TYPE [engine].colonyStockMergeType; 

go 
CREATE TYPE [engine].colonyStockMergeType AS TABLE
    ( colonyId Int ,
	goodsId SMALLINT ,
	amount Int)
go

create procedure [engine].colonyStockMerge
	(@colonyStocks [engine].colonyStockMergeType READONLY,
	@colonyId int)
as
begin	
	/*
		declare @shipStocks [engine].shipStockMergeType;
		insert into @shipStocks(shipId,goodsId,amount ) select 1699,1,2
		begin tran
		select * from [dbo].[shipStock] where shipId = 1699
		exec [engine].shipStockMerge @shipStocks, 1699
		select * from [dbo].[shipStock] where shipId = 1699
		rollback tran
	*/
	with stocks as (select * from dbo.colonyStock where colonyId = @colonyId)
	MERGE  stocks AS colonyStocks
	USING @colonyStocks AS newColonyStocks
	ON (colonyStocks.colonyId = newColonyStocks.colonyId
		and colonyStocks.goodsId = newColonyStocks.goodsId)
	WHEN MATCHED AND colonyStocks.amount <> newColonyStocks.amount
		THEN UPDATE SET colonyStocks.amount = newColonyStocks.amount
	WHEN NOT MATCHED THEN
		INSERT (colonyId,goodsId,amount)
			VALUES (newColonyStocks.colonyId,newColonyStocks.goodsId,newColonyStocks.amount)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;
end
go

create procedure [engine].coloniesStockMerge
	(@colonyStocks [engine].colonyStockMergeType READONLY)
as
begin	
	/*
		declare @shipStocks [engine].shipStockMergeType;
		insert into @shipStocks(shipId,goodsId,amount ) select 1699,1,2
		begin tran
		select * from [dbo].[shipStock] where shipId = 1699
		exec [engine].shipStockMerge @shipStocks, 1699
		select * from [dbo].[shipStock] where shipId = 1699
		rollback tran
	*/	
	MERGE   dbo.colonyStock AS colonyStocks
	USING @colonyStocks AS newColonyStocks
	ON (colonyStocks.colonyId = newColonyStocks.colonyId
		and colonyStocks.goodsId = newColonyStocks.goodsId)
	WHEN MATCHED AND colonyStocks.amount <> newColonyStocks.amount
		THEN UPDATE SET colonyStocks.amount = newColonyStocks.amount
	WHEN NOT MATCHED THEN
		INSERT (colonyId,goodsId,amount)
			VALUES (newColonyStocks.colonyId,newColonyStocks.goodsId,newColonyStocks.amount)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;
end
go

IF OBJECT_ID('[engine].shipTranscensionMerge', 'P') IS NOT NULL  DROP procedure [engine].shipTranscensionMerge;


/*
drop TYPE [engine].shipTranscensionType
go 
CREATE TYPE [engine].shipTranscensionType AS TABLE
    ( shipId Int ,
	finishedInTurn Int)
go
*/
go
create procedure [engine].shipTranscensionMerge
	( @shipId Int ,
	@finishedInTurn Int,
	@finishingNumber int)
as
begin	

	update  dbo.[ShipTranscension]  set finishedInTurn = @finishedInTurn, finishingNumber = @finishingNumber
	where [ShipTranscension].shipId = @shipId
	/*	
		MERGE   dbo.[ShipTranscension] 
		USING @Transcension AS newShipTranscension
		ON ([ShipTranscension].shipId = newShipTranscension.shipId)
		WHEN MATCHED THEN UPDATE SET [ShipTranscension].finishedInTurn = newShipTranscension.finishedInTurn;
	*/

end
go

IF OBJECT_ID('[engine].shipTranscensionUsersMerge', 'P') IS NOT NULL  DROP procedure [engine].shipTranscensionUsersMerge;
IF type_id('[engine].shipTranscensionUsersType') IS NOT NULL  DROP TYPE [engine].shipTranscensionUsersType; 

go 
CREATE TYPE [engine].shipTranscensionUsersType AS TABLE
    ( shipId Int ,
	userid Int ,
	helpCount SMALLINT)
go
create procedure [engine].shipTranscensionUsersMerge
	(@TranscensionUsers [engine].shipTranscensionUsersType READONLY,
	@shipId int,
	@shipModulesVersionId bigint)
as
begin	
	/*
		declare @shipModules [engine].shipModulesMergeType;
		insert into @shipModules(shipId,posX,posY, moduleId ) select 1699,2,2,5
		begin tran
		select * from [dbo].[shipModules] where shipId = 1699
		exec [engine].shipModulesMerge @shipModules, 1699
		select * from [dbo].[shipModules] where shipId = 1699
		rollback tran
	*/
	begin tran;

	if NOT (SELECT COUNT(Ships.[id]) from dbo.Ships where dbo.Ships.id = @shipId and dbo.Ships.shipModulesVersionId < @shipModulesVersionId) = 1
	begin
		commit tran;
		return;
	end
	
	update dbo.Ships 
	set dbo.Ships.shipModulesVersionId = @shipModulesVersionId
	where  dbo.Ships.id = @shipId;

	
	with currentUsers as (select * from dbo.ShipTranscensionUsers where shipId = @shipId)
	MERGE  currentUsers AS users
	USING @TranscensionUsers AS newUsers
	ON (users.userId = newUsers.userId)
	WHEN MATCHED 
		THEN UPDATE SET users.helpCount = newUsers.helpCount
	WHEN NOT MATCHED THEN
		INSERT (shipId,userId,helpCount)
			VALUES (newUsers.shipId,newUsers.userId,newUsers.helpCount)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

	commit tran;
end
go

IF OBJECT_ID('[engine].shipTemplateMerge', 'P') IS NOT NULL  DROP procedure [engine].shipTemplateMerge;
IF type_id('[engine].shipTemplateMergeType') IS NOT NULL  DROP TYPE [engine].shipTemplateMergeType; 
IF type_id('[engine].shipTemplateModulesMergeType') IS NOT NULL  DROP TYPE [engine].shipTemplateModulesMergeType; 

go 
CREATE TYPE [engine].shipTemplateMergeType AS TABLE
    (id int ,
	userId int ,
	shipHullId tinyInt ,
	name varchar(63) ,  --default will be set by hull, name should be changeable by player
	gif varchar(63) ,  -- should be set by hull, a list of interchangeable grphics shoul be given...
	
	--statistics
	energy int  , -- will change dynamically during template-design
	crew int ,	
	scanRange TINYINT,	    
    attack  SMALLINT ,
    defense  SMALLINT ,    
    hitpoints  SMALLINT,
    damagereduction tinyInt ,    
    cargoroom SMALLINT  ,
	fuelroom SMALLINT ,	
    systemMovesPerTurn Decimal(8,5),
    galaxyMovesPerTurn Decimal(8,5),
    systemMovesMax Decimal(8,5),
    galaxyMovesMax Decimal(8,5),
    isColonizer int,
    [population] bigint ,    
    constructionDuration int, 
    constructable bit ,
    amountBuilt int ,
    obsolete bit ,
    shipHullsImage int ,
	versionId bigint)


go
CREATE TYPE [engine].shipTemplateModulesMergeType AS TABLE
    ( templateId Int ,
	moduleId SMALLINT ,
	posX TINYINT ,
	posY TINYINT)


go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].shipTemplateMerge
	(@template [engine].shipTemplateMergeType READONLY,
	@modules [engine].shipTemplateModulesMergeType READONLY,
	@templateId int,
	@newVersionId bigint)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	
	
	
	*/
	

	MERGE  [dbo].[ShipTemplate]
	USING @template as template
	ON ( [dbo].[ShipTemplate].id = template.id )
	WHEN MATCHED AND [dbo].[ShipTemplate].versionId < template.versionId 
		THEN UPDATE SET 			 			
		  [shipHullId] = template.shipHullId,
		  [name] = template.name,
		  [gif] = template.gif,
		  [energy] = template.[energy] ,
		  [crew] = template.[crew] ,
		  [scanRange] = template.[scanRange] ,
		  [attack] = template.[attack] ,
		  [defense] = template.[defense] ,
		  [hitpoints] = template.[hitpoints] ,
		  [damagereduction] = template.[damagereduction] ,
		  [cargoroom] = template.[cargoroom] ,
		  [fuelroom] = template.[fuelroom] ,
		  [systemMovesPerTurn] = template.[systemMovesPerTurn] ,
		  [galaxyMovesPerTurn] = template.[galaxyMovesPerTurn] ,
		  [systemMovesMax] = template.[systemMovesMax] ,
		  [galaxyMovesMax] = template.[galaxyMovesMax] ,
		  [isColonizer] = template.[isColonizer] ,
		  [population] = template.[population] ,
		  [constructionDuration] = template.[constructionDuration] ,
		  [constructable] = template.[constructable] ,
		  [amountBuilt] = template.[amountBuilt] ,
		  [obsolete] = template.[obsolete] ,
		  [shipHullsImage] = template.[shipHullsImage] ,
		  [versionId] = template.[versionId]
		WHEN NOT MATCHED  
			THEN INSERT  (id, [userId] ,[shipHullId] ,[name] ,[gif] ,
			   [energy] ,[crew] ,[scanRange] ,[attack] ,[defense] ,[hitpoints] ,[damagereduction] ,
			   [cargoroom] ,[fuelroom] ,[systemMovesPerTurn] ,[galaxyMovesPerTurn] ,[systemMovesMax] ,[galaxyMovesMax] ,
			   [isColonizer] ,[population] ,
			   [constructionDuration] ,[constructable] ,[amountBuilt] ,[obsolete] ,[shipHullsImage] ,[versionId])
			 VALUES ( template.id , template.UserId, template.shipHullId, template.name, template.gif,
					 template.[energy] , template.[crew] , template.[scanRange] , template.[attack] , template.[defense] , template.[hitpoints] , template.[damagereduction] ,
					 template.[cargoroom] , template.[fuelroom] , template.[systemMovesPerTurn] , template.[galaxyMovesPerTurn] , template.[systemMovesMax] , template.[galaxyMovesMax] , 
					 template.[isColonizer] , template.[population] ,
					 template.[constructionDuration] , template.[constructable] , template.[amountBuilt] , template.[obsolete] , template.[shipHullsImage] , template.[versionId]);


	--versionId might have been increased by a concurrent call, so we have to check it...#
	--only update if the versionId was increased by the previous update/insert of [ShipTemplate]
	with newModules as (
		select module.*
		from @modules as module
		inner join dbo.[ShipTemplate]
			on [ShipTemplate].id = module.templateId
			and [ShipTemplate].[versionId] = @newVersionId

	),
	targetTable as (select  ShipTemplateModulePositions.* from dbo.ShipTemplateModulePositions 
	inner join dbo.[ShipTemplate]
			on [ShipTemplate].id = ShipTemplateModulePositions.shipTemplateId
			and [ShipTemplate].[versionId] = @newVersionId
	where ShipTemplateModulePositions.[shipTemplateId] = @templateId)
	MERGE targetTable as modules
	USING newModules
		ON	modules.[shipTemplateId] = newModules.templateId
		and modules.[posX] = newModules.[posX]
		and modules.[posY] = newModules.[posY]
	WHEN MATCHED 
		THEN UPDATE SET 							
			[moduleId] = newModules.[moduleId]
	WHEN NOT MATCHED THEN
		INSERT ([shipTemplateId], [posX], [posY], [moduleId])
			VALUES (newModules.templateId, newModules.[posX], newModules.[posY], newModules.[moduleId])
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

end
go


IF OBJECT_ID('[engine].userMerge', 'P') IS NOT NULL  DROP procedure [engine].userMerge;
IF OBJECT_ID('[engine].UserResearchDoneMerge', 'P') IS NOT NULL  DROP procedure [engine].UserResearchDoneMerge;
IF type_id('[engine].userMergeType') IS NOT NULL  DROP TYPE [engine].userMergeType; 

go 
CREATE TYPE [engine].userMergeType AS TABLE
    ([id] int ,		
	username nvarchar(1000) ,	
--	player_ip nvarchar(55),		-- last used ip
--	user_ip nvarchar(55),		-- creation IP
	activity bit ,
	locked bit ,		-- deleted?		
	user_session nvarchar(32),
	showRaster bit ,
	moveShipsAsync bit ,
	homeCoordX int ,
	homeCoordY int ,
	[language] int ,
	[loginDT] [datetime] ,
	lastSelectedObjectType int ,	--0 colony, 1 ship
	lastSelectedObjectId int ,
	showSystemNames bit ,
	showColonyNames bit ,
	showCoordinates bit ,
	showcolonyowner bit ,
	[showColonyOwners] bit ,
	[showShipNames] bit ,
	[showShipOwners] bit ,
	researchPoints int  ,
	scanRangeBrightness tinyint ,
	constructionRatio decimal(3,2) ,
	industrieRatio decimal(3,2) ,
	foodRatio decimal(3,2) ,
	versionId bigint , 
	popVicPoints  int ,
	researchVicPoints  int ,
	goodsVicPoints  int ,
	shipVicPoints  int ,
	overallVicPoints  int ,
	overallRank	int,
	player_ip nvarchar(55),
	[description] nvarchar(4000),
	lastReadGalactivEvent int ,
	ProfileUrl nvarchar(300),
	showCombatPopup int,
	showCombatFast int
	)

go
-- is always called only for one user. TABLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].userMerge
	(@users [engine].userMergeType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].Users
	USING @users as sourceUsers
	ON ( [dbo].Users.id = sourceUsers.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 			
		  [username]				= sourceUsers.[username]		 
		  ,[activity]				= sourceUsers.[activity]
		  ,[locked]					= sourceUsers.[locked]
		  ,[user_session]			= sourceUsers.[user_session]
		  ,[showRaster]				= sourceUsers.[showRaster]
		  ,[moveShipsAsync]			= sourceUsers.[moveShipsAsync]
		  ,[homeCoordX]				= sourceUsers.[homeCoordX]
		  ,[homeCoordY]				= sourceUsers.[homeCoordY]
		  ,[language]				= sourceUsers.[language]
		  ,[loginDT]				= sourceUsers.[loginDT]
		  ,[lastSelectedObjectType] = sourceUsers.[lastSelectedObjectType]
		  ,[lastSelectedObjectId]	= sourceUsers.[lastSelectedObjectId]
		  ,[showSystemNames]		= sourceUsers.[showSystemNames]
		  ,[showColonyNames]		= sourceUsers.[showColonyNames]
		  ,[showCoordinates]		= sourceUsers.[showCoordinates]
		  ,[showColonyOwners]		= sourceUsers.[showColonyOwners]
		  ,[showShipNames]			= sourceUsers.[showShipNames]
		  ,[showShipOwners]			= sourceUsers.[showShipOwners]
		  ,[researchPoints]			= sourceUsers.[researchPoints]
		  ,[scanRangeBrightness]	= sourceUsers.[scanRangeBrightness]
		  ,[constructionRatio]		= sourceUsers.[constructionRatio]
		  ,[industrieRatio]			= sourceUsers.[industrieRatio]
		  ,[foodRatio]				= sourceUsers.[foodRatio]
		  ,[versionId]				= sourceUsers.[versionId]
		  ,[popVicPoints]			= sourceUsers.[popVicPoints]
		  ,[researchVicPoints]		= sourceUsers.[researchVicPoints]
		  ,[goodsVicPoints]			= sourceUsers.[goodsVicPoints]
		  ,[shipVicPoints]			= sourceUsers.[shipVicPoints]
		  ,[overallVicPoints]		= sourceUsers.[overallVicPoints]
		  ,[overallRank]			= sourceUsers.[overallRank]
		  ,player_ip				= sourceUsers.player_ip
		  ,[description]			= sourceUsers.[description]
		  ,lastReadGalactivEvent	= sourceUsers.lastReadGalactivEvent
		  ,ProfileUrl				= sourceUsers.ProfileUrl
		  ,showCombatPopup			= sourceUsers.showCombatPopup
		  ,showCombatFast			= sourceUsers.showCombatFast
		WHEN NOT MATCHED  
			THEN INSERT  (
			id, [username]		,[activity]			,[locked]		,[user_session]		
			,[showRaster]			,[moveShipsAsync]			
			,[homeCoordX] , [homeCoordY]				
			,[language]	,[loginDT]				
			,[lastSelectedObjectType], [lastSelectedObjectId]	
			,[showSystemNames]	,[showColonyNames],[showCoordinates]	,[showColonyOwners]		,[showShipNames]	,[showShipOwners]			
			,[researchPoints]			
			,[scanRangeBrightness]	
			,[constructionRatio]		,[industrieRatio]		,[foodRatio]				
			,[versionId]				
			,[popVicPoints]		,[researchVicPoints]		,[goodsVicPoints]		,[shipVicPoints]		,[overallVicPoints]		
			,[overallRank] ,player_ip,[description], lastReadGalactivEvent, ProfileUrl)

			 VALUES ( 
			 sourceUsers.id ,sourceUsers.[username]	 ,sourceUsers.[activity] ,sourceUsers.[locked] ,sourceUsers.[user_session]
			 ,sourceUsers.[showRaster]	 ,sourceUsers.[moveShipsAsync]
			 ,sourceUsers.[homeCoordX]	 ,sourceUsers.[homeCoordY]
			 ,sourceUsers.[language] ,sourceUsers.[loginDT]
			 ,sourceUsers.[lastSelectedObjectType] ,sourceUsers.[lastSelectedObjectId]
			 ,sourceUsers.[showSystemNames] ,sourceUsers.[showColonyNames] ,sourceUsers.[showCoordinates]	 ,sourceUsers.[showColonyOwners]	 ,sourceUsers.[showShipNames]	 ,sourceUsers.[showShipOwners]
			 ,sourceUsers.[researchPoints]
			 ,sourceUsers.[scanRangeBrightness]
			 ,sourceUsers.[constructionRatio] ,sourceUsers.[industrieRatio] ,sourceUsers.[foodRatio]
			 ,sourceUsers.[versionId]
			 ,sourceUsers.[popVicPoints] ,sourceUsers.[researchVicPoints] ,sourceUsers.[goodsVicPoints] ,sourceUsers.[shipVicPoints]	 ,sourceUsers.[overallVicPoints]
			 ,sourceUsers.[overallRank]
			 ,sourceUsers.player_ip
			 ,sourceUsers.[description]
			 ,sourceUsers.lastReadGalactivEvent
			 ,sourceUsers.ProfileUrl);

	/*
	MERGE  [dbo].Users
	USING @users as users
	ON ( [dbo].Users.id = users.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 			
		  [username]				= users.[username]		 
		  ,[activity]				= users.[activity]
		  ,[locked]					= users.[locked]
		  ,[user_session]			= users.[user_session]
		  ,[showRaster]				= users.[showRaster]
		  ,[moveShipsAsync]			= users.[moveShipsAsync]
		  ,[homeCoordX]				= users.[homeCoordX]
		  ,[homeCoordY]				= users.[homeCoordY]
		  ,[language]				= users.[language]
		  ,[loginDT]				= users.[loginDT]
		  ,[lastSelectedObjectType] = users.[lastSelectedObjectType]
		  ,[lastSelectedObjectId]	= users.[lastSelectedObjectId]
		  ,[showSystemNames]		= users.[showSystemNames]
		  ,[showColonyNames]		= users.[showColonyNames]
		  ,[showCoordinates]		= users.[showCoordinates]
		  ,[showcolonyowner]		= users.[showcolonyowner]
		  ,[showColonyOwners]		= users.[showColonyOwners]
		  ,[showShipNames]			= users.[showShipNames]
		  ,[showShipOwners]			= users.[showShipOwners]
		  ,[researchPoints]			= users.[researchPoints]
		  ,[scanRangeBrightness]	= users.[scanRangeBrightness]
		  ,[constructionRatio]		= users.[constructionRatio]
		  ,[industrieRatio]			= users.[industrieRatio]
		  ,[foodRatio]				= users.[foodRatio]
		  ,[versionId]				= users.[versionId]
		  ,[popVicPoints]			= users.[popVicPoints]
		  ,[researchVicPoints]		= users.[researchVicPoints]
		  ,[goodsVicPoints]			= users.[goodsVicPoints]
		  ,[shipVicPoints]			= users.[shipVicPoints]
		  ,[overallVicPoints]		= users.[overallVicPoints]
		  ,[overallRank]			= users.[overallRank]
		WHEN NOT MATCHED  
			THEN INSERT  (
			id, [username]		,[activity]			,[locked]		,[user_session]		
			,[showRaster]			,[moveShipsAsync]			
			,[homeCoordX] , [homeCoordY]				
			,[language]	,[loginDT]				
			,[lastSelectedObjectType], [lastSelectedObjectId]	
			,[showSystemNames]	,[showColonyNames],[showCoordinates]	,[showcolonyowner]			,[showColonyOwners]		,[showShipNames]	,[showShipOwners]			
			,[researchPoints]			
			,[scanRangeBrightness]	
			,[constructionRatio]		,[industrieRatio]		,[foodRatio]				
			,[versionId]				
			,[popVicPoints]		,[researchVicPoints]		,[goodsVicPoints]		,[shipVicPoints]		,[overallVicPoints]		
			,[overallRank] )

			 VALUES ( 
			 users.id ,users.[username]	 ,users.[activity] ,users.[locked] ,users.[user_session]
			 ,users.[showRaster]	 ,users.[moveShipsAsync]
			 ,users.[homeCoordX]	 ,users.[homeCoordY]
			 ,users.[language] ,users.[loginDT]
			 ,users.[lastSelectedObjectType] ,users.[lastSelectedObjectId]
			 ,users.[showSystemNames] ,users.[showColonyNames] ,users.[showCoordinates]	 ,users.[showcolonyowner]	 ,users.[showColonyOwners]	 ,users.[showShipNames]	 ,users.[showShipOwners]
			 ,users.[researchPoints]
			 ,users.[scanRangeBrightness]
			 ,users.[constructionRatio] ,users.[industrieRatio] ,users.[foodRatio]
			 ,users.[versionId]
			 ,users.[popVicPoints] ,users.[researchVicPoints] ,users.[goodsVicPoints] ,users.[shipVicPoints]	 ,users.[overallVicPoints]
			 ,users.[overallRank]);
			 */	
end


go

IF OBJECT_ID('[engine].UserQuestsMerge', 'P') IS NOT NULL  DROP procedure [engine].UserQuestsMerge;
IF type_id('[engine].UserQuestsType') IS NOT NULL  DROP TYPE [engine].UserQuestsType; 
go

go 
CREATE TYPE [engine].UserQuestsType AS TABLE
    (	userId int,	
		questId int,
		isRead  bit ,	
		isCompleted  bit 
		 )
go


-- is always called only for one user. TABLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].UserQuestsMerge
	(@UserQuests [engine].UserQuestsType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].UserQuests
	USING @UserQuests as sourceUserQuests
	ON ( [dbo].UserQuests.userId = sourceUserQuests.userId and [dbo].UserQuests.questId = sourceUserQuests.questId )
	WHEN MATCHED 
		THEN UPDATE SET 
			isRead			 		= sourceUserQuests.isRead,	 
			isCompleted				= sourceUserQuests.isCompleted		 		  
		WHEN NOT MATCHED  
			THEN INSERT  (
			userId, 
			questId,
			isRead, 
			isCompleted)
		VALUES ( 
			 sourceUserQuests.userId,
			 sourceUserQuests.questId,
			 sourceUserQuests.isRead, 
			 sourceUserQuests.isCompleted);
end
go


IF OBJECT_ID('[engine].UserResearchMerge', 'P') IS NOT NULL  DROP procedure [engine].UserResearchMerge;
IF type_id('[engine].UserResearchType') IS NOT NULL  DROP TYPE [engine].UserResearchType; 

go

CREATE TYPE [engine].UserResearchType AS TABLE
    (	userId int,	
		researchId smallint,
		isCompleted  tinyint ,	
		investedResearchpoints int , 
		researchPriority smallInt
		 )

go
 

-- is always called only for one user. TABLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].UserResearchMerge
	(@UserResearchs [engine].UserResearchType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].UserResearch
	USING @UserResearchs as sourceUserResearchs
	ON ( [dbo].UserResearch.userId = sourceUserResearchs.userId and [dbo].UserResearch.researchId = sourceUserResearchs.researchId )
	WHEN MATCHED 
		THEN UPDATE SET 			 			
		  isCompleted				= sourceUserResearchs.isCompleted		 
		  ,investedResearchpoints	= sourceUserResearchs.investedResearchpoints
		  ,researchPriority			= sourceUserResearchs.researchPriority		 
		WHEN NOT MATCHED  
			THEN INSERT  (
			userId, researchId, 
			isCompleted, 
			investedResearchpoints,
			researchPriority)
		VALUES ( 
			 sourceUserResearchs.userId,
			 sourceUserResearchs.researchId,
			 sourceUserResearchs.isCompleted, 
			 sourceUserResearchs.investedResearchpoints, 
			 sourceUserResearchs.researchPriority);
end
go


create procedure [engine].UserResearchDoneMerge
	(
	@UserResearches [engine].UserResearchType READONLY,
	@User [engine].userMergeType READONLY,
	@UserQuests [engine].UserQuestsType READONLY)
as
begin	
    exec  [engine].UserResearchMerge @UserResearches
	
	update dbUsers set 
		dbUsers.researchPoints = updatedUser.researchPoints, 
		dbUsers.versionId = updatedUser.versionId 
	from [dbo].Users as dbUsers
	inner join @User as updatedUser
		on	dbUsers.id = updatedUser.id
		and dbUsers.versionId < updatedUser.versionId
	
	exec  [engine].UserQuestsMerge @UserQuests 	
end
go





go




IF OBJECT_ID('[engine].allianceMerge', 'P') IS NOT NULL  DROP procedure [engine].allianceMerge;
IF type_id('[engine].allianceMergeType') IS NOT NULL  DROP TYPE [engine].allianceMergeType; 

go 
CREATE TYPE [engine].allianceMergeType AS TABLE
    ([id] int,		
	name nvarchar(1000),
	[description] nvarchar(4000),
	passwrd	nvarchar(63) ,		
	allianceOwner int,		
	overallVicPoints  int ,
	overallRank	int)

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].allianceMerge
	(@alliances [engine].allianceMergeType READONLY)
as
begin	
	--SET IDENTITY_INSERT [dbo].Alliances ON
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].Alliances
	USING @alliances as sourceAlliances
	ON ( [dbo].Alliances.id = sourceAlliances.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 			
		  name					= sourceAlliances.name		 
		  ,[description]		= sourceAlliances.[description]
		  ,passwrd				= sourceAlliances.passwrd
		  ,allianceOwner		= sourceAlliances.allianceOwner		
		  ,[overallVicPoints]		= sourceAlliances.[overallVicPoints]
		  ,[overallRank]			= sourceAlliances.[overallRank]
		WHEN NOT MATCHED  
			THEN INSERT  (
				[id] ,		
				name ,
				[description] ,
				passwrd	 ,		
				allianceOwner ,		
				[overallVicPoints]	,	
				[overallRank] )
			 VALUES ( 
				sourceAlliances.id ,
				sourceAlliances.name	 ,
				sourceAlliances.[description] ,
				sourceAlliances.passwrd ,
				sourceAlliances.allianceOwner		
				,sourceAlliances.[overallVicPoints]
				,sourceAlliances.[overallRank]);
				
	--SET IDENTITY_INSERT [dbo].Alliances off
end
go


IF OBJECT_ID('[engine].colonyMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyMerge;
IF OBJECT_ID('[engine].colonyUpdate', 'P') IS NOT NULL  DROP procedure [engine].colonyUpdate;
IF type_id('[engine].colonyMergeType') IS NOT NULL  DROP TYPE [engine].colonyMergeType; 

go 
CREATE TYPE [engine].colonyMergeType AS TABLE
    (
		id INT,		
		userId int ,	
		[name] character varying(63) ,		
		storage int ,
		scanRange TINYINT ,	
		starId INT ,
		planetId INT  ,
		shipInConstruction int,
		constructionDuration int,	
		[population] bigint ,
		[construction] int 	,
		turnsOfRioting smallInt,
		versionId bigint,
		TurnsOfSiege smallInt,
		BesiegedBy int,
		Influence int
	)

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].colonyMerge
	(@colonies [engine].colonyMergeType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].Colonies
	USING @colonies as sourceColonies
	ON ( [dbo].Colonies.id = sourceColonies.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 						
			userId				= sourceColonies.userId  ,	
			[name]				= sourceColonies.[name]  ,		
			storage				= sourceColonies.storage  ,
			scanRange			= sourceColonies.scanRange  ,	
			starId				= sourceColonies.starId  ,
			planetId			= sourceColonies.planetId  ,
			shipInConstruction	= sourceColonies.shipInConstruction  ,
			constructionDuration = sourceColonies.constructionDuration  ,	
			[population]		= sourceColonies.[population]  ,
			[construction]  	= sourceColonies.[construction]  ,
			turnsOfRioting		= sourceColonies.turnsOfRioting ,
			versionId			=  sourceColonies.versionId,
			TurnsOfSiege		= sourceColonies.TurnsOfSiege,
			besiegedBy			= sourceColonies.BesiegedBy,
			Influence			= sourceColonies.Influence
		WHEN NOT MATCHED  
			THEN INSERT  (
				id ,		
				userId  ,	
				[name]  ,		
				storage  ,
				scanRange  ,	
				starId  ,
				planetId   ,
				shipInConstruction ,
				constructionDuration ,	
				[population]  ,
				[construction]  	,
				turnsOfRioting,
				TurnsOfSiege ,
				besiegedBy,
				Influence )
			 VALUES ( 
				sourceColonies.id ,
				sourceColonies.userId	 ,
				sourceColonies.[name] ,
				sourceColonies.storage ,
				sourceColonies.scanRange		
				,sourceColonies.starId
				,sourceColonies.planetId
				,sourceColonies.shipInConstruction
				,sourceColonies.constructionDuration
				,sourceColonies.[population]
				,sourceColonies.[construction]
				,sourceColonies.turnsOfRioting	
				,sourceColonies.TurnsOfSiege
				,sourceColonies.besiegedBy
				,sourceColonies.Influence
				);
end

go
create procedure [engine].colonyUpdate
	(	
	@colonies [engine].colonyMergeType READONLY
	)
as
begin	
	MERGE  [dbo].Colonies
	USING @colonies as sourceColonies
	ON ( [dbo].Colonies.id = sourceColonies.id AND [dbo].Colonies.versionId < sourceColonies.versionId)
	WHEN MATCHED 
		THEN UPDATE SET 			 						
			userId				= sourceColonies.userId  ,	
			[name]				= sourceColonies.[name]  ,		
			storage				= sourceColonies.storage  ,
			scanRange			= sourceColonies.scanRange  ,	
			starId				= sourceColonies.starId  ,
			planetId			= sourceColonies.planetId  ,
			shipInConstruction	= sourceColonies.shipInConstruction  ,
			constructionDuration = sourceColonies.constructionDuration  ,	
			[population]		= sourceColonies.[population]  ,
			[construction]  	= sourceColonies.[construction]  ,
			turnsOfRioting		= sourceColonies.turnsOfRioting ,
			versionId			=  sourceColonies.versionId,
			TurnsOfSiege		= sourceColonies.TurnsOfSiege,
			besiegedBy			= sourceColonies.BesiegedBy,
			Influence			= sourceColonies.Influence;
end

go

IF OBJECT_ID('[engine].colonyBuildingMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyBuildingMerge;
IF type_id('[engine].colonyBuildingMergeType') IS NOT NULL  DROP TYPE [engine].colonyBuildingMergeType; 

go 
CREATE TYPE [engine].colonyBuildingMergeType AS TABLE
    (id INT ,		
	colonyId Int ,
	planetSurfaceId bigint ,
	userId int ,	
	buildingId smallint ,
	isActive	bit ,
	underConstruction 	bit ,
	remainingHitpoint int )

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].colonyBuildingMerge
	(@colonyBuildings [engine].colonyBuildingMergeType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].ColonyBuildings
	USING @colonyBuildings as sourceColonyBuilding
	ON ( [dbo].ColonyBuildings.id = sourceColonyBuilding.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 						
			colonyId  = sourceColonyBuilding.colonyId  ,
			planetSurfaceId  = sourceColonyBuilding.planetSurfaceId  ,
			userId  = sourceColonyBuilding.userId  ,	
			buildingId  = sourceColonyBuilding.buildingId  ,
			isActive	 = sourceColonyBuilding.isActive  ,
			underConstruction 	 = sourceColonyBuilding.underConstruction  ,
			remainingHitpoint = sourceColonyBuilding.remainingHitpoint  
		WHEN NOT MATCHED  
			THEN INSERT  (
				id  ,		
				colonyId  ,
				planetSurfaceId  ,
				userId  ,	
				buildingId  ,
				isActive	 ,
				underConstruction 	 ,
				remainingHitpoint   )
			 VALUES ( 
				sourceColonyBuilding.id ,
				sourceColonyBuilding.colonyId	 ,
				sourceColonyBuilding.planetSurfaceId ,
				sourceColonyBuilding.userId ,
				sourceColonyBuilding.buildingId		
				,sourceColonyBuilding.isActive
				,sourceColonyBuilding.underConstruction
				,sourceColonyBuilding.remainingHitpoint);
end
go

IF OBJECT_ID('[engine].planetSurfaceMerge', 'P') IS NOT NULL  DROP procedure [engine].planetSurfaceMerge;
IF OBJECT_ID('[engine].colonyMinorMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyMinorMerge;
IF type_id('[engine].planetSurfaceMergeType') IS NOT NULL  DROP TYPE [engine].planetSurfaceMergeType; 

go 
CREATE TYPE [engine].planetSurfaceMergeType AS TABLE
    (id bigint   ,	
	planetId INT ,		
	X TINYINT  ,
	Y TINYINT  ,	
	surfaceObjectId SMALLINT, 
	surfaceBuildingId SMALLINT )

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].planetSurfaceMerge
	(@planetSurfaces [engine].planetSurfaceMergeType READONLY)
as
begin	
	insert into [dbo].PlanetSurface (id, planetId, X, Y, surfaceObjectId, surfaceBuildingId)
	select 
		id    ,	
		planetId  ,		
		X   ,
		Y   ,	
		surfaceObjectId , 
		surfaceBuildingId 
	from @planetSurfaces

	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	
	MERGE  [dbo].PlanetSurface
	USING @planetSurfaces as sourcePlanetSurface
	ON ( [dbo].PlanetSurface.id = sourceColonyBuilding.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 						
			colonyId  = sourceColonyBuilding.colonyId  ,
			planetSurfaceId  = sourceColonyBuilding.planetSurfaceId  ,
			userId  = sourceColonyBuilding.userId  ,	
			buildingId  = sourceColonyBuilding.buildingId  ,
			isActive	 = sourceColonyBuilding.isActive  ,
			underConstruction 	 = sourceColonyBuilding.underConstruction  ,
			remainingHitpoint = sourceColonyBuilding.remainingHitpoint  
		WHEN NOT MATCHED  
			THEN INSERT  (
				id  ,		
				colonyId  ,
				planetSurfaceId  ,
				userId  ,	
				buildingId  ,
				isActive	 ,
				underConstruction 	 ,
				remainingHitpoint   )
			 VALUES ( 
				sourceColonyBuilding.id ,
				sourceColonyBuilding.colonyId	 ,
				sourceColonyBuilding.planetSurfaceId ,
				sourceColonyBuilding.userId ,
				sourceColonyBuilding.buildingId		
				,sourceColonyBuilding.isActive
				,sourceColonyBuilding.underConstruction
				,sourceColonyBuilding.remainingHitpoint);

				*/

end

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].colonyMinorMerge
	(
	@planetSurfaces [engine].planetSurfaceMergeType READONLY,	
	@colonyId int,
	@planetId int)
as
begin	
    exec  [engine].planetSurfaceMerge @planetSurfaces	
	update dbo.SolarSystemInstances set colonyId = @colonyId where dbo.SolarSystemInstances.id = @planetId
end
go

IF OBJECT_ID('[engine].colonyFullMerge', 'P') IS NOT NULL  DROP procedure [engine].colonyFullMerge;
go

-- is always called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].colonyFullMerge
	(
	@planetSurfaces [engine].planetSurfaceMergeType READONLY,
	@colonies [engine].colonyMergeType READONLY,
	@colonyBuildings [engine].colonyBuildingMergeType READONLY,
	@colonyStocks [engine].colonyStockMergeType READONLY,
	@colonyId int,
	@planetId int)
as
begin	
	
	

    exec  [engine].planetSurfaceMerge @planetSurfaces
	exec  [engine].colonyMerge @colonies
	exec  [engine].colonyStockMerge @colonyStocks ,@colonyId
	exec  [engine].colonyBuildingMerge @colonyBuildings
	update dbo.SolarSystemInstances set colonyId = @colonyId where dbo.SolarSystemInstances.id = @planetId
end
go


IF OBJECT_ID('[engine].DiplomaticEntityStateMerge', 'P') IS NOT NULL  DROP procedure [engine].DiplomaticEntityStateMerge;
IF type_id('[engine].DiplomaticEntityStateType') IS NOT NULL  DROP TYPE [engine].DiplomaticEntityStateType; 

go

CREATE TYPE [engine].DiplomaticEntityStateType AS TABLE
    ( [sender] INT,	
	[target] int  , 	
	[relation] INT )

go
create procedure [engine].DiplomaticEntityStateMerge
	(@entityStates [engine].DiplomaticEntityStateType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	
	MERGE  [dbo].DiplomaticEntityState
	USING @entityStates AS entityRelations
	ON ( [dbo].DiplomaticEntityState.[sender] = entityRelations.[sender] and [dbo].DiplomaticEntityState.[target] = entityRelations.[target] )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].DiplomaticEntityState.relation  = entityRelations.[relation] 
	WHEN NOT MATCHED
		THEN INSERT  (
				[sender]  ,		
				[target]  ,
				[relation] )
			 VALUES ( 
				entityRelations.[sender],
				entityRelations.[target] ,
				entityRelations.[relation] );
end
go

IF OBJECT_ID('[engine].CommNodeUsersMerge', 'P') IS NOT NULL  DROP procedure [engine].CommNodeUsersMerge;
IF type_id('[engine].CommNodeUsersType') IS NOT NULL  DROP TYPE [engine].CommNodeUsersType; 

go 
CREATE TYPE [engine].CommNodeUsersType AS TABLE
    ( 	[userId] int  ,
	[commNodeId] int  ,
	[readAccess] bit   ,
	[writeAccess] bit  ,
	[lastReadMessage] int ,
	[informWhenNew] bit)
go
create procedure [engine].CommNodeUsersMerge
	(@commNodeUsers [engine].CommNodeUsersType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	
	MERGE  [dbo].CommNodeUsers
	USING @commNodeUsers AS newCommNodeUsers
	ON ( [dbo].CommNodeUsers.[userId] = newCommNodeUsers.[userId] and [dbo].CommNodeUsers.[commNodeId] = newCommNodeUsers.[commNodeId] )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].CommNodeUsers.[readAccess]  = newCommNodeUsers.[readAccess] ,
			[dbo].CommNodeUsers.[writeAccess]  = newCommNodeUsers.[writeAccess],
			[dbo].CommNodeUsers.[lastReadMessage]  = newCommNodeUsers.[lastReadMessage],
			[dbo].CommNodeUsers.[informWhenNew]  = newCommNodeUsers.[informWhenNew]
	WHEN NOT MATCHED
		THEN INSERT  (
				[userId]   ,
				[commNodeId]   ,
				[readAccess]    ,
				[writeAccess]   ,
				[lastReadMessage]  ,
				[informWhenNew] )
			 VALUES ( 
				newCommNodeUsers.[userId],
				newCommNodeUsers.[commNodeId] ,
				newCommNodeUsers.[readAccess],
				newCommNodeUsers.[writeAccess],
				newCommNodeUsers.[lastReadMessage] ,
				newCommNodeUsers.[informWhenNew]
				 );
end
go

IF OBJECT_ID('[engine].allianceMembersMerge', 'P') IS NOT NULL  DROP procedure [engine].allianceMembersMerge;
IF type_id('[engine].allianceMembersMergeType') IS NOT NULL  DROP TYPE [engine].allianceMembersMergeType; 

go 
CREATE TYPE [engine].allianceMembersMergeType AS TABLE
    ( allianceId int ,
	userId int ,
	fullAdmin bit ,    --may invite or kick normal members, may make all diplomatic actions
	diplomaticAdmin bit ,  -- may make all diplomatic actions
	mayInvite bit , 
	mayFire bit ,
	mayDeclareWar bit,
	mayMakeDiplomaticProposals	bit)
go
create procedure [engine].allianceMembersMerge
	(@allianceMembers [engine].allianceMembersMergeType READONLY,
	@allianceId int)
as
begin	
	/*
		declare @shipModules [engine].shipModulesMergeType;
		insert into @shipModules(shipId,posX,posY, moduleId ) select 1699,2,2,5
		begin tran
		select * from [dbo].[shipModules] where shipId = 1699
		exec [engine].shipModulesMerge @shipModules, 1699
		select * from [dbo].[shipModules] where shipId = 1699
		rollback tran
	*/
		
	with members as (select * from dbo.AllianceMembers where allianceId = @allianceId)
	MERGE  members AS allianceMembers
	USING @allianceMembers AS newAllianceMembers
	ON (allianceMembers.allianceId = newAllianceMembers.allianceId
		and allianceMembers.userId = newAllianceMembers.userId)
	WHEN MATCHED 
		THEN UPDATE SET 
			allianceMembers.fullAdmin = newAllianceMembers.fullAdmin,    --may invite or kick normal members, may make all diplomatic actions
			diplomaticAdmin = newAllianceMembers.diplomaticAdmin,  -- may make all diplomatic actions
			mayInvite = newAllianceMembers.mayInvite, 
			mayFire = newAllianceMembers.mayFire,
			mayDeclareWar = newAllianceMembers.mayDeclareWar,
			mayMakeDiplomaticProposals = newAllianceMembers.mayMakeDiplomaticProposals
	WHEN NOT MATCHED THEN
		INSERT (allianceId  ,
				userId  ,
				fullAdmin  ,   
				diplomaticAdmin  , 
				mayInvite  , 
				mayFire  ,
				mayDeclareWar ,
				mayMakeDiplomaticProposals)
			VALUES (
				newAllianceMembers.allianceId  ,
				newAllianceMembers.userId  ,
				newAllianceMembers.fullAdmin  ,   
				newAllianceMembers.diplomaticAdmin  , 
				newAllianceMembers.mayInvite  , 
				newAllianceMembers.mayFire  ,
				newAllianceMembers.mayDeclareWar ,
				newAllianceMembers.mayMakeDiplomaticProposals)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE;

end
go



IF OBJECT_ID('[engine].MessagePartMerge', 'P') IS NOT NULL  DROP procedure [engine].MessagePartMerge;
IF OBJECT_ID('[engine].[MessageParticipantMerge]', 'P') IS NOT NULL  DROP procedure [engine].[MessageParticipantMerge];
IF OBJECT_ID('[engine].MessageMerge', 'P') IS NOT NULL  DROP procedure [engine].MessageMerge;
IF type_id('[engine].[MessageBodyType]') IS NOT NULL  DROP TYPE [engine].[MessageBodyType]; 
IF type_id('[engine].[MessageParticipantType]') IS NOT NULL  DROP TYPE [engine].[MessageParticipantType]; 
go

CREATE TYPE [engine].[MessageParticipantType] AS TABLE
     ( headerId int ,
	participant int ,
	[read] bit)
go

CREATE TYPE [engine].[MessageBodyType] AS TABLE
    ( [headerId] int ,
	[message] [nvarchar](4000),
	[messagePart] [int],
	[sender] [int] ,
	[sendingDate] [datetime])
go

create procedure [engine].[MessageMerge]
	(@messageId int,
	@sender int,	
	@header nvarchar(127),
	@dateTime datetime,
	@messageParticipants [engine].[MessageParticipantType] READONLY,
	@messageParts [engine].[MessageBodyType] READONLY)
as
begin	
	/*
		begin tran
		select * from [dbo].[MessageHeads] where id = 1301
		exec [engine].MessageMerge ...
		select * from [dbo].[MessageHeads] where id = 1301
		rollback tran
	*/
	
	with messageHead as ( select @messageId as messageId, @sender as sender, @header as header, @dateTime as messageDT) 
	MERGE  [dbo].[MessageHeads]
	USING messageHead
	ON ( [dbo].[MessageHeads].id = messageHead.messageId )
	WHEN MATCHED
		THEN UPDATE SET 			 				  
		  [headline] = messageHead.header
		WHEN NOT MATCHED  
			THEN INSERT   (id, [sender], [headline], sendingDate, messageType)
			 VALUES ( messageHead.messageId , messageHead.sender, messageHead.header, messageHead.messageDT, 10 );

	MERGE  [dbo].MessageParticipants
	USING @messageParticipants AS messageParticipantsInput
	ON ( [dbo].MessageParticipants.headerId = messageParticipantsInput.headerId and [dbo].MessageParticipants.participant = messageParticipantsInput.participant )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].MessageParticipants.[read]  = messageParticipantsInput.[read] 
	WHEN NOT MATCHED
		THEN INSERT  (
				headerId  ,		
				participant  ,
				[read] )
			 VALUES ( 
				messageParticipantsInput.headerId,
				messageParticipantsInput.participant ,
				messageParticipantsInput.[read] );

	MERGE  [dbo].[MessageBody]
	USING @messageParts as messageParts
	ON ( [dbo].[MessageBody].[headerId] = messageParts.[headerId] AND  [dbo].[MessageBody].[messagePart] =  messageParts.[messagePart] )
	WHEN MATCHED
		THEN UPDATE SET 			 			
		  [message] = messageParts.[message]
		WHEN NOT MATCHED  
			THEN INSERT   ([headerId], [messagePart], [message], [sender], [sendingDate])
			 VALUES ( messageParts.[headerId] , 
				messageParts.[messagePart],
				messageParts.[message],
				messageParts.[sender],
				messageParts.[sendingDate]);

end
go

create procedure [engine].[MessageParticipantMerge]
	(@messageParticipants [engine].[MessageParticipantType] READONLY)
as
begin	

	MERGE  [dbo].MessageParticipants
	USING @messageParticipants AS messageParticipantsInput
	ON ( [dbo].MessageParticipants.headerId = messageParticipantsInput.headerId and [dbo].MessageParticipants.participant = messageParticipantsInput.participant )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].MessageParticipants.[read]  = messageParticipantsInput.[read] 
	WHEN NOT MATCHED
		THEN INSERT  (
				headerId  ,		
				participant  ,
				[read] )
			 VALUES ( 
				messageParticipantsInput.headerId,
				messageParticipantsInput.participant ,
				messageParticipantsInput.[read] );


end
go

create procedure [engine].MessagePartMerge
	(@messageParts [engine].[MessageBodyType] READONLY)
as
begin	
	MERGE  [dbo].[MessageBody]
	USING @messageParts as messageParts
	ON ( [dbo].[MessageBody].[headerId] = messageParts.[headerId] AND  [dbo].[MessageBody].[messagePart] =  messageParts.[messagePart] )
	WHEN MATCHED
		THEN UPDATE SET 			 			
		  [message] = messageParts.[message]
		WHEN NOT MATCHED  
			THEN INSERT   ([headerId], [messagePart], [message], [sender], [sendingDate])
			 VALUES ( messageParts.[headerId] , 
				messageParts.[messagePart],
				messageParts.[message],
				messageParts.[sender],
				messageParts.[sendingDate]);
end
go


IF OBJECT_ID('[engine].CommNodeMessageMerge', 'P') IS NOT NULL  DROP procedure [engine].CommNodeMessageMerge;

go
-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].CommNodeMessageMerge
	(@messageId int,
	@sender int,
	@commNodeId int,
	@header nvarchar(127),
	@body nvarchar(4000))
as
begin	
	/*
		begin tran
		select * from [dbo].[MessageHeads] where id = 1301
		exec [engine].MessageMerge ...
		select * from [dbo].[MessageHeads] where id = 1301
		rollback tran
	*/
	
	with newMessage as ( select @messageId as messageId, @sender as sender, @commNodeId as commNodeId,  @header as header, @body as body) 
	MERGE  [dbo].CommunicationNodeMessages
	USING newMessage
	ON ( [dbo].CommunicationNodeMessages.id = newMessage.messageId )
	WHEN MATCHED
		THEN UPDATE SET 			 			
		  [sender] = newMessage.sender,	
		  [commNodeId] = newMessage.commNodeId,
		  [headline] = newMessage.header,
		  [messageBody] = newMessage.body
		WHEN NOT MATCHED  
			THEN INSERT   (id, [sender], [commNodeId], [headline], [messageBody])
			 VALUES ( newMessage.messageId , newMessage.sender, newMessage.commNodeId, newMessage.header, newMessage.body);

end
go

IF OBJECT_ID('[engine].CommNodeMerge', 'P') IS NOT NULL  DROP procedure [engine].CommNodeMerge;

go
-- is always called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].CommNodeMerge
	(
	@id int,
	@userId int,
	@name nvarchar(63),
	@unformattedName nvarchar(63),
	@positionX int,
	@positionY int,
	@systemX int,
	@systemY int, 
	@connectionType int,          --0ship, 1 building, 2 module
	@connectionId int,    --id of connection
	@activ bit
	)
as
begin	
	/*
		begin tran
		select * from [dbo].[MessageHeads] where id = 1301
		exec [engine].MessageMerge ...
		select * from [dbo].[MessageHeads] where id = 1301
		rollback tran
	*/
	
	with newCommNode as ( SELECT 
			@id as id,
			@userId as userId
			,@name as name
			,@unformattedName as unformattedName
			,@positionX as positionX
			,@positionY as positionY
			,@systemX as sysX
			,@systemY as sysY       					
			,@connectionType as [type]
			,@connectionId as connectionId
			,@activ as activ) 
	MERGE  [dbo].CommunicationNode
	USING newCommNode
	ON ( [dbo].CommunicationNode.id = newCommNode.id )
	WHEN MATCHED
		THEN UPDATE SET 			 			
		  name = newCommNode.name,	
		  unformattedName = newCommNode.unformattedName,
		  activ = newCommNode.activ
		WHEN NOT MATCHED  
			THEN INSERT   (id, userId, name,unformattedName, 
			positionX, positionY, sysX, sysY, 
			connectionType, connectionId ,activ)
			 VALUES ( newCommNode.id, newCommNode.userId, newCommNode.name, newCommNode.unformattedName, 
			 newCommNode.positionX, newCommNode.positionY, newCommNode.sysX, newCommNode.sysY,
			 newCommNode.[type], newCommNode.connectionId, newCommNode.activ
			 );

end
go


IF OBJECT_ID('[engine].combatInsert', 'P') IS NOT NULL  DROP procedure [engine].combatInsert;
IF type_id('[engine].combatInsertType') IS NOT NULL  DROP TYPE [engine].combatInsertType; 
IF type_id('[engine].combatRoundsInsertType') IS NOT NULL  DROP TYPE [engine].combatRoundsInsertType; 

go 
CREATE TYPE [engine].combatInsertType AS TABLE
    ( combatId INT NOT NULL,
	attackerId INT NOT NULL,
	defenderId INT NOT NULL,
	[attackerName] nvarchar(63) not null ,
    [defenderName] nvarchar(63) not null ,
	attackerUserId  INT NOT NULL ,
	defenderUserId  INT NOT NULL,
	starId INT,
	spaceX INT NOT NULL,
	spaceY INT NOT NULL,
	systemX INT,
	systemY INT,

	attackerDamageDealt INT NOT NULL,
	defenderDamageDealt INT NOT NULL,

	attackerHitPointsRemain  INT NOT NULL,
	defenderHitPointsRemain  INT NOT NULL,
	defenderHasRead	bit NOT NULL,
	messageDT	datetime,
	attackerExperience int,
	defenderExperience int,
	attackerShipHullId int,
	defenderShipHullId int,
	attackerShipHullImageId int,
	defenderShipHullImageId int,
	attackerEvasion			int,
	attackerMaxHitPoints	int,
	attackerStartHitpoint	int,
	defenderEvasion			int,
	defenderMaxHitPoints	int,
	defenderStartHitpoint	int,

	attackerShield	int,
	defenderShield  int
	 )
go

CREATE TYPE [engine].combatRoundsInsertType AS TABLE
    ( combatId INT NOT NULL,
	roundNumber INT NOT NULL,
	shotNumber INT NOT NULL,
	side INT NOT NULL,
	moduleId INT NOT NULL,
	damage INT NOT NULL,
	hitPropability real NOT NULL,
	isHit bit NOT NULL)
go

create procedure [engine].combatInsert
	(@combat [engine].combatInsertType READONLY,
	 @combatRounds [engine].combatRoundsInsertType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	
	INSERT INTO [dbo].[Combat]
           ([combatId]
			,[attackerId]
			,[defenderId]
			,[attackerName]
			,[defenderName]
			,attackerUserId 
			,defenderUserId 
			,[starId]
			,[spaceX]
			,[spaceY]
			,[systemX]
			,[systemY]
			,[attackerDamageDealt]
			,[defenderDamageDealt]
			,[attackerHitPointsRemain]
			,[defenderHitPointsRemain]
			,defenderHasRead
			,messageDT
			,attackerExperience
			,defenderExperience
			,attackerShipHullId 
			,defenderShipHullId
			,attackerShipHullImageId
			,defenderShipHullImageId
			,attackerEvasion		,
			attackerMaxHitPoints	,
			attackerStartHitpoint	,
			defenderEvasion			,
			defenderMaxHitPoints	,
			defenderStartHitpoint	,
			attackerShield	,
			defenderShield 
			)
	select [combatId]
           ,[attackerId]
           ,[defenderId]
		   ,[attackerName]
		   ,[defenderName]
		   ,attackerUserId 
		   ,defenderUserId 
           ,[starId]
           ,[spaceX]
           ,[spaceY]
           ,[systemX]
           ,[systemY]
           ,[attackerDamageDealt]
           ,[defenderDamageDealt]
           ,[attackerHitPointsRemain]
           ,[defenderHitPointsRemain] 
		   ,defenderHasRead
		   ,messageDT
		   ,attackerExperience
		   ,defenderExperience
		   ,attackerShipHullId 
		   ,defenderShipHullId
		   ,attackerShipHullImageId
		   ,defenderShipHullImageId
		   ,attackerEvasion			,
			attackerMaxHitPoints	,
			attackerStartHitpoint	,
			defenderEvasion			,
			defenderMaxHitPoints	,
			defenderStartHitpoint	,
			attackerShield	,
			defenderShield 
	from @combat;

	INSERT INTO [dbo].[CombatRounds]
           ([combatId]
           ,[roundNumber]
		   ,shotNumber
           ,[side]
           ,[moduleId]
           ,[damage]
           ,[hitPropability]
           ,[isHit])
	select 
		[combatId]
        ,[roundNumber]
		,shotNumber
        ,[side]
        ,[moduleId]
        ,[damage]
        ,[hitPropability]
        ,[isHit]
	from @combatRounds;
end
go





--Starmap generation:

IF OBJECT_ID('[engine].SolarSystemInstancesInsert', 'P') IS NOT NULL  DROP procedure [engine].SolarSystemInstancesInsert;
IF type_id('[engine].SolarSystemInstancesInsertType') IS NOT NULL  DROP TYPE [engine].SolarSystemInstancesInsertType; 
go 

CREATE TYPE [engine].SolarSystemInstancesInsertType AS TABLE
    (
		X int, 
		Y int, 
		starId int,
		objectId smallint,
		drawSize smallint
	)
go

-- is alwys called only for one template. TYBLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].SolarSystemInstancesInsert
	(@planets [engine].SolarSystemInstancesInsertType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/

	INSERT INTO [dbo].[SolarSystemInstances]
		   ([x]
		   ,[y]
		   ,[systemId]
		   ,[objectId]
		   ,[drawSize])
	 select * from @planets;
end
go

IF OBJECT_ID('[engine].StarMapInsert', 'P') IS NOT NULL  DROP procedure [engine].StarMapInsert;
IF type_id('[engine].StarMapInsertType') IS NOT NULL  DROP TYPE [engine].StarMapInsertType; 
go 

CREATE TYPE [engine].StarMapInsertType AS TABLE
    (
		X int, 
		Y int, 
		objectId smallint,
		size smallint, 
		startSystem smallint, 
		id int
	)
go

create procedure [engine].StarMapInsert
	(@StarOrNebula [engine].StarMapInsertType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/

	insert into [dbo].StarMap 
		(id
		,[positionX]
		,[positionY]
		,[systemname]
		,[objectId]
  
		,[size]
		,[startSystem]
		,[settled])
	select 
		id,
		X,
		Y,
		'',
		objectId,
		size,
		startSystem,
		0 
	from @StarOrNebula;
end
go


IF OBJECT_ID('[engine].ResearchMerge', 'P') IS NOT NULL  DROP procedure [engine].ResearchMerge;
IF type_id('[engine].ResearchType') IS NOT NULL  DROP TYPE [engine].ResearchType; 
go 

CREATE TYPE [engine].ResearchType AS TABLE
    (	id SMALLINT,	
		cost smallint )
go

create procedure [engine].ResearchMerge
	(@researches [engine].ResearchType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran
	*/
	
	MERGE  [dbo].Research
	USING @researches AS researches
	ON ( [dbo].Research.id = researches.id )
	WHEN MATCHED
		THEN UPDATE SET 			 
			[dbo].Research.cost  = researches.cost;
end
go



/*
-- Damn that identity column
alter table TradeOffers add repId int
update TradeOffers set repId = id
alter table TradeOffers drop TradeOffers_primary
ALTER TABLE [dbo].[TradeOfferDetails] DROP CONSTRAINT [FK__TradeOffe__trade__21A1C21B]
ALTER TABLE [dbo].[TradeOffers] DROP CONSTRAINT [UQ__TradeOff__3213E83E81127444]
alter table TradeOffers drop column id
alter table TradeOffers add id int
update TradeOffers set id = repId
alter table TradeOffers drop column repId
*/

IF OBJECT_ID('[engine].[TradeOfferInsert]', 'P') IS NOT NULL  DROP procedure [engine].[TradeOfferInsert];
IF OBJECT_ID('[engine].TradeOfferMerge', 'P') IS NOT NULL  DROP procedure [engine].TradeOfferMerge;
IF type_id('[engine].TradeOfferType') IS NOT NULL  DROP TYPE [engine].TradeOfferType; 
IF type_id('[engine].TradeOfferDetailsType') IS NOT NULL  DROP TYPE [engine].TradeOfferDetailsType; 
go 

CREATE TYPE [engine].TradeOfferType AS TABLE
    (	id int,	
		commNodeId int,
		spaceObjectId  int ,	
		spaceObjectType tinyint
		 )
go

CREATE TYPE [engine].TradeOfferDetailsType AS TABLE
    (	tradeOffersId int,	
		goodsId int,
		amount  int ,	
		offer bit
		 )
go

-- is always called only for one user. TABLE TYPES are just used to encapsulate the fields
-- Merge is used to detect if update or insert is needed.
create procedure [engine].TradeOfferMerge
	(@TradeOffer [engine].TradeOfferType READONLY,
	@TradeOfferDetails [engine].TradeOfferDetailsType READONLY,
	@TradeId int )
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].TradeOffers
	USING @TradeOffer as sourceTradeOffer
	ON ( [dbo].TradeOffers.id = sourceTradeOffer.id )
	WHEN MATCHED 
		THEN UPDATE SET 			 			
		  commNodeId				= sourceTradeOffer.commNodeId		 
		  ,spaceObjectId			= sourceTradeOffer.spaceObjectId
		  ,spaceObjectType			= sourceTradeOffer.spaceObjectType		 
		WHEN NOT MATCHED  
			THEN INSERT  (
			id, commNodeId, 
			spaceObjectId, spaceObjectType)
		VALUES ( 
			 sourceTradeOffer.id,
			 sourceTradeOffer.commNodeId,
			 sourceTradeOffer.spaceObjectId, 
			 sourceTradeOffer.spaceObjectType);

	with tradeLines as (select * from dbo.TradeOfferDetails where tradeOffersId = @TradeId)
		MERGE  tradeLines
		USING @TradeOfferDetails AS sourceLines
		ON (tradeLines.tradeOffersId = sourceLines.tradeOffersId
			and tradeLines.goodsId = sourceLines.goodsId
			and tradeLines.offer = sourceLines.offer)
		WHEN MATCHED AND tradeLines.amount <> sourceLines.amount
			THEN UPDATE SET tradeLines.amount = sourceLines.amount
		WHEN NOT MATCHED THEN
			INSERT (tradeOffersId,goodsId,amount,offer)
				VALUES (sourceLines.tradeOffersId,sourceLines.goodsId,sourceLines.amount,sourceLines.offer)
		WHEN NOT MATCHED BY SOURCE THEN
			DELETE;
	

end
go

create procedure [engine].[TradeOfferInsert]
	(@TradeOffer [engine].TradeOfferType READONLY,
	@TradeOfferDetails [engine].TradeOfferDetailsType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/
	MERGE  [dbo].TradeOffers
	USING @TradeOffer as sourceTradeOffer
	ON ( [dbo].TradeOffers.id = sourceTradeOffer.id ) 
	WHEN NOT MATCHED  
		THEN INSERT  (
		id, commNodeId, 
		spaceObjectId, spaceObjectType)
	VALUES ( 
		sourceTradeOffer.id,
		sourceTradeOffer.commNodeId,
		sourceTradeOffer.spaceObjectId, 
		sourceTradeOffer.spaceObjectType);

	MERGE  dbo.TradeOfferDetails as tradeLines
	USING @TradeOfferDetails AS sourceLines
	ON (tradeLines.tradeOffersId = sourceLines.tradeOffersId
		and tradeLines.goodsId = sourceLines.goodsId
		and tradeLines.offer = sourceLines.offer)	
	WHEN NOT MATCHED THEN
		INSERT (tradeOffersId,goodsId,amount,offer)
			VALUES (sourceLines.tradeOffersId,sourceLines.goodsId,sourceLines.amount,sourceLines.offer);
	

end
go

IF OBJECT_ID('[engine].[TurnEvaluationInsert]', 'P') IS NOT NULL  DROP procedure [engine].TurnEvaluationInsert;
IF type_id('[engine].TurnEvaluationInsertType') IS NOT NULL  DROP TYPE [engine].TurnEvaluationInsertType; 
go 

CREATE TYPE [engine].TurnEvaluationInsertType AS TABLE
    (
		turnNumber int,
		evaluationDuration int ,
		evaluationDate datetime,
		playerCount int,
		shipCount  bigint ,
		colonyCount  bigint ,
		tradesCount  bigint 
	)
go

create procedure [engine].TurnEvaluationInsert
	(@evaluation [engine].TurnEvaluationInsertType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/

	insert into [dbo].[TurnEvaluation] 
		(turnNumber ,
		evaluationDuration  ,
		evaluationDate ,
		playerCount  ,
		shipCount   ,
		colonyCount   ,
		tradesCount   )
	select 
		[turnNumber]
      ,[evaluationDuration]
      ,[evaluationDate]
      ,[playerCount]
      ,[shipCount]
      ,[colonyCount]
      ,[tradesCount]
	from @evaluation;
end
go

IF OBJECT_ID('[engine].[UsersHistoryInsert]', 'P') IS NOT NULL  DROP procedure [engine].UsersHistoryInsert;
IF type_id('[engine].UsersHistoryInsertType') IS NOT NULL  DROP TYPE [engine].UsersHistoryInsertType; 
go 

CREATE TYPE [engine].UsersHistoryInsertType AS TABLE
    (
		[userId] int  ,		
		turnId int,

		researchPoints int ,
	
		popVicPoints  int ,
		researchVicPoints  int,
		goodsVicPoints  int ,
		shipVicPoints  int ,
		overallVicPoints  int ,
		overallRank	int 	
	)
go

create procedure [engine].UsersHistoryInsert
	(@userData [engine].UsersHistoryInsertType READONLY)
as
begin	
	/*
		declare @ships [engine].shipMergeType;
		...insert into @ships(id,name,versionId, impuls,scanRange , max_hyper, userId) select 1301,'blah',2, 10,3, 22, 1... 
		begin tran
		select * from [dbo].[ships] where id = 1301
		exec [engine].shipMerge @ships
		select * from [dbo].[ships] where id = 1301
		rollback tran			
	*/

	insert into [dbo].[UsersHistory] 
		([userId]
		  ,turnId

		  ,[researchPoints]

		  ,[popVicPoints]
		  ,[researchVicPoints]
		  ,[goodsVicPoints]
		  ,[shipVicPoints]
		  ,[overallVicPoints]
		  ,[overallRank]  )
	select 
		[userId]
	  ,turnId

      ,[researchPoints]

      ,[popVicPoints]
      ,[researchVicPoints]
      ,[goodsVicPoints]
      ,[shipVicPoints]
      ,[overallVicPoints]
      ,[overallRank]
	from @userData;
end
go
