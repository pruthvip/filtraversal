'use strict';

var appDirectory = {
    a: {
        b: 1,
        c: {
            d: 1
        }
    }
};

var appPresentWorkingDirectoryPath = '/';

function splitCommandAndInput(inputString) {
    var command;
    var input;

    inputString = inputString.split(' ');     //split by spaces
    command = inputString.shift();  // get the first command
    input = inputString.join(' ');  //and the rest of the string as input
    input = input.trim();


    return {
        command: command,
        input: input
    }
}


function addFolderToDirectory(input, folderPath) {
    var currentProcessingObject = appDirectory;
    var error;

    var folderPathLength = folderPath.length;

    // traverse the directory object using the file path
    folderPath.every(function (f, i) {
        if (i === folderPathLength - 1) {
            return false;
        }

        if (!currentProcessingObject[f]) {
            error = 'Error' + f + 'Not present';
            return false;
        }

        // traversing
        currentProcessingObject = currentProcessingObject[f];
        return true;

    });

    if (error) {
        return error;
    }

    if (currentProcessingObject[folderPath[folderPathLength - 1]][input]) {
        return 'File already exists, try a different name';
    } else {
        currentProcessingObject[folderPath[folderPathLength - 1]][input] = 1;
    }


    return 'File successuly added!!!\n $ ';

}


function getInputIndirectoryFormat(input) {
    var inputDirectoryPathArray = input.split('/');
    if (input[0] === '/') {
        inputDirectoryPathArray.shift();
    }

    return inputDirectoryPathArray;
}

function changeDirectory(input) {
    var directoryPathArray;
    var error;

    var newDirectoryPath = '/';
    var currentDirectory = appDirectory;

    if (!input && input === '/') {
        appPresentWorkingDirectoryPath = '/';
        return 'Moved to root  /n $'
    } else {
        if (input[0] === '/') {
            directoryPathArray = getInputIndirectoryFormat(input);
        } else {
            directoryPathArray = getInputIndirectoryFormat(appPresentWorkingDirectoryPath).concat(getInputIndirectoryFormat(input));
        }

        directoryPathArray.every(function (folder, i) {

            if (!currentDirectory[folder]) {
                error = folder + 'folder doesnt exist';
                return false;
            }

            newDirectoryPath = newDirectoryPath + '/' + folder;

            currentDirectory = currentDirectory[folder];
            return true;
        });

        if (error) {
            return error;
        }

        appPresentWorkingDirectoryPath = newDirectoryPath;
        return 'You are now on' + appPresentWorkingDirectoryPath;
    }
}


function removeDirectory(input) {
    var directoryPathArray;
    var error;
    var currentDirectory = appDirectory;

    if (input[0] === '/') {
        directoryPathArray = getInputIndirectoryFormat(input);
    } else {
        directoryPathArray = getInputIndirectoryFormat(appPresentWorkingDirectoryPath).concat(getInputIndirectoryFormat(input));
    }

    console.log('diretory arrray is', directoryPathArray, directoryPathArray.length);

    var directoryPathLength = directoryPathArray.length;

    directoryPathArray.every(function (folder, i) {

        console.log('hey', folder, i, currentDirectory[folder]);

        if (!currentDirectory[folder]) {
            error = folder + 'folder doesnt exist';
            return false;
        }

        if (i === directoryPathLength - 1) {
            console.log('deleting ', currentDirectory);
            delete currentDirectory[folder];

            return false;
        }

        currentDirectory = currentDirectory[folder];

        return true;
    });

    if (error) {
        return error;
    }

    return 'File succesfully deleted';
}


function executeFunction(command, input) {
    switch (command) {
        // case of change directory
        case 'cd':
            return changeDirectory(input);

            break;

        // making a new directory
        case 'mkdir':
            var presentDirectoryArray = appPresentWorkingDirectoryPath.split('/');

            if (input) {
                var inputPathArray = getInputIndirectoryFormat(input);
                var folderNameTobeAdded;
                if (inputPathArray.length === 1) {
                    folderNameTobeAdded = inputPathArray[0];
                } else {
                    folderNameTobeAdded = inputPathArray.pop();
                    presentDirectoryArray = presentDirectoryArray.concat(inputPathArray);
                }

                return addFolderToDirectory(folderNameTobeAdded, presentDirectoryArray);

            } else {
                return 'Wrong input, filename not present, USAGE: `mkdir filname`\n';
            }

            break;
        case 'rm':
            if (input) {

            } else {
                return 'File name not specified, USAGE: rm filepath'
            }

            break;
        case 'pwd':
            if (!input) {
                return 'Current working diretory is' + appPresentWorkingDirectoryPath + '\n';
            } else {
                return 'Wrong input, USAGE: `pwd` \n';
            }

            break;
        // session clear cse
        case 'session':
            if (input === 'clear') {
                appDirectory = {};
                appPresentWorkingDirectoryPath = '/';
                return 'Session has been cleared, all files deleted, you are in the root folder \n $ ';
            }
        default:
            return 'Wrong input\n $ ';
    }
}

function commandEntered(inputString) {
    inputString = inputString.trim();


    // no input given
    if (!inputString) {
        return null;
    }


    // code for extracting the command
    var command = splitCommandAndInput(inputString).command;
    var input = splitCommandAndInput(inputString).input;

    // execute the function
    var result = executeFunction(command, input);

    return result;
}