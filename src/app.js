const loggerObj = require('./logger')

const helperObj = require('./util/helper')

const formatterObj = require('../validator/formatter')
const Obj = require('underscore')
const obj1 = require('lodash')
const obj2 = require('lodash')
const obj3 = require('lodash')
const obj4 = require('lodash')
const obj5 = require('lodash')


loggerObj.logMassage('Ravikumar')
loggerObj.printWelcomeMassage()
console.log(loggerObj.loggerEndpoint)

console.log("_________________________________________________________________________________");
helperObj.getDate()
helperObj.getMonth()
helperObj.getBatchInfo()

console.log("_________________________________________________________________________________");
formatterObj.trimInput()
formatterObj.changeToLowercaseInput()
formatterObj.changeToUppercaseInput()

console.log("_________________________________________________________________________________");
console.log(Obj.first(["apple", "banana", "papaya", "lemon"], 2));

console.log(obj1._.chunk(['jan', 'feb', 'march', 'apr', 'may', 'jun', 'july', 'aug', 'sept', 'oct', 'nov'], 3));

console.log(obj2._.tail([1, 3, 5, 7, 9, 11, 13, 15]));

console.log(obj3._.union([1], [1, 2], [1, 4, 3], [5], [1, 5, 3, 12, 2, 4], [1, 9, 3, 4, 5, 90]));

console.log(obj4._.union([1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5]));

console.log(obj5._.fromPairs([
    ['horror', 'the shining'],
    ['drama', 'Titanic'],
    ['thriller', 'Shutter Island '],
    ['fantasy', 'Pans Labyrinth ']
]))