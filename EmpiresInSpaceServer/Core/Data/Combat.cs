using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{

    //container class for Combat messages / combat log / game ends evaluation
    public partial class Combat
    {
        private int
            combatId,
            attackerId,
            defenderId,
            attackerUserId,
            defenderUserId,
            starId,
            spaceX,
            spaceY,
            systemX,
            systemY,
            attackerDamageDealt,
            defenderDamageDealt,
            attackerHitPointsRemain,
            defenderHitPointsRemain,
            attackerExperience,
            defenderExperience,
            attackerShipHullId,
            defenderShipHullId,
            attackerShipHullImageId,
            defenderShipHullImageId,
            attackerEvasion,
            attackerMaxHitPoints,
            attackerStartHitpoint,
            defenderEvasion,
            defenderMaxHitPoints,
            defenderStartHitpoint,
            attackerShield,
            defenderShield;

        public string AttackerName { get; set; }
        public string DefenderName { get; set; }

        public bool DefenderHasRead { get; set; }

        public DateTime MessageDT { get; set; }

        public List<CombatRound> CombatRounds;

        public Combat()
        {
        }

        public Combat(int id)
        {
            this.combatId = id;
            this.CombatRounds = new List<CombatRound>();
        }

        public static Combat CloneWORounds(Combat original)
        {
            Combat clone = new Combat(original.combatId);
       
            clone.AttackerId                                    = original.AttackerId ;            
            clone.DefenderId                                    = original.DefenderId ;            
            clone.AttackerUserId                                = original.AttackerUserId   ;      
	        clone.DefenderUserId                                = original.DefenderUserId ;        
            clone.StarId                                        = original.StarId ;               
            clone.SpaceX                                        = original.SpaceX  ;               
            clone.SpaceY                                        = original.SpaceY ;              
            clone.SystemX                                       = original.SystemX ;               
            clone.SystemY                                       = original.SystemY ;               
            clone.AttackerDamageDealt                           = original.AttackerDamageDealt  ;  
            clone.DefenderDamageDealt                           = original.DefenderDamageDealt ;   
            clone.AttackerHitPointsRemain                       = original.AttackerHitPointsRemain;
            clone.DefenderHitPointsRemain                       = original.DefenderHitPointsRemain;

            clone.AttackerName      = original.AttackerName;
            clone.DefenderName      = original.DefenderName;
            clone.DefenderHasRead   = original.DefenderHasRead;
            clone.MessageDT         = original.MessageDT;

            return clone;
        }

        public int CombatId
        {
            get
            {
                return this.combatId;
            }
            set
            {
                if ((this.combatId != value))
                {
                    this.combatId = value;
                }
            }
        }
        public int AttackerId
        {
            get
            {
                return this.attackerId;
            }
            set
            {
                if ((this.attackerId != value))
                {
                    this.attackerId = value;
                }
            }
        }
        public int DefenderId
        {
            get
            {
                return this.defenderId;
            }
            set
            {
                if ((this.defenderId != value))
                {
                    this.defenderId = value;
                }
            }
        }

        public int AttackerUserId
        {
            get
            {
                return this.attackerUserId;
            }
            set
            {
                if ((this.attackerUserId != value))
                {
                    this.attackerUserId = value;
                }
            }
        }
        public int DefenderUserId
        {
            get
            {
                return this.defenderUserId;
            }
            set
            {
                if ((this.defenderUserId != value))
                {
                    this.defenderUserId = value;
                }
            }
        }
        public int StarId
        {
            get
            {
                return this.starId;
            }
            set
            {
                if ((this.starId != value))
                {
                    this.starId = value;
                }
            }
        }
        public int SpaceX
        {
            get
            {
                return this.spaceX;
            }
            set
            {
                if ((this.spaceX != value))
                {
                    this.spaceX = value;
                }
            }
        }
        public int SpaceY
        {
            get
            {
                return this.spaceY;
            }
            set
            {
                if ((this.spaceY != value))
                {
                    this.spaceY = value;
                }
            }
        }
        public int SystemX
        {
            get
            {
                return this.systemX;
            }
            set
            {
                if ((this.systemX != value))
                {
                    this.systemX = value;
                }
            }
        }
        public int SystemY
        {
            get
            {
                return this.systemY;
            }
            set
            {
                if ((this.systemY != value))
                {
                    this.systemY = value;
                }
            }
        } 
        public int AttackerDamageDealt
        {
            get
            {
                return this.attackerDamageDealt;
            }
            set
            {
                if ((this.attackerDamageDealt != value))
                {
                    this.attackerDamageDealt = value;
                }
            }
        }     
        public int DefenderDamageDealt
        {
            get
            {
                return this.defenderDamageDealt;
            }
            set
            {
                if ((this.defenderDamageDealt != value))
                {
                    this.defenderDamageDealt = value;
                }
            }
        }   
        public int AttackerHitPointsRemain
        {
            get
            {
                return this.attackerHitPointsRemain;
            }
            set
            {
                if ((this.attackerHitPointsRemain != value))
                {
                    this.attackerHitPointsRemain = value;
                }
            }
        }
        public int DefenderHitPointsRemain
        {
            get
            {
                return this.defenderHitPointsRemain;
            }
            set
            {
                if ((this.defenderHitPointsRemain != value))
                {
                    this.defenderHitPointsRemain = value;
                }
            }
        }

        public int AttackerExperience
        {
            get
            {
                return this.attackerExperience;
            }
            set
            {
                if ((this.attackerExperience != value))
                {
                    this.attackerExperience = value;
                }
            }
        }

        public int DefenderExperience
        {
            get
            {
                return this.defenderExperience;
            }
            set
            {
                if ((this.defenderExperience != value))
                {
                    this.defenderExperience = value;
                }
            }
        }

         
	      
	        
        public int AttackerShipHullId
        {
            get
            {
                return this.attackerShipHullId;
            }
            set
            {
                if ((this.attackerShipHullId != value))
                {
                    this.attackerShipHullId = value;
                }
            }
        }

        public int DefenderShipHullId
        {
            get
            {
                return this.defenderShipHullId;
            }
            set
            {
                if ((this.defenderShipHullId != value))
                {
                    this.defenderShipHullId = value;
                }
            }
        }

        public int AttackerShipHullImageId
        {
            get
            {
                return this.attackerShipHullImageId;
            }
            set
            {
                if ((this.attackerShipHullImageId != value))
                {
                    this.attackerShipHullImageId = value;
                }
            }
        }

        public int DefenderShipHullImageId
        {
            get
            {
                return this.defenderShipHullImageId;
            }
            set
            {
                if ((this.defenderShipHullImageId != value))
                {
                    this.defenderShipHullImageId = value;
                }
            }
        }

        
        
        

        

        public int AttackerEvasion
        {
            get
            {
                return this.attackerEvasion;
            }
            set
            {
                if ((this.attackerEvasion != value))
                {
                    this.attackerEvasion = value;
                }
            }
        }
        public int AttackerMaxHitPoints
        {
            get
            {
                return this.attackerMaxHitPoints;
            }
            set
            {
                if ((this.attackerMaxHitPoints != value))
                {
                    this.attackerMaxHitPoints = value;
                }
            }
        }
        public int AttackerStartHitpoint
        {
            get
            {
                return this.attackerStartHitpoint;
            }
            set
            {
                if ((this.attackerStartHitpoint != value))
                {
                    this.attackerStartHitpoint = value;
                }
            }
        }
        public int DefenderEvasion
        {
            get
            {
                return this.defenderEvasion;
            }
            set
            {
                if ((this.defenderEvasion != value))
                {
                    this.defenderEvasion = value;
                }
            }
        }
        public int DefenderMaxHitPoints
        {
            get
            {
                return this.defenderMaxHitPoints;
            }
            set
            {
                if ((this.defenderMaxHitPoints != value))
                {
                    this.defenderMaxHitPoints = value;
                }
            }
        }
        public int DefenderStartHitpoint
        {
            get
            {
                return this.defenderStartHitpoint;
            }
            set
            {
                if ((this.defenderStartHitpoint != value))
                {
                    this.defenderStartHitpoint = value;
                }
            }
        }

        public int AttackerShield
        {
            get
            {
                return this.attackerShield;
            }
            set
            {
                if ((this.attackerShield != value))
                {
                    this.attackerShield = value;
                }
            }
        }
        public int DefenderShield
        {
            get
            {
                return this.defenderShield;
            }
            set
            {
                if ((this.defenderShield != value))
                {
                    this.defenderShield = value;
                }
            }
        }


        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "combatId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderId");
            dataTable.AddColumn(System.Type.GetType("System.String"), "attackerName");
            dataTable.AddColumn(System.Type.GetType("System.String"), "defenderName");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerUserId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderUserId");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "starId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "spaceX");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "spaceY");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "systemX");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "systemY");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerDamageDealt");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderDamageDealt");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerHitPointsRemain");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderHitPointsRemain");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "defenderHasRead");

            dataTable.AddColumn(System.Type.GetType("System.DateTime"), "messageDT");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerExperience");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderExperience");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerShipHullId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderShipHullId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerShipHullImageId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderShipHullImageId");
   
            
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerEvasion");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerMaxHitPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerStartHitpoint");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderEvasion");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderMaxHitPoints");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderStartHitpoint");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "attackerShield");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "defenderShield");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                combatId = this.CombatId
                ,
                attackerId = this.AttackerId
                ,
                defenderId = this.DefenderId
                ,
                attackerName = this.AttackerName
                ,
                defenderName = this.DefenderName
                ,
                attackerUserId = this.AttackerUserId
                ,
                defenderUserId = this.DefenderUserId
                ,
                starId = this.StarId
                ,
                spaceX = this.SpaceX
                ,
                spaceY = this.SpaceY
                ,
                systemX = this.SystemX
                ,
                systemY = this.SystemY

                ,
                attackerDamageDealt = this.AttackerDamageDealt
                ,
                defenderDamageDealt = this.DefenderDamageDealt

                ,
                attackerHitPointsRemain = this.AttackerHitPointsRemain
                ,
                defenderHitPointsRemain = this.DefenderHitPointsRemain
                ,
                defenderHasRead = this.DefenderHasRead
                ,
                messageDT = this.MessageDT
                ,
                attackerExperience = this.AttackerExperience
                ,
                defenderExperience = this.DefenderExperience,
                attackerShipHullId = this.AttackerShipHullId,
                defenderShipHullId = this.DefenderShipHullId,
                attackerShipHullImageId = this.AttackerShipHullImageId,
                defenderShipHullImageId = this.DefenderShipHullImageId,

                attackerEvasion         = this.AttackerEvasion,
                attackerMaxHitPoints    = this.AttackerMaxHitPoints,
                attackerStartHitpoint   = this.AttackerStartHitpoint,
                defenderEvasion         = this.DefenderEvasion,
                defenderMaxHitPoints    = this.DefenderMaxHitPoints,
                defenderStartHitpoint   = this.DefenderStartHitpoint,                
                attackerShield          = this.AttackerShield,
                defenderShield          = this.DefenderShield
            };
        }


    }

    //container class for Combat messages / combat log / game ends evaluation
    public partial class CombatRound
    {
        private int combatId,
            roundNumber,
            shotNumber,
            side,
            moduleId,
            damage;
        private double hitPropability;
        private bool   isHit;

        public CombatRound()
        {
        }

        public CombatRound(int combatId, int roundNumber,int shotNumber, int side, int moduleId, int damage, double hitPropability, bool isHit)
        {
            this.CombatId = combatId;
            this.RoundNumber = roundNumber;
            this.ShotNumber = shotNumber;
            this.Side = side;
            this.ModuleId = moduleId;
            this.Damage = damage;
            this.HitPropability = hitPropability;
            this.IsHit = isHit;
        }



        public int CombatId
        {
            get
            {
                return this.combatId;
            }
            set
            {
                if ((this.combatId != value))
                {
                    this.combatId = value;
                }
            }
        }
        public int RoundNumber
        {
            get
            {
                return this.roundNumber;
            }
            set
            {
                if ((this.roundNumber != value))
                {
                    this.roundNumber = value;
                }
            }
        }

        public int ShotNumber
        {
            get
            {
                return this.shotNumber;
            }
            set
            {
                if ((this.shotNumber != value))
                {
                    this.shotNumber = value;
                }
            }
        }
        public int Side
        {
            get
            {
                return this.side;
            }
            set
            {
                if ((this.side != value))
                {
                    this.side = value;
                }
            }
        }       
        public int ModuleId
        {
            get
            {
                return this.moduleId;
            }
            set
            {
                if ((this.moduleId != value))
                {
                    this.moduleId = value;
                }
            }
        }
        public int Damage
        {
            get
            {
                return this.damage;
            }
            set
            {
                if ((this.damage != value))
                {
                    this.damage = value;
                }
            }
        }
        public double HitPropability
        {
            get
            {
                return this.hitPropability;
            }
            set
            {
                if ((this.hitPropability != value))
                {
                    this.hitPropability = value;
                }
            }
        }
        public bool IsHit
        {
            get
            {
                return this.isHit;
            }
            set
            {
                if ((this.isHit != value))
                {
                    this.isHit = value;
                }
            }
        }

        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "combatId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "roundNumber");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "shotNumber");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "side");

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "moduleId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "damage");
            dataTable.AddColumn(System.Type.GetType("System.Decimal"), "hitPropability");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "isHit");
            
            return dataTable;
        }

        public object createData()
        {
            return new
            {
                combatId = this.CombatId
                ,
                roundNumber = this.RoundNumber
                ,
                shotNumber = this.ShotNumber
                ,
                side = this.Side
                ,
                moduleId = this.ModuleId
                ,
                damage = this.Damage
                ,
                hitPropability = this.HitPropability
                ,
                isHit = this.IsHit
            };
        }

    }
}
