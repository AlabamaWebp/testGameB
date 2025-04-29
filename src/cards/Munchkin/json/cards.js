"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var imges = {};
function getCardsFromFolder() {
}
function test() {
    var tmp = [];
    var f = fs.readdirSync("");
    console.log(f);
    f.filter(function (e) { return e.includes(".json"); }).forEach(function (name) {
        tmp.push(fs.readFileSync(name).toJSON());
    });
    console.log(tmp);
}
test();
