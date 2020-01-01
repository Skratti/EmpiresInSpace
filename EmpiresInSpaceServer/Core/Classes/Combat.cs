using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class CombatField
    {

        public Field Field;
        public Tuple<byte, byte> SysXY;
        public ObjectDescription combatFieldObjDesc;
        public ObjectOnMap objectOnMap;
        public Dictionary<short, ObjectWeaponModificator> ObjectWeaponModificator;
        public CombatField(Field field, Tuple<byte,byte> sysXY)
        {
            Core core = Core.Instance;
            this.Field = field;
            this.SysXY = sysXY;

            combatFieldObjDesc = Core.Instance.TargetFieldObject(field, sysXY);

            if (combatFieldObjDesc != null)
            {
                objectOnMap = core.ObjectsOnMap.ContainsKey(combatFieldObjDesc.id) ? core.ObjectsOnMap[combatFieldObjDesc.id] : null;
                ObjectWeaponModificator = core.ObjectWeaponModificators.ContainsKey(combatFieldObjDesc.id) ? core.ObjectWeaponModificators[combatFieldObjDesc.id] : null;

            }
        }

    }


    public partial class Combat
    {
        //private ObjectOnMap objectOnMap;
        private CombatField CombatField;

        public static int damageModificator(short damageType, int direction,CombatField combatField)
        {
            if (combatField.ObjectWeaponModificator == null) return 0;
            //get all modificators that apply to the weapon type and the direction of attack ( 1 attacker, 0 defender or 2 both)
            var appliable = combatField.ObjectWeaponModificator.Select(e => e.Value).Where(e => e.damagetype == damageType && (e.applyto == 2 || e.applyto == direction));
            var summed = appliable.Sum(e => e.damagemodificator);
            return summed;
        }

        public static int toHitModificator(short damageType, int direction, CombatField CombatField)
        {
            if (CombatField.ObjectWeaponModificator == null) return 0;
            //get all modificators that apply to the weapon type and the direction of attack ( 1 attacker, 0 defender or 2 both)
            var appliable = CombatField.ObjectWeaponModificator.Select(e => e.Value).Where(e => e.damagetype == damageType && (e.applyto == 2 || e.applyto == direction));
            var summed = appliable.Sum(e => e.tohitmodificator);
            return summed;
        }

        public static List<Combat> getCombatMessages(User user, int fromNr, int toNr, int highestId)
        {
            /*
                problem (as with messages):
                Usersided messages count from 1 (the latest/newest) to @counted (the earliest) the "Nr" have nothing to do with the Id!!!
                @toNr = 150 means that we have to read the last 150 messages, and return those that are >= fromNumber
                @lastMessageId is needed to get newer messages than known during a getMessage-query which requests old messgaes...
                so it would also be possibe to request all messages from  @fromNr = 0 (the last posted) to @toNr = 0 (which means we have no messages defined), and also get all messages bigger than @lastMessageId
            */

            List<Combat> result = new List<Combat>();

            Comparer<Combat> bc = Comparer<Combat>.Create((x, y) => y.combatId.CompareTo(x.combatId)); //x and y switched -> descending order
            var ordered = Core.Instance.combats.Where(e => e.Value.AttackerUserId == user.id || e.Value.DefenderUserId == user.id)
                .OrderBy(e => e.Value, bc) //order by id desc
                .Select((e, index) => new { Message = e, Index = index }).ToList();  //assign index

            result = ordered.Where(e => (e.Index >= fromNr && e.Index < toNr) || (e.Message.Value.combatId > highestId)).Select(e => e.Message.Value).ToList();

            return result;
        }

        public static Combat getCombatRounds(User user, int combatId)
        {

            if (!Core.Instance.combats.ContainsKey(combatId)) return null;
            Combat toFetch = Core.Instance.combats[combatId];

            if (toFetch.AttackerUserId != user.id && toFetch.DefenderUserId != user.id) return null;

            if (toFetch.DefenderUserId == user.id && !toFetch.DefenderHasRead)
            {
                toFetch.DefenderHasRead = true;
                Core.Instance.dataConnection.updateCombatIsRead(toFetch);
            }
            return toFetch;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="module"></param>
        /// <param name="Attacker"></param>
        /// <param name="Defender"></param>
        /// <param name="Field"></param>
        /// <param name="direction">0 : defender, 1 : attacker </param>
        /// <returns></returns>
        public static double moduleToHitRatio(ShipModule module, Ship Attacker, Ship Defender , int direction, CombatField combatField)
        {
            if (Attacker.energy < 0 || Attacker.crew < 0)
            {
                return 0;
            }

            Core core = Core.Instance;
            /*
            var toHitMod = Combat.toHitModificator(module.module.moduleGain.weaponType, direction, combatField);
            int defenseBonus = combatField.objectOnMap != null ? combatField.objectOnMap.defensebonus : 0;
            
            // 50% 
            var HitPropability = (100.0 + toHitMod - Defender.Evasion) /
                                    (200.0 + toHitMod + defenseBonus);
            */


            var HitPropability = (module.module.moduleGain.toHitRatio + Attacker.FullAttack() - Defender.FullDefense()) / 100.0;

            return Math.Max(Math.Min(HitPropability, 1.0),0.01);


            //                  Evasion
            //Scout:        :     80
            //corvette      :     60
            //frigate       :     40
            //destroyer     :     30
            //cruiser       :     20
            //battleship    :     10
            //s-battleship  :      0

            // "Green" crew versus "Green" crew (no bonus whatsoever)
            //Laser  140 to hit ratio - 30 damage:
            //Scout:        : To hit 140 - Evasion 80 -> 60% ->  9 dmg  + (average value - either hit and 20, or not hit and no damage)
            //corvette      : To hit 140 - Evasion 60 -> 80% -> 12 dmg  +
            //frigate       : To hit 140 - Evasion 40 ->100% -> 15 dmg  +-
            //destroyer     : To hit 140 - Evasion 30 ->100% -> 15 dmg  -
            //cruiser       : To hit 140 - Evasion 20 ->100% -> 15 dmg  -
            //battleship    : To hit 140 - Evasion 10 ->100% -> 15 dmg  -
            //s-battleship  : To hit 140 - Evasion  0 ->100% -> 15 dmg  -

            //Rocket  90 to hit ratio - 60 damage :
            //Scout:        : To hit 90 - Evasion 80 -> 10%  -> 3 dmg  -
            //corvette      : To hit 90 - Evasion 60 -> 30% ->  9 dmg  -
            //frigate       : To hit 90 - Evasion 40 -> 50% -> 15 dmg  +-
            //destroyer     : To hit 90 - Evasion 30 -> 60% -> 18 dmg  +
            //cruiser       : To hit 90 - Evasion 20 -> 70% -> 21 dmg  +
            //battleship    : To hit 90 - Evasion 10 -> 80% -> 24 dmg  +-
            //s-battleship  : To hit 90 - Evasion  0 -> 90% -> 27 dmg  -

            //mass driver to hit 50 ratio - 120 dmg:
            //Scout:        : To hit 50 - Evasion 80 -> 1%  ->  1 dmg  -
            //corvette      : To hit 50 - Evasion 60 -> 1%  ->  1 dmg  -
            //frigate       : To hit 50 - Evasion 40 -> 10% ->  6 dmg  -
            //destroyer     : To hit 50 - Evasion 30 -> 20% -> 12 dmg  -
            //cruiser       : To hit 50 - Evasion 20 -> 30% -> 18 dmg  -
            //battleship    : To hit 50 - Evasion 10 -> 40% -> 24 dmg  +-
            //s-battleship  : To hit 50 - Evasion  0 -> 50% -> 30 dmg  +

            //Experience levels
            //                  toHit/evasion
            //                    green         normal          veteran        elite        garde            
            //Scout:        :      0/0           10/5            20/10         30/15        40/20
            //corvette      :      0/0           10/5            20/10         30/15        40/20
            //frigate       :      0/0           10/5            20/10         30/15        40/20
            //destroyer     :      0/0           10/0            20/5          30/10        40/15
            //cruiser       :      0/0           10/0            20/5          30/10        40/15
            //battleship    :      0/0           10/0            20/0          30/5         40/10
            //s-battleship  :      0/0           10/0            20/0          30/0         40/0

            //Elite (+ 30 to hit ) versus Elite (various evasions)
            //Laser 15 damage:
            //Scout:        : To hit 170 - Evasion 95 -> 75% -> 11 dmg  + (average value - either hit and 20, or not hit and no damage)
            //corvette      : To hit 170 - Evasion 75 -> 95% -> 14 dmg  +
            //frigate       : To hit 170 - Evasion 55 ->100% -> 15 dmg  -
            //destroyer     : To hit 170 - Evasion 40 ->100% -> 15 dmg  -
            //cruiser       : To hit 170 - Evasion 30 ->100% -> 15 dmg  -
            //battleship    : To hit 170 - Evasion 15 ->100% -> 15 dmg  -
            //s-battleship  : To hit 170 - Evasion  0 ->100% -> 15 dmg  -

            //Rocket 30 damage:
            //Scout:        : To hit 120 - Evasion 95 -> 25% ->7.5 dmg  -
            //corvette      : To hit 120 - Evasion 75 -> 45% ->13.5dmg  -
            //frigate       : To hit 120 - Evasion 55 -> 65% ->19.5dmg  +
            //destroyer     : To hit 120 - Evasion 40 -> 80% -> 24 dmg  +-
            //cruiser       : To hit 120 - Evasion 30 -> 90% -> 27 dmg  -
            //battleship    : To hit 120 - Evasion 15 ->100% -> 30 dmg  -
            //s-battleship  : To hit 120 - Evasion  0 ->100% -> 30 dmg  -

            //mass driver 60 dmg
            //Scout:        : To hit 80 - Evasion 95 -> 1%  ->  1 dmg  -
            //corvette      : To hit 80 - Evasion 75 -> 5%  ->  3 dmg  -
            //frigate       : To hit 80 - Evasion 55 -> 25% -> 15 dmg  -
            //destroyer     : To hit 80 - Evasion 40 -> 40% -> 24 dmg  +-
            //cruiser       : To hit 80 - Evasion 30 -> 50% -> 30 dmg  +
            //battleship    : To hit 80 - Evasion 15 -> 65% -> 39 dmg  +
            //s-battleship  : To hit 80 - Evasion  0 -> 80% -> 48 dmg  +


        }

        public static int moduleToDamage(ShipModule module, Ship Attacker, Ship Defender, int direction, CombatField combatField)
        {
            if (Attacker.energy < 0 || Attacker.crew < 0)
            {
                return 0;
            }

            var damageMod = Combat.damageModificator(module.module.moduleGain.weaponType, direction, combatField);
            double Damage = module.module.moduleGain.damageoutput;// +damageMod;

            

            /*
             * // Nice rules, but both aren't explained ingame :(
            //Shield reduction (except if scout fights bigShips
            if (Attacker.hullid == 1 &&
                (Defender.hullid == 7 || Defender.hullid == 8 || Defender.hullid == 201 || Defender.hullid == 202))
            {
                //fight against a bigShip
            }
            else
            {
                Damage = Damage * ((100.0 - Defender.damagereduction) / 100);
            }

            //reduce if attacker has no movement points but is nevertheless attacking:
            if (direction == 1)
            {
                if ((combatField.SysXY == null  && Attacker.hyper == 0)
                    || (combatField.SysXY != null && Attacker.impuls == 0))
                {
                    Damage = Damage * 4.0 / 5.0;
                }
            }
            */
            Damage = Damage * ((100.0 - Defender.damagereduction) / 100);
            //remove the above is the block is commented in again


            //reduce by damage of the shooting ship (but only half of it) 
            // f = faktor... 1-(1-f)^1.5 oder sowas //marcgfx: so dass ein bisschen schaden weniger macht
            //double DamageRatio = 1.0 - ((1.0 - ((double)Attacker.CombatStartHitpoint / (double)Attacker.CombatMaxHitpoint)) / 2.0);
            //double DamageRatio = 1.0 - ((1.0 - ((double)Attacker.CombatStartHitpoint / (double)Attacker.CombatMaxHitpoint)) / 2.0);
            //(1-(1-f)^p) //p=1 bisherige rechnung
            var HullHitpoints = Attacker.CombatMaxHitpoint - Core.Instance.ShipHulls[Attacker.hullid].ShipHullGain.hitpoints;
            var DamageRatio = Math.Min((double)Attacker.hitpoints / (double)(Attacker.CombatMaxHitpoint - HullHitpoints), 1.0);
            var HalvedDamageRatio = 1.0 - ((1.0 - DamageRatio) / 2.0);


            Damage = Damage * HalvedDamageRatio;

            return (int)Math.Ceiling(Damage);
        }

        public void fight(Ship Attacker, Ship Defender, Field BattleField)
        {
            Core core = Core.Instance;

            //init values
            this.attackerId = Attacker.id;
            this.defenderId = Defender.id;
            this.attackerUserId  = Attacker.userid;
	        this.defenderUserId  = Defender.userid;
            this.starId = BattleField.starId ?? 0;
            this.spaceX = BattleField.x;
            this.spaceY = BattleField.y;
            this.systemX = Defender.systemX;
            this.systemY = Defender.systemY;
            this.attackerDamageDealt = 0;
            this.defenderDamageDealt = 0;
            this.attackerHitPointsRemain = Attacker.hitpoints;
            this.defenderHitPointsRemain = Defender.hitpoints;
            this.AttackerName = Attacker.NAME;
            this.DefenderName = Defender.NAME;
            this.DefenderHasRead = false;
            this.MessageDT = DateTime.Now;

            this.DefenderShield = Defender.damagereduction;
            this.AttackerShield = Attacker.damagereduction;

            this.AttackerExperience = Attacker.Experience;
            this.DefenderExperience = Defender.Experience;
            this.AttackerShipHullId = Attacker.hullid;
            this.DefenderShipHullId = Defender.hullid;
            this.AttackerShipHullImageId = Attacker.shipHullsImage;
            this.DefenderShipHullImageId = Defender.shipHullsImage;

            this.AttackerEvasion = Attacker.FullDefense();
            this.AttackerMaxHitPoints = Attacker.CombatMaxHitpoint;
            this.attackerStartHitpoint = Attacker.hitpoints;
            Attacker.CombatStartHitpoint = Attacker.hitpoints;           

            this.DefenderEvasion = Defender.FullDefense();
            this.DefenderMaxHitPoints = Defender.CombatMaxHitpoint;
            this.DefenderStartHitpoint = Defender.hitpoints;  
            Defender.CombatStartHitpoint = Defender.hitpoints;



            
            //mock the Tanscendence Defense
            if (Defender.isTranscension())
            {
                Defender.shipModules.Clear();
                Defender.shipModules.Add(new ShipModule(Defender.id, 1105, 1, 1));
                Defender.shipModules.Add(new ShipModule(Defender.id, 1105, 2, 2));
            }


            //get target Field modifiers:
            Tuple<byte, byte> systemXY = null;
            if (  this.starId != 0 && this.systemX != 0 &&  this.systemY != 0){
                systemXY = new Tuple<byte, byte>((byte)(this.systemX ), (byte)(this.systemY));
            }

            this.CombatField = new SpacegameServer.Core.CombatField(BattleField, systemXY);
            /*
            ObjectDescription targetFieldObjDesc = Core.Instance.TargetFieldObject(BattleField, systemXY);
            objectOnMap = null;
            Dictionary<short,ObjectWeaponModificator> ObjectWeaponModificator = null;
            if (targetFieldObjDesc != null)
            {
                objectOnMap = core.ObjectsOnMap.ContainsKey(targetFieldObjDesc.id) ? core.ObjectsOnMap[targetFieldObjDesc.id] : null;
                ObjectWeaponModificator = core.ObjectWeaponModificators.ContainsKey(targetFieldObjDesc.id) ? core.ObjectWeaponModificators[targetFieldObjDesc.id] : null;
            }
            */
            int defenseBonus = this.CombatField.objectOnMap != null ? this.CombatField.objectOnMap.Defensebonus : 0;


            //fight:
            int battleCounter = 0;
            bool defenderFights = true;
            var AttackerEvasion = Attacker.FullDefense() ;

            double HitValue = Lockable.rnd.Next(0, AttackerEvasion + Defender.FullDefense());
            if (HitValue < AttackerEvasion) defenderFights = false;

            while (battleCounter < 100 && Attacker.hitpoints > 0 && Defender.hitpoints > 0)
            {
                if (defenderFights)
                {
                    if (Defender.crew >= 0 && Defender.energy >= 0)
                    {
                        this.createBattleRound(Defender, Attacker, 0, battleCounter, defenderFights);
                    }
                }
                else
                {
                    this.createBattleRound(Attacker, Defender, defenseBonus, battleCounter, defenderFights);
                }
                defenderFights = !defenderFights;
                battleCounter++;
            }
            Attacker.CombatStartHitpoint = Attacker.hitpoints;
            Defender.CombatStartHitpoint = Defender.hitpoints;

            var Systemname = this.starId != 0 ? Core.Instance.stars[this.starId].systemname : "";
            

            if (Attacker.hitpoints <= 0)
            {
                GalacticEvents.AddNewEvent(GalacticEventType.CombatDefenderWins, int1: Attacker.id, int2: Defender.id, int3: Attacker.hullid, int4: Defender.hullid, int5:this.spaceX, int6:this.spaceY, string1: Attacker.NAME, string2: Defender.NAME, string3: Systemname, string4: Attacker.userid.ToString(), string5: Defender.userid.ToString());
                Defender.Experience += Attacker.ExperienceBase();
                Attacker.destroy();
            }

            if (Defender.hitpoints <= 0)
            {
                GalacticEvents.AddNewEvent(GalacticEventType.CombatAttackerWins, int1: Attacker.id, int2: Defender.id, int3: Attacker.hullid, int4: Defender.hullid, int5: this.spaceX, int6: this.spaceY, string1: Attacker.NAME, string2: Defender.NAME, string3: Systemname, string4: Attacker.userid.ToString(), string5: Defender.userid.ToString());
                Attacker.Experience += Defender.ExperienceBase();
                Defender.destroy();                
            }

            if (Core.Instance.users[Attacker.userid].showCombatPopup)
            {
                int x = Attacker.userid;
                core.SendCombat(this, x);
            }

        }

        public void createBattleRound(Ship Shooter, Ship Target , int defenseBonus, int battleCounter, bool defenderFights)
        {
            if (Shooter.refitCounter > 0) return;

            if (!Shooter.shipModules.Any(shipModule => shipModule.module.moduleGain != null && shipModule.module.moduleGain.damageoutput > 0))
            {
                return;
            }

            var shootingModules = 
                Shooter.shipModules.Where(module =>module.module.moduleGain != null &&   module.module.moduleGain.damageoutput > 0)
                .ToList();
           

            for (int i = 0; i < shootingModules.Count();i++)
            {

                var shootingModule = shootingModules[i];
                

                CombatRound round = new CombatRound();
                round.CombatId = this.CombatId;
                round.RoundNumber = battleCounter;
                round.ShotNumber = i;
                round.Side = defenderFights ? 0 : 1;
                round.ModuleId = shootingModules[i].moduleId;


                round.HitPropability = Combat.moduleToHitRatio(shootingModules[i], Shooter, Target, round.Side, this.CombatField);
                round.Damage = (int)Combat.moduleToDamage(shootingModules[i], Shooter, Target, round.Side, this.CombatField);
                
                //create random hitValue and reduce hitpoints
                double HitValue = Lockable.rnd.Next(0, 100) / 100.0;
                if (round.HitPropability > HitValue)
                {
                    round.IsHit = true;
                    Target.hitpoints -= (short)round.Damage;

                    if(defenderFights)
                    {
                        this.AttackerHitPointsRemain -= (short)round.Damage;
                        this.DefenderDamageDealt += round.Damage;
                    } else {
                        this.DefenderHitPointsRemain -= (short)round.Damage;
                        this.AttackerDamageDealt += round.Damage;
                    }

                }
                else
                {
                    round.IsHit = false;
                }

                this.CombatRounds.Add(round);
            }

            
            this.AttackerHitPointsRemain = Math.Max(this.AttackerHitPointsRemain, 0);
            this.DefenderHitPointsRemain = Math.Max(this.DefenderHitPointsRemain, 0);

        }
    }
}
