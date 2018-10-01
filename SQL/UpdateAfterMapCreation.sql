  update [dbo].[GalaxyMap] set [galaxyName] = 'Bosis', isDemo = 0

  /*
  select min([positionY]), max([positionY]),  min([positionX]), max([positionX])  FROM [FornaxA].[dbo].[StarMap]
   select min([positionY]), max([positionY]),  min([positionX]), max([positionX])  FROM [dbo].[StarMap]
  update  [dbo].[StarMap] set positionX = positionX + (500 - (618/2)) ,  positionY = positionY + (500 - (618/2))
  */

-- generate Starnames  	
update StarMap set systemname = 'x';

update StarMap set systemname = names.fullName
from  StarMap
inner join 
(SELECT fullName,
	ROW_NUMBER() OVER(ORDER BY [randomRanking] ASC)  as orderId
  FROM [dbo].[StarNames]) as names
 on names.orderId = StarMap.id 
where StarMap.objectId < 5000 
go
print 'Starnames generated'

--generate Trade stations
--declare @move int = 0;
--select MIN(positionX) + @move as MinX, Max(positionX) + @move as MaxX, MIN(positionY) + @move as MinY, Max(positionY) + @move as MaxY from dbo.StarMap
--update dbo.StarMap set positionX = positionX + @move, positionY = positionY + @move
--delete from ships
declare @upperleftXY int;
set @upperleftXY = 4460;
declare @distanceBetweenStations int;
set @distanceBetweenStations = 30;
declare @galaxyWidth int;
set @galaxyWidth = 1080;
declare @SpaceStationsCountPerRow int;
set @SpaceStationsCountPerRow =( @galaxyWidth / @distanceBetweenStations) + 1;


INSERT INTO [dbo].[Ships] (id,userId,spaceX,spaceY, templateId, hullId, name, hitpoints, objectId, [shipHullsImage])
select 
	id,
	0,
	 X, Y,
	0,
	201,
	'Space Station',
	1000,
	437,10	
from (
select 
	(numberX.number * @distanceBetweenStations) + @upperleftXY as X
,(numberY.number * @distanceBetweenStations) + @upperleftXY as Y
,numberX.number  + numberY.number * @SpaceStationsCountPerRow  as id
from numbers  as numberX  
cross apply numbers  as numberY 
where numberX.number < @SpaceStationsCountPerRow
and numberY.number < @SpaceStationsCountPerRow) as positions
print 'Trade stations generated';


-- create ship names
-- can take a few minutes (9000 stars tested)
-- last run did take 5 minutes
with starMapPosition as (
select systemname,
geometry::STGeomFromText('POINT (' + convert(varchar(15),dbo.StarMap.positionX ) + ' ' + convert(varchar(15), dbo.StarMap.positionY) + ')',0) as position
 from dbo.StarMap
where objectId < 5000
), shipsToUpdate as 
(
select 
	dbo.ships.id, 
	StarMap.position.STDistance( 
geometry::STGeomFromText('POINT (' + convert(varchar(15),dbo.ships.spaceX ) + ' ' + convert(varchar(15), dbo.ships.spaceY) + ')',0)
 ) as distance,
 StarMap.systemname

from dbo.ships
left join starMapPosition as StarMap
on StarMap.position.STDistance( 
geometry::STGeomFromText('POINT (' + convert(varchar(15),dbo.ships.spaceX ) + ' ' + convert(varchar(15), dbo.ships.spaceY) + ')',0)
 ) < 20
 where  StarMap.systemname is not null
 ),
 ascDistance as 
 (
 select *,
 ROW_NUMBER() OVER( PARTITION BY id
                      ORDER BY distance asc ) AS RN
					   from shipsToUpdate
)
--select * from ascDistance where RN = 1
update newShipnames set name = 'Station ' + ascDistance.systemname
from dbo.ships as newShipnames
inner join ascDistance
on (ascDistance.id = newShipnames.id	
	and ascDistance.RN = 1)

delete from dbo.Ships where name = 'Space Station' or name = 'Station x'


