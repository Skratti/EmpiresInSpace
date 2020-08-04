
// mdTemplate : Template for Modules and Classes 
// this pattern is always to be used!



//declare var entryPoint: AllianceModule;
module AllianceModule {

    /*declare function entryPoint(allianceId: number, _parent: JQuery): void;
    export function entryPoint2(allianceId: number, _parent: JQuery) {
        AllianceModule.entryPoint(allianceId, _parent);
    }
    */


    class Rights {
        _userid :number;

        _fulladmin: boolean;

        _diplomaticadmin: boolean;

        _mayinvite: boolean;

        _mayfire: boolean;

        _maydeclarewar: boolean;

        _maymakediplomaticproposals: boolean;
    }


    export var alliances: Alliance[] = [];

    export var staticValue = false;     

    export class Alliance {

        name = '';
        description = '';
        allianceOwner: number;
        overallVicPoints = 0;
        overallRank = 0;




        currentRelations: PlayerData.UserRelation[] = []; //relation from this alliance towards others  -> [freignAllianceId:currentRelation]; These are needed in the alliance details - politics screen, to inform about diplomatic standings between this alliance and other alliances
        
        currentRelation = 2;    //relation between user/hisAlliance towards this alliance
        targetRelation :number;
        hisTargetRelation: number;



        invitedUsers: number[] = [];//sparse array containing userIds of invited Users (value is just 1)

        loaded = false; //if the description and their currentRelations was loaded

        constructor(public id: number) {
            //this.description = i18n.label(438);
        }

        update(XMLmessage) {
            var name = XMLmessage.getElementsByTagName("name")[0].childNodes[0].nodeValue;

            var allianceOwner = parseInt(XMLmessage.getElementsByTagName("allianceOwner")[0].childNodes[0].nodeValue, 10);


            //var var2 = XMLmessage.getElementsByTagName("var2")[0].childNodes[0].nodeValue;
            //var var3 = parseInt(XMLmessage.getElementsByTagName("var3")[0].childNodes[0].nodeValue,10);
            
            this.name = name;
            this.allianceOwner = allianceOwner;
            this.overallVicPoints = parseInt(XMLmessage.getElementsByTagName("overallVicPoints")[0].childNodes[0].nodeValue);
            this.overallRank = parseInt(XMLmessage.getElementsByTagName("overallRank")[0].childNodes[0].nodeValue);
            

            if (mainObject.user.id == allianceOwner) mainObject.user.allianceId = this.id;

            //this.var2 = var2;
            //this.var3 = var3;           
        }        

        deleteAlliance() {

            //remove foreign relations towards this alliance
            for (var x = 0; x < alliances.length; x++) {
                if (alliances[x] == null) continue;

                alliances[x].currentRelation[this.id] = null;                               
            }
            //remove the alliance
            delete alliances[this.id];
        }

        IsAdmin(): boolean {
            return mainObject.user.id == this.allianceOwner;
        }

        IsDiplomat(): boolean {
            return mainObject.user.id == this.allianceOwner;
        }

        getUserRights(): boolean {
            return mainObject.user.id == this.allianceOwner;
        }

        rightToInvite(): boolean {
            
            return mainObject.user.id == this.allianceOwner;
        }


