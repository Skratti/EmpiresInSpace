using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmpiresInSpace
{
    public class UserHandler
    {
        private System.Collections.Concurrent.ConcurrentDictionary<string, User> _userList;
        

        public UserHandler()
        {
            _userList = new System.Collections.Concurrent.ConcurrentDictionary<string, User>();
            TotalActiveUsers = 0;
        }

        public int TotalActiveUsers { get; set; }

        public bool UserExistsAndReady(string connectionId)
        {
            return _userList.ContainsKey(connectionId);
        }

        public List<int> ConnectedUsers()
        {
            //select only userIds and distinct it 
            return GetActiveUsers().Select(e => e.RegistrationTicket.UserId).Distinct().ToList();
        }

        public void RemoveUser(string connectionId)
        {
            User u;
            _userList.TryRemove(connectionId, out u);
            if (!u.Controller)
            {
                //u.MyShip.Dispose();
                //u.MyShip.Host = null; // Remove linking from the ship
            }
        }

        public void ReassignUser(string connectionId, User user)
        {
            _userList.TryRemove(user.ConnectionID, out user);
            user.ConnectionID = connectionId;
            _userList.TryAdd(connectionId, user);
        }

        public void DisconnectUser(User user)
        {

            Game.GetContext().Clients.All.ChatRemoveUser(user.RegistrationTicket.UserId);

            RemoveUser(user.ConnectionID);
            /*
            foreach (User u in user.RemoteControllers)
            {
                DisconnectUser(u);
            }*/

            if (user.Connected)
            {
                Game.GetContext().Clients.Client(user.ConnectionID).disconnect();
            }

            user.Connected = false;
        }

        public void AddUser(User user)
        {
            _userList.TryAdd(user.ConnectionID, user);
            //user.IdleManager.OnIdle += _gameHandler.RemoveShipFromGame;
            user.IdleManager.OnIdleTimeout += DisconnectUser;
            //user.IdleManager.OnComeBack += _gameHandler.AddShipToGame;

            if (!user.Controller)
            {
                //user.MyShip.OnFire += _gameHandler.AddBulletToGame;
            }
        }

        public User GetUser(string connectionId)
        {
            return _userList[connectionId];
        }


        public User FindUserByIdentity(int identity)
        {
            return (from user in _userList.Values
                    where user.RegistrationTicket.UserId == identity && !user.Controller
                    select user).FirstOrDefault();
        }

        public List<User> GetUsers()
        {
            return _userList.Values.ToList();
        }

        public List<User> GetActiveUsers()
        {
            List<User> activeUsers = (from user in _userList.Values
                                      where !user.Controller && user.Connected && !user.IdleManager.Idle
                                      select user).ToList();

            TotalActiveUsers = activeUsers.Count;

            return activeUsers;
        }

        public ICollection<string> GetUserConnectionIds()
        {
            return _userList.Keys;
        }

        public void Update()
        {
            foreach (User user in _userList.Values)
            {
                user.Update();
            }
        }
    }
}