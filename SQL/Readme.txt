The files can be executed in numerical order 

File "02 initTables.sql" and "04 fillTablesWithBaseData.sql" should not report no error anymore after a second execution

File "02 initTables.sql" could be improved with dynamic detection if the tables exist, superseding the second execution
File "03 LablesBase.sql" may be improved with better grammatic or better texts
File "04 fillTablesWithBaseData.sql" could benefit from the same logic as 02, and also by better documentation

File "05 fillTablesWithGameData.sql" can be enhanced by lots of game mechanics. If you are willing to help, contact me before beginning...

todo:
put something like this in front of each create call (modified for tables + check for schema would also be good in the select):

IF EXISTS(SELECT 1 
          FROM   sys.objects 
          WHERE  NAME = N'v_gameNewTurns' 
                 AND type = N'V') 
  BEGIN 
      DROP VIEW engine.[v_gameNewTurns] 
  END 
go 

There are some badly named columns. These just have top be refactored later by me.