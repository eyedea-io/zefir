const path = require('path')

module.exports = {
  appBuild: path.resolve('./.zefir'),
  appHtml: path.resolve('./index.html'),
  appFavicon: path.resolve('./favicon.ico'),
  appPackageJson: path.resolve('./package.json'),
  appSrc: path.resolve('./'),
  stylesSrc: path.resolve('./styles')
}
