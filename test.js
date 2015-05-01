var expect = require('chai').expect;
var Plugin = require('./');

function stripLinebreaks(str) {
  return str.replace(/(\r\n|\n|\r)/gm,"");
}

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result #ES5 #TraceurRuntime', function(done) {
    var content = '::console.log("Hello World!");';
    var expected = '\
$traceurRuntime.ModuleStore.getAnonymousModule(function() {\
  "use strict";\
  console.log("Hello World!");\
  return {};\
});\
\
//# sourceMappingURL=file.map';

    plugin.compile(content, 'file.spider', function(error, data) {
      expect(error).not.to.be.ok;
      expect(stripLinebreaks(data.data)).to.equal(stripLinebreaks(expected));
      done();
    });
  });

  it('should produce source maps explicitly #ES5 #TraceurRuntime', function(done) {
    plugin = new Plugin({generateSourceMap: true});

    var content = '::console.log("Hello World!");';
    var expected = '\
$traceurRuntime.ModuleStore.getAnonymousModule(function() {\
  "use strict";\
  console.log("Hello World!");\
  return {};\
});\
\
//# sourceMappingURL=file.map';

    plugin.compile(content, 'file.spider', function(error, data) {
      expect(error).not.to.be.ok;
      expect(stripLinebreaks(data.data)).to.equal(stripLinebreaks(expected));
      expect(data.map).to.be.a('string');
      done();
    });
  });

  it('should not produce source maps #ES5 #TraceurRuntime', function(done) {
    plugin = new Plugin({generateSourceMap: false});
    var content = '::console.log("Hello World!");';
    plugin.compile(content, 'file.spider', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.map).to.be.undefined;
      done();
    });
  });

  it('should not have "use strict" in output #ES6', function(done) {
    plugin = new Plugin({strict: false, target: 'ES6'});
    var content = '::console.log("Hello World!");';
    var expected = '\
(function () {\
    console.log("Hello World!");\
}());\
\
//# sourceMappingURL=file.map';

    plugin.compile(content, 'file.spider', function(error, data) {
      expect(error).not.to.be.ok;
      expect(stripLinebreaks(data.data)).to.equal(stripLinebreaks(expected));
      done();
    });
  });
});