const Binance = require("node-binance-api");
const fs = require("fs");

const { BASE, QUOTE, BUY_PERCENT, SELL_PERCENT } = require("../config");

//Binance configuration to trade on TESTNET
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_SECRET,
  verbose: true,
  urls: {
    base: "https://testnet.binance.vision/api/", // remove this to trade on mainnet
  },
});

module.exports = async (action) => {
  {
    let balances;
    const MARKET = BASE + QUOTE; //In our case the market is BTCUSDT

    //fetch current market price
    let cmp = await binance.prices(MARKET);
    cmp = cmp[MARKET];

    switch (action) {
      case "BUY":
        balances = await binance.balance();
        // Fetch USDT balance
        let quoteBalance = balances[QUOTE].available;

        //Calculate 30% of USDT balance to buy BTC
        let buyValue = parseFloat(quoteBalance) * (BUY_PERCENT / 100);
        let buyQuantity = parseFloat(buyValue / cmp).toFixed(5);

        if (buyQuantity < 0)
          return { error: true, message: `Insufficient ${QUOTE} balance` };

        //Place Buy order at the market price
        binance.marketBuy(MARKET, buyQuantity, (error, response) => {
          if (error) {
            console.log(
              "Oops, Couldn't place order at the moment",
              error.message || error.title
            );
            return { error: true };
          }
          let log = `${new Date().toLocaleString()} - Bought ${buyQuantity} ${BASE} for ${buyValue} ${QUOTE}. OrderID : ${
            response.orderId
          }\n`;

          // Record the transaction for future reference
          fs.appendFileSync("./trade.logs", log);
          console.log(log);

          return { error: false };
        });
        break;
      case "SELL":
        balances = await binance.balance();

        //Fetch the BTC balance
        let baseBalance = balances[BASE].available;

        //Calculate 35% percent of total BTC holdings
        let sellQuantity = parseFloat(baseBalance) * (SELL_PERCENT / 100);
        if (sellQuantity < 0)
          return { error: true, message: `Insufficient ${BASE} balance` };

        //Place market sell order
        binance.marketSell(
          MARKET,
          parseFloat(sellQuantity).toFixed(5),
          (error, response) => {
            if (error) {
              console.log(
                "Oops, Couldn't place order at the moment",
                error.message || error.title
              );
              return { error: true };
            }
            log = `${new Date().toLocaleString()} - Sold ${sellQuantity} ${BASE}. OrderID : ${
              response.orderId
            }\n`;

            // record the transaction
            fs.appendFileSync("./trade.logs", log);

            console.log(log);
            return { error: false };
          }
        );
        break;
      default:
        return { error: true, message: "Invalid action" };
    }
  }
};
