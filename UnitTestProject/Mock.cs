using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpacegameServer.Core;

namespace UnitTestProject
{

    public static class Mock
    {
        //User
        public const int userId = 1;
        public const string username = "UnitTester";
        public const bool showraster = true;
        public const bool moveshipsasync = true;
        public const int homecoordx = 5003;
        public const int homecoordy = 5003;
        public const int language = 0;
        public const bool showsystemnames = true;
        public const bool showcolonynames = true;
        public const bool showcoordinates = true;
        public const int researchpoints = 20;
        public const byte scanrangebrightness = 15;
        public const bool showcolonyowner = true;
        public const bool showshipnames = true;
        public const bool showshipowners = true;
        public const bool showcolonyowners = true;

        //Alliance
        public const int allianceId = 1;
        public const string allianceName = "UnitTestAlliance";
        //ShipHull
        public const byte ShipHullId = 1;
        public const bool ShipHullisstarbase = false;
        public const string ShipHulltypename = "UT_Scout";
        public const int ShipHulllabelname = 1;
        public const int ShipHullobjectid = 1;
        public const byte ShipHullmodulescount = 3;
        public const string ShipHulltemplateimageurl = "hull.gif";
        public const int ShipHulllabel = 1;

        //ShipTemplate
        public const int id = 1;
        public const int userid = 1;
        public const byte shiphullid = 1;
        public const string NAME = "UTTemplate";
        public const string gif = "x.gif";
        public const int energy = 10;
        public const int crew = 10;
        public const byte scanrange = 2;
        public const short attack = 10;
        public const short defense = 10;
        public const short hitpoints = 20;
        public const byte damagereduction = 1;
        public const short cargoroom = 150;
        public const short fuelroom = 20;
        public const int systemmovesperturn = 20;
        public const int galaxymovesperturn = 5;
        public const Decimal systemmovesmax = 100;
        public const Decimal galaxymovesmax = 20;
        public const int iscolonizer = 0;
        public const long population = 0;
        public const int constructionduration = 1;
        public const bool constructable = true;
        public const int amountbuilt = 0;
        public const bool obsolete = false;
        public const int shiphullsimage = 1;

        //Quest
        public const  short questId = 1;

        //Research
        public const  short researchid = 1;
        public const  string objectimageurl = "hu.gif";
        public const  string description = "desc";
        public const  short cost = 10;
        public const short baseCost = 10;
        public const  int label = 12;
        public const  int descriptionlabel = 13;
        public const  byte researchtype = 1;
        public const  byte treecolumn = 1;
        public const  byte treerow = 1;

        //ResearchQuestPrerequisite
        public const  short sourcetype = 1;
        public const  short sourceid = 1;
        public const  short targettype = 1;
        public const  short targetid = 2;

        //SolarSystemInstance (planet)
        public const int planetId = 1;
        public const int planetx = 3;
        public const int planety = 3;
        public const int planetsystemid = 1;
        public const short planetobjectid = 1;
        public const byte planetdrawsize = 1;

        //Colony
        public const int ColonyId = 1;
        public const int ColonyUserId = 1;
        public const string ColonyNAME = "UT_Colony";
        public const short storage = 1000;
        public const byte scanRange = 2;
        public const int starid = 1;
        public const int planetid = 1;
        public const int ColonyConstructionduration = 1;
        public const long ColonyPopulation = 100000000;
        public const int construction = 3000;
        public const short turnsofrioting = 0;
        public const Int64 versionId = 0;

        //ShipTemplateModule
        public const int shiptemplateid = 1;
        public const byte posx = 2;
        public const byte posy = 3;
        public const short moduleid = 1;

        //ModulesStats
        public const short ModulesStatModulesid = 1;
        public const int ModulesStatCrew = 0;
        public const short ModulesStatEnergy = 0;
        public const short ModulesStatHitpoints = 0;
        public const byte ModulesStatDamagereduction = 0;
        public const short ModulesStatDamageoutput = 0;
        public const short ModulesStatCargoroom = 100;
        public const short ModulesStatFuelroom = 0;
        public const short ModulesStatInspacespeed = 0;
        public const short ModulesStatInsystemspeed = 0;
        public const decimal ModulesStatMaxspacemoves = 0;
        public const decimal ModulesStatMaxsystemmoves = 0;
        public const byte ModulesStatScanrange = 2;
        public const int ModulesStatSpecial = 0;
        public const byte ModulesStatWeapontype = 0;
        public const long ModulesStatPopulation = 0;


        //Module
        public const short Moduleid = 1;
        public const int Moduledescriptionlabel = 2;
        public const short Modulegoodsid = 1;
        public const int Modulelabel = 1;
        public const byte Modulelevel = 1;

        public static Area mockGeometryIndex()
        {
            Area index = new Area(1, 2, 3);
            return index;
        }

