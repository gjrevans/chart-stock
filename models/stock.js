var axios = require('axios');

var StockModel = function(){};

StockModel.prototype.getStockByName = function(options, callback){
    var stock = options.stockName;
    var start_date = '2017-01-01';
    var end_date = new Date().toString().slice(0,10);
    
    var url = process.env.QUANDL_BASE_URL + stock + '.json?order=asc&start_date=' + start_date + '&end_date=' + end_date

    axios.get(url)
        .then(response => {
            callback(null, response.data.dataset.data);
        }
        ).catch(error => {
            callback(error);
        });
}

module.exports = StockModel;
