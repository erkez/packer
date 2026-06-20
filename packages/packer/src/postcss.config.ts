const postcssConfig = {
    plugins: {
        'postcss-preset-env': {
            browsers: 'last 2 versions'
        },
        cssnano: {}
    }
};

export default postcssConfig;
