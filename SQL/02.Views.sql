IF (NOT EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.SCHEMATA 
                 WHERE SCHEMA_NAME = 'engine' ))
BEGIN   
   EXEC( 'CREATE SCHEMA engine' );
END


go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_game' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW engine.v_game 
  END 

go

CREATE VIEW [engine].v_game 
AS 
  SELECT name, 
         colonyCount         
  FROM   game; 


go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_gameNewTurns' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW engine.[v_gameNewTurns] 
  END 

go 

CREATE VIEW [engine].[v_gameNewTurns] 
AS 
  SELECT id, 
         targettime, 
         turnstatus 
  FROM   [gamenewturns]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipHulls' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipHulls] 
  END 

go 

CREATE VIEW [engine].[v_ShipHulls] 
AS 
  SELECT id, 
         isstarbase, 
         typename, 
         labelname, 
         objectid, 
         modulescount, 
         templateimageurl, 
         label 		
  FROM   [shiphulls]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_SurfaceImages' 
                 AND type = N'V' ) 
  BEGIN 
      DROP VIEW [engine].[v_SurfaceImages] 
  END 

go 

CREATE VIEW [engine].[v_SurfaceImages] 
AS 
  SELECT id, 
         NAME, 
         seed, 
         objectimageurl 
  FROM   [surfaceimages]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_gameNewTurnLog' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_gameNewTurnLog] 
  END 

go 

CREATE VIEW [engine].[v_gameNewTurnLog] 
AS 
  SELECT gamenewturnsid, 
         newturnbegin, 
         newturnend, 
         newturnruntime 
  FROM   [gamenewturnlog]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Languages' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Languages] 
  END 

go 

CREATE VIEW [engine].[v_Languages] 
AS 
  SELECT id, 
         languagefullname, 
         languageshortname 
  FROM   [languages]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_surfaceDefaultMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_surfaceDefaultMap] 
  END 

go 

CREATE VIEW [engine].[v_surfaceDefaultMap] 
AS 
  SELECT id, 
         x, 
         y, 
         surfaceobjectid 
  FROM   [surfacedefaultmap]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ObjectOnMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ObjectOnMap] 
  END 

go 

CREATE VIEW [engine].[v_ObjectOnMap] 
AS 
  SELECT id, 
         movecost, 
         damage, 
         damagetype, 
         damageprobability, 
         damageprobabilityreducablebyship, 
         defensebonus, 
         fieldSize		,
		 label	
  FROM   [objectonmap]; 

go 


IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ObjectImages' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ObjectImages] 
  END 

go 

CREATE VIEW [engine].[v_ObjectImages] 
AS 
  SELECT [objectId]
      ,[imageId]
      ,[drawSize]
      ,[BackgroundObjectId]
      ,[BackgroundDrawSize]
      ,[TilestartingAt]
      ,[surfaceDefaultMapId]
  FROM [dbo].[ObjectImages]
go 





IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipHullsImages' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipHullsImages] 
  END 

go 

CREATE VIEW [engine].[v_ShipHullsImages] 
AS 
  SELECT id, 
         shiphullid, 
         objectid, 
         templateimageid, 
         templatemodulesxoffset, 
         templatemodulesyoffset 
  FROM   [shiphullsimages]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_LabelsBase' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_LabelsBase] 
  END 

go 

CREATE VIEW [engine].[v_LabelsBase] 
AS 
  SELECT id, 
         value, 
         comment, 
         module 
  FROM   [labelsbase]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ColonyBuildings' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ColonyBuildings] 
  END 

go 

CREATE VIEW [engine].[v_ColonyBuildings] 
AS 
  SELECT id, 
         colonyid, 
         planetsurfaceid, 
         userid, 
         buildingid, 
         isactive, 
         underconstruction, 
         remaininghitpoint 
  FROM   [colonybuildings]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Labels' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Labels] 
  END 

go 

CREATE VIEW [engine].[v_Labels] 
AS 
  SELECT id, 
         languageid, 
         label 
  FROM   [labels]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipHullsCosts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipHullsCosts] 
  END 

