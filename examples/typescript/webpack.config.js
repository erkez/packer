/* eslint-disable */

const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration({
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    }
});
