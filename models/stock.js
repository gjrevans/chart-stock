var axios = require('axios');
var mongoose    = require('mongoose');
var validator   = require('validator');

var StockModel = function(){
    Stock = this.Stock = mongoose.model('Stock', StockSchema);

};

var StockSchema = mongoose.Schema({
    stockName: {
        type: String
    },
    data: [{
        date: {
            type: String
        },
        value: {
            type: Number
        }
    }]
});

StockModel.prototype.addStock = function(options, callback) {
    options.newStock.save(callback);
}

StockModel.prototype.removeStock = function(options, callback) {
    var id = options.id;

    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }
    Stock.findOneAndRemove(id, callback);
}

StockModel.prototype.getStocks = function(options, callback){
    Stock.find(callback);

}

StockModel.prototype.getStockByName = function(options, callback){
    var stock = options.stockName;
    var start_date = options.startDate;

    var url = process.env.QUANDL_BASE_URL + stock + '.json'

    axios.get(url, {
            params: {
                api_key: process.env.QUANDL_API_KEY,
                order: 'asc',
                start_date: start_date,
                collapse: 'weekly'
            }
        }).then(function(response) {
            if (response.status === 200) {
                callback(null, response.data.dataset.data);
            }
        }
        ).catch(function(error) {
            callback(error);
        });
}

module.exports = StockModel;
