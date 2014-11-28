var util = require('util');
var Transform = require('stream').Transform;

function JSONReader(options) {
    if (!(this instanceof JSONReader)) {
        return new JSONReader(options);
    }
    this._reset();
    Transform.call(this, options);
}
util.inherits(JSONReader, Transform);

JSONReader.prototype._transform = function(chunk, encoding, callback) {
    var chunkString = chunk.toString('utf8');
    this.jsonBuffer += chunkString;

    while( this.position < this.jsonBuffer.length) {
        var i = this.position;
        if (this.jsonBuffer[i] === '{') {
            this.openCurlies.push(i)
        } else if (this.jsonBuffer[i] === '}') {
            var start = this.openCurlies.pop(i)
            var end = i;
            if (this.openCurlies.length === 0) {
                var json = this.jsonBuffer.slice(start, end+1);
                this.push(json, 'utf8');
                this.emit('json', json);
                callback();
                this._reset();
                return;
            }
        }
        this.position++;

    }
    callback();
}

JSONReader.prototype._reset = function() {
    this.jsonBuffer = ''
    this.position = 0;
    this.openCurlies = [];
}


module.exports = JSONReader;
