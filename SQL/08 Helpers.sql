
CREATE VIEW [dbo].[GetNewID]
AS
SELECT NewId() AS [NewID]
GO


CREATE function [dbo].[makeUTC] ( @inputDT datetime) 
returns datetime
as
begin
	return DATEADD(second, DATEDIFF(second, GETDATE(), GETUTCDATE()), @inputDT)
end
GO

create view [dbo].[logs] as (
SELECT Top 1000 [logText]
      ,[comment]
      ,[module]
      ,[logDateTime]
  FROM [dbo].[Log] order by [logDateTime] desc)
GO


CREATE procedure [dbo].[userLogout]
	@userId int,
	@lastSelectedObjectId int,
	@lastSelectedObjectType int
as
begin
	/*
	declare @userId int;
	declare @systemId int;
	declare @xml xml ;
	set @userId = 2;
	set @systemId = 111;
	exec [dbo].[userLogout]  @systemId, @xml out
	select @xml
	*/
	update Users set player_ip = null , lastSelectedObjectType = @lastSelectedObjectId, lastSelectedObjectId = @lastSelectedObjectType  where id = @userId;
end
GO


