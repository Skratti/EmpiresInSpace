
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
        mainInterface.addQuickMessage("Server gets restarted in ~", 10000, true, 60 * 1000);
    }

}