go 

CREATE VIEW [engine].[v_ShipHullsCosts] 
AS 
  SELECT shiphullid, 
         goodsid, 
         amount 
  FROM   [shiphullscosts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Alliances' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Alliances] 
  END 

go 

CREATE VIEW [engine].[v_Alliances] 
AS 
  SELECT id, 
         NAME, 
         [description], 
         passwrd, 
         allianceowner,
		 overallRank,
		 overallVicPoints
  FROM   [alliances]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipHullsModulePositions' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipHullsModulePositions] 
  END 

go 

CREATE VIEW [engine].[v_ShipHullsModulePositions] 
AS 
  SELECT shiphullid, 
         posx, 
         posy 
  FROM   [shiphullsmodulepositions]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ObjectWeaponModificators' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ObjectWeaponModificators] 
  END 

go 

CREATE VIEW [engine].[v_ObjectWeaponModificators] 
AS 
  SELECT objectid, 
         damagetype, 
         damagemodificator, 
         tohitmodificator, 
         applyto 
  FROM   [objectweaponmodificators]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_colonyStock' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_colonyStock] 
  END 

go 

CREATE VIEW [engine].[v_colonyStock] 
AS 
  SELECT colonyid, 
         goodsid, 
         amount 
  FROM   [colonystock]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Users' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Users] 
  END 

go 

CREATE VIEW [engine].[v_Users] 
AS 
  SELECT 
		[id]
      ,[username]
      ,[activity]
      ,[locked]
      ,[user_session]
      ,[showRaster]
      ,[moveShipsAsync]
      ,[homeCoordX]
      ,[homeCoordY]
      ,[language]
      ,[loginDT]
      ,[lastSelectedObjectType]
      ,[lastSelectedObjectId]
      ,[showSystemNames]
      ,[showColonyNames]
      ,[showCoordinates]

      ,[showColonyOwners]
      ,[showShipNames]
      ,[showShipOwners]
      ,[researchPoints]
      ,[scanRangeBrightness]

      ,[constructionRatio]
      ,[industrieRatio]
      ,[foodRatio]
      ,[versionId]

      ,[popVicPoints]
      ,[researchVicPoints]
      ,[goodsVicPoints]
      ,[shipVicPoints]
      ,[overallVicPoints]
      ,[overallRank]
	  ,player_ip 
	  ,fogVersion
	  ,fogString
	  ,[description]
	  ,aiId
	  ,aiRelation
	  ,lastReadGalactivEvent
	  ,ProfileUrl
  /*id, 
         username,                   
         activity, 
         locked, 
         user_session, 
         showraster, 
         moveshipsasync, 
         homecoordx, 
         homecoordy, 
         [language], 
         logindt, 
         lastselectedobjecttype, 
         lastselectedobjectid, 
         showsystemnames, 
         showcolonynames, 
         showcoordinates, 


         researchpoints, 
         scanrangebrightness, 


         showcolonyowner, 
         showshipnames, 
         showshipowners,         
		 popVicPoints  ,
		 researchVicPoints,
		 goodsVicPoints ,
	     shipVicPoints ,
		 overallVicPoints,
		 overallRank*/
  FROM   [users]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipHullsGain' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipHullsGain] 
  END 

go 

CREATE VIEW [engine].[v_ShipHullsGain] 
AS 
  SELECT shiphullid, 
         crew, 
         energy, 
         hitpoints, 
         damagereduction, 
         damageoutput, 
         cargoroom, 
         fuelroom, 
         inspacespeed, 
         insystemspeed, 
         maxspacemoves, 
         maxsystemmoves, 
         special, 
         scanrange, 
         [population] ,
		 speedFactor
  FROM   [shiphullsgain]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_AllianceContacts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_AllianceContacts] 
  END 

go 

