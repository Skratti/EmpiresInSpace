using Newtonsoft.Json;
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

namespace MapGenerator
{
    
    
    public partial class Form1 : Form
    {

        //This list contains every item on the map        
        //Stars and nebula        
        
        GalaxyMap map;

        private int MapSize = 1;
        
        private int DrawAreaSize;
        private int Zoom = 1;
        private int FieldSize = 1;

        private int GridSize;
        private bool DrawGrid;


        //when dragging the map, this value is changed accordingly
        //also, when changing zoom, this value might also be changed
        Point UpperLeftCorner = new Point(4500, 4500);

        //StarGenerator contains probabilities for star types (like white dwarf, yello sun, red giants) and can return a random star based on those probabilities
        private StarGenerator starGenerator;

        //To allow moving the map per drag and drop, a few states have to be registered on mouse button down
        bool MouseDownOverPanel = false;
        private Point MouseCoordinates;

        private Settings settings;

        public Form1()
        {
            InitializeComponent();
            this.panel1.MouseWheel += panel1_MouseWheel;

            starGenerator = new StarGenerator();
            DrawAreaSize = panel1.Width;
            FetchValues();

            radioButton1.Select();            
            CalcFieldSize();

#if DEBUG
    button3.Visible = true;
#else
    button3.Visible = false;
#endif
            settings = readConfig();

            map = new GalaxyMap(settings);
            UpperLeftCorner = new Point(settings.starOffset, settings.starOffset);
        }

        public Settings readConfig()
        {
            string jsonString = File.ReadAllText("./Settings/60.json");

            Newtonsoft.Json.Linq.JObject json = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(jsonString);
            Settings settings = json.ToObject<Settings>();

            return settings;
        }

        private void FetchValues()
        {
            if (!Int32.TryParse(textBox3.Text, out MapSize))
            {
                textBox1.Text += "MapSize Value not Int";
                textBox1.Text += Environment.NewLine;
            }
            
            if (!Int32.TryParse(textBox2.Text, out GridSize))
            {
                textBox1.Text += "GridSize Value not Int";
                textBox1.Text += Environment.NewLine;
            }

            DrawGrid = checkBox1.Checked;
        }

        private void CalcFieldSize()
        {
            FieldSize = (int)(DrawAreaSize / MapSize) * Zoom;
            FieldSize = Zoom;           
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            if (map.stars == null) return;
            if (map.stars.Count == 0) return;

            Graphics g = e.Graphics;


            this.RenderStars(g);
            
        }


        private void DrawStar(Graphics g, Brush brush, Star star)
        {
            int x = (star.X * FieldSize) - UpperLeftCorner.X;
            int y = (star.Y * FieldSize) - UpperLeftCorner.Y;

            Point screenPoint = new Point(x, y);
            g.FillRectangle(brush, new Rectangle(screenPoint, new Size(FieldSize, FieldSize)));
        }
        private void RenderStars(Graphics g)
        {
            g.Clear(Color.Black);

            if (DrawGrid)
            {
                var currentGridSize = GridSize * FieldSize;
                var xOffset = UpperLeftCorner.X % currentGridSize;
                var yOffset = UpperLeftCorner.Y % currentGridSize;

                using (Pen pen = new Pen(System.Drawing.Color.Gray))
                {

                    for (var i =  -xOffset; i < DrawAreaSize; i += currentGridSize)
                    {
                        Point point1 = new Point(i, 0);
                        Point point2 = new Point(i, DrawAreaSize);

                        g.DrawLine(pen, point1, point2);
                    }

                    for (var j =  -yOffset; j < DrawAreaSize; j += currentGridSize)
                    {
                        Point point1 = new Point(0, j);
                        Point point2 = new Point(DrawAreaSize, j);
                        g.DrawLine(pen, point1, point2);
                    }

                    g.Flush();
                }
            }


            //draw normal stars
            using (Brush brush = new SolidBrush(System.Drawing.Color.White))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 1 && !star.StartingSystem)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            //draw starting systems
            using (Brush brush = new SolidBrush(System.Drawing.Color.Green))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 1 && star.StartingSystem)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            /*
            Nebula 2 red
            Nebula 4 yellow
            Nebula 5 lightblue
            Nebula 6 
            Nebula 7

             * */

