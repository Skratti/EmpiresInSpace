using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmpiresInSpace
{
    public class IdleManager
    {
        private static readonly TimeSpan IDLE_AFTER = TimeSpan.FromSeconds(120); // Go idle after X seconds with no communication to the server
        private static readonly TimeSpan DISCONNECT_AFTER = TimeSpan.FromMinutes(60 * 12); // Disconnect after X hours of being idle

        public event Action<User> OnIdle;
        public event Action<User> OnIdleTimeout;
        public event Action<User> OnComeBack;

        private DateTime _lastActive;
        private DateTime? _idleAt;
        //private NotificationManager _notificationManager;
        private User _me;

        public IdleManager(User me)
        {
            _lastActive = DateTime.UtcNow;
            //_notificationManager = notificationManager;
            _me = me;
            Idle = false;
        }

        public bool Idle { get; set; }


        public void RecordActivity()
        {
            _lastActive = DateTime.UtcNow;
        }

        public void GoIdle(DateTime now)
        {
            if (Idle == false)
            {
                _idleAt = now;
                Idle = true;

                if (_me.Connected)
                {
                    //_notificationManager.Notify("You are now Away!  You will not see any new ships on screen.");
                }

                if (OnIdle != null)
                {
                    OnIdle(_me);
                }
            }
        }

        public void ComeBack()
        {
            if (Idle == true)
            {
                Idle = false;

                if (_me.Connected)
                {
                    //_notificationManager.Notify("You are Back!");
                }

                if (OnComeBack != null)
                {
                    OnComeBack(_me);
                }
            }
        }

        public void Update()
        {
            var now = DateTime.UtcNow;

            // This is here for performance
            // Check if we've fired to prevent idle
            if (now - _me.LastSeenAt() < IDLE_AFTER)
            {
                _lastActive = _me.LastSeenAt();
                ComeBack();
                return;
            }

            // Need to disconnect
            if (_idleAt.HasValue && now - _idleAt >= DISCONNECT_AFTER)
            {
                _idleAt = null;
                if (OnIdleTimeout != null)
                {
                    OnIdleTimeout(_me);
                }
            }
            else
            {
                GoIdle(now);
            }

        }
    }
}