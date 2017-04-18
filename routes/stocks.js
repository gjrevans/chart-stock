var models;
var io;

var StockRoutes = function(appmodels, appIo) {
    models = appmodels;
    io = appIo;
};

StockRoutes.prototype.index = function(req, res) {
    var options = {};

    // Find all the stocks
    models.stock.getStocks(options, function(error, stockData) {
        if(error) throw error;

        res.render('index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: {title: 'Chart Stocks'},
            stocks: stockData
        });
    });
}

StockRoutes.prototype.addStock = function(req, res) {
    // Create Route Options
    var options = {};
    options.stockName = req.params.stockName.toUpperCase();
    options.startDate = '2017-01-01';

    // Get the stock from Qualid API
    models.stock.getStockByName(options, function(error, stockData) {
        if (error) {
            return res.status(404).json({status: 404, error: true, message: 'Sorry, we weren\'t able to find that stock!'});
        }

        // Create the new Stock
        var data = stockData.map(function(element){
            return { date: element[0], value: element[3] }
        });

        options.newStock = new models.stock.Stock({
            stockName: options.stockName,
            data: data
        });

        // Add the stock to the database
        if (options && options.stockName){
            models.stock.addStock(options, function(error, addedStock) {
                if(error) {
                    if(error.name === 'ValidationError') {
                        error.message = 'Looks like that stock has already been added!'
                    }
                    return res.status(500).json({status: 500, error: true, message: error.message });
                }

                // If successfuly fire io event and return response
                io.sockets.emit('stock added', { stock: addedStock });
                res.status(200).json({
                    status: 200,
                    error: false,
                    message: "Successfuly Added"
                });
            });
        } else {
            return res.status(404).json({status: 404, error: true, message: 'Please provide a stock name!'});
        }
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

            // If successfuly fire io event and return response
            io.sockets.emit('stock removed', { stock: removedStock });
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
