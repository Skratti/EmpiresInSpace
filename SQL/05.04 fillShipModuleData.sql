
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
select		7,		-1,		 -1,		 0,					 0,			   80,			 0,			 0,					0,				 0,				 0,				0,			0,			0,			3,  	50				--mass driver

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
select		23,	   -10,		 -5,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			1,			0	,500000000 union all	 -- colonisation
select		523,   -20,		-10,		 0,					 0,				 0,			 0,			 0,					0,				 0,				 0,				0,			1,			0	,1000000000			-- colonisation

--specail Res 1
INSERT into [dbo].[ModulesGain] (
[modulesId], [crew], [energy], [hitpoints],		[damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],weaponType, toHitRatio) 
select 1101, 20,	-3,					0,						0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all   --crew
select 1102, -2,	25,					0,						0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all  --reactor
select 1103, 0,		0,					140,					0,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all   --hull
select 1104, -3,	-4,					0,					   33,				0,			0,		0,				0,					0,				0,		0,					0,			0,				0,		0	union all  --shield
select 1105, -3,	-5,					0,						0,			   37,			0,		0,				0,					0,				0,		0,					0,			0,				1,	  140	union all    --laser
select 1108, -2,	-2,					0,						0,				0,			400,	50,				0,					0,				0,		0,					0,			0,				0,		0	union all   -- cargo
select 1109, -3,	-2,					0,						0,				0,			0,		0,				0,				  100,				0,	  100,					0,			0,				0,		0	union all   -- cargo
select 1110, -3,	-4,					0,						0,				0,			0,		0,				24,					0,				24,		0,					0,			0,				0,		0	union all    --star engines
select 1115, -2,	-7,					0,					   10,				0,			0,		0,				0,					0,				0,		0,					0,			2,				0,		0	   --scanner


-- Level 2
INSERT into [dbo].[ModulesGain] 
([modulesId], [crew], [energy], [hitpoints],	[damagereduction],	[damageoutput], [cargoroom],	[fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],	weaponType, toHitRatio) 
select	101,	 24,		 -3,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0	 union all   --crew
select	102,	 -2,		 38,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0	 union all  --reactor
select	103,	  0,		  0,		150,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0	 union all   --hull
select	104,	 -3,		 -4,		  0,				   34,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0,		0	 union all  --shield
select	105,	 -3,		 -6,		  0,					0,				30, 		0,				0,				0,				0,				0,					0,			0,			0,			1,	  140	 union all    --laser
select	106,	 -3,		 -6,		  0,					0,				60, 		0,				0,				0,				0,				0,					0,			0,			0,			2,	   90	 union all   --missile
select	107,	 -3,		 -6,		  0,					0,			   120,  		0,				0,				0,				0,				0,					0,			0,			0,			3,	   50	 union all   --mass driver
select	108,	 -1,		 -2,		  0,					0,				 0,			500,			50,				0,				0,				0,					0,			0,			0,			0,		0	 union all   -- cargo
select	109,	 -2,		 -4,		  0,					0,				 0,			0,				0,				0,		 	  110,				0,				  110,			0,			0,			0,		0	 union all   --system Enginge
select	110,	 -2,		 -4,		  0,					0,				 0,			0,				0,				26,				0,			   26,					0,			0,			0,			0,		0   union all    --star engines
select	115,	 -2,		 -7,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			2,			0,	    0	--scanner

