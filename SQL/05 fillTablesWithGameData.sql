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
/*
[id] may be frrely given, but has to be unique
[name] - deprecated, just an info for the developer. should be in english
[objectimageUrl] the url of the image.
[moveCost] - deprecated
[damage] - deprecated -> new table [ObjectOnMap] will be used for that
[label] - is not needed in most cases. An entry in goods referencing an object-Id will have its own label. Labels are in file "03 Labelsbase.sql"
*/
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (1, N'Oranger Zwerg', N'sunRed.png', 1, 0, 1)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (2, N'Gelber Zwerg', N'YellowSunN.png', 1, 0, 2)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3, N'GelberOranger Zwerg', N'RedSun_1.png', 1, 0, 3)

--delete from [ObjectDescription] where id in (4,5,8,17,33,43)
--delete from [ObjectDescription] where id in (4,5,8,17,33,43,56,57,58,60,61,62)
--delete from [ObjectDescription] where id in (156,157)

--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (4, N'Nebel', N'2.png', 1, 0, 4)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (5, N'dichter Nebel', N'3.png', 1, 0, 5)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (8, N'Plasmanebel', N'6.gif', 1, 0, 8)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (10, N'Asteroidenfeld', N'11.png', 2, 0, 10)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (11, N'dichtes Asteroidenfeld', N'12.png', 3, 0, 11)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (13, N'Roter Zwerg', N'sunRed.png', 1, 0, 15)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (14, N'Blauer Riese', N'SunBlue.png', 1, 0, 13)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (15, N'Oranger Riese', N'sunRed.png', 1, 0, 14)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (16, N'Zwerg', N'sunRed.png', 1, 0, 17)
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
--update [ObjectDescription] set [objectimageUrl] = N'ColonyCenter_60.png' where id = 151
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (149, N'Koloniezentrale', N'ColonyCenterSmall_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (150, N'Koloniezentrale', N'ColonyCenterMedium_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (151, N'Koloniezentrale', N'ColonyCenter_60.png', 1, 0, 43)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (152, N'Erzmine', N'Headframe.png', 1, 0, 158)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (153, N'Landwirtschaft', N'Farm.png', 1, 0, 45)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (154, N'Raumhafen', N'Spaceport.png', 1, 0, 119)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (155, N'Militärcamp', N'153.png', 1, 0, 46)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (156, N'Treibstoffgewinnung', N'151.gif', 1, 0, 47)
--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (157, N'Treibstofflager', N'151.gif', 1, 0, 48)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (158, N'Baumaterialfabrik', N'BuildingMaterialPlant.png', 1, 0, 50)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (159, N'Sonnenkraftwerk', N'SolarPanels.png', 1, 0, 51)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (160, N'Lager', N'Depot.png', 1, 0, 52)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (161, N'Kommunikationszentrale', N'CommCenter.png', 1, 0, 53)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (162, N'Häuser', N'Houses.png', 1, 0, 155)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (163, N'Montagehalle', N'AssemblyPlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (164, N'Hochofen', N'BlastFurnace.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (165, N'ResearchLab', N'ResearchBuilding.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (166, N'OilWell2', N'OilWell2.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (167, N'OilTank.png', N'OilTank.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (168, N'PlanetaryScanner.png', N'PlanetaryScanner.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (169, N'ModulePlant.png', N'ModulePlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (170, N'PowerPlant.png', N'PowerPlant.png', 1, 0, 153)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (171, N'Verb.Baumaterialfabrik', N'AdvBuildingMaterial.png', 1, 0, 50)




INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (172, N'Administration I', N'Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (173, N'Administration II', N'Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (174, N'Administration III', N'Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (175, N'Administration IV', N'Houses.png', 1, 0, 482)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (176, N'Administration V', N'Houses.png', 1, 0, 483)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (177, N'Synthetic Materials plant', N'AssemblyPlant.png', 1, 0, 621)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (180, N'HolmiumGenerator', N'HolmiumGenerator.png', 1, 0, 660)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (181, N'ScandTools', N'ScandTools.png', 1, 0, 661)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (182, N'TerbiumFact', N'TerbiumFact.png', 1, 0, 662)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (183, N'YttriumCloning', N'YttriumCloning.png', 1, 0, 663)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (184, N'LutEcosystem', N'LutEcosystem.png', 1, 0, 664)


--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'Aquafarm.png' where id = 185
--update [dbo].[ObjectDescription] set [objectimageUrl] =  N'PressureDome.png' where id = 187
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (185, N'Aqua Farm', N'Aquafarm.png', 1, 0, 692)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (186, N'Neutronium reactor', N'AdvBuildingMaterial.png', 1, 0, 711)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (187, N'Pressure Dome', N'PressureDome.png', 1, 0, 698)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (188, N'Arcology', N'Houses.png', 1, 0, 717)

--delete  [ObjectDescription] where id > 199 and id < 205
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (200, N'Scout2', N'Scout2G.png', 1, 0, 565)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (201, N'Corvette', N'Corvette.png', 1, 0, 566)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (202, N'Fregatte', N'Fregatte.png', 1, 0, 567)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (203, N'Destroyer', N'Fregatte.png', 1, 0, 568)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (204, N'Cruiser', N'Fregatte.png', 1, 0, 569)

--delete  [ObjectDescription] where id = 404
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (400, N'Kolonieschiff', N'Fregatte.png', 1, 0, 54)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (401, N'Scout', N'Scout3_60.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (402, N'Corvette', N'Corvette.png', 1, 0, 56)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (403, N'Fregatte', N'Fregatte.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (404, N'destroyer', N'Destroyer_1_60.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (405, N'Cruiser', N'Fregatte.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (406, N'star ship', N'Fregatte.png', 1, 0, 118)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (407, N'Battleship', N'Fregatte.png', 1, 0, 57)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (408, N'Super Battleship', N'Fregatte.png', 1, 0, 58)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (410, N'Scout2', N'Scout2XK.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (411, N'Scout3', N'Scout3_60.png', 1, 0, 55)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (430, N'Outpost', N'SpaceStation0_1_60.png', 1, 0, 585)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (431, N'SpaceStation', N'SpaceStation1_1_60.png', 1, 0, 59)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (434, N'Star base', N'SpaceStation2_1_60.png', 1, 0, 584)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (437, N'Star fortress', N'SpaceStation3_1_60.png', 1, 0, 127)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (440, N'Debris', N'DummyDebris.png', 1, 0, 60)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (450, N'Satellit', N'DefSat2.png', 1, 0, 61)

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

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (530, N'FregatteG', N'SpaceStation0_1_300.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (531, N'FregatteG', N'SpaceStation1_1_350.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (534, N'FregatteG', N'SpaceStation2_1_400.png', 1, 0, 55)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (537, N'FregatteG', N'SpaceStation3_1_450.png', 1, 0, 55)


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (550, N'Satellit', N'DefSat2B.png', 1, 0, 61)

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (560, N'Transcendence Construct', N'TranscendenceConstruct300.png', 1, 0, 594)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (561, N'Transcendence Builder', N'TranscendenceBuildert300.png', 1, 0, 595)


INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (671, N'Supraconductors', N'SolarPanels.png', 1, 0, 658)


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

--INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3500, N'Nebula', N'nebel01.png', 1, 0, 390)
INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (3500, N'Nebula', N'NebulaPurple01.png', 1, 0, 390)

--delete from [dbo].[ObjectDescription] where id = 3500


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
INSERT INTO [dbo].[ObjectOnMap]
           ([id]
           ,[moveCost]
           ,[damage]
           ,[damageType]
           ,[damageProbability]
           ,[damageProbabilityReducableByShip]
           ,[defenseBonus]
           ,fieldSize)         
select  1, 1, 100, 1, 100, 0, 0, 1 union all --Oranger Zwerg
select 2, 1, 100, 1, 100, 0, 0, 1 union all  --Gelber Zwerg
select 3, 1, 100, 1, 100, 0, 0, 1 union all  --GelbOranger Zwerg
select 4, 2, 0, null, 0, 0, 10, 1 union all  --Nebel
select 5, 3, 0, null, 0, 0, 20, 1 union all --dichter Nebel
select 8, 3, 0, null, 0, 0, 20, 1 union all --Plasmanebel
select 10, 2, 200, 3, 100, 1, 20, 1 union all --N'Asteroidenfeld'
select 11, 3, 400, 3, 150, 1, 20, 1 union all --'dichtes Asteroidenfeld'
select 13, 1, 100, 1, 100, 0, 0, 1 union all
select 14, 1, 100, 1, 100, 0, 0, 1 union all
select 15, 1, 100, 1, 100, 0, 0, 1 union all
select 16, 1, 100, 1, 100, 0, 0, 1 union all
select 17, 50, 100, 1, 100, 0, 0, 1 union all  --schwarzes Loch
select 24, 1, 0, null, 0, 0, 60, 1 union all  --earthlike
select 25, 1, 0, null, 0, 0, 60, 1 union all --land
select 26, 1, 0, null, 0, 0, 60, 1 union all --Water
select 27, 1, 0, null, 0, 0, 60, 1 union all --Desert
select 28, 1, 0, null, 0, 0, 60, 1 union all --Ice
select 29, 1, 0, null, 0, 0, 60, 1 union all --Barren
select 30, 1, 0, null, 0, 0, 60, 1 union all --Volcano
select 31, 1, 0, null, 0, 0, 60, 1 union all --Toxic
select 32, 1, 0, null, 0, 0, 60, 1 union all --Gasgiant
select 33, 1, 0, null, 0, 0, 60, 1 union all --Wanderer
select 34, 1, 0, null, 0, 0, 20, 1 union all --M Mond
select 35, 1, 0, null, 0, 0, 20, 1 union all --Wanderer
select 36, 1, 0, null, 0, 0, 20, 1 union all --L  Mond
select 37, 1, 0, null, 0, 0, 20, 1 union all --N  Mond
select 38, 1, 0, null, 0, 0, 20, 1 union all --G
select 39, 1, 0, null, 0, 0, 20, 1 union all -- K
select 40, 1, 0, null, 0, 0, 20, 1 union all --H 
select 41, 1, 0, null, 0, 0, 20, 1 union all --X
select 42, 1, 0, null, 0, 0, 20, 1 union all --Toxic Mond
select 43, 1, 0, null, 0, 0, 20, 1 union all --Gasriese
select 44, 1, 0, null, 0, 0, 20, 1 union all --Asteroidenmond
select 45, 1, 100, 1, 100, 0, 0, 2 union all
select 46, 1, 100, 1, 100, 0, 0, 0 union all
select 47, 1, 100, 1, 100, 0, 0, 0 union all
select 48, 1, 100, 1, 100, 0, 0, 0 union all
select 50, 1, 100, 1, 100, 0, 0, 2 union all
select 51, 1, 100, 1, 100, 0, 0, 0 union all
select 52, 1, 100, 1, 100, 0, 0, 0 union all
select 53, 1, 100, 1, 100, 0, 0, 0 union all
select 55, 1, 100, 1, 100, 0, 0, 2 union all
select 56, 1, 100, 1, 100, 0, 0, 0 union all
select 57, 1, 100, 1, 100, 0, 0, 0 union all
select 58, 1, 100, 1, 100, 0, 0, 0 union all
select 80, 2, 0, null, 0, 0, 10, 10			--nebula
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
INSERT INTO [dbo].[SurfaceTiles] (id, [name], objectId) VALUES 
(1,  'Gras', 101)
,(2, 'Wald', 102)
,(3, 'Wasser', 103)
,(4, 'Gebirge', 104)
,(5, 'Wüste', 105)
,(6, 'Eis', 106);
go





SET IDENTITY_INSERT [dbo].[Research] ON
INSERT into [dbo].[Research] 
	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 

select 1, N'Base research', N'1.gif', N'Recovery of the mothership database.', 3, 402, 166,0,0,4 union all

--Level 1
select 9, N'Ecosytem Adaption I', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 2, 623, 624,1,1,0 union all
select 2000, N'Modules', N'1.gif', N''						, 8, 164, 517, 2 , 1, 3  union all
select 152, N'BluePrints: Metal Working', N'1.gif', N'', 6, 158, 492,1,1,9 union all
select 400, N'Space travel', N'1.gif', N'', 5, 265, 493, 2 , 1 , 12 union all

--Level 2
select  2013, N'Colonization I', N'1.gif', N'Außenposten module.', 15, 88, 521, 2 , 2 , 1 union all
select  2001, N'Cargo', N'1.gif', N'', 22, 220, 518,  2 , 2 , 3 union all
select  2002, N'Scanner', N'1.gif', N'', 15, 222, 528, 2 , 2 , 5 union all
select  501, N'Outpost'	, N'1.gif'	  , N''	, 30, 585, 585	, 2	, 2	, 11 union all
--INSERT into [dbo].[Research] 
	  --([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 4002, N'Fleet Command I', N'1.gif', N''		, 20	, 553		, 558				, 4				, 2				, 13  union all

--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
--Level 3
select 112, N'Warehouse construction plan', N'1.gif', N'', 30, 162, 491,1,3,3  union all
select 51, N'PlaneteryScanner', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 25, 382, 490, 1, 3, 5 union all
select 1010, N'Special Ressource Analysis', N'1.gif', N'', 12, 667, 669, 1, 3, 9 union all
select 2003, N'Ship Defenses I', N'1.gif', N'Simple ship defenses.', 45, 99, 519, 2 , 3 , 12 union all
select 2005, N'Ship Weapons I', N'1.gif', N'Simple ship weapons.', 45, 98, 520, 2 , 3 , 14 union all

--Level 4
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]								, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3002, N'Administration I', N'1.gif', N''									, 200		, 472		, 477				, 4				, 4				, 1  union all
select 8, N'Kommunikation Center', N'1.gif', N'Erlaubt den Bau es Kraftwerks'	, 45		, 53		, 488				,1				,4				,5  union all
select 410, N'SpaceMarines Center', N'1.gif', N'Erlaubt den Bau es Kraftwerks'	, 80		, 686		, 687				,1				,4				,13 union all

--Level 5
select 2, N'Wasserkraftwerk', N'1.gif', N'Erlaubt den Bau des Wasserkraftwerkes', 220, 92, 484,1,5,0 union all
select 71, N'Superconductors', N'1.gif', N'Erlaubt den Bau des Kraftwerks'		, 260, 656, 657, 1, 5, 2 union all
select 1030, N'Special Ressource Processing', N'1.gif', N'', 16, 668, 670, 1, 5, 9 union all
select 402, N'Corvette', N'1.gif', N'', 160, 173, 494, 2 , 5 , 14 union all

--Level 6
select 3, N'TreibstoffRaffinerie', N'1.gif', N'Erlaubt den Bau der TreibstoffRaffinerie', 360, 93, 485,1,6,4  union all
select 1060, N'Holmium Generator', N'1.gif', N'', 40, 660, 512, 3, 6, 6 union all
select 1052, N'Scandium Shield I', N'1.gif', N'', 80, 386, 514, 3, 6, 8 union all
select 1053, N'Yttrium Modules I', N'1.gif', N'', 60, 391, 515, 3, 6, 10 union all
select 1054, N'Lutetium Modules I', N'1.gif', N'', 30, 392, 516, 3, 6, 12  union all

--Level 7
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3003, N'Administration II', N'1.gif', N''	, 550	, 473		, 478				, 4				, 7				, 1		 union all
select 1062, N'Scandium Tools', N'1.gif', N'', 120, 662, 514, 3, 7, 8  union all
select 1063, N'Yttrium Cloning Lab', N'1.gif', N'', 100, 663, 515, 3, 7, 10 union all
select 1064, N'Lutetium Ecosystem Improvements', N'1.gif', N'', 110, 664, 516, 3, 7, 12  union all

--Level 8
select 2023, N'Colonization II', N'1.gif', N'Colonization module.', 350, 468, 522, 2 , 8 , 0 union all
--INSERT into [dbo].[Research] 
--	  ([id], [name],							[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 1061, N'Terbium Factory Improvements',			N'1.gif',			N'',	160,	661,		513,				3,				8,				6 	union all
select 4003, N'Fleet Command II',						N'1.gif',			N''		, 250	, 554		, 559				, 4				, 8				, 9		 union all

--Level 9
select 50, N'Verb. Baumaterial', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 600, 350, 489, 1, 9, 4 union all

--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 1051, N'Terbium Hull I', N'1.gif', N'', 130, 385, 513, 3, 9, 8  union all
select 1050, N'Holmium Laser I', N'1.gif', N'', 140, 387, 512, 3, 9, 10  union all
select 403, N'Frigatte', N'1.gif', N'', 320, 174, 495, 2 , 9 , 14  union all

--Level 10
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3004, N'Administration III', N'1.gif', N''	, 880	, 474		, 479				, 4				, 10				, 1  union all
select 5, N'Kraftwerk', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 430, 95, 487,1,10,3 union all
select 55, N'Aquafarming', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 370, 690, 691,1,10,5 union all
select 502, N'Space station'	, N'1.gif'		, N''			, 380			, 59		, 558				, 2					, 10			, 7	 union all

--Level 11
--INSERT into [dbo].[Research] 
--	  ([id], [name]				,[objectimageUrl]		, [description]						, [cost]		, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 52, N'Arcology'			, N'1.gif'				, N'Erlaubt den Bau des Kraftwerks'	, 640			, 715		, 716				, 1				, 11			, 0 union all
select 72, N'Superconductors II', N'1.gif', N'Erlaubt den Bau des Kraftwerks', 720, 666, 657, 1, 11, 3 union all
select 2100, N'Modules II', N'1.gif', N'', 1000, 171, 523,2,11,9 union all

--Level 12
select 2102, N'Scanner II', N'1.gif', N'', 575, 381, 525, 2 , 12 , 6 union all
select 2101, N'Cargo II', N'1.gif', N'', 550, 376, 524,  2 , 12 , 8 union all
select 2105, N'Ship Weapons II', N'1.gif', N'Better ship weapons.', 620, 168, 527, 2 , 12 , 10 union all
select 2103, N'Ship Defenses II', N'1.gif', N'Better ship defenses.', 620, 167, 526, 2 , 12 , 12 union all

--Level 13
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]		, [cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3005, N'Administration VI', N'1.gif', N''		, 1200	, 475		, 480				, 4				, 13				, 1			union all
select 80, N'Superdense Materials', N'1.gif', N''		, 1200	, 693		, 694				, 4				, 13				, 4			union all
select 404, N'Destroyer', N'1.gif',			N''			, 800	,118		, 496				, 2				, 13				, 14		union all

--Level 14
--INSERT into [dbo].[Research] 
--	  ([id]	, [name],[objectimageUrl], [description]					, [cost]	, [label]	, [descriptionLabel]	, [researchType], [treeColumn]	, [treeRow]) 
select 2033	, N'Colonization III', N'1.gif', N'Colonization module.'	, 1000		, 713		, 695					, 2				, 14			,	0 union all
select 81	, N'Pressure Dome', N'1.gif', N'Colonization module.'		, 1300		, 696		, 697					, 2				, 14			,	2 union all
select 2200	, N'Modules III', N'1.gif', N''								, 1500		, 699		, 700					,2				, 14			,	4 union all
select 503	, N'Star base'		, N'1.gif'		, N''					, 1000		, 584		, 559					, 2				, 14			,	9  union all
select 4004	, N'Fleet Command III', N'1.gif', N''						, 800		, 555		, 560					, 4				, 14			,	14  union all

--level 15
--INSERT into [dbo].[Research] 
--	  ([id], [name],			[objectimageUrl], [description]	, [cost]		, [label]	, [descriptionLabel], [researchType]	, [treeColumn]	, [treeRow]) 
select 3006, N'Administration V', N'1.gif', N''					, 1800			, 476		, 481				, 4					, 15				, 1		union all
select 2500, N'Special Ressources Modules', N'1.gif', N''		, 1200			, 718		, 719				,2					, 15				, 4 union all
select 504, N'Star fortress'	, N'1.gif'		, N''			, 1600			, 127		, 560				, 2					, 15				, 9 union all
select 405, N'Cruiser', N'1.gif', N''							, 1200			, 58		, 497				, 2					, 15				, 14  union all
	
--level 16
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 5000, N'Transcendence Collab', N'1.gif'  , N'', 600		, 592		, 593				, 4				, 16				, 6		union all
select 4005, N'Fleet Command VI', N'1.gif', N''		 , 1600		, 556		, 561				, 4				, 16				, 11 union all
select 406, N'Battleship', N'1.gif', N''			 , 1600		, 124		, 498				, 2				, 16				, 14  union all

--level 17
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]	, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 5001, N'Transcendence', N'1.gif'	, N''		, 1200	, 590			, 591				, 4				, 17				, 9 union all
select 4006, N'Fleet Command V', N'1.gif', N''		, 2200	, 557			, 562				, 4				, 17				, 11 union all
select 407, N'Superbattleship', N'1.gif', N''		, 2200	, 125			, 499				, 2				, 17				, 14

/*
with toUpdate ([id], [name],			[objectimageUrl], [description]	, [cost]		, [label]	, [descriptionLabel], [researchType]	, [treeColumn]	, [treeRow])  as (

---
)
update res set res.treeColumn = toUpdate.treeColumn, res.treeRow = toUpdate.treeRow,
res.cost = toUpdate.cost
from dbo.Research as res
inner join toUpdate
on toUpdate.id = res.id
*/


--INSERT [dbo].[Research] ([id], [name], [objectimageUrl], [description], [cost], [label], [descriptionLabel], [researchType], [treeColumn], [treeRow]) VALUES (900, N'Kolonieren Wüste', N'1.gif', N'', 2000, 125, 500, 2 , 0 , 8)


SET IDENTITY_INSERT [dbo].[Research] OFF
go


--delete from dbo.ResearchGain 
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
select 4002		  ,0			,0			,0			, 0			,0				,0				,0		,0				,25			,200		union all
select 4003		  ,0			,0			,0			, 0			,0				,0				,0		,0				,75			,201		union all
select 4004		  ,0			,0			,0			, 0			,-10			,-10			,0		,0				,100		,202		union all
select 4005		  ,0			,0			,0			, 0			,-15			,-15			,0		,0				,125		,203		union all
select 4006		  ,0			,0			,0			, 0			,-20			,-20			,0		,0				,150		,204	



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

update [dbo].[Modules] set [level] = 2 where id = 23

--space stations
INSERT into [dbo].[Modules] 
	([id], [level], [name],			[descriptionLabel], [goodsId],	[label])  
select 499, 1,	N'Outpost hull',		1,					2499,		586 union all
select 500, 2,	N'Space station hull',	1,					2500,		587 union all
select 501, 3,	N'Star base hull',		1,					2501,		588 union all
select 502, 4,	N'Star fortress hull',	1,					2502,		589 union all
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


SET IDENTITY_INSERT [dbo].[Modules] off





/****** Object:  Table [dbo].[ShipTemplate]    Script Date: 12/06/2013 21:56:05 ******/


/****** Object:  Table [dbo].[Buildings]    Script Date: 12/06/2013 21:56:05 ******/

--I Level 0-1
--delete from [dbo].[Buildings] 
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing, storage) VALUES (1, N'Koloniezentrale I', 151, NULL, 0, 0, 1, 43, 0, 140, 5000)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing, storage) VALUES (30, N'Koloniezentrale II', 149, NULL, 0, 0, 1, 43, 0, 40, 5000)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing, storage) VALUES (31, N'Koloniezentrale III', 150, NULL, 0, 0, 1, 43, 0, 70, 5000)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (15, N'Forschungslabor', 165, NULL, 1, 0, 1, 120, 6)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (9, N'Baumaterialfabrik', 158, NULL, 1, 0, 1, 50, 4)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (10, N'Sonnenkraftwerk', 159, NULL, 1, 0, 1, 51, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, assemblyModifier) VALUES (19, N'Montagehalle', 163, NULL, 1, 0, 2, 153, 4, 1, 20)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (16, N'Modulfabrik', 169, N'ShipModulesSimple.js', 1, 0, 1, 121, 4,1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (3, N'Farm', 153, NULL, 1, 0, 1, 45, 3)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing) VALUES (18, N'Häuser', 162, null, 1, 0, 1, 155, 3, 40)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (2, N'Mine', 152, NULL, 1, 0, 1, 44, 4)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (20, N'Hochofen', 164, NULL, 1, 0, 1, 161, 5)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (17, N'Schiffswerft', 154, N'SpaceportB.js', 1, 0, 1, 122, 4,1)



--II Specials
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (1030, N'Mine Holmium' , 152, NULL, 1, 0, 2, 363, 7, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (1031, N'Mine Terbium' , 152, NULL, 1, 0, 2, 364, 7, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (1032, N'Mine Scandium', 152, NULL, 1, 0, 2, 365, 7, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (1033, N'Mine Yttrium' , 152, NULL, 1, 0, 2, 366, 7, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (1034, N'Mine Lutetium', 152, NULL, 1, 0, 2, 367, 7, 1)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (1040, N'Holmium Hütte',  158, NULL, 1, 0, 2, 357, 8)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (1041, N'Terbium Hütte',  158, NULL, 1, 0, 2, 358, 8)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (1042, N'Scandium Hütte', 158, NULL, 1, 0, 2, 359, 8)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (1043, N'Yttrium  Hütte', 158, NULL, 1, 0, 2, 360, 8)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (1044, N'Lutetium Hütte', 158, NULL, 1, 0, 2, 361, 8)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, energyModifier) VALUES (180, N'HolmiumGenerator', 180, NULL, 1, 0, 2, 660, 1, 1, 30)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, assemblyModifier, productionModifier) VALUES (181, N'ScandTools', 181, NULL, 1, 0, 2, 661, 8, 1, 25,10)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, productionModifier) VALUES (182, N'TerbiumFact', 182, NULL, 1, 0, 2, 662, 4, 1, 20)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, housingModifier, foodModifier) VALUES (183, N'YttriumCloning', 183, NULL, 1, 0, 2, 663, 4, 1, 10, 25)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, oncePerColony, housingModifier, foodModifier) VALUES (184, N'LutEcosystem', 184, NULL, 1, 0, 2, 664, 2, 1, 25, 10)



/*

INSERT [dbo].[ObjectDescription] ([id], [name], [objectimageUrl], [moveCost], [damage], [label]) VALUES (187, N'', N'AdvBuildingMaterial.png', 1, 0, 698)
*/

-- III level 2 - 11
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (11, N'Wasserkraftwerk', 159, NULL, 1, 0, 3, 92, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, storage) VALUES (12, N'Lager', 160, NULL, 1, 0, 3, 52, 4, 7500)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (51, N'PlanetaryScanner', 168, NULL, 1, 0, 3, 382, 7, 1)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (6, N'TreibstoffRaffinerie', 166, NULL, 1, 0, 3, 47, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (22, N'synthetic materials plant', 177, NULL, 1, 0, 3, 621, 5)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (14, N'Kraftwerk', 170, NULL, 1, 0, 3, 95, 2)


INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (52, N'Aqua Farm', 185, NULL, 1, 0, 3, 692, 3)


-- IV Level 11...
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing) VALUES (55, N'Arcology', 188, NULL, 1, 0, 4, 717, 2, 70)


INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (50, N'Verb. Baumaterialfabrik', 171, NULL, 1, 0, 4, 362, 6)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (8, N'Kommunikationszentrum', 161, N'CommCentre.js', 1, 0, 4, 53,5 ,1)

INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (53, N'Neutronium reactor', 186, NULL, 1, 0, 4, 711, 7)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel, housing) VALUES (54, N'Pressure Dome', 187, NULL, 1, 0, 4, 698, 2, 60)

--delete from [dbo].[Buildings] where id = 55
--INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel ,oncePerColony) VALUES (4, N'Raumhafen', 154, N'SpaceportB.js', 1, 0, 1, 119,1 , 1)
--INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (5, N'Supplies', 155, NULL, 1, 0, 1, 65,2 )

--INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (7, N'Treibstofflager', 167, NULL, 1, 0, 2, 48, 1)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (13, N'Kundschafter', 401, N'Scout.js', 1, 1, 1, 55, 2)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (21, N'DefSat', 401, N'DefenseSat.js', 1, 1, 1, 343, 2)


-- update [Buildings] set label = 343 where id = 21
										

													
/****** Object:  Table [dbo].[BuildOptions]    Script Date: 12/06/2013 21:56:05 ******/
-- set which buildins are allowed per surfacetype
/*(1,  'Gras', 101);*/
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 3)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 4)
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 5)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 6)
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 7)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 8)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 10)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 13)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 14)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 15)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 16)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 17)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 18)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 19)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 20)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 21)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 22)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 50)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 55)


INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1040)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1041)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1042)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1043)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1044)

INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 180)  --Holmium
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 181)  --Holmium
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 182)  --Holmium
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 183)  --Holmium
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 184)  --Holmium

INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 53)  --Neutronium Reactor

--,(2, 'Wald', 102)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 13)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 15)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 16)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 18)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 17)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 19)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 20)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 22)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 50)
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (2, 53)  --Neutronium Reactor
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 55)

--,(3, 'Wasser', 103)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 11)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 52)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 54)

--,(4, 'Gebirge', 104)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 2)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 4)
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 7)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 8)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 10)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 13)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 21)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 50)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 51)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1030)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1031)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1032)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1033)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1034)
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (4, 53)  --Neutronium Reactor

--,(5, 'Wüste', 105)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 6)
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 7)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 8)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 10)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 13)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 21)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 50)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 51)

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 1040)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 1041)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 1042)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 1043)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 1044)

INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (5, 53)  --Neutronium Reactor
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 55)

--,(6, 'Eis', 106)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 8)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 13)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 17)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 19)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 20)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 50)
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (6, 53)  --Neutronium Reactor

/****** Object:  Table [dbo].[BuildingProductions]    Script Date: 12/06/2013 21:56:05 ******/
--sets which goods are consumed and produced by active buildings
-- delete from [BuildingProductions]
--colony center:
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1, 1, 20) --  building material
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1, 2, 12) -- food
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1, 6, 20) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1, 7, 30)  --assemby points

