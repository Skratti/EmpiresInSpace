using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MapGenerator.StarMapSolarSystemGenerator
{
    public enum planetTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle = 6, Barren = 7, Ice = 8, NoAtmosphere = 9, HugeGasGiant = 10, SmallGasGiant = 11, StonyMountain = 12, ThickPosinousAtmosphere = 13, VerySparseAsteroids = 14, SparseAsteroids = 15, DenseAsteroids = 16, VeryDenseAsteroids = 17 };
    public enum moonTypes { VeryVolcanic = 0, Volcanic = 1, Desert = 2, Water = 3, Land = 4, Earthlike = 5, Jungle = 6, Barren = 7, Ice = 8, NoAtmosphere = 9, StonyMountain = 10, ThickPosinousAtmosphere = 11 };
    public enum asteroidCircleTypes { VerySparse = 0, Sparse = 1, Dense = 2, VeryDense = 3 };
    public enum asteroidTypes { None = 0, Sparse = 1, Dense = 2 };



    //Both these classes are used to detect if, and what kind of type, a planet is on an orbit (circle) around  the sun
    public class PlanetChance
    {
        public planetTypes type { get; set; }
        public int circle { get; set; }
        public int probability { get; set; }

        //needed when the random generator creates an int between 0 and 100, to detect if this is the planet to be placed
        public int probStart = 0;
        public int probEnd = 0;
    }

    public class MoonChance
    {
        public moonTypes type { get; set; }
        public int circle { get; set; }
        public int probability { get; set; }

        //needed when the random generator creates an int between 0 and 100, to detect if this is the planet to be placed
        public int probStart = 0;
        public int probEnd = 0;
    }


    
    public class SystemGeneratorWorker2
    {
        Star star;

        private static Random randomGenerator = new Random((int)DateTime.Now.Ticks);
        public int elementId = 0;
        public int AsteroidCirclesCount = 0;
        int centerX = 12;

        public static int maxCircles = 3;      //previously, maxCircles was 10 ->  //(xAxis - 4 ) / 2 ; //each circle has a diameter of 1 and the innermost 4 Fields are reserved        
        
        public bool showText = false;
        
        systemElementTypeDetection2 typeDetector;
        systemElementTypeDetection2 startingSystemTypeDetector;

        System.Windows.Forms.TextBox TextBox;

        public SystemGeneratorWorker2(System.Windows.Forms.TextBox textbox = null)
        {
            TextBox = textbox;

            typeDetector = new systemElementTypeDetection2(maxCircles);
            //typeDetector.showPropabilities(textbox);

            startingSystemTypeDetector = new systemElementTypeDetection2(16, true);
            //startingSystemTypeDetector.showPropabilities(textbox);
        }

        public void resetSystemGeneratorValues()
        {
            elementId = 0;
            AsteroidCirclesCount = 0;            
        }

        public SolarSystem createSystem( bool _text, sunTypes _type, bool _startingSystem, Star _star)
        {
            //set System generation values to default values
            resetSystemGeneratorValues();
            star = _star;
        
            showText = _text;

            typeDetector.habitablePlanetCount = 0;
            startingSystemTypeDetector.habitablePlanetCount = 0;

            SolarSystem SolarSystemInstance;
            if (_startingSystem)
                SolarSystemInstance = new SolarSystem(TextBox, showText, _startingSystem, star);
            else
                SolarSystemInstance = new SolarSystem(TextBox, showText, _startingSystem, star);

            MakeSystem(SolarSystemInstance, _type);

            if (showText && TextBox != null) TextBox.Text += SolarSystemInstance.PlanetsCount + " Planets - " + SolarSystemInstance.AsteroidCirclesCount + " Asteroids" + Environment.NewLine;

            SolarSystemInstance = check( _text, _type, _startingSystem, SolarSystemInstance);

            return SolarSystemInstance;
        }

        private void MakeSystem(SolarSystem solarSystem, sunTypes type)
        {
            solarSystem.systemElements.Clear();
            solarSystem.neighbouringStars = new List<systemElement>();

            createSun(solarSystem, type);
            createCircles(solarSystem);
            //createMoons(solarSystem);
        }

        private void createSun(SolarSystem solarSystem, sunTypes _type)
        {
            systemElement sun = createElement(solarSystem , - 1, -1);
            int centerX = (SolarSystem.Size / 2);
            sun.x = star.X;
            sun.y = star.Y;
            sun.size = 1;

            switch (_type)
            {
                case sunTypes.WhiteGiant:
                    sun.type = 45;
                    break;
                case sunTypes.YellowGiant:
                    sun.type = 45;
                    break;
                case sunTypes.OrangeGiant:
                    sun.type = 45;
                    break;
                case sunTypes.RedGiant:
                    sun.type = 50;
                    break;
                case sunTypes.MSWhite:
                    sun.type = 45;
                    break;
                case sunTypes.MSBlue:
                    sun.type = 45;
                    break;
                case sunTypes.MSYellow:
                    sun.type = 59;
                    break;
                case sunTypes.MSOrange:
                    sun.type = 55;
                    break;
                case sunTypes.MSRed:
                    sun.type = 50;
                    break;
                case sunTypes.WhiteDwarfStar:
                    sun.type = 45;
                    break;
                default:
                    sun.type = 55;
                    break;
            }

            //sun.type = (randomGenerator.Next(0, 3) * 10) + 45;
            //45	Blauer Riese
            //50	Roter Riese
            //55	Oranger Riese

            writeCoords(sun);
        }

        private void createMoons(SolarSystem solarSystem)
        {
            for (int i = 0; i < solarSystem.systemElements.Count; i++)
            {
                if (solarSystem.systemElements[i].circleNo < 2) continue; //innermost circle has no moons
                if (solarSystem.systemElements[i].type == 10 || solarSystem.systemElements[i].type == 11) continue; //no asteroid has moons
                if (solarSystem.systemElements[i].childOf > 0) continue; //moons themselves do not have moons

                int numberOfMoons = randomGenerator.Next(0, 3);//up to two moons
                int firstMoonX = -10;
                int firstMoonY = -10;
                for (int j = 0; j < numberOfMoons; j++)
                {
                    int newX = solarSystem.systemElements[i].x;
                    int newY = solarSystem.systemElements[i].y;

                    systemElement dummymoon = createDummyElement(solarSystem.systemElements[i].circleNo, solarSystem.systemElements[i].id);
                    bool skip = false;
                    int retryCount = 0;
                    while (true)
                    {
                        retryCount++;
                        if (retryCount == 100)
                        {
                            skip = true;
                            break;
                        }

                        newX = randomGenerator.Next(-1, 2) + solarSystem.systemElements[i].x;
                        newY = randomGenerator.Next(-1, 2) + solarSystem.systemElements[i].y;
                        if (newX == solarSystem.systemElements[i].x && newY == solarSystem.systemElements[i].y) continue; //moon has to be on a diefferent position than its planet
                        if (newX == firstMoonX && newY == firstMoonY) continue; //moon has to be on a diefferent position than its sibling-moon (values are set by the first moon
                        //todo: check that moon is not on same field as asteroid...
                        systemElement coordCheck = solarSystem.findSystemElementsWithCoords(newX, newY);
                        if (coordCheck != null) continue;

                        dummymoon.x = newX;
                        dummymoon.y = newY;
                        solarSystem.neighbouringStars.Clear();
                        for (int z = 0; z < solarSystem.systemElements.Count; z++)
                        {
                            if (solarSystem.systemElements[z].type == 10 || solarSystem.systemElements[z].type == 11  // no asteroids to check
                                || solarSystem.systemElements[z].id == solarSystem.systemElements[i].id            //not the own motherplanet to check
                                || solarSystem.systemElements[z].childOf == solarSystem.systemElements[i].id)     //not the sibling to check
                                continue;

                            solarSystem.neighbouringStars.Add(solarSystem.systemElements[z]);
                        }

                        if (dummymoon.checkAgainstNeighbours(solarSystem.neighbouringStars, 2))
                            break;
                    }
                    if (skip) continue;

                    systemElement moon = solarSystem.createFromDummyElement(dummymoon);
                    firstMoonX = moon.x;
                    firstMoonY = moon.y;
                    moon.type = typeDetector.getMoonType(solarSystem.systemElements[i].circleNo);
                    writeCoords(moon);

                }
            }
        }

        private systemElement createDummyElement(int _circleNo, int _childOf)
        {
            systemElement newElement = new systemElement();
            newElement.circleNo = _circleNo;
            newElement.childOf = _childOf;
            return newElement;
        }

        private void writeCoords(systemElement elem)
        {
            if (showText && TextBox != null) TextBox.Text += elem.x + " - " + elem.y + " Typ  " + elem.type + Environment.NewLine;
        }

        private systemElement createElement(SolarSystem solarSystem, int _circleNo, int _childOf)
        {
            systemElement newElement = new systemElement();
            newElement.circleNo = _circleNo;
            newElement.childOf = _childOf;
            newElement.id = elementId;
            elementId++;
            solarSystem.systemElements.Add(newElement);
            return newElement;
        }

        private void createCircles(SolarSystem solarSystem)
        {
            int preventNewAsteroid = 0;

            for (int i = 1; i <= maxCircles; i++)
            {

                var Type = typeDetector.getPlanetType(i);

                if (Type == 0) continue;

                if (solarSystem.StartSystem)
                {
                    if (i > 11) continue;

                    switch (Type)
                    {
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                            createAsteroidCircle(solarSystem, i, (asteroidCircleTypes)(Type - 9));
                            AsteroidCirclesCount++;
                            solarSystem.AsteroidCirclesCount++;
                            break;
                        default:
                            createPlanetCircle(solarSystem, i, Type);
                            break;
                    }

                }
                else
                {                   

                    if (Type > 8 && Type < 13)
                    {

                        //do not place an asteroid circle right beneath another one
                        if (i == preventNewAsteroid + 1) continue;

                        preventNewAsteroid = i; 
                        AsteroidCirclesCount++;
                        solarSystem.AsteroidCirclesCount++;


                        asteroidCircleTypes asteroidCircleType = (asteroidCircleTypes)randomGenerator.Next(0, 4);
                       
                        createAsteroidCircle(solarSystem, i, asteroidCircleType);


                        if (showText && TextBox != null) TextBox.Text += " Circle " + i + " Asteroid " + asteroidCircleType.ToString() + Environment.NewLine;
                    }                    
                    else
                    {
                        if (showText && TextBox != null) TextBox.Text += " Circle " + i + " Planet" + Environment.NewLine;
                        createPlanetCircle(solarSystem, i, Type);
                         
                        preventNewAsteroid = preventNewAsteroid > 0 ? preventNewAsteroid - 1 : 0;
                    }
                }
            }
        }

        //active version:
        //number of asteroid circles, planets and else is calculated before the elements are generated
        // 1 : 5 - 13
        // 2 : 5 - 14, danach per Zufall, aber nicht zu nah an dem ersten...
        // 3 : 5 - 15, danach per Zufall, aber nicht zu nah an dem ersten...
        //check if a circle and the next two circles are not asteroidic

        //
        private void createPlanetCircle(SolarSystem solarSystem, int _circleNo, int type)
        {

            if (_circleNo > 10) return;

            systemElement planet = createElement(solarSystem, _circleNo, 0);
            while (true)
            {
                int angle = randomGenerator.Next(360);
                planet.x = (int)(star.X + (_circleNo + 0.0) * Math.Cos(angle));
                planet.y = (int)(star.Y + (_circleNo + 0.0) * Math.Sin(angle));

                solarSystem.neighbouringStars.Clear();
                solarSystem.neighbouringStars.Add(solarSystem.systemElements[planet.id - 1]);
                if (planet.id > 1) solarSystem.neighbouringStars.Add(solarSystem.systemElements[planet.id - 2]);

                //if (planet.id > 3) neighbouringStars.Add(systemElements[planet.id - 3]);

                //if (planet.id > 6) neighbouringStars.Add(systemElements[planet.id - 3]);

                if (solarSystem.systemElements.Any(e => e.id != planet.id && e.x == planet.x && e.y == planet.y)) continue;

                if (planet.checkAgainstNeighbours(solarSystem.neighbouringStars, 2))
                    break;
            }
            planet.type = type;
            writeCoords(planet);
            if (planet.type != 32) solarSystem.PlanetsCount++; //Gas giants are not counted

            if (planet.type == 25 || planet.type == 26 || planet.type == 24)
                solarSystem.HabitablePlanetsCount++;
        }

        private void createAsteroidCircle(SolarSystem solarSystem, int _circleNo, asteroidCircleTypes _type)
        {
            int degrees = 0;
            double angle = Math.PI * degrees / 180.0;
            int x_last = 0;
            int y_last = 0;
            asteroidTypes lastType = 0;
            while (degrees < 360)
            {
                angle = Math.PI * degrees / 180.0;
                int x_new = (int)(centerX + (_circleNo + 2) * Math.Cos(angle));
                int y_new = (int)(centerX + (_circleNo + 2) * Math.Sin(angle));
                if (x_new != x_last || y_new != y_last)
                {
                    x_last = x_new;
                    y_last = y_new;

                    lastType = typeDetector.getAsteroidType(lastType, _type);
                    if (lastType != asteroidTypes.None)
                    {
                        if (!solarSystem.systemElements.Any(e => e.x == x_new && e.y == y_new))
                        {
                            systemElement asteroid = createElement(solarSystem, _circleNo, 0);
                            asteroid.x = x_new;
                            asteroid.y = y_new;
                            asteroid.type = typeDetector.asteroidObjectId(lastType);
                            if (x_last == centerX || y_last == centerX)
                            {
                                writeCoords(asteroid);
                            }
                        }
                    }
                }
                degrees += 3;
            }
        }


        public SolarSystem check( bool _text, sunTypes _type, bool _startingSystem, SolarSystem system)
        {
            //?redo if the planets are not distributed evenly?  - if all are clustered in one corner, should the system be kept?
            //code...

            //the system should have at least 2 non gas giant planets?
            //code...

            //redo if it is a starting system and does not contain exactly one habitable planet
            if (system.HabitablePlanetsCount != 1 && _startingSystem)
                return createSystem( _text, _type, _startingSystem, system.star);


            if (system.systemElements.Count() < 2)
            {
                return createSystem( _text, _type, _startingSystem, system.star);
            }

            return system;
        }


    }


    public class systemElementTypeDetection2
    {

        //list of the 15 orbits of the sun, each with 0-N PlanetChances
        public Dictionary<int, List< PlanetChance>> circlePlanetChances = new Dictionary<int, List<PlanetChance>>();
        public Dictionary<int, List<MoonChance>> circleMoonChances = new Dictionary<int, List<MoonChance>>();


        public List<List<int>> moonPropability = new List<List<int>>();  //list of 100 circles. each circle has a list of many planetTypesInts. one of these will be randomly selected...


        Dictionary<int, planetTypes> CircleOverride = new Dictionary<int, planetTypes>();

        public int habitablePlanetCount;
        int maxCircles;



        public systemElementTypeDetection2( int _maxCircles, bool startingSystem = false)
        {

            for (int i = 0; i < 16; i++)
            {
                //circlePlanetChances.Add(i, new List<PlanetChance>());
                
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
            string jsonString = File.ReadAllText("./Settings/SolarSystems/SystemTwoGasGiant.json");
            dynamic files = JsonConvert.DeserializeObject(jsonString);

            List<PlanetChance> chances = new List<PlanetChance>();
             
            foreach (var f in files.planets)
            {
                PlanetChance chance = new PlanetChance
                {
                    type = f.planet.planetType,
                    circle = f.planet.circle,
                    probability = f.planet.probability
                };

                if (chances.Any(e => e.circle == chance.circle))
                {
                    chance.probStart = chances.Last(e => e.circle == chance.circle).probEnd;
                }
                chance.probEnd = chance.probStart + chance.probability;

                chances.Add(chance);

                if (!circlePlanetChances.ContainsKey(chance.circle))
                {
                    circlePlanetChances.Add(chance.circle, new List<PlanetChance>());
                }
                circlePlanetChances[chance.circle].Add(chance);

            }
        }

        
        public void fillMoonPropabilities()
        {
            string jsonString = File.ReadAllText("./SystemGenerator/Workers/Version2/Data/SystemMoons.json");
            dynamic files = JsonConvert.DeserializeObject(jsonString);

            List<MoonChance> chances = new List<MoonChance>();

            foreach (var f in files.moons)
            {
                MoonChance chance = new MoonChance
                {
                    type = f.moon.planetType,
                    circle = f.moon.circle,
                    probability = f.moon.probability
                };

                if (chances.Any(e => e.circle == chance.circle))
                {
                    chance.probStart = chances.Last(e => e.circle == chance.circle).probEnd;
                }
                chance.probEnd = chance.probStart + chance.probability;

                chances.Add(chance);

                if (!circleMoonChances.ContainsKey(chance.circle))
                {
                    circleMoonChances.Add(chance.circle, new List<MoonChance>());
                }
                circleMoonChances[chance.circle].Add(chance);
            }
        }
        


        //guarantee that exactly one earthlike is present
        // and also: one volcanic, two desert
        //keep this order:
        //                                                  Medium              Light                Light
        //  volcanic,   desert, desert, earthlike,  barren, Asteroids,  Gas,    Asteroids, Gas, Ice, Asteroids   
        //  2           4       5       6           7       8           9       10         11   12   13        

        /*
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
        */

        public int getPlanetType(int _circle)
        {
            int random = RandomHelper.GetRandomInt(0, 100);

            if (!circlePlanetChances.ContainsKey(_circle)) return 0;
            if (!circlePlanetChances[_circle].Any(e => e.probStart <= random && e.probEnd > random)) return 0;

            PlanetChance planet = circlePlanetChances[_circle].First(e => e.probStart <= random && e.probEnd > random);
            return planetObjectId(planet.type);
        }

        public int getMoonType(int _circle)
        {
            int random = RandomHelper.GetRandomInt(0, 100);

            if (!circleMoonChances.ContainsKey(_circle)) return 0;
            if (!circleMoonChances[_circle].Any(e => e.probStart <= random && e.probEnd > random)) return 0;

            MoonChance moon = circleMoonChances[_circle].First(e => e.probStart <= random && e.probEnd > random);

            return moonObjectId(moon.type);
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
            if (tempStar2.type > 44) return true;

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
