using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class Research : Lockable
    {
        public bool IsSpecification()
        {
            return this.researchType == 10;
        }

        public SpecializationResearch GetSpecification()
        {
            SpecializationResearch SpecData = Core.Instance.SpecializationGroups.First(group => group.SpecializationResearches.Any(SpecResearch => SpecResearch.ResearchId == this.id)).SpecializationResearches.First(e => e.ResearchId == this.id);
            return SpecData;
        }

        //research cost according to spread
        public void RecalcCosts()
        {
            Core core = Core.Instance;

            // Each user has colonies, each colony has a population value
            // SelectMany merges the many colony-lists
            long populationCount = core.users.SelectMany(user => user.Value.colonies).Sum(colony => colony.population);

            //set full Population Count per user
            foreach (var user in core.users.Values)
            {
                user.Population = user.colonies.Sum(colony => colony.population);
            }

            // loop users, get their research, get the number of population per userresearch
            // results in a ResearchesAndPopulation collection. Each ResearchesAndPopulation consists of PlayerResearchId and the overall amount of population for that user
            // move mouse cursor over "var" to examine the created type
            var researchPopulations = core.users.Select(user => new
            {
                ResearchesAndPopulation = user.Value.PlayerResearch.Where(playerResearch =>playerResearch.researchId == this.id && playerResearch.isCompleted == 1).Select(
                    PlayerResearch =>
                    new
                    {
                        PlayerResearchId = PlayerResearch.researchId,
                        Population = user.Value.Population
                    })
            });


            //flat the previous enumerator
            var flatted = researchPopulations.SelectMany(userResearches => userResearches.ResearchesAndPopulation);

            //group by researchId and then sum the population per researchId
            var groupedAndSummed = flatted.GroupBy(flattedResearchPopulations => flattedResearchPopulations.PlayerResearchId).Select(e =>
                new
                {
                    ResearchId = e.Key,
                    Population = flatted.Where(flattedElement => flattedElement.PlayerResearchId == e.Key).Sum(flattedElement => flattedElement.Population)
                });


            //apply values to the researches in list core.Researchs
            foreach (var summedResearch in groupedAndSummed)
            {
                var research = core.Researchs[summedResearch.ResearchId];
                research.cost = research.baseCost;

                //example is with research reducer factor 0.5:
                //So if 99 of 100 players have already discovered the research, the hundreth should only have to pay ~50% of base cost, due to knowledge spread...
                //Current research cost should equal: base cost - ( 1/2 * base cost * ( population who has already discovered the research / population overall )
                double reducingBy = ((double)research.baseCost * 0.7 * (double)summedResearch.Population / (double)populationCount);
                research.cost = (short)Math.Ceiling(research.baseCost - reducingBy);
            }
        }
    }
}
