using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace SpacegameServer.Core
{
    public partial class Ship : UserSpaceObject, Scanners, AsyncSaveable, AllLockable
    {
        protected static int lockAll = 0;

        public static bool setLockAll()
        {
            if (0 == Interlocked.Exchange(ref lockAll, 1)) return true;
            return false;
        }
        public static void removeLockAll()
        {
            lockAll = 0;
        }

        public int getLockAll()
        {
            return lockAll;
        }

        override public void removeLock()
        {
            try
            {
                if (this.ServerVersionSent != this.ServerVersion)
                {
                    this.ServerVersionSent = this.ServerVersion;
                    this.ShipSerialized = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(this);

                    //this updates the clients instantly, giving them the correct ServerVersion
                    if (Core.Instance.SendShip != null)
                    {
                        var UserIds = this.IsSeenBy();// Core.Instance.users.Select(e => e.Value.id).ToList();
                        object Ship = new { Ship = this.ShipSerialized };
                        Core.Instance.SendShip(Ship, UserIds);
                    }

                    //Some Clients that may be interested in this ship id may not have received the data - most likely because the ship flew out of the scan area
                    //Clients will request it, and most likely receive null and thus delete the object
                    if (Core.Instance.RefreshShip != null)
                    {
                        Core.Instance.RefreshShip(this.id, this.ServerVersion);
                    }
                }
            }
            finally
            {
                base.removeLock();
            }
        }
        private async Task DelayedRefreshShip()
        {
            if (Core.Instance.RefreshShip != null)
            {
                await Task.Delay(1000);
                Core.Instance.RefreshShip(this.id, this.ServerVersion);
            }
           
        }


        public override int GetUserId()
        {
            return userid;
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override User Owner
        {
            get
            {
                return Core.Instance.users.First(e => e.Value.id == userid).Value;
            }
            set
            {
                if ((this.userid != value.id))
                {
                    this.userid = value.id;
                }
            }          
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public override int Id
        {
            get
            {
                return this._id;
            }
            set
            {
                if ((this._id != value))
                {
                    this._id = value;
                }
            }
        }

        public static bool createShipFromTemplate(User user, Ship colonizer, ref Ship newShip, int templateId, string name)
        {
            int newShipId = 0;
            Core core = Core.Instance;
                              
            try
            {
                //add Template 2 to user
                SpacegameServer.Core.ShipTemplate newTemplate = user.getTemplate(templateId, true);

                //create ship
                newShipId = (int)Core.Instance.identities.shipLock.getNext();               
                newShip = new Ship(newShipId);

                //set base values
                newShip.userid = user.id;
                newShip.initFromField(colonizer.field);
                newShip.NAME = name; 
                newShip.systemX = colonizer.systemX;
                newShip.systemY = colonizer.systemY;
               
                //set from template
                newShip.templateid = newTemplate.id;
                newShip.hullid = newTemplate.hullid;
                newShip.objectid = core.ShipHullsImages.First(e => (int)e.shipHullId == (int)newTemplate.hullid).objectId;
                newShip.shipHullsImage = newTemplate.shipHullsImage;// core.ShipHullsImages.First(e => e.shipHullId == newTemplate.hullid).id;
                newShip.addTemplateModules();
                StatisticsCalculator.calc(newShip, Core.Instance);

                //add somemovemementPoints if ship is not stationary
                if (!newShip.isStationary())
                {
                    newShip._rest_hyper = 15;
                    newShip._rest_impuls = 30;
                }

                Core.Instance.ships[newShip.id] = newShip;
                Core.Instance.addShipToField(newShip);
                Core.Instance.users[newShip.userid].ships.Add(newShip);
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return true;
        }

        public static bool createStartingTransporter(User user, Ship colonizer, ref Ship newShip)
        {
            var ret = Ship.createShipFromTemplate(user, colonizer, ref newShip, 1, "@953");

            if (ret)
            {
                newShip._rest_hyper = 21;
                var Antimatter = new shipStock(newShip.id, 61, 5);
                newShip.goods.Add(Antimatter);
            }

            return ret;            
        }

        public static bool CreateNearbyDamagedPirate(User user, Ship colonizer, ref Ship newShip)
        {
            //Fetch Pirate user
            var Pirate = Core.Instance.users.First(e => e.Value.AiRelation == 0).Value;
            if (Pirate == null) return false;

            int newShipId = 0;
            Ship.createPirateShip(Pirate, colonizer.field.x, colonizer.field.y, ref newShipId, ref newShip, colonizer);
                       
            return true;
        }

        public static bool createStartingScout(User user, Ship colonizer, ref Ship scout)
        {
            int newShipId = 0;
            Core core = Core.Instance;

            //create new ship                                
            try
            {
                newShipId = (int)Core.Instance.identities.shipLock.getNext();
                //Ship defSat = new Ship(newShipId);
                scout = new Ship(newShipId);

                scout.userid = user.id;
                scout.FormerOwner = user.id;
                scout.initFromField(core.stars[(int)colonizer.systemid].field);

                //colonizer.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
                scout.hullid = 1;
                scout.objectid = 411;
                
                scout.NAME = "SystemScout";
                scout.shipHullsImage = 1;
                
                scout.systemX = colonizer.systemX;
                scout.systemY = colonizer.systemY;
                /*
                scout.energy = 250;
                scout.crew = 150;
                scout.cargoroom = 1000;
                scout.fuelroom = 50;
                scout.population = 0;
                scout.scanRange = 2;
                scout.colonizer = 0;
                scout.hyper = 20;
                scout.impuls = 100;
                scout.max_hyper = 20;
                scout.max_impuls = 100;
                scout.attack = 20;
                scout.defense = 20;
                scout.hitpoints = 100;
                */
                //add Template 1 (scout) to user
                user.getTemplate(0);
                scout.templateid = 0;

                //Set Modules:
                scout.addTemplateModules();

                StatisticsCalculator.calc(scout, Core.Instance);

                Core.Instance.ships[scout.id] = scout;
                Core.Instance.addShipToField(scout);
                Core.Instance.users[scout.userid].ships.Add(scout);

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return true;
        }

        public static bool createStartingColonyShip(User user, SystemMap star,  ref int newShipId)
        {
            newShipId = 0;
            Core core = Core.Instance;
                                 
            //create new ship                                
            try
            {
                newShipId = (int)Core.Instance.identities.shipLock.getNext();
                Ship colonizer = new Ship(newShipId);

                colonizer.userid = user.id;
                colonizer.FormerOwner = user.id;

                if (core.GalaxyMap.useSolarSystems)
                {
                    colonizer.initFromField(star.field);
                    colonizer.systemX = 1;
                    colonizer.systemY = 1;
                    colonizer.hyper = 0;
                    colonizer.impuls = 200;
                    colonizer.max_hyper = 0;
                    colonizer.max_impuls = 200;
                }
                else
                {
                    colonizer.initFromField(star.field.nextFreeNonSystem());
                    colonizer.hyper = 30;
                    colonizer.impuls = 200;
                    colonizer.max_hyper = 10;
                    colonizer.max_impuls = 200;
                }

                //colonizer.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
                colonizer.hullid = 1;
                colonizer.objectid = 470;
                colonizer.NAME = "Colonizer";               
                colonizer.energy = 250;
                colonizer.crew = 150;
                colonizer.cargoroom = 1000;
                colonizer.fuelroom = 50;
                colonizer.population = 10000;
                colonizer.scanRange = 3;
                colonizer.colonizer = 1;
                

                //add Goods
                colonizer.goods.Add(new shipStock(newShipId, 1, 360)); //BM
                colonizer.goods.Add(new shipStock(newShipId, 2, 230)); //Nahrung
                colonizer.goods.Add(new shipStock(newShipId, 4, 40)); //Treibstoff
                colonizer.goods.Add(new shipStock(newShipId, 5, 20)); // Erz
                colonizer.goods.Add(new shipStock(newShipId, 7, 110)); // Produktionspunkte
                colonizer.goods.Add(new shipStock(newShipId, 10, 100)); // Metall  -> auch für Scout benötigt              


                colonizer.goods.Add(new shipStock(newShipId, 2001, 1)); // modules for galaxyScout... Crew
                colonizer.goods.Add(new shipStock(newShipId, 2002, 1)); // Reactor
                colonizer.goods.Add(new shipStock(newShipId, 2015, 1)); // Scanner 1
                colonizer.goods.Add(new shipStock(newShipId, 2009, 1)); // Impuls
                colonizer.goods.Add(new shipStock(newShipId, 2010, 1)); // Hyper
                colonizer.goods.Add(new shipStock(newShipId, 2008, 1)); // Cargo


                
                //Set Modules:
                colonizer.shipModules.Add(new ShipModule(newShipId, 102, 1, 3));    // Reactor II
                colonizer.shipModules.Add(new ShipModule(newShipId, 101, 2, 2));       // Crew II          
                colonizer.shipModules.Add(new ShipModule(newShipId, 523, 2, 4));    //Colonizing Module III
                colonizer.shipModules.Add(new ShipModule(newShipId, 115, 3, 3));    //Scanner II

                if (Core.Instance.GalaxyMap.useSolarSystems)
                    colonizer.shipModules.Add(new ShipModule(newShipId, 109, 2, 3));    // System Engines II
                else
                    colonizer.shipModules.Add(new ShipModule(newShipId, 110, 2, 3));    // Hyper Engines II

                StatisticsCalculator.calc(colonizer, Core.Instance);

                Core.Instance.ships[colonizer.id] = colonizer;
                Core.Instance.addShipToField(colonizer);
                Core.Instance.users[colonizer.userid].ships.Add(colonizer);

                colonizer.moveDirection = 9;
                                                              
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            
            return true;
        }

        public static bool createPirateShip(User user, int x, int y, ref int newShipId, ref Ship Pirate, Ship startingColonizer = null, byte moveDirection = 200)
        {
            newShipId = 0;
            Core core = Core.Instance;

            //create new ship                                
            try
            {
                newShipId = (int)Core.Instance.identities.shipLock.getNext();
                Pirate = new Ship(newShipId);

                Pirate.userid = user.id;
                //Pirate.initFromField(star.field);

                //colonizer.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
                Pirate.hullid = 1;
                Pirate.objectid = 412;
                Pirate.shipHullsImage = 17;
                Pirate.NAME = "@758"; //Pirate vessel
                Pirate.systemx = null;
                Pirate.systemy = null;
                Pirate.systemid = null;
                Pirate.posX = x;
                Pirate.posY = y;
                Pirate.energy = 250;
                Pirate.crew = 150;
                Pirate.cargoroom = 1000;
                Pirate.fuelroom = 50;
                Pirate.population = 10000;
                Pirate.scanRange = 1;
                Pirate.colonizer = 0;
                Pirate.hyper = 0;
                Pirate.impuls = 200;
                Pirate.max_hyper = 0;
                Pirate.max_impuls = 200;

                //add Goods
                Pirate.goods.Add(new shipStock(newShipId, 1, Lockable.rnd.Next(1, 50))); //BM
                Pirate.goods.Add(new shipStock(newShipId, 2, Lockable.rnd.Next(1, 10))); //Nahrung
                Pirate.goods.Add(new shipStock(newShipId, 10, Lockable.rnd.Next(1, 40))); // Metall  -> auch für Scout benötigt              

                short crewModule = 1;
                short rectorModule = 2;
                short impulsMod = 9;
                short hyperMod = 10;
                short laserMod = 5;

                int randomModule = Lockable.rnd.Next(0, 10);
                switch (randomModule)
                {
                    case 0: Pirate.goods.Add(new shipStock(newShipId, 2001, 1)); crewModule = 1101; break; //Yttrium Crew I
                    case 1: Pirate.goods.Add(new shipStock(newShipId, 2002, 1)); rectorModule = 1102; break; //Lutetium Reactor I
                    case 2: Pirate.goods.Add(new shipStock(newShipId, 3103, 1)); break; //Terbium Hull I
                    case 3: Pirate.goods.Add(new shipStock(newShipId, 3104, 1)); break; //Scandium Shield I
                    case 4: Pirate.goods.Add(new shipStock(newShipId, 2005, 1)); laserMod = 1105; break; //Holmium Laser I
                    case 5: Pirate.goods.Add(new shipStock(newShipId, 3108, 1)); break; //Yttrium Cargo I
                    case 6: Pirate.goods.Add(new shipStock(newShipId, 2009, 1)); impulsMod = 1109; break; //Lutetium System Engines I
                    case 7: Pirate.goods.Add(new shipStock(newShipId, 2010, 1)); hyperMod = 1110; break; //Yttrium Hyper Engines I
                    case 8: Pirate.goods.Add(new shipStock(newShipId, 3115, 1)); break; //Lutetium Scanner I          
                }

                //Set Modules:
                Pirate.shipModules.Add(new ShipModule(newShipId, crewModule, 1, 3));   //0x0
                Pirate.shipModules.Add(new ShipModule(newShipId, rectorModule, 2, 2));   //x00
                Pirate.shipModules.Add(new ShipModule(newShipId, impulsMod, 2, 3));   //0x0
                Pirate.shipModules.Add(new ShipModule(newShipId, hyperMod, 2, 4));  //00x
                Pirate.shipModules.Add(new ShipModule(newShipId, laserMod, 3, 3));   //0x0

                StatisticsCalculator.calc(Pirate, Core.Instance);

                Core.Instance.ships[Pirate.id] = Pirate;
                Core.Instance.addShipToField(Pirate);
                Core.Instance.users[Pirate.userid].ships.Add(Pirate);

                if (startingColonizer != null)
                {
                    if (core.GalaxyMap.useSolarSystems)
                    {
                        Pirate.initFromField(Core.Instance.stars[(int)startingColonizer.systemid].field);

                        Pirate.systemX = 1;
                        Pirate.systemY = 1;

                        //find free world to place the pirate
                        if (Core.Instance.stars[(int)startingColonizer.systemid].planets.Any(planet => planet.ObjectId > 26 && planet.ObjectId < 33))
                        {
                            var PirateBasePlanet = Core.Instance.stars[(int)startingColonizer.systemid].planets.First(planet => planet.ObjectId > 26 && planet.ObjectId < 33);
                            Pirate.systemX = (byte)PirateBasePlanet.x;
                            Pirate.systemY = (byte)PirateBasePlanet.y;
                        }
                    }
                    else
                    {
                        Pirate.initFromField(startingColonizer.field.nextFreeNonSystem());
                    }
                    
                    Pirate.hitpoints = 80;                    
                }

                //write SQL                                              
                Core.Instance.dataConnection.insertShip(Pirate);

                byte direction = (byte)Lockable.rnd.Next(1, 9);
                direction = direction > 4 ? (byte)(direction + 1) : direction;
                Pirate.moveDirection = moveDirection != 200 ? moveDirection : direction;
              

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return true;
        }

        public static bool createPirateFrigate(User user, int x, int y, ref int newShipId, ref Ship Pirate, Ship startingColonizer = null, byte moveDirection = 200)
        {
            newShipId = 0;
            Core core = Core.Instance;

            //create new ship                                
            try
            {
                newShipId = (int)Core.Instance.identities.shipLock.getNext();
                Pirate = new Ship(newShipId);

                Pirate.userid = user.id;
                //Pirate.initFromField(star.field);

                //colonizer.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
                Pirate.hullid = 9;
                Pirate.objectid = 451;
                Pirate.shipHullsImage = 35;
                Pirate.NAME = "@758"; //Pirate vessel
                Pirate.systemx = null;
                Pirate.systemy = null;
                Pirate.systemid = null;
                Pirate.posX = x;
                Pirate.posY = y;
                Pirate.energy = 250;
                Pirate.crew = 150;
                Pirate.cargoroom = 1000;
                Pirate.fuelroom = 50;
                Pirate.population = 10000;
                Pirate.scanRange = 1;
                Pirate.colonizer = 0;
                Pirate.hyper = 0;
                Pirate.impuls = 200;
                Pirate.max_hyper = 0;
                Pirate.max_impuls = 200;

                Pirate.hitpoints = 450;
                Pirate.attack = 160;
                Pirate.defense = 45;

                //add Goods
                Pirate.goods.Add(new shipStock(newShipId, 1, Lockable.rnd.Next(1, 20))); //BM
                Pirate.goods.Add(new shipStock(newShipId, 2, Lockable.rnd.Next(1, 20))); //Nahrung
                Pirate.goods.Add(new shipStock(newShipId, 10, Lockable.rnd.Next(1, 20))); // Metall           
                
                //add 0-4 Special resource 100-200
                short ResNumber = (short)(1040 + Lockable.rnd.Next(0, 5));
                Pirate.goods.Add(new shipStock(newShipId, ResNumber, Lockable.rnd.Next(60, 140))); //Special resources

                //add 1 Level special module lvl 1
                Pirate.goods.Add(new shipStock(newShipId, (short)Lockable.rnd.Next(3101, 3010), 1)); //Special resources
                /*
                shipTemplateId	posX	posY	moduleId
                478	0	4	106
                478	1	3	105
                478	1	4	10
                478	2	2	101
                478	2	3	102
                478	2	4	103
                478	3	3	105
                478	3	4	9
                478	4	4	6
                 * * */

                Pirate.shipModules.Add(new ShipModule(newShipId, 106, 0, 4));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 105, 1, 3));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 10,  1, 4));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 101, 2, 2));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 102, 2, 3));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 103, 2, 4));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 105, 3, 3));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 9,   3, 4));   //
                Pirate.shipModules.Add(new ShipModule(newShipId, 6,   4, 4));   //  

                StatisticsCalculator.calc(Pirate, Core.Instance);

                Core.Instance.ships[Pirate.id] = Pirate;
                Core.Instance.addShipToField(Pirate);
                Core.Instance.users[Pirate.userid].ships.Add(Pirate);

                if (startingColonizer != null)
                {
                    Pirate.initFromField(Core.Instance.stars[(int)startingColonizer.systemid].field);

                    //find free world:
                    var PirateBasePlanet = Core.Instance.stars[(int)startingColonizer.systemid].planets.First(planet => planet.ObjectId > 26 && planet.ObjectId < 33);
                    Pirate.systemX = (byte)PirateBasePlanet.x;
                    Pirate.systemY = (byte)PirateBasePlanet.y;
                    Pirate.hitpoints = 80;
                }

                //write SQL                                              
                Core.Instance.dataConnection.insertShip(Pirate);

                byte direction = (byte)Lockable.rnd.Next(1, 9);
                direction = direction > 4 ? (byte)(direction + 1) : direction;
                Pirate.moveDirection = moveDirection != 200 ? moveDirection : direction;


            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return true;
        }

        private static Ship TransferMock;
        public static Ship createTransferMock()
        {
            if (TransferMock != null) return TransferMock;

            Core core = Core.Instance;
            TransferMock = new Ship(0);

            //create new ship                                
            try
            {
                TransferMock.userid = 0;
                //Pirate.initFromField(star.field);

                //colonizer.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
                TransferMock.hullid = 9;
                TransferMock.objectid = 451;
                TransferMock.shipHullsImage = 35;
                TransferMock.NAME = "@758"; //Pirate vessel
                TransferMock.systemx = null;
                TransferMock.systemy = null;
                TransferMock.systemid = null;
                TransferMock.posX = 0;
                TransferMock.posY = 0;
                TransferMock.energy = 250;
                TransferMock.crew = 150;
                TransferMock.cargoroom = 32000;
                TransferMock.fuelroom = 50;
                TransferMock.population = 10000;
                TransferMock.scanRange = 1;
                TransferMock.colonizer = 0;
                TransferMock.hyper = 0;
                TransferMock.impuls = 200;
                TransferMock.max_hyper = 0;
                TransferMock.max_impuls = 200;

                TransferMock.hitpoints = 450;
                TransferMock.attack = 160;
                TransferMock.defense = 45;

                TransferMock.shipModules.Add(new ShipModule(0, 106, 0, 4));   //
                TransferMock.shipModules.Add(new ShipModule(0, 105, 1, 3));   //
                TransferMock.shipModules.Add(new ShipModule(0, 10, 1, 4));   //
                TransferMock.shipModules.Add(new ShipModule(0, 101, 2, 2));   //
                TransferMock.shipModules.Add(new ShipModule(0, 102, 2, 3));   //
                TransferMock.shipModules.Add(new ShipModule(0, 103, 2, 4));   //
                TransferMock.shipModules.Add(new ShipModule(0, 105, 3, 3));   //
                TransferMock.shipModules.Add(new ShipModule(0, 9, 3, 4));   //
                TransferMock.shipModules.Add(new ShipModule(0, 6, 4, 4));   //  

                StatisticsCalculator.calc(TransferMock, Core.Instance);
                
                Core.Instance.users[TransferMock.userid].ships.Add(TransferMock);
 

                byte direction = (byte)Lockable.rnd.Next(1, 9);
                direction = direction > 4 ? (byte)(direction + 1) : direction;
                TransferMock.moveDirection = direction;

            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }

            return TransferMock;
        }


        public int ExperienceBase()
        {
            return  Core.Instance.ShipHulls[this.hullid].modulesCount * 5;
        }

        public byte ExperienceLevel()
        {
            var baseValue = this.ExperienceBase();

            if (this.Experience < baseValue) return 0;  //green
            if (this.Experience < 2 * baseValue) return 1;//standard  3 
            if (this.Experience < 4 * baseValue) return 2;//veteran  7 
            if (this.Experience < 8 * baseValue) return 3;//elite  13
            return 4;//garde
                       
        }
        public int FullAttack()
        {
            return Core.Instance.ShipHulls[this.hullid].ExperienceLevelModifiers(this.ExperienceLevel()).Item1;
        }

        public short FullDefense()
        {
            //Full defense is the sum of hull Evasion, experience points, systemdrive evasion
            // if the ship is damaged, that value is reduced
            //double DamageRatio = (double)this.CombatStartHitpoint / (double)this.combatMaxHitpoint;
            double DamageRatio = (double)this.hitpoints / (double)this.combatMaxHitpoint;
            double HalvedDamageRatio = 1.0 - ((1.0 - DamageRatio) / 2.0);


            short summedUp =  (short)((short)(Core.Instance.ShipHulls[this.hullid].ExperienceLevelModifiers(this.ExperienceLevel()).Item2 +
                
                (this.max_impuls != 0 ? 
                    (short)Core.Instance.ShipHulls[this.hullid].ShipHullGain.Evasion
                    : 0)) +
                (short)(this.max_impuls / 10));

            return (short)(summedUp * HalvedDamageRatio);
        }

        public void addTemplateModules()
        {
            this.shipModules.Clear();
            foreach (var templateModule in  Core.Instance.shipTemplate[ this.templateid].shipModules)
            {
                this.shipModules.Add(new ShipModule(this.id, templateModule.moduleId, templateModule.posX, templateModule.posY));
            }
        }

        public void setToNextFreeField()
        {
            if (this.systemid != null)
            {
                Tuple<byte, byte> systemXY = this.field.nextFreeInSystem(this.getSystemCoords());

                if (systemXY != null)
                {
                    this.systemx = (byte?)systemXY.Item1;
                    this.systemy = (byte?)systemXY.Item2;
                    return;
                }
            }


            //get next non system field
            Field nextField = this.field.nextFreeNonSystem();
            if (nextField != null)
            {
                this.field.removeShip(this);
                nextField.AddShip(this);
                this.posX = nextField.x;
                this.posY = nextField.y;

                this.systemid = null;
                this.systemx = null;
                this.systemy = null;      
            }
        }

        public Boolean move( byte _direction, int _userId, int _duration, ref byte result, ref string _combatLog, ref Combat Combat, int attackedShipId = 0)
        {

            //GalacticEvents.AddNewEvent(GalacticEventType.FirstResearch, 234, 1);

            //result 1 (Flug Interstellar), 5 (Flug System), 7 Einflug , 8 Ausflug, 14 Angriff,  15 (Schrott)');            

            Ship ship = this;
            Core core = Core.Instance;
            result = 0;
            if (ship.userid != _userId) return false;
            if (ship.systemid == null && ship.hyper <= 0) return false;
            if (ship.systemid != null && ship.impuls <= 0) return false;
            if (ship.systemid != null && ship.field.starId == null) return false;
            if (ship.systemid != null && (ship.systemx == null || ship.systemy == null)) return false;
            if (!Core.Instance.users.ContainsKey(_userId)) return false;
            User shipOwner = Core.Instance.users[_userid];

            Tuple<byte, byte> systemXY = null;// = default(KeyValuePair<short,short>);
            bool isInSystem = false; //where the ship will be after the move
            KeyValuePair<int, int> starXY;
            int targetRegionId = 0;
            Field targetField;

            if (ship.systemid != null)
            {
                SystemMap system = core.stars[(int)ship.field.starId];
                systemXY = core.getDestinationSystemXY(ship, _direction);

                if (systemXY.Item1 >= 0
                    && systemXY.Item2 >= 0
                    && systemXY.Item1 < system.size
                    && systemXY.Item2 < system.size)
                {
                    //System move
                    targetField = ship.field;
                    systemXY = core.getDestinationSystemXY(ship, _direction);
                    isInSystem = true;
                    result = 5;
                }
                else
                {
                    //System leave
                    if (ship.hyper <= 0) return false;
                    result = 8;
                    systemXY = null;
                    starXY = core.getDestinationField(ship, _direction);
                    targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
                    targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);
                    isInSystem = false;
                }
            }
            else
            {
                //star move and possibly system entry
                result = 1;
                isInSystem = false;
                starXY = core.getDestinationField(ship, _direction);
                targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
                targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);
                if (targetField.starId != null && core.stars[(int)targetField.starId].size > 1)
                {
                    systemXY = core.systemEntryXY(_direction, core.stars[(int)targetField.starId].size);
                    isInSystem = true;
                    result = 7;
                }
            }

            // check if enemies are present in the targetField
            Ship enemy = null;

            //Ship Defender = targetField.StrongestEnemyOnField(this, systemXY);
            //enemy = systemXY == null ? core.enemyAtTargetField(targetField, _userId) : core.enemyAtTargetField(targetField, systemXY, _userId);
            enemy = targetField.StrongestEnemyOnField(this, systemXY, attackedShipId);    

            //break if enemy is present, but no offensive weapons are on board:
            if (enemy != null && !ship.shipModules.Any(shipModule => shipModule.module.moduleGain != null && shipModule.module.moduleGain.damageoutput > 0))
            {
                result = 30;
                return false;
            }

            //break if the targetField is in anothers area of influence (borders)
            //and if the current player is Neutral toward that player
            //UserRelations.IsLower(Core.Instance.userRelations.getRelation(attackingShip.userid, ship.userid) , Relation.Neutral)));
            if (targetField.Owner != null
                && targetField.Entity != shipOwner.GetEntity()
                && Core.Instance.userRelations.getRelation(targetField.Owner, shipOwner) == Relation.Neutral)
            {
                result = 31;
                return false;
            }

            Field originField = ship.field;




            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(ship);
            elementsToLock.Add(originField);
            if (targetField.id != originField.id) elementsToLock.Add(targetField);
            if (enemy != null) elementsToLock.Add(enemy);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            try
            {
                //userId may have been changed by another thread, so check it again after locking
                if (ship.userid != _userId)
                {
                    return false;
                }

                this.RemoveAllTrades();

                //ToDo: Check if enemy is now in target Field
                List<AsyncSaveable> toSave;
                ship.moveDirection = _direction;
                if (enemy != null)
                {
                    if (targetField.id != originField.id)
                    {
                        ship.hyper = Math.Max(ship.hyper - 1, 0);
                    }
                    else
                    {
                        ship.impuls = Math.Max(ship.impuls - 1, 0);
                    }

                    result = 14;
                    Combat = new Combat((int)Core.Instance.identities.combat.getNext());
                    Combat.fight(ship, enemy, targetField);

                    //save Combat and both ships
                    Core.Instance.combats[Combat.CombatId] = Combat;
                    Core.Instance.dataConnection.saveCombat(Combat);


                    List<Ship> ShipstoSave = new List<Ship>(2);
                    ShipstoSave.Add(ship);
                    ShipstoSave.Add(enemy);
                    Core.Instance.dataConnection.saveShips(ShipstoSave);

                    /*
                    _combatLog = Core.Instance.dataConnection.combat(ship, enemy, targetField, systemXY);
                    Core.Instance.dataConnection.getShips(core, ship.id, null);
                    Core.Instance.dataConnection.getShips(core, enemy.id, null);
                    */
                    //ship was destroyed                        
                    if (ship.userid != _userId)
                    {
                        result = 15;
                        return false;
                    }

                    //check if enemies remain
                    enemy = null;
                    enemy = systemXY == null ? core.enemyAtTargetField(targetField, _userId) : core.enemyAtTargetField(targetField, systemXY, _userId);
                    if (enemy != null)
                    {
                        return false;
                    }
                }

                //single access is granted, update the data and database
                if (targetField.id != originField.id)
                {
                    int moveCost = 1;
                    if (targetField.starId != null)
                    {
                        moveCost = core.ObjectsOnMap[core.stars[(int)targetField.starId].ObjectId].Movecost;
                        //moveCost = core.ObjectDescriptions[core.stars[(int)targetField.starId].objectid].moveCost;
                        if (core.ObjectsOnMap.ContainsKey(core.stars[(int)targetField.starId].ObjectId))
                        {
                            moveCost = core.ObjectsOnMap[core.stars[(int)targetField.starId].ObjectId].Movecost;
                        }
                    }

                    //star move, possible system entry, possible system leave
                    ship.field.removeShip(ship);
                    targetField.AddShip(ship);
                    ship.field = targetField;
                    ship.posX = targetField.x;
                    ship.posY = targetField.y;
                    ship.hyper = Math.Max(ship.hyper - moveCost, 0);
                    ship.systemid = targetField.starId;
                }

                //system move or system leave
                if (isInSystem)
                {
                    int moveCost = 1;
                    if (targetField.systemObjects.Any(e=>e.x == systemXY.Item1 && e.y == systemXY.Item2))
                    {
                        var systemObject = targetField.systemObjects.First(e=>e.x == systemXY.Item1 && e.y == systemXY.Item2);
                        if (core.ObjectsOnMap.ContainsKey(systemObject.ObjectId))
                        {
                            moveCost = core.ObjectsOnMap[systemObject.ObjectId].Movecost;
                        }
                    }                   

                    ship.systemx = (byte?)systemXY.Item1;
                    ship.systemy = (byte?)systemXY.Item2;
                    ship.impuls = Math.Max(ship.impuls - moveCost, 0);
                }
                else
                {
                    ship.systemx = null;
                    ship.systemy = null;
                    ship.systemid = null;
                }

                //Core.Instance.dataConnection.writeMovement(ship, enemy, _direction);
                //ToDo: the setting of the moveDirection on the shipalready opened one connection/transaction, which was used to insert the new direction. 
                //ToDo: it should be the same transaction/connection for the update of the ship entity
                //ToDo : create an event for other players!
                toSave = new List<AsyncSaveable>();
                toSave.Add(ship);
                Core.Instance.dataConnection.saveAsync(toSave);

            }
            catch (Exception ex)
            {
                Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            
            return true;               
        }

        public static Boolean CheckFleet(List<Ship> fleet, int _userId, bool isHyperDrive)
        {
            //all ships have to be on same position
            //all ships have to be owned by userId
            //no ship may have negative movement points

            int? systemid = null;
            int? systemx = null;
            int? systemy = null;
            int spacex = -1;
            int spacey = -1;

            foreach ( var ship in fleet)
            {
                if (ship.userid != _userId) return false;
                if (isHyperDrive && ship.hyper <= 0) return false;
                if (!isHyperDrive && ship.impuls <= 0) return false;
                if (ship.systemid != null && ship.field.starId == null) return false;
                if (ship.systemid != null && (ship.systemx == null || ship.systemy == null)) return false;
                if (!Core.Instance.users.ContainsKey(_userId)) return false;

                //if ship.systemid is set, systemid is also set and they bot differ, two ships are in different systems and this should not be in a fleet
                if (systemid != null && ship.systemid != null && ship.systemid != systemid) return false;
                systemid = ship.systemid;

                //do the same as with systemid for all coordinates
                if (systemx != null &&  ship.systemx != null && systemx != -1 && ship.systemx != systemx) return false;
                systemx = ship.systemx;

                if (systemy != null && ship.systemy != null && systemy != -1 && ship.systemy != systemy) return false;
                systemy = ship.systemy;

                if ( ship.field != null && spacex != -1 && ship.field.x != spacex) return false;
                spacex = (int)ship.field.x;

                if (ship.field != null && spacey != -1 && ship.field.y != spacey) return false;
                spacey = (int)ship.field.y;
            }

            return true;
        }

        public static void ApplyFleet(Ship ship, List<Ship> fleet )
        {
            foreach (var fleetShip in fleet)
            {
                ship.impuls = Math.Min(ship.impuls, fleetShip.impuls);
                ship.hyper = Math.Min(ship.impuls, fleetShip.hyper);               
            }

            ship.field = fleet.First().field;

        }

        public static Boolean MoveFleet(List<Ship> fleet, byte _direction, int _userId, int _duration, ref byte result, ref string _combatLog, ref Combat Combat, int attackedShipId = 0)
        {
            result = 0;       
            Core core = Core.Instance;

            //create a dummy ship to sum up all available modules
            Ship ship = null;
            var IsFleet = false;
            if (fleet.Count == 1)
            {
                ship = fleet.First();
            }
            else
            {
                IsFleet = true;
                ship = fleet.First().clone();
                ApplyFleet(ship, fleet);
            }
            Field originField = ship.field;


            //fetch target field and set result value
            Tuple<byte, byte> systemXY = null;  // = default(KeyValuePair<short,short>);
            bool isInSystem = false;            // where the ship will be after the move
            KeyValuePair<int, int> starXY;
            int targetRegionId = 0;
            Field targetField;

            if (ship.systemid != null)
            {
                SystemMap system = core.stars[(int)ship.field.starId];
                systemXY = core.getDestinationSystemXY(ship, _direction);

                if (systemXY.Item1 >= 0
                    && systemXY.Item2 >= 0
                    && systemXY.Item1 < system.size
                    && systemXY.Item2 < system.size)
                {
                    //System move
                    targetField = ship.field;
                    systemXY = core.getDestinationSystemXY(ship, _direction);
                    isInSystem = true;
                    result = 5;
                }
                else
                {
                    //System leave
                    if (ship.hyper <= 0) return false;
                    result = 8;
                    systemXY = null;
                    starXY = core.getDestinationField(ship, _direction);
                    targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
                    targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);
                    isInSystem = false;
                }
            }
            else
            {
                //star move and possibly system entry
                result = 1;
                isInSystem = false;
                starXY = core.getDestinationField(ship, _direction);
                targetRegionId = GeometryIndex.calcRegionId(starXY.Key, starXY.Value);
                targetField = GeometryIndex.regions[targetRegionId].findOrCreateField(starXY.Key, starXY.Value);
                if (targetField.starId != null && core.stars[(int)targetField.starId].size > 1)
                {
                    systemXY = core.systemEntryXY(_direction, core.stars[(int)targetField.starId].size);
                    isInSystem = true;
                    result = 7;
                }
            }


            //GalacticEvents.AddNewEvent(GalacticEventType.FirstResearch, 234, 1);

            //result 1 (Flug Interstellar), 5 (Flug System), 7 Einflug , 8 Ausflug, 14 Angriff,  15 (Schrott)');            

            if (!CheckFleet(fleet, _userId, targetField.id != originField.id)) return false;
           
                 
            User shipOwner = Core.Instance.users[_userId];
           
            // check if enemies are present in the targetField
            Ship enemy = null;

            //Ship Defender = targetField.StrongestEnemyOnField(this, systemXY);
            //enemy = systemXY == null ? core.enemyAtTargetField(targetField, _userId) : core.enemyAtTargetField(targetField, systemXY, _userId);
            enemy = targetField.StrongestEnemyOnField(ship, systemXY, attackedShipId);

            //break if enemy is present and fleet movement
            if (enemy != null && IsFleet)
            {
                result = 30;
                return false;
            }

            //break if enemy is present, but no offensive weapons are on board:
            if (enemy != null && !ship.shipModules.Any(shipModule => shipModule.module.moduleGain != null && shipModule.module.moduleGain.damageoutput > 0))
            {
                result = 30;
                return false;
            }
            
            //break if the targetField is in anothers area of influence (borders)
            //and if the current player is Neutral toward that player
            //UserRelations.IsLower(Core.Instance.userRelations.getRelation(attackingShip.userid, ship.userid) , Relation.Neutral)));
            /*
            if (targetField.Owner != null
                && targetField.Entity != shipOwner.GetEntity()
                && Core.Instance.userRelations.getRelation(targetField.Owner, shipOwner) == Relation.Neutral)
            {
                result = 31;
                return false;
            }
            */

            




            List<Lockable> elementsToLock = new List<Lockable>();


            elementsToLock.AddRange(fleet);


            elementsToLock.Add(originField);
            if (targetField.id != originField.id) elementsToLock.Add(targetField);
            if (enemy != null) elementsToLock.Add(enemy);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            try
            {
                //userId may have been changed by another thread, so check it again after locking
                //or battle could have taken place, or one of the ships moved out, or whatever...
                if (!CheckFleet(fleet, _userId, targetField.id != originField.id))
                {
                    LockingManager.unlockAll(elementsToLock);                    
                    return false;
                }

                fleet.ForEach(fleetShip => fleetShip.RemoveAllTrades());
                

                //ToDo: Check if enemy is now in target Field
                //List<AsyncSaveable> toSave;
                //ship.moveDirection = _direction; 
                fleet.ForEach(fleetShip => fleetShip.moveDirection = _direction);
                
                if (enemy != null)
                {
                    if (targetField.id != originField.id)
                    {
                        ship.hyper = Math.Max(ship.hyper - 1, 0);                        
                    }
                    else
                    {
                        ship.impuls = Math.Max(ship.impuls - 1, 0);
                    }

                    result = 14;
                    Combat = new Combat((int)Core.Instance.identities.combat.getNext());
                    Combat.fight(ship, enemy, targetField);

                    //save Combat and both ships
                    Core.Instance.combats[Combat.CombatId] = Combat;
                    Core.Instance.dataConnection.saveCombat(Combat);


                    List<Ship> ShipstoSave = new List<Ship>(2);
                    ShipstoSave.Add(ship);
                    ShipstoSave.Add(enemy);
                    Core.Instance.dataConnection.saveShips(ShipstoSave);

                    /*
                    _combatLog = Core.Instance.dataConnection.combat(ship, enemy, targetField, systemXY);
                    Core.Instance.dataConnection.getShips(core, ship.id, null);
                    Core.Instance.dataConnection.getShips(core, enemy.id, null);
                    */
                    //ship was destroyed                        
                    if (ship.userid != _userId)
                    {
                        result = 15;

                        LockingManager.unlockAll(elementsToLock);
                        //core.removeAllLocks(ship, originField, targetField, enemy);
                        return false;
                    }

                    //check if enemies remain
                    enemy = null;
                    enemy = systemXY == null ? core.enemyAtTargetField(targetField, _userId) : core.enemyAtTargetField(targetField, systemXY, _userId);
                    if (enemy != null)
                    {
                        LockingManager.unlockAll(elementsToLock);
                        //core.removeAllLocks(ship, originField, targetField, enemy);
                        return false;
                    }
                }

                //single access is granted, update the data and database                
                if (targetField.id != originField.id)
                {
                    int moveCost = 1;
                    if (targetField.starId != null)
                    {
                        moveCost = core.ObjectsOnMap[core.stars[(int)targetField.starId].ObjectId].Movecost;
                        //moveCost = core.ObjectDescriptions[core.stars[(int)targetField.starId].objectid].moveCost;
                        if (core.ObjectsOnMap.ContainsKey(core.stars[(int)targetField.starId].ObjectId))
                        {
                            moveCost = core.ObjectsOnMap[core.stars[(int)targetField.starId].ObjectId].Movecost;
                        }
                    }

                    //star move, possible system entry, possible system leave
                    //ship.field.removeShip(ship);
                    fleet.ForEach(fleetShip => fleetShip.field.removeShip(fleetShip));

                    //targetField.AddShip(ship);
                    fleet.ForEach(fleetShip => targetField.AddShip(fleetShip));

                    //ship.field = targetField;
                    fleet.ForEach(fleetShip => fleetShip.field = targetField);

                    //ship.posX = targetField.x;
                    fleet.ForEach(fleetShip => fleetShip.posX = targetField.x);

                    //ship.posY = targetField.y;
                    fleet.ForEach(fleetShip => fleetShip.posY = targetField.y);

                    //ship.hyper = Math.Max(ship.hyper - moveCost, 0);
                    fleet.ForEach(fleetShip => fleetShip.hyper = Math.Max(fleetShip.hyper - moveCost, 0));

                    //ship.systemid = targetField.starId;
                    fleet.ForEach(fleetShip => fleetShip.systemid = targetField.starId);
                }

                //system move or system leave
                if (isInSystem)
                {
                    int moveCost = 1;
                    if (targetField.systemObjects.Any(e => e.x == systemXY.Item1 && e.y == systemXY.Item2))
                    {
                        var systemObject = targetField.systemObjects.First(e => e.x == systemXY.Item1 && e.y == systemXY.Item2);
                        if (core.ObjectsOnMap.ContainsKey(systemObject.ObjectId))
                        {
                            moveCost = core.ObjectsOnMap[systemObject.ObjectId].Movecost;
                        }
                    }

                    //ship.systemx = (byte?)systemXY.Item1;
                    fleet.ForEach(fleetShip => fleetShip.systemx = (byte?)systemXY.Item1);

                    //ship.systemy = (byte?)systemXY.Item2;
                    fleet.ForEach(fleetShip => fleetShip.systemy = (byte?)systemXY.Item2);

                    //ship.impuls = Math.Max(ship.impuls - moveCost, 0);
                    fleet.ForEach(fleetShip => fleetShip.impuls = Math.Max(fleetShip.impuls - moveCost, 0));
                }
                else
                {
                    //ship.systemx = null;
                    fleet.ForEach(fleetShip => fleetShip.systemx = null);

                    //ship.systemy = null;
                    fleet.ForEach(fleetShip => fleetShip.systemy = null);

                    //ship.systemid = null;
                    fleet.ForEach(fleetShip => fleetShip.systemid = null);
                }

                //Core.Instance.dataConnection.writeMovement(ship, enemy, _direction);
                //ToDo: the setting of the moveDirection on the shipalready opened one connection/transaction, which was used to insert the new direction. 
                //ToDo: it should be the same transaction/connection for the update of the ship entity
                //ToDo : create an event for other players!
                
                //toSave = new List<AsyncSaveable>();
                //toSave.Add(ship);
                //toSave.AddRange(fleet);
                //Core.Instance.dataConnection.saveAsync(toSave);

                Core.Instance.dataConnection.saveShips(fleet);

                LockingManager.unlockAll(elementsToLock);
            }
            catch (Exception ex)
            {
                Core.Instance.writeExceptionToLog(ex);
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public void Besiege()
        {
            Ship ship = this;
            Core core = Core.Instance;
            Colony colony;

            //lots of tests:
            if (ship.systemid == null) return;
            if (!ship.isTroopTransport()) return;

            SystemMap system = core.stars[(int)ship.field.starId];
            var systemXY = new Tuple<byte, byte>((byte)(ship.systemX), (byte)(ship.systemy ));
            if (!ship.field.colonies.Any(e => e.SystemX == systemXY.Item1 && e.SystemY == systemXY.Item2)) return;
            colony = ship.field.colonies.First(e => e.SystemX == systemXY.Item1 && e.SystemY == systemXY.Item2);
            if (colony.BesiegedBy != 0) return;            
            if (UserRelations.IsHigher(   Core.Instance.userRelations.getRelation(colony.userId, ship.userid) , Relation.War)) return;
            
            //lock colony, repeat tests,  set besieger
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(colony);
           

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {               
                return;
            }
            try
            {
                //repeat check
                if (colony.BesiegedBy != 0) return;
                if (UserRelations.IsHigher(Core.Instance.userRelations.getRelation(colony.userId, ship.userid), Relation.War)) return;

                colony.BesiegedBy = ship.userid;

                //save colony:
                core.dataConnection.saveColonies(colony);         
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
        }

        /// <summary>
        /// Create a new major colony
        /// </summary>
        /// <param name="_user"></param>
        /// <param name="_newname"></param>
        /// <param name="ships"></param>
        /// <param name="newColony"></param>
        /// <param name="planet"></param>
        private void createMajorColony(User _user, string _newname, ref List<Ship> ships, ref Colony newColony, Colonizable planet)
        {
            Core core = Core.Instance;
            var star = planet.Star;

            int newColonyId;

            newColonyId = (int)core.identities.colonyId.getNext();

            Colony colony = new Colony(newColonyId);
            colony.userId = this.userid;
            colony.name = _newname;
            colony.population = this.shipModules.Sum(shipModule => shipModule.module.moduleGain.population);
            colony.storage = 20;
            colony.starId = star.Id;
            colony.planetId = planet.Id;
            colony.planet = planet;
            colony.scanRange = 2;
           
            core.colonies.TryAdd(newColonyId, colony);
            _user.colonies.Add(colony);
            core.addColonyToField(colony);
            planet.colony = colony;
            newColony = colony;

            star.settled = 1;

            //add goods from ship and some of the special ressource
            foreach (var good in this.goods)
            {
                colony.addGood(good.goodsId, good.amount, true);
            }
            //colony.addGood((short)(star.ressourceid + 1030), 10, true); //add special resource -
            colony.addGood(7, 25, true); //add construction points

            planet.createPlanetSurface(true);
            planet.ColonyId = colony.id;

            //ToDO: create colony HQ
            PlanetSurface surfaceField = planet.freeSurfaceField();
            var buildingId = (int)core.identities.colonyBuildingId.getNext();
            var colModule = this.shipModules.Where(e => e.moduleId == 13 || e.moduleId == 23 || e.moduleId == 523).Select(e => e.moduleId).Max();
            var template = core.Buildings[1];
            if (colModule == 13) template = core.Buildings[30];
            if (colModule == 23) template = core.Buildings[31];

            if (planet.ObjectId > 26)
            {
                template = core.Buildings[ core.PlanetTypes.First(e=>e.objectId == planet.ObjectId).colonyCenter ];
            }
            
            if (planet.ObjectId != 24)
            {
                var centerBuildingId = core.PlanetTypes.First(e => e.objectId == planet.ObjectId).colonyCenter;
                template = core.Buildings[centerBuildingId];
            }

            if (core.PlanetTypes.Any(e => e.objectId == planet.ObjectId && e.shipModuleId == colModule))
            {
                template = core.Buildings[core.PlanetTypes.First(e => e.objectId == planet.ObjectId && e.shipModuleId == colModule).colonyCenter];
            }
            var building = new ColonyBuilding(core, buildingId, colony, template, surfaceField.id, this.userid);

            colony.CalcStorage();
        }

        private void colonizeHomeworld(User _user, string _newname, ref List<Ship> ships, ref Colony newColony, Colonizable planet)
        {
            Core core = Core.Instance;
            var star =  planet.Star;

            this.createMajorColony(_user, _newname, ref ships, ref newColony, planet);
            newColony.scanRange = 4;

            //save surface
            //save colony
            //save colony stock
            //save colony buildings
            Core.Instance.dataConnection.saveColonyFull(planet, newColony);

            //save that this star is now settled
            Core.Instance.dataConnection.saveStarmap(star);

            //create (and save) scout and DefSat              
            Ship createdShip = null;
            //Ship.createStartingScout(_user, this, ref scout);
            //Ship.createStartingDefSat(_user, this, ref scout, 0, "SystemScout");
            Ship.createStartingTransporter(_user, this, ref createdShip);
            Core.Instance.dataConnection.insertShip(createdShip);
            ships.Add(createdShip);

            Ship scout2 = null;
            //Ship.createStartingScout(_user, this, ref scout);
            Ship.createShipFromTemplate(_user, this, ref scout2, 2, "@955");
            Core.Instance.dataConnection.insertShip(scout2);
            ships.Add(scout2);

            Ship defSat = null;
            Ship.createShipFromTemplate(_user, this, ref defSat, 10, "@956");
            Core.Instance.dataConnection.insertShip(defSat);
            ships.Add(defSat);        
    
            Ship Pirate = null;
            Ship.CreateNearbyDamagedPirate(_user, this, ref Pirate);            
            ships.Add(Pirate);  
            
        }

        private void colonizeMajorWorld(User _user, string _newname, ref List<Ship> ships, ref Colony newColony, Colonizable planet)
        {
            Core core = Core.Instance;
            var star = planet.Star;

            this.createMajorColony(_user, _newname, ref ships, ref newColony, planet);

            //save surface
            //save colony
            //save colony stock
            //save colony buildings
            Core.Instance.dataConnection.saveColonyFull(planet, newColony);

            //save that this star is now settled
            Core.Instance.dataConnection.saveStarmap(star);
        }

        /// <summary>
        /// colonize a minor world, which will be part of an already existing colony 
        /// </summary>
        /// <param name="colonyId"></param>
        /// <param name="planet"></param>
        private void colonizeMinorWorld(int colonyId, SolarSystemInstance planet)
        {
            Core core = Core.Instance;
            var star = core.stars[planet.systemid];

            planet.createPlanetSurface(false);

            planet.ColonyId = colonyId;

            //save surface
            Core.Instance.dataConnection.saveMinorColony(planet, colonyId);
        }

        public bool colonize(User _user, string _newname, ref List<Ship> ships, ref Colony newColony, Colonizable planet)
        {
            Core core = Core.Instance;

            if (this.userid != _user.id) return false;
            if (!this.colonizerBool) return false;
            if (core.GalaxyMap.useSolarSystems)
            {
                if (this.systemid == null || this.systemid == 0) return false;
            }
            
            if(planet.colony != null) return false;

            if (core.GalaxyMap.useSolarSystems)
            {
                
            }

            if (!(planet is SystemMap)) return false;

            SystemMap star = planet.Star;

            //check that no other user has a colony in the system
            //var OtherColony = Core.Instance.colonies.Any(e => e.Value.starId == star.id && e.Value.userId != _user.id);
            //if (OtherColony) return false;

            //minor colony: check that another colony for that player is present in this star system
            /*
            var ColonyIsPresent = _user.colonies.Any(e => e.starId == star.id);
            if (!planet.IsMajorPlanet())
            {
                if (!ColonyIsPresent) return false;
            }
            */

            //skip if it is a moon
            if (!planet.IsMajorPlanet()) return false;

            //check that object is colonizable
            if(!core.PlanetTypes.Any(e => e.objectId == planet.ObjectId)) return false;
            //check that player has the right research 
            if(!_user.PlayerResearch.Any(playerResearch => 
                (playerResearch.researchId == (core.PlanetTypes.First(e => e.objectId == planet.ObjectId).researchRequired))
                && playerResearch.isCompleted == 1)) return false;


            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(this);
            elementsToLock.Add(planet);
            elementsToLock.Add(this.field);
            elementsToLock.Add(_user);


            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            try
            {
                //userId may have been changed by another thread, so check it again after locking
                if (this.userid != _user.id || planet.colony != null)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                bool startingColonizer = this.colonizerBool && this.templateid == 0 && this.objectid == 470;

                //starting colonizer may only colonize a homeworld
                if (startingColonizer && !planet.IsMajorPlanet())
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                //differenciate between homeworld, new major colony, additional minor colonies
                if (startingColonizer)
                {
                    this.colonizeHomeworld(_user, _newname, ref ships, ref newColony, planet);
                }
                else
                {
                    this.colonizeMajorWorld(_user, _newname, ref ships, ref newColony, planet);
                } 

                //remove the ship if no minor cololony was added
                if (planet.IsMajorPlanet())
                {
                    this.deleteShip();
                    this.removeShip();
                }   
                
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public bool colonizeOLD(User _user, string _newname, ref List<Ship> ships ,ref Colony newColony, SolarSystemInstance planet)
        {
            Core core = Core.Instance;            
            
            if (this.userid != _user.id) return false;
            if (!this.colonizerBool) return false;
            if (this.systemid == null || this.systemid == 0) return false;         
            if (planet.colony != null) return false;
            
            var star = core.stars[planet.systemid];

            //Todo: check user administration level (currently sql)
            int colonyCount = _user.colonies.Count();

            List<Lockable> elementsToLock = new List<Lockable>(4);
            elementsToLock.Add(this);
            elementsToLock.Add(planet);
            elementsToLock.Add(this.field);
            elementsToLock.Add(_user);


            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }           

            try
            {
                bool startingColonizer = this.colonizerBool && this.templateid == 0 && this.objectid == 470;

                //userId may have been changed by another thread, so check it again after locking
                if (this.userid != _user.id || planet.colony != null)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }

                int newColonyId;
                //send sql - check _xml

                newColonyId = (int)core.identities.colonyId.getNext();

                Colony colony = new Colony(newColonyId);
                colony.userId = this.userid;
                colony.name = _newname;                
                colony.population = this.shipModules.Sum(shipModule => shipModule.module.moduleGain.population);
                colony.storage = 20;
                colony.starId = planet.systemid;
                colony.planetId = planet.id;
                colony.planet = planet;
                colony.scanRange = 2;
                if (startingColonizer) colony.scanRange = 4;
                core.colonies.TryAdd(newColonyId, colony);
                _user.colonies.Add(colony);
                core.addColonyToField(colony);
                planet.colony = colony;
                newColony = colony;

                star.settled = 1;

                //add goods from ship and some of the special ressource
                foreach (var good in this.goods)
                {
                    colony.addGood(good.goodsId, good.amount, true);
                }
                colony.addGood((short)(star.ressourceid + 1030) , 10, true);
                colony.addGood(7, 25, true);

                planet.createPlanetSurface(true);
                planet.ColonyId = colony.id;

                //ToDO: create colony HQ
                PlanetSurface surfaceField = planet.freeSurfaceField();
                var buildingId = (int)core.identities.colonyBuildingId.getNext();
                var colModule = this.shipModules.Where(e => e.moduleId == 13 || e.moduleId == 23 || e.moduleId == 523).Select(e => e.moduleId).Max();                
                var template = core.Buildings[1];
                if (colModule == 13) template = core.Buildings[30];
                if (colModule == 23) template = core.Buildings[31];

                var building = new ColonyBuilding(core, buildingId, colony, template, surfaceField.id, this.userid);               
                
                //save surface
                //save colony
                //save colony stock
                //save colony buildings
                Core.Instance.dataConnection.saveColonyFull(planet, colony);
                
                //save that this star is now settled
                Core.Instance.dataConnection.saveStarmap(star);
                
                //remove ship
                if (planet.IsMajorPlanet()) { 
                    this.deleteShip();
                    this.removeShip();                
                }

                //create (and save) scout and DefSat if needed              
                if (startingColonizer)
                {
                    Ship scout = null;
                    //Ship.createStartingScout(_user, this, ref scout);
                    Ship.createShipFromTemplate(_user, this, ref scout, 0, "SystemScout");                    
                    Core.Instance.dataConnection.insertShip(scout);
                    ships.Add(scout);

                    Ship scout2 = null;
                    //Ship.createStartingScout(_user, this, ref scout);
                    Ship.createShipFromTemplate(_user, this, ref scout2, 0, "SystemScout");
                    Core.Instance.dataConnection.insertShip(scout2);
                    ships.Add(scout2);

                    Ship defSat = null;
                    Ship.createShipFromTemplate(_user, this, ref defSat, 10, "Defense satellite");
                    Core.Instance.dataConnection.insertShip(defSat);
                    ships.Add(defSat);
                }     
                                                                
            }
            catch (Exception ex)
            {
                core.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }
            return true;
        }

        public void RemoveAllTrades()
        {
            var Copy = this.TradeOffers.ToList();
            foreach (var Trade in Copy)
            {
                TradeWorker.DeleteTradeExecute(Trade);
            }
        }

        private void removeShip()
        {
            this.RemoveAllTrades();
            Core.Instance.ships.TryRemove(this.id);
            this.field.removeShip(this);            
            Core.Instance.users[this.userid].removeShip(this);
            this.userid = -1;
            return;
        }

        private void deleteShip()
        {

            List<AsyncDeleteable> toDelete = new List<AsyncDeleteable>();
            toDelete.Add(this);
            Core.Instance.dataConnection.deleteAsyncTransaction(toDelete);
            //DataConnectors.SqlConnector.deleteAsyncTransaction(toDelete);
        }

        private bool canConstructSpaceStation() {  
            
            return true;
        }

        private byte spaceStationHullId()
        {
            foreach (var module in this.shipModules)
            {
                byte hullId = Core.Instance.Modules[module.moduleId].moduleGain.spaceStationHullId;
                if (hullId > 0)
                    return hullId;
            }
            return 0;
        }


        public void initFromField(Field field)
        {
            this.posX = field.x;
            this.posY = field.y;
            this.systemid = Core.Instance.GalaxyMap.useSolarSystems ?  field.starId : null;
            this.field = field;
        }


        public void initSpaceStationFromShip(Ship ship, byte hullId)
        {
            Core core = Core.Instance;
            //assign hull and template
            this.hullid = hullId;
            this.shipHullsImage = core.ShipHulls[this.hullid].ShipHullsImages[0].id;
            this.objectid = core.ShipHulls[this.hullid].ShipHullsImages[0].objectId;
            this.NAME = ship.NAME;
            this.posX = ship.posX;
            this.posY = ship.posY;
            this.systemid = ship.systemid;
            this.systemX = ship.systemX;
            this.systemY = ship.systemY;

            this.energy = 0;
            this.crew = 0;
            this.cargoroom = 0;
            this.fuelroom = 0;
            this.population = 0;
            this.scanRange = 1;
            
            //assign goods
            /*
            foreach (var good in ship.goods)
            {
                this.goods.Add(new shipStock(this.id, good.goodsId, good.amount));
            }
            this.goods.Clear();*/

            //assign modules and moduleStock
            /*
            int spaceStationModuleMax = core.ShipHulls[this.hullid].ShipHullsModulePositions.Count;
            int moduleCount = 0;
            foreach (var shipModule in ship.shipModules)
            {
                if (shipModule.module.moduleGain.spaceStationHullId > 0) continue;

                if (shipModule.module.moduleGain.inSpaceSpeed > 0
                    || shipModule.module.moduleGain.inSystemSpeed > 0)
                {

                    this.addGood(shipModule.module.goodsId, 1);
                }
                else
                {
                    if (moduleCount < spaceStationModuleMax)
                    {
                        ShipModule newModule = new ShipModule();
                        newModule.shipId = this.id;
                        newModule.moduleId = shipModule.moduleId;
                        newModule.hitpoints = 100;
                        newModule.active = true;
                        newModule.posX = core.ShipHulls[this.hullid].ShipHullsModulePositions[moduleCount].posX;
                        newModule.posY = core.ShipHulls[this.hullid].ShipHullsModulePositions[moduleCount].posY;
                        this.shipModules.Add(newModule);
                        moduleCount++;
                    }
                    else
                    {
                        this.addGood(shipModule.module.goodsId, 1);
                    }
                }
            }
             */
        }


        public void initFromColony(Colony colony)
        {
            this.userid = colony.userId;
            this.systemX = (byte)colony.SystemX;
            this.systemY = (byte)colony.SystemY;
            this.systemid = colony.starId;
        }

        public void initFromShip(Ship ship)
        {


        }

        public void initFromTemplate(ShipTemplate template, int shipId)
        {
            this.NAME = template.name;
            this.templateid = template.id;
            this.objectid = Core.Instance.ShipHullsImages.First(e=> e.id == template.shipHullsImage).objectId;
            this.attack = template.attack;
            this.cargoroom = template.cargoroom;
            this.colonizer = template.colonizer;
            this.colonizerBool = template.colonizer == 1 ? true : false;
            this.crew = template.crew;
            this.defense = template.defense;
            this.energy = template.energy;
            this.fuelroom = template.fuelroom;
            this.hitpoints = template.hitpoints;
            this.hullid = template.hullid;
            this.max_hyper = template.max_hyper;
            this.max_impuls = template.max_impuls;
            this.hyper = template.galaxymovesperturn;
            this.impuls = template.systemmovesperturn;
            this.population = template.population;
            this.scanRange = template.scanRange;
            this.shipHullsImage = template.shipHullsImage;

            foreach (var module in template.shipModules)
            {
                this.shipModules.Add(module.createShipModule(shipId));
            }
            //template.shipModules
            
            this.shipHullsImage = template.shipHullsImage;

        }


        //similar to ShipBuild.build2(), but not easily generalizable
        public bool createSpaceStation(User user, ref int newShipId)
        {
            newShipId = 0;
            byte StarBaseHullId = this.spaceStationHullId(); 
            Core core = Core.Instance;
            GalaxyMap galaxyMap = null;
            
            if (this.userid != user.id) return false;
            if (!this.canConstructSpaceStation()) return false;

            //check that no other user has a station on this field yet
            /*
            if (this.field.ships.Any(otherShip => otherShip.userid != this.userid
                        && (otherShip.systemid == null || (otherShip.systemX == this.systemX && otherShip.systemY == this.systemY))
                        && otherShip.isStationary())) return false;
            */


           //if a transcendece construct is to be deployed, check that no other construct is already present:
            if (StarBaseHullId == 220)
           {
               if (this.field.ships.Any(otherShip => otherShip.hullid == 220
                        && (
                            otherShip.systemid == null 
                            || (otherShip.systemX == this.systemX && otherShip.systemY == this.systemY)
                            )
                    )) return false;
           }


            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(this);
            elementsToLock.Add(this.field);

            //check for transcendence //ToDo: replace 220 with a sql data field
            if (hullid == 220 && core.GalaxyMap.transcendenceRequirement == 0)
            {
                galaxyMap = core.GalaxyMap;
                elementsToLock.Add(galaxyMap);
            }

            
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
                       
            //userId may have bene changed by another thread, so check it again after locking
            if (this.userid != user.id)
            {
                LockingManager.unlockAll(elementsToLock);
                return false;
            }

            //create new ship                                
            try
            {
                newShipId = (int)Core.Instance.identities.shipLock.getNext();
                Ship SpaceStation = new Ship(newShipId);


                SpaceStation.userid = this.userid;
                SpaceStation.FormerOwner = this.userid;
                //SpaceStation.initFromTemplate(template, newShip.id);
                SpaceStation.initFromField(field);
                //newShip.initFromColony(colony);
                SpaceStation.initSpaceStationFromShip(this,StarBaseHullId);

                StatisticsCalculator.calc(SpaceStation, Core.Instance);

                Core.Instance.ships[SpaceStation.id] = SpaceStation;
                Core.Instance.addShipToField(SpaceStation);
                Core.Instance.users[SpaceStation.userid].ships.Add(SpaceStation);

                SpaceStation.SetTranscension(galaxyMap);
                
                //add goods from ship
                /*
                foreach (var good in this.goods)
                {
                    SpaceStation.addGood(good.goodsId, good.amount, true);
                }                

                //add modules from ship (except space stations)
                foreach (var module in this.shipModules)
                {
                    if (module.module.moduleGain.special == 3) continue;
                    SpaceStation.addGood(module.module.goodsId, 1, true);
                }
                */

                //remove space stations module
                this.shipModules.RemoveAll(e => e.module.moduleGain.special == 3);
                

                //write SQL                                              
                Core.Instance.dataConnection.insertShip(SpaceStation);


                this.refitCounter = 1;
                this.impuls = 0;
                this.hyper = 0;                

                StatisticsCalculator.calc(this, Core.Instance);

                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                elementsToSave.Add(this);
                Core.Instance.dataConnection.saveAsync(elementsToSave);
                Core.Instance.dataConnection.saveShipModules(this);


                

                //delete in SQL
                //this.deleteShip();

                //remove all traces
                //this.removeShip();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                //release the ressources and return true
                LockingManager.unlockAll(elementsToLock);
            }

            return true;                                       
        }


        private bool RepairCheckGoodsAvailability(Colony colony, double damagedFactor)
        {
            Colony dummy = new Colony(colony.id);
            //add
            foreach (var good in colony.goods)
            {
                dummy.goods.Add(good.clone());
            }

            dummy.goods.RemoveAll(good => good.amount < 0);

            //remove TemplateModules
            foreach (var module in this.shipModules)
            {

                foreach (var costs in Core.Instance.Modules[module.moduleId].ModulesCosts)
                {
                    dummy.addGood(costs.goodsId, (int)Math.Ceiling(damagedFactor * costs.amount) * -1, false);
                }
                
            }
            //and remove shipHullCosts
            foreach (var good in Core.Instance.ShipHulls[this.hullid].ShipHullsCosts)
            {
                dummy.addGood(good.goodsId, (int)Math.Ceiling(damagedFactor * good.amount) * -1, false);
            }

            //check
            if (dummy.goods.Any(good => good.amount < 0))
            {                
                return false;
            }
            return true;
        }

        private void RepairApplyGoodsAvailability(Colony colony, double damagedFactor)
        {

            //remove TemplateModules
            foreach (var module in this.shipModules)
            {

                foreach (var costs in Core.Instance.Modules[module.moduleId].ModulesCosts)
                {
                    colony.addGood(costs.goodsId, (int)Math.Ceiling(damagedFactor * costs.amount) * -1, false);
                }

            }
            //and remove shipHullCosts
            foreach (var good in Core.Instance.ShipHulls[this.hullid].ShipHullsCosts)
            {
                colony.addGood(good.goodsId, (int)Math.Ceiling(damagedFactor * good.amount) * -1, false);
            }            
        }

        public bool Repair(User user, ref Colony colony)
        {
            // Ship can be repaired if:
            // it is owned by player
            // it is damaged
            // it is over a colony of player or ally
            // //the colony has enough goods and also assembly points
            colony = null;
            if (this.userid != user.id) return false;
            if (this.hitpoints >= this.CombatMaxHitpoint) return false;
            if (this.systemid == null) return false;

            Field Field = null;
            Field = this.field;
            var ShipSystemXY = this.getSystemCoords();
            if (!this.field.colonies.Any(e => e.SystemX == ShipSystemXY.Item1 && e.SystemY == ShipSystemXY.Item2)) return false;
            colony = this.field.colonies.First(e => e.SystemX == ShipSystemXY.Item1 && e.SystemY == ShipSystemXY.Item2);
            


            List<Lockable> toLock = new List<Lockable>();
            toLock.Add(this);
            toLock.Add(colony);
            if (!LockingManager.lockAllOrSleep(toLock))
            {
                return false;
            }
            try
            {
                var DamagedFactor =1.0 - ( (double)this.hitpoints / (double)this.CombatMaxHitpoint);
                DamagedFactor = DamagedFactor * 0.75;
                if (this.userid != user.id) return false;
                if (this.hitpoints >= this.CombatMaxHitpoint) return false;
                if (this.systemid == null) return false;
                if (colony.BesiegedBy != 0) return false;

                if (this.userid != colony.userId && UserRelations.IsLower(Core.Instance.userRelations.getRelation(colony.userId, this.userid), Relation.AllianceMember)) return false;

                if (!RepairCheckGoodsAvailability(colony, DamagedFactor)) return false;

                //Apply:
                RepairApplyGoodsAvailability(colony, DamagedFactor);
                this.hitpoints = (short)this.CombatMaxHitpoint;

                byte refit = 1;
                if (DamagedFactor > 0.25) refit = 2;
                if (DamagedFactor > 0.5) refit = 3;
                if (DamagedFactor > 0.75) refit = 4;

                this.refitCounter = refit;
     
                StatisticsCalculator.calc(this, Core.Instance);


                List<Ship> ShipstoSave = new List<Ship>(1);
                ShipstoSave.Add(this);
                Core.Instance.dataConnection.saveShips(ShipstoSave);
                Core.Instance.dataConnection.saveColonyGoods(colony);      
            }
            catch (Exception e)
            {
                Core.Instance.writeExceptionToLog(e);
                return false;
            }
            finally
            {
                //unlock
                LockingManager.unlockAll(toLock);
            }

            return true;           
        }

        //add this ship to the transcensionBase on the same field
        public bool transcensionAdd(User user, out int stationId)
        {
            stationId = 0;
            if (!this.transcensionAddChecks(user)) return false;

            if (Core.Instance.GalaxyMap.gameState != 2) return false;

            Ship station = this.getTranscencenceBaseOnSameField();
            
            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(this);
            elementsToLock.Add(this.field);
            elementsToLock.Add(station);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            //userId may have bene changed by another thread, so check it again after locking
            if (!this.transcensionAddChecks(user))
            {
                LockingManager.unlockAll(elementsToLock);
                return false;
            }

            try
            {

                station.shipTranscension.addShip(this);

                //write SQL                                              
                Core.Instance.dataConnection.saveShipTranscensionUsers(station);

                //delete in SQL
                this.deleteShip();

                //remove all traces
                this.removeShip();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                //release the ressources and return true
                LockingManager.unlockAll(elementsToLock);
            }

            station.shipTranscension.checkFinalization();

            return true;
        }

        private bool transcensionAddChecks(User user)
        {
            Ship station = this.getTranscencenceBaseOnSameField();
            if (this.userid != user.id) return false;
            if (!(this.hullid == 221)) return false; //ToDo: create database field and class field marking hulls as transcendeBuilders            
            if (station == null) return false;
            if (!station.isAllowedTranscendenceHelp(this)) return false;
            return true;
        }

        //check if the helper is allowed to help (diplomatic relations)
        private bool isAllowedTranscendenceHelp(Ship helper)
        {
            if (this.shipTranscension == null) return false;
            
            if(!Core.Instance.users.ContainsKey(helper.userid) || !Core.Instance.users.ContainsKey(this.userid))
                return false;

            User helpUser = Core.Instance.users[helper.userid];
            User TranscendenceOwner = Core.Instance.users[this.userid];


            int currentRelation  = 0;
            if (helper.userid == this.userid)
                currentRelation = 5;
            else
            {
                currentRelation = (int) Core.Instance.userRelations.getRelation(helpUser, TranscendenceOwner);                
            }

            if (this.shipTranscension.helperMinimumRelation <= currentRelation)
                return true;
            else
                return false;
        }

        private Ship getTranscencenceBaseOnSameField()
        {
            Field currentField = this.field;
            foreach (var ship in currentField.ships)
            {
                if (ship.hullid == 220) return ship;
            }
            return null;
        }

        private void addGood(short goodsId, int amount, bool preventNegatives= true)
        {
            bool foundGood = false;
            foreach(var good in this.goods){
                if (good.goodsId == goodsId)
                {
                    foundGood = true;
                    good.amount += amount;
                    break;
                }
            }
            if (foundGood)
            {
                if (preventNegatives)
                    this.goods.RemoveAll(good => good.amount == 0);
            }
            else
                this.goods.Add(new shipStock(this.id, goodsId, amount));

        }
        public void rename(string _newName)
        {
            this.NAME = _newName;

            List<AsyncSaveable> toSave = new List<AsyncSaveable>();
            toSave.Add(this);
            Core.Instance.dataConnection.saveAsync(toSave);
        }

        public bool refit(string xml)
        {
            Core core = Core.Instance;
            List<Lockable> elementsToLock = new List<Lockable>(1);
            elementsToLock.Add(this);
            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }
            try {

                if (this.hitpoints < this.CombatMaxHitpoint) return false;

                //create a dummy ship to sum up all available modules
                Ship DummyShip = new Ship(this.id);
                List<shipStock> allAvailableModules = new List<shipStock>();
                foreach(var good in this.goods)
                {                
                    DummyShip.addGood(good.goodsId, good.amount);
                }
                foreach (var module in this.shipModules)
                {
                    DummyShip.addGood(module.module.goodsId,1);
                }

                //check the xml if the new refitted ship has enough modules to be built:
                XmlDocument doc = new System.Xml.XmlDocument();
                doc.LoadXml(xml);
                XmlNodeList modules = doc.DocumentElement.SelectNodes("/Ship/modulePositions/modulePosition");
                foreach(XmlNode node in modules){
                    string posXS = node.SelectSingleNode("posX").InnerText; //or loop through its children as well
                    string posYS = node.SelectSingleNode("posY").InnerText; //or loop through its children as well
                    string moduleIdS = node.SelectSingleNode("moduleId").InnerText; //or loop through its children as well  

                    byte posX, posY;
                    short moduleId;
                    if (!(Byte.TryParse(posXS, out posX) && Byte.TryParse(posYS, out posY) && Int16.TryParse(moduleIdS, out moduleId)))
                    {
                        LockingManager.unlockAll(elementsToLock);
                        return false;
                    }

                    //check that the module position does exist for the ship hull:
                    if (!Core.Instance.ShipHulls[this.hullid].ShipHullsModulePositions.Any(e => e.posX == posX && e.posY == posY)) return false;

                    ShipModule newModule = new ShipModule();
                    newModule.posX = posX;
                    newModule.posY = posY;
                    newModule.moduleId = moduleId;
                    newModule.shipId = this.id;
                    newModule.active = true;
                    newModule.hitpoints = 20;
                    DummyShip.shipModules.Add(newModule);
                    DummyShip.addGood(newModule.module.goodsId, -1, false);
                }
                if (DummyShip.goods.Count(good => good.amount < 0) > 0)
                {
                    LockingManager.unlockAll(elementsToLock);
                    return false;
                }
 
                //enough goods are available, change now
                //ToDo: Can the references just be added to another list? Shouldn't a copy be made of the objects? is availableGoods deleted afterwards? MemoryLeak? 
                double damageRatio = ((double)this.hitpoints) / ((double)this.CombatMaxHitpoint); 
                this.goods.Clear();
                this.shipModules.Clear();
                foreach (var good in DummyShip.goods)
                {
                    this.goods.Add(good);
                }
                foreach (var module in DummyShip.shipModules)
                {
                    this.shipModules.Add(module);
                }

                this.refitCounter = 4;
                //this.impuls = 0;
                //this.hyper = 0;
                //shipRefit refit = shipRefit.add(this.id);


                StatisticsCalculator.calc(this, Core.Instance);

                if (damageRatio != 1.0)
                {
                    this.hitpoints = (short)(this.hitpoints * damageRatio);
                }

                List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                elementsToSave.Add(this);            
                Core.Instance.dataConnection.saveAsync(elementsToSave);

                //List<AsyncInsertable> elementsToInsert = new List<AsyncInsertable>();
                //elementsToInsert.Add(refit);
                //DataConnectors.SqlConnector.insertAsync(elementsToInsert);

                Core.Instance.dataConnection.saveShipModules(this);
                Core.Instance.dataConnection.saveShipGoods(this);
            }
            finally {
                LockingManager.unlockAll(elementsToLock);
            }
            

            return true;
        }
        public void selfDestruct()
        {
            List<Lockable> elementsToLock = new List<Lockable>(2);
            elementsToLock.Add(this);
            elementsToLock.Add(this.field);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return;
            }
           
            try
            {
                //delete in SQL
                this.deleteShip();

                //remove all traces
                this.removeShip();
            }
            catch (Exception ex)
            {
                SpacegameServer.Core.Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                //release the ressources and return true
                LockingManager.unlockAll(elementsToLock);
            }

        }

        public void SetTranscension(GalaxyMap galaxyMap )
        {
            if (this.hullid == 220)
            {
                this.shipTranscension = new ShipTranscension(this); // will be inserted into DB by After Insert trigger of Ships table

                if (galaxyMap != null)
                {
                    galaxyMap.calcTranscendenceRequirement();
                    List<AsyncSaveable> elementsToSave = new List<AsyncSaveable>();
                    elementsToSave.Add(galaxyMap);
                    Core.Instance.dataConnection.saveAsync(elementsToSave);
                }
            }
        }

        /// <summary>
        /// remove ship, create debris, put some modules and some buildings materials into debris
        /// </summary>
        public void destroy()
        {
            this.RemoveAllTrades(); 
           
            //create scrap by hull
            int scrapAmountPercent = 20 + Lockable.rnd.Next(0, 40) + this.hitpoints;
            if (scrapAmountPercent>0)
            {                
                double val = scrapAmountPercent / 100.0;
                foreach(var cost in Core.Instance.ShipHulls[ this.hullid].ShipHullsCosts)
                {
                    if (Core.Instance.Goods[cost.goodsId].goodsType == 3) continue; //skip energy, assembly, population etc
                    int scrap =(int)(cost.amount * val);
                    this.addGood(cost.goodsId, scrap);
                }
            }

            //create scrap by modules
            foreach (var module in this.shipModules)
            {
                int probability = module.module.id > 1000 ? 25 : 15;

                if (Lockable.rnd.Next(0, 100) < probability)
                {
                    this.addGood(module.module.goodsId, 1);
                }
            }

            //create transzencence scrap:
            if (this.isTranscension())
            {
                int level = this.shipTranscension.amountInvested;
                double scrapMult = level * 0.3;
                foreach(var cost in Core.Instance.ShipHulls[ 221 ].ShipHullsCosts)
                {
                    if (Core.Instance.Goods[cost.goodsId].goodsType == 3) continue; //skip energy, assembly, population etc
                    int scrap =(int)(cost.amount * scrapMult);
                    this.addGood(cost.goodsId, scrap);
                }          
            }

            //Todo: remove Transzendence
            this.shipTranscension = null;

            Core.Instance.users[this.userid].removeShip(this);

            this.max_hyper = 0;
            this.max_impuls = 0;
            this.hyper = 0;
            this.impuls = 0;
            this.userid = 0;
            this.templateid = 0;
            this.objectid = 440;
            this.hullid = 0;
            this.hitpoints = 0;           
            Core.Instance.dataConnection.deleteTradeOfferByObject(0, this.id);
            Core.Instance.dataConnection.saveShipGoods(this);
        }

        public bool isTroopTransport()
        {
            return this.shipModules.Select(e => e.module).Any(mod => mod.moduleGain.special == 2);
           
        }

        public bool isStationary()
        {
            return Core.Instance.ShipHulls[this.hullid].ShipHullGain.special == 3;
            //return this.shipModules.Select(e => e.module).Any(mod => mod.moduleGain.special == 3);
            //return this.hullid == 199 || this.hullid == 200 || this.hullid == 201 || this.hullid == 202 || this.hullid == 203 || this.hullid == 220;
        }

        public bool isTranscension()
        {
            return this.hullid == 220;
        }

        public bool CanTrade()
        {
            SpacegameServer.Core.NodeQuadTree.BoundarySouthWest boundarySouthWest = new SpacegameServer.Core.NodeQuadTree.BoundarySouthWest(this.posX, this.posY);
            SpacegameServer.Core.NodeQuadTree.Bounding NodeQuadTreeBounding = new SpacegameServer.Core.NodeQuadTree.Bounding(boundarySouthWest, 1);
            List<int> nearby = Core.Instance.nodeQuadTree.queryRange(NodeQuadTreeBounding);

            //var node = Core.Instance.commNodes.First().Value;
            //CommunicationNode node;
            if (nearby.Count > 0 && Core.Instance.commNodes.ContainsKey(nearby[0]))
            {
                return true;
                //node = Core.Instance.commNodes[nearby[0]];
            }

            return false;
        }

        public CommunicationNode GetCommNode()
        {
            SpacegameServer.Core.NodeQuadTree.BoundarySouthWest boundarySouthWest = new SpacegameServer.Core.NodeQuadTree.BoundarySouthWest(this.posX, this.posY);
            SpacegameServer.Core.NodeQuadTree.Bounding NodeQuadTreeBounding = new SpacegameServer.Core.NodeQuadTree.Bounding(boundarySouthWest, 1);
            List<int> nearby = Core.Instance.nodeQuadTree.queryRange(NodeQuadTreeBounding);

            //var node = Core.Instance.commNodes.First().Value;
            //CommunicationNode node;
            if (nearby.Count > 0 && Core.Instance.commNodes.ContainsKey(nearby[0]))
            {
                return Core.Instance.commNodes[nearby[0]];
            }

            return null;
        }


        /// <summary>
        /// Gets all users that see this ship
        /// </summary>
        /// <returns></returns>
        public List<int> IsSeenBy()
        {
            List<int> Scanners = new List<int>();
            Scanners.Add(this.userid);
            Scanners.Add(this.FormerOwner);

            List<int> scannedFields = new List<int>();
            this.field.getScanRange(10, scannedFields);

            //detect all ships and colonies on the fields scanned
            foreach (int fieldId in (scannedFields.Distinct()))
            {
                Field currentField = ((Field)GeometryIndex.allFields[fieldId]);
                foreach (Ship ship in currentField.ships)
                {
                    if (this.posX - ship.scanRange <= ship.posX
                        && this.posX + ship.scanRange >= ship.posX
                        && this.posY - ship.scanRange <= ship.posY
                        && this.posY + ship.scanRange >= ship.posY)
                        Scanners.Add(ship.userid);
                }
                                 
                if (currentField.starId != null)
                {                                      
                    foreach (Colony colony in currentField.colonies)
                    {
                        if (this.posX - colony.scanRange <= colony.posX
                        && this.posX + colony.scanRange >= colony.posX
                        && this.posY - colony.scanRange <= colony.posY
                        && this.posY + colony.scanRange >= colony.posY)
                            Scanners.Add(colony.userId);
                    }                    
                }
            }


            return Scanners.Distinct().ToList();
        }

        public double AttackerDefenderRatio(Ship Attacker, CombatField combatField)
        {
            if (this.refitCounter > 0) return 1000;

            double AttackerValue = 0;
            double DefenderValue = 0;
            
            //loop through all attacking modules of attacker
            //calculate their medium damage against the defender
            //take into account AttackingShip-Modifiers, DefendingShip-Modifiers, Field-Modifiers etc
            var shootingModules = 
                Attacker.shipModules.Where(module =>module.module.moduleGain != null &&   module.module.moduleGain.damageoutput > 0)
                .ToList();

            for (int i = 0; i < shootingModules.Count(); i++)
            {
                double ratio = Combat.moduleToHitRatio(shootingModules[i], Attacker, this, 1, combatField);
                double damage = Combat.moduleToDamage(shootingModules[i], Attacker, this, 1, combatField);
                AttackerValue += (ratio * damage * Attacker.hitpoints);
            }

            //loop through the defenders modules and do the same
            shootingModules =
                this.shipModules.Where(module => module.module.moduleGain != null && module.module.moduleGain.damageoutput > 0)
                .ToList();

            for (int i = 0; i < shootingModules.Count(); i++)
            {
                double ratio = Combat.moduleToHitRatio(shootingModules[i], this, Attacker, 0, combatField);
                double damage = Combat.moduleToDamage(shootingModules[i], this, Attacker, 0, combatField);
                DefenderValue += (ratio * damage * this.hitpoints);
            }


            if (AttackerValue == 0) return 0.1;
            if (DefenderValue == 0) return 10;
            return AttackerValue / DefenderValue;
        }
        public override int CalcStorage()
        {
            //storage = colonyBuildings.Where(e => e.isActive).Sum(e => e.building.storage);
            return this.cargoroom;
        }

        public override int AmountOnStock()
        {
            var Amount = 0;
            Amount = this.goods.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 1).Sum(e => e.amount);
            //Fetch Goods that are modules, get the module data, sum up all needed ressoures for these modules.
            Amount += this.goods.Where(good => Core.Instance.Goods[good.goodsId].goodsType == 2).Select(good => new { ModuleDate = Core.Instance.Modules.First(Module => Module != null && Module.goodsId == good.goodsId), Amount = good.amount }).Sum(Modules => Modules.ModuleDate.CargoCost() * Modules.Amount);

            //comparer excludes food. 
            //var comparer = this.goods.Where(good => good.goodsId != 2 && good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8).Sum(e => e.amount);
            //comparer = this.goods.Where(good => good.goodsId != 6 && good.goodsId != 7 && good.goodsId != 8).Sum(e => e.amount);
            
            return Amount;
        }

        /// <summary>
        /// adds a good with amount to the goods list
        /// </summary>
        /// <param name="goodsId"></param>
        /// <param name="amount"></param>
        /// <param name="preventNegatives"></param>
        /// <param name="applyModifiers">Colony and realm modifiers. These are rounded UP! Client sided, some values get the modifiers applied after creating a sum (energy for example), which lead to differences</param>
        /// <param name="reverse">Changes check of positiveAmount</param>
        public override void addGood(short goodsId, int amount, bool preventNegatives = true, bool applyModifiers = false, bool reverse = false)
        {
            bool positiveAmount = reverse ? amount <= 0 : amount > 0;

            bool foundGood = false;
            foreach (var good in this.goods)
            {
                if (good.goodsId == goodsId)
                {
                    foundGood = true;
                    good.amount += amount;
                    break;
                }
            }
            if (foundGood)
            {
                if (preventNegatives)
                    this.goods.RemoveAll(good => good.goodsId == goodsId && good.amount <= 0);
            }
            else
                this.goods.Add(new shipStock(this.id, goodsId, amount));

        }


        /// <summary>
        /// Goods in cargo reduced by those already in trade orders
        /// </summary>
        public List<shipStock> GoodsAvailable()
        {            
            List<shipStock> Available = new List<shipStock>();

            foreach (var good in _good)
            {
                Available.Add(new shipStock(good.shipId, good.goodsId, good.amount));
            }

            foreach (var trade in TradeOffers)
            {
                foreach (var offeredGood in trade.offered)
                {
                    if (!Available.Any(e => e.goodsId == offeredGood.goodsId && e.amount >= offeredGood.amount))
                    {
                        Core.Instance.writeToLog("Ships has Trade offer but not the offered goods on board");
                    }
                    else
                    {
                        Available.First(e => e.goodsId == offeredGood.goodsId).amount -= offeredGood.amount;
                    }
                }
            }

            return Available;            
        }


        public override bool Equals(object obj)
        {
            var ObjectClass = obj.GetType().Name;
            if (ObjectClass != "Ship") return false;
            return this.Id == ((Ship)obj).Id;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

    }

    public partial class ShipTranscension
    {
        private int _shipId;
        private Int16 _helperMinimumRelation;
        private DateTime _constructionDate;
        private int _ressourceCount;
        public int? finishedInTurn;
        public int? finishingNumber;

        
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnore]
        public Ship ship;

        [System.Xml.Serialization.XmlArray(ElementName = "ShipTranscensionUsers")]
        public List<ShipTranscensionUser> shipTranscensionUsers;

        public ShipTranscension()
        {            
        }

        public void addShip(Ship ship)
        {
            this.ressourceCount += 1;
            int index = shipTranscensionUsers.FindIndex(item => item.userId == ship.userid);
            if (index >= 0)
            {
                shipTranscensionUsers[index].helpCount += 1;
            }
            else
            {
                ShipTranscensionUser newUser = new ShipTranscensionUser();
                newUser.shipId = this.shipId;
                newUser.userId = ship.userid;
                newUser.helpCount = 1;
                shipTranscensionUsers.Add(newUser);
            }
        }

        public void checkFinalization()
        {            
            if (this.amountInvested >= Core.Instance.GalaxyMap.transcendenceRequirement && this.finishedInTurn == 0)
            {
                //Core.Instance.finishGame(this.shipId);
                this.finishedInTurn = Core.Instance.GalaxyMap.TurnNumber;
                this.finishingNumber = Core.Instance.ships.Count(e => e.Value.shipTranscension.finishingNumber != null);

                Core.Instance.dataConnection.SaveShipTranscensionTurn(this);
            }
        }

        public static void CheckGameEnd()
        {
            int transcendenceFinishingTurns = (6 * 7 * 3);

            if (Core.Instance.ships.Any(e=> e.Value.shipTranscension != null &&  e.Value.shipTranscension.finishedInTurn + transcendenceFinishingTurns <= Core.Instance.GalaxyMap.TurnNumber))
            {
                //if multiple constructs finished this turn:
                int firstConstruct = (int)Core.Instance.ships
                    .Where(e => 
                        e.Value.shipTranscension != null &&
                        e.Value.shipTranscension.finishedInTurn + (6 * 7 * 3) <= Core.Instance.GalaxyMap.TurnNumber)
                    .Select(e => e.Value.shipTranscension.finishingNumber)
                    .Min();

                Ship finisher = Core.Instance.ships.First(e => e.Value.shipTranscension != null && e.Value.shipTranscension.finishingNumber == firstConstruct).Value;
                Core.Instance.finishGame(finisher.id);
            }
        }

        public ShipTranscension(Ship ship)
        {
            this.shipId = ship.id;
            this.ship = ship;
            this.helperMinimumRelation = 1; // 0 war, 1 peace, 2 trade treaty...
            this.constructionDate = DateTime.Now;
            shipTranscensionUsers = new List<ShipTranscensionUser>();
        }

        public int shipId
        {
            get
            {
                return this._shipId;
            }
            set
            {
                if ((this._shipId != value))
                {
                    this._shipId = value;
                }
            }
        }

        public Int16 helperMinimumRelation
        {
            get
            {
                return this._helperMinimumRelation;
            }
            set
            {
                if ((this._helperMinimumRelation != value))
                {
                    this._helperMinimumRelation = value;
                }
            }
        }

        
        public DateTime constructionDate
        {
            get
            {
                return this._constructionDate;
            }
            set
            {
                if ((this._constructionDate != value))
                {
                    this._constructionDate = value;
                }
            }
        }

        [System.Web.Script.Serialization.ScriptIgnore]
        [System.Xml.Serialization.XmlIgnoreAttribute]
        public string constructionDateJS
        {
            get { return this._constructionDate.ToString("yyyy-MM-dd HH:mm:ss"); }
            set { this._constructionDate = DateTime.Parse(value); }
        }

        public int ressourceCount
        {
            get
            {
                return this._ressourceCount;
            }
            set
            {
                if ((this._ressourceCount != value))
                {
                    this._ressourceCount = value;
                }
            }
        }

        public int amountInvested
        {
            get
            {
                System.Nullable<int> totalhelp = (
                from users in this.shipTranscensionUsers
                select (int)users.helpCount).Sum();

                return totalhelp ?? default(int);
            }
            set { }
        }
        public int transcendenceRequirement
        {
            get
            {
                return Core.Instance.GalaxyMap.transcendenceRequirement;
            }
            set { }
        }
    }

    public partial class ShipTranscensionUser
    {
        private int _shipId;
        private int _userId;
        private Int16 _helpCount;
      
        public int shipId
        {
            get
            {
                return this._shipId;
            }
            set
            {
                if ((this._shipId != value))
                {
                    this._shipId = value;
                }
            }
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            DataColumn column;
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "shipId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int32");
            column.ColumnName = "userId";
            dataTable.Columns.Add(column);

            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Int16");
            column.ColumnName = "helpCount";
            dataTable.Columns.Add(column);
            
            return dataTable;
        }



        public int userId
        {
            get
            {
                return this._userId;
            }
            set
            {
                if ((this._userId != value))
                {
                    this._userId = value;
                }
            }
        }

        public Int16 helpCount
        {
            get
            {
                return this._helpCount;
            }
            set
            {
                if ((this._helpCount != value))
                {
                    this._helpCount = value;
                }
            }
        }


        

    }
    // core additions regarding ships -> 
    // ToDo: Move into Ships class, or another cs file
    public partial class Core : Lockable
    {
        public KeyValuePair<int, int> getDestinationField(Ship ship, int _direction)
        {
            Field currentField = ship.field;

            short xMod = 0,yMod = 0;
            if (_direction % 3 == 0) xMod = 1;
            if (_direction % 3 == 1) xMod = -1;            
            if (_direction > 6) yMod = 1;
            if (_direction < 4) yMod = -1;

            return new KeyValuePair<int, int>(ship.posX + xMod, ship.posY + yMod);           
        }

        public Tuple<byte, byte> systemEntryXY(int _direction, short systemSize)
        {
            Random random = new Random();
            byte systemX = 0;
            if (_direction % 3 == 1) systemX = (byte)(systemSize - 1);
            if (_direction % 3 == 2) systemX = (byte)(systemSize / 2);

            byte systemY = 0;
            if (_direction < 4) systemY = (byte)(systemSize - 1);
            if (_direction > 3 && _direction < 7) systemY = (byte)(systemSize / 2);

            return new Tuple<byte, byte>(systemX, systemY);
        }
        public Tuple<byte, byte> getDestinationSystemXY(Ship ship, int _direction)
        {           
            short xMod = 0;
            switch (_direction % 3){
                case 0:
                    xMod = 1;break;
                case 1:
                    xMod = -1;break;
            }

            short yMod = 0;
            if (_direction > 6) yMod = 1;
            if (_direction < 4) yMod = -1;
            return new Tuple<byte, byte>((byte)(ship.systemX + xMod), (byte)(ship.systemy + yMod));
          
            //KeyValuePair<Field, KeyValuePair<int, int>> destination;// = new KeyValuePair<Field, KeyValuePair<int, int>>();          
        }

        //Todo: Unit Test!
        public Ship strongestEnemyInShipList(List<Ship> _ships, int userId)
        {
            Ship strongestEnemy = null;
          
            if (!Core.Instance.users.ContainsKey(userId)) return null;

            User shipOwner = Core.Instance.users[userId];
            var DefendingShips = _ships.Where(ship => (ship.userid != userId
                        && UserRelations.IsLower(Core.Instance.userRelations.getRelation(userId, ship.userid), Relation.Neutral)));

            foreach (Ship ship in DefendingShips)
            {

                if (strongestEnemy == null || 
                    (strongestEnemy.attack * strongestEnemy.hitpoints) < (ship.attack * ship.hitpoints)) 
                { 
                    strongestEnemy = ship; 
                }
            }

            return strongestEnemy;
        }

        public Ship enemyAtTargetField(Field field, int userId)
        {
            return strongestEnemyInShipList(field.ships , userId);
        }

        

        //ToDo:
        public Ship enemyAtTargetField(Field field, Tuple<byte, byte> systemXY, int userId)
        {

            List<Ship> ships = new List<Ship>();
            foreach (Ship ship in field.ships)
            {
                if (ship.systemx == systemXY.Item1 && ship.systemy == systemXY.Item2) ships.Add(ship);
            }
            return strongestEnemyInShipList(ships, userId);
        }

        public ObjectDescription TargetFieldObject(Field field, Tuple<byte, byte> systemXY)
        {
            //star, nebula etc
            if (systemXY== null)
            {
                if (field.starId == null) return null;
                return this.ObjectDescriptions[this.stars[(int)field.starId].ObjectId];
            }

            //planet, asteroid or other in system stuff
            var x = this.stars[(int)field.starId].planets.Where(e=>e.x == systemXY.Item1 && e.y == systemXY.Item2);
            if (x.Count() > 0) return this.ObjectDescriptions[x.First().ObjectId];

            return null;
        }

        public void removeAllLocks(Ship _ship, Field _originField, Field _targetField, Ship _enemy)
        {
            _ship.removeLock();
            _originField.removeLock();
            if (_targetField.id != _originField.id) _targetField.removeLock();
            if (_enemy != null) _enemy.removeLock();
        }            


        
    }
}
