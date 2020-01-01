using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class SpecializationGroup
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Picks { get; set; }

        public int Label { get; set; }

        public int LabelDescription { get; set; }

        [System.Xml.Serialization.XmlArrayItem("SpecializationResearch", IsNullable = false)]
        public List<SpecializationResearch> SpecializationResearches;

        public SpecializationGroup()
        {
        }

        public SpecializationGroup(int id)
        {
            this.Id = id;
            SpecializationResearches = new List<SpecializationResearch>();
        }

    }

    public class SpecializationResearch
    {
        public int SpecializationGroupId { get; set; }

        public short ResearchId { get; set; }

        public short? SecondaryResearchId { get; set; }

        public short? Building1 { get; set; }
        public short? Building2 { get; set; }
        public short? Building3 { get; set; }
        public short? Module1 { get; set; }
        public short? Module2 { get; set; }
        public short? Module3 { get; set; }

        public SpecializationResearch()
        {        
        }

        public SpecializationResearch(int specId, 
            short researchId, 
            short? secondaryResearchId, 
            short? building1, short? building2, short? building3, 
            short? module1, short? module2, short? module3)
        {
            this.SpecializationGroupId = specId;
            this.ResearchId = researchId;
            this.SecondaryResearchId = secondaryResearchId;

            this.Building1 = building1;
            this.Building2 = building2;
            this.Building3 = building3;

            this.Module1 = module1;
            this.Module2 = module2;
            this.Module3 = module3;
        }

    }

}
