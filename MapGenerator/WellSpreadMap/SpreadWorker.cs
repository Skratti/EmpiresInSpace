using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator.WellSpreadMap
{
    public class NebulaFieldsWorker
    {
        public StarGenerator StarGenerator;
        public static List<Star> stars;

        public Settings Contract;


        public int StarsPerPlayer = 4;
        public int minDistance = 4;   //minimum distance between stars. Should be at least 3 
        public int distanceBetweenSuns = 6;
        public int starsInRow = 100;       // leads to starsInRow^2 suns
        public int xAxis = 6 * 100;

        System.Windows.Forms.TextBox Textbox;
        public GalaxyMap Map;


        public static List<Star> starsToShake = new List<Star>();
        public static List<Star> NewStarsToShake = new List<Star>();
        public static List<int> neighbours = new List<int>(); //to get the ids of the 8 neighbouring stars
        public static List<Star> neighbouringStars = new List<Star>();

        public NebulaFieldsWorker( StarGenerator starGenerator, Settings spreadContract, GalaxyMap map, System.Windows.Forms.TextBox textbox = null)
        {
            stars = new List<Star>();
            StarGenerator = starGenerator;
            Contract = spreadContract;

            StarsPerPlayer = Contract.StarsPerPlayer;
            minDistance = Contract.minDistance;
            distanceBetweenSuns = Contract.distanceBetweenSuns;
            starsInRow = Contract.starsInRow;

            Textbox = textbox;
            Map = map;

            //used to get the IDs of the neighbouring stars
            neighbours.Add((-starsInRow) - 1);
            neighbours.Add((-starsInRow));
            neighbours.Add((-starsInRow) + 1);

            neighbours.Add(-1);
            neighbours.Add(1);

            neighbours.Add(starsInRow - 1);
            neighbours.Add(starsInRow);
            neighbours.Add(starsInRow + 1);
        }

        public void GenerateMap(bool shake = true, bool round = true)
        {
            
            int id = 0;

            for (int i = 0; i < starsInRow; i++)
            {
                for (int j = 0; j < starsInRow; j++)
                {
                    int x = (i * distanceBetweenSuns);
                    int y = (j * distanceBetweenSuns);
                    var isPlayer = id % StarsPerPlayer == 0 ? true : false;
                    Star tempStar = StarGenerator.MakeStarXY(isPlayer, x, y);
                    
                    tempStar.Id = id;
                    if (shake)
                    {
                        ShakePosition(tempStar);
                    }

                    stars.Add(tempStar);
                    starsToShake.Add(tempStar);
                    id++;
                    
                }
            }
            if (Textbox != null) Textbox.Text = id.ToString() + " - " + stars.Count.ToString() + "  generierte Star Location: " + Environment.NewLine;

            //needed because stars may be too near to each other when shaking was used during star placement
            if (shake)
            {
                shakeAndCheck(0);
            }

            //make a round galaxy. 
            if (round)
            {
                MakeRound();
            }

            stars.ForEach(e => Map.addStar(e));
        }

        /// <summary>
        /// Find new position in an area around current position
        /// </summary>
        /// <param name="star"></param>
        public void ShakePosition(Star star)
        {
            int maxShake = 8;
            int substract = (maxShake - 1) / 2;

            int newPos = RandomHelper.GetRandomInt(0, maxShake * maxShake);
            int newX = newPos % maxShake;
            double y1 = newPos / maxShake;
            int newY = (int)Math.Floor(y1);
            star.X = (star.Orig_x - substract) + newX;
            star.Y = (star.Orig_y - substract) + newY;
        }

        //check that stars do not connect to each other
        private void shakeAndCheck(int turnCounter)
        {
            if (turnCounter > 100)
            {

                if (Textbox != null) Textbox.Text += "FEHLER 100 ";
                return;
            }
            
            int counted = checkForDistance();

            if (counted > 0)
            {
                if (Textbox != null) Textbox.Text += counted.ToString() + " zu prüfen..." + Environment.NewLine;

                starsToShake.Clear();
                foreach (var star in NewStarsToShake)
                {
                    starsToShake.Add(star);
                }
                NewStarsToShake.Clear();

                shakeAndCheck(turnCounter + 1);
            }
            else
                if (Textbox != null) Textbox.Text += "Done";
        }

        private int checkForDistance()
        {
            int counter = 0;
            for (int i = 0; i < starsToShake.Count; i++)
            {

                neighbouringStars.Clear();
                findNeighbours(starsToShake[i], neighbours, neighbouringStars, starsInRow);

                //check
                counter += checkAgainstNeighbours(starsToShake[i], neighbouringStars, NewStarsToShake, minDistance);
            }
            
            return counter;
        }

        private static void findNeighbours(Star center, List<int> DirectNeighbourRules, List<Star> neighbouringStars,int starsInRow)
        {
            for (int i = 0; i < DirectNeighbourRules.Count; i++)
            {
                int starIdToCheck = center.Id + DirectNeighbourRules[i];
                if (starIdToCheck >= 0 && starIdToCheck < stars.Count)
                {
                    
                    neighbouringStars.Add(stars[starIdToCheck]);
                }
            }
        }

        /// <summary>
        /// star is checked against neighbours. If it is too near to an neighbour, it is given an new position. If this does not work 9 times, on the tenth time a new position all neighbours are marked as to be shaken
        /// </summary>
        /// <param name="star"></param>
        /// <param name="neighbouringStars"></param>
        /// <param name="starsToShake"></param>
        /// <param name="minDistance"></param>
        /// <returns></returns>
        public int checkAgainstNeighbours(Star star, List<Star> neighbouringStars, List<Star> starsToShake, int minDistance)
        {
            bool allOk = false;

            for (int i = 0; i < 10 && !allOk; i++)
            {
                allOk = true;

                for (int j = 0; j < neighbouringStars.Count; j++)
                {
                    if (!GoodDistance(star, neighbouringStars[j], minDistance))
                    {
                        allOk = false;

                        if (i == 9)
                        {
                            starsToShake.Add(star);
                            starsToShake.Add(neighbouringStars[j]);                            
                            return 2;
                        }
                        else
                        {
                            ShakePosition(star);
                        }
                    }
                }
            }
            return 0;
        }

        public static bool GoodDistance(Star tempStar, Star tempStar2, int minDistance)
        {
            int tempDistance = Math.Max(Math.Abs(tempStar.X - tempStar2.X), Math.Abs(tempStar.Y - tempStar2.Y));
            if (tempDistance < minDistance)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public static bool BadDistanceToCenter(Star tempStar, int center, int minDistance)
        {            
            var DistX = Math.Abs(tempStar.X - center);
            var DistY = Math.Abs(tempStar.Y - center);
            int tempDistance = (int)Math.Sqrt(DistX * DistX + DistY * DistY);
            if (tempDistance > minDistance)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //delete all playerstartingsystems that are not within a circle around the center of the galaxy
        //then delete all non-player-owned systems (the 4 direct neighbours of a starting system are player-owned).
        public void MakeRound()
        {
            int Center = ((starsInRow - 1) * distanceBetweenSuns / 2);
            int AllowedDistance = (starsInRow - 1) * distanceBetweenSuns / 2;

            List<Star> ToDelete = stars.Where(e => e.StartingSystem && BadDistanceToCenter(e, Center, AllowedDistance)).ToList();

            List<int> DirectNeighbourRules = new List<int>(); //to get the ids of the 8 neighbouring stars

            DirectNeighbourRules.Add((-starsInRow));  //upper
            DirectNeighbourRules.Add(-1); //left
            DirectNeighbourRules.Add(1);  //right
            DirectNeighbourRules.Add(starsInRow);  //lower

            List<Star> Directneighbours = new List<Star>();

            foreach (var star in stars.Where(e => e.StartingSystem && ToDelete.Contains(e)))
            {
                findNeighbours(star, DirectNeighbourRules, Directneighbours, starsInRow);
                Directneighbours.Add(star);
            }

            stars.RemoveAll(e => Directneighbours.Contains(e));

        }
       
    }
}
