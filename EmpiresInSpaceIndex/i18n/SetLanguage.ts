/// <reference path="../References.ts" />
declare var version;
declare var i18nPath: string;


module EmpiresIndex {

    export var currentLang : string;

    export function getLang() : string{
        return currentLang;
    }
    export class Labels {
        //default values      

        MUICAPTION = "Empires in Space";

        TAB2H = "Description";
        TAB3H = "Screenshots";
        TAB4H = "Forum";
        TAB5H = 'Changelog';
        

        MUITESTDEMO = "Empires in Space ist ein Strategie, Aufbau und Handelsspiel. Es zeichnet sich durch die klassische 2D-Karte als Hauptansicht aus, die für installierte Strategiespiele seit über 20 Jahren üblich ist.<br>Typische, installierte Spiele dieses Genres erlauben zwar Mehr-Spieler-Partien, doch diese sind bisher aufwendig zu organisieren. Empires in Space erlaubt ist ein Mehrspieler Strategie- und Aufbauspiel, das nach oben offene Benutzerzahlen erlaubt!<br>";
        //MUITESTDEMO = "Teste die Demoversion oder melde dich an und mach mit.";
        MUIDEMORESET = "Die Demoversion ist ohne Anmeldung vollständig spielbar, wird aber jede Nacht resetted.";
        MUINEWGAME = "Wenn  du ein neues Spiel anfängst werden dir Intro-Quests die Spielmechanik erklären.";

        //Tab1
        HEADERLANGUAGE = "Sprache:";

        RegisterHeader = "Not tried it yet? Register now:";
        

        
        
        
        TRYDEMO = "Try it out...";

        //Menu
        MULLOGIN = "Login:";
        Continue = "Continue";
        JoinGame = "Join Game";
        CreateAccount = "Create<br>New Account";
        

        About = "About";
        Gallery = "Gallery";
        Changelog = "Changelog";
        MULEXIT = "Logout";

        //Screens:
        //Login Screen
        MULNAME = "Name";
        MULPASSWORD = "Password";
        MULREMEMEBER = "Angemeldet bleiben";
        MULBUTTON = "Login";
        LoginFailed = "Login failed!";
        ForgotPassword = "Forgot your password?";
        RecoveryButton = "Reset Password";

        //Register Screen
        CreateAccountTitle = "Create new Account";
        ButtonRegister = 'Create Account';

        RegisterName = "Name";
        RegisterPW = "Password";
        RegisterEmail = "Email";
        RegisterInGame = "Name to show in the game";
    
        registerNameError = "Account name error";
        registerNameError2 = "Account name is not unique";
        registerEmailError = "Email-address error";
        registerEmailError2 = "The email-address is already used by another account";
        registerCaptchaError = "Captcha error";

        //Join Game Screen
        chooseGame = "Choose Game";


        //SettingsScreen

        settingsOldPW = "Password";
        settingsNewPassword = "New password";
        settingsNewPasswordRepeat = "Repeat new password";
        settingsDeleteCookie = "Delete cookie";
        settingsDeleteAllCookies = "Delete all cookies";
        settingsDelete = "Delete...";
        settingsHelp = "?";

        //AboutScreen
        Empires = "Empires In Space";
        AboutText = "A turn based 4X Space Strategy Game<br/>The well known 4X Features (Explore, Expand, Exploit, Exterminate), a tech tree, ship designer and goods all available now in a turn based Massive Multiplayer Online title.<br/><br/>Turn evaluations are done every 4 hours, with all values stacking up for multiple turns.<br/>Balanced out so that a single login per day might suffice in times of peace.<br/><br/>And there are(of course) no pay2win features included...";

        //ChangelogScreen

        //Helptext
        registerNameHelp = "Unique account name. Use this name (or your email-address) to login to Empires in Space.";
        registerPasswordHelp = "Your password will be securely stored in an encrypted state (salt+hash), but the transfer does not (yet) use HTTPS.";
        registerEmailHelp = "The email-address is needed for authentification purposes. You can use throw-away-address if you like, but keep in mind that it may be more comfortable and secure to use your private email-address.";
        settingsDefaultNameHelp = "The default name will be used (and shown to other players) when you start a new game. You can change it during a game on any time from the user settings screen of the game.";
        settingsStartRegionHelp = "Optional field that can be used to group with other players. Players using the same starting region as you will be nearby. Enter a new name for a starting region to start at a different location than other players.";
        SettingsScreenStartRegionCountHelp = "Shows the amount of players that have already choosen the selected starting region.";
        