        countMembers(): number {
            var memberCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) memberCount++;
            }
            //if (mainObject.user.allianceId == this.id) memberCount++;
            return memberCount;
        }

        allMembers(): PlayerData.User[]{
            var all: PlayerData.User[] = [];
            var memberCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) all[x] = mainObject.user.otherUsers[x];
            }
            if (mainObject.user.allianceId == this.id) all[mainObject.user.id] = mainObject.user;
            return all;
        }

        hasMember(_userId: number): boolean {
            if (this.allMembers().length > _userId) return false;
            if (this.allMembers()[_userId] != null) return true;

            /*for (var i = 0; i < this.allMembers().length; i++) {
                if (this.allMembers()[i].id == _userId) return true;
            }*/
            return false;
        } 

        countColonies(): number {
            var colonyCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) {
                    for (var y = 0; y < mainObject.colonies.length; y++) {
                        if (!mainObject.colonies[y] || mainObject.colonies[y].owner != x) continue;
                        colonyCount++;
                    }
                }
            }
            if (mainObject.user.allianceId == this.id) {
                for (var y = 0; y < mainObject.colonies.length; y++) {
                    if (!mainObject.colonies[y] || mainObject.colonies[y].owner != mainObject.user.id) continue;
                    colonyCount++;
                }
            }
            return colonyCount;
        }

        countShips(): number {
            var shipsCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) {
                    for (var y = 0; y < mainObject.ships.length; y++) {
                        if (!mainObject.ships[y] || mainObject.ships[y].owner != x) continue;
                        shipsCount++;
                    }
                }
            }

            if (mainObject.user.allianceId == this.id) {
                for (var y = 0; y < mainObject.ships.length; y++) {
                    if (!mainObject.ships[y] || mainObject.ships[y].owner != mainObject.user.id) continue;
                    shipsCount++;
                }
            }

            return shipsCount;
        }
        /*
        getAllianceRelation(_targetId: number): number {

            if (this.currentRelations[_targetId] == null) return 1;
            return this.currentRelations[_targetId];
        }

        updateCreateAllianceRelation(_targetId: number, _relation: number) {
            this.currentRelations[_targetId] = _relation;
        }
        */
        
    }

    export function allianceExists(id: number): boolean {
        if (alliances[id] != null)
            return true;
        else
            return false;
    }

    export function getAlliance(id: number): Alliance {
        if (!allianceExists(id)) return null;
        return alliances[id];
    }

    var allianceAdd = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newalliance = new Alliance(id);

        alliances[id] = newalliance;

        newalliance.update(XMLmessage);        
    }

    var createUpdatealliance = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (allianceExists(id))
            alliances[id].update(XMLmessage);
        else
            allianceAdd(XMLmessage);
    }

    export function getAllianceDataFromXML(XMLmessage: Document) {
        getAllianceFromXML(XMLmessage);
        //getAllianceCurrentRelationsFromXML(XMLmessage);
        //getAllianceTargetRelationsFromXML(XMLmessage);
        getAllianceUserRelationsFromXML(XMLmessage);
        getInvitationsFromXML(XMLmessage);
    }

    function getAllianceFromXML(XMLmessage: Document) {
        var XMLalliances = XMLmessage.getElementsByTagName("allianceDetail");
        var length = XMLalliances.length;
        for (var i = 0; i < length; i++) {
            createUpdatealliance(<Element>XMLalliances[i]);
        }
        Helpers.Log(length + " alliances added or updated");
    }
      /*
    function getAllianceCurrentRelationsFromXML(XMLmessage: Document) {
        var XMLallianceRelations = XMLmessage.getElementsByTagName("allianceRelations");

        var length = XMLallianceRelations.length;
        for (var i = 0; i < length; i++) {
            var alliance1Id = parseInt(XMLallianceRelations[i].getElementsByTagName("alliance1")[0].childNodes[0].nodeValue);
            var alliance2Id = parseInt(XMLallianceRelations[i].getElementsByTagName("alliance2")[0].childNodes[0].nodeValue);
            var currentRelation = parseInt(XMLallianceRelations[i].getElementsByTagName("currentRelation")[0].childNodes[0].nodeValue);

            //bidirection relations
            if (allianceExists(alliance1Id))
                getAlliance(alliance1Id).updateCreateAllianceRelation(alliance2Id, currentRelation);

            if (allianceExists(alliance2Id))
                getAlliance(alliance2Id).updateCreateAllianceRelation(alliance1Id, currentRelation);

        }
        Helpers.Log(length + " allianceRelations added or updated");
    }*/

    function getAllianceTargetRelationsFromXML(XMLmessage: Document) {
        //this method only delivers data for the own alliance
        var XMLallianceTargetRelations = XMLmessage.getElementsByTagName("allianceTargetRelations");

        var length = XMLallianceTargetRelations.length;
        for (var i = 0; i < length; i++) {
            var sender = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("sender")[0].childNodes[0].nodeValue);     
            var addressee = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("addressee")[0].childNodes[0].nodeValue);
            var targetRelation = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("targetRelation")[0].childNodes[0].nodeValue);

            //set user/userAlliance targetRelation
            if (mainObject.user.allianceId == sender ) {  
                if (allianceExists(addressee))
                    getAlliance(addressee).targetRelation = targetRelation; 
            }

            //set his  targetRelation towards user/userAlliance 
            if ( mainObject.user.allianceId == addressee) {
                if (allianceExists(sender))
                    getAlliance(sender).hisTargetRelation = targetRelation;
            }

        }


        Helpers.Log(length + " allianceTargetRelations added or updated");
    }

    //Alliance data towards player (may also mean towards players alliance, if he has an alliance
    function getAllianceUserRelationsFromXML(XMLmessage: Document) {
        
        var XMLallianceTargetRelations = XMLmessage.getElementsByTagName("AllianceUserRelation");
        var length = XMLallianceTargetRelations.length;
        for (var i = 0; i < length; i++) {

            var alliance = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("alliance")[0].childNodes[0].nodeValue);
            var sending = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("sendingRelation")[0].childNodes[0].nodeValue);
            var target = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("targetRelation")[0].childNodes[0].nodeValue);
            var current = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("currentRelation")[0].childNodes[0].nodeValue);

            if (allianceExists(alliance)) {
                getAlliance(alliance).targetRelation = sending;
                getAlliance(alliance).hisTargetRelation = target;
                getAlliance(alliance).currentRelation = current;
            }
        }

        Helpers.Log(length + " AllianceUserRelations added or updated");
    }


    function getInvitationsFromXML(XMLmessage: Document) {
        var XMLalliances = XMLmessage.getElementsByTagName("allianceInvite");
        var length = XMLalliances.length;
        for (var i = 0; i < length; i++) {
            var invitation: Element = <Element>XMLalliances[i];
            var allianceId = parseInt(invitation.getElementsByTagName("allianceId")[0].childNodes[0].nodeValue);
            var userId = parseInt(invitation.getElementsByTagName("userId")[0].childNodes[0].nodeValue);
            if (userId == mainObject.user.id) {
                mainObject.user.invitedByAlliance[allianceId] = 1;
            }
            else {
            if (AllianceModule.allianceExists(allianceId))
                AllianceModule.getAlliance(allianceId).invitedUsers[userId] = 1;
            }
        }
        Helpers.Log(length + " allianceInvites added or updated");
    }
} 