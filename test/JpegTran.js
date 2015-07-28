/*global describe, it, __dirname, setTimeout*/
var expect = require('unexpected').clone().use(require('unexpected-stream')),
    JpegTran = require('../lib/JpegTran'),
    Path = require('path'),
    fs = require('fs');

describe('JpegTran', function () {
    it('should produce a smaller file when run with -grayscale', function () {
        return expect(
            fs.createReadStream(Path.resolve(__dirname, 'turtle.jpg')),
            'when piped through',
            new JpegTran(['-grayscale']),
            'to yield output satisfying',
            function (resultJpegBuffer) {
                expect(resultJpegBuffer.length, 'to be within', 0, 105836);
            }
        );
    });

    it('should not emit data events while paused', function (done) {
        var jpegTran = new JpegTran(['-grayscale']);

        function fail() {
            done(new Error('JpegTran emitted data while it was paused!'));
        }
        jpegTran.pause();
        jpegTran.on('data', fail).on('error', done);

        fs.createReadStream(Path.resolve(__dirname, 'turtle.jpg')).pipe(jpegTran);

        setTimeout(function () {
            jpegTran.removeListener('data', fail);
            var chunks = [];

            jpegTran
                .on('data', function (chunk) {
                    chunks.push(chunk);
                })
                .on('end', function () {
                    expect(Buffer.concat(chunks).length, 'to be within', 0, 105836);
                    done();
                });

            jpegTran.resume();
        }, 1000);
    });

    it('should emit an error if an invalid image is processed', function (done) {
        var jpegTran = new JpegTran();
        jpegTran.on('error', function (err) {
            done();
        }).on('data', function (chunk) {
            done(new Error('JpegTran emitted data when an error was expected'));
        }).on('end', function (chunk) {
            done(new Error('JpegTran emitted end when an error was expected'));
        });

        jpegTran.end(new Buffer('qwvopeqwovkqvwiejvq', 'utf-8'));
    });

    it('should emit a single error if an invalid command line is specified', function (done) {
        var jpegTran = new JpegTran(['-optimize', 'qcwecqweqbar']),
            seenError = false;
        jpegTran.on('error', function (err) {
            if (seenError) {
                done(new Error('More than one error event was emitted'));
            } else {
                seenError = true;
                setTimeout(done, 100);
            }
        }).on('data', function (chunk) {
            done(new Error('JpegTran emitted data when an error was expected'));
        }).on('end', function (chunk) {
            done(new Error('JpegTran emitted end when an error was expected'));
        });

        jpegTran.end(new Buffer('qwvopeqwovkqvwiejvq', 'utf-8'));
    });
});
