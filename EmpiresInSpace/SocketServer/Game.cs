using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace EmpiresInSpace
{
    /// <summary>
    /// Singleton class 
    /// Has a Registration handler which maps user GUIDs to their RegisteredClient object
    /// and a User handler which does the same. 
    /// </summary>
    public partial class Game
    {
        private readonly static Lazy<Game> _instance = new Lazy<Game>(() => new Game());
        private object _locker = new object();


        public SpacegameServer.BC.BusinessConnector bc; //is set in Global.asax.cs

        public RegistrationHandler RegistrationHandler { get; private set; }
        private Game()
        {
            UserHandler = new UserHandler();
            ConnectionManager = new ConnectionManager(UserHandler, _locker);
            RegistrationHandler = new RegistrationHandler();
        }

        public UserHandler UserHandler { get; private set; }
        public ConnectionManager ConnectionManager { get; private set; }

        public static IHubContext GetContext()
        {
            return GlobalHost.ConnectionManager.GetHubContext<SpaceHub>();
        }

        public static Game Instance
        {
            get
            {
                return _instance.Value;
            }
        }

        /// <summary>
        /// Retrieves the game's configuration
        /// </summary>
        /// <returns>The game's configuration</returns>
        public object initializeClient(string connectionId, RegisteredClient rc)
        {
            if (!UserHandler.UserExistsAndReady(connectionId))
            {
                try
                {
                    lock (_locker)
                    {
                        User user = UserHandler.FindUserByIdentity(rc.UserId);
                        

                        if (user == null)
                        {
                            // checkuserMaximum - not more than one million users 
                            if (UserHandler.TotalActiveUsers >= 1000000)
                            {
                                return new
                                {
                                    ServerFull = true
                                };
                            }
                            else
                            {

                                user = new User(connectionId, rc) { Controller = false };
                                UserHandler.AddUser(user);                               
                            }
                        }
                        else
                        {
                            string previousConnectionID = user.ConnectionID;
                            UserHandler.ReassignUser(connectionId, user);
                            

                            if (user.Connected) // Check if it's a duplicate login
                            {
                                GetContext().Clients.Client(previousConnectionID).controlTransferred();
                                //user.NotificationManager.Notify("Transfering control to this browser.  You were already logged in.");
                            }
                            else
                            {
                                //ship.Disposed = false;
                                //ship.LifeController.HealFull();
                                user.Connected = true;                              
                            }

                            user.IdleManager.RecordActivity();
                            user.IdleManager.Idle = false;
                        }

                        //GameHandler.AddShipToGame(ship);
                    }

                   // var fields = bc.getUserBordersData(rc.UserId);
                    /*
                    object[] result;
                    result = new object[fields.Count];
                    for (int i = 0; i < 2; i++)
                    {
                        result[i] = fields[i];
                    }
                    return new { x = result };
                    */
                    object ret = new
                    {
                        //Configuration = Configuration,
                        ServerFull = false
                        //BorderMap = bc.getUserBordersData(rc.UserId)[0]  //works
                        //BorderMap = fields 


                        /*CompressionContracts = new
                        {
                            PayloadContract = _payloadManager.Compressor.PayloadCompressionContract,
                            CollidableContract = _payloadManager.Compressor.CollidableCompressionContract,
                            ShipContract = _payloadManager.Compressor.ShipCompressionContract,
                            BulletContract = _payloadManager.Compressor.BulletCompressionContract,
                            LeaderboardEntryContract = _payloadManager.Compressor.LeaderboardEntryCompressionContract,
                            PowerupContract = _payloadManager.Compressor.PowerupCompressionContract
                        },
                        */
                        //ShipID = UserHandler.GetUserShip(connectionId).ID,
                        //ShipName = UserHandler.GetUserShip(connectionId).Name
                    };

                    

                    return ret;
                }
                catch (Exception e)
                {
                    this.bc.writeExceptionToLog(e);
                }
            }

            return null;
        }


    }


    public class Scann
    {
        public List<SpacegameServer.Core.SimpleField> Fields { get; set; }
        public Scann()
        {

        }
        public Scann(List<SpacegameServer.Core.SimpleField> fields)
        {
            Fields = fields;
        }
    }

}