        public static Field mockField()
        {
            int targetRegionId = GeometryIndex.calcRegionId(5001, 5001);
            Field field = GeometryIndex.regions[targetRegionId].findOrCreateField(5001, 5001);

            return field;
        }

        public static User mockGeneratedUser( Core instance)
        {
            //use allianceId as identity generator, since users do not have their own 
            int newUserId = (int)instance.identities.allianceId.getNext();
            SpacegameServer.Core.User.registerUser(newUserId);
            return instance.users[newUserId];
        }

        public static Ship CreateShipAtField(Core instance, User user, Field field)
        {
            SpacegameServer.Core.ShipBuild builder = new ShipBuild(instance);
            int newShipId = (int)instance.identities.shipLock.getNext();
            ShipTemplate template = instance.shipTemplate.Where(e => e.Value.hullid == 1).First().Value;
          
            Colony colony = Mock.mockColony(ColonyUserId: user.id);
            Ship newShip = builder.buildShip(newShipId, template, field, user.id, colony, false);

            return newShip;
        }

        public static Ship CreateShipAtCommNode( Core instance, User user, CommunicationNode node)
        {
            var TargetRegionId = GeometryIndex.calcRegionId(node.positionX, node.positionY);
            Field Field = GeometryIndex.regions[TargetRegionId].findOrCreateField(node.positionX, node.positionY);

            return CreateShipAtField(instance, user, Field);
        }


        public static User MockUser(int id = userId, string username = username, bool showraster = showraster, bool moveshipsasync = moveshipsasync,
                int homecoordx = homecoordx, int homecoordy = homecoordy, int language = language,
                System.Nullable<int> lastselectedobjecttype = null, System.Nullable<int> lastselectedobjectid = null,
            bool showsystemnames = showsystemnames, bool showcolonynames = showcolonynames, bool showcoordinates = showcoordinates,
             int researchpoints = researchpoints, byte scanrangebrightness = scanrangebrightness,
            bool showcolonyowner = showcolonyowner,  bool showshipnames = showshipnames,  bool showshipowners = showshipowners, bool showcolonyowners = showcolonyowners)
        {
            User user = new User(id, username, showraster, moveshipsasync, homecoordx, homecoordy, language,
                lastselectedobjecttype, lastselectedobjectid, showsystemnames, showcolonynames, showcoordinates,
                researchpoints, scanrangebrightness, showcolonyowner, showshipnames, showshipowners, showcolonyowner);
            
            return user;
        }

        public static User MockUserAndAdd(Core instance)
        {
            User newUser  =  Mock.MockUser(id: (int)instance.identities.allianceId.getNext());
            instance.users.TryAdd(newUser.id, newUser);

            return newUser;
        }


        public static Alliance mockAlliance(int id = allianceId, string name = allianceName)
        {
            Alliance alliance = new Alliance( id, name, "", "", null, 1, null);

            return alliance;
        }


        public static ShipHull mockShipHull(byte ShipHullId = ShipHullId, bool ShipHullisstarbase = ShipHullisstarbase, string ShipHulltypename = ShipHulltypename, int ShipHulllabelname = ShipHulllabelname,
            int ShipHullobjectid = ShipHullobjectid, byte ShipHullmodulescount = ShipHullmodulescount, string ShipHulltemplateimageurl = ShipHulltemplateimageurl, int ShipHulllabel = ShipHulllabel)
        {
            ShipHull shipHull = new ShipHull(ShipHullId, ShipHullisstarbase, ShipHulltypename, ShipHulllabelname, ShipHullobjectid, ShipHullmodulescount, ShipHulltemplateimageurl, ShipHulllabel);
            return shipHull;
        }
        public static ShipHullsModulePosition mockShipHullsModulePosition(byte shiphullid, byte posx, byte posy)
        {
            ShipHullsModulePosition shipHullsModulePosition = new ShipHullsModulePosition();
            return shipHullsModulePosition;
        }
        

