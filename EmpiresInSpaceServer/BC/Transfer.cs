using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.BC
{
    internal class Transfer
    {       
        
        
        public Transfer()
        {         
        }

        public static string transfer(int _userID, string _transferXml)
        {
            string result = "";

            SpacegameServer.Core.TransferGoods.transfer(_userID, _transferXml, ref result);

            return result;
        }

    }

}
