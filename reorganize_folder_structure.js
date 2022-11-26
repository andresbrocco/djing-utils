// This script copy the contents of a folder containing local music files
// organized in the following way:
// - Artist(s)
//   - Album
//     - Tracks
// and reorganizes them in the following way:
// - Album
//   - Tracks

// Import library to open dialog window to select folder
var dialog = require('dialog-node');

// Import library to manipulate files
var fs = require('fs');

// Import library to manipulate paths
var path = require('path');

var originFolder = "";
var destinationFolder = "";
var callback_origin_folder = function(code, retVal, stderr) {
    originFolder = retVal;
    dialog.entry('Enter the destination folder', "Destination Folder", 0, callback_destination_folder);
}
var callback_destination_folder = function(code, retVal, stderr) {
    destinationFolder = retVal;
    main(originFolder, destinationFolder);
}
dialog.entry('Enter the origin folder', "Origin Folder", 0, callback_origin_folder);

// Main function
function main(originFolder, destinationFolder) {
    // Check if origin folder exists
    if (!fs.existsSync(originFolder)) {
        console.log("Origin folder does not exist");
        return;
    }
    // Check if destination folder exists
    if (!fs.existsSync(destinationFolder)) {
        console.log("Destination folder does not exist");
        return;
    }

    // Get list of artists
    var artists = fs.readdirSync(originFolder);

    // Loop through artists
    for (var i = 0; i < artists.length; i++) {
        // Get artist name
        var artist = artists[i];
        if(artist == ".DS_Store" || !fs.lstatSync(path.join(originFolder, artist)).isDirectory()) {
            console.log("Skipping " + artist);
            continue;
        }
        // Get list of albums
        var albums = fs.readdirSync(path.join(originFolder, artist));
        // Loop through albums
        for (var j = 0; j < albums.length; j++) {
            // Get album name
            var album = albums[j];
            // check if album is a directory
            if(album == ".DS_Store" || !fs.lstatSync(path.join(originFolder, artist, album)).isDirectory()) {
                console.log("Skipping " + album);
                continue;
            }
            // Get list of tracks
            var tracks = fs.readdirSync(path.join(originFolder, artist, album));
            if(tracks.length != 0) {
                // Create album folder
                var albumFolder = path.join(destinationFolder, album);
                if (!fs.existsSync(albumFolder)) {
                    fs.mkdirSync(albumFolder);
                }
                // Loop through tracks
                for (var k = 0; k < tracks.length; k++) {
                    // Get track name
                    var track = tracks[k];
                    if(track == ".DS_Store" || fs.lstatSync(path.join(originFolder, artist, album, track)).isDirectory()) {
                        console.log("Skipping " + track);
                        continue;
                    }
                    // Copy track to destination folder
                    fs.copyFileSync(path.join(originFolder, artist, album, track), path.join(destinationFolder, album, track));
                }
            }
        }
    }
}
