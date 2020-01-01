<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="IndexOld.aspx.cs" Inherits="SpacegameIndexOld.index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Empires in Space</title>
    <meta Name="description" content="A huge universe awaits to be explored and settled by thousands of players in this 4X massive multiplayer online space strategy game" />
    <meta name="keywords" content="4X Space Strategy MMO Civilization Universe Game">
    <meta name="google-site-verification" content="AYIg29aekWbpor7fC5E7OzGXGWuGIoe3CiNtiky3JBg" />
    


    <link rel="apple-touch-icon" sizes="57x57" href="images/favicon/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="images/favicon/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="images/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="images/favicon/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="images/favicon/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="images/favicon/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="images/favicon/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="images/favicon/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="images/favicon/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="images/favicon/favicon-194x194.png" sizes="194x194">
    <link rel="icon" type="image/png" href="images/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="images/favicon/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="images/favicon/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="images/favicon/manifest.json">
    <link rel="mask-icon" href="images/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png">
    <meta name="theme-color" content="#ffffff">






    <link rel="canonical" href="http://www.EmpiresInSpace.com" />
    <link rel="stylesheet" type="text/css" href="Login.css?version=<%Response.Write(versionString());%>" /> 
    <link rel="stylesheet" type="text/css" href="generatedElements.css?version=<%Response.Write(versionString());%>" />  
    <link rel="stylesheet" href="jQuery/jquery-ui-1.10.3.custom.css" />  
    
    <%Response.Write(userLanguage());%>
    <%Response.Write(setJSversionString());%>
    <%Response.Write(recaptchaPublicString());%>
    <script type="text/javascript" src="//code.jquery.com/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>

    <script type="text/javascript" src="jQuery/jquery-ui-1.10.3.custom.min.js"></script>

     
    <script type="text/javascript">i18nPath = 'i18n';</script>
    <script type="text/javascript" src="i18n/setLanguage.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/objects.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/index.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/ElementGenerator.js?version=<%Response.Write(versionString());%>"></script>
  <!--
   
    <script type="text/javascript">i18nPath = 'compiled';</script>
    <script type="text/javascript" src="compiled/main.js?version=<%Response.Write(versionString());%>"></script>
      -->


</head>
<body> 
    
    <div id="openingLoader" style="width: 100%; height: 100%; z-index: 2000;position:absolute;background-color:black;color:white"> Wenn du dies siehst baut sich die Seite entweder sehr langsam auf, oder du hast Javascript deaktiviert. - If you see this, you have javascript deactivatend in your browser, or the page is loaded really slowly...<br /> Visit the forum http://www.empiresinspaceforum.de/ </div>
    <div id="loader" onclick="document.getElementById('loader').setAttribute('style', 'display:none;')"></div>    
    <div id="mainBackGround">
        <div id="main">
            <div id="mainUpper">
                <div id="tabs" class="style-tabs">
                    <ul id="tabUl">
                        <li><a href="#tabs-1" id="tab1H"></a></li>
                        <li><a href="#tabs-2" id="tab2H"></a></li>
                        <!--<li><a href="#tabs-3" id="tab3H"></a></li>-->
                        <li><a href="#tabs-4" id="tab4H"></a></li>
                        <li><a href="#tabs-5" id="tab5H"></a></li> 
                    </ul>
                    <div id="tabs-1">                        
                        <div id="newLanguageSelect">    
                            <!--<span id="languageSelectorDescription">Sprache:</span>  -->
                            <select id="languageSelector">
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>                                
                            </select>
                            <ul>      
                                <li id="settingsList"></li>                                      
				            </ul>
                        </div>
                        <div id="mainUpperInfo">                                    
                            <p id="mainUpperInfoTestDemo"></p>                                      
                        </div>
                                                             
                    </div>
                    <div id="tabs-2">
                        
                    </div><!--
                    <div id="tabs-3">
                        
                    </div>-->
                    <div id="tabs-4">
                                               
                    </div>
                    
                    <div id="tabs-5">
                        
                    </div>             
                </div>                   
            </div>
            
            <div id="mainGames">
                <div id="mainGamesDemo">
                    <div id="mainUpperLogin">
                        <div id="loginArea" class="margin20">
                                                        
                            <form action method="post" id="loginForm">
                            
                                <input id="username" placeholder="Name" name="username" maxlength="15" class="input_text" autofocus="autofocus" tabindex="1"/>
                                <input id="password" placeholder="Password" name="password" type="password" class="input_text" maxlength="20" tabindex="2"/>                                                                                
                                <input id="loginButton" class="big-yellow-button ui-ib" type="submit" name="image-submit" value="Login"/>
                                <input type="hidden" id="loginData" name="loginData" value=""/>
                                <div class="input_text">
                                    <span>
                                        <span id="MULREMEMEBER">Autologin</span>
                                        <input type="checkbox" id="rememberCheckBox" />                                                        
                                    </span>
                                </div>
                            </form>

                           
                            <p id="loginFail">Login failed!</p>
                            <div>
                                <p id="registerHead">Noch nicht dabei? Hier registrieren:</p>
                                <div id="mainRegister">
                                    <button id="registerButton" class="registerButton"><span id="ButtonRegister">Anmelden</span></button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="ui-widget blog"><span>Developer blog and feature discussions are <a href="http://empiresinspace.blogspot.de/">here</a></span></div>
                <div id="logout" class="blog">
                    <button id="logoutButton">Logout</button>
                </div>
                <div id="mainGamesSelection"></div>               
            </div>                                         
        </div>
        <div class="closure">
				© 2014
				<a href="impressum/impressum.html" target="_blank">Impressum</a>
				· <a href="impressum/Datenschutz.html" target="_blank">Datenschutz</a>
                · <a href="https://plus.google.com/111073768098119726535" rel="publisher">Google+</a>
				<!--· <a href="impressum/impressum.html" target="_blank">AGB</a>-->
        </div>
    </div>
</body>
</html>