        settingsDeleteCookieHelp = "Deletes the cookie on this sessions and the corresponding server sided entry. Do this if you do not trust those that will use your computer after you, or if you fear that there was a security breach on your computer.";
        settingsDeleteAllCookiesHelp = "Deletes all server sided entries for cookies, invalidating cookies on all computers for your user. Changing the password will automatically invalidate all cookies. ";


        StartingRegion = "Starting region";
        PlayersInRegion = "Starting region";

        //Password Recovery:
        recoveryTitle = "Password Recovery";
        recoveryKey = "Enter key from email";
        recoveryNewPassword = "New Password";
        recoveryNewPasswordPassword = "Repeat new Password";
        recoverySend = "Set new Password";
        recoveryEmailSent = "Password recovery email was sent";
        recoveryEmailUnknown = "Unknown Email address";
        recoveryEmailFailure = "Error during recovery email creation. Please try again...";

        recoveryFailure = "Recovery failed. Request a new email";
        recoveryPasswordMismatch = "Password Mismatch";
        recoveryHashError = "Invalid Key. Request a new Password reset email.";
        recoverySuccess = "Password was set. Redirecting to index page in ";
        

        //tab2
        tabDescription = "<p>Empires in Space ist ein Strategie, Aufbau und Handelsspiel. Es zeichnet sich durch die klassische 2D-Karte als Hauptansicht aus, die für installierte Strategiespiele seit über 20 Jahren üblich ist.<br>Typische, installierte Spiele dieses Genres erlauben zwar Mehr-Spieler-Partien, doch diese sind bisher aufwendig zu organisieren. Empires in Space erlaubt ist ein Mehrspieler Strategie- und Aufbauspiel, das nach oben offene Benutzerzahlen erlaubt!<br></p>";

        //Tab3
        tabScreenShots = '<p>Screenshots gibt es noch nicht, klicke statdessen doch einfach im unteren Bereich einmal auf "Ausprobieren" und schaue dir den aktuellen Entwicklungsstand live an...</p>';

        //Tab4
        tabForum = '<p>Ein englischsprachiges Forum findest du <a href="http://www.empiresinspaceforum.de/" target="_blank">hier</a>, ein deutschsprachiges kommt bald</p>';

        //Tab5
        tabPay2Win = '<p>I do not want to display commercials, and i do not like s "pay to win" games. To be able to work full time on the project and to pay for the webhosting, I decided to use the following system:<br>' + 
                     'I host multiple parallel games. Each game has either a capped tech tree, or the full tech tree. If the tech tree is capped, this affects < b > all </b > players of that game.<br>' +
                    'Users who play for free can join capped games and play them.Since the cap does affect all members of that game, it will be fair.And since most of the fun comes from the multiplayer aspect, the cap does not hurt much.<br>' + 
                    'Users which pay a small amount (12 $ for one year) get access to noncapped games.They can continue to play capped games, but the restriction remains in these.<br>' + 
                    "Aside from the cool high tech features such as star gates, planetary based super cannons and big tetrahedral battleships, the non - capped games have all the senior players and they won't contain many fake accounts.<br>" + 
                    'And lastly I plan to sell skins for ships and other ingame objects, but only representative things that do not affect the balance in any way...</p>';

       

        DemoCaption1 = "Demo - Ausprobieren ohne Anmeldung (Startphase)";
        DemoCaption2 = "Demo - Try out without registering  - after 100 turns / 20 days";

        ButtonOK        = "OK";
        ButtonCancel    = "Cancel";

        settings = "Options";
        settingsPWRepeatError = "Password inconsistence";
        settingsPWwrong = "Wrong password ";               
        

        


        gamesCS = "Coming soon...";
        gamesStartAt = "Starting : ";
        gamesStarted = "Started : ";
        gamesRunning = "Running";
        gamesFinished = "Finished";
        gamesPlayers = "Players: ";
        gamesPlayersOf = " of ";

        rules = "Rules";
        rulesFor = "Rules for ";
        registerGame = "Join";

        description1 = "<p>6 Runden pro Tag (alle 4 Stunden)<br><br>Spiel in Alpha - Phase <br> - kontinuierliche Erweiterungen des Inhaltes während des Spieles <br><br>Dauer: ~2 Monate </p >";


