-- README
-- 3 places in this file have to be adjusted before execution:
-- 1) @DBServerName has to get your SQL server name
-- 2) @DBName has to get your database name
-- 3) @FilePath has to get the folder where this file (and the others) are in. The script will be executes by the sql server service user, which will probably do not have access to your windows home folders. So copy the files to be executed somewhere else where the service has access to (c:\temp for example).
-- If those things are given, you can just execute the script  (F5 in sql management studio, Ctrl+Shift+E in visual studio). The cisual studio project might also need the database connection in its debug tab page.

EXEC master.dbo.sp_configure 'show advanced options', 1;
go
RECONFIGURE 
EXEC master.dbo.sp_configure 'xp_cmdshell', 1 
RECONFIGURE

SET NOCOUNT ON
SET XACT_ABORT ON  

BEGIN TRAN  

--DECLARE @DBServerName   VARCHAR(100) = 'MyServer\Example'  
DECLARE @DBServerName   VARCHAR(100) = '(localdb)\MSSQLLocalDB'  
DECLARE @DBName VARCHAR(100) = 'Andromeda'  

DECLARE @FilePath   VARCHAR(200) = 'E:\Projects\C#\EmpiresInSpace\Database\' 
--DECLARE @FilePath   VARCHAR(200) = 'C:\Users\Admin\Documents\GitHub\EmpiresInSpace\SQL\'

DECLARE @FileList TABLE (Files NVARCHAR(MAX), id int identity(1,1))  

 
INSERT INTO @FileList VALUES ('02 initTables.sql')  
INSERT INTO @FileList VALUES ('02.Views.sql')  
INSERT INTO @FileList VALUES ('03 LabelsBase.sql')  
INSERT INTO @FileList VALUES ('04 fillTablesWithBaseData.sql')  
INSERT INTO @FileList VALUES ('04.01 PlanetSurfaces.sql')  
INSERT INTO @FileList VALUES ('05 fillTablesWithGameData.sql')  
INSERT INTO @FileList VALUES ('05.01 fillResearchPrerequisites.sql') 
INSERT INTO @FileList VALUES ('05.02 fillBuildings.sql') 
INSERT INTO @FileList VALUES ('05.03 fillSpecializations.sql') 
INSERT INTO @FileList VALUES ('05.04 fillShipModuleData.sql') 
INSERT INTO @FileList VALUES ('06 fillLabels.sql') 
INSERT INTO @FileList VALUES ('07 Merges.sql')
INSERT INTO @FileList VALUES ('08 Helpers.sql')
INSERT INTO @FileList VALUES ('09 UpdateAfterMapCreation.sql')



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


EXEC master.dbo.sp_configure 'xp_cmdshell', 0 
RECONFIGURE 
EXEC master.dbo.sp_configure 'show advanced options', 0 
RECONFIGURE  

