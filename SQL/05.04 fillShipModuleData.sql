
delete from [dbo].[ModulesGain]

--level 1
INSERT [dbo].[ModulesGain] 
([modulesId],	[crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) 
select		1,		15,		 -1,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			0,			0	union all        --crew
select		2,		-1,		 16,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			0,			0	union all		 --reactor
select		3,		 0,		  0,	   100,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			0,			0	union all		  --hull
select		4,		-1,		 -1,		 0,					30,				 0,			 0,			 0,					0,				 0,				 0,				0,			0,			0			 --shield

INSERT [dbo].[ModulesGain] 
([modulesId],	[crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange], weaponType, toHitRatio) 
select		5,		-1,		 -1,		 0,					 0,				20,			 0,			 0,					0,				 0,				 0,				0,			0,			0,			1,		140	union all	--laser
select		6,		-1,		 -1,		 0,					 0,				40,			 0,			 0,					0,				 0,				 0,				0,			0,			0,			2,		90	union all	--missile
select		7,		-1,		 -1,		 0,					 0,			    80,			 0,			 0,					0,				 0,				 0,				0,			0,			0,			3,  	60				--mass driver

INSERT [dbo].[ModulesGain] 
([modulesId],	[crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange]) 
select		8,		-1,		 -1,		 0,					 0,				 0,		   200,			50,					0,				 0,				 0,				0,			0,			0	union all    -- cargo
select		9,		-1,		 -1,		 0,					 0,				 0,			 0,			 0,					0,			   70,				 0,			   70,			0,			0	union all	 --system Enginge
select		10,		-1,		 -1,		 0,					 0,				 0,			 0,			 0,					20,				 0,				20,				0,			0,			0	union all		 --star engines
select		15,		-1,		 -3,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			0,			1 	union all		 --scanner
select		17,	   -19,		 -11,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			2,			0 			--space marines

INSERT [dbo].[ModulesGain] 
([modulesId],	[crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange], [population]) 
select		13,		-5,		 -2,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			1,			0	,200000000 union all  -- colonisation
select		23,	   -10,		 -5,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			1,			0	,400000000 union all	 -- colonisation
select		523,   -20,		-10,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			1,			0	,700000000			-- colonisation

--specail Res 1
INSERT into [dbo].[ModulesGain] (
[modulesId], [crew], [energy], [hitpoints],		[damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],weaponType, toHitRatio) 
select 1101, 20,	-3,					0,						0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all   --crew
select 1102, -2,	25,					0,						0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all  --reactor
select 1103, 0,		0,					140,					0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all   --hull
select 1104, -3,	-4,					0,					   33,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all  --shield
select 1105, -3,	-5,					0,						0,			   24,			0,		0,				0,					0,				0,		0,					0,			0,				1,	  140	union all    --laser
select 1108, -2,	-2,					0,						0,				0,			400,	50,				0,					0,				0,		0,					0,			0,				0,		0	union all   -- cargo
select 1109, -3,	-2,					0,						0,				0,			0,		0,				0,				  100,				0,	  100,					0,			0,				0,		0	union all   -- cargo
select 1110, -3,	-4,					0,						0,				0,			0,		0,				24,					0,				24,		0,					0,			0,				0,		0	union all    --star engines
select 1115, -2,	-7,					0,					   10,				0,			0,		0,				0,					0,				0,		0,					0,			2,				0,		0	   --scanner

--special Res 2
INSERT into [dbo].[ModulesGain] 
([modulesId], [crew], [energy], [hitpoints],	[damagereduction],	[damageoutput], [cargoroom],	[fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],	weaponType, toHitRatio)
select	1201,	 38,		 -4,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all   --crew
select	1202,	 -4,		 44,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all  --reactor
select	1203,	  0,		  0,		220,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all   --hull
select	1204,	 -5,		 -4,		  0,				   39,				 0,	 		0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all  --shield
select	1205,	 -5,		 -6,		  0,					0,				46,	    	0,				0,				0,				0,				0,					0,			0,			0,			1,	  140			union all    --laser
select	1206,	 -5,		 -2,		  0,					0,			    92, 		0,				0,				0,				0,				0,					0,			0,			0,			2,	   90			union all   --missile
select	1207,	 -5,		 -4,		  0,					0,			   184, 		0,				0,				0,				0,				0,					0,			0,			0,			3,	   60			union all   --mass driver
select	1208,	 -2,		 -7,		  0,					0,				 0,			1000,		  100,				0,				0,				0,					0,			0,			0,			0,		0			union all   -- cargo
select	1209,	 -3,		 -7,		  0,					0,				 0,			0,				0,				0,		 	  150,				0,				  150,			0,			0,			0,		0			union all   --system Enginge
select	1210,	 -3,		 -7,		  0,					0,				 0,			0,				0,				38,				0,			   38,					0,			0,			0,			0,		0			union all    --star engines
select	1215,	 -4,		 -12,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			4,			0,		0	--scanner
--delete from [dbo].[ModulesGain]  where [modulesId] > 1200

-- Level 2
INSERT into [dbo].[ModulesGain] 
([modulesId], [crew], [energy], [hitpoints],	[damagereduction],	[damageoutput], [cargoroom],	[fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],	weaponType, toHitRatio) 
select	101,	 25,		 -3,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0		union all   --crew
select	102,	 -2,		 28,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0		union all  --reactor
select	103,	  0,		  0,		150,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0		union all   --hull
select	104,	 -3,		 -4,		  0,				   34,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0		union all  --shield
select	105,	 -3,		 -6,		  0,					0,				30, 		0,				0,				0,				0,				0,					0,			0,			0,			1,	  140		union all    --laser
select	106,	 -3,		 -6,		  0,					0,				60, 		0,				0,				0,				0,				0,					0,			0,			0,			2,	   90		union all   --missile
select	107,	 -3,		 -6,		  0,					0,			   120,  		0,				0,				0,				0,				0,					0,			0,			0,			3,	   60		union all   --mass driver
select	108,	 -1,		 -2,		  0,					0,				 0,			500,			50,				0,				0,				0,					0,			0,			0,			0,		0		union all   -- cargo
select	109,	 -2,		 -4,		  0,					0,				 0,			0,				0,				0,		 	  110,				0,				  110,			0,			0,			0,		0		union all   --system Enginge
select	110,	 -2,		 -4,		  0,					0,				 0,			0,				0,				26,				0,			   26,					0,			0,			0,			0,		0		union all    --star engines
select	115,	 -2,		 -7,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			2,			0,	    0	--scanner

-- Level 3
INSERT into [dbo].[ModulesGain] 
([modulesId], [crew], [energy], [hitpoints],	[damagereduction],	[damageoutput], [cargoroom],	[fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],	weaponType, toHitRatio)
select	201,	 35,		 -4,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all   --crew
select	202,	 -4,		 50,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all  --reactor
select	203,	  0,		  0,		200,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all   --hull
select	204,	 -5,		 -4,		  0,				   37,				 0,	 		0,				0,				0,				0,				0,					0,			0,			0,			0,		0			union all  --shield
select	205,	 -5,		 -6,		  0,					0,				40,	    	0,				0,				0,				0,				0,					0,			0,			0,			1,	  140			union all    --laser
select	206,	 -5,		 -2,		  0,					0,			    80, 		0,				0,				0,				0,				0,					0,			0,			0,			2,	   90			union all   --missile
select	207,	 -5,		 -4,		  0,					0,			   160, 		0,				0,				0,				0,				0,					0,			0,			0,			3,	   60			union all   --mass driver
select	208,	 -2,		 -7,		  0,					0,				 0,			800,			50,				0,				0,				0,					0,			0,			0,			0,		0			union all   -- cargo
select	209,	 -3,		 -6,		  0,					0,				 0,			0,				0,				0,		 	  140,				0,				  140,			0,			0,			0,		0			union all   --system Enginge
select	210,	 -3,		 -6,		  0,					0,				 0,			0,				0,				35,				0,			   35,					0,			0,			0,			0,		0			union all    --star engines
select	215,	 -4,		 -12,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			3,			0,		0	--scanner


--star bases
INSERT into [dbo].[ModulesGain] 
	([modulesId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],weaponType) 
select 499,			-9,		-4,	0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all   --outpost
select 500,			-30, -30,	0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all  --
select 501,			-60, -60,   0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all   --
select 502,			-100, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all --star fortress   --
select 520,			-80, -80,   0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0

/****** Object:  Table [dbo].[ModulesCosts]    Script Date: 12/06/2013 21:56:05 ******/
/*
2, N'Reactor I', 2, 2002,
3, N' I', 3, 2003, 78
4, N' I', 4, 2004, 
5, N' I', 5, 2005, 8
6, N' I', 6, 2006,
7, N', 7, 2
8, N'Cargo I', 8, 2008, 8
9, N'System Engines I', 9
10, N'', 1
13, N'Outpost Module', 13
14, N'', 14
15, N'', 15, 201
23, N'',
*/
-- Crew I --delete from [ModulesCosts]
delete from [ModulesCosts]

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 1, 10)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 2, 20)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 7, 5)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 10, 10)  --metall


