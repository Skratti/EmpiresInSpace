-- optional, since resource centers are not used anymore (or at the moment)

-- create the ressource centers, which define ressource areas around their position


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