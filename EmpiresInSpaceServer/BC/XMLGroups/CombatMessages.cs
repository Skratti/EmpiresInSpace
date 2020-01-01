using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    public class CombatMessages
    {
        public List<Core.Combat> messages;

        public CombatMessages() {
            messages = new List<Core.Combat>();     
        }
    }
}
