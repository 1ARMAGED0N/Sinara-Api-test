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
            const regex = /<([\/])?.*?:(.*?)(?: .*?)?>/g;
            let m;
            while ((m = regex.exec(xml)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m[1] == undefined ? tags.push(m[2]) : tags.push(m[1] + m[2])
            }
            tags.length == 0 ? reject("Empty Xml") : ''
            resolve(tags)
        })
    }

    parseXml(xml, tags) {
        return new Promise((resolve, reject) => {
            const regex = /<[^\/].*?:(.*?)(?: (.*?))?>([^<\n]+)?/g;
            let m
            let jsObject = {
                elements: []
            }
            let indexTags = 0
            let savedParams = []
            let savedTags = ""
            let indexThree = -1
            while ((m = regex.exec(xml)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (m[1] == "input")
                    continue;
                if ("/" + tags[indexTags] == tags[indexTags + 1]) {
                    let tmp = {}
                    tmp[m[1]] = m[3]
                    let tmp2 = jsObject.elements[indexThree][savedTags]
                    Object.assign(tmp2, tmp);
                } else {
                    if (indexThree > -1) {
                        let tmp2 = jsObject.elements[indexThree][savedTags]
                        Object.assign(tmp2, savedParams[savedParams.length - 1]);
                    }
                    indexThree++
                    let tmp1 = {}
                    tmp1[m[1]] = {}
                    savedTags = m[1]
                    savedParams.push(this.getParams(m[2]))
                    jsObject.elements.push(tmp1)
                }
                indexTags += 2
            }
            jsObject.elements.length === 0 ? reject("Erroneous xml") : ''
            let tmp2 = jsObject.elements[indexThree][savedTags]
            Object.assign(tmp2, savedParams[savedParams.length - 1]);
            resolve(jsObject)
        })
    }

    getParams(str) {
        let tmp = {}
        let keysArr = str.split(' ')
        keysArr.forEach(keyStr => {
            let key = keyStr.split('="')
            let str1 = key[1].substring(0, key[1].length - 1);
            tmp[key[0]] = str1
        })
        return tmp
    }

    jsObject2Xml(jsObject, params) {
        let cloneJsObject = structuredClone(jsObject)
        let xml = ""
        return new Promise((resolve, reject) => {
            xml += params.elements
            cloneJsObject.elements.forEach(element => {
                var keysElements = Object.keys(element)
                keysElements.forEach(key => {
                    let elementKey = this.getFoundTag(params, key)
                    let tagTop = params[elementKey]
                    xml += this.getModifyedTag(tagTop, element[key])
                    let fields = Object.keys(element[key])
                    fields.forEach(field => {
                        let fieldKey = this.getFoundTag(params, field)
                        let tagBottom = this.getModifyedTag(params[fieldKey], field)
                        xml += tagBottom
                        xml += element[key][field]
                        xml += this.getClosedTag(tagBottom)
                    })
                    xml += this.getClosedTag(tagTop)
                })
            })
            xml += this.getClosedTag(params.elements)
            resolve(xml)
        })
    }

    getClosedTag(str) {
        let tagArr = str.split(/ |>/)
        let closedTag = "</" + tagArr[0].substring(1) + ">"
        return closedTag
    }

    getFoundTag(lib, tag) {
        let keys = Object.keys(lib)
        let findTag = 'other'
        keys.forEach(key => {
            if (key == tag)
                findTag = tag
        })
        return findTag

    }

    getModifyedTag(str, obj) {
        let foundTags = str.split(/@| |>/)
        foundTags.forEach(tag=>{
            switch (tag){
                case 'id': str = this.modifyId(str, obj); break;
                case 'fieldName' : str = this.modifyFieldName(str, obj); break;
                default: break;
            }
        })
        return str
    }
    modifyId(str, obj){
        str = str.replace('@id', "\""+obj['id']+"\"");
        delete obj['id']
        return str
    }
    modifyFieldName(str, obj){
        str = str.replace('@fieldName', obj);
        delete obj['id']
        return str
    }
}
module.exports = new Converter()