--Mine
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (2, 5, 10) -- Mine		
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (2, 6, -10) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (2, 8, -5)  -- population

--Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 2, 5) --Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 6, -5)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 8, -5)  -- population

--INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (4, 4, -3) --Raumhafen

/*
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (5, 1, -5)-- Supplies
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (5, 3, 3)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (5, 5, -5)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (5, 6, -5)
*/

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 4, 10)  --Treibstoffraffinerie erzeugt Fuel
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 6, -10)  -- E
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 8, -5)  -- population


--delete from [BuildingProductions] where [buildingId] = 22
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 1, 10)  --N'Baumaterialfabrik',  + BM
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 6, -10)  --- Energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 8, -8)  --- Pop

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (10, 6, 30)	--N'Sonnenkraftwerk',-> Energie für drei Standard-Gebäude 
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (10, 8, -3)   -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (11, 6, 35) --N'Wasserkraftwerk', 
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (11, 8, -5)  -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 4, -20) -- Kraftwerk  verbraucht treibstoff
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 6, 150)  -- , erzeugt E
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 8, -10)  -- benötigt Pop

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (15, 6, -10) --N'Forschungslabor',  
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (15, 8, -15)  -- verbraucht Energy + Population

-- Häuser
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (18, 6, -10)	-- Häuser - energy

