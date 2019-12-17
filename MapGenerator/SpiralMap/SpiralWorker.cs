using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator.SpiralMap
{
    

    public class SpiralWorker
    {
        public int starsPerArm = 1000;
        public int nebulaPerArm = 1000;
        public int Arms = 8;
        public int starAmount = 8000;
        public float spin = 1.8f;
        public double armspread = 0.03d;
        public double nebulaspread = 0.03d;
        public double starsAtCenterRatio = 0.6d;
        public double nebulaAtCenterRatio = 0.6d;

        public float mapSize = 500.0f;

        public NodeQuadTree nodeQuadTree;
        StarGenerator StarGenerator;

        //List<Star> stars;
        public GalaxyMap Map;
        System.Windows.Forms.TextBox Textbox;
        public SpiralWorker( StarGenerator starGenerator,
            GalaxyMap map,
            System.Windows.Forms.TextBox textbox = null,
            int _starsPerArm = 1000,
            int _nebulaPerArm = 1000,
            int _Arms = 8,
            float _spin = 1.8f,
            double _armspread = 0.03d,
            double _nebulaspread = 0.03d,
            double _starsAtCenterRatio = 0.6d,
            double _nebulaAtCenterRatio = 0.6d,
            float _mapSize = 500.0f
            )        
        {
            StarGenerator = starGenerator;
            //stars = _stars;
            Map = map;

            Textbox = textbox;

            starsPerArm = _starsPerArm;
            nebulaPerArm = _nebulaPerArm;
            Arms = _Arms;
            spin = _spin;
            armspread = _armspread;
            nebulaspread = _nebulaspread;
            starsAtCenterRatio = _starsAtCenterRatio;
            nebulaAtCenterRatio = _nebulaAtCenterRatio;
            mapSize = _mapSize;
        }

        public PointF[] MakeGalaxy()
        {
            //initialize data structures
            BoundarySouthWest boundarySouthWest = new BoundarySouthWest(3000, 3000);
            Bounding NodeQuadTreeBounding = new Bounding(boundarySouthWest, 2000);
            nodeQuadTree = new NodeQuadTree(NodeQuadTreeBounding);
            starAmount = starsPerArm * Arms / 2 + nebulaPerArm * Arms / 2;            
            //points = GenerateGalaxy(starAndNebulas, 8, 1f, 0.05d, 0.6);
            //points = GenerateGalaxy(starAndNebulas, 8, 1.8f, 0.03d, 0.6);
            return GenerateGalaxy(starAmount, Arms, spin);
        }


        public PointF[] GenerateGalaxy(int numOfStars, int numOfArms, float spin)
        {



            List<PointF> result = new List<PointF>(numOfStars);
            for (int i = 0; i < numOfArms; i++)
            {
                var armSpread2 = (i % 2 == 0) ? armspread : nebulaspread;
                //if (i % 2 != 1) armSpread2 = armSpread2 * 1.5;
                //else armSpread2 = armSpread2 * 1.5;
                var elementsInArm = (i % 2 == 0) ? starsPerArm : nebulaPerArm;
                result.AddRange(GenerateArm(elementsInArm, (float)i / (float)numOfArms, spin, armSpread2, i));
            }
            return result.ToArray();
        }

        public PointF[] GenerateArm(int numOfStars, float rotation, float spin, double armSpread, int armNo)
        {
            PointF[] result = new PointF[numOfStars];
            Random r = new Random();

            //stars = armNo % 2 = 0
            //nebual = armNo % 2 != 0

            double armSpread2 = armSpread;
            if (armNo % 2 != 0) { numOfStars = numOfStars / 2; }
            for (int i = 0; i < numOfStars; i++)
            {


                if (armNo % 2 != 0)
                {
                    //ToDo: both values should be parameters, in the form and contract
                    // skip the first nebulas, so that the center remains clean
                    if (i < 7) continue;



                    //reduce armspread if the nebula is near the center
                    armSpread2 = armSpread;
                    if (i < 200)
                    {
                        armSpread2 = armSpread2 * ((i + 1) / 200.0);
                    }



                }

                var centerRatio = armNo % 2 == 0 ? starsAtCenterRatio : nebulaAtCenterRatio;

                double part = (double)i / (double)numOfStars;
                part = Math.Pow(part, centerRatio);

                float distanceFromCenter = (float)part;
                double position = (part * spin + rotation) * Math.PI * 2;

                double xFluctuation = (Pow3Constrained(r.NextDouble()) - Pow3Constrained(r.NextDouble())) * armSpread2;
                double yFluctuation = (Pow3Constrained(r.NextDouble()) - Pow3Constrained(r.NextDouble())) * armSpread2;

                float resultX = (float)Math.Cos(position) * distanceFromCenter / 2 + 0.5f + (float)xFluctuation;
                float resultY = (float)Math.Sin(position) * distanceFromCenter / 2 + 0.5f + (float)yFluctuation;

                result[i] = new PointF(resultX, resultY);
                Star star = transform(result[i], armNo % 2 == 0 ? 1 : 2);

                //this.stars.Add(star);
                Map.addStar(star);
                
            }

            return result;
        }

        public static double Pow3Constrained(double x)
        {
            double value = Math.Pow(x - 0.5, 3) * 4 + 0.5d;
            return Math.Max(Math.Min(1, value), 0);
        }

        private Star transform(PointF point, int type)
        {
            
            var star = StarGenerator.MakeStarXY(
                false
                , (int)((point.X) * mapSize)
                , (int)((point.Y) * mapSize)
                );
            star.StarNebulaType = type;
    
            return star;
        }

        public void SpreadNebula()
        {
            GalaxyMap temporaryNebulas = new GalaxyMap(Map.Settings);

            foreach (var star in Map.stars)
            {
                if (star.StarNebulaType == 1) continue;

                //spread temporary nebula (StarNebulaType = 3)  in a circle with a radius of 4 fields:
                for (int x = star.X - 4; x < star.X + 4; x++)
                {
                    for (int y = star.Y - 4; y < star.Y + 4; y++)
                    {
                        if (x == star.X && y == star.Y) continue;

                        var distance = Math.Sqrt(((star.X - x) * (star.X - x)) + ((star.Y - y) * (star.Y - y)));
                        var probability = (1 / distance) * 30;

                        //try to find;
                        //Star checker = new Star(x, y, 3, this);
                        Star checker = StarGenerator.MakeStarXY(false, x, y);
                        checker.StarNebulaType = 3;

                        temporaryNebulas.addStar(checker, false, false);
                        checker.NebulaPercentage += (int)probability;
                        
                    }
                }
            }

            Random r = new Random();
            //temporaryNebulas.stars.ForEach(e => Map.addStar(e,false,false));
            //stars.AddRange(toAdd);
            foreach (var star in temporaryNebulas.stars)
            {
                if (star.NebulaPercentage < 8) continue;

                int percentage = Math.Min(star.NebulaPercentage, 90);
                int rand = r.Next(100);
                if (rand < percentage)
                {
                    star.StarNebulaType = 2;
                    Map.addStar(star,false,true);
                }
            }


            //this.Refresh();
        }

        
    }
}
