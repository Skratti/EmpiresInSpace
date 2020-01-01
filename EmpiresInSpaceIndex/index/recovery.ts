/// <reference path="../jQuery/jquery.d.ts" />
/// <reference path="../i18n/SetLanguage.ts" />

declare var userLang: string; 

var labels = new EmpiresIndex.Labels();//needed for setLanguages

module EmpiresIndex {

    export class PageRecovery {
        
       

        constructor() {
            labels = new Labels();
        }

        sendNewPasswordButton() {
            //ToDo 
            //- validate html fields
            //- send password encrypted!!!
            var Random = $("#RecoveryKey").val();
            var NewPassword = $("#NewPassword").val();
            var NewPasswordRepeat = $("#NewPasswordRepeat").val();

            if (NewPassword != NewPasswordRepeat)
            {
                $("#RecoveryFailed").text(labels.recoveryPasswordMismatch);
                $("#RecoveryFailed").css("display", "block");
                $("#RecoveryFailed").fadeOut(3000);
                return;
            }

            $.ajax("Authentication.aspx", {
                "type": "POST",
                "data": {
                    "action": "recoverPassword",
                    "random": Random,
                    "newPassword": NewPassword
                }
            }).done(function (msg) {
                console.log('done ' +  msg);

                    //some code which is called when the ajax was successfully sent...
                    console.log(msg);
                    if (msg == "3") {

                        $("#RecoveryFailed").text(labels.recoverySuccess);
                        $("#RecoveryFailed").css("display", "block");

                        console.log(msg);
                        window.setTimeout(function () { window.location.href = "./Index.aspx"; }, 3000);

                    }
                    else {

                        if (msg == 1) $("#RecoveryFailed").text(labels.recoveryHashError);
                        else $("#RecoveryFailed").text(labels.recoveryFailure);

                        $("#RecoveryFailed").css("display", "block");

                    }

                }).always(function (msg) {
                    console.log('always ' + msg);

                    //some code which is called when the ajax was successfully sent...
                    console.log(msg);
                    if (msg == "3") {

                        $("#RecoveryFailed").text(labels.recoverySuccess);
                        $("#RecoveryFailed").css("display", "block");

                        console.log(msg);
                        window.setTimeout(function () { window.location.href = "./Index.aspx"; }, 3000);

                    }
                    else {

                        if (msg == 1) $("#RecoveryFailed").text(labels.recoveryHashError);
                        else $("#RecoveryFailed").text(labels.recoveryFailure);

                        $("#RecoveryFailed").css("display", "block");

                    }

                });

            
                        
            return;
        }

        //Called during startup to initialize stuff
        myOnLoad() {

            $("#languageSelector").change(function () { labels.loadAndSwitch($("#languageSelector").value, false); });

            $('#recoveryForm').submit(function () { pageRecovery.sendNewPasswordButton(); return false; });
           

            var selectedLanguage = userLang;            
            if (selectedLanguage) {

                //some browser give a cookie-value that does not exist. so check language after cookie-reading
                if (selectedLanguage != "en" && selectedLanguage != "de" && selectedLanguage != "fr") {
                    selectedLanguage = "en";               
                }

                $('#languageSelector').val(selectedLanguage);
                labels.loadAndSwitch(selectedLanguage);
            }
            else {
                //get the browser language
                selectedLanguage = window.navigator.language; //|| window.navigator.userLanguage;
                console.log('selectedLanguage = ' + selectedLanguage);
                if (selectedLanguage != "en" && selectedLanguage != "de" && selectedLanguage != "fr") {
                    selectedLanguage = "en";                
                }

                $('#languageSelector').val(selectedLanguage);
                labels.loadAndSwitch(selectedLanguage);
            }



            $("#loginArea .input_text").css("width","100%");
            $("#loginArea .input_text").css("font-size", "12px");

            $("#RecoveryBox").css("text-align", "right");
            $("#RecoverySend").css("font-size", "16px");

            $(document).ready(function () {
                $('#BodyContainer').animate({ 'margin-left': '0px' }, 700);
            });
        }

    }

}

var pageRecovery: EmpiresIndex.PageRecovery;
var pageRecovery = new EmpiresIndex.PageRecovery();

$(document).ready(pageRecovery.myOnLoad);
