<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Recovery.aspx.cs" Inherits="SpacegameIndex.Recovery" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Empires in Space Password recovery</title>
    <meta name="description" content="A huge universe awaits to be explored and settled by thousands of players in this 4X massive multiplayer online space strategy game" />
    <meta name="keywords" content="massive multiplayer online space strategy game 4X Civilization">
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
    <link rel="stylesheet" type="text/css" href="index.css?version=<%Response.Write(versionString());%>" />   
    <link rel="stylesheet" href="swipebox/css/swipebox.css">

    <%Response.Write(setJSversionString());%>
    <%Response.Write(userLanguage());%>
    <script type="text/javascript" src="//code.jquery.com/jquery-2.0.3.min.js"></script>


    <script type="text/javascript">i18nPath = 'i18n';</script>
    <script type="text/javascript" src="i18n/setLanguage.js?version=<%Response.Write(versionString());%>"></script>
    <script type="text/javascript" src="index/recovery.js?version=<%Response.Write(versionString());%>"></script>
</head>

<body>
    <div id="SpaceBackground"></div>
    
    <div id="Top">
        <div id="newLanguageSelect" class="styled-select selectorColor semi-square">
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
        
        <div id="LoginScreen" class="Screen" style="display:block">
            <div class="ScreenTopSpace"></div>
            <div class="ScreenRight NormalBackground">
                <div id="RecoveryScreenTitle" class="ScreenTitle">Password Recovery</div>
                <div id="mainUpperLogin">
                    <div id="loginArea" class="margin20">

                        <form action method="post" id="recoveryForm">
                            <input id="RecoveryKey" placeholder="Enter key from email" name="username" maxlength="50" class="input_text" autofocus="autofocus" tabindex="4" value="<%Response.Write(RecoveryInput());%>" &#32; <%Response.Write(RecoveryKeyDisabled());%> &#32; <%Response.Write(RecoveryKeyHidden());%> />
                            <input id="NewPassword" placeholder="New Password" name="password" type="password" class="input_text" maxlength="20" tabindex="1" />
                            <input id="NewPasswordRepeat" placeholder="Repeat New Password" name="password" type="password" class="input_text" maxlength="20" tabindex="2" />
                            <div id="RecoveryBox"><input id="RecoverySend" class="big-yellow-button ui-ib" type="submit" name="image-submit" value="Set new Password" tabindex="3" />  </div>                          
                        </form>  
                        <p ><span id="RecoveryFailed" style="display:none">Login failed!</span><span id="RecovereyRedirectCounter"></span></p>                   
                    </div>
                </div>                
            </div>
        </div>
              
    </div>
    <div class="closure">
        © 2016
			<a href="impressum/impressum.html" target="_blank">Impressum</a>
        · <a href="impressum/Datenschutz.html" target="_blank">Datenschutz</a>
        · <a href="https://plus.google.com/111073768098119726535" rel="publisher">Google+</a>
        <!--· <a href="impressum/impressum.html" target="_blank">AGB</a>-->
    </div>

</body>
</html>
