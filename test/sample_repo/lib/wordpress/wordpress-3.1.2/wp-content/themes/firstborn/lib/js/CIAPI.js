var CIAPI = (function() {

    var _i,
            _marketList = [],
            _priceBars = {
                minute: []
            };


    var _generateNextPrice = function (lastPrice) {
        var direction = Math.random() > 0.5 ? 1 : -1;
        return lastPrice.Close + (direction * lastPrice.Close * 0.05);
    }

    var _createPriceBar = function(previousBar, interval) {
        var intervalInMs = {
            minute: 1000 * 60,
            hour:  1000 * 60 * 60,
            day: 1000 * 60 * 60 * 24
        }
        var theDate = new Date(previousBar.BarDate.getTime() - intervalInMs[interval]);
        var close = _generateNextPrice(previousBar);
        return {
            "BarDate":theDate,
            "Close": close,
            "High": close * 1.1,
            "Low":close * 0.9,
            "Open":previousBar.Close
        }
    }

    var _currentBar = {
        "BarDate":new Date(),
        "Close":1.6283,
        "High":1.6285,
        "Low":1.6283,
        "Open":1.6284
    };

    for (_i = 0; _i <= 1000; _i++) {
        _priceBars.minute.push(_currentBar)
        _currentBar = _createPriceBar(_currentBar, 'minute');

        _marketList.push({
            "MarketId": 10000 + _i,
            "Name": "{marketName} CFD #" + (_i + 1)
        });
    }
    var _clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    var _services = (function() {
        return {
            ListCfdMarkets: function(searchByMarketName, searchByMarketCode, maxResults) {
                if (maxResults > 1000) throw { message: "Can only return a maximum of 1000 pricebars" };


                var markets = _clone(_marketList.slice(0, maxResults));
                for (idx in markets) {
                    markets[idx].Name = markets[idx].Name.replace("{marketName}", searchByMarketName);
                }
                return markets;
            },
            GetPriceBars: function(marketId, interval, span, priceBars) {
                if (interval !== 'minute') throw { message: "Only interval of 'minute' is currently supported" };
                if (priceBars > 1000) throw { message: "Can only return a maximum of 1000 pricebars" };

                return {
                    PartialPriceBar: _clone(_priceBars.minute[0]),
                    PriceBars: _clone(_priceBars.minute.slice(1, priceBars + 1))
                };
            }
        }
    })();


    var _streams = (function() {
        return {
            ListenToPrice: function(marketId, callBack) {
                setInterval(function() {
                    var change, direction;
                    direction = Math.random() > 0.5 ? 1 : -1;
                    change = direction * _priceBars.minute[0].Close * 0.05;
                    _priceBars.minute[0].Close += change;
                    _priceBars.minute[0].High = (_priceBars.minute[0].Close > _priceBars.minute[0].High) ? _priceBars.minute[0].Close : _priceBars.minute[0].High;
                    _priceBars.minute[0].Low = (_priceBars.minute[0].Close < _priceBars.minute[0].Low) ? _priceBars.minute[0].Close : _priceBars.minute[0].Low;
                    callBack({
                        MarketId: marketId,
                        bid : _priceBars.minute[0].Close,
                        offer : _priceBars.minute[0].Close,
                        high : _priceBars.minute[0].High,
                        low : _priceBars.minute[0].Low,
                        change : change
                    });
                }, Math.random() * 5000 + 1000);
            }
        }
    })();

    return {
        version: "0.1",
        services: _services,
        streams: _streams
    }

})();