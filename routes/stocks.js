var models;

var StockRoutes = function(appmodels){
    models = appmodels;
};

StockRoutes.prototype.index = function(req, res) {
    // Set the request options
    var options = {};
    options.stockName = 'AAPL';

    // Set the breadcrumbs
    req.breadcrumbs('All Stocks', '/');

    models.stock.getStockByName(options, function(err, stockData){
        var adjustedStock = stockData.map(function(element){
             return [element[0], element[3]];
        });

        res.render('index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: {title: 'Page Title'},
            stocks: adjustedStock
        });
    });
}

module.exports = StockRoutes;
