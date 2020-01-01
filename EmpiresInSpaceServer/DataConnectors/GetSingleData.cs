using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.DataConnectors
{
    public partial class SqlConnector
    {
        /*
        public void getColony(SpacegameServer.Core.Core _core, int _colonyId)
        {
            SqlConnection connection = getConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[userid]
                      ,[NAME]
                      ,[storage]
                      ,[scanrange]
                      ,[starid]
                      ,[planetid]
                      ,[shipinconstruction]
                      ,[constructionduration]
                      ,[population]
                      ,[construction]
                      ,[turnsofrioting]
                      ,TurnsOfSiege
                FROM [engine].[v_Colonies] where [id] = " + _colonyId.ToString(),
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        int userid = reader.GetInt32(1);
                        if (_core.users[userid] == null) continue;
                        SpacegameServer.Core.Colony colony = new SpacegameServer.Core.Colony(id);
                        colony.setLock();
                        colony.userId = userid;
                        colony.name = reader.GetString(2);
                        colony.storage = reader.GetInt16(3);
                        colony.scanRange = reader.GetByte(4);
                        colony.starId = reader.GetInt32(5);
                        colony.planetId = reader.GetInt32(6);
                        colony.shipinconstruction = reader.IsDBNull(7) ? null : (System.Nullable<Int32>)reader.GetInt32(7);
                        colony.constructionDuration = reader.GetInt32(8);
                        colony.population = reader.GetInt64(9);
                        colony.construction = reader.GetInt32(10);
                        colony.turnsOfRioting = reader.GetInt16(11);
                        colony.TurnsOfSiege = reader.GetInt16(12);
                        colony.goods = new List<Core.colonyStock>();

                        _core.colonies[id] = colony;
                        _core.addColonyToField(colony);
                        _core.users[userid].colonies.Add(colony);
                        colony.planet = _core.planets[colony.planetId];

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", e.Source);
                        _core.writeExceptionToLogFile(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }
         * */
    }
}
