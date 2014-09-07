SET QUOTED_IDENTIFIER ON
go


/* USER GENERATED DATA: */
drop function [dbo].[getLabel];
drop view TradeOffersWithUsers
drop table TradeOfferDetails
drop table TradeOffers

drop table [dbo].[ServerEvents]

drop table [dbo].[MessageBody]
drop table [dbo].[MessageHeads]
drop TRIGGER TRIGGER_Alliances_Delete_FKs
drop TRIGGER TRIGGER_Users_Delete_FKs
drop table [dbo].[colonyStock]
drop table [dbo].[ColoniesBuildQueue]

drop trigger TRIGGER_CreatePlanetSurface		
drop table [dbo].[UserColonyMap]
drop table [dbo].[ColonyBuildings]
drop table [dbo].[Colonies]				-- Kolonien
drop table [dbo].[shipStock]
drop table [ShipsDirection]
drop table [dbo].[shipModules]
drop table [dbo].[Ships]

drop table [ShipTemplateModulePositions]
drop table ShipTemplateCosts
drop table [ShipTemplate]


drop table [ShipHullsModulePositions]
drop table [dbo].[planetStock]


drop table dbo.[UserTargetRelations]
drop table [dbo].[UserContacts]
drop table dbo.[activeUsers]

drop table dbo.[UserResearch]
drop table [UserQuests]


drop table CommNodeDefaultRights
drop table CommNodeUsers
drop table CommunicationNodeMessages
			
drop table dbo.[CommunicationNode]

drop table [dbo].[UserStarMap]			

drop table [dbo].[AllianceContacts]
drop table [dbo].[AllianceInvites]	
drop table [dbo].[AllianceMembers]
drop table [dbo].[AllianceTargetRelations]
drop table [dbo].[Alliances]

drop table [dbo].[Users]

drop table [dbo].[PlanetSurface]


/*Game-Specific Data*/
drop TABLE [dbo].[ShipTemplateBlueprints]
drop table ShipHullsGain
drop table [ShipHullsCosts]
drop table [dbo].[ShipHullsImages]
drop table [dbo].[ShipHulls]



drop table [dbo].[BuildOptions]

drop table [dbo].[BuildingProductions]
drop table [dbo].[BuildingCosts]
drop table [dbo].[Buildings]

drop table [ResearchGain]
drop table dbo.[Research]



drop table ModulesGain
drop table ModulesCosts
drop table Modules
drop table Quests
			
drop table [dbo].[Goods]



drop table [dbo].[SurfaceTiles]
drop table [dbo].[SolarSystemInstances]

drop view [dbo].[StarNames] 
drop view [dbo].[possibleStarNames]

drop table [dbo].[StarMap]
drop table [GalaxyMap]


drop table [dbo].[Move]

drop table [dbo].[numbers]


drop table [dbo].[ObjectWeaponModificators]
drop table [dbo].[ObjectOnMap]
drop TABLE [dbo].[surfaceDefaultMap]
drop table [dbo].[SurfaceImages]
drop table [dbo].[ObjectDescription]
drop table [dbo].[DamageTypes]


drop table [dbo].Labels
drop table [dbo].LabelsBase
drop table [dbo].Languages

print 'general data end'

drop table dbo.greekAlphabet
drop table dbo.ResearchQuestPrerequisites
drop table dbo.resultMessages
drop table dbo.UserRelations
drop table dbo.starnamesBlueprint
drop table dbo.starnamesCombinations


drop table gameNewTurnLog;
drop table gameNewTurns;
drop table game;
drop table [dbo].[defaultMap]
print 'tables dropped'
go
drop function [dbo].[randomFunc]
go
CREATE function [dbo].[randomFunc] ( @maxRandomValue int ,  @minRandomValue int) 
returns int
as
begin
	set @maxRandomValue = @maxRandomValue + 1;
	return (ABS(CAST(CAST((SELECT [NewId] FROM GetNewID) AS VARBINARY) AS int)) % (@maxRandomValue - @minRandomValue)) + @minRandomValue
end
GO


-- default map for planet surface
CREATE TABLE [dbo].[defaultMap](
	[X] [int] NULL,
	[Y] [int] NULL,
	[surfaceObjectId] [int] NULL
) ON [PRIMARY]
GO
create unique clustered index [defaultMap_index] ON [defaultMap]([X],[Y],[surfaceObjectId]);
go


CREATE TABLE [dbo].[game]			  (
	name nvarchar(63) NOT NULL	
);
print 'table [game] created.'
go
create unique clustered index [game_index] ON [game](name);
go


CREATE TABLE [dbo].gameNewTurns			  (
	[id] int not null UNIQUE identity(0,1),		
	targetTime datetime NOT NULL,
	turnStatus tinyint not null default 0 -- 0: open , 1: done , 2: skipped 
);
print 'table [gameNewTurns] created.'
go
create unique clustered index [gameNewTurns_index] ON gameNewTurns([id]);
go

-- insert into gameNewTurns(targetTime) select GETDATE()

CREATE TABLE [dbo].gameNewTurnLog			  (
	[gameNewTurnsId] int not null 
		references [dbo].gameNewTurns (id) on delete cascade,		
	newTurnBegin datetime NOT NULL,
	newTurnEnd datetime NOT NULL,
	newTurnRuntime int not null default 1
);
print 'table [gameNewTurnLog] created.'
go

create unique clustered index [gameNewTurnLog_index] ON gameNewTurnLog([gameNewTurnsId]);
go






-- Helper

CREATE TABLE [dbo].[Move] (
	[moveId] int not null,
	[x] int not null,
	[y] int not null
);
go
create clustered index [Move_index] ON [Move]([moveId]);
go

print ''
print '--- general data ---'


-- 0 en, 1 de, 2 fr, 3 ...
CREATE TABLE [dbo].[Languages]			  (
	[id] int not null UNIQUE identity(0,1),		
	languageFullName nvarchar(63) NOT NULL,
	languageShortName nvarchar(2) NOT NULL
);
print 'table [Languages] created.'
go
create unique clustered index [Languages_index] ON [Languages]([id]);
go


-- base data per label - standard - values
-- leading for label id, also provides english labels that do not yet exists translated in the [Labels]-table
create TABLE [dbo].[LabelsBase]  (
	id int not null,
	--languageId int 	not null 
	--	references [dbo].[Languages] (id) on delete cascade,	
	value nvarchar(4000) NOT NULL,
	comment nvarchar(200) NOT NULL,
	module int not null default 0,
	constraint LabelsBase_primary primary key clustered ( id)
);
go
--create unique clustered index [LabelsBase_index] ON [LabelsBase]([id]);
go

-- Prevent duplicates in the value column
CREATE TRIGGER TRIGGER_LabelsBaseInsert ON dbo.LabelsBase
INSTEAD OF INSERT
AS
BEGIN	
	insert into dbo.LabelsBase
	select inserted.* from inserted
	left join dbo.LabelsBase as existingLabel
		on	existingLabel.value = inserted.value
		and existingLabel.comment = inserted.comment
	left join inserted as checkDuplicate
		on  checkDuplicate.value = inserted.value
		and checkDuplicate.comment = inserted.comment
	and checkDuplicate.id < inserted.id
	where existingLabel.value is null
	and checkDuplicate.id is null
END
--create unique index LabelsBase_Unique ON LabelsBase(value);
go

-- language-labels to be exported to the client
CREATE TABLE [dbo].[Labels]		  (
	id  int  not null
		references [dbo].LabelsBase (id) on delete cascade,			
	languageId int 	not null 
		references [dbo].[Languages] (id) on delete cascade,	
	label nvarchar(4000) NOT NULL,
	constraint Labels_primary primary key nonclustered (id,languageId)
);
go
create clustered index Labels_byLanguage ON Labels(languageId);
go


CREATE TABLE [dbo].[UserRelations]  (
relationId		tinyint NOT NULL UNIQUE,
relationName nvarchar(63),
relationDescription nvarchar(255)
);
go
create UNIQUE clustered index UserRelations_Cluster ON [UserRelations](relationId);
go


CREATE TABLE [dbo].[Users]			  (
	[id] int not null UNIQUE check ( id > -1 ),		
	username nvarchar(63) DEFAULT '' NOT NULL,
	password1 nvarchar(63) DEFAULT '' NOT NULL,	
	email nvarchar(63),
	created datetime,	
	player_ip nvarchar(55),		-- last used ip
	user_ip nvarchar(55),		-- creation IP
	activity bit DEFAULT 0,
	locked bit DEFAULT 0,		-- deleted?	
	lastlogin TIMESTAMP,
	user_session nvarchar(32),
	showRaster bit not null default 0,
	moveShipsAsync bit not null default 0,
	homeCoordX int not null default 100,
	homeCoordY int not null default 100,
	[language] int not null default 0,
	[loginDT] [datetime] NULL,
	lastSelectedObjectType int default 0,	--0 colony, 1 ship
	lastSelectedObjectId int default 0,
	showSystemNames bit not null default 0,
	showColonyNames bit not null default 0,
	showCoordinates bit not null default 0,
	[showColonyOwners] bit not null default 0,
	[showShipNames] bit not null default 0,
	[showShipOwners] bit not null default 0,
	researchPoints int not null default 0,
	scanRangeBrightness tinyint not null default 12,
	--researchSpent int not null default 0,  -- redundant, can be calculated by summing all researches of that user
	constraint Users_primary primary key nonclustered (id)
);
print 'table [Users] created.'
go
create unique clustered index Users_index ON [Users]([id]);
go


