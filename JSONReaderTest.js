var test = require('tape');
var JSONReader = require('./index');
var Transform = require('stream').Transform;
var Writable = require('stream').Writable;
var util = require('util');
var WriteTest = require('stream-write-test');

test('json reader test', function(t) {
    var testChunks = ['{', '"a": 3', '}'];
    var testChunks2 = ['{', '"a": [3,4,', '5]', '}'];

    var chunk1 = testChunks.join('');
    var chunk2 = testChunks2.join('');
    var expectedChunks = [chunk1, chunk2];
    console.log('expected chunks: ' + expectedChunks);

    t.plan(expectedChunks.length);

    var jsonReader = new JSONReader();
    var writeTest = new WriteTest({testChunks:expectedChunks, test: t});

    jsonReader.on('json', function(json) {
        var object = JSON.parse(json);
    })

    //jsonReader.pipe(process.stdout);
    jsonReader.pipe(writeTest);

    for (var i = 0 ; i < testChunks.length ; i++) {
        jsonReader.write(testChunks[i]);
    }

    for (var i = 0 ; i < testChunks2.length ; i++) {
        jsonReader.write(testChunks2[i]);
    }

    jsonReader.end();
})
