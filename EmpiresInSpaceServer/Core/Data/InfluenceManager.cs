using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public class InfluenceManager
    {
        public static List<InfluenceRing> InfluenceRings { get; set; }

        public static void InitInfluenceRings() {
            InfluenceRings = new List<InfluenceRing>();

            InfluenceRings.Add(new InfluenceRing( 2000 , 8));
            InfluenceRings.Add(new InfluenceRing( 1300 , 7));
            InfluenceRings.Add(new InfluenceRing( 800 , 6));
            InfluenceRings.Add(new InfluenceRing( 400 , 5)); 
            InfluenceRings.Add(new InfluenceRing( 150 , 4)); 
            InfluenceRings.Add(new InfluenceRing( 50 , 3)); 
            InfluenceRings.Add(new InfluenceRing( 20 , 2));
            InfluenceRings.Add(new InfluenceRing(  6 , 1));             
           
        }

        public static int InfluenceToRingNo(int Influence)
        {
            //method is used in c# as well as in JS, so no linq here
            int Ring = 0;
            foreach (var InfluenceRing in InfluenceRings)
            {

                if (InfluenceRing.Influence < Influence && InfluenceRing.Ring > Ring)
                {
                    Ring = InfluenceRing.Ring;
                }
            }
            return Ring;
        }
        /// <summary>
        /// Returns the minimum Influence required to unlock this ring
        /// </summary>
        /// <param name="Ring"></param>
        /// <returns></returns>
        public static int RingToMinInfluence(int Ring)
        {
            int MinInfluence = 1;
            foreach (var InfluenceRing in InfluenceRings)
            {
                if (Ring >= InfluenceRing.Ring && InfluenceRing.Influence > MinInfluence)
                {
                    MinInfluence = InfluenceRing.Influence;
                }
            }
            return MinInfluence;
        }

        public static void applyInfluence(Field field, int influence, int userId, UserSpaceObject influenceCreator)
        {
            //number of rings aroung the field. 1 - 10?
            int rings = 1;
            rings = InfluenceManager.InfluenceToRingNo(influence);

            //find all neighbouring fields of the field
            //use the regions to accomplish this            
            List<Field> neigbouringFields = new List<Field>();

            double factor = 1.0;
            for (int ring = rings; ring > 0; ring--)
            {
                //remove the influence that was needed to archieve this ring
                //var InfluenceOfThisRing = this.Influence - this.RingToMinInfluence(ring);
                var InfluenceOfThisRing = influence - InfluenceManager.RingToMinInfluence(ring);

                neigbouringFields.Clear();
                GeometryIndex.getNeighbourFields(field, ring, neigbouringFields, rings);

                //factor = 1.0d / Math.Pow(ring,2);
                //factor = 1.0d / (ring / 2.0d + ((ring - 1) * 4.0d));
                factor = 1.0 / ((ring * ring * ring) / 3.0); 
                foreach (Field neighbour in neigbouringFields)
                {
                    neighbour.addInfluence(userId, (int)(InfluenceOfThisRing * factor), influenceCreator);
                }
                factor = factor * 1.3;
            }

            //the field where the colony is on
            factor = 100;
            field.addInfluence(userId, (int)(influence * factor), influenceCreator);
        }

    }

    public class InfluenceRing
    {
        private int _Influence, _Ring;

        public InfluenceRing()
        {
        }

        public InfluenceRing(int Influence, int Ring)
        {
            this.Influence = Influence;
            this.Ring = Ring;
        }

        public int Influence
        {
            get
            {
                return this._Influence;
            }
            set
            {
                if ((this._Influence != value))
                {
                    this._Influence = value;
                }
            }
        }
        public int Ring
        {
            get
            {
                return this._Ring;
            }
            set
            {
                if ((this._Ring != value))
                {
                    this._Ring = value;
                }
            }
        }

    }
}
