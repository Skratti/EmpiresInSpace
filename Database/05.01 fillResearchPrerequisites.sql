print '05.01 fillResearchPrerequisites.sql'
/*
[ResearchQuestPrerequisites] shows which research leads to which bzuldings, other research and so on
Players start with research id 1
Thus they may build 5 Buildings (see first 5 Insert lines)
 

Sourcetype + TargetType:
1 Forschung	

2 Quest		- ben�tigt 2 Quest und/oder 1 Forschung (und auch nicht angezeigt Quests -> 'zuf�lliges Entdecken von Anomalien') und/oder Auftraggeber
			- kann gebunden sein an Kolonie oder Schiff eines Spielers
			- erm�glicht Quest, Forschung, Geb�ude, Waren (wenn gebunden an Spielerobjekt)
3 Geb�ude

4 Schiffsmodule

5 Schiffsr�mpfe 

6 Ressources  - only as SourceType -> these are needed for special ressources.


Relationstabelle:
[dbo].[ResearchQuestPrerequisites] 
SourceType, SourceId, TargetType, TargetId

*/  --delete from [ResearchQuestPrerequisites]

--insert into serverevents(eventtype) select 4
--Quests
-- quest 1 is inserted into userQuests automaticaly

truncate table [dbo].[ResearchQuestPrerequisites];
--level 0
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 2, 2) --Quest

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 9)	--Frei: Baumaterialfabrik
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 10)	--Sonnenkraftwerk
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 13)	--Scout
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 18) -- H�user
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 19) -- Montagehalle
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 3, 21)	-- Defense satellite

--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 1, 2, 50) -- QuestText with 2 new ships
-- QUESTS
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 2, 2, 3)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 3, 2, 4)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 4, 2, 5)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 5, 2, 6)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 6, 2, 7)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 2, 8)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 2, 9)

--delete from [ResearchQuestPrerequisites] where [SourceType] = 2 and [SourceId] = 8 and [TargetType] = 2 and TargetId = 15
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 2)  --erzmine
/*INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 9)	--Baumaterialfabrik
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 10)	--Sonnenkraftwerk
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 13)	--Scout
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 18) -- H�user
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 7, 3, 19) -- Montagehalle
*/

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 8, 2, 11)
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 8, 1, 1)	-- Frei: Forschungscenter -> Grundlagenforschung
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 8, 2, 15)   -- ResearchDetails (SpaceTravel) werden angezeigt.

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 9, 2, 13)

--Scout rumschicken
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 10, 2, 13)
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 13, 2, 30) --Raumstation finden -> Handeldetail
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 13, 2, 31) --Raumstation finden -> Kontakte detail

--Forschung 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 11, 2, 14) --Koloniedetails -> Bau von Forschungszentrum
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 11, 3, 15) --Frei: Forschungscenter
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 11, 1, 1)	-- Frei: Forschungscenter -> Grundlagenforschung
--delete from  [dbo].[ResearchQuestPrerequisites] where SourceType = 1 and SourceId = 1

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 14, 2, 15)  -- forschung Details: Auftrag:erforsche die Grundlagenforschung
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 2, 15)   -- ResearchDetails werden angezeigt.








--Schiffbau
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 15, 2, 20)  --Schiffbau

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400, 2, 21)  -- Space travel -> Modulfabrik
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400, 2, 22)  -- Space travel -> ship yard 

--delete from  [dbo].[ResearchQuestPrerequisites] where [SourceType] = 2 and [SourceId] = 40 and  [TargetType] = 3 and  [TargetId] = 3 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 22, 2, 23)  --Spaceport -> Spaceport Detail


INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 21, 2, 25)  --Modulfabrik -> Modulfabrik Detail

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 22, 2, 26)  --Ship yard Detail -> ShipDesigner Detail


INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 23, 2, 40)    -- Ende
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 40, 3, 3)		-- Farm
--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 40, 3, 18) -- H�user