--Reactor I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 1, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 10, 12)  --metall


--Hull
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 1, 10)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 10, 15)  --metall


--Shield
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 1, 10)  -- bm


--Laser
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 1, 10)  -- bm


--Missile
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 3, 30) ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 1, 10)  -- bm

--Mass Driver I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 1, 10)  -- bm

--Cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 1, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 10, 15)  --metall

--System Engines I
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 7, 5)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 1, 5)  -- bm


--Hyper Engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 1, 10)  -- bm

--Colonizing Module I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 1, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 2, 40)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 10, 20)  --metall
--delete from [ModulesCosts] where [modulesId] = 13

--Asteroid Miner
/*
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 1, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 5, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 7, 20)
*/
--Scanner I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 1, 10)  -- bm

--Space Marines
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 1, 10)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 2, 10)  -- Nahrung

--Colonizing Module II
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 1, 60)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 2, 60)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 10, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 50, 60)
--delete from [ModulesCosts] where [modulesId] = 23

--stufe 2

--crew II
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 1, 20)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 2, 30)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 7, 10)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 1040, 20)  --Holmium

--Reactor II
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 1, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 1042, 20)  --Scandium

--delete from [ModulesCosts] where [modulesId] = 101 and [goodsId] = 1042

--Hull 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 10, 40)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 1044, 15)  --Lutetium