--Montagehalle
--delete from [dbo].[BuildingProductions] where [buildingId] = 19
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 6, -10) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 8, -15) -- population
--INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 7, 0)  --assembly points

--Hochofen
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 6, -20) -- Hochofen energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 8, -10) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 5, -20) -- erz
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 10, 10) -- Stahl
--delete from [dbo].[BuildingProductions] where [buildingId] = 20 ([buildingId], [goodsId], [amount]) VALUES (20, 10, 10) -- Stahl

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 6, -10) -- Synthetic material plant -  energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 8, -6) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 4, -10) -- erz
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 11, 11) -- Synth. Material

--colony center 2:
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (30, 1, 15) --  building material
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (30, 2, 8) -- food
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (30, 6, 10) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (30, 7, 14)  --assemby points

--colony center 3:
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (31, 1, 15) --  building material
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (31, 2, 12) -- food
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (31, 6, 10) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (31, 7, 24)  --assemby points

--Verb. Baumaterialfabrik
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (50, 6, -20) -- Verb. Baumaterialfabrik
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (50, 8, -10) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (50, 1, -20) --  -Baumaterial
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (50, 10,-20) --  -Stahl
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (50, 50, 20) --  +Verb. Baumaterial

--Aqua farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (52, 2, 7) --Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (52, 6, -15)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (52, 8, -10)  -- population



 --Neutronium Reactor
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 6, -60) -- Verb. Baumaterialfabrik / Energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 8, -15) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 1, -25) --  -Baumaterial
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 10,-25) --  -Stahl
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 50,-10) --  -Verb. Baumaterial
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (53, 60, 20) --  +Neutronium