-- Research
--delete from [ResearchQuestPrerequisites] where sourcetype = 2 and sourceid = 40 and targetType = 3 and [TargetId] = 18






--HIDDEN Techs:
--Culture

--Focus
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 211, 1, 2)	--Improved Building Material Production
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 210, 1, 10)	--Improved Farming
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 212, 1, 153)	--Improved Metal Refinement

--Special Ressouces Mining/Refinery
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 220,	1, 1040) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 221,	1, 1041) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 222,	1, 1042) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 223,	1, 1043) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 224,	1, 1044) -- Special Ressource 


------------------------------------------------------------------------------
---------------------------------   TIER 0   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 1 Base research


--Level 0
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 9)		-- Ecosystem Adaption I 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 152)	-- F erzmine




INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 3, 9)   -- Baumaterialfabrik
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 3, 10)   -- Sonnenkraftwerk
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 3, 19)   -- Montagehalle



 


------------------------------------------------------------------------------
---------------------------------   TIER 1   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 9 Ecosystem Adaption I , 152 erzmine

-- Leading to research:
--Focus
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9,	1, 2)		--Improved BM
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9,	1, 10)		--Improved Farming
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9,	1, 153)		--Improved Metal Refinement

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9,	1, 2013)  --Colonization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9, 1, 112)  --Lager
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 152, 1, 112)	--Lager
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 152, 1, 400)	--Space travel 


-- Enables:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9, 3, 18)   -- H�user 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 9, 3, 3)   -- Farm

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 152, 3, 2)   -- G erzmine
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 152, 3, 20) -- G Hochofen









------------------------------------------------------------------------------
---------------------------------   TIER 2   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 2 Improved BM,  10, Improved Farming,  153 Improved Metal Refinement
-- 2013 Colonization	112 Planetary Lager,  400 Space travel 

--Leading to: 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  2013, 1, 11) -- Orbital Buildings
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  400,  1, 11) -- Orbital Buildings
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400,	1, 501) -- Outpost
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400,  1, 2000)	--F Space travel erlaubt F Modules  


--Enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2,	3, 23)		--Improved Farming
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 10,	3, 24)		--Improved Farming
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 153,  3, 25)		--Improved Metal Refinement

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2013, 4, 13)  --Colonization I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 112, 3, 12)	--Lager
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400, 3, 17)  -- RaumWerft
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 400, 5, 1)  -- Scout hull


------------------------------------------------------------------------------
---------------------------------   TIER 3   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 11 orbitals , 501 Outpost , 2000 Modules

--Leading to: 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 1, 12) -- Antimatter Utilization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 501, 1, 2002)  --Scanner
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 1, 2002)  --Scanner

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 1, 2005)  -- Weapons 1
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 1, 2003) --Def 1

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 1, 2001)  --Cargo
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 1, 2006)  --Gravity Generator

--Enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 60) -- Orbitals -> Buildings  Antimatter Collector
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 61) -- Orbitals -> Buildings Space Lab
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 62) -- Orbitals -> Buildings Control Center
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 63) -- Orbitals -> Buildings Weather Control
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 64) -- Orbitals -> Buildings Long Range Scanner
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  11, 3, 65) -- Orbitals -> Buildings Space Habitat

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 501, 5, 199)		-- outpost Space Station hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 501, 4, 499)		-- outpost module

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 3, 16)  --Modulefabrik
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 4, 1)  --Crew I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 4, 2)  --Reactor I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 4, 9)  --System Engines I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2000, 4, 10)  --Hyper Engines I

------------------------------------------------------------------------------
---------------------------------   TIER 4   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 12 Antimatter Utilization , 2002 Scanner , 2005 Weapons 1, 2003  Def 1, 2001 Cargo, 2006 Gravity Generator

--Leading to: 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 12, 1, 3002)		--Administration I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2002, 1, 51)  --Planetary Scanner
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2005, 1, 4002)		--Fleet Command I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2003, 1, 4002)		--Fleet Command I

