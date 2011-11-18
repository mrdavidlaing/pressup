(function($, undefined) {
/*
 Use the CIAPI.Js client library to fetch data about markets & priceHistory.
 Massage it into a useful structure for the marketGrid

 NB:  Currently CIAPI returns dummy data
 */
function getMarketList(marketName) {
    marketName = marketName || "all";

    var currentClose,
            marketList = CIAPI.services.ListCfdMarkets(marketName, "all", 6);

    for (var idx in marketList) {
        market = marketList[idx];
        market.priceHistory = CIAPI.services.GetPriceBars(market.MarketId, 'minute', 1, 50);
        market.currentPrice = {
            bid : market.priceHistory.PartialPriceBar.Close,
            offer : market.priceHistory.PartialPriceBar.Close,
            high : market.priceHistory.PartialPriceBar.High,
            low : market.priceHistory.PartialPriceBar.Low,
            change : market.priceHistory.PartialPriceBar.Close - market.priceHistory.PriceBars[0].Close
        }
    }

    console.log("Search for '" + marketName + "' returned: ", marketList);
    return marketList;
}

/*
 Use the CIAPI.Js client library listen for price updates

 NB:  Currently CIAPI returns randomly generated price updates
 */
function subscribeToPriceChanges(viewModel) {
    for (var idx in viewModel.marketList()) {
        CIAPI.streams.ListenToPrice(viewModel.marketList()[idx].MarketId(), updateViewModelWithNewPrice);
    }
}

function updateViewModelWithNewPrice(newPrice) {
    console.log('Market: ' + newPrice.MarketId + ' received new price: ', newPrice);
    var theMarket = {};
    for (var k in viewModel.marketList()) {
        if (viewModel.marketList()[k].MarketId() === newPrice.MarketId) {
            theMarket = viewModel.marketList()[k];
            break;
        }
    }
    theMarket.currentPrice.change(newPrice.change);
    theMarket.currentPrice.bid(newPrice.bid);
    theMarket.currentPrice.offer(newPrice.bid);
    theMarket.currentPrice.high(newPrice.high);
    theMarket.currentPrice.low(newPrice.low);
    theMarket.priceHistory.PartialPriceBar.Close(newPrice.bid);

    renderSparkline(theMarket);
}

/*
   Setup the KnockoutJs viewmodel to contain "bindable" objects in the same structure as our marketList
   that our UI elements can bind to.
*/
var viewModel = ko.mapping.fromJS({ marketList : getMarketList("USD") });
//This function is bound to the search button, and refreshes the viewModel with new data
viewModel.doMarketSearch = function() {
    var marketQuery = $("#marketSearchQuery").val();
    var marketList = getMarketList(marketQuery);

    ko.mapping.updateFromJS(viewModel, { marketList : marketList });
};

/*
    Render jQuery sparklines based on the PriceHistory data for each market
 */

function renderSparkline(market) {
    var extractClose = function(priceHistory) {
         var closePrices = [];
         for(var i=0; i<priceHistory.PriceBars().length; i++){
             var priceBar = priceHistory.PriceBars()[i];
             closePrices.push(priceBar.Close());
         }
         closePrices.push(priceHistory.PartialPriceBar.Close());
         return closePrices;
    }
    var sparklineId = '#' + market.MarketId() + "_sparkline";
    $(sparklineId).sparkline(extractClose(market.priceHistory),  { width:'300px', height: '35px' });
}

function renderSparklines(viewModel) {
    var market;
    for (var idx in viewModel.marketList()) {
        market = viewModel.marketList()[idx];
        renderSparkline(market);
    }
}

function attachTooltips(viewModel)
{
  var market, idx, row_id;
  for (idx in viewModel.marketList()) {
    market = viewModel.marketList()[idx];
    row_id ='#' + market.MarketId() + '_qtip_row .mg-market';
    content_id = '#' + market.MarketId() + '_qtip_content';
    $(row_id).qtip({ 
                content:  { text: $(content_id) },
                     position: {
         my: 'right center',
         at: 'left center',
  
      }
              });
  }
};

/*
    Finally, to kick everything off,
    bind our data & styles to the HTML template
 */
$(document).ready(function() {
    ko.applyBindings(viewModel, $('#marketGrid').get(0));
    $("#doMarketSearchButton").button();
    subscribeToPriceChanges(viewModel);
    renderSparklines(viewModel);
    attachTooltips(viewModel);
});

}(jQuery));
