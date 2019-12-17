using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    //- See more at: http://www.sqlteam.com/article/use-sqlbulkcopy-to-quickly-load-data-from-your-client-to-sql-server#sthash.MRQfKJ44.dpuf

    class DBWriter
    {
        List<Star> Stars;
        MapGenerator.SystemGenerator.Workers.Worker SystemGenerator;
        //public static string connectionString = "Data Source=GK-PC\\SQLEXPRESS;Initial Catalog=FornaxA;Integrated Security=True";
        //public static string connectionString = "Data Source=EMPIRES-AKR\\SQLEXPRESS;Initial Catalog=SculptorDwarf_Live;Integrated Security=True";
        public static string connectionString = "Data Source=.;Initial Catalog=Game2018test;Integrated Security=True";

        public DBWriter(List<Star> stars, MapGenerator.SystemGenerator.Workers.Worker systemGenerator)
        {
            Stars = stars;
            SystemGenerator = systemGenerator;
        }

        public void bulkInsert(System.Windows.Forms.TextBox output)
        {


            //string ConnectionString = "Data Source=.;Initial Catalog=Game02;Integrated Security=True";
            SqlConnection dest = new SqlConnection(connectionString);

            dest.Open();

            // copy the data: 
            CopyData(dest, Stars, SystemGenerator, output);

            // close connections: 

            dest.Close(); // See more at: http://www.sqlteam.com/article/use-sqlbulkcopy-to-quickly-load-data-from-your-client-to-sql-server#sthash.MRQfKJ44.dpuf
        }

        // writes the starmap to DB, and generates for each star a systemmap which uis also written to DB
        static void CopyData(SqlConnection destConnection, List<Star> systemElements, MapGenerator.SystemGenerator.Workers.Worker systemGenerator, System.Windows.Forms.TextBox output)
        {
            using (SqlCommand ins = new SqlCommand("[engine].StarMapInsert", destConnection))
            {
                ins.CommandType = CommandType.StoredProcedure;


                SqlParameter tvpParam = ins.Parameters.Add("@StarOrNebula", SqlDbType.Structured);
                tvpParam.TypeName = "[engine].StarMapInsertType";



                var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

                DataColumn column;
                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "X";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "Y";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int16");
                column.ColumnName = "objectId";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int16");
                column.ColumnName = "size";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int16");
                column.ColumnName = "startSystem";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "id";
                dataTable.Columns.Add(column);

                int counter = 0; //only up to 1000 are to be inserted at once

                // and now, do the work: 
                for (int i = 0; i < systemElements.Count; i++)
                {
                    if (systemElements[i].StarNebulaType == 3) continue;

                    (new
                    {
                        X = systemElements[i].X ,
                        Y = systemElements[i].Y ,
                        objectId = systemElements[i].StarNebulaType == 1 ? systemElements[i].ObjectId : StarGenerator.getNebulaId(systemElements[i].StarNebulaType), // 5000,
                        size = systemElements[i].StarNebulaType == 1 ? 24 : 1,
                        startSystem = systemElements[i].StarNebulaType == 1 && systemElements[i].StartingSystem ? 1 : 0,
                        id = i + 1
                    }).AddObjectToDataTable(dataTable);
                    counter++;


                    // create the system belonging to the star:

                    if (systemElements[i].StarNebulaType == 1)
                    {
                        tvpParam.Value = dataTable;
                        ins.ExecuteNonQuery();
                        counter = 0;
                        output.Text = i.ToString() + " / " + systemElements.Count.ToString();
                        output.Refresh(); //this forces the label to redraw itself
                        dataTable.Clear();

                        //List<MapGenerator.SystemGenerator.systemElement> systemElements2 = new List<SystemGenerator.systemElement>();
                        
                        MapGenerator.SystemGenerator.SolarSystem x = systemGenerator.createSystem(false, false, systemElements[i].Type, systemElements[i].StartingSystem);
                        SystemBulkInsert( i + 1, connectionString, x); //starIds begin at 1 ( it is not checked yet if 0 is supported by the javascript when starid is transfered there)
                    }

                    if (counter > 1000)
                    {
                        tvpParam.Value = dataTable;
                        ins.ExecuteNonQuery();
                        //ins.ExecuteNonQuery();
                        counter = 0;
                        output.Text = i.ToString() + " / " + systemElements.Count.ToString();
                        output.Refresh(); //this forces the label to redraw itself
                        dataTable.Clear();
                    }
                }

                if (counter > 0)
                {
                    tvpParam.Value = dataTable;
                    //ins.ExecuteNonQuery();
                    ins.ExecuteNonQuery();
                    counter = 0;

                    output.Text = systemElements.Count.ToString() + " / " + systemElements.Count.ToString();
                    output.Refresh(); //this forces the label to redraw itself
                }
            }
        }

        public static void SystemBulkInsert(int starId, string ConnectionString, MapGenerator.SystemGenerator.SolarSystem x)
        {

            SqlConnection dest = new SqlConnection(ConnectionString);

            dest.Open();

            // copy the data: 
            CopySystemData(dest, x, starId);

            // close connections: 

            dest.Close(); // See more at: http://www.sqlteam.com/article/use-sqlbulkcopy-to-quickly-load-data-from-your-client-to-sql-server#sthash.MRQfKJ44.dpuf
        }

        static void CopySystemData(SqlConnection destConnection, MapGenerator.SystemGenerator.SolarSystem system, int starId)
        {
            /*             
                create proc [dbo].[insertSolarSystemInstances]
                    @X int, 
                    @Y int, 
                    @starId int,
                    @objectId smallint,
                    @drawSize smallint
                as
                begin

                INSERT INTO [dbo].[SolarSystemInstances]
                       ([x]
                       ,[y]
                       ,[systemId]
                       ,[objectId]
                       ,[drawSize])
                 VALUES
                       (@X
                       ,@Y
                       ,@starId
                       ,@objectId
                       ,@drawSize);
                end
                GO
             */
            // first, create the insert command that we will call over and over: 



            using (SqlCommand ins = new SqlCommand("[engine].SolarSystemInstancesInsert", destConnection))
            {
                ins.CommandType = CommandType.StoredProcedure;

                var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

                DataColumn column;
                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "X";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "Y";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int32");
                column.ColumnName = "starId";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int16");
                column.ColumnName = "objectId";
                dataTable.Columns.Add(column);

                column = new DataColumn();
                column.DataType = System.Type.GetType("System.Int16");
                column.ColumnName = "drawSize";
                dataTable.Columns.Add(column);



                int counter = 0;
                // and now, do the work: 
                for (int i = 0; i < system.systemElements.Count; i++)
                {

                    if (system.systemElements[i].x < 0 || system.systemElements[i].x >= MapGenerator.SystemGenerator.SolarSystem.Size
                        || system.systemElements[i].y < 0 || system.systemElements[i].y >= MapGenerator.SystemGenerator.SolarSystem.Size) continue;

                    (new
                    {
                        X = system.systemElements[i].x,
                        Y = system.systemElements[i].y,
                        starId = starId,
                        objectId = system.systemElements[i].type,
                        drawSize = system.systemElements[i].size
                    }).AddObjectToDataTable(dataTable);
                }

                SqlParameter tvpParam = ins.Parameters.AddWithValue("@planets", dataTable);
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.TypeName = "[engine].SolarSystemInstancesInsertType";

                ins.ExecuteNonQuery();
                //List<Task> asynctasks = new List<Task>();
                //asynctasks.Add();
                //Task.Factory.StartNew(() => ;)


            }

        }
    }

    static class Extensions
    {

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
                    row[property.Name] = item.GetType().InvokeMember(property.Name, System.Reflection.BindingFlags.GetProperty, null, item, null);
                }
                table.Rows.Add(row);
            }
        }

        public static void AddObjectToDataTable(this object item, System.Data.DataTable table)
        {
            var properties = item.GetType().GetProperties();
            var row = table.NewRow();
            foreach (var property in properties)
            {
                row[property.Name] = item.GetType().InvokeMember(property.Name, System.Reflection.BindingFlags.GetProperty, null, item, null);
            }
            table.Rows.Add(row);
        }




    }


}
