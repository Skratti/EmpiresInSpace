using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class UserResearch
    {
        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "researchId");
            dataTable.AddColumn(System.Type.GetType("System.Byte"), "isCompleted");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "investedResearchpoints");
            dataTable.AddColumn(System.Type.GetType("System.Int16"), "researchPriority");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                userId = this.userId,
                this.researchId,
                this.isCompleted,
                this.investedResearchpoints,
                this.researchPriority
                //activity = (object)this.activity ?? DBNull.Value
            };
        }

    }
}
