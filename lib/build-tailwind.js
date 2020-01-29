'use strict';

const BroccoliPlugin = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs-extra');
const postcss = require('postcss');
const easyImport = require('postcss-easy-import');
const tailwind = require('tailwindcss');
const Rollup = require('broccoli-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

/*
  Pass in an addon instance.
*/
module.exports = function(addon) {
  let tailwindAddon;
  if (addon.pkg.name === 'ember-cli-tailwind') {
    tailwindAddon = addon;
  }
  else {
    tailwindAddon = addon.findOwnAddonByName('ember-cli-tailwind');
  }

  const inputPath = tailwindAddon.tailwindInputPath;
  const config = tailwindAddon._config();

  const tailwindConfigTree = new Rollup(inputPath, {
    rollup: {
      input: 'config/tailwind.js',
      output: {
        file: 'tailwind-config.js',
        format: 'cjs'
      },
      plugins: [
        resolve(),
        commonjs()
      ]
    }
  });

  return new BuildTailwindPlugin([ inputPath, tailwindConfigTree ], {
    srcFile: config.modulesFile || 'modules.css',
    cacheInclude: [/.*\.(js|css)$/],

    // pass additional options to buildTailwind
    easyImportOptions: config.easyImport || {},
    outputFile: config.outputFile || 'tailwind.css',
  });
}

class BuildTailwindPlugin extends BroccoliPlugin {

  constructor(inputTrees, options) {
    super(inputTrees, options);
    this.srcFile = options.srcFile;
    this.didBuild = options.didBuild;

    // added options in our fork
    this._easyImportOptions = options.easyImportOptions;
    this._outputFile = options.outputFile;
  }

  build() {
    let modulesFile = path.join(this.inputPaths[0], this.srcFile);
    let configFile = path.join(this.inputPaths[1], 'tailwind-config.js');
    let outputFile = path.join(this.outputPath, this._outputFile);

    return postcss([
      easyImport(this._easyImportOptions),
      tailwind(configFile)
    ])
    .process(fs.readFileSync(modulesFile, 'utf-8'), { from: modulesFile })
    .then(result => {
      fs.ensureDirSync(path.dirname(outputFile));
      fs.writeFileSync(outputFile, result.css)
    });
  }
}