--Shield 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 1041, 40)  --Terbium

--Laser 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 1043, 15)  --Yttrium

--Missile 2
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 3, 50)  --ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 1043, 15)  --Yttrium

--Mass driver 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 1043, 15)  --Yttrium

--cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 1040, 40)  --Holmium 

--system 2
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 7, 10)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 11, 5)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 1044, 40)  --Lutetium

--hyper
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 11, 5)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 1041, 15)  --Terbium

--Scanner 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 1042, 40)  --Scandium  

--Special Res 1
--laser
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 1040, 20)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 10, 5)  --metall


--Terbium
--hull
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 7, 5)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 1041, 20) --Terbium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 10, 5)  --metall

--system engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 1041, 60)  --Terbium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 10, 5)  --metall

--Scandium
--shield
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 7, 8)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 1042, 60) --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 10, 5)  --metall

--star engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 1042, 20)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 10, 5)  --metall


--Yttrium

--crew
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 2, 10)   --food
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 7, 5)   -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 1043, 30)  --Yttrium

--cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 7, 5)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 1043, 60)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 10, 5)  --metall


--Lutetium

--reactor
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 7, 5)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 1044, 30)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 10, 5)  --metall

--scanner
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 1, 5)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 7, 8)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 1044, 60)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 10, 5)  --metall



--Stufe III

--crew III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 1, 10)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 2, 50)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 7, 15)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 11, 15)  -- kunststoffe

--Reactor III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 1, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 60, 10)  -- Neutronium

--Hull III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 60, 10)  -- Neutronium

--Shield III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 10, 15)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 60, 5)  -- Neutronium

