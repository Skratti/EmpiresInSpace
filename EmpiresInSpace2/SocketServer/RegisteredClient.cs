using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmpiresInSpace
{
    public class RegisteredClient
    {
        public RegisteredClient()
        {
        }

        public RegisteredClient(string socketKey, int userId)
        {
            SocketKey = socketKey;
            UserId = userId;

            _initialized = DateTime.UtcNow;
        }

        public string SocketKey { get; set; }
        public int UserId { get; set; }     

        private DateTime _initialized;
        public DateTime InitializedAt()
        {
            return _initialized;
        }
    }
}