--Pressure Dome
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (54, 6, -25)

--special Ressources Mines
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1030, 1030, 20) -- Mine Holmium	-> Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1030, 6, -20)  -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1030, 8, -10)  -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1031, 1031, 20) -- Mine Terbium	-> Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1031, 6, -20)  -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1031, 8, -10)  -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1032, 1032, 20) -- Mine Scandium	-> Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1032, 6, -20)  -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1032, 8, -10)  -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1033, 1033, 20) -- Mine Yttrium	-> Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1033, 6, -20)  -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1033, 8, -10)  -- population

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1034, 1034, 20) -- Mine Lutetium	-> Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1034, 6, -20)  -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1034, 8, -10)  -- population

----
-- Special Ressources Processing
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 1030, -10) -- Hütte Holmium	-> - Erz Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 1040, 10) -- Hütte Holmium	-> - Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 1031, -10) -- Hütte Terbium	-> - Erz Terbium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 1041, 10)	-- Hütte Terbium	-> +  Terbium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 1032, -10) -- Hütte Scandium	-> - Erz Scandium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 1042, 10)	-- Hütte Scandium	-> +  Scandium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 1033, -10) -- Hütte Yttrium	-> - Erz Yttrium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 1043, 10)	-- Hütte Yttrium	-> +  Yttrium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 1034, -10) -- Hütte Lutetium	-> - Erz Lutetium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 1044, 10)	-- Hütte Lutetium	-> +  Lutetium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (180, 1040, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (181, 1041, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (182, 1042, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (183, 1043, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (184, 1044, -10)  --Holmium

/****** Object:  Table [dbo].[BuildingCosts]    Script Date: 12/06/2013 21:56:05 ******/
-- Baukosten
-- delete from [BuildingCosts] where [buildingId] = 11
--Koloniezentrale
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1, 2013, 1) -- Koloniezentrale benötigt 1 Colony module

--delete from  [dbo].[BuildingCosts] where [buildingId] = 10 
--Baumaterialfabrik
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (9, 1, 40)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (9, 7, 20)


--solarkraftwerk
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (10, 1, 35) --
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (10, 7, 15) 


--Mine
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (2, 1, 60) -- Mine - BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (2, 7, 25) -- Mine - Construction Points
--delete from  [dbo].[BuildingCosts] where [buildingId] = 6 and goodsId = 3 ([buildingId], [goodsId], [amount]) VALUES (2, 3, 10) -- Munition
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (2, 4, 40) -- Treibstoff


--Metall - Hochofen - Furnace
-- delete from [BuildingCosts] where [buildingId] = 15
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (20, 1, 50) --BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (20, 7, 25) --construction



--Research Facility
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (15, 1, 45)  
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (15, 7, 20) 


--Modulfabrik
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (16, 1, 40)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (16, 7, 10)

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (17, 1, 50) --raumwerft


--Häuser
--delete from [BuildingCosts] where [buildingId] = 18
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (18, 1, 50)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (18, 7, 15)


--Farm
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (3, 1, 45) 
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (3, 7, 15)

--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (3, 2, 5)  --Nahrung

--raumhafen
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (4, 1, 40) -- raumhafen
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (4, 7, 40)
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (4, 4, 10)  -- treibstoff

/*
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (5, 1, 20)  --Supplies
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (5, 4, 5)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (5, 5, 5)
*/

--Raffinerie - HydroCarbon
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 1, 80) -- BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 10, 120) -- Metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 7, 75) -- Raffinerie
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (7, 1, 20)
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (8, 1, 10)