-- Level 3
INSERT into [dbo].[ModulesGain] 
([modulesId], [crew], [energy], [hitpoints],	[damagereduction],	[damageoutput], [cargoroom],	[fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],	weaponType) 
select	201,	 35,		 -4,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0 union all   --crew
select	202,	 -4,		 40,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0 union all  --reactor
select	203,	  0,		  0,		200,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			0,			0 union all   --hull
select	204,	 -5,		 -4,		  0,				   37,				 0,	 		0,				0,				0,				0,				0,					0,			0,			0,			0 union all  --shield
select	205,	 -5,		 -6,		  0,					0,				40,	    	0,				0,				0,				0,				0,					0,			0,			0,			1 union all    --laser
select	206,	 -5,		 -2,		  0,					0,			    80, 		0,				0,				0,				0,				0,					0,			0,			0,			2 union all   --missile
select	207,	 -5,		 -4,		  0,					0,			   160, 		0,				0,				0,				0,				0,					0,			0,			0,			3 union all   --mass driver
select	208,	 -2,		 -7,		  0,					0,				 0,			800,			50,				0,				0,				0,					0,			0,			0,			0 union all   -- cargo
select	209,	 -3,		 -9,		  0,					0,				 0,			0,				0,				0,		 	  140,				0,				  140,			0,			0,			0 union all   --system Enginge
select	210,	 -3,		 -9,		  0,					0,				 0,			0,				0,				35,				0,			   35,					0,			0,			0,			0 union all    --star engines
select	215,	 -4,		 -12,		  0,					0,				 0,			0,				0,				0,				0,				0,					0,			0,			3,			0    --scanner


--star bases
INSERT into [dbo].[ModulesGain] 
	([modulesId], [crew], [energy], [hitpoints], [damagereduction], [damageoutput], [cargoroom], [fuelroom], [inSpaceSpeed], [inSystemSpeed], [maxSpaceMoves], [maxSystemMoves], [special], [scanRange],weaponType) 
select 499,			-9,		-4,	0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all   --outpost
select 500,			-30, -30,	0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all  --
select 501,			-100, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all   --
select 502,			-300, -300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0 union all --star fortressu   --
select 520,			-200, -200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0

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

INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 1, 50)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 2, 30)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 7, 10)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1, 10, 10)  --metall


--Reactor I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 1, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (2, 10, 12)  --metall


--Hull
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 1, 30)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (3, 10, 50)  --metall


--Shield
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (4, 1, 30)  -- bm


--Laser
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (5, 1, 35)  -- bm


--Missile
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 3, 30) ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 10, 15)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (6, 1, 15)  -- bm

--Mass Driver I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 7, 12)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (7, 1, 35)  -- bm

--Cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 1, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (8, 10, 20)  --metall

--System Engines I
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 7, 10)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 1, 25)  -- bm


--Hyper Engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 7, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (10, 1, 25)  -- bm

--Colonizing Module I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 1, 60)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 2, 100)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (13, 10, 20)  --metall


--Asteroid Miner
/*
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 1, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 5, 10)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (14, 7, 20)
*/
--Scanner I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 7, 15)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 10, 10)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (15, 1, 35)  -- bm

--Space Marines
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 7, 60)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 10, 50)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 1, 30)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (17, 2, 10)  -- Nahrung

--Colonizing Module II
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 1, 90)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 2, 200)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 10, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (23, 50, 10)


--stufe 2

--crew II
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 1, 70)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 2, 50)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 7, 20)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (101, 11, 50)  -- kunststoffe

--Reactor I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 1, 70)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (102, 11, 50)  -- kunststoffe

--Hull 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (103, 10, 140)  --metall


--Shield 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (104, 11, 50)  -- kunststoffe

--Laser 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 7, 25)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (105, 11, 50)  -- kunststoffe

--Missile 2
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 3, 50)  --ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 7, 25)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 11, 50)  -- kunststoffe

--Mass driver 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 7, 25)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (107, 11, 50)  -- kunststoffe

--cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 7, 20)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 10, 60)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (108, 11, 30)  -- kunststoffe

--system
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 7, 20)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 10, 60)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (109, 11, 40)  -- kunststoffe

--hyper
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 10, 60)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (110, 11, 40)  -- kunststoffe

--Scanner 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 7, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 10, 60)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (115, 11, 40)  -- kunststoffe


