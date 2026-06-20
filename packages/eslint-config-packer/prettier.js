'use strict';

const prettierRule = [
    'error',
    {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        tabWidth: 4
    }
];

const prettierTypescriptRule = [
    'error',
    {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        bracketSameLine: true,
        tabWidth: 4,
        parser: 'typescript'
    }
];

module.exports = {
    prettierRule,
    prettierTypescriptRule
};
