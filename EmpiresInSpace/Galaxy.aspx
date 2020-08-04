<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Galaxy.aspx.cs" Inherits="EmpiresInSpace.Galaxy" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 2.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
  

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
    <link rel="mask-icon" href="images/favicon/safari-pinned-tab.svg" />
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png">
    <meta name="theme-color" content="#ffffff">

    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, minimum-scale=1" />

    <link rel="stylesheet" href="css/game.css?version=<%= "" + this.versionString() %>" /> 
    <link rel="stylesheet" href="css/gamePanels.css?version=<%= "" + versionString() %>" />
    <link rel="stylesheet" href="css/generatedElements.css?version=<%= "" + versionString() %>" />
    <link rel="stylesheet" href="css/DarkUI.css?version=<%= "" + versionString() %>" />


    <link rel="stylesheet" href="css/MediaCSS/gameMedia000_683.css?version=<%= "" + versionString() %>" media="max-width: 683px" />
    <link rel="stylesheet" href="css/MediaCSS/gameMedia684_719.css?version=<%= "" + versionString() %>" media="(min-width: 684px) and (max-width: 719px)" />
    <link rel="stylesheet" href="css/MediaCSS/gameMedia720_730.css?version=<%= "" + versionString() %>" media="(min-width: 720px) and (max-width: 730px)" />
    <link rel="stylesheet" href="css/MediaCSS/gameMedia731_739.css?version=<%= "" + versionString() %>" media="(min-width: 731px) and (max-width: 739px)" />
    <link rel="stylesheet" href="css/MediaCSS/gameMedia740_799.css?version=<%= "" + versionString() %>" media="(min-width: 740px) and (max-width: 799px)" />

    <link rel="stylesheet" href="css/MediaCSS/gamePanelsMedia000_683.css?version=<%= "" + versionString() %>" media="max-width: 683px" />
    <link rel="stylesheet" href="css/MediaCSS/gamePanelsMedia684_719.css?version=<%= "" + versionString() %>" media="(min-width: 684px) and (max-width: 719px)" />
    <link rel="stylesheet" href="css/MediaCSS/gamePanelsMedia720_730.css?version=<%= "" + versionString() %>" media="(min-width: 720px) and (max-width: 730px)" />
    <link rel="stylesheet" href="css/MediaCSS/gamePanelsMedia731_739.css?version=<%= "" + versionString() %>" media="(min-width: 731px) and (max-width: 739px)" />
    <link rel="stylesheet" href="css/MediaCSS/gamePanelsMedia740_799.css?version=<%= "" + versionString() %>" media="(min-width: 740px) and (max-width: 799px)" />

    <link rel="stylesheet" href="css/MediaCSS/generatedElementsMedia000_683.css?version=<%= "" + versionString() %>" media="max-width: 683px" />
    <link rel="stylesheet" href="css/MediaCSS/generatedElementsMedia684_719.css?version=<%= "" + versionString() %>" media="(min-width: 684px) and (max-width: 719px)" />
    <link rel="stylesheet" href="css/MediaCSS/generatedElementsMedia720_730.css?version=<%= "" + versionString() %>" media="(min-width: 720px) and (max-width: 730px)" />
    <link rel="stylesheet" href="css/MediaCSS/generatedElementsMedia731_739.css?version=<%= "" + versionString() %>" media="(min-width: 731px) and (max-width: 739px)" />
    <link rel="stylesheet" href="css/MediaCSS/generatedElementsMedia740_799.css?version=<%= "" + versionString() %>" media="(min-width: 740px) and (max-width: 799px)" />

    <!-- We'll take care of the zoom ourselves 
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    -->
	<!-- iPhone icon + chromeless browser 
	<meta name="apple-mobile-web-app-capable" content="yes" />
    -->
    <!-- Prevent zooming
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, minimal-ui" />
     -->
	<!-- Chrome Frame 
	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
    -->
    
	<title>Empires in Space</title>
    
    
    <% Response.Write(demoSwitch()); %>
    <%Response.Write(setJSversionString());%>
    <%Response.Write(setImageVersionString());%>
    <%Response.Write(setSocketKeyString());%>


    <script type="text/javascript" src="jQuery/jquery-2.0.3.min.js"></script>    
    <script type="text/javascript" src="jQuery/jquery-ui.min.js"></script>
    

   <!-- 
    <script type="text/javascript" src="jQuery/TouchPunch.js"></script>    
       Chrome Frame -->
    <script type="text/javascript" src="jQuery/jquery.mousewheel.js"></script>
    <script type="text/javascript" src="jQuery/jquery.sortElements.js"></script>
    <script type="text/javascript" src="jQuery/jquery.textfill.min.js?version=<%Response.Write(versionString());%>"></script>
    <!--<script type="text/javascript" src="jQuery/jquery-bigtext.js"></script>-->

    <script src="jQuery/jquery.signalR-2.0.2.js"></script>
    <script src="signalr/hubs"></script>

    <link rel="stylesheet" href="jQuery/jquery-ui.min.css" />
    <link rel="stylesheet" href="jQuery/jquery-ui.structure.min.css" />
 <!--   <link rel="stylesheet" href="jQuery/jquery-ui.theme.min.css" />-->
     
   
    
    <!--
    <script type="text/javascript" src="Linq/KeyValuePair.js"></script>
    <script type="text/javascript" src="Linq/DefaultComparer.js"></script>
    <script type="text/javascript" src="Linq/Linq.js"></script>
    <script type="text/javascript" src="Linq/List.js"></script>
    <script type="text/javascript" src="Linq/Dictionary.js"></script>

        <script type="text/javascript" src="Linq/tsLinq.js"></script>


            <script type="text/javascript" src="Linq/KeyValuePair.js"></script>
    <script type="text/javascript" src="Linq/DefaultComparer.js"></script>
    <script type="text/javascript" src="Linq/Linq.js"></script>
    <script type="text/javascript" src="Linq/List.js"></script>
    <script type="text/javascript" src="Linq/Dictionary.js"></script>
    -->
    
      
    
    <% Response.Write(simplePaths()); %>
    <script type="text/javascript" src="js/helpers.js"> </script>

    <script type="text/javascript" src="js/globals.js"> </script>
    <script type="text/javascript" src="js/StarMapQuadTree.js"> </script>
    <script type="text/javascript" src="js/serverEvents.js"> </script>

    <script type="text/javascript" src="js/Labels.js"> </script>
   
    <script type="text/javascript" src="js/RealmStatistics.js"> </script>

    <script type="text/javascript" src="js/BaseData.js"> </script>
    <script type="text/javascript" src="js/KeyMap.js"> </script>
    <script type="text/javascript" src="js/ImageCanvasCache.js"> </script>

    <script type="text/javascript" src="js/mainObject.js"> </script>

    <script type="text/javascript" src="js/Communication.js"> </script>
    <script type="text/javascript" src="js/user.js"> </script>
    <script type="text/javascript" src="js/Alliances.js"> </script>
    <script type="text/javascript" src="js/messages.js"> </script>
    <script type="text/javascript" src="js/CombatMessage.js"> </script>

    <script type="text/javascript" src="js/objects.js"> </script>
    <script type="text/javascript" src="js/Buildings.js"> </script>
    <script type="text/javascript" src="js/colonies.js"> </script>

    <script type="text/javascript" src="js/interface.js"> </script>
    <script type="text/javascript" src="js/userInput.js"> </script>

    <script type="text/javascript" src="js/Diplomacy.js"> </script>
    <script type="text/javascript" src="js/TileMap.js"> </script>
    <script type="text/javascript" src="js/FogOfWar.js"> </script>
    <script type="text/javascript" src="js/ships.js"> </script>
    <script type="text/javascript" src="js/areaData.js"> </script>
    <script type="text/javascript" src="js/ShipTemplates.js"> </script>   
    <script type="text/javascript" src="js/Quests.js"> </script>
    <script type="text/javascript" src="js/TradeOffers.js"> </script>

    <script type="text/javascript" src="js/ElementGenerator.js"> </script>
    <script type="text/javascript" src="js/GoodsTransfer.js"> </script>
    <script type="text/javascript" src="js/Pathfinder.js"> </script>

    <script type="text/javascript" src="js/Scripts/Scripts.js"> </script>

    <script type="text/javascript" src="js/SpaceHub.js"> </script>
    <script type="text/javascript" src="js/GalacticEvents.js"> </script>
    <script type="text/javascript" src="js/Chat.js"> </script>
    <script type="text/javascript" src="js/UserSpecifications.js"> </script>
    <script type="text/javascript" src="js/DialogWindows.js"> </script>

    <script type="text/javascript" src="js/TradeOfferForm.js"></script>
    <script type="text/javascript" src="js/TradeCreateOffer.js"></script>
    <script type="text/javascript" src="js/TradeOffersListPage.js"></script>

    <script type="text/javascript" src="js/BuildModulesForm.js?version=<%Response.Write(versionString());%>"></script> 

    <script type="text/javascript" src="js/gameOnload.js"> </script>
  
  
    
         <!--    
      
    <% Response.Write(compiledPaths()); %>              
    <script type="text/javascript" src="Compiled/main.js?version=<%Response.Write(versionString());%>"></script>         
       -->
