SET QUOTED_IDENTIFIER ON

delete from GalaxyMap;
go
  insert into GalaxyMap (id,[position],[galaxyName],[objectId],[size])
  select 
	1,
	geometry::STGeomFromText('POINT (' + convert(varchar(15),3 ) + ' ' + convert(varchar(15),3) + ')',0),
	'Centaurus A',
	1,
	10000;
go
print '------------------'
go
--[ObjectDescription]
--ToDo: remove all [moveCost], [damage], [label] and their values from script. 

/*
[id] may be frrely given, but has to be unique
[name] - deprecated, just an info for the developer. should be in english
[objectimageUrl] the url of the image.
[moveCost] - deprecated
[damage] - deprecated -> new table [ObjectOnMap] will be used for that
[label] - is not needed in most cases. An entry in goods referencing an object-Id will have its own label. Labels are in file "03 Labelsbase.sql"
*/
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1, N'Oranger Zwerg', N'SunOrange.png.png', 1, 0, 1)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2, N'Gelber Zwerg', N'SunYellow.png.png', 1, 0, 2)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3, N'Blauer Zwerg', N'SunBlue.png.png', 1, 0, 3)

  INSERT INTO [dbo].[ObjectDescription]
           ([id]
           ,[name]
           ,[objectimageUrl]
           ,[moveCost]
           ,[damage]
           ,[label])
-- add new star images
     select 4 ,'SunDeepPink'  ,'SunDeepPink.png'   ,1  ,0   ,3 union all
	 select 5 ,'SunGreenYellow'  ,'SunGreenYellow.png'   ,1  ,0   ,3 union all
	 select 6 ,'SunIndigo'  ,'SunIndigo.png'   ,1  ,0   ,3 union all
-- add new star images (solar system)
     select 63 ,'SunDeepPink'  ,'SunDeepPink.png'   ,1  ,0   ,3 union all
	 select 64 ,'SunDeepPink'  ,'SunDeepPink.png'   ,1  ,0   ,3 union all
	 select 65 ,'SunGreenYellow'  ,'SunGreenYellow.png'   ,1  ,0   ,3 union all
	 select 66 ,'SunGreenYellow'  ,'SunGreenYellow.png'   ,1  ,0   ,3 union all
	 select 67 ,'SunIndigo'  ,'SunIndigo.png'   ,1  ,0   ,3 union all
	 select 68 ,'SunIndigo'  ,'SunIndigo.png'   ,1  ,0   ,3


--delete from [ObjectDescription] where id in (4,5,8,17,33,43)
--delete from [ObjectDescription] where id in (4,5,8,17,33,43,56,57,58,60,61,62)
--delete from [ObjectDescription] where id in (156,157)

