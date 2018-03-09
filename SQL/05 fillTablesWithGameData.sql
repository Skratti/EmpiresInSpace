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
[id] may be freely given, but has to be unique
[name] - deprecated, just an info for the developer. should be in english
[objectimageUrl] the url of the image.
*/
INSERT [dbo].[ObjectDescription] 
	([id], [name], [objectimageUrl], [versionNo])
select 1, N'Oranger Zwerg', N'SunOrange.png', 1 union all
select 2, N'Gelber Zwerg', N'SunYellow.png', 1 union all
select 3, N'Blauer Zwerg', N'SunBlue.png', 1 union all
select 4, N'SunDeepPink', N'SunDeepPink.png', 1 union all
select 5, N'SunGreenYellow', N'SunGreenYellow.png', 1 union all
select 6, N'SunIndi', N'SunIndi.png', 1 union all
select 10, N'Asteroidenfeld', N'11.png', 1 union all
select 11, N'dichtes Asteroidenfeld', N'12.png', 1 union all
select 13, N'Roter Zwerg', N'SunRed.png', 1 union all
select 14, N'Blauer Riese', N'SunBlue.png', 1 union all
select 15, N'Blauer  Riese 2', N'SunBlue.png', 1 union all
select 16, N'Zwerg', N'SunBlue.png', 1 union all
select 24, N'EarthLike', N'51.png', 1 union all
select 25, N'Land', N'52.png', 1 union all
select 26, N'Water', N'53.png', 1 union all
select 27, N'Desert', N'54.png', 1 union all
select 28, N'Ice', N'55.png', 1 union all
select 29, N'Barren', N'56.png', 1 union all
select 30, N'Volcano', N'VulcanoPlanet1.png', 1 union all
select 31, N'Toxic ', N'58.png', 1 union all
select 32, N'Gasgiant', N'GasPlanet.png', 1 union all
select 34, N'M Mond', N'EarthMoon.png', 1 union all
select 35, N'O', N'EarthMoon.png', 1 union all
select 36, N'L  Mond', N'EarthMoon.png', 1 union all
select 37, N'N  Mond', N'63.png', 1 union all
select 38, N'G  Mond', N'64.png', 1 union all
select 39, N'K  Mond', N'65.png', 1 union all
select 40, N'H  Mond', N'BarrenMoon.png', 1 union all
select 41, N'X Mond', N'VulcanoMoon.png', 1 union all
select 42, N'Toxic  Mond', N'68.png', 1 union all
select 44, N'Asteroidenmond', N'70.png', 1 union all
select 45, N'Blauer Riese', N'SunBlue.png', 1 union all
select 46, N'Blauer Riese', N'SunBlue.png', 1 union all
select 47, N'Blauer Riese', N'SunBlue.png', 1 union all
select 48, N'Blauer Riese', N'SunBlue.png', 1 union all
select 50, N'Roter Riese', N'SunRed.png', 1 union all
select 51, N'Roter Riese', N'SunRed.png', 1 union all
select 52, N'Roter Riese', N'SunRed.png', 1 union all
select 53, N'Roter Riese', N'SunRed.png', 1 union all
select 55, N'Oranger Riese', N'SunOrange.png', 1 union all
select 56, N'Oranger Riese', N'SunOrange.png', 1 union all
select 57, N'Oranger Riese', N'SunOrange.png', 1 union all
select 58, N'Oranger Riese', N'SunOrange.png', 1 union all
select 59, N'Yellow Sun', N'SunYellow.png', 1 union all
select 60, N'Yellow Sun', N'SunYellow.png', 1 union all
select 61, N'Yellow Sun', N'SunYellow.png', 1 union all
select 62, N'Yellow Sun', N'SunYellow.png', 1 union all
select 63, N'SunDeepPink', N'SunDeepPink.png', 1 union all
select 64, N'SunDeepPink', N'SunDeepPink.png', 1 union all
select 65, N'SunGreenYellow', N'SunGreenYellow.png', 1 union all
select 66, N'SunGreenYellow', N'SunGreenYellow.png', 1 union all
select 67, N'SunIndigo', N'SunIndigo.png', 1 union all
select 68, N'SunIndigo', N'SunIndigo.png', 1 union all
select 70, N'Arrow Lower Left', N'ArrowToLowerLeft.png', 1 union all
select 80, N'Nebula1', N'GrassTile.png', 1 union all
select 100, N'Gras', N'GrassTile.png', 1 union all
select 101, N'Gras', N'GrassTile.png', 1 union all
select 102, N'Wald', N'GrassTile.png', 1 union all
select 103, N'Wasser', N'WaterTile.png', 1 union all
select 104, N'Gebirge', N'MountainTile.png', 1 union all
select 105, N'Wüste', N'DesertTile.png', 1 union all
select 106, N'Eis', N'SnowTile.png', 1 union all
select 107, N'BarrenSurfaceTile', N'BarrenSurfaceTile.png', 1 union all
select 108, N'AsteroidSurfaceTile', N'AsteroidSurfaceTile.png', 1 union all
select 109, N'VulcanoSurfaceTile', N'VulcanoSurfaceTile.png', 1 union all
select 110, N'ToxicSurfaceTile', N'ToxicSurfaceTile.png', 1 union all
select 111, N'SpaceField', N'SpaceField.png', 1 union all
select 130, N'BlastFurnaceHolmium', N'Buildings/BlastFurnaceHolmium.png', 1 union all
select 131, N'BlastFurnaceTerbium', N'Buildings/BlastFurnaceTerbium.png', 1 union all
select 132, N'BlastFurnaceScandium', N'Buildings/BlastFurnaceScandium.png', 1 union all
select 133, N'BlastFurnaceYttrium', N'Buildings/BlastFurnaceYttrium.png', 1 union all
select 134, N'BlastFurnaceLutetium', N'Buildings/BlastFurnaceLutetium.png', 1 union all
select 135, N'BlastFurnaceHolmium', N'Buildings/HeadframeHolmium.png', 1 union all
select 136, N'BlastFurnaceTerbium', N'Buildings/HeadframeTerbium.png', 1 union all
select 137, N'BlastFurnaceScandium', N'Buildings/HeadframeScandium.png', 1 union all
select 138, N'BlastFurnaceYttrium', N'Buildings/HeadframeYttrium.png', 1 union all
select 139, N'BlastFurnaceLutetium', N'Buildings/HeadframeLutetium.png', 1 union all
select 140, N'Antimatter Collector', N'Buildings/OrbitalAntimatterCollector.png', 2 union all
select 141, N'Space Lab', N'Buildings/OrbitalSpaceLab.png', 1 union all
select 142, N'Control Center', N'Buildings/OrbitalControlCenter.png', 1 union all
select 143, N'Weather Control', N'Buildings/OrbitalWeatherControl.png', 1 union all
select 144, N'Long Range Scanner', N'Buildings/OrbitalLongRangeScanner.png', 1 union all
select 145, N'Space Habitat', N'Buildings/OrbitalSpaceHabitat.png', 1 union all
select 146, N'Exotic Materials Lab', N'Buildings/AntimatterResearchLab.png', 2 union all
select 147, N'Antimatter Reactor', N'Buildings/AntimatterReactor.png', 2 union all
select 148, N'Exotic Materials Assembly Plant', N'Buildings/AntimatterAssemblyPlant.png', 2 union all
select 149, N'Koloniezentrale', N'Buildings/ColonyCenterSmall_60.png', 1 union all
select 150, N'Koloniezentrale', N'Buildings/ColonyCenterMedium_60.png', 1 union all
select 151, N'Koloniezentrale', N'Buildings/ColonyCenter_60.png', 1 union all
select 152, N'Erzmine', N'Buildings/Headframe.png', 1 union all
select 153, N'Landwirtschaft', N'Buildings/Farm.png', 1 union all
select 154, N'Raumhafen', N'Buildings/Spaceport.png', 1 union all
select 155, N'Militärcamp', N'Buildings/SolarPanels.png', 1 union all
select 158, N'Baumaterialfabrik', N'Buildings/BuildingMaterialPlant.png', 1 union all
select 159, N'Sonnenkraftwerk', N'Buildings/SolarPanels.png', 1 union all
select 160, N'Lager', N'Buildings/Depot.png', 1 union all
select 161, N'Kommunikationszentrale', N'Buildings/CommCenter.png', 1 union all
select 162, N'Häuser', N'Buildings/Houses.png', 1 union all
select 163, N'Montagehalle', N'Buildings/AssemblyPlant.png', 1 union all
select 164, N'Hochofen', N'Buildings/BlastFurnace.png', 1 union all
select 165, N'ResearchLab', N'Buildings/ResearchBuilding.png', 1 union all
select 166, N'OilWell2', N'Buildings/OilWell2.png', 1 union all
select 167, N'OilTank.png', N'Buildings/OilTank.png', 1 union all
select 168, N'PlanetaryScanner.png', N'Buildings/PlanetaryScanner.png', 1 union all
select 169, N'ModulePlant.png', N'Buildings/ModulePlant.png', 1 union all
select 170, N'PowerPlant.png', N'Buildings/PowerPlant.png', 1 union all
select 171, N'Verb.Baumaterialfabrik', N'Buildings/AdvBuildingMaterial.png', 3 union all
select 172, N'Administration I', N'Buildings/Houses.png', 1 union all
select 173, N'Administration II', N'Buildings/Houses.png', 1 union all
select 174, N'Administration III', N'Buildings/Houses.png', 1 union all
select 175, N'Administration IV', N'Buildings/Houses.png', 1 union all
select 176, N'Administration V', N'Buildings/Houses.png', 1 union all
select 177, N'Synthetic Materials plant', N'Buildings/SynthMaterialPlant.png', 1 union all
select 180, N'HolmiumGenerator', N'Buildings/HolmiumGenerator.png', 1 union all
select 181, N'ScandTools', N'Buildings/ScandTools.png', 1 union all
select 182, N'TerbiumFact', N'Buildings/TerbiumFact.png', 1 union all
select 183, N'YttriumCloning', N'Buildings/YttriumCloning.png', 1 union all
select 184, N'LutEcosystem', N'Buildings/LutEcosystem.png', 1 union all
select 185, N'Aqua Farm', N'Buildings/Aquafarm.png', 1 union all
select 186, N'Neutronium reactor', N'Buildings/NeutroniumReactor.png', 1 union all
select 187, N'Pressure Dome', N'Buildings/PressureDome.png', 1 union all
select 188, N'Arcology', N'Buildings/Houses2.png', 1 union all
select 189, N'Imp Baumaterialfabrik', N'Buildings/ImpBuildingMaterialPlant.png', 1 union all
select 190, N'Landwirtschaft', N'Buildings/ImpFarm.png', 1 union all
select 191, N'Hochofen', N'Buildings/ImpBlastFurnace.png', 1 union all

