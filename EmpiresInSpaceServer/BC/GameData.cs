using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC
{
    internal static class GameData
    {
        static string gameData;

        public static string getGameData()
        {
            if (String.IsNullOrEmpty(gameData)) gameData = calcGameData();
           
            return gameData;
        }
        public static void recalcGameData()
        {
            var newGameData = calcGameData();
            gameData = newGameData;      
        }
       

        static string calcGameData()
        {
            SpacegameServer.Core.Core core = SpacegameServer.Core.Core.Instance;            

            var Tree = new XMLGroups.GameDataTree();
            Tree.goods = core.Goods;
            Tree.buildings = core.Buildings;
            
            Tree.Researches = core.Researchs;
            Tree.ResearchGains = core.ResearchGains;

            Tree.SpecializationGroups = core.SpecializationGroups;

            Tree.surfaceTiles = core.SurfaceTiles;
            Tree.buildOptions = core.BuildOptions;
            Tree.shipHulls = core.ShipHulls;
            Tree.ShipHullsImages = core.ShipHullsImages;
            Tree.Modules = core.Modules;
            Tree.spaceObjects = core.ObjectDescriptions.Values.ToList();
            Tree.objectRelations = core.objectRelations;
            Tree.influenceRings = SpacegameServer.Core.InfluenceManager.InfluenceRings;
            Tree.ObjectOnMaps = core.ObjectsOnMap.Values.ToList();
            Tree.PlanetTypes = core.PlanetTypes;

            Tree.galaxyMap = core.GalaxyMap;       

            string XML = "";

            BusinessConnector.Serialize<XMLGroups.GameDataTree>(Tree, ref XML, true);

            return XML;
        }
    }
}