        PasswordResetTitle = "[Empires in Space] Password Reset";
        PasswordResetContent = "Hi there,<br>" +
        "<br>" +
        "Someone (presumably you) requested a password  reset.<br>" +
        "If it was someone else, just ignore this email (well, I would worry why someone having my email address puts that address into the password recovery dialog, but I would not know what to do in this strange case...).<br>" +
        "If it was you, please visit this link and enter a new password:<br>" +
        "<br>" +
        "%0<br>" +
        "<br>" +
        "If the redirect does not work, visit this web site:<br>" +
        "<br>" +
        "%1<br>" +
        "<br>" +
        "And enter this key in addition to you new password:<br>" +
        "<br>" +
        "%2<br>" +
        "<br>" +
        "By the way, your login name is:<br>" +
        "<br>" +
        "%3<br>" +
        "<br>" +
        "Have fun playing Empires in Space,<br>" +
        "<br>" +
        "Sincerely<br>" +
        "The Empires in Space team<br>" +
        "<br>";


        

        languages = []; //contains objects which have all translations

        constructor() {
        }


        setUserButtons(loggedIn: boolean) {

            if (loggedIn) {
                $("#Login").text(this.Continue);
                $("#NewAccount").html(this.JoinGame);
            } else {
                $("#Login").text(this.MULBUTTON);
                $("#NewAccount").html(this.CreateAccount);
            }
            /*
            if (pageIndex.user != null) {
                $("#Login").text(this.Continue);
                $("#NewAccount").html(this.JoinGame);
            } else {
                $("#Login").text(this.MULBUTTON);
                $("#NewAccount").html(this.CreateAccount);
            }*/
        }