--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (4, N'Nebel', N'2.png', 1, 0, 4)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5, N'dichter Nebel', N'3.png', 1, 0, 5)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (8, N'Plasmanebel', N'6.gif', 1, 0, 8)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (10, N'Asteroidenfeld', N'11.png', 2, 0, 10)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (11, N'dichtes Asteroidenfeld', N'12.png', 3, 0, 11)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (13, N'Roter Zwerg', N'SunRed.png.png', 1, 0, 15)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (14, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (15, N'Blauer Riese 2', N'SunBlue.png.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (16, N'Blauer Zwerg', N'SunBlue.png.png', 1, 0, 17)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (17, N'Schwarzes Loch', N'28.gif', 1, 0, 18)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (24, N'EarthLike', N'51.png', 1, 0, 25)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (25, N'Land', N'52.png', 1, 0, 26)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (26, N'Water', N'53.png', 1, 0, 27)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (27, N'Desert', N'54.png', 1, 0, 28)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (28, N'Ice', N'55.png', 1, 0, 29)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (29, N'Barren', N'56.png', 1, 0, 30)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (30, N'Volcano', N'VulcanoPlanet1.png', 1, 0, 31)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (31, N'Toxic ', N'58.png', 1, 0, 32)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (32, N'Gasgiant', N'GasPlanet.png', 1, 0, 33)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (33, N'Wanderer', N'60.gif', 1, 0, 34)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (34, N'M Mond', N'EarthMoon.png', 1, 0, 35)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (35, N'O', N'EarthMoon.png', 1, 0, 34)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (36, N'L  Mond', N'EarthMoon.png', 1, 0, 36)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (37, N'N  Mond', N'63.png', 1, 0, 37)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (38, N'G  Mond', N'64.png', 1, 0, 28)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (39, N'K  Mond', N'65.png', 1, 0, 41)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (40, N'H  Mond', N'BarrenMoon.png', 1, 0, 39)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (41, N'X Mond', N'VulcanoMoon.png', 1, 0, 31)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (42, N'Toxic  Mond', N'68.png', 1, 0, 32)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (43, N'Gasriese', N'69.gif', 1, 0, 33)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (44, N'Asteroidenmond', N'70.png', 1, 0, 35)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (45, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (46, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (47, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (48, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (50, N'Roter Riese', N'sunRed.png', 1, 0, 15)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (51, N'Roter Riese', N'sunRed.png', 1, 0, 15)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (52, N'Roter Riese', N'sunRed.png', 1, 0, 15)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (53, N'Roter Riese', N'sunRed.png', 1, 0, 15)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (55, N'Oranger Riese', N'RedSun_1.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (56, N'Oranger Riese', N'RedSun_1.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (57, N'Oranger Riese', N'RedSun_1.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (58, N'Oranger Riese', N'RedSun_1.png', 1, 0, 14)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (59, N'Yellow Sun', N'YellowSunN.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (60, N'Yellow Sun', N'YellowSunN.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (61, N'Yellow Sun', N'YellowSunN.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (62, N'Yellow Sun', N'YellowSunN.png', 1, 0, 14)


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (70, N'Arrow Lower Left', N'ArrowToLowerLeft.png', 1, 0, 14)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (80, N'Nebula1', N'GrassTile.png', 1, 0, 390)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (100, N'Gras', N'GrassTile.png', 1, 0, 36)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (101, N'Gras', N'GrassTile.png', 1, 0, 36)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (102, N'Wald', N'GrassTile.png', 1, 0, 37)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (103, N'Wasser', N'WaterTile.png', 1, 0, 38)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (104, N'Gebirge', N'MountainTile.png', 1, 0, 39)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (105, N'Wüste', N'DesertTile.png', 1, 0, 40)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (106, N'Eis', N'SnowTile.png', 1, 0, 41)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (107, N'BarrenSurfaceTile', N'BarrenSurfaceTile.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (108, N'AsteroidSurfaceTile', N'AsteroidSurfaceTile.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (109, N'VulcanoSurfaceTile', N'VulcanoSurfaceTile.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (110, N'ToxicSurfaceTile', N'ToxicSurfaceTile.png')

--update [ObjectDescription] set [objectimageUrl] = N'Buildings/' + [objectimageUrl]  where id >= 149 and id <= 188

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (149, N'Koloniezentrale', N'Buildings/ColonyCenterSmall_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (150, N'Koloniezentrale', N'Buildings/ColonyCenterMedium_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (151, N'Koloniezentrale', N'Buildings/ColonyCenter_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (152, N'Erzmine', N'Buildings/Headframe.png', 1, 0, 158)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (153, N'Landwirtschaft', N'Buildings/Farm.png', 1, 0, 45)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (154, N'Raumhafen', N'Buildings/Spaceport.png', 1, 0, 119)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (155, N'Militärcamp', N'Buildings/Spaceport.png', 1, 0, 46)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (156, N'Treibstoffgewinnung', N'151.gif', 1, 0, 47)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (157, N'Treibstofflager', N'151.gif', 1, 0, 48)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (158, N'Baumaterialfabrik', N'Buildings/BuildingMaterialPlant.png', 1, 0, 50)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (159, N'Sonnenkraftwerk', N'Buildings/SolarPanels.png', 1, 0, 51)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (160, N'Lager', N'Buildings/Depot.png', 1, 0, 52)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (161, N'Kommunikationszentrale', N'Buildings/CommCenter.png', 1, 0, 53)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (162, N'Häuser', N'Buildings/Houses.png', 1, 0, 155)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (163, N'Montagehalle', N'Buildings/AssemblyPlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (164, N'Hochofen', N'Buildings/BlastFurnace.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (165, N'ResearchLab', N'Buildings/ResearchBuilding.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (166, N'OilWell2', N'Buildings/OilWell2.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (167, N'OilTank.png', N'Buildings/OilTank.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (168, N'PlanetaryScanner.png', N'Buildings/PlanetaryScanner.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (169, N'ModulePlant.png', N'Buildings/ModulePlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (170, N'PowerPlant.png', N'Buildings/PowerPlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (171, N'Verb.Baumaterialfabrik', N'Buildings/AdvBuildingMaterial.png', 1, 0, 50)




INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (172, N'Administration I', N'Buildings/Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (173, N'Administration II', N'Buildings/Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (174, N'Administration III', N'Buildings/Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (175, N'Administration IV', N'Buildings/Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (176, N'Administration V', N'Buildings/Houses.png', 1, 0, 483)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (177, N'Synthetic Materials plant', N'Buildings/AssemblyPlant.png', 1, 0, 621)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (180, N'HolmiumGenerator', N'Buildings/HolmiumGenerator.png', 1, 0, 660)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (181, N'ScandTools', N'Buildings/ScandTools.png', 1, 0, 661)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (182, N'TerbiumFact', N'Buildings/TerbiumFact.png', 1, 0, 662)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (183, N'YttriumCloning', N'Buildings/YttriumCloning.png', 1, 0, 663)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (184, N'LutEcosystem', N'Buildings/LutEcosystem.png', 1, 0, 664)


--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'Aquafarm.png' where id = 185
--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'PressureDome.png' where id = 187
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (185, N'Aqua Farm', N'Buildings/Aquafarm.png', 1, 0, 692)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (186, N'Neutronium reactor', N'Buildings/AdvBuildingMaterial.png', 1, 0, 711)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (187, N'Pressure Dome', N'Buildings/PressureDome.png', 1, 0, 698)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (188, N'Arcology', N'Buildings/Houses2.png', 1, 0, 717)

--Focus
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl] ) VALUES (189, N'Imp Baumaterialfabrik', N'Buildings/ImpBuildingMaterialPlant.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl] ) VALUES (190, N'Landwirtschaft', N'Buildings/ImpFarm.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (191, N'Hochofen', N'Buildings/ImpBlastFurnace.png')


--delete  [ObjectDescription] where id > 199 and id < 205
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (200, N'Scout2', N'Scout2G.png', 1, 0, 565)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (201, N'Corvette', N'Corvette.png', 1, 0, 566)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (202, N'Fregatte', N'Fregatte.png', 1, 0, 567)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (203, N'Destroyer', N'Fregatte.png', 1, 0, 568)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (204, N'Cruiser', N'Fregatte.png', 1, 0, 569)

--delete  [ObjectDescription] where id = 404
--update  [dbo].[ObjectDescription] set [objectimageUrl] = 'Ships/Destroyer60.png' where id =  404
--update  [dbo].[ObjectDescription] set [objectimageUrl] = 'Ships/Destroyer390.png' where id =  504
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (400, N'Kolonieschiff', N'Fregatte.png', 1, 0, 54)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (401, N'Scout', N'Scout3_60.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (402, N'Corvette', N'Corvette.png', 1, 0, 173)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (403, N'Fregatte', N'Fregatte.png', 1, 0, 174)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (404, N'destroyer', N'Ships/Destroyer60.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (405, N'Cruiser', N'Fregatte.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (406, N'star ship', N'Fregatte.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (407, N'Battleship', N'Fregatte.png', 1, 0, 57)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (408, N'Super Battleship', N'Fregatte.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (410, N'Scout2', N'Scout2XK.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (411, N'Scout3', N'Scout3_60.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (412, N'ScoutPirate', N'ScoutPirate60.png', 1, 0, 55)


---------------
--delete from [ObjectDescription] where id > 412 and id < 428
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (413, N'ScoutGreen60', N'Ships/ScoutGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (414, N'ScoutBlue60', N'Ships/ScoutBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (416, N'HeavyFighter60', N'Ships/HeavyFighter60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (417, N'HeavyFighterGreen60', N'Ships/HeavyFighterGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (418, N'HeavyFighterBlue60', N'Ships/HeavyFighterBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (420, N'CorvetteGreen60', N'Ships/CorvetteGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (421, N'CorvetteGreen60', N'Ships/CorvetteBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (422, N'Frigate60', N'Ships/Frigate60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (423, N'FrigateGreen60', N'Ships/FrigateGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (424, N'FrigateBlue60', N'Ships/FrigateBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (426, N'DestroyerGreen60', N'Ships/DestroyerGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (427, N'DestroyerBlue60', N'Ships/DestroyerBlue60.png')
----------------------


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (430, N'Outpost', N'SpaceStation0_1_60.png', 1, 0, 585)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (431, N'SpaceStation', N'SpaceStation1_1_60.png', 1, 0, 59)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (434, N'Star base', N'SpaceStation2_1_60.png', 1, 0, 584)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (437, N'Star fortress', N'SpaceStation3_1_60.png', 1, 0, 127)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (440, N'Debris', N'DummyDebris.png', 1, 0, 60)

---------------------
--delete from [ObjectDescription] where id > 440 and id < 450
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (441, N'Cruiser60', N'Ships/Cruiser60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (442, N'CruiserGreen60', N'Ships/CruiserGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (443, N'CruiserBlue60', N'Ships/CruiserBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (444, N'Battleship60', N'Ships/Battleship60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (445, N'BattleshipGreen60', N'Ships/BattleshipGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (446, N'BattleshipBlue60', N'Ships/BattleshipBlue60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (447, N'SuperBattleship60', N'Ships/SuperBattleship60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (448, N'SuperBattleshipGreen60', N'Ships/SuperBattleshipGreen60.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (449, N'SuperBattleshipBlue60', N'Ships/SuperBattleshipBlue60.png')
---------------------

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (450, N'Satellit', N'DefSat2.png')




INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (460, N'Transcendence Construct', N'TranscendenceConstruct60.png', 1, 0, 594)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (461, N'Transcendence Builder', N'TranscendenceBuildert60.png', 1, 0, 595)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (470, N'Colonizer', N'Colonizer2_60.png', 1, 0, 57)







--big images for template designer
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (500, N'Kolonieschiff', N'Scout3_60.png', 1, 0, 54)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (501, N'Scout', N'Scout3_60.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (502, N'smallDef', N'Scout3_60.png', 1, 0, 56)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (503, N'Destroyer', N'Scout3_60.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (504, N'Destroyer', N'Destroyer_1_300.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (505, N'Cruiser', N'Destroyer_1_300.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (506, N'Destroyer', N'Scout3_60.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (507, N'Tanker', N'Scout3_60.png', 1, 0, 57)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (508, N'Cruiser', N'Scout3_60.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (510, N'Scout2', N'Scout2G.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (511, N'Scout3', N'Scout3_200.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (512, N'CorvetteG', N'CorvetteG.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (513, N'FregatteG', N'FregatteG.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (514, N'ScoutPirate', N'ScoutPirate200.png', 1, 0, 55)


-------
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (515, N'ScoutGreen240', N'Ships/ScoutGreen240.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (516, N'ScoutBlue240', N'Ships/ScoutBlue240.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (517, N'HeavyFighter240', N'Ships/HeavyFighter240.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (518, N'HeavyFighterGreen240', N'Ships/HeavyFighterGreen240.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (519, N'HeavyFighterBlue240', N'Ships/HeavyFighterBlue240.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (520, N'CorvetteGreen330', N'Ships/CorvetteGreen330.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (521, N'CorvetteBlue330', N'Ships/CorvetteBlue330.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (522, N'Frigate360', N'Ships/Frigate360.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (523, N'FrigateGreen360', N'Ships/FrigateGreen360.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (524, N'FrigateBlue360', N'Ships/FrigateBlue360.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (526, N'DestroyerGreen390', N'Ships/DestroyerGreen390.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (527, N'DestroyerBlue390', N'Ships/DestroyerBlue390.png')
------- --delete from [ObjectDescription] where id > 514 and id < 528



INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (530, N'SpaceStation0', N'SpaceStation0_1_300.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (531, N'SpaceStation1', N'SpaceStation1_1_350.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (534, N'SpaceStation2', N'SpaceStation2_1_400.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (537, N'SpaceStation3', N'SpaceStation3_1_450.png', 1, 0, 55)
---------
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (541, N'Cruiser420', N'Ships/Cruiser420.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (542, N'CruiserGreen420', N'Ships/CruiserGreen420.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (543, N'CruiserBlue420', N'Ships/CruiserBlue420.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (544, N'Battleship450', N'Ships/Battleship450.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (545, N'BattleshipGreen450', N'Ships/BattleshipGreen450.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (546, N'BattleshipBlue450', N'Ships/BattleshipBlue450.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (547, N'SuperBattleship480', N'Ships/SuperBattleship480.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (548, N'SuperBattleshipGreen480', N'Ships/SuperBattleshipGreen480.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (549, N'SuperBattleshipBlue480', N'Ships/SuperBattleshipBlue480.png')
-------
--delete from [ObjectDescription] where id > 540 and id < 550




INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (550, N'Satellit', N'DefSat2B.png', 1, 0, 61)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (560, N'Transcendence Construct', N'TranscendenceConstruct300.png', 1, 0, 594)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (561, N'Transcendence Builder', N'TranscendenceBuildert300.png', 1, 0, 595)



-- Planet Backgrounds:
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (624, N'EarthLike', N'51_Background.png', 1, 0, 25)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (625, N'Land', N'51_Background.png', 1, 0, 26)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (626, N'Water', N'51_Background.png', 1, 0, 27)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (627, N'Desert', N'54.png', 1, 0, 28)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (628, N'Ice', N'55.png', 1, 0, 29)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (629, N'Barren', N'56.png', 1, 0, 30)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (630, N'Volcano', N'VulcanoPlanet1.png', 1, 0, 31)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (631, N'Toxic ', N'58.png', 1, 0, 32)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (632, N'Gasgiant', N'GasPlanet.png', 1, 0, 33)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (633, N'Wanderer', N'60.gif', 1, 0, 34)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (634, N'M Mond', N'EarthMoon.png', 1, 0, 35)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (635, N'O', N'EarthMoon.png', 1, 0, 34)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (636, N'L  Mond', N'EarthMoon.png', 1, 0, 36)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (637, N'N  Mond', N'63.png', 1, 0, 37)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (638, N'G  Mond', N'64.png', 1, 0, 28)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (639, N'K  Mond', N'65.png', 1, 0, 41)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (640, N'H  Mond', N'BarrenMoon.png', 1, 0, 39)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (641, N'X Mond', N'VulcanoMoon.png', 1, 0, 31)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (642, N'Toxic  Mond', N'68.png', 1, 0, 32)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (643, N'Gasriese', N'69.gif', 1, 0, 33)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (644, N'Asteroidenmond', N'70.png', 1, 0, 35)




--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'Buildings/SolarPanels.png' where id = 671
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (671, N'Supraconductors', N'Buildings/SolarPanels.png', 1, 0, 658)


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1000, N'Energy', N'Energy.png', 1, 0, 62)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1001, N'BM', N'BM.png', 1, 0, 63)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1002, N'Nahrung', N'Food.png', 1, 0, 64)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1003, N'Munition', N'Ammunition.png', 1, 0, 66)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1004, N'Treibstoff', N'Fuel.png', 1, 0, 67)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1005, N'Erz', N'ore.png', 1, 0, 68)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1006, N'Metall', N'MetallBars.png', 1, 0, 68)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1007, N'AssemblyPoints', N'AssemblyPoints.png', 1, 0, 62)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1008, N'Population', N'Population.png', 1, 0, 156)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1009, N'Synthetic Materials', N'SynthMat.png', 1, 0, 620)

--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'Neutronium.png' where id = 1010
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1010, N'Neutronium', N'Neutronium.png', 1, 0, 714)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1030, N'Holmium', N'ore.png', 1, 0, 69)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1031, N'Terbium', N'ore.png', 1, 0, 70)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1032, N'Scandium', N'ore.png', 1, 0, 71)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1033, N'Yttrium ', N'ore.png', 1, 0, 72)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1034, N'Lutetium', N'ore.png', 1, 0, 73)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1040, N'Adamantium', N'ore.png', 1, 0, 74)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1050, N'Holmium', N'HolmiumBars.png', 1, 0, 69)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1051, N'Terbium', N'TerbiumBars.png', 1, 0, 70)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1052, N'Scandium', N'ScandiumBars.png', 1, 0, 71)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1053, N'Yttrium ', N'YttriumBars.png', 1, 0, 72)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1054, N'Lutetium', N'LutetiumBars.png', 1, 0, 73)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1060, N'Adamantium', N'ore.png', 1, 0, 74)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2001, N'Crew I', N'Crew1.png', 1, 0, 76)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2002, N'Reactor I', N'Reactor.png', 1, 0, 77)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2003, N'Hull I', N'Hull.png', 1, 0, 78)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2004, N'Shield I', N'Shield.png', 1, 0, 79)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2000, N'SystemScout', N'ScoutModules.png', 1, 0, 55)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2005, N'Laser I', N'WeaponLaser.png', 1, 0, 80)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2006, N'Missile I', N'WeaponRocket.png', 1, 0, 81)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2007, N'Mass Driver I', N'WeaponMassDriver.png', 1, 0, 82)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2008, N'Cargo I', N'Cargo.png', 1, 0, 83)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2009, N'System Engines I', N'Impuls.png', 1, 0, 84)
GO

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2010, N'Hyper Engines I', N'Hyper.png', 1, 0, 85)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2011, N'System Batteries I', N'Engine.png', 1, 0, 86)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2012, N'Hyper Batteries I', N'Engine.png', 1, 0, 87)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2013, N'Colonizing Module', N'Colonization_I.png', 1, 0, 88)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2014, N'Asteroid Mining', N'Engine.png', 1, 0, 90)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2015, N'Scanner I', N'Scanner.png', 1, 0, 89)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2016, N'Defense satellite', N'ScoutModules.png', 1, 0, 343)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2017, N'Space Marines', N'SpaceMarines.png', 1, 0, 686)

--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'Colonization_I.png' where id = 2013
--delete from [ObjectDescription] where id = 2023
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2023, N'Colonizing Module II', N'Colonization_II.png', 1, 0, 720)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2101, N'Crew II', N'Crew1.png', 1, 0, 369)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2102, N'Reactor II', N'Reactor.png', 1, 0, 370)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2103, N'Hull II', N'Hull.png', 1, 0, 371)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2104, N'Shield II', N'Shield.png', 1, 0, 372)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2105, N'Laser II', N'WeaponLaser.png', 1, 0, 373)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2106, N'Missile II', N'WeaponRocket.png', 1, 0, 374)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2107, N'Mass Driver II', N'WeaponMassDriver.png', 1, 0, 375)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2108, N'Cargo II', N'Cargo.png', 1, 0, 376)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2109, N'System Engines II', N'Impuls.png', 1, 0, 377)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2110, N'Hyper Engines II', N'Hyper.png', 1, 0, 378)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2111, N'System Batteries II', N'Engine.png', 1, 0, 379)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2112, N'Hyper Batteries II', N'Engine.png', 1, 0, 380)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2115, N'Scanner II', N'Scanner.png', 1, 0, 381)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2201, N'Crew III', N'Crew1.png', 1, 0, 701)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2202, N'Reactor III', N'Reactor.png', 1, 0, 702)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2203, N'Hull III', N'Hull.png', 1, 0, 703)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2204, N'Shield III', N'Shield.png', 1, 0, 704)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2205, N'Laser III', N'WeaponLaser.png', 1, 0, 705)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2206, N'Missile III', N'WeaponRocket.png', 1, 0, 706)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2207, N'Mass Driver III', N'WeaponMassDriver.png', 1, 0, 707)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2208, N'Cargo III', N'Cargo.png', 1, 0, 708)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2209, N'System Engines III', N'Impuls.png', 1, 0, 709)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2210, N'Hyper Engines III', N'Hyper.png', 1, 0, 710)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2215, N'Scanner III', N'Scanner.png', 1, 0, 712)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2523, N'Colonizing Module III', N'Colonization_III.png', 1, 0, 713)


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3101, N'Yttrium Crew I', N'Crew1.png', 1, 0, 383)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3102, N'Lutetium Reactor I', N'Reactor.png', 1, 0, 384)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3103, N'Terbium Hull I', N'Hull.png', 1, 0, 385)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3104, N'Scandium Shield I', N'Shield.png', 1, 0, 386)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3105, N'Holmium Laser I', N'WeaponLaser.png', 1, 0, 387)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3108, N'Yttrium Cargo I', N'Cargo.png', 1, 0, 388)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3109, N'Lutetium System Engines I', N'Impuls.png', 1, 0, 736)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3110, N'Yttrium Hyper Engines I', N'Hyper.png', 1, 0, 389)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3115, N'Lutetium Scanner I', N'Scanner.png', 1, 0, 390)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3201, N'Adv. Crew', N'Crew1.png', 1, 0, 786)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3202, N'Adv. Reactor', N'Reactor.png', 1, 0, 787)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3203, N'Adv. Hull', N'Hull.png', 1, 0, 792)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3204, N'Adv. Shield', N'Shield.png', 1, 0, 793)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3205, N'Adv. Laser', N'WeaponLaser.png', 1, 0, 794)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3206, N'Adv. Laser', N'WeaponRocket.png', 1, 0, 795)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3207, N'Adv. Laser', N'WeaponMassDriver.png', 1, 0, 796)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3208, N'Adv. Cargo', N'Cargo.png', 1, 0, 790)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3209, N'Adv. System Engines', N'Impuls.png', 1, 0, 788)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3210, N'Adv. Hyper Engines', N'Hyper.png', 1, 0, 789)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3215, N'Adv. Scanner', N'Scanner.png', 1, 0, 791)
--update  [dbo].[ObjectDescription] set [objectimageUrl] = N'WeaponMassDriver.png'  where id = 3207

