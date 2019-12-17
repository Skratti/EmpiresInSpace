using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MapGenerator.SystemGenerator
{    
    public partial class SystemGeneratorController : Form
    {
        public static Random randomGenerator = new Random((int)DateTime.Now.Ticks);

        public static int maxCircles = 15;      //previously, maxCircles was 10 ->  //(xAxis - 4 ) / 2 ; //each circle has a diameter of 1 and the innermost 4 Fields are reserved

        //public List<systemElement> systemElements;

        SolarSystem SolarSystem;

        systemElementTypeDetection typeDetector;

        SystemGenerator.Workers.Worker Worker;

        public SystemGeneratorController()
        {
            InitializeComponent();            
            typeDetector = new systemElementTypeDetection(maxCircles);
            typeDetector.showPropabilities(textBox1);            
            //systemElements = new List<systemElement>();
            Worker = new SystemGeneratorWorker2(textBox1);
        }


        private void panel1_Paint(object sender, PaintEventArgs e)
        {

            if (SolarSystem == null || SolarSystem.systemElements == null) return;

            Graphics g = e.Graphics;
            System.Drawing.SolidBrush myBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);

            for (int i = 0; i < SolarSystem.systemElements.Count; i++)
            {
                SolarSystem.systemElements[i].Draw(g);
                //g.FillEllipse(myBrush, new Rectangle(SolarSystem.systemElements[i].x * 10, SolarSystem.systemElements[i].y * 10, 3, 3));
            }

            myBrush.Dispose();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            textBox1.Text = "Generating 1000 solar systems" + Environment.NewLine + Environment.NewLine;
            int onlyPlanets = 0;
            int oneAsteroid = 0;
            int twoAsteroid = 0;
            int threeAsteroid = 0;
            int fourAsteroid = 0;
            List<int> planetsList = new List<int>(15);
            //int overAllHabitablePlanetes = 0;
            for (int i = 0; i < 15; i++) { planetsList.Add(0); }

            for (int i = 0; i < 1000; i++)
            {
                SolarSystem = Worker.createSystem(false, false, sunTypes.MSYellow, false);
                switch (SolarSystem.AsteroidCirclesCount)
                {
                    case 0: onlyPlanets++; break;
                    case 1: oneAsteroid++; break;
                    case 2: twoAsteroid++; break;
                    case 3: threeAsteroid++; break;
                    case 4: fourAsteroid++; break;
                }

                planetsList[SolarSystem.PlanetsCount] = planetsList[SolarSystem.PlanetsCount] + 1;
                //overAllHabitablePlanetes += habitablePlanets;
            }

            textBox1.Text += "Only Planets: " + onlyPlanets + Environment.NewLine;
            textBox1.Text += "1 Asteroid belt: " + oneAsteroid + Environment.NewLine;
            textBox1.Text += "2 Asteroid belt: " + twoAsteroid + Environment.NewLine;
            textBox1.Text += "3 Asteroid belt: " + threeAsteroid + Environment.NewLine;
            textBox1.Text += "4 Asteroid belt: " + fourAsteroid + Environment.NewLine;
            textBox1.Text += Environment.NewLine;
            textBox1.Text += "Amount of planets : Amount of Systems that have that many planets" + Environment.NewLine;
            for (int i = 0; i < 15; i++)
            {
                textBox1.Text += i + " : " + planetsList[i] + Environment.NewLine;
            }
            //textBox1.Text += overAllHabitablePlanetes + Environment.NewLine;

            panel1.Refresh();
            this.Refresh();
        }

        private void button1_Click_1(object sender, EventArgs e)
        {
            textBox1.Text = "";
            SolarSystem = Worker.createSystem(true, true, sunTypes.MSYellow, false);

            panel1.Refresh();
            this.Refresh();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            textBox1.Text = "";
            SolarSystem = Worker.createSystem(true, true, sunTypes.MSYellow, true);

            panel1.Refresh();
            this.Refresh();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            textBox1.Text = "Generating 1000 solar systems (Player start system)" + Environment.NewLine + Environment.NewLine;
            int onlyPlanets = 0;
            int oneAsteroid = 0;
            int twoAsteroid = 0;
            int threeAsteroid = 0;
            int fourAsteroid = 0;
            List<int> planetsList = new List<int>(15);
            //int overAllHabitablePlanetes = 0;
            for (int i = 0; i < 15; i++) { planetsList.Add(0); }

            for (int i = 0; i < 1000; i++)
            {
                SolarSystem = Worker.createSystem(false, false, sunTypes.MSYellow, true);
                switch (SolarSystem.AsteroidCirclesCount)
                {
                    case 0: onlyPlanets++; break;
                    case 1: oneAsteroid++; break;
                    case 2: twoAsteroid++; break;
                    case 3: threeAsteroid++; break;
                    case 4: fourAsteroid++; break;
                }

                planetsList[SolarSystem.PlanetsCount] = planetsList[SolarSystem.PlanetsCount] + 1;
                //overAllHabitablePlanetes += habitablePlanets;
            }

            textBox1.Text += "Only Planets: " + onlyPlanets + Environment.NewLine;
            textBox1.Text += "1 Asteroid belt: " + oneAsteroid + Environment.NewLine;
            textBox1.Text += "2 Asteroid belt: " + twoAsteroid + Environment.NewLine;
            textBox1.Text += "3 Asteroid belt: " + threeAsteroid + Environment.NewLine;
            textBox1.Text += "4 Asteroid belt: " + fourAsteroid + Environment.NewLine;
            textBox1.Text += Environment.NewLine;
            textBox1.Text += "Amount of planets : Amount of Systems that have that many planets" + Environment.NewLine;
            for (int i = 0; i < 15; i++)
            {
                textBox1.Text += i + " : " + planetsList[i] + Environment.NewLine;
            }
            //textBox1.Text += overAllHabitablePlanetes + Environment.NewLine;

            panel1.Refresh();
            this.Refresh();
        } 
        
        

    }


}
