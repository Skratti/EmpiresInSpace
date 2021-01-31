interface SpaceClient {
    broadcastMessage(id: number, message: string);
    ServerRestart();
    newgalacticevent(event: any);
    chatremoveuser(userId: number);
    chatadduser(userId: number);
    refreshship(shipId: number, serverversion: number);
    receiveship(ship: any);
    receivecommmessage(message: any);
    ReceiveMessage(message: any);
    ReceiveCombat(message: any);
    NewTradeOffer(trade: any);
    DeleteTrade(tradeId: number);
}

interface SpaceServer {
    send(message: string);
    FetchActiveUsers(): any;
    FetchUserResearch(userId: number): any;
    FetchShip(shipId: number): any;
    CreateTrade(shipId: number, Offered: any, Requested: any): any;
    DeleteMyTrade(tradeId: number);
    FetchRoutes(): any;
    FetchAllData(): any;
}

interface HubProxy {
    client: SpaceClient;
    server: SpaceServer;
    invoke(methodName: string, ...args: any[]): JQueryDeferred<any>;
}

module SpaceHub { 

    export function RegisterEvents() {
        $.connection.spaceHub.client.ServerRestart = ServerRestart;

        
        $.connection.spaceHub.client.newgalacticevent = GalacticEventsModule.NewGalacticEvent;
        $.connection.spaceHub.client.broadcastMessage = Chat.BroadcastMessage;
        $.connection.spaceHub.client.chatremoveuser = Chat.removeUserFromChat;
        $.connection.spaceHub.client.chatadduser = Chat.addUserToChat;
        $.connection.spaceHub.client.refreshship = Ships.RefreshShip;
        $.connection.spaceHub.client.receiveship = Ships.ReceiveShip;        
        $.connection.spaceHub.client.receivecommmessage = CommModule.ReceiveCommMessage;
        $.connection.spaceHub.client.ReceiveMessage = MessageModule.ReceiveMessage; 
        $.connection.spaceHub.client.ReceiveCombat = MessageModule.ReceiveCombat; 
        
        
        $.connection.spaceHub.client.NewTradeOffer = TradeOffersModule.SendNewTrade;          
        $.connection.spaceHub.client.DeleteTrade = TradeOffersModule.DeleteTrade;          
        
        
    }

    function ServerRestart() {
        //mainInterface.addQuickMessage("Server gets restarted in ~", 10000, true, 60 * 1000);
        console.log('ServerRestart called');
    }

}