using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Net.Mail;
using System.Net;

using System.Data.SqlClient;
using System.Data;


namespace SpacegameIndex
{
    enum Language
    {
        en,
        de,
        fr
    }

    public partial class Authentication : System.Web.UI.Page
    {
        SqlConnection conn;
        string ConnectionString;
        string gameKey;
        private static System.Security.Cryptography.RNGCryptoServiceProvider saltGenerator = new System.Security.Cryptography.RNGCryptoServiceProvider();

        protected void Page_Load(object sender, EventArgs e)
        {
            

            if (Request.Params["action"] == null)
                return;
            string action = Request.Params["action"];           

            gameKey = System.Web.Configuration.WebConfigurationManager.AppSettings["gameConnection"].ToString();
            
            //string activeConnection = System.Web.Configuration.WebConfigurationManager.AppSettings["activeConnection"].ToString();
            //ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings[activeConnection].ConnectionString;
            ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=EmpiresIndex;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            conn = new SqlConnection(ConnectionString);

            switch (action)
            {
                case "checkUniqueName":
                    checkUniqueName();
                    return;
                case "checkUniqueEmail":
                    checkUniqueEmail();
                    return;
                case "createUser":
                    createUser();
                    return;
                case "recoverUser":
                    recoverUser();
                    return;
                case "authentication":
                    authenticateUser();
                    return;
                case "login":
                    login();
                    return;
                case "logout":
                    logout();
                    return;
                case "checkLogin":
                    getUserData();
                    return;
                case "setUserLanguage":
                    setUserLanguage();
                    return;
                case "setUserDefaultName":
                    setUserDefaultName();
                    return;
                case "setUserStartingRegion":
                    setUserStartingRegion();
                    return;
                case "getStartingRegionCount":
                    getStartingRegionCount();
                    return;
                case "updateUserPW":
                    updateUserPW();
                    return;
                case "updateUserEmail":
                    updateUserEmail();
                    return;
                case "registerToGame":
                    registerToGame();
                    return;
                case "loginToGame":
                    loginToGame();
                    return;
                case "security":
                    securityQuestion();
                    return;
                case "tryCookieLogin":
                    loginByRememberCookie();
                    return;
                case "removeRememberCookie":
                    removeRememberCookie();
                    return;
                case "removeAllCookies":
                    removeAllCookies();
                    return;
                case "recoverPassword":
                    recoverPassword();
                    return;
                default:
                    return;
            }

        }

        #region helpers

