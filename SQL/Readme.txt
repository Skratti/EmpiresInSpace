File 00 CreateGameDB.sql can be used to automatically fill a database with game data:

- Open SQL server management studio
- Create new DB 
- Load file
- Change Server name (line 13)
- Change target DB (line 14)
- change file path to the folder where the sql files are

Or open the files 02 - 05.04 in numerical order and execute each manually

File "02 initTables.sql" and "04 fillTablesWithBaseData.sql" should not report no error anymore after a second execution
File "02 initTables.sql" could be improved with dynamic detection if the tables exist, superseding the second execution

File "03 LablesBase.sql" may be improved with better grammatic or better texts

colum and tables names are sometimes not choosen well, and not yet refactored - but most of the tables are straightforward

