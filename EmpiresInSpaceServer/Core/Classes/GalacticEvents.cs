using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    //types translate to labels, and are also needed to let player filter which events they want to see and get remarks about
    public enum GalacticEventType
    {
        CombatAttackerWins = 0,
        Arrival = 1,
        FirstResearch = 2,
        ColonyBesieged = 3,
        ColonyOccupied = 4,
        ColonyAbandoned = 5,

        DiplAllyToAllyWar = 6,
        DiplAllyToAllyHostile = 7,
        DiplAllyToAllyNeutral = 8,
        DiplAllyToAllyOpenBorders = 9,
        DiplAllyToAllyTrade = 10,
        DiplAllyToAllyPact = 11,

        DiplAllyToPlayerWar = 12,
        DiplAllyToPlayerHostile = 13,
        DiplAllyToPlayerNeutral = 14,
        DiplAllyToPlayerOpenBorders = 15,
        DiplAllyToPlayerTrade = 16,
        DiplAllyToPlayerPact = 17,

        DiplPlayerToPlayerWar = 18,
        DiplPlayerToPlayerHostile = 19,
        DiplPlayerToPlayerNeutral = 20,
        DiplPlayerToPlayerOpenBorders = 21,
        DiplPlayerToPlayerTrade = 22,
        DiplPlayerToPlayerPact = 23,

        CombatDefenderWins = 24
    }

    public class GalacticEvents
    {
        public int Id;

        public GalacticEventType EventType;

        public DateTime EventDatetime;
        public int? Int1 { get; set; }
        public int? Int2 { get; set; }
        public int? Int3 { get; set; }
        public int? Int4 { get; set; }
        public int? Int5 { get; set; }
        public int? Int6 { get; set; }

        public string String1 { get; set; }
        public string String2 { get; set; }
        public string String3 { get; set; }
        public string String4 { get; set; }
        public string String5 { get; set; }
        public string String6 { get; set; }
        public string String7 { get; set; }
        public string String8 { get; set; }

        public GalacticEvents(){
        }
        public GalacticEvents(int id)
        {
            Id = id;
        }

        public GalacticEvents(int id
            , int eventType
            , DateTime eventDatetime
            , int? int1 = null
            , int? int2 = null
            , int? int3 = null
            , int? int4 = null
            , int? int5 = null
            , int? int6 = null
            , string string1 = null
            , string string2 = null
            , string string3 = null
            , string string4 = null
            , string string5 = null
            , string string6 = null
            , string string7 = null
            , string string8 = null)
        {
            Id = id;

            EventType = (GalacticEventType)eventType;
            EventDatetime = eventDatetime;

            Int1 = int1;
            Int2 = int2;
            Int3 = int3;
            Int4 = int4;
            Int5 = int5;
            Int6 = int6;

            String1  = string1;
            String2  = string2;
            String3  = string3;
            String4  = string4;
            String5  = string5;
            String6  = string6;
            String7  = string7;
            String8  = string8;
        }

        public static void AddNewEvent(GalacticEventType eventType
            , int? int1 = null
            , int? int2 = null
            , int? int3 = null
            , int? int4 = null
            , int? int5 = null
            , int? int6 = null
            , string string1 = null
            , string string2 = null
            , string string3 = null
            , string string4 = null
            , string string5 = null
            , string string6 = null
            , string string7 = null
            , string string8 = null)
        {

            int eventId = (int)Core.Instance.identities.galacticEvents.getNext();

            // Datetime send to JS have to be in universal, and they should not include to many milliseconds
            DateTime EventTime = DateTime.Now;
            EventTime = EventTime.ToUniversalTime();
            EventTime = DateTime.Parse( EventTime.ToString("s"));

            GalacticEvents newEvent = new GalacticEvents(eventId, (int)eventType, EventTime , 
                int1, int2, int3, int4, int5, int6,
                string1, string2, string3, string4, string5, string6, string7, string8);

            Core.Instance.galactivEvents.TryAdd(newEvent.Id, newEvent);
            Core.Instance.dataConnection.insertGalacticEvent(newEvent);
            //Core.Instance.dataConnection.insertGalacticEvent(new { x : newEvent });

            if (Core.Instance.SendEvent != null)
                Core.Instance.SendEvent(newEvent);
        }

        public static void CreateEventFromDiplomacy(DiplomaticEntity sender, DiplomaticEntity target, Relation newRelation, Relation oldRelation)
        {
            int RelationImproved = newRelation > oldRelation ? 1 : 0;
            GalacticEventType type = DetermineDiplomaticEventType(sender.diplomaticType == 2, target.diplomaticType == 2, newRelation);

            GalacticEvents.AddNewEvent(type, int1: sender.id, int2: target.id, int3: (int?)newRelation, int4: (int?)oldRelation, int5: sender.diplomaticType, int6: target.diplomaticType);
        }

        public static GalacticEventType DetermineDiplomaticEventType(bool SenderIsAlliance, bool TargetIsAlliance, Relation newRelation)
        {
            if (SenderIsAlliance && TargetIsAlliance)
            {
                switch (newRelation)
                {
                    case Relation.War:
                        return GalacticEventType.DiplAllyToAllyWar;
                    case Relation.Hostile:
                        return GalacticEventType.DiplAllyToAllyHostile;
                    case Relation.Neutral:
                        return GalacticEventType.DiplAllyToAllyNeutral;
                    case Relation.Trade:
                        return GalacticEventType.DiplAllyToAllyTrade;
                    case Relation.Pact:
                        return GalacticEventType.DiplAllyToAllyPact;
                }
            }

            if (SenderIsAlliance || TargetIsAlliance)
            {
                switch (newRelation)
                {
                    case Relation.War:
                        return GalacticEventType.DiplAllyToPlayerWar;
                    case Relation.Hostile:
                        return GalacticEventType.DiplAllyToPlayerHostile;
                    case Relation.Neutral:
                        return GalacticEventType.DiplAllyToPlayerNeutral;
                    case Relation.Trade:
                        return GalacticEventType.DiplAllyToPlayerTrade;
                    case Relation.Pact:
                        return GalacticEventType.DiplAllyToPlayerPact;
                }
            }


            switch (newRelation)
            {
                case Relation.War:
                    return GalacticEventType.DiplPlayerToPlayerWar;
                case Relation.Hostile:
                    return GalacticEventType.DiplPlayerToPlayerHostile;
                case Relation.Neutral:
                    return GalacticEventType.DiplPlayerToPlayerNeutral;
                case Relation.Trade:
                    return GalacticEventType.DiplPlayerToPlayerTrade;
                case Relation.Pact:
                    return GalacticEventType.DiplPlayerToPlayerPact;
            }

            return GalacticEventType.DiplPlayerToPlayerNeutral;
        }

    }
}
