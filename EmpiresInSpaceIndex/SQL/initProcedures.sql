
IF OBJECT_ID('[dbo].[GetNewID]', 'V')  IS NOT NULL  DROP view [dbo].GetNewID;
go
CREATE VIEW dbo.GetNewID
AS
	SELECT NewId() AS [NewID]
go


IF OBJECT_ID('[dbo].[randomBigInt]', 'FN')  IS NOT NULL  DROP view [dbo].[randomBigInt];
go
CREATE function [dbo].[randomBigInt] () 
returns bigint
as
begin	
	return ABS(CAST(CAST((SELECT [NewId] FROM GetNewID) AS VARBINARY) AS bigint))
end
--select [dbo].[randomBigInt]() 
go

/*
insert into [dbo].[Users] 
(

	username,
	userpassword ,	
	email ,
	created ,		
	user_ip ,		
	[language] ,
	defaultInGameName ,
	defaultStartingRegion ,
	premiumEnd ,
	userLevel,
	verificationCode
)
select 
	'Andi' as username,
	'andi22' as userpassword ,
	'a.kastirke@googlemail.com' as email,
	GETDATE() as created ,	
	'127' as user_ip,			
	0 as [language],
	'Largo' as defaultInGameName ,
	0 as defaultStartingRegion,
	null as premiumEnd ,
	0 as userLevel,
	[dbo].[randomBigInt]()  as verificationCode
	
	*/
	
go