CREATE   TABLE [dbo].[Alliances]			  (
	[id] int not null identity(1,1),		
	name nvarchar(300) DEFAULT '' NOT NULL,
	[description] nvarchar(4000) DEFAULT '',
	passwrd	nvarchar(63)  NOT NULL DEFAULT '',		
	allianceOwner int references [dbo].[Users] (id) on update cascade on delete SET Default,		
	constraint Alliances_primary primary key nonclustered (id)
);
print 'table [Alliances] created.'
go
create clustered index Alliances_index ON [Alliances]([id]);
go

CREATE TABLE [dbo].[AllianceContacts]  (
alliance1		int 
	references [Alliances](id) on update cascade on delete cascade,		
alliance2	int	,
currentRelation tinyint not null default 1 references [UserRelations](relationId) on update cascade on delete no action 
);
create clustered index AllianceContacts_UNIQUE ON AllianceContacts(alliance1,alliance2);
print 'table [dbo].[AllianceContacts] created.'

go
CREATE TABLE [dbo].[AllianceMembers]
(
	allianceId int not null
		references [dbo].[Alliances] (id) on update cascade on delete cascade,
	userId int not null,
	--	references [dbo].[Users] (id) on update cascade on delete cascade,	
	fullAdmin bit not null default 0,    --may invite or kick normal members, may make all diplomatic actions
	diplomaticAdmin bit not null default 0,  -- may make all diplomatic actions
	mayInvite bit not null default 0, 
	mayFire bit not null default 0,
	mayDeclareWar bit not null default 0,
	mayMakeDiplomaticProposals bit not null default 0,
	constraint AllianceMember_primary primary key nonclustered (allianceId,userId)
);
go
create unique nonclustered  index AllianceMembersUser_UNIQUE ON [AllianceMembers](userId);
go
print 'table [AllianceMembers] created.'
go
create unique clustered index AllianceMembers_index ON [AllianceMembers](allianceId,userId);
go
--drop table [dbo].[AllianceMembers]
CREATE TABLE [dbo].[AllianceInvites](
	allianceId int not null
		references [dbo].[Alliances] (id) on update cascade on delete cascade,
	userId int not null,
--		references [dbo].[Users] (id) on update cascade on delete cascade,		
	constraint AllianceInvites_primary primary key nonclustered (allianceId,userId)
);
print 'table [AllianceInvites] created.'
go
create unique clustered index AllianceInvites_index ON [AllianceInvites](allianceId,userId);
go


CREATE TABLE [dbo].[AllianceTargetRelations]  (
sender		int references [dbo].[Alliances] (id) on update cascade on delete cascade,
addressee	int	,
targetRelation tinyint default null,	 
);
create clustered index AllianceTargetRelations_UNIQUE ON [AllianceTargetRelations](sender,addressee);
print 'table [dbo].[AllianceTargetRelations] created.'
go


--relation between alliances and alliances and users which are not themselves in an Alliance
/*
CREATE TABLE [dbo].[AllianceContacts]  (
allianceId		int 
	references [Alliances](id) on update cascade on delete cascade,		
addressee	int	,
addresseeType tinyint not null default 1, -- 0 : USer , 1 Allianz, 2 Meta
currentRelation tinyint not null default 1 references [UserRelations](relationId) on update cascade on delete no action 
);
create clustered index AllianceContacts_UNIQUE ON AllianceContacts(allianceId,addressee,addresseeType);
print 'table [dbo].[AllianceContacts] created.'
*/

go

CREATE TABLE [dbo].[Quests]			  (
	[id] int not null identity(1,1),		
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update cascade on delete SET Default,
	descriptionLabel int,
	isIntro bit not null default 1,
	isRandom bit not null default 0,
	hasScript bit not null default 1,
	script nvarchar(55),		 		
	constraint Quests_primary primary key nonclustered ([id])
);
print 'table [Quests] created.'
go
create unique clustered index Quests_index ON [Quests]([id]);
go
/*
CREATE TABLE [dbo].[QuestsPrerequisites] (
	questId SMALLINT NOT NULL 
		references [dbo].[Research] (id),	
	preQuestId SMALLINT 
		references [dbo].[Research] (id)	
);
print 'table [ResearchPrerequisites] created.'
go
*/

CREATE TABLE [dbo].[ResearchQuestPrerequisites] (
	SourceType SMALLINT NOT NULL 	
	, SourceId SMALLINT NOT NULL 	
	, TargetType SMALLINT NOT NULL 	
	, TargetId SMALLINT NOT NULL 		
);
go
--drop index ResearchQuestPrerequisites_Unique on ResearchQuestPrerequisites
create unique clustered index ResearchQuestPrerequisites_Unique ON ResearchQuestPrerequisites(SourceType,SourceId,TargetType,TargetId);
go
--delete from [ResearchQuestPrerequisites]  
print 'table [ResearchQuestPrerequisites] created.'
go


CREATE TABLE [dbo].[UserQuests]			  (
	userId  int  not null  
		references [dbo].[Users] (id)  on delete cascade,
	questId int 	not null 
		references [dbo].[Quests] (id) on delete cascade,	
	isRead bit not null default 0,   -- 0 inactiv, 1 activ
	isCompleted  bit not null default 0
);
print 'table UserQuests created.'
go
create clustered index UserQuests_byUser2 ON [UserQuests](userId);
go

--alter table dbo.[CommunicationNode] add  unformattedName nvarchar(30) not null default ''
CREATE TABLE [dbo].[CommunicationNode] (
	[id] int not null UNIQUE identity(0,1), 
	userId  int  --owner 
		references [dbo].[Users] (id) on delete set null,
	position geometry NOT NULL,	
	name nvarchar(300) not null default '',
	unformattedName nvarchar(30) not null default '',
	positionX	int not null default 100,	
	positionY	int not null default 100,
	sysX int default 10,	
	sysY int default 10,	
	connectionType int not null default 1,  --0ship, 1 building, 2 module
	connectionId int not null default 1, --id of connection
	activ bit not null default 1,   -- 0 inactiv, 1 activ
	constraint CommunicationNode_primary primary key clustered ([id])
);
print 'table [CommunicationNode] created.'
go
create index CommunicationNode_byUser ON CommunicationNode(userId);
go


CREATE TABLE [dbo].[CommunicationNodeMessages]  (
	id INT NOT NULL UNIQUE identity(1,1),
	commNodeId int 	not null 
		references [dbo].CommunicationNode (id) on delete cascade,			
	sender int 
		references users(id) on update cascade on delete SET NULL,
			
	[headline] nvarchar(255) DEFAULT 'Headline' NOT NULL,		
	[messageBody] nvarchar (4000) DEFAULT 'message' NOT NULL,
	sendingDate datetime not null default GETDATE()		
	constraint CommunicationNodeMessages_primary primary key nonclustered (id)		
);
create clustered index CommunicationNodeMessages_NodeId ON [CommunicationNodeMessages](commNodeId);
go
print 'table [CommunicationNodeMessages] created.'
go

CREATE TABLE [dbo].CommNodeUsers (
	userId  int  not null  
		references [dbo].[Users] (id)  on delete cascade,
	commNodeId int 	not null 
		references [dbo].CommunicationNode (id) on delete cascade,	
	readAccess bit not null default 1,   -- 0 inactiv, 1 activ
	writeAccess bit not null default 1,   -- 0 inactiv, 1 activ
	lastReadMessage int not null default 0,
	informWhenNew bit not null default 1
);
print 'table [CommNodeUsers] created.'
go
create clustered index CommNodeUsers_byUser2 ON CommNodeUsers(userId);
create index CommNodeUsers_bycommNodeId ON CommNodeUsers(commNodeId);
go



--used to detect which Users are currently onLine - Not Implemented atm
CREATE TABLE [dbo].[activeUsers](
	userId int not null
		references [dbo].[Users] (id) on delete cascade,
loginTime datetime,
lastMessageTransferred int	
);
print 'table [activeUsers] created.'
go
create unique clustered index activeUsers_index ON [activeUsers](userId);
go