-- find system objects (planets, asteroids) which occupy the same tile
select * from 	[SolarSystemInstances] 
inner join [SolarSystemInstances] as dupl
on [SolarSystemInstances].systemId = dupl.systemId
and [SolarSystemInstances].x = dupl.x
and [SolarSystemInstances].y = dupl.y
and SolarSystemInstances.id != dupl.id

-- delete system objects (planets, asteroids) which occupy the same tile
delete from 	[SolarSystemInstances] from 	[SolarSystemInstances] 
inner join [SolarSystemInstances] as dupl
on [SolarSystemInstances].systemId = dupl.systemId
and [SolarSystemInstances].x = dupl.x
and [SolarSystemInstances].y = dupl.y
and SolarSystemInstances.id != dupl.id
where SolarSystemInstances.objectId in(10, 11)
print 'System objects like asteroids and planets, occupying the same tile, are removed'



--get Space Stations which are directly on the same tile as a star:
select 
 dbo.Ships.*
into #ShipsToCorrect
from dbo.StarMap
inner join dbo.Ships
on  (StarMap.positionX =  dbo.Ships.spaceX and  StarMap.positionY =  dbo.Ships.spaceY)
where dbo.StarMap.objectId < 5000

--move Space Stations which are directly on the same tile as a star a bit 
update  dbo.Ships set spaceX = dbo.Ships.spaceX -2 , spaceY = dbo.Ships.spaceY + 1 
from dbo.Ships 
inner join #ShipsToCorrect
on #ShipsToCorrect.id = dbo.Ships.id
and  #ShipsToCorrect.hullId != 1
/*
select position.STX - 2, position.STY + 1 ,
geometry::STGeomFromText('POINT (' + convert(varchar(15), position.STX - 2) + ' ' + convert(varchar(15), position.STY + 1) + ')',0) as newPosition,
  * from #ShipsToCorrect
where hullId != 1
*/ 
drop table #ShipsToCorrect
print 'Space Stations  occupying the same tile as a star, are moved two field'
   

--generate a [CommunicationNode] for each trading station
delete from [dbo].[CommunicationNode] 
insert into [dbo].[CommunicationNode] (
id,
	[userId]      
      ,[name]
      ,[positionX]
      ,[positionY]
      ,[sysX]
      ,[sysY]
      ,[connectionType]
      ,[connectionId]
      ,[activ])
 select [Ships].id, 0  , [Ships].name ,spaceX,spaceY,0,0,0,[Ships].id,1  from [Ships] where userId = 0 and hullId = 201
print 'One CommunicationNode per Space Stations created'    ;

   
--set ids for commNodes
     with Comms as (
	SELECT 
      [id]
	  ,ROW_NUMBER() over (ORDER BY id DESC) as rowsN
  FROM [dbo].[CommunicationNode]
  ) update Comms set id = rowsN

--


--SET QUOTED_IDENTIFIER ON
--SET QUOTED_IDENTIFIER OFF
/*drop INDEX [StarMap_position]  ON [dbo].[StarMap]
drop INDEX [Ships_position]   ON [dbo].[Ships]
drop INDEX [Ships_ScanBox]  ON [dbo].[Ships]
drop INDEX [CommunicationNode_position] ON [dbo].CommunicationNode
*/

go 


--create the ressource centers, which define ressource areas around their position
-- optional, since resource centers are not used anymore (or at the moment)
--drop table #Starmap3
with starmap2 as (
select 
	*,
	geometry::STGeomFromText('POINT (' + convert(varchar(15), positionX) + ' ' + convert(varchar(15), positionY) + ')',0) as position 
from dbo.StarMap
where dbo.StarMap.objectId != 5000)
select 
	* 
into #Starmap3
from starmap2;

--drop index [StarMap_temp] on #Starmap3
ALTER TABLE #Starmap3 ADD  CONSTRAINT [starMap3_primary] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)

