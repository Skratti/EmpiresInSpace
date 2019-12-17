using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    public enum sunTypes { WhiteGiant = 0, YellowGiant = 1, OrangeGiant = 2, RedGiant = 3, MSWhite = 4, MSBlue = 5, MSYellow = 6, MSOrange = 7, MSRed = 8, WhiteDwarfStar = 9 };
    

    public class StarGenerator
    {
        public List<int> sunPropability = new List<int>();  //list of 100 circles. each circle has a list of many planetTypesInts. one of these will be randomly selected...
        public List<int> sunPlayerPropability = new List<int>();  //list of 100 circles. each circle has a list of many planetTypesInts. one of these will be randomly selected...

        int StarId = 0;
        private int currentNebulaType = 0;

        public StarGenerator()
        {
            fillSunPropabilities();
        }

        public void fillSunPropabilities()
        {
            //public enum sunTypes { WhiteGiant = 0, YellowGiant = 1, OrangeGiant = 2, RedGiant = 3, MSWhite = 4, MSBlue=5,MSYellow=6,MSOrange=7,MSRed=8,WhiteStar=9 };
            foreach (sunTypes sunType in Enum.GetValues(typeof(sunTypes)))
            {
                switch (sunType)
                {
                    case sunTypes.WhiteGiant:
                        addPropabilities(5, sunType);
                        break;
                    case sunTypes.YellowGiant:
                        addPropabilities(5, sunType);
                        break;
                    case sunTypes.OrangeGiant:
                        addPropabilities(5, sunType);
                        break;
                    case sunTypes.RedGiant:
                        addPropabilities(15, sunType);
                        break;
                    case sunTypes.MSWhite:
                        addPropabilities(10, sunType);
                        addPlayerPropabilities(5, sunType);
                        break;
                    case sunTypes.MSBlue:
                        addPropabilities(5, sunType);
                        addPlayerPropabilities(1, sunType);
                        break;
                    case sunTypes.MSYellow:
                        addPropabilities(30, sunType);
                        addPlayerPropabilities(40, sunType);
                        break;
                    case sunTypes.MSOrange:
                        addPropabilities(45, sunType);
                        addPlayerPropabilities(35, sunType);
                        break;
                    case sunTypes.MSRed:
                        addPropabilities(35, sunType);
                        addPlayerPropabilities(25, sunType);
                        break;
                    case sunTypes.WhiteDwarfStar:
                        addPropabilities(5, sunType);
                        break;
                }
            }
        }
        public void addPropabilities(int amount, sunTypes sunType)
        {
            for (int j = 0; j < amount; j++)
            {
                sunPropability.Add((int)sunType);
            }
        }
        public void addPlayerPropabilities(int amount, sunTypes sunType)
        {
            for (int j = 0; j < amount; j++)
            {
                sunPlayerPropability.Add((int)sunType);
            }
        }

        public sunTypes makeType(bool isPlayer)
        {
            List<int> propability = isPlayer ? sunPlayerPropability : sunPropability;

            int maxPos = propability.Count;
            int randomPosition = RandomHelper.GetRandomInt(0, maxPos);
            return (sunTypes)propability[randomPosition];
        }

        public int makeObjectId(sunTypes type)
        {
            switch (type)
            {
                case sunTypes.WhiteGiant:
                    return 14;
                case sunTypes.YellowGiant:
                    return 14;
                case sunTypes.OrangeGiant:
                    return 15;
                case sunTypes.RedGiant:
                    return 13;
                case sunTypes.MSWhite:
                    return 3;
                case sunTypes.MSBlue:
                    return 3;
                case sunTypes.MSYellow:
                    return 2;
                case sunTypes.MSOrange:
                    return 3;
                case sunTypes.MSRed:
                    return 1;
                case sunTypes.WhiteDwarfStar:
                    return 16;
                default:
                    return 2;
            }
        }


        public Star MakeStarXY(bool isPlayer, int _x, int _y)
        {
            var type = makeType(isPlayer);
            var objectType = makeObjectId(type);
            StarId++;
            var star = new Star(type, isPlayer, objectType, StarId, _x, _y);

            return star;

        }

        private int getNebulaType()
        {
            currentNebulaType++;
            switch (currentNebulaType)
            {
                case 1:
                    return 2;
                case 2:
                    return 4;
                case 3:
                    return 5;
                case 4:
                    return 6;
                case 5:
                    currentNebulaType = 0;
                    return 7;
            }
            return 2;
        }

        public static int getNebulaId(int type)
        {
            switch (type)
            {
                case 2:
                    return 5000;
                case 4:
                    return 5001;
                case 5:
                    return 5002;
                case 6:
                    return 5003;
                case 7:
                    return 5004;
            }
            return 5000;
        }


        public Star MakeNebula(int _x, int _y, int? _nebulaType = 2 )
        {
            var type = makeType(false);
            var objectType = makeObjectId(type);
            StarId++;
            var nebula = new Star(type, false, objectType, StarId, _x, _y);
            if (_nebulaType == null)
            {
                nebula.StarNebulaType = this.getNebulaType();
            }
            else
            {
                nebula.StarNebulaType = (int)_nebulaType;
            }
            return nebula;
        }

        public void incrementNebulaType()
        {
            currentNebulaType++;
            if (currentNebulaType == 5)
                currentNebulaType = 0;
        }
    }
}