CREATE VIEW [engine].[v_AllianceContacts] 
AS 
  SELECT alliance1, 
         alliance2, 
         currentrelation 
  FROM   [alliancecontacts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ColoniesBuildQueue' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ColoniesBuildQueue] 
  END 

go 

CREATE VIEW [engine].[v_ColoniesBuildQueue] 
AS 
  SELECT id, 
         colonyid, 
         orderno, 
         buildtype, 
         buildid, 
         targetamount, 
         productionneededperunit, 
         productioninvested, 
         multiturn 
  FROM   [coloniesbuildqueue]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Goods' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Goods] 
  END 

go 

CREATE VIEW [engine].[v_Goods] 
AS 
  SELECT id, 
         NAME, 
         objectdescriptionid, 
         goodstype, 
         label ,
		 prodLevel
  FROM   [goods]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_AllianceMembers' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_AllianceMembers] 
  END 

go 

CREATE VIEW [engine].[v_AllianceMembers] 
AS 
  SELECT allianceid, 
         userid, 
         fulladmin, 
         diplomaticadmin, 
         mayinvite, 
         mayfire, 
         maydeclarewar, 
         maymakediplomaticproposals 
  FROM   [alliancemembers]; 

go 
/*
IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserColonyMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserColonyMap] 
  END 

go 

CREATE VIEW [engine].[v_UserColonyMap] 
AS 
  SELECT userid, 
         colonyid 
  FROM   [usercolonymap]; 

go 
*/
IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Buildings' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Buildings] 
  END 

go 

CREATE VIEW [engine].[v_Buildings] 
AS 
  SELECT id, 
         objectid, 
         buildingscript, 
         oncepercolony, 
         isbuildable, 
         visibilityneedsgoods, 
         groupid, 
         prodqueuelevel, 
         label, 
         housing,
		 storage,
		 researchModifier ,
		 assemblyModifier ,
		 energyModifier ,
		 housingModifier ,
		 foodModifier ,
		 productionModifier,
		 growthModifier
  FROM   [buildings]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_AllianceInvites' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_AllianceInvites] 
  END 

go 

CREATE VIEW [engine].[v_AllianceInvites] 
AS 
  SELECT allianceid, 
         userid 
  FROM   [allianceinvites]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTemplateBlueprints' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTemplateBlueprints] 
  END 

go 

CREATE VIEW [engine].[v_ShipTemplateBlueprints] 
AS 
  SELECT id, 
         shiphullid, 
         NAME, 
         gif, 
         energy, 
         crew, 
         scanrange, 
         attack, 
         defense, 
         hitpoints, 
         damagereduction, 
         cargoroom, 
         fuelroom, 
         systemmovesperturn, 
         galaxymovesperturn, 
         systemmovesmax, 
         galaxymovesmax, 
         iscolonizer, 
         constructionduration, 
         constructable, 
         amountbuilt, 
         obsolete 
  FROM   [shiptemplateblueprints]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserRelations' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserRelations] 
  END 

go 

CREATE VIEW [engine].[v_UserRelations] 
AS 
  SELECT relationid, 
         relationname, 
         relationdescription 
  FROM   [userrelations]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_AllianceTargetRelations' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_AllianceTargetRelations] 
  END 

go 

CREATE VIEW [engine].[v_AllianceTargetRelations] 
AS 
  SELECT sender, 
         addressee, 
         targetrelation 
  FROM   [alliancetargetrelations]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserContacts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserContacts] 
  END 

go 

CREATE VIEW [engine].[v_UserContacts] 
AS 
  SELECT sender, 
         addressee, 
         currentrelation 
  FROM   [usercontacts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_DiplomaticEntityState' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_DiplomaticEntityState] 
  END 

go 

CREATE VIEW [engine].[v_DiplomaticEntityState] 
AS 
  SELECT [sender] ,
		[target] ,
		[relation]
  FROM   [DiplomaticEntityState]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Quests' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Quests] 
  END 

go 

CREATE VIEW [engine].[v_Quests] 
AS 
  SELECT id, 
         label, 
         descriptionlabel, 
         isintro, 
         israndom, 
         hasscript, 
         script 
  FROM   [quests]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ResearchGain' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ResearchGain] 
  END 

go 

CREATE VIEW [engine].[v_ResearchGain] 
AS 
  SELECT researchid, 
		[research],	
		[energy]	,
		[housing],
         growth, 
         construction, 
         industrie, 
         food, 
         colonycount, 
		 fleetCount,
         objectid 
  FROM   [researchgain]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_BuildingCosts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_BuildingCosts] 
  END 

