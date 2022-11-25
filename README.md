# GlobalReplays
GOKZ global replay viewer

[Link to current implementation](http://gokzmaptest.site.nfoservers.com/GlobalReplays/)

# For developers

Some maps are included in resources/ for testing. To convert all maps use [sourceutils](https://github.com/Metapyziks/SourceUtils) (see [here](https://github.com/Metapyziks/GOKZReplayViewer) for documentation).

The way this is set up is that you have to have a web server with a directory named GlobalReplays/ with this repo's contents in it.

The build.py script basically just copies necessary files to the build/ folder and replaces the ${VERSION} string in index.html with a unix timestamp, so the client's cache is "invalidated".
