--1 copy Label file to server, since this script will look in the server file system
truncate table dbo.Labels
BULK
INSERT dbo.Labels
FROM 'C:\Github\Labels\DE.csv'
WITH
(
ROWTERMINATOR = '\n'
)
GO

update Labels set label =  SUBSTRING(label,2, LEN(label) -2)
from Labels

go

-- new turns 
BEGIN TRAN
delete from  gameNewTurns
select * from gameNewTurns where targetTime < GETDATE()

select * 
into #tempTimes 
from (
	select  cast('00:00:00' as time) as turnTime union all
	select  cast('12:00:00' as time) as turnTime union all
	select  cast('15:00:00' as time) as turnTime union all
	select  cast('18:00:00' as time) as turnTime union all
	select  cast('21:00:00' as time) as turnTime) as times

select 
	DATEADD(
		HOUR,
		datepart(hour,#tempTimes.turnTime),
		DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + numbers.number, 0)
	) as day0
into #tempTurns
from numbers 
cross apply #tempTimes
where	numbers.number > 0 
	and	numbers.number < 366 



insert into gameNewTurns(targetTime)
select #tempTurns.day0 from  #tempTurns
order by #tempTurns.day0 asc


select * from gameNewTurns order by targetTime
--delete from gameNewTurns where id in (0,1,2,4,5)

SELECT TOP 1  DATEADD(second, DATEDIFF(second, GETDATE(), GETUTCDATE()), targetTime)  as [targetTime] FROM [dbo].[gameNewTurns]
				where turnStatus = 0 order by targetTime FOR XML PATH('nextTurn'),type;
				
				
drop table #tempTimes
drop table #tempTurns
--
commit