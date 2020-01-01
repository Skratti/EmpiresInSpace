using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SpacegameServer
{
    static class LockingManager
    {
        public static bool lockAllOrSleep(List<Lockable> _elementsToLock)
        {
            for (int i = 0; i < 10; i++)
            {
                if (lockAll(_elementsToLock))
                {
                    return true;
                }
                Thread.Sleep(Lockable.rnd.Next(0, 40));
            }
            return false;
        }

        public static bool lockAll(List<Lockable> _elementsToLock)
        {
            List<bool> elementsState = new List<bool>(_elementsToLock.Count);
            for (int i = 0; i < _elementsToLock.Count; i++)
            {
                elementsState.Add(false);
            }

            bool allLocked = true;            
            for (int i = 0; i < _elementsToLock.Count; i++)
            {
                bool isLocked = _elementsToLock[i].setLock();
                elementsState[i] = isLocked;
                allLocked = allLocked && isLocked;                
            }

            if (!allLocked)
            {
                for (int i = 0; i < elementsState.Count; i++)
                {
                    if (elementsState[i])
                    {
                        _elementsToLock[i].removeLock();
                    }
                }
                return false;
            }
            return true;
        }

        public static void unlockAll(List<Lockable> _elementsToLock)
        {           
            for (int i = 0; i < _elementsToLock.Count; i++)
            {
                _elementsToLock[i].removeLock();                
            }                   
        }

    }

    public interface Update
    {
        void update(System.Data.SqlClient.SqlCommand _command);
    }

    public interface AsyncSaveable
    {
        Task save(System.Data.SqlClient.SqlCommand _command);
    }

    public interface AsyncInsertable
    {
        Task insert(System.Data.SqlClient.SqlCommand _command);
    }

    public interface AsyncDeleteable
    {
        Task delete(System.Data.SqlClient.SqlCommand _command);

    }
    
    public interface AllLockable
    {     
        int getLockAll();
    }

    public class Lockable
    {
        //this is static, so that only one instance exists for all lockable objects per class that inherits
        // has to be tested. Random might not be thread safe. It might be better to create a random object in each thread, and use the thread id as seed for the random object
        public static Random rnd = new Random();
        // needed to block all objects, for example during turnSummary       


        protected int inThreadUse = 0;

        public bool setLock()
        {
            if (this is AllLockable)
            {
                AllLockable checkThis = this as AllLockable;
                if (checkThis.getLockAll() == 1)
                    return false;
            }
            if (0 == Interlocked.Exchange(ref inThreadUse, 1)) return true;
            return false;
        }

        virtual public void removeLock()
        {
            Interlocked.Exchange(ref inThreadUse, 0);
        }
    }

    public class IdentityNumbers : Lockable
    {
        public long id = 0; // -> first used number will be 1

        public bool getNext(ref long nextId)
        {
            for (int i = 0; i < 10; i++)
            {
                if (this.setLock())
                {
                    id++;
                    nextId = id;
                    this.removeLock();
                    return true;
                }
                Thread.Sleep(Lockable.rnd.Next(0, 20));
            }
            return false;
        }

        public long getNext()
        {            
            return System.Threading.Interlocked.Increment(ref this.id);
        }
    }

}