        //called during onLoad of the page, when aspx elements have to be supplied with a label
        setLabels(loggedIn = false) {

            var change0001 =
                "<div><span>2015.08.08</span><ul>" +
                "<li>Changelog tab added to Index</li>" +
                "<li>Movement range is now showed when a ship is moved</li>" +
                "<li>Experimental space nebula added</li>" +
                "<li>Combat messages overhaul</li>" +
                "</ul></div>";

            var change0002 =
                "<div><span>2015.08.10</span><ul>" +
                "<li>NEW: left click in Contacts panel opens User Details</li>" +
                "<li>Started work on colony siege and occupation </li>" +
                "<li>Bugfix: ship-hitpoints calculation (each ship has had +50 hp)</li>" +
                "<li>Bugfix: module production refresh of colony</li>" +
                "<li>Bugfix: alliance description field repaired</li>" +
                "</ul></div>";

            var change0003 =
                "<div><span>2015.08.18</span><ul>" +                
                "<li>NEW GAME: Cygnus A is open for registration </li>" +
                "<li>Cygnus A is a spiral galaxy with huge fields of nebula between the galaxy arms</li>" +
                "<li>Added Transcendence Victory Points</li>" +
                "<li>Bugfix: remove Transcendence when ship is destroyed</li>" +
                "<li>Bugfix in User Interface: assembly points calculation fixed</li>" +
                "<li>Star Base and Star Fortress removed (will be implemented later)</li>" +
                "</ul></div>";

            var change0004 =
                "<div><span>2015.08.23</span><ul>" +
                "<li>8 new Researches: Space Marines, Aquafarming, Arcology, Superdense Materials, Colonization III, Pressure Dome, Modules III, Special Ressources Modules</li>" +
                "<li>4 new Buildings: Aqua Farm, Arcology, Neutronium Reactor, Pressure Dome</li>" +
                "<li>11 new Ship Modules (Class III)</li>" +
                "<li>Faster colony growth rate: 1/4 of the excess housing, absolute value is between 4-20 </li>" +
                "<li>Slight increase of assembly point gain. Production of goods stays at the same rate.</li>" +
                "<li>Special Ressource buildings create higher benefits for the colony!</li>" +
                "</ul></div>";


            var change0005 =
                "<div><span>2015.08.24</span><ul>" +
                "<li>Important: Removed surplus space stations. Your quest will now most likely target 4096/5002, if it did not already target that location</li>" +
                "<li>New Hotkey: i does show which special ressource you will get per solar system</li>" +
                "<li>Added some images: colonization modules, aqua farm, pressure dome and neutronium</li>" +
                "</ul></div>";


            var change0006 =
                "<div><span>2015.08.30</span><ul>" +
                "<li>Goods transfer view does now have a popup info for the goods images</li>" +
                "<li>Bugfix: Contacts view - click on message or relation change does not open the details view anymore</li>" +
                "<li>Assembly point change is shown during construction of buildings</li>" +
                "<li>Research Tree: New graphic for the production bonus</li>" +
                "<li>Modificators of the Special Ressource Buildings increased</li>" +
                "<li>Scrolling supported for tablets and smart phones</li>" +
                "<li>Colony limit will soon be removed. It will be replaced by a negative production modifier per colony</li>" +
                "</ul></div>";

            var change0007 =
                "<div><span>2015.08.31</span><ul>" +
                "<li>New: Modifier Icons and Tooltips in the research tree header </li>" +
                "<li>Bugfix: Research cost corrected</li>" +
                "<li>Colonizing limit removed, instead administration gives a positive production modificator, colonies create a negative production modificator. See the new modifier info on the research tree for this</li>" +            
                "</ul></div>";

            var change0008 =
                "<div><span>2015.09.03</span><ul>" +
                "<li>New: Modifier Tooltips on the goods-stock in the colony screen</li>" +
                "<li>Distance to Homeworld - modifier will soon be implemented:</li>" +
                "<li>(Distance - 10) * -3 will be the modifier for Research,Assembly points and production. Only values between 0 and -50 will be applied.</li>" +
                "<li>Distance is the higher value of  |(homeworld.x - colony.x)| and |(homeworld.y - colony.y)|</li>" +
                "</ul></div>";

            var change0009 =
                "<div><span>2015.09.05</span><ul>" +
                "<li>Goods transfer to other players is now possible</li>" +
                "<li>Bugfix: Double click on research did substract the costs twice</li>" +
                "<li>New Research spread calculation:<br> Previous calculation compared the amount of player who have a research to the overall user count. New calculation compares the population of the users who have a research to the overall population count<br>If 80% of the game population have a technology researched, the research will be 40% cheaper for the players who do not have the research yet</li>" +
                "</ul></div>";

            var change0010 =
                "<div><span>2015.09.07</span><ul>" +
                "<li>Changed Website to the sub - domain www.EmpiresInSpace.com.You might have to insert your credentials anew, and the first startup will have to cache all image data, so it will take a bit longer than usual</li>" +
                "<li>Modules: special ressource modules costs corrected</li>" +
                "<li>On Declaration of war: <ul>" +
                "<li>No automatic ship movement</li> " +
                "<li>No loss of movement points</li> " +
                "<li>Auto - Combat when multiple ships are on the same field. Attacking ships without movement points get a penalty: they deal only 80% of their damage</li> " +
                "</ul> </li></ul></div>";

            var change0011 =
                "<div><span>2015.09.21</span><ul>" +
                "<li><a target='_blank' href='http://empiresinspace.blogspot.de/2015/09/average-weapon-damage-and-experience.html'> Combat overhaul<a> finished </li>" +
                "<li>Ship experience, weapon 'To Hit' chance and ship evasion added</li>" +
                "<li>Colony invasion/occupation added: build a ship with a space marines module to seize foreign colonies</li>" +
                "<li>Hostile Space Pirates added</li> " +
                "<li>Colonies can be abandoned: press X in lower left corner and enter security key</li> " +
                "<li>Text overlay on galaxy map during battle to show the result</li> " +
                "<li>Fixed bugs: Arcology costs, border color, message symbol, Deploying of space stations</li> " +
                "</ul></div>";

            var change0012 =
                "<div><span>2015.09.28</span><ul>" +
                "<li>Combat system: Damaged ships deal less damage and get an evasion penalty</li>" +
                "<li>Pirates spawn less often</li>" +
                "<li>BugFix: Pirates did spawn on stars instead of nebulas</li>" +
                "<li>BugFix: Show siege duration on colonies</li> " +
                "<li>BugFix: Relation to Pirates and Separatists set to 'hostile' and removed bug setting which set the relation to 'neutral'</li> " +
                "<li>Bugfix: Empires in Space is now listed in google (third page yet)</li> " +                
                "</ul></div>";

            var change0013 =
                "<div><span>2015.10.19</span><ul>" +
                "<li>User Interface overhaul</li>" +
                "<li>Tooltip containing coordinates when a ship is moved on the star map</li>" +
                "<li>Creation of the Messier 83 galaxy</li>" +
                "<li>BugFix: Doubled combat message </li> " +                
                "</ul></div>";

            var change0014 =
                "<div><span>2015.10.26</span><ul>" +
                "<li>New: Conversations instead of simple messages</li>" +
                "<li>Message drafts are saved during writing them</li>" +
                "<li>Research Tree overhaul</li>" +
                "<li>Special ressource production reduced from 20 to 12</li> " +
                "<li>Food requirements for colony modules increased</li>" +
                "<li>Building material plant: production reduced to 8</li>" +
                "<li>Several bugfixed regaring User Interface</li>" +
                "<li>Transcendence Builders do now require 50 points fleet upkeep</li> " +
                "</ul></div>";

            var change0015 =
                "<div><span>2015.11.02</span><ul>" +
                "<li>Spaceport and Modules Plant moved to new UI</li>" +
                "<li>ColonyList: Star and Planet click supported</li>" +
                "<li>Using the Navigation Pane Button to leave a solarsystem moves the field of view to the star</li>" +
                "<li>New: 'Mark all read'-Button on message panel</li>" +
                "<li>Transzendence/Monolith ships movement rate reduces </li> " +
                "<li>BugFix: Login/Creation of multiple users per IP address (company network) repaired</li>" +
                "<li>Pending work: new diplomatic status 'Hostile' which lies between 'War' and 'Neutral'</li>" +
                "</ul></div>";


            var change0016 =
                "<div><span>2015.11.09</span><ul>" +
                "<li>New Icon(favicon) for website</li>" +
                "<li>Bugfix : Loss of goods when transferring from debris</li>" +
                "<li>Critical bug fixed: New players got placed in systems where the habitable world was already colonized by another player</li>" +
                "<li>Diplomatic mode Hostile deployed to Cygnus galaxy for testing</li>" +
                "</ul></div>";

            var change0017 =
                "<div><span>2015.11.30</span><ul>" +
                "<li>New: Diplomatic mode Hostile added</li>" +
                "<li>New: Transfer - All Buttons in transfer screen</li>" +
                "<li>New: Space Nebula graphic greatly enhanced</li>" +
                "<li>New: Diplomatic icon showing current state in contact list</li>" +
                "<li>Bugfix: Colony occupation now changes building ownership</li>" +
                "<li>Bugfix: Detecting html tags in user and alliane description</li>" +
                "<li>Bugfix: Politics page of players does now show playernames</li>" +
                "</ul></div>";

            var change0018 =
                "<div><span>2015.12.07</span><ul>" +
                "<li><font color='green'>Support for HTML5 WebSockets added</font></li>" +
                "<li><font color='blue'>Less evasion for scouts and corvettes</font></li>" +
                "<li><font color='blue'>More hitpoints for space stations</font></li>" +
                "<li><font color='green'>Turn summary info in Main view</font></li>" +
                "<li>Bugfix: improved Performance of Nebula(further work is still needed)</li>" +
                "<li>Bugfix: Using wrong relations for alliance members</li>" +
                "<li><font color='green'>New tabpage in trade screen, showing known trade posts</font></li>" +
                "</ul></div>";
            
            var change0019 =
                "<div><span>2016.01.10</span><ul>" +
                "<li><font color='green'>Borders around colonies implemented</font></li>" +
                "<li><font color='green'>7 new researches regarding high end ship modules added</font></li>" +
                "<li><font color='green'>7 new sun images added </font></li>" +
                "<li><font color='green'>Placing of buildings simplified</font></li>" +               
                "</ul></div>";

            var change0020 =
                "<div><span>2016.02.01</span><ul>" +
                "<li><font color='green'>New Galactic Events screen, showing things like:<ul>" +
                "<li>Declarations of war</li> " +
                "<li>Signing of pacts</li> " +
                "<li>Ship-Combats that took place</li> " +
                "<li>New players which arrive in the galaxy</li> " +
                "</ul></font></li>" +

                "<li><font color='green'>Chat implemented</font></li>" +
                "<li><font color='green'>Borders are now shown on the whole map, and not only in the scanned area</font></li>" +
                "<li><font color='green'>Dark UI: Dark background and white font color</font></li>" +
                "</ul></div>";

            var change0021 =
                "<div><span>2016.02.29</span><ul>" +
                "<li><font color='10d010'>Pathfinding algorithm A* added</font></li>" +
                "<li><font color='10d010'>Alliances now have a closed platform for their members to communicate</font></li>" +
                "<li><font color='10d010'>Games Fornax A is in test phase</font></li>" +
                "<li>Dark UI: lots of bugs that resulted from the switch to the dark user interface removed</li>" +
                "<li><font color='blue'>Pressure dome improved (+3 food)</font></li>" +
                "<li><font color='blue'>The Transcendence Construct does need three times the amount of helper ships</font></li>" +
                "<li>The design of the communication channels got tweaked a bit</li>" +
                "</ul></div>";

            var change0022 =
                "<div><span>2016.03.14</span><ul>" +
                "<li><font color='10d010'>New colony screen</font></li>" +
                "<li><font color='10d010'>6 researches added which allow the colonization of the various planet types </font>" +
                "<br><br>" +
                "So the colony screen has now changed a lot. Instead of a flat planet surface having 88 (11x8) fields to put buildings onto, we have now a planet with 37 fields.<br>Finally, other planets and moons in the solar system of the colony may be settled now. These provide the colony with some extra fields to put buildings on. As one does reseach more advanced colonization technologies, more and more planets and moons are unlocked for being settled...</li>" +
                "</ul>" +
                "<p></p>" + "</div>";

            var change0023 =
                "<div><span>2016.04.19</span><ul>" +
                "<li><font color='10d010'>Alliance borders are shown as default instead of user borders</font></li>" +
                "<li><font color='10d010'>Enabled the missing ships: Cruiser, battleship, superbattleship</font></li>" +
                "<li><font color='10d010'>Added the heavy fighter hull</font></li>" +
                "<li><font color='10d010'>Progress bar for the growth of the area of influence </font></li>" +
                "<li><font color='10d010'>Borders may not be trespassed when on neutral stance to the owner of the area  </font></li>" +
                "<li><font color='10d010'>Cargoroom refactored: ship modules now take up as much place as the goods required to build them</font></li>" +
                "<li>Area of influence spready now circular</li>" +
                "<li>Small enhancements to the design of the user interface</li>" +
                "<li>And many many bugfixes that were due to those changes</li>" +
                "</ul>" +
                "<p></p>" + "</div>";

            var change0024 =
                "<div><span>2016.07.14</span><ul>" +
                "<li><font color='#10d010'>New Custom Player Civilization:<ul>" +
                    "<li>Choose Culture (Militaristic, Scientific etc)</li> " +
                    "<li>Choose a Research Focus to unlock better production building</li> " +
                    "<li>Choose ship module types which will be better than the common ones</li> " +                    
                "</ul></font></li>" +
                "<li><font color='#10d010'>The overview is located on the user details panel, and can also be reached using a new button on the right side (if one has not already choosen between the various traits) </font></li>" +
                "</ul>" +
                "</div>";

            //Tab 5 Content
            $("#ChangelogScreenContent").html(change0024 + change0023 + change0022 + change0021 + change0020 + change0019 + change0018 + change0017 + change0016 + change0015 + change0014 + change0013 + change0012 + change0011 + change0010 + change0009 + change0008 + change0007 + change0006 + change0005 + change0004 + change0003 + change0002 + change0001);
            

            //Main Menu (except the 4 toggled boxes in the user line)
            $("#Settings").html(this.settings);
            $("#About").html(this.About);
            $("#Gallery").html(this.Gallery);
            $("#Changelog").html(this.Changelog);
            $("#Logout").html(this.MULEXIT);
          
            //Screens:

            //Login Screen
            $("#LoginScreenTitle").text(this.MULLOGIN);
            $("#username").attr("placeholder", this.MULNAME);
            $("#password").attr("placeholder", this.MULPASSWORD);
            $("#loginButton").val(this.MULBUTTON);
            $("#MULREMEMEBER").html(this.MULREMEMEBER);
            $("#loginFail").html(this.LoginFailed);
            $("#ForgotPassword").html(this.ForgotPassword);
            $("#recoveryButton").val(this.RecoveryButton);
           

            //Register Screen
            $("#RegisterScreenTitle").text(this.CreateAccountTitle);
            $("#registerNameText").text(this.RegisterName);
            $("#registerPasswordText").text(this.RegisterPW);
            $("#registerEmailText").text(this.RegisterEmail);
            $("#registerIngameNameText").text(this.RegisterInGame);
            $('#RegisterScreen .yesButton span').text(this.ButtonOK);
            
            //Join Game Screen
            $("#JoinGameScreenTitle").text(this.chooseGame);
            var that = this;
            $(".gcs").each(function (_index: number, _elem: Element) {
                var gameStatus = $(_elem).data("gstat");
                switch (gameStatus) {
                    case 0: $(_elem).text(that.gamesCS); break;
                    case 1: $(_elem).text(that.gamesStartAt); break;
                    case 2: $(_elem).text(that.gamesStarted); break;
                    case 3: $(_elem).text(that.gamesRunning); break;
                    case 4: $(_elem).text(that.gamesFinished); break;
                }
            });
            $(".LoginToGame").val(this.MULLOGIN);
            $(".RegisterToGame").val(this.registerGame);


            //SettingsScreen
            $("#SettingsScreenTitle").text(this.settings);
            $(".sn").text(this.RegisterName);            
            $(".sop").text(this.settingsOldPW);
            $(".snp").text(this.settingsNewPassword);
            $(".srnp").text(this.settingsNewPasswordRepeat);
            $(".semail").text(this.RegisterEmail);
            $(".sin").text(this.RegisterInGame);
            $(".sdc").text(this.settingsDeleteCookie);
            $(".sdac").text(this.settingsDeleteAllCookies);
            $(".sbd").text(this.settingsDelete);
            $(".help span").text(this.settingsHelp);

            $("#SettingsScreen button.yesButton span").text(this.ButtonOK);

            $(".StartRegion").text(this.StartingRegion);            
            $("#PlayersInRegion").text(this.PlayersInRegion);     


            //AboutScreen
            $("#AboutScreenTitle").text(this.Empires);
            $("#AboutScreenContent").html(this.AboutText);

            //GalleryScreen
            $("#GalleryScreenTitle").text(this.Gallery);

            //ChangelogScreen
            $("#ChangelogScreenTitle").text(this.Changelog);
        
            
            //Password Recovery:
            $("#RecoveryScreenTitle").text(this.recoveryTitle);
            $("#RecoveryKey").attr("placeholder", this.recoveryKey);
            $("#NewPassword").attr("placeholder", this.recoveryNewPassword);
            $("#NewPasswordRepeat").attr("placeholder", this.recoveryNewPasswordPassword);
            $("#RecoverySend").val(this.recoverySend);
           

            //Dev Screen
            $("#DevScreenTitle").text(this.PasswordResetTitle);
            $("#DevScreenContent").html(this.PasswordResetContent);
          



            /*
            $("#MULNAME").html(this.MULNAME);
            $("#MULPASSWORD").html(this.MULPASSWORD);
                               
            $("#demoLogin1 span").text( this.TRYDEMO);
            $("#demoLogin2 span").text(this.TRYDEMO);
           

            $("#demoCaption1").html(this.DemoCaption1);
            $("#demoCaption2").html(this.DemoCaption2);
            
            //change labels of the settings panel
            
            
            $(".gusp").text(this.gamesPlayers);
            $(".guspo").text(this.gamesPlayersOf);
            */
            

            this.setUserButtons(loggedIn);
                       
            //console.log(this.TRYDEMO);
        }

