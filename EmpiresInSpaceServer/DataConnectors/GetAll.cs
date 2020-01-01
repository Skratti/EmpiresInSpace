using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.DataConnectors
{
    public class IndexUser
    {
        public int id;
        public string user_ip;
        public int language;
        public DateTime premiumEnd;
        public int userLevel;
        public string name;
        public string StartingRegion;
    }

    public partial class SqlConnector : DataConnector
    {

        public IndexUser getIndexUser(int userId)
        {
            IndexUser user = null;
            SqlConnection connection = getIndexConnection();
            using (connection)
            {
                string commandText = "getUser";

                try
                {
                    SqlCommand command = new SqlCommand(commandText, connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@userId", userId);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                
                    while (reader.Read())
                    {
                    
                        user = new IndexUser();
                        int id = reader.GetInt32(0);                        
                        user.id = userId;
                        user.user_ip = reader.GetString(1);
                        user.language = reader.GetInt32(2);
                        user.premiumEnd = reader.IsDBNull(3) ? DateTime.Now.AddMonths(-1) :  reader.GetDateTime(3);
                        user.userLevel = reader.GetInt32(4);
                        user.name = reader.GetString(5);
                        user.StartingRegion = reader.IsDBNull(6) ? null : reader.GetString(6);

                        break;
                    }   
             
                    reader.Close();
                }
                catch (Exception ex)
                {
                    //Console.WriteLine("Exception source: {0}", ex.Source);
                    Core.Core.Instance.writeExceptionToLog(ex);
                    
                }
            }
            return user;
        }

        public void getAll(SpacegameServer.Core.Core _core)
        {
            getGameData(_core);            
            getUsersData(_core);
        }
        public void getGameData(SpacegameServer.Core.Core _core)
        {
            #region game data
            getGalaxyData(_core);
            GetTurnEvaluations(_core);
            getSpaceObjects(_core);
            getObjectsOnMap(_core);
            getObjectImages(_core);
            getObjectWeaponModificators(_core);

            getGoods(_core);

            getBuildings(_core);
            getBuildingProductions(_core);
            getBuildingCosts(_core);

            getPlanetTypes(_core);

            getShipHulls(_core);
            getShipHullsGain(_core);
            getShipHullsCosts(_core);
            getShipHullsModulePositions(_core);
            getShipHullsImages(_core);

            getModules(_core);
            getModulesGain(_core);
            getModulesCost(_core);

            getResearchQuestPrerequisites(_core);
            getSurfaceImages(_core);
            getSurfaceTiles(_core);
            getBuildOptions(_core);
            getQuests(_core);
            getResearchs(_core);
            getResearchsGain(_core);

            getSpecializationGroups(_core);
            getSpecializationResearches(_core);

            getObjectRelations(_core);

            getSurfaceDefaultMap(_core);

            getLanguages(_core);
            getLabels(_core);
            #endregion game data


            //MAP
            getStars(_core);
            getSolarSystemInstances(_core);
            getPlanetSurface(_core);
        }

        public void getUsersData(SpacegameServer.Core.Core _core)
        {
            
            getUsers(_core,0 );
            getUserStarMap(_core);            
            getUserQuests(_core, null);
            getUserResearches(_core, null);

            getShipTemplates(_core, 0, null);
            getShipTemplatesModules(_core, null, false);

            getShips(_core, 0, null);
            getShipStock(_core, null, false);
            getShipModules(_core, null, false);
            getShipDirection(_core);
            getShipTranscension(_core);
            getShipTranscensionUsers(_core);

            getColonies(_core);
            getColonyStock(_core, null);
            getColonyBuildings(_core, null);

            getAlliances(_core, null);
            getAllianceMembers(_core);

            getDiplomaticEntityState(_core);
            getAllianceInvites(_core);
            getCommNodes(_core);
            getCommNodeUsers(_core);
            getCommunicationNodeMessage(_core);

            getMessageHeads(_core);
            getMessageParticipants(_core);
            getMessageBody(_core);

            getCombat(_core);
            getCombatRounds(_core);

            getGalaxyEvents(_core);


            getTradeOffers(_core);
            getTradeOfferDetails(_core);

            getRoutes(_core);
            getRouteElements(_core);
            getRouteShips(_core);
            getRouteStopActions(_core);

            getChatLog(_core);


            //ToDO:
            //getShipRefits(_core);
        }

        public void getUsersRefresh(SpacegameServer.Core.Core _core)
        {            
            getShips(_core, 0, null);
            getShipStock(_core, null, true);            
            getColonies(_core);
            getColonyStock(_core, null, true);            
        }


        #region game data
        public void getGalaxyData(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  id,
                    galaxyname, 
		            colonyCount,
                    transcendenceRequirement,
                    gameState,
                    size,
                    winningTranscendenceConstruct,
                    isdemo
                  FROM [engine].[v_GalaxyMap]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.GalaxyMap galaxy = new SpacegameServer.Core.GalaxyMap();

                        galaxy.galaxyName = reader.GetString(1); // reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        galaxy.colonyCount = reader.GetInt32(2);
                        galaxy.transcendenceRequirement = reader.GetInt32(3);
                        galaxy.gameState = reader.GetInt16(4);
                        galaxy.size = reader.GetInt16(5);                        
                        galaxy.winningTranscendenceConstruct = reader.IsDBNull(6) ? 0 : reader.GetInt32(6);

                        galaxy.isdemo = reader.GetBoolean(7);
                        _core.GalaxyMap = galaxy;
                    }
                    catch (Exception ex)
                    {                        
                        _core.writeExceptionToLog(ex);
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void GetTurnEvaluations(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT
                    [turnNumber]
                      ,[evaluationDuration]
                      ,[evaluationDate]
                      ,[playerCount]
                      ,[shipCount]
                      ,[colonyCount]
                      ,[tradesCount]
                  FROM [engine].[v_TurnEvaluation]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.TurnEvaluation TurnEvaluation = new SpacegameServer.Core.TurnEvaluation();
                        TurnEvaluation.TurnNumber = reader.GetInt32(0);
                        TurnEvaluation.EvaluationDuration = reader.GetInt32(1);
                        TurnEvaluation.EvaluationDate = reader.GetDateTime(2);
                        TurnEvaluation.PlayerCount = reader.GetInt32(3);
                        TurnEvaluation.ShipCount = reader.GetInt64(4);
                        TurnEvaluation.ColonyCount = reader.GetInt64(5);
                        TurnEvaluation.TradesCount = reader.GetInt64(6);

                        _core.TurnEvaluations.Add(TurnEvaluation);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getSpaceObjects(SpacegameServer.Core.Core _core)
        {
            try 
            { 
                SqlConnection connection = GetConnection();
                using (connection)
                {
                    SqlCommand command = new SqlCommand(
                      @"SELECT  
                            [id]
                            ,name
                            ,[objectimageurl]          
                            ,versionNo   
		                from [engine].[v_ObjectDescription]",
                      connection);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        try
                        {
                            short id = reader.GetInt16(0);
                            SpacegameServer.Core.ObjectDescription gameGraphic = new SpacegameServer.Core.ObjectDescription(id);
                            gameGraphic.name = reader.GetString(1);
                            gameGraphic.objectimageUrl = reader.GetString(2);
                            gameGraphic.versionNo = reader.GetInt32(3);
                            _core.ObjectDescriptions[id] = gameGraphic;
                        }
                        catch (Exception e)
                        {
                            //Console.WriteLine("Exception source: {0}", e.Source);
                            Core.Core.Instance.writeExceptionToLog(e);
                            break;
                        }
                    }

                    reader.Close();
                }
            }
            catch (Exception e)
            {
                Core.Core.Instance.writeExceptionToLog(e);
            }
        }

        public void getObjectsOnMap(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                        [id]
                          ,[movecost]
                          ,[damage]
                          ,[damagetype]
                          ,[damageprobability]
                          ,[damageprobabilityreducablebyship]
                          ,[defensebonus]
                          ,[fieldsize]    
                           ,[label]       
		            from [engine].[v_ObjectOnMap]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {

                        SpacegameServer.Core.ObjectOnMap ObjectOnMap = new SpacegameServer.Core.ObjectOnMap();

                        ObjectOnMap.Id = reader.GetInt16(0);
                        ObjectOnMap.Movecost = reader.GetByte(1);
                        ObjectOnMap.Damage = reader.GetInt16(2);
                        ObjectOnMap.Damagetype = reader.IsDBNull(3) ? null : (short?)reader.GetInt16(3);
                        ObjectOnMap.Damageprobability = reader.GetInt16(4);
                        ObjectOnMap.Damageprobabilityreducablebyship = reader.GetBoolean(5);
                        ObjectOnMap.Defensebonus = reader.GetByte(6);
                        ObjectOnMap.Fieldsize = reader.GetByte(7);

                        ObjectOnMap.Label = reader.GetInt32(8);  
                        _core.ObjectsOnMap[ObjectOnMap.Id] = ObjectOnMap;
                    }
                    catch (Exception e)
                    {

                        Core.Core.Instance.writeExceptionToLog(e);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getObjectImages(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  [objectId]
                          ,[imageId]
                          ,[drawSize]
                          ,[BackgroundObjectId]
                          ,[BackgroundDrawSize]
                          ,[TilestartingAt]
                          ,[surfaceDefaultMapId]
                      FROM [engine].[v_ObjectImages]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {

                        SpacegameServer.Core.ObjectImage ObjectImage = new SpacegameServer.Core.ObjectImage();

                        ObjectImage.ObjectId = reader.GetInt16(0);
                        ObjectImage.ImageId = reader.GetInt16(1);

                        ObjectImage.Drawsize = reader.GetFloat(2);
                        ObjectImage.BackgroundObjectId = reader.IsDBNull(3) ? null : (short?)reader.GetInt16(3);
                        ObjectImage.BackgroundDrawSize = reader.IsDBNull(4) ? null : (byte?)reader.GetByte(4);
                        ObjectImage.TilestartingAt = reader.IsDBNull(5) ? null : (byte?)reader.GetByte(5);
                        ObjectImage.SurfaceDefaultMapId = reader.IsDBNull(6) ? null : (short?)reader.GetInt16(6);


                        _core.ObjectsOnMap[ObjectImage.ObjectId].ObjectImages.Add(ObjectImage);
                    }
                    catch (Exception e)
                    {
                        Core.Core.Instance.writeExceptionToLog(e);
                        break;
                    }
                }

                reader.Close();
            }
        }  

        public void getObjectWeaponModificators(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                           [objectid]
                          ,[damagetype]
                          ,[damagemodificator]
                          ,[tohitmodificator]
                          ,[applyto]              
		            from [engine].[v_ObjectWeaponModificators] ",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ObjectWeaponModificator WeaponMod = new SpacegameServer.Core.ObjectWeaponModificator();

                        WeaponMod.objectid = reader.GetInt16(0);
                        WeaponMod.damagetype = reader.GetInt16(1);
                        WeaponMod.damagemodificator = reader.GetInt16(2);
                        WeaponMod.tohitmodificator = reader.GetInt16(3);
                        WeaponMod.applyto = reader.GetByte(4);

                        if (_core.ObjectWeaponModificators.ContainsKey(WeaponMod.objectid))
                        {
                            _core.ObjectWeaponModificators[WeaponMod.objectid][WeaponMod.damagetype] = WeaponMod;
                        }
                        else
                        {
                            _core.ObjectWeaponModificators[WeaponMod.objectid] = new Dictionary<short, Core.ObjectWeaponModificator>();
                            _core.ObjectWeaponModificators[WeaponMod.objectid][WeaponMod.damagetype] = WeaponMod;
                        }
                    }
                    catch (Exception e)
                    {
                        Core.Core.Instance.writeExceptionToLog(e);
                        break;
                    }
                }

                reader.Close();
            }
        }


        public  void getGoods(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[NAME]
                      ,[objectdescriptionid]
                      ,[goodstype]
                      ,[label]
                      ,prodLevel
                  FROM [engine].[v_Goods]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.Good Good = new SpacegameServer.Core.Good(id);

                        Good.name = reader.GetString(1); // reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        Good.objectDescriptionId = reader.GetInt16(2);
                        Good.goodsType = reader.GetInt16(3);
                        Good.label = reader.GetInt32(4);
                        Good.prodLevel = reader.GetByte(5);
                        _core.Goods[id] = Good;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }
       
        public  void getBuildings(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[objectid]
                      ,[buildingscript]
                      ,[oncepercolony]
                      ,[isbuildable]
                      ,[visibilityneedsgoods]
                      ,[groupid]
                      ,[prodqueuelevel]
                      ,[label]
                      ,[housing]
                      ,[storage]
		              ,researchModifier 
		              ,assemblyModifier 
		              ,energyModifier 
		              ,housingModifier 
		              ,foodModifier 
		              ,productionModifier
		              ,growthModifier
                      ,allowedMines
                      ,allowedChemicals
                      ,allowedFuel
                  FROM [engine].[v_Buildings]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.Building building = new SpacegameServer.Core.Building(id);
                        building.objectId = reader.GetInt16(1);
                        if (!reader.IsDBNull(2))
                        {
                            building.BuildingScript = reader.GetString(2);
                        }                        
                        building.oncePerColony = reader.GetBoolean(3);
                        building.isBuildable = reader.GetInt16(4);
                        building.visibilityNeedsGoods = reader.GetInt16(5);
                        building.groupId = reader.GetByte(6);
                        building.prodqueuelevel = reader.GetByte(7);
                        building.label = reader.GetInt32(8);
                        building.housing = reader.GetInt32(9);

                        building.storage = reader.GetInt32(10);
                        building.researchModifier = reader.GetInt32(11);
                        building.assemblyModifier = reader.GetInt32(12);
                        building.energyModifier = reader.GetInt32(13);
                        building.housingModifier = reader.GetInt32(14);
                        building.foodModifier = reader.GetInt32(15);
                        building.productionModifier = reader.GetInt32(16);
                        building.growthModifier = reader.GetInt32(17);

                        building.allowedMines = reader.GetInt32(18);
                        building.allowedChemicals = reader.GetInt32(19);
                        building.allowedFuel = reader.GetInt32(20);
                        

                        _core.Buildings[id] = building;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getBuildingProductions(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [buildingid]
                      ,[goodsid]
                      ,[amount]
                  FROM [engine].[v_BuildingProductions]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short buildingid = reader.GetInt16(0);
                        SpacegameServer.Core.Building Building = _core.Buildings[buildingid];
                        if (Building == null) continue;

                        SpacegameServer.Core.BuildingProduction BuildingProduction = new SpacegameServer.Core.BuildingProduction();
                        BuildingProduction.buildingId = buildingid;
                        BuildingProduction.goodsId = reader.GetInt16(1);
                        BuildingProduction.amount = reader.GetInt16(2);
                        Building.BuildingProductions.Add(BuildingProduction);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public  void getBuildingCosts(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [buildingid]
                      ,[goodsid]
                      ,[amount]
                  FROM [engine].[v_BuildingCosts]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short buildingid = reader.GetInt16(0);
                        SpacegameServer.Core.Building Building = _core.Buildings[buildingid];
                        if (Building == null) continue;

                        SpacegameServer.Core.BuildingCost BuildingCost = new SpacegameServer.Core.BuildingCost();
                        BuildingCost.buildingId = buildingid;
                        BuildingCost.goodsId = reader.GetInt16(1);
                        BuildingCost.amount = reader.GetInt16(2);
                        Building.BuildingCosts.Add(BuildingCost);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }                

                reader.Close();
            }
        }

        public void getPlanetTypes(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[name]
                      ,[label]
                      ,[description]
                      ,[objectId]
                      ,[researchRequired]
                      ,[colonyCenter]  
                      ,shipModuleId                  
                  FROM [engine].[v_PlanetTypes]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.PlanetType planetType = new SpacegameServer.Core.PlanetType(id);

                        planetType.name = reader.GetString(1);
                        planetType.label = reader.GetInt32(2);
                        planetType.description = reader.GetInt32(3);
                        planetType.objectId = reader.GetInt16(4);
                        planetType.researchRequired = reader.GetInt16(5);
                        planetType.colonyCenter = reader.GetInt16(6);
                        planetType.shipModuleId = reader.GetInt16(7);

                        _core.PlanetTypes.Add(planetType);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getShipHulls(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[isstarbase]
                      ,[typename]
                      ,[labelname]
                      ,[objectid]
                      ,[modulescount]
                      ,[templateimageurl]
                      ,[label]
                  FROM [engine].[v_ShipHulls]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        byte id = reader.GetByte(0);
                        SpacegameServer.Core.ShipHull ShipHull = new SpacegameServer.Core.ShipHull(id);
                        ShipHull.isstarbase = reader.GetBoolean(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        ShipHull.typename = reader.GetString(2);
                        ShipHull.labelName = reader.GetInt32(3);
                        ShipHull.objectId = reader.GetInt32(4);
                        ShipHull.modulesCount = reader.GetByte(5);
                        ShipHull.templateImageUrl = reader.GetString(6);
                        ShipHull.label = reader.GetInt32(7);

                        _core.ShipHulls[id] = ShipHull;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getShipHullsGain(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [shiphullid]
                      ,[crew]
                      ,[energy]
                      ,[hitpoints]
                      ,[damagereduction]
                      ,[damageoutput]
                      ,[cargoroom]
                      ,[fuelroom]
                      ,[inspacespeed]
                      ,[insystemspeed]
                      ,[maxspacemoves]
                      ,[maxsystemmoves]
                      ,[special]
                      ,[scanrange]
                      ,[population]
                        ,speedFactor
                  FROM [engine].[v_ShipHullsGain]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ShipHullsGain ShipHullsGain = new SpacegameServer.Core.ShipHullsGain();

                        ShipHullsGain.shiphullid = reader.GetByte(0);

                        if (_core.ShipHulls.Length < ShipHullsGain.shiphullid || _core.ShipHulls[ShipHullsGain.shiphullid] == null) continue;
                        SpacegameServer.Core.ShipHull ShipHull = _core.ShipHulls[ShipHullsGain.shiphullid];

                        ShipHullsGain.crew = reader.GetInt32(1);
                        ShipHullsGain.energy = reader.GetInt16(2);
                        ShipHullsGain.hitpoints = reader.GetInt16(3);
                        ShipHullsGain.Evasion = reader.GetByte(4);
                        ShipHullsGain.damageoutput = reader.GetInt16(5);
                        ShipHullsGain.cargoroom = reader.GetInt16(6);
                        ShipHullsGain.fuelroom = reader.GetInt16(7);
                        ShipHullsGain.inSpaceSpeed = reader.GetInt16(8);
                        ShipHullsGain.inSystemSpeed = reader.GetInt16(9);
                        ShipHullsGain.maxSpaceMoves = reader.GetDecimal(10);
                        ShipHullsGain.maxSystemMoves = reader.GetDecimal(11);                        
                        ShipHullsGain.special = reader.GetInt32(12);
                        ShipHullsGain.scanRange = reader.GetByte(13);
                        ShipHullsGain.population = reader.GetInt64(14);
                        ShipHullsGain.speedFactor =(double) reader.GetDecimal(15);
                        ShipHull.ShipHullGain = ShipHullsGain;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getShipHullsCosts(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [shiphullid]
                      ,[goodsid]
                      ,[amount]
                  FROM [engine].[v_ShipHullsCosts]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        byte shiphullid = reader.GetByte(0);
                        SpacegameServer.Core.ShipHull ShipHull = _core.ShipHulls[shiphullid];
                        if (ShipHull == null) continue;

                        SpacegameServer.Core.ShipHullsCost ShipHullsCost = new SpacegameServer.Core.ShipHullsCost();
                        ShipHullsCost.shiphullid = shiphullid;
                        ShipHullsCost.goodsId = reader.GetInt16(1);
                        ShipHullsCost.amount = reader.GetInt16(2);
                        ShipHull.ShipHullsCosts.Add(ShipHullsCost);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public  void getShipHullsModulePositions(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [shiphullid]
                      ,[posx]
                      ,[posy]
                  FROM [engine].[v_ShipHullsModulePositions]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        byte shiphullid = reader.GetByte(0);
                        SpacegameServer.Core.ShipHull ShipHull = _core.ShipHulls[shiphullid];
                        if (ShipHull == null) continue;

                        SpacegameServer.Core.ShipHullsModulePosition ShipHullsModulePosition = new SpacegameServer.Core.ShipHullsModulePosition();
                        ShipHullsModulePosition.shiphullid = shiphullid;
                        ShipHullsModulePosition.posX = reader.GetByte(1);
                        ShipHullsModulePosition.posY = reader.GetByte(2);
                        ShipHull.ShipHullsModulePositions.Add(ShipHullsModulePosition);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public  void getShipHullsImages(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [id]
                      ,[shiphullid]
                      ,[objectid]
                      ,[templateimageid]
                      ,[templatemodulesxoffset]
                      ,[templatemodulesyoffset]
                  FROM [engine].[v_ShipHullsImages]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        byte shiphullid = reader.GetByte(1);
                        SpacegameServer.Core.ShipHull ShipHull = _core.ShipHulls[shiphullid];
                        if (ShipHull == null) continue;

                        SpacegameServer.Core.ShipHullsImage ShipHullsImage = new SpacegameServer.Core.ShipHullsImage();
                        ShipHullsImage.id = id;
                        ShipHullsImage.shipHullId = shiphullid;
                        ShipHullsImage.objectId = reader.GetInt32(2);
                        ShipHullsImage.templateImageId = reader.GetInt32(3);
                        ShipHullsImage.templateModulesXoffset = reader.GetInt32(4);
                        ShipHullsImage.templateModulesYoffset = reader.GetInt32(5);

                        ShipHull.ShipHullsImages.Add(ShipHullsImage);
                        _core.ShipHullsImages.Add(ShipHullsImage);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }


        public  void getModules(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[descriptionlabel]
                      ,[goodsid]
                      ,[label]
                      ,[level]
                  FROM [engine].[v_Modules]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.Module module = new SpacegameServer.Core.Module(id);
                        module.descriptionLabel = reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        module.goodsId = reader.GetInt16(2);
                        module.label = reader.GetInt32(3);
                        module.level = reader.GetByte(4);
                        _core.Modules[id] = module;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getModulesGain(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [modulesid]
                      ,[crew]
                      ,[energy]
                      ,[hitpoints]
                      ,[damagereduction]
                      ,[damageoutput]
                      ,[cargoroom]
                      ,[fuelroom]
                      ,[inspacespeed]
                      ,[insystemspeed]
                      ,[maxspacemoves]
                      ,[maxsystemmoves]
                      ,[scanrange]
                      ,[special]
                      ,[weapontype]
                      ,[population]
                        ,[toHitRatio]
                  FROM [engine].[v_ModulesGain]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ModulesGain moduleGain = new SpacegameServer.Core.ModulesGain();
                        
                        moduleGain.modulesId = reader.GetInt16(0);

                        if (_core.Modules.Length < moduleGain.modulesId || _core.Modules[moduleGain.modulesId] == null) continue;
                        SpacegameServer.Core.Module ShipModule = _core.Modules[moduleGain.modulesId];

                        moduleGain.crew = reader.GetInt32(1);
                        moduleGain.energy = reader.GetInt16(2);
                        moduleGain.hitpoints = reader.GetInt16(3);
                        moduleGain.damagereduction = reader.GetByte(4);
                        moduleGain.damageoutput = reader.GetInt16(5);
                        moduleGain.cargoroom = reader.GetInt16(6);
                        moduleGain.fuelroom = reader.GetInt16(7);
                        moduleGain.inSpaceSpeed = reader.GetInt16(8);
                        moduleGain.inSystemSpeed = reader.GetInt16(9);
                        moduleGain.maxSpaceMoves = reader.GetDecimal(10);
                        moduleGain.maxSystemMoves = reader.GetDecimal(11);
                        moduleGain.scanRange = reader.GetByte(12);
                        moduleGain.special = reader.GetInt32(13);
                        moduleGain.weaponType = reader.GetByte(14);
                        moduleGain.population = reader.GetInt64(15);
                        moduleGain.toHitRatio = reader.GetInt32(16);
                        //_core.ModulesGain.Add(moduleGain);

                        ShipModule.moduleGain = moduleGain;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getModulesCost(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [modulesid]
                      ,[goodsid]
                      ,[amount]
                  FROM [engine].[v_ModulesCosts]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ModulesCost ModulesCost = new SpacegameServer.Core.ModulesCost();

                        ModulesCost.modulesid = reader.GetInt16(0);

                        if (_core.Modules.Length < ModulesCost.modulesid || _core.Modules[ModulesCost.modulesid] == null) continue;
                        SpacegameServer.Core.Module ShipModule = _core.Modules[ModulesCost.modulesid];

                        ModulesCost.goodsId = reader.GetInt16(1);
                        ModulesCost.amount = reader.GetInt16(2);

                        ShipModule.ModulesCosts.Add(ModulesCost);

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }
        public  void getResearchQuestPrerequisites(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [sourcetype]
                      ,[sourceid]
                      ,[targettype]
                      ,[targetid]
                  FROM [engine].[v_ResearchQuestPrerequisites]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {                       
                        SpacegameServer.Core.ResearchQuestPrerequisite ResearchQuestPrerequisites = new SpacegameServer.Core.ResearchQuestPrerequisite();

                        ResearchQuestPrerequisites.SourceType = reader.GetInt16(0); // reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        ResearchQuestPrerequisites.SourceId = reader.GetInt16(1);
                        ResearchQuestPrerequisites.TargetType = reader.GetInt16(2);
                        ResearchQuestPrerequisites.TargetId = reader.GetInt16(3);

                        _core.ResearchQuestPrerequisites.Add( ResearchQuestPrerequisites);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getSurfaceImages(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[NAME]
                      ,[seed]
                      ,[objectimageurl]
                  FROM [engine].[v_SurfaceImages]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.SurfaceImage SurfaceImage = new SpacegameServer.Core.SurfaceImage(id);
                        SurfaceImage.NAME = reader.GetString(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        SurfaceImage.seed = reader.GetInt32(2);
                        SurfaceImage.objectimageurl = reader.GetString(3);

                        _core.SurfaceImages[id] = SurfaceImage;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }
        public  void getSurfaceTiles(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[NAME]
                      ,[objectid]
                      ,label
                      ,borderId
                  FROM [engine].[v_SurfaceTiles]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.SurfaceTile SurfaceTile = new SpacegameServer.Core.SurfaceTile(id);
                        SurfaceTile.name = reader.GetString(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        SurfaceTile.objectId = reader.GetInt16(2);
                        SurfaceTile.label = reader.GetInt32(3);
                        SurfaceTile.borderId = reader.IsDBNull(4) ? (short)5200 : reader.GetInt16(4);  
     
                        _core.SurfaceTiles[id] = SurfaceTile;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }        

        public  void getBuildOptions(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [objectid]
                            ,[buildingid]
                  FROM [engine].[v_BuildOptions]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short buildingid = reader.GetInt16(1);
                        SpacegameServer.Core.Building Building = _core.Buildings[buildingid];
                        if (Building == null) continue;

                        SpacegameServer.Core.BuildOption BuildOption = new SpacegameServer.Core.BuildOption();
                        BuildOption.buildingId = buildingid;
                        BuildOption.objectId = reader.GetInt16(0);
                        Building.BuildOptions.Add(BuildOption);

                        _core.BuildOptions.Add(BuildOption);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getQuests(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[label]
                      ,[descriptionlabel]
                      ,[isintro]
                      ,[israndom]
                      ,[hasscript]
                      ,[script]
                  FROM [engine].[v_Quests]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.Quest Quest = new SpacegameServer.Core.Quest(id);
                        Quest.label = reader.GetInt32(1);
                        Quest.descriptionLabel = null;
                        Quest.isIntro = reader.GetBoolean(3);
                        Quest.isRandom = reader.GetBoolean(4);
                        Quest.hasScript = reader.GetBoolean(5);
                        Quest.script = reader.GetString(6);


                        _core.Quests[id] = Quest;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getResearchs(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[objectimageurl]
                      ,[description]
                      ,[cost]
                      ,[label]
                      ,[descriptionlabel]
                      ,[researchtype]
                      ,[treecolumn]
                      ,[treerow]
                        ,baseCost
                  FROM [engine].[v_Research]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        short id = reader.GetInt16(0);
                        SpacegameServer.Core.Research Research = new SpacegameServer.Core.Research(id);
                        Research.objectimageUrl = reader.GetString(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        Research.description = reader.GetString(2);     
                        Research.cost = reader.GetInt16(3);
                        Research.label = reader.GetInt32(4);
                        Research.descriptionLabel = reader.GetInt32(5);
                        Research.researchType = reader.GetByte(6);
                        Research.treeColumn = reader.GetByte(7);
                        Research.treeRow = reader.GetByte(8);
                        Research.baseCost = reader.GetInt16(9);

                        _core.Researchs[id] = Research;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getResearchsGain(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [researchId]
                      ,[research]
                      ,[energy]	
                      ,[housing]
                      ,[growth]
                      ,[construction]
                      ,[industrie]
                      ,[food]
                      ,[colonyCount]
                      ,[fleetCount]
                      ,[objectId]
                  FROM [engine].[v_ResearchGain]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ResearchGain ResearchGain = new SpacegameServer.Core.ResearchGain();
                        ResearchGain.researchId = reader.GetInt16(0);

                        if (_core.Researchs.Length < ResearchGain.researchId || _core.Researchs[ResearchGain.researchId] == null) continue;
                        SpacegameServer.Core.Research Research = _core.Researchs[ResearchGain.researchId];

                        ResearchGain.research = reader.GetInt16(1);
                        ResearchGain.energy = reader.GetInt16(2);
                        ResearchGain.housing = reader.GetInt16(3);

                        ResearchGain.growth = reader.GetInt32(4);
                        ResearchGain.construction = reader.GetInt32(5);
                        ResearchGain.industrie = reader.GetInt32(6);
                        ResearchGain.food = reader.GetInt32(7);
                        ResearchGain.colonyCount = reader.GetInt16(8);
                        ResearchGain.fleetCount = reader.GetInt16(9);
                        ResearchGain.objectId = reader.GetInt16(10);

                        Research.ResearchGain = ResearchGain;
                        _core.ResearchGains.Add(ResearchGain);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getSpecializationGroups(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                       [id]
                      ,[name]
                      ,[picks]
                      ,[label]
                      ,[labelDescription]
                  FROM [engine].[v_SpecializationGroups]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.SpecializationGroup SpecializationGroup = new SpacegameServer.Core.SpecializationGroup(id);
                        SpecializationGroup.Name = reader.GetString(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        SpecializationGroup.Picks = reader.GetInt32(2);
                        SpecializationGroup.Label = reader.GetInt32(3);
                        SpecializationGroup.LabelDescription = reader.GetInt32(4);


                        _core.SpecializationGroups.Add(SpecializationGroup);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getSpecializationResearches(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                      [SpecializationGroupId]
                      ,[ResearchId]
                      ,[SecondaryResearchId]
                      ,Building1
	                  ,Building2
	                  ,Building3
	                  ,Module1
	                  ,Module2
	                  ,Module3
                  FROM [engine].[v_SpecializationResearches]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int specId = reader.GetInt32(0);
                        short researchId = reader.GetInt16(1);
                        short? secondaryResearch = reader.IsDBNull(2) ? null : (short?)reader.GetInt16(2);

                        short? b1 = reader.IsDBNull(3) ? null : (short?)reader.GetInt16(3);
                        short? b2 = reader.IsDBNull(4) ? null : (short?)reader.GetInt16(4);
                        short? b3 = reader.IsDBNull(5) ? null : (short?)reader.GetInt16(5);

                        short? m1 = reader.IsDBNull(6) ? null : (short?)reader.GetInt16(6);
                        short? m2 = reader.IsDBNull(7) ? null : (short?)reader.GetInt16(7);
                        short? m3 = reader.IsDBNull(8) ? null : (short?)reader.GetInt16(8);

                        SpacegameServer.Core.SpecializationResearch SpecializationResearch = new SpacegameServer.Core.SpecializationResearch(specId, researchId, secondaryResearch,
                            b1,b2,b3,
                            m1,m2,m3);
                        _core.SpecializationGroups[specId].SpecializationResearches.Add(SpecializationResearch);  
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getTradeOffers(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                       [id]
                      ,[commnodeid]
                      ,[spaceobjectid]
                      ,[spaceobjecttype]
                  FROM [engine].[v_TradeOffers]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.TradeOffer TradeOffer = new SpacegameServer.Core.TradeOffer(id);
                        TradeOffer.commNodeId = reader.GetInt32(1);   //reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        TradeOffer.spaceObjectId = reader.GetInt32(2);
                        TradeOffer.spaceObjectType = reader.GetByte(3);

                        _core.tradeOffer.TryAdd(id, TradeOffer);
                        if (_core.identities.trades.id < TradeOffer.tradeOfferId) _core.identities.trades.id = TradeOffer.tradeOfferId;          
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getTradeOfferDetails(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                       [tradeoffersid]
                          ,[goodsid]
                          ,[amount]
                          ,[offer]
                  FROM [engine].[v_TradeOfferDetails]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);

                        if (_core.tradeOffer.ContainsKey(id))
                        {
                            var Trade = _core.tradeOffer[id];

                            Core.TradeOfferGood NewTradeGood = new Core.TradeOfferGood();

                            NewTradeGood.tradeoffersid = id;
                            NewTradeGood.goodsId = reader.GetInt16(1); 
                            NewTradeGood.amount = reader.GetInt32(2);
                            NewTradeGood.offer = reader.GetBoolean(3);

                            if (NewTradeGood.offer) 
                                Trade.offered.Add(NewTradeGood); 
                            else 
                                Trade.requested.Add(NewTradeGood);
                        }
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }


        public void getRoutes(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                      [routeId]
                      ,[tradeRoute]
                      ,[userid]
                      ,[name]
                  FROM [engine].[v_Routes]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int routeId = reader.GetInt32(0);
                        bool tradeRoute = reader.GetBoolean(1);
                        int userId = reader.GetInt32(2);
                        string name = reader.GetString(3);
                        SpacegameServer.Core.Route Route = new Core.Route(routeId, tradeRoute, userId, name);

                       

                        _core.routes.TryAdd(routeId, Route);
                        if (_core.identities.routes.id < Route.routeId) _core.identities.routes.id = Route.routeId;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getRouteElements(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                      [routeId]
                      ,[stepId]
                      ,[starX]
                      ,[starY]
                      ,[systemX]
                      ,[systemY]
                      ,[stopNo]
                  FROM [engine].[v_RouteElements]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int routeId = reader.GetInt32(0);
                        Int16 stepId = reader.GetInt16(1);
                        int starX = reader.GetInt32(2);
                        int starY = reader.GetInt32(3);
                        int? systemX = reader.IsDBNull(4) ? null : (System.Nullable<Int32>)reader.GetInt32(4);
                        int? systemY = reader.IsDBNull(5) ? null : (System.Nullable<Int32>)reader.GetInt32(5);
                        int stopNo = reader.GetInt32(6);

                        if (_core.routes.ContainsKey(routeId))
                        {
                            var Route = _core.routes[routeId];

                            Core.RouteElement NewRouteElements = new Core.RouteElement(
                                routeId
                              ,stepId
                              ,starX
                              ,starY
                              ,systemX
                              ,systemY
                              ,stopNo);

                            Route.elements.Add(NewRouteElements);                           
                        }
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getRouteStopActions(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                     [routeId]
                      ,[stepId]
                      ,[goodId]
                      ,[amount]
                  FROM [engine].[v_RouteStopActions]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int routeId = reader.GetInt32(0);
                        Int16 stepId = reader.GetInt16(1);
                        Int16 goodId = reader.GetInt16(2);
                        int amount = reader.GetInt32(3);
                        

                        if (_core.routes.ContainsKey(routeId))
                        {
                            var Route = _core.routes[routeId];

                            Core.RouteStopAction NewRouteStopAction = new Core.RouteStopAction(
                                routeId
                              , stepId
                              , goodId
                              , amount);

                            Route.actions.Add(NewRouteStopAction);
                        }
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getRouteShips(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"select [routeId]
                    ,[shipId]
                    ,[FleetId]
	                ,stepId 
                  FROM [engine].[v_RouteShips]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int routeId = reader.GetInt32(0);
                        int? ship = reader.IsDBNull(1) ? null : (System.Nullable<Int32>)reader.GetInt32(1);
                        int? fleet = reader.IsDBNull(2) ? null : (System.Nullable<Int32>)reader.GetInt32(2);
                        Int16 stepId = reader.GetInt16(3);


                        if (_core.routes.ContainsKey(routeId))
                        {
                            var Route = _core.routes[routeId];

                            Core.RouteShip NewShip = new Core.RouteShip(
                                routeId
                                , ship
                                , fleet
                              , stepId);

                            Route.ships.Add(NewShip);
                        }
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }


        public void getObjectRelations(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [sourcetype]
                      ,[sourceid]
                      ,[targettype]
                      ,[targetid]
                  FROM [engine].[v_ResearchQuestPrerequisites]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.ResearchQuestPrerequisite ResearchQuestPrerequisite = new SpacegameServer.Core.ResearchQuestPrerequisite();
                        ResearchQuestPrerequisite.SourceType = reader.GetInt16(0);
                        ResearchQuestPrerequisite.SourceId = reader.GetInt16(1);
                        ResearchQuestPrerequisite.TargetType = reader.GetInt16(2);
                        ResearchQuestPrerequisite.TargetId = reader.GetInt16(3);

                        _core.objectRelations.Add(ResearchQuestPrerequisite);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getSurfaceDefaultMap(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT [id]
                          ,[x]
                          ,[y]
                          ,[surfaceobjectid]
                  FROM [engine].[v_surfaceDefaultMap]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.SurfaceDefaultMap surfaceDefaultMap = new SpacegameServer.Core.SurfaceDefaultMap();
                        surfaceDefaultMap.id = reader.GetInt16(0);
                        surfaceDefaultMap.x = reader.GetInt32(1);
                        surfaceDefaultMap.y = reader.GetInt32(2);
                        surfaceDefaultMap.surfaceobjectid = reader.GetInt32(3);

                        _core.surfaceDefaultMaps.Add(surfaceDefaultMap);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        

        public void getLanguages(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT 
                    [id]
                      ,[languagefullname]
                      ,[languageshortname]
                  FROM [engine].[v_Languages]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.Language language = new SpacegameServer.Core.Language();
                        language.id = reader.GetInt32(0);
                        language.languageFullName = reader.GetString(1);
                        language.languageShortName = reader.GetString(2);

                        _core.languages[language.id] = language;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getLabels(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT 
                    [id]
                      ,[label]
                      ,[languageId]
                  FROM [engine].[v_Labels]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        SpacegameServer.Core.Label label = new SpacegameServer.Core.Label();
                        label.id = reader.GetInt32(0);
                        label.label = reader.GetString(1);
                        label.languageId = reader.GetInt32(2);

                        _core.labels.Add(label);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        

        #endregion game data

        #region map data
        public  void getStars(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[posX]
                      ,[posY]
                      ,[systemname]
                      ,[objectid]
                      ,[size]
                      ,[startsystem]
                      ,[settled]
                      ,[ressourceid]
                      ,startingRegion
                  FROM [engine].[v_StarMap]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.SystemMap star = new SpacegameServer.Core.SystemMap(id);
                        star.posX = reader.GetInt32(1);
                        star.posY = reader.GetInt32(2);
                        star.systemname = reader.GetString(3);
                        star.objectid = reader.GetInt16(4);
                        star.size = reader.GetInt16(5);
                        star.startsystem = reader.GetByte(6);
                        star.settled = reader.GetByte(7);
                        star.ressourceid = reader.GetByte(8);
                        star.startingRegion = reader.IsDBNull(9) ? null : reader.GetString(9);
                        _core.stars[id] = star;

                        _core.addStarToField(star);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getSolarSystemInstances(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[x]
                      ,[y]
                      ,[systemid]
                      ,[objectid]
                      ,[drawsize]
                      ,[colonyId]
                  FROM [engine].[v_SolarSystemInstances]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        SpacegameServer.Core.SolarSystemInstance planet = new SpacegameServer.Core.SolarSystemInstance(id);
                        planet.x = reader.GetInt32(1);
                        planet.y = reader.GetInt32(2);
                        planet.systemid = reader.GetInt32(3);
                        planet.objectid = reader.GetInt16(4);
                        planet.fieldSize = reader.GetByte(5);
                        planet.colonyId = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6);

                        _core.planets[id] = planet;
                        _core.stars[planet.systemid].planets.Add(planet);
                        _core.stars[planet.systemid].field.systemObjects.Add(planet);                        
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getPlanetSurface(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [id]
                      ,[planetid]
                      ,[x]
                      ,[y]
                      ,[surfaceobjectid]
                      ,[surfacebuildingid]
                  FROM [engine].[v_PlanetSurface]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        long id = reader.GetInt64(0);
                        SpacegameServer.Core.PlanetSurface surfaceField = new SpacegameServer.Core.PlanetSurface(id);
                        surfaceField.planetid = reader.GetInt32(1);
                        surfaceField.x = reader.GetByte(2);
                        surfaceField.y = reader.GetByte(3);
                        surfaceField.surfaceobjectid = reader.GetInt16(4);
                        surfaceField.surfacebuildingid = reader.IsDBNull(5) ? null : (short?)reader.GetInt16(5);
                       
                        _core.planetSurface[id] = surfaceField;

                        if (!_core.planets.ContainsKey(surfaceField.planetid))
                        {
                            _core.writeToLog("bha");
                        }
                        _core.planets[surfaceField.planetid].surfaceFields.Add(surfaceField);

                        if (_core.identities.planetSurfaceId.id < id) _core.identities.planetSurfaceId.id = id;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public  void getUserStarMap(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT 
                      [userid]
                      ,[starid]
                  FROM [engine].[v_UserStarMap]",
                  connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        
                        int userid = reader.GetInt32(0);
                        int starId = reader.GetInt32(1);
                        if (_core.users[userid] == null) continue;
                        if (_core.stars[starId] == null) continue;

                        SpacegameServer.Core.UserStarMap userStarMap = new SpacegameServer.Core.UserStarMap();
                        userStarMap.userid = userid;
                        userStarMap.starid = starId;


                        //_core.userStarmap.Add(userStarMap);
                        _core.users[userid].userStarmap.Add(userStarMap);
                        _core.users[userid].knownStars.Add(starId);
                        

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }

        #endregion
        public  void getUsers(SpacegameServer.Core.Core _core, int userid )
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                   [id]
                  ,[username]
                  ,[activity]
                  ,[locked]
                  ,[user_session]
                  ,[showraster]
                  ,[moveshipsasync]
                  ,[homecoordx]
                  ,[homecoordy]
                  ,[language]
                  ,[logindt]
                  ,[lastselectedobjecttype]
                  ,[lastselectedobjectid]
                  ,[showsystemnames]
                  ,[showcolonynames]
                  ,[showcoordinates]

                  ,[showColonyOwners]
                  ,[showshipnames]
                  ,[showshipowners]   
                  ,[researchpoints]
                  ,[scanrangebrightness]
                
    ,[constructionRatio]
      ,[industrieRatio]
      ,[foodRatio]
      ,[versionId]                    

                  ,popVicPoints  ,
		            researchVicPoints,
		            goodsVicPoints ,
	                shipVicPoints ,
		            overallVicPoints   ,
                    overallRank,
                    fogVersion,
                    fogString,
                    description,
                    aiId,
                    aiRelation,
                    lastReadGalactivEvent,
                    ProfileUrl,
                    showCombatPopup,
                    showCombatFast
                  FROM [engine].[v_Users]";

                if (userid != 0 )
                {
                    commandText += " where id = " + userid.ToString();
                }


                SqlCommand command = new SqlCommand(commandText,connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);

                       //detect update / insert
                        SpacegameServer.Core.User user;
                        bool newUser = false;
                        if (_core.users.ContainsKey(id))
                        {
                            user = _core.users[id];                           
                        }
                        else
                        {
                            user = new SpacegameServer.Core.User(id);
                            newUser = true;
                        }        

                        //transfer data
                        //ToDo...
                        user.username               = reader.GetString(1);
                        user.activity               = reader.IsDBNull(2) ? false : reader.GetBoolean(2);
                        user.locked                 = reader.IsDBNull(3) ? false : reader.GetBoolean(3);
                        user.user_session           = reader.IsDBNull(4)? null : reader.GetString(4);
                        user.showRaster             = reader.GetBoolean(5);
                        user.moveShipsAsync         = reader.GetBoolean(6);
                        user.homeCoordX             = reader.GetInt32(7);
                        user.homeCoordY             = reader.GetInt32(8);
                        user.language               = reader.GetInt32(9);
                        user.logindt                = reader.IsDBNull(10) ? DateTime.Now.AddMonths(-1) : reader.GetDateTime(10);
                        user.lastSelectedObjectType = reader.IsDBNull(11) ? null : (int?)reader.GetInt32(11);
                        user.lastSelectedObjectId   = reader.IsDBNull(12) ? null : (int?)reader.GetInt32(12);
                        user.showSystemNames        = reader.GetBoolean(13);
                        user.showColonyNames        = reader.GetBoolean(14); 
                        user.showCoordinates        = reader.GetBoolean(15);
                        user.showColonyOwners = reader.GetBoolean(16);
                        user.showShipNames = reader.GetBoolean(17);
                        user.showShipOwners = reader.GetBoolean(18); 
                        
                        user.researchPoints         = reader.GetInt32(19);
                        user.scanRangeBrightness    = reader.GetByte(20);

                        user.assemblyRatio          = (double)reader.GetDecimal(21);
                        user.industrieRatio         = (double)reader.GetDecimal(22);
                        user.foodRatio              = (double)reader.GetDecimal(23);
                        user.versionId              = reader.GetInt64(24); 

                        user.popVicPoints           = reader.GetInt32(25); 
                        user.researchVicPoints      = reader.GetInt32(26); 
                        user.goodsVicPoints         = reader.GetInt32(27); 
                        user.shipVicPoints          = reader.GetInt32(28); 
                        user.overallVicPoints       = reader.GetInt32(29);
                        user.overallRank            = reader.GetInt32(30);

                        user.fogVersion = reader.GetInt32(31);
                        user.fogString= reader.GetString(32);

                        user.Description = reader.GetString(33);

                        user.AiId                   = reader.GetInt32(34);
                        user.AiRelation             = reader.GetInt32(35);
                        user.LastReadGalactivEvent  = reader.GetInt32(36);
                        user.ProfileUrl             = reader.GetString(37);
                        user.showCombatPopup        = reader.GetInt32(38) == 1 ? true : false;
                        user.showCombatFast         = reader.GetInt32(39) == 1 ? true : false;
                        //user.allianceId             = 0;

                        // user.showColonyOwners       = reader.GetBoolean(21); 

                        //insert if needed
                        if (newUser)
                        {
                            _core.users.TryAdd(id, user);
                            //_core.users[id] = user;
                        }

                        

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getShipTemplates(SpacegameServer.Core.Core _core, int templateId, SpacegameServer.Core.User _user)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT id, 
                        userid, 
                         shiphullid, 
                         NAME, 
                         gif, 
                         energy, 
                         crew, 
                         scanrange, 
                         attack, 
                         defense, 
                         hitpoints, 
                         damagereduction, 
                         cargoroom, 
                         fuelroom, 
                         systemmovesperturn, 
                         galaxymovesperturn, 
                         systemmovesmax, 
                         galaxymovesmax, 
                         iscolonizer, 
                         [population], 
                         constructionduration, 
                         constructable, 
                         amountbuilt, 
                         obsolete, 
                         shiphullsimage,
                         versionId
                  FROM   [engine].[v_ShipTemplate]";

                if (templateId != 0 && _user != null)
                {
                    commandText += " where id = " + templateId.ToString() + " and userid = " + _user.id.ToString();
                }
                else
                {
                    if (templateId != 0)
                        commandText += " where id = " + templateId.ToString();

                    if (_user != null)
                        commandText += " where userid = " + _user.id.ToString();
                }

                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        int userid = reader.GetInt32(1);

                        if (!_core.users.ContainsKey(userid)) continue;

                        SpacegameServer.Core.ShipTemplate template;
                        bool newShipTemplate = false;                        
                        if (_core.shipTemplate.ContainsKey(id))
                        {
                            template = _core.shipTemplate[id];                            
                        }
                        else
                        {
                            template = new SpacegameServer.Core.ShipTemplate(id);
                            newShipTemplate = true;
                        }

                        template.userId = userid;
                        template.hullid = reader.GetByte(2);
                        template.name = reader.GetString(3);
                        template.gif = reader.GetString(4);
                        template.energy = reader.GetInt32(5);
                        template.crew = reader.GetInt32(6);
                        template.scanRange = reader.GetByte(7);
                        template.attack = reader.GetInt16(8);
                        template.defense = reader.GetInt16(9);
                        template.hitpoints = reader.GetInt16(10);
                        template.damagereduction = reader.GetByte(11);
                        template.cargoroom = reader.GetInt16(12);
                        template.fuelroom = reader.GetInt16(13);
                        template.systemmovesperturn = reader.GetDecimal(14);
                        template.galaxymovesperturn = reader.GetDecimal(15);
                        template.max_impuls = reader.GetDecimal(16);
                        template.max_hyper = reader.GetDecimal(17); 
                        template.iscolonizer = reader.GetInt32(18);
                        template.population = reader.GetInt64(19); ;
                        template.constructionduration = reader.GetInt32(20);
                        template.isConstructable = reader.GetBoolean(21);
                        template.amountbuilt = reader.GetInt32(22);
                        template.obsolete = reader.GetBoolean(23);
                        template.shipHullsImage = reader.GetInt32(24);
                        template.versionId = reader.GetInt64(25);
                      
                        if (newShipTemplate)
                        {
                            _core.shipTemplate.TryAdd(id, template);
                            //_core.shipTemplate[id] = template;
                            if (_core.identities.templateLock.id < id) _core.identities.templateLock.id = id;
                            //((SpacegameServer.Core.User)_core.users[userid]).ships.Add(ship);
                        }                   

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }

        public void getShipTemplatesModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.ShipTemplate filterTemplate, bool _refresh = false)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString =
                    @"SELECT
                        shiptemplateid, 
                         posx, 
                         posy, 
                         moduleid 
                    FROM [engine].[v_ShipTemplateModulePositions] ";

                if (filterTemplate != null)
                {
                    commandString += " where shiptemplateid = " + filterTemplate.id.ToString();
                    filterTemplate.shipModules.Clear();
                }

                if (_refresh)
                {
                    foreach (var template in _core.shipTemplate) template.Value.shipModules.Clear();
                }

                SqlCommand command = new SqlCommand(commandString, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shiptemplateid = reader.GetInt32(0);
                        if (!_core.shipTemplate.ContainsKey(shiptemplateid)) continue;
                        SpacegameServer.Core.ShipTemplate template = _core.shipTemplate[shiptemplateid];                        

                        SpacegameServer.Core.ShipTemplateModules shipTemplateModule = new SpacegameServer.Core.ShipTemplateModules();
                        shipTemplateModule.shiptemplateid = shiptemplateid;                        
                        shipTemplateModule.posX = reader.GetByte(1);
                        shipTemplateModule.posY = reader.GetByte(2);
                        shipTemplateModule.moduleId = reader.GetInt16(3);
                        template.shipModules.Add(shipTemplateModule);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }
                reader.Close();
            }
        }


        public  void getShips(SpacegameServer.Core.Core _core, int _shipId, SpacegameServer.Core.User _user)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT [id]
                      ,[userid]
                      ,[NAME]
                      ,[posX]
                      ,[posY]
                      ,[systemx]
                      ,[systemy]
                      ,[hitpoints]
                      ,[attack]
                      ,[defense]
                      ,[scanrange]
                      ,[max_hyper]
                      ,[max_impuls]
                      ,[hyper]
                      ,[impuls]
                      ,[colonizer]
                      ,[hullid]
                      ,[systemid]
                      ,[templateid]
                      ,[objectid]
                      ,[damagereduction]
                      ,versionId
		              ,shipStockVersionId
		              ,shipModulesVersionId
                      ,spaceX
                      ,spaceY
                        ,[energy]
                        ,[crew]
                        ,[cargoroom]
                        ,[fuelroom]
                        ,[population]
                        ,[shipHullsImage]
                    ,refitCounter
                    ,noMovementCounter
                    ,experience
                    , fleetId
	  	            , sentry
	  	            , targetX
	  	            , targetY
	  	            , movementroute
                    , harvesting
                  FROM [engine].[v_Ships]";

                if (_shipId != 0 && _user != null)
                {
                    commandText += " where id = " + _shipId.ToString() + " and userid = " + _user.id.ToString();
                }
                else
                {
                    if (_shipId != 0)
                        commandText += " where id = " + _shipId.ToString();

                    if (_user != null)
                        commandText += " where userid = " + _user.id.ToString();
                }

                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        int userid = reader.GetInt32(1);
                        if (!_core.users.ContainsKey(userid)) continue;

                        SpacegameServer.Core.Ship ship;
                        bool newShip = false;
                        int oldUserId = 0;
                        if (_core.ships.ContainsKey(id))
                        {
                            ship = _core.ships[id];
                            oldUserId = ship.userid;
                        }
                        else
                        {
                            ship = new SpacegameServer.Core.Ship(id);
                            newShip = true;
                        }

                        ship.userid = userid;                        
                        ship.NAME = reader.GetString(2);
                        ship.posX = reader.GetInt32(3);
                        ship.posY = reader.GetInt32(4);
                        ship.systemx = reader.IsDBNull(5) ? null : (System.Nullable<byte>)(reader.GetByte(5));
                        ship.systemy = reader.IsDBNull(6) ? null : (System.Nullable<byte>)reader.GetByte(6);
                        ship.hitpoints = reader.GetInt16(7);
                        ship.attack = reader.GetInt16(8);
                        ship.defense = reader.GetInt16(9);
                        ship.scanRange = reader.GetByte(10);
                        ship.max_hyper = reader.GetDecimal(11);
                        ship.max_impuls = reader.GetDecimal(12);
                        ship.hyper = reader.GetDecimal(13);
                        ship.impuls = reader.GetDecimal(14);
                        ship.colonizerBool = reader.GetBoolean(15);
                        ship.heimat = false;
                        ship.hullid = reader.GetByte(16);
                        ship.systemid = reader.IsDBNull(17) ? null : (System.Nullable<Int32>)reader.GetInt32(17);
                        ship.templateid = reader.GetInt32(18);
                        ship.objectid = reader.GetInt32(19);
                        ship.damagereduction = reader.GetByte(20);
                        ship.versionId = reader.GetInt64(21);
                        ship.shipStockVersionId = reader.GetInt64(22);
                        ship.shipModulesVersionId = reader.GetInt64(23);                                                

                        ship.energy = reader.GetInt16(26);
                        ship.crew = reader.GetInt32(27);
                        ship.cargoroom = reader.GetInt16(28);
                        ship.fuelroom = reader.GetInt16(29);
                        ship.population = reader.GetInt64(30);
                        ship.shipHullsImage = reader.GetInt32(31);
                        ship.refitCounter = reader.GetByte(32);
                        ship.noMovementCounter = reader.GetByte(33);
                        ship.Experience = reader.GetInt32(34);

                        ship.FleetId = reader.IsDBNull(35) ? null : (System.Nullable<Int32>)reader.GetInt32(35);
                        ship.Sentry = reader.GetBoolean(36);
                        ship.TargetX = reader.IsDBNull(37) ? null : (System.Nullable<Int32>)reader.GetInt32(37);
                        ship.TargetY = reader.IsDBNull(38) ? null : (System.Nullable<Int32>)reader.GetInt32(38);
                        ship.MovementRoute = reader.IsDBNull(39) ? null : reader.GetString(39);
                        ship.Harvesting = reader.GetByte(40) == 0 ? false : true;


                        if (newShip)
                        {
                            ship.FormerOwner = userid; //needs only set once during server start or ship building
                            _core.ships[id] = ship;
                            _core.addShipToField(ship);
                            ((SpacegameServer.Core.User)_core.users[userid]).ships.Add(ship);
                            if (_core.identities.shipLock.id < id) _core.identities.shipLock.id = id;
                        }

                        if (oldUserId != 0 && oldUserId != userid)                            
                        {
                            _core.users[oldUserId].removeShip(ship);
                            _core.users[userid].ships.Add(ship);
                        }

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }
        public  void getShipStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString = 
                    @"SELECT
                         [shipid]
                        ,[goodsid]
                        ,[amount]
                    FROM [engine].[v_shipStock]";

                if (_ship != null)
                {
                    commandString += " where shipid = " + _ship.id.ToString();
                    _ship.goods.Clear();
                }

                if (_refresh)
                {
                    foreach (var ship in _core.ships) ship.Value.goods.Clear();
                }

                SqlCommand command = new SqlCommand(commandString, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {                        
                        int shipId = reader.GetInt32(0);
                        if (!_core.ships.ContainsKey(shipId)) continue;
                        SpacegameServer.Core.Ship ship = _core.ships[shipId];
                       
                        SpacegameServer.Core.shipStock shipStock = new SpacegameServer.Core.shipStock();
                        shipStock.shipId = shipId;
                        shipStock.goodsId = reader.GetInt16(1);
                        shipStock.amount = reader.GetInt32(2);
                        ship.goods.Add(shipStock);                        
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }

        public  void getShipModules(SpacegameServer.Core.Core _core, SpacegameServer.Core.Ship _ship, bool _refresh = false)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString =
                    @"SELECT
                         [shipid]
                          ,[moduleid]
                          ,[posx]
                          ,[posy]
                          ,[hitpoints]
                          ,[active]
                    FROM [engine].[v_shipModules]";

                if (_ship != null)
                {
                    commandString += " where shipid = " + _ship.id.ToString();
                    _ship.shipModules.Clear();
                }

                if (_refresh)
                {
                    foreach (var ship in _core.ships) ship.Value.shipModules.Clear();
                }

                SqlCommand command = new SqlCommand(commandString, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shipId = reader.GetInt32(0);
                        if (!_core.ships.ContainsKey(shipId)) continue;
                        SpacegameServer.Core.Ship ship = _core.ships[shipId];                       

                        SpacegameServer.Core.ShipModule shipModule = new SpacegameServer.Core.ShipModule();
                        shipModule.shipId = shipId;
                        shipModule.moduleId = reader.GetInt16(1);
                        shipModule.posX = reader.GetByte(2);
                        shipModule.posY = reader.GetByte(3);
                        shipModule.hitpoints = reader.GetInt16(4);
                        shipModule.active = reader.GetBoolean(5);
                        ship.shipModules.Add(shipModule);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }
                reader.Close();
            }
        }

        public  void getShipTranscension(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString =
                    @"SELECT
                         [shipId]
                          ,[helperMinimumRelation]
                          ,[constructionDate]
                          ,[ressourceCount]
                          ,finishedInTurn
                          ,finishingNumber
                    FROM [engine].[v_ShipTranscension]";


                SqlCommand command = new SqlCommand(commandString, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shipId = reader.GetInt32(0);
                        SpacegameServer.Core.Ship ship = _core.ships[shipId];
                        if (ship == null) continue;

                        SpacegameServer.Core.ShipTranscension shipTranscension = new SpacegameServer.Core.ShipTranscension(ship);
                        shipTranscension.shipId = shipId;
                        shipTranscension.helperMinimumRelation = reader.GetByte(1);
                        shipTranscension.constructionDate = reader.GetDateTime(2);
                        shipTranscension.ressourceCount = reader.GetInt32(3);
                        shipTranscension.finishedInTurn = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4);
                        shipTranscension.finishingNumber = reader.IsDBNull(5) ? null : (int?)reader.GetInt32(5);

                        shipTranscension.ship = ship;
                        ship.shipTranscension = shipTranscension;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }
                reader.Close();
            }
        }


        public void getShipTranscensionUsers(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString =
                    @" SELECT [shipId]" +
                          ", [userId]" + 
                          ", [helpCount]" +
                    " FROM [engine].[v_ShipTranscensionUsers]";


                SqlCommand command = new SqlCommand(commandString, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shipId = reader.GetInt32(0);
                        SpacegameServer.Core.Ship ship = _core.ships[shipId];
                        if (ship == null) continue;
                        if (ship.shipTranscension == null) continue;

                        SpacegameServer.Core.ShipTranscensionUser shipTranscension = new SpacegameServer.Core.ShipTranscensionUser();
                        shipTranscension.shipId = shipId;
                        shipTranscension.userId = reader.GetInt32(1);
                        shipTranscension.helpCount = reader.GetInt16(2);

                        ship.shipTranscension.shipTranscensionUsers.Add(shipTranscension);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }
                reader.Close();
            }
        }

        public  void getShipDirection(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT
                   shipId,
	                moveCounter,
	                moveDirection 
                FROM [ShipsDirection] order by shipId, movecounter asc",
                  connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shipId = reader.GetInt32(0);
                        if (!_core.ships.ContainsKey(shipId)) continue;

                        SpacegameServer.Core.Ship ship = _core.ships[shipId];
                        if (ship == null) continue;

                        SpacegameServer.Core.shipDirection shipDirection = new SpacegameServer.Core.shipDirection();
                        shipDirection.shipId = shipId;
                        shipDirection.moveCounter = reader.GetInt32(1);
                        shipDirection.moveDirection = reader.GetByte(2);
                        ship.shipDirection.Add(shipDirection);
                    }
                    catch (Exception ex)
                    {   //                     
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }
        public  void getColonies(SpacegameServer.Core.Core _core, int? _colonyId = null, int? userId = null)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText =
                  @"SELECT  
                    [id]
                      ,[userid]
                      ,[NAME]
                      ,[storage]
                      ,[scanrange]
                      ,[starid]
                      ,[planetid]
                      ,[shipinconstruction]
                      ,[constructionduration]
                      ,[population]
                      ,[construction]
                      ,[turnsofrioting]
                        ,versionId
                    ,TurnsOfSiege
                    ,besiegedBy
                    , Influence
                FROM [engine].[v_Colonies]";
                if (_colonyId != null && userId == null) commandText += " where [id] = " + _colonyId.ToString();
                if (_colonyId == null && userId != null) commandText += " where [userid] = " + userId.ToString();
                if (_colonyId != null && userId != null) commandText += " where [id] = " + _colonyId.ToString() + " and [userid] = " + userId.ToString();

                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        int userid = reader.GetInt32(1);
                        if (!_core.users.ContainsKey(userid)) continue;
                        SpacegameServer.Core.Colony colony;
                        if (_core.colonies.ContainsKey(id))
                            colony = _core.colonies[id];
                        else
                            colony = new SpacegameServer.Core.Colony(id);
                        colony.userId = userid;
                        colony.name = reader.GetString(2);
                        colony.storage = reader.GetInt32(3);
                        colony.scanRange = reader.GetByte(4);
                        colony.starId = reader.GetInt32(5);
                        colony.planetId = reader.GetInt32(6);
                        colony.shipinconstruction = reader.IsDBNull(7) ? null : (System.Nullable<Int32>)reader.GetInt32(7);
                        colony.constructionDuration = reader.GetInt32(8);
                        colony.population = reader.GetInt64(9);
                        colony.construction = reader.GetInt32(10);
                        colony.turnsOfRioting = reader.GetInt16(11);
                        colony.versionId = reader.GetInt64(12);
                        colony.TurnsOfSiege = reader.GetInt16(13);
                        colony.BesiegedBy = reader.GetInt32(14);
                        colony.Influence = reader.GetInt32(15);
                        
                        _core.colonies[id] = colony;

                        _core.addColonyToField(colony);
                        _core.users[userid].colonies.Add(colony);
                        colony.planet = _core.planets[colony.planetId];
                        colony.planet.colony = colony;

                        if (_core.identities.colonyId.id < id) _core.identities.colonyId.id = id;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }

            if (_colonyId != null)
            {               
                getColonyStock(_core, _core.colonies[(int)_colonyId]);
            }
        }

        public  void getColonyStock(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony _colony, bool _refresh = false)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString = @"SELECT
                       [colonyid]
                      ,[goodsid]
                      ,[amount]
                  FROM [engine].[v_colonyStock]";

                if (_colony != null)
                {
                    commandString += " where colonyid = " + _colony.id.ToString();
                   _colony.goods.Clear();         
                }

                if (_refresh)
                {
                    foreach(var colony in _core.colonies) colony.Value.goods.Clear();
                }

                SqlCommand command = new SqlCommand(commandString,connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int colonyId = reader.GetInt32(0);
                        if (!_core.colonies.ContainsKey(colonyId)) continue;
                        _colony = _core.colonies[colonyId];
                        
                                       
                        SpacegameServer.Core.colonyStock colonyStock = new SpacegameServer.Core.colonyStock();
                        colonyStock.colonyId = colonyId;
                        colonyStock.goodsId = reader.GetInt16(1);
                        colonyStock.amount = reader.GetInt32(2);
                        _colony.goods.Add(colonyStock);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();

            }
        }

        public void getUserQuests(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText =  @"SELECT  
                    [userid]
                      ,[questid]
                      ,[isread]
                      ,[iscompleted]
                  FROM [engine].[v_UserQuests]";

                if (_user != null)
                {
                    commandText += " where userid = " + _user.id.ToString();
                    _user.quests.Clear();
                }


                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int userid = reader.GetInt32(0);
                        if (_core.users[userid] == null) continue;
                        SpacegameServer.Core.UserQuest quest = new Core.UserQuest();
                        quest.userId = userid;
                        quest.questId = reader.GetInt32(1);
                        quest.isRead = reader.GetBoolean(2);
                        quest.isCompleted = reader.GetBoolean(3);
                        _core.users[userid].quests.Add(quest);                       
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }

        public void getUserResearches(SpacegameServer.Core.Core _core, SpacegameServer.Core.User _user)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT  
                    [userid]
                      ,[researchid]
                      ,[iscompleted]
                      ,[investedresearchpoints]
                      ,[researchpriority]
                  FROM [engine].[v_UserResearch]";
                
                if (_user != null)
                {
                    commandText += " where userid = " + _user.id.ToString();
                    _user.PlayerResearch.Clear();
                }

                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int userid = reader.GetInt32(0);
                        if (_core.users[userid] == null) continue;
                        SpacegameServer.Core.UserResearch research = new Core.UserResearch();
                        research.userId = userid;
                        research.researchId = reader.GetInt16(1);
                        research.isCompleted = reader.GetByte(2);
                        research.investedResearchpoints = reader.GetInt32(3);
                        research.researchPriority = reader.GetInt16(4);
                        _core.users[userid].PlayerResearch.Add(research);
                        research.research = _core.Researchs[research.researchId];
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }      

        public  void getColonyBuildings(SpacegameServer.Core.Core _core, SpacegameServer.Core.Colony colony)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandString = @"SELECT  
                    [id]
                      ,[colonyid]
                      ,[planetsurfaceid]
                      ,[userid]
                      ,[buildingid]
                      ,[isactive]
                      ,[underconstruction]
                      ,[remaininghitpoint]
                  FROM [engine].[v_ColonyBuildings]";
                if (colony != null)
                {
                    commandString += " where [colonyid] = " + colony.id.ToString();
                }


                SqlCommand command = new SqlCommand(commandString, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);                        
                        int colonyid = reader.GetInt32(1);
                        long planetsurfaceid = reader.GetInt64(2);
                        int userid = reader.GetInt32(3);
                        int templateId = reader.GetInt16(4);

                        if (!_core.users.ContainsKey(userid)) continue;
                        if (!_core.colonies.ContainsKey(colonyid)) continue;
                        if (!_core.Buildings.sparseContainsIndex(templateId)) continue;

                        var buildingColony = _core.colonies[colonyid];
                        var template = _core.Buildings[templateId];

                        var building = new SpacegameServer.Core.ColonyBuilding(_core, id, buildingColony, template, planetsurfaceid, userid, reader.GetBoolean(5), reader.GetBoolean(6), reader.GetInt32(7));

                        //startup has only one thread...
                        if (_core.identities.colonyBuildingId.id < id) _core.identities.colonyBuildingId.id = id;
                        

                        /*
                        SpacegameServer.Core.ColonyBuilding colonyBuilding = new Core.ColonyBuilding(id);
                        colonyBuilding.colonyId = colonyid;
                        colonyBuilding.userId = userid;
                        colonyBuilding.planetSurfaceId = planetsurfaceid;
                        colonyBuilding.buildingId = reader.GetInt16(4);
                        colonyBuilding.isActive = reader.GetBoolean(5);
                        colonyBuilding.underConstruction = reader.GetBoolean(6);
                        colonyBuilding.remainingHitpoint = reader.GetInt32(7);
                        
                        _core.colonyBuildings[id] = colonyBuilding;

                        //ToDo: also append to colony? -> might be a bad idea, since alone the users * colonies * buildings - might be lots of references (50 mb memory?)
                        if (_core.colonies.ContainsKey(colonyid)) _core.colonies[colonyid].colonyBuildings.Add(colonyBuilding);
                        if (_core.identities.colonyBuildingId.id < id) _core.identities.colonyBuildingId.id = id;

                        colonyBuilding.colony = _core.colonies[colonyBuilding.colonyId];
                        colonyBuilding.planetSurface = _core.planetSurface[colonyBuilding.planetSurfaceId];
                        colonyBuilding.building = _core.Buildings[colonyBuilding.buildingId];
                        */
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        //break;
                    }
                }

                reader.Close();
            }
        }

        public void getAlliances(SpacegameServer.Core.Core _core, int? allianceId)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                   id, 
                        NAME, 
                        [description], 
                        passwrd, 
                        allianceowner,
		                overallRank,
		                overallVicPoints
                  FROM [engine].[v_Alliances]";

                if (allianceId != null)
                {
                    commandText += " where id = " + allianceId.ToString();
                }

                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);

                        //detect update / insert
                        SpacegameServer.Core.Alliance alliance;
                        bool newAlliance = false;
                        if (_core.alliances.ContainsKey(id))
                        {
                            alliance = _core.alliances[id];
                        }
                        else
                        {
                            alliance = new SpacegameServer.Core.Alliance(id);
                            newAlliance = true;
                        }

                        //transfer data
                        //ToDo...
                        alliance.NAME = reader.GetString(1);
                        alliance.description = reader.GetString(2);
                        alliance.passwrd = reader.GetString(3);
                        alliance.allianceowner = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4);

                        alliance.overallRank = reader.GetInt32(5);
                        alliance.overallVicPoints = reader.GetInt32(6);
                        
                        
                        //insert if needed
                        if (newAlliance)
                        {
                            _core.alliances.TryAdd(id, alliance);                            
                        }

                        if (_core.identities.allianceId.id < id) _core.identities.allianceId.id = id;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        
                    }

                }

                reader.Close();
            }
        }

        public void getAllianceMembers(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                      [allianceid]
                      ,[userid]
                      ,[fulladmin]
                      ,[diplomaticadmin]
                      ,[mayinvite]
                      ,[mayfire]
                      ,[maydeclarewar]
                      ,[maymakediplomaticproposals]
                  FROM [engine].[v_AllianceMembers]";
           

                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int allianceId = reader.GetInt32(0);

                        if (!_core.alliances.ContainsKey(allianceId)) continue;
                        if (!_core.users.ContainsKey(reader.GetInt32(1))) continue;

                        Core.User user = _core.users[reader.GetInt32(1)];

                        //detect update / insert
                        SpacegameServer.Core.Alliance alliance =_core.alliances[allianceId];

                        SpacegameServer.Core.AllianceMember member = new Core.AllianceMember();
                        member.allianceId = allianceId;
                        member.userId = reader.GetInt32(1);
                        member.fullAdmin = reader.GetBoolean(2);
                        member.diplomaticAdmin = reader.GetBoolean(3);
                        member.mayInvite = reader.GetBoolean(4);
                        member.mayFire = reader.GetBoolean(5);
                        member.mayDeclareWar = reader.GetBoolean(6);
                        member.mayMakeDiplomaticProposals = reader.GetBoolean(7);

                        alliance.memberRights.Add(member);
                        alliance.members.Add(user);
                        user.group = alliance;
                        user.allianceId = allianceId;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getDiplomaticEntityState(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        [sender] ,
		                [target] ,
		                [relation]
                  FROM [engine].[v_DiplomaticEntityState]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int senderHash = reader.GetInt32(0);
                        int targetHash = reader.GetInt32(1);
                        int relation = reader.GetInt32(2);

                        SpacegameServer.Core.DiplomaticEntity sender = SpacegameServer.Core.UserRelations.hashToDiplomaticEntity(senderHash, _core);
                        SpacegameServer.Core.DiplomaticEntity target = SpacegameServer.Core.UserRelations.hashToDiplomaticEntity(targetHash, _core);

                        if (sender != null && target != null)
                        {
                            _core.userRelations.setDiplomaticEntityState(sender, target, (SpacegameServer.Core.Relation)relation);
                        }
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getAllianceInvites(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = 
                    @"SELECT 
                        [allianceid]
                        ,[userid]
                    FROM [engine].[v_AllianceInvites]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int allianceid = reader.GetInt32(0);
                        int userid = reader.GetInt32(1);
                       
                        if (_core.invitesPerUser.ContainsKey(userid))
                        {
                            _core.invitesPerUser[userid].Add(allianceid);
                        }
                        else
                        {
                            _core.invitesPerUser.TryAdd(userid, new List<int>());
                            _core.invitesPerUser[userid].Add(allianceid);
                        }

                        if (_core.invitesPerAlliance.ContainsKey(allianceid))
                        {
                            _core.invitesPerAlliance[allianceid].Add(userid);
                        }
                        else
                        {
                            _core.invitesPerAlliance.TryAdd(allianceid, new List<int>());
                            _core.invitesPerAlliance[allianceid].Add(userid);
                        }                       
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getCommNodes(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        [id]
                          ,[userid]                         
                          
                          ,[positionx]
                          ,[positiony]
                          ,[sysx]
                          ,[sysy]

                          ,[connectiontype]
                          ,[connectionid]
                          ,[activ]
                          ,[unformattedname]
                            ,[NAME]
                  FROM [engine].[v_CommunicationNode]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        Core.CommunicationNode node = new Core.CommunicationNode(id);
                        node.userId = reader.IsDBNull(1) ? null : (int?)reader.GetInt32(1);
                        node.positionX = reader.GetInt32(2);
                        node.positionY = reader.GetInt32(3);

                        node.sysX = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4);
                        node.sysY = reader.IsDBNull(5) ? null : (int?)reader.GetInt32(5);

                        node.connectionType = reader.GetInt32(6);
                        node.connectionId = reader.GetInt32(7);
                        node.activ = reader.GetBoolean(8);
                        node.unformattedName = reader.GetString(9);
                        node.name = reader.GetString(10);

                        _core.commNodes.TryAdd(id, node);

                        //add to tree
                        SpacegameServer.Core.NodeQuadTree.Field commNodeField2 = new SpacegameServer.Core.NodeQuadTree.Field(node.positionX, node.positionY);
                        _core.nodeQuadTree.insertNode(commNodeField2, node.id);

                        if (_core.identities.commNode.id < id) _core.identities.commNode.id = id;

                        if (node.connectionType == 4 && _core.identities.allianceId.id < node.connectionId) _core.identities.allianceId.id = node.connectionId;


                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getCommNodeUsers(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                            [userid]
                          ,[commnodeid]
                          ,[readaccess]
                          ,[writeaccess]
                          ,[lastreadmessage]
                          ,[informwhennew]
                  FROM [engine].[v_CommNodeUsers]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int userId = reader.GetInt32(0);
                        int commNodeId = reader.GetInt32(1);

                        if (!_core.users.ContainsKey(userId)) continue;
                        if (!_core.commNodes.ContainsKey(commNodeId)) continue;

                        Core.CommNodeUser user = new Core.CommNodeUser(userId, commNodeId);
                        user.readAccess = reader.GetBoolean(2);
                        user.writeAccess = reader.GetBoolean(3);
                        user.lastReadMessage = reader.GetInt32(4);
                        user.informWhenNew = reader.GetBoolean(5);

                        _core.commNodes[commNodeId].commNodeUsers.TryAdd(userId, user);
                        _core.users[userId].commNodeRights.Add(commNodeId, user);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
        public void getCommunicationNodeMessage(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                           [id]
                          ,[commnodeid]
                          ,[sender]
                          ,[headline]
                          ,[messagebody]
                          ,[sendingdate]
                  FROM [engine].[v_CommunicationNodeMessages]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        int commNodeId = reader.GetInt32(1);
                        int sender = reader.GetInt32(2);
                        if (!_core.users.ContainsKey(sender)) continue;
                        if (!_core.commNodes.ContainsKey(commNodeId)) continue;

                        Core.CommunicationNodeMessage message = new Core.CommunicationNodeMessage(id, commNodeId);
                        message.sender = sender;
                        message.headline = reader.GetString(3);
                        message.messageBody = reader.GetString(4);
                        message.sendingDate = reader.GetDateTime(5);

                        _core.commNodes[commNodeId].commNodeMessages.TryAdd(id, message);

                        if (_core.identities.commNodeMessage.id < id) _core.identities.commNodeMessage.id = id;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getMessageHeads(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        id, 
                        sender,                      
                        headline,                      
                        messagetype,
                        sendingdate
                  FROM [engine].[v_MessageHeads]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        System.Nullable<int> sender = reader.IsDBNull(1) ? null : (System.Nullable<int>)reader.GetInt32(1);                       
                        string headline = reader.GetString(2);                        
                        short messagetype = reader.GetInt16(3);
                        DateTime sendingdate = reader.GetDateTime(4);

                        //if (!_core.users.ContainsKey(sender)) continue;
                        //if (!_core.commNodes.ContainsKey(commNodeId)) continue;

                        Core.MessageHead messageHead = new Core.MessageHead();
                        messageHead.id = id;
                        messageHead.sender = sender;
                        messageHead.headline = headline;
                        messageHead.messagetype = messagetype;
                        messageHead.sendingdate = sendingdate;
                        
                        _core.messages.TryAdd(id, messageHead);

                        if (_core.identities.message.id < id) _core.identities.message.id = id;
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getMessageParticipants(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                         headerId, 
                         participant, 
                         [read]
                  FROM [engine].[v_MessageParticipants]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int headerId = reader.GetInt32(0);
                        int participant = reader.GetInt32(1);
                        bool read = reader.GetBoolean(2);

                        if (!_core.messages.ContainsKey(headerId)) continue;
                        Core.MessageHead messageHead = _core.messages[headerId];
                        Core.MessageParticipants messageParticipants = new Core.MessageParticipants();

                        messageParticipants.headerId = headerId;
                        messageParticipants.participant = participant;
                        messageParticipants.read = read;

                        messageHead.messageParticipants.Add(messageParticipants);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getMessageBody(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        headerid, 
                        [message],
                        messagePart,
                        sender,
                        sendingDate
                  FROM [engine].[v_MessageBody]";


                SqlCommand command = new SqlCommand(commandText, connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int headerId = reader.GetInt32(0);
                        if (!_core.messages.ContainsKey(headerId)) continue;
                        Core.MessageHead messageHead = _core.messages[headerId];

                        string message = reader.GetString(1);
                        int messagePart = reader.GetInt32(2);
                        int sender = reader.GetInt32(3);
                        DateTime sendingdate = reader.GetDateTime(4);

                        

                        Core.MessageBody messageBody = new Core.MessageBody();
                        messageBody.headerId = headerId;
                        messageBody.message = message;
                        messageBody.messagePart = messagePart;
                        messageBody.sender = sender;
                        messageBody.sendingDate = sendingdate;

                        messageHead.messages.Add(messageBody);                       
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }


        public void getCombat(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
           {
                string commandText = @"SELECT 
                        [combatId]
                       ,[attackerId]
                       ,[defenderId]
                       ,[attackerUserId]
                       ,[defenderUserId]
                       ,[starId]
                       ,[spaceX]
                       ,[spaceY]
                       ,[systemX]
                       ,[systemY]
                       ,[attackerDamageDealt]
                       ,[defenderDamageDealt]
                       ,[attackerHitPointsRemain]
                       ,[defenderHitPointsRemain]
                       ,[attackerName] 
                       ,[defenderName]
                       ,defenderHasRead
                       ,messageDT
                        ,attackerExperience
	                    ,defenderExperience
	                    ,attackerShipHullId
	                    ,defenderShipHullId 
	                    ,attackerShipHullImageId
	                    ,defenderShipHullImageId 
	                    ,attackerEvasion		
	                    ,attackerMaxHitPoints
	                    ,attackerStartHitpoint
	                    ,defenderEvasion		
	                    ,defenderMaxHitPoints
	                    ,defenderStartHitpoint
                        ,attackerShield	
			            ,defenderShield 
                  FROM [engine].[v_Combat]";

                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int id = reader.GetInt32(0);
                        Core.Combat combat = new Core.Combat(id);
                        combat.AttackerId               = reader.GetInt32(1);
                        combat.DefenderId               = reader.GetInt32(2);
                        combat.AttackerUserId           = reader.GetInt32(3);
                        combat.DefenderUserId           = reader.GetInt32(4);
                        combat.StarId                   = reader.GetInt32(5);
                        combat.SpaceX                   = reader.GetInt32(6);
                        combat.SpaceY                   = reader.GetInt32(7);
                        combat.SystemX                  = reader.GetInt32(8);
                        combat.SystemY                  = reader.GetInt32(9);
                        combat.AttackerDamageDealt      = reader.GetInt32(10);
                        combat.DefenderDamageDealt      = reader.GetInt32(11);
                        combat.AttackerHitPointsRemain  = reader.GetInt32(12);
                        combat.DefenderHitPointsRemain  = reader.GetInt32(13);

                        combat.AttackerName             = reader.GetString(14);
                        combat.DefenderName             = reader.GetString(15);

                        combat.DefenderHasRead          = reader.GetBoolean(16);
                        combat.MessageDT                = reader.GetDateTime(17);


                        combat.AttackerExperience       = reader.GetInt32(18);
                        combat.DefenderExperience       = reader.GetInt32(19);
                        combat.AttackerShipHullId       = reader.GetInt32(20);
                        combat.DefenderShipHullId       = reader.GetInt32(21);
                        combat.AttackerShipHullImageId  = reader.GetInt32(22);
                        combat.DefenderShipHullImageId  = reader.GetInt32(23);
                        combat.AttackerEvasion          = reader.GetInt32(24);
                        combat.AttackerMaxHitPoints     = reader.GetInt32(25);
                        combat.AttackerStartHitpoint    = reader.GetInt32(26);
                        combat.DefenderEvasion          = reader.GetInt32(27);
                        combat.DefenderMaxHitPoints     = reader.GetInt32(28);
                        combat.DefenderStartHitpoint    = reader.GetInt32(29);

                        combat.AttackerShield = reader.GetInt32(30);
                        combat.DefenderShield = reader.GetInt32(31);

                        _core.combats.TryAdd(id, combat);

                        if (_core.identities.combat.id < id) _core.identities.combat.id = id;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getCombatRounds(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT [combatId]
                          ,[roundNumber]
                          ,[shotNumber]
                          ,[side]
                          ,[moduleId]
                          ,[damage]
                          ,[hitPropability]
                          ,[isHit]
                      FROM [engine].[v_CombatRounds]";

                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        Core.CombatRound combatRound = new Core.CombatRound(
                            combatId : reader.GetInt32(0),
                            roundNumber : reader.GetInt32(1),
                            shotNumber : reader.GetInt32(2),
                            side : reader.GetInt32(3),
                            moduleId : reader.GetInt32(4),
                            damage : reader.GetInt32(5),
                            hitPropability : reader.GetFloat(6),
                            isHit : reader.GetBoolean(7)
                        );

                        if (_core.combats.ContainsKey(combatRound.CombatId))
                        {
                            _core.combats[combatRound.CombatId].CombatRounds.Add(combatRound);
                        }

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }

        public void getGalaxyEvents(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        [id]
	                    ,[eventType]
	                    ,[int1]
	                    ,[int2]
	                    ,[int3]
	                    ,[int4]
	                    ,[int5]
	                    ,[int6]
	                    ,[string1]
	                    ,[string2]
	                    ,[string3]
	                    ,[string4]
	                    ,[string5]
	                    ,[string6]
	                    ,[string7]
	                    ,[string8]
                        ,eventDatetime
                      FROM [engine].[v_GalacticEvents]";

                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        /*
                        int? int1 = reader.IsDBNull(2) ? null : (System.Nullable<int>) reader.GetInt32(2);
                        int? int2 = reader.IsDBNull(3) ? null : (System.Nullable<int>) reader.GetInt32(3);
                        int? int3 = reader.IsDBNull(4) ? null : (System.Nullable<int>) reader.GetInt32(4);
                        int? int4 = reader.IsDBNull(5) ? null : (System.Nullable<int>) reader.GetInt32(5);
                        int? int5 = reader.IsDBNull(6) ? null : (System.Nullable<int>) reader.GetInt32(6);
                        int? int6 = reader.IsDBNull(7) ? null : (System.Nullable<int>) reader.GetInt32(7);
                        */

                        Core.GalacticEvents GalacticEvent = new Core.GalacticEvents(
                            id: reader.GetInt32(0),
                            eventType: reader.GetInt32(1),
                            eventDatetime: reader.GetDateTime(16),

                            int1: reader.IsDBNull(2) ? null : (System.Nullable<int>) reader.GetInt32(2),
                            int2: reader.IsDBNull(3) ? null : (System.Nullable<int>) reader.GetInt32(3),
                            int3: reader.IsDBNull(4) ? null : (System.Nullable<int>) reader.GetInt32(4),
                            int4: reader.IsDBNull(5) ? null : (System.Nullable<int>) reader.GetInt32(5),
                            int5: reader.IsDBNull(6) ? null : (System.Nullable<int>) reader.GetInt32(6),
                            int6: reader.IsDBNull(7) ? null : (System.Nullable<int>) reader.GetInt32(7),

                            string1: reader.IsDBNull(8) ? null : reader.GetString(8),
                            string2: reader.IsDBNull(9) ? null : reader.GetString(9),
                            string3: reader.IsDBNull(10) ? null : reader.GetString(10),
                            string4: reader.IsDBNull(11) ? null : reader.GetString(11),
                            string5: reader.IsDBNull(12) ? null : reader.GetString(12),
                            string6: reader.IsDBNull(13) ? null : reader.GetString(13),
                            string7: reader.IsDBNull(14) ? null : reader.GetString(14),
                            string8: reader.IsDBNull(15) ? null : reader.GetString(15)
                        );

                        _core.galactivEvents.TryAdd(GalacticEvent.Id, GalacticEvent);
                        if (_core.identities.galacticEvents.id < GalacticEvent.Id) _core.identities.galacticEvents.id = GalacticEvent.Id;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }

        }
        public  void getShipRefits(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                SqlCommand command = new SqlCommand(
                  @"SELECT  
                    [shipId]
                      ,[refitCounter]                      
                  FROM [engine].[v_ShipRefit]",
                  connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {
                        int shipId = reader.GetInt32(0);
                        int refitCounter = reader.GetInt32(1);

                        if (_core.ships[shipId] == null) continue;
                        SpacegameServer.Core.shipRefit shipRefit = new Core.shipRefit();
                        shipRefit.shipId = shipId;
                        shipRefit.refitCounter = refitCounter;


                        _core.shipRefits.Add(shipRefit);
                        //_core.ships[shipId].refitCounter = refitCounter;

                        
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }
                }

                reader.Close();
            }
        }


        public void getChatLog(SpacegameServer.Core.Core _core)
        {
            SqlConnection connection = GetConnection();
            using (connection)
            {
                string commandText = @"SELECT 
                        id
	                  ,userId
                      ,chatMessage
                      ,eventDatetime
                      FROM [engine].[v_ChatLog]";

                SqlCommand command = new SqlCommand(commandText, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    try
                    {

                        Core.ChatLog chatLog = new Core.ChatLog(
                            id: reader.GetInt32(0),
                            userId: reader.GetInt32(1),
                            chatMessage: reader.GetString(2),
                            sendingdate: reader.GetDateTime(3)
                        );

                        _core.chatLog.TryAdd(chatLog.id, chatLog);
                        if (_core.identities.chat.id < chatLog.id) _core.identities.chat.id = chatLog.id;

                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine("Exception source: {0}", ex.Source);
                        _core.writeExceptionToLog(ex);
                        break;
                    }

                }

                reader.Close();
            }
        }
    }
}