go 

CREATE VIEW [engine].[v_BuildingCosts] 
AS 
  SELECT buildingid, 
         goodsid, 
         amount 
  FROM   [buildingcosts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ResearchQuestPrerequisites' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ResearchQuestPrerequisites] 
  END 

go 

CREATE VIEW [engine].[v_ResearchQuestPrerequisites] 
AS 
  SELECT sourcetype, 
         sourceid, 
         targettype, 
         targetid 
  FROM   [researchquestprerequisites]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTemplate' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTemplate] 
  END 

go 

CREATE VIEW [engine].[v_ShipTemplate] 
AS 
  SELECT id, 
         userid, 
         shiphullid, 
         NAME, 
         gif, 
         energy, 
         crew, 
         scanrange, 
         attack, 
         defense, 
         hitpoints, 
         damagereduction, 
         cargoroom, 
         fuelroom, 
         systemmovesperturn, 
         galaxymovesperturn, 
         systemmovesmax, 
         galaxymovesmax, 
         iscolonizer, 
         [population], 
         constructionduration, 
         constructable, 
         amountbuilt, 
         obsolete, 
         shiphullsimage ,
		 versionId
  FROM   [shiptemplate]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserQuests' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserQuests] 
  END 

go 

CREATE VIEW [engine].[v_UserQuests] 
AS 
  SELECT userid, 
         questid, 
         isread, 
         iscompleted 
  FROM   [userquests]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_CommNodeDefaultRights' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_CommNodeDefaultRights] 
  END 

go 

CREATE VIEW [engine].[v_CommNodeDefaultRights] 
AS 
  SELECT commnodeid, 
         targetrelation, 
         readaccess, 
         writeaccess 
  FROM   [commnodedefaultrights]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_BuildingProductions' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_BuildingProductions] 
  END 

go 

CREATE VIEW [engine].[v_BuildingProductions] 
AS 
  SELECT buildingid, 
         goodsid, 
         amount 
  FROM   [buildingproductions]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_CommunicationNode' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_CommunicationNode] 
  END 

go 

CREATE VIEW [engine].[v_CommunicationNode] 
AS 
  SELECT id, 
         userid, 
         positionX AS posX, 
         positionY AS posY, 
         NAME, 
         positionx, 
         positiony, 
         sysx, 
         sysy, 
         connectiontype, 
         connectionid, 
         activ, 
         unformattedname 
  FROM   [communicationnode]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_SurfaceTiles' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_SurfaceTiles] 
  END 

go 

CREATE VIEW [engine].[v_SurfaceTiles] 
AS 
  SELECT id, 
         NAME, 
         objectid,
		 label
  FROM   [surfacetiles]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_MessageHeads' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_MessageHeads] 
  END 

go 

CREATE VIEW [engine].[v_MessageHeads] 
AS 
  SELECT id, 
         sender, 
         addressee, 
         headline, 
         [read], 
         messagetype, 
         sendingdate 
  FROM   [messageheads]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_BuildOptions' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_BuildOptions] 
  END 

go 

CREATE VIEW [engine].[v_BuildOptions] 
AS 
  SELECT objectid, 
         buildingid 
  FROM   [buildoptions]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Modules' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Modules] 
  END 

go 

CREATE VIEW [engine].[v_Modules] 
AS 
  SELECT id, 
         descriptionlabel, 
         goodsid, 
         label, 
         [level]
  FROM   [modules]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTemplateModulePositions' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTemplateModulePositions] 
  END 

go 

CREATE VIEW [engine].[v_ShipTemplateModulePositions] 
AS 
  SELECT shiptemplateid, 
         posx, 
         posy, 
         moduleid 
  FROM   [shiptemplatemodulepositions]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_CommunicationNodeMessages' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_CommunicationNodeMessages] 
  END 

go 

CREATE VIEW [engine].[v_CommunicationNodeMessages] 
AS 
  SELECT id, 
         commnodeid, 
         sender, 
         headline, 
         messagebody, 
         sendingdate 
  FROM   [communicationnodemessages]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_MessageBody' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_MessageBody] 
  END 

go 

CREATE VIEW [engine].[v_MessageBody] 
AS 
  SELECT headerid, 
         message 
  FROM   [messagebody]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTemplateCosts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTemplateCosts] 
  END 

