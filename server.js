var path = require('path');
var express = require('express');

var router = express();

router.use(express.static(path.resolve(__dirname, 'timestamp')));

router.use(function(req,res) {
    var timeStamp = getTimeStamp(req.originalUrl.substr(1))
    res.end(JSON.stringify(timeStamp))
})

var getTimeStamp = function (input) {
    var unix, naturalDate

    var main = function() {
        var cleanedInput = cleanInput()
        var result = null
        if (isValidUnix(cleanedInput)) {
            result = processValidUnix(cleanedInput)
        } else {
            result = processNaturalDate(cleanedInput)
        }
        return result
    }

    var cleanInput = function() {
        return decodeURI(input).trim()
    }

    var isValidUnix = function(unixString) {
        return unixString.match(/^[+-]?[0-9\.]*$/)
    }

    var processValidUnix = function(validUnix) {
        unix = Number(validUnix)
        if (isNaN(unix))
            return badTimeStamp
        else
            return goodTimeStamp()
    }

    var badTimeStamp = {unix: null, natural: null}

    var goodTimeStamp = function() {
        var date = new Date(unix * 1000)
        var month = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        naturalDate = month[date.getMonth()].concat(' ', date.getDate(), ', ', date.getFullYear())
        return {unix: unix, natural: naturalDate}
    }

    var processNaturalDate = function(dateString) {
        var matchDate = dateString.match(/\W*(\w*)\W*(\w*)\W*(\w*)/)
        
        var inputMonth = matchDate[1].toLowerCase().slice(0,3)
        var numericMonth = getZeroBasedNumericMonth(inputMonth)
        if (isInvalidMonth(numericMonth))
            return badTimeStamp
        
        var inputDay = matchDate[2]
        var numericDay = parseInt(inputDay)
        if (isInvalidDay(numericDay))
            return badTimeStamp
        
        var inputYear = matchDate[3]
        var numericYear = getNumericYear(inputYear)
        if (isInvalidYear(numericYear))
            return badTimeStamp

        unix = Date.UTC(numericYear, numericMonth, numericDay) / 1000
        return goodTimeStamp()
    }

    var getZeroBasedNumericMonth = function(inputMonth) {
        if (inputMonth.length === 3) {
            var shortMonth = ['jan','feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            numericMonth = shortMonth.indexOf(inputMonth)
        }
        else {
            numericMonth = parseInt(inputMonth) - 1
        }
    
        return numericMonth
    }

    var isInvalidMonth = function(numericMonth) {
        if (isNaN(numericMonth)) { return true }
        if (numericMonth < 0) { return true }
        if (numericMonth > 11) { return true }
        return false
    }

    var isInvalidDay = function(numericDay) {
        if (isNaN(numericDay)) { return true }
        if (numericDay < 1) { return true }
        if (numericDay > 31) { return true }
        return false
    }

    var getNumericYear = function(inputYear) {
        var numericYear = 0;
        if (inputYear.length === 0) {
            numericYear = 1
        }
        else {
            numericYear = parseInt(inputYear)
        }

        if (numericYear >= 0 && numericYear <= 49) { numericYear += 2000 }
        if (numericYear >= 50 && numericYear <= 99) { numericYear += 1900 }
        return numericYear
    }

    var isInvalidYear = function(numericYear) {
        return (isNaN(numericYear))
    }

    return main()
}

router.listen(process.env.PORT || 3000);
