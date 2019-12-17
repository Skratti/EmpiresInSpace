using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Newtonsoft.Json;

namespace MapGenerator.SystemGenerator
{
    public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle = 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13, VerySparseAsteroids = 14, SparseAsteroids = 15, DenseAsteroids = 16, VeryDenseAsteroids = 17  };
    public enum moonTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle = 6, Barren = 7, Ice = 8, NoAtmosphere = 9, StonyMountain = 10, ThickPosinousAtmosphere = 11 };
    public enum asteroidCircleTypes { VerySparse = 0, Sparse = 1, Dense = 2, VeryDense = 3 };
    public enum asteroidTypes { None = 0, Sparse = 1, Dense = 2 };


    public class SystemGeneratorWorker : SystemGenerator.Workers.Worker
    {

        public static int maxCircles = 15;      //previously, maxCircles was 10 ->  //(xAxis - 4 ) / 2 ; //each circle has a diameter of 1 and the innermost 4 Fields are reserved        
        public bool paintGraphics = false;
        public bool showText = false;

        systemElementTypeDetection typeDetector;
        systemElementTypeDetection startingSystemTypeDetector;

        System.Windows.Forms.TextBox TextBox ;
        public SystemGeneratorWorker(System.Windows.Forms.TextBox textbox = null)
        {
            TextBox = textbox;

            typeDetector = new systemElementTypeDetection(maxCircles);
            typeDetector.showPropabilities(textbox);

            startingSystemTypeDetector = new systemElementTypeDetection(16, true);
            startingSystemTypeDetector.showPropabilities(textbox);
        }

        public SolarSystem createSystem(bool _paint, bool _text, sunTypes _type, bool _startingSystem)
        {         
            paintGraphics = _paint;
            showText = _text;

            typeDetector.habitablePlanetCount = 0;
            startingSystemTypeDetector.habitablePlanetCount = 0;

            SolarSystem SolarSystemInstance;
            if (_startingSystem)
                SolarSystemInstance = new SolarSystem(startingSystemTypeDetector, TextBox, showText, _startingSystem);
            else
                SolarSystemInstance = new SolarSystem(typeDetector, TextBox, showText, _startingSystem);

            SolarSystemInstance.MakeSystem(_type);

            if (showText && TextBox != null) TextBox.Text += SolarSystemInstance.PlanetsCount + " Planets - " + SolarSystemInstance.AsteroidCirclesCount + " Asteroids" + Environment.NewLine;

            SolarSystemInstance = check(_paint, _text, _type, _startingSystem, SolarSystemInstance);

            return SolarSystemInstance;
        }

        public SolarSystem check(bool _paint, bool _text, sunTypes _type, bool _startingSystem, SolarSystem system)
        {
            //?redo if the planets are not distributed evenly?  - if all are clustered in one corner, should the system be kept?
            //code...

            //the system should have at least 2 non gas giant planets?
            //code...

            //redo if it is a starting system and does not contain exactly one habitable planet
            if (startingSystemTypeDetector.habitablePlanetCount != 1 && _startingSystem)
                return createSystem(_paint, _text, _type, _startingSystem);

            return system;
        }

        
    }


    public class systemElementTypeDetection
    {
        public List<List<int>> planetPropability = new List<List<int>>();  //list of 100 circles. each circle has a list of many planetTypesInts. one of these will be randomly selected...
        public List<List<int>> moonPropability = new List<List<int>>();  //list of 100 circles. each circle has a list of many planetTypesInts. one of these will be randomly selected...


        Dictionary<int, planetTypes> CircleOverride = new Dictionary<int, planetTypes>();
       
        public int habitablePlanetCount;
        int maxCircles;



        public systemElementTypeDetection(int _maxCircles, bool startingSystem = false)
        {
             
            for (int i = 0; i < 100; i++)
            {
                planetPropability.Add(new List<int>());
                moonPropability.Add(new List<int>());
            }

            if (startingSystem)
            {
                fillStartingSystemCircleOverride();
            }

            fillPlanetPropabilities();
            fillMoonPropabilities();

            habitablePlanetCount = 0;
            maxCircles = _maxCircles;
        }

        //guarantee that exactly one earthlike is present
        // and also: one volcanic, two desert
        //keep this order:
        //                                                  Medium              Light                Light
        //  volcanic,   desert, desert, earthlike,  barren, Asteroids,  Gas,    Asteroids, Gas, Ice, Asteroids   
        //  1           3       4       5           6       7           8       9         10    11   12        
        public void fillStartingSystemCircleOverride()
        {
            CircleOverride.Add(1, planetTypes.Volcanic);
            CircleOverride.Add(3, planetTypes.Desert);
            CircleOverride.Add(4, planetTypes.Desert);
            CircleOverride.Add(5, planetTypes.Earthlike);
            CircleOverride.Add(6, planetTypes.Barren);
            CircleOverride.Add(7, planetTypes.DenseAsteroids);
            CircleOverride.Add(8, planetTypes.HugeGasGiant);
            CircleOverride.Add(9, planetTypes.Ice);
            CircleOverride.Add(10, planetTypes.Ice);
            CircleOverride.Add(11, planetTypes.VerySparseAsteroids);
            //CircleOverride.Add(12, planetTypes.VerySparseAsteroids);
        }

        public void fillPlanetPropabilities()
        {
            foreach (planetTypes planetType in Enum.GetValues(typeof(planetTypes)))
            {
                switch (planetType)
                {
                    // public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle= 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13 };

                    case planetTypes.VeryVolcanic:
                        addPropabilities(0, 20, 50, planetType);
                        addPropabilities(20, 30, 25, planetType);
                        addPropabilities(30, 40, 10, planetType);
                        break;
                    case planetTypes.Volcanic:
                        addPropabilities(0, 20, 15, planetType);
                        addPropabilities(20, 30, 30, planetType);
                        addPropabilities(30, 40, 25, planetType);
                        addPropabilities(40, 50, 15, planetType);
                        break;
                    //
                    case planetTypes.Desert:
                        addPropabilities(0, 20, 5, planetType);
                        addPropabilities(20, 30, 20, planetType);
                        addPropabilities(30, 40, 40, planetType);
                        addPropabilities(40, 50, 30, planetType);
                        addPropabilities(50, 60, 10, planetType);
                        break;
                    case planetTypes.Water:
                        addPropabilities(20, 30, 5, planetType);
                        addPropabilities(30, 40, 10, planetType);
                        addPropabilities(40, 50, 10, planetType);
                        addPropabilities(50, 60, 5, planetType);
                        break;
                    case planetTypes.Land:
                        addPropabilities(20, 30, 10, planetType);
                        addPropabilities(30, 40, 25, planetType);
                        addPropabilities(40, 50, 25, planetType);
                        addPropabilities(50, 60, 15, planetType);
                        break;
                    case planetTypes.Earthlike:
                        addPropabilities(20, 30, 10, planetType);
                        addPropabilities(30, 40, 25, planetType);
                        addPropabilities(40, 50, 25, planetType);
                        addPropabilities(50, 60, 15, planetType);
                        break;
                    case planetTypes.Jungle:
                        addPropabilities(20, 60, 10, planetType);
                        break;
                    case planetTypes.Barren:
                        addPropabilities(20, 60, 30, planetType);
                        break;
                    case planetTypes.Ice:
                        addPropabilities(40, 70, 30, planetType);
                        addPropabilities(70, 100, 50, planetType);
                        break;
                    case planetTypes.NoAtmosphere:
                        addPropabilities(0, 100, 15, planetType);
                        break;
                    case planetTypes.HugeGasGiant:
                        addPropabilities(50, 80, 20, planetType);
                        break;
                    case planetTypes.SmallGasGiant:
                        addPropabilities(50, 100, 20, planetType);
                        break;
                    case planetTypes.StonyMountain:
                        addPropabilities(0, 100, 15, planetType);
                        break;
                    case planetTypes.ThickPosinousAtmosphere:
                        addPropabilities(10, 20, 15, planetType);
                        break;
                }
            }
        }

        public void fillMoonPropabilities()
        {
            foreach (moonTypes moonType in Enum.GetValues(typeof(moonTypes)))
            {
                switch (moonType)
                {
                    // public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle= 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13 };

                    case moonTypes.VeryVolcanic:
                        addMoonPropabilities(0, 20, 50, moonType);
                        addMoonPropabilities(20, 30, 20, moonType);
                        addMoonPropabilities(30, 70, 10, moonType);
                        break;
                    case moonTypes.Volcanic:
                        addMoonPropabilities(0, 20, 10, moonType);
                        addMoonPropabilities(20, 30, 30, moonType);
                        addMoonPropabilities(30, 40, 20, moonType);
                        addMoonPropabilities(40, 80, 10, moonType);
                        break;
                    //
                    case moonTypes.Desert:
                        addMoonPropabilities(0, 20, 5, moonType);
                        addMoonPropabilities(20, 30, 15, moonType);
                        addMoonPropabilities(30, 40, 10, moonType);
                        addMoonPropabilities(40, 50, 10, moonType);
                        addMoonPropabilities(50, 80, 10, moonType);
                        break;
                    case moonTypes.Water:
                        addMoonPropabilities(20, 30, 5, moonType);
                        addMoonPropabilities(30, 40, 10, moonType);
                        addMoonPropabilities(40, 50, 15, moonType);
                        addMoonPropabilities(50, 70, 5, moonType);
                        break;
                    case moonTypes.Land:
                        addMoonPropabilities(20, 30, 5, moonType);
                        addMoonPropabilities(30, 40, 10, moonType);
                        addMoonPropabilities(40, 50, 15, moonType);
                        addMoonPropabilities(50, 70, 5, moonType);
                        break;
                    case moonTypes.Earthlike:
                        addMoonPropabilities(20, 30, 5, moonType);
                        addMoonPropabilities(30, 40, 10, moonType);
                        addMoonPropabilities(40, 50, 15, moonType);
                        addMoonPropabilities(50, 70, 5, moonType);
                        break;
                    case moonTypes.Jungle:
                        addMoonPropabilities(20, 70, 5, moonType);
                        break;
                    case moonTypes.Barren:
                        addMoonPropabilities(20, 80, 30, moonType);
                        break;
                    case moonTypes.Ice:
                        addMoonPropabilities(40, 100, 30, moonType);
                        break;
                    case moonTypes.NoAtmosphere:
                        addMoonPropabilities(0, 100, 40, moonType);
                        break;
                    case moonTypes.StonyMountain:
                        addMoonPropabilities(0, 100, 20, moonType);
                        break;
                    case moonTypes.ThickPosinousAtmosphere:
                        addMoonPropabilities(20, 80, 10, moonType);
                        break;
                }
            }
        }

        //guarantee that exactly one earthlike is present
        // and also: one volcanic, two desert
        //keep this order:
        //                                                  Medium              Light                Light
        //  volcanic,   desert, desert, earthlike,  barren, Asteroids,  Gas,    Asteroids, Gas, Ice, Asteroids   
        //  2           4       5       6           7       8           9       10         11   12   13        


        public void fillStartingSystemPlanetPropabilities()
        {
            foreach (planetTypes planetType in Enum.GetValues(typeof(planetTypes)))
            {
                switch (planetType)
                {
                    // public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle= 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13 };

                    case planetTypes.VeryVolcanic:
                        addPropabilities(0, 20, 100, planetType);                        
                        break;
                    case planetTypes.Volcanic:
                        addPropabilities(0, 20, 100, planetType);                        
                        break;
                    //
                    case planetTypes.Desert:
                        addPropabilities(20, 38, 100, planetType);                      
                        break;
                    case planetTypes.Water:
                        addPropabilities(38, 42, 20, planetType);
                        break;
                    case planetTypes.Land:
                        addPropabilities(38, 42, 20, planetType);
                        break;
                    case planetTypes.Earthlike:
                        addPropabilities(38, 42, 20, planetType);
                        break;
                    case planetTypes.Jungle:
                        addPropabilities(38, 43, 20, planetType);
                        break;
                    case planetTypes.Barren:
                        addPropabilities(43, 50, 30, planetType);
                        break;
                    case planetTypes.DenseAsteroids:
                        addPropabilities(50, 57, 30, planetType);
                        break;
                    case planetTypes.HugeGasGiant:
                        addPropabilities(57, 63, 20, planetType);
                        addPropabilities(70, 76, 20, planetType);
                        break;
                    case planetTypes.SparseAsteroids:
                        addPropabilities(63, 70, 30, planetType);
                        break;
                    case planetTypes.Ice:
                        addPropabilities(76, 83, 30, planetType);                        
                        break;
                    case planetTypes.VerySparseAsteroids:
                        addPropabilities(83, 100, 30, planetType);
                        break;
                }
            }
        }

        public void addPropabilities(int _circleFrom, int _circleTo, int amount, planetTypes planetType)
        {
            for (int i = _circleFrom; i < _circleTo; i++)
            {
                for (int j = 0; j < amount; j++)
                {
                    planetPropability[i].Add((int)planetType);
                }
            }
        }

        public void addMoonPropabilities(int _circleFrom, int _circleTo, int amount, moonTypes moonType)
        {
            for (int i = _circleFrom; i < _circleTo; i++)
            {
                for (int j = 0; j < amount; j++)
                {
                    moonPropability[i].Add((int)moonType);
                }
            }
        }


        public void showPropabilities(System.Windows.Forms.TextBox textbox1)
        {
            if (textbox1 == null) return;

            for (int i = 0; i < planetPropability.Count; i += 10)
            {
                int overAllInCircle = 0;
                textbox1.Text += "Circle " + i + " : ";
                for (int j = 0; j < planetPropability[i].Count; j++) overAllInCircle++;
                textbox1.Text += overAllInCircle + Environment.NewLine;
            }
        }


        public int getPlanetType(int _circle)
        {
            if (CircleOverride.ContainsKey(_circle)) return planetObjectId(CircleOverride[_circle]);

            //circles begin with 1, but our list starts with 0, same with maxcircles
            _circle--;
            int circleToCheck = (int)((100.0 / (maxCircles - 1)) * _circle);
            planetTypes newType = (planetTypes)planetPropability[circleToCheck][RandomHelper.GetRandomInt(0, planetPropability[circleToCheck].Count)];



            
            return planetObjectId(newType);
        }

        public int getMoonType(int _circle)
        {
            //circles begin with 1, but our list starts with 0, same with maxcircles
            _circle--;
            int circleToCheck = (100 / (maxCircles - 1)) * _circle;
            moonTypes newType = (moonTypes)moonPropability[circleToCheck][RandomHelper.GetRandomInt(0, moonPropability[circleToCheck].Count)];
            
            
            return moonObjectId(newType);
        }

        public asteroidTypes getAsteroidTypeStart(asteroidCircleTypes circleType)
        {
            //start should be 

            int maxValue = 30; // ((int)asteroidCircleTypes.VeryDense) * 10;

            //very dense :  5 = none, 30 = sparse, 65 = dense
            //dense :  10 = none, 35 = sparse, 55 = dense
            //sparse : 20 = none, 65 = sparse, 15 = dense
            //very sparse : 54 none , 60 sparse,    5 dense
            //+ additional factor to repeat the previous tile

            switch (circleType)
            {
                case asteroidCircleTypes.VerySparse:
                    break;

            }
            return (asteroidTypes)1;
        }

        public asteroidTypes getAsteroidType(asteroidTypes lastType, asteroidCircleTypes circleType)
        {
            int rand = RandomHelper.GetRandomInt(0, 100);
            switch (circleType)
            {
                case asteroidCircleTypes.VerySparse:
                    if (rand < 45) return asteroidTypes.None;
                    if (rand < 95) return asteroidTypes.Sparse;
                    if (rand < 100) return asteroidTypes.Dense;
                    break;
                case asteroidCircleTypes.Sparse:
                    if (rand < 25) return asteroidTypes.None;
                    if (rand < 85) return asteroidTypes.Sparse;
                    return asteroidTypes.Dense;
                case asteroidCircleTypes.Dense:
                    if (rand < 5) return asteroidTypes.None;
                    if (rand < 45) return asteroidTypes.Sparse;
                    return asteroidTypes.Dense;
                case asteroidCircleTypes.VeryDense:
                    if (rand < 1) return asteroidTypes.None;
                    if (rand < 30) return asteroidTypes.Sparse;
                    return asteroidTypes.Dense;
            }

            return asteroidTypes.Sparse;
        }

        public int asteroidObjectId(asteroidTypes asteroid)
        {
            /*
            4	Nebel
            5	dichter Nebel
            10	Asteroidenfeld
            11	dichtes Asteroidenfeld
             * */
            switch (asteroid)
            {
                case asteroidTypes.Sparse:
                    return 10;
                    break;
                case asteroidTypes.Dense:
                    return 11;
                    break;
            }
            return 10;
        }

        public int planetObjectId(planetTypes planet)
        {
            /*
            24	Klasse M
            25	Klasse L
            26	Klasse N
            27	Klasse G
            28	Klasse K
            29	Klasse H
            30	Klasse X
            31	Klasse A, Toxic 
            32	Gasriese
            */
            switch (planet)
            {
                // public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle= 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13 };

                case planetTypes.VeryVolcanic:
                    return 30;
                case planetTypes.Volcanic:
                    return 30;
                case planetTypes.Desert:
                    return 27;
                case planetTypes.Water:
                    return 29;  //Barren
                case planetTypes.Land:
                    habitablePlanetCount++;
                    return 26;
                case planetTypes.Earthlike:
                    habitablePlanetCount++;
                    return 24;
                case planetTypes.Jungle: //Todo: is a subtype of land. as well as swamp. should be implemented so
                    habitablePlanetCount++;
                    return 24;
                case planetTypes.Barren:
                    return 29;
                case planetTypes.Ice:
                    return 28;
                case planetTypes.NoAtmosphere:
                    return 29;
                case planetTypes.HugeGasGiant:
                    return 32;
                case planetTypes.SmallGasGiant:
                    return 32;
                case planetTypes.StonyMountain:
                    return 29; //Barren
                case planetTypes.ThickPosinousAtmosphere:
                    return 31;
                case planetTypes.VerySparseAsteroids:
                    return 9;
                case planetTypes.SparseAsteroids:
                    return 10;
                case planetTypes.DenseAsteroids:
                    return 11;
                case planetTypes.VeryDenseAsteroids:
                    return 12;
            }

            return 22;
        }

        public int moonObjectId(moonTypes moon)
        {
            /*
                 34	M Mond
                36	L  Mond
                37	N  Mond
                38	G  Mond
                39	K  Mond
                40	H  Mond
                41	X Mond
                42	Toxic  Mond
                43	Gasriese
                44	Asteroidenmond
            */
            switch (moon)
            {
                // public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle= 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13 };

                case moonTypes.VeryVolcanic:
                    return 41;
                case moonTypes.Volcanic:
                    return 41;
                case moonTypes.Desert:
                    return 38;
                case moonTypes.Water:
                    return 34;
                case moonTypes.Land:
                    return 34;
                case moonTypes.Earthlike:
                    return 34;
                case moonTypes.Jungle: //Todo: is a subtype of land. as well as swamp. should be implemented so                  
                    return 34;
                case moonTypes.Barren:
                    return 40;
                case moonTypes.Ice:
                    return 39;
                case moonTypes.NoAtmosphere:
                    return 44;
                case moonTypes.StonyMountain:
                    return 44;
                case moonTypes.ThickPosinousAtmosphere:
                    return 42;
            }

            return 22;
        }
        /*
        34	M Mond
        36	L  Mond
        37	N  Mond
        38	G  Mond
        39	K  Mond
        40	H  Mond
        41	X Mond
        42	Toxic  Mond
        43	Gasriese
        44	Asteroidenmond
         * 
         * */
    }

    public class systemElement
    {
        public int id;
        public int childOf;
        public int x;
        public int y;
        public int circleNo;
        public int x_orig;
        public int y_orig;

        public int type;
        public int size;

        public void setCoords(int _x, int _y)
        {
            x = _x;
            y = _y;
        }

        public void Draw(System.Drawing.Graphics g)
        {

            //type = objectId -> = color to draw with
            //Asteroid grey...
            System.Drawing.SolidBrush myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);
            int DrawSize = 30;
            switch (type)
            {                  
                case 10:
                case 11:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Gray); //Asteroids
                    DrawSize = 5;
                    break;
                case 24:
                case 25:
                case 26:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Green);  //Earthlike
                    DrawSize = 15;
                    break;
                case 27:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Yellow);  //Desert
                    DrawSize = 15;
                    break;
                case 28:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White); //Ice
                    DrawSize = 15;
                    break;
                case 29:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.RosyBrown); //Barren
                    DrawSize = 15;
                    break;
                case 30:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Red); //Volcano
                    DrawSize = 15;
                    break;
                case 31:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.YellowGreen); //Toxic
                    DrawSize = 15;
                    break;
                case 32:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Blue); //Gas
                    DrawSize = 20;
                    break;
                case 34:
                case 35:
                case 36:
                case 37:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Green); //Earthlike
                    DrawSize = 8;
                    break;
                case 38:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Yellow); //Desert
                    DrawSize = 8;
                    break;
                case 39:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White); //Ice
                    DrawSize = 8;
                    break;
                case 40:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.RosyBrown); //Barren
                    DrawSize = 8;
                    break;
                case 41:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.Red); //Vulcano
                    DrawSize = 8;
                    break;
                case 42:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.YellowGreen); //Toxic
                    DrawSize = 8;
                    break;
                case 44:
                    myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.DarkGray); //Gas
                    DrawSize = 8;
                    break;

            }


            g.FillEllipse(myBrush, new System.Drawing.Rectangle(x * 20, y * 20, DrawSize, DrawSize));
        }

        public bool checkAgainstNeighbours(List<systemElement> neighbouringStars, int minDistance)
        {
            for (int j = 0; j < neighbouringStars.Count; j++)
            {
                if (!GoodDistance(this, neighbouringStars[j], minDistance))
                {
                    return false;
                }
            }
            return true;
        }

        public static bool GoodDistance(systemElement tempStar, systemElement tempStar2, int minDistance)
        {
            //int tempDistance = Distance2D(tempStar.x, tempStar.y, tempStar2.x, tempStar2.y);
            int tempDistance = Math.Max(Math.Abs(tempStar.x - tempStar2.x), Math.Abs(tempStar.y - tempStar2.y));//  tempStar.y, tempStar2.x, tempStar2.y);
            if (tempDistance < minDistance)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }

}