</head>
<body oncontextmenu="return false;">
    <!--<form id="form1" runat="server">-->
    <div id="bodyOfAll">
        <div id="loader">
            <div id="progressDYK">
                <progress id="loadingProgressbar" value="10" max="100"></progress>
                <br />
                <br />
                <br />
                <div><%Response.Write(didYouKnow());%></div>
                <div><%Response.Write(didYouKnowFact());%></div>
            </div>
        </div>
        

        <div id="semitransparentOverlay" onclick="document.getElementById('semitransparentOverlay').setAttribute('style', 'display:none;')"></div>
        <div class="canvasContainer">
            <canvas id="canvas1" width="1" height="1"></canvas>
        </div>

        <div id="canvasCache" class="hidden"></div>
        
        <div id="ui">            
            <div id="CanvasTooltipContainer">                
	            <table id="CanvasTooltip" cellpadding="0" cellspacing="0" >
		           
                    <tbody><tr style="height: 7px;">
			            <td class="CanvasTooltip_T_L"></td>
			            <td class="CanvasTooltip_T_M"></td>
			            <td class="CanvasTooltip_T_R"></td>
		            </tr>
		            <tr>
			            <td class="CanvasTooltip_M_L">&nbsp;</td>
			            <td class="CanvasTooltip_M_M" id="popup_content"><div></div></td>
			            <td class="CanvasTooltip_M_R">&nbsp;</td>
		            </tr>
		            <tr style="height: 12px;">
			            <td class="CanvasTooltip_B_L"></td>
			            <td class="CanvasTooltip_B_M"></td>
			            <td class="CanvasTooltip_B_R"></td>
		            </tr>
 	            </tbody></table>
            </div>

            <div id="upperUI">
                <div id ="NavigationBar"></div>	
                
                <div id="quickMessageDiv">
                    <ul id="quickMessage">                      
                    </ul>                    
                </div>	    
            </div>
            
			<div id="tools">
				<ul>				
                    <li id="design", title="Design">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    	
                    <li id="attackTarget", title="Attack">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>

                    <li id="toolTransfer" class="active">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    <li id="toolTrade">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>                   
                    <li id="rotate">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    <li id="demolish">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                     <li id="harvestNebula">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    <li id="createSpaceStation">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    <li id="addTranscendence">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                     
                    <li id="sentry">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>
                    <li id="continue">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span></button></li>                  
                    

                    

				</ul>
			</div>
            
            <div id="burgerButton">
                <label for="burger">Menu</label>
            </div>
            <input id="burger" type="checkbox" style="display: none;" checked="checked" >
            
            <div id="menuTools" class="MenuBackground">
				<ul id="menuToolsUl">
                    <li id="shipList"></li>    					
                    <li id="colonyList"></li>  
                    <li id="messageList"></li>                           
                    <li id="contactsList"></li>
                    <li id="allianceList"></li>          
                    <li id="communicationList" class="imageSpeak"></li>       
                    <li id="tradeList"></li>       
                    <li id="questList"></li>       
                    <li id="researchList"></li>
                    <li id="galaxy"><div class="UnreadGalacticEvents UnreadMarker">1</div></li>       <!--
                    <li id="settingsList"></li>       
                    <li id="quitList"></li>       -->                          
				</ul>
                <div id="nextTurnTime"></div>
                <div id="zoomTools">
				    <ul id="zoomToolsList">
                        <li id="zoomIn"></li>
                        <li id="zoomOut"></li>
                        <li id="fullscreen"></li>                        
                    </ul>
                    <ul id="SettingsUl">                           
                        <li id="settingsList" title="Einrichtung"></li>       
                        <li id="quitList" title="Verlassen"></li>                                 
				    </ul>
			    </div>	
                <!--
                <button id="turnByUser" style="float: right; margin-top: 10px;">Rundenwechsel</button>
                -->
			</div>

            
            <div id="Rank" class="MenuBackground" title="x">
				
			</div>      
            
            <div id="alerts">
				<ul>
					<!--<li id="alertMessage" onclick="document.getElementById('alertMessage').style.display = 'none';"></li>	-->
                    <li id="alertMessage">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span>
                        </button>
                    </li>
                    <li id="alertCommNode">
                        <button class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
                            <span class="ui-button-icon-primary ui-icon message"></span>
                        </button>
                    </li>						
				</ul>
                
			</div>
           <!--
            <div id="ColonyInfoButtons">
                <button id="ShowBuildings" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary"><div class="ButtonBuildingImage"></div></button>
                <button id="ShowModules" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary"><div class="ButtonModulesImage"></div></button>
            </div>
            -->

            <div id="ColonyInfo" class="alpha60white">
                <div id="panel-ul-buildings" class="hidden"></div>                
            </div>           

            <div id="quickInfo-container" class="hidden">
                <div id="quickInfoList" class="alpha90white">	</div>
                <div id="quickInfoDetails" class="alpha60white"></div>                
                <div id="quickInfo" class="alpha90white"></div>    
                <div id="TransferPanel"  style="display: none">
                    <div id="TransferShips" class="alpha60white"></div>
                    <div id="TransferShipSelection" class="alpha90white"></div>
                    <div id="TransferGoods" class="alpha90white"></div>
                    <div id="TransferButtons" class="alpha60white">
                        <button id="TransferButton1" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">1</button>
                        <button id="TransferButton10" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">10</button>
                        <button id="TransferButton100"class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">100</button>
                        <button id="TransferButtonI" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive">∞</button>
                        <button id="TransferButtonX" class="messageButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary buttonActive" title="Cancel">C</button>
                    </div>
                </div>           
			</div>	
            
            <div id="QuestList">
                <ul></ul>
            </div>							
		</div>
        

        <div id="chat" class="BackgroundLightGray" style="height: 186px; width: 402px; display:none;">
            <button class="ui-state-default bX" style="z-index: 5000;">X</button>
	        <div id="chatParticipants" class="BackgroundMediumGray" >
		        <div id="chatParticipantsList">		
		        </div>         
	        </div>
	
	        <div id="chatWindow" class="BackgroundMediumGray selectText">
		        <div id="chatWindowContent"></div>
	        </div>
	        <div id="chatInputDiv">
		
		        <span id="chatInputContainer">
			        <input id="chatInput" class="BackgroundMediumGray" name="chatInput" value="">
		        </span>
		        <label for="chatInput" id="chatInputTarget" style="display:none" class="greenish"></label>
	        </div>	
        </div>


       
	</div>
        

    <!--</form>-->
</body>
</html>
