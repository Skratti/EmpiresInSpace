using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class ResearchQuestPrerequisite : Lockable
    {

        /// <summary>
        /// filter the ResearchQuestPrerequisite array
        /// </summary>
        /// <param name="user">optional filter, if null no filter</param>
        /// <param name="sourceType">optional filter, if null no filter</param>
        /// <param name="sourceId">optional filter, if null no filter</param>
        public static List<ResearchQuestPrerequisite> AvailableQRB(User user, int? sourceType, int? sourceId )
        {
            /* //targetType : 
             *  1 Forschung	
                2 Quest		- benötigt 2 Quest und/oder 1 Forschung (und auch nicht angezeigt Quests -> 'zufälliges Entdecken von Anomalien') und/oder Auftraggeber
			                - kann gebunden sein an Kolonie oder Schiff eines Spielers
			                - ermöglicht Quest, Forschung, Gebäude, Waren (wenn gebunden an Spielerobjekt)
                3 Gebäude
                4 Schiffsmodule
                5 Schiffsrümpfe 
                6 Ressources  - only as SourceType -> these are needed for special ressources.
             * */

            var Targets = from prerequisite in Core.Instance.ResearchQuestPrerequisites
                                        where ( sourceType == null || prerequisite.SourceType ==  sourceType  ) && 
                                              ( sourceId   == null || prerequisite.SourceId == sourceId)
                                        select prerequisite;

            List<ResearchQuestPrerequisite> AvailableTargets = new List<ResearchQuestPrerequisite>();

            
            foreach (var target in Targets)
            {
                if (user != null)
                {
                    if (user.hasPreRequisite(target)) AvailableTargets.Add(target);
                }
                else
                {
                    AvailableTargets.Add(target);
                }
            }
            
            return AvailableTargets;
        }

    }
}
