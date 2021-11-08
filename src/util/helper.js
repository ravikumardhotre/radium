function printDate() {
    console.log('today is 7th nov,2021')

}

function printMonth() {
    console.log('the current month is november');
}

function batchInfo() {
    console.log('this is batch: radium,The week number is : 4, The day number is : 1 ');
}
module.exports.getDate = printDate
module.exports.getMonth = printMonth
module.exports.getBatchInfo = batchInfo