--Gravity:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 1, 1060)  -- Holmium Generator
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 1, 1061)  -- Terbium Factory
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 1, 1062)  -- Scandium Tools 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 1, 1063)  -- Yttrium cloning lab
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 1, 1064)  -- lutetium Ecosystem Improvements

--Enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  12, 3, 81) -- Antimatter Utilization -> Reactor Buildings
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  12, 3, 82) -- Antimatter Utilization -> Exotic Materials Assembly Plant
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2002, 4, 15)  --Scanner

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2005, 4, 5)  -- Laser  1
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2005, 4, 6)  -- rocket  1
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2005, 4, 7)  -- missile  1

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2003, 4, 4) --Shield 1
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2003, 4, 3) --Hull 1

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2001, 4, 8)  --Cargo
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2006, 4, 18)  -- Gravity Generator


------------------------------------------------------------------------------
---------------------------------   TIER 5   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 51 Planetary Scanner , 4002 Fleet Command I , 5 x Gravity Generator FollowUps (1060-1064)
--Leading to: 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 4002, 1, 3002)--Administration I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 4002, 1, 410)  -- Space Marines
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 4002, 1, 403)  -- frigate hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 4002, 1, 405)  -- cruiser hull

--Enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 51, 3, 51)	--Planetary Scanner

INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])  select 1, 1060, 3, 180 	-- Plasma Converter
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])  select 1, 1061, 3, 181 	--  Nitrogen Processing
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])  select 1, 1062, 3, 182 	--  Helium Processing
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])  select 1, 1063, 3, 183 	-- Hydrogen Terraforimg Lab
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])  select 1, 1064, 3, 184 	-- Inonized Hydrogen Terraforimg Lab

------------------------------------------------------------------------------
---------------------------------   TIER 6   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 3002 Administration I , 410 Space Marines , 403 frigate, 405 cruiser
--Leading to: 
--Special Ressouces Mining/Refinery 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,	1, 1040) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,	1, 1041) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,	1, 1042) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,	1, 1043) -- Special Ressource 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,	1, 1044) -- Special Ressource

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,  1, 300)  -- Desert  Colonization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002,  1, 301)  -- Arctic Colonization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002, 1, 71)  --  Superconductors

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 403, 1, 4003)  --   Fleet Command II

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002, 3, 11)		-- Water Power Plant
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002, 3, 192)		-- Farming Dome
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3002, 3, 193)		-- housing Dome

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 410, 4, 17)  -- Space Marines

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 403, 5, 4)  --Frigatte hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 405, 5, 6)  -- Cruis hull

------------------------------------------------------------------------------
---------------------------------   TIER 7   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 5 x special resource excavation, 300 Desert  Colonization, 301 Arctic Colonization, 71 Superconductors
--Leading to:
--special resource ship modules I

--Special Ressouces Modules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1040,	1, 1050) -- Special Ressource modules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1041,	1, 1051) -- Special Ressource modules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1042,	1, 1052) -- Special Ressource modules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1043,	1, 1053) -- Special Ressource modules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1044,	1, 1054) -- Special Ressource modules

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 300,	1, 3) -- Refinery

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1040, 3, 1030) -- Special Ressource Analysis erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1041, 3, 1031) -- Special Ressource Analysis erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1042, 3, 1032) -- Special Ressource Analysis erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1043, 3, 1033) -- Special Ressource Analysis erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1044, 3, 1034) -- Special Ressource Analysis erlaubt Abbau

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1040, 3, 1040) -- 1030  Special resource erlaubt Verarbeitungsgeb�ude
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1041, 3, 1041) -- 1030  Special resource erlaubt Verarbeitungsgeb�ude
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1042, 3, 1042) -- 1030  Special resource erlaubt Verarbeitungsgeb�ude
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1043, 3, 1043) -- 1030  Special resource erlaubt Verarbeitungsgeb�ude
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1044, 3, 1044) -- 1030  Special resource erlaubt Verarbeitungsgeb�ude


