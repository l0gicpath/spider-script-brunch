var spiderscript = require('spider-script');

function SpiderScriptCompiler(config) {
  if (config == null) config = {};
  var plugin = config.plugins && config.plugins.spiderscript;
  this.generateSourceMap = plugin && plugin.generateSourceMap;
  this.strict = plugin && plugin.strict;
  // this.sourceMaps = !!config.sourceMaps;
  this.target = plugin && plugin.target
}

SpiderScriptCompiler.prototype.brunchPlugin = true;
SpiderScriptCompiler.prototype.type = 'javascript';
SpiderScriptCompiler.prototype.extension = 'spider';
SpiderScriptCompiler.prototype.pattern = /\.spider$/;

SpiderScriptCompiler.prototype.compile = function(data, path, callback) {
  var options = {
    sourceMap: this.generateSourceMap || true,
    strict: this.strict || true,
    target: this.target || 'ES5'
  };
  var compiled = spiderscript.compile({
    text: data,
    fileName: path,
    target: options.target,
    generateSourceMap: options.sourceMap,
    useStrict: options.strict
  });
  if (compiled.errors.length) {
    return callback(spiderscript.formatError(path, data, compiled.errors))
  }
  var result = (options.sourceMap && typeof compiled === 'object') ? {
    data: compiled.result,
    map: compiled.sourceMap
  } : {
    data: compiled.result
  };
  return callback(null, result);
};

module.exports = SpiderScriptCompiler;
