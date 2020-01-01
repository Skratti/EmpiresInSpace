using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.DataConnectors
{
    static class Extensions
    {        
        /// <summary>
        /// Add an enumerable to a DataTable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="enumerable"></param>
        /// <param name="table"></param>
        public static void AddToDataTable<T>(this IEnumerable<T> enumerable, System.Data.DataTable table)
        {
            if (enumerable.FirstOrDefault() == null)
            {
                //table.Rows.Add(new[] { string.Empty });
                return;
            }

            var properties = enumerable.FirstOrDefault().GetType().GetProperties();

            foreach (var item in enumerable)
            {
                

                var row = table.NewRow();
                foreach (var property in properties)
                {
                    //skip properties that are not part of the datatable. ( Object references should be ignored) 
                    if (!table.Columns.Contains(property.Name)) continue;
                    row[property.Name] = item.GetType().InvokeMember(property.Name, System.Reflection.BindingFlags.GetProperty, null, item, null);
                }
                table.Rows.Add(row);
            }
        }

        /// <summary>
        /// Add a single object to a data table
        /// </summary>
        /// <param name="item"></param>
        /// <param name="table"></param>
        public static void AddObjectToDataTable(this object item,  System.Data.DataTable table)
        {
             var properties = item.GetType().GetProperties();
             var row = table.NewRow();
             foreach (var property in properties)
             {
                 //ignore objects (but do not ignore strings and Datetimes)
                 //ToDO: is not needed atm, but might be needed later...
                 //if (property.PropertyType.IsClass && property.PropertyType != typeof(String) && property.PropertyType == typeof(DateTime)) continue;
                 //skip properties that are not part of the datatable. ( Object references should be ignored) 
                 //if (!table.Columns.Contains(property.Name)) continue;
                 
                 row[property.Name] = item.GetType().InvokeMember(property.Name, System.Reflection.BindingFlags.GetProperty, null, item, null);
             }
             table.Rows.Add(row);
        }


        

    }

    public partial class SqlConnector
    {
        public async  void closeConnectionOnFinish(List<Task> _tasks, SqlConnection connection)
        {
            try
            {
                await Task.WhenAll(_tasks);
                connection.Close();
                //Console.WriteLine(" records are written to database.");
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public async  void closeTransConnectionOnFinish(List<Task> _tasks, SqlConnection connection, SqlTransaction _transaction)
        {
            await Task.WhenAll(_tasks);

            _transaction.Commit();
            connection.Close();
            //Console.WriteLine(" records are written to database.");
        }

        /// <summary>
        /// Saves a list of complex elements (complext means multiple tables per main record)        
        /// </summary>
        /// <param name="elementsToSave"></param>
        /// <remarks>if the record is simple, this methos should not be used, since the records are then not inserted by a merge command</remarks>
        public  void saveAsync(List<AsyncSaveable> elementsToSave)
        {
            SqlConnection connection = GetConnection();

            connection.Open();
            SqlCommand command = connection.CreateCommand();                              
            command.Connection = connection;         

            List<Task> asynctasks = new List<Task>();
            for (int i = 0; i < elementsToSave.Count; i++)
            {
                asynctasks.Add(elementsToSave[i].save(command));
            }

            Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
        }

        public  void insertAsyncTransaction(List<AsyncInsertable> elementsToInsert)
        {
            SqlConnection connection = GetConnection();

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            SqlTransaction transaction;

            // Start a local transaction.
            transaction = connection.BeginTransaction();

            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = connection;
            command.Transaction = transaction;

            List<Task> insertingTasks = insertElements(elementsToInsert, command);

            Task.Factory.StartNew(() => closeTransConnectionOnFinish(insertingTasks, connection, transaction));

        }

        public  void insertAsync(List<AsyncInsertable> elementsToInsert)
        {
            SqlConnection connection = GetConnection();

            connection.Open();

            SqlCommand command = connection.CreateCommand();
        
            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = connection;           

            List<Task> insertingTasks = insertElements(elementsToInsert, command);

            Task.Factory.StartNew(() => closeConnectionOnFinish(insertingTasks, connection));

        }

        public  List<Task> insertElements(List<AsyncInsertable> _elementsToLock, SqlCommand _command)
        {
            List<Task> asynctasks = new List<Task>();
            for (int i = 0; i < _elementsToLock.Count; i++)
            {
                asynctasks.Add(_elementsToLock[i].insert(_command));
            }

            return asynctasks;
        }

        public  void deleteAsyncTransaction(List<AsyncDeleteable> elementsToDelete)
        {
            SqlConnection connection = GetConnection();

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            SqlTransaction transaction;

            // Start a local transaction.
            transaction = connection.BeginTransaction();

            // Must assign both transaction object and connection
            // to Command object for a pending local transaction
            command.Connection = connection;
            command.Transaction = transaction;

            List<Task> savingtasks = deleteElements(elementsToDelete, command);

            Task.Factory.StartNew(() => closeTransConnectionOnFinish(savingtasks, connection, transaction));

        }

        public  List<Task> deleteElements(List<AsyncDeleteable> _elementsToLock, SqlCommand _command)
        {
            List<Task> asynctasks = new List<Task>();
            for (int i = 0; i < _elementsToLock.Count; i++)
            {
                asynctasks.Add(_elementsToLock[i].delete(_command));
            }

            return asynctasks;
        }


        public  void update(List<Update> elementsToUpdate)
        {
            SqlConnection connection = GetConnection();

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            
            command.Connection = connection;

            for (int i = 0; i < elementsToUpdate.Count; i++)
            {
                elementsToUpdate[i].update(command);
            }

            connection.Close();
        }

        public  void updateStock(List<Core.UserSpaceObject> elementsToUpdate)
        {
            SqlConnection connection = GetConnection();

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            
            command.Connection = connection;

            for (int i = 0; i < elementsToUpdate.Count; i++)
            {
                elementsToUpdate[i].updateStock(command);
            }

            connection.Close();
        }

        public int registerUser(int userId, string name, string ip)
        {
           

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();

                try
                {
                    string query = "[dbo].[registerUser2]";
                    SqlCommand cmd = new SqlCommand(query, connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //@userId, @name,  @userIp , @language , @quests,@result out,   @xml out	
                    cmd.Parameters.AddWithValue("@userId", userId);
                    cmd.Parameters.AddWithValue("@name", name);
                    cmd.Parameters.AddWithValue("@user_ip", ip);                    
                                        
                    cmd.ExecuteNonQuery();                    
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

            return userId;
        }

        
        public  int createDemoUser(string userIp, string userLanguage)
        {
            int userId = 0;

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();                    

                try
                {                    
                    string query = "[dbo].[demoCreateUser]";
                    SqlCommand cmd = new SqlCommand(query, connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter param2 = new SqlParameter();
                    param2.ParameterName = "@userIp";
                    param2.Value = userIp;
                    cmd.Parameters.Add(param2);

                    SqlParameter langShortname = new SqlParameter();
                    langShortname.ParameterName = "@langShortname";
                    langShortname.Value = userLanguage;
                    cmd.Parameters.Add(langShortname);

                    SqlParameter param4 = new SqlParameter("@userId", SqlDbType.Int);
                    param4.Direction = ParameterDirection.Output;
                    param4.Value = 0;
                    cmd.Parameters.Add(param4);

                    cmd.ExecuteNonQuery();

                    Int32.TryParse(param4.Value.ToString(), out userId);                    
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }                
            }

            return userId;
        }

        public  void saveLog(string logText)
        {
            try
            {
                SqlConnection connection = GetConnection();

                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.Connection = connection;

                command.CommandText =
                    "insert into [dbo].[Log](logText) select @text";
                command.CommandType = System.Data.CommandType.Text;
                command.Parameters.AddWithValue("@text", logText);
                Task<int> ret = command.ExecuteNonQueryAsync();

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(ret);

                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch(Exception ex){
                //if saving to DB did not work, save to file system, send an email or do some other thing
                //Core.Core.Instance.writeExceptionToLog(ex);
            }
            
        }


        public void saveServerEvent(int eventId)
        {
            try
            {
                SqlConnection connection = GetConnection();

                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.Connection = connection;

                command.CommandText =
                    "insert into [dbo].[ServerEvents]([eventType]) select @eventId";
                command.CommandType = System.Data.CommandType.Text;
                command.Parameters.AddWithValue("@eventId", eventId);
                Task<int> ret = command.ExecuteNonQueryAsync();

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(ret);

                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

        }

        public  Task saveGame(object commandO)
        {

            SqlCommand command = (SqlCommand)commandO;
            Task<int> ret;

            command.CommandText =
                "UPDATE [galaxymap] set " +
                "[colonyCount] = @colonyCount, " +
                "[transcendenceRequirement] = @transcendenceRequirement, " +
                "[gameState] = @gameState, " +
                "[winningTranscendenceConstruct] = @winningTranscendenceConstruct";

            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@colonyCount", Core.Core.Instance.GalaxyMap.colonyCount);
            command.Parameters.AddWithValue("@transcendenceRequirement", Core.Core.Instance.GalaxyMap.transcendenceRequirement);
            command.Parameters.AddWithValue("@gameState", Core.Core.Instance.GalaxyMap.gameState);
            command.Parameters.AddWithValue("@winningTranscendenceConstruct", Core.Core.Instance.GalaxyMap.winningTranscendenceConstruct);
            ret = command.ExecuteNonQueryAsync();

            return ret;
        }

        public void insertShip(SpacegameServer.Core.Ship _ship)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].shipInsert";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var shipTable = Core.Ship.createDataTable();
            
            /*(from ship in Core.Core.Instance.ships
             where ship.Value != null && ship.id == _ship.id
             select ship).Select(data => new
             {
                 data.id,
                 data.userid,
                 data.NAME,
                 data.energy,
                 data.crew,
                 data.scanRange,
                 data.attack,
                 data.defense,
                 data.hitpoints,
                 data.damagereduction,
                 data.cargoroom,
                 data.fuelroom,
                 data.max_hyper,
                 data.max_impuls,
                 data.hyper,
                 data.impuls,
                 data.colonizer,
                 data.population,
                 data.shipHullsImage,
                 data.hullid,
                 data.systemX,
                 data.systemY,
                 data.spaceX,
                 data.spaceY,
                 data.systemId,
                 data.templateid,
                 data.refitCounter,
                 data.objectid,
                 data.versionId
             }).AddToDataTable(shipTable);
            */

            _ship.createData().AddObjectToDataTable(shipTable);

            var moduleTable = Core.ShipModule.createDataTable();
            _ship.shipModules.Select(data => new
            {
                data.shipId,
                data.moduleId,
                data.posX,
                data.posY,
                data.hitpoints,
                data.active
            }).AddToDataTable(moduleTable);
            
            var stockTable = Core.shipStock.createDataTable();
            _ship.goods.Select(data => new
            {
                data.shipId,
                data.goodsId,
                data.amount               
            }).AddToDataTable(stockTable);
           

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@ships", shipTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipMergeType";

                SqlParameter shipModules = cmd.Parameters.AddWithValue("@shipModules", moduleTable);
                shipModules.SqlDbType = SqlDbType.Structured;
                shipModules.TypeName = "[engine].shipModulesMergeType";

                SqlParameter shipStocks = cmd.Parameters.AddWithValue("@shipStocks", stockTable);
                shipStocks.SqlDbType = SqlDbType.Structured;
                shipStocks.TypeName = "[engine].shipStockMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }


        public Task saveShipTemplate(SpacegameServer.Core.ShipTemplate template, object commandO)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            SqlCommand command = (SqlCommand)commandO;
            command.CommandText = "[engine].shipTemplateMerge";          
            command.CommandType = CommandType.StoredProcedure;

            template.versionId += 1;

            var shipTemplateDataTable = Core.ShipTemplate.createDataTable();
            template.createData().AddObjectToDataTable(shipTemplateDataTable);

            var shipTemplateModulesDataTable = Core.ShipTemplateModules.createDataTable();
            template.shipModules.Select(data => new
            {
                templateId = data.shiptemplateid,
                data.moduleId,
                data.posX,
                data.posY
            }).AddToDataTable(shipTemplateModulesDataTable);


            Task<int> ret = null;
            try
            {
                

                SqlParameter tvpParam = command.Parameters.AddWithValue("@template", shipTemplateDataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipTemplateMergeType";

                SqlParameter tvpParam2 = command.Parameters.AddWithValue("@modules", shipTemplateModulesDataTable);
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.TypeName = "[engine].shipTemplateModulesMergeType";

                SqlParameter templateId = new SqlParameter();
                templateId.ParameterName = "@templateId";
                templateId.Value = template.id;
                command.Parameters.Add(templateId);     

                SqlParameter newVersionId = new SqlParameter();
                newVersionId.ParameterName = "@newVersionId";
                newVersionId.Value = template.versionId;
                command.Parameters.Add(newVersionId);

                     


                ret = command.ExecuteNonQueryAsync();               
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return ret;    
        }
        /*
        public void saveShipTemplateModules(SpacegameServer.Core.ShipTemplate ship)
        {
            SqlConnection connection = getConnection();
            connection.Open();
            string query = "[engine].shipModulesMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.ShipModule.createDataTable();

            _ship.shipModules.Select(data => new
            {
                data.shipId,
                data.moduleId,
                data.posX,
                data.posY,
                data.hitpoints,
                data.active
            }).AddToDataTable(dataTable);

            try
            {
                _ship.shipModulesVersionId += 1;

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@shipModules", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipModulesMergeType";

                SqlParameter shipId = new SqlParameter();
                shipId.ParameterName = "@shipId";
                shipId.Value = _ship.id;
                cmd.Parameters.Add(shipId);

                SqlParameter shipModulesVersionId = new SqlParameter();
                shipModulesVersionId.ParameterName = "@shipModulesVersionId";
                shipModulesVersionId.Value = _ship.shipModulesVersionId;
                cmd.Parameters.Add(shipModulesVersionId);


                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLogFile(ex);
            }

            return;
        }
        */

        public void saveUser(SpacegameServer.Core.User user)
        {
        

            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].userMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.User.createDataTable();

            if (user != null) 
            { 
                user.createData().AddObjectToDataTable(dataTable); 
            }
            else
            {
                Core.Core.Instance.users.Select(data => data.Value.createData()).AddToDataTable(dataTable);
            }

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@users", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].userMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveAlliances(SpacegameServer.Core.Alliance alliance)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].allianceMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Alliance.createDataTable();

            if (alliance != null) alliance.createData().AddObjectToDataTable(dataTable);
            else
            {
                Core.Core.Instance.alliances.Select(data => data.Value.createData()).AddToDataTable(dataTable);
            }

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@alliances", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].allianceMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }


        public void saveResearch(Core.Core instance, SpacegameServer.Core.Research research = null)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].ResearchMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Research.createDataTable();


            instance.Researchs.Where(data=>data != null && ( research == null || data.id == research.id ) ).Select(data => data.createData()).AddToDataTable(dataTable);
            

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@researches", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].ResearchType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;

        }


        public void SaveUserResearch(Core.Core instance, 
            SpacegameServer.Core.User user,
            List<SpacegameServer.Core.UserResearch> NewUserResearch, 
            List<SpacegameServer.Core.UserQuest> NewQuests)
        {
            // Todo: refactor all sql commands so that they look like this one
            SaveUserResearchAsync(instance, user, NewUserResearch, NewQuests).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);

        }



        public SqlCommand SaveUserResearchCmd(Core.Core instance, 
            SpacegameServer.Core.User user,
            List<SpacegameServer.Core.UserResearch> NewUserResearch, 
            List<SpacegameServer.Core.UserQuest> NewQuests,
            SqlConnection connection)
        {

            string query = "[engine].UserResearchDoneMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var NewUserResearchDataTable = Core.UserResearch.createDataTable();
            NewUserResearch.AddToDataTable(NewUserResearchDataTable);

            var userDataTable = Core.User.createDataTable();
            user.createData().AddObjectToDataTable(userDataTable);


            var UserQuestDataTable = Core.UserQuest.createDataTable();
            NewQuests.AddToDataTable(UserQuestDataTable);

            try
            {

                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@UserResearches", NewUserResearchDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].UserResearchType";

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@User", userDataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].userMergeType";

                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@UserQuests", UserQuestDataTable);
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.TypeName = "[engine].UserQuestsType";                   
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveUserResearchAsync(Core.Core instance, 
            SpacegameServer.Core.User user,
            List<SpacegameServer.Core.UserResearch> NewUserResearch, 
            List<SpacegameServer.Core.UserQuest> NewQuests)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveUserResearchCmd(instance, user, NewUserResearch, NewQuests, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }



        public void SaveUserQuests(Core.Core instance,
            List<SpacegameServer.Core.UserQuest> quests)
        {
            // Todo: refactor all sql commands so that they look like this one
            SaveUserQuestsAsync(instance, quests).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);

        }



        public SqlCommand SaveUserQuestsCmd(Core.Core instance,
            List<SpacegameServer.Core.UserQuest> quests,
            SqlConnection connection)
        {

            string query = "[engine].UserQuestsMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var UserQuestDataTable = Core.UserQuest.createDataTable();
            quests.AddToDataTable(UserQuestDataTable);

            try
            {
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@UserQuests", UserQuestDataTable);
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.TypeName = "[engine].UserQuestsType";
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveUserQuestsAsync(Core.Core instance,
            List<SpacegameServer.Core.UserQuest> quests)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveUserQuestsCmd(instance,  quests, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }




        public void InsertTurnEvaluation(SpacegameServer.Core.TurnEvaluation turn)
        {
            InsertTurnEvaluationAsync(turn).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);

            return;
        }


        public SqlCommand InsertTurnEvaluationCmd(SpacegameServer.Core.TurnEvaluation turn,
            SqlConnection connection)
        {
            string query = "[engine].TurnEvaluationInsert";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var turnTable = Core.TurnEvaluation.createDataTable();

            turn.createData().AddObjectToDataTable(turnTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@evaluation", turnTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].TurnEvaluationInsertType";
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task InsertTurnEvaluationAsync(SpacegameServer.Core.TurnEvaluation turn)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = InsertTurnEvaluationCmd(turn, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }




        public void SaveResearch(List<SpacegameServer.Core.UserResearch> research)
        {
            SaveResearchAsync(research).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand SaveResearchCmd(
            List<SpacegameServer.Core.UserResearch> research,
            SqlConnection connection)
        {

            string query = "[engine].UserResearchMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var NewUserResearchDataTable = Core.UserResearch.createDataTable();
            research.AddToDataTable(NewUserResearchDataTable);    

            try
            {

                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@UserResearchs", NewUserResearchDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].UserResearchType";  
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveResearchAsync(List<SpacegameServer.Core.UserResearch> research)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveResearchCmd( research, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }









        public void SaveTradeOffer(SpacegameServer.Core.TradeOffer trade)
        {
            SaveTradeOfferAsync(trade).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand SaveTradeOfferCmd(
            SpacegameServer.Core.TradeOffer trade,
            SqlConnection connection)
        {

            string query = "[engine].TradeOfferMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var NewTradeDataTable = Core.TradeOffer.createDataTable();
            trade.createData().AddObjectToDataTable(NewTradeDataTable);

            var NewTradeDetailsTable = Core.TradeOfferGood.createDataTable();
            trade.offered.AddToDataTable(NewTradeDetailsTable);
            trade.requested.AddToDataTable(NewTradeDetailsTable);    


            try
            {
                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@TradeOffer", NewTradeDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].TradeOfferType";

                SqlParameter tvpParam1 = cmd.Parameters.AddWithValue("@TradeOfferDetails", NewTradeDetailsTable);
                tvpParam1.SqlDbType = SqlDbType.Structured;
                tvpParam1.TypeName = "[engine].TradeOfferDetailsType";

                cmd.Parameters.AddWithValue("@TradeId", trade.tradeOfferId);
                
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveTradeOfferAsync(SpacegameServer.Core.TradeOffer trade)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveTradeOfferCmd(trade, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }





        public void SaveTradeList(List<SpacegameServer.Core.TradeOffer> trades)
        {
            SaveTradeListAsync(trades).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand SaveTradeListCmd(
            List<SpacegameServer.Core.TradeOffer> trades,
            SqlConnection connection)
        {

            string query = "[engine].TradeOfferInsert";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var NewTradeDataTable = Core.TradeOffer.createDataTable();
            trades.Select(data => data.createData()).AddToDataTable(NewTradeDataTable);

            var NewTradeDetailsTable = Core.TradeOfferGood.createDataTable();
            trades.ForEach(trade => trade.offered.AddToDataTable(NewTradeDetailsTable));
            trades.ForEach(trade => trade.requested.AddToDataTable(NewTradeDetailsTable));

            try
            {
                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@TradeOffer", NewTradeDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].TradeOfferType";

                SqlParameter tvpParam1 = cmd.Parameters.AddWithValue("@TradeOfferDetails", NewTradeDetailsTable);
                tvpParam1.SqlDbType = SqlDbType.Structured;
                tvpParam1.TypeName = "[engine].TradeOfferDetailsType";
                
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveTradeListAsync(List<SpacegameServer.Core.TradeOffer> trades)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveTradeListCmd(trades, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }










        public void saveAllianceMembers(SpacegameServer.Core.Alliance alliance)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].allianceMembersMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.AllianceMember.createDataTable();
            alliance.memberRights.ConvertAll(e=>(SpacegameServer.Core.AllianceMember)e).Select(data => data.createData()).AddToDataTable(dataTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@allianceMembers", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].allianceMembersMergeType";

                SqlParameter aId = cmd.Parameters.AddWithValue("@allianceId", alliance.id);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void deleteAllianceRelations(int allianceHash)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "delete from dbo.[DiplomaticEntityState] where [sender]  = @allianceHash or [target]  = @allianceHash";
            SqlCommand cmd = new SqlCommand(query, connection);

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@allianceHash", allianceHash);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void deleteTradeOfferById(int id)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = @"delete from  [TradeOffers]
	            where	[TradeOffers].id = @id;";
            SqlCommand cmd = new SqlCommand(query, connection);

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@id", id);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void deleteTradeOfferByObject(int type, int objectId)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = @"delete from  [TradeOffers]
	            where	[TradeOffers].spaceObjectId = @objectId
		        and	[TradeOffers].spaceObjectType = @objectType;";
            SqlCommand cmd = new SqlCommand(query, connection);

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@objectType", type);
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@objectId", objectId);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void deleteAlliance(int allianceId)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "delete from dbo.alliances where id = @allianceId";
            SqlCommand cmd = new SqlCommand(query, connection);

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@allianceId", allianceId);
             
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }
        public void insertInvite(int allianceId, int userId)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "insert into [AllianceInvites] select @allianceId,@toInviteUserId;";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {

                SqlParameter tvpParam1 = cmd.Parameters.AddWithValue("@allianceId", allianceId);
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@toInviteUserId", userId);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {               
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void removeInvite(int allianceId, int userId)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "delete from [AllianceInvites] where allianceId =  @allianceId and userId = @toInviteUserId";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {

                SqlParameter tvpParam1 = cmd.Parameters.AddWithValue("@allianceId", allianceId);
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@toInviteUserId", userId);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveColonies(SpacegameServer.Core.Colony colony)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].colonyMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Colony.createDataTable();

            if (colony != null)
            {
                colony.createData().AddObjectToDataTable(dataTable);
            }
            else
            {
                Core.Core.Instance.colonies.Select(data => data.Value.createData()).AddToDataTable(dataTable);
            }

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonies", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveColonyFull(SpacegameServer.Core.SolarSystemInstance planet, SpacegameServer.Core.Colony colony, bool createSurfaceFiels = true)
        {
            if (colony == null) return;

            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].colonyFullMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var planetSurfaceDataTable = Core.PlanetSurface.createDataTable();
            if (createSurfaceFiels)
            {
                planet.surfaceFields.Select(field => field.createData()).AddToDataTable(planetSurfaceDataTable);
            }
            var colonyDataTable = Core.Colony.createDataTable();
            colony.createData().AddObjectToDataTable(colonyDataTable);


            var colonyGoodsDataTable = Core.Colony.createDataTableGoods();
            colony.goods.Select(data => new
            {
                data.colonyId,
                data.goodsId,
                data.amount
            }).AddToDataTable(colonyGoodsDataTable);

            var ColonyBuildingDataTable = Core.ColonyBuilding.createDataTable();
            colony.colonyBuildings.Select(data => data.createData()).AddToDataTable(ColonyBuildingDataTable);
            

            try
            {
                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@planetSurfaces", planetSurfaceDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].planetSurfaceMergeType";

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonies", colonyDataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyMergeType";

                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@colonyBuildings", ColonyBuildingDataTable);
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.TypeName = "[engine].colonyBuildingMergeType";

                SqlParameter tvpParam3 = cmd.Parameters.AddWithValue("@colonyStocks", colonyGoodsDataTable);
                tvpParam3.SqlDbType = SqlDbType.Structured;
                tvpParam3.TypeName = "[engine].colonyStockMergeType";

                SqlParameter tvpParam4 = cmd.Parameters.AddWithValue("@colonyId", colony.id);

                SqlParameter tvpParam5 = cmd.Parameters.AddWithValue("@planetId", planet.id);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);

                var planetStr = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(planet);
                Core.Core.Instance.writeToLog(planetStr);

                var colonyStr = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(colony);
                Core.Core.Instance.writeToLog(colonyStr);
                
                Core.Core.Instance.writeToLog(createSurfaceFiels ? "true" : "false");
            }

            return;
        }


        private SqlCommand SaveMinorColonyCmd(SqlConnection connection, SpacegameServer.Core.SolarSystemInstance planet, int colonyId)
        {
            string query = "[engine].colonyMinorMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var planetSurfaceDataTable = Core.PlanetSurface.createDataTable();
            planet.surfaceFields.Select(field => field.createData()).AddToDataTable(planetSurfaceDataTable);
            
            try
            {
                SqlParameter tvpParam0 = cmd.Parameters.AddWithValue("@planetSurfaces", planetSurfaceDataTable);
                tvpParam0.SqlDbType = SqlDbType.Structured;
                tvpParam0.TypeName = "[engine].planetSurfaceMergeType";

                SqlParameter tvpParam4 = cmd.Parameters.AddWithValue("@colonyId", colonyId);
                SqlParameter tvpParam5 = cmd.Parameters.AddWithValue("@planetId", planet.id);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;

        }

        private async Task SaveMinorColonyAsync(SpacegameServer.Core.SolarSystemInstance planet, int colonyId)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveMinorColonyCmd(connection, planet, colonyId))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

        }

        public void saveMinorColony(SpacegameServer.Core.SolarSystemInstance planet, int colonyId)
        {
            SaveMinorColonyAsync(planet, colonyId).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public void saveSingleColony(SpacegameServer.Core.Colony colony)
        {
            if (colony == null) return;
            colony.versionId++;

            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].colonyUpdate";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;
         
            var colonyDataTable = Core.Colony.createDataTable();
            colony.createData().AddObjectToDataTable(colonyDataTable);

            try
            {     
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonies", colonyDataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyMergeType";             

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void savePlanetSurface(SpacegameServer.Core.SolarSystemInstance planet)
        {
            if (planet == null) return;

            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].planetSurfaceMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var planetSurfaceDataTable = Core.PlanetSurface.createDataTable();
            planet.surfaceFields.Select(field => field.createData()).AddToDataTable(planetSurfaceDataTable);            

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@planetSurfaces", planetSurfaceDataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].planetSurfaceMergeType";
               
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveColonyBuildings(SpacegameServer.Core.ColonyBuilding colonyBuilding)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].colonyBuildingMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.ColonyBuilding.createDataTable();

            if (colonyBuilding != null) colonyBuilding.createData().AddObjectToDataTable(dataTable);
            else
            {
                Core.Core.Instance.colonyBuildings.Select(data => data.Value.createData()).AddToDataTable(dataTable);
            }

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonyBuildings", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyBuildingMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public Task saveShip(SpacegameServer.Core.Ship _ship, object commandO)
        {
            SqlCommand command = (SqlCommand)commandO;

            _ship.versionId += 1;
            Task<int> ret;
            
            command.CommandText =
                "UPDATE [Ships] set " +                
                "[hyper] = @rest_hyper " +
                ",[impuls] = @rest_impuls " +
                ",spaceX = @xMove " +
                ",spaceY = @yMove " +
                ",systemId = @systemId " +
                ",systemX = @systemX" +
                ",systemY = @systemY " +
                ",name = @name " +
                ",[hullId] = @hullId " +
                ",[objectId] = @objectId " +

                ",[energy] = @energy " +
                ",[crew] = @crew " +
                ",[cargoroom] = @cargoroom " +
                ",[fuelroom] = @fuelroom " +
                ",[population] = @population " +

                ",[attack] = @attack " +
                ",[defense] = @defense " +
                ",[hitpoints] = @hitpoints " +
                ",[scanRange] = @scanRange " +
                ",[damageReduction] = @damageReduction " +
                ",[max_hyper] = @max_hyper " +
                ",[max_impuls] = @max_impuls " +  


                ",shipHullsImage = @shipHullsImage" + 
                ",versionId = @versionId " +
                ",refitCounter = @refitCounter " +
                ",experience = @experience " +
                ",sentry = @sentry " +
                ",fleetId = @fleetId " +
                ",harvesting = @harvesting " +
                "where [Ships].id = @id " +
                "and [Ships].versionId < @versionId";

            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@xMove", _ship.posX);
            command.Parameters.AddWithValue("@yMove", _ship.posY);

            command.Parameters.AddWithValue("@rest_hyper", _ship.hyper);
            command.Parameters.AddWithValue("@rest_impuls", _ship.impuls);
            command.Parameters.AddWithValue("@systemId", ((object)_ship.systemid) ?? DBNull.Value);
            command.Parameters.AddWithValue("@systemX", ((object)_ship.systemx) ?? DBNull.Value);
            command.Parameters.AddWithValue("@systemY", ((object)_ship.systemy) ?? DBNull.Value);
            command.Parameters.AddWithValue("@name", _ship.NAME.Substring(0, Math.Min(_ship.NAME.Length, 63)));
            command.Parameters.AddWithValue("@hullId", _ship.hullid);
            command.Parameters.AddWithValue("@objectId", _ship.objectid);
            command.Parameters.AddWithValue("@energy", _ship.energy);
            command.Parameters.AddWithValue("@crew", _ship.crew);
            command.Parameters.AddWithValue("@cargoroom", _ship.cargoroom);
            command.Parameters.AddWithValue("@fuelroom", _ship.fuelroom);
            command.Parameters.AddWithValue("@population", _ship.population);

            command.Parameters.AddWithValue("@attack", _ship.attack);
            command.Parameters.AddWithValue("@defense", _ship.defense);
            command.Parameters.AddWithValue("@hitpoints", _ship.hitpoints);
            command.Parameters.AddWithValue("@scanRange", _ship.scanRange);
            command.Parameters.AddWithValue("@damageReduction", _ship.damagereduction);
            command.Parameters.AddWithValue("@max_hyper", _ship.max_hyper);
            command.Parameters.AddWithValue("@max_impuls", _ship.max_impuls);


            command.Parameters.AddWithValue("@shipHullsImage", _ship.shipHullsImage);
            command.Parameters.AddWithValue("@versionId", _ship.versionId);

            command.Parameters.AddWithValue("@refitCounter", _ship.refitCounter);
            command.Parameters.AddWithValue("@experience", _ship.Experience);

            command.Parameters.AddWithValue("@sentry", _ship.Sentry);
            command.Parameters.AddWithValue("@fleetId", ((object)_ship.FleetId) ?? DBNull.Value);
            command.Parameters.AddWithValue("@harvesting", _ship.Harvesting ? 1 : 0);

            command.Parameters.AddWithValue("@id", _ship.id);
            ret = command.ExecuteNonQueryAsync();
                       
            return ret;          
        }


        public void  userSaveFog(SpacegameServer.Core.User user)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "Update dbo.Users set fogVersion = @version , fogString = @fogString where id = @userId";
            SqlCommand cmd = new SqlCommand(query, connection);
   
            try
            {
                SqlParameter fogVersion = cmd.Parameters.AddWithValue("@version", user.fogVersion);
                SqlParameter fogString = cmd.Parameters.AddWithValue("@fogString", user.fogString);
                SqlParameter userId = cmd.Parameters.AddWithValue("@userId", user.id);
              
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        /*
        public  void saveShips()
        {
            SqlConnection connection = getConnection();
            connection.Open();
            string query = "[engine].shipMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Ship.createDataTable();
          

             
             Core.Core.Instance.ships.Values.Select(data => new
             {
                 data.id,
                 data.userid,
                 data.NAME,
                 data.energy,
                 data.crew,
                 data.scanRange,
                 data.attack,
                 data.defense,
                 data.hitpoints,
                 data.damagereduction,
                 data.cargoroom,
                 data.fuelroom,
                 data.max_hyper,
                 data.max_impuls,
                 data.hyper,
                 data.impuls,
                 data.colonizer,
                 data.population,
                 data.shipHullsImage,
                 data.hullid,
                 systemX = (object)data.systemx ?? DBNull.Value,
                 systemY = (object)data.systemy ?? DBNull.Value,
                 spaceX = data.posX,
                 spaceY = data.posY,
                 systemId = (object)data.systemid ?? DBNull.Value,
                 data.templateid,
                 data.refitCounter,
                 data.objectid,
                 data.versionId
             }).AddToDataTable(dataTable);
            
            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@ships", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipMergeType";                

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLogFile(ex);
            }

            return;
        }
        */

        //save specific list of ships or all ships
        public void saveShips(List<SpacegameServer.Core.Ship> ships = null)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].shipMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Ship.createDataTable();

            if (ships != null)
                ships.Select(data => data.createData()).AddToDataTable(dataTable);
            else
                Core.Core.Instance.ships.Values.Select(data => data.createData()).AddToDataTable(dataTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@ships", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;

        }
        public Task saveColony(SpacegameServer.Core.Colony colony, object commandO)
        {

            SqlCommand command = (SqlCommand)commandO;

            //ToDo: detect which field was changed, just update that field? Or make new specific update methods for the most common actions (move, combat)
            colony.versionId += 1;


            command.CommandText =
                "UPDATE [Ships] set " +
                "[hyper] = @rest_hyper " +
                ",[impuls] = @rest_impuls " +
                ",spaceX = @xMove " +
                ",spaceY = @yMove " +
                ",systemId = @systemId " +
                ",systemX = @systemX" +
                ",systemY = @systemY " +
                ",name = @name " +
                ",versionId = @versionId " +
                "where [Ships].id = @id " +
                "and [Ships].versionId < @versionId";

            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@xMove", colony.X);
            command.Parameters.AddWithValue("@yMove", colony.Y);
            /*
            command.Parameters.AddWithValue("@rest_hyper", _ship.rest_hyper);
            command.Parameters.AddWithValue("@rest_impuls", _ship.rest_impuls);
            command.Parameters.AddWithValue("@systemId", ((object)_ship.systemid) ?? DBNull.Value);
            command.Parameters.AddWithValue("@systemX", ((object)_ship.systemx) ?? DBNull.Value);
            command.Parameters.AddWithValue("@systemY", ((object)_ship.systemy) ?? DBNull.Value);
            command.Parameters.AddWithValue("@name", _ship.NAME);
            command.Parameters.AddWithValue("@versionId", _ship.versionId);
            */
            command.Parameters.AddWithValue("@id", colony.id);
            Task<int> ret = command.ExecuteNonQueryAsync();
            return ret;
        }

        public Task deleteShip(SpacegameServer.Core.Ship _ship, object commandO)
        {
            SqlCommand command = (SqlCommand)commandO;    
            command.CommandText =
                @"DELETE FROM ship " +
                "from [dbo].[Ships] as ship " +
                "where ship.id = @shipId";

            command.Parameters.AddWithValue("@shipId", _ship.id);
            Task<int> ret = command.ExecuteNonQueryAsync();
            return ret;
        }

        public  void saveShipname(SpacegameServer.Core.Ship _ship)
        {
            SqlConnection connection = GetConnection();        
            connection.Open();
            SqlCommand command = connection.CreateCommand();              
            command.Connection = connection;
              
            try
            {
                command.CommandText =
                    "UPDATE [Ships] set " +
                    "name = @name" +
                    "where [Ships].id = @id ";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(command.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLog(ex);
            }            

            return;
        }

        public  void saveShipModules(SpacegameServer.Core.Ship _ship)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].shipModulesMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.ShipModule.createDataTable();

            _ship.shipModules.Select(data => new
            {
                data.shipId,
                data.moduleId,
                data.posX,
                data.posY,
                data.hitpoints,
                data.active
            }).AddToDataTable(dataTable);

            try
            {
                _ship.shipModulesVersionId += 1;

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@shipModules", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipModulesMergeType";

                SqlParameter shipId = new SqlParameter();
                shipId.ParameterName = "@shipId";
                shipId.Value = _ship.id;
                cmd.Parameters.Add(shipId);

                SqlParameter shipModulesVersionId = new SqlParameter();
                shipModulesVersionId.ParameterName = "@shipModulesVersionId";
                shipModulesVersionId.Value = _ship.shipModulesVersionId;
                cmd.Parameters.Add(shipModulesVersionId);
                

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public  void saveShipGoods(SpacegameServer.Core.Ship _ship)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].shipStockMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.shipStock.createDataTable();

            _ship.goods.Select(data => new
            {
                data.shipId,
                data.goodsId,
                data.amount               
            }).AddToDataTable(dataTable);

            try
            {
                _ship.shipStockVersionId += 1;

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@shipStocks", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipStockMergeType";

                SqlParameter shipId = new SqlParameter();
                shipId.ParameterName = "@shipId";
                shipId.Value = _ship.id;
                cmd.Parameters.Add(shipId);

                SqlParameter shipStockVersionId = new SqlParameter();
                shipStockVersionId.ParameterName = "@shipStockVersionId";
                shipStockVersionId.Value = _ship.shipStockVersionId;
                cmd.Parameters.Add(shipStockVersionId);
                
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLog(ex);
            }
            return;
        }

        public void SaveShipTranscensionTurn(SpacegameServer.Core.ShipTranscension transcension)
        {
            SaveShipTranscensionTurnAsync(transcension).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }


        public SqlCommand SaveShipTranscensionTurnCmd(SpacegameServer.Core.ShipTranscension transcension,
            SqlConnection connection)
        {
            string query = "[engine].shipTranscensionMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@shipId", transcension.shipId);
                tvpParam.SqlDbType = SqlDbType.Int;

                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@finishedInTurn", transcension.finishedInTurn);
                tvpParam.SqlDbType = SqlDbType.Int;
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveShipTranscensionTurnAsync(SpacegameServer.Core.ShipTranscension transcension)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveShipTranscensionTurnCmd(transcension, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }




        public void saveShipTranscensionUsers(SpacegameServer.Core.Ship ship)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].shipTranscensionUsersMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.ShipTranscensionUser.createDataTable();
            /*
            _ship.shipTranscension.shipTranscensionUsers.Select(data => new
            {
                data.shipId,
                data.userId,
                data.helpCount
            }).AddToDataTable(dataTable);
            */
            ship.shipTranscension.shipTranscensionUsers.AddToDataTable(dataTable);

            try
            {
                ship.shipModulesVersionId += 1;

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@TranscensionUsers", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].shipTranscensionUsersType";

                SqlParameter shipId = new SqlParameter();
                shipId.ParameterName = "@shipId";
                shipId.Value = ship.id;
                cmd.Parameters.Add(shipId);

                SqlParameter shipModulesVersionId = new SqlParameter();
                shipModulesVersionId.ParameterName = "@shipModulesVersionId";
                shipModulesVersionId.Value = ship.shipModulesVersionId;
                cmd.Parameters.Add(shipModulesVersionId);


                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public  void saveColonyGoods(SpacegameServer.Core.Colony colony)
        {
            if (colony == null)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeToLog("saveColonyGoods NULL");
                return;
            };

            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].colonyStockMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Colony.createDataTableGoods();
            
            colony.goods.Select(data => new
            {
                data.colonyId,
                data.goodsId,
                data.amount
            }).AddToDataTable(dataTable);
            
            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonyStocks", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyStockMergeType";

                SqlParameter colonyId = new SqlParameter();
                colonyId.ParameterName = "@colonyId";
                colonyId.Value = colony.id;
                cmd.Parameters.Add(colonyId);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }
            return;
        }

        public void saveColoniesGoods()
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].coloniesStockMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.Colony.createDataTableGoods();
            
            Core.Core.Instance.colonies.Values.SelectMany(e => e.goods).Select(data => new
            {
                data.colonyId,
                data.goodsId,
                data.amount
            }).AddToDataTable(dataTable);
            
            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@colonyStocks", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].colonyStockMergeType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }
            return;
        }

        public Task insertDirection(SpacegameServer.Core.shipDirection _shipDirection, object commandO)
        {
            SqlCommand command = (SqlCommand)commandO;
            command.CommandText =
                 @"insert into [ShipsDirection] (shipId, moveDirection) select Ships.id, @direction  " + 
                    "from dbo.Ships where Ships.id =  @shipId";
            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@shipId", _shipDirection.shipId);
            command.Parameters.AddWithValue("@direction", _shipDirection.moveDirection);            
           
            Task<int> ret = command.ExecuteNonQueryAsync();
            return ret;
        }

        public Task mergeShipRefit(SpacegameServer.Core.shipRefit _shipRefit, object commandO)
        {
            SqlCommand command = (SqlCommand)commandO;

            command.CommandText =
                 @"MERGE  ShipRefit " +
                    "USING (select @shipId as shipId ,@refitCounter as refitCounter) AS newShipRefit " +
                    "ON (ShipRefit.shipId = newShipRefit.shipId)	" +
                    "WHEN MATCHED AND newShipRefit.refitCounter > 0 " +
		                "THEN UPDATE SET ShipRefit.refitCounter = newShipRefit.refitCounter " +
                    "WHEN MATCHED AND newShipRefit.refitCounter = 0 " +
		                "THEN DELETE " +
                    "WHEN NOT MATCHED AND newShipRefit.refitCounter != 0 THEN " +
	                    "INSERT (shipId,refitCounter) " +
		                "VALUES (newShipRefit.shipId,newShipRefit.refitCounter);";
            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@shipId", _shipRefit.shipId);
            command.Parameters.AddWithValue("@refitCounter", _shipRefit.refitCounter);

            Task<int> ret = command.ExecuteNonQueryAsync();
            return ret;
        }

        public  void RefitDecrement()
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "DELETE FROM ShipRefit WHERE refitCounter < 2; Update  ShipRefit SET refitCounter = refitCounter - 1;";
            SqlCommand cmd = new SqlCommand(query, connection);
          
            try
            {                
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }


        public void saveDiplomaticEntities(List<Core.DiplomaticRelation> relations)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].DiplomaticEntityStateMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.DiplomaticRelation.createDataTable();
            relations.Select(data => data.createData()).AddToDataTable(dataTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@entityStates", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].DiplomaticEntityStateType";               

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveCommNodeUsers(List<Core.CommNodeUser> users)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].CommNodeUsersMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.CommNodeUser.createDataTable();
            users.Select(data => data.createData()).AddToDataTable(dataTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@commNodeUsers", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].CommNodeUsersType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void DeleteCommNodeUsers(Core.CommunicationNode node, Core.User user)
        {
            /*
            SqlConnection connection = getConnection();
            connection.Open();
            string query = "DELETE FROM CommNodeUsers WHERE commNodeId = @commNodeId and userId = @userId;";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {
                cmd.Parameters.AddWithValue("@CommNodeUsers", node.id);
                cmd.Parameters.AddWithValue("@allianceId", user.id);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));           
            }
            catch (Exception ex)
            {                
                Core.Core.Instance.writeExceptionToLogFile(ex);
            }    
            */
            // Todo: refactor all sql commands so that they look like this one
            DeleteCommNodeUsersAsync(node, user).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        private SqlCommand DeleteCommNodeUsersCmd(Core.CommunicationNode node, Core.User user, SqlConnection connection)
        {
            string query = "DELETE FROM CommNodeUsers WHERE commNodeId = @commNodeId and userId = @userId;";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {
                cmd.Parameters.AddWithValue("@commNodeId", node.id);
                cmd.Parameters.AddWithValue("@userId", user.id);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task DeleteCommNodeUsersAsync(Core.CommunicationNode node, Core.User user)
        {
            try 
            { 
                using (var connection = GetConnection())
                using (var cmd = DeleteCommNodeUsersCmd(node, user, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public async void closeSaveCommNode(List<Task> _tasks, SqlConnection connection, Core.CommunicationNode node)
        {
            try
            {
                await Task.WhenAll(_tasks);
                connection.Close();
                //Console.WriteLine(" records are written to database.");

                //and save to DB:
                var toSave = new List<Core.CommNodeUser>();
                toSave = node.commNodeUsers.Values.ToList();
                saveCommNodeUsers(toSave);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

        }

        /// <summary>
        /// Saves the commNode. CommNodeUsers are saved in the closeSaveCommNode method after saving is finished
        /// </summary>
        /// <param name="node"></param>
        public void saveCommNode(Core.CommunicationNode node) {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].CommNodeMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            try
            {
                cmd.Parameters.AddWithValue("@id", node.id);
                cmd.Parameters.AddWithValue("@userId", node.owner);
                cmd.Parameters.AddWithValue("@name", node.name);
                cmd.Parameters.AddWithValue("@unformattedName", node.unformattedName);

                cmd.Parameters.AddWithValue("@positionX", node.positionX);
                cmd.Parameters.AddWithValue("@positionY", node.positionY);
                cmd.Parameters.AddWithValue("@systemX", node.systemX);
                cmd.Parameters.AddWithValue("@systemY", node.systemY);

                cmd.Parameters.AddWithValue("@connectionType", node.connectionType);
                cmd.Parameters.AddWithValue("@connectionId", node.connectionId);
                cmd.Parameters.AddWithValue("@activ", node.activ);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeSaveCommNode(asynctasks, connection, node));

            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveCommNodeMessage(Core.CommunicationNodeMessage message) {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].CommNodeMessageMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            try
            {
                cmd.Parameters.AddWithValue("@messageId", message.id);
                cmd.Parameters.AddWithValue("@sender", message.sender);
                cmd.Parameters.AddWithValue("@commNodeId", message.commNodeId);
                cmd.Parameters.AddWithValue("@header", message.headline);
                cmd.Parameters.AddWithValue("@body", message.messageBody);
               
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void saveCombat(Core.Combat message)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = "[engine].combatInsert";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var combatTable = Core.Combat.createDataTable();
            message.createData().AddObjectToDataTable(combatTable);

            var combatRounds = Core.CombatRound.createDataTable();
            message.CombatRounds.Select(data => data.createData()).AddToDataTable(combatRounds);

            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@combat", combatTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].combatInsertType";

                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@combatRounds", combatRounds);
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.TypeName = "[engine].combatRoundsInsertType";

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void updateCombatIsRead(Core.Combat message)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.Connection = connection;

            try
            {
                command.CommandText =
                    "UPDATE [dbo].[Combat] set " +
                    "defenderHasRead = 1 " +
                    "where [dbo].[Combat].[combatId] = @CombatId ";

                command.Parameters.AddWithValue("@CombatId", message.CombatId);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(command.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void updateAllMessageRead(int messageType, int userId)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.Connection = connection;


            try
            {
                string query = "[dbo].[setMessageRead]";
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = query;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                command.Parameters.Add(param1);

                SqlParameter messageTypeP = new SqlParameter();
                messageTypeP.SqlDbType = SqlDbType.Int;
                messageTypeP.ParameterName = "@messageType";
                messageTypeP.Value = messageType;
                command.Parameters.Add(messageTypeP);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(command.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;

        }

        public Task insertUserStarMap(SpacegameServer.Core.UserStarMap starMap, object commandO)
        {
            SqlCommand command = (SqlCommand)commandO;

            command.CommandText =
                 @"insert into [UserStarMap]
	                select distinct
		                newUserStar.userId, newUserStar.starId
	                from (select @userId as userId, @starId as starId) as newUserStar
	                left join [UserStarMap] as alreadyInserted
		                on alreadyInserted.userId = newUserStar.userId
		                and alreadyInserted.starId = newUserStar.starId
	                where alreadyInserted.starId is null";
            command.CommandType = System.Data.CommandType.Text;
            command.Parameters.AddWithValue("@userId", starMap.userid);
            command.Parameters.AddWithValue("@starId", starMap.starid);

            Task<int> ret = command.ExecuteNonQueryAsync();
            return ret;
        }

        public  string combat(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _defShip, SpacegameServer.Core.Field _destination, Tuple<byte, byte> _systemCoords)
        {
            string combatLog = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                SqlTransaction transaction;

                // Start a local transaction.
                transaction = connection.BeginTransaction("CombatTransaction");

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                command.Transaction = transaction;
                             
                try
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.CommandText = "[dbo].[Combat2]";

                    command.Parameters.AddWithValue("@shipId", _ship.id);
                    command.Parameters.AddWithValue("@defShipId", _defShip.id);
                    command.Parameters.AddWithValue("@userId", _ship.userid);

                    command.Parameters.Add("@destination", SqlDbType.NVarChar);
                    command.Parameters["@destination"].Value = _destination.toWKTString();

                    command.Parameters.AddWithValue("@systemId", _ship.systemId);
                    command.Parameters.AddWithValue("@systemX", _systemCoords == null ? DBNull.Value : (object)_systemCoords.Item1);
                    command.Parameters.AddWithValue("@systemY", _systemCoords == null ? DBNull.Value : (object)_systemCoords.Item2);


                    command.Parameters.Add("@result", SqlDbType.Int);
                    command.Parameters["@result"].Direction = ParameterDirection.Output;
                    command.Parameters.Add("@combatLog", SqlDbType.Xml);
                    command.Parameters["@combatLog"].Direction = ParameterDirection.Output;
                  
                    command.ExecuteNonQuery();

                    combatLog = command.Parameters["@combatLog"].Value.ToString();
                    int result = 0;
                    Int32.TryParse(command.Parameters["@result"].Value.ToString(),out result);                    

                    // Attempt to commit the transaction.
                    transaction.Commit();                
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("Commit Exception Type: {0}", ex.GetType());
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);

                    // Attempt to roll back the transaction.
                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        // This catch block will handle any errors that may have occurred
                        // on the server that would cause the rollback to fail, such as
                        // a closed connection.
                        //Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                        //Console.WriteLine("  Message: {0}", ex2.Message);
                        Core.Core.Instance.writeExceptionToLog(ex2);
                    }
                }
            }

            return combatLog;
        }

        public  bool writeMovement(SpacegameServer.Core.Ship _ship, SpacegameServer.Core.Ship _enemyship, int _direction)
        {
            using (SqlConnection connection = GetConnection())
            {
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                SqlTransaction transaction;

                // Start a local transaction.
                transaction = connection.BeginTransaction("MoveTransaction");

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                command.Transaction = transaction;

                try
                {
                    command.CommandText =
                        "UPDATE [Ships] set " +
                        "spaceX = @xMove , spaceY = @yMove " +
                        ",[hyper] = @rest_hyper " +
                        ",[impuls] = @rest_impuls " +
                        ",systemId = @systemId " +
                        ",systemX = @systemX" +
                        ",systemY = @systemY " +
                        "where [Ships].id = @id";
                    
                    command.CommandType = System.Data.CommandType.Text;
                    command.Parameters.AddWithValue("@xMove", _ship.posX);
                    command.Parameters.AddWithValue("@yMove", _ship.posY);

                    command.Parameters.AddWithValue("@rest_hyper", _ship.hyper);
                    command.Parameters.AddWithValue("@rest_impuls", _ship.impuls);
                    command.Parameters.AddWithValue("@systemId", ((object)_ship.systemid) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@systemX", ((object)_ship.systemx) ?? DBNull.Value);
                    command.Parameters.AddWithValue("@systemY", ((object)_ship.systemy) ?? DBNull.Value);

                    command.Parameters.AddWithValue("@id", _ship.id);
                    command.ExecuteNonQuery();


                    command.Parameters.Clear();
                    command.CommandText =
                        "insert into [ShipsDirection] (shipId, moveDirection) select @shipId, @direction";
                    command.CommandType = System.Data.CommandType.Text;
                    command.Parameters.AddWithValue("@shipId", _ship.id);
                    command.Parameters.AddWithValue("@direction", _direction);
                    command.ExecuteNonQuery();

                    if (_enemyship != null)
                    {
                        //ToDo: combat may lead to one or both (or none) ships to be destroyed.  
                        //change cmd text to reflect this
                        command.CommandText =
                        "UPDATE ships set x = @posX where id = @id";

                        command.CommandType = System.Data.CommandType.Text;
                        command.Parameters.AddWithValue("@posX", _enemyship.posX);
                        command.Parameters.AddWithValue("@id", _enemyship.id);
                        command.ExecuteNonQuery();
                    }
                    // Attempt to commit the transaction.                    
                    transaction.Commit();
                    //Console.WriteLine("Both records are written to database.");
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("Commit Exception Type: {0}", ex.GetType());
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);

                    // Attempt to roll back the transaction.
                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        // This catch block will handle any errors that may have occurred
                        // on the server that would cause the rollback to fail, such as
                        // a closed connection.
                        //Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                        //Console.WriteLine("  Message: {0}", ex2.Message);
                        Core.Core.Instance.writeExceptionToLog(ex2);
                    }
                }
            }

            return true;
        }

        public  void colonize(SpacegameServer.Core.Ship _ship, string _newName, out int colonyId, out string xml)
        {
            colonyId = -3;
            xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                SqlTransaction transaction;

                // Start a local transaction.
                transaction = connection.BeginTransaction("ColonizationTransaction");

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                command.Transaction = transaction;

                try
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.CommandText = "[dbo].[Colonizing]";

                    command.Parameters.AddWithValue("@shipId", _ship.id);
                    command.Parameters.AddWithValue("@userId", _ship.userid);

                    command.Parameters.Add("@newname", SqlDbType.NVarChar);
                    command.Parameters["@newname"].Value = _newName;

                    command.Parameters.Add("@colonyId", SqlDbType.Int);
                    command.Parameters["@colonyId"].Direction = ParameterDirection.Output;
                    command.Parameters.Add("@xml", SqlDbType.Xml);
                    command.Parameters["@xml"].Direction = ParameterDirection.Output;

                    command.ExecuteNonQuery();

                    Int32.TryParse(command.Parameters["@colonyId"].Value.ToString(), out colonyId);
                    xml = command.Parameters["@xml"].Value.ToString();

                    transaction.Commit();
                }
                catch (Exception ex)
                {                   
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);

                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        // This catch block will handle any errors that may have occurred
                        // on the server that would cause the rollback to fail, such as
                        // a closed connection.
                        //Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                        //Console.WriteLine("  Message: {0}", ex2.Message);
                        Core.Core.Instance.writeExceptionToLog(ex2);
                    }

                }
            }

            return;
        }

        public  int createShip(int userid)
        {
            int shipId = 0;
            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();                                         
                command.Connection = connection;
            
                try
                {                    
                    command.CommandText = "INSERT INTO dbo.[Ships]([userId], templateId) VALUES(@userId, 1); SELECT CAST(scope_identity() AS int)";                   
                    command.Parameters.AddWithValue("@userId", userid);
                                      
                    shipId = (int)command.ExecuteScalar();                             
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);                  
                }
            }

            return shipId;
        }

        public  void buildShip(int _shipTemplateId, int _userId, int _colonyId, bool fastBuild, ref string _xml, ref int _shipId)
        {            
            _xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                SqlTransaction transaction;

                // Start a local transaction.
                transaction = connection.BeginTransaction("ColonizationTransaction");

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                command.Transaction = transaction;

                try
                {
                    

                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    if (fastBuild)
                        command.CommandText = "[dbo].[buildShipFast]";
                    else
                        command.CommandText = "[dbo].[buildShip]";

                    SqlParameter param = new SqlParameter("@shipTemplateId", SqlDbType.Int);
                    param.Value = _shipTemplateId;
                    command.Parameters.Add(param);

                    SqlParameter param2 = new SqlParameter("@userId", SqlDbType.Int);
                    param2.Value = _userId;
                    command.Parameters.Add(param2);

                    SqlParameter param3 = new SqlParameter("@colonyId", SqlDbType.Int);
                    param3.Value = _colonyId;
                    command.Parameters.Add(param3);

                    SqlParameter param4 = new SqlParameter();
                    param4.Direction = ParameterDirection.Output;
                    param4.ParameterName = "@output1";
                    param4.Value = 0;
                    command.Parameters.Add(param4);

                    SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                    param5.Direction = ParameterDirection.Output;
                    command.Parameters.Add(param5);


                    command.ExecuteNonQuery();

                    Int32.TryParse(command.Parameters["@output1"].Value.ToString(), out _shipId);
                    _xml = command.Parameters["@xml"].Value.ToString();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);

                    try
                    {
                        transaction.Rollback();
                    }
                    catch (Exception ex2)
                    {
                        // This catch block will handle any errors that may have occurred
                        // on the server that would cause the rollback to fail, such as
                        // a closed connection.
                        //Console.WriteLine("Rollback Exception Type: {0}", ex2.GetType());
                        //Console.WriteLine("  Message: {0}", ex2.Message);
                        Core.Core.Instance.writeExceptionToLog(ex2);
                    }

                }
            }

            return;
        }

        public  void buildBuilding(int userId, int colonyId, int tileNr, int buildingId, ref string xml)
        {
            xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand cmd = connection.CreateCommand();
                cmd.Connection = connection;
               
                try
                {

                    cmd.CommandType = System.Data.CommandType.StoredProcedure;                 
                    cmd.CommandText = "[dbo].[Build]";;

                    SqlParameter param1 = new SqlParameter("@userId", SqlDbType.Int);
                    // param1.ParameterName = "@userId";
                    param1.Value = userId;
                    cmd.Parameters.Add(param1);

                    SqlParameter param2 = new SqlParameter();
                    param2.ParameterName = "@colonyId";
                    param2.Value = colonyId;
                    cmd.Parameters.Add(param2);

                    SqlParameter param3 = new SqlParameter();
                    param3.ParameterName = "@tileNr";
                    param3.Value = tileNr;
                    cmd.Parameters.Add(param3);

                    SqlParameter param4 = new SqlParameter();
                    param4.ParameterName = "@buildingId";
                    param4.Value = buildingId;
                    cmd.Parameters.Add(param4);

                    SqlParameter param5 = new SqlParameter();
                    param5.ParameterName = "@output1";
                    param5.Value = 0;
                    cmd.Parameters.Add(param5);

                    SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                    param6.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(param6);

                    cmd.ExecuteNonQuery();

                    xml = cmd.Parameters["@xml"].Value.ToString();
                   
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);                    
                }
            }

            return;
        }

        public  void buildModules(int userId, int colonyId, ref string xml)
        {
            xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand cmd = connection.CreateCommand();
                cmd.Connection = connection;

                try
                {

                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "[dbo].[doColonyShipModuleProduction]"; ;
                    
                    SqlParameter param1 = new SqlParameter();
                    param1.ParameterName = "@userId";
                    param1.Value = userId;
                    cmd.Parameters.Add(param1);

                    SqlParameter param2 = new SqlParameter();
                    param2.ParameterName = "@colonyId";
                    param2.Value = colonyId;
                    cmd.Parameters.Add(param2);

                    cmd.ExecuteNonQuery();

                    

                }
                catch (Exception ex)
                {
                    //Console.WriteLine("Core.Instance.dataConnection.buildModules  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

            return;
        }

        public  void DeconstructBuilding(int userId,int buildingId)
        {

            DeconstructBuildingAsync(userId, buildingId).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
            /*
            using (SqlConnection connection = getConnection())
            {
                connection.Open();
                string query = @"delete from  [colonyBuildings]
	            where	userId = @userId
		            and	id = @buildingId;";
                SqlCommand cmd = new SqlCommand(query, connection);

                try
                {
                    SqlParameter tvpParam = cmd.Parameters.AddWithValue("@userId", userId);
                    SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@buildingId", buildingId);

                    List<Task> asynctasks = new List<Task>();
                    asynctasks.Add(cmd.ExecuteNonQueryAsync());
                    Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLogFile(ex);
                }
            }
            return;
            */
        }

        public SqlCommand DeconstructBuildingCmd(int userId, int buildingId,
            SqlConnection connection)
        {

            string query = @"delete from  [colonyBuildings]
	            where	userId = @userId
		            and	id = @buildingId;";
            SqlCommand cmd = new SqlCommand(query, connection);
            
            try
            {
                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@userId", userId);
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@buildingId", buildingId);
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task DeconstructBuildingAsync(int userId, int buildingId)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = DeconstructBuildingCmd(userId, buildingId, connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }
 
        public void doResearch(int userId, int researchId, ref string xml)
        {
            xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand cmd = connection.CreateCommand();
                cmd.Connection = connection;

                try
                {

                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandText = "[dbo].[setUserResearch]";                   

                    SqlParameter param1 = new SqlParameter();
                    param1.ParameterName = "@userId";
                    param1.Value = userId;
                    cmd.Parameters.Add(param1);

                    SqlParameter param2 = new SqlParameter();
                    param2.ParameterName = "@researchId";
                    param2.Value = researchId;
                    cmd.Parameters.Add(param2);

                    SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                    param6.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(param6);

                    cmd.ExecuteNonQuery();

                    xml = cmd.Parameters["@xml"].Value.ToString();

                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

            return;
        }

        public  void transfer(int userId,string transferXML, ref string _xml)
        {
            _xml = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();                
                command.Connection = connection;

                try
                {
                    command.CommandText = "[dbo].[transferGoods]";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@userId";
                    userIdParameter.Value = userId;
                    command.Parameters.Add(userIdParameter);

                    SqlParameter xmlParameter = new SqlParameter();
                    xmlParameter.ParameterName = "@xmlData";
                    xmlParameter.Value = transferXML;
                    command.Parameters.Add(xmlParameter);

                    System.Xml.XmlReader xmlr = command.ExecuteXmlReader();
                    xmlr.Read();

                    while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                    {
                        _xml += xmlr.ReadOuterXml();
                    }

                    connection.Close();

                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);                    
                }
            }

            return;
        }

        public void acceptTrade(int userId, int soIdIdInt, int soTypeInt, int tradeOfferIdInt ,ref string output)
        {
            output = "";

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.Connection = connection;

                try
                {
                    command.CommandText = "[dbo].[acceptTradeOffer]";
                    command.CommandType = CommandType.StoredProcedure;
                   
                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@userId";
                    userIdParameter.Value = userId;
                    command.Parameters.Add(userIdParameter);

                    SqlParameter accepterSpaceObjectIdParameter = new SqlParameter();
                    accepterSpaceObjectIdParameter.ParameterName = "@accepterSpaceObjectId";
                    accepterSpaceObjectIdParameter.Value = soIdIdInt;
                    command.Parameters.Add(accepterSpaceObjectIdParameter);

                    SqlParameter objectTypeIdParameter = new SqlParameter();
                    objectTypeIdParameter.ParameterName = "@objectType";
                    objectTypeIdParameter.Value = soTypeInt;
                    command.Parameters.Add(objectTypeIdParameter);

                    SqlParameter tradeOfferIdParameter = new SqlParameter();
                    tradeOfferIdParameter.ParameterName = "@tradeOfferId";
                    tradeOfferIdParameter.Value = tradeOfferIdInt;
                    command.Parameters.Add(tradeOfferIdParameter);

                    SqlParameter param6 = new SqlParameter("@retValue", SqlDbType.Int);
                    param6.Direction = ParameterDirection.Output;
                    command.Parameters.Add(param6);

                    command.ExecuteNonQuery();
                    output = param6.Value.ToString();

                    connection.Close();

                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
            }

            return;
        }

        public void saveStarmap(SpacegameServer.Core.SystemMap starMap)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.Connection = connection;

            try
            {                
                command.CommandText =
                    "UPDATE [StarMap] set " +
                    "settled = @settled " +
                    ",startingRegion = @startingRegion " +
                    "where [StarMap].[id] = @id ";

                command.Parameters.AddWithValue("@settled", starMap.settled);
                command.Parameters.AddWithValue("@startingRegion", (object)starMap.startingRegion ?? DBNull.Value);
                command.Parameters.AddWithValue("@id", starMap.id);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(command.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void insertGalacticEvent(Core.GalacticEvents galacticEvent)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = @"insert into [GalacticEvents] 
            ([id],[eventType],eventDatetime, [int1],[int2],[int3],[int4],[int5],[int6],[string1],[string2],[string3],[string4],[string5],[string6],[string7],[string8]) 
            VALUES  (@id, @eventType,@eventDatetime,
            @int1, @int2, @int3, @int4, @int5, @int6,
            @string1, @string2, @string3, @string4, @string5, @string6, @string7, @string8)";

            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {
                cmd.Parameters.AddWithValue("@id", galacticEvent.Id);
                cmd.Parameters.AddWithValue("@eventType", galacticEvent.EventType);

                // Datetime to be saved has to be in local time, since the sql server will
                cmd.Parameters.AddWithValue("@eventDatetime", galacticEvent.EventDatetime);
                //SqlParameter EventDatetime = new SqlParameter("@eventDatetime", SqlDbType.DateTime);
                //EventDatetime.Value = galacticEvent.EventDatetime.ToString("yyyy-MM-ddThh:mm:ss");
                //cmd.Parameters.Add(EventDatetime);
                //SqlParameter EventDatetime = cmd.Parameters.AddWithValue("@eventDatetime", galacticEvent.EventDatetime.ToString("s"));
                //var x = EventDatetime.Value;


                cmd.Parameters.AddWithValue("@int1", (object)galacticEvent.Int1 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@int2", (object)galacticEvent.Int2 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@int3", (object)galacticEvent.Int3 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@int4", (object)galacticEvent.Int4 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@int5", (object)galacticEvent.Int5 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@int6", (object)galacticEvent.Int6 ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@string1", (object)galacticEvent.String1 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string2", (object)galacticEvent.String2 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string3", (object)galacticEvent.String3 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string4", (object)galacticEvent.String4 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string5", (object)galacticEvent.String5 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string6", (object)galacticEvent.String6 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string7", (object)galacticEvent.String7 ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@string8", (object)galacticEvent.String8 ?? DBNull.Value);

                
                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));
                /*
                cmd.ExecuteNonQuery();
                 * */
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void insertChatMessage(SpacegameServer.Core.ChatLog chatMessage)
        {
            SqlConnection connection = GetConnection();
            connection.Open();
            string query = @"insert into [ChatLog] 
            ([id],[userId],chatMessage,eventDatetime) 
            VALUES  (@id, @userId, @chatMessage,  @eventDatetime)";

            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.Text;

            try
            {
                cmd.Parameters.AddWithValue("@id", chatMessage.id);
                cmd.Parameters.AddWithValue("@userId", chatMessage.userId);
                cmd.Parameters.AddWithValue("@chatMessage", chatMessage.chatMessage);
                cmd.Parameters.AddWithValue("@eventDatetime", chatMessage.sendingdate);

                List<Task> asynctasks = new List<Task>();
                asynctasks.Add(cmd.ExecuteNonQueryAsync());
                Task.Factory.StartNew(() => closeConnectionOnFinish(asynctasks, connection));

            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return;
        }

        public void InsertUserHistory()
        {
            InsertUserHistoryAsync().
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand InsertUserHistoryCmd(
            SqlConnection connection)
        {

            string query = "[engine].UsersHistoryInsert";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;

            var dataTable = Core.UsersHistory.createDataTable();

            int turnId = Core.Core.Instance.GalaxyMap.TurnNumber;

            Core.Core.Instance.users.Values.Select(user => new
            {
                userId = user.id,
                turnId,
                user.researchPoints,

                user.popVicPoints,
                user.researchVicPoints,
                user.goodsVicPoints,
                user.shipVicPoints,
                user.overallVicPoints,
                user.overallRank
            }
            ).AddToDataTable(dataTable);

            try
            {

                SqlParameter tvpParam = cmd.Parameters.AddWithValue("@userData", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].UsersHistoryInsertType";
            }
            catch (Exception ex)
            {
                //Console.WriteLine("  Message: {0}", ex.Message);
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task InsertUserHistoryAsync()
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = InsertUserHistoryCmd(connection))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }



        public void SaveMessage(Core.MessageHead messageHead)
        {
            SaveMessageAsync(messageHead).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand SaveMessageCmd(
            SqlConnection connection,
            Core.MessageHead messageHead)
        {

            string query = "[engine].MessageMerge";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;


            var MessageParticipantsDataTable = Core.MessageParticipants.createDataTable();
            messageHead.messageParticipants.Select(data => data.createData()).AddToDataTable(MessageParticipantsDataTable);

            var MessageBodyDataTable = Core.MessageBody.createDataTable();
            messageHead.messages.Select(data => data.createData()).AddToDataTable(MessageBodyDataTable);

            try
            {
                SqlParameter tvpParam1 = cmd.Parameters.AddWithValue("@messageId", messageHead.id);
                SqlParameter tvpParam2 = cmd.Parameters.AddWithValue("@sender", messageHead.sender);
                SqlParameter tvpParam3 = cmd.Parameters.AddWithValue("@header", messageHead.headline);
                SqlParameter tvpParam4 = cmd.Parameters.AddWithValue("@dateTime", messageHead.sendingdate);

                SqlParameter tvpParam6 = cmd.Parameters.AddWithValue("@messageParticipants", MessageParticipantsDataTable);
                tvpParam6.SqlDbType = SqlDbType.Structured;
                tvpParam6.TypeName = "[engine].[MessageParticipantType]";

                SqlParameter tvpParam7 = cmd.Parameters.AddWithValue("@messageParts", MessageBodyDataTable);
                tvpParam7.SqlDbType = SqlDbType.Structured;
                tvpParam7.TypeName = "[engine].[MessageBodyType]";
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveMessageAsync(Core.MessageHead messageHead)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveMessageCmd(connection, messageHead))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

        public void SaveMessageparticipant(Core.MessageParticipants messageParticipant)
        {
            SaveMessageParticipantAsync(messageParticipant).
                ContinueWith(t => Core.Core.Instance.writeExceptionToLog(t.Exception),
                    TaskContinuationOptions.OnlyOnFaulted);
        }

        public SqlCommand SaveMessageParticipantCmd(
            SqlConnection connection,
            Core.MessageParticipants messageParticipant)
        {

            string query = "[engine].[MessageParticipantMerge]";
            SqlCommand cmd = new SqlCommand(query, connection);
            cmd.CommandType = CommandType.StoredProcedure;


            var MessageParticipantsDataTable = Core.MessageParticipants.createDataTable();
            messageParticipant.createData().AddObjectToDataTable(MessageParticipantsDataTable);

            try
            {
                SqlParameter tvpParam6 = cmd.Parameters.AddWithValue("@messageParticipants", MessageParticipantsDataTable);
                tvpParam6.SqlDbType = SqlDbType.Structured;
                tvpParam6.TypeName = "[engine].[MessageParticipantType]";
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }

            return cmd;
        }

        private async Task SaveMessageParticipantAsync(Core.MessageParticipants messageParticipant)
        {
            try
            {
                using (var connection = GetConnection())
                using (var cmd = SaveMessageParticipantCmd(connection, messageParticipant))
                {
                    connection.Open();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                Core.Core.Instance.writeExceptionToLog(ex);
            }
        }

    }
}