go 

CREATE VIEW [engine].[v_ShipTemplateCosts] 
AS 
  SELECT shiptemplateid, 
         goodsid, 
         amount 
  FROM   [shiptemplatecosts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ModulesCosts' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ModulesCosts] 
  END 

go 

CREATE VIEW [engine].[v_ModulesCosts] 
AS 
  SELECT modulesid, 
         goodsid, 
         amount 
  FROM   [modulescosts]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Ships' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Ships] 
  END 

go 
--select * from [engine].[v_Ships] 
CREATE VIEW [engine].[v_Ships] 
AS 
  SELECT id, 
         userid, 
         NAME, 
         spaceX as posX, 
		 spaceY as posY,
         systemx, 
         systemy, 
         hitpoints, 
         attack, 
         defense, 
         scanrange, 
         max_hyper, 
         max_impuls, 
         hyper, 
         impuls, 
         colonizer, 
         hullid, 
         systemid, 
         templateid, 
         objectid, 
         damagereduction,
		 versionId,
		 shipStockVersionId,
		 shipModulesVersionId,
         spaceX,
		 spaceY,
		 isNull([energy],0) as [energy]
		  , isNull([crew],0) as [crew] 
		  , isNull([cargoroom],0) as [cargoroom] 
		  , isNull([fuelroom],0) as [fuelroom] 
		  , isNull([population],0) as [population] 
		  , isNull([shipHullsImage],0) as [shipHullsImage] 
		  , refitCounter
		  , noMovementCounter
		  , experience
  FROM   [ships]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTranscension' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTranscension]
  END 

go 
--select * from [engine].[v_Ships] 
CREATE VIEW [engine].[v_ShipTranscension] 
AS 
  SELECT [shipId]
      ,[helperMinimumRelation]
      ,[constructionDate]
      ,[ressourceCount]
  FROM   [ShipTranscension]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipTranscensionUsers' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipTranscensionUsers]
  END 

go 
--select * from [engine].[v_Ships] 
CREATE VIEW [engine].[v_ShipTranscensionUsers] 
AS 
 SELECT [shipId]
      ,[userId]
      ,[helpCount]
  FROM [dbo].[ShipTranscensionUsers];



go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipRefit' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipRefit] 
  END 

go 

 CREATE VIEW [engine].[v_ShipRefit] 
 AS 
 SELECT 
	shipId,
	refitCounter
FROM [ShipRefit]

go 



IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ShipsDirection' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ShipsDirection] 
  END 

go 

 CREATE VIEW [engine].[v_ShipsDirection] 
 AS 
 SELECT 
	shipId,
	moveCounter,
	moveDirection 
FROM [ShipsDirection]

go 


IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ServerEvents' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ServerEvents] 
  END 

go 

CREATE VIEW [engine].[v_ServerEvents] 
AS 
  SELECT id, 
         userid, 
         eventtype, 
         objectid, 
         int1, 
         int2, 
         int3 
  FROM   [serverevents]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ModulesGain' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ModulesGain] 
  END 

go 

CREATE VIEW [engine].[v_ModulesGain] 
AS 
  SELECT modulesid, 
         crew, 
         energy, 
         hitpoints, 
         damagereduction, 
         damageoutput, 
         cargoroom, 
         fuelroom, 
         inspacespeed, 
         insystemspeed, 
         maxspacemoves, 
         maxsystemmoves, 
         scanrange, 
         special, 
         weapontype, 
         [population],
		 toHitRatio
  FROM   [modulesgain]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_CommNodeUsers' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_CommNodeUsers] 
  END 

go 

CREATE VIEW [engine].[v_CommNodeUsers] 
AS 
  SELECT userid, 
         commnodeid, 
         readaccess, 
         writeaccess, 
         lastreadmessage, 
         informwhennew 
  FROM   [commnodeusers]; 

go 
 


IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserTargetRelations' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserTargetRelations] 
  END 

go 

CREATE VIEW [engine].[v_UserTargetRelations] 
AS 
  SELECT sender, 
         addressee, 
         targetrelation 
  FROM   [usertargetrelations]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_resultMessages' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_resultMessages] 
  END 

go 

CREATE VIEW [engine].[v_resultMessages] 
AS 
  SELECT resultid, 
         resulttext 
  FROM   [resultmessages]; 

go  

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_GalaxyMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_GalaxyMap] 
  END 

