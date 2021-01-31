SET QUOTED_IDENTIFIER ON
go
print '02 initTables.sql'
go
--Msg 156, Level 15, State 1, Server EMPIRES-AKR\SQLEXPRESS, Procedure getLabel, Line 78
/* USER GENERATED DATA: */

IF EXISTS(SELECT * 
          FROM   sys.objects 
          WHERE  NAME = N'getLabel' 
                 AND type = N'FN') 
  BEGIN 
      drop function [dbo].[getLabel];

--Todo: each table should have its own "If Exists Drop" - Statement 
drop table TradeOfferDetails
drop table TradeOffers

drop table [dbo].[ChatLog]
drop table [dbo].[ServerEvents]

drop table [dbo].[MessageBody]
drop table [dbo].[MessageParticipants]
drop table [dbo].[MessageHeads]

drop TABLE [dbo].[RouteShips]
drop TABLE [dbo].[RouteStopActions] 
drop TABLE [dbo].[RouteElements] 
drop TABLE [dbo].[Routes]

drop TRIGGER TRIGGER_Alliances_Delete_FKs
drop TRIGGER TRIGGER_Users_Delete_FKs
drop table [dbo].[colonyStock]
drop table [dbo].[ColoniesBuildQueue]

	
drop table [dbo].[ColonyBuildings]
drop table [dbo].[Colonies]				-- Kolonien
drop table [dbo].[shipStock]
drop table [dbo].[ShipsDirection]
drop table [dbo].[shipModules]
drop table [dbo].[ShipRefit]
drop table [dbo].[ShipTranscension]
drop table [ShipTranscensionUsers]
drop table [dbo].[Ships]

drop table [ShipTemplateModulePositions]
drop table ShipTemplateCosts
drop table [ShipTemplate]

drop table [ShipHullsModulePositions]
drop table [dbo].[planetStock]

drop table dbo.[DiplomaticEntityState]
drop table dbo.[UserTargetRelations]
drop table [dbo].[UserContacts]

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
drop table [UsersHistory]
drop table [dbo].[Users]

drop table [PlanetTypes]
drop table [dbo].[PlanetSurface]

/*Game-Specific Data*/
drop TABLE [dbo].[ShipTemplateBlueprints]
drop table ShipHullsGain
drop table [ShipHullsCosts]
drop table [dbo].[ShipHullsImages]
drop table [dbo].[ShipHulls]

drop table [SpecializationResearches]
drop table [SpecializationGroups]


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

drop table [dbo].[numbers]


drop table [dbo].[ObjectWeaponModificators]
drop table dbo.ObjectImages
drop table [dbo].[ObjectOnMap]
drop TABLE [dbo].[surfaceDefaultMap]
drop table [dbo].[SurfaceImages]
drop table [dbo].[ObjectDescription]
drop table [dbo].[DamageTypes]

drop table [dbo].Labels
drop table [dbo].LabelsBase
drop table [dbo].Languages

drop table CombatRounds
drop table Combat

drop table dbo.ResearchQuestPrerequisites
drop table dbo.UserRelations

drop table dbo.GalacticEvents
print 'general data end'

drop table dbo.greekAlphabet
drop table dbo.resultMessages

drop table dbo.starnamesBlueprint
drop table dbo.starnamesCombinations

drop table [TurnEvaluation]

drop table game;
drop table [dbo].[defaultMap]
drop table [dbo].[Log]
print 'tables dropped'

drop function [dbo].[randomFunc]

END 
go

go





CREATE function [dbo].[randomFunc] ( @maxRandomValue int ,  @minRandomValue int) 
returns int
as
begin
	set @maxRandomValue = @maxRandomValue + 1;
	return (ABS(CAST(CAST((SELECT [NewId] FROM GetNewID) AS VARBINARY) AS int)) % (@maxRandomValue - @minRandomValue)) + @minRandomValue
end
GO





-- drop table [Log]
create TABLE [dbo].[Log]  (
	
	logText nvarchar(max) NOT NULL,
	comment nvarchar(200) NOT NULL default '',
	module int not null default 0,
	logDateTime datetime NOT NULL CONSTRAINT DF_Log_CreateDate_GETDATE DEFAULT GETDATE()
);
go
-- 
create TABLE [dbo].[TurnEvaluation](
	turnNumber int not null default 0,
	evaluationDuration int not null default 0,
	evaluationDate datetime NOT NULL DEFAULT GETDATE(),
	playerCount  int not null default 0,
	shipCount  bigint not null default 0,
	colonyCount  bigint not null default 0,
	tradesCount  bigint not null default 0
);
go


go
-- default map for planet surface
CREATE TABLE [dbo].[defaultMap](
	[X] [int] NULL,
	[Y] [int] NULL,
	[surfaceObjectId] [int] NULL
) ON [PRIMARY]
GO
create unique clustered index [defaultMap_index] ON [defaultMap]([X],[Y],[surfaceObjectId]);
go

--alter table [game] add colonyCount int not null default 0
CREATE TABLE [dbo].[game]			  (
	name nvarchar(63) NOT NULL,
	colonyCount int not null default 0
);
print 'table [game] created.'
go
create unique clustered index [game_index] ON [game](name);
go