IF OBJECT_ID('[dbo].[checkUniqueName]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].checkUniqueName;
go
CREATE PROCEDURE [dbo].checkUniqueName
	@username nvarchar(63),
	@result int out
AS
BEGIN
	/*
	BEGIN TRAN
	exec [dbo].checkUniqueName @username,@result out
	ROLLBACK
	*/

	if (SELECT 
		 id   
	FROM [dbo].Users
	where dbo.Users.username = @username) is null
	begin
		select @result = 1;
		return;
	end

	select @result = 0;
END

go
IF OBJECT_ID('[dbo].[checkUniqueEmail]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].checkUniqueEmail;
go
CREATE PROCEDURE [dbo].checkUniqueEmail
	@username nvarchar(63),
	@result int out
AS
BEGIN
	/*
	BEGIN TRAN
	exec [dbo].checkUniqueName @username,@result out
	ROLLBACK
	*/

	if (SELECT 
		 id   
	FROM [dbo].Users
	where dbo.Users.email = @username) is null
	begin
		select @result = 1;
		return;
	end

	select @result = 0;
END
go


go
IF OBJECT_ID('[dbo].[createUser]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].createUser;
go
CREATE PROCEDURE [dbo].createUser
	@username nvarchar(63),
	@userpassword nvarchar(64),
	@salt int	,
	@email nvarchar(63),
	@user_ip nvarchar(55),
	@language nvarchar(63),
	@defaultInGameName nvarchar(63),
	@defaultStartingRegion int,
	@result int out,
	@verificationCode nvarchar(63) out,
	@xml xml out
AS
BEGIN
	/*
	BEGIN TRAN
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 
	declare @salt int 
	
	declare @email nvarchar(63)
	declare @user_ip nvarchar(55)
	declare @language nvarchar(63)
	declare @defaultInGameName nvarchar(63)
	declare @defaultStartingRegion int
	declare @verificationCode nvarchar(63)
	declare @result int
	declare @xml xml
	
	set @username = 'Andi1'
	set @userpassword = 'Andi1'
	
	set @salt = 123
	set @email = 'a.kastirke@googlemail.com'
	set @user_ip = '127'
	set @language = 'de'
	set @defaultInGameName = 'Largo'
	set @defaultStartingRegion = 0
	
	exec [dbo].createUser @username,@userpassword,@salt,@clearPW, @email,@user_ip,@language,@defaultInGameName,@defaultStartingRegion,@result out, @verificationCode out, @xml out	
	select @result, @verificationCode
	select @xml
	select * from Users
	ROLLBACK
	*/
	set @xml = (select 
			0 as UserCreationCode	
		FOR XML PATH('UserCreation'), Type);
	set @result = 0;
	
	IF (select username from [dbo].[Users] where username = @username ) IS NOT NULL
	BEGIN							
		return;
	END

	insert into [dbo].[Users] 
	(

		username,
		userpassword ,	
		salt,
		email ,
		created ,		
		user_ip ,		
		[language] ,
		defaultInGameName ,
		defaultStartingRegion ,
		premiumEnd ,
		userLevel,
		verificationCode
	)
	select 
		@username as username,
		@userpassword as userpassword ,
		@salt, 
		@email as email,
		GETDATE() as created ,	
		@user_ip as user_ip,
		isNull((select id from dbo.[Languages] where dbo.[Languages].languageShortName = @language),0 ) as 	[language],				
		@defaultInGameName as defaultInGameName ,
		@defaultStartingRegion as defaultStartingRegion,
		null as premiumEnd ,
		0 as userLevel,
		[dbo].[randomBigInt]()  as verificationCode

	if (@@ERROR <> 0)
	BEGIN						 
		return;
	END
	ELSE
	BEGIN
		set @result = 1;
		set @verificationCode = (SELECT top 1 verificationCode FROM [dbo].[Users] where [username] = @username)
		
		set @xml =
		(SELECT 
			1 as UserCreationCode,	
			[verificationCode]
		FROM [dbo].[Users]
		where [username] = @username
		FOR XML PATH('UserCreation'), Type)
	END
END
go

IF OBJECT_ID('[dbo].[updateUserLanguage]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].updateUserLanguage;
go
CREATE PROCEDURE [dbo].updateUserLanguage
	@userId int,
	@language nvarchar(63)	
AS
BEGIN
	/*
	BEGIN TRAN
	select * from Users
	exec [dbo].updateUserLanguage 2 , 'fr'
	select * from Users
	ROLLBACK
	*/
	update [dbo].[Users] set [language] = isNull((select id from dbo.[Languages] where dbo.[Languages].languageShortName = @language),0 )
	where Users.id = @userId
END
go


IF OBJECT_ID('[dbo].[updateUserDefaultName]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].updateUserDefaultName;
go
CREATE PROCEDURE [dbo].updateUserDefaultName
	@userId int,
	@defaultName nvarchar(63)	
AS
BEGIN
	/*
	BEGIN TRAN
	select * from Users
	exec [dbo].updateUserDefaultName 2,'abc'
	select * from Users
	ROLLBACK
	*/
--	select @defaultName as deff;

	update [dbo].[Users] set defaultInGameName = @defaultName
	where Users.id = @userId
END
go


IF OBJECT_ID('[dbo].[updateUserEmail]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].updateUserEmail;
go
CREATE PROCEDURE [dbo].updateUserEmail
	@userId int,
	@userpassword nvarchar(64), --this is the code to verify the user...
	@newEmail nvarchar(63),
	@result int out
AS
BEGIN
	/*
	BEGIN TRAN
	declare @userId int,
	@userpassword nvarchar(64), --this is the code to verify the user...
	@newEmail nvarchar(63),
	@result int;

	set @userId = 157;
	set @userpassword = N'�J	�0��pח��K?N�q12D���B�޹7��';
	set @newEmail=N'a.kastirke@googlemail.com';

	exec [dbo].[updateUserEmail] @userId,@userpassword, @newEmail, @result out;
	ROLLBACK
	*/

	if (SELECT 
		 id   
	FROM [dbo].Users
	where dbo.Users.userpassword = @userpassword	 and id =@userId) is null
	begin
		select @result = 0;
		return;
	end

	update [dbo].[Users] set email = @newEmail
	where	Users.id = @userId
	and		Users.userpassword = @userpassword

	select @result = 1;
END
go


IF OBJECT_ID('[dbo].[updateUserPassword]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].updateUserPassword;
go
CREATE PROCEDURE [dbo].updateUserPassword
	@username nvarchar(63),
	@userpassword nvarchar(64),  --is not needed, since verification is with the hash generated by key from old cookie and salt	
	@newUserpassword nvarchar(64),	
	@cookieValue int,			-- needed for the next cookie login
	@cookieSalt int,			-- needed for the next cookie login
	@cookieHash VarBinary(max),	-- needed for the next cookie login
	@result int out
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].loginUser @username,@userpassword, '1221', @result out
	select @result
	*/
	select @result = 0;

	declare @userID int;
	
	SELECT 
		@userID = Users.id    
	FROM [dbo].Users
	where dbo.Users.userpassword = @userpassword		
	and dbo.Users.username = @username;
			
	IF @userID IS NOT NULL
	BEGIN

		Update Users set userpassword = @newUserpassword where userpassword = @userpassword
		and id = @userID;

		delete from [UserRemembers] where userId = @userID;					
		select @result =  1;
		
		if (@cookieValue != 0 and @cookieSalt != 0)
		begin
			insert into [UserRemembers] ([userId],cookieHash,salt)
			select @userID, @cookieHash, @cookieSalt
		end
		
		return;
	END	
	
END
go


go
IF OBJECT_ID('[dbo].[getSalt]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].getSalt;
go
CREATE PROCEDURE [dbo].getSalt
	@username nvarchar(63),
	@salt int out	
AS
BEGIN
	/*
	declare @username nvarchar(63);
	declare @salt int;
	
	exec getSalt 'a1', @salt out
	select @hash
	*/

	select @salt = salt from dbo.Users where Users.username  = @username;
END
go	
	
go
IF OBJECT_ID('[dbo].[authenticateUser]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].authenticateUser;
go
CREATE PROCEDURE [dbo].authenticateUser
	@verificationCode nvarchar(63)
AS
BEGIN
	/* 7726463345548551814
	declare @verificationCode nvarchar(63);
	set @verificationCode = (select top 1 verificationCode from [dbo].[Users])
	exec [dbo].authenticateUser  6795181783642915934 @verificationCode 
	*/

	Update  [dbo].[Users] set userLevel = 1 where verificationCode = @verificationCode
	/*
	SELECT 
		1 as UserAuthentificationCode
	FOR XML PATH('UserAuthentification'), Type
	*/
END
go

IF OBJECT_ID('[dbo].[userRememberSalts]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].userRememberSalts;
go
CREATE PROCEDURE [dbo].userRememberSalts
	@username nvarchar(63)
as	
begin
	select UserRemembers.salt, UserRemembers.cookieHash from dbo.UserRemembers
	inner join Users
	on	Users.username = @username
	and	Users.id = UserRemembers.userId
end
go


IF OBJECT_ID('[dbo].[loginUser]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].loginUser;
go
CREATE PROCEDURE [dbo].loginUser
	@username nvarchar(63),
	@userpassword nvarchar(64) ,
	@user_ip nvarchar(55),	
	@cookieValue int,
	@cookieSalt int,
	@cookieHash VarBinary(max),
	@result int out,
	@xml xml out
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].loginUser @username,@userpassword, '1221', @result out, @xml out
	select @result
	select @xml
	*/
	
	declare @userID int;
	set @xml = (select 
		0 as id		
	FOR XML PATH('user'), Type)
	
	
	set @userID = 
	(select top 1 id  	
	from [dbo].[Users] 
	where (username = @username or email = @username) AND userpassword = @userpassword )
	
	IF @userID IS NOT NULL
	BEGIN
		Update [dbo].[Users] set user_ip =  @user_ip, lastlogin = getdate()		
		where username = @username AND userpassword = @userpassword
	
		set @result = (select top 1 [id] from [dbo].[Users] where username = @username AND userpassword = @userpassword  )
		set @xml = 
		(select 
			(select top 1 
				[Users].[id]
				,[username]			
				,[email]			
				,[lastlogin]
				,isNull( dbo.languages.languageShortName,'en') as  [language]
				,[defaultInGameName]
				,[defaultStartingRegion]
				,case when [premiumEnd] is null then getDate() else [premiumEnd] end as premiumExpiry
				,[userLevel]			
			from [dbo].[Users] 
			left join dbo.languages on languages.id = [Users].[language]
			where username = @username AND userpassword = @userpassword 	
			FOR XML PATH('user'), Type),
			(SELECT 
				Games.[id]
				,Games.[galaxyName]
				,Games.[rulesId]	
				,Games.[objectId]
				,Games.[size]
				,Games.[url]
				,Games.[imageUrl]
				,case when userGames.userId IS NOT NULL THEN 1 ELSE 0 END as isPlayed
				,gameStatus
				,isNull(startingDate, '') as startingDate
				,ISNULL(Rules.htmlDescription, '...') as [rule]
				,Games.maxUsers
				,Games.currentUserCount
			FROM [dbo].[Games] as Games
			left join dbo.UserGames as userGames
				on userGames.gameId = Games.id
				and userGames.userId = @userID	
			left join dbo.Rules on Rules.id = Games.rulesId		
			where 	Games.gameStatus != 4 or userGames.gameId is not null	
			FOR XML PATH('game'), Type),
			(SELECT 
				@cookieValue as code
			FOR XML PATH('remember'), Type)
		FOR XML PATH('login'), Type)
		
		if (@cookieValue != 0 and @cookieSalt != 0)
		begin
			insert into [UserRemembers] ([userId],cookieHash,salt)
			select @userID, @cookieHash, @cookieSalt
		end
		
		return;
	END

	set @result = 0;
	select 
		0 as id		
	FOR XML PATH('user'), Type
	
END
go


IF OBJECT_ID('[dbo].[loginUserWithCookie]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].loginUserWithCookie;
go
CREATE PROCEDURE [dbo].loginUserWithCookie
	@username nvarchar(63),
	--@userpassword nvarchar(64) ,  --is not needed, since verification is with the hash generated by key from old cookie and salt
	@oldCookieHash VarBinary(max), --this is the code to verify the user...
	@user_ip nvarchar(55),	
	@cookieValue int,			-- needed for the next cookie login
	@cookieSalt int,			-- needed for the next cookie login
	@cookieHash VarBinary(max),	-- needed for the next cookie login
	@result int out,
	@xml xml out
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].loginUser @username,@userpassword, '1221', @result out, @xml out
	select @result
	select @xml
	*/
	
	declare @userID int;
	set @xml = (select 
		0 as id		
	FOR XML PATH('user'), Type)
	
	SELECT 
		@userID = [UserRemembers].userId    
	FROM [dbo].[UserRemembers]
	inner join dbo.Users
		on	Users.id =  [UserRemembers].userId
		and Users.username = @username
	where [UserRemembers].cookieHash = @oldCookieHash
			
	IF @userID IS NOT NULL
	BEGIN

		Update [dbo].[UserRemembers] set cookieUsed = 1, usedAt = GETDATE()
		FROM [dbo].[UserRemembers]
		inner join dbo.Users
			on	Users.id =  [UserRemembers].userId
			and Users.username = @username
		where [UserRemembers].cookieHash = @oldCookieHash

		Update [dbo].[Users] set user_ip =  @user_ip	, lastlogin = getdate()			
		where id = @userID
	
		select @result =  @userID;
		set @xml = 
		(select 
			(select top 1 
				[Users].[id]
				,[username]			
				,[email]			
				,[lastlogin]
				,isNull( dbo.languages.languageShortName,'en') as  [language]
				,[defaultInGameName]
				,[defaultStartingRegion]
				,case when [premiumEnd] is null then getDate() else [premiumEnd] end as premiumExpiry
				,[userLevel]			
			from [dbo].[Users] 
			left join dbo.languages on languages.id = [Users].[language]
			where [Users].id = @userID 	
			FOR XML PATH('user'), Type),
			(SELECT 
				Games.[id]
				,Games.[galaxyName]
				,Games.[rulesId]	
				,Games.[objectId]
				,Games.[size]
				,Games.[url]
				,Games.[imageUrl]
				,case when userGames.userId IS NOT NULL THEN 1 ELSE 0 END as isPlayed
				,gameStatus
				,isNull(startingDate, '') as startingDate
				,ISNULL(Rules.htmlDescription, '...') as [rule]
				,Games.maxUsers
				,Games.currentUserCount
			FROM [dbo].[Games] as Games
			left join dbo.UserGames as userGames
				on userGames.gameId = Games.id
				and userGames.userId = @userID	
			left join dbo.Rules on Rules.id = Games.rulesId			
			FOR XML PATH('game'), Type),
			(SELECT 
				@cookieValue as code
			FOR XML PATH('remember'), Type)
		FOR XML PATH('login'), Type)
		
		if (@cookieValue != 0 and @cookieSalt != 0)
		begin
			insert into [UserRemembers] ([userId],cookieHash,salt)
			select @userID, @cookieHash, @cookieSalt
		end
		
		return;
	END

	set @result = 0;
	select 
		0 as id		
	FOR XML PATH('user'), Type
	
END
go


IF OBJECT_ID('[dbo].[logout]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].[logout];
go
CREATE PROCEDURE [dbo].[logout]
	@userId int 	
AS
BEGIN
	/*
	begin tran
	declare @userId int;
	set @userId  = 227;
	select user_ip  from  dbo.Users where id = @userId
	exec logout @userId
	select user_ip  from  dbo.Users where id = @userId
	rollback tran
	*/

	update dbo.Users set user_ip = '...' where id = @userId
END
go	
	

IF OBJECT_ID('[dbo].[removeCookie]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].removeCookie;
go
CREATE PROCEDURE [dbo].removeCookie
	@username nvarchar(63),
	--@userpassword nvarchar(64) ,  --is not needed, since verification is with the hash generated by key from old cookie and salt
	@oldCookieHash VarBinary(max) --this is the code to verify the user...
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].removeCookie @username,@userpassword
	select @result
	select @xml
	*/
	
	delete from  userCookies
	FROM [dbo].[UserRemembers] as userCookies
	inner join dbo.Users
		on	Users.id =  userCookies.userId
		and Users.username = @username
	where userCookies.cookieHash = @oldCookieHash
				
	
END
go

go

IF OBJECT_ID('[dbo].[removeAllCookies]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].removeAllCookies;
go
CREATE PROCEDURE [dbo].removeAllCookies
	@userId nvarchar(63)		
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].removeCookie @username,@userpassword
	select @result
	select @xml
	*/
	
	delete from  userCookies
	FROM [dbo].[UserRemembers] as userCookies
	where userCookies.userId = @userId				
END
go


go
IF OBJECT_ID('[dbo].[UserData]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].UserData;
go
CREATE PROCEDURE [dbo].UserData
	@userId int 
AS
BEGIN
	/*
	declare @userId int;
	set @userId = 163;		
	
	exec [dbo].UserData @userId	
	*/
	
	IF (select username from [dbo].[Users] where id = @userId ) IS NOT NULL
	BEGIN		
		select 
		(select top 1 
			[Users].[id]
			,[username]			
			,[email]			
			,[lastlogin]
			,isNull(languages.[languageShortName], 'en') as [language]
			,[defaultInGameName]
			,[defaultStartingRegion]
			,case when [premiumEnd] is null then getDate() else [premiumEnd] end as premiumExpiry
			,[userLevel]			
		from [dbo].[Users] 
		left join dbo.languages on languages.id = [language]
		where [Users].id = @userId		
		FOR XML PATH('user'), Type),
		(SELECT 
			Games.[id]
			,Games.[galaxyName]
			,Games.[rulesId]	
			,Games.[objectId]
			,Games.[size]
			,Games.[url]
			,Games.[imageUrl]
			,case when userGames.userId IS NOT NULL THEN 1 ELSE 0 END as isPlayed
			,gameStatus
			,isNull(startingDate, '') as startingDate
			,ISNULL(Rules.htmlDescription, '...') as [rule]
			,Games.maxUsers
			,Games.currentUserCount
		FROM [dbo].[Games] as Games
		left join dbo.UserGames as userGames
			on userGames.gameId = Games.id
			and userGames.userId = @userId
		left join dbo.Rules on Rules.id = Games.rulesId		
		FOR XML PATH('game'), Type)
		FOR XML PATH('login'), Type
		return;
	END
		
	select 
		0 as id		
	FOR XML PATH('user'), Type
	
END

--  update [inSpaceIndex].[dbo].[Users] set id = 1
go

go
IF OBJECT_ID('[dbo].[getUser]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].getUser;
go
CREATE PROCEDURE [dbo].getUser
	@userId int 
AS
BEGIN
	/*
	declare @userId int;
	set @userId = 163;		
	
	exec [dbo].getUser @userId	
	*/
	
	SELECT 
		[id]                     
			,[user_ip]     
			,[language]     
			,[premiumEnd]
			,[userLevel]        
			,defaultInGameName        
		FROM [dbo].[Users]
		where id = @userId;
	
END

--  update [inSpaceIndex].[dbo].[Users] set id = 1

go

IF OBJECT_ID('[dbo].[LoginToGame]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].LoginToGame;
go
CREATE PROCEDURE [dbo].LoginToGame
	@userId int ,
	@userIp nvarchar(55),
	@gameId int,
	@result int out
AS
BEGIN

	set @result = 0;
	
	--check if user ip is corresponds to sender ip:
	IF (
		select dbo.Users.id 
		from  dbo.Users 
		where dbo.Users.user_ip = @userIp
		and dbo.Users.id = @userId ) IS NULL
	BEGIN			
		return;
	END
	
	--check if user id is in userGames
	IF (
		select dbo.UserGames.userId
		from  dbo.UserGames 
		where dbo.UserGames.userId = @userId
		and dbo.UserGames.gameId = @gameId ) IS NULL
	BEGIN			
		return;
	END

	set @result = 1;

END
go

IF OBJECT_ID('[dbo].[registerUserCheckGame]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].registerUserCheckGame;
go
CREATE PROCEDURE [dbo].registerUserCheckGame
	@userId int	,
	@gameId int,
	@code int,
	@result int out
AS
BEGIN

/*
declare @result int;
begin tran
exec [dbo].registerUserCheckGame 157 , 6 , @result out
rollback tran

*/

	begin tran
	IF (select top 1 id from dbo.Users where id = @userId) IS NULL
		OR (select top 1 userId from dbo.UserGames where userId = @userId and gameId = @gameId) is not null
		OR (select dbo.Games.id from dbo.Games 
			left join dbo.UserGames on dbo.UserGames.gameId = @gameId
			where id = @gameId
			group by dbo.Games.id, dbo.Games.[maxUsers]
			having count(isNull(dbo.UserGames.userId,0)) < dbo.Games.[maxUsers]) is null
	BEGIN
		set @result = 0
		commit tran
		return;	
	END

	update  dbo.Users set registerCode = @code where id = @userId
	
	update dbo.games set currentUserCount = currentUserCount + 1 where id = @gameId; 
	
	insert into UserGames select @userId,@gameId;
	commit tran

	set @result = 1;

	return;
END
go

IF OBJECT_ID('[dbo].[registerToGame]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].registerToGame;
go
create procedure [dbo].registerToGame
	@userId int,
	@userGame int
as
begin
	/*
	declare @userId int;
	declare @newValue nvarchar(2);
	set @userId = 1;
	set @newValue = 'fr';

	select language,* from  Users where id = @userId;
	exec [dbo].[userLanguage]  @userId,  @newValue;
	select language,* from  Users where id = @userId;
	*/
	
	insert into UserGames select @userId,@userGame;
	
	update game set currentUserCount = currentUserCount + 1
	  from dbo.Games as game
	  where game.id = 7

	--commit tran
end     
go


go
IF OBJECT_ID('[dbo].[UserCheckLoggedIn]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].UserCheckLoggedIn;
go
CREATE PROCEDURE [dbo].UserCheckLoggedIn
	@UserHostAddress nvarchar(55),
	@code int,
	@userId int	out
AS
BEGIN
	/*
	declare @UserHostAddress nvarchar(63);
	declare @userId int;
	set @UserHostAddress = '::1';
	exec UserCheckLoggedIn @UserHostAddress , @userId out
	select @userId
	*/
	
	set @userId = 
	(
		select top 1 
			id
		from dbo.Users
		--left join dbo.
		where	user_ip = @UserHostAddress
			and	lastlogin > (select dateadd(hh,-12,getdate()))
			and registerCode = @code
		
	)

	if ( @userId is not null)
	begin
		if (@userId > 0) 
		begin
			update  dbo.Users set registerCode = 0 where user_ip = @UserHostAddress and  registerCode = @code
		end
	end
END
go



IF OBJECT_ID('[dbo].[setRecoveryCode]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].[setRecoveryCode];
go
CREATE PROCEDURE [dbo].[setRecoveryCode]
	@id int,
	@recoveryCode nvarchar(64)
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].[setRecoveryCode] @username,@userpassword, '1221', @result out
	select @result
	*/
	
	Update dbo.[Users] set recoveryCode = @recoveryCode, recoveryDateTime = GETDATE()
                                                    WHERE [id] = @id
	
END

GO


go
IF OBJECT_ID('[dbo].[getUserDataByEmail]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].[getUserDataByEmail];
go
CREATE PROCEDURE [dbo].[getUserDataByEmail]
	@email  nvarchar(63) 
AS
BEGIN
	/*
	declare @userId int;
	set @userId = 163;		
	
	exec [dbo].getUser @userId	
	*/
	
	SELECT top 1 
		[id],
		[username],
		[language]   
	FROM dbo.[Users] 
    WHERE email = @email;
	
END


go
IF OBJECT_ID('[dbo].[getUserDataByRecoveryCode]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].[getUserDataByRecoveryCode];
go
CREATE PROCEDURE [dbo].[getUserDataByRecoveryCode]
	@recoveryCode  nvarchar(64) 
AS
BEGIN
	/*
	exec [dbo].[getUserDataByRecoveryCode] @recoveryCode=N'7�,n�4_� Yctg|�� �^*�1����'
	*/
	
	SELECT top 1 
		[id],
		[salt] 
	FROM dbo.[Users] 
    WHERE recoveryCode = @recoveryCode 
		and DATEDIFF(HOUR, [recoveryDateTime],  GETDATE())  < 25	
END


go
IF OBJECT_ID('[dbo].[setNewPasswordById]', 'P')  IS NOT NULL  DROP PROCEDURE [dbo].[setNewPasswordById];
go
CREATE PROCEDURE [dbo].[setNewPasswordById]
	@id int,
	@hash nvarchar(63)
AS
BEGIN
	/*
	declare @username nvarchar(63)
	declare @userpassword nvarchar(63) 	
	declare @result int
	declare @xml xml ;
	
	set @username = 'a1'
	set @userpassword = '...'		

	exec [dbo].[setRecoveryCode] @username,@userpassword, '1221', @result out
	select @result
	*/
	
	Update dbo.[Users] 
	set 
		[userpassword] = @hash, 
		recoveryDateTime = null, 
		[recoveryCode] = null
    WHERE [id] = @id
	
END

GO