/*
alter table [Users]
add homeCoordY int
default 100 not null



  <moveShipsAsync>1</moveShipsAsync>
  <homeCoordX>100</homeCoordX>
  <homeCoordY>100</homeCoordY>
*/  


/* ---------------------------------------------------
Nach der initialisierung kommen in diesen Tabllen keine neuen Einträge hinzu
--------------------------------------------------- */ 



print '--- Research data ---'
create TABLE [dbo].[Research] (
	id SMALLINT NOT NULL identity(1,1),	
	[name] nvarchar(55),
	objectimageUrl nvarchar(128) DEFAULT '',	
	description	nvarchar(1024) NOT NULL DEFAULT '',	
	cost smallint not null default 10,
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update  NO ACTION on delete  NO ACTION,
	descriptionLabel int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update  NO ACTION on delete NO ACTION,
	researchType tinyint not null default 1,
	treeColumn 	tinyint not null default 1,
	treeRow tinyint not null default 1,
	constraint Research_primary primary key nonclustered (id)
);
print 'table [Research] created.'
go
create unique clustered index Research_index ON [Research](id);
go
/*
CREATE TABLE [dbo].[ResearchPrerequisites] (
	researchId SMALLINT NOT NULL 
		references [dbo].[Research] (id),	
	preResearchId SMALLINT NOT NULL 
		references [dbo].[Research] (id)	
);
print 'table [ResearchPrerequisites] created.'
go
*/

go



create TABLE [dbo].[UserResearch] 
(
	userId INT NOT NULL
		references [dbo].[Users] (id) on update cascade on delete cascade,  
	researchId SMALLINT NOT NULL 
		references [dbo].[Research] (id) on update cascade on delete cascade,
	isCompleted tinyint not null default 0,	
	investedResearchpoints int not null default 0, 
	researchPriority smallInt not null default 0 -- 0 : no priority, 1 current research, 2 the research after the current and so on
)
print 'table [UserResearch] created.'		
go
create unique clustered index UserResearch_index ON [UserResearch](userId,researchId);
go	
		

print ''
print '--- Colony data ---'

go

go 
-- laser, Raketen / rocket , Beschleuniger / accelerator und andere!
--drop table [dbo].[DamageTypes]
CREATE TABLE [dbo].[DamageTypes] (
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),	
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update SET Default on delete SET Default
	constraint DamageTypes_primary primary key nonclustered (id)
);
print 'table [DamageTypes] created.'

go
create unique clustered index DamageTypes_index ON [DamageTypes](id);
go	
		

go
CREATE TABLE [dbo].[ObjectDescription] (
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectimageUrl nvarchar(128) DEFAULT '',
	moveCost	tinyint NOT NULL DEFAULT 1,
	damage		tinyint	NOT NULL DEFAULT 0,
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update cascade on delete SET Default
	constraint ObjectDescription_primary primary key nonclustered (id)
);
print 'table [ObjectDescription] created.'
go
create unique clustered index ObjectDescription_index ON [ObjectDescription](id);
go	

/*
	Benefits that are created per Research -> is not mandatory for researches	
	alter  TABLE  [dbo].[ModulesGain] add [population] bigint not null default 0
*/
CREATE TABLE  [dbo].[ResearchGain]
(
	researchId SMALLINT NOT NULL
		references [dbo].[Research] (id) on update cascade on delete cascade,
	growth int not null default 0,
	construction int not null default 0,
	industrie int not null default 0,
	food  int not null default 0,
	colonyCount SMALLINT not null default 0,
	objectId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade	
);
go
create clustered index ResearchGain_primary ON [ResearchGain](researchId);
go
print 'table [ResearchGain] created.'
go

--drop TABLE [dbo].[SurfaceImages]
go
CREATE TABLE [dbo].[SurfaceImages] (
	id SMALLINT NOT NULL UNIQUE identity(1,1),	
	[name] nvarchar(55),		
	seed int not null,
	objectimageUrl nvarchar(128) DEFAULT ''
	--objectId SMALLINT NOT NULL UNIQUE references [dbo].[ObjectDescription](id) on update cascade on delete cascade			
);
print 'table [SurfaceImages] created.'
go
create unique clustered index SurfaceImages_index ON [SurfaceImages](id);
go	

go
--drop TABLE [dbo].[surfaceDefaultMap]
go
CREATE TABLE [dbo].[surfaceDefaultMap](
	id SMALLINT NOT NULL references [dbo].[SurfaceImages](id) on update cascade on delete cascade ,	
	[X] [int] NULL,
	[Y] [int] NULL,
	[surfaceObjectId] [int] NULL
) ON [PRIMARY]
GO
create unique clustered index surfaceDefaultMap_index ON [surfaceDefaultMap](id,[X],[Y]);
go	
go


--Verteidigungsbonus, Einflugschaden? Schadensstyp? Einflugschadenwahrscheinlichkeit? Wahrscheinlichkeit reduzierbar durch Ausweichfaktor?	
--drop table [dbo].[ObjectOnMap]
CREATE TABLE [dbo].[ObjectOnMap] (
	id SMALLINT NOT NULL UNIQUE references [dbo].[ObjectDescription](id) on update cascade on delete cascade ,	
	moveCost	tinyint NOT NULL DEFAULT 1,
	damage		SMALLINT NOT NULL DEFAULT 0,
	damageType  SMALLINT references [dbo].[ObjectDescription](id) on update no action on delete no action  ,	
	damageProbability SMALLINT	NOT NULL DEFAULT 100,
	damageProbabilityReducableByShip bit NOT NULL DEFAULT 1,	
	defenseBonus tinyint	NOT NULL DEFAULT 0,
	fieldSize tinyint	NOT NULL DEFAULT 1,
	constraint ObjectonMap_primary primary key nonclustered (id)
);
print 'table [ObjectOnMap] created.'
go
create unique clustered index ObjectOnMap_index ON [ObjectOnMap](id);
go	


--damageType may be NULL, then all damageTypes are meant?
--drop table [ObjectWeaponModificators]
CREATE TABLE [dbo].[ObjectWeaponModificators] (
	objectId			SMALLINT NOT NULL references [dbo].[ObjectDescription](id) on update cascade on delete cascade ,	
	damageType			SMALLINT references [dbo].[ObjectDescription](id) on update no action on delete no action  ,		
	damageModificator	SMALLINT NOT NULL DEFAULT 0,
	toHitModificator 	SMALLINT NOT NULL DEFAULT 0,
	applyTo			 	TINYINT NOT NULL DEFAULT 2 --0 defender , 1 attacker,  2 both
	constraint ObjectWeaponModificators_primary primary key nonclustered (objectId,damageType)
);
print 'table [ObjectWeaponModificators] created.'
go
create unique clustered index ObjectWeaponModificators_index ON [ObjectWeaponModificators](objectId,damageType);
go	

go

CREATE TABLE [dbo].[Goods](
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectDescriptionId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade,
	goodsType smallint not null default 1,	--1 good, 2 module, 3 special
	--objektimage_url nvarchar(128) DEFAULT '',
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	constraint bpGoods_primary primary key nonclustered (id)
);
print 'table [Goods] created.'
go
create unique clustered index Goodsindex ON [Goods](id);
go	