--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3500, N'Nebula', N'nebel01.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3500, N'Nebula', N'Nebula240.png', 1, 0, 390)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4000, N'Land Planet', N'SolarSystems/world/Land00.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4001, N'Land Planet', N'SolarSystems/world/Land01.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4002, N'Land Planet', N'SolarSystems/world/Land02.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4003, N'Land Planet', N'SolarSystems/world/Land03.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4004, N'Land Planet', N'SolarSystems/world/Land04.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4005, N'Land Planet', N'SolarSystems/world/Land05.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4006, N'Land Planet', N'SolarSystems/world/Land06.png')
--delete from [dbo].[ObjectDescription] where [id] > 4499 and id < 4507
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4500, N'Land Planet Surface', N'SolarSystems/colony/Land00.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4501, N'Land Planet Surface', N'SolarSystems/colony/Land01.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4502, N'Land Planet Surface', N'SolarSystems/colony/Land02.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4503, N'Land Planet Surface', N'SolarSystems/colony/Land03.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4504, N'Land Planet Surface', N'SolarSystems/colony/Land04.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4505, N'Land Planet Surface', N'SolarSystems/colony/Land05.png')
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl]) VALUES (4506, N'Land Planet Surface', N'SolarSystems/colony/Land06.png')





INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5200, N'BorderLightGreyTileset', N'BorderLightGreyTileset.png', 1, 0, 390)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5400, N'BorderDarkBlueTileset', N'BorderDarkBlueTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5600, N'BorderLightBlueTileset', N'BorderLightBlueTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5800, N'BorderDarkGreenTileset', N'BorderDarkGreenTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (6000, N'BorderLightGreenTileset', N'BorderLightGreenTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (6200, N'BorderDarkRedTileset', N'BorderDarkRedTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (6400, N'BorderLightRedTileset', N'BorderLightRedTileset.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (6600, N'BorderOrangeTileset', N'BorderOrangeTileset.png', 1, 0, 390)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (6800, N'BorderYellowTileset', N'BorderYellowTileset.png', 1, 0, 390)




--delete from [dbo].[ObjectDescription] where id > 5000


print '[ObjectDescription] Done'
go


INSERT INTO [dbo].[DamageTypes]
           ([id]
           ,name
           ,label )  
select 1, 'Laser', 1 union all
select 2, 'Rocket', 1 union all
select 3, 'MassDriver', 1 


go
/*
INSERT INTO [dbo].[ObjectOnMap]
           (
				[id],	[moveCost],		[damage],	[damageType],	[damageProbability],	[damageProbabilityReducableByShip], [defenseBonus],	fieldSize,	drawSize,	BackgroundObjectId, BackgroundDrawSize, TilestartingAt)         
select			1,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all --Oranger Zwerg
select			2,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all  --Gelber Zwerg
select			3,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all  --GelbOranger Zwerg
select			4	 ,			1		,	100		,			1		,			100				,						0				,0			,1	,	1.5					null,				null,			null		union all
select			5	 ,			1		,	100		,			1		,			100				,						0				,0			,1	,	1.5					null,				null,			null		union all
select			6	 ,			1		,	100		,			1		,			100				,						0				,0			,1	,	1.5					null,				null,			null		union all
select			63	 ,			1		,	100		,			1		,			100				,						0				,0			,2	,	2.5					null,				null,			null		union all
select			65	 ,			1		,	100		,			1		,			100				,						0				,0			,2	,	2.5					null,				null,			null		union all
select			67	 ,			1		,	100		,			1		,			100				,						0				,0			,2	,	2.5					null,				null,			null		union all
select			10,				2,			200,				3,					100,									1,				20,			1,		1					null,				null,			null		union all --N'Asteroidenfeld'
select			11,				3,			400,				3,					150,									1,				20,			1,		1					null,				null,			null		union all --'dichtes Asteroidenfeld'
select			13,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all  --roter zwerg
select			14,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all
select			15,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all
select			16,				1,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all
select			17,				50,			100,				1,					100,									0,				0,			1,		1					null,				null,			null		union all  --schwarzes Loch
select			24,				1,			0,				null,					0,										0,				60,			1,		1					 624,				  15,			   3		union all  --earthlike
select			25,				1,			0,				null,					0,										0,				60,			1,		1					 625,				  15,			   3		union all --land
select			26,				1,			0,				null,					0,										0,				60,			1,		1					 626,				  15,			   3		union all --Water
select			27,				1,			0,				null,					0,										0,				60,			1,		1					 627,				   7,			   2		union all --Desert
select			28,				1,			0,				null,					0,										0,				60,			1,		1					 628,				   7,			   2		union all --Ice
select			29,				1,			0,				null,					0,										0,				60,			1,		1					 629,				   7,			   2		union all --Barren
select			30,				1,			0,				null,					0,										0,				60,			1,		1					 630,				   7,			   2		union all --Volcano
select			31,				1,			0,				null,					0,										0,				60,			1,		1					 631,				   7,			   2		union all --Toxic
select			32,				1,			0,				null,					0,										0,				60,			1,		1					 632,				   7,			   2		union all --Gasgiant
--select			33,				1,			0,				null,					0,										0,				60,			1,		1					 633,				   7,			   2		union all --Wanderer
select			34,				1,			0,				null,					0,										0,				20,			1,		1					 634,				   6,			   2		union all --M Mond
select			35,				1,			0,				null,					0,										0,				20,			1,		1					 635,				   6,			   2		union all --Wanderer
select			36,				1,			0,				null,					0,										0,				20,			1,		1					 636,				   6,			   2		union all --L  Mond
select			37,				1,			0,				null,					0,										0,				20,			1,		1					 637,				   6,			   2		union all --N  Mond
select			38,				1,			0,				null,					0,										0,				20,			1,		1					 638,				   6,			   2		union all --G
select			39,				1,			0,				null,					0,										0,				20,			1,		1					 639,				   6,			   2		union all -- K
select			40,				1,			0,				null,					0,										0,				20,			1,		1					 640,				   6,			   2		union all --H 
select			41,				1,			0,				null,					0,										0,				20,			1,		1					 641,				   6,			   2		union all --X
select			42,				1,			0,				null,					0,										0,				20,			1,		1					 642,				   6,			   2		union all --Toxic Mond
--select			43,				1,			0,				null,					0,										0,				20,			1,		1					 643,				   6,			   2		union all --Gasriese
select			44,				1,			0,				null,					0,										0,				20,			1,		1					 644,				   6,			   2		union all --Asteroidenmond
select			45,				1,			100,				1,					100,									0,				0,			2,		1					null,				null,			null		union all
select			46,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			47,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			48,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			50,				1,			100,				1,					100,									0,				0,			2,		1					null,				null,			null		union all
select			51,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			52,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			53,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			55,				1,			100,				1,					100,									0,				0,			2,		1					null,				null,			null		union all
select			56,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			57,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			58,				1,			100,				1,					100,									0,				0,			0,		1					null,				null,			null		union all
select			59,				1,			100,				1,					100,									0,				0,			2,		2.5					null,				null,			null		union all
select			80,				8,			0,				null,					0,										0,				10,			10,		1					null,				null,			null	--nebula
go
*/

INSERT INTO [dbo].[ObjectOnMap]
           (
				[id],	[moveCost],		[damage],	[damageType],	[damageProbability],	[damageProbabilityReducableByShip], [defenseBonus],	fieldSize,  	label)         
select			1,				1,			100,				1,					100,									0,				0,			1,		3	union all --Oranger Zwerg
select			2,				1,			100,				1,					100,									0,				0,			1,		3	union all  --Gelber Zwerg
select			3,				1,			100,				1,					100,									0,				0,			1,		3	union all  --GelbOranger Zwerg
select			4,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			5,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			6,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			63,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			65,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			67,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			10,				2,			200,				3,					100,									1,				20,			1,		3	union all --N'Asteroidenfeld'
select			11,				3,			400,				3,					150,									1,				20,			1,		3	union all --'dichtes Asteroidenfeld'
select			13,				1,			100,				1,					100,									0,				0,			1,		3	union all  --roter zwerg
select			14,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			15,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			16,				1,			100,				1,					100,									0,				0,			1,		3	union all
select			17,				50,			100,				1,					100,									0,				0,			1,		3	union all  --schwarzes Loch
select			24,				1,			0,				null,					0,										0,				60,			1,		3	union all  --earthlike
select			25,				1,			0,				null,					0,										0,				60,			1,		3	union all --land
select			26,				1,			0,				null,					0,										0,				60,			1,		3	union all --Water
select			27,				1,			0,				null,					0,										0,				60,			1,		3	union all --Desert
select			28,				1,			0,				null,					0,										0,				60,			1,		3	union all --Ice
select			29,				1,			0,				null,					0,										0,				60,			1,		3	union all --Barren
select			30,				1,			0,				null,					0,										0,				60,			1,		3	union all --Volcano
select			31,				1,			0,				null,					0,										0,				60,			1,		3	union all --Toxic
select			32,				1,			0,				null,					0,										0,				60,			1,		3	union all --Gasgiant
select			34,				1,			0,				null,					0,										0,				20,			1,		3	union all --M Mond
select			35,				1,			0,				null,					0,										0,				20,			1,		3	union all --Wanderer
select			36,				1,			0,				null,					0,										0,				20,			1,		3	union all --L  Mond
select			37,				1,			0,				null,					0,										0,				20,			1,		3	union all --N  Mond
select			38,				1,			0,				null,					0,										0,				20,			1,		3	union all --G
select			39,				1,			0,				null,					0,										0,				20,			1,		3	union all -- K
select			40,				1,			0,				null,					0,										0,				20,			1,		3	union all --H 
select			41,				1,			0,				null,					0,										0,				20,			1,		3	union all --X
select			42,				1,			0,				null,					0,										0,				20,			1,		3	union all --Toxic Mond
select			44,				1,			0,				null,					0,										0,				20,			1,		3	union all --Asteroidenmond
select			45,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			46,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			47,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			48,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			50,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			51,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			52,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			53,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			55,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			56,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			57,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			58,				1,			100,				1,					100,									0,				0,			0,		3	union all
select			59,				1,			100,				1,					100,									0,				0,			2,		3	union all
select			80,				8,			0,				null,					0,										0,				10,			10,		3			--nebula
go



INSERT INTO [dbo].[ObjectImages]
           (
			[objectId],	[imageId],	drawSize,	  BackgroundObjectId,   BackgroundDrawSize,	  TilestartingAt,	surfaceDefaultMapId)         
select			1,				1,			1	,				null,					null,			null	,null	union all --Oranger Zwerg
select			2,				2,			1	,				null,					null,			null	,null	union all  --Gelber Zwerg
select			3,				3,			1	,				null,					null,			null	,null	union all  --GelbOranger Zwerg
select			4,				4,			1.5	,				null,					null,			null	,null	union all
select			5,				5,			1.5	,				null,					null,			null	,null	union all
select			6,				6,			1.5	,				null,					null,			null	,null	union all
select			10,				10,			1	,				null,					null,			null	,null	union all --N'Asteroidenfeld'
select			11,				11,			1	,				null,					null,			null	,null	union all --'dichtes Asteroidenfeld'
select			13,				13,			1	,				null,					null,			null	,null	union all  --roter zwerg
select			14,				14,			1	,				null,					null,			null	,null	union all
select			15,				15,			1	,				null,					null,			null	,null	union all
select			16,				16,			1	,				null,					null,			null	,null	union all
select			24,				24,			1	,				 624,					  15,			   3	,17		union all   --earthlike
select			25,				4000,     	1,					4500,					  15,				3	,18		union all	--earthlike		
select			25,				4001,     	1,					4501,					  15,				3	,19		union all	--earthlike
select			25,				4002,     	1,					4502,					  15,				3	,20		union all	--earthlike
select			25,				4003,     	1,					4503,					  15,				3	,21		union all	--earthlike
select			25,				4004,     	1,					4504,					  15,				3	,22		union all	--earthlike
select			25,				4005,     	1,					4505,					  15,				3	,23		union all	--earthlike
select			25,				4006,     	1,					4506,					  15,				3	,24		union all	--earthlike
select			26,				26,			1	,				 626,					  15,			   3	,17		union all --Water
select			27,				27,			1	,				 627,					   7,			   2	,17		union all --Desert
select			28,				28,			1	,				 628,					   7,			   2	,17		union all --Ice
select			29,				29,			1	,				 629,					   7,			   2	,17		union all --Barren
select			30,				30,			1	,				 630,					   7,			   2	,17		union all --Volcano
select			31,				31,			1	,				 631,					   7,			   2	,17		union all --Toxic
select			32,				32,			1	,				 632,					   7,			   2	,null	union all --Gasgiant
select			34,				34,			1	,				 634,					   6,			   2	,null	union all --M Mond
select			35,				35,			1	,				 635,					   6,			   2	,null	union all --Wanderer
select			36,				36,			1	,				 636,					   6,			   2	,null	union all --L  Mond
select			37,				37,			1	,				 637,					   6,			   2	,null	union all --N  Mond
select			38,				38,			1	,				 638,					   6,			   2	,null	union all --G
select			39,				39,			1	,				 639,					   6,			   2	,null	union all -- K
select			40,				40,			1	,				 640,					   6,			   2	,null	union all --H 
select			41,				41,			1	,				 641,					   6,			   2	,null	union all --X
select			42,				42,			1	,				 642,					   6,			   2	,null	union all --Toxic Mond
select			44,				44,			1	,				 644,					   6,			   2	,null	union all --Asteroidenmond
select			45,				45,			2.5	,				null,					null,			null	,null	union all
select			46,				46,			0	,				null,					null,			null	,null	union all
select			47,				47,			0	,				null,					null,			null	,null	union all
select			48,				48,			0	,				null,					null,			null	,null	union all
select			50,				50,			2.5	,				null,					null,			null	,null	union all
select			51,				51,			0	,				null,					null,			null	,null	union all
select			52,				52,			0	,				null,					null,			null	,null	union all
select			53,				53,			0	,				null,					null,			null	,null	union all
select			55,				55,			2.5	,				null,					null,			null	,null	union all
select			59,				59,			2.5	,				null,					null,			null	,null	union all
select			63,				63,			2.5	,				null,					null,			null	,null	union all
select			65,				65,			2.5	,				null,					null,			null	,null	union all
select			67,				67,			2.5	,				null,					null,			null	,null	
go


insert into [ObjectWeaponModificators] (
	objectId,
	damageType  ,
	damageModificator,
	toHitModificator )
select 10, 2 , 0, -20 union all -- dünnes Asteroidenfeld: rocket
select 11, 2 , 0, -50 union all -- dichtes Asteroidenfeld: rocket
select 10, 3 , 0, -10 union all -- dünnes Asteroidenfeld: Massdriver
select 11, 3 , 0, -30 union all -- dichtes Asteroidenfeld: Massdriver
select 4, 1 , -2, -5 union all -- dünner nebel: Laser
select 5, 1 , -5, -5 union all -- dichter nebel: Laser
select 4, 2 , 0, -5 union all -- dünner nebel: rocket
select 5, 2 , 0, -5 union all -- dichter nebel: rocket
select 4, 3 , 0, -5 union all -- dünner nebel: Massdriver
select 5, 3 , 0, -5 union all -- dichter nebel: Massdriver
--24 bis 31 Planeten -> Verteidiger sind besser mit MassDriver und Rocket zu treffen, da immobil, Atmosphäre schlecht für Laser...
select 24, 3 , 0, 25 union all -- Planet: massDriver
select 25, 3 , 0, 25 union all -- Planet: massDriver
select 26, 3 , 0, 25 union all -- Planet: massDriver
select 27, 3 , 0, 25 union all -- Planet: massDriver
select 28, 3 , 0, 25 union all -- Planet: massDriver
select 29, 3 , 0, 25 union all -- Planet: massDriver
select 30, 3 , 0, 25 union all -- Planet: massDriver
select 31, 3 , 0, 25 union all -- Planet: massDriver
select 24, 2 , 0, 25 union all -- Planet: rocket
select 25, 2 , 0, 25 union all -- Planet: rocket
select 26, 2 , 0, 25 union all -- Planet: rocket
select 27, 2 , 0, 25 union all -- Planet: rocket
select 28, 2 , 0, 25 union all -- Planet: rocket
select 29, 2 , 0, 25 union all -- Planet: rocket
select 30, 2 , 0, 25 union all -- Planet: rocket
select 31, 2 , 0, 25 union all-- Planet: rocket
select 24, 1 , -3, 0 union all -- Planet: laser
select 25, 1 , -3, 0 union all -- Planet: laser
select 26, 1 , -3, 0 union all -- Planet: laser
select 27, 1 , -3, 0 union all -- Planet: laser
select 28, 1 , -3, 0 union all -- Planet: laser
select 29, 1 , -3, 0 union all -- Planet: laser
select 30, 1 , -3, 0 union all -- Planet: laser
select 31, 1 , -3, 0  -- Planet: laser
go
update [ObjectWeaponModificators] set applyTo = 1 where objectId > 23 and objectId < 32
go

go
INSERT INTO [dbo].[SurfaceTiles] (id, [name], objectId, label) VALUES 
(1,  'Gras', 101, 36)
,(2, 'Wald', 102, 37)
,(3, 'Wasser', 103, 38)
,(4, 'Gebirge', 104, 39)
,(5, 'Wüste', 105, 40)
,(6, 'Eis', 106, 41)
,(7, 'Barren', 107, 831)
,(8, 'Asteroid', 108, 832)
,(9, 'Vulcanic', 109, 833)
,(10,'Toxic', 110, 834)
go


-- IMPORTANT: UPDATE FIELD baseResearch AFTER INSERTING
SET IDENTITY_INSERT [dbo].[Research] ON

-- Hidden Researches:
INSERT into [dbo].[Research] 
	  ([id], [name],				[cost], [label], [descriptionLabel], [researchType], [treeColumn],	[treeRow],	hidden) 

--Culture
select 200, N'Scientist',					 0,		844,				845,			10,				0,			16, 1 union all
select 201, N'Industrialist',				 0,		846,				847,			10,				0,			16, 1 union all
select 202, N'Militarist',					 0,		848,				849,			10,				0,			16, 1 union all
select 203, N'Ecologist',					 0,		850,				851,			10,				0,			16, 1 union all

--minor culture
select 204, N'Minor Scientist',				 0,		852,				853,			10,				0,			16, 1 union all
select 205, N'Minor Industrialist',			 0,		854,				855,			10,				0,			16, 1 union all
select 206, N'Minor Militarist',			 0,		856,				857,			10,				0,			16, 1 union all
select 207, N'Minor Ecologist',				 0,		858,				859,			10,				0,			16, 1 union all

--Focus
select 210, N'Efficient Farming',			 0,		860,				861,			10,				0,			16, 1 union all
select 211, N'Eff Prod Mat Prod',			 0,		862,				863,			10,				0,			16, 1 union all
select 212, N'Eff Metal Prod',				 0,		864,				865,			10,				0,			16, 1 union all

--Ressource available
select 220, N'Holmium',						 0,		69,					867,			10,				0,			16, 1 union all
select 221, N'Terbium',						 0,		70,					869,			10,				0,			16, 1 union all
select 222, N'Scandium',					 0,		71,					871,			10,				0,			16, 1 union all
select 223, N'Yttrium',						 0,		72,					873,			10,				0,			16, 1 union all
select 224, N'Lutetium',					 0,		73,					875,			10,				0,			16, 1 union all

-- Sophisticated Knowledge of ressource (pick 1):
select 230, N'Holmium modules',				 0,		876,				877,			10,				0,			16, 1 union all
select 231, N'Terbium modules',				 0,		878,				879,			10,				0,			16, 1 union all
select 232, N'Scandium modules',			 0,		880,				881,			10,				0,			16, 1 union all
select 233, N'Yttrium modules',				 0,		882,				883,			10,				0,			16, 1 union all
select 234, N'Lutetium modules',			 0,		884,				885,			10,				0,			16, 1



INSERT into [dbo].[Research] 
	  ([id], [name]	,							[cost], [label], [descriptionLabel], [researchType], [treeColumn], [treeRow]) 

select 1, N'Base research', 						3,		402,				166,			0,				0,		8 union all

--Level 1
select 9, N'Ecosytem Adaption I',					2,		623,				624,			1,				1,		2 union all
select 2000, N'Modules'					,			8,		164,				517,			2,				1,		5 union all

select  2, N'Improved Building Material Production',8,		886,				887,			1,				1,		8 union all

select 152, N'BluePrints: Metal Working', 			6,		158,				492,			1,				1,		11 union all
select 400, N'Space travel', 						5,		265,				493,			2 ,				1 ,		14 union all


select 1040, N'Holmium',				 			10,		69,					892,			3,				1,		19 union all
select 1041, N'Terbium',				 			10,		70,					893,			3,				1,		21 union all	
select 1042, N'Scandium',				 			10,		71,					894,			3,				1,		23 union all
select 1043, N'Yttrium',				 			10,		72,					895,			3,				1,		25 union all
select 1044, N'Lutetium',				 			10,		73,					896,			3,				1,		27 union all

--Level 2
select 10,  N'Improved Farming ',					8,		888,				889,			1,				2,		1 union all	
select  2013, N'Colonization I',					15,		88,					521,			2 ,				2 ,		3 union all
select  2001, N'Cargo',								22,		220,				518,			2 ,				2 ,		5 union all
select  2002, N'Scanner', 							60,		222,				528,			2 ,				2 ,		7 union all
select	153, N'Improved Metal Refinement',			8,		890,				891,			1,				2,		10 union all
select  501, N'Outpost'	,							40,		585,				585	,			2	,			2	,	13 union all
--INSERT into [dbo].[Research] 
	  --([id],  [description]	,				[cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 4002, N'Fleet Command I',					30	,	553	,				558,			4,				2,		15  union all

select 1060, N'Holmium Generator', 					40,		660,				512,			3,				2,		19 union all
select 1061, N'Terbium Factory Improvements',		40,		661,				513,			3,				2,		21 	union all
select 1062, N'Scandium Tools', 					60,		662,				514,			3,				2,		23  union all
select 1063, N'Yttrium Cloning Lab',				60,		663,				515,			3,				2,		25 union all
select 1064, N'Lutetium Ecosystem Improvements', 	60,		664,				516,			3,				2,		27  union all


--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
--Level 3
select 112, N'Warehouse construction plan',			30,		162,				491,			1,				3,		5  union all
select 51, N'PlaneteryScanner',						45,		382,				490,			1,				3,		7 union all
--select 1010, N'Special Ressource Analysis', 					 12,	667,				669,			1,				3,		11 union all
select 2005, N'Ship Weapons I',						45,		98,					520,			2 ,				3 ,		14 union all
select 2003, N'Ship Defenses I', 					45,		99,					519,			2 ,				3 ,		16 union all


--Level 4
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]								, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3002, N'Administration I', 					150,	472		,		477				, 4				, 4				, 3	 union all
select 8, N'Kommunikation Center',					100,	53		,		488				, 1				, 4				, 7	 union all
select 415, N'Heavy Fighter',						80,		838		,		839				, 2				, 4				, 14 union all
select 402, N'Corvette',							150,	173		,		494				, 2				, 4				, 16 union all

select 1050, N'Holmium Laser I',   					700,		387,		512,			3,				4,				19 union all
select 1051, N'Terbium Hull I',    					600,		385,		513,			3,				4,				21 union all
select 1052, N'Scandium Shield I', 					480,		386,		514,			3,				4,				23 union all
select 1053, N'Yttrium Modules I', 					360,		391,		515,			3,				4,				25 union all
select 1054, N'Lutetium Modules I',					330,		392,		516,			3,				4,				27 union all

--Level 5  delete from [dbo].[Research]  where id = 2
--select 2, N'Wasserkraftwerk', N'1.gif', N'Erlaubt den Bau des Wasserkraftwerkes', 220, 92, 484,1,5,0 union all
select 300, N'Desert Colonization',				90,				819,		820,			1,				5,				2 union all
select 301, N'Arctic Colonization',				100,			821,		822,			1,				5,				4 union all

select 71, N'Superconductors',					160,			656,		657,			1,				5,				6 union all
--select 1030, N'Special Ressource Processing', N'1.gif', N''						, 16,			668,		670,			1,				5,				11 union all
select 410, N'SpaceMarines Center',				170,			686,		687				,1,				5,				15 union all

--Level 6



--Level 7
--INSERT into [dbo].[Research] 
--	  ([id], [name]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 


--Level 8
select 3003, N'Administration II', 									350	,		473		,	478,			4,			6,					3		 union all

--INSERT into [dbo].[Research] 
--	  ([id], [name],							[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3, N'TreibstoffRaffinerie',				260, 93, 485,1,6,11  union all
select 4003, N'Fleet Command II',				240	, 554		, 559				, 4				, 6				, 16		 union all

--Level 9
select 302, N'Barren Colonization',				300,			823,		824,			1,					7,			2 union all
select 303, N'Asteroid moon Colonization',		300,			825,		826,			1,					7,			4 union all

select 50, N'Verb. Baumaterial', 				550,		350,		489,			1,					7,			6 union all
select 52, N'Arcology'			,				540			, 715		, 716			, 1				, 7			, 12 union all



--delete from [dbo].[Research]  where id = 2023 
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
--select 2023, N'Colonization II', N'1.gif', N'Colonization module.', 200, 468, 522, 2 , 9 , 0 union all


--Level 10
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]						, [cost],	[label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3004, N'Administration III',			900,		474		, 479				, 4				, 8				, 3  union all
select 5, N'Kraftwerk',						430,		95,		487,1,8,5 union all
select 55, N'Aquafarming',					370,		690,	691,1,8,7 union all
select 502, N'Space station'	,			680,		59,		558				, 2					, 8			, 10	 union all
select 403, N'Frigatte',					900,		174,	495, 2 , 8 , 16  union all

--Level 11
--INSERT into [dbo].[Research] 
--	  ([id], [name]			, [cost]		, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 72, N'Superconductors II',  520, 666, 657, 1, 9, 5 union all
select 2100, N'Modules II',  1200, 171, 523,2,9,11 union all
select 4004	, N'Fleet Command III',  1200		, 555		, 560					, 4				, 9			,	15  union all

--Level 12
select 5000, N'Transcendence Collab',	800		, 592		, 593				, 4				, 10				, 6		union all
select 2102, N'Scanner II',				475, 381, 525, 2 , 10 , 8 union all
select 2101, N'Cargo II',				450, 376, 524,  2 , 10 , 10 union all
select 2105, N'Ship Weapons II',		520, 168, 527, 2 , 10 , 12 union all
select 2103, N'Ship Defenses II',		520, 167, 526, 2 , 10 , 14 union all

--Level 13
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]		, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3005, N'Administration VI',  1600	, 475		, 480				, 4				, 11				, 3			union all
select 80, N'Superdense Materials',  1000	, 693		, 694				, 4				, 11				, 6			union all
select 404, N'Destroyer', 1400	,118		, 496				, 2				, 11				, 16		union all

--Level 14
--INSERT into [dbo].[Research] 
--	  ([id]	, [name],[objectimageUrl], [description]						, [cost]	, [label]	, [descriptionLabel]	, [researchType], [treeColumn]	, [treeRow]) 
--delete from [dbo].[Research]  where id = 2033 
--select 2033	, N'Colonization III', N'1.gif', N'Colonization module.'	, 600		, 713		, 695					, 2				, 14			,	0 union all
select 304, N'Volcanic Colonization',		1500,		827,		828,					1,				12,				2 union all
select 305, N'Toxic  planet Colonization',  1500,		829,		830,					1,				12,				4 union all

select 81	, N'Pressure Dome',				1800		, 696		, 697					, 2				, 12			,	6 union all
select 2200	, N'Modules III',				2400		, 699		, 700					,2				, 12			,	11 union all
select 4005, N'Fleet Command VI',			2100		, 556		, 561					, 4				, 12				, 16 union all


--Level 15

--INSERT into [dbo].[Research] 
--	  ([id], [name],			[objectimageUrl], [description]			, [cost]		, [label]	, [descriptionLabel]		, [researchType]	, [treeColumn]	, [treeRow]) 
select 2500, N'Special Ressources Modules',		1100			, 718		, 719						,2					, 13			, 6 union all
select	2202, N'Scanner III',					1500			, 712		, 775						, 2					, 13			, 8 union all
select	2201, N'Cargo III',						1100			, 708		, 774						, 2					, 13			, 10 union all
select	2205, N'Ship Weapons III',				2200			, 168		, 777						, 2					, 13			, 12 union all
select	2203, N'Ship Defenses III',				1800			, 167		, 776						, 2					, 13			, 14 union all



--level 16
--INSERT into [dbo].[Research] 
--	  ([id], [name],							 [cost]		, [label]	, [descriptionLabel], [researchType]	, [treeColumn]		, [treeRow]) 

select 2501, N'SR Auxilliary Modules',			900				, 780		, 783				,2					, 14				, 4 union all
select 2502, N'SR Attack Modules',				1700				, 781		, 784				,2					, 14				, 6 union all
select 2503, N'SR Defense Modules',				1300				, 782		, 785				,2					, 14				, 8 union all
select 503	, N'Star base'		,				1200			, 584		, 559				, 2					, 14				, 11  union all
select 405, N'Cruiser',							2000			, 58		, 497				, 2					, 14				, 16  union all
	
--level 17
--INSERT into [dbo].[Research] 
--	  ([id], [name],							[cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3006, N'Administration V',				4000		, 476		, 481				, 4				, 15				, 3		union all
select 504, N'Star fortress'	,				1700		, 127		, 560				, 2				, 15				, 11 union all
select 4006, N'Fleet Command V',				4000		, 557		, 562				, 4				, 15				, 13 union all
select 406, N'Battleship',						2700		, 124		, 498				, 2				, 15				, 16  union all

--level 18
--INSERT into [dbo].[Research] 
--	  ([id], [name],							[cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 5001, N'Transcendence',					12000	, 590			, 591				, 4				, 16				, 11 union all
select 407, N'Superbattleship',					3500	, 125			, 499				, 2				, 16				, 16

/*
with toUpdate ([id], [name],				[cost]		, [label]	, [descriptionLabel], [researchType]	, [treeColumn]	, [treeRow])  as (

---
)
update res set res.treeColumn = toUpdate.treeColumn, res.treeRow = toUpdate.treeRow,
res.cost = toUpdate.cost, res.baseCost = toUpdate.cost
from dbo.Research as res
inner join toUpdate
on toUpdate.id = res.id
*/




--INSERT [dbo].[Research] ([id], [name], [objectimageUrl], [description], [cost], [label], [descriptionLabel], [researchType], [treeColumn], [treeRow]) VALUES (900, N'Kolonieren Wüste', N'1.gif', N'', 2000, 125, 500, 2 , 0 , 8)


SET IDENTITY_INSERT [dbo].[Research] OFF
go


--delete from dbo.ResearchGain 
--Hidden Researches (Culture) 
insert into dbo.ResearchGain 
	([researchId]	  ,[research]	,[energy]	,[housing]	,[growth]	,[construction]	,[industrie]	,[food]	,[colonyCount]	,fleetCount	,[objectId])	
	select 200		  ,20			,0			,0			, 0			,0				,0				,0		,0				,0			,165		union all
	select 201		  ,0			,0			,5			, 0			,0				,20				,0		,0				,0			,189		union all
	select 202		  ,0			,0			,0			, 0			,35				,0				,0		,0				,75			,204		union all
	select 203		  ,0			,0			,5			, 0			,0				,0				,25		,0				,0			,153		union all
	select 204		  ,5			,0			,0			, 0			,0				,0				,0		,0				,0			,172		union all
	select 205		  ,0			,0			,2			, 0			,0				,5				,0		,0				,0			,671		union all
	select 206		  ,0			,0			,0			, 0			,10				,0				,0		,0				,20			,671		union all
	select 207		  ,0			,0			,5			, 0			,0				,0				,5		,0				,0			,172		

--Standard researches (Administration, Fleet Command, Superconductors...)
insert into dbo.ResearchGain 
([researchId]	  ,[research]	,[energy]	,[housing]	,[growth]	,[construction]	,[industrie]	,[food]	,[colonyCount]	,fleetCount	,[objectId])	
select 9		  ,10			,0			,0			, 0			,10				,10				,0		,0				,0			,172		union all
select 71		  ,0			,10			,0			, 0			,0				,0				,0		,0				,0			,671		union all
select 72		  ,0			,20			,0			, 0			,0				,0				,0		,0				,0			,671		union all
select 3002		  ,10			,0			,0			, 0			,10				,10				,0		,0				,0			,172		union all
select 3003		  ,10			,0			,0			, 0			,10				,10				,0		,0				,0			,173		union all
select 3004		  ,20			,0			,0			, 0			,20				,20				,0		,0				,0			,174		union all
select 3005		  ,20			,0			,0			, 0			,20				,20				,0		,0				,0			,175		union all
select 3006		  ,20			,0			,0			, 0			,20				,20				,0		,0				,0			,176		union all
select 4002		  ,0			,0			,0			, 0			,0				,0				,0		,0				,75			,200		union all
select 4003		  ,0			,0			,0			, 0			,0				,0				,0		,0				,75			,201		union all
select 4004		  ,0			,0			,0			, 0			,-10			,-10			,0		,0				,100		,202		union all
select 4005		  ,0			,0			,0			, 0			,-15			,-15			,0		,0				,125		,203		union all
select 4006		  ,0			,0			,0			, 0			,-20			,-20			,0		,0				,150		,204	


-- Minor Planet Colonization: Just needed for the image and description in the research Tree
insert into dbo.ResearchGain 
([researchId]	  ,[research]	,[energy]	,[housing]	,[growth]	,[construction]	,[industrie]	,[food]	,[colonyCount]	,fleetCount	,[objectId])	
select 300		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,27		union all
select 301		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,28		union all
select 302		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,29		union all
select 303		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,44		union all
select 304		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,30		union all
select 305		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,31		




/****** Object:  Table [dbo].[Goods]    Script Date: 12/06/2013 21:56:05 ******/
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1, N'BM', 1001, 1, 63, 4)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (2, N'Nahrung', 1002, 1, 64, 3)
--INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3, N'Munition', 1003, 1, 66)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (4, N'Treibstoff', 1004, 1, 67, 1)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (5, N'Erz', 1005, 1, 68, 4)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (6, N'Energy', 1000, 3, 62, 2)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (7, N'Assembly points', 1007, 3, 154, 4)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (8, N'Population', 1008, 3, 156, 3)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (9, N'Oxygen', 1000, 3, 157, 2)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (10, N'Metal', 1006, 1, 622, 5)
--INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (11, N'Steel', 1006, 1, 151)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (11, N'Synthetic materials', 1009, 1, 620, 5)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], [prodLevel]) VALUES (50, N'Adv. Building Materials', 1001, 1, 350, 6)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (60, N'Neutronium', 1010, 1, 714, 7)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1030, N'Holmium Erz', 1030, 1, 530, 7)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1040, N'Holmium', 1050, 1, 69, 8)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1031, N'Terbium Erz', 1031, 1, 531, 7)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1041, N'Terbium', 1051, 1, 70, 8)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1032, N'Scandium Erz', 1032, 1, 532, 7)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1042, N'Scandium', 1052, 1, 71, 8)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1033, N'Yttrium Erz', 1033, 1, 533, 7)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1043, N'Yttrium', 1053, 1, 72, 8)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1034, N'Lutetium Erz', 1034, 1, 534, 7)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1044, N'Lutetium', 1054, 1, 73, 8)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1045, N'Adamantium', 1060, 1, 74, 9) -- 'Adamantium'

--INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (40, N'Hydrocarbon', 2015, 1, 89)
--INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (41, N'Carbon fiber', 2015, 1, 89)


INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2000, N'SystemScout', 2000, 2, 75)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2001, N'Crew I', 2001, 2, 76)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2002, N'Reactor I', 2002, 2, 77)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2003, N'Hull I', 2003, 2, 78)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2004, N'Shield I', 2004, 2, 79)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2005, N'Laser I', 2005, 2, 80)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2006, N'Missile I', 2006, 2, 81)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2007, N'Mass Driver I', 2007, 2, 82)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2008, N'Cargo I', 2008, 2, 83)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2009, N'System Engines I', 2009, 2, 84)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2010, N'Hyper Engines I', 2010, 2, 85)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2011, N'System Batteries I', 2011, 2, 86)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2012, N'Hyper Batteries I', 2012, 2, 87)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2013, N'Colonizing Module I', 2013, 2, 88)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2014, N'Asteroid Mining', 2014, 2, 90)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2015, N'Scanner I', 2015, 2, 89)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2016, N'Defense satellite', 2016, 2, 343)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2017, N'Space Marines', 2017, 2, 686)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2023, N'Colonizing Module II', 2023, 2, 720)

--update [dbo].[Goods] set [objectDescriptionId] = 2023 where id = 2023

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2101, N'Crew II', 2101, 2, 369)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2102, N'Reactor II', 2102, 2, 370)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2103, N'Hull II', 2103, 2, 371)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2104, N'Shield II', 2104, 2, 372)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2105, N'Laser II', 2105, 2, 373)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2106, N'Missile II', 2106, 2, 374)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2107, N'Mass Driver II', 2107, 2, 375)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2108, N'Cargo II', 2108, 2, 376)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2109, N'System Engines II', 2109, 2, 377)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2110, N'Hyper Engines II', 2110, 2, 378)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2111, N'System Batteries II', 2111, 2, 379)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2112, N'Hyper Batteries II', 2112, 2, 380)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2115, N'Scanner II', 2115, 2, 381)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2201, N'Crew III',				2201, 2, 701)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2202, N'Reactor III',			2202, 2, 702)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2203, N'Hull III',				2203, 2, 703)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2204, N'Shield III',			2204, 2, 704)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2205, N'Laser III',			2205, 2, 705)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2206, N'Missile III',			2206, 2, 706)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2207, N'Mass Driver III',		2207, 2, 707)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2208, N'Cargo III',			2208, 2, 708)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2209, N'System Engines III',	2209, 2, 709)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2210, N'Hyper Engines III',	2210, 2, 710)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2215, N'Scanner III',			2215, 2, 712)


INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3101, N'Yttrium Crew I', 3101, 2, 383)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3102, N'Lutetium Reactor I', 3102, 2, 384)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3103, N'Terbium Hull I', 3103, 2, 385)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3104, N'Scandium Shield I', 3104, 2, 386)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3105, N'Holmium Laser I', 3105, 2, 387)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3108, N'Yttrium Cargo I', 3108, 2, 388)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3109, N'Lutetium System Engines I', 3109, 2, 736)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3110, N'Yttrium Hyper Engines I', 3110, 2, 389)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3115, N'Lutetium Scanner I', 3115, 2, 390)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3201, N'Adv. Crew'				, 3201, 2, 786)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3202, N'Adv. Reactor'			, 3202, 2, 787)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3203, N'Adv. Hull'				, 3203, 2, 792)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3204, N'Adv. Shield'			, 3204, 2, 793)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3205, N'Adv. Laser'			, 3205, 2, 794)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3206, N'Adv. Rocket'			, 3206, 2, 795)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3207, N'Adv. MassDriver'		, 3207, 2, 796)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3208, N'Adv. Cargo'			, 3208, 2, 790)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3209, N'Adv. System Engines'	, 3209, 2, 788)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3210, N'Adv. Hyper Engines'	, 3210, 2, 789)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (3215, N'Adv. Scanner'			, 3215, 2, 791)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2499, N'Outpost hull', 430, 2,	586)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2500, N'Space station hull', 431, 2, 587)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2501, N'Star base hull', 434, 2, 588)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2502, N'Star fortress hull', 437, 2, 589)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2520, N'Transcendence Construct', 460, 2, 594)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2523, N'Colonizing Module II', 2013, 2, 713)
--update [dbo].[Goods] set [objectDescriptionId] = 2523 where id = 2523

