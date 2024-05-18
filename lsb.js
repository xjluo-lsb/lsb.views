/*!
    Copyright (C) xjluo@hotmail.com, 2023 -

    This is the file that contains JavaScript support code to be used in the WebViews in the LSB.

    Please do not edit the lsb.js directly. Instead, make your change in the lsb.ts and run following command,
        tsc lsb.ts --outFile lsb.js
    to re-generate the lsb.js.
*/
"use strict";
;
if (!String.prototype.format) {
    // This function uses this string as format string
    String.prototype.format = function () {
        var replacements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            replacements[_i] = arguments[_i];
        }
        return this.replace(/{(\d+)}/g, function (match, index) {
            return typeof replacements[index] === 'undefined' ? match : replacements[index];
        });
    };
}
if (!String.prototype.join) {
    // This function uses this string as delimeter for joining the strings
    String.prototype.join = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return items.filter(function (item) { return item; }).join(this);
    };
}
if (window && !window.onerror) {
    window.onerror = function (event, source, lineno, colno, error) {
        var lineInfo = "line: " + lineno + ((colno === undefined) ? "" : (" / column: " + colno));
        var message = "Accessing URL: " + source + "\nMessage: " + event + "\n" + lineInfo;
        message += (error === undefined) ? "" : ("\nerror: " + error);
        alert(message);
        return true;
    };
}
//! ScriptFile class definition for loading JavaScript file and dependencies into browser
var ScriptFile = /** @class */ (function () {
    //! Constructor for ScriptFile
    //! @param path         File path to the JavaScript file
    //! @param dependencies The dependency script files for the current script file
    function ScriptFile(path, dependencies) {
        // The file path to the JavaScript file cannot be empty
        if (path.length == 0) {
            throw 'The path for ScriptFile cannot be empty!';
        }
        this.filePath = path;
        this.dependencyFiles = [];
        if (dependencies !== undefined) {
            this.addDependencies(dependencies);
        }
    }
    //! Start loading of the specified script file
    //! @param file: The script file to be loaded
    ScriptFile.startLoading = function (file) {
        // If the script file has already been loaded or it is in loading, the dependencies of the
        // script should have already been loaded or in loading as well. No need to work on it.
        if (ScriptFile.loadedScripts.hasOwnProperty(file.filePath)) {
            return;
        }
        // We need to load the file - set the flag for it and load all the dependencies first.
        ScriptFile.loadedScripts[file.filePath] = false;
        file.dependencyFiles.forEach(function (dependency) { return ScriptFile.startLoading(dependency); });
        // Now start real loading work for the requested file
        //   adding script tag for the script into the head element
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = (ScriptFile.httpPattern.test(file.filePath) ? '{0}' : 'file://{0}').format(file.filePath);
        script.onload = function () { return ScriptFile.completeLoading(file); };
        ScriptFile.headElement.appendChild(script);
    };
    //! Complete loading of the specified script file
    //! @param file The script file to be marked as completed loading
    ScriptFile.completeLoading = function (file) {
        ScriptFile.loadedScripts[file.filePath] = true;
        if (ScriptFile.completeLoadingHandler !== undefined && ScriptFile.areAllScriptFilesLoaded()) {
            ScriptFile.completeLoadingHandler();
            ScriptFile.completeLoadingHandler = undefined;
        }
    };
    //! Function to check if all the script files and dependencies are loaded
    //! @return True if all requested script files are loaded, otherwise false is returned.
    ScriptFile.areAllScriptFilesLoaded = function () {
        var files = Object.getOwnPropertyNames(ScriptFile.loadedScripts);
        return files.every(function (file) { return ScriptFile.loadedScripts[file]; });
    };
    //! \brief The only public static method for loading the specified script files.
    //! When all the files and their dependencies are loaded, the callback function will be triggered if it exists.
    //! @param files    The script files to be loaded
    //! @param callback The callback function to be called after all script files are loaded
    ScriptFile.load = function (files, callback) {
        ScriptFile.completeLoadingHandler = callback;
        files.forEach(function (file) { return ScriptFile.startLoading(file); });
        // There is possibility that all the specified script files are all loaded in browser. In this case, there
        // will be no opportunity for the callback to be triggered. We kick it off now.
        if (ScriptFile.completeLoadingHandler !== undefined && ScriptFile.areAllScriptFilesLoaded()) {
            ScriptFile.completeLoadingHandler();
            ScriptFile.completeLoadingHandler = undefined;
        }
    };
    //! Add more dependency script files for current script file
    ScriptFile.prototype.addDependency = function (denpendency) {
        if (denpendency instanceof ScriptFile) {
            this.addScriptDependency(denpendency);
        }
        else {
            this.addScriptDependency(new ScriptFile(denpendency));
        }
    };
    //! Add multiple dependency script files for current script file
    ScriptFile.prototype.addDependencies = function (dependencies) {
        var _this = this;
        dependencies.forEach(function (value) { return _this.addDependency(value); });
    };
    //! Implementation of adding a script file as dependency for current script file
    //! @param file The script file to be added as dependency of current file
    ScriptFile.prototype.addScriptDependency = function (file) {
        // We only add it as new dependency if it does not exist in the dependencies
        if (!this.isDependencyOf(file.filePath, this)) {
            this.dependencyFiles.push(file);
        }
    };
    //! Check if the specified is already a dependency or dependency of dependencies of specified script file
    ScriptFile.prototype.isDependencyOf = function (filePath, dependent) {
        var _this = this;
        return filePath == dependent.filePath ||
            dependent.dependencyFiles.some(function (file) { return _this.isDependencyOf(filePath, file); });
    };
    //! The header element for the current HTML document
    ScriptFile.headElement = document.getElementsByTagName('head')[0];
    //! The regular expression pattern for checking if file path contains valid protocol
    ScriptFile.httpPattern = /^(http|https|file)\:\/\//i;
    /*!
        The mapping of all loaded scripts and the loading status
          true - the script file has already been successfully loaded
          false - the script file is already in loading
    */
    ScriptFile.loadedScripts = {};
    return ScriptFile;
}());
;
//! StyleFile class definition for loading CSS style files
var StyleFile = /** @class */ (function () {
    function StyleFile() {
    }
    //! Start loading of the specified style file
    StyleFile.startLoading = function (filePath) {
        // If loaded style files already has an entry in the mapping, it means the file is  already 
        //loaded or at least is in loading, no need to work on it.
        if (StyleFile.loadedStyles.hasOwnProperty(filePath)) {
            return;
        }
        // We need to load the file - add the file and set value to false means it's in loading
        StyleFile.loadedStyles[filePath] = false;
        // Now start real loading work - add link tag for the style into the head element
        var css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = (StyleFile.httpPattern.test(filePath) ? '{0}' : 'file://{0}').format(filePath);
        css.onload = function () { return StyleFile.completeLoading(filePath); };
        StyleFile.headElement.appendChild(css);
    };
    //! Complete loading of the specified style file
    //! @param filePath The style file to be marked as completed loading
    StyleFile.completeLoading = function (filePath) {
        StyleFile.loadedStyles[filePath] = true;
        if (StyleFile.completeLoadingHandler !== undefined && StyleFile.areAllStyleFilesLoaded()) {
            StyleFile.completeLoadingHandler();
            StyleFile.completeLoadingHandler = undefined;
        }
    };
    //! Function to check if all the style files are loaded
    //! @return True if all requested style files are loaded, otherwise false is returned
    StyleFile.areAllStyleFilesLoaded = function () {
        var files = Object.getOwnPropertyNames(StyleFile.loadedStyles);
        return files.every(function (file) { return StyleFile.loadedStyles[file]; });
    };
    //! \brief The only public static method for loading the specified style files.
    //! When all the files are loaded, the callback function will be triggered if it exists.
    //! @param files    The style files to be loaded
    //! @param callback The callback function to be called after all style files are loaded
    StyleFile.load = function (files, callback) {
        StyleFile.completeLoadingHandler = callback;
        files.forEach(function (file) { return StyleFile.startLoading(file); });
        // There is possibility that all the specified style files are all loaded in browser.
        // In this case, there will be no opportunity for the callback to be triggered.
        if (StyleFile.completeLoadingHandler !== undefined && StyleFile.areAllStyleFilesLoaded()) {
            StyleFile.completeLoadingHandler();
            StyleFile.completeLoadingHandler = undefined;
        }
    };
    //! The header element for the current HTML document
    StyleFile.headElement = document.getElementsByTagName('head')[0];
    //! The regular expression pattern for checking if file path contains valid protocol
    StyleFile.httpPattern = /^(http|https|file)\:\/\//i;
    /*!
        The mapping of all loaded CSS files and the loading status
          true - the style file has already been successfully loaded
          false - the style file is already in loading
    */
    StyleFile.loadedStyles = {};
    //! The callback function to be called when all style files are loaded
    StyleFile.completeLoadingHandler = undefined;
    return StyleFile;
}());
;
//! The class contains all helper functions for sending data out from WebView in LSB
var lsb = /** @class */ (function () {
    function lsb() {
    }
    //! \brief Send out name and value through query string in URL
    //! @param name  The name of the data to be sent out
    //! @param value The value of the data to be sent out
    lsb.sendValue = function (name, value) {
        if (name.length > 0 && value != null) {
            var queryName = encodeURIComponent(name);
            var queryValue = encodeURIComponent(value);
            window.location.href = "lsb://sendValue?{0}={1}".format(queryName, queryValue);
        }
    };
    //! \brief Send out data object through query string in URL
    //! @param data The data object to be sent out
    lsb.sendObject = function (data) {
        var properties = Object.getOwnPropertyNames(data);
        if (properties.length > 0) {
            var items = properties.map(function (property) {
                var queryName = encodeURIComponent(property);
                var queryValue = encodeURIComponent(data[property]);
                return "{0}={1}".format(queryName, queryValue);
            });
            window.location.href = "lsb://sendValue?{0}".format(items.join("&"));
        }
    };
    //! \brief Send out complicated data object through hidden form
    //! @param data The data object to be sent out
    lsb.sendData = function (data) {
        var properties = Object.getOwnPropertyNames(data);
        if (properties.length > 0) {
            var items = properties.map(function (property) {
                // Create the input element for the property to store value in the page
                var id = "__{0}__".format(property);
                var element = document.getElementById(id);
                if (element == null) {
                    element = document.createElement("input");
                    element.type = "hidden";
                    element.id = id;
                    document.body.appendChild(element);
                }
                // Set the value into the input value, return the ID out
                element.value = data[property];
                var queryName = encodeURIComponent(property);
                var queryValue = encodeURIComponent(id);
                return "{0}={1}".format(queryName, queryValue);
            });
            window.location.href = "lsb://sendData?{0}".format(items.join("&"));
        }
    };
    //! \brief Show message from the WebView content
    //! @param message The message to be displayed through LSB view
    lsb.showMessage = function (message) {
        // @ts-expect-error The lsbView is defined from the WebView control
        window.lsbView.postMessage(message);
    };
    //! \brief The method for loading the specified script files. When all the files and their
    //！dependencies are loaded, the callback function will be triggered if it exists.
    //! @param files    The script files to be loaded
    //! @param callback The callback function to be called after all script files are loaded
    lsb.loadScript = function (files, callback) {
        if (Array.isArray(files)) {
            ScriptFile.load(files, callback);
        }
        else {
            ScriptFile.load([files], callback);
        }
    };
    //! \brief The method for loading the specified style files. When all the files are loaded,
    //! the callback function will be triggered if it exists.
    //! @param files    The style files to be loaded
    //! @param callback The callback function to be called after all style files are loaded
    lsb.loadStyle = function (files, callback) {
        if (Array.isArray(files)) {
            StyleFile.load(files, callback);
        }
        else {
            StyleFile.load([files], callback);
        }
    };
    return lsb;
}());
;
