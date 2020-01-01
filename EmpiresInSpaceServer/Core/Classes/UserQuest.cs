using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpacegameServer.Core
{
    public partial class UserQuest : Lockable
    {
        public static System.Data.DataTable createDataTable()
        {
            var dataTable = new System.Data.DataTable(Guid.NewGuid().ToString());

            dataTable.AddColumn(System.Type.GetType("System.Int32"), "userId");
            dataTable.AddColumn(System.Type.GetType("System.Int32"), "questId");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "isRead");
            dataTable.AddColumn(System.Type.GetType("System.Boolean"), "isCompleted");

            return dataTable;
        }

        public object createData()
        {
            return new
            {
                userid = this.userId,
                this.questId,
                this.isRead,
                this.isCompleted
                //activity = (object)this.activity ?? DBNull.Value
            };
        }

        public static bool completeQuest(User user, int questId)
        {
            if (!user.quests.Any(e => e.questId == questId)) return false;

            UserQuest quest = user.quests.First(e => e.questId == questId);

            List<Lockable> elementsToLock = new List<Lockable>();
            elementsToLock.Add(quest);

            if (!LockingManager.lockAllOrSleep(elementsToLock))
            {
                return false;
            }

            try
            {
                List<UserQuest> UserQuestsToSave = new List<UserQuest>();
                UserQuestsToSave.Add(quest);
                //set as completed
                quest.isRead = true;
                quest.isCompleted = true;


                foreach (var followUpQuest in Core.Instance.ResearchQuestPrerequisites.Where(
                    e=>e.SourceType == 2 &&
                    e.SourceId == quest.questId &&
                    e.TargetType == 2))
                {
                    UserQuest newQuest = new UserQuest();
                    newQuest.isRead = false;
                    newQuest.isCompleted = false;
                    newQuest.userId = user.id;
                    newQuest.questId = followUpQuest.TargetId;

                    user.quests.Add(newQuest);
                    UserQuestsToSave.Add(newQuest);
                }

                Core.Instance.dataConnection.SaveUserQuests(Core.Instance, UserQuestsToSave);

            }
            catch (Exception ex)
            {
                Core.Instance.writeExceptionToLog(ex);
            }
            finally
            {
                LockingManager.unlockAll(elementsToLock);
            }

            return true;
        }


    }
}