select 192, N'FarmingDome', N'Buildings/FarmingDome.png' union all
select 193, N'HousingDome', N'Buildings/HousingDome.png' union all

select 200, N'FleetCommand1', N'Scout2G.png', 1 union all
select 201, N'Corvette', N'Corvette.png', 1 union all
select 202, N'Fregatte', N'Fregatte.png', 1 union all
select 203, N'destroyer', N'Fregatte.png', 1 union all
select 204, N'FleetCommand5', N'Fregatte.png', 1 union all
select 230, N'Administration V', N'Buildings/Houses.png', 1 union all
select 300, N'Scrap', N'Interface/TrashCan.png', 1 union all
select 301, N'Recycle V', N'Interface/Recycling.png', 1 union all
select 400, N'Kolonieschiff', N'Fregatte.png', 1 union all
select 401, N'Scout', N'Scout3_60.png', 1 union all
select 402, N'Corvette', N'Corvette.png', 1 union all
select 403, N'Fregatte', N'Fregatte.png', 1 union all
select 404, N'destroyer', N'Ships/Destroyer60.png', 1 union all
select 405, N'Cruiser', N'Fregatte.png', 1 union all
select 406, N'star ship', N'Fregatte.png', 1 union all
select 407, N'Battleship', N'Fregatte.png', 1 union all
select 408, N'Super Battleship', N'Fregatte.png', 1 union all
select 410, N'Scout2', N'Ships/Scout60.png', 1 union all
select 411, N'Scout3', N'Ships/Scout_2_60.png', 1 union all
select 412, N'ScoutPirate', N'ScoutPirate60.png', 1 union all
select 413, N'ScoutGreen60', N'Ships/ScoutGreen60.png', 1 union all
select 414, N'ScoutBlue60', N'Ships/ScoutBlue60.png', 1 union all
select 416, N'HeavyFighter60', N'Ships/HeavyFighter60.png', 1 union all
select 417, N'HeavyFighterGreen60', N'Ships/HeavyFighterGreen60.png', 1 union all
select 418, N'HeavyFighterBlue60', N'Ships/HeavyFighterBlue60.png', 1 union all
select 420, N'CorvetteGreen60', N'Ships/CorvetteGreen60.png', 1 union all
select 421, N'CorvetteGreen60', N'Ships/CorvetteBlue60.png', 1 union all
select 422, N'Frigate60', N'Ships/Frigate60.png', 1 union all
select 423, N'FrigateGreen60', N'Ships/FrigateGreen60.png', 1 union all
select 424, N'FrigateBlue60', N'Ships/FrigateBlue60.png', 1 union all
select 426, N'DestroyerGreen60', N'Ships/DestroyerGreen60.png', 1 union all
select 427, N'DestroyerBlue60', N'Ships/DestroyerBlue60.png', 1 union all
select 430, N'_Outpost_', N'SpaceStation0_1_60.png', 1 union all
select 431, N'SpaceStation', N'SpaceStation1_1_60.png', 1 union all
select 434, N'Star base', N'SpaceStation2_1_60.png', 1 union all
select 437, N'Star fortress', N'SpaceStation3_1_60.png', 1 union all
select 440, N'Debris', N'DummyDebris.png', 1 union all
select 441, N'Cruiser60', N'Ships/Cruiser60.png', 1 union all
select 442, N'CruiserGreen60', N'Ships/CruiserGreen60.png', 1 union all
select 443, N'CruiserBlue60', N'Ships/CruiserBlue60.png', 1 union all
select 444, N'Battleship60', N'Ships/Battleship60.png', 1 union all
select 445, N'BattleshipGreen60', N'Ships/BattleshipGreen60.png', 1 union all
select 446, N'BattleshipBlue60', N'Ships/BattleshipBlue60.png', 1 union all
select 447, N'SuperBattleship60', N'Ships/SuperBattleship60.png', 1 union all
select 448, N'SuperBattleshipGreen60', N'Ships/SuperBattleshipGreen60.png', 1 union all
select 449, N'SuperBattleshipBlue60', N'Ships/SuperBattleshipBlue60.png', 1 union all
select 450, N'Satellit', N'DefSat2.png', 1 union all
select 451, N'PirateFrigate', N'Ships/FrigateRed60.png', 1 union all
select 460, N'Transcendence Construct', N'TranscendenceConstruct60.png', 1 union all
select 461, N'Transcendence Builder', N'TranscendenceBuildert60.png', 1 union all
select 470, N'Colonizer', N'Colonizer2_60.png', 1 union all
select 490, N'TargetedShip', N'Ships/TargetedShip.png', 1 union all
select 500, N'Kolonieschiff', N'Scout3_60.png', 1 union all
select 501, N'Scout', N'Scout3_60.png', 1 union all
select 502, N'smallDef', N'Scout3_60.png', 1 union all
select 503, N'Destroyer', N'Scout3_60.png', 1 union all
select 504, N'Destroyer', N'Ships/Destroyer390.png', 1 union all
select 505, N'Cruiser', N'Scout3_60.png', 1 union all
select 506, N'Destroyer', N'Scout3_60.png', 1 union all
select 507, N'Tanker', N'Scout3_60.png', 1 union all
select 508, N'Cruiser', N'Scout3_60.png', 1 union all
select 510, N'Scout2', N'Ships/Scout240.png', 1 union all
select 511, N'Scout3', N'Ships/Scout_2_240.png', 1 union all
select 512, N'CorvetteG', N'CorvetteG.png', 1 union all
select 513, N'FregatteG', N'FregatteG.png', 1 union all
select 514, N'ScoutPirate', N'ScoutPirate200.png', 1 union all
select 515, N'ScoutGreen240', N'Ships/ScoutGreen240.png', 1 union all
select 516, N'ScoutBlue240', N'Ships/ScoutBlue240.png', 1 union all
select 517, N'HeavyFighter240', N'Ships/HeavyFighter240.png', 1 union all
select 518, N'HeavyFighterGreen240', N'Ships/HeavyFighterGreen240.png', 1 union all
select 519, N'HeavyFighterBlue240', N'Ships/HeavyFighterBlue240.png', 1 union all
select 520, N'CorvetteGreen330', N'Ships/CorvetteGreen330.png', 1 union all
select 521, N'CorvetteBlue330', N'Ships/CorvetteBlue330.png', 1 union all
select 522, N'Frigate360', N'Ships/Frigate360.png', 1 union all
select 523, N'FrigateGreen360', N'Ships/FrigateGreen360.png', 1 union all
select 524, N'FrigateBlue360', N'Ships/FrigateBlue360.png', 1 union all
select 526, N'DestroyerGreen390', N'Ships/DestroyerGreen390.png', 1 union all
select 527, N'DestroyerBlue390', N'Ships/DestroyerBlue390.png', 1 union all
select 530, N'FregatteG', N'SpaceStation0_1_300.png', 1 union all
select 531, N'FregatteG', N'SpaceStation1_1_350.png', 1 union all
select 534, N'FregatteG', N'SpaceStation2_1_400.png', 1 union all
select 537, N'FregatteG', N'SpaceStation3_1_450.png', 1 union all
select 541, N'Cruiser420', N'Ships/Cruiser420.png', 1 union all
select 542, N'CruiserGreen420', N'Ships/CruiserGreen420.png', 1 union all
select 543, N'CruiserBlue420', N'Ships/CruiserBlue420.png', 1 union all
select 544, N'Battleship450', N'Ships/Battleship450.png', 1 union all
select 545, N'BattleshipGreen450', N'Ships/BattleshipGreen450.png', 1 union all
select 546, N'BattleshipBlue450', N'Ships/BattleshipBlue450.png', 1 union all
select 547, N'SuperBattleship480', N'Ships/SuperBattleship480.png', 1 union all
select 548, N'SuperBattleshipGreen480', N'Ships/SuperBattleshipGreen480.png', 1 union all
select 549, N'SuperBattleshipBlue480', N'Ships/SuperBattleshipBlue480.png', 1 union all
select 550, N'Satellit', N'DefSat2B.png', 1 union all
select 551, N'FrigateGreen360', N'Ships/FrigateRed360.png', 1 union all
select 560, N'Transcendence Construct', N'TranscendenceConstruct300.png', 1 union all
select 561, N'Transcendence Builder', N'TranscendenceBuildert300.png', 1 union all
select 624, N'EarthLike', N'51_Background.png', 1 union all
select 625, N'Land', N'51_Background.png', 1 union all
select 626, N'Water', N'51_Background.png', 1 union all
select 627, N'Desert', N'Desert_Planet_Surface.png', 1 union all
select 628, N'Ice', N'55.png', 1 union all
select 629, N'Barren', N'56.png', 1 union all
select 630, N'Volcano', N'VulcanoPlanet1.png', 1 union all
select 631, N'Toxic ', N'58.png', 1 union all
select 632, N'Gasgiant', N'GasPlanet.png', 1 union all
select 634, N'M Mond', N'EarthMoon.png', 1 union all
select 635, N'O', N'EarthMoon.png', 1 union all
select 636, N'L  Mond', N'EarthMoon.png', 1 union all
select 637, N'N  Mond', N'63.png', 1 union all
select 638, N'G  Mond', N'64.png', 1 union all
select 639, N'K  Mond', N'65.png', 1 union all
select 640, N'H  Mond', N'BarrenMoon.png', 1 union all
select 641, N'X Mond', N'VulcanoMoon.png', 1 union all
select 642, N'Toxic  Mond', N'68.png', 1 union all
select 644, N'Asteroidenmond', N'70.png', 1 union all
select 671, N'Supraconductors', N'Buildings/SolarPanels.png', 1 union all
select 1000, N'Energy', N'Energy.png', 1 union all
select 1001, N'BM', N'BM.png', 1 union all
select 1002, N'Nahrung', N'Food.png', 1 union all
select 1003, N'Munition', N'Ammunition.png', 1 union all
select 1004, N'Treibstoff', N'Fuel.png', 1 union all
select 1005, N'Erz', N'ore.png', 1 union all
select 1006, N'Metall', N'MetallBars.png', 1 union all
select 1007, N'AssemblyPoints', N'AssemblyPoints.png', 1 union all
select 1008, N'Population', N'Goods/Population.png', 1 union all
select 1009, N'Synthetic Materials', N'CarbonFibers.png', 1 union all
select 1010, N'Neutronium', N'Neutronium.png', 1 union all
select 1011, N'Antimatter', N'Goods/Antimatter.png', 2 union all
select 1012, N'Research', N'Goods/Research.png', 1 union all
select 1013, N'Adv BM', N'Goods/AdvBm.png', 1 union all
select 1030, N'Holmium', N'Goods/HolmiumOre.png', 2 union all
select 1031, N'Terbium', N'Goods/TerbiumOre.png', 2 union all
select 1032, N'Scandium', N'Goods/ScandiumOre.png', 2 union all
select 1033, N'Yttrium ', N'Goods/YttriumOre.png', 2 union all
select 1034, N'Lutetium', N'Goods/LutetiumOre.png', 2 union all
select 1040, N'Adamantium', N'ore.png', 1 union all
select 1050, N'Holmium', N'HolmiumBars.png', 1 union all
select 1051, N'Terbium', N'TerbiumBars.png', 1 union all
select 1052, N'Scandium', N'ScandiumBars.png', 1 union all
select 1053, N'Yttrium ', N'YttriumBars.png', 1 union all
select 1054, N'Lutetium', N'LutetiumBars.png', 1 union all
select 1060, N'Adamantium', N'ore.png', 1 union all
select 1200, N'Adamantium', N'Goods/TabletOfKer.png', 1 union all
select 2000, N'SystemScout', N'ScoutModules.png', 1 union all
select 2001, N'Crew I', N'Crew1.png', 1 union all
select 2002, N'Reactor I', N'Reactor.png', 1 union all
select 2003, N'Hull I', N'Hull.png', 1 union all
select 2004, N'Shield I', N'Shield.png', 1 union all
select 2005, N'Laser I', N'WeaponLaser.png', 1 union all
select 2006, N'Missile I', N'WeaponRocket.png', 1 union all
select 2007, N'Mass Driver I', N'WeaponMassDriver.png', 1 union all
select 2008, N'Car I', N'Car.png', 1 union all
select 2009, N'System Engines I', N'Impuls.png', 1 union all
select 2010, N'Hyper Engines I', N'Hyper.png', 1 union all
select 2011, N'System Batteries I', N'Engine.png', 1 union all
select 2012, N'Hyper Batteries I', N'Engine.png', 1 union all
select 2013, N'Colonizing Module', N'Colonization_I.png', 1 union all
select 2014, N'Asteroid Mining', N'Engine.png', 1 union all
select 2015, N'Scanner I', N'Scanner.png', 1 union all
select 2016, N'Defense satellite', N'ScoutModules.png', 1 union all
select 2017, N'Space Marines', N'SpaceMarines.png', 1 union all
select 2023, N'Colonizing Module II', N'Colonization_II.png', 1 union all
select 2101, N'Crew II', N'Crew1.png', 1 union all
select 2102, N'Reactor II', N'Reactor.png', 1 union all
select 2103, N'Hull II', N'Hull.png', 1 union all
select 2104, N'Shield II', N'Shield.png', 1 union all
select 2105, N'Laser II', N'WeaponLaser.png', 1 union all
select 2106, N'Missile II', N'WeaponRocket.png', 1 union all
select 2107, N'Mass Driver II', N'WeaponMassDriver.png', 1 union all
select 2108, N'Car II', N'Car.png', 1 union all
select 2109, N'System Engines II', N'Impuls.png', 1 union all
select 2110, N'Hyper Engines II', N'Hyper.png', 1 union all
select 2111, N'System Batteries II', N'Engine.png', 1 union all
select 2112, N'Hyper Batteries II', N'Engine.png', 1 union all
select 2115, N'Scanner II', N'Scanner.png', 1 union all
select 2201, N'Crew III', N'Crew1.png', 1 union all
select 2202, N'Reactor III', N'Reactor.png', 1 union all
select 2203, N'Hull III', N'Hull.png', 1 union all
select 2204, N'Shield III', N'Shield.png', 1 union all
select 2205, N'Laser III', N'WeaponLaser.png', 1 union all
select 2206, N'Missile III', N'WeaponRocket.png', 1 union all
select 2207, N'Mass Driver III', N'WeaponMassDriver.png', 1 union all
select 2208, N'Car III', N'Car.png', 1 union all
select 2209, N'System Engines III', N'Impuls.png', 1 union all
select 2210, N'Hyper Engines III', N'Hyper.png', 1 union all
select 2215, N'Scanner III', N'Scanner.png', 1 union all
select 2523, N'Colonizing Module III', N'Colonization_III.png', 1 union all
select 3101, N'Yttrium Crew I', N'Crew1.png', 1 union all
select 3102, N'Lutetium Reactor I', N'Reactor.png', 1 union all
select 3103, N'Terbium Hull I', N'Hull.png', 1 union all
select 3104, N'Scandium Shield I', N'Shield.png', 1 union all
select 3105, N'Holmium Laser I', N'WeaponLaser.png', 1 union all
select 3108, N'Yttrium Car I', N'Car.png', 1 union all
select 3109, N'Lutetium System Engines I', N'Impuls.png', 1 union all
select 3110, N'Yttrium Hyper Engines I', N'Hyper.png', 1 union all
select 3115, N'Lutetium Scanner I', N'Scanner.png', 1 union all
select 3201, N'Adv. Crew', N'Crew1.png', 1 union all
select 3202, N'Adv. Reactor', N'Reactor.png', 1 union all
select 3203, N'Adv. Hull', N'Hull.png', 1 union all
select 3204, N'Adv. Shield', N'Shield.png', 1 union all
select 3205, N'Adv. Laser', N'WeaponLaser.png', 1 union all
select 3206, N'Adv. Laser', N'WeaponRocket.png', 1 union all
select 3207, N'Adv. Laser', N'WeaponMassDriver.png', 1 union all
select 3208, N'Adv. Car', N'Car.png', 1 union all
select 3209, N'Adv. System Engines', N'Impuls.png', 1 union all
select 3210, N'Adv. Hyper Engines', N'Hyper.png', 1 union all
select 3215, N'Adv. Scanner', N'Scanner.png', 1 union all
select 3500, N'Nebula', N'Nebula240.png', 1 union all
select 3510, N'Nebula Blue', 'NebulaBlue240.png', 1 union all
select 3520, N'Nebula Cyan', 'NebulaCyan240.png', 1 union all
select 3530, N'Nebula Yellow', 'NebulaYellow240.png', 1 union all
select 4000, N'Land Planet', N'SolarSystems/world/Land00.png', 1 union all
select 4001, N'Land Planet', N'SolarSystems/world/Land01.png', 1 union all
select 4002, N'Land Planet', N'SolarSystems/world/Land02.png', 1 union all
select 4003, N'Land Planet', N'SolarSystems/world/Land03.png', 1 union all
select 4004, N'Land Planet', N'SolarSystems/world/Land04.png', 1 union all
select 4005, N'Land Planet', N'SolarSystems/world/Land05.png', 1 union all
select 4006, N'Land Planet', N'SolarSystems/world/Land06.png', 1 union all
select 4500, N'Land Planet Surface', N'SolarSystems/colony/Land00.png', 1 union all
select 4501, N'Land Planet Surface', N'SolarSystems/colony/Land01.png', 1 union all
select 4502, N'Land Planet Surface', N'SolarSystems/colony/Land02.png', 1 union all
select 4503, N'Land Planet Surface', N'SolarSystems/colony/Land03.png', 1 union all
select 4504, N'Land Planet Surface', N'SolarSystems/colony/Land04.png', 1 union all
select 4505, N'Land Planet Surface', N'SolarSystems/colony/Land05.png', 1 union all
select 4506, N'Land Planet Surface', N'SolarSystems/colony/Land06.png', 1 union all
select 5000, N'NebulaTileset', N'NebulaTileset.png', 1 union all
select 5200, N'BorderLightGreyTileset', N'BorderLightGreyTileset.png', 1 union all
select 5400, N'BorderDarkBlueTileset', N'BorderDarkBlueTileset.png', 1 union all
select 5600, N'BorderLightBlueTileset', N'BorderLightBlueTileset.png', 1 union all
select 5800, N'BorderDarkGreenTileset', N'BorderDarkGreenTileset.png', 1 union all
select 6000, N'BorderLightGreenTileset', N'BorderLightGreenTileset.png', 1 union all
select 6200, N'BorderDarkRedTileset', N'BorderDarkRedTileset.png', 1 union all
select 6400, N'BorderLightRedTileset', N'BorderLightRedTileset.png', 1 union all
select 6600, N'BorderOrangeTileset', N'BorderOrangeTileset.png', 1 union all
select 6800, N'BorderYellowTileset', N'BorderYellowTileset.png', 1 union all
select 7000, N'BorderYellowGreenTileset', N'Borders/BorderYellowGreenTileset.png', 1 union all
select 7200, N'BorderWhiteTileset', N'Borders/BorderWhiteTileset.png', 1 union all
select 7400, N'BorderDarkGreyTileset', N'Borders/BorderDarkGreyTileset.png', 1 union all
select 8000, N'PlanetSurface', N'Planet_01.png', 1;
go
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
go
INSERT [dbo].[ObjectOnMap] 
(		[id], [moveCost], [damage], [damageType], [damageProbability], [damageProbabilityReducableByShip], [defenseBonus], [fieldSize], [label])
select 1,		3,			100,		1,			100,						0, 0, 1, 1 union all
select 2,		3,			100,		1,			100,						0, 0, 1, 2 union all
select 3,		3,			100,		1,			100,						0, 0, 1, 3 union all
select 4,		3,			100,		1,			100,						0, 0, 1, 3 union all
select 5,		3,			100,		1,			100,						0, 0, 1, 3 union all
select 6,		3,			100,		1,			100,						0, 0, 1, 3 union all
select 10,		2,			200,		3,			100,						1, 20, 1, 10 union all
select 11,		3,			400,		3,			150,						1, 20, 1, 11 union all
select 13,		1,			100,		1,			100,						0, 0, 1, 15 union all
select 14,		1,			100,		1,			100,						0, 0, 1, 13 union all
select 15,		1,			100,		1,			100,						0, 0, 1, 14 union all
select 16,		1,			100,		1,			100,						0, 0, 1, 17 union all
select 24,		1,			0,			NULL,		0,							0, 60, 1, 25 union all
select 25,		1,			0,			NULL,		0,							0, 60, 1, 26 union all
select 26,		1,			0,			NULL,		0,							0, 60, 1, 27 union all
select 27,		1,			0,			NULL,		0,							0, 60, 1, 28 union all
select 28,		1,			0,			NULL,		0,							0, 60, 1, 29 union all
select 29,		1,			0,			NULL,		0,							0, 60, 1, 30 union all
select 30,		1,			0,			NULL,		0,							0, 60, 1, 31 union all
select 31,		1,			0,			NULL,		0,							0, 60, 1, 32 union all
select 32,		1,			0,			NULL,		0,							0, 60, 1, 33 union all
select 34,		1,			0,			NULL,		0,							0, 20, 1, 35 union all
select 35,		1,			0,			NULL,		0,							0, 20, 1, 34 union all
select 36,		1,			0,			NULL,		0,							0, 20, 1, 36 union all
select 37,		1,			0,			NULL,		0,							0, 20, 1, 37 union all
select 38,		1,			0,			NULL,		0,							0, 20, 1, 28 union all
select 39,		1,			0,			NULL,		0,							0, 20, 1, 41 union all
select 40,		1,			0,			NULL,		0,							0, 20, 1, 39 union all
select 41,		1,			0,			NULL,		0,							0, 20, 1, 31 union all
select 42,		1,			0,			NULL,		0,							0, 20, 1, 32 union all
select 44,		1,			0,			NULL,		0,							0, 20, 1, 35 union all
select 45,		1,			100,		1,			100,						0, 0, 2, 13 union all
select 46,		1,			100,		1,			100,						0, 0, 0, 13 union all
select 47,		1,			100,		1,			100,						0, 0, 0, 13 union all
select 48,		1,			100,		1,			100,						0, 0, 0, 13 union all
select 50,		1,			100,		1,			100,						0, 0, 2, 15 union all
select 51,		1,			100,		1,			100,						0, 0, 0, 15 union all
select 52,		1,			100,		1,			100,						0, 0, 0, 15 union all
select 53,		1,			100,		1,			100,						0, 0, 0, 15 union all
select 55,		1,			100,		1,			100,						0, 0, 2, 14 union all
select 59,		1,			100,		1,			100,						0, 0, 2, 14 union all
select 63,		1,			100,		1,			100,						0, 0, 2, 3 union all
select 65,		1,			100,		1,			100,						0, 0, 2, 3 union all
select 67,		1,			100,		1,			100,						0, 0, 2, 3 union all
select 5000,	3,			0,			NULL,		0,							0, 50, 1, 4

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
select			24,				24,			1	,				 624,					  19,			   5	,17		union all   --earthlike
select			25,				4000,     	1,					4500,					  19,			   5	,18		union all	--earthlike		
select			25,				4001,     	1,					4501,					  19,			   5	,19		union all	--earthlike
select			25,				4002,     	1,					4502,					  19,			   5	,20		union all	--earthlike
select			25,				4003,     	1,					4503,					  19,			   5	,21		union all	--earthlike
select			25,				4004,     	1,					4504,					  19,			   5	,22		union all	--earthlike
select			25,				4005,     	1,					4505,					  19,			   5	,23		union all	--earthlike
select			25,				4006,     	1,					4506,					  19,			   5	,24		union all	--earthlike
select			26,				26,			1	,				 626,					  19,			   5	,17		union all --Water
select			27,				27,			1	,				 627,					  19,			   5	,17		union all --Desert
select			28,				28,			1	,				 628,					  19,			   5	,17		union all --Ice
select			29,				29,			1	,				 629,					  19,			   5	,17		union all --Barren
select			30,				30,			1	,				 630,					  19,			   5	,17		union all --Volcano
select			31,				31,			1	,				 631,					  19,			   5	,17		union all --Toxic
select			32,				32,			1	,				 632,					  19,			   5	,null	union all --Gasgiant
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
select			67,				67,			2.5	,				null,					null,			null	,null	union all
select			5000,		3500,			1	,				null,					null,			null	,null	union all
select			5000,		5000,			1	,				null,					null,			null	,null	
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
INSERT INTO [dbo].[SurfaceTiles] 
(id, [name],		objectId, label,	[borderId]) VALUES 
(1,  'Gras',		101,		36,			6000)
,(2, 'Wald',		102,		37,			5800)
,(3, 'Wasser',		103,		38,			5400)
,(4, 'Gebirge',		104,		39,			5200)
,(5, 'Wüste',		105,		40,			6800)
,(6, 'Eis',			106,		41,			7200)
,(7, 'Barren',		107,		831,		6400)
,(8, 'Asteroid',	108,		832,		5200)
,(9, 'Vulcanic',	109,		833,		6200)
,(10,'Toxic',		110,		834,		7000)
,(11,'Orbit',		111,		936,		7400)
go