            //draw nebula
            using (Brush brush = new SolidBrush(System.Drawing.Color.Red))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 2)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            //draw nebula 4 y
            using (Brush brush = new SolidBrush(System.Drawing.Color.Yellow))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 4)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            //draw nebula 5 y
            using (Brush brush = new SolidBrush(System.Drawing.Color.Blue))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 5)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            //draw nebula 6 y
            using (Brush brush = new SolidBrush(System.Drawing.Color.Cyan))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 6)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

            //draw nebula 7 y
            using (Brush brush = new SolidBrush(System.Drawing.Color.SaddleBrown))
            {

                foreach (Star star in map.stars)
                {
                    if (star.StarNebulaType == 7)
                    {
                        DrawStar(g, brush, star);
                    }
                }
                g.Flush();
            }

        }

        private void button1_Click(object sender, EventArgs e)
        {       
            var SpreadController = new WellSpreadMap.SpreadController( this.starGenerator, settings, map);

            SpreadController.ShowDialog();

            MapSize = settings.xAxis;

            this.Refresh();
        }



        private void button2_Click(object sender, EventArgs e)
        {
            var spiralMap = new SpiralMap.SpiralController(this.starGenerator,  settings, map);
            spiralMap.ShowDialog();

            this.Refresh();

        }

        private void button4_Click(object sender, EventArgs e)
        {
            var generator = new SystemGenerator.SystemGeneratorController();
            generator.ShowDialog();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            //var generator = new SystemGenerator.SystemGeneratorWorker();
            var generator = new SystemGenerator.SystemGeneratorWorker2();
            var writer = new DBWriter(map.stars, generator);
            writer.bulkInsert(textBox1);
        }

        private void panel1_Resize(object sender, EventArgs e)
        {
            DrawAreaSize = panel1.Width;
        }

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {
            RadioButton RadioButton = sender as RadioButton;
            if (RadioButton.Checked)
            {
                var oldZoom = Zoom;
                Zoom = 1;

                Point PointToZoomTo = new Point(
                (panel1.Width / 2),
                (panel1.Height / 2));

                CalcMapOffset(oldZoom, PointToZoomTo);
                CalcFieldSize();
                this.Refresh();
            }

        }

        private void radioButton2_CheckedChanged(object sender, EventArgs e)
        {
            RadioButton RadioButton = sender as RadioButton;
            if (RadioButton.Checked)
            {
                //Todo: upon zooming in or zooming out, the upper left corner currently shown has to be recalculated
                //UpperLeftCorner = new Point( ?, ?);
                var oldZoom = Zoom;
                Zoom = 5;
                Point PointToZoomTo = new Point(
                (panel1.Width / 2),
                (panel1.Height / 2));

                CalcMapOffset(oldZoom, PointToZoomTo);

                CalcFieldSize();
                this.Refresh();
            }
        }

        private void radioButton3_CheckedChanged(object sender, EventArgs e)
        {
            RadioButton RadioButton = sender as RadioButton;
            if (RadioButton.Checked)
            {
                var oldZoom = Zoom;
                Zoom = 25;

                Point PointToZoomTo = new Point(
                 (panel1.Width / 2),
                 (panel1.Height / 2));

                CalcMapOffset(oldZoom, PointToZoomTo);

                CalcFieldSize();
                this.Refresh();
            }
        }


        /// <summary>
        /// If we zoom in, we want to zoom to the center of the current screen and not to the upper left border. 
        /// So we have to get the upper left point of the new center
        /// Example: panel width is 1000, current zoom is 1 and we show coordinates in the range 0-1000
        /// we zoom in by factor 10. Absoulut center of the screen is 5
        /// the area shown after zooming has as left border 4.5, and as right border 5.5.
        /// This method returns the left border and the upper border of the new area
        /// </summary>
        /// <param name="zoomLevel"> the factor that is used for zooming in</param>
        /// <returns>Upper left corner of the new visible area</returns>
        private Point LeftCornerOfCenterOfScreen(double zoomLevel)
        {
            return new Point(
                 (int)(panel1.Width * ((zoomLevel - 1) / 2)),
                 (int)(panel1.Height * ((zoomLevel - 1) / 2)));
        }

        /// <summary>
        /// calcs the UpperLeftCorner offset after a zoom event. centers on PointToZoomTo
        /// </summary>
        /// <param name="oldZoom"></param>
        /// <param name="PointToZoomTo"></param>
        private void CalcMapOffset(int oldZoom, Point PointToZoomTo)
        {
            if (Zoom == oldZoom) return;

            double ZoomFactor = (double)Zoom / (double)oldZoom;
 
            //If zoom should be focused on top left corner, this suffices:
            /*
            UpperLeftCorner = new Point(
                 (int)(UpperLeftCorner.X * ZoomFactor),
                 (int)(UpperLeftCorner.Y * ZoomFactor)
                );
            return;
            */

            // get the coordinates of that point on screen
            Point CoordinatesToZoomTo = new Point(
                 (UpperLeftCorner.X + PointToZoomTo.X) / oldZoom,
                 (UpperLeftCorner.Y + PointToZoomTo.Y) / oldZoom );

            //Zoom the Coordinate system
            Point Zoomed = new Point(
                 CoordinatesToZoomTo.X * Zoom,
                 CoordinatesToZoomTo.Y * Zoom);

            //Move the new point To Center of the new screen:
            UpperLeftCorner = new Point(
                 (int)(Zoomed.X - ((panel1.Width  / 2) ) ),
                 (int)(Zoomed.Y - ((panel1.Height / 2) ))
                );            
        }

        /// <summary>
        /// Zooms in and out and centers on screen center. Not as generic as the new CalcMapOffset
        /// </summary>
        /// <param name="oldZoom"></param>
        private void CalcMapOffsetOld(int oldZoom)
        {
            if (Zoom == oldZoom) return;

            double ZoomFactor = (double)Zoom / (double)oldZoom;

            //If zoom should be focused on top left corner, this suffices:
            /*
            UpperLeftCorner = new Point(
                 (int)(UpperLeftCorner.X * ZoomFactor),
                 (int)(UpperLeftCorner.Y * ZoomFactor)
                );
            return;
            */

            //This focuses to the center after zoom
            //Remove the offset of the old zoom level
            //multiple with Diff
            //add offset of current zoom level
            var OffsetOldZoom = LeftCornerOfCenterOfScreen(oldZoom);
            var OffsetNewZoom = LeftCornerOfCenterOfScreen(Zoom);

            UpperLeftCorner = new Point(
                (int)(((UpperLeftCorner.X - OffsetOldZoom.X) * ZoomFactor) + OffsetNewZoom.X),
                (int)(((UpperLeftCorner.Y - OffsetOldZoom.Y) * ZoomFactor) + OffsetNewZoom.Y));

            return;
        }

        private void GetPixel(Point point)
        {

        }

        private void panel1_MouseDown(object sender, MouseEventArgs e)
        {
            MouseDownOverPanel = true;

            MouseCoordinates = panel1.PointToClient(Cursor.Position);
            textBox1.Text += MouseCoordinates.ToString() + Environment.NewLine;
        }

        private void panel1_MouseLeave(object sender, EventArgs e)
        {
            MouseDownOverPanel = false;
        }

        private void panel1_MouseUp(object sender, MouseEventArgs e)
        {
            MouseDownOverPanel = false;
        }

        private void panel1_MouseMove(object sender, MouseEventArgs e)
        {
            if (MouseDownOverPanel)
            {
                Point NewMouseCoordinates = panel1.PointToClient(Cursor.Position);

                Point Difference = Point.Subtract(MouseCoordinates, new Size(NewMouseCoordinates));

                UpperLeftCorner = Point.Subtract(UpperLeftCorner, new Size(-Difference.X, -Difference.Y));
                MouseCoordinates = NewMouseCoordinates;
                this.Refresh();
            }
        }

        private void textBox3_TextChanged(object sender, EventArgs e)
        {
            FetchValues();
        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {
            FetchValues();
        }

        private void checkBox1_CheckedChanged(object sender, EventArgs e)
        {
            DrawGrid = ((CheckBox)sender).Checked;
            this.Refresh();
        }

        private void panel1_MouseEnter(object sender, EventArgs e)
        {
            panel1.Focus();
        }

        private void panel1_MouseWheel(object sender, MouseEventArgs e)
        {
            var oldZoom = Zoom;
            int zoomChange = e.Delta * SystemInformation.MouseWheelScrollLines / 120;

            Zoom = oldZoom + (zoomChange > 0 ? 1 : -1);
            //Zoom = oldZoom + zoomChange;
            Zoom = Math.Max(1, Zoom);

            CalcMapOffset(oldZoom, Cursor.Position);

            CalcFieldSize();
            this.Refresh();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            map.clear();            
            this.starGenerator = new StarGenerator();
            this.Refresh();
        }

        private void AddNebulaFields_Click(object sender, EventArgs e)
        {
            var SpreadController = new NebulaFieldsController( this.starGenerator, settings, map);

            SpreadController.ShowDialog();

            MapSize = settings.xAxis;

            this.Refresh();
        }

        private void button6_Click(object sender, EventArgs eA)
        {
            map.CleanUp();
        }
    }


    //Double buffering 
    class BufferedPanel : Panel
    {
        public BufferedPanel()
        {
            this.DoubleBuffered = true;            
        }
    }

}