CREATE SPATIAL INDEX [StarMap_position]  
   ON #Starmap3([position])
   USING GEOMETRY_GRID
   --WITH ( BOUNDING_BOX = ( -10000, -10000, 10000, 10000 ) );
   WITH ( 
   BOUNDING_BOX = ( 4000, 4000, 6000, 6000 ),
   GRIDS =(LEVEL_1 =   HIGH,LEVEL_2 = HIGH,LEVEL_3 = HIGH,LEVEL_4 = HIGH),  
   CELLS_PER_OBJECT = 64, PAD_INDEX  = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF,   ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]



--Todo: set size = 9, distance = 60, leftCorner = 5000 - ((size - 1) *distance)
with ressourceCenter as (
	select 
		(numberX.number * 60) + 4760 as X
	,(numberY.number * 60) + 4760 as Y
	,geometry::STGeomFromText('POINT (' + convert(varchar(15), (numberX.number * 60) + 4760) + ' ' + convert(varchar(15), (numberY.number * 60) + 4760) + ')',0) as position
	,numberX.number  + numberY.number * 5  as id
	,((numberX.number % 5)  + (numberY.number  % 5)) % 5 as ressourceId
	from numbers  as numberX  
	cross apply numbers  as numberY 
	where numberX.number < 9
	and numberY.number < 9
)
-- get a ressourceArea per ressource center:
-- and write these ressourceIds to each star (starMap.id) - multiple ressoruces may be possible per star
-- ressource id should change according to special layout:
select 
	StarMap.id,
	ressourceCenter.ressourceId,

	(StarMap.position.STDistance( ressourceCenter.position )) as distAbsolute,
	SQUARE(SQUARE(100 / dbo.maximum((StarMap.position.STDistance( ressourceCenter.position )),1))) as distancePropability,
	row_number() over (PARTITION by StarMap.id order by StarMap.id) as rn
into #starDistances 
from #Starmap3 as StarMap
left join ressourceCenter on
StarMap.position.STDistance( ressourceCenter.position ) < 45 --ToDo: why does 25 deliver bar values?
--where StarMap.id = 1009 or StarMap.id = 1010
order by id,distAbsolute desc

--select * from #starDistances where #starDistances.id = 61

select 
	#starDistances.id,
	#starDistances.rn, 
	SUM(lowerValues.distancePropability) as summedMax, 
	SUM(lowerValues.distancePropability) - Min(#starDistances.distancePropability)  as summedMin   
into #idRanges
from #starDistances
left join #starDistances as lowerValues
on lowerValues.id = #starDistances.id
and lowerValues.rn <= #starDistances.rn
--where #starDistances.id = 61
group by #starDistances.id,#starDistances.rn;


select id, SUM(distancePropability) as maxPropability, dbo.randomFloat() *  SUM(distancePropability) as randomNumber 
into #starRandoms
from #starDistances
group by id;

select * from #starRandoms where id = 61


update StarMap set StarMap.ressourceId = randoms.ressourceId
from StarMap
inner join 
	(select #starRandoms.id,#starDistances.ressourceId from  #starRandoms
	inner join #idRanges
	on #idRanges.id = #starRandoms.id
	and #starRandoms.randomNumber >= #idRanges.summedMin
	and #starRandoms.randomNumber < #idRanges.summedMax
	inner join #starDistances
	on #starDistances.id = #idRanges.id
	and #starDistances.rn = #idRanges.rn) as randoms
	on randoms.id = StarMap.id
 

drop table #starRandoms
drop table #idRanges
drop table #starDistances
print 'Ressource Areas created'  


--distribute ressources evenly:
--update [dbo].[StarMap]	set ressourceId = id % 5

  
  -- if 625 commNodes exist, but only 159 are needed
  /*
   delete  FROM [Cygnus].[dbo].[Ships]
  where hullId = 200
  and not 
	( (id / 25) % 2 = 1
	 and (id % 25) % 2 = 1)

delete 
from Cygnus.dbo.CommunicationNode
 from Cygnus.dbo.CommunicationNode
left join [Cygnus].[dbo].[Ships]
on [Cygnus].[dbo].[Ships].id = Cygnus.dbo.CommunicationNode.connectionId
where [Cygnus].[dbo].[Ships].id is null

  */