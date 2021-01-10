var express = require("express");
var fs = require('fs');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var axios = require('axios');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

let userId;

let rawdata = fs.readFileSync("./settings.json");
let settings = JSON.parse(rawdata);

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Hello World!");
});

app.get('/user/:userName', function (req, res) {
    //https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL
    let getIdURL = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${settings.steamApiKey}&vanityurl=${req.params.userName}`;

    axios.get(getIdURL)
    .then((response) => {
      userId = response.data.response.steamid;
      let getGamesURL = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${settings.steamApiKey}&steamid=${userId}format=json&include_appinfo=true`;

      axios.get(getGamesURL)
      .then((response) => {
        let steamData = response.data;
  
        res.send(steamData);
      });
    });
})

app.use(router);

app.listen(settings.port, function() {
  console.log(`Node server running on http://localhost:${settings.port}`);
});