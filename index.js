var spiderscript = require('spider-script');

function defaultFor(arg, val) {
  return typeof arg !== 'undefined' ? arg : val;
}

function SpiderScriptCompiler(config) {
  if (config == null) config = {};
  var plugin = config.plugins && config.plugins.spiderscript;
  this.sourceMap = (plugin && plugin.generateSourceMap) || config.generateSourceMap;
  this.strict = (plugin && plugin.strict) || config.strict;
  this.target = (plugin && plugin.target) || config.target;
}

SpiderScriptCompiler.prototype.brunchPlugin = true;
SpiderScriptCompiler.prototype.type = 'javascript';
SpiderScriptCompiler.prototype.extension = 'spider';
SpiderScriptCompiler.prototype.pattern = /\.spider$/;

SpiderScriptCompiler.prototype.compile = function(data, path, callback) {
  var options = {
    sourceMap: defaultFor(this.sourceMap, true),
    strict: defaultFor(this.strict, true),
    target: defaultFor(this.target, 'ES5')
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
