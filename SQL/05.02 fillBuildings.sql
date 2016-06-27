
-- Table [dbo].[Buildings]    

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

--Focus
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (23, N'Imp Baumaterialfabrik', 189, NULL, 1, 0, 1, 897, 4)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (24, N'Imp Landwirtschaft', 190, NULL, 1, 0, 1, 898, 3)
INSERT [dbo].[Buildings] ([id], [name], [objectId], [BuildingScript], [isBuildable], [visibilityNeedsGoods], [groupId], [label], prodQueueLevel) VALUES (25, N'Imp Hochofen', 191, NULL, 1, 0, 1, 899, 5)


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
										

													
-- truncate Table [dbo].[BuildOptions]    
-- set which buildins are allowed per surfacetype
--(1,  'Gras', 101);
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1) --Koloniezentrale I
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 3)  --Farm
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 4)  -- Raumhafen
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 5)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 6)  -- TreibstoffRaffinerie
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 7)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 8)   -- Kommunikationszentrum
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 9)  -- Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 10) -- Sonnenkraftwerk
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 12) -- Lager
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 13) -- Kundschafter
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 14) -- Kraftwerk
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 15) -- Forschungslabor
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 16) -- Modulfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 17) -- Schiffswerft
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 18) -- Häuser
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 19) -- Montagehalle
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 20) -- Hochofen
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 21) -- DefSat
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 22) -- synthetic materials plant

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 24) -- Imp Farm
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 25) -- Imp Hochofen

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 50) -- Verb. Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 55) -- Arcology


INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1040)  --Holmium Hütte
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1041)  -- Terbium Hütte
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1042)  -- Scandium Hütte
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1043)  -- Yttrium  Hütte
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (1, 1044)  --Lutetium Hütte

INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 180)  --HolmiumGenerator
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 181)  --ScandTools
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 182)  --TerbiumFact
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 183)  --YttriumCloning
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 184)  --LutEcosystem

INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (1, 53)  --Neutronium Reactor

--,(2, 'Wald', 102)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 12)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 15)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 16)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 18)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 17) --Schiffswerft
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 19)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 20)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 22)

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 24) -- Imp Farm
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 25) -- Imp Hochofen

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 50)
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (2, 53)  --Neutronium Reactor
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (2, 55)

--,(3, 'Wasser', 103)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 11)  --Wasserkraftwerk
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 52)  -- Aqua Farm
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (3, 54)   -- Pressure Dome

--,(4, 'Gebirge', 104)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 2)  --Mine
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 4)  -- Raumhafen
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 8)  -- Kommunikationszentrum
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 9)  -- Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 10) -- Sonnenkraftwerk
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 12) -- Lager
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 50) -- Verb. Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 51) -- PlanetaryScanner
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1030) -- Mine Holmium
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1031)	-- Mine Terbium
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1032)	-- Mine Scandium
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1033)	-- Mine Yttrium
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 1034)	-- Mine Lutetium
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (4, 53)  --Neutronium Reactor

--,(5, 'Wüste', 105)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 6)
--INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 7)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 8)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 9)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 10)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (5, 12)
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
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 8)  --Kommunikationszentrum
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 9)   --Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 12)  --Lager
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 17)  --Schiffswerft
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 19)  --Montagehalle
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 20) -- Hochofen

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 25) -- Imp Hochofen

INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (6, 50) -- Verb. Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (6, 53)  --Neutronium Reactor

--,(7, 'Barren', 106)
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 9)  -- Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 12) -- Lager
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 14) -- Kraftwerk
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 15) -- Forschungslabor
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 22) -- synthetic materials plant
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (7, 50) -- Verb. Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId],[buildingId]) VALUES (7, 53)  --Neutronium Reactor

-- 8 Asteroid
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (8, 2)  --Mine
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (8, 12) -- Lager
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (8, 20) -- Hochofen
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (8, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (8, 25) -- Imp Hochofen


--9	Vulcanic
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (9, 2)  --Mine
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (9, 20) -- Hochofen
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (9, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (9, 25) -- Imp Hochofen

--10	Toxic
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (10, 54)   -- Pressure Dome
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (10, 23) -- Imp Baumaterialfabrik
INSERT [dbo].[BuildOptions] ([objectId], [buildingId]) VALUES (10, 25) -- Imp Hochofen

-- truncate  Table [dbo].[BuildingProductions]    
--sets which goods are consumed and produced by active buildings
-- insert into ServerEvents (eventType) select 4
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
-- update [BuildingProductions] set [amount] = 5 where [buildingId] = 3 and [goodsId] = 2
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 2, 4) --Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 6, -5)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (3, 8, -5)  -- population

--INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (4, 4, -3) --Raumhafen


--Treibstoffraffinerie
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 4, 10)  --Treibstoffraffinerie erzeugt Fuel
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 6, -10)  -- E
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (6, 8, -5)  -- population


