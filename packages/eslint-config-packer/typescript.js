'use strict';

const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

const { prettierTypescriptRule } = require('./prettier');

const files = ['**/*.{ts,tsx}'];

module.exports = [
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: config.files ?? files
    })),
    {
        files,
        plugins: {
            prettier
        },
        rules: {
            'prettier/prettier': prettierTypescriptRule
        }
    }
];