--Wasserkraftwerk
-- delete from [BuildingCosts] where [buildingId] = 11
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 7, 45) --assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 1, 75) --BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 10, 15) --metall

--Lager
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (12, 1, 20)

--Scout
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (13, 2000, 1) 

--kraftwerk
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (14, 1, 80)   --kraftwerk
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (14, 7, 120)  --Produktion
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (14, 10, 30)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (14, 11, 30)  -- kunststoffe



--Verb. Baumaterialfabrik
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (50, 7,  90) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (50, 1,  50) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (50, 10, 10) --  -Stahl
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (50, 11, 30)  -- kunststoffe

--Planetary Scanner
-- delete from [BuildingCosts] where [buildingId]  = 51
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (51, 7,  100) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (51, 1,  240) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (51, 10, 60)  --  -Stahl


--Aqua farm
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (52, 7,  55) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (52, 1,  40) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (52, 10, 20) --  -Stahl
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (52, 11, 60)  -- kunststoffe
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (52, 50, 20)  -- Verb. Baumaterial



--Neutronium Rector
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (53, 7,  150) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (53, 1,  60) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (53, 10, 50) --  -Stahl
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (53, 11, 40)  -- kunststoffe
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (53, 50, 40)  -- Verb. Baumaterial

--Pressure dome
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 7,  80) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 1,  20) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 10, 60) --  -Stahl
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 11, 30)  -- kunststoffe
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 50, 50)  -- Verb. Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (54, 60, 20)  -- Neutronium


