using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MapGenerator
{
    public partial class NebulaFieldsController : Form
    {
        //public List<Star> stars;
        public StarGenerator StarGenerator;

        
        //public static List<Star> stars;

        public static List<Star> starsToShake = new List<Star>();
        public static List<Star> NewStarsToShake = new List<Star>();

        public static List<Star> neighbouringStars = new List<Star>();

        public static int StarsPerPlayer = 4;
        public static int minDistance = 4;   //minimum distance between stars. Should be at least 3 
        public static int distanceBetweenSuns = 6;
        public static int starsInRow = 100;       // leads to starsInRow^2 suns
        public static int xAxis = distanceBetweenSuns * starsInRow;

        public Settings Settings;
        public GalaxyMap Map;

        public NebulaFieldsController(StarGenerator starGenerator, Settings settings, GalaxyMap map)
        {
            Settings = settings;
            InitializeComponent();
            //stars = _stars;
            StarGenerator = starGenerator;
            Map = map;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //stars.Clear();

            NebulaFieldsWorker Worker = new NebulaFieldsWorker( StarGenerator, Settings, Map,  textBox1);
            Worker.GenerateMap();

            panel1.Refresh();
            this.Refresh();
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            if (Map.stars == null) return;

            if (Map.stars == null) return;

            Graphics g = e.Graphics;

            using (Brush brush = new SolidBrush(System.Drawing.Color.White))
            {
                for (int i = 0; i < Map.stars.Count; i++)
                {
                    g.FillEllipse(brush, new Rectangle((Map.stars[i].X - Settings.starOffset) * 5 , (Map.stars[i].Y - Settings.starOffset) * 5, 3, 3));
                }
                g.Flush();
            }
        }
      
   
    }
}