-- Helper

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
/*alter table [Users] add aiId  int not null default 0,
	aiRelation  int not null default 1
*/
--alter table [Users] drop DF__Users__password1__3C00B29C
CREATE TABLE [dbo].[Users]			  (
	[id] int not null UNIQUE check ( id > -1 ),		
	username nvarchar(1000) DEFAULT '' NOT NULL,
	--password1 nvarchar(63) DEFAULT '' NOT NULL,	
	--email nvarchar(63),
	--created datetime,	
	--user_ip nvarchar(55),		-- creation IP
	activity bit DEFAULT 0,
	locked bit DEFAULT 0,		-- deleted?	
	--lastlogin TIMESTAMP,	--this is of course the row version... Needs to be renamed...
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
	constructionRatio decimal(3,2) not null default 1,
	industrieRatio decimal(3,2) not null default 1,
	foodRatio decimal(3,2) not null default 1,
	versionId bigint not null default 0, 
	popVicPoints  int not null default 0,
	researchVicPoints  int not null default 0,
	goodsVicPoints  int not null default 0,
	shipVicPoints  int not null default 0,
	overallVicPoints  int not null default 0,
	overallRank	int not null default 1000,
	player_ip nvarchar(55),		-- last used ip nneded for authentification after login from index,
	fogVersion int not null default 0,
	fogString nvarchar(max) DEFAULT '' NOT NULL,
    [description] nvarchar(4000) DEFAULT '' NOT NULL,
	aiId  int not null default 0,
	aiRelation  int not null default 1,
	lastReadGalactivEvent int not null default 0,
	[ProfileUrl] [nvarchar](300) NOT NULL DEFAULT (N'images/interface/defaultprofile.png'),
	showCombatPopup int default 1,
	showCombatFast int default 0,

	-- alter table [Users] add 	[ProfileUrl] [nvarchar](300) NOT NULL DEFAULT (N'images/interface/defaultprofile.png')
	--researchSpent int not null default 0,  -- redundant, can be calculated by summing all researches of that user
	constraint Users_primary primary key nonclustered (id)
);
print 'table [Users] created.'
go
create unique clustered index Users_index ON [Users]([id]);
go

CREATE TRIGGER TRIGGER_UserInsert ON dbo.[Users]
AFTER INSERT
AS
BEGIN	
	insert into dbo.UserQuests
	select inserted.id, 1, 0, 0
		from inserted;

	insert into dbo.UserResearch ([userId] ,[researchId] ,[isCompleted]  ,[investedResearchpoints] ,[researchPriority])
		select inserted.id, 1, 1, 3,0
		from inserted;
END
--create unique index LabelsBase_Unique ON LabelsBase(value);
go

--drop table [UsersHistory]
CREATE TABLE [dbo].[UsersHistory]			  (
	[userId] int not null,		
	turnId int not null,

	researchPoints int not null default 0,
	
	popVicPoints  int not null default 0,
	researchVicPoints  int not null default 0,
	goodsVicPoints  int not null default 0,
	shipVicPoints  int not null default 0,
	overallVicPoints  int not null default 0,
	overallRank	int not null default 1000	
);
print 'table [UsersHistory] created.'
go
create clustered index Users_index ON [UsersHistory](turnId ,[userId]);
go

/*

alter table [Alliances] add aId int 

update Alliances set aId = id



SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = '[Alliances]';
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE Constraint_name  = 'UQ__Colonies__3213E83E928A7311'
ALTER TABLE ColonyBuildings DROP CONSTRAINT UQ__Colonies__3213E83E928A7311;
alter table [Alliances]  drop column aId
alter table [Alliances] add id int  NOT NULL	default 0
update [Alliances] set id = aId

*/