go 

CREATE VIEW [engine].[v_GalaxyMap] 
AS 
  SELECT id, 
         position.STX as posX, 
		 position.STY as posY,
         galaxyname, 
         objectid, 
         size, 
         isdemo ,
		 colonyCount,
		 transcendenceRequirement,
		 gameState,
		 winningTranscendenceConstruct
  FROM   [galaxymap]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Research' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Research] 
  END 

go 

CREATE VIEW [engine].[v_Research] 
AS 
  SELECT id, 
         objectimageurl, 
         [description], 
         cost, 
         label, 
         descriptionlabel, 
         researchtype, 
         treecolumn, 
         treerow ,
		 baseCost
  FROM   [research]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_shipStock' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_shipStock] 
  END 

go 

CREATE VIEW [engine].[v_shipStock] 
AS 
  SELECT shipid, 
         goodsid, 
         amount 
  FROM   [shipstock]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_StarMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_StarMap] 
  END 

go 

CREATE VIEW [engine].[v_StarMap] 
AS 
  SELECT  id, 
         positionX as posX, 
		 positionY as posY,
         systemname, 
         objectid, 
         size, 
         startsystem, 
         settled, 
         ressourceid ,
		 startingRegion
  FROM   [starmap]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_shipModules' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_shipModules] 
  END 

go 

CREATE VIEW [engine].[v_shipModules] 
AS 
  SELECT shipid, 
         moduleid, 
         posx, 
         posy, 
         hitpoints, 
         active 
  FROM   [shipmodules]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserResearch' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserResearch] 
  END 

go 

CREATE VIEW [engine].[v_UserResearch] 
AS 
  SELECT userid, 
         researchid, 
         iscompleted, 
         investedresearchpoints, 
         researchpriority 
  FROM   [userresearch]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_UserStarMap' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_UserStarMap] 
  END 

go 

CREATE VIEW [engine].[v_UserStarMap] 
AS 
  SELECT userid, 
         starid 
  FROM   [userstarmap]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_TradeOffers' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_TradeOffers] 
  END 

go 

CREATE VIEW [engine].[v_TradeOffers] 
AS 
  SELECT id, 
         commnodeid, 
         spaceobjectid, 
         spaceobjecttype 
  FROM   [tradeoffers]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_SolarSystemInstances' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_SolarSystemInstances] 
  END 

go 

CREATE VIEW [engine].[v_SolarSystemInstances] 
AS 
  SELECT id, 
         x, 
         y, 
         systemid, 
         objectid, 
         drawsize ,
		 colonyId
  FROM   [solarsysteminstances]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_DamageTypes' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_DamageTypes] 
  END 

go 

CREATE VIEW [engine].[v_DamageTypes] 
AS 
  SELECT id, 
         NAME, 
         label 
  FROM   [damagetypes]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_TradeOfferDetails' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_TradeOfferDetails] 
  END 

go 

