using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer
{
    static class Extensions
    {
        public static bool sparseContainsIndex<T>(this T[] array, int index)
        {
            if (array.Length < index || array[index] == null)
                return false;

            return true;
        }

        public static bool TryRemove<TKey, TValue>(this System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue> self, TKey key)
        {
            TValue ignored;
            return self.TryRemove(key, out ignored);
        }

    }
    public class SpaceServer
    {               
        public static SpacegameServer.BC.BusinessConnector createServer()
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance; //new SpacegameServer.Core.SpaceServerCore(); -> Singleton
            
            SpacegameServer.BC.BusinessConnector bc = new BC.BusinessConnector();            
            return bc;
        }
    }

    
}
