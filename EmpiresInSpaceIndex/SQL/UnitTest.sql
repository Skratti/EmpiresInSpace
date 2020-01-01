--create schema [UnitTest]
go

drop PROCEDURE [UnitTest].run
go
create PROCEDURE [UnitTest].run
as
begin	
	-- exec [UnitTest].run
	SET NOCOUNT ON
	BEGIN TRAN
	declare 
		@userId int,		
		@username nvarchar(63);
			
	set @username = 'demo1'

	
	exec [UnitTest].UserTest @username, @userId out
	select @userId as userId;	
	

	
	
	--exec inSpaceIndex.[UnitTest].UserTest @userId
	--select @user2Id;	
	--exec Unittest.UserTest @user2Id
	--exec Unittest.setRelation @userId,@user2Id,0
	--exec Unittest.Combat @userId, @user2Id ;
	
	ROLLBACK
end


go
drop PROCEDURE [UnitTest].UserTest;
go
CREATE PROCEDURE [UnitTest].UserTest
	@username nvarchar(63),
	@userId int	out
as
BEGIN
	declare 						
		@userpassword nvarchar(63) ,				
		@verificationCode nvarchar(63),
		@result int,
		@xml xml
				
	set @userpassword = '693a9fdd4c2fd0700968fba0d07ff3c0' -- == md5hash('a2')

	exec UnitTest.createUser @username, @userpassword, @result out , @verificationCode out
	
	select @userId = @@identity;
	IF @userId is null or @userId = 0 or @result != 1
	BEGIN
		SELECT 'Fehler in inSpaceindex createUser' as errorMessage 
	END
	
	exec UnitTest.authenticateUser @verificationCode


	declare @user_ip nvarchar(30);
	set @user_ip = '127u'
	exec [UnitTest].loginUser 	@username ,	@userpassword ,	@user_ip ,	@result out,@xml out
	select @xml as loginUserInIndexDB
	
	--register to the first game of the games List:
	declare @firstGameId int;
	set @firstGameId = (select top 1 id from dbo.Games);
	--exec [UnitTest].registerUser @userId, @firstGameId;
	
	exec [UnitTest].loginUser 	@username ,	@userpassword ,	@user_ip ,	@result out,@xml out
	select @xml as loginUserInIndexDBAfterRegistrationInFirstGame
	
	
	--exec  [UnitTest].[LoginToGame] 	@userId ,@firstGameId, 	@user_ip 
END
go


drop PROCEDURE [UnitTest].createUser;
go
CREATE PROCEDURE [UnitTest].createUser
	@username nvarchar(63),
	@userpassword nvarchar(63) ,		
	@result int out,
	@verificationCode nvarchar(63) out
AS
BEGIN
	
	declare @email nvarchar(63)
	declare @user_ip nvarchar(55)
	declare @language nvarchar(63)
	declare @defaultInGameName nvarchar(63)
	declare @defaultStartingRegion int
	declare @xml xml	
	
	set @email = 'a.kastirke@googlemail.com'
	set @user_ip = '127u'
	set @language = 'de'
	set @defaultInGameName = 'Largo'
	set @defaultStartingRegion = 0
	
	exec [dbo].createUser @username,@userpassword,@email,@user_ip,@language,@defaultInGameName,@defaultStartingRegion,@result out, @verificationCode out, @xml out
	--select @result, @verificationCode
		
END
	
	
	
go
drop PROCEDURE [UnitTest].authenticateUser;
go
CREATE PROCEDURE [UnitTest].authenticateUser
	@verificationCode nvarchar(63)
AS
BEGIN	
	exec [dbo].authenticateUser @verificationCode 		
END


go
drop PROCEDURE [UnitTest].loginUser;
go
CREATE PROCEDURE [UnitTest].loginUser
	@username nvarchar(63),
	@userpassword nvarchar(63),
	@user_ip nvarchar(55),		
	@result int out,
	@xml xml out
AS
BEGIN			
	exec [dbo].loginUser  @username,@userpassword,@user_ip,@result out, @xml out				
END



go
drop PROCEDURE [UnitTest].UserData;
go
CREATE PROCEDURE [UnitTest].UserData
	@userId int 
AS
BEGIN	
	exec [dbo].UserData @userId				
END

--  update [inSpaceIndex].[dbo].[Users] set id = 1

go
drop PROCEDURE [UnitTest].LoginToGame02;
go
CREATE PROCEDURE [UnitTest].LoginToGame02
	@userId int ,
	@userIp nvarchar(55),
	@result int out
AS
BEGIN			
	exec [dbo].LoginToGame02 @userId,@userIp,@result out	
END


go
drop PROCEDURE [UnitTest].LoginToGame05;
go
CREATE PROCEDURE [UnitTest].LoginToGame05
	@userId int ,
	@userIp nvarchar(55),
	@result int out
AS
BEGIN	
	exec dbo.LoginToGame05 @userId,@userIp,@result out	
END
go



drop PROCEDURE [UnitTest].registerUserGame02;
go
CREATE PROCEDURE [UnitTest].registerUserGame02
	@userId int	
AS
BEGIN	
	exec registerUserGame02 @userId		
END;
go	


drop PROCEDURE [UnitTest].registerUser;
go
CREATE PROCEDURE [UnitTest].registerUser
	@userId int,
	@gameId int 	
AS
BEGIN	
	declare @result int, @xml xml;
	exec dbo.registerUserCheckGame @userId, @gameId, @result out
	
	--manually change targetDB if needed, since the login page does this now via connectionString
	exec [Game02].[dbo].[registerUser] @userId, @result out, @xml out		
		
	if @result = 1
	BEGIN
		insert into UserGames select @userId,@gameId
	END		
	--select @xml as registerUserXML
END;
go	

drop PROCEDURE [UnitTest].[LoginToGame]
go
CREATE PROCEDURE [UnitTest].[LoginToGame]
	@userId int,
	@gameId int,
	@userIp nvarchar(55) 	
AS
BEGIN	
	declare @result int, @xml xml;
	exec dbo.[LoginToGame] @userId, @gameId, @result out, @xml out
	
	--manually change targetDB if needed, since the login page does this now via connectionString
	exec [Game02].[dbo].LoginFromIndex @userId, @userIp, @result out, @xml out
		
	
	--select @result as LoginToGame
END;
go	

--exec UnitTest.run
--update [dbo].[Users] set loginDT = dateadd(hour,3, GETDATE()) where id = 1
--update [dbo].[Users] set user_ip = '::1' where id = 1
   
--update Ships set name = 'Demo' where id = 3