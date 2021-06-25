![Product Name Screen Shot](https://cdn-images-1.medium.com/max/2560/1*8OvHd4ONUtZLQFSMQ4kVwg.jpeg)


<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">Sentiment based Cryptocurrency trading Bot</h3>
  <p align="center">
     <a href="https://medium.com/geekculture/this-bot-can-trade-bitcoin-whenever-elon-musk-tweets-about-it-614b95633663"><strong>Explore the post »</strong></a>
     <br /> <br />
    <a href="https://github.com/PraneshASP/crypto-trading-bot/issues">Report Bug </a>
    ·
    <a href="https://github.com/PraneshASP/crypto-trading-bot/issues"> Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

### What's inside this repo?

- NodeJS bot that trades the cryptocurrency on Binance 
- Customization Possible - check `config.js` file
- Uses Twitter API
- Ability to record the trades in `trade.logs` file.

For a more detailed explanation of the code, you can refer to my medium post associated with this repository.

> [Visit blog](https://medium.com/geekculture/this-bot-can-trade-bitcoin-whenever-elon-musk-tweets-about-it-614b95633663) - This bot can trade Bitcoin whenever Elon Musk tweets about it.

### Built With

- [Node.js]() - JavaScript runtime built on Chrome's V8 JavaScript engine.

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps :

### Prerequisites

To run this project, you'll need to have the following installed:

- Node.js : [https://nodejs.org](https://nodejs.org)

- npm :
  ```sh
  npm install npm@latest -g
  ```
- [Twitter Developer Account](https://developer.twitter.com/en/apply/user.html): For getting the Bearer token to make valid requests to Twitter API. <br>

- [Binance Testnet Keys](https://testnet.binance.vision): The keys are required to place orders programatically on the Binance Testnet exchange. It can be obtained by signing in with  your GitHub account.

### Installation

1. Clone the repo :
   ```sh
   git clone https://github.com/PraneshASP/crypto-trading-bot.git
   ```
2. Install dependencies (use `sudo` if required) :

   ```sh
   npm install
   ```

3. Copy `.env.example` file into `.env` and add the specified keys/tokens :


4. Start the bot :
   ```sh
   npm start
   ```