--Arcology 
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (55, 7,  70) -- Assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (55, 1,  30) --  -Baumaterial
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (55, 10, 70) --  -Stahl
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (55, 11, 40)  -- kunststoffe



--Assembly Plant
--delete from [BuildingCosts] where [buildingId] = 51
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (19, 1, 40)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (19, 7, 20)   --montagepunkte
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (19, 10, 20)  --metall




INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (21, 2016, 1) --defense satellite


--synthetic materials plant
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (22, 1, 90) --BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (22, 7, 60) --construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (22, 10, 60)  --metall


--special ressource mines
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1030, 1, 20) -- Mine Holmium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1030, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1030, 7, 30) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1031, 1, 20) -- Mine Terbium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1031, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1031, 7, 30) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1032, 1, 20) -- Mine Scandium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1032, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1032, 7, 30) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1033, 1, 20) -- Mine Yttrium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1033, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1033, 7, 30) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1034, 1, 20) -- Mine Lutetium	-> BM 
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1034, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1034, 7,  30) -- construction


INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1040, 1, 50) -- Plant Holmium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1040, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1040, 7, 60) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1041, 1, 20) -- Plant Terbium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1041, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1041, 7, 50) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1042, 1, 20) -- Plant Scandium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1042, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1042, 7, 50) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1043, 1, 20) -- Plant Yttrium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1043, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1043, 7, 50) -- construction

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1044, 1, 20) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1044, 10, 25)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (1044, 7, 50) -- construction


INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (180,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (180, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (180, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (180, 1040, 10)  --Holmium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 1042, 10)  --Holmium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 1042, 10)  --Holmium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 1043, 10)  --Holmium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 1044, 10)  --Holmium

/****** Object:  Table [dbo].[ShipHulls]    Script Date: 12/06/2013 21:56:05 ******/
--delete from   [ShipHulls] where id = 4
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (0, 0, N'Debris', 0, 440, 0, N'', 60)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (1, 0, N'Scout', 0, 410, 5, N'ScoutHull.png', 55)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (2, 0, N'Corvette', 0, 402, 7, N'401Template.gif', 100)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (3, 0, N'Fregatte', 0, 403, 9, N'401Template.gif', 101)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (4, 0, N'Destroyer', 0, 404, 12, N'401Template.gif', 118)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (5, 0, N'Cruiser', 0, 403, 15, N'401Template.gif', 58)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (6, 0, N'Starship', 0, 403, 19, N'401Template.gif', 123)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (7, 0, N'Battleship', 0, 405, 24, N'401Template.gif', 124)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (8, 0, N'Superbattleship', 0, 405, 28, N'401Template.gif', 125)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (199, 1, N'Outpost', 0, 430, 3, N'401Template.gif', 585)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (200, 1, N'Spacestation', 0, 431, 7, N'SpaceStation1_60.png', 59)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (201, 1, N'Starbase', 0, 434, 12, N'401Template.gif', 126)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (202, 1, N'Star Fortress', 0, 437, 21, N'401Template.gif', 127)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (220, 1, N'Transcendence  Construct', 0, 460, 0, N'401Template.gif', 594)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (221, 0, N'Transcendence  Builder', 0, 461, 0, N'401Template.gif', 595)

--truncate table [ShipHullsImages]
INSERT into [dbo].[ShipHullsImages]
					-- on map:		-- in designer:  
(	[id],[shipHullId], objectId , templateImageId, templateModulesXoffset, templateModulesYoffset) 
select 0,		0 ,			440 ,			 501 ,					   0 ,						0 union all --Debris
select 1,		1 ,			411 ,			 511 ,					   0 ,						0 union all  --Scout 3
select 2,		1 ,			450 ,			 550 ,					  50 ,					   10 union all  --defense satellit
select 3,		2 ,			402 ,			 512 ,					   0 ,					  -40 union all  --Corvette
select 4,		3 ,			403 ,			 513 ,					  23 ,						0 union all  -- fregatte
select 5,		4 ,			404 ,			 504 ,					  49 ,					   60 union all   -- destroyer
select 6,		5 ,			405 ,			 501 ,					   0 ,						0 union all
select 7,		6 ,			406 ,			 501 ,					   0 ,						0 union all
select 8,		7 ,			407 ,			 501 ,					   0 ,						0 union all
select 9,		8 ,			408 ,			 501 ,					   0 ,						0 union all
select 10,	  200 ,			431 ,			 531 ,					  73 ,						0 union all
select 11,    201 ,			434 ,			 534 ,					   0 ,						0 union all
select 12,    202 ,			437 ,			 537 ,					   0 ,						0 union all
select 13,      1 ,			410 ,			 510 ,					   0 ,						0 union all		-- Scout 2
select 14,    199 ,			430 ,			 530 ,					  49 ,						6 union all --spacestation 0 Outpost
select 15,    220 ,			460 ,			 560 ,					  0 ,						0 union all
select 16,    221 ,			461 ,			 561 ,					  0 ,						0
--scout 5 
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 3, 3)

