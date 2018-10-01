
CREATE VIEW [dbo].[GetNewID]
AS
SELECT NewId() AS [NewID]
GO

IF NOT EXISTS ( SELECT  *
                FROM    sys.schemas
                WHERE   name = N'quests' ) 
    EXEC('CREATE SCHEMA [quests] AUTHORIZATION [dbo]');
go
CREATE procedure [quests].[questRead]	
	@userId int,	
	@questId int	
as
begin
	/*
	BEGIN TRAN
	declare	@userId int;	
	declare	@questId int;	

	set @userId = 152;
	set @questId = 1;
	select questId from [dbo].[UserQuests]
	--	inner join Quests on Quests.id = @questId
		where	userId = @userId
			and	questId = @questId
		--	and isRead = 0
			
	exec  [quests].[questRead] 	@userId , 	@questId 
	ROLLBACK
	*/
	
	-- check if user had this quest unread
	if (select questId from [dbo].[UserQuests]
		inner join Quests on Quests.id = @questId
		where	userId = @userId
			and	questId = @questId
			and isRead = 0) is null
	begin 		
		return;	 
	end	
	
	update [dbo].[UserQuests] set isRead = 1 where userId = @userId and questId = @questId	
end
GO


CREATE procedure [quests].[IntroQuestCompleted]	
	@userId int,	
	@questId int,
	@xml xml out
as
begin

	/*
	BEGIN TRAN
	declare	@userId int;	
	declare	@questId int;
	declare @xml xml;

	set @userId = 151;
	set @questId = 5;

	exec  [quests].[IntroQuestCompleted] 	@userId , 	@questId , @xml out
	select @xml
	ROLLBACK
	*/

	-- check if user had this quest uncompleted	and that the Quest is an Intro Quest
	if (select questId from [dbo].[UserQuests]
		inner join Quests on Quests.id = @questId
		where	userId = @userId
			and	questId = @questId
			and isCompleted = 0
			and Quests.isIntro = 1) is null
	begin 
		set @xml = (select 0 as result FOR XML PATH('Quests'), Type);		
		return;
	end	
	
	--set current quest as completed
	update [dbo].[UserQuests] set isCompleted = 1 where userId = @userId and questId = @questId
		 
	--add follow-up quests to the list of userQuests	 
	insert into [dbo].[UserQuests]
	select 
		@userId,
		QuestResults.TargetId,
		0,0
	from dbo.AvailableQRB(@userId,2, @questId) as QuestResults
	where QuestResults.TargetType = 2
	
	/*select 
		@userId,
		Quests.id,
		0,0 
	from dbo.[QuestsPrerequisites]
	inner join Quests on Quests.id = [QuestsPrerequisites].questId
	where [preQuestId] = @questId				
	*/
	declare @newBuildings xml;	
	exec [dbo].AllowedBuildings @userId,2, @questId, @newBuildings out; --file 04_Buildings.sql
	
	
	exec [dbo].[userQuestsXML] @userId , null, null, @xml out
	-- gib alle unfertigen (neuen) Quests raus und die aktuell beendete. ToDo: könnte eingeschränkt werden auf die gerade fertiggestellten. ToDo2: auch die neuen Gebäude rausgeben, und die neue Forschung
	set @xml = 
		(select 
			@xml,
			@newBuildings 
		FOR XML PATH('Quests'), Type);
		
end
GO


