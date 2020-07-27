using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmpiresInSpace
{
    public class User
    {
        public User(string connectionID, RegisteredClient rc)
        {
            RegistrationTicket = rc;
            ConnectionID = connectionID;
            
            ReadyForPayloads = false;
            
            //RemoteControllers = new List<User>();
            //NotificationManager = new NotificationManager();
            IdleManager = new IdleManager(this);
            Connected = true;
            _lastSeen = DateTime.UtcNow;
            
        }

        private DateTime _lastSeen;
        public DateTime LastSeenAt()
        {
            return _lastSeen;
        }

        public bool Connected { get; set; }
        public RegisteredClient RegistrationTicket { get; set; }
        //public List<User> RemoteControllers { get; set; }
        //public NotificationManager NotificationManager { get; private set; }
        public IdleManager IdleManager { get; private set; }
        public string ConnectionID { get; set; }        
        public bool Controller { get; set; }
        public bool ReadyForPayloads { get; set; }
        public int CurrentLeaderboardPosition { get; set; }
        public bool DeathOccured { get; set; }


        public void Update()
        {
            
            IdleManager.Update();
            
        }

    }
}