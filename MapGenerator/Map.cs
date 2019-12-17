using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapGenerator
{

    public struct BoundarySouthWest
    {
        public int x;
        public int y;


        public BoundarySouthWest(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
    }

    public struct Bounding
    {
        public BoundarySouthWest southWest;
        public int dimension;

        public Bounding(BoundarySouthWest southWest, int dimension)
        {
            this.southWest = southWest;
            this.dimension = dimension;
        }

        public bool containsField(Star field)
        {
            bool ret = this.southWest.x <= field.X
                && this.southWest.x + dimension > field.X
                && this.southWest.y <= field.Y
                && this.southWest.y + dimension > field.Y;

            return ret;
        }

        public bool intersectsBounding(Bounding otherBounding)
        {
            bool ret = this.southWest.x < otherBounding.southWest.x + otherBounding.dimension && otherBounding.southWest.x < this.southWest.x + this.dimension
                && this.southWest.y < otherBounding.southWest.y + otherBounding.dimension && otherBounding.southWest.y < this.southWest.y + this.dimension;

            return ret;
        }
    }


    public class NodeQuadTree
    {
        const int QuadTreeAreas = 4;

        // Axis-aligned bounding box stored as a center with half-dimensions
        // to represent the boundaries of this quad tree
        Bounding boundary;

        // nodeIds in this quad tree node: only used on lowest level
        public Star nodeIds;



        // Children
        NodeQuadTree northWest;
        NodeQuadTree northEast;
        NodeQuadTree southWest;
        NodeQuadTree southEast;


        public NodeQuadTree(Bounding boundary)
        {
            this.boundary = boundary;

            //if (this.boundary.dimension == 1)
            //   nodeIds = new List<Star>();
        }
        // Methods
        public bool insert(Star p)
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return false;

            // If there is space in this quad tree, add the object here
            if (this.boundary.dimension == 1)
            {
                //nodeIds.Add(p);
                if (nodeIds == null)
                {
                    nodeIds = p;
                    p.TreeNode = this;
                    return true;
                }
                else
                {
                    return false;
                }
            }

            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (northWest == null)
                subdivide();

            if (northWest.insert(p)) return true;
            if (northEast.insert(p)) return true;
            if (southWest.insert(p)) return true;
            if (southEast.insert(p)) return true;

            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return false;
        }

        public Star find(Star p)
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return null;

            // If there is space in this quad tree, add the object here
            if (this.boundary.dimension == 1)
            {
                return nodeIds;
                /*
                if (nodeIds.Count() > 0)
                {
                    return nodeIds.First();
                }*/
            }

            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (northWest == null)
                return null;

            var check = northWest.find(p);
            if (check == null) check = northEast.find(p);
            if (check == null) check = southWest.find(p);
            if (check == null) check = southEast.find(p);

            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return check;
        }

        // create four children that fully divide this quad into four quads of equal area
        private void subdivide()
        {
            int x = this.boundary.southWest.x;
            int y = this.boundary.southWest.y;
            int halfDimension = this.boundary.dimension / 2;

            BoundarySouthWest northWestNodeField = new BoundarySouthWest(x, y + halfDimension);
            Bounding northWestBounding = new Bounding(northWestNodeField, halfDimension);
            this.northWest = new NodeQuadTree(northWestBounding);

            BoundarySouthWest northEastNodeField = new BoundarySouthWest(x + halfDimension, y + halfDimension);
            Bounding northEastBounding = new Bounding(northEastNodeField, halfDimension);
            this.northEast = new NodeQuadTree(northEastBounding);

            BoundarySouthWest southWestNodeField = new BoundarySouthWest(x, y);
            Bounding southWestBounding = new Bounding(southWestNodeField, halfDimension);
            this.southWest = new NodeQuadTree(southWestBounding);

            BoundarySouthWest southEastNodeField = new BoundarySouthWest(x + halfDimension, y);
            Bounding southEastBounding = new Bounding(southEastNodeField, halfDimension);
            this.southEast = new NodeQuadTree(southEastBounding);
        }
        public List<Star> queryRange(Bounding range)
        {
            // Prepare an array of results
            List<Star> resultNodeIds = new List<Star>();

            // Automatically abort if the range does not intersect this quad
            if (!boundary.intersectsBounding(range))
                return resultNodeIds; // empty list            

            // Check objects at this quad level
            if (this.boundary.dimension == 1)
            {
                List<Star> ret = new List<Star>();
                if (this.nodeIds != null)
                {
                    ret.Add(this.nodeIds);
                }
                return ret;
            }

            // Terminate here, if there are no children
            if (northWest == null)
                return resultNodeIds;

            // Otherwise, add the points from the children
            resultNodeIds.AddRange(northWest.queryRange(range));
            resultNodeIds.AddRange(northEast.queryRange(range));
            resultNodeIds.AddRange(southWest.queryRange(range));
            resultNodeIds.AddRange(southEast.queryRange(range));

            return resultNodeIds;
        }



        /*
        public NodeQuadTree queryTree(Bounding range)
        {

            // Automatically abort if the range does not intersect this quad
            if (!boundary.intersectsBounding(range))
                return null; // empty list            

            // Check objects at this quad level
            if (this.boundary.dimension == 1)
            {
                return this;
            }

            // Terminate here, if there are no children
            if (northWest == null)
                return null;

            // Otherwise, add the points from the children
            var result = northWest.queryTree(range);
            if (result == null) result = northEast.queryTree(range);
            if (result == null) result = southWest.queryTree(range);
            if (result == null) result = southEast.queryTree(range);

            return result;
        }

        public bool remove(Star p)
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return false;

            BoundarySouthWest boundarySouthWest = new BoundarySouthWest(this.x, this.y);
            Bounding NodeQuadTreeBounding = new Bounding(boundarySouthWest, 1);
            var nearby = queryTree(NodeQuadTreeBounding);

            if (nearby != null)
            {
                for (int i = 0; i < )
                return true;
            }

            return false;
        }
        */

        public void removeStar(Star p)
        {
            if (this.nodeIds.Id == p.Id)
            {
                this.nodeIds = null;
            }
            /*
            for (int i = 0; i < this.nodeIds.Count; i++)
            {
                if (this.nodeIds[i].starID == p.starID)
                {
                    this.nodeIds.RemoveAt(i);
                }
            }
             * */
        }


        public List<Star> nearbyNearStars(Star star, int tpye = 0)
        {
            List<Star> nearby = new List<Star>();


            //fetch nearby nodes
            BoundarySouthWest boundarySouthWest = new BoundarySouthWest(star.X - 1, star.Y - 1);
            Bounding NodeQuadTreeBounding = new Bounding(boundarySouthWest, 3);

            nearby = queryRange(NodeQuadTreeBounding);

            if (nearby.Count == 1)
            {
                nearby.Clear();
            }
            else
            {
                for (int i = nearby.Count - 1; i >= 0; i--)
                {
                    if (nearby[i].Id == star.Id)
                    {
                        nearby.RemoveAt(i);
                        continue;
                    }

                    if (tpye != 0)
                    {
                        if (nearby[i].StarNebulaType != tpye)
                        {
                            nearby.RemoveAt(i);
                        }
                    }
                }
            }

            return nearby;
        }

    }
}
