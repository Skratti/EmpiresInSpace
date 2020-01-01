
// mdTemplate : Template for Modules and Classes 
// this pattern is always to be used!
module mdTemplate {

    export var instancesOfClassTemplate: ClassTemplate[] = [];

    export var staticValue = false;     

    export class ClassTemplate {

        var1 = true;        
        var2 = '';
        var3 = 0;
        

        constructor(public id: number) {
        }


        update(XMLmessage) {
            var var1 = parseInt(XMLmessage.getElementsByTagName("var1")[0].childNodes[0].nodeValue,10);
            var var2 = XMLmessage.getElementsByTagName("var2")[0].childNodes[0].nodeValue;
            var var3 = parseInt(XMLmessage.getElementsByTagName("var3")[0].childNodes[0].nodeValue,10);
            
            this.var1 = var1 === 1 ? true : false;
            this.var2 = var2;
            this.var3 = var3;           
        }        
    }

    export function classTemplateExists(id: number): boolean {
        if (instancesOfClassTemplate[id] != null)
            return true;
        else
            return false;
    }

    export function getClassTemplate(id: number): ClassTemplate {
        if (!classTemplateExists(id)) return null;
        return instancesOfClassTemplate[id];
    }

    var classTemplateAdd = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);
        var newClassTemplate = new ClassTemplate(id);

        instancesOfClassTemplate[id] = newClassTemplate;

        newClassTemplate.update(XMLmessage);        
    }

    var createUpdateClassTemplate = function (XMLmessage: Element) {
        var id = parseInt(XMLmessage.getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (classTemplateExists(id))
            instancesOfClassTemplate[id].update(XMLmessage);
        else
            classTemplateAdd(XMLmessage);
    }

    export function getClassTemplateFromXML(XMLmessage: Document) {
        var XMLClassTemplates = XMLmessage.getElementsByTagName("ClassTemplate");
        var length = XMLClassTemplates.length;
        for (var i = 0; i < length; i++) {
            createUpdateClassTemplate(<Element>XMLClassTemplates[i]);
        }
        Helpers.Log(length + " ClassTemplates added or updated");
    }
      
} 