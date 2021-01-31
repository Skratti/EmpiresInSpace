using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    /// <summary>
    /// Stars and Nebula
    /// The main form creates a list of theses, and later exports the generated stars
    /// </summary>
    public class Star
    {
        //only needed when writing to the Database
        public int ObjectId;

        //only used when StarNebulaType = 1, this value is given to the solar system generator
        public sunTypes Type;           

        //if the star is the a starting system of a player. Starting system have to have a certain quality
        public bool StartingSystem;     
        
        //Unique Id of this Element
        public int Id;

        //A reference to the NodeQuadTree element where the Star is inserted
        public MapGenerator.NodeQuadTree TreeNode;

        //chance that a potencial nebula is in fact a nebula. 
        public int NebulaPercentage = 0;

        //Star = 1, Nebula = 2, Potential Nebula = 3, (4 to 7) other nebula types,   planet > 7
        public int StarNebulaType = 1;

        //Coordinates of the star. x/y-orig values are needed when the x/y position changes. It should always change in a certain distance around the orig values.
        public int X, Y, Orig_x, Orig_y;

        public int neighbourCount;

        //constructor for new Stars
        public Star(sunTypes type, bool startingSystem, int objectId, int id, int x, int y)
        {
            StartingSystem = startingSystem;
            Type = type;
            ObjectId = objectId;
            Id = id;
            X = Orig_x = x;
            Y = Orig_y = y;
        }

        //constructor for new planet or Asteroid
        public Star( int objectId, int id, int x, int y)
        {
            StartingSystem = false;
            Type = sunTypes.MSBlue;

            ObjectId = objectId;
            Id = id;
            X = Orig_x = x;
            Y = Orig_y = y;
        }
    }
}
