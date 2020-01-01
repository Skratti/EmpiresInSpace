using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.DataConnectors
{
    public partial class SqlConnector
    {
        public  void userTurnSummary(int _userId)
        {
          
            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                string query = "[dbo].[newTurnByUser]";
                command.CommandText = query;
                command.CommandType = CommandType.StoredProcedure;

                try
                {
                                       
                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@userId";
                    userIdParameter.Value = _userId.ToString();
                    command.Parameters.Add(userIdParameter);

                    command.ExecuteNonQuery();
                    connection.Close();
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);                   
                }
                finally
                {
                    // Close the connection
                    if (connection != null)
                    {
                        connection.Close();
                    }
                }
            }

            return;
        }

        public  void TurnSummary()
        {

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                string query = "[dbo].[newTurnWorker]";
                command.CommandText = query;
                command.CommandType = CommandType.StoredProcedure;

                try
                {

                    /*
                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@nextTurn";
                    userIdParameter.Value = DBNull.Value;
                    userIdParameter.Direction = ParameterDirection.Output;
                    command.Parameters.Add(userIdParameter);
                    */
                    command.ExecuteNonQuery();
                    connection.Close();
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
                finally
                {
                    // Close the connection
                    if (connection != null)
                    {
                        connection.Close();
                    }
                }
            }

            return;
        }

        public void TurnSummaryRank()
        {

            using (SqlConnection connection = GetConnection())
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();

                // Must assign both transaction object and connection
                // to Command object for a pending local transaction
                command.Connection = connection;
                string query = "[dbo].[turnSummaryUserRank]";
                command.CommandText = query;
                command.CommandType = CommandType.StoredProcedure;

                try
                {

                    SqlParameter userIdParameter = new SqlParameter();
                    userIdParameter.ParameterName = "@userId";
                    userIdParameter.Value = DBNull.Value;
                    command.Parameters.Add(userIdParameter);


                    command.ExecuteNonQuery();
                    connection.Close();
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("  Message: {0}", ex.Message);
                    Core.Core.Instance.writeExceptionToLog(ex);
                }
                finally
                {
                    // Close the connection
                    if (connection != null)
                    {
                        connection.Close();
                    }
                }
            }

            return;
        }

    }
}
