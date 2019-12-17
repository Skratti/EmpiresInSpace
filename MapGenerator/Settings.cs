using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    public class Settings
    {
        //SpreadController : create a map by evenly spread stars
        public int StarsPerPlayer; // 3-5
        public int minDistance;   //minimum distance between stars. Should be at least 3 
        public int distanceBetweenSuns; //5-6
        public int starsInRow;       // leads to starsInRow^2 suns
        public int xAxis; //distanceBetweenSuns * starsInRow
        public int starOffset = 4500; // an offset for star.X and star.Y, moving the galaxy to center around 5000/5000

        //nebula generator / spiral worker
        public int starsPerArm = 1000;
        public int nebulaPerArm = 1000;
        public int Arms = 8;
        public float spin = 1.8f;
        public double armspread = 0.03d;
        public double nebulaspread = 0.03d;
        public double starsAtCenterRatio = 0.6d;
        public double nebulaAtCenterRatio = 0.6d;
        public int nebulaAreaDistance = 30;
    }
}
