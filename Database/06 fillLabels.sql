SET QUOTED_IDENTIFIER ON
print '06 fillLables.sql'
go
--1 copy Label file to server, since this script will look in the server file system
truncate table dbo.Labels
BULK
INSERT dbo.Labels
--FROM 'D:\EmpiresInSpace\Labelfiles\DE.csv'
FROM 'C:\EmpiresInSpace\EmpiresInSpace\Labelfiles\DE.csv'
WITH
(
ROWTERMINATOR = '\n'
)
GO

/* depending on the text format:
update Labels set label =  SUBSTRING(label,2, LEN(label) -2)
from Labels
*/
go