CREATE TABLE [dbo].[Buildings]  (
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade,		
	BuildingScript nvarchar(55),
	oncePerColony bit not null default 0,
	isBuildable SMALLINT NOT NULL Default 1,
	visibilityNeedsGoods SMALLINT NOT NULL Default 1, --1 : always, 2 : goods have to be present 
	groupId tinyInt not null default 1, --display area of this building. 
	prodQueueLevel tinyint not null default 1, -- needed during turnSummary-deactivation of buildings, and when complex prod trees and their production/consume is turnbased evaluated
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,	
	housing int not null default 0,
	constraint buildings_primary primary key clustered (id)
);
go

	
print 'table [Buildings] created.'
go
CREATE TABLE [dbo].[BuildingCosts]  (		
	buildingId SMALLINT NOT NULL
		references [dbo].[Buildings] (id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL,
		--references [dbo].[Goods] (id) on update cascade on delete cascade,
	amount SMALLINT NOT NULL DEFAULT 0,		
	constraint BuildingCosts_primary primary key clustered (goodsId,buildingId)		
);
print 'table [BuildOptions] created.'

go
/*
	Goods that are created per Building	
*/
CREATE TABLE  [dbo].[BuildingProductions]
(
	buildingId SMALLINT NOT NULL
		references [dbo].[Buildings] (id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods] (id) on update no action on delete no action,
	amount SMALLINT NOT NULL DEFAULT 0,
	constraint BuildingProductions_primary primary key clustered (buildingId,goodsId)
);
print 'table [BuildingProductions] created.'
go
CREATE TABLE  [dbo].[SurfaceTiles]
(
		id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectId SMALLINT NOT NULL
		references [dbo].[ObjectDescription](id) on update cascade on delete cascade,	
	constraint Surface_primary primary key clustered (id)
);
go
--create unique clustered index SurfaceTiles_index ON [SurfaceTiles](id);
go	

print 'table [SurfaceTiles] created.'
go
/* ---------------------------------------------------
für jede Landschaft (101-106) erlaubte Gebaeudetypen (151 - )
--------------------------------------------------- */ 
CREATE TABLE [dbo].[BuildOptions]  (
	objectId SMALLINT NOT NULL
		references [dbo].[SurfaceTiles](id) on update cascade on delete cascade,	
	buildingId SMALLINT NOT NULL,
	--	references [dbo].[Buildings] (id) on update cascade on delete cascade,
	constraint BuildOptions_primary primary key clustered (objectId,buildingId)		
);
print 'table [BuildOptions] created.'
go
print ''
print '--- Galactic map data ---'




--shipmodules
--just to set allowed modules per user (via his [ResearchQuestPrerequisites])
--modules are just as building, only that they appear in the goods-list after build
CREATE TABLE [dbo].[Modules]			  (
	[id] SMALLINT not null identity(1,1),		
	name nvarchar(63) DEFAULT '' NOT NULL,	
	descriptionLabel int,		
	goodsId SMALLINT NOT NULL
		references [Goods](id) on update cascade on delete cascade,
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	[level] tinyint not null default 1,
	constraint Modules_primary primary key clustered (id)
);
print 'table [Modules] created.'
go


CREATE TABLE [dbo].[ModulesCosts]  (		
	modulesId SMALLINT NOT NULL
		references [dbo].Modules (id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods] (id) on update no action on delete no action,
	amount SMALLINT NOT NULL DEFAULT 0,		
	constraint ModulesCosts_primary primary key clustered (goodsId,modulesId)		
);
print 'table [ModulesCosts] created.'

go
/*
	Benefits that are created per Module	
	crew, energy, hitpoints, damagereduction, damageoutput, cargoroom, speed (moves oper turn), maxMoves, both in System and inSpace
	Special like Colonization, asteroid mining
	alter  TABLE  [dbo].[ModulesGain] add [population] bigint not null default 0
*/
CREATE TABLE  [dbo].[ModulesGain]
(
	modulesId SMALLINT NOT NULL
		references [dbo].Modules (id) on update cascade on delete cascade,
	crew int not null default 0,
	energy SMALLINT not null default 0,
	hitpoints SMALLINT not null default 0,
	damagereduction SMALLINT not null default 0,
	damageoutput SMALLINT not null default 0, 
	cargoroom SMALLINT not null default 0,
	fuelroom SMALLINT not null default 0,
	inSpaceSpeed SMALLINT not null default 0,-- (moves oper turn), 
	inSystemSpeed SMALLINT not null default 0,-- (moves oper turn), 
	maxSpaceMoves SMALLINT not null default 0,
	maxSystemMoves SMALLINT not null default 0,
	scanRange SMALLINT not null default 0,
	special int not null default 0,	--Special like Colonization, asteroid mining	
	weaponType tinyint not null default 0,
	[population] bigint not null default 0
);
go
create clustered index ModulesGain_primary ON [ModulesGain](modulesId);
go
print 'table [ModulesGain] created.'


/* ---------------------------------------------------
die Sternenkartenobjekte, hole die entsprechenden ID's aus der Sternenkarte
ToDo: Default 1 -> Funktion die ein Default-Wert berechnet...
--------------------------------------------------- */ 

/* ---------------------------------------------------
die verschiedenen Sternensysteme (können sich Ingame evt. wiederholen)
--------------------------------------------------- */ 
/*
go
CREATE TABLE [dbo].[StarBlueprints](
[systemBPid]  [int] NOT NULL,
[systemName]  nvarchar(127),
[systemSize]  tinyint,
[systemType] int not null default 0,  -- 0 star, 1 asteroid, 2 nebula, 3 spezial
[objectId] [smallint] NOT NULL,
 CONSTRAINT [StarBlueprints_primary] PRIMARY KEY NONCLUSTERED 
(
	[systemBPid] ASC
))
go
print 'table [dbo].[StarBlueprints] created.'
go
*/
/*
CREATE TABLE [dbo].[SolarSystemBlueprints](
	[id] [int] NOT NULL identity(1,1),
	[systemBPid] [int] NOT NULL references [StarBlueprints]([systemBPid]) on update cascade on delete cascade ,
	X int NOT NULL,
	Y int not null,
	[objectId] [smallint] NOT NULL,
 CONSTRAINT [SolarSystemBlueprints_primary] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)
)
print 'table [dbo].[SolarSystemBlueprints] created.'
*/




/* ---------------------------------------------------
die Sternenkartenobjekte, hole die entsprechenden ID's aus der Sternenkarte
ToDo: Default 1 -> Funktion die ein Default-Wert berechnet...
--------------------------------------------------- */ 
create TABLE  [dbo].[GalaxyMap]
(
	id INT NOT NULL UNIQUE,			
	position geometry NOT NULL,
	galaxyName nvarchar(63),					
	objectId SMALLINT NOT NULL DEFAULT 1,
	size smallint not null default 10000,	
	isDemo bit not null default 0
	constraint GalaxyMap_primary primary key clustered (id)
);

go

CREATE TABLE  [dbo].[StarMap]
(
	id INT NOT NULL,
	position geometry NOT NULL,
	systemname nvarchar(63),					
	objectId SMALLINT NOT NULL DEFAULT 1
		references [ObjectDescription](id) on update cascade on delete cascade,
	size smallint not null default 20,	
	startSystem tinyint not null default 0,
	settled tinyint not null default 0	,
	ressourceId tinyint NOT NULL default 0
	constraint starMap_primary primary key clustered (id)
);

-- drop  INDEX [StarMap_position]  ON [dbo].[StarMap]

-- Declare @geometry geometry = (select Ships.scanBox from Ships where Ships.id = 10)
-- exec sp_help_spatial_geometry_index 'StarMap', Starmap_position, 1 , @geometry 
go

CREATE TABLE  [dbo].[UserStarMap]
(
	userId INT NOT NULL
		references [dbo].[Users] (id)  on update cascade on delete cascade, 			
	starId INT NOT NULL
		references [dbo].[StarMap] (id) on update cascade on delete cascade,
	constraint UserStarMap_primary primary key clustered (userId,starId)
);
go

/*
if (((select inserted.position.STX from inserted)  != (select deleted.position.STX from deleted))
		or
	 ((select inserted.position.STY from inserted)  != (select deleted.position.STY from deleted)))
	begin
		with currentlyScannedStars as
		(
			select 
				starMap.id as starId,
				shipWhichScans.userId,
				cast(starMap.position.STX as int) as xpos,
				cast(starMap.position.STY as int) as ypos,
				starMap.objectId as "type",
				objectDesc.objectimageUrl as  gif,
				starMap.systemname as name,
				starMap.size
			from inserted  as shipWhichScans
			inner join dbo.StarMap as starMap
				on shipWhichScans.scanBox.STContains(starMap.position) = 1
			inner join dbo.ObjectDescription as objectDesc
				on objectDesc.id = starMap.objectId		
		)
		insert into [UserStarMap]
		select currentlyScannedStars.userId, currentlyScannedStars.starId
		from currentlyScannedStars
		left join [UserStarMap] as alreadyInserted
			on alreadyInserted.userId = currentlyScannedStars.userId
			and alreadyInserted.starId = currentlyScannedStars.starId
		where alreadyInserted.starId is null
	end
*/
--create index UserStarMap_userId ON [MessageHeads](userId);


/* ---------------------------------------------------
die verschiedenen Sternensysteme - wie sie nachher im Spiel auftauchen...
--------------------------------------------------- */ 

CREATE TABLE [dbo].[SolarSystemInstances]  
(	
	id INT NOT NULL identity(1,1),
	x int NOT NULL,	
	y int NOT NULL,	
	systemId INT NOT NULL
		references [dbo].[StarMap](id) on update no action on delete no action,		
	objectId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade,	
	drawSize tinyInt not null default 1,	
	constraint bpSolarSystemInstances_primary primary key nonclustered (id)
);
--drop index bpSolarSystemInstances_Cluster on [dbo].[SolarSystemInstances]
create clustered index bpSolarSystemInstances_Cluster on [dbo].[SolarSystemInstances](systemId,x,y);

print 'table [dbo].[SolarSystemInstances] created.'

go
CREATE TABLE [dbo].[planetStock](	
	systemId Int NOT NULL
		references [dbo].[SolarSystemInstances](id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods](id) on update no action on delete no action,
	amount SMALLINT NOT NULL DEFAULT 0,
	constraint planetStock_primary primary key clustered (systemId,goodsId)
);
print 'table [dbo].[planetStock] created.'
go

-- Planet Surface as terrainMap
CREATE TABLE [dbo].[PlanetSurface]  (
	id bigint not null identity(1,1),	
	planetId INT NOT NULL
		references [dbo].[SolarSystemInstances](id), --on update cascade on delete cascade,
	X TINYINT NOT NULL,
	Y TINYINT NOT NULL,
	--position geometry NOT NULL,		
	--tileNr TINYINT NOT NULL, -- from 0 to 87 (11 * 8)
	surfaceObjectId SMALLINT NOT NULL
		references [dbo].[SurfaceTiles](id), --on update cascade on delete no action,	
	surfaceBuildingId SMALLINT
		references [dbo].[Buildings](id) on update no action on delete no action,		
	constraint planetSurface_primary primary key nonclustered (planetId,X,Y)		
);
create clustered index PlanetSurface_Cluster on [dbo].[PlanetSurface](planetId);
CREATE UNIQUE NONCLUSTERED INDEX [PlanetSurface_Id] ON [PlanetSurface](id);
print 'table [dbo].[PlanetSurface] created.'
go

/*
create function createPlanetSurface ()
returns @surface TABLE 
(
    -- columns returned by the function
    X int NOT NULL,
    Y int NOT NULL,
    surfaceObjectId int not null
)
as 
begin
	-- select * from createPlanetSurface()
	insert into @surface
	select 			
		 numX.number as X,
		 numY.number as Y,
		 case when (10 * numX.number + 	numY.number) % 9 = 0 then 2 else	  
		 case when (10 * numX.number + 	numY.number) % 13 = 0 then 3 else
		 1 end end as surfaceObjectId
	from numbers as numX 
	left join numbers as numY 
		on numY.number < 8
	where numX.number < 11;
	
	return
end;
go

*/

go
-- Planet Surface as buildingMap
/*
CREATE TABLE [dbo].[PlanetBuildings]  (	
	planetId INT NOT NULL
		references [dbo].[SolarSystemInstances](id),	
	tileNr TINYINT NOT NULL,	
	building SMALLINT DEFAULT NULL
		references [dbo].[Buildings](id) on update cascade on delete cascade ,	
	constraint PlanetBuildings_primary primary key nonclustered (planetId,tileNr)		
);
create clustered index PlanetBuildings_Cluster on [dbo].[PlanetBuildings](planetId);
print 'table [dbo].[PlanetBuildings] created.'
*/

-- Colony Surface as buildingMap
/*
drop TABLE [dbo].[ColonyBuildings]  (	
	planetId INT NOT NULL
		references [dbo].[SolarSystemInstances](id) on update cascade on delete cascade,	
	tileNr TINYINT NOT NULL,	
	building SMALLINT DEFAULT NULL
		references [dbo].[Buildings](id) on update cascade on delete cascade ,	
	constraint ColonyBuildings_primary primary key nonclustered (planetId,tileNr)		
);
create clustered index ColonySurface_Cluster on [dbo].[ColonyBuildings](planetId);
print 'table [dbo].[ColonyBuildings] created.'
*/


/* ---------------------------------------------------
Schiffsrumpf
--------------------------------------------------- */ 



/*
CREATE TABLE [dbo].[bpHull](
	[id] [tinyint] NOT NULL,
	[type] [tinyint] NOT NULL default 5,
	[typename] [nvarchar](63) NOT NULL default N'samllHull',
	objectId int NOT NULL default 400,
 CONSTRAINT [bpHull_primary] PRIMARY KEY CLUSTERED (id)
 );
 go
*/

CREATE TABLE [dbo].[ShipHulls](
	[id] TINYINT NOT NULL,	
	[isStarBase] bit not null default 0,
	[typename] [nvarchar](63) NOT NULL default N'scout',
	labelName  int not null default 0,
	objectId int NOT NULL default 400,
	modulesCount tinyint not null default 5,
	templateImageUrl nvarchar(128) DEFAULT '',	
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
 CONSTRAINT [ShipHulls_primary] PRIMARY KEY CLUSTERED (id)
 );
go
-- images which are allowed per ship hull. User may select one during ship template design

CREATE TABLE [dbo].[ShipHullsImages]  (		
	[id] INT NOT NULL,	
	shipHullId TINYINT NOT NULL
		references [dbo].[ShipHulls] (id) on update cascade on delete cascade,
	objectId int NOT NULL default 401,
	templateImageId int NOT NULL default 401, -- image shown in the ship template designer
	templateModulesXoffset int not null default 0,
	templateModulesYoffset int not null default 0,
	constraint ShipHullsImages_primary primary key clustered ([id])		
);
print 'table [ShipHullsImages] created.'
go
 
 
CREATE TABLE [dbo].[ShipHullsCosts]  (		
	shipHullId TINYINT NOT NULL
		references [dbo].[ShipHulls] (id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods] (id) on update cascade on delete cascade,
	amount SMALLINT NOT NULL DEFAULT 0,		
	constraint ShipHullsCosts_primary primary key clustered (goodsId,shipHullId)		
);
print 'table [ShipHullsCosts] created.'

go

--sets where modules are possible:
CREATE TABLE [dbo].[ShipHullsModulePositions]  (		
	shipHullId TINYINT NOT NULL
		references [dbo].[ShipHulls] (id) on update cascade on delete cascade,
	posX TINYINT NOT NULL,
	posY TINYINT NOT NULL,			
	constraint ShipHullsMP_primary primary key clustered (shipHullId,posX,posY)		
);
print 'table [ShipHullsModulePositions] created.'

---- alter table [ShipHullsGain] add  [population] bigint default 0
CREATE TABLE  [dbo].[ShipHullsGain]
(
	shipHullId TINYINT NOT NULL
		references [dbo].[ShipHulls] (id) on update cascade on delete cascade,
	crew int not null default 0,
	energy SMALLINT not null default 0,
	hitpoints SMALLINT not null default 0,
	damagereduction SMALLINT not null default 0,
	damageoutput SMALLINT not null default 0, 
	cargoroom SMALLINT not null default 0,
	fuelroom SMALLINT not null default 0,
	inSpaceSpeed SMALLINT not null default 0,-- (moves oper turn), 
	inSystemSpeed SMALLINT not null default 0,-- (moves oper turn), 
	maxSpaceMoves SMALLINT not null default 0,
	maxSystemMoves SMALLINT not null default 0,
	special int not null default 0,	--Special like Colonization, asteroid mining	
	scanRange smallint not null default 0,
	[population] bigint default 0
);
go
create clustered index SHipHullsGain_prim ON [ShipHullsGain](shipHullId);
go
print 'table [ModulesGain] created.'
go

--------------------------------------------------------
---------- ShipTemplate - Initial Blueprints to give each Player (at least needed during the starting phase)...
--------------------------------------------------------
create TABLE [dbo].[ShipTemplateBlueprints] (
	id int identity (1,1) ,	
	shipHullId tinyInt not null 
		references	[dbo].ShipHulls (id) on update cascade on delete cascade,
	name varchar(63) NOT NULL DEFAULT 'Fregatte',  --default will be set by hull, name should be changeable by player
	gif varchar(63) NOT NULL DEFAULT 'schiffklein.gif',  -- should be set by hull, a list of interchangeable grphics shoul be given...
	
	--statistics
	energy int  default 5, -- will change dynamically during template-design
	crew int default 5,
	
	scanRange SMALLINT,
	    
    attack int,
    defense int,
    
    hitpoints int,
    damagereduction SMALLINT default 0,
    
    cargoroom SMALLINT  default 0,
	fuelroom SMALLINT  default 0,
	
    systemMovesPerTurn int,
    galaxyMovesPerTurn int,

    systemMovesMax int,
    galaxyMovesMax int,

    isColonizer int,
    
    constructionDuration int, 
    constructable bit default 0,
    amountBuilt int default 0,
    obsolete bit default 0,
    
	constraint ShipTemplateBlueprints_primary primary key clustered (id)
);
print 'table [dbo].ShipTemplateBlueprints created.'

go

-- alter table [ShipTemplate] add  [population] bigint default 0
-- alter table [ShipTemplate] add  shipHullsImage int not null default 1 references	[dbo].ShipHullsImages (id) on update NO ACTION on delete NO ACTION
create TABLE [dbo].[ShipTemplate]  (
	id int identity (1,1) ,
	userId int not null 
		references	[dbo].Users (id) on update cascade on delete cascade,
	shipHullId tinyInt not null 
		references	[dbo].ShipHulls (id) on update cascade on delete cascade,
	name varchar(63) NOT NULL DEFAULT 'Fregatte',  --default will be set by hull, name should be changeable by player
	gif varchar(63) NOT NULL DEFAULT 'schiffklein.gif',  -- should be set by hull, a list of interchangeable grphics shoul be given...
	
	--statistics
	energy int  default 5, -- will change dynamically during template-design
	crew int default 5,
	
	scanRange SMALLINT,
	    
    attack int,
    defense int,
    
    hitpoints int,
    damagereduction SMALLINT default 0,
    
    cargoroom SMALLINT  default 0,
	fuelroom SMALLINT  default 0,
	
    systemMovesPerTurn int,
    galaxyMovesPerTurn int,

    systemMovesMax int,
    galaxyMovesMax int,

    isColonizer int,
    [population] bigint default 0,
    
    constructionDuration int, 
    constructable bit default 0,
    amountBuilt int default 0,
    obsolete bit default 0,
    shipHullsImage int not null default 1 
		references	[dbo].ShipHullsImages (id) on update no action on delete no action,
	constraint ShipTemplate_primary primary key clustered (id)
);

create index ShipTemplate_userIndex ON ShipTemplate(userId);
print 'table [dbo].ShipTemplate created.'

go
go
CREATE TABLE [dbo].[ShipTemplateModulePositions]  (		
	shipTemplateId int NOT NULL
		references [dbo].[ShipTemplate] (id) on update cascade on delete cascade,
	posX TINYINT NOT NULL,
	posY TINYINT NOT NULL,			
	moduleId smallint not null
		references dbo.modules (id) on update cascade on delete cascade,
	constraint ShipTemplatesMP_primary primary key clustered (shipTemplateId,posX,posY)		
);
print 'table [ShipTempleteModulePositions] created.'


go
CREATE TABLE [dbo].[ShipTemplateCosts]  (		
	shipTemplateId INT NOT NULL
		references [dbo].ShipTemplate (id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods] (id) on update cascade on delete cascade,
	amount SMALLINT NOT NULL DEFAULT 0,		
	constraint ShipTemplateCosts_primary primary key clustered (goodsId,shipTemplateId)		
);
print 'table [ShipTemplateCosts] created.'
go



print ''
print '--- user data ---'
/* ---------------------------------------------------
Schiffsliste
herkunft ist doppelt belegt (und nicht hier drin). einmal für den Sektorein- bzw. ausflug, zum anderen bei der Schiffserstellung :(
--------------------------------------------------- */ 
CREATE TABLE [dbo].[Ships]  (
	id INT identity (1000,1),		--ToDo : 1000 is a reaaly bad workaround, because ships and colonies will sometimes (for example during trading) be stored in the same array as spaceobjects...
	userId int NOT NULL,  --delete user will also result in delete template, this will delete this schip
	--	references [dbo].[Users](id) on update cascade on delete cascade,	
	[name] nvarchar(63) DEFAULT 'Noname' NOT NULL,
	position geometry NOT NULL,
	systemX TINYINT,
	systemY TINYINT,
	hitpoints SMALLINT DEFAULT 100 NOT NULL,
	damageReduction tinyInt not null default 0,
	attack SMALLINT DEFAULT '2' NOT NULL,
	verteidigung SMALLINT DEFAULT '1' NOT NULL,
	scanRange TINYINT DEFAULT '3' NOT NULL,
	scanBox geometry,
	max_hyper TINYINT NOT NULL DEFAULT '4',
	max_impuls TINYINT NOT NULL DEFAULT '12',
	rest_hyper TINYINT NOT NULL DEFAULT '4',
	rest_impuls TINYINT NOT NULL DEFAULT '12',
	colonizer BIT NOT NULL DEFAULT 0,
	heimat BIT DEFAULT 0,
	hullId TINYINT NOT NULL DEFAULT '1',
--		references bpHull(id) on update no action on delete no action,			
	systemId INT DEFAULT Null
		references [dbo].[StarMap](id) on update cascade on delete cascade,
	templateId INT not null 
		references	[dbo].ShipTemplate (id) on update cascade on delete cascade,
	objectId int NOT NULL default 400, --one of the objects which are allowed by the table [ShipHullsImages]
	constraint ships_primary primary key clustered (id)
);
create nonclustered index ShipsIdKey on [dbo].[Ships](userId);
-- drop  INDEX [Ships_position]  ON [dbo].[Ships]

go

CREATE TABLE [dbo].[ShipsDirection]  (
	shipId INT references dbo.Ships on update cascade on delete cascade,
	moveCounter int not null default 0,
	moveDirection tinyint not null default 0
);

go
create clustered index [ShipsDirection_primary] on [ShipsDirection] (shipId,moveDirection)
go
CREATE TRIGGER TRIGGER_ShipDirection ON dbo.[ShipsDirection]
INSTEAD OF INSERT
AS
BEGIN
	update [ShipsDirection] set moveCounter = [ShipsDirection].moveCounter +1
	from [ShipsDirection] 
	inner join inserted
		on inserted.shipId = [ShipsDirection].shipId;
		
	insert into [ShipsDirection] select shipId, 0 , moveDirection from inserted;
END
--drop trigger TRIGGER_ShipMoved
go
CREATE TRIGGER TRIGGER_ShipMoved ON dbo.[Ships]
AFTER Update
AS
BEGIN	
		
	with movedShips as
	(
		select inserted.id ,inserted.scanBox, inserted.userId
		from  inserted
		inner join deleted
			on inserted.id = deleted.id
		where inserted.position.STX != deleted.position.STX
			or 	inserted.position.STY != deleted.position.STY
	),
	currentlyScannedStars as
	(
		select distinct
			starMap.id as starId,
			shipWhichScans.userId,
			cast(starMap.position.STX as int) as xpos,
			cast(starMap.position.STY as int) as ypos,
			starMap.objectId as [type],
			objectDesc.objectimageUrl as  gif,
			starMap.systemname as name,
			starMap.size
		from movedShips  as shipWhichScans		
		inner join dbo.StarMap as starMap
			on shipWhichScans.scanBox.STContains(starMap.position) = 1
		inner join dbo.ObjectDescription as objectDesc
			on objectDesc.id = starMap.objectId		
				
	)
	insert into [UserStarMap]
	select distinct
		currentlyScannedStars.userId, currentlyScannedStars.starId
	from currentlyScannedStars
	left join [UserStarMap] as alreadyInserted
		on alreadyInserted.userId = currentlyScannedStars.userId
		and alreadyInserted.starId = currentlyScannedStars.starId
	where alreadyInserted.starId is null
	
	OPTION (FORCE ORDER) -- is needed due to a bug. the joins in the currentlyScannedStars - statements are executed in the wrong order (but only when executed inside of the trigger), thus leading to wrong index use). 
	