go 
--delete from Quests
SET IDENTITY_INSERT [dbo].[Quests] ON
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (1, NULL, 1, 0, 1, N'Welcome.js', 103)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (2, NULL, 1, 0, 1, N'ShortOverview.js', 104)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (3, NULL, 1, 0, 1, N'Movement.js', 116)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (4, NULL, 1, 0, 1, N'FindColonizablePlanet.js', 105)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (5, NULL, 1, 0, 1, N'Colonize.js', 106)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (6, NULL, 1, 0, 1, N'PlanetSurface.js', 107)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (7, NULL, 1, 0, 1, N'PlanetSurfaceOverview.js', 108)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (8, NULL, 1, 0, 1, N'BuildInfrastructure.js', 109)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (9, NULL, 1, 0, 1, N'BuildSystemExplorer.js', 110)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (10, NULL, 1, 0, 1, N'ExploreSystem.js', 111)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (13, NULL, 1, 0, 1, N'SearchSpaceStation.js', 114)

INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (11, NULL, 1, 0, 1, N'ColonyManagement.js', 261)-- 'Colony details'
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (14, NULL, 1, 0, 1, N'ResearchCenter.js', 262)-- 'Build a research center' --delete from [Quests] where id in (11,14)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (15, NULL, 1, 0, 1, N'ResearchDetails.js', 251)--'How research works'
--INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (16, NULL, 1, 0, 1, N'0160OreMineCP.js', 252)  --'First research task' --CP = Construction plan

INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (20, NULL, 1, 0, 1, N'BuildShipsGeneral.js', 253)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (21, NULL, 1, 0, 1, N'ShipModulePlant.js', 254)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (22, NULL, 1, 0, 1, N'Spaceport.js', 112)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (23, NULL, 1, 0, 1, N'SpaceportDetails.js', 256)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (24, NULL, 1, 0, 1, N'BuildSpaceShip.js', 113)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (25, NULL, 1, 0, 1, N'ShipModulePlantDetails.js', 258)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (26, NULL, 1, 0, 1, N'ShipDesignerDetails.js', 257)

INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (30, NULL, 1, 0, 1, N'TradeDetails.js', 259)
INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (31, NULL, 1, 0, 1, N'ContactsDetail.js', 260)

INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (40, NULL, 1, 0, 1, N'FinishedIntro.js', 115)

INSERT [dbo].[Quests] ([id], [descriptionLabel], [isIntro], [isRandom], [hasScript], [script], [label]) VALUES (50, NULL, 1, 0, 1, N'Reinforcements.js', 683)

SET IDENTITY_INSERT [dbo].[Quests] OFF

SET IDENTITY_INSERT [dbo].[Modules] ON
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (1, N'Crew I', 1, 2001, 76)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (2, N'Reactor I', 2, 2002, 77)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (3, N'Hull I', 3, 2003, 78)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (4, N'Shield I', 4, 2004, 79)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (5, N'Laser I', 5, 2005, 80)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (6, N'Missile I', 6, 2006, 81)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (7, N'Mass Driver I', 7, 2007, 82)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (8, N'Cargo I', 8, 2008, 83)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (9, N'System Engines I', 9, 2009, 84)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (10, N'Hyper Engines I', 10, 2010, 85)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (13, N'Colonizing Module I', 13, 2013, 88)
--INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (14, N'Asteroid Miner', 14, 2014, 90)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (15, N'Scanner I', 15, 2015, 89)
INSERT [dbo].[Modules] ([id], [name], [descriptionLabel], [goodsId], [label]) VALUES (17, N'Space Marines', 686, 2017, 686)



--delete from [dbo].[Modules] where id = 523

--level 2
INSERT into [dbo].[Modules] ([id], [level], [name], [descriptionLabel], [goodsId], [label]) 
select 101, 2, N'Crew II', 1, 2101, 369 union all
select 102, 2, N'Reactor II', 2, 2102, 370 union all
select 103, 2, N'Hull II', 3, 2103, 371 union all
select 104, 2, N'Shield II', 4, 2104, 372 union all
select 105, 2, N'Laser II', 5, 2105, 373 union all
select 106, 2, N'Missile II', 6, 2106, 374 union all
select 107, 2, N'Mass Driver II', 7, 2107, 375 union all
select 108, 2, N'Cargo II', 8, 2108, 376 union all
select 109, 2, N'System Engines II', 9, 2109, 377 union all
select 110, 2, N'Hyper Engines II', 10, 2110, 378 union all
select 115, 2, N'Scanner II', 15, 2115, 381  union all
select 23,  2, N'Colonizing Module II', 13, 2023, 339

--level 3
INSERT into [dbo].[Modules] 
	([id], [level], [name]			, [descriptionLabel], [goodsId], [label]) 
select	201, 3, N'Crew III'				, 1				, 2201		, 701 union all
select	202, 3, N'Reactor III'			, 2				, 2202		, 702 union all
select	203, 3, N'Hull III'				, 3				, 2203		, 703 union all
select	204, 3, N'Shield III'			, 4				, 2204		, 704 union all
select	205, 3, N'Laser III'			, 5				, 2205		, 705 union all
select	206, 3, N'Missile III'			, 6				, 2206		, 706 union all
select	207, 3, N'Mass Driver III'		, 7				, 2207		, 707 union all
select	208, 3, N'Cargo III'			, 8				, 2208		, 708 union all
select	209, 3, N'System Engines III'	, 9				, 2209		, 709 union all
select	210, 3, N'Hyper Engines III'	, 10			, 2210		, 710 union all
select	215, 3, N'Scanner III'			, 15			, 2215		, 712 union all
select	523, 3, N'Colonizing Module III', 13			, 2523		, 88

--update [dbo].[Modules] set [level] = 2 where id = 23

--space stations
INSERT into [dbo].[Modules] 
	([id], [level], [name],			[descriptionLabel], [goodsId],	[label])  
select 499, 1,	N'Outpost hull',		1,					2499,		586 union all
select 500, 2,	N'Space station hull',	1,					2500,		587 union all
select 501, 3,	N'Star base hull',		1,					2501,		588 union all
select 502, 3,	N'Star fortress hull',	1,					2502,		589 union all
select 520, 4,	N'Transcendence Construct',	1,				2520,		594;
--level 3

--special ressource 1
INSERT into [dbo].[Modules] ([id], [level], [name], [descriptionLabel], [goodsId], [label]) 
select 1101, 4, N'Yttrium Crew I', 1, 3101, 383 union all
select 1102, 4, N'Lutetium Reactor I', 2, 3102, 384 union all
select 1103, 4, N'Terbium Hull I', 3, 3103, 385 union all
select 1104, 4, N'Scandium Shield I', 4, 3104, 386 union all
select 1105, 4, N'Holmium Laser I', 5, 3105, 387 union all
select 1108, 4, N'Yttrium Cargo I', 8, 3108, 388 union all
select 1109, 4, N'Lutetium Engines I', 8, 3109, 736 union all
select 1110, 4, N'Yttrium Hyper Engines I', 10, 3110, 389 union all
select 1115, 4, N'Lutetium Scanner I', 15, 3115, 390 


--Adv. special ressource
INSERT into [dbo].[Modules] 
	([id], [level], [name]		, [descriptionLabel]	, [goodsId]	, [label]) 