--delete from [dbo].[ResearchQuestPrerequisites] where [TargetType] = 1 and [TargetId] > 1049 and [TargetId] < 1055 and SourceId > 1000 and SourceId < 1070 and SourceType = 1


------------------------------------------------------------------------------
---------------------------------   TIER 8   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 5 x special resource modules, 3 Refinery , 4003 Fleet Command II
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1051, 1, 1071)		--Holmium Laser
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1050, 1, 1070)		--Terbium Hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1052, 1, 1072)  -- Scandium shield
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1053, 1, 1073)  -- Yttrium ShipModules
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1054, 1, 1074)  -- lutetium ShipModules

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3, 1, 3003) --  3003 Administration II 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3, 1, 50)  -- Adv Building materials
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 4003, 1, 50)  -- Adv Building materials

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1050, 4, 1105)  --Holmium Laser
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1050, 4, 1108)  -- Yttrium  Cargo
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1050, 4, 1115)  -- Lutetium scanner

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES ( 1, 1051, 4, 1103)  --Terbium Hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES ( 1, 1051, 4, 1109)  --Terbium Impuls

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1052, 4, 1104)  -- Scandium shield
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1052, 4, 1110)  -- Scandium Hyper

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1053, 4, 1101)  -- Yttrium  Crew
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1053, 4, 1106)  -- rocket

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1054, 4, 1102)  -- Lutetium reactor
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1054, 4, 1107)  --MD

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3, 3, 22) -- Synth Material 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3, 3, 6)  -- TreibstoffRaffinerie

------------------------------------------------------------------------------
---------------------------------   TIER 9   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 3003 Administration II, 50 Adv Building materials
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3003,  1, 302)  -- Barren  Colonization

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50,  1, 52)  --Arcology
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50, 1, 55) --Aquafarm
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50, 1, 5) --Kraftwerk
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50, 1, 5000) -- -> Trans Collab 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50, 1, 402)  --Corvette

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3003, 4, 23)		--Colonization modul I
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 50, 3, 50)  -- GVerb. Baumaterial


------------------------------------------------------------------------------
---------------------------------   TIER 10   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 52 Arcology , 55 Aquafarm,   5 Kraftwerk   , 5000 Trans Collab   , 402 Corvette
--Leading to:  

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5, 1, 72) --SuperConductor 2
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5, 1, 502)  -- Space Station

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 402, 1, 4004)  -- 4004 Fleet Command III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 402, 1, 406)	  --Battleship

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 52,  3, 55)  --Arcology
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5, 3, 14) --Kraftwerk
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 55, 3, 52) --AquaFarm
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5000, 5, 221)		--Transcendence Collaboration hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 402, 5, 3)  -- Corvette hull

------------------------------------------------------------------------------
---------------------------------   TIER 11   ---------------------------------
------------------------------------------------------------------------------
-- research Present:  302  Barren  Colonization, 72 SuperConductor 2 , 502 Space Station,  4004 Fleet Command III
--Leading to:  
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 72, 1, 3004)		--Administration III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 72, 1, 5001)		-- transcendence construct
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 502, 1, 2100)	-- Modules II

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 502, 5, 200)  -- Space Station hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 502, 4, 500)  -- Space Station module

------------------------------------------------------------------------------
---------------------------------   TIER 12   ---------------------------------
------------------------------------------------------------------------------
-- research Present:  3004	Administration III, 2100  Modules II
--Leading to: 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3004, 1, 3005)		--Administration IV

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2100, 1, 2102)  --Scanner II
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2100, 1, 2101)  --Cargo II
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2100, 1, 2105)  -- Weapons 2
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2100, 1, 2103) -- Def 2

--enables
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 2100, 4, 101 union all --Crew II
select 1, 2100, 4, 102 union all  --Reactor II
select 1, 2100, 4, 109 union all  --System Engines II
select 1, 2100, 4, 110   --Hyper Engines II

