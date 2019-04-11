require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys);
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

var commands = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

userInputs(commands, userSearch);

function userInputs(commands, userSearch) {
    switch (commands) {
        case "concert-this":
            concertThis(userSearch);
            break;
        case "spotify-this-song":
            spotifyThis(userSearch);
            break;
        case "movie-this":
            movieThis(userSearch);
            break;
        case "do-what-it-says":
            doWhatItSays()
            break;
        default:
            console.log("invalid selection.\nPlease type 'concert-this', 'spotify-this-song', 'movie-this' or 'do-what-it-says' \nfollowed by an artist, song or movie.")
    }
}

function concertThis(userSearch) {
    var artist = userSearch;
    axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log(artist + " is touring in these locations:");
            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("City: " + response.data[i].venue.city + " Country: " + response.data[1].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'));
                console.log("----------------------")
            }
        });
};

function spotifyThis(userSearch) {
    var song = userSearch;
    axios
    spotify.search({ type: 'track', query: song })
        .then(function (response) {
            var chewbacca = response.tracks.items;
            for (var i = 0; i < chewbacca.length; i++) {
                console.log("Artist name: " + chewbacca[i].album.artists[0].name);
                console.log("Track name: " + chewbacca[i].name);
                console.log("Link to song: " + chewbacca[i].external_urls.spotify)
                console.log("Album name: " + chewbacca[i].album.name);
                console.log("----------------------")
            };
        })
        .catch(function (err) {
            console.log(err);
        })
};

function movieThis(userSearch) {
    var movie = userSearch;
    axios
        .get("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Date: " + response.data.Released);
            console.log("Imdb Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country of Origin: " + response.data.Country);
            console.log("Language of Movie: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            console.log(error);
        }

        var dataArr = data.split(",");
        userInputs(dataArr[0], dataArr[1]);

    })
};