END
go

go
--drop TRIGGER TRIGGER_ShipCreated
go
CREATE TRIGGER TRIGGER_ShipCreated ON dbo.[Ships]
AFTER Insert
AS
BEGIN	
		
	insert into dbo.shipModules
	select 
		inserted.id,
		ShipTemplateModulePositions.moduleId,
		ShipTemplateModulePositions.posX,
		ShipTemplateModulePositions.posY,
		20,
		1
	from inserted
	inner join dbo.ShipTemplateModulePositions
	on  ShipTemplateModulePositions.shipTemplateId = inserted.templateId
			
END
go



CREATE TABLE [dbo].[shipStock](	
	shipId Int NOT NULL
		references [dbo].[Ships](id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods](id) on update no action on delete no action,
	amount SMALLINT NOT NULL DEFAULT 0,
	constraint shipStock_primary primary key clustered (shipId,goodsId)
);
print 'table [dbo].[shipStock] created.'

go
CREATE TABLE [dbo].[shipModules](	
	shipId Int NOT NULL
		references [dbo].[Ships](id) on update cascade on delete cascade,
	moduleId SMALLINT NOT NULL
		references [dbo].[Modules](id) on update no action on delete no action,
	posX TINYINT NOT NULL,
	posY TINYINT NOT NULL,		
	hitpoints SMALLINT not null default 10,
	active	bit not null default 1,	
	constraint shipModules_primary primary key clustered (shipId,posX,posY)
);
print 'table [dbo].[shipModules] created.'
go

