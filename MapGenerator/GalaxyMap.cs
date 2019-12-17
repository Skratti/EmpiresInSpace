using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{
    public class GalaxyMap
    {
        public List<Star> stars = new List<Star>();
        private bool[,] elementExistsOnMap = new bool[10000, 10000];
        public Settings Settings;

        public GalaxyMap(Settings settings)
        {
            Settings = settings;
        }

        public void clear()
        {
            stars.Clear();
            Array.Clear(elementExistsOnMap, 0, elementExistsOnMap.Length);

        }

        public void addStar(Star star, bool useOffset = true, bool replaceStar = false)
        {
            if (useOffset)
            {
                star.X += Settings.starOffset;
                star.Y += Settings.starOffset;
            }

            if (!positionIsUsed(star.X, star.Y))
            {
                elementExistsOnMap[star.X, star.Y] = true;
                stars.Add(star);
            }
            else
            {
                if (replaceStar)
                {
                    stars.RemoveAll(e => e.X == star.X && e.Y == star.Y);
                    stars.Add(star);
                }
            }
        }

        public bool positionIsUsed(int x, int y)
        {
            return elementExistsOnMap[x, y];
        }

        public void setPositionIsUsed(int x, int y, bool value = true)
        {
            elementExistsOnMap[x, y] = true;
        }

        public void CleanUp()
        {
            List<Star> toRemove = new List<Star>();
            foreach (var star in stars)
            {

                if (star.StarNebulaType != 1) continue;

                if (positionIsUsed(star.X - 1, star.Y - 1) ||
                    positionIsUsed(star.X, star.Y - 1) ||
                    positionIsUsed(star.X + 1, star.Y - 1) ||

                    positionIsUsed(star.X - 1, star.Y) ||
                    positionIsUsed(star.X + 1, star.Y) ||

                    positionIsUsed(star.X - 1, star.Y + 1) ||
                    positionIsUsed(star.X, star.Y + 1) ||
                    positionIsUsed(star.X + 1, star.Y + 1))
                {
                    setPositionIsUsed(star.X, star.Y, false);
                    toRemove.Add(star);
                    //map.stars.Remove(star);
                    //map.stars.RemoveAll(e => e.X == star.X && e.Y == star.Y);
                }
            }

            foreach (var star in toRemove)
            {
                stars.Remove(star);
            }
        }

        public void RemoveNearbyNebula(System.Windows.Forms.TextBox Textbox)
        {
            int removed = 0;
            List<int> toRemove = new List<int>();
            for (int x = 0; x < stars.Count; x++)
            {
                var star = stars[x];
                //skip nebula
                if (star.StarNebulaType != 1) continue;

                //return nearby nebula
                //List<Star> nearby = nodeQuadTree.nearbyNearStars(star, 2);
                List<Star> nearby = new List<Star>();

                toRemove.AddRange(nearby.Select(u => u.Id));

            }
            if (Textbox != null) Textbox.Text += "REMOVE : " + toRemove.Count.ToString();
            if (Textbox != null) Textbox.Text += Environment.NewLine;
            if (Textbox != null) Textbox.Text += "REMOVEUNIQUE : " + toRemove.Distinct().Count().ToString();
            if (Textbox != null) Textbox.Text += Environment.NewLine;

            foreach (var i in toRemove.Distinct())
            {
                if (!stars.Any(u => u.Id == i)) continue;
                var starToRemove = stars.Where(u => u.Id == i).First();
                starToRemove.TreeNode.removeStar(starToRemove);
                stars.Remove(starToRemove);
                removed++;
            }
            
            if (Textbox != null) Textbox.Text += "REMOVED : " + removed.ToString();
            if (Textbox != null) Textbox.Text += Environment.NewLine;

        }

        
    }
}
