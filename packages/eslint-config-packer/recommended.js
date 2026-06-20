'use strict';

const js = require('@eslint/js');
const { fixupPluginRules } = require('@eslint/compat');
const babelParser = require('@babel/eslint-parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier/flat');
const globals = require('globals');

const { prettierRule } = require('./prettier');

const reactPlugin = fixupPluginRules(react);

module.exports = [
    {
        ignores: ['**/bin/**', '**/dist/**', '**/node_modules/**']
    },
    js.configs.recommended,
    {
        ...react.configs.flat.recommended,
        plugins: { react: reactPlugin },
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    {
        ...react.configs.flat['jsx-runtime'],
        plugins: { react: reactPlugin },
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    eslintConfigPrettier,
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                },
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    parserOpts: {
                        plugins: ['jsx']
                    }
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021
            }
        },
        plugins: {
            prettier,
            'react-hooks': reactHooks
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-console': 'warn',
            'prettier/prettier': prettierRule,
            eqeqeq: ['error', 'allow-null']
        }
    }
];