--Special Res 1
--crew
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 1, 30)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 2, 30)   --food
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 7, 40)   -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1101, 1043, 50)  --Yttrium

--reactor
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 1, 20)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 7, 30)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 1044, 50)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1102, 10, 30)  --metall

--hull
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 1, 20)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 7, 30)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 1041, 50) --Terbium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1103, 10, 25)  --metall

--shield
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 1, 10)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 7, 30)-- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 1042, 50) --Scandium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1104, 10, 20)  --metall


--laser
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 1, 10)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 1040, 50)  --Holmium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1105, 10, 10)  --metall

--cargo
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 1, 10)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 7, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 1043, 50)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1108, 10, 30)  --metall

--star engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 1, 10)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 7, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 1043, 50)  --Yttrium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1110, 10, 30)  --metall

--system engines I
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 1, 10)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 7, 30)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 1044, 50)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1109, 10, 30)  --metall

--scanner
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 1, 20)		-- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 7, 35)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 1044, 50)  --Lutetium
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (1115, 10, 10)  --metall


--Stufe III

--crew III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 1, 70)  -- bm
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 2, 50)  -- Nahrung
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 7, 40)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (201, 11, 50)  -- kunststoffe

--Reactor III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 1, 70)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 11, 50)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (202, 60, 20)  -- Neutronium

--Hull III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 50, 30)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 10, 60)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (203, 60, 20)  -- Neutronium

--Shield III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 50, 30)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 10, 40)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 11, 60)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (204, 60, 10)  -- Neutronium

--Laser III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 7, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 50, 30)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 11, 50)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (205, 60, 10)  -- Neutronium

--Missile III
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (106, 3, 50)  --ammunition
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 7, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 11, 50)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (206, 60, 10)  -- Neutronium

--Mass driver III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 7, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 50, 10)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 11, 60)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (207, 60, 10)  -- Neutronium

--cargo III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 7, 40)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 50, 30)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 11, 30)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (208, 60, 20)  -- Neutronium

--system III
--INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (9, 4, 20)  --fuel
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 7, 40)  -- assembly points
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 50, 30)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 10, 20)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 11, 50)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (209, 60, 10)  -- Neutronium

--hyper III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 7, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 10, 30)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 11, 50)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (210, 60, 10)  -- Neutronium

--Scanner III
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 7, 50)
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 50, 20)  -- adv bm 2
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 10, 50)  --metall
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 11, 30)  -- kunststoffe
INSERT [dbo].[ModulesCosts] ([modulesId], [goodsId], [amount]) VALUES (215, 60, 30)  -- Neutronium



-- Star bases
INSERT [dbo].[ModulesCosts] 
		([modulesId], [goodsId], [amount])
select			499,		1,		120		union all  -- BM
select			499,		7,		60		union all  -- Assembly
select			499,		10,		120		union all  -- Metall
select			500,		1,		240		union all
select			500,		7,		100		union all
select			500,		10,		280		union all
select			500,		11,		140		union all  --Synthetic materials
select			500,		50,		80		union all
select			501,		1,		300		union all   --bm
select			501,		7,		200		union all   -- ASSEMBLY
select			501,		10,		340		union all   --metal
select			501,		11,		180		union all   --synth
select			501,		50,		120		union all   --Adv. Building Materials
select			502,		1,		500		union all   --bm
select			502,		7,		400		union all   -- ASSEMBLY
select			502,		10,		500		union all   --metal
select			502,		11,		300		union all   --synth
select			502,		50,		200	    union all   --Adv. Building Materials

select			520,		1,		900		union all
select			520,		7,		300	union all
select			520,		10,		680		union all  --  metal
select			520,		11,		400		union all -- synth
select			520,		50,		400		union all --Adv. Building Materials
select			520,		1040,		100		union all
select			520,		1041,		100		union all
select			520,		1042,		100		union all
select			520,		1043,		100		union all
select			520,		1044,		100						