go
/*
insert into [shipModules] 
select 
	Ships.id, ShipTemplateModulePositions.moduleId,
	ShipTemplateModulePositions.posX, ShipTemplateModulePositions.posY,
	10,1
from dbo.ShipTemplateModulePositions
inner join dbo.Ships on Ships.templateId = ShipTemplateModulePositions.shipTemplateId
*/
go

go

CREATE TABLE  [dbo].TradeOffers
(
	id INT UNIQUE identity (1,1),		 
	commNodeId int 	not null 
		references [dbo].CommunicationNode (id) on delete cascade,
	spaceObjectId Int NOT NULL,-- CHECK ((spaceObjectType = 0 and (select top(1) shipId from Ships where Ships.id = spaceObjectId) = 1) or spaceObjectType = 1) ,
	spaceObjectType tinyint not null default 0, --0 ship, 1 colony
	constraint TradeOffers_primary primary key clustered ([id])
	
);

go
create index TradeOfferShips ON TradeOffers(spaceObjectId);
go
print 'table [TradeOffers] created.'



go

CREATE TABLE  [dbo].TradeOfferDetails
(	
	tradeOffersId int 	not null 
		references [dbo].TradeOffers (id) on delete cascade,	
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods](id) on update no action on delete no action,
	amount 		Int NOT NULL CHECK (amount >= 0),
	offer bit not null default 1	--1 offered, 0 requested
);
go
create clustered index TradeOfferDetails_pri ON TradeOfferDetails(tradeOffersId,goodsId);
go
print 'table [TradeOfferDetails created.'
go