CREATE VIEW [engine].[v_TradeOfferDetails] 
AS 
  SELECT tradeoffersid, 
         goodsid, 
         amount, 
         offer 
  FROM   [tradeofferdetails]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_planetStock' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_planetStock] 
  END 

go 

CREATE VIEW [engine].[v_planetStock] 
AS 
  SELECT systemid, 
         goodsid, 
         amount 
  FROM   [planetstock]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_ObjectDescription' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_ObjectDescription] 
  END 

go 

CREATE VIEW [engine].[v_ObjectDescription] 
AS 
  SELECT id,  
		 name,
         objectimageurl ,
		 versionNo
  FROM   [objectdescription]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Colonies' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Colonies] 
  END 

go 

CREATE VIEW [engine].[v_Colonies] 
AS 
  SELECT id, 
         userid, 
         NAME, 
         storage, 
         scanrange,  
         starid, 
         planetid, 
         shipinconstruction, 
         constructionduration, 
         [population], 
         construction, 
         turnsofrioting,
		 versionId,
		 TurnsOfSiege,
		 besiegedBy,
		 Influence
  FROM   [colonies]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_PlanetSurface' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_PlanetSurface] 
  END 

go 

CREATE VIEW [engine].[v_PlanetSurface] 
AS 
  SELECT id, 
         planetid, 
         x, 
         y, 
         surfaceobjectid, 
         surfacebuildingid 
  FROM   [planetsurface]; 

go 

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_Combat' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_Combat] 
  END 

go 

CREATE VIEW [engine].[v_Combat] 
AS 
SELECT 
	combatId ,
	attackerId ,
	defenderId ,
	[attackerName]  ,
    [defenderName]  ,
	attackerUserId  ,
	defenderUserId  ,
	starId ,
	spaceX ,
	spaceY ,
	systemX ,
	systemY ,

	attackerDamageDealt ,
	defenderDamageDealt ,

	attackerHitPointsRemain,
	defenderHitPointsRemain,
	defenderHasRead,
	messageDT,
	attackerExperience,
	defenderExperience,
	attackerShipHullId ,
	defenderShipHullId ,
	attackerShipHullImageId,
	defenderShipHullImageId,

	attackerEvasion			,
	attackerMaxHitPoints	,
	attackerStartHitpoint	,
	defenderEvasion			,
	defenderMaxHitPoints	,
	defenderStartHitpoint	,

	attackerShield	,
	defenderShield  

FROM   [Combat]; 
go
IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_CombatRounds' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_CombatRounds] 
  END 

go 
CREATE VIEW [engine].[v_CombatRounds] 
AS 
SELECT 
	combatId,
	roundNumber   ,
	shotNumber,
	side   ,
	moduleId   ,
	damage   ,
	hitPropability   ,
	isHit   
FROM   [CombatRounds]; 

go

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_GalacticEvents' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_GalacticEvents] 
  END 

go 
CREATE VIEW [engine].[v_GalacticEvents]
AS 
SELECT
	[id]
	,[eventType]
	,eventDatetime
	,[int1]
	,[int2]
	,[int3]
	,[int4]
	,[int5]
	,[int6]
	,[string1]
	,[string2]
	,[string3]
	,[string4]
	,[string5]
	,[string6]
	,[string7]
	,[string8]
  FROM [dbo].[GalacticEvents]

  go
  
IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_SpecializationGroups' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_SpecializationGroups] 
  END 

go 
CREATE VIEW [engine].[v_SpecializationGroups]
AS 
SELECT [id]
      ,[name]
      ,[picks]
      ,[label]
      ,[labelDescription]
  FROM [dbo].[SpecializationGroups]

  go
  
IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_SpecializationResearches' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW [engine].[v_SpecializationResearches] 
  END 

go 
CREATE VIEW [engine].[v_SpecializationResearches]
AS 
SELECT  [SpecializationGroupId]
      ,[ResearchId]
      ,[SecondaryResearchId]
	  ,Building1
	  ,Building2
	  ,Building3
	  ,Module1
	  ,Module2
	  ,Module3
  FROM [dbo].[SpecializationResearches]

  go