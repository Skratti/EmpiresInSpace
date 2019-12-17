using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    public class NebulaField
    {
        public List<Star> fields;
        public List<Star> fieldsToCheck;
        public List<Star> fieldsAfterGrow;

        public List<Star> fields2;
        int size;
        int length;

        public NebulaField()
        {
            fields = new List<Star>();
            fieldsToCheck = new List<Star>();
            fieldsAfterGrow = new List<Star>();

            fields2 = new List<Star>();

        }

        public bool StarExists(int x, int y)
        {
            if (fields.Any(e => e.X == x && e.Y == y)) return true;
            if (fieldsAfterGrow.Any(e => e.X == x && e.Y == y)) return true;
            return false;
        }

        public void line(StarGenerator starGenerator, int x, int y, int x2, int y2, int starNebulaType)
        {
            int w = x2 - x;
            int h = y2 - y;
            int dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
            if (w < 0) dx1 = -1; else if (w > 0) dx1 = 1;
            if (h < 0) dy1 = -1; else if (h > 0) dy1 = 1;
            if (w < 0) dx2 = -1; else if (w > 0) dx2 = 1;
            int longest = Math.Abs(w);
            int shortest = Math.Abs(h);
            if (!(longest > shortest))
            {
                longest = Math.Abs(h);
                shortest = Math.Abs(w);
                if (h < 0) dy2 = -1; else if (h > 0) dy2 = 1;
                dx2 = 0;
            }
            int numerator = longest >> 1;
            for (int i = 0; i <= longest; i++)
            {
                if (!StarExists(x, y))
                    fieldsToCheck.Add(starGenerator.MakeNebula(x, y, starNebulaType));
                //putpixel(x, y, color);
                numerator += shortest;
                if (!(numerator < longest))
                {
                    numerator -= longest;
                    x += dx1;
                    y += dy1;
                }
                else
                {
                    x += dx2;
                    y += dy2;
                }
            }
        }

        public void Grow(StarGenerator starGenerator)
        {
            //set length + size
            length = RandomHelper.GetRandomInt(1, 14);
            size = RandomHelper.GetRandomInt(2, 5);

            Star firstNebula = fieldsToCheck.First();

            //create a line of nebulas (later a curve)
            var angle = RandomHelper.GetRandomFloat(0,1) * Math.PI * 2;

            var x = (int)(Math.Cos(angle) * length);
            var y = (int)(Math.Sin(angle) * length);

            line(starGenerator, firstNebula.X, firstNebula.Y, firstNebula.X + x, firstNebula.Y + y, firstNebula.StarNebulaType);
            // x can be negative or positive
            /*
            for (int xstart = (x < 0 ? x : 0); xstart < (x < 0 ? 0 : x) ; xstart++)
            {
                for (int ystart = (y < 0 ? y : 0); ystart < (y < 0 ? 0 : y); ystart++)
                {
                    if (xstart == 0 && ystart == 0) continue;
                    fieldsToCheck.Add(starGenerator.MakeNebula(firstNebula.X + xstart, firstNebula.Y + ystart, firstNebula.StarNebulaType));
                }
            }
            */

            /*
            if (x != 0 || y != 0)
                fieldsToCheck.Add(starGenerator.MakeNebula(firstNebula.X + x, firstNebula.Y + y, firstNebula.StarNebulaType));

            x = (int)(Math.Cos(angle) * length / 2);
            y = (int)(Math.Sin(angle) * length / 2);
            if (x != 0 || y != 0)
                fieldsToCheck.Add(starGenerator.MakeNebula(firstNebula.X + x, firstNebula.Y + y, firstNebula.StarNebulaType));
                */

            for (var i = 1; i < length; i++)
            {
                //fieldsToCheck.Add(starGenerator.MakeNebula(firstNebula.X + i, firstNebula.Y + 0, firstNebula.StarNebulaType));
            }


            foreach (var z in fieldsToCheck)
            { 
            //create filled circle around the current nebula
            for (y = -size; y <= size; y++)
                for (x = -size; x <= size; x++)
                    if (x * x + y * y <= size * size * 0.8f)
                        //setpixel(origin.x + x, origin.y + y);
                        if (!StarExists(z.X + x, z.Y + y)) fieldsAfterGrow.Add(starGenerator.MakeNebula(z.X + x, z.Y + y, z.StarNebulaType));
            }


            //fieldsAfterGrow.ForEach(e => e.NebulaPercentage = fieldsAfterGrow.Count(n => n.X >= e.X - 1 && n.X <= e.X + 1 && n.Y >= e.Y - 1 && n.Y <= e.Y + 1));

            //remove some of the outermost nebula fields - but never the ones that were created as starting line/curve of the nebula
            //count all neighbours of each field - also counts the field itself
            fieldsAfterGrow.ForEach(e => e.neighbourCount = fieldsAfterGrow.Count(n => n.X >= e.X - 1 && n.X <= e.X + 1 && n.Y >= e.Y - 1 && n.Y <= e.Y + 1));
            fieldsAfterGrow.RemoveAll(e => e.neighbourCount != 8 && e.neighbourCount != 9 && e.neighbourCount < RandomHelper.GetRandomInt(0, 12));


            fieldsAfterGrow.ForEach(e => fields.Add(e));

           
        }
    }


}