go


/* ---------------------------------------------------
Kolonientabelle
--------------------------------------------------- */ 
CREATE TABLE [dbo].[Colonies]  (
	id INT NOT NULL UNIQUE identity(1,1),		
	userId int NOT NULL
		references users(id) on update cascade on delete cascade,	
	[name] character varying(63) DEFAULT 'Colony' NOT NULL,		
	storage SMALLINT DEFAULT 0 NOT NULL,
	scanRange TINYINT DEFAULT 2 NOT NULL,
	scanBox geometry,		
	starId INT NOT NULL
		references [dbo].[StarMap](id) on update no action on delete no action,
	planetId INT  NOT NULL
		references [dbo].[SolarSystemInstances](id) on update no action on delete no action,
	shipInConstruction int,
	constructionDuration int not null default 0,	
	[population] bigint not null default 1000000000,
	[construction] int not null default 0	,
	turnsOfRioting smallInt not null default 0,
	constraint colonies_primary primary  key clustered (id)		
);
create index colonies_userIndex ON colonies(userId);
create index colonies_starIndex ON colonies(starId);

print 'table [dbo].[colonies] created.'
go

CREATE TRIGGER TRIGGER_CreatePlanetSurface ON dbo.Colonies
AFTER Insert
AS
BEGIN	

		
	insert into [PlanetSurface]		
	select 	
		(select inserted.[planetId] from inserted) as planetId,
		defaultMap.X,
		defaultMap.Y,
		defaultMap.surfaceObjectId,
		null as surfaceBuildingId
		--case when defaultMap.X = 3 and defaultMap.Y = 2 then 1 else 
		-- null end as surfaceBuildingId
		from dbo.surfaceDefaultMap as defaultMap
		where defaultMap.id = ((select inserted.[planetId] from inserted) % 15) + 1
			
END
go

--can only be created after the colonies...
create view TradeOffersWithUsers as
select [TradeOffers].*,
	ISNULL(Ships.userId, Colonies.userId) as userId   
FROM [dbo].[TradeOffers]
left join dbo.Ships
	on	TradeOffers.spaceObjectType = 0
	and TradeOffers.spaceObjectId = Ships.id
left join dbo.Colonies	
	on	TradeOffers.spaceObjectType = 1
	and TradeOffers.spaceObjectId = Colonies.id
go
--select * from TradeOffersWithUsers 


CREATE TABLE [dbo].[ColonyBuildings](	
	id INT NOT NULL UNIQUE identity(1,1),		
	colonyId Int NOT NULL
		references [dbo].[Colonies](id) on update cascade on delete cascade,
	planetSurfaceId bigint NOT NULL
		references [dbo].[PlanetSurface](id) on update cascade on delete cascade,
	userId int not null 
		references users(id) on update no action on delete no action,	
	buildingId smallint not null
		references [dbo].Buildings(id) on update cascade on delete cascade,
	isActive	bit not null default 1,
	underConstruction 	bit not null default 0,
	remainingHitpoint int not null default 10,
	constraint colonyBuildings_primary primary key nonclustered (id)
);
print 'table [dbo].[colonyStock] created.'
go
create clustered index colonyBuildings_Cluster ON [ColonyBuildings](userId);
go

CREATE TABLE [dbo].[colonyStock](	
	colonyId Int NOT NULL
		references [dbo].[Colonies](id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods](id) on update no action on delete no action,
	amount SMALLINT NOT NULL DEFAULT 0,
	constraint colonyStock_primary primary key clustered (colonyId,goodsId)
);
print 'table [dbo].[colonyStock] created.'
go

go
--drop table [dbo].[ColoniesBuildQueue]
CREATE TABLE [dbo].[ColoniesBuildQueue]
(
	id INT NOT NULL UNIQUE identity(1,1),
	colonyId int NOT NULL
		references Colonies(id) on update cascade on delete cascade,
	orderNo int not null,
	buildType int not null,
	buildId int not null,
	targetAmount int not null default 1,
	productionNeededPerUnit int not null default 10,
	productionInvested int not null default 0,
	multiTurn bit not null default 0, --menas that construction points can be saved over multiple turns
	constraint ColoniesBuildQueue_primary primary key nonclustered (colonyId,orderNo)	
)
print 'table [dbo].[ColoniesBuildQueue] created.'
go
create clustered index ColoniesBuildQueue_Cluster ON [ColoniesBuildQueue](id);
go

go
CREATE TABLE  [dbo].[UserColonyMap]
(
	userId INT NOT NULL
		references [dbo].[Users] (id) , 	--kein cascade nötig (und möglich) - wenn ein user gelöscht wird, werden auch alle seine Kolonien gelöscht - ergo werden dann sowieso alle Daten hier gelöscht...		
	colonyId INT NOT NULL
		references [dbo].[Colonies] (id) on update cascade on delete cascade,
	constraint UserColonyMap_primary primary key clustered (userId,colonyId)
);
go



/* ---------------------------------------------------
Nachrichtentabelle
-- wer wen kennt
-- sender id ist immer niedriger als addresse id
-- bestehende relation zwischen sender und addressee
--------------------------------------------------- */ 
go

CREATE TABLE [dbo].UserContacts  (
sender		int 
	references [Users](id) on update cascade on delete cascade,		
addressee	int	,
currentRelation tinyint not null default 1 references [UserRelations](relationId) on update cascade on delete no action 
);
create clustered index UserContacts_UNIQUE ON UserContacts(sender,addressee);
print 'table [dbo].[UserContacts] created.'


/* ---------------------------------------------------
Nachrichtentabelle
-- gewünschte Relation zwischen sender und addresse
--------------------------------------------------- */ 
--drop table [UserTargetRelations]
go
CREATE TABLE [dbo].[UserTargetRelations]  (
sender		int,
senderType tinyint not null default 0,  --0 : Users , 1: Alliance , 2 : Meta
addressee	int	,
addresseeType tinyint not null default 0,  --0 : Users , 1: Alliance , 2 : Meta
targetRelation tinyint default null references [UserRelations](relationId) on update cascade on delete no action,	 
);
create clustered index UserTargetRelations_UNIQUE ON [UserTargetRelations](sender,addressee);
print 'table [dbo].[UserTargetRelations] created.'

---

go
--standard fills this table with noRights for Enemies
CREATE TABLE [dbo].CommNodeDefaultRights (	
	commNodeId int 	not null 
		references [dbo].CommunicationNode (id) on delete cascade,	
	targetRelation tinyint default null 
		references [UserRelations](relationId) on update cascade on delete no action,	 	
	readAccess bit not null default 1,   -- 0 inactiv, 1 activ
	writeAccess bit not null default 1,   -- 0 inactiv, 1 activ
	constraint CommNodeDefaultRights_primary primary key clustered (commNodeId,targetRelation)
	
);
print 'table [CommNodeDefaultRights] created.'
go
create nonclustered index CommNodeDefaultRights_bycommNodeId ON CommNodeDefaultRights(commNodeId);
go



--
go
CREATE TRIGGER TRIGGER_Users_Delete_FKs ON dbo.[Users]
AFTER DELETE
AS
BEGIN	
		
	DELETE FROM UserContacts 
		FROM UserContacts
		INNER JOIN deleted on UserContacts.addressee = deleted.id	or UserContacts.sender = deleted.id
	
END
go
print 'trigger [dbo].[TRIGGER_Users_Delete_FKs] created.'
go

CREATE TRIGGER TRIGGER_Alliances_Delete_FKs ON dbo.[Alliances]
AFTER DELETE
AS
BEGIN	
		
	DELETE FROM [AllianceMembers]
		FROM [AllianceMembers]
		INNER JOIN deleted on ([AllianceMembers].allianceId = deleted.id)	
	
	--[AllianceInvites]
	DELETE FROM AllianceInvites
		FROM AllianceInvites
		INNER JOIN deleted on (AllianceInvites.allianceId = deleted.id)	
	
END
go
print 'trigger [dbo].[TRIGGER_Users_Delete_FKs] created.'
go

