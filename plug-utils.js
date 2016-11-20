'use strict';

module.exports = {
    replaceCode: function(content, variable, replacement) {
        var re = new RegExp('{{' + variable + '}}', 'g');
        return content.replace(re, replacement);
    },

    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}