        public static string GetUniqueKey(int maxSize)
        {
            char[] chars = new char[62];
            chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            byte[] data = new byte[1];
            using (System.Security.Cryptography.RNGCryptoServiceProvider crypto = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                crypto.GetNonZeroBytes(data);
                data = new byte[maxSize];
                crypto.GetNonZeroBytes(data);
            }
            System.Text.StringBuilder result = new System.Text.StringBuilder(maxSize);
            foreach (byte b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            return result.ToString();
        }

        static byte[] GenerateSaltedHash(byte[] plainText, byte[] salt)
        {
            System.Security.Cryptography.HashAlgorithm algorithm = new System.Security.Cryptography.SHA256Managed();

            byte[] plainTextWithSaltBytes =
              new byte[plainText.Length + salt.Length];

            for (int i = 0; i < plainText.Length; i++)
            {
                plainTextWithSaltBytes[i] = plainText[i];
            }
            for (int i = 0; i < salt.Length; i++)
            {
                plainTextWithSaltBytes[plainText.Length + i] = salt[i];
            }

            return algorithm.ComputeHash(plainTextWithSaltBytes);
        }

        static bool CompareByteArrays(byte[] array1, byte[] array2)
        {
            if (array1.Length != array2.Length)
            {
                return false;
            }

            for (int i = 0; i < array1.Length; i++)
            {
                if (array1[i] != array2[i])
                {
                    return false;
                }
            }

            return true;
        }

        static void prependElements(ref byte[] cookieValueBytes, int newLength)
        {
            while (cookieValueBytes.Length < newLength)
            {
                byte[] newValues = new byte[cookieValueBytes.Length + 1];
                newValues[0] = 0x00;                                // set the prepended value
                Array.Copy(cookieValueBytes, 0, newValues, 1, cookieValueBytes.Length); // copy the old values
                cookieValueBytes = newValues;
            }
        }

        #endregion

        public void securityQuestion()
        {
            if (Request.Params["Password"] != null)
            {
                if (Application["time"] != null)
                {
                    DateTime LastTime = (DateTime)Application["time"];
                    if ((DateTime.Now - LastTime).Seconds < 10)
                    {
                        Response.Clear();
                        Response.Expires = -1;
                        //Response.ContentType = "text/xml";
                        Response.Write("Failed... Seconds: " + (DateTime.Now - LastTime).Seconds.ToString());
                        return;
                    }
                }
                Application["time"] = DateTime.Now;


                if (Request.Params["Password"] == "101010DontPanic")
                {
                    Session["secretOk"] = "jupp";
                    Response.Redirect("Index.aspx");
                }

                Response.Clear();
                Response.Expires = -1;
                //Response.ContentType = "text/xml";
                Response.Write("Failed...");
            }
        }

        #region User Creation
        
        public void checkUniqueName()
        {
            if (Request.Params["username"] == null) return;
            string username = Request.Params["username"];
          
            string sqlResponse;          
            try
            {
                conn.Open();
                string query = "[dbo].[checkUniqueName]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);               

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param3);

                cmd.ExecuteNonQuery();

                int res;
                if (Int32.TryParse(param3.Value.ToString(), out res) && res == 1)
                {
                    sqlResponse = "1";
                }
                else sqlResponse = "0";

                conn.Close();
            }
            finally
            {               
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/plain";
            Response.Write(sqlResponse);
        }

        public void checkUniqueEmail()
        {
            if (Request.Params["username"] == null) return;
            string username = Request.Params["username"];

            string sqlResponse;
            try
            {
                conn.Open();
                string query = "[dbo].[checkUniqueEmail]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param3);

                cmd.ExecuteNonQuery();

                int res;
                if (Int32.TryParse(param3.Value.ToString(), out res) && res == 1)
                {
                    sqlResponse = "1";
                }
                else sqlResponse = "0";

                conn.Close();
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/plain";
            Response.Write(sqlResponse);
        }


        public static bool ValidateCaptcha(string challengeValue, string responseValue)
        {
            bool IsCaptchaValid = (ReCaptchaClass.Validate(responseValue) == "true" ? true : false);
            return IsCaptchaValid;
        }

        public void createUser()
        {          
            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["userpassword"] == null)
                return;
            string userpassword = Request.Params["userpassword"];

            if (Request.Params["email"] == null)
                return;
            string email = Request.Params["email"];

            string user_ip = Request.UserHostAddress;

            if (Request.Params["languageX"] == null)
                return;
            string language = Request.Params["languageX"];

            if (Request.Params["defaultInGameName"] == null)
                return;
            string defaultInGameName = Request.Params["defaultInGameName"];

            if (Request.Params["defaultStartingRegion"] == null)
                return;

            string defaultStartingRegionS = Request.Params["defaultStartingRegion"];
            int defaultStartingRegion = 0;
            if (!int.TryParse(defaultStartingRegionS, out defaultStartingRegion))
                return;
            
            //reCaptcha
            if (Request.Params["recapChal"] == null)
                return;
            string recapChal = Request.Params["recapChal"];
            if (Request.Params["recapResp"] == null)
                return;
            string recapResp = Request.Params["recapResp"];

            if (!SpacegameIndex.Authentication.ValidateCaptcha(recapChal, recapResp))
            {
                System.Threading.Thread.Sleep(1500);
                Response.Clear();
                Response.Expires = -1;
                Response.ContentType = "text/plain";
                Response.Write("1");
                return;
            }


            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            //get password and salt as byte array
            byte[] salt = new byte[4];
            saltGenerator.GetBytes(salt);
            byte[] password = System.Text.Encoding.UTF8.GetBytes(userpassword);
           
            // create hash (as byte-array)
            byte[] hash;
            hash = GenerateSaltedHash(password, salt);

            // convert to data that is MS SQL compatible:
            int saltInt = BitConverter.ToInt32(salt, 0);
            string hashVarchar = System.Text.Encoding.UTF8.GetString(hash);

            try
            {
                conn.Open();
                string query = "[dbo].[createUser]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter("@userpassword", SqlDbType.NVarChar, 64);
                param2.Value = hashVarchar;
                cmd.Parameters.Add(param2);

                SqlParameter param91 = new SqlParameter("@salt", SqlDbType.Int);
                param91.Value = saltInt;
                cmd.Parameters.Add(param91);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@email";
                param3.Value = email;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@user_ip";
                param4.Value = user_ip;
                cmd.Parameters.Add(param4);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@language";
                param5.Value = language;
                cmd.Parameters.Add(param5);

                SqlParameter param6 = new SqlParameter();
                param6.ParameterName = "@defaultInGameName";
                param6.Value = defaultInGameName;
                cmd.Parameters.Add(param6);

                SqlParameter param7 = new SqlParameter();
                param7.ParameterName = "@defaultStartingRegion";
                param7.Value = defaultStartingRegion;
                cmd.Parameters.Add(param7);

                

                SqlParameter param8 = new SqlParameter();
                param8.ParameterName = "@result";
                param8.Direction = ParameterDirection.Output;
                param8.Value = 0;
                cmd.Parameters.Add(param8);

                SqlParameter param9 = new SqlParameter("@verificationCode", SqlDbType.NVarChar, 40);                
                param9.Direction = ParameterDirection.Output;                              
                cmd.Parameters.Add(param9);

                SqlParameter param10 = new SqlParameter("@xml", SqlDbType.Xml);
                param10.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param10);

                cmd.ExecuteNonQuery();

                /*
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();

                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    sqlResponse += xmlr.ReadOuterXml();
                }
                */

                string responseSQlXMl = param10.Value.ToString();

                if ( Convert.ToInt32(param8.Value) == 1 )
                {
                    //sendEmail(email,(string) param9.Value);
                }


                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        private string HashSHA256(string input)
        {
            System.Security.Cryptography.HashAlgorithm algorithm = new System.Security.Cryptography.SHA256Managed();
            byte[] Hash = algorithm.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
            string HashVarchar = System.Text.Encoding.UTF8.GetString(Hash);

            return HashVarchar;
        }

        public void recoverUser()
        {
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/plain";
            

            if (Request.Params["email"] == null)
                return;
            string email = Request.Params["email"];          

            if (Request.Params["languageX"] == null)
                return;
            string language = Request.Params["languageX"];            

            //reCaptcha
            if (Request.Params["recapChal"] == null)
                return;
            string recapChal = Request.Params["recapChal"];
            if (Request.Params["recapResp"] == null)
                return;
            string recapResp = Request.Params["recapResp"];

            if (!SpacegameIndex.Authentication.ValidateCaptcha(recapChal, recapResp))
            {
                System.Threading.Thread.Sleep(1500);                
                Response.Write("1");
                return;
            }


            //detect if useremail does exist
            string name = "";
            int languageSQL = 0;
            int id = 0;
            try
            {
                /*
                SqlCommand cmd = new SqlCommand(@"SELECT top 1 [id],[username],[language]   FROM dbo.[Users] 
                                                    WHERE email = @email", conn);
                */

                string query = "[dbo].[getUserDataByEmail]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@email", email);


                try
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        id = reader.GetInt32(0);
                        name = reader.GetString(1);
                        languageSQL = reader.GetInt32(2);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }                 
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //else send 3 (useremail not found)
            //ToDO: do not accept further
            if (name == "")
            {
                System.Threading.Thread.Sleep(2000);
                Response.Write("2");
                return;
            }

            Response.Write("3");


            /*
            System.Security.Cryptography.HashAlgorithm algorithm = new System.Security.Cryptography.SHA256Managed();
            byte[] Hash = algorithm.ComputeHash(System.Text.Encoding.UTF8.GetBytes(random));
            string HashVarchar = System.Text.Encoding.UTF8.GetString(Hash);
            */
            string HashVarchar = "BUG1";
            string random = "rand1";
            try
            {
                //create a big random. make a hash from it.
                random = GetUniqueKey(50);
                HashVarchar = HashSHA256(random);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }        
            //finally
            //{
            //    HashVarchar = "BUG";
            //}

            //save the hash to the user
            try
            {

                string query = "[dbo].[setRecoveryCode]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param0 = new SqlParameter();
                param0.DbType = DbType.Int32;
                param0.ParameterName = "@id";
                param0.Value = id;
                cmd.Parameters.Add(param0);


                SqlParameter param1 = new SqlParameter();
                param1.SqlDbType = SqlDbType.NVarChar;
                param1.ParameterName = "@recoveryCode";
                param1.Value = HashVarchar;
                cmd.Parameters.Add(param1);

                /*
                SqlCommand cmd = new SqlCommand(@"Update dbo.[Users] set recoveryCode = @hash, recoveryDateTime = GETDATE()
                                                    WHERE [id] = @id", conn);
                //cmd.Parameters.AddWithValue("id", id);
                //cmd.Parameters.AddWithValue("hash", HashVarchar);

                SqlParameter param0 = new SqlParameter();
                param0.DbType = DbType.Int32;
                param0.ParameterName = "@id";
                param0.Value = id;
                cmd.Parameters.Add(param0);


                SqlParameter param1 = new SqlParameter();
                param1.SqlDbType = SqlDbType.NVarChar;
                param1.ParameterName = "@hash";
                param1.Value = HashVarchar;
                cmd.Parameters.Add(param1);
                */
                try
                {
                    conn.Open();
                    //result = cmd.ExecuteNonQueryAsync();
                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            
            
            //send the big random via mail
            //var text = @"Password recovery: " + HashVarchar;

            Language userLang = Language.en;
            if (languageSQL == 1) userLang = Language.de;

            sendRecovery(random, email, name, userLang);
                      
        }

        private string RecoveryEmailTitle(Language language)
        {
            if (language == Language.de)
            {
                return "[Empires in Space] Passwort zurücksetzen";
            }

            return "[Empires in Space] Password Reset";
        }

        private string RecoveryEmailBody(Language language)
        {
            if (language == Language.de)
            {
                return "Hallo,<br>" +
                    "<br>" +
                    "Jemand (wahrscheinlich du) hat angefragt das das Passwort zurückgesetzt werden soll.<br>" +
                    "Falls es jemand anderes war, kannst Du diese Mail einfach ignorieren.<br>" +
                    "Falls Du es warst, dann öffne diesen Link und gib ein neues Passwort ein:<br>" +
                    "<br>" +
                    "<a href='{0}' >Neues Passwort</a><br>" +
                    "<br>" +
                    "Falls der Link nicht funktioniert dann besuche diese Webseite:<br>" +
                    "<br>" +
                    "{1}<br>" +
                    "<br>" +
                    "und gib zusätzlich zum Passwort noch diesen Schlüssel ein:<br>" +
                    "<br>" +
                    "{2}<br>" +
                    "<br>" +
                    "Dein Loginname ist übrigens:<br>" +
                    "<br>" +
                    "{3}<br>" +
                    "<br>" +
                    "Viel Spaß<br>" +
                    "<br>" +
                    "Das Empires in Space Team<br>" +
                    "<br>";
            }

            return "Hello,<br>" +
                    "<br>" +
                    "Someone (presumably you) requested a password  reset.<br>" +
                    "If it was someone else, just ignore this email.<br>" +
                    "If it was you, please visit this link and enter a new password:<br>" +
                    "<br>" +
                    "<a href='{0}' >Set new Password</a><br>" +
                    "<br>" +
                    "If the redirect does not work, visit this web site:<br>" +
                    "<br>" +
                    "{1}<br>" +
                    "<br>" +
                    "And enter this key in addition to you new password:<br>" +
                    "<br>" +
                    "{2}<br>" +
                    "<br>" +
                    "By the way, your login name is:<br>" +
                    "<br>" +
                    "{3}<br>" +
                    "<br>" +
                    "Have fun,<br>" +
                    "<br>" +
                    "The Empires in Space team<br>" +
                    "<br>";
        }

        private void sendRecovery(string random, string email, string name, Language language)
        {

            SmtpClient mySmtpClient = new SmtpClient("smtp.1und1.de");

            // set smtp-client with basicAuthentication
            mySmtpClient.UseDefaultCredentials = false;
            System.Net.NetworkCredential basicAuthenticationInfo = new
               System.Net.NetworkCredential("admin@empiresinspace.com", "c_H_B_Sc_H_B_S"); //username, password
            mySmtpClient.Credentials = basicAuthenticationInfo;

            // add from,to mailaddresses
            MailAddress from = new MailAddress("admin@empiresinspace.com", "Empires in Space");
            MailAddress to = new MailAddress(email);
            //to = new MailAddress("a.kastirke.richter@googlemail.com");
            MailMessage myMail = new System.Net.Mail.MailMessage(from, to);

            // add ReplyTo
            //MailAddress replyto = new MailAddress("reply@example.com");
            //myMail.ReplyToList.Add(replyto);

            // set subject and encoding
            myMail.Subject = RecoveryEmailTitle(language);
            myMail.SubjectEncoding = System.Text.Encoding.UTF8;


            
            Uri uri = Request.Url;
            Uri parent = new Uri(uri, "..");
            Uri Target = new Uri(parent, "Recovery.aspx");

            string RecoverPath = Target.AbsoluteUri + "?c=" + random;

            // set body-message and encoding
            myMail.Body = String.Format(RecoveryEmailBody(language), RecoverPath, Target.AbsoluteUri, random, name);
            //myMail.Body = "<b>Test Mail</b><br>using <b>HTML: " + random + "</b><br><a href='" + RecoverPath + "' >Set new Password</a>.";
            myMail.BodyEncoding = System.Text.Encoding.UTF8;
            // text or html
            myMail.IsBodyHtml = true;

            mySmtpClient.Send(myMail);

        }

        //called after receiving the email with the authentification code...
        public void authenticateUser()
        {
            if (Request.Params["code"] == null)
                return;

            string authentication = Request.Params["code"];

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);
            

            try
            {               
                conn.Open();              
                string query = "[dbo].[authenticateUser]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@verificationCode";
                param1.Value = authentication;
                cmd.Parameters.Add(param1);

                cmd.ExecuteNonQuery();                
                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            //Response.ContentType = "text/xml";

            Response.Redirect("Index.aspx");
            //Response.Write(sqlResponse);
        }
        #endregion

        #region User Login
        public void loginByRememberCookie()
        {
            logRequestData();

            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["cookieValue"] == null)
                return;
            string rememberCookie = Request.Params["cookieValue"];
            int cookieValue;
            if (!Int32.TryParse(rememberCookie, out cookieValue)) return;
            byte[] cookieValueBytes = BitConverter.GetBytes(cookieValue);

            prependElements(ref cookieValueBytes, 4);
            /*while (cookieValueBytes.Length < 4)
            {
                byte[] newValues = new byte[cookieValueBytes.Length + 1];
                newValues[0] = 0x00;                                // set the prepended value
                Array.Copy(cookieValueBytes, 0, newValues, 1, cookieValueBytes.Length); // copy the old values
                cookieValueBytes = newValues;
            }*/
            
            bool foundOne = false;
            byte[] hashToUse = new byte[32];

            //call procedure that selects all rememberCookies
            //user may have cookies on several computers. Find out which value he is providing
            try
            {
                conn.Open();
                string query = "[dbo].[userRememberSalts]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlDataReader rdr = null;
                rdr = cmd.ExecuteReader();

                //iterate through the select result, and check for each line if the current information is correct. if yes, use that salt and hash to login
                
                
                //byte[]  cookieHashByte1 = new byte[32];
                while (rdr.Read())
                {
                    string cookieSalt = rdr["salt"].ToString();

                    //get hash and salt as byte array
                    byte[]  cookieHashByte = (byte[])rdr["cookieHash"];
                    prependElements(ref cookieHashByte, 32);
                    int cookieSaltInt;
                    if (!Int32.TryParse(cookieSalt, out cookieSaltInt)) continue;
                    byte[] cookieSaltByte = BitConverter.GetBytes(cookieSaltInt);
                    prependElements(ref cookieSaltByte, 4);
                    /*while (cookieSaltByte.Length < 4)
                    {
                        byte[] newValues = new byte[cookieSaltByte.Length + 1];
                        newValues[0] = 0x00;                                // set the prepended value
                        Array.Copy(cookieSaltByte, 0, newValues, 1, cookieSaltByte.Length); // copy the old values
                        cookieSaltByte = newValues;
                    }*/

                    // create hash (as byte-array)
                    byte[] hash;
                    hash = GenerateSaltedHash(cookieValueBytes, cookieSaltByte);

                    if (CompareByteArrays(hash, cookieHashByte))
                    {
                        foundOne = true;
                        hashToUse = hash;
                        break;
                    }                  
                }
                conn.Close();                
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }



            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";
            //login with the hash hashToUse
            if (foundOne)
            {                
                //create data for the cookie 
                int cookieValueInt = 0;
                int cookieSaltInt = 0;
                byte[] cookieHash = new byte[0];           
                             
                //the same as with the createUser method, only that the password is now a integer that may be generated
                //get password and salt as byte array
                byte[] cookieSalt = new byte[4];
                saltGenerator.GetBytes(cookieSalt);
                byte[] cookiePassword = new byte[4];
                saltGenerator.GetBytes(cookiePassword);

                // create hash (as byte-array)
                cookieHash = GenerateSaltedHash(cookiePassword, cookieSalt);

                // convert to data that is MS SQL compatible:
                cookieValueInt = BitConverter.ToInt32(cookiePassword, 0);
                cookieSaltInt = BitConverter.ToInt32(cookieSalt, 0);                               

                try
                {
                    conn.Open();
                    string query = "[dbo].[loginUserWithCookie]";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter param1 = new SqlParameter();
                    param1.ParameterName = "@username";
                    param1.Value = username;
                    cmd.Parameters.Add(param1);

                    SqlParameter param2 = new SqlParameter("@oldCookieHash", SqlDbType.VarBinary);
                    param2.Value = hashToUse;
                    cmd.Parameters.Add(param2);

                    SqlParameter param3 = new SqlParameter();
                    param3.ParameterName = "@user_ip";
                    param3.Value = Request.UserHostAddress; ;
                    cmd.Parameters.Add(param3);

                    SqlParameter cookieValueSQL = new SqlParameter("@cookieValue", SqlDbType.Int);
                    cookieValueSQL.Value = cookieValueInt;
                    cmd.Parameters.Add(cookieValueSQL);

                    SqlParameter cookieSaltSQL = new SqlParameter("@cookieSalt", SqlDbType.Int);
                    cookieSaltSQL.Value = cookieSaltInt;
                    cmd.Parameters.Add(cookieSaltSQL);

                    SqlParameter cookieHashSQL = new SqlParameter("@cookieHash", SqlDbType.VarBinary);
                    cookieHashSQL.Value = cookieHash;
                    cmd.Parameters.Add(cookieHashSQL);

                    SqlParameter param4 = new SqlParameter();
                    param4.ParameterName = "@result";
                    param4.Direction = ParameterDirection.Output;
                    param4.Value = 0;
                    cmd.Parameters.Add(param4);

                    SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                    param5.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(param5);

                    cmd.ExecuteNonQuery();
                    sqlResponse += param5.Value.ToString();
                    /*
                    System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                    xmlr.Read();


                    while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                    {
                        sqlResponse += xmlr.ReadOuterXml();
                    }
                    */
                    conn.Close();

                    //Check Result and save UserId if present:
                    if (Convert.ToInt32(param4.Value) != 0)
                    {

                    }

                    Session["userId"] = Convert.ToInt32(param4.Value);
                }
                finally
                {
                    // Close the connection
                    if (conn != null)
                    {
                        conn.Close();
                    }
                }

            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);

            
        }

        

        public void login()
        {
            logRequestData();

            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["userpassword"] == null)
                return;
            string userpassword = Request.Params["userpassword"];

            if (Request.Params["rememberX"] == null)
                return;
            string remember = Request.Params["rememberX"];
            bool createCookie = remember == "1" ? true : false;

            //get Salt:
            int salt = 0;
          
            try
            {
                conn.Open();
                string query = "[dbo].[getSalt]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@salt";
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);              
                
                cmd.ExecuteNonQuery();
                conn.Close();

                if (!Int32.TryParse(param4.Value.ToString(), out salt)) return;
                //salt = (int) param4.Value;
               
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //get password and salt as byte array
            byte[] password = System.Text.Encoding.UTF8.GetBytes(userpassword);
            byte[] saltBytes = BitConverter.GetBytes(salt);

            // create hash (as byte-array)
            byte[] hash;
            hash = GenerateSaltedHash(password, saltBytes);

            // convert to data that is MS SQL compatible:
            string newVarchar = System.Text.Encoding.UTF8.GetString(hash);



            //create data for the cookie if needed:
            int cookieValueInt = 0;
            int cookieSaltInt = 0;
            byte[] cookieHash = new byte[0];
            //string cookieNvarchar = "";
            if (createCookie)
            {
                //the same as with the createUser method, only that the password is now a integer that may be generated
                //get password and salt as byte array
                byte[] cookieSalt = new byte[4];
                saltGenerator.GetBytes(cookieSalt);
                byte[] cookiePassword = new byte[4];
                saltGenerator.GetBytes(cookiePassword);

                // create hash (as byte-array)
                
                cookieHash = GenerateSaltedHash(cookiePassword, cookieSalt);

                // convert to data that is MS SQL compatible:
                cookieValueInt = BitConverter.ToInt32(cookiePassword, 0);
                cookieSaltInt = BitConverter.ToInt32(cookieSalt, 0);
                //cookieNvarchar = System.Text.Encoding.UTF8.GetString(cookieHash);
            }



            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[loginUser]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter("@userpassword", SqlDbType.NVarChar, 64);
                param2.Value = newVarchar;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter();
                param3.ParameterName = "@user_ip";
                param3.Value = Request.UserHostAddress; ;
                cmd.Parameters.Add(param3);

                SqlParameter cookieValueSQL = new SqlParameter("@cookieValue", SqlDbType.Int);
                cookieValueSQL.Value = cookieValueInt;
                cmd.Parameters.Add(cookieValueSQL);

                SqlParameter cookieSaltSQL = new SqlParameter("@cookieSalt", SqlDbType.Int);
                cookieSaltSQL.Value = cookieSaltInt;
                cmd.Parameters.Add(cookieSaltSQL);

                SqlParameter cookieHashSQL = new SqlParameter("@cookieHash", SqlDbType.VarBinary);
                cookieHashSQL.Value = cookieHash;
                cmd.Parameters.Add(cookieHashSQL);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@result";
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                SqlParameter param5 = new SqlParameter("@xml", SqlDbType.Xml);
                param5.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param5);

                cmd.ExecuteNonQuery();
                sqlResponse += param5.Value.ToString();
                /*
                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();


                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    sqlResponse += xmlr.ReadOuterXml();
                }
                */
                conn.Close();

                //Check Result and save UserId if present:
                if (Convert.ToInt32(param4.Value) != 0)
                {

                }

                Session["userId"] = Convert.ToInt32(param4.Value);
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";           
            Response.Write(sqlResponse);
        }

