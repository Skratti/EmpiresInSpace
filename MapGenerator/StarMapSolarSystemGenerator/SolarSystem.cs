using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator.StarMapSolarSystemGenerator
{
    public class SolarSystem
    {
        public Star star;

        private static Random randomGenerator = new Random((int)DateTime.Now.Ticks);

        public bool StartSystem = false;

        public List<systemElement> systemElements;
        public int AsteroidCirclesCount = 0; //counter for Asteroid Circles
        public int HabitablePlanetsCount = 0; //counter for habitable Planets 
        public int PlanetsCount = 0;
        public const int Size = 24;

        private int maxCircles = 15;      //previously, maxCircles was 10 ->  //(xAxis - 4 ) / 2 ; //each circle has a diameter of 1 and the innermost 4 Fields are reserved        
        private int centerX = (Size / 2);


        private int elementId = 0;
        private systemElementTypeDetection typeDetector;
        private bool showText;
        
        public List<systemElement> neighbouringStars;

        private System.Windows.Forms.TextBox TextBox;
        public SolarSystem(systemElementTypeDetection _typeDetector, System.Windows.Forms.TextBox textbox, bool _showtext, bool startsystem, Star _star)
        {
            typeDetector = _typeDetector;
            TextBox = textbox;
            showText = _showtext;
            StartSystem = startsystem;
            star = _star;

            systemElements = new List<systemElement>();
        }

        public SolarSystem(System.Windows.Forms.TextBox textbox, bool _showtext, bool startsystem, Star _star)
        {        
            TextBox = textbox;
            showText = _showtext;
            StartSystem = startsystem;
            star = _star;

            systemElements = new List<systemElement>();
        }

        public void MakeSystem(sunTypes _type)
        {
            systemElements.Clear();
            neighbouringStars = new List<systemElement>();
            //createSun(_type);
            createCircles();
            //createMoons();
        }

        private systemElement createElement(int _circleNo, int _childOf)
        {
            systemElement newElement = new systemElement();
            newElement.circleNo = _circleNo;
            newElement.childOf = _childOf;
            newElement.id = elementId;
            elementId++;
            systemElements.Add(newElement);
            return newElement;
        }

        public systemElement findSystemElementsWithCoords(int _x, int _y)
        {
            for (int i = 0; i < systemElements.Count; i++)
            {
                if (systemElements[i].x == _x && systemElements[i].y == _y) return systemElements[i];
            }
            return null;
        }

        private void createSun(sunTypes _type)
        {
            systemElement sun = createElement(-1, -1);
            sun.x = centerX - 1; //11, since coords go from 0->23, and the sun is not a point but two whole coords (11-13)
            sun.y = centerX - 1;
            sun.size = 2;

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

        private void writeCoords(systemElement elem)
        {
            if (showText && TextBox != null) TextBox.Text += elem.x + " - " + elem.y + " Typ  " + elem.type + Environment.NewLine;
        }

        //obsolete
        //first version /did try to calculate system type during creation)       
        private void createCircles()
        {
            int startingPropability = 20;            
            int preventNewAsteroid = 1;

            for (int i = 1; i < maxCircles; i++)
            {
                //there are fewer planets near the sun - prevent planet 2 + 4
                if (i == 2) continue;

                var Type = typeDetector.getPlanetType(i);

                if (this.StartSystem)
                {
                    if (i > 11) continue;

                    switch (Type)
                    {
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                            createAsteroidCircle(i, (asteroidCircleTypes)(Type - 9));
                            AsteroidCirclesCount++;
                            break;
                        default:
                            createPlanetCircle(i, Type);
                            break;
                    }

                }
                else
                {
                    if (i == 4) continue;

                    if (randomGenerator.Next(0, 100) < 5) continue; //skip circle in 5% 

                    int asteroidCirclePropability = startingPropability + (i * 3) - (preventNewAsteroid * 100) - (AsteroidCirclesCount * 30);//asteroid circle - three innerost circles are not permitted (init-Value of preventNewAsteroid does this
                    if (randomGenerator.Next(0, 100) < asteroidCirclePropability)
                    {

                        AsteroidCirclesCount++;

                        asteroidCircleTypes asteroidCircleType = (asteroidCircleTypes)randomGenerator.Next(0, 4);
                        preventNewAsteroid = 3; // 1 + (int)asteroidCircleType;
                        createAsteroidCircle(i, asteroidCircleType);


                        if (showText && TextBox != null) TextBox.Text += " Circle " + i + " Asteroid " + asteroidCircleType.ToString() + Environment.NewLine;
                    }
                    else
                    {
                        if (showText && TextBox != null) TextBox.Text += " Circle " + i + " Planet" + Environment.NewLine;
                        createPlanetCircle(i, Type);
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
        private void createPlanetCircle(int _circleNo, int type)
        {

            if (_circleNo > 10) return;

            systemElement planet = createElement(_circleNo, 0);
            while (true)
            {
                int angle = randomGenerator.Next(360);
                planet.x = (int)(centerX + (_circleNo + 2) * Math.Cos(angle));
                planet.y = (int)(centerX + (_circleNo + 2) * Math.Sin(angle));

                neighbouringStars.Clear();
                neighbouringStars.Add(systemElements[planet.id - 1]);
                if (planet.id > 1) neighbouringStars.Add(systemElements[planet.id - 2]);

                //if (planet.id > 3) neighbouringStars.Add(systemElements[planet.id - 3]);

                //if (planet.id > 6) neighbouringStars.Add(systemElements[planet.id - 3]);

                if (systemElements.Any(e => e.id != planet.id && e.x == planet.x && e.y == planet.y)) continue;

                if (planet.checkAgainstNeighbours(neighbouringStars, 2))
                    break;
            }
            planet.type = type;
            writeCoords(planet);
            if (planet.type != 32) PlanetsCount++; //Gas giants are not counted

            if (planet.type == 25 || planet.type == 26 || planet.type == 24)
                HabitablePlanetsCount++;
        }

        private void createAsteroidCircle(int _circleNo, asteroidCircleTypes _type)
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
                        if (!systemElements.Any(e => e.x == x_new && e.y == y_new))
                        {
                            systemElement asteroid = createElement(_circleNo, 0);
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

        private void createMoons()
        {
            for (int i = 0; i < systemElements.Count; i++)
            {
                if (systemElements[i].circleNo < 2) continue; //innermost circle has no moons
                if (systemElements[i].type == 10 || systemElements[i].type == 11) continue; //no asteroid has moons
                if (systemElements[i].childOf > 0) continue; //moons themselves do not have moons

                int numberOfMoons = randomGenerator.Next(0, 3);//up to two moons
                int firstMoonX = -10;
                int firstMoonY = -10;
                for (int j = 0; j < numberOfMoons; j++)
                {
                    int newX = systemElements[i].x;
                    int newY = systemElements[i].y;

                    systemElement dummymoon = createDummyElement(systemElements[i].circleNo, systemElements[i].id);
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

                        newX = randomGenerator.Next(-1, 2) + systemElements[i].x;
                        newY = randomGenerator.Next(-1, 2) + systemElements[i].y;
                        if (newX == systemElements[i].x && newY == systemElements[i].y) continue; //moon has to be on a diefferent position than its planet
                        if (newX == firstMoonX && newY == firstMoonY) continue; //moon has to be on a diefferent position than its sibling-moon (values are set by the first moon
                        //todo: check that moon is not on same field as asteroid...
                        systemElement coordCheck = findSystemElementsWithCoords(newX, newY);
                        if (coordCheck != null) continue;

                        dummymoon.x = newX;
                        dummymoon.y = newY;
                        neighbouringStars.Clear();
                        for (int z = 0; z < systemElements.Count; z++)
                        {
                            if (systemElements[z].type == 10 || systemElements[z].type == 11  // no asteroids to check
                                || systemElements[z].id == systemElements[i].id            //not the own motherplanet to check
                                || systemElements[z].childOf == systemElements[i].id)     //not the sibling to check
                                continue;

                            neighbouringStars.Add(systemElements[z]);
                        }

                        if (dummymoon.checkAgainstNeighbours(neighbouringStars, 2))
                            break;
                    }
                    if (skip) continue;

                    systemElement moon = createFromDummyElement(dummymoon);
                    firstMoonX = moon.x;
                    firstMoonY = moon.y;
                    moon.type = typeDetector.getMoonType(systemElements[i].circleNo);
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

        public systemElement createFromDummyElement(systemElement _dummy)
        {
            systemElement newElement = new systemElement();
            newElement.circleNo = _dummy.circleNo;
            newElement.childOf = _dummy.childOf;
            newElement.x = _dummy.x;
            newElement.y = _dummy.y;
            newElement.id = elementId;
            elementId++;
            systemElements.Add(newElement);
            return newElement;
        }

    }
}
