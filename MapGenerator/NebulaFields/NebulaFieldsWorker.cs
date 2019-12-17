using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    public class NebulaFieldsWorker
    {
        public StarGenerator StarGenerator;
        public Settings Contract;

        public int StarsPerPlayer = 4;
        public int minDistance = 4;   //minimum distance between stars. Should be at least 3 
        public int distanceBetweenSuns = 6;
        public int starsInRow = 100;       // leads to starsInRow^2 suns
        public int xAxis = 6 * 100;

        System.Windows.Forms.TextBox Textbox;

        public List<NebulaField> nebulas;
        public GalaxyMap Map;

        public NebulaFieldsWorker( StarGenerator starGenerator, Settings spreadContract,GalaxyMap map, System.Windows.Forms.TextBox textbox = null)
        {
            nebulas = new List<NebulaField>();

            StarGenerator = starGenerator;
            Contract = spreadContract;

            StarsPerPlayer = Contract.StarsPerPlayer;
            minDistance = Contract.minDistance;
            distanceBetweenSuns = Contract.distanceBetweenSuns;
            starsInRow = Contract.starsInRow;
            xAxis = Contract.xAxis;

            Textbox = textbox;
            Map = map;
        }

        

        public void GenerateMap(bool shake = true, bool round = true)
        {

            for (int i = 0; i < starsInRow; i++)
            {
                if (i % 5 != 0) { continue; }
                StarGenerator.incrementNebulaType();

                for (int j = 0; j < starsInRow; j++)
                {
                    if (j % 5 != 0) { continue; }
                    
                    int x = (i * distanceBetweenSuns) + 2;
                    int y = (j * distanceBetweenSuns) + 2;

                    Star nebula = StarGenerator.MakeNebula( x, y, null);


                    if (shake)
                    {
                        ShakePosition(nebula);
                    }

                    Map.addStar(nebula);

                    NebulaField field = new NebulaField();
                    field.fields.Add(nebula);
                    field.fieldsToCheck.Add(nebula);
                    this.nebulas.Add(field);

                }
            }
                

            if (Textbox != null) Textbox.Text = this.nebulas.Count.ToString() + "  generated nebula Locations " + Environment.NewLine;
           
            //let the nebula grow
            Grow();


            //put all nebula into the starMap
            foreach (var nebulaField in this.nebulas)
            {
                foreach (var nebula in nebulaField.fields)
                {
                    Map.addStar(nebula, false, true);
                }
            }
        }

        public void Grow()
        {
            foreach(var nebula in nebulas)
            {
                nebula.Grow(StarGenerator);
            }
        }

        /// <summary>
        /// Find new position in an area around current position
        /// </summary>
        /// <param name="star"></param>
        public void ShakePosition(Star star)
        {
            int maxShake = 16;
            int substract = (maxShake - 1) / 2;

            int newPos = RandomHelper.GetRandomInt(0, maxShake * maxShake);
            int newX = newPos % maxShake;
            double y1 = newPos / maxShake;
            int newY = (int)Math.Floor(y1);
            star.X = (star.Orig_x - substract) + newX;
            star.Y = (star.Orig_y - substract) + newY;
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
        
       
    }
}