select 1201, 5, N'Adv. Crew'			, 1				,  3201		, 786 union all
select 1202, 5, N'Adv. Reactor'			, 2				,  3202		, 787 union all
select 1203, 5, N'Adv. Hull'			, 3				,  3203		, 792 union all
select 1204, 5, N'Adv. Shield'			, 4				,  3204		, 793 union all
select 1205, 5, N'Adv. Laser'			, 5				,  3205		, 794 union all
select 1206, 5, N'Adv. Rocket'			, 5				,  3206		, 795 union all
select 1207, 5, N'Adv. Mass driver '	, 5				,  3207		, 796 union all
select 1208, 5, N'Adv. Cargo'			, 8				,  3208		, 790 union all
select 1209, 5, N'Adv. System Engines'	, 8				,  3209		, 788 union all
select 1210, 5, N'Adv. Hyper Engines'	, 10			,  3210		, 789 union all
select 1215, 5, N'Adv. Scanner'			, 15			,  3215		, 791 
-- delete from [dbo].[Modules] where id > 1200

SET IDENTITY_INSERT [dbo].[Modules] off





/****** Object:  Table [dbo].[ShipTemplate]    Script Date: 12/06/2013 21:56:05 ******/



/****** Object:  Table [dbo].[ShipHulls]    Script Date: 12/06/2013 21:56:05 ******/
--insert into ServerEvents (eventType) select 4
--delete from   [ShipHulls] where id = 4
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (0, 0, N'Debris'			, 0	, 440, 0, N'', 60)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (1, 0, N'Scout'			, 0	, 410, 5, N'ScoutHull.png', 55)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (2, 0, N'HeavyFighter'	, 0	, 416, 6, N'401Template.gif', 838)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (3, 0, N'Corvette'		, 0	, 402, 7, N'401Template.gif', 100)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (4, 0, N'Fregatte'		, 0	, 422, 9, N'401Template.gif', 101)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (5, 0, N'Destroyer'		, 0	, 404, 12, N'401Template.gif', 118)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (6, 0, N'Cruiser'		, 0	, 441, 15, N'401Template.gif', 58)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (7, 0, N'Battleship'		, 0	, 444, 19, N'401Template.gif', 124)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (8, 0, N'Superbattleship', 0	, 447, 24, N'401Template.gif', 125)

INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (199, 1, N'Outpost', 0, 430, 3, N'401Template.gif', 585)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (200, 1, N'Spacestation', 0, 431, 7, N'SpaceStation1_60.png', 59)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (201, 1, N'Starbase', 0, 434, 12, N'401Template.gif', 126)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (202, 1, N'Star Fortress', 0, 437, 21, N'401Template.gif', 127)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (220, 1, N'Transcendence  Construct', 0, 460, 0, N'401Template.gif', 594)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (221, 0, N'Transcendence  Builder', 0, 461, 50, N'401Template.gif', 595)

--with data (	[id],[shipHullId], objectId , templateImageId, templateModulesXoffset, templateModulesYoffset) as(
--truncate table [ShipHullsImages]
INSERT into [dbo].[ShipHullsImages]
					-- on map:		-- in designer:  
(	[id],[shipHullId], objectId , templateImageId, templateModulesXoffset, templateModulesYoffset) 
select 0,		0 ,			440 ,			 501 ,					   0 ,						0 union all --Debris
select 1,		1 ,			411 ,			 511 ,					   20 ,					   20 union all  --Scout 3
select 3,		3 ,			402 ,			 512 ,					   0 ,					  -40 union all  --Corvette
select 4,		4 ,			422 ,			 522 ,					  79 ,					   80 union all  -- fregatte  360
select 5,		5 ,			404 ,			 504 ,					  93 ,					   90 union all   -- destroyer 390
select 6,		6 ,			441 ,			 541 ,					 109 ,					  115 union all --Cruiser 420
select 7,		7 ,			444 ,			 544 ,					 124 ,				      115 union all --battleship
select 8,		8 ,			447 ,			 547 ,					   99 ,						155 union all -- superbattleship
--select 9,		8 ,			408 ,			 501 ,					   0 ,						0 union all
select 10,	  200 ,			431 ,			 531 ,					  73 ,						0 union all
select 11,    201 ,			434 ,			 534 ,					 99 ,						60 union all
select 12,    202 ,			437 ,			 537 ,					 124 ,						60 union all
select 13,      1 ,			410 ,			 510 ,					   20 ,						20 union all	-- Scout 2
select 14,    199 ,			430 ,			 530 ,					  49 ,						6 union all --spacestation 0 Outpost
select 15,    220 ,			460 ,			 560 ,					  0 ,						0 union all
select 16,    221 ,			461 ,			 561 ,					  0 ,						0 union all
select 17,      8 ,			412 ,			 514 ,					  0 ,					  -40 
union all
select 18,      1 ,			413 ,			 515 ,					  20 ,					   20 union all --Scout grün
select 19,      1 ,			414 ,			 516 ,					  20 ,					   20 union all --Scout blau
select 20,      2 ,			416 ,			 517 ,					  19 ,					  -25 union all  --HeavyFighter
select 21,      2 ,			417 ,			 518 ,					  19 ,					  -25 union all  --HeavyFighterGreen
select 22,      2 ,			418 ,			 519 ,					  19 ,					  -25 union all  --HeavyFighterBlue
select 23,      3 ,			420 ,			 520 ,					  63 ,					  30 union all  --CorvetteGreen
select 24,      3 ,			421 ,			 521 ,					  63 ,					  30 union all  --CorvetteBlue
select 25,      4 ,			423 ,			 523 ,					  79 ,					  80 union all  --FrigateGreen
select 26,      4 ,			424 ,			 524 ,					  79 ,					  80 union all  --FrigateBlue
select 27,      5 ,			426 ,			 526 ,					  93 ,					  90 union all  --DestroyerGreen
select 28,      5 ,			427 ,			 527 ,					  93 ,					  90 union all  --DestroyerBlue
select 29,      6 ,			442 ,			 542 ,				     109 ,					 115 union all  --CruiserGreen
select 30,      6 ,			443 ,			 543 ,					 109 ,					 115 union all  --CruiserBlue
select 31,      7 ,			445 ,			 545 ,					  124 ,					   115 union all  --BattleshipGreen
select 32,      7 ,			446 ,			 546 ,					  124 ,					   115 union all  --BattleshipBlue
select 33,      8 ,			448 ,			 548 ,					  99 ,					   155 union all  --SuperBattleshipGreen
select 34,      8 ,			449 ,			 549 ,					  99 ,					   155			 --SuperBattleshipBlue
/*
)
update toupdate 
set toupdate.templateModulesXoffset = data.templateModulesXoffset,
toupdate.templateModulesYoffset = data.templateModulesYoffset

from [dbo].[ShipHullsImages] as toupdate
inner join data
on data.id = toupdate.id
*/


--scout 5 
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 3, 3)

--heavy fighter 6
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 3, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 5)

--corvette 7
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 3, 4)

-- fregatte 9
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 3, 4)
																			   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 4, 4)


-- destroyer 12
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 3, 4)
																			   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 4, 4)
																			   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 1, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (5, 3, 5)

-- cruiser 15
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 3, 4)																		   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 4, 4)																   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 1, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 3, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 0, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 2, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (6, 4, 5)

-- battle ship  19
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 0, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 0, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 0, 6)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 1, 5)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 1)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 2, 6)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 3, 4)																		   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 3, 5)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 4, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 4, 4)																   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 4, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (7, 4, 6)
-- super battle 24

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 0, 5)


INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 1, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 1, 6)
	
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 2, 3)																		   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 2, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 2, 6)
																			   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 1)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 6)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 3, 7)			
	
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 4, 3)														   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 4, 4)																		   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 4, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 4, 6)
																			   

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 5, 4)																   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 5, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 5, 6)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (8, 6, 5)

-- ?death star 30?

--outpost 3 
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		199	,	1,		3  union all
select		199	,	2,		2  union all
select		199	,	3,		3  


--space station 7 
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		200	,	1,		3  union all
select		200	,	1,		6  union all
select		200	,	2,		3 union all
select		200	,	2,		4 union all
select		200	,	2,		6 union all
select		200	,	3,		3 union all
select		200	,	3,		6 



--star base 12 
--delete from [dbo].[ShipHullsModulePositions]  where [shipHullId] = 201
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		201	,	0,		2  union all

select		201	,	1,		2 union all
select		201	,	1,		6 union all

select		201	,	2,		1  union all
select		201	,	2,		2  union all
select		201	,	2,		3  union all
select		201	,	2,		4  union all
select		201	,	2,		6  union all
select		201	,	2,		7  union all


select		201	,	3,		2 union all
select		201	,	3,		6 union all

select		201	,	4,		2 

--star fortress  18
--delete from [dbo].[ShipHullsModulePositions]  where [shipHullId] = 202
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		202	,	0,		4  union all
	
select		202	,	1,		0 union all
select		202	,	1,		3 union all			  
select		202	,	1,		4 union all
select		202	,	1,		7 union all
	
select		202	,	2,		0 union all		
select		202	,	2,		1 union all				  
select		202	,	2,		2  union all
select		202	,	2,		3  union all
select		202	,	2,		4  union all
select		202	,	2,		5  union all
select		202	,	2,		6  union all
select		202	,	2,		7  union all
			  
select		202	,	3,		0 union all		  
select		202	,	3,		3 union all
select		202	,	3,		4 union all
select		202	,	3,		7 union all
			  
select		202	,	4,		4 



/****** Object:  Table [dbo].[ShipHullsGain]    Script Date: 12/06/2013 21:56:05 ******/ --delete from [ShipHullsGain]
-- delete from [ShipHullsGain] where [shipHullId] > 219
/*
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (1, 2, -1, 100, 0, 0, 20, 80, 0, 0, 0, 0, 0, 2)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (2, 3, -3, 150, 0, 0, 20, 20, 0, 0, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (3, -1, -5, 200, 0, 0, 80, 60, 0, 0, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (4, -2, -7, 250, 5, 0, 100, 60, 0, 0, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (5, -3, -9, 300, 0, 10, 150, 60, 0, 0, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (6, -10, -11, 350, 0, 10, 200, 50, 0, 0, 0, 0, 0, 0)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (7, -15, -18, 450, 0, 10, 200, 50, 0, 0, 0, 0, 0, 0)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (8, -20, -25, 600, 0, 0, 240, 50, 0, 0, 0, 0, 0, 0)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (200, -1, -2, 300, 0, 0, 100, 100, 0, 20, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (201, -1, -2, 600, 0, 0, 200, 200, 4, 0, 0, 0, 0, 1)
INSERT [dbo].[ShipHullsGain] ([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) VALUES (202, 0, -1, 1000, 0, 0, 400, 400, 0, 0, 10, 100, 0, 1)
*/
insert [dbo].[ShipHullsGain] 
([shipHullId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange], [speedFactor])
select		0,		0,		0,			   0,				0,				0,				0,			0,				0,				0,				0,				0,			0,				0 ,			1		union all
select		1,		-1,		-1,			200,			   80,				0,			   80,			80,				0,			    0,				0,			    0,			0,				2 ,			1.0		union all -- Scout
select		2,		-1,		-2,			220,			   70,				0,			   70,			80,				0,			    0,				0,			    0,			0,				1 ,			0.9		union all -- Scout

select		3,		-2,		-2,			250,			   60,				0,			   120,			20,				0,				0,				0,				0,			0,				1 ,			0.8		union all
select		4,		-4,		-3,			300,			   45,				0,			   200,			60,				0,				0,				0,				0,			0,				1 ,			0.7		union all --fregatte
select		5,		-6,		-5,			350,			   30,				0,				300,		60,				0,				0,				0,				0,			0,				1 ,			0.6		union all  -- destr
select		6,		-8,		-9,			400,			   20,				0,				350,		60,				0,				0,				0,				0,			0,				1 ,			0.5		union all  -- cruiser
--
select		7,		-10,	-11,		450,			   10,				0,				400,		50,				0,				0,				0,				0,			0,				0 ,			0.4		union all -- starship
--
select		8,		-15,	-18,		500,			    5,				0,				500,		50,				0,				0,				0,				0,			0,				0 ,			0.3  	union all -- battle
select		199,	3,		4,			450,				0,				0,				500,		100,			0,				0,				0,				0,			0,				1 ,			0.0		union all  
select		200,	5,		6,			700,			    0,				0,				100,		100,			0,				0,				0,				0,			0,				1 ,			0.0		union all
select		201,	8,		10,			1000,			    0,				0,				200,		200,			0,				0,				0,				0,			0,				1 ,			0.0		union all
select		202,	13,		16,			1400,			    0,				0,				400,		400,			0,				0,				0,				0,			0,				1 ,			0.0     union all
select		220,	1,		100,		3000,				0,				50,				0,			0,				0,				0,				0,				0,			0,				1 ,			0.0     union all
select		221,	1,		10,			100,				0,				5,				0,			0,				1,				6,				1,				15,			0,				0 ,			1.0

