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

StockModel.prototype.addStock = function(newStock, callback) {
    newStock.save(callback);
}

StockModel.prototype.removeStock = function(id, callback) {
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
    var start_date = '2017-01-01';
    var end_date = '2017-03-01';

    var url = process.env.QUANDL_BASE_URL + stock + '.json?order=asc&start_date=' + start_date + '&end_date=' + end_date

    axios.get(url)
        .then(response => {
            console.log(response);
            if(response.code === '400'){
                callback('something went wrong')
            } else {
                callback(null, response.data.dataset.data);
            }
        }
        ).catch(error => {
            callback(error);
        });
}

module.exports = StockModel;