        public void logout()
        {
            if (Session["userId"] == null)
                return;

            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            Session["userId"] = null;

            try
            {
                conn.Open();
                string query = "[dbo].[logout]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }


            
        }
        #endregion

        #region User Management
        public void getUserData()
        {
            if (Session["userId"] == null)
                return;

            int userId = Convert.ToInt32(Session["userId"]);
            if ( userId == 0) return;

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[UserData]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);               

                System.Xml.XmlReader xmlr = cmd.ExecuteXmlReader();
                xmlr.Read();


                while (xmlr.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    sqlResponse += xmlr.ReadOuterXml();
                }

                conn.Close();               
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void setUserLanguage()
        {
            if (Session["userId"] == null)
                return;

            if (Request.Params["languageX"] == null)
                return;
            string language = Request.Params["languageX"];


            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[updateUserLanguage]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@language";
                param5.Value = language;
                cmd.Parameters.Add(param5);

                cmd.ExecuteNonQuery();           

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void setUserDefaultName()
        {
            if (Session["userId"] == null)
                return;

            if (Request.Params["defName"] == null)
                return;
            string defName = Request.Params["defName"];


            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[updateUserDefaultName]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@defaultName";
                param5.Value = defName;
                cmd.Parameters.Add(param5);

                cmd.ExecuteNonQuery();

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void setUserStartingRegion()
        {
            if (Session["userId"] == null)
                return;

            if (Request.Params["defName"] == null)
                return;
            string defName = Request.Params["defName"];


            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[updateUserStartingRegion]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@defaultName";
                param5.Value = defName;
                cmd.Parameters.Add(param5);

                cmd.ExecuteNonQuery();

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }


        public void getStartingRegionCount()
        {
            if (Session["userId"] == null)
                return;

            if (Request.Params["GamedId"] == null)
                return;
            string GamedIdStr = Request.Params["GamedId"];

            if (Request.Params["RegionName"] == null)
                return;
            string RegionName = Request.Params["RegionName"];

            int GamedId;
            if (!Int32.TryParse(GamedIdStr, out GamedId)) 
                return;


            if (GamedId == 0) return;

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[getStartingRegionCount]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@gamedId";
                param1.Value = GamedId;
                cmd.Parameters.Add(param1);

                SqlParameter param5 = new SqlParameter();
                param5.ParameterName = "@regionName";
                param5.Value = RegionName;
                cmd.Parameters.Add(param5);

                sqlResponse = cmd.ExecuteScalar().ToString();
                                
                

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/plain";
            Response.Write(sqlResponse);
        }

        public void updateUserEmail()
        {
            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["userpassword"] == null)
                return;
            string userpassword = Request.Params["userpassword"];
        
            if (Request.Params["newEmail"] == null)
                return;
            string newEmail = Request.Params["newEmail"];

            if (Session["userId"] == null) return;
            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            //get Salt:
            int salt = 0;

            try
            {
                conn.Open();
                string query = "[dbo].[getSalt]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@salt";
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                cmd.ExecuteNonQuery();
                conn.Close();

                if (!Int32.TryParse(param4.Value.ToString(), out salt)) return;
                //salt = (int) param4.Value;

            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //get password and salt as byte array
            byte[] password = System.Text.Encoding.UTF8.GetBytes(userpassword);
            byte[] saltBytes = BitConverter.GetBytes(salt);

            // create hash (as byte-array)
            byte[] hash;
            hash = GenerateSaltedHash(password, saltBytes);

            // convert to data that is MS SQL compatible:
            string newVarchar = System.Text.Encoding.UTF8.GetString(hash);
           
            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[updateUserEmail]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter("@userpassword", SqlDbType.NVarChar, 64);
                param2.Value = newVarchar;
                cmd.Parameters.Add(param2);

                SqlParameter param21 = new SqlParameter("@newEmail", SqlDbType.NVarChar, 64);
                param21.Value = newEmail;
                cmd.Parameters.Add(param21);

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param3);

                cmd.ExecuteNonQuery();

                int res;
                if (Int32.TryParse(param3.Value.ToString(), out res) && res == 1)
                {
                    sqlResponse = "1";
                }
                else sqlResponse = "0";


                conn.Close();
                
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void updateUserPW()
        {
            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["userpassword"] == null)
                return;
            string userpassword = Request.Params["userpassword"];

            if (Request.Params["newUserpassword"] == null)
                return;
            string newUserpassword = Request.Params["newUserpassword"];

            if (Request.Params["rememberX"] == null)
                return;
            string remember = Request.Params["rememberX"];
            bool createCookie = remember == "1" ? true : false;

            //get Salt:
            int salt = 0;

            try
            {
                conn.Open();
                string query = "[dbo].[getSalt]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@salt";
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                cmd.ExecuteNonQuery();
                conn.Close();

                if (!Int32.TryParse(param4.Value.ToString(), out salt)) return;
                //salt = (int) param4.Value;

            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //get password and salt as byte array
            byte[] password = System.Text.Encoding.UTF8.GetBytes(userpassword);
            byte[] saltBytes = BitConverter.GetBytes(salt);

            // create hash (as byte-array)
            byte[] hash;
            hash = GenerateSaltedHash(password, saltBytes);

            // convert to data that is MS SQL compatible:
            string newVarchar = System.Text.Encoding.UTF8.GetString(hash);

            byte[] newPassword = System.Text.Encoding.UTF8.GetBytes(newUserpassword);
            byte[] newHash;
            newHash = GenerateSaltedHash(newPassword, saltBytes);
            string newHashVarchar = System.Text.Encoding.UTF8.GetString(newHash);

            //create data for the cookie if needed:
            int cookieValueInt = 0;
            int cookieSaltInt = 0;
            byte[] cookieHash = new byte[0];
            //string cookieNvarchar = "";
            if (createCookie)
            {
                //the same as with the createUser method, only that the password is now a integer that may be generated
                //get password and salt as byte array
                byte[] cookieSalt = new byte[4];
                saltGenerator.GetBytes(cookieSalt);
                byte[] cookiePassword = new byte[4];
                saltGenerator.GetBytes(cookiePassword);

                // create hash (as byte-array)

                cookieHash = GenerateSaltedHash(cookiePassword, cookieSalt);

                // convert to data that is MS SQL compatible:
                cookieValueInt = BitConverter.ToInt32(cookiePassword, 0);
                cookieSaltInt = BitConverter.ToInt32(cookieSalt, 0);
                //cookieNvarchar = System.Text.Encoding.UTF8.GetString(cookieHash);
            }



            string sqlResponse;
            sqlResponse = "";

            try
            {
                conn.Open();
                string query = "[dbo].[updateUserPassword]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter("@userpassword", SqlDbType.NVarChar, 64);
                param2.Value = newVarchar;
                cmd.Parameters.Add(param2);

                SqlParameter param21 = new SqlParameter("@newUserpassword", SqlDbType.NVarChar, 64);
                param21.Value = newHashVarchar;
                cmd.Parameters.Add(param21);


                SqlParameter cookieValueSQL = new SqlParameter("@cookieValue", SqlDbType.Int);
                cookieValueSQL.Value = cookieValueInt;
                cmd.Parameters.Add(cookieValueSQL);

                SqlParameter cookieSaltSQL = new SqlParameter("@cookieSalt", SqlDbType.Int);
                cookieSaltSQL.Value = cookieSaltInt;
                cmd.Parameters.Add(cookieSaltSQL);

                SqlParameter cookieHashSQL = new SqlParameter("@cookieHash", SqlDbType.VarBinary);
                cookieHashSQL.Value = cookieHash;
                cmd.Parameters.Add(cookieHashSQL);

                SqlParameter param4 = new SqlParameter();
                param4.ParameterName = "@result";
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                cmd.ExecuteNonQuery();
                sqlResponse = param4.Value.ToString();
                sqlResponse += "|";
                sqlResponse += cookieValueInt.ToString();
                conn.Close();

                //Check Result and save UserId if present:
                if (Convert.ToInt32(param4.Value) != 0)
                {

                }

            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void removeRememberCookie()
        {
            if (Request.Params["username"] == null)
                return;
            string username = Request.Params["username"];

            if (Request.Params["cookieValue"] == null)
                return;
            string rememberCookie = Request.Params["cookieValue"];
            int cookieValue;
            if (!Int32.TryParse(rememberCookie, out cookieValue)) return;
            byte[] cookieValueBytes = BitConverter.GetBytes(cookieValue);

            prependElements(ref cookieValueBytes, 4);

            bool foundOne = false;
            byte[] hashToUse = new byte[32];

            //call procedure that selects all rememberCookies
            //user may have cookies on several computers. Find out which value he is providing
            try
            {
                conn.Open();
                string query = "[dbo].[userRememberSalts]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@username";
                param1.Value = username;
                cmd.Parameters.Add(param1);

                SqlDataReader rdr = null;
                rdr = cmd.ExecuteReader();

                //iterate through the select result, and check for each line if the current information is correct. if yes, use that salt and hash to login


                //byte[]  cookieHashByte1 = new byte[32];
                while (rdr.Read())
                {
                    string cookieSalt = rdr["salt"].ToString();

                    //get hash and salt as byte array
                    byte[] cookieHashByte = (byte[])rdr["cookieHash"];
                    prependElements(ref cookieHashByte, 32);
                    int cookieSaltInt;
                    if (!Int32.TryParse(cookieSalt, out cookieSaltInt)) continue;
                    byte[] cookieSaltByte = BitConverter.GetBytes(cookieSaltInt);
                    prependElements(ref cookieSaltByte, 4);

                    // create hash (as byte-array)
                    byte[] hash;
                    hash = GenerateSaltedHash(cookieValueBytes, cookieSaltByte);

                    if (CompareByteArrays(hash, cookieHashByte))
                    {
                        foundOne = true;
                        hashToUse = hash;
                        break;
                    }
                }
                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }


            //login with the hash hashToUse
            if (foundOne)
            {

                try
                {
                    conn.Open();
                    string query = "[dbo].[removeCookie]";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    SqlParameter param1 = new SqlParameter();
                    param1.ParameterName = "@username";
                    param1.Value = username;
                    cmd.Parameters.Add(param1);

                    SqlParameter param2 = new SqlParameter("@oldCookieHash", SqlDbType.VarBinary);
                    param2.Value = hashToUse;
                    cmd.Parameters.Add(param2);

                    cmd.ExecuteNonQuery();
                    conn.Close();
                }
                finally
                {
                    // Close the connection
                    if (conn != null)
                    {
                        conn.Close();
                    }
                }

            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            //Response.Write(sqlResponse);
        }

        public void removeAllCookies()
        {
            if (Session["userId"] == null)
                return;     

            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            try
            {
                conn.Open();
                string query = "[dbo].[removeAllCookies]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);             

                cmd.ExecuteNonQueryAsync();

                conn.Close();
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }

        public void recoverPassword()
        {
            if (Request.Params["random"] == null)
            {
                Response.Write("0");
                return;
            }
            if (Request.Params["newPassword"] == null)
            {
                Response.Write("0");
                return;
            }
            
            //create the recovery hash from the code
            string HashVarchar = HashSHA256(Request.Params["random"]);
            
            //get the user data.
            bool UserDataFetched = false;
            int id = 0;
            int salt = 0;     
            try
            {
                // SqlCommand cmd = new SqlCommand(@"SELECT top 1 [id],[salt] FROM dbo.[Users] 
                //                                     WHERE recoveryCode = @recoveryCode and DATEDIFF(HOUR, [recoveryDateTime],  GETDATE())  < 25", conn);


                string query = "[dbo].[getUserDataByRecoveryCode]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.DbType = DbType.String;
                param1.ParameterName = "@recoveryCode";
                param1.Value = HashVarchar;
                cmd.Parameters.Add(param1);


                try
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        UserDataFetched = true;
                        id = reader.GetInt32(0);
                        salt = reader.GetInt32(1);         
                    }
                    
                }
                catch (Exception ex)
                {                    
                    Console.WriteLine(ex.Message);
                }
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            if (!UserDataFetched) 
            {
                Response.Write("1");
                return; 
            }

            //create the password hash from the new Password and the user salt
            //get password and salt as byte array
            byte[] password = System.Text.Encoding.UTF8.GetBytes(Request.Params["newPassword"]);
            byte[] saltBytes = BitConverter.GetBytes(salt);

            // create hash (as byte-array)
            byte[] hash;
            hash = GenerateSaltedHash(password, saltBytes);

            // convert to data that is MS SQL compatible:
            string SaltedPasswordHash = System.Text.Encoding.UTF8.GetString(hash);
           
            //update user
            //save the hash to the user
            try
            {
                //SqlCommand cmd = new SqlCommand(@"Update dbo.[Users] set [userpassword] = @hash, recoveryDateTime = null, [recoveryCode] = null
                //                                    WHERE [id] = @id", conn);

                string query = "[dbo].[setNewPasswordById]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@hash", SaltedPasswordHash);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Response.Write("1");
                    Console.WriteLine(ex.Message);
                }
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            
            //Password was resetted
            //ToDO: handle catches in a different way
            Response.Write("3");
            
        }

        #endregion

        #region registerToGame
       
        public void registerToGame()
        {
            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";            
            //one sql procedures splitted into 3 Statements, since I can't anymore do crossDatabase-Queries. -> this is now possible, but i am not sure if crossdatabase would be the right thing to do...
            
            //check that user exists, is not already registered for the game and that the game has yet open places
            int loginCode = checkRegisterInIndexDB();
            if (loginCode == 0) return;
                        
            //previously registered the user
            /*
             * if (registerInTargetDB(ref sqlResponse))
            {
                //previously added to userGames and incremented user count
                registerInIndexDB();
            }
            */
            sqlResponse += "<resp><success>1</success><code>" + loginCode.ToString() + "</code></resp>";

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }
       
        public int checkRegisterInIndexDB()
        {
            if (Session["userId"] == null)
                return 0;

            int loginCode = 0;
            byte[] loginCodeByte = new byte[4];
            saltGenerator.GetBytes(loginCodeByte);
            loginCode = BitConverter.ToInt32(loginCodeByte, 0);
            if (loginCode == 0) loginCode++;

            //uses ip, session and datetime to login into a selected game
            int userId;
            if (!Int32.TryParse(Session["userId"].ToString(), out  userId) || userId == 0) return 0;

            

            if (Request.Params["game"] == null)
                return 0;
            int selectedGameInt;
            if (!Int32.TryParse(Request.Params["game"], out  selectedGameInt) || selectedGameInt == 0) return 0;
            string selectedGame = selectedGameInt.ToString();

            if (Request.Params["StartingRegion"] == null)
                return 0;
            string StartingRegion = Request.Params["StartingRegion"];

            //write IP and date into the specified DB for that user. 
            //Javascript will redirect if the sql-Command worked

            //string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["inSpaceIndexConnectionString"].ConnectionString;
            //conn = new SqlConnection(ConnectionString);

            //ToDo: really make sure that this can only open Stored procedures, so that no SQL injection is possible
            try
            {
                conn.Open();
                string query = "[dbo].[registerUserCheckGame]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@gameId";
                param2.Value = selectedGame;
                cmd.Parameters.Add(param2);

                SqlParameter code = new SqlParameter();
                code.ParameterName = "@code";
                code.Value = loginCode;
                cmd.Parameters.Add(code);

                SqlParameter StartingRegionSQL = new SqlParameter();
                StartingRegionSQL.ParameterName = "@startingRegion";
                StartingRegionSQL.Value = StartingRegion;
                cmd.Parameters.Add(StartingRegionSQL);
                

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(param3);

                cmd.ExecuteNonQuery();

                conn.Close();

                int res;
                if (Int32.TryParse(param3.Value.ToString(), out res) && res == 1)
                    return loginCode; 
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }

            return 0;
        }

        public bool registerInTargetDB(ref string _xml)
        {
            if (Session["userId"] == null)
                return false;

            //uses ip, session and datetime to login into a selected game
            //int userId = Convert.ToInt32(Session["userId"]);
            //if (userId == 0) return false;
            int userId;
            if (!Int32.TryParse(Session["userId"].ToString(), out  userId) || userId == 0) return false;

            if (Request.Params["game"] == null)
                return false;
            string selectedGame = Request.Params["game"];

            if (Request.Params["name"] == null)
                return false;
            string name = Request.Params["name"];
            name = name.Substring(0, Math.Min(63, name.Length));

            if (Request.Params["languageX"] == null)
                return false;
            string language = Request.Params["languageX"];
            language = language.Substring(0,Math.Min(language.Length,2));

            if (Request.Params["quests"] == null)
                return false;
            string x = Request.Params["quests"];
            int quests = x == "true" ? 1 : 0;



            //selectedGame was used as part of the query. To prevent injection, cast selectedGame as int and back to String...
            //... since the webHosted doesn't permit crossDatabase-Queries, selectedGame is now used to get the right connString
            int game;
            if (!Int32.TryParse(selectedGame, out game)) return false;
            selectedGame = game.ToString();

            string ConnectionString2 = System.Configuration.ConfigurationManager.ConnectionStrings[gameKey + selectedGame].ConnectionString;
            SqlConnection conn2 = new SqlConnection(ConnectionString2);

            
            //ToDo: really make sure that this can only open Stored procedures, so that no SQL injection is possible
            try
            {
                conn2.Open();
                /*exec [Game02].[dbo].[registerUser] @userId, @result out, @xml out */
                string query = "[dbo].[registerUser]";
                SqlCommand cmd = new SqlCommand(query, conn2);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param0 = new SqlParameter();
                param0.ParameterName = "@userId";
                param0.Value = userId;
                cmd.Parameters.Add(param0);

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@name";
                param1.Value = name;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter("@user_ip", SqlDbType.NVarChar);
                param2.Value = Request.UserHostAddress;
                cmd.Parameters.Add(param2);

                SqlParameter param3 = new SqlParameter("@languageShort", SqlDbType.NVarChar);
                param3.Value = language;
                cmd.Parameters.Add(param3);
                
                SqlParameter param4 = new SqlParameter("@quests", SqlDbType.Int);
                param4.Value = quests;
                cmd.Parameters.Add(param4);

                SqlParameter param5 = new SqlParameter("@result", SqlDbType.Int);
                param5.Direction = ParameterDirection.Output;
                param5.Value = 0;
                cmd.Parameters.Add(param5);

                SqlParameter param6 = new SqlParameter("@xml", SqlDbType.Xml);
                param6.Direction = ParameterDirection.Output;
                param6.Value = 0;
                cmd.Parameters.Add(param6);

                cmd.ExecuteNonQuery();
                _xml += param6.Value.ToString();                

                conn2.Close();

                int res;
                if (Int32.TryParse(param5.Value.ToString(), out res) && res == 1)
                    return true; 
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn2.Close();
                }
            }            
        
            return false;
        } 

        #endregion registerToGame

        #region loginToGame       
       
        public void loginToGame()
        {
            if (checkLoginInIndexDB())
                loginToGameInTargetDB();
        }

        public bool checkLoginInIndexDB()
        {
            if (Session["userId"] == null)
                return false;

            //uses ip, session and datetime to login into a selected game
            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return false;

            string user_ip = Request.UserHostAddress;
            DateTime loginDT = DateTime.Now;

            if (Request.Params["game"] == null)
                return false;
            string selectedGame = Request.Params["game"];
            
            try
            {
                conn.Open();
                string query = "[dbo].[LoginTogame]";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@userIp";
                param2.Value = user_ip;
                cmd.Parameters.Add(param2);

                SqlParameter param4 = new SqlParameter("@gameId", SqlDbType.Int);
                param4.Value = selectedGame;
                cmd.Parameters.Add(param4);

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                param3.Value = 0;
                cmd.Parameters.Add(param3);

                cmd.ExecuteNonQuery();               

                conn.Close();

                int res;
                if (Int32.TryParse(param3.Value.ToString(), out res) && res == 1)
                    return true; 
            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn.Close();
                }
            }
            return false;
        }

        public void loginToGameInTargetDB()
        {
            if (Session["userId"] == null)
                return;

            //uses ip, session and datetime to login into a selected game
            int userId = Convert.ToInt32(Session["userId"]);
            if (userId == 0) return;

            string user_ip = Request.UserHostAddress;
            DateTime loginDT = DateTime.Now;

            if (Request.Params["game"] == null)
                return;
            string selectedGame = Request.Params["game"];

            //selectedGame was used as part of the query. To prevent injection, cast selectedGame as int and back to String...
            //... since the webHosted doesn't permit crossDatabase-Queries, selectedGame is now used to get the right connString
            int game;
            if (!Int32.TryParse(selectedGame, out game)) return;
            selectedGame = game.ToString();

            string ConnectionString2 = System.Configuration.ConfigurationManager.ConnectionStrings[gameKey + selectedGame].ConnectionString;
            SqlConnection conn2 = new SqlConnection(ConnectionString2);

            string sqlResponse;
            sqlResponse = "<?xml version='1.0' encoding='utf-8' ?>";

            Int64 loginCode = 0;
            byte[] loginCodeByte = new byte[8];
            saltGenerator.GetBytes(loginCodeByte);
            loginCode = BitConverter.ToInt64(loginCodeByte, 0);

            try
            {
                string key = Guid.NewGuid().ToString();

                conn2.Open();
                string query = "[dbo].[LoginFromIndex]";
                SqlCommand cmd = new SqlCommand(query, conn2);
                cmd.CommandType = CommandType.StoredProcedure;


                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@userId";
                param1.Value = userId;
                cmd.Parameters.Add(param1);

                SqlParameter param2 = new SqlParameter();
                param2.ParameterName = "@userIp";
                param2.Value = loginCode.ToString();
                cmd.Parameters.Add(param2);
                

                SqlParameter param3 = new SqlParameter("@result", SqlDbType.Int);
                param3.Direction = ParameterDirection.Output;
                param3.Value = 0;
                cmd.Parameters.Add(param3);

                SqlParameter param4 = new SqlParameter("@xml", SqlDbType.Xml);
                param4.Direction = ParameterDirection.Output;
                param4.Value = 0;
                cmd.Parameters.Add(param4);

                cmd.ExecuteNonQuery();
                sqlResponse += param4.Value.ToString();
                sqlResponse = loginCode.ToString();
                conn2.Close();

            }
            finally
            {
                // Close the connection
                if (conn != null)
                {
                    conn2.Close();
                }
            }

            //return the result (Response)
            Response.Clear();
            Response.Expires = -1;
            Response.ContentType = "text/xml";
            Response.Write(sqlResponse);
        }
        #endregion loginToGame

        public void sendEmail(string email, string verification )
        {
            if (String.IsNullOrEmpty(email)) return;

            var fromAddress = new MailAddress("admin@empiresinspace.com", "From Name");
            var toAddress = new MailAddress("a.kastirke@gmail.com", "To Name");
            
            
            try
            {
                toAddress = new MailAddress(email, "To Name");
            }
            catch( Exception )
            {
                //ToDO: return errorCode
                return;
            }

            const string fromPassword = "101010DontPanic";
            const string subject = "test";
            string body = "http://localhost:53174/Authentication.aspx?action=authentication&code=" + verification;

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword),
                Timeout = 20000
            };

            using ( var message = new MailMessage(fromAddress, toAddress){
                Subject = subject,
                Body = body})
            {
                smtp.Send(message);
            }
        }

        public string getIp()
        {
            string clientIP;
            string ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (!string.IsNullOrEmpty(ip))
            {
                string[] ipRange = ip.Trim().Split(',');
                clientIP = ipRange[0];
                //string[] ipRange2 = clientIP.Split(':');
                //clientIP = ipRange2[0];
            }
            else
                clientIP = Request.ServerVariables["REMOTE_ADDR"];


            return clientIP;
        }

        public void logRequestData()
        {
            return;
            string ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            saveLog("checkLogin() 1 Request.ServerVariables[HTTP_X_FORWARDED_FOR] " + ip);
            // If there is no proxy, get the standard remote address
            if ((ip == null) || (ip == "") || (ip.ToLower() == "unknown"))
            {
                ip = Request.ServerVariables["REMOTE_ADDR"];
                saveLog("checkLogin() 2 Request.ServerVariables[REMOTE_ADDR] " + ip);
            }

            int loop1, loop2;
            System.Collections.Specialized.NameValueCollection coll;

            // Load ServerVariable collection into NameValueCollection object.
            coll = Request.ServerVariables;
            // Get names of all keys into a string array. 
            String[] arr1 = coll.AllKeys;
            for (loop1 = 0; loop1 < arr1.Length; loop1++)
            {
                saveLog("checkLogin() 3 ServerVariables Key " + arr1[loop1]);
                //Response.Write("Key: " + arr1[loop1] + "<br>");
                String[] arr2 = coll.GetValues(arr1[loop1]);
                for (loop2 = 0; loop2 < arr2.Length; loop2++)
                {
                    saveLog("checkLogin() 3 ServerVariables Key " + arr1[loop1] + "   Value " + loop2 + ": " + Server.HtmlEncode(arr2[loop2]));
                    //Response.Write("Value " + loop2 + ": " + Server.HtmlEncode(arr2[loop2]) + "<br>");
                }
            }

            saveLog("checkLogin() 5 getIp() " + getIp());
        }

        public void saveLog(string logText)
        {
            try
            {               
                conn.Open();
                SqlCommand command = conn.CreateCommand();
                command.Connection = conn;

                command.CommandText =
                    "insert into [dbo].[Log](logText) select @text";
                command.CommandType = System.Data.CommandType.Text;
                command.Parameters.AddWithValue("@text", logText);

                command.ExecuteNonQuery();
                conn.Close();           
            }
            catch (Exception ex)
            {
                //if saving did not work, save to file system, send an email or whatever
                //Core.Core.Instance.writeExceptionToLogFile(ex);
            }

        }
 
    }
}