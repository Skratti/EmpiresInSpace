<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="SpacegameIndex.index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Empires in Space</title>
    <meta name="description" content="A huge universe awaits to be explored and settled by thousands of players in this 4X massive multiplayer online space strategy game" />
    <meta name="keywords" content="massive multiplayer online space strategy game 4X Civilization" />
    <meta name="google-site-verification" content="AYIg29aekWbpor7fC5E7OzGXGWuGIoe3CiNtiky3JBg" />

    <meta http-equiv="cache-control" content="no-cache, must-revalidate, post-check=0, pre-check=0" />
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />

    <link rel="apple-touch-icon" sizes="57x57" href="images/favicon/apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="images/favicon/apple-touch-icon-60x60.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="images/favicon/apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="images/favicon/apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="images/favicon/apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="images/favicon/apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="images/favicon/apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="images/favicon/apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon-180x180.png" />
    <link rel="icon" type="image/png" href="images/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="images/favicon/favicon-194x194.png" sizes="194x194" />
    <link rel="icon" type="image/png" href="images/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="images/favicon/android-chrome-192x192.png" sizes="192x192" />
    <link rel="icon" type="image/png" href="images/favicon/favicon-16x16.png" sizes="16x16" /> 
    <link rel="mask-icon" href="images/favicon/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#2b5797" />
    <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, minimum-scale=1" />    
    <link rel="canonical" href="http://www.EmpiresInSpace.com" />


    <link href="index.css?v=<%Response.Write(versionString());%>" media="all" rel="Stylesheet" type="text/css" />
    <link rel="stylesheet" href="swipebox/css/swipebox.css" />
    <link rel="stylesheet" href="MediaCSS/index_619.css?version=<%= "" + versionString() %>" media="(min-width: 0px) and (max-width: 619px)" />
    <link rel="stylesheet" href="MediaCSS/index620_799.css?version=<%= "" + versionString() %>" media="(min-width: 620px) and (max-width: 799px)" />

    <%Response.Write(userLanguage());%>
    <%Response.Write(setJSversionString());%>    
    <%Response.Write(recaptchaPublicString());%>

    <script type="text/javascript" src="//code.jquery.com/jquery-2.0.3.min.js"></script>
    
    <!--<script type="text/javascript" src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>  
    <script src="https://www.google.com/recaptcha/api.js?render=6LeJYPoSAAAAAK6ouXJLTGfFvybgqivmzlHJgOQs"></script> -->
    
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    
    <script type="text/javascript" src="swipebox/js/jquery.swipebox.js"></script>

      
    <script type="text/javascript">i18nPath = 'i18n';</script>
    <script type="text/javascript" src="i18n/setLanguage.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/objects.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/index.js?version=<%Response.Write(versionString());%>"></script>
        
   <!--   
   <script type="text/javascript">i18nPath = 'compiled';</script>
   <script type="text/javascript" src="compiled/main.js?version=<%Response.Write(versionString());%>"></script>
   -->
   
     
  