--corvette 7
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (2, 3, 4)

-- fregatte 9
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 3, 4)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (3, 4, 4)


-- destroyer 11
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 3, 4)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 4, 4)

INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 1, 5)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (4, 3, 5)

-- cruiser 14

-- star ship  17

-- battle ship  20

-- super battle 24

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
select		200	,	1,		4  union all
select		200	,	2,		2 union all
select		200	,	2,		3 union all
select		200	,	2,		4 union all
select		200	,	3,		3 union all
select		200	,	3,		4 



--star base 12 
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		200	,	1,		3  union all
select		200	,	1,		4  union all
select		200	,	2,		2 union all
select		200	,	2,		3 union all
select		200	,	2,		4 union all
select		200	,	3,		3 union all
select		200	,	3,		4 

--star fortress  18
INSERT [dbo].[ShipHullsModulePositions] 
([shipHullId], [posX], [posY])  
select		199	,	1,		3  union all
select		199	,	2,		2  union all
select		199	,	3,		3



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
select		1,		2,		-1,			 100,			   80,				0,				2,			80,				0,			    0,				0,			    0,			0,				2 ,			1.0		union all -- Scout
select		2,		3,		-3,			150,			   60,				0,				10,			20,				0,				0,				0,				0,			0,				1 ,			0.8		union all
select		3,		-1,		-5,			200,			   40,				0,				50,			60,				0,				0,				0,				0,			0,				1 ,			0.7		union all --fregatte
select		4,		-2,		-7,			250,			   30,				0,				100,		60,				0,				0,				0,				0,			0,				1 ,			0.6		union all  -- destr
select		5,		-3,		-9,			300,			   20,				10,				150,		60,				0,				0,				0,				0,			0,				1 ,			0.5		union all  -- cruiser
--
select		6,		-10,	-11,		350,			   10,				10,				200,		50,				0,				0,				0,				0,			0,				0 ,			0.4		union all -- starship
--
select		7,		-15,	-18,		450,			   10,				10,				200,		50,				0,				0,				0,				0,			0,				0 ,			0.35	union all -- battle
select		8,		-20,	-25,		600,			    0,				0,				240,		50,				0,				0,				0,				0,			0,				0 ,			0.2		union all -- superbattle
select		199,	3,		4,			200,				0,				0,				100,		100,			0,				0,				0,				0,			0,				1 ,			0.0		union all  
select		200,	5,		6,			400,			    0,				0,				100,		100,			0,				0,				0,				0,			0,				1 ,			0.0		union all
select		201,	8,		10,			550,			    0,				0,				200,		200,			0,				0,				0,				0,			0,				1 ,			0.0		union all
select		202,	13,		16,			800,			    0,				0,				400,		400,			0,				0,				0,				0,			0,				1 ,			0.0     union all
select		220,	1,		100,		3000,				0,				50,				0,			0,				0,				0,				0,				0,			0,				1 ,			0.0     union all
select		221,	1,		10,			100,				0,				5,				0,			0,				5,				6,				5,				15,			0,				0 ,			1.0

/****** Object:  Table [dbo].[ShipHullsCosts]    Script Date: 12/06/2013 21:56:05 ******/


-- standard Ship hulls
-- delete from [dbo].[ShipHullsCosts] where [shipHullId]  < 4
INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		1,			1,		80	union all --Scout : 80 BM, 40 PP,  50 metal
select		1,			7,		40	union all  -- Assembly points 
select		1,			10,		50	union all  --  metal



select		2,			1,		170	union all --Corvette : 30 BM, 50 PP, 
select		2,			7,		70	union all
select		2,			10,		90	union all  --  metal

select		3,			1,		250	union all --Fregatte : 30 BM, 50 PP, 
select		3,			7,		110	union all
select		3,			10,		220	union all  --  metal
select		3,			11,		80	union all -- synth

select		4,			1,		200	union all --Destroyer : 30 BM, 50 PP, 
select		4,			7,		160	union all
select		4,			10,		280	union all  --  metal
select		4,			11,		120	union all -- synth
select		4,			50,		100	union all -- adv building

select		5,			1,		300	union all --Cruiser : 30 BM, 50 PP, 
select		5,			7,		220	union all
select		5,			10,		400	union all  --  metal
select		5,			11,		220	union all -- synth
select		5,			50,		160	union all -- adv building

select		6,			1,		400	union all --Star ship : 30 BM, 50 PP, 
select		6,			7,		290	union all
select		6,			10,		550	union all  --  metal
select		6,			11,		320	union all -- synth
select		6,			50,		220	union all -- adv building

select		7,			1,		600	union all --battleship : 30 BM, 50 PP, 
select		7,			7,		400	union all
select		7,			10,		680	union all  --  metal
select		7,			11,		400	union all -- synth
select		7,			50,		280	union all -- adv building


select		8,			1,		900		union all -- super battleship : 30 BM, 50 PP, 
select		8,			7,		500 union all
select		8,			10,		1200	union all  --  metal
select		8,			11,		600	union all -- synth
select		8,			50,		480	  -- adv building

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
select		221,			1040,	20    union all --Specials
select		221,			1041,	20    union all
select		221,			1042,	20    union all
select		221,			1043,	20    union all
select		221,			1044,	20    


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
go


----------------------------------------------------------------------------------

--insert neutral user 0
INSERT [dbo].[Users] ([id], [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates]) VALUES (0, N'Niemand', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0)

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