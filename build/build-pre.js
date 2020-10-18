const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
const package = require('../package.json');
const envDevFilePath = path.join(__dirname + '/../src/environments/environment.ts');
const envProdFilePath = path.join(__dirname + '/../src/environments/environment.prod.ts');
const appFilePath = path.join(__dirname + '/../src/assets/app.json');

const appJSON = require(appFilePath);
const appVersion = package.version;
const appName = package.name;
const appTitle = appJSON.title;

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename, enc) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data){
            if (err) 
                reject(err); 
            else
                resolve(data);
        });
    });
};


function updateAppJSONFile(filename) {
    new Promise(function(resolve, reject) {
        let src = '{\n' +
        '    "title": "'+appTitle+'",\n' +
        '    "name": "'+appName+'",\n' +
        '    "version": "'+appVersion+'"\n' +
        '}\n';
        fs.writeFile(filename, src, { flat: 'w' }, function (err) {
            if (err) {
                console.error("Error trying to write data json file: ", filename);
                return reject(err);
            }
    
            console.log(`${colors.green('Writing data json to ')}${colors.yellow(filename)}`);
            // console.log(`${src}`);
            resolve(JSON.parse(src));
        });    
    });
}

function updateEnviromentFiles(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFileAsync(filename, 'utf8').then(data => {
            let extract = "export const environment = ";
            if (data.indexOf(extract) == 0) {
                data = data.substr(data.indexOf("{"), data.indexOf("}")-data.indexOf("{")+1);
                let environment = null;
                try {
                    environment = JSON.parse(data);
                } catch (e) {
                    console.error("Error trying to extract current values from enviroment file");
                    console.log("   " + filename);
                    console.error("Can't be parse a JSON from enviroment code:", data);
                    reject(e);
                } 
    
                environment.title = appTitle;
                environment.name = appName;
                environment.version = appVersion;
    
                let src = extract + JSON.stringify(environment, null, 4) + ";\n";
                fs.writeFile(filename, src, { flat: 'w' }, function (err) {
                    if (err) {
                        console.error("Error trying to write enviroment file: ", filename);
                        return reject(err);
                    }
                    console.log(`${colors.green('Writing environment to ')}${colors.yellow(filename)}`);
                    // console.log(`${src}`);
                    resolve(environment);
                });
            }
        }).catch(e => {
            throw e;
        });        
    });
}

console.log(colors.cyan('\nRunning pre-build tasks'));


Promise.all([
    updateEnviromentFiles(envProdFilePath),
    updateEnviromentFiles(envDevFilePath),
    updateAppJSONFile(appFilePath)
]).then(function(result) {
    // console.log("result", result);
})

