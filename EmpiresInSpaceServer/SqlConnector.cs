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

        public SqlConnector(){            
        }

        public void loadData(SpacegameServer.Core.Core _core)
        {
            // do some loading...
            getAll(_core);
        }

        public SqlConnection getIndexConnection()
        {           
            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["onlineInSpaceIndexConnectionString"].ToString();

            SqlConnection connection = new SqlConnection(ConnectionString);
            return connection;
        }


        public SqlConnection GetConnection()
        {
            //string currentKey = System.Configuration.ConfigurationManager.AppSettings["currentConnection"].ToString(); ;
            string currentKey = System.Configuration.ConfigurationManager.AppSettings["activeConnection"];

            string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[currentKey].ToString();

            SqlConnection connection = new SqlConnection(ConnectionString);
            return connection;
        }

        

    }
}
