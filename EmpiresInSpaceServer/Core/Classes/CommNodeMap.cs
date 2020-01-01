using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core.NodeQuadTree
{
    public struct Field
    {
        public int x;
        public int y;     
        public Field(int x, int y )
        {
            this.x = x;
            this.y = y;
           
        }
    }

    public struct NodeField
    {
        public int x;
        public int y;
        public int nodeId;
       

        public NodeField(int x, int y, int nodeId)
        {
            this.x = x;
            this.y = y;
            this.nodeId = nodeId;  
        }
    }

    public struct BoundarySouthWest
    {
        public int x;
        public int y;


        public BoundarySouthWest(int x, int y )
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

        public bool containsField(NodeField field)
        {
            bool ret = this.southWest.x <= field.x
                && this.southWest.x + dimension > field.x
                && this.southWest.y <= field.y
                && this.southWest.y + dimension > field.y;

            return ret;
        }

        public bool containsField(Field field)
        {
            bool ret = this.southWest.x <= field.x
                && this.southWest.x + dimension > field.x
                && this.southWest.y <= field.y
                && this.southWest.y + dimension > field.y;

            return ret;
        }

        public bool intersectsBounding(Bounding otherBounding)
        {
            bool ret = this.southWest.x < otherBounding.southWest.x + otherBounding.dimension && otherBounding.southWest.x < this.southWest.x + this.dimension
                && this.southWest.y < otherBounding.southWest.y + otherBounding.dimension && otherBounding.southWest.y < this.southWest.y + this.dimension;

            return ret;
        }
    }


    public  class NodeQuadTree
    {
        const int QuadTreeAreas = 4;

        // Axis-aligned bounding box stored as a center with half-dimensions
        // to represent the boundaries of this quad tree
        Bounding boundary;

        // CommNode nodeIds in this quad tree node: only used on lowest level
        public List<int> nodeIds;
        public List<Ship> ships;


        // Children
        NodeQuadTree northWest;
        NodeQuadTree northEast;
        NodeQuadTree southWest;
        NodeQuadTree southEast;


        public NodeQuadTree(Bounding boundary)
        {
            this.boundary = boundary;

            if (this.boundary.dimension == 1)
            {
                nodeIds = new List<int>();
                ships = new List<Ship>();
            }
        }


        // Methods
        public bool insert(NodeField p) 
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return false; 

            // If there is space in this quad tree, add the object here
            if (this.boundary.dimension == 1)
            {
                nodeIds.Add(p.nodeId);                
                return true;
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

        /// <summary>
        /// Insert a commNode to the Tree
        /// </summary>
        /// <param name="p"></param>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        public bool insertNode(Field p, int nodeId)
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return false;

            // If there is space in this quad tree, add the object here
            if (this.boundary.dimension == 1)
            {
                nodeIds.Add(nodeId);
                return true;
            }

            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (northWest == null)
                subdivide();

            if (northWest.insertNode(p, nodeId)) return true;
            if (northEast.insertNode(p, nodeId)) return true;
            if (southWest.insertNode(p, nodeId)) return true;
            if (southEast.insertNode(p, nodeId)) return true;

            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return false;
        }

        public bool insertShip(Field p, Ship ship)
        {
            // Ignore objects that do not belong in this quad tree
            if (!boundary.containsField(p))
                return false;

            // If there is space in this quad tree, add the object here
            if (this.boundary.dimension == 1)
            {
                ships.Add(ship);
                return true;
            }

            // Otherwise, subdivide and then add the point to whichever node will accept it
            if (northWest == null)
                subdivide();

            if (northWest.insertShip(p, ship)) return true;
            if (northEast.insertShip(p, ship)) return true;
            if (southWest.insertShip(p, ship)) return true;
            if (southEast.insertShip(p, ship)) return true;

            // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
            return false;
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
        public List<int> queryRange(Bounding range) 
        {
            // Prepare an array of results
            List<int> resultNodeIds = new List<int>();

            // Automatically abort if the range does not intersect this quad
            if (!boundary.intersectsBounding(range))
            return resultNodeIds; // empty list            

            // Check objects at this quad level
            if (this.boundary.dimension == 1)
            {
                return this.nodeIds;
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

        public List<Ship> queryRangeShips(Bounding range)
        {
            // Prepare an array of results
            List<Ship> results = new List<Ship>();

            // Automatically abort if the range does not intersect this quad
            if (!boundary.intersectsBounding(range))
                return results; // empty list            

            // Check objects at this quad level
            if (this.boundary.dimension == 1)
            {
                return this.ships;
            }

            // Terminate here, if there are no children
            if (northWest == null)
                return results;

            // Otherwise, add the points from the children
            results.AddRange(northWest.queryRangeShips(range));
            results.AddRange(northEast.queryRangeShips(range));
            results.AddRange(southWest.queryRangeShips(range));
            results.AddRange(southEast.queryRangeShips(range));

            return results;
        }
    }
}
