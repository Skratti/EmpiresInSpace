// mdTemplate : Template for Modules and Classes 
// this pattern is always to be used!
//declare var entryPoint: AllianceModule;
var AllianceModule;
(function (AllianceModule) {
    /*declare function entryPoint(allianceId: number, _parent: JQuery): void;
    export function entryPoint2(allianceId: number, _parent: JQuery) {
        AllianceModule.entryPoint(allianceId, _parent);
    }
    */
    var Rights = /** @class */ (function () {
        function Rights() {
        }
        return Rights;
    }());
    AllianceModule.alliances = [];
    AllianceModule.staticValue = false;
    var Alliance = /** @class */ (function () {
        function Alliance(id) {
            this.id = id;
            this.name = '';
            this.description = '';
            this.overallVicPoints = 0;
            this.overallRank = 0;
            this.currentRelations = []; //relation from this alliance towards others  -> [freignAllianceId:currentRelation]; These are needed in the alliance details - politics screen, to inform about diplomatic standings between this alliance and other alliances
            this.currentRelation = 2; //relation between user/hisAlliance towards this alliance
            this.invitedUsers = []; //sparse array containing userIds of invited Users (value is just 1)
            this.loaded = false; //if the description and their currentRelations was loaded
            //this.description = i18n.label(438);
        }
        Alliance.prototype.update = function (XMLmessage) {
            var name = XMLmessage.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            var allianceOwner = parseInt(XMLmessage.getElementsByTagName("allianceOwner")[0].childNodes[0].nodeValue, 10);
            //var var2 = XMLmessage.getElementsByTagName("var2")[0].childNodes[0].nodeValue;
            //var var3 = parseInt(XMLmessage.getElementsByTagName("var3")[0].childNodes[0].nodeValue,10);
            this.name = name;
            this.allianceOwner = allianceOwner;
            this.overallVicPoints = parseInt(XMLmessage.getElementsByTagName("overallVicPoints")[0].childNodes[0].nodeValue);
            this.overallRank = parseInt(XMLmessage.getElementsByTagName("overallRank")[0].childNodes[0].nodeValue);
            if (mainObject.user.id == allianceOwner)
                mainObject.user.allianceId = this.id;
            //this.var2 = var2;
            //this.var3 = var3;           
        };
        Alliance.prototype.deleteAlliance = function () {
            //remove foreign relations towards this alliance
            for (var x = 0; x < AllianceModule.alliances.length; x++) {
                if (AllianceModule.alliances[x] == null)
                    continue;
                AllianceModule.alliances[x].currentRelation[this.id] = null;
            }
            //remove the alliance
            delete AllianceModule.alliances[this.id];
        };
        Alliance.prototype.IsAdmin = function () {
            return mainObject.user.id == this.allianceOwner;
        };
        Alliance.prototype.IsDiplomat = function () {
            return mainObject.user.id == this.allianceOwner;
        };
        Alliance.prototype.getUserRights = function () {
            return mainObject.user.id == this.allianceOwner;
        };
        Alliance.prototype.rightToInvite = function () {
            return mainObject.user.id == this.allianceOwner;
        };
        Alliance.prototype.countMembers = function () {
            var memberCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id)
                    memberCount++;
            }
            //if (mainObject.user.allianceId == this.id) memberCount++;
            return memberCount;
        };
        Alliance.prototype.allMembers = function () {
            var all = [];
            var memberCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id)
                    all[x] = mainObject.user.otherUsers[x];
            }
            if (mainObject.user.allianceId == this.id)
                all[mainObject.user.id] = mainObject.user;
            return all;
        };
        Alliance.prototype.hasMember = function (_userId) {
            if (this.allMembers().length > _userId)
                return false;
            if (this.allMembers()[_userId] != null)
                return true;
            /*for (var i = 0; i < this.allMembers().length; i++) {
                if (this.allMembers()[i].id == _userId) return true;
            }*/
            return false;
        };
        Alliance.prototype.countColonies = function () {
            var colonyCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) {
                    for (var y = 0; y < mainObject.colonies.length; y++) {
                        if (!mainObject.colonies[y] || mainObject.colonies[y].owner != x)
                            continue;
                        colonyCount++;
                    }
                }
            }
            if (mainObject.user.allianceId == this.id) {
                for (var y = 0; y < mainObject.colonies.length; y++) {
                    if (!mainObject.colonies[y] || mainObject.colonies[y].owner != mainObject.user.id)
                        continue;
                    colonyCount++;
                }
            }
            return colonyCount;
        };
        Alliance.prototype.countShips = function () {
            var shipsCount = 0;
            for (var x = 0; x < mainObject.user.otherUsers.length; x++) {
                if (mainObject.user.otherUsers[x] && mainObject.user.otherUsers[x].allianceId == this.id) {
                    for (var y = 0; y < mainObject.ships.length; y++) {
                        if (!mainObject.ships[y] || mainObject.ships[y].owner != x)
                            continue;
                        shipsCount++;
                    }
                }
            }
            if (mainObject.user.allianceId == this.id) {
                for (var y = 0; y < mainObject.ships.length; y++) {
                    if (!mainObject.ships[y] || mainObject.ships[y].owner != mainObject.user.id)
                        continue;
                    shipsCount++;
                }
            }
            return shipsCount;
        };
        return Alliance;
    }());
    AllianceModule.Alliance = Alliance;
    function allianceExists(id) {
        if (AllianceModule.alliances[id] != null)
            return true;
        else
            return false;
    }
    AllianceModule.allianceExists = allianceExists;
    function getAlliance(id) {
        if (!allianceExists(id))
            return null;
        return AllianceModule.alliances[id];
    }
    AllianceModule.getAlliance = getAlliance;
    var allianceAdd = function (XMLmessage) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newalliance = new Alliance(id);
        AllianceModule.alliances[id] = newalliance;
        newalliance.update(XMLmessage);
    };
    var createUpdatealliance = function (XMLmessage) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        if (allianceExists(id))
            AllianceModule.alliances[id].update(XMLmessage);
        else
            allianceAdd(XMLmessage);
    };
    function getAllianceDataFromXML(XMLmessage) {
        getAllianceFromXML(XMLmessage);
        //getAllianceCurrentRelationsFromXML(XMLmessage);
        //getAllianceTargetRelationsFromXML(XMLmessage);
        getAllianceUserRelationsFromXML(XMLmessage);
        getInvitationsFromXML(XMLmessage);
    }
    AllianceModule.getAllianceDataFromXML = getAllianceDataFromXML;
    function getAllianceFromXML(XMLmessage) {
        var XMLalliances = XMLmessage.getElementsByTagName("allianceDetail");
        var length = XMLalliances.length;
        for (var i = 0; i < length; i++) {
            createUpdatealliance(XMLalliances[i]);
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
    function getAllianceTargetRelationsFromXML(XMLmessage) {
        //this method only delivers data for the own alliance
        var XMLallianceTargetRelations = XMLmessage.getElementsByTagName("allianceTargetRelations");
        var length = XMLallianceTargetRelations.length;
        for (var i = 0; i < length; i++) {
            var sender = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("sender")[0].childNodes[0].nodeValue);
            var addressee = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("addressee")[0].childNodes[0].nodeValue);
            var targetRelation = parseInt(XMLallianceTargetRelations[i].getElementsByTagName("targetRelation")[0].childNodes[0].nodeValue);
            //set user/userAlliance targetRelation
            if (mainObject.user.allianceId == sender) {
                if (allianceExists(addressee))
                    getAlliance(addressee).targetRelation = targetRelation;
            }
            //set his  targetRelation towards user/userAlliance 
            if (mainObject.user.allianceId == addressee) {
                if (allianceExists(sender))
                    getAlliance(sender).hisTargetRelation = targetRelation;
            }
        }
        Helpers.Log(length + " allianceTargetRelations added or updated");
    }
    //Alliance data towards player (may also mean towards players alliance, if he has an alliance
    function getAllianceUserRelationsFromXML(XMLmessage) {
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
    function getInvitationsFromXML(XMLmessage) {
        var XMLalliances = XMLmessage.getElementsByTagName("allianceInvite");
        var length = XMLalliances.length;
        for (var i = 0; i < length; i++) {
            var invitation = XMLalliances[i];
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
})(AllianceModule || (AllianceModule = {}));
//# sourceMappingURL=Alliances.js.map