const Urls = {
    STOCKS: "http://vip.stock.finance.sina.com.cn/mkt/#stock_hs_up",
    makeStockPageUrl: function (stockCode) {
        return `http://finance.sina.com.cn/realstock/company/${stockCode}/nc.shtml`;
    }
};

module.exports = Urls;