SET QUOTED_IDENTIFIER ON
go
delete from dbo.starnamesBlueprint;
go
insert into dbo.starnamesBlueprint([name] ,[postNumber])VALUES 




('Acamar',0),
('Achernar',0),
('Alaraph',0),
('Alarph',0),
('Alchiba',0),
('Aldebaran',0),
('Aldhafera',0),
('Algol',0),	
('Algorab',0),
('Alhena',0),
('Alkione',0),
('Almuredin',0),	
('Alnilam',0),
('Alnitak',0),
('Alzir',0),
('Andromedae',0),	
('Angetenar',0),
('Antares',0),	
('Arcturus',0),
('Asellus',0),
('Atlas',0),
('Aurigae',0),	
('Azaleh',0),
('Azimech',0),
('Bharani',0),
('Bellatrix',0),
('Beteigeuze',0),
('Bogardus',0),
('Canopus',0),
('Capella',0),
('Castor',0),
('Centauri',0),
('Chertan',0),
('Corvi',0),	
('Cursa',0),
('Dhalim',0),
('Dheneb',0),
('Elnath',0),
('Eridani',0),
('Fornacis',0),	
('Gienah',0),
('Gliese',0),	
('Gorno',0),
('Hadar',0),	
('Hadir',0),	
('Heka',0),	
('Heze',0),
('Hyades',0),
('Hyadum',0),	
('Izar',0),	
('Kitalphar',0),	
('Kochab',0),	
('Kornephoros',0),	
('Kullat Nunu',0),	
('Kuma',0),	
('Lacertae',0),	
('Leporis',0),	
('Lesath',0),	
('Lukida',0),
('Lyncis',0),
('Anseris',0),	
('Mebsuta',0),
('Megrez',0),	
('Mekbuda',0),
('Menkalinan',0),
('Menkar',0),
('Menkib',0),	
('Merope',0),	
('Miaplacidus',0),
('Minelava',0),
('Microscopii',0),	
('Minchir',0),	
('Minelava',0),	
('Minkar',0),
('Mintaka',0),
('Mira',0),
('Mirach',0),
('Miram',0),	
('Muscae',0),	
('Nashira',0),	
('Nunki',0),	
('Nusakan',0),	
('Phakt',0),
('Porrima',0),	
('Praecipua',0),
('Pollux',0),
('Prokyon',0),	
('Protrigetrix',0),
('Rana',0),
('Rasalas',0),	
('Regor',0),
('Regulus',0),	
('Rigel',0),
('Sabik',0),	
('Sagittae',0),	
('Saiph',0),	
('Sceptrum',0),	
('Sheratan',0),
('Sirius',0),
('Spica',0),
('Syrma',0),
('Subra',0),	
('Tarazet',0),	
('Taygeta',0),
('Tauri',0),
('Tejat',0),
('Vindemiatrix',0),	
('Virginis',0),
('Wega',0),
('Wasat',0),
('Zaniah',0),
('Zavijava',0),
('Zavijah',0)	,
('Zaurak',0),
('Zibal',0)

print '------------------'

go
delete from [dbo].[Move];
go
INSERT INTO [dbo].[Move] ([moveId], x, y) VALUES 
(1,1,0)
,(2,0,-1)
,(3,-1,0)
,(4,0,1);

print '------------------'


go
delete from  [greekAlphabet]
go

insert into [greekAlphabet] (greekCharacter) VALUES
('Alpha'),
('Beta'),
('Gamma'),
('Delta'),
('Epsilon'),
('Zeta'),
('Eta'),
('Theta'),
('Iota'),
('Kappa'),
('Lambda'),
('My'),
('Ny'),
('Xi'),
('Omikron'),
('Pi'),
('Rho'),
('Sigma'),
('Tau'),
('Ypsilon'),
('Phi'),
('Chi'),
('Psi'),
('Omega')

print '------------------'

go

