class Converter {
     xml2JsObject(xml) {
         return new Promise((resolve, reject) => {
             this.parseTagXml(xml).then(tags => {
                 this.parseXml(xml, tags).then(jsObject => {
                     resolve(jsObject)
                 }, err => reject(err))
             }, err => reject(err))
         })
     }

    parseTagXml(xml) {
        let tags = []
        return new Promise((resolve, reject) => {
            const regex = /<.*?:(.*?)(?: .*?)?>/g;
            let m;
            while ((m = regex.exec(xml)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                tags.push(m[1])
            }
            tags.length == 0 ? reject("Empty Xml") : ''
            resolve(tags)
        })
    }

    parseXml(xml, tags) {
        console.log(tags)
        return new Promise((resolve, reject) => {
            const regex = /<[^\/].*?:(.*?)(?: (.*?))?>([^<\n]+)?/g;
            let m
            let jsObject = {
                params : [],
                object : {
                    elements: []
                }
            }
            while ((m = regex.exec(xml)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (m[1] == "input")
                    continue;
                m.forEach(o => console.log(o))
                jsObject.object.elements.push(m[1])
            }
            jsObject.object.elements.length === 0 ? reject("Erroneous xml") : ''
            resolve(jsObject)
        })

    }

    sjObject2Xml(jsObject) {
        let xml
        return new Promise((resolve, reject) => {
            reject("not work")
        })
    }
}
module.exports = new Converter()