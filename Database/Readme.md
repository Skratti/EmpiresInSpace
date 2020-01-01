File 00 CreateGameDB.sql can be used to automatically fill a database with game data:

- Open SQL server management studio
- Create new DB 
- Load file
- Change Server name (line 13)
- Change target DB (line 14)
- change file path to the folder where the sql files are

Or open the files 02 - 08 in numerical order and execute each manually

File "02 initTables.sql" and "04 fillTablesWithBaseData.sql" should not report any error after a second execution
File "02 initTables.sql" could be improved with dynamic detection if the tables exist, superseding the second execution

File "03 LablesBase.sql" may be improved with better grammatic or better texts

column and tables names are sometimes not choosen well, and not yet refactored - but most of the tables are straightforward

After 08 Helpers.sql, the starmap and system maps should be generated (my tool for that is not open source atm - you can just enter a few valid lines into starmap and systemmap).
If required, I can provide a small sql script that adds 3 stars, 10 nebulas and the solar systems for the three stars...

After that, the UpdateAfterMapCreation.sql can be executed to finalize the starmap