        public static ShipTemplate mockShipTemplate( int id = 1,
         int userid = userid,
         byte shiphullid = shiphullid,
         string NAME = NAME,
         string gif = gif,
         int energy = energy,
         int crew = crew,
         byte scanrange = scanrange,
         short attack = attack,
         short defense = defense,
         short hitpoints = hitpoints,
         byte damagereduction = damagereduction,
         short cargoroom = cargoroom,
         short fuelroom = fuelroom,
         int systemmovesperturn = systemmovesperturn,
         int galaxymovesperturn = galaxymovesperturn,
         Decimal systemmovesmax = systemmovesmax,
         Decimal galaxymovesmax = galaxymovesmax,
         int iscolonizer = iscolonizer,
         long population = population,
         int constructionduration = constructionduration,
         bool constructable = constructable,
         int amountbuilt = amountbuilt,
         bool obsolete = obsolete,
         int shiphullsimage = shiphullsimage)
        {
            ShipTemplate template = new ShipTemplate();

            template.userId = userid;
            template.hullid = shiphullid;
            template.name = NAME;
            template.gif = gif;
            template.energy = energy;
            template.crew = crew;
            template.scanRange = scanrange;
            template.attack = attack;
            template.defense = defense;
            template.hitpoints = hitpoints;
            template.damagereduction = damagereduction;
            template.cargoroom = cargoroom;
            template.fuelroom = fuelroom;
            template.systemmovesperturn = systemmovesperturn;
            template.galaxymovesperturn = galaxymovesperturn;
            template.max_impuls = systemmovesmax;
            template.max_hyper = galaxymovesmax;
            template.iscolonizer = iscolonizer;
            template.population = population;
            template.constructionduration = constructionduration;
            template.isConstructable = constructable;
            template.amountbuilt = amountbuilt;
            template.obsolete = obsolete;
            template.shipHullsImage = shiphullsimage;

            return template;
        }
        public static ShipHullsGain mockShipHullsGain(
            byte shiphullid,
            int crew = ModulesStatCrew,
            short energy = ModulesStatEnergy,
            short hitpoints = ModulesStatHitpoints,
            byte damagereduction = ModulesStatDamagereduction,
            short damageoutput = ModulesStatDamageoutput,
            short cargoroom = ModulesStatCargoroom,
            short fuelroom = ModulesStatFuelroom,
            short inspacespeed = ModulesStatInspacespeed,
            short insystemspeed = ModulesStatInsystemspeed,
            decimal maxspacemoves = ModulesStatMaxspacemoves,
            decimal maxsystemmoves = ModulesStatMaxsystemmoves,
            byte scanrange = ModulesStatScanrange,
            int special = ModulesStatSpecial,
            byte weapontype = ModulesStatWeapontype,
            long population = ModulesStatPopulation
            )
        {

            ShipHullsGain moduleGain = new ShipHullsGain(shiphullid, crew, energy, hitpoints, damagereduction, damageoutput,
                cargoroom, fuelroom,
                inspacespeed, insystemspeed, maxspacemoves, maxsystemmoves,
                scanrange, special, population);
            return moduleGain;

        }
 
        public static ModulesGain mockModulesGain(
            short modulesid = ModulesStatModulesid,
            int crew = ModulesStatCrew,
            short energy = ModulesStatEnergy,
            short hitpoints = ModulesStatHitpoints,
            byte damagereduction = ModulesStatDamagereduction,
            short damageoutput = ModulesStatDamageoutput,
            short cargoroom = ModulesStatCargoroom,
            short fuelroom = ModulesStatFuelroom,
            short inspacespeed = ModulesStatInspacespeed,
            short insystemspeed = ModulesStatInsystemspeed,
            decimal maxspacemoves = ModulesStatMaxspacemoves,
            decimal maxsystemmoves = ModulesStatMaxsystemmoves,
            byte scanrange = ModulesStatScanrange,
            int special = ModulesStatSpecial,
            byte weapontype = ModulesStatWeapontype,
            long population = ModulesStatPopulation
            )
        {
            ModulesGain module = new ModulesGain( modulesid , crew , energy , hitpoints , damagereduction , damageoutput ,
                cargoroom , fuelroom ,
                inspacespeed , insystemspeed , maxspacemoves , maxsystemmoves ,
                scanrange , special ,
                weapontype , population);
            return module;
        }
        public static Module mockModule(short id = Moduleid, int descriptionlabel = Moduledescriptionlabel,
            short goodsid = Modulegoodsid, int label = Modulelabel, byte level = Modulelevel)
        {
            Module module = new Module(id, descriptionlabel, goodsid, label, level);
            return module;
        }

        public static ShipTemplateModules mockShipTemplateModules(int shiptemplateid = shiptemplateid, byte posx = posx, byte posy = posy, short moduleid = moduleid)
        {
            ShipTemplateModules shipTemplateModules = new ShipTemplateModules(shiptemplateid, posx, posy, moduleid);
            return shipTemplateModules;

        }

        public static ShipModule mockShipModule( )
        {
            ShipModule module = new ShipModule();
            return module;
        }

