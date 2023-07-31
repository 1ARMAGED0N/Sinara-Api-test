var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var Converter = require('./service/converter');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

let xml = "" +
    "<ns1:input xmlns:ns1=\"ns1:test\" xmlns:ns2=\"ns2:test\">\n" +
    "<ns1:element id=\"1\">\n" +
    "<ns2:field1>1</ns2:field1>\n" +
    "<ns2:field2>2</ns2:field2>\n" +
    "<ns2:field3>3</ns2:field3>\n" +
    "</ns1:element>\n" +
    "<ns1:element id=\"2\">\n" +
    "<ns2:field1>4</ns2:field1>\n" +
    "<ns2:field2>5</ns2:field2>\n" +
    "<ns2:field3>6</ns2:field3>\n" +
    "</ns1:element>\n" +
    "</ns1:input>"

let jsObject = {
    "elements": [
        {"element": {
                "field1": "1",
                "field2": "2",
                "field3": "3",
                "id": "1"
            }},
        {"element": {
                "field1": "4",
                "field2": "5",
                "field3": "6",
                "id": "2"
            }}
    ]}
let params = [
    {elements: "<ns1:input xmlns:ns1=\"ns1:test\" xmlns:ns2=\"ns2:test\">"},
    {element: "<ns1:element id=@id>"},
    {other: "<ns2:@fieldName>"}
]
Converter.xml2JsObject(xml).then(res=>{
    jsObject = res.object
    params = res.params
    console.log(jsObject)
    console.log(params)
}, err=>{
    console.log(err)
})
Converter.sjObject2Xml(jsObject,params).then(res =>{
    console.log(res)
}, err =>{
    console.log(err)
})