--delete from [BuildingProductions] where [buildingId] = 22
--Baumaterialfabrik
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 1, 5)  --N'Baumaterialfabrik',  + BM
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 6, -10)  --- Energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (9, 8, -8)  --- Pop

--Sonnenkraftwerk
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (10, 6, 30)	--N'Sonnenkraftwerk',-> Energie für drei Standard-Gebäude 
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (10, 8, -3)   -- population

--Wasserkraftwerk
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (11, 6, 35) --N'Wasserkraftwerk', 
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (11, 8, -5)  -- population

--Kraftwerk
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 4, -20) -- Kraftwerk  verbraucht treibstoff
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 6, 165)  -- , erzeugt E
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (14, 8, -10)  -- benötigt Pop

--Forschungslabor
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (15, 6, -10) --  Energie
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (15, 8, -35)  --  Population

-- Häuser
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (18, 6, -10)	-- Häuser - energy

--Montagehalle
--delete from [dbo].[BuildingProductions] where [buildingId] = 19
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 6, -10) -- energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 8, -15) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (19, 7, 8)  --assembly points

--Hochofen
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 6, -20) -- Hochofen energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 8, -10) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 5, -5) -- erz
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (20, 10, 8) -- Stahl
--delete from [dbo].[BuildingProductions] where [buildingId] = 20 ([buildingId], [goodsId], [amount]) VALUES (20, 10, 10) -- Stahl

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 6, -10) -- Synthetic material plant -  energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 8, -6) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 4, -10) -- erz
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (22, 11, 11) -- Synth. Material


-- Imp Baumaterialfabrik
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (23, 1, 15)  --N'Baumaterialfabrik',  + BM
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (23, 6, -10)  --- Energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (23, 8, -8)  --- Pop

-- Imp Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (24, 2, 7) --Farm
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (24, 6, -5)
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (24, 8, -5)  -- population

-- Imp Hochofen
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (25, 6, -20) -- Hochofen energy
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (25, 8, -10) -- population
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (25, 5, -5) -- erz
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (25, 10, 20) -- Stahl


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
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (54, 2, 3)

--Arcology
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (55, 6, -10)	-- Häuser - energy
-- delete from [BuildingProductions] where [buildingId] = 55

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
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 1030, -20) -- Hütte Holmium	-> - Erz Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 1040, 12) -- Hütte Holmium	-> - Erz Holmium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1040, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 1031, -20) -- Hütte Terbium	-> - Erz Terbium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 1041, 12)	-- Hütte Terbium	-> +  Terbium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1041, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 1032, -20) -- Hütte Scandium	-> - Erz Scandium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 1042, 12)	-- Hütte Scandium	-> +  Scandium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1042, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 1033, -20) -- Hütte Yttrium	-> - Erz Yttrium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 1043, 12)	-- Hütte Yttrium	-> +  Yttrium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1043, 6,   -15)  -- energy

INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 1034, -20) -- Hütte Lutetium	-> - Erz Lutetium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 1044, 12)	-- Hütte Lutetium	-> +  Lutetium	
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (1044, 6,   -15)  -- energy

--SPecial Ressource buildings:
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (180, 1040, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (181, 1041, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (182, 1042, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (183, 1043, -10)  --Holmium
INSERT [dbo].[BuildingProductions] ([buildingId], [goodsId], [amount]) VALUES (184, 1044, -10)  --Holmium


-- truncate Table [dbo].[BuildingCosts]
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


--Imp Baumaterialfabrik
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (23, 1, 40)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (23, 7, 20)

--Imp Farm
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (24, 1, 45) 
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (24, 7, 15)

--Imp Metall - Hochofen - Furnace
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (25, 1, 50) --BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (25, 7, 25) --construction


--Raffinerie - HydroCarbon
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 1, 80) -- BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 10, 120) -- Metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (6, 7, 75) -- Raffinerie
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (7, 1, 20)
--INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (8, 1, 10)



--insert into dbo.serverEvents (eventType) select 4



--Wasserkraftwerk
-- delete from [BuildingCosts] where [buildingId] = 11
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 7, 45) --assembly
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 1, 80) --BM
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (11, 10, 45) --metall

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
--delete from [BuildingCosts] where [buildingId] = 19
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (19, 1, 40)
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (19, 7, 40)   --montagepunkte
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

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181,  1, 350) -- Plant Terbium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (181, 1041, 10)  --Terbium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182,  1, 350) -- Plant Scandium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (182, 1042, 10)  --Scandium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183,  1, 350) -- Plant Yttrium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (183, 1043, 10)  --Yttrium

INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184,  1, 350) -- Plant Lutetium	-> BM 	
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 10, 140)  --metall
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 7, 90) -- construction
INSERT [dbo].[BuildingCosts] ([buildingId], [goodsId], [amount]) VALUES (184, 1044, 10)  --Lutetium