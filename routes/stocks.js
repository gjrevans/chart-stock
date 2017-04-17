var models;

var StockRoutes = function(appmodels){
    models = appmodels;
};

StockRoutes.prototype.index = function(req, res) {
    var options = {};

    // Set the breadcrumbs
    req.breadcrumbs('All Stocks', '/');

    // Find all the stocks
    models.stock.getStocks(options, function(error, stockData) {
        if(error) throw error;

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
    options.stockName = req.body.stock.toUpperCase();
    options.startDate = '2017-01-01';
    options.endDate = '2017-03-01';

    // Get the stock from Qualid API
    models.stock.getStockByName(options, function(error, stockData) {
        if (error) {
            req.flash('errorMessages', 'That is not a valid stock symbol!');
            return res.redirect('/');
        }
        var data = stockData.map(function(element){
            return { date: element[0], value: element[3] }
        });

        options.newStock = new models.stock.Stock({
            stockName: options.stockName,
            data: data
        });

        models.stock.addStock(options, function(error, addedStock) {
            if(error) throw error
            res.redirect('/');
        });
    });
}

StockRoutes.prototype.removeStock = function(req, res){
    var options = {};
    options.id = req.params.id;

    if (options && options.id){
        models.stock.removeStock(options, function(error, removedStock) {
            if(error) {
                return res.status(500).json({status: 500, error: true, message: error });
            }
            res.status(200).json({
                status: 200,
                error: false,
                message: "Successfuly Removed"
            });
        });
    } else {
        return res.status(404).json({status: 404, error: true, message: 'Bad Request'});
    }

}

module.exports = StockRoutes;