        languageIndex(languageName) {
            for (var i = 0; i < this.languages.length; i++) {
                if (this.languages[i] && this.languages[i].language == languageName) return i;
            }
            return -1;
        }


        //changed all labels to the current language
        setLanguageSpecificLabels(languageName, loggedIn = false) {

            //console.log("SetLanguage.setLanguageSpecificLabels " + languageName + " " + loggedIn);

            if (loggedIn === null) {
                if ("pageIndex" in window) {
                    loggedIn = pageIndex.user != null;
                }
            }

            var languageIndex = this.languageIndex(languageName);
            if (languageIndex == -1) return;
            EmpiresIndex.currentLang = languageName;

            var language = this.languages[languageIndex];

            this.MUICAPTION = language.MUICAPTION;

            this.TAB2H = language.TAB2H;
            this.TAB3H = language.TAB3H;
            this.TAB4H = language.TAB4H;
            this.TAB5H = language.TAB5H;
           
            this.RegisterHeader = language.RegisterHeader;
            this.ButtonRegister = language.ButtonRegister;

            
            this.MULEXIT = language.MULEXIT;
                       
            this.MUITESTDEMO = language.MUITESTDEMO;
            this.MUIDEMORESET = language.MUIDEMORESET;
            this.MUINEWGAME = language.MUINEWGAME;
            this.HEADERLANGUAGE = language.HEADERLANGUAGE;
            this.MULREMEMEBER = language.MULREMEMEBER;
            this.MULBUTTON = language.MULBUTTON;

            this.tabDescription = language.tabDescription;
            this.tabScreenShots = language.tabScreenShots;
            this.tabForum = language.tabForum;
            this.tabPay2Win = language.tabPay2Win;

            this.TRYDEMO = language.TRYDEMO;
           
            

            this.DemoCaption1 = language.DemoCaption1;
            this.DemoCaption2 = language.DemoCaption2;

            this.ButtonOK = language.ButtonOK;
            this.ButtonCancel = language.ButtonCancel;

            
         
            


            this.gamesCS = language.gamesCS;
            this.gamesStartAt = language.gamesStartAt;
            this.gamesStarted = language.gamesStarted;
            this.gamesRunning = language.gamesRunning;
            this.gamesFinished = language.gamesFinished;
            this.gamesPlayers = language.gamesPlayers;
            this.gamesPlayersOf = language.gamesPlayersOf;


            this.rules = language.rules;
            this.rulesFor = language.rulesFor;
            this.registerGame = language.registerGame;
            this.description1 = language.description1;

            this.Continue = language.Continue;
            this.JoinGame = language.JoinGame;       
            this.CreateAccount = language.CreateAccount;
         



            //Menu
            this.MULLOGIN = language.MULLOGIN;
            this.Continue = language.Continue;
            this.JoinGame = language.JoinGame;
            this.CreateAccount = language.CreateAccount;
            
            this.settings = language.settings;
            this.About = language.About;
            this.Gallery = language.Gallery;
            this.Changelog = language.Changelog;
            

            //Screens:
            //Login Screen
            this.MULLOGIN = language.MULLOGIN;
            this.MULNAME = language.MULNAME;
            this.MULPASSWORD = language.MULPASSWORD;

            this.LoginFailed = language.LoginFailed;
            this.ForgotPassword = language.ForgotPassword;
            this.RecoveryButton = language.RecoveryButton;

            //Register Screen
            this.CreateAccountTitle = language.CreateAccountTitle;
            this.RegisterName = language.RegisterName;
            this.RegisterPW = language.RegisterPW;
            this.RegisterEmail = language.RegisterEmail;
            this.RegisterInGame = language.RegisterInGame;

            
            this.registerNameError = language.registerNameError;
            this.registerNameError2 = language.registerNameError2;
            this.registerEmailError = language.registerEmailError;
            this.registerEmailError2 = language.registerEmailError2;
            this.registerCaptchaError = language.registerCaptchaError;


            //Password Recovery:

            this.recoveryTitle = language.recoveryTitle;
            this.recoveryKey = language.recoveryKey;
            this.recoveryNewPassword = language.recoveryNewPassword;
            this.recoveryNewPasswordPassword = language.recoveryNewPasswordPassword;
            this.recoverySend = language.recoverySend;

            this.recoveryEmailSent = language.recoveryEmailSent;
            this.recoveryEmailUnknown = language.recoveryEmailUnknown;
            this.recoveryEmailFailure = language.recoveryEmailFailure;


            this.recoveryFailure = language.recoveryFailure;
            this.recoveryPasswordMismatch = language.recoveryPasswordMismatch;
            this.recoveryHashError = language.recoveryHashError;
            this.recoverySuccess = language.recoverySuccess;

            //Join Game Screen
            this.chooseGame = language.chooseGame;

            //SettingsScreen
            this.settingsPWRepeatError = language.settingsPWRepeatError;
            this.settingsPWwrong = language.settingsPWwrong;
            this.settingsOldPW = language.settingsOldPW;
            this.settingsNewPassword = language.settingsNewPassword;
            this.settingsNewPasswordRepeat = language.settingsNewPasswordRepeat;
            this.settingsDeleteCookie = language.settingsDeleteCookie;
            this.settingsDeleteAllCookies = language.settingsDeleteAllCookies;
            this.settingsDelete = language.settingsDelete;
            this.settingsHelp = language.settingsHelp;
            this.MULEXIT = language.MULEXIT;

            this.settingsStartRegionHelp = language.settingsStartRegionHelp;
            this.SettingsScreenStartRegionCountHelp = language.SettingsScreenStartRegionCountHelp;
            this.StartingRegion = language.StartingRegion;
            this.PlayersInRegion = language.PlayersInRegion;

            //AboutScreen
            this.Empires = language.Empires;
            this.AboutText = language.AboutText;
            //ChangelogScreen


            //HelpScreen
            this.registerNameHelp = language.registerNameHelp;
            this.registerPasswordHelp = language.registerPasswordHelp;
            this.registerEmailHelp = language.registerEmailHelp;

            this.settingsDefaultNameHelp = language.settingsDefaultNameHelp;
            this.settingsDeleteCookieHelp = language.settingsDeleteCookieHelp;
            this.settingsDeleteAllCookiesHelp = language.settingsDeleteAllCookiesHelp;

            //Password Reset Email
            this.PasswordResetTitle = language.PasswordResetTitle;
            this.PasswordResetContent = language.PasswordResetContent;


            this.setLabels(loggedIn);
        }

        //if language was already loaded, switches to that language, lese loads and then switches
        loadAndSwitch(languageName, loggedIn = false) {

            //console.log("SetLanguage.loadAndSwitch " + languageName + " " + loggedIn);

            if (this.languageIndex(languageName) > -1) {
                this.setLanguageSpecificLabels(languageName, loggedIn);
                return;
            }

            //console.log("SetLanguage.loadAndSwitch LOAD LANGUAGE" + languageName + " " + loggedIn);

            //load the language and switch then:
            var head = document.getElementsByTagName("head")[0];
            var s = <HTMLScriptElement> document.createElement("script");
            s.src = i18nPath + "/" + languageName + ".js?ver=" + <any>version;
            //if (s.src.length > 5) s.src = "i18n/" + languageName;
            head.appendChild(s); //switch is included in the source
        }
    }
}