-- IMPORTANT: UPDATE FIELD baseResearch AFTER INSERTING
SET IDENTITY_INSERT [dbo].[Research] ON

--delete from [Research]

-- Hidden Researches:
INSERT into [dbo].[Research] 
	  ([id], [name],				[cost], [label], [descriptionLabel], [researchType], [treeColumn],	[treeRow],	hidden) 

--Culture*
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
select  501, N'Outpost'	,							10,		585,				585	,			2	,			2	,	13 union all
--INSERT into [dbo].[Research] 
	  --([id],  [description]	,				[cost], [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 4002, N'Fleet Command I',					30	,	553	,				558,			4,				2,		15  union all


select 1060, N'Holmium Generator', 					40,		660,				512,			3,				7,		19 union all
select 1061, N'Terbium Factory Improvements',		40,		661,				513,			3,				7,		21 	union all
select 1062, N'Scandium Tools', 					60,		662,				514,			3,				7,		23  union all
select 1063, N'Yttrium Cloning Lab',				60,		663,				515,			3,				7,		25 union all
select 1064, N'Lutetium Ecosystem Improvements', 	60,		664,				516,			3,				7,		27  union all


--INSERT into [dbo].[Research] 
--	  ([id], [name]							, [cost],	[label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 

--Level 3
select 112, N'Warehouse construction plan',			30,		162,				491,			1,				3,		5  union all
select 51, N'PlaneteryScanner',						45,		382,				490,			1,				3,		7 union all
--select 1010, N'Special Ressource Analysis', 					 12,	667,				669,			1,				3,		11 union all

select   11, N'Orbital Buildings',					12	,	947	,				949,			4,				3,		12  union all


select 2005, N'Ship Weapons I',						32,		98,					520,			2 ,				3 ,		14 union all
select 2003, N'Ship Defenses I', 					30,		99,					519,			2 ,				3 ,		16 union all

--delete from Research where id = 8
-- update [Research] set hidden = 1 where id= 8
--Level 4
--INSERT into [dbo].[Research] 
--	  ([id], [name],[objectimageUrl], [description]								, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3002, N'Administration I', 					150,	472		,		477				, 4				, 4				, 3	 

--INSERT into [dbo].[Research] 
--	  ([id], [name], 							[cost],		[label]		, [descriptionLabel], [researchType], [treeColumn]	, [treeRow] , hidden) 
--select 8,	 N'Kommunikation Center',			100,			53		,		488				, 1				, 4				, 7		,	1

INSERT into [dbo].[Research] 
	  ([id], [name]							, [cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select   12, N'Antimatter Utilization'		,		25 ,		948		,	950				, 4				, 4				, 12  union all
select 415, N'Heavy Fighter',						80,			838		,	839				, 2				, 4				, 14 union all
select 402, N'Corvette',							150,		173		,	494				, 2				, 4				, 16 union all

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
--	  ([id], [name],						, [cost],	[label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3, N'TreibstoffRaffinerie',				260,	93,			485,						1,			6,				11 union all
select 4003, N'Fleet Command II',				240,	554,		559,						4,			6,				16 union all

--Level 9
select 302, N'Barren Colonization',				300,	823,		824,						1,			7,				2 union all
--select 303, N'Asteroid moon Colonization',		300,	825,		826,						1,			7,				4 union all

select 50, N'Verb. Baumaterial', 				550,	350,		489,						1,			7,				6 union all
select 5000, N'Transcendence Collab',			800,	592,		593,						4,			7,				9 union all
select 52, N'Arcology'			,				540,	715,		716,						1,			7,				12 union all

--SET IDENTITY_INSERT [dbo].[Research] ON
--INSERT into [dbo].[Research] 
--	  ([id],		[name],						 [cost],	[label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 1070, N'Holmium Laser II',   				700,	960,		965,						3,			11,				19 union all
select 1071, N'Terbium Hull II',    				600,	961,		966,						3,			11,				21 union all
select 1072, N'Scandium Shield II', 				480,	962,		967,						3,			11,				23 union all
select 1073, N'Yttrium Modules II', 				360,	963,		968,						3,			11,				25 union all
select 1074, N'Lutetium Modules II',				330,	964,		969,						3,			11,				27 union all
--SET IDENTITY_INSERT [dbo].[Research] OFF

--delete from [dbo].[Research]  where id in (2500, 2501, 2502, 2503)
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
--update Research set treeColumn = 10, treeRow = 6 where id = 5001

select 5001, N'Transcendence',				3000,		590,		591,	4,		10,			6 union all

select 2102, N'Scanner II',					475,		381,		525,	2,		10,			8 union all
select 2101, N'Cargo II',					450,		376,		524,	2,		10,			10 union all
select 2105, N'Ship Weapons II',			520,		168,		527,	2,		10,			12 union all
select 2103, N'Ship Defenses II',			520,		167,		526,	2,		10,			14 union all

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
--select 2500, N'Special Ressources Modules',		1100			, 718		, 719						,2					, 13			, 6 union all
select	2202, N'Scanner III',					1500			, 712		, 777						, 2					, 13			, 8 union all
select	2201, N'Cargo III',						1100			, 708		, 774						, 2					, 13			, 10 union all
select	2205, N'Ship Weapons III',				2200			, 774		, 777						, 2					, 13			, 12 union all
select	2203, N'Ship Defenses III',				1800			, 773		, 776						, 2					, 13			, 14 union all



--level 16
--INSERT into [dbo].[Research] 
--	  ([id], [name],							 [cost]		, [label]	, [descriptionLabel], [researchType]	, [treeColumn]		, [treeRow]) 

--select 2501, N'SR Auxilliary Modules',			900				, 780		, 783				,2					, 14				, 4 union all
--select 2502, N'SR Attack Modules',				1700				, 781		, 784				,2					, 14				, 6 union all
--select 2503, N'SR Defense Modules',				1300				, 782		, 785				,2					, 14				, 8 union all
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
--SET IDENTITY_INSERT [dbo].[Research] ON
--INSERT into [dbo].[Research] 
--	  ([id], [name],							[cost]	, [label]	, [descriptionLabel], [researchType], [treeColumn]	, [treeRow]) 
select 3010, N'Future Tech',					5000	, 984			, 985				, 4				, 16				, 11 union all
select 407, N'Superbattleship',					3500	, 125			, 499				, 2				, 16				, 16;

--

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

update  [dbo].[Research] set baseCost = cost

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
select 3010		  ,5			,5			,0			, 0			,5				,5				,0		,0				,0			,230		union all
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
--select 303		  ,0			,0			,0			, 0			,0				,0				,0		,0				,0			,44		union all
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

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (12, N'Researchpoints', 1012, 3, 180, 9)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], [prodLevel]) VALUES (50, N'Adv. Building Materials', 1001, 1, 350, 6)
INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (60, N'Neutronium', 1010, 1, 714, 7)

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (61, N'Antimatter', 1011, 1, 937, 7)

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

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label], prodLevel) VALUES (1200, N'TabletOfKer', 1200, 1, 973, 9) -- 'Tablet of Kek'

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

INSERT [dbo].[Goods] ([id], [name], [objectDescriptionId], [goodsType], [label]) VALUES (2523, N'Colonizing Module III', 2523, 2, 713)
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
select	523, 3, N'Colonizing Module III', 13			, 2523		, 713

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
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (9, 0, N'Scumm'			, 0	, 451,  5, N'401Template.gif', 55)

INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (199, 1, N'Outpost', 0, 430, 3, N'401Template.gif', 585)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (200, 1, N'Spacestation', 0, 431, 7, N'SpaceStation1_60.png', 59)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (201, 1, N'Starbase', 0, 434, 12, N'401Template.gif', 126)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (202, 1, N'Star Fortress', 0, 437, 21, N'401Template.gif', 127)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (220, 1, N'Transcendence  Construct', 0, 460, 0, N'401Template.gif', 594)
INSERT [dbo].[ShipHulls] ([id], [isStarBase], [typename], [labelName], [objectId], [modulesCount], [templateImageUrl], [label]) VALUES (221, 0, N'Transcendence  Builder', 0, 461, 30, N'401Template.gif', 595)

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

--Pirate scout
select 17,      9 ,			412 ,			 514 ,					  0 ,					  -40 union all

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
select 34,      8 ,			449 ,			 549 ,					  99 ,					   155 union all--SuperBattleshipBlue

select 35,      4 ,			451 ,			 551 ,					  79 ,					  80 
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
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 1)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (1, 2, 3)
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


-- pirate fregatte 9
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 1, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 1, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 2, 2)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 2, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 2, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 3, 3)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 3, 4)
																			   
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 0, 4)
INSERT [dbo].[ShipHullsModulePositions] ([shipHullId], [posX], [posY]) VALUES (9, 4, 4)




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

select		9,		-4,		-3,			300,			   45,				0,			   200,			60,				0,				0,				0,				0,			0,				1 ,			0.7		union all --fregatte


select		199,	3,		4,			450,				0,				0,				500,		100,			0,				0,				0,				0,			3,				1 ,			0.0		union all  
select		200,	5,		6,			700,			    0,				0,				100,		100,			0,				0,				0,				0,			3,				1 ,			0.0		union all
select		201,	8,		10,			1000,			    0,				0,				200,		200,			0,				0,				0,				0,			3,				1 ,			0.0		union all
select		202,	13,		16,			1400,			    0,				0,				400,		400,			0,				0,				0,				0,			3,				1 ,			0.0     union all
select		220,	1,		100,		3000,				0,				50,				0,			0,				0,				0,				0,				0,			3,				1 ,			0.0     union all
select		221,	1,		10,			100,				0,				5,				0,			0,				3,				6,				3,				15,			0,				0 ,			1.0

/****** Object:  Table [dbo].[ShipHullsCosts]    Script Date: 12/06/2013 21:56:05 ******/


-- standard Ship hulls
--delete from [dbo].[ShipHullsCosts] --where [shipHullId]  > 1 and shipHullId] < 10
INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		1,			1,		40	union all --Scout : 80 BM, 40 PP,  50 metal
select		1,			7,		20	union all  -- Assembly points 
select		1,			10,		40	union all  --  metal

select		2,			1,		60	union all --Scout : 80 BM, 40 PP,  50 metal
select		2,			7,		30	union all  -- Assembly points 
select		2,			10,		50	union all  --  metal

select		3,			1,		80	union all --Corvette : 30 BM, 50 PP, 
select		3,			7,		40	union all  -- Assembly points 
select		3,			10,		7	union all  --  metal

select		4,			1,		120	union all --Fregatte : 30 BM, 50 PP, 
select		4,			7,		60	union all
select		4,			10,		100	union all  --  metal
select		4,			11,		40	union all -- synth

select		5,			1,		100	union all --Destroyer : 30 BM, 50 PP, 
select		5,			7,		80	union all
select		5,			10,		140	union all  --  metal
select		5,			11,		60	union all -- synth
select		5,			50,		50	union all -- adv building

select		6,			1,		150	union all --Cruiser : 30 BM, 50 PP, 
select		6,			7,		110	union all
select		6,			10,		20	union all  --  metal
select		6,			11,		110	union all -- synth
select		6,			50,		80	union all -- adv building

select		7,			1,		200	union all --battleship : 30 BM, 50 PP, 
select		7,			7,		140	union all
select		7,			10,		270	union all  --  metal
select		7,			11,		160	union all -- synth
select		7,			50,		110	union all -- adv building

select		8,			1,		300	union all --superbattleship : 30 BM, 50 PP, 
select		8,			7,		200	union all
select		8,			10,		340	union all  --  metal
select		8,			11,		200	union all -- synth
select		8,			50,		140	        -- adv building



-- Space Stations:

INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		199,			1,		40	union all --Outpost : 30 BM, 50 PP, 
select		199,			7,		25	union all
select		199,			10,		60	union all  --  metal


select		200,			1,		110	union all --Spacestation : 30 BM, 50 PP, 
select		200,			7,		60 union all
select		200,			10,		140	union all  --  metal
select		200,			11,		40	union all --synth     union all --Adv. Building Materials	

select			201,		1,		150		union all   --bm
select			201,		7,		100		union all   -- ASSEMBLY
select			201,		10,		170		union all   --metal
select			201,		11,		90		union all   --synth
select			201,		50,		60		union all   --Adv. Building Materials


select			202,		1,		250		union all   --bm
select			202,		7,		200		union all   -- ASSEMBLY
select			202,		10,		250		union all   --metal
select			202,		11,		150		union all   --synth
select			202,		50,		100		   --Adv. Building Materials



--Transcendence Construct:
INSERT [dbo].[ShipHullsCosts] 
		([shipHullId],	[goodsId], [amount]) 
select			220,		1,		500		union all
select			220,		2,		500		union all
select			220,		7,		200		union all
select			220,		10,		500	union all  --  metal
select			220,		11,		200	union all -- synth
select			220,		50,		100		union all --Adv. Building Materials
select			220,		1040,		150		union all
select			220,		1041,		150		union all
select			220,		1042,		150		union all
select			220,		1043,		150		union all
select			220,		1044,		150		


--Transcendence Builder
INSERT [dbo].[ShipHullsCosts] 
([shipHullId],	[goodsId], [amount]) 
select		221,			1,		200		union all -- 30 BM, 50 PP, 
select		221,			2,		50		union all  --nahrung
select		221,			7,		100	union all --Assembly
select		221,			10,		200		union all  --Steel
select		221,			11,		80		union all -- synth
select		221,			50,		50		union all --Adv. Building Materials
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






go


----------------------------------------------------------------------------------

--insert neutral user 0
declare @maxUserId int;
select @maxUserId = max(id) from inSpaceIndex.dbo.Users 

INSERT [dbo].[Users] ([id], [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES (0 , N'', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 1 , 2)	--robot AI N'@755'
INSERT [dbo].[Users] (id, [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES (280, N'@756', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 2 , 0)   --Pirates
INSERT [dbo].[Users] (id, [username],  [player_ip],  [activity], [locked], [user_session], [showRaster], [moveShipsAsync], [homeCoordX], [homeCoordY], [language], [loginDT], [lastSelectedObjectType], [lastSelectedObjectId], [showSystemNames], [showColonyNames], [showCoordinates], aiId, aiRelation) VALUES ( 281, N'@762', NULL,  NULL,  NULL, NULL, 0, 1, 100, 100, 1, CAST(0x0000A1B200EF844B AS DateTime), 1, 332, 0, 0, 0 , 3 , 0)	-- Separatists

--  Ship Templates
-- One Blueprint per hull type:
--0 Scout

INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], [attack], [defense], [hitpoints], [damagereduction], [cargoroom], [fuelroom], [systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], 
[isColonizer], [constructionDuration], [constructable], [amountBuilt], [obsolete], shipHullsImage) 
VALUES (0, 0, 1, N'Scout', N'scout.png', 1, 8, 3, 0, 0, 100, 0, 20, 80, 
20, 4, 160, 35,  --moves 
0, 1, 1, 0, 0, 1)


--1 Corvette
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

--2 Blueprint Fregatte
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
go
delete from [ShipTemplate]
go
INSERT [dbo].[ShipTemplate] ([id], [userId], [shipHullId], [name], [gif], [energy], [crew], [scanRange], [attack], [defense], [hitpoints], [damagereduction], [cargoroom], [fuelroom], [systemMovesPerTurn], [galaxyMovesPerTurn], [systemMovesMax], [galaxyMovesMax], [isColonizer], [population], [constructionDuration], [constructable], [amountBuilt], [obsolete], [shipHullsImage], [versionId]) 
select 0, 0, 1, N'Scout', N'scout.png', 1, 8, 3, 0, 0, 100, 0, 20, 80, CAST(20.00000 AS Decimal(8, 5)), CAST(4.00000 AS Decimal(8, 5)), CAST(160.00000 AS Decimal(8, 5)), CAST(35.00000 AS Decimal(8, 5)), 0, 0, 1, 1, 0, 0, 1, 0 union all
select 1, 0, 2, N'@953', N'Dummy', 9, 9, 1, 0, 70, 220, 0, 670, 130, CAST(20.00000 AS Decimal(8, 5)), CAST(4.00000 AS Decimal(8, 5)), CAST(37.00000 AS Decimal(8, 5)), CAST(21.00000 AS Decimal(8, 5)), 0, 0, 1, 1, 0, 0, 21, 7 union all
select 2, 0, 2, N'@955', N'Dummy', 9, 9, 1, 40, 70, 220, 0, 70, 80, CAST(0.00000 AS Decimal(8, 5)), CAST(0.00000 AS Decimal(8, 5)), CAST(52.50000 AS Decimal(8, 5)), CAST(15.00000 AS Decimal(8, 5)), 0, 0, 0, 1, 0, 0, 22, 8 union all
select 10, 0, 199, N'@956', N'scout.png', 5, 8, 2, 60, 60, 100, 0, 20, 80, CAST(0.00000 AS Decimal(8, 5)), CAST(0.00000 AS Decimal(8, 5)), CAST(0.00000 AS Decimal(8, 5)), CAST(0.00000 AS Decimal(8, 5)), 0, 0, 1, 1, 0, 0, 14, 0;
go


/****** Object:  Table [dbo].[ShipTemplateModulePositions]    Script Date: 12/07/2013 17:04:33 ******/



/****** Object:  Table [dbo].[ShipTemplateCosts]    Script Date: 12/07/2013 17:04:33 ******/




--delete from [ShipTemplateModulePositions] where [shipTemplateId] = 0
/*
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
*/

INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 1, 3, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 1, 10)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 2, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 2, 3, 9)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (0, 3, 3, 15)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 1, 4, 10)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 2, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 3, 8)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 4, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 2, 5, 9)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (1, 3, 4, 10)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 1, 4, 5)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 2, 1)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 3, 2)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 4, 9)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 2, 5, 10)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (2, 3, 4, 5)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 1, 3, 5)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 2, 2, 5)
INSERT [dbo].[ShipTemplateModulePositions] ([shipTemplateId], [posX], [posY], [moduleId]) VALUES (10, 3, 3, 5)

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