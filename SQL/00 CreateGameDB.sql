
EXEC master.dbo.sp_configure 'show advanced options', 1 
RECONFIGURE 
EXEC master.dbo.sp_configure 'xp_cmdshell', 1 
RECONFIGURE

SET NOCOUNT ON
SET XACT_ABORT ON  

BEGIN TRAN  

--DECLARE @DBServerName   VARCHAR(100) = 'MyServer\Example'  
DECLARE @DBServerName   VARCHAR(100) = '.'  
DECLARE @DBName VARCHAR(100) = 'Test09'  

DECLARE @FilePath   VARCHAR(200) = 'C:\Temp\SQL2\' 

DECLARE @FileList TABLE (Files NVARCHAR(MAX), id int identity(1,1))  

 
INSERT INTO @FileList VALUES ('02 initTables.sql')  
INSERT INTO @FileList VALUES ('02.Views.sql')  
INSERT INTO @FileList VALUES ('03 LablesBase.sql')  
INSERT INTO @FileList VALUES ('04 fillTablesWithBaseData.sql')  
INSERT INTO @FileList VALUES ('05 fillTablesWithGameData.sql')  
INSERT INTO @FileList VALUES ('05.01 fillResearchPrerequisites.sql') 
INSERT INTO @FileList VALUES ('05.02 fillBuildings.sql') 
INSERT INTO @FileList VALUES ('05.03 fillSpecializations.sql') 
INSERT INTO @FileList VALUES ('05.04 fillShipModuleData.sql') 



WHILE (SELECT COUNT(Files) FROM @FileList) > 0  
BEGIN  
   /*  
   execute each file one at a time  
   */  
   --SET QUOTED_IDENTIFIER ON ???
   declare @id int =  (SELECT TOP(1) id FROM @FileList order by id)  
   DECLARE @FileName NVARCHAR(MAX) = (SELECT TOP(1) Files FROM @FileList order by id)  
   DECLARE @command  VARCHAR(500)  = 'sqlcmd -S ' + @DBServerName + ' -d  ' + @DBName + ' -I -i "' + @FilePath + @Filename +'"'  
   EXEC xp_cmdshell  @command   

   PRINT 'EXECUTED: ' + @FileName     
   DELETE FROM @FileList WHERE id = @id  
END  
COMMIT TRAN

--insert lables

go
SET NOCOUNT OFF
go

EXEC master.dbo.sp_configure 'xp_cmdshell', 0 
RECONFIGURE 
EXEC master.dbo.sp_configure 'show advanced options', 0 
RECONFIGURE  

