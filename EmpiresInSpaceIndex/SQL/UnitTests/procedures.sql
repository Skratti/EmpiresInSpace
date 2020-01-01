IF (NOT EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.SCHEMATA 
                 WHERE SCHEMA_NAME = 'Unittest' ))
BEGIN   
   EXEC( 'CREATE SCHEMA Unittest' );
END


drop  PROCEDURE Unittest.UserTest
go
CREATE PROCEDURE Unittest.UserTest	
as
BEGIN
	-- exec Unittest.UserTest 165
	-- update 
	-- Be careful when removing the transaction: only users should be registered which were previously activated in the spaceGameIndex-DB
	-- except when creating users for a demo database
	
	BEGIN TRAN

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
		'UnitTest_Andi' as username,
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
	
	select * from dbo.[Users]

	declare @newUserId int;
	select top 1  @newUserId = id from dbo.[Users] order by id desc

	declare @openGameId int;
	select top 1 @openGameId = id  from dbo.Games where currentUserCount < maxUsers and gameStatus in (1,2) order by id;

	


	declare @result int;
	exec [dbo].[registerUserCheckGame]  @newUserId, @openGameId, @result out;
	select * from dbo.games where id = @openGameId
	select * from dbo.UserGames where gameId = @openGameId;
	exec [dbo].[registerToGame]  @newUserId, @openGameId;
	select * from dbo.UserGames where gameId = @openGameId;
	ROLLBACK	
	--commit



	
END
go

exec Unittest.UserTest	