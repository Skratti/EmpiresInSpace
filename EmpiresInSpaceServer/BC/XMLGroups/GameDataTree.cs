using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SpacegameServer.BC.XMLGroups
{
    
    [XmlRootAttribute("gameData")]
    public class GameDataTree
    {
      
        
        [XmlArrayItem("good", IsNullable = false)]        
        public SpacegameServer.Core.Good[] goods;

        [XmlArrayItem("building", IsNullable = false)]
        public SpacegameServer.Core.Building[] buildings;

        [XmlArrayItem("Research", IsNullable = false)]
        public SpacegameServer.Core.Research[] Researches;

        [XmlArrayItem("ResearchGain", IsNullable = false)]
        public List<SpacegameServer.Core.ResearchGain> ResearchGains;

        [XmlArrayItem("SpecializationGroup", IsNullable = false)]
        public List<SpacegameServer.Core.SpecializationGroup> SpecializationGroups;


        [XmlArrayItem("surfaceTile", IsNullable = false)]
        public SpacegameServer.Core.SurfaceTile[] surfaceTiles;

        [XmlArrayItem("buildOption", IsNullable = false)]
        public List<SpacegameServer.Core.BuildOption> buildOptions;

        [XmlArrayItem("shipHull", IsNullable = false)]
        public SpacegameServer.Core.ShipHull[] shipHulls;

        [XmlArrayItem("ShipHullsImage", IsNullable = false)]
        public List<SpacegameServer.Core.ShipHullsImage> ShipHullsImages;


        [XmlArrayItem("Module", IsNullable = false)]
        public SpacegameServer.Core.Module[] Modules;

        [XmlArrayItem("spaceObject", IsNullable = false)]
        public List<SpacegameServer.Core.ObjectDescription> spaceObjects;

        [XmlArrayItem("objectRelation", IsNullable = false)]
        public List<SpacegameServer.Core.ResearchQuestPrerequisite> objectRelations;

        [XmlArrayItem("InfluenceRings", IsNullable = false)]
        public List<SpacegameServer.Core.InfluenceRing> influenceRings;

        [XmlArrayItem("ObjectOnMap", IsNullable = false)]
        public List<SpacegameServer.Core.ObjectOnMap> ObjectOnMaps;


        [XmlArrayItem("PlanetType", IsNullable = false)]
        public List<SpacegameServer.Core.PlanetType> PlanetTypes;



        public SpacegameServer.Core.GalaxyMap galaxyMap;


        //public SpacegameServer.Core.[] objectRelations;
        /*					     
							
		@spaceObjects,
		@ObjectRelations
         * */

        public GameDataTree()
        {
            //goods = new Goods();
        }
    }
}