/****** Object:  Table [dbo].[ShipHullsCosts]    Script Date: 12/06/2013 21:56:05 ******/


-- standard Ship hulls
-- delete from [dbo].[ShipHullsCosts] where [shipHullId]  > 1 and shipHullId] < 10
INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		1,			1,		80	union all --Scout : 80 BM, 40 PP,  50 metal
select		1,			7,		40	union all  -- Assembly points 
select		1,			10,		50	union all  --  metal

select		2,			1,		100	union all --Scout : 80 BM, 40 PP,  50 metal
select		2,			7,		60	union all  -- Assembly points 
select		2,			10,		80	union all  --  metal

select		3,			1,		170	union all --Corvette : 30 BM, 50 PP, 
select		3,			7,		70	union all  -- Assembly points 
select		3,			10,		90	union all  --  metal

select		4,			1,		250	union all --Fregatte : 30 BM, 50 PP, 
select		4,			7,		110	union all
select		4,			10,		220	union all  --  metal
select		4,			11,		80	union all -- synth

select		5,			1,		200	union all --Destroyer : 30 BM, 50 PP, 
select		5,			7,		160	union all
select		5,			10,		280	union all  --  metal
select		5,			11,		120	union all -- synth
select		5,			50,		100	union all -- adv building

select		6,			1,		300	union all --Cruiser : 30 BM, 50 PP, 
select		6,			7,		220	union all
select		6,			10,		400	union all  --  metal
select		6,			11,		220	union all -- synth
select		6,			50,		160	union all -- adv building

select		7,			1,		400	union all --battleship : 30 BM, 50 PP, 
select		7,			7,		290	union all
select		7,			10,		550	union all  --  metal
select		7,			11,		320	union all -- synth
select		7,			50,		220	union all -- adv building

select		8,			1,		600	union all --superbattleship : 30 BM, 50 PP, 
select		8,			7,		400	union all
select		8,			10,		680	union all  --  metal
select		8,			11,		400	union all -- synth
select		8,			50,		280	        -- adv building



-- Space Stations:

INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		199,			1,		80	union all --Outpost : 30 BM, 50 PP, 
select		199,			7,		50	union all
select		199,			10,		120	union all  --  metal


select		200,			1,		220	union all --Spacestation : 30 BM, 50 PP, 
select		200,			7,		120 union all
select		200,			10,		280	union all  --  metal
select		200,			11,		80	union all --synth     union all --Adv. Building Materials	

select			201,		1,		300		union all   --bm
select			201,		7,		200		union all   -- ASSEMBLY
select			201,		10,		340		union all   --metal
select			201,		11,		180		union all   --synth
select			201,		50,		120		union all   --Adv. Building Materials


select			202,		1,		500		union all   --bm
select			202,		7,		400		union all   -- ASSEMBLY
select			202,		10,		500		union all   --metal
select			202,		11,		300		union all   --synth
select			202,		50,		200		   --Adv. Building Materials



--Transcendence Construct:
INSERT [dbo].[ShipHullsCosts] 
		([shipHullId],	[goodsId], [amount]) 
select			220,		1,		900		union all
select			220,		7,		500		union all
select			220,		10,		680	union all  --  metal
select			220,		11,		400	union all -- synth
select			220,		50,		400		union all --Adv. Building Materials
select			220,		1040,		100		union all
select			220,		1041,		100		union all
select			220,		1042,		100		union all
select			220,		1043,		100		union all
select			220,		1044,		100		


--Transcendence Builder
INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		221,			1,		300		union all -- 30 BM, 50 PP, 
select		221,			7,		300	union all --Assembly
select		221,			10,		600		union all  --Steel
select		221,			11,		160		union all -- synth
select		221,			50,		100		union all --Adv. Building Materials
select		221,			1040,	40    union all --Specials
select		221,			1041,	40    union all
select		221,			1042,	40    union all
select		221,			1043,	40    union all
select		221,			1044,	40    


--delete from [ShipHullsCosts]



/*
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (4, 1, 400)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (5, 1, 1000)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (6, 1, 1500)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (7, 1, 3000)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (8, 1, 10000)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (200, 1, 150)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (201, 1, 500)
INSERT [dbo].[ShipHullsCosts] ([shipHullId], [goodsId], [amount]) VALUES (202, 1, 20000)
*/




insert into [SpecializationGroups] select 0, 'Culture', 1, 900,901
insert into [SpecializationGroups] select 1, 'Focus', 1, 902,903
insert into [SpecializationGroups] select 2, 'Ressource Excavation', 3, 904,905
insert into [SpecializationGroups] select 3, 'Ressource Refinement', 1, 906,907



delete from [SpecializationResearches];

insert into [SpecializationResearches] (SpecializationGroupId, ResearchId, SecondaryResearchId)
	select 0, 200, 204 union all
	select 0, 201, 205 union all
	select 0, 202, 206 union all
	select 0, 203, 207 

	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,		Building1)
	select														1,			210,			   24	union all
	select														1,			211,			   23	union all
	select														1,			212,			   25 

	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,   Building1,  Building2,	Building3)
	select														2,			220,		1030,       1040,         180   union all
	select														2,			221,		1031,       1041,         181   union all
	select														2,			222,		1032,       1042,         182   union all
	select														2,			223,		1033,       1043,         183   union all
	select														2,			224,		1034,       1044,         184   

	insert into [SpecializationResearches] (SpecializationGroupId,	 ResearchId,	  Module1,	 Module2,	Module3 )
	select														3,	 	    230,		 1105,		null,		null		union all
	select														3,	 	    231,		 1103,		null,		null		union all
	select														3,	 	    232,		 1104,		null,		null		union all
	select														3,	 	    233,		 1101,		1108,		1110		union all
	select														3,	 	    234,		 1102,		1109,		1115		


	--special ressource 1
INSERT into [dbo].[Modules] ([id], [level], [name], [descriptionLabel], [goodsId], [label]) 
select 1101, 4, N'Yttrium Crew I', 1, 3101, 383 union all
select 1102, 4, N'Lutetium Reactor I', 2, 3102, 384 union all
select 1103, 4, N'Terbium Hull I', 3, 3103, 385 union all
select 1104, 4, N'Scandium Shield I', 4, 3104, 386 union all
select 1105, 4, N'Holmium Laser I', 5, 3105, 387 union all
select 1108, 4, N'Yttrium Cargo I', 8, 3108, 388 union all
select 1109, 4, N'Lutetium Engines I', 8, 3109, 736 union all
select 1110, 4, N'Yttrium Hyper Engines I', 10, 3110, 389 union all
select 1115, 4, N'Lutetium Scanner I', 15, 3115, 390 


go


----------------------------------------------------------------------------------

--insert neutral user 0
declare @maxUserId int;
select @maxUserId = max(id) from inSpaceIndex.dbo.Users 

INSERT [dbo].[Users] ([id], [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES (0 , N'@755', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 1 , 1)	--robot AI
INSERT [dbo].[Users] (id, [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES (280, N'@756', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 2 , 0)   --Pirates
INSERT [dbo].[Users] (id, [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES ( 281, N'@762', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 3 , 0)	-- Separatists

--  Ship Templates
-- One Blueprint per hull type:
--1 Scout

INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], [attack], [defense], [hitpoints], [damagereduction], [cargoroom], [fuelroom], [systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], 
[isColonizer], [constructionDuration], [constructable], [amountBuilt], [obsolete], shipHullsImage) 
VALUES (0, 0, 1, N'Scout', N'scout.png', 1, 8, 3, 0, 0, 100, 0, 20, 80, 
20, 4, 160, 35,  --moves 
0, 1, 1, 0, 0, 1)


--2 Corvette
INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], 
[attack], [defense], [hitpoints], [damagereduction], 
[cargoroom], [fuelroom], 
[systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], 
[isColonizer], [constructionDuration], [constructable], [amountBuilt], [obsolete], shipHullsImage) 
VALUES (1, 0, 2, N'Corvette', N'scout.png', 6, 10, 2, 
0, 0, 100, 0, 
20, 80, 
20, 5, 100, 25,   --moves 
0, 1, 1, 0, 0, 3)

--3 Blueprint Fregatte
INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], 
[attack], [defense], [hitpoints], [damagereduction], [cargoroom], [fuelroom], 
[systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], 
[isColonizer], [constructionDuration], [constructable], [amountBuilt], [obsolete], shipHullsImage) 
VALUES (2, 0, 3, N'Fregatte', N'scout.png', 5, 8, 2, 
60, 60, 100, 0, 
20, 80, 
0, 0, 0, 0,  --moves 
0, 1, 1, 0, 0, 4) 

--4


--10 station1
INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], 
[attack], [defense], [hitpoints], [damagereduction], [cargoroom], [fuelroom], 
[systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], 
[isColonizer], [constructionDuration], [constructable], [amountBuilt], [obsolete], shipHullsImage) 
VALUES (10, 0, 199, N'Outpost', N'scout.png', 5, 8, 2, 
60, 60, 100, 0, 
20, 80, 
0, 0, 0, 0,  --moves 
0, 1, 1, 0, 0, 14) 

/****** Object:  Table [dbo].[ShipTemplateModulePositions]    Script Date: 12/07/2013 17:04:33 ******/



/****** Object:  Table [dbo].[ShipTemplateCosts]    Script Date: 12/07/2013 17:04:33 ******/




--delete from [ShipTemplateModulePositions] where [shipTemplateId] = 0

INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 1, 3, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 2, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 3, 9)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 4, 10)
--INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 3, 3, 10)

--scout
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 1, 3, 2) --Reactor I
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 2, 1) --Crew I
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 3, 9) --sys engines
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 3, 3, 10) --hyp engines
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 4, 5)  --laser?

--fregatte
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 1, 3, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 2, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 3, 6)  --Missile I
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 4, 5) --laser?
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 3, 3, 7)  --mass driver I


-- 10 
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 1, 3, 6)  --Missile I
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 2, 2, 5) --laser?
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 3, 3, 7)  --mass driver I


/*
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 1, 3, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 2, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 3, 9)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 3, 2, 10)
*/
/*
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (0, 2001, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (0, 2002, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (0, 2009, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (0, 2010, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (0, 2523, 1)

INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (1, 2001, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (1, 2002, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (1, 2009, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (1, 2010, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (1, 2005, 1)  --laser?

INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2001, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2002, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2005, 1)  --laser?
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2006, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2007, 1)
*/

/*
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2001, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2002, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2009, 1)
INSERT [dbo].[ShipTemplateCosts] ([shipTemplateId], [goodsId], [amount]) VALUES (2, 2010, 1)
*/
-- research:
-- schiffe + Raumzeugs + Module
-- rohstoffe
-- Bevölkerung
-- Produktivität
-- terraforming + erlaubte planeten

--Phase 1: 1 Monat - ~120 Runden:
/*
	- Ausbreitung auf den verfügbaren Platz
	- Schiffsbau mit STandardmodulen oder Spaceport - fighter(4 Module)  /fregatten (6 Module)
	- Basisrohstoffe, Basisplaneten (~3 pro Spieler).
	- Bevölkerungswachstum? Anfangskolonie sollte halbvoll sein
	- Handel? Evtl Spezialisierung auf ein Standardmodul in verbesserter Form pro Siedler. SOllte etwas anders sein als das des Spezialrohstoffes

- Phase 2: 3 Monate 
	- beginnender Abbau eines Spezialrohstoffes und Handel damit
	- Spezialmodule + Handel damit
	- Schiffsrumpf Zerstörer (~9 Module) und später Kreuzer (~13 Module)

- Phase 3: 3 Monate
	- Standardforschung wird in dieser Phase abgeschlossen
	- Schlachtschiff (~19 Module)





*/