using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace SpacegameServer.Core
{
    internal class TurnSummaryTimer
    {
        private static Timer aTimer;
        public TurnSummaryTimer()
        {
            aTimer = new System.Timers.Timer(60 * 1000);
            // Hook up the Elapsed event for the timer. 
            aTimer.Elapsed += OnTimedEvent;
            aTimer.Enabled = true;
        }

        private static void OnTimedEvent(Object source, ElapsedEventArgs e)
        {
            //Console.WriteLine("The Elapsed event was raised at {0}", e.SignalTime);
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;
        }
    }
     
}