--Laser III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 60, 5)  -- Neutronium

--Missile III
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 3, 50)  --ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 60, 5)  -- Neutronium

--Mass driver III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 60, 5)  -- Neutronium

--cargo III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 50, 25)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 60, 10)  -- Neutronium

--system III
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 7, 15)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 60, 5)  -- Neutronium

--hyper III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 11, 10)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 60, 5)  -- Neutronium

--Scanner III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 10, 25)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 11, 15)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 60, 15)  -- Neutronium

--Colonizing Module III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (523, 1, 55)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (523, 2, 60)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (523, 10, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (523, 7, 25)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (523, 50, 20)
--delete from [ModulesCosts] where [modulesId] = 523

--Adv. Special Ressource 

-- Holmium II
--Adv. Laser
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 10, 5)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 11, 30)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 1040, 40)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 1043, 10)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1205, 1044, 10)  --Lutetium

--Adv. Missile
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 3, 50)  --ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 11, 15)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 1040, 40)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 1043, 10)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1206, 1044, 10)  --Lutetium

--Adv. Mass driver
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 11, 15)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 1040, 40)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 1043, 10)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1207, 1044, 10)  --Lutetium


--Terbium II
--Adv. Hull
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 50, 15)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 10, 10)  --metall
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 1041, 60)  --Terbium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 1040, 15)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1203, 1044, 15)  --Lutetium

--Adv. system
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 7, 15)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 50, 15)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 11, 25)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 1041, 120)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 1042, 30)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1209, 1043, 30)  --Yttrium


--Scandium
--Adv. Shield
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 50, 15)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 11, 30)  -- kunststoffe

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 1042, 120)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 1040, 30)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1204, 1041, 30)  --Terbium

--Adv. hyper
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 11, 10)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 1042, 40)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 1043, 20)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1210, 1044, 20)  --Terbium

--Yttrium
--Adv. crew 
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 1, 15)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 2, 25)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 7, 15)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 11, 5)  -- kunststoffe

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 1043, 60)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 1042, 15)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1201, 1041, 15)  --Terbium

--Adv. cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 50, 15)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 11, 15)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 60, 20)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 1043, 120)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 1040, 30)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1208, 1044, 30)  --Terbium

--Lutetium
--Adv. Reactor
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 1, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 50, 5)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 11, 5)  -- kunststoffe

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 1044, 60)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 1042, 15)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1202, 1041, 15)  --Yttrium

--Adv. Scanner
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 10, 15)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 11, 10)  -- kunststoffe
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 60, 10)  -- Neutronium

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 1044, 120)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 1040, 30)  --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1215, 1043, 30)  --Yttrium

-- Star bases
INSERT [dbo].[ModulesCosts] 
		([modulesId], [goodsId], [amount])
select			499,		1,		60		union all  -- BM
select			499,		7,		20		union all  -- Assembly
select			499,		10,		60		union all  -- Metall

select			500,		1,		60		union all
select			500,		7,		45		union all
select			500,		10,		140		union all
select			500,		11,		70		union all  --Synthetic materials
select			500,		50,		40		union all

select			501,		1,		100		union all   --bm
select			501,		7,		80		union all   -- ASSEMBLY
select			501,		10,		110		union all   --metal
select			501,		11,		90		union all   --synth
select			501,		50,		80		union all   --Adv. Building Materials

select			502,		1,		250		union all   --bm
select			502,		7,		120		union all   -- ASSEMBLY
select			502,		10,		250		union all   --metal
select			502,		11,		100		union all   --synth
select			502,		50,		80	    union all   --Adv. Building Materials

select			520,		1,		500		union all	--BM
select			520,		2,		500		union all	-- Nahrung
select			520,		7,		200		union all	-- Assembly
select			520,		10,		500		union all	--  metal
select			520,		11,		200		union all -- synth
select			520,		50,		100		union all --Adv. Building Materials
select			520,		1040,		150		union all
select			520,		1041,		150		union all
select			520,		1042,		150		union all
select			520,		1043,		150		union all
select			520,		1044,		150						
