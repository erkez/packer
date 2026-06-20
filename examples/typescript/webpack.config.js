const Packer = require('@ekz/packer');

module.exports = Packer.webpack.createApplicationConfiguration({
    entry: {
        main: './src/index.tsx'
    },
    html: {
        template: 'public/index.html',
        filename: 'index.html'
    }
});
