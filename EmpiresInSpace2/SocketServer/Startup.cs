using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(EmpiresInSpace.Startup))]

namespace EmpiresInSpace
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Weitere Informationen zm Konfigurieren Ihrer Anwendung finden Sie unter "http://go.microsoft.com/fwlink/?LinkID=316888".
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}