        public static Ship mockShip()
        {
            SpacegameServer.Core.ShipBuild builder = new ShipBuild(Core.Instance);

            var hull = mockShipHull();
            hull.ShipHullsModulePositions.Add(Mock.mockShipHullsModulePosition(hull.id, 2, 3));
            hull.ShipHullGain = Mock.mockShipHullsGain(hull.id, crew: 3);
            Core.Instance.ShipHulls[hull.id] = hull;

            int newShipId = (int)Core.Instance.identities.shipLock.getNext();

            Field field = Mock.mockField();
            User user = Mock.MockUser(id: (int)Core.Instance.identities.allianceId.getNext());
            Core.Instance.users.TryAdd(user.id, user);
            int userId = user.id;
            Colony colony = Mock.mockColony(ColonyUserId: userId);
            bool fastBuild = false;

            ShipTemplate template = Mock.mockShipTemplate(shiphullid: hull.id, userid: userId);
            Module crew = Mock.mockModule();
            crew.moduleGain = Mock.mockModulesGain(crew.id, crew: 5);
            Core.Instance.Modules[crew.id] = crew;
            template.shipModules.Add(Mock.mockShipTemplateModules());

            Ship newShip = builder.buildShip(newShipId, template, field, user.id, colony, fastBuild);


            return newShip;
        }

        public static Quest mockQuest(
            int questId = questId)
        {
            Quest MockedQuest = new Quest(questId);

            return MockedQuest;
        }

        public static Research mockResearch(
            short researchid = researchid,
            string objectimageurl = objectimageurl,
            string description = description,
            short cost = cost,
            short baseCost = baseCost,
            int label = label,
            int descriptionlabel = descriptionlabel,
            byte researchtype = researchtype,
            byte treecolumn = treecolumn,
            byte treerow = treerow
            )
        {
            Research research = new Research(researchid ,objectimageurl ,description , cost , baseCost, 
                label ,descriptionlabel , researchtype , treecolumn , treerow );

            return research;
        }

        public static ResearchQuestPrerequisite mockResearchQuestPrerequisite(
            short sourcetype = sourcetype,
            short sourceid = sourceid,
            short targettype = targettype,
            short targetid = targetid                                   
            )
        {
            ResearchQuestPrerequisite researchQuestPrerequisite = new ResearchQuestPrerequisite(sourcetype, sourceid, targettype, targetid);
            return researchQuestPrerequisite;
        }


        public static UserResearch mockUserResearch(int userId = userId, short researchid = researchid)
        {
            UserResearch userResearch = new UserResearch( userId ,  researchid );
            return userResearch;
        }

        public static SolarSystemInstance mockSolarSystemInstance(int planetId = planetid, int planetx = planetx, int planety = planety,
            int planetsystemid = planetsystemid, short planetobjectid = planetobjectid, byte planetdrawsize = planetdrawsize)
        {
            SolarSystemInstance solarSystemInstance = new SolarSystemInstance( planetId, planetx , planety , planetsystemid , planetobjectid , planetdrawsize );        
            return solarSystemInstance;
        }

        public static Colony mockColony(int ColonyId = ColonyId,
         int ColonyUserId = ColonyUserId,
         string NAME = ColonyNAME,
         short storage = storage,
         byte scanRange = scanRange,
         int starid = starid,
         int planetid = planetid,
         int constructionduration = ColonyConstructionduration,
         long population = ColonyPopulation,
         int construction = construction,
         short turnsofrioting = turnsofrioting,            
         Int64 versionId = versionId)
        {
            Colony colony = new Colony();

            colony.id = ColonyId;
            colony.userId = ColonyUserId;
            colony.name = NAME;
            colony.storage = storage;
            colony.scanRange = scanrange;
            colony.starId = starid;
            colony.planetId = planetid;
            colony.constructionDuration = constructionduration;
            colony.population = ColonyPopulation;
            colony.construction = construction;
            colony.turnsOfRioting = turnsofrioting;
            colony.versionId = versionId;

            colony.goods = new List<colonyStock>();
            colony.field = Mock.mockField();
            colony.planet = Mock.mockSolarSystemInstance();            

            return colony;
        }


        public static TradeOffer MockTradeOffer(int tradeId = 1, int commNodeId = 5)
        {
            TradeOffer Trade = new TradeOffer(tradeId);
            Trade.userId = 1;
            Trade.commNodeId = 5;
            Trade.spaceObjectType = 1;
            Trade.spaceObjectId = 23;
            

            TradeOfferGood offer1 = new TradeOfferGood();
            offer1.tradeoffersid = Trade.tradeOfferId;
            offer1.goodsId = 1;
            offer1.amount = 5;
            offer1.offer = true;
            Trade.offered.Add(offer1);

            TradeOfferGood offer2 = new TradeOfferGood();
            offer2.tradeoffersid = Trade.tradeOfferId;
            offer2.goodsId = 2;
            offer2.amount = 10;
            offer2.offer = true;
            Trade.offered.Add(offer2);

            TradeOfferGood request1 = new TradeOfferGood();
            request1.tradeoffersid = Trade.tradeOfferId;
            request1.goodsId = 10;
            request1.amount = 30;
            request1.offer = false;
            Trade.requested.Add(request1);


            return Trade;
        }

    }
}