delete from [resultMessages];
go
insert into [resultMessages] (resultId, resultText) VALUES
(1,'OK'),
(2,'OK'),
(3,'OK'),
(4,'OK'),
(5,'OK'),
(6,'OK'),
(7,'OK'),
(8,'OK'),
(9,'OK'),
(10,'OK'),
(11,'UserID'),
(12,'OK'),
(13,'OK'),
(14,'OK'),
(15,'OK'),
(16,'OK'),
(17,'OK'),
(18,'OK'),
(19,'OK'),
(20,'OK'),
(21,'Ship Ownership'),
(22,'Colony Ownership'),
(30,'OK'),
(40,'OK'),
(50,'OK'),
(51,'[GetPlanetSurface] Parametertest'),
(52,'[GetPlanetSurface] Parametertest'),
(53,'[GetPlanetSurface] Ship not in System'),
(54,'[GetPlanetSurface] Parametertest'),
(55,'[GetPlanetSurface] Parametertest')

go
print '------------------'
delete from  [dbo].[UserRelations]
go
insert into [dbo].[UserRelations]
select 0, 'Krieg', '' union all 
select 1, 'Frieden', '' union all 
select 2, 'Handelsvertrag', '' union all 
select 3, 'Bündnis', '' union all 
select 4, 'Allianzmitglied', ''

print '------------------'
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

print '------------------'
--default planet surface map for habitable planets
-- deprecated..
delete from [dbo].[defaultMap]
go
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 2, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 3, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 4, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 5, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (0, 7, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 2, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 4, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 5, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 6, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (1, 7, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 2, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 5, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (2, 7, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 0, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 2, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 4, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 5, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 6, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (3, 7, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 2, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 4, 5)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 5, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (4, 7, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 1, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 2, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 4, 5)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 5, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (5, 7, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 1, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 2, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 3, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 5, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (6, 7, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 0, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 1, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 2, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 3, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 5, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (7, 7, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 0, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 1, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 2, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 3, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 5, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 6, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (8, 7, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 1, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 2, 3)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 3, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 5, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 6, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (9, 7, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 0, 6)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 1, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 2, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 3, 2)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 4, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 5, 1)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 6, 4)
INSERT [dbo].[defaultMap] ([X], [Y], [surfaceObjectId]) VALUES (10, 7, 4)


go
drop proc [dbo].[insertStarMap] 
go
CREATE procedure [dbo].[insertStarMap] 
	@X int, @Y int, @objectId smallint,
	@size smallint, @startSystem smallint, @id int
AS
BEGIN
	insert into [dbo].StarMap 
	(id
	,[positionX]
    ,[positionY]
	,[systemname]
	,[objectId]
  
	,[size]
	,[startSystem]
	,[settled])
	values ( @id
	 ,@X, @Y
	 ,''
	 ,@objectId
	 ,@size
	 ,@startSystem
	 ,0)
END


drop proc [dbo].[insertSolarSystemInstances] 
go
create procedure [dbo].[insertSolarSystemInstances]
	@X int, 
	@Y int, 
	@starId int,
	@objectId smallint,
	@drawSize smallint
AS
INSERT INTO [dbo].[SolarSystemInstances]
		   ([x]
		   ,[y]
		   ,[systemId]
		   ,[objectId]
		   ,[drawSize])
	 VALUES
		   (@X
		   ,@Y
		   ,@starId
		   ,@objectId
		   ,@drawSize);

GO


go
drop procedure [dbo].[saveSurface]
go
CREATE procedure [dbo].[saveSurface] 
	@name nvarchar(55),
	@seed int,
	@id int out
AS
BEGIN 
	insert into [dbo].[SurfaceImages] 
	(
		name,seed		
	)
	values ( @name , @seed);
	
	set @id = @@IDENTITY;
	
	update [dbo].[SurfaceImages]  set objectimageUrl = ('surfaceImage ' + CONVERT(nvarchar(3),@id) + '.bmp')
	where [SurfaceImages].id = @id;
	 
END	 
GO

drop  proc [dbo].[saveSurfaceDefaultMap]
go
CREATE procedure [dbo].[saveSurfaceDefaultMap]
 @id int,
 @X int,
 @Y int,
 @type smallInt
as
INSERT [dbo].[surfaceDefaultMap] (id,[X], [Y], [surfaceObjectId]) VALUES (@id, @X, @Y,@type)
GO