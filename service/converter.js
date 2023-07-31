class Converter {
     xml2JsObject(xml) {
        let tags = []
        return new Promise((resolve, reject)=>{
            this.parseTagXml(xml).then((parsedTag)=>{
                tags = parsedTag
            },err=>reject(err))
            this.parseXml(xml,tags).then((jsObject)=>{
                resolve(jsObject)
            },err=>reject(err))
        })
    }
    parseTagXml(xml){
         let tags = []
         return new Promise((resolve, reject)=>{

             tags.length == 0 ? reject("Empty Xml") : ''
             resolve(tags)
         })
    }
    parseXml(xml, tags){
        return new Promise((resolve, reject)=>{
            const regex = /<[^\/].*?:(.*?)(?: (.*?))?>([^<\n]+)?/g;
            let m
            let jsObject = {
                elements: []
            }
            while ((m = regex.exec(xml)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (m[1] == "input")
                    continue;
                let tmp = {}
                jsObject.elements.add(tmp)
                /*
                m.forEach((match, groupIndex) => {
                    console.log(`Found match, group ${groupIndex}: ${match}`);
                });
                 */
            }
            jsObject.elements.length === 0 ? reject("Erroneous xml") : ''
            resolve(jsObject)
        })
    }

    sjObject2Xml(jsObject){
        let xml
        return new Promise((resolve, reject)=>{
            reject("not work")
        })
    }
}
module.exports = new Converter()