</head>
<body>
    <div id="SpaceBackground"></div>
    
    <div id="Top">
        <div id="newLanguageSelect" class="styled-select selectorColor">
            <select id="languageSelector">
                <option value="en">English</option>
                <option value="de">Deutsch</option>
            </select>           
        </div>
    </div>

    

    <noscript>
      <div style="border: 1px solid purple; padding: 10px">
        <span style="color:white">JavaScript seems to be disabled. I'm awfully sorry, but this game wuns with JavaScript on the client side. It won't work without. Even this login site uses javascript to display and hide elements...</span>
      </div>
    </noscript>
    
    <div id="BodyContainer">
        <div class="ScreenTopSpace"></div>
        <div id="MainMenu">            
            <div id="Logo"></div>
            
            <div id="MainMenuRight">                         
                <div id="UserLine">
                    <div id="Login" class="MainMenuEntry NormalBackground">Login</div>
                    <div id="LoginSpacer"></div>
                    <div id="NewAccount" class="MainMenuEntry NormalBackground">
                        Create
                        <br>
                        New Account
                    </div>
                </div>

                <div id="Settings" class="MainMenuEntry TextDisabled NormalBackground MainMenuFullLine">Settings</div>
                <div id="About" class="MainMenuEntry NormalBackground MainMenuFullLine">About</div>
                <div id="Gallery" class="MainMenuEntry NormalBackground MainMenuFullLine">Gallery</div>     
                <div id="Forum" class="MainMenuEntry NormalBackground MainMenuFullLine"><a target="_blank" href="https://www.empiresinspace.com/Forum">Forum</a></div>                    
            </div>
                
        </div>
        
        <div id="LoginScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="LoginScreenTitle" class="ScreenTitle">Login</div>
                <div id="mainUpperLogin">
                    <div id="loginArea" class="margin20">

                        <form action method="post" id="loginForm">

                            <input id="username" placeholder="Name" name="username" maxlength="15" class="input_text" autofocus="autofocus" tabindex="1" />
                            <input id="password" placeholder="Password" name="password" type="password" class="input_text" maxlength="20" tabindex="2" />
                            <input id="loginButton" class="big-yellow-button ui-ib" type="submit" name="image-submit" value="Login" />
                            <input type="hidden" id="loginData" name="loginData" value="" />
                            <div class="input_text">
                                <span>
                                    <span id="MULREMEMEBER">Autologin</span>
                                    <input type="checkbox" id="rememberCheckBox" />
                                </span>
                            </div>
                        </form>


                        <p id="loginFail">Login failed!</p>
                    </div>
                </div>
                <a id="ForgotPassword">Passwort vergessen</a><br>
                <br>
                <div id="ForgotForm">
                    <form id="recoveryForm">
                        <input type="hidden" name="forgotPassword" value="1">
                       
						<span >E-Mail:</span><br />
						<input id='recoveryEmail' class="text" type="text" name="pw_email" value=""><br><br>
						<div class="RecoveryMailError"></div>
                        <div id="reCapInput2"></div><br>
                        <input id="recoveryButton" class="big-yellow-button ui-ib" type="submit" name="image-submit" value="Passwort anfordern" />
						
                    </form>
                    <p id="PasswordResetRequest">Login failed!</p>
                </div>

                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="RegisterScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="RegisterScreenTitle" class="ScreenTitle">Anmelden</div>
                <div class="popupBody panelBody">
                    <table>
                        <tbody>
                            <tr>
                                <td><span id="registerNameText">Name </span></td>
                                <td class="tdAlignRight">
                                    <input id="registerName" name="username" class="input_text" type="text" value=""></td>
                                <td>
                                    <button id="registerNameHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                            </tr>
                            <tr>
                                <td><span id="registerPasswordText">Password </span></td>
                                <td class="tdAlignRight">
                                    <input id="registerPassword" name="password" class="input_text" type="password" value=""></td>
                                <td>
                                    <button id="registerPasswordHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                            </tr>
                            <tr>
                                <td><span id="registerEmailText" class="semail">Email </span></td>
                                <td class="tdAlignRight">
                                    <input id="registerEmail" class="input_text" type="text" value=""></td>
                                <td>
                                    <button id="registerEmailHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                            </tr>
                            <tr>
                                <td><span id="registerIngameNameText">Name to show in the game </span></td>
                                <td class="tdAlignRight">
                                    <input id="defaultInGameName" class="input_text" type="text" value=""></td>
                                <td>
                                    <button id="registerIngameNameHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="min-height: 17px;"><span id="errorSpan" style="font-weight: bolder; color: red; display: block;"></span></div>
                    <div class="g-recaptcha" data-sitekey="6LeJYPoSAAAAAK6ouXJLTGfFvybgqivmzlHJgOQs"></div>
                    <!--
                    <div id="reCapInput"></div>
                    -->
                </div>
                <div class="BottomButtons">
                    <button class="yesButton Right"><span>Create an account</span></button>
                </div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>
        
        <div id="JoinGameScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="JoinGameScreenTitle" class="ScreenTitle">Spielwelt auswählen</div>
                <div id="JoinGameScreenGames"></div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="JoinGameDescriptionScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="JoinGameDescriptionScreenTitle" class="ScreenTitle">Spielwelt auswählen</div>
                <div id="JoinGameDescriptionContent"></div>
                
                <table style="display:none">
                    <tr>
                        <td><span class="StartRegion">Starting region</span></td>
                        <td class="tdAlignRight"><input id="SettingsScreenStartRegionJoin" class="input_text" type="text" value=""/></td>
                        <td><button class="help SettingsScreenStartRegionHelp" role="button" aria-disabled="false"><span>?</span></button></td>
                    </tr>

                    <tr>
                        <td><span id="PlayersInRegion">Players in that region</span></td>
                        <td class="tdAlignRight"><span id="PlayersInRegionCount">?</span></td>
                        <td><button class="help SettingsScreenStartRegionCountHelp" role="button" aria-disabled="false"><span>?</span></button></td>
                    </tr>

                </table>
                
                <div class="BottomButtons">
                    <button class="yesButton Right"><span>Create an account</span></button>
                </div>
                <div class="window-close-wraper"><a href="javascript:void($('#JoinGameDescriptionScreen').css('display','none'));" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="SettingsScreen" class="Screen">           
            <div class="ScreenRight NormalBackground">
                <div id="SettingsScreenTitle" class="ScreenTitle">Options</div>
                <table>
                    <tbody>
                        <tr>
                            <td><span class="sn">Name </span></td>
                            <td><span id="SettingsScreenRegisterName" name="username" class="input_text nameSpan"></span></td>
                        </tr>
                        <!--
                        <tr>
                            <td><span class="scl">Language</span></td>
                            <td  class="tdAlignRight styled-select selectorColor semi-square">
                                <select id="SettingsScreenLangInput">
                                    <option value="en">English</option>
                                    <option value="de">Deutsch</option>
                                </select></td>
                        </tr>
                        -->
                        <tr>
                            <td><span class="sop">Password</span></td>
                            <td class="tdAlignRight"><input id="SettingsScreenRegisterPassword" name="password" class="input_text" type="password" value=""></td>
                        </tr>
                        <tr id="SettingsPasswordMissing">
                            <td></td>
                            <td>Missing or wrong Password</td>
                        </tr>
                        <tr>
                            <td><span class="snp">New password</span></td>
                            <td class="tdAlignRight">
                                <input id="SettingsScreenNewRegisterPassword" name="password" class="input_text" type="password" value=""></td>
                        </tr>
                        <tr>
                            <td><span class="srnp">Repeat new password</span></td>
                            <td class="tdAlignRight">
                                <input id="SettingsScreenNewRepeatRegisterPassword" name="password" class="input_text" type="password" value=""></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><span class="semail">Email </span></td>
                            <td class="tdAlignRight">
                                <input id="SettingsScreenRegisterEmail" class="input_text" type="text" value=""></td>
                        </tr>
                        <tr>
                            <td><span class="sin">Name to show in the game </span></td>
                            <td class="tdAlignRight">
                                <input id="SettingsScreenDefaultInGameName" class="input_text" type="text" value=""></td>
                            <td>
                                <button id="SettingsScreenIngameHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                        </tr>

                        <tr  style="display:none">
                            <td><span class="StartRegion">Starting region</span></td>
                            <td class="tdAlignRight">
                                <input id="SettingsScreenStartRegion" class="input_text" type="text" value=""></td>
                            <td>
                                <button  class="help SettingsScreenStartRegionHelp" role="button" aria-disabled="false"><span>?</span></button></td>
                        </tr>

                        <tr>
                            <td><span class="sdc">Delete cookie</span></td>
                            <td class="tdAlignRight">
                                <button id="SettingsScreenDeleteCookie" class="userSettings sbd" role="button" aria-disabled="false"><span>Delete...</span></button></td>
                            <td>
                                <button id="SettingsScreenDeleteCookieHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                        </tr>
                        <tr>
                            <td><span class="sdac">Delete all cookies</span></td>
                            <td class="tdAlignRight">
                                <button id="SettingsScreenDeleteAllCookie" class="userSettings sbd" role="button" aria-disabled="false"><span>Delete...</span></button></td>
                            <td>
                                <button id="SettingsScreenDeleteAllCookieHelp" class="help" role="button" aria-disabled="false"><span>?</span></button></td>
                        </tr>
                    </tbody>
                </table>
                <span class="errorSpan" style="font-weight: bolder; color: red; display: block;"></span>
                <a id="Logout">Log out</a>
                <div class="BottomButtons">
                    <button class="yesButton Right"><span>Update</span></button>
                </div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="AboutScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="AboutScreenTitle" class="ScreenTitle">Change</div>
                <div id="AboutScreenContent">
                    Turnbased 4X Space Strategy
                    <br />
                    The well known 4X Features (Explore,Expand, Exploit, Exterminate), a tech tree, ship designer and goods all available now in a turn based Massive Multiplayer Online title.
                    <br />
                    <br />
                    Turn evaluations are done every 4 hours, with all values stacking up for multiple turns.<br />
                    Balanced out so that a single login per day might suffice in times of peace.<br />
                    <br />
                    And there are (of course) no pay2win features included... 
                </div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="GalleryScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="GalleryScreenTitle" class="ScreenTitle">Gallerie</div>
                <div id="GalleryScreenImages">
                    <a href="images/Gallery/StarmapBig.png"  class="swipebox" title=""><img src="images/Gallery/StarmapBig.png" alt=""/></a>
                    <a href="images/Gallery/SystemmapBig.png"  class="swipebox" title=""><img src="images/Gallery/SystemmapSmall.png" alt=""/></a>
                    <a href="images/Gallery/ColonyBig.png"  class="swipebox" title=""><img src="images/Gallery/ColonySmall.png" alt=""/></a>
                    <a href="images/Gallery/ResearchBig.png"  class="swipebox" title=""><img src="images/Gallery/ResearchSmall.png" alt=""/></a>
                    <a href="images/Gallery/DesignerBig.png"  class="swipebox" title=""><img src="images/Gallery/DesignerSmall.png" alt=""/></a>                    
                </div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="ChangelogScreen" class="Screen">            
            <div class="ScreenRight NormalBackground">
                <div id="ChangelogScreenTitle" class="ScreenTitle">Change</div>
                <div id="ChangelogScreenContent"></div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>

        <div id="HelpScreen" class="Screen">           
            <div class="ScreenRight NormalBackground">
                <span>HelpScreen</span>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseHelp());" class="window-close">&#10005</a></div>
            </div>
        </div>
        
        <div id="DevScreen" class="Screen">           
            <div class="ScreenRight NormalBackground">
                <div id="DevScreenTitle" class="ScreenTitle">Dev</div>
                <div id="DevScreenContent">                    
                </div>
                <div class="window-close-wraper"><a href="javascript:void(pageIndex.CloseScreens());" class="window-close">&#10005</a></div>
            </div>
        </div>
    </div>
    
    <div class="closure">
        © 2020
			<a href="impressum/impressum.html" target="_blank">Impressum</a>
        · <a href="impressum/Datenschutz.html" target="_blank">Datenschutz</a>
        · <a href="javascript:void(pageIndex.openChangelog());" id="Changelog">Changelog</a>
    </div>
    
</body>
</html>