------------------------------------------------------------------------------
---------------------------------   TIER 13   ---------------------------------
------------------------------------------------------------------------------
-- research Present:  5 x special modules II, 5001 transcendence construct, 2102 Scanner II, 2101 Cargo II, 2105  Weapons 2, 2103 Def 2
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5001, 1, 3005)		--Administration IV
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5001, 1, 80 )		--Trans Construct ->  SuperDense Materials
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2103, 1, 406)  --Battleship
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2105, 1, 406)  --Battleship

--enables
-- special resources:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1070, 4, 1205)  -- Adv. Laser
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1070, 4, 1208)  -- Adv. Cargo
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1070, 4, 1215)  -- Adv. Scanner

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1071, 4, 1203)  -- Adv. Hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1071, 4, 1209)  -- Adv. System Engines

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1072, 4, 1204)  -- Adv. Shield
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1072, 4, 1210)  -- Adv. Hyper Engines

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1073, 4, 1201)  -- Adv. Crew
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1073, 4, 1206)  -- Adv. Rocket

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1074, 4, 1202)  -- Adv. Reactor
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1074, 4, 1207)  -- Adv. Mass Driver

--normal stuff:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5001, 5, 220)		--Transcendence Construct hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 5001, 4, 520)		--Transcendence Construct module

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2102, 4, 115)  --Scanner II
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2101, 4, 108)  --Cargo
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])
select 1, 2105, 4, 105 union all  -- Laser  II
select 1, 2105, 4, 106 union all  -- rocket  II
select 1, 2105, 4, 107 union all  -- missile  II
select 1, 2103, 4, 104 union all --Shield II
select 1, 2103, 4, 103 --Hull II



------------------------------------------------------------------------------
---------------------------------   TIER 14   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 3005 Administration IV, 80  SuperDense Materials, 406 Battleship
--Leading to:

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3005,  1, 304)  -- Volcanic Colonization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3005, 1, 3006)		--Administration V
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3005,  1, 305)  -- Toxic planet Colonization
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 80, 1, 81)		--PressureDome
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 80, 1, 2200)		--Modules 3
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 406, 1, 2200)		-- Modules 3
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 406, 1, 4005)		-- Fleet Command IV -

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3005, 4, 523)		--Colonization III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 80,  3, 53)  -- Neutronium Reactor / Superdense
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1,  80, 3, 80) -- Antimatter Utilization -> Lab Buildings
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 406, 5, 7)  -- Battleship hull

------------------------------------------------------------------------------
---------------------------------   TIER 15   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 304 Volcanic Colonization, 305 Toxic planet Colonization, 81 PressureDome, 2200 Modules 3, 4005 Fleet Command IV
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 2202)  -- Scanner III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 2201)  -- Cargo III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 503)		-- Star base III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 2205)  -- Ship Weapons III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 2203)  -- Ship Defenses III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2200,  1, 404)	   -- destroyer

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 81,  3, 54)  -- Pressure Dome
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 2200, 4, 201 union all --Crew III
select 1, 2200, 4, 202 union all  --Reactor III
select 1, 2200, 4, 210 union  --Hyper Engines III
select 1, 2200, 4, 209 -- System enginges III

------------------------------------------------------------------------------
---------------------------------   TIER 16   ---------------------------------
------------------------------------------------------------------------------
-- research Present: 2202 Scanner III, 2201 Cargo III, 2205 Ship Weapons III, 2203 Ship Defenses III, 404 destroyer
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 404,  1, 415)	   -- Heavy Fighter

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2202, 4, 215)  --Scanner III
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 2201, 4, 208)  --Cargo III
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId])
select 1, 2205, 4, 205 union all  -- Laser  III
select 1, 2205, 4, 206 union all  -- rocket  III
select 1, 2205, 4, 207 union all  -- missile  III
select 1, 2203, 4, 204 union all --Shield III
select 1, 2203, 4, 203 --Hull III

INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 404, 5, 5)		--destroyer ship hull

------------------------------------------------------------------------------
---------------------------------   TIER 17   ---------------------------------
------------------------------------------------------------------------------
-- research Present:503 Star base III, 415 Heavy Fighter
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 503, 1, 3006)		--Administration 5
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 503, 1, 504)		--Star Fortress
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 415, 1, 4006)  --Fleet Command V
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 415, 1, 407)		--Super Battleship

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 503, 5, 201)  -- Star Base hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 503, 4, 501)  -- Star Base module
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 415, 5, 2)  -- Heavy Fighter hull

------------------------------------------------------------------------------
---------------------------------   TIER 17   ---------------------------------
------------------------------------------------------------------------------
-- research Present:3006 Administration 5, 504 Star Fortress, 4006 Fleet Command V, 407 Super Battleship
--Leading to:
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 3006, 1, 3010)		--Admin V -> Transcendence 
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 504, 1, 3010)		--Star Fortress -> Transcendence
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 407, 1, 3010)		--Transcendence

--enables
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 504, 5, 202)  -- Star Fortress hull
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 504, 4, 502)  -- Star Fortress module
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 407, 5, 8)  -- SuperBattleship hull



/*

--Star bases research
INSERT into [dbo].[ResearchQuestPrerequisites] 
		([SourceType]	, [SourceId], [TargetType]	, [TargetId]) 
select		1			, 400		, 1				, 501 union all 		-- outpost
select		1			, 403		, 1				, 502 union all --Corvette -> Space station
select		1			, 405		, 1				, 503 union all  --Destroyer -> Star base
select		1			, 407		, 1				, 504			-- Battleship -> Star fortress


--star bases hulls
INSERT into [dbo].[ResearchQuestPrerequisites] 
		([SourceType]	, [SourceId], [TargetType]	, [TargetId]) 
select		1			, 501		, 5				, 199 union all -- outpost
select		1			, 502		, 5				, 200 union all -- -> Space station
select		1			, 503		, 5				, 201 union all  -- -> Star base
select		1			, 504		, 5				, 202			--  -> Star fortress

--star bases hulls modules
INSERT into [dbo].[ResearchQuestPrerequisites] 
		([SourceType]	, [SourceId], [TargetType]	, [TargetId]) 
select		1			, 501		, 4				, 499 union all -- outpost
select		1			, 502		, 4				, 500 union all -- -> Space station
select		1			, 503		, 4				, 501 union all  -- -> Star base
select		1			, 504		, 4				, 502			--  -> Star fortress


--INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (2, 14, 3, 8) -- KommCenter

---



--Sonderressourcen
--Analyse ben�tigt Ressource auf einem Planetenlager
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (6, 1030, 1, 1020) -- 1020 Holmium Analyse ben�tigt Holmium Erz 1030
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (6, 1031, 1, 1021) -- 1020 Terbium Analyse ben�tigt Holmium Erz 1030
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (6, 1032, 1, 1022) -- 1020 Scandium Analyse ben�tigt Holmium Erz 1030
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (6, 1033, 1, 1023) -- 1020 Yttrium Analyse ben�tigt Holmium Erz 1030
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (6, 1034, 1, 1024) -- 1020 Lutetium Analyse ben�tigt Holmium Erz 1030

--Analyse ben�tigt Forschung Metalworking
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 1020) -- 1020 Holmium Analyse ben�tigt Metalworking
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 1021) -- 1020 Terbium Analyse ben�tigt Metalworking
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 1022) -- 1020 Scandium Analyse ben�tigt Metalworking
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 1023) -- 1020 Yttrium Analyse ben�tigt Metalworking
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1, 1, 1024) -- 1020 Lutetium Analyse ben�tigt Metalworking
--delete from [dbo].[ResearchQuestPrerequisites] where [SourceType] = 1 and SourceId = 152 and TargetId > 1010

--erlaubt Geb�ude und somit Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1020, 3, 1030) -- 1020 Holmium Analyse erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1021, 3, 1031) -- 1020 Terbium Analyse erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1022, 3, 1032) -- 1020 Scandium Analyse erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1023, 3, 1033) -- 1020 Yttrium Analyse erlaubt Abbau
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1024, 3, 1034) -- 1020 Lutetium Analyse erlaubt Abbau

--und Erforschung der Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1020, 1, 1040) -- 1020 Holmium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1021, 1, 1041) -- 1020 Terbium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1022, 1, 1042) -- 1020 Scandium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1023, 1, 1043) -- 1020 Yttrium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1024, 1, 1044) -- 1020 Lutetium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1040, 3, 1040) -- 1020 Holmium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1041, 3, 1041) -- 1020 Terbium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1042, 3, 1042) -- 1020 Scandium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1043, 3, 1043) -- 1020 Yttrium Analyse erlaubt Forschung Verarbeitung
INSERT [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) VALUES (1, 1044, 3, 1044) -- 1020 Lutetium Analyse erlaubt Forschung Verarbeitung


--Module Forschung 
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 1040, 1, 1050 union all  -- 1020 Holmium Verarbeitung erlaubt Forschung Laser
select 1, 1041, 1, 1051 union all
select 1, 1042, 1, 1052 union all
select 1, 1043, 1, 1053 union all
select 1, 1044, 1, 1054 

--Module Produktion 
INSERT into [dbo].[ResearchQuestPrerequisites] ([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 1050, 4, 1105 union all	-- 1020 Holmium Verarbeitung erlaubt Forschung Laser
select 1, 1051, 4, 1103 union all	-- Terbium --Hull
select 1, 1052, 4, 1104 union all	-- Scandium --Shield
select 1, 1053, 4, 1101 union all	-- Yttrium  Crew
select 1, 1053, 4, 1108 union all	-- Yttrium  Cargo
select 1, 1053, 4, 1110 union all	-- Yttrium Engine
select 1, 1054, 4, 1102	union all	-- Lutetium reactor
select 1, 1054, 4, 1115				-- Lutetium scanner


INSERT into [dbo].[ResearchQuestPrerequisites] 
([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 1		, 1, 3002 union all  --Administration I
select 1, 3002	, 1, 3003 union all  --Administration II
select 1, 3003	, 1, 3004 union all  --Administration III
select 1, 3004	, 1, 3005 union all  --Administration IIII
select 1, 3005	, 1, 3006 --Administration IIIII

INSERT into [dbo].[ResearchQuestPrerequisites] 
([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 1		, 1, 4002 union all  --Fleet Command  I
select 1, 4002	, 1, 4003 union all  --Fleet Command  II
select 1, 4003	, 1, 4004 union all  --Fleet Command  III
select 1, 4004	, 1, 4005 union all  --Fleet Command  IV
select 1, 4005	, 1, 4006 --Fleet Command  V

--Special ressources  1020 -> 5000 Transcendence
INSERT into [dbo].[ResearchQuestPrerequisites] 
([SourceType], [SourceId], [TargetType], [TargetId]) 
select 1, 1020		, 1, 5000 union all  
select 1, 1021	, 1, 5000 union all  
select 1, 1022	, 1, 5000 union all  --
select 1, 1023	, 1, 5000 union all  --
select 1, 1024	, 1, 5000 union all  --
select 1, 5000		, 1, 5001  union all  -- Transcendence Construct -> Transcendence Collaboration
select 1, 5001		, 5, 220  union all  -- Trans Construct
select 1, 5000		, 5, 221  union all  -- Trans Collab
select 1, 5001		, 4, 520   -- Trans Construct Module
*/


--delete from [dbo].[ResearchQuestPrerequisites]  where [SourceType] = 1 and [SourceId] = 5000

