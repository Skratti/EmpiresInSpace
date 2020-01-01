

IF OBJECT_ID('[dbo].[UserGames]', 'U')  IS NOT NULL  DROP TABLE [dbo].[UserGames];
IF OBJECT_ID('[dbo].[Games]', 'U')  IS NOT NULL  DROP TABLE [dbo].[Games];
IF OBJECT_ID('[dbo].[RuleLines]', 'U')  IS NOT NULL  DROP TABLE [dbo].[RuleLines];
IF OBJECT_ID('[dbo].[Rules]', 'U')  IS NOT NULL  DROP TABLE [dbo].[Rules];
IF OBJECT_ID('[dbo].[UserRemembers]', 'U')  IS NOT NULL  DROP TABLE [dbo].[UserRemembers];
IF OBJECT_ID('[dbo].[Users]', 'U')  IS NOT NULL  DROP TABLE [dbo].[Users];
IF OBJECT_ID('[dbo].[Languages]', 'U')  IS NOT NULL  DROP TABLE [dbo].[Languages];

go

go
--alter table [dbo].[Users]	add registerCode int not null default 0
/*
alter table [dbo].[Users]	add recoveryCode nvarchar(64) 
alter table [dbo].[Users]	add recoveryDateTime DateTime
*/
CREATE TABLE [dbo].[Users]			  (
	[id] int identity(1,1),		
	username nvarchar(63) DEFAULT '' NOT NULL unique,
	userpassword nvarchar(64) NOT NULL, 	
	email nvarchar(63) unique,
	created datetime,		
	user_ip nvarchar(55),	
	lastlogin DateTime,	
	[language] int not null default 0,
	defaultInGameName nvarchar(63) DEFAULT '' NOT NULL,
	defaultStartingRegion int not null default 0,
	premiumEnd date,
	userLevel int not null default 0,
	verificationCode  nvarchar(63) NOT NULL,
	salt int,
	recoveryCode nvarchar(64) ,
	recoveryDateTime DateTime
	constraint Users_primary primary key clustered (id)
);
print 'table [Users] created.'
go

go
CREATE TABLE [dbo].[UserRemembers]			  (
	[userId] int not null references [dbo].[Users](id),
	cookieHash  VarBinary(max) not null,
	salt int,
	cookieUsed bit not null default 0,
	generatedAt datetime default CURRENT_TIMESTAMP,
	usedAt datetime	
);
print 'table [UserRemembers] created.'
go

CREATE TABLE [dbo].[Rules]	
(
	[id] int identity(1,1),
	name nvarchar(63) DEFAULT 'Standard',
	htmlDescription nvarchar(max) not null default ''
	constraint Rules_primary primary key clustered (id)
)
go
insert into [dbo].[Rules] (name,htmlDescription)
select 
	'Standard',
	'<p>3 Runden pro Tag (15 Uhr, 18 Uhr, 21 Uhr)<br>Beschleunigte Anfangsphase: <br> erste Stunde alle 3 Minuten Rundenwechsel <br> 2 und 3 Stunde alle 15 Minuten <br> <br> Laufzeit ~12 Monate <br> Beitritt nur in den ersten 4 Monaten <br> <br>Basis-Regeln:<br> - Technologie bis Level 3 <br><br>  Siegesbedingungen: <br> - Diplomatie <br> - Eroberung <br> - Transzendenz <br><br>Auseinandersetzungen:<br> - zweite Chance: Spieler können ihre Heimat aufgeben und mit dem Muttership, der erforschten Technologie und einigen der auf der Heimatwelt gelagerten Ressourcen einen Notsprung in Richtung Galaxy-Rand machen<br> - Minen erlaubt<br> - Schiffsrümpfe bis Großer Kreuzer </p>'

CREATE TABLE [dbo].[RuleLines]	
(
	[id] int identity(1,1),
	ruleId int references [Rules]([id]) on update cascade on delete cascade,
	name nvarchar(63) DEFAULT 'Standard'
	constraint RuleLine_primary primary key clustered (id)
)


CREATE TABLE [dbo].[Games]			  (
	[id] int identity(1,1),		
	galaxyName nvarchar(63) DEFAULT '' NOT NULL unique,
	rulesId int default 1 references [Rules]([id]) on update cascade on delete set default,		
	objectId SMALLINT NOT NULL DEFAULT 1,
	size smallint not null default 10000,
	url nvarchar(127)not null default 'http://game1.empiresinspace.de/login.aspx',
	imageUrl nvarchar(127)not null default 'images/game05.png',
	gameStatus smallint not null default 0, -- 0 : coming soon (with date) // 1: open for registration // 2: running // 3 : running and closed // 4: stopped-finished
	startingDate datetime,
	name2 nvarchar(3) DEFAULT '01' NOT NULL unique,
	maxUsers int not null default 10000,
	currentUserCount int not null default 0
	constraint Games_primary primary key clustered (id)
);
print 'table [Games] created.'
go

insert into [dbo].[Games] (galaxyName,rulesId,objectId,size,url,imageUrl, gameStatus,startingDate, name2)
select 'Andromeda',1,1,10000,'game02','images/game05.png', 2, GETDATE(), '01' union all
select 'Centaurus A',1,1,10000,'game02','images/game06.png', 1, GETDATE(), '02' union all
select 'Blackeye',1,1,10000,'game02','images/game07.png' , 0, GETDATE(), '03' 

--update [dbo].[Games] set url = 'Game02' where id = 1
update [dbo].[Games] set startingDate = '2013-06-28T00:00:00' where id = 1
update [dbo].[Games] set gameStatus = 2 where id = 1
update [dbo].[Games] set startingDate = '2013-07-24T00:00:00' where id = 2
update [dbo].[Games] set gameStatus = 1 where id = 2
update [dbo].[Games] set url = 'http://game1.empiresinspace.de/login.aspx' where id = 1


go
CREATE TABLE [dbo].[UserGames]			  (
	[userId] int references [Users]([id]) on update cascade on delete cascade,
	gameId int references [Games]([id]) on update cascade on delete cascade
);
go
create unique clustered index UserGames_Index on [UserGames]([userId],gameId)
go



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

go
delete from   [dbo].Languages 
--Languages
SET IDENTITY_INSERT [dbo].Languages ON
INSERT INTO [dbo].Languages (id,languageFullName,languageShortName)
select 0,'English', 'en'
union all 
select 1,'Deutsch', 'de'
union all
select 2,'Francais', 'fr' 
SET IDENTITY_INSERT [dbo].Languages OFF
go