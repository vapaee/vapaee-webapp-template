const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
const package = require('../package.json');
const appFilePath = path.join(__dirname + '/../src/assets/app.json');
const appJSON = require(appFilePath);
const appVersion = package.version;
const appName = package.name;
const appTitle = appJSON.title;


console.log(colors.cyan('\nRunning pre-build tasks'));



const src = `{
    "title: "${appTitle}",
    "name": "${appName}",
    "version": "${appVersion}"
};
`;

// ensure version module pulls value from package.json
fs.writeFile(appFilePath, src, { flat: 'w' }, function (err) {
    if (err) {
        return console.log(colors.red(err));
    }

    console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));
    console.log(`${colors.green('Writing version module to ')}${colors.yellow(appFilePath)}\n`);
});