CREATE   TABLE [dbo].[Alliances]			  (
	[id] int not null,		
	name nvarchar(1000) DEFAULT '' NOT NULL,
	[description] nvarchar(4000) DEFAULT '',
	passwrd	nvarchar(63)  NOT NULL DEFAULT '',		
	allianceOwner int references [dbo].[Users] (id) on update cascade on delete SET Default,		
	overallVicPoints  int not null default 0,
	overallRank	int not null default 1000,
	-- alter table [Alliances] add overallVicPoints	int not null default 0
	--researchSpent int not null default 0,  -- redundant, can be calculated by summing all researches of that user

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
	[id] int not null UNIQUE, 
	userId  int  --owner 
		references [dbo].[Users] (id) on delete set null,
	--position geometry NOT NULL,	
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
--drop table [dbo].[CommunicationNodeMessages]
CREATE TABLE [dbo].[CommunicationNodeMessages]  (
	id INT NOT NULL UNIQUE,
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


/*
alter table [Users]
add homeCoordY int
default 100 not null



  <moveShipsAsync>1</moveShipsAsync>
  <homeCoordX>100</homeCoordX>
  <homeCoordY>100</homeCoordY>
*/  


/* ---------------------------------------------------
Nach der initialisierung kommen in diesen Tabllen keine neuen Eintr�ge hinzu
--------------------------------------------------- */ 


-- alter table  [dbo].[Research]  add [hidden] [bit] NULL DEFAULT ((0))
-- update  [dbo].[Research] set baseCost = cost
print '--- Research data ---'
create TABLE [dbo].[Research] (
	id SMALLINT NOT NULL identity(1,1),	
	[name] nvarchar(55),
	objectimageUrl nvarchar(128) DEFAULT '',	
	description	nvarchar(1024) NOT NULL DEFAULT '',	
	cost smallint not null default 10,
	baseCost smallint not null default 10,
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update  NO ACTION on delete  NO ACTION,
	descriptionLabel int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update  NO ACTION on delete NO ACTION,
	researchType tinyint not null default 1,
	treeColumn 	tinyint not null default 1,
	treeRow tinyint not null default 1,
	[hidden] [bit] NULL DEFAULT ((0))
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
		
-- alter table [ObjectDescription] drop column damage
-- alter table [ObjectDescription] add versionNo int not null default 1
go
CREATE TABLE [dbo].[ObjectDescription] (
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectimageUrl nvarchar(128) DEFAULT '',
	versionNo int not null default 1,
--	moveCost	tinyint NOT NULL DEFAULT 1,
--	damage		tinyint	NOT NULL DEFAULT 0,
--	label int NOT NULL Default 1
--		references [dbo].LabelsBase (id) on update cascade on delete SET Default
	constraint ObjectDescription_primary primary key nonclustered (id)
);
print 'table [ObjectDescription] created.'
go
create unique clustered index ObjectDescription_index ON [ObjectDescription](id);
go	

/*
	Benefits that are created per Research -> is not mandatory for researches	
	alter  TABLE  [dbo].[ResearchGain] add [research] SMALLINT not null default 0
	alter  TABLE  [dbo].[ResearchGain] add [energy] SMALLINT not null default 0
	alter  TABLE  [dbo].[ResearchGain] add [housing] SMALLINT not null default 0
*/
CREATE TABLE  [dbo].[ResearchGain]
(
	researchId SMALLINT NOT NULL
		references [dbo].[Research] (id) on update cascade on delete cascade,
	[research] SMALLINT not null default 0,
	[energy] SMALLINT not null default 0,
	housing SMALLINT not null default 0,
	growth int not null default 0,
	construction int not null default 0,
	industrie int not null default 0,
	food  int not null default 0,
	colonyCount SMALLINT not null default 0,
	fleetCount SMALLINT not null default 0,
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
	id SMALLINT NOT NULL,	
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
	id SMALLINT NOT NULL ,	
	[X] [int] NULL,
	[Y] [int] NULL,
	[surfaceObjectId] [int] NULL
) ON [PRIMARY]
GO
create unique clustered index surfaceDefaultMap_index ON [surfaceDefaultMap](id,[X],[Y]);
create  nonclustered index surfaceDefaultMapId_index ON [surfaceDefaultMap](id);
go	
go


--Verteidigungsbonus, Einflugschaden? Schadensstyp? Einflugschadenwahrscheinlichkeit? Wahrscheinlichkeit reduzierbar durch Ausweichfaktor?	
--drop table [dbo].[ObjectOnMap]
--   alter table [dbo].[ObjectOnMap] add drawSize real not null default 1.0
--alter table [dbo].[ObjectOnMap] add label int NOT NULL Default 1
--		references [dbo].LabelsBase (id) on update no action on delete no action


CREATE TABLE [dbo].[ObjectOnMap] (
	id SMALLINT NOT NULL UNIQUE references [dbo].[ObjectDescription](id) on update cascade on delete cascade ,	
	moveCost	tinyint NOT NULL DEFAULT 1,
	damage		SMALLINT NOT NULL DEFAULT 0,
	damageType  SMALLINT references [dbo].[ObjectDescription](id) on update no action on delete no action  ,	
	damageProbability SMALLINT	NOT NULL DEFAULT 100,
	damageProbabilityReducableByShip bit NOT NULL DEFAULT 1,	
	defenseBonus tinyint	NOT NULL DEFAULT 0,
	fieldSize tinyint	NOT NULL DEFAULT 1,
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update cascade on delete SET Default
	--drawSize real not null default 1.0,

	---BackgroundObjectId  SMALLINT references [dbo].[ObjectDescription](id) on update no action on delete no action  ,	
	--BackgroundDrawSize tinyint, --	 DEFAULT 15, -- Background size forPlanet/Colony View
	--TilestartingAt tinyint , --DEFAULT 3,  --offset of the tiles on Planet/Colony View

	constraint ObjectonMap_primary primary key nonclustered (id)
);
print 'table [ObjectOnMap] created.'
go
create unique clustered index ObjectOnMap_index ON [ObjectOnMap](id);
go	





-- surfaceDefaultMap



















--drop table [ObjectImages]
-- alter table ObjectImages add surfaceDefaultMapId SMALLINT default null 
CREATE TABLE [dbo].[ObjectImages] (
	objectId SMALLINT NOT NULL references [dbo].[ObjectOnMap](id) on update cascade on delete cascade ,	
	imageId  SMALLINT NOT NULL UNIQUE references [dbo].[ObjectDescription](id) on update no action on delete no action ,		
	drawSize real not null default 1.0,

	BackgroundObjectId SMALLINT references [dbo].[ObjectDescription](id) on update no action on delete no action  ,	
	BackgroundDrawSize tinyint, --	 DEFAULT 15, -- Background size forPlanet/Colony View
	TilestartingAt tinyint , --DEFAULT 3,  --offset of the tiles on Planet/Colony View
	surfaceDefaultMapId SMALLINT default null ,		
	constraint ObjectImages_primary primary key nonclustered (objectId, imageId)
);
print 'table [ObjectOnMap] created.'
go
--create unique clustered index ObjectImages_index ON [ObjectImages](objectId);
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
-- alter  TABLE  [dbo].[Goods] add prodLevel tinyint not null default 1
CREATE TABLE [dbo].[Goods](
	id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectDescriptionId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade,
	goodsType smallint not null default 1,	--1 good, 2 module, 3 special
	--objektimage_url nvarchar(128) DEFAULT '',
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	prodLevel tinyint not null default 1,
	constraint bpGoods_primary primary key nonclustered (id)
);
print 'table [Goods] created.'
go
create unique clustered index Goodsindex ON [Goods](id);
go	
/*
alter table [dbo].[Buildings] drop COLUMN allowedMines int  not null default 0,
	allowedChemicals int  not null default 0,
	allowedFuel int  not null default 0

alter table [dbo].[Buildings] add allowedMines int  not null default 0,
	allowedChemicals int  not null default 0,
	allowedFuel int  not null default 0
	*/
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
	storage int not null default 0,
	researchModifier int not null default 0,
	assemblyModifier int not null default 0,
	energyModifier int not null default 0,
	housingModifier int not null default 0,
	foodModifier int not null default 0,
	productionModifier int not null default 0,
	growthModifier int not null default 0,
	allowedMines int  not null default 0,
	allowedChemicals int  not null default 0,
	allowedFuel int  not null default 0,
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

go	




-- alter table [dbo].[SurfaceTiles] add  borderId SMALLINT
--		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION
CREATE TABLE  [dbo].[SurfaceTiles]
(
		id SMALLINT NOT NULL UNIQUE,	
	[name] nvarchar(55),
	objectId SMALLINT NOT NULL
		references [dbo].[ObjectDescription](id) on update cascade on delete cascade,	
    label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	borderId SMALLINT,
	constraint Surface_primary primary key clustered (id)
);
go
--create unique clustered index SurfaceTiles_index ON [SurfaceTiles](id);
go	

print 'table [SurfaceTiles] created.'
go
/* ---------------------------------------------------
f�r jede Landschaft (101-106) erlaubte Gebaeudetypen (151 - )
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
	alter  TABLE  [dbo].[ModulesGain] add toHitRatio	int not null default 100
	alter  TABLE  [dbo].[ModulesGain] alter column [scanRange] tinyInt DEFAULT 0 NOT NULL
*/
CREATE TABLE  [dbo].[ModulesGain]
(
	modulesId SMALLINT NOT NULL
		references [dbo].Modules (id) on update cascade on delete cascade,
	crew int not null default 0,
	energy SMALLINT not null default 0,
	hitpoints SMALLINT not null default 0,
	damagereduction tinyInt not null default 0,
	damageoutput SMALLINT not null default 0, 
	cargoroom SMALLINT not null default 0,
	fuelroom SMALLINT not null default 0,
	inSpaceSpeed SMALLINT not null default 0,-- (moves oper turn), 
	inSystemSpeed SMALLINT not null default 0,-- (moves oper turn), 
	maxSpaceMoves Decimal(8,5) not null default 0,
	maxSystemMoves Decimal(8,5) not null default 0,
	scanRange  TINYINT DEFAULT 0 NOT NULL,
	special int not null default 0,	--Special like Colonization, asteroid mining	
	weaponType tinyint not null default 0,
	[population] bigint not null default 0,
	toHitRatio	int not null default 0
);
go
create clustered index ModulesGain_primary ON [ModulesGain](modulesId);
go
print 'table [ModulesGain] created.'


go
--drop table [SpecializationGroups]
print '--- [Specialization] data ---'
create TABLE [dbo].[SpecializationGroups] (
	[id] [int] NOT NULL,
	[name] [nvarchar](55) NULL,
	[picks] [int] NOT NULL DEFAULT ((1)),
	[label] [int] NOT NULL DEFAULT ((1)),
	[labelDescription] [int] NOT NULL DEFAULT ((1))
	constraint Specialization_primary primary key nonclustered (id)
);
print 'table [Specialization] created.'
go
create unique clustered index SpecializationGroup_index ON [SpecializationGroups](id);
go
ALTER TABLE [dbo].[SpecializationGroups]  WITH CHECK ADD FOREIGN KEY([label])
REFERENCES [dbo].[LabelsBase] ([id])
GO

ALTER TABLE [dbo].[SpecializationGroups]  WITH CHECK ADD FOREIGN KEY([labelDescription])
REFERENCES [dbo].[LabelsBase] ([id])
GO


-- drop table [dbo].[SpecializationResearches]
-- alter table [SpecializationResearches] add Module3 SMALLINT references [dbo].[Modules](id) on update  no action on delete no action
create TABLE [dbo].[SpecializationResearches] (
	SpecializationGroupId int NOT NULL Default 1
		references [dbo].[SpecializationGroups] (id) on update cascade on delete cascade,
	ResearchId SMALLINT NOT NULL Default 1
		references [dbo].[Research] (id) on update cascade on delete cascade,
	SecondaryResearchId SMALLINT 
		references [dbo].[Research] (id) on update no action on delete no action,
	Building1 SMALLINT references [dbo].[Buildings] (id)  on update cascade on delete cascade,
	Building2 SMALLINT references [dbo].[Buildings] (id)  on update no action on delete no action,
	Building3 SMALLINT references [dbo].[Buildings] (id)  on update no action on delete no action,
	Module1 SMALLINT references [dbo].[Modules](id)  on update no action on delete no action,
	Module2 SMALLINT references [dbo].[Modules](id)  on update no action on delete no action,
	Module3 SMALLINT references [dbo].[Modules](id)  on update no action on delete no action
);
print 'table [SpecializationResearches] created.'
go
create unique clustered index SpecializationResearches_index ON [SpecializationResearches](SpecializationGroupId,ResearchId);
go



/*
alter table [dbo].[Buildings] drop COLUMN allowedMines int  not null default 0,
	allowedChemicals int  not null default 0,
	allowedFuel int  not null default 0

alter table [PlanetTypes] add 
shipModuleId SMALLINT NOT NULL
		references [dbo].[Modules](id) on update no action on delete no action default 13
	*/
--drop table [PlanetTypes]
CREATE TABLE [dbo].[PlanetTypes]  (
	id SMALLINT NOT NULL UNIQUE,	
	name nvarchar(55),
	label int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	[description]	int NOT NULL Default 1
		references [dbo].LabelsBase (id) on update NO ACTION on delete NO ACTION,
	objectId SMALLINT NOT NULL
		references [ObjectDescription](id) on update cascade on delete cascade,
	researchRequired SMALLINT NOT NULL
		references [Research](id) on update no action on delete no action,
	shipModuleId SMALLINT NOT NULL
		references [dbo].[Modules](id) on update no action on delete no action ,
	colonyCenter  SMALLINT NOT NULL
		references [Buildings](id) on update no action on delete no action
	constraint PlanetTypes_primary primary key clustered (id)
);
go




/* ---------------------------------------------------
die Sternenkartenobjekte, hole die entsprechenden ID's aus der Sternenkarte
ToDo: Default 1 -> Funktion die ein Default-Wert berechnet...
--------------------------------------------------- */ 

/* ---------------------------------------------------
die verschiedenen Sternensysteme (k�nnen sich Ingame evt. wiederholen)
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
alter table [GalaxyMap] add winningTranscendenceConstruct int smallint not null default 1
--------------------------------------------------- */ 
create TABLE  [dbo].[GalaxyMap]
(
	id INT NOT NULL UNIQUE,			
	--position geometry NOT NULL,
	galaxyName nvarchar(63),					
	objectId SMALLINT NOT NULL DEFAULT 1,
	size smallint not null default 10000,	
	isDemo bit not null default 0,  -- is used by sql turn calculation to determine if the map is a demo
	colonyCount int not null default 0,
	transcendenceRequirement int not null default 0,
	gameState smallint not null default 1,   -- 0 : coming soon (with date) // 1: open for registration // 2: running // 3 : running and closed // 4: stopped-finished
	winningTranscendenceConstruct int,
	useSolarSystems bit not null default 1
	constraint GalaxyMap_primary primary key clustered (id)
);

go

CREATE TABLE  [dbo].[StarMap]
(
	[id] [int] NOT NULL,
	[systemname] [nvarchar](63) NULL,
	[objectId] [smallint] NOT NULL DEFAULT ((1)),
	[size] [smallint] NOT NULL DEFAULT ((20)),
	[startSystem] [tinyint] NOT NULL DEFAULT ((0)),
	[settled] [tinyint] NOT NULL DEFAULT ((0)),
	[ressourceId] [tinyint] NOT NULL DEFAULT ((0)),
	[positionY] [int] NOT NULL DEFAULT ((5000)),
	[positionX] [int] NOT NULL DEFAULT ((5000)),
	[startingRegion] [nvarchar](10) NULL,
	colonyId int, 
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
	colonyId int, 
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


/* ---------------------------------------------------
Kolonientabelle


alter table [PlanetSurface]
add PlanetSurfaceId bigint 

update PlanetSurface set PlanetSurfaceId = id

drop table [ServerTest01].[dbo].[UserColonyMap]
drop table [ServerTest01].[dbo].ColoniesBuildQueue

SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'Colonies';
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE Constraint_name  = 'FK__ColonyBui__plane__3791033A'
ALTER TABLE Colonies DROP CONSTRAINT UQ__Colonies__3213E83E928A7311;
alter table [PlanetSurface]  drop column id
alter table [PlanetSurface] add id bigint  NOT NULL	default 1
update PlanetSurface set id = PlanetSurfaceId

--------------------------------------------------- */ 


-- Planet Surface as terrainMap
CREATE TABLE [dbo].[PlanetSurface]  (
	id bigint not null ,	
	planetId INT NOT NULL,
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

---- alter table [ShipHullsGain] add  [speedFactor] decimal not null default 1
/*
alter table [ShipHullsGain] 
alter column speedFactor Decimal(4,2) NOT NULL 

	alter  TABLE  [dbo].[ShipHullsGain] alter column [damagereduction] TINYINT  DEFAULT 0 NOT NULL
*/
CREATE TABLE  [dbo].[ShipHullsGain]
(
	shipHullId TINYINT NOT NULL
		references [dbo].[ShipHulls] (id) on update cascade on delete cascade,
	crew int not null default 0,
	energy SMALLINT not null default 0,
	hitpoints SMALLINT not null default 0,
	damagereduction TINYINT not null default 0,
	damageoutput SMALLINT not null default 0, 
	cargoroom SMALLINT not null default 0,
	fuelroom SMALLINT not null default 0,
	inSpaceSpeed SMALLINT not null default 0,-- (moves per turn), 
	inSystemSpeed SMALLINT not null default 0,-- (moves per turn), 
	maxSpaceMoves decimal(8,5) not null default 0,
	maxSystemMoves decimal(8,5)  not null default 0,
	special int not null default 0,	--Special like Colonization, asteroid mining	
	scanRange tinyInt not null default 0,
	[population] bigint default 0 not null,
	speedFactor	decimal(4,2) not null default 1
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

-- alter table [ShipTemplate] add versionId bigint not null default 0, 
-- alter table [ShipTemplate] add  shipHullsImage int not null default 1 references	[dbo].ShipHullsImages (id) on update NO ACTION on delete NO ACTION
/*
alter table [ShipTemplate] 
alter column id int not null unique 
*/
create TABLE [dbo].[ShipTemplate]  (
	id int not null  ,
	userId int not null 
		references	[dbo].Users (id) on update cascade on delete cascade,
	shipHullId tinyInt not null 
		references	[dbo].ShipHulls (id) on update cascade on delete cascade,
	name varchar(63) NOT NULL DEFAULT 'Fregatte',  --default will be set by hull, name should be changeable by player
	gif varchar(63) NOT NULL DEFAULT 'schiffklein.gif',  -- should be set by hull, a list of interchangeable grphics shoul be given...
	
	--statistics
	energy int  default 5, -- will change dynamically during template-design
	crew int default 5,
	
	scanRange TINYINT DEFAULT '3' NOT NULL,
	    
    attack  SMALLINT default 0 NOT NULL,
    defense  SMALLINT default 0 NOT NULL,
    
    hitpoints  SMALLINT DEFAULT 100 NOT NULL,
    damagereduction tinyInt not null default 0,
    
    cargoroom SMALLINT  default 0,
	fuelroom SMALLINT  default 0,
	
    systemMovesPerTurn Decimal(8,5),
    galaxyMovesPerTurn Decimal(8,5),

    systemMovesMax Decimal(8,5),
    galaxyMovesMax Decimal(8,5),

    isColonizer int,
    [population] bigint default 0,
    
    constructionDuration int, 
    constructable bit default 0,
    amountBuilt int default 0,
    obsolete bit default 0,
    shipHullsImage int not null default 1 
		references	[dbo].ShipHullsImages (id) on update no action on delete no action,
	versionId bigint not null default 0, 
	constraint ShipTemplate_primary2 primary key clustered (id)
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
herkunft ist doppelt belegt (und nicht hier drin). einmal f�r den Sektorein- bzw. ausflug, zum anderen bei der Schiffserstellung :(alter table [Ships] 


alter table [Ships] add harvesting  TINYINT NOT NULL DEFAULT 0




	movementroute nvarchar(100)


add shipHullsImage int not null default 1 
		references	[dbo].ShipHullsImages (id) on update no action on delete no action
alter table [Ships] 
alter column energy SMALLINT  default 5
--------------------------------------------------- */ 
CREATE TABLE [dbo].[Ships]  (
	id int not null,		--ToDo : 1000 is a really bad workaround, because ships and colonies will sometimes (for example during trading) be stored in the same array as spaceobjects...
	--Todo: check if this is still wrong. I rather doubt it...
	userId int NOT NULL,  --delete user will also result in delete template, this will delete this ship
	--	references [dbo].[Users](id) on update cascade on delete cascade,	
	[name] nvarchar(63) DEFAULT 'Noname' NOT NULL,
	
	--equivalent to ship template:
	energy SMALLINT  default 5, -- will change dynamically during template-design
	crew int default 5,	
	scanRange TINYINT DEFAULT '3' NOT NULL,
	attack SMALLINT DEFAULT '2' NOT NULL,
	defense SMALLINT DEFAULT '1' NOT NULL,
	hitpoints SMALLINT DEFAULT 100 NOT NULL,
	damageReduction tinyInt not null default 0,
	cargoroom SMALLINT  default 0,
	fuelroom SMALLINT  default 0,		
	max_hyper Decimal(8,5) NOT NULL DEFAULT 16,
	max_impuls Decimal(8,5) NOT NULL DEFAULT 48,
	hyper Decimal(8,5) NOT NULL DEFAULT 4,
	impuls Decimal(8,5) NOT NULL DEFAULT 12,

	colonizer BIT NOT NULL DEFAULT 0,
	[population] bigint default 0,    
	shipHullsImage int not null default 1 
		references	[dbo].ShipHullsImages (id) on update no action on delete no action,
	hullId TINYINT NOT NULL DEFAULT '1',
--		references bpHull(id) on update no action on delete no action,	
	
	systemX TINYINT,
	systemY TINYINT,
	spaceX  INT not null DEFAULT 0,
	spaceY  INT not null DEFAULT 0,
	systemId INT DEFAULT Null
		references [dbo].[StarMap](id) on update cascade on delete cascade,
	templateId INT not null 
		references	[dbo].ShipTemplate (id) on update cascade on delete cascade,
	refitCounter TINYINT NOT NULL DEFAULT 0,
	noMovementCounter TINYINT NOT NULL DEFAULT 0,
	objectId int NOT NULL default 400, --one of the objects which are allowed by the table [ShipHullsImages]
	versionId bigint not null default 0, 
	shipStockVersionId bigint not null default 0, 
	shipModulesVersionId bigint not null default 0, 
	experience int not null default 0,

	fleetId int,
	sentry BIT NOT NULL DEFAULT 0,
	targetX INT not null DEFAULT 0,
	targetY INT not null DEFAULT 0,
	movementroute nvarchar(100),
	harvesting  TINYINT NOT NULL DEFAULT 0,
	constraint ships_primary primary key clustered (id)
);
create nonclustered index ShipsIdKey on [dbo].[Ships](userId);
-- drop  INDEX [Ships_position]  ON [dbo].[Ships]

go
go
CREATE TRIGGER TRIGGER_Ships_Delete_FKs ON dbo.Ships
AFTER DELETE
AS
BEGIN	
		
	DELETE FROM shipModules 
		FROM shipModules
		INNER JOIN deleted on shipModules.shipId = deleted.id
	
END
go
print 'trigger [dbo].[TRIGGER_Ships_Delete_FKs] created.'
go


--1 to 1 to ships, always joined on ships to increment the ships versionId after the  update
-- insert into [ShipTranscension] select 1738 , 1,  GETDATE(), 100
--alter table [ShipTranscension]  add finishedInTurn int 

CREATE TABLE [dbo].[ShipTranscension]  (
	shipId INT references dbo.Ships on update cascade on delete cascade,
	helperMinimumRelation tinyint default 1,
	constructionDate datetime not null default GETDATE(),
	ressourceCount int not null default 100,
	constructionTurn int not null default 1,
	finishedInTurn int,
	finishingNumber int
);

go

--1 to n  ships to userId, always joined on ships to increment the ships versionId after the  update
-- insert into [ShipTranscension] select 1738 , 1,  GETDATE(), 100
CREATE TABLE [dbo].[ShipTranscensionUsers]  (
	shipId INT references dbo.Ships on update cascade on delete cascade,
	userId INT not null default 0 references dbo.Users on update no action on delete no action,
	helpCount smallint not null
);
go

CREATE TABLE [dbo].[ShipRefit]  (
	shipId INT references dbo.Ships on update cascade on delete cascade,
	refitCounter int not null default 3
);

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
/*
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
*/
go
--drop TRIGGER TRIGGER_ShipCreated
go


CREATE TABLE [dbo].[shipStock](	
	shipId Int NOT NULL
		references [dbo].[Ships](id) on update cascade on delete cascade,
	goodsId SMALLINT NOT NULL
		references [dbo].[Goods](id) on update no action on delete no action,
	amount INT NOT NULL DEFAULT 0,
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

alter table [dbo].[Combat] add 
	attackerShield int not null default 0,
	defenderShield  int not null default 0
*/
go



CREATE TABLE [dbo].[Combat](
	[combatId] [int] NOT NULL,
	[attackerId] [int] NOT NULL,
	[defenderId] [int] NOT NULL,
	[attackerName] [nvarchar](63) NOT NULL,
	[defenderName] [nvarchar](63) NOT NULL,
	[attackerUserId] [int] NOT NULL,
	[defenderUserId] [int] NOT NULL,
	[starId] [int] NULL,
	[spaceX] [int] NOT NULL,
	[spaceY] [int] NOT NULL,
	[systemX] [int] NULL,
	[systemY] [int] NULL,
	[attackerDamageDealt] [int] NOT NULL,
	[defenderDamageDealt] [int] NOT NULL,
	[attackerHitPointsRemain] [int] NOT NULL,
	[defenderHitPointsRemain] [int] NOT NULL,
	[defenderHasRead] [bit] NOT NULL,
	[messageDT] [datetime] NOT NULL,
	attackerExperience int not null default 0,
	defenderExperience  int not null default 0,
	attackerShipHullId int not null default 0,
	defenderShipHullId  int not null default 0,
	attackerShipHullImageId int not null default 0,
	defenderShipHullImageId  int  not null default 0,
	attackerEvasion  int not null default 0,
	attackerMaxHitPoints int not null default 0,
	attackerStartHitpoint int not null default 0,
	defenderEvasion  int not null default 0,
	defenderMaxHitPoints int not null default 0,
	defenderStartHitpoint int not null default 0,
	attackerShield int not null default 0,
	defenderShield  int not null default 0
) ON [PRIMARY]
go

CREATE TABLE [dbo].[CombatRounds](
	[combatId] [int] NOT NULL,
	[roundNumber] [int] NOT NULL,
	[shotNumber] [int] NOT NULL,
	[side] [int] NOT NULL,
	[moduleId] [int] NOT NULL,
	[damage] [int] NOT NULL,
	[hitPropability] [real] NOT NULL,
	[isHit] [bit] NOT NULL
) ON [PRIMARY]

go

CREATE TABLE  [dbo].TradeOffers
(
	id INT UNIQUE,		 
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


alter table [Colonies] 
add versionId bigint not null default 1

update Colonies set colonyId = id

drop table [ServerTest01].[dbo].[UserColonyMap]
drop table [ServerTest01].[dbo].ColoniesBuildQueue

SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'Colonies';
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE Constraint_name  = 'UQ__Colonies__3213E83E928A7311'
ALTER TABLE Colonies DROP CONSTRAINT UQ__Colonies__3213E83E928A7311;
alter table [Colonies]  drop column [colonyId]
alter table [Colonies] add Influence int not null default 0
update Colonies set id = colonyId

DROP TRIGGER [dbo].[TRIGGER_CreatePlanetSurface]
--------------------------------------------------- */ 
CREATE TABLE [dbo].[Colonies]  (
	id INT NOT NULL,		
	userId int NOT NULL
		references users(id) on update cascade on delete cascade,	
	[name] character varying(63) DEFAULT 'Colony' NOT NULL,		
	storage INT DEFAULT 0 NOT NULL,
	scanRange TINYINT DEFAULT 2 NOT NULL,
	--scanBox geometry,		
	starId INT NOT NULL
		references [dbo].[StarMap](id) on update no action on delete no action,
	planetId INT  NOT NULL,
	shipInConstruction int,
	constructionDuration int not null default 0,	
	[population] bigint not null default 1000000000,
	[construction] int not null default 0	,
	turnsOfRioting smallInt not null default 0,
	versionId bigint not null default 1,
	[TurnsOfSiege] [smallint] NOT NULL DEFAULT ((10)),
	[besiegedBy] int not null default 0,	  --userId besieging
	Influence int not null default 0

	constraint colonies_primary primary  key clustered (id)		
);
create index colonies_userIndex ON colonies(userId);
create index colonies_starIndex ON colonies(starId);

print 'table [dbo].[colonies] created.'
go


/*


alter table [ColonyBuildings] add colonyBuildingId int 

update ColonyBuildings set colonyBuildingId = id



SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = '[ColonyBuildings]';
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE Constraint_name  = 'UQ__Colonies__3213E83E928A7311'
ALTER TABLE ColonyBuildings DROP CONSTRAINT UQ__Colonies__3213E83E928A7311;
alter table ColonyBuildings  drop column id
alter table ColonyBuildings add id int  NOT NULL	default 1
update ColonyBuildings set id = colonyBuildingId


*/
CREATE TABLE [dbo].[ColonyBuildings](	
	id INT NOT NULL,		
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
	amount INT NOT NULL DEFAULT 0,
	constraint colonyStock_primary primary key clustered (colonyId,goodsId)
);
print 'table [dbo].[colonyStock] created.'
go

go
--drop table [dbo].[ColoniesBuildQueue]
CREATE TABLE [dbo].[ColoniesBuildQueue]
(
	id INT NOT NULL UNIQUE identity(1,1),
	colonyId int NOT NULL		,
	orderNo int not null,
	buildType int not null,
	buildId int not null,
	targetAmount int not null default 1,
	productionNeededPerUnit int not null default 10,
	productionInvested int not null default 0,
	multiTurn bit not null default 0, --menas that construction points can be saved over multiple turns	
)
print 'table [dbo].[ColoniesBuildQueue] created.'
go
create clustered index ColoniesBuildQueue_Cluster ON [ColoniesBuildQueue](id);
go

/*
go
CREATE TABLE  [dbo].[UserColonyMap]
(
	userId INT NOT NULL
		references [dbo].[Users] (id) , 	--kein cascade n�tig (und m�glich) - wenn ein user gel�scht wird, werden auch alle seine Kolonien gel�scht - ergo werden dann sowieso alle Daten hier gel�scht...		
	colonyId INT NOT NULL
		references [dbo].[Colonies] (id) on update cascade on delete cascade,
	constraint UserColonyMap_primary primary key clustered (userId,colonyId)
);
go
*/


/* ---------------------------------------------------
Nachrichtentabelle
-- wer wen kennt
-- sender id ist immer niedriger als addresse id
-- bestehende relation zwischen sender und addressee
--------------------------------------------------- */ 
go

CREATE TABLE [dbo].[UserContacts]  (
sender		int not null 
	references [Users](id) on update cascade on delete cascade,		
addressee	int	not null ,
currentRelation tinyint not null default 1 references [UserRelations](relationId) on update cascade on delete no action 
);
create clustered index UserContacts_UNIQUE ON UserContacts(sender,addressee);
print 'table [dbo].[UserContacts] created.'
go

CREATE TABLE [dbo].[DiplomaticEntityState](
	[sender] int not null,
	[target] int not null,
	[relation] int not null
);
go

/* ---------------------------------------------------
Nachrichtentabelle
-- gew�nschte Relation zwischen sender und addresse
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



/*
[Routes]
route    trade  player  name
   1       1      123    unnamed

RouteElements
routeId	 stepId	  X    Y    Stop
	1		1	5131  5021   0
	1		2	5131  5022   0
	1		3	5132  5023   1


  RouteStopActions
  route  stopId   good   amount
    1       1      3        40
    1       1      4        40
	1       1      7       -100
*/
-- insert into Routes select 1,1,157,'FirstTradeRoute'
CREATE TABLE [dbo].[Routes]  (
	routeId INT NOT NULL UNIQUE,
	tradeRoute bit not null,
	userid int references users(id) on update cascade on delete cascade,
	[name] nvarchar(255)
	constraint Routes_primary primary key (routeId)		
);

print 'table [dbo].[Routes] created.'
go

-- insert into RouteElements select 1,1,5005,5004,null, null, 1 union all select  1,2,5005,5005,null, null, 0 union all select  1,3,5005,5006,null, null, 2
CREATE TABLE [dbo].[RouteElements]  (
	routeId INT NOT NULL references [Routes](routeId) on update cascade on delete cascade,
	stepId smallint not null,
	starX int not null,
	starY int not null,
	systemX int,
	systemY int,
	stopNo INT not null

	constraint RouteElements_primary primary key (routeId, stepId)		
);

print 'table [dbo].[RouteElements] created.'
go

--- insert into RouteStopActions select 1,1,10,80 union all select  1,2,10,-80
CREATE TABLE [dbo].[RouteStopActions]  (
	routeId INT NOT NULL references [Routes](routeId) on update cascade on delete cascade,
	stepId smallint not null,
	goodId smallint not null references [Goods](id) on update cascade on delete cascade,
	amount int not null
);
go
create clustered index RouteStopActions_Index ON [RouteStopActions](routeId,stepId );
go
print 'table [dbo].[RouteStopActions] created.'
go
--drop  TABLE [dbo].[RouteShips]
--   insert into RouteShips select 1, 66, null, null
CREATE TABLE [dbo].[RouteShips]  (
	routeId INT NOT NULL references [Routes](routeId) on update cascade on delete cascade,
	shipId int,
	FleetId int,
	stepId smallint
);
go
create clustered index RouteShips_Index ON RouteShips(routeId );
go
print 'table [dbo].[RouteShips] created.'
go

--RouteShips
--RouteId ShipId FleetId
go

--ALTER TABLE [MessageHeads] ADD CONSTRAINT DF_DT_MessageHeads DEFAULT GETDATE() FOR sendingDate
CREATE TABLE [dbo].[MessageHeads]  (
	id INT NOT NULL,		
	sender int 
		references users(id) on update cascade on delete SET NULL,		
	[headline] nvarchar(127) DEFAULT 'Headline' NOT NULL,				
	messageType smallInt not null default 1,  -- 10 Allgemein , 20 Produktion ,  30 Handel , 40 Diplomatie , 50 Kampf 
	sendingDate datetime not null default GETDATE()
	constraint MessageHeads_primary primary key (id)		
);
create index MessageHeads_sender ON [MessageHeads](sender);
print 'table [dbo].[MessageHeads] created.'
go

--drop table  [dbo].[MessageParticipants]
CREATE TABLE [dbo].[MessageParticipants]  (
		headerId INT NOT NULL 	references [MessageHeads](id) on update no action on delete cascade,
		participant INT NOT NULL references users(id) on update cascade on delete cascade,	
		[read] bit DEFAULT 0 NOT NULL
		
);
create index MessageParticipants_Head ON [MessageParticipants](headerId);
create index MessageParticipants_Participant ON [MessageParticipants](participant);
print 'table [dbo].[MessageParticipants] created.'
go
/*
insert into [MessageParticipants]
select id,sender,1 from dbo.MessageHeads;

insert into [MessageParticipants]
select id,addressee,[read] from dbo.MessageHeads;
*/
go

/*
ALTER TABLE [dbo].[MessageBody] DROP CONSTRAINT [FK__MessageBo__heade__69285ECE]
ALTER TABLE [dbo].[MessageBody] DROP CONSTRAINT [MessageBody_primary]
ALTER TABLE [dbo].[MessageBody] DROP CONSTRAINT [UQ__MessageB__C03165DAFAFC40F2]

ALTER TABLE [dbo].[MessageBody] ADD  CONSTRAINT [MessageBody_primary] PRIMARY KEY CLUSTERED 
(
	[headerId] ASC,
	messagePart ASC
)


ALTER TABLE [MessageBody] ADD 	messagePart int not null default 0
ALTER TABLE [MessageBody] ADD 	sender int references users(id) on update no action on delete SET NULL
ALTER TABLE [MessageBody] ADD 	sendingDate datetime not null default GETDATE()


update body set body.sender = head.sender, body.sendingDate = head.sendingDate
from [dbo].[MessageBody]  as body
inner join dbo.MessageHeads as head
on head.id = body.headerId
*/
go
--drop table  [dbo].[MessageBody]
CREATE TABLE [dbo].[MessageBody](
	[headerId] [int] NOT NULL,
	[message] [nvarchar](4000) NOT NULL DEFAULT ('message'),
	[messagePart] [int] NOT NULL DEFAULT ((0)),
	[sender] [int] references users(id) on update cascade on delete SET NULL,
	[sendingDate] [datetime] NOT NULL DEFAULT (getdate()),
	constraint MessageBody_primary primary key clustered (headerId, [messagePart])
	);	
print 'table [dbo].[MessageBody] created.'

go
/*
	eventType:
	Schiffskampf
	Ankunft eines neuen Spielers
	Erste Erforschung
	Kolonie wird belagert
	Kolonie wurde erobert
	Kolonie wurde aufgegebe
	Diplomatie 3 Konstellationen (allianz-allianz, allianz-spieler, spieler-spieler), 6 Zust�nde -> 18 Nachrichten 

	ALTER TABLE [GalacticEvents] ADD 	eventDatetime datetime not null default GETDATE()

	insert into [GalacticEvents] (id, eventType) select 0, 1
	insert into [GalacticEvents] (id, eventType) select 1, 4

*/
CREATE TABLE [dbo].[GalacticEvents]
(
	id int NOT NULL unique,
	eventType int not null,
	eventDatetime datetime not null default GETDATE(),
	int1 int NULL,
	int2 int NULL,
	int3 int NULL,
	int4 int NULL,
	int5 int NULL,
	int6 int NULL,
	string1 nvarchar(255) NULL,
	string2 nvarchar(255) NULL,
	string3 nvarchar(255) NULL,
	string4 nvarchar(255) NULL,
	string5 nvarchar(255) NULL,
	string6 nvarchar(255) NULL,
	string7 nvarchar(255) NULL,
	string8 nvarchar(255) NULL
constraint [GalacticEvents_Primary] primary key clustered (id)
)
go
print 'table [dbo].[GalacticEvents] created.'
go


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

create table [ChatLog]
(
id int not null,
userId int 
		references users(id) on update cascade on delete cascade,
chatMessage nvarchar(255) not null,
eventDatetime datetime not null default GETDATE(),
)
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


/*
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
*/

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
  
  go
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

  CREATE TRIGGER [dbo].[TRIGGER_ShipCreated] ON [dbo].[Ships]
AFTER Insert
AS
BEGIN	
	
	insert into dbo.[ShipTranscension](shipId, ressourceCount)
	select 
		inserted.id as shipId,		
		1
	from inserted
	where inserted.hullId = 220					
END
