var models;

var StockRoutes = function(appmodels){
    models = appmodels;
};

StockRoutes.prototype.index = function(req, res) {
    var options = {};

    // Set the breadcrumbs
    req.breadcrumbs('All Stocks', '/');

    // Find all the stocks
    models.stock.getStocks(options, function(err, stockData) {
        if(err) throw err;

        res.render('index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: {title: 'Page Title'},
            stocks: stockData
        });
    });
}

StockRoutes.prototype.addStock = function(req, res) {
    // Create Route Options
    var options = {};
    options.stockName = req.body.stock;

    // Get the stock from Qualid API
    models.stock.getStockByName(options, function(err, stockData) {
        if (err) throw err;

        var data = stockData.map(function(element){
            return {date: element[0], value: element[3]}
        });

        var newStock = new models.stock.Stock({
            stockName: options.stockName,
            data: data
        });
        
        models.stock.addStock(newStock, function(err, foundStock){
            if(err) throw err;

            res.redirect('/');
        });
    });
}

module.exports = StockRoutes;
