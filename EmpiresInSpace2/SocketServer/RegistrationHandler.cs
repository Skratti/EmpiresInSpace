using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace EmpiresInSpace
{
    public class RegistrationHandler
    {
        public static readonly TimeSpan TIMEOUT_AFTER = TimeSpan.FromSeconds(30);

        private Timer _timeoutLoop;

        private System.Collections.Concurrent.ConcurrentDictionary<string, RegisteredClient> _registrationList;

        public RegistrationHandler()
        {
            _registrationList = new System.Collections.Concurrent.ConcurrentDictionary<string, RegisteredClient>();
            _timeoutLoop = new Timer(new TimerCallback(CheckTimeOuts), null, Convert.ToInt32(TIMEOUT_AFTER.TotalMilliseconds / 2), Convert.ToInt32(TIMEOUT_AFTER.TotalMilliseconds / 2));
        }

        public void CheckTimeOuts(object state)
        {
            try
            {
                // This is all executed once every TIMEOUT_AFTER/2 seconds
                DateTime now = DateTime.UtcNow;
                RegisteredClient garbage;

                foreach (RegisteredClient rc in _registrationList.Values)
                {
                    if ((now - rc.InitializedAt()) >= TIMEOUT_AFTER)
                    {
                        // Since it's a concurrent list this will not error!
                        _registrationList.TryRemove(rc.SocketKey, out garbage);
                    }
                }
            }
            catch (Exception e)
            {
                //ErrorLog.Instance.Log(e);
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(e);
            }
        }

        public bool RegistrationExists(string registrationId)
        {
            return _registrationList.ContainsKey(registrationId);
        }

        public RegisteredClient RemoveRegistration(string registrationId)
        {
            RegisteredClient rc;
            _registrationList.TryRemove(registrationId, out rc);

            return rc;
        }

        public RegisteredClient Register(int identity)
        {
            RegisteredClient rc = new RegisteredClient(Guid.NewGuid().ToString(), identity);
            _registrationList.TryAdd(rc.SocketKey, rc);
            return rc;
        }

        public RegisteredClient Register(RegisteredClient existing)
        {
            //existing.RegistrationID = Guid.NewGuid().ToString();
            _registrationList.TryAdd(existing.SocketKey, existing);
            return existing;
        }

        public RegisteredClient GetRegistration(string registrationID)
        {
            return _registrationList[registrationID];
        }
    }
}