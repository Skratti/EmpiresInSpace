
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




CREATE PROCEDURE [dbo].[getReceivedMessages]
	@userId int,
	@fromNr int,		-- fromNr 0 ist die letzte bekommen Nachricht
	@toNr	int,		-- toNr 50 ist 50 Nachrichten her -> es wird also Rückwärts durchgezählt
	@lastMessageId int, -- Die höchste ID die der User in dieser Sitzung zugeschick bekommen hat
	@messageType int	-- Filter auf den Typ der Nachrichten - wann kann der null sein?
AS
BEGIN

	if ( @messageType = 0 ) begin set @messageType = null end;
	/*
	begin tran
	declare	@userId int;
	declare @fromNr int;
	declare @toNr int;
	declare @lastMessageId int;
	declare @messageType int;
	
	set @userId = 234;
	set @fromNr = 1;
	set @toNr = 50;
	set @messageType = 60;
	set @lastMessageId = 99;
	
	exec [dbo].getReceivedMessages  @userId, @fromNr, @toNr, @lastMessageId, @messageType
	
	rollback tran

	select (SELECT CONVERT(varchar(10),[MessageParticipants].participant) + '; '
	FROM MessageParticipants 
	where [MessageParticipants].headerId = 1467
	FOR XML PATH('')) as MessageParticipants

	select [MessageParticipants].participant from [MessageParticipants] where [MessageParticipants].headerId = result.id FOR XML PATH('party'), Type) as parties
		

	*/
	declare @counted int;	
	set @counted = 0;
	
	with possibleMessages as 
	(
		select top (@toNr)
			[id]
			,[sender]
			,[addressee]
			,[headline]
			,dbo.[MessageParticipants].[read]
			,isNull(@messageType, messageType) as messageType -- has to return 60 if it is a message that was sent and not received
			--,dateadd(millisecond, -datepart(millisecond, sendingDate), sendingDate)  as sendingDate
			,(select Max(sendingDate) from dbo.MessageBody where dbo.MessageBody.headerId = MessageHeads.id) as sendingDate
			,row_number() over(order by id desc) as RowNumber	
		from dbo.MessageHeads 
		inner join dbo.[MessageParticipants]
		on [MessageParticipants].headerId = dbo.MessageHeads.id
		and [MessageParticipants].participant = @userId
		where messageType = isNull(@messageType, messageType)
			or (@messageType = 60 and messageType = 10)
		order by id desc
	)
	select 
		possibleMessages.id,
		possibleMessages.sender,
		possibleMessages.addressee,
		possibleMessages.headline,
		possibleMessages.[read],
		possibleMessages.messageType,
		dateadd(millisecond, -datepart(millisecond, possibleMessages.sendingDate), possibleMessages.sendingDate)  as sendingDate
	into #messages	
	from possibleMessages
	where 	RowNumber >= @fromNr 
	and RowNumber <= @toNr


	set @counted = (select count(id) 
			from dbo.MessageHeads 
			inner join dbo.MessageParticipants
			on dbo.MessageParticipants.headerId = dbo.MessageHeads.id
				and dbo.MessageParticipants.participant = @userId
			where	messageType = ISNULL(@messageType, messageType) );
		

	if  (select max(id) from #messages) > @lastMessageId
	begin
		set @lastMessageId = (select max(id) from #messages);
	end

	select (
		select 
			result.id,
			result.sender,
			result.addressee,
			result.headline,
			result.[read],
			result.messageType,
			[dbo].makeUTC(sendingDate) as sendingDate,
				(select (SELECT CONVERT(varchar(10),[MessageParticipants].participant) + ';'
				FROM MessageParticipants 
				where [MessageParticipants].headerId = result.id
				FOR XML PATH(''))) as MessageParticipants
		from 	
		(
			select
				*,
				0 as newMessage
			from #messages
			union all 
			select *,
			1 as newMessage
			from dbo.MessageHeads 
			where addressee = @userId
				and id > @lastMessageId				
		) as result
		order by result.id
		FOR XML PATH('message'), Type
		),
		@counted as amount
	 FOR XML PATH('messages'), Type;


	drop table #messages

	return;
END
GO



GO
CREATE TYPE [engine].[messageParticipants] AS TABLE(
	[userId] [int] NULL
)
GO

CREATE PROCEDURE [dbo].[sendMessage]
	@userId int,
	@addressee int,
	@header nvarchar(127),
	@body nvarchar(4000),
	@id int,
	@messageType int,
	@output1 int out,
	@xml xml out,
	@messageParticipants [engine].messageParticipants READONLY
AS
BEGIN
/* For debugging purposes
begin tran
declare @p7 int
set @p7=1
declare @p8 xml
set @p8=convert(xml,N'<messageIds><newMessageId>2061</newMessageId><newMessagePartId>2</newMessagePartId></messageIds>')
declare @p9 engine.messageParticipants

exec [dbo].[sendMessage] @userId=334,@addressee=N'157',@header=N'vbvc',@body=N'3',@id=N'2061',@messageType=10,@output1=@p7 output,@xml=@p8 output,@messageParticipants=@p9
select @p7, @p8
rollback tran
*/
	/*  For debugging purposes
	begin tran

	declare	@userId int,
		@addressee int,
		@header nvarchar(63),
		@body nvarchar(4000),
		@id int,
		@messageType int,
		@output1 int ,
		@xml xml 

	set @userId = 157
	set @addressee = 234
	set @header = 'Test1'
	set @body = 'bodyTest1'
	set @id = 1467
	set @messageType = 10

	exec [dbo].[sendMessage]
		@userId ,
		@addressee ,
		@header,
		@body ,
		@id,
		@messageType ,
		@output1  out,
		@xml  out

		select @xml
	rollback tran
	*/

	--IF (select top 1 isDemo from dbo.GalaxyMap) = 1 return;
	
	declare @sender int;
	declare @newId numeric(18,0);
	
	if @messageType is null begin set @messageType = 10 end;
	
	--get user
	select Users.*
		INTO #CurrentUser
		from [dbo].Users as Users		
		where Users.id = @userId 

	--check User 1
	if (select COUNT(*) from #CurrentUser) = 0
	begin
		set @output1 = 11;
		return;
	end
	
	set @sender = (select id from #CurrentUser);
	--check User 2
	if (select COUNT(*) from #CurrentUser) > 1
	begin
		set @output1 = 12;
		return;
	end


	declare @messagePart int;
	select @messagePart = max(messagePart) + 1 from [MessageBody]
	where [MessageBody].headerId = @id;
	select @messagePart = isNull(@messagePart,0)

	set @newId = @id;

	-- nachricht an andere - test ob die personen sich ingame schon kennen
	/*
	if (select sender 
	from UserContacts 
	where	UserContacts.sender = dbo.minimum( @userId , @addressee )
	and		UserContacts.addressee = dbo.maximum( @userId, @addressee)) is null
	and @userId != 0
	and @userId != @addressee
	begin
		set @output1 = 13;
		return;
	end
	*/
	
	if (@id is null) 
	BEGIN
		INSERT INTO [dbo].[MessageHeads]
		   ([sender]
		   ,[addressee]
		   ,[headline]
		   ,messageType)
		VALUES
		   (@sender
		   ,@addressee
		   ,@header
		   ,@messageType)

		set @newId = SCOPE_IDENTITY();

		insert into [MessageParticipants]
		select @newId, conversationParticipants.userId,
		case when conversationParticipants.userId = @sender then 1 else 0 end as [read]
		from @messageParticipants as conversationParticipants;

		
	END
	else
	BEGIN
		update dbo.[MessageParticipants] set [read] = 0
		where dbo.[MessageParticipants].headerId = @id
		and		dbo.[MessageParticipants].participant != @sender
					
	END 

	INSERT INTO [dbo].[MessageBody]
       ([headerId]
	   ,messagePart
	   ,sender
       ,[message])
	VALUES
       (@newId
	   ,@messagePart
	   ,@sender
       ,@body)                     		


	if (@id is null) 
	BEGIN
	--New Message
	insert into [dbo].[ServerEvents] 
		(userId ,
		eventType,
		objectId,
		int1)
	select 
		messageParticipants.userId ,
		1,
		@newId,
		@messageType
	from @messageParticipants as messageParticipants
	where  messageParticipants.userId  != @sender;
	END
	else
	BEGIN
		-- OLD Message, use participants from head
		insert into [dbo].[ServerEvents] 
			(userId ,
			eventType,
			objectId,
			int1)
		select 
			messageParticipants.participant ,
			1,
			@newId,
			@messageType
		from [MessageParticipants] as messageParticipants
		where  messageParticipants.headerId  != @id
		and messageParticipants.participant != @userId;

							
	END 

	set @xml= (SELECT
		@newId as newMessageId,
		@messagePart as newMessagePartId
	FOR XML PATH('messageIds'), Type)
		
	set @output1 = 1;
	return;	
	
END
GO


CREATE PROCEDURE [dbo].[getMessagesText]
	@userId int,	
	@messageId int
AS
BEGIN
	/*
	
	declare	@userId int;
	declare @messageId int;		
	set @userId = 234;
	set @messageId = 1681;
	exec [dbo].getMessagesText  @userId, @messageId
	*/
	Update dbo.[MessageParticipants] set dbo.[MessageParticipants].[read] = 1 
	where dbo.[MessageParticipants].participant = @userId 
		and dbo.[MessageParticipants].headerId = @messageId
	

	SELECT (
	SELECT
		case when mBody.[message] = '' then ' ' else mBody.[message] end as [message],
		messagePart,
		mBody.sender,
		mBody.sendingDate
	FROM [dbo].[MessageParticipants] as mHead
	inner join [dbo].[MessageBody] as mBody
		on mBody.[headerId] = mHead.headerId  		
	where mHead.participant = @userId 
		and mHead.headerId = @messageId
	order by mBody.messagePart asc
	FOR XML PATH('messageBody'), Type
	)
	FOR XML PATH('messages'), Type

	return;
END
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


