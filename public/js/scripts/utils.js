var utils = {};

// delegates to hljs.
utils.syntaxHighlight = function(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 4);
    }
    return hljs.highlight('json', json, true).value;
};
