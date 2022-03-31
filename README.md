# DeptoBot
A NodeJS scrapper bot that notifies you when a new apartment is listed. 

I wrote this to help a friend find an apartment, it's difficult to find something in La Plata...

### Installation
Just clone the repo:  
`$ git clone https://github.com/SantiColu/depto-bot.git`

Install Node dependencies  
`$ npm install`

Open the `config.js` and configure
  - your Discord webhook url (`WEBHOOK_URL`)
  - the ZonaProp search url (with filters and parameters) (`SEARCH_URL`)

Run it :)  
`$ npm run start`

### Supported pages:
By now it only supports ZonaProp, i really don't know if i will add more...