--ALTER TABLE [MessageHeads] ADD CONSTRAINT DF_DT_MessageHeads DEFAULT GETDATE() FOR sendingDate
CREATE TABLE [dbo].[MessageHeads]  (
	id INT NOT NULL UNIQUE identity(1,1),		
	sender int 
		references users(id) on update cascade on delete SET NULL,
	addressee int NOT NULL,			
	[headline] nvarchar(127) DEFAULT 'Headline' NOT NULL,		
	[read] bit DEFAULT 0 NOT NULL,			
	messageType smallInt not null default 1,  -- 10 Allgemein , 20 Produktion ,  30 Handel , 40 Diplomatie , 50 Kampf 
	sendingDate datetime not null default GETDATE()
	constraint MessageHeads_primary primary key (id)		
);
create index MessageHeads_sender ON [MessageHeads](sender);
create index MessageHeads_addressee ON [MessageHeads](addressee);
print 'table [dbo].[MessageHeads] created.'
go

CREATE TABLE [dbo].[MessageBody]  (
	headerId INT NOT NULL UNIQUE 
		references [MessageHeads](id) on update cascade on delete cascade,		
	[message] nvarchar (4000) DEFAULT 'message' NOT NULL,				
	constraint MessageBody_primary primary key clustered (headerId)		
);
print 'table [dbo].[MessageBody] created.'




go
/*
	eventType:
	0	new turn
	1	message
	2	trade accepted
	3   colony buildings deactivated during turnSummary
*/
CREATE TABLE [dbo].[ServerEvents]
(
id int identity(1,1) NOT NULL,
userId int 
		references users(id) on update cascade on delete cascade,
eventType int ,
objectId int,
int1 int NULL,
int2 int NULL,
int3 int NULL,
constraint [ServerEvents_Primary] primary key clustered (id)
)
go
create nonclustered index ServerEventsPerUser on [dbo].[ServerEvents](id,userId);
go
print 'table [dbo].[ServerEvents] created.'
go



CREATE TABLE [dbo].[numbers](
	[number] [int] NOT NULL
) ON [PRIMARY]
go


	declare @t table (number int) 
insert into @t  
    select 0 
    union all 
    select 1 
    union all 
    select 2 
    union all 
    select 3 
    union all 
    select 4 
    union all 
    select 5 
    union all 
    select 6 
    union all 
    select 7 
    union all 
    select 8 
    union all 
    select 9 

insert into numbers 
    select * from 
    (
    select 
        t1.number + t2.number*10 + t3.number*100 +  
        t4.number*1000 + t5.number*10000 + t6.number*100000  as x
    from 
        @t as t1,  
        @t as t2, 
        @t as t3, 
        @t as t4, 
        @t as t5, 
        @t as t6
       ) as  t1
       order by x
       
go
print 'table [dbo].numbers created and filled.'       
go
create clustered index numbers_index on [dbo].[numbers]([number]);
go

go
CREATE TABLE [dbo].[greekAlphabet](
id int identity(1,1) NOT NULL,
greekCharacter  nvarchar(31)
)
go
create clustered index greekAlphabet_index on [dbo].[greekAlphabet](id);
go
print 'table [dbo].[greekAlphabet] created.'
go

go
CREATE TABLE [dbo].[starnamesBlueprint](
	id int identity(1,1) NOT NULL,
	[name]  nvarchar(63),
	postNumber int NULL
)
go
create clustered index starnamesBlueprint_index on [dbo].[starnamesBlueprint](id);
go
print 'table [dbo].[starnamesBlueprint] created.'
go

CREATE TABLE [dbo].[starnamesCombinations](
starnameId int NOT NULL,
greekAlphabetId int NOT NULL
)
go
create clustered index starnamesCombinations_index on [dbo].[starnamesCombinations](starnameId,greekAlphabetId);
go
print 'table [dbo].[starnamesCombinations] created.'
go



create view [dbo].[possibleStarNames] as 
(
	select 
		allNames.*,
		dbo.randomFunc(1,1000000) as randomRanking
	from 
	(	
	select 	
		greekNames.newStarName as name
	from (
			select 		
			nameBP.* ,
			gA.id as greekId,
			gA.greekCharacter,
			gA.greekCharacter + ' ' + nameBP.name as newStarName						
		from dbo.starnamesBlueprint as nameBP
		cross apply greekAlphabet as gA	
		) as greekNames
	union all 
	select
		namesCounted.name + ' ' + cast(randV as nvarchar(5)) as name
	from (
			select 		
			nameBP.*,
			dbo.randomFunc(999,101) as randV										
		from dbo.starnamesBlueprint as nameBP
		inner join numbers	on numbers.number < 1000	
		) as  namesCounted
	) as allNames	
	left join StarMap 
		on StarMap.systemname = allNames.name
	where 	StarMap.id is null
	
	)
GO

--
GO


go
CREATE TABLE [dbo].[resultMessages]
(
resultId int NOT NULL,
resultText nvarchar(63) NOT NULL,
constraint [resultMessages_Primary] primary key clustered (resultId)
)
go
print 'table [dbo].[resultMessages] created.'
go


create view [dbo].[StarNames] as 
(	
	SELECT *
	from (
	SELECT 
		  [name]      
		  ,numbers.number
		  ,name + ' ' + cast(numbers.number as nvarchar(5)) as fullName
		  ,dbo.randomFunc(1,1000000) as randomRanking
	FROM [dbo].[starnamesBlueprint]
	inner join numbers
	on numbers.number < 1000 and numbers.number > 100
	) as starNames	
)
go



CREATE SPATIAL INDEX [StarMap_position]  
   ON [dbo].[StarMap]([position])
   USING GEOMETRY_GRID
   --WITH ( BOUNDING_BOX = ( -10000, -10000, 10000, 10000 ) );
   WITH ( 
   BOUNDING_BOX = ( 4000, 4000, 6000, 6000 ),
   GRIDS =(LEVEL_1 =   HIGH,LEVEL_2 = HIGH,LEVEL_3 = HIGH,LEVEL_4 = HIGH),  
   CELLS_PER_OBJECT = 64, PAD_INDEX  = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF,   ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]

print 'table [dbo].[StarMap] created.'
go
ALTER INDEX [StarMap_position] ON [dbo].[StarMap]
REBUILD;
go

CREATE SPATIAL INDEX [Ships_position]  
   ON [dbo].[Ships]([position])
   USING GEOMETRY_GRID
   --WITH ( BOUNDING_BOX = ( -10000, -10000, 10000, 10000 ) );
   WITH ( 
   BOUNDING_BOX = ( 4500, 4500, 5500, 5500 ),
   GRIDS =(LEVEL_1 =   HIGH,LEVEL_2 = HIGH,LEVEL_3 = HIGH,LEVEL_4 = HIGH),  
   CELLS_PER_OBJECT = 64, PAD_INDEX  = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF,   ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
print 'table [dbo].[Ships] created.'
go
ALTER INDEX [Ships_position] ON [dbo].[Ships]
REBUILD;
go

CREATE SPATIAL INDEX [Ships_ScanBox] 
   ON [dbo].[Ships](scanBox)
   USING GEOMETRY_GRID
   WITH ( BOUNDING_BOX = ( 4500, 4500, 5500, 5500 ) );
print 'table [dbo].[Ships] created.'
go
ALTER INDEX [Ships_ScanBox] ON [dbo].[Ships]
REBUILD;
go

CREATE SPATIAL INDEX [CommunicationNode_position] 
   ON [dbo].CommunicationNode([position])
   USING GEOMETRY_GRID
   WITH ( BOUNDING_BOX = ( -10000, -10000, 10000, 10000 ) );
   
 
 go
 
create function [dbo].[getLabel](	 @labelId int, @userId int )
returns NVARCHAR(MAX)
as
begin	
	/*
	select [dbo].[getLabel](312,3)
	*/

	return (select 
		ISNULL( Labels.label, LabelsBase.value) as label
	from dbo.LabelsBase
	left join dbo.Users
		on Users.id = @userId
	left join dbo.Labels
		on	Labels.id = @labelId
		and Labels.languageId = Users.[language]
	where LabelsBase.id = @labelId	);
				
end
  

--gets an entry each time an action was done which may affect other users...
-- sendmail, shipMovement and so on...
--



--#region labels2



--#endregion


/*
SELECT a.index_id, name, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats (DB_ID(N'demo'), OBJECT_ID(N'dbo.StarMap'), NULL, NULL, NULL) AS a
    JOIN sys.indexes AS b ON a.object_id = b.object_id AND a.index_id = b.index_id; 
      
    
ALTER INDEX ALL ON Production.Product
REBUILD WITH (FILLFACTOR = 80, SORT_IN_TEMPDB = ON,
              STATISTICS_NORECOMPUTE = ON);
                      
              EXEC sp_MSforeachtable 'DBCC DBREINDEX ("?", " ", 70)'
              ALTER INDEX [StarMap_position] ON [dbo].[StarMap]
REBUILD; 
*/