//using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MapGenerator.SpiralMap
{
    public partial class SpiralController : Form
    {
        PointF[] points;
        //List<Star> stars;

        public int starsPerArm = 1000;
        public int nebulaPerArm = 1000;
        public int Arms = 8;
        public int starAmount = 8000;
        public float spin = 1.8f;
        public double armspread = 0.03d;
        public double nebulaspread = 0.03d;
        public double starsAtCenterRatio = 0.6d;
        public double nebulaAtCenterRatio = 0.6d;

        public float DrawAreaSize = 500.0f;
        public float MapSize = 300.0f;

        public NodeQuadTree nodeQuadTree;

        StarGenerator StarGenerator;

        SpiralWorker SpiralWorker;
        public GalaxyMap Map;
        Settings Settings;

        public SpiralController(StarGenerator starGenerator,  Settings settings, GalaxyMap map)
        {
            InitializeComponent();
            StarGenerator = starGenerator;
            //stars = _stars;
            //DrawAreaSize = panel1.Width;
            readConfig2(settings);
            DrawAreaSize = panel1.Width;
            Map = map;
            Settings = settings;


        }

        public void readConfig2(Settings files)
        {
            starsPerArm = files.starsPerArm;
            this.starsPerArmTextBox.Text = starsPerArm.ToString();

            nebulaPerArm = files.nebulaPerArm;
            this.nebulaPerArmTextBox.Text = nebulaPerArm.ToString();

            Arms = files.Arms;
            this.spiralArmsTextBox.Text = Arms.ToString();

            spin = files.spin;
            this.spinTextBox.Text = spin.ToString();

            armspread = files.armspread;
            this.starsPerArmTextBox.Text = starsPerArm.ToString();

            nebulaspread = files.nebulaspread;
            this.nebulaSpreadTextBox.Text = nebulaspread.ToString();

            starsAtCenterRatio = files.starsAtCenterRatio;
            this.starsAtCenterTextBox.Text = starsAtCenterRatio.ToString();

            nebulaAtCenterRatio = files.nebulaAtCenterRatio;
            this.nebulaAtCenterTextBox.Text = nebulaAtCenterRatio.ToString();

            MapSize = files.starsInRow * files.distanceBetweenSuns;
            this.nebulaSizeTextBox.Text = MapSize.ToString();

        }


        private void button1_Click(object sender, EventArgs e)
        {
            textBox1.Clear();

            //fetch user values:
            if (!Int32.TryParse(starsPerArmTextBox.Text, out starsPerArm))
            {
                textBox1.Text += "starsPerArm Value not Int";
                textBox1.Text += Environment.NewLine;
            }

            if (!Int32.TryParse(nebulaPerArmTextBox.Text, out nebulaPerArm))
            {
                textBox1.Text += "nebulaPerArm Value not Int";
                textBox1.Text += Environment.NewLine;
            }

            if (!Int32.TryParse(spiralArmsTextBox.Text, out Arms))
            {
                textBox1.Text += "Arms Value not Int";
                textBox1.Text += Environment.NewLine;
            }

            double temp = 0.0d;
            if (!Double.TryParse(spinTextBox.Text, out temp))
            {
                textBox1.Text += "spin Value not float";
                textBox1.Text += Environment.NewLine;
            }
            spin = (float)temp;

            if (!Double.TryParse(armSpreadTextBox.Text, out armspread))
            {
                textBox1.Text += "armspread Value not Double";
                textBox1.Text += Environment.NewLine;
            }

            if (!Double.TryParse(nebulaSpreadTextBox.Text, out nebulaspread))
            {
                textBox1.Text += "nebulaspread Value not Double";
                textBox1.Text += Environment.NewLine;
            }


            if (!Double.TryParse(starsAtCenterTextBox.Text, out starsAtCenterRatio))
            {
                textBox1.Text += "starsAtCenterRatio Value not Double";
                textBox1.Text += Environment.NewLine;
            }

            if (!Double.TryParse(nebulaAtCenterTextBox.Text, out nebulaAtCenterRatio))
            {
                textBox1.Text += "nebulaAtCenterRatio Value not Double";
                textBox1.Text += Environment.NewLine;
            }



            if (!Double.TryParse(nebulaSizeTextBox.Text, out temp))
            {
                textBox1.Text += "mapSize Value not float";
                textBox1.Text += Environment.NewLine;
            }
            MapSize = (float)temp;

            //stars = new List<Star>(starAmount);

            SpiralWorker = new SpiralMap.SpiralWorker(StarGenerator, Map,
                textBox1,
                starsPerArm, nebulaPerArm, Arms, 
                spin, armspread, nebulaspread,
                starsAtCenterRatio, nebulaAtCenterRatio,
                MapSize);

            points = SpiralWorker.MakeGalaxy();

            panel1.Refresh();
            this.Refresh();


            textBox1.Text += "X " + points.Select(i => i.X).Min().ToString() + " - " + points.Select(i => i.X).Max().ToString();
            textBox1.Text += Environment.NewLine;

            textBox1.Text += "Y " + points.Select(i => i.Y).Min().ToString() + " - " + points.Select(i => i.Y).Max().ToString();
            textBox1.Text += Environment.NewLine;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            //SpiralWorker.RemoveNearbyNebula();
            this.Refresh();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            SpiralWorker.SpreadNebula();
            this.Refresh();
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            if (Map.stars == null) return;
            if (Map.stars.Count == 0) return;

            Graphics g = e.Graphics;

            //int renderSize = Math.Min(1000, (int)DrawAreaSize);
            //renderSize = Math.Max(400, (int)DrawAreaSize);

            int renderSize = 1000;
            this.RenderStars(g, renderSize, renderSize);
            g.Dispose();
        }

        private void RenderStars(Graphics g, int width, int height)
        {
            g.Clear(Color.Black);

            //The size in pixel of one field of the map
            int FieldSize = (int)(DrawAreaSize / MapSize); 

            //draw normal stars
            using (Brush brush = new SolidBrush(System.Drawing.Color.White))
            {
                
                foreach (Star star in Map.stars)
                {
                    if (star.StarNebulaType == 1 && !star.StartingSystem)
                    {                                                
                        Point screenPoint = new Point((star.X - Settings.starOffset) * FieldSize, (star.Y - Settings.starOffset) * FieldSize);                        
                        g.FillRectangle(brush, new Rectangle(screenPoint, new Size(FieldSize, FieldSize)));
                        
                    }
                }
                g.Flush();
            }

            //draw starting systems
            using (Brush brush = new SolidBrush(System.Drawing.Color.GreenYellow))
            {

                foreach (Star star in Map.stars)
                {
                    if (star.StarNebulaType == 1 && star.StartingSystem)
                    {                        
                        Point screenPoint = new Point((star.X - Settings.starOffset) * FieldSize, (star.Y - Settings.starOffset) * FieldSize);
                        screenPoint.Offset(new Point(-1, -1));
                        g.FillRectangle(brush, new Rectangle(screenPoint, new Size(FieldSize, FieldSize)));
                    }
                }
                g.Flush();
            }

            //draw nebula
            using (Brush brush = new SolidBrush(System.Drawing.Color.Red))
            {              
                foreach (Star star in Map.stars)
                {
                    if (star.StarNebulaType == 2)
                    {                        
                        Point screenPoint = new Point((star.X - Settings.starOffset) * FieldSize, (star.Y - Settings.starOffset) * FieldSize);
                        g.FillRectangle(brush, new Rectangle(screenPoint, new Size(FieldSize, FieldSize)));                    
                    }
                }
                g.Flush();
            }

        }

        private void textBox10_TextChanged(object sender, EventArgs e)
        {

        }

        private void panel1_Resize(object sender, EventArgs e)
        {
            DrawAreaSize = panel1.Width;
            this.Refresh();
        }

    }
}
