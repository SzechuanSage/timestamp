var path = require('path');
var express = require('express');

var router = express();

router.use(express.static(path.resolve(__dirname, 'timestamp')));

router.use(function(req,res) {
    var timeStamp = getTimeStamp(req.originalUrl.substr(1))
    res.end(JSON.stringify(timeStamp))
})

function getTimeStamp (input) {
    var unix, naturalDate

    var cleanInput = function() {
        return decodeURI(input).trim()
    }

    var isValidUnix = function(unixString) {
        return unixString.match(/^[+-]?[0-9\.]*$/)
    }

    var goodTimeStamp = function() {
        var date = new Date(unix * 1000)
        var month = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        naturalDate = month[date.getMonth()].concat(' ', date.getDate(), ', ', date.getFullYear())
        return {unix: unix, natural: naturalDate}
    }

    var badTimeStamp = {unix: null, natural: null}

    var cleanedInput = cleanInput()

    if (isValidUnix(cleanedInput)) {
        unix = Number(cleanedInput)
        if (isNaN(unix))
            return badTimeStamp
        else
            return goodTimeStamp()
    }

    var parseMonth = function() {
        var numericMonth = 0
        if (inputMonth.length === 3) {
            var shortMonth = ['jan','feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            numericMonth = shortMonth.indexOf(inputMonth)
            if (numericMonth > -1)
                return numericMonth
        }
        numericMonth = parseInt(inputMonth)
        if (numericMonth >= 1 && numericMonth <= 12) { return (numericMonth - 1) }
        return null
    }

    var matchDate = cleanedInput.match(/\W*(\w*)\W*(\w*)\W*(\w*)/)
    var inputMonth = matchDate[1].toLowerCase().slice(0,3)
    var inputDay = matchDate[2]
    var inputYear = matchDate[3]

    var numericMonth = parseMonth()
    if (numericMonth === null) { return badTimeStamp }

    var numericDay = parseInt(inputDay)
    if (isNaN(numericDay)) { return badTimeStamp }
    if (numericDay < 1 || numericDay > 31) { return badTimeStamp }

    var numericYear = 0;
    if (inputYear.length === 0) {
        numericYear = 1
    }
    else {
        numericYear = parseInt(inputYear)
    }
    if (isNaN(numericYear)) { return badTimeStamp }
    if (numericYear >= 0 && numericYear <= 49) { numericYear += 2000 }
    if (numericYear >= 50 && numericYear <= 99) { numericYear += 1900 }

    unix = Date.UTC(numericYear, numericMonth, numericDay) / 1000
    return goodTimeStamp()
}

router.listen(process.env.PORT || 3000);
