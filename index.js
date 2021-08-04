var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');

const { promises: fs } = require("fs")
const path = require("path")

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      entry.isDirectory() ?
          await copyDir(srcPath, destPath) :
          await fs.copyFile(srcPath, destPath);
    }
}

Metalsmith(__dirname)
  .metadata({
    title: "Max Wolff",
    description: "defi engineer & investor",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(markdown())
  .use(permalinks({relative:false}))
  .use(layouts({
    engine: 'handlebars'
  }))
  .build(function(err, files) {
    copyDir('src/css', 'build/css');
    if (err) { throw err; }
  });
