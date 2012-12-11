node-jpegtran
=============

The jpegtran command line utility as a readable/writable stream.

If you don't have a `jpegtran` binary in your PATH, `node-jpegtran`
will try to use one of the binaries provided by <a
href="https://github.com/yeoman/node-jpegtran-bin">the node-jpegtran-bin
package</a>.

The constructor optionally takes an array of command line options for
the `jpegtran` binary:

```javascript
var JpegTran = require('jpegtran'),
    myJpegTranslator = new JpegTran(['-rotate', 90, '-progressive']);

sourceStream.pipe(myJpegTranslator).pipe(destinationStream);
```

JpegTran as a web service (sends back a horizontally flipped grayscale
version of the request body):

```javascript
var JpegTran = require('jpegtran'),
    http = require('http');

http.createServer(function (req, res) {
    if (req.headers['content-type'] === 'image/jpeg') {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        req.pipe(new JpegTran(['-grayscale', '-flip', 'horizontal'])).pipe(res);
    } else {
        res.writeHead(400);
        res.end('Feed me a JPEG!');
    }
}).listen(1337);
```

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install jpegtran

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
