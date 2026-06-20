'use strict';

const recommended = require('@ekz/eslint-config-packer/recommended');
const typescript = require('@ekz/eslint-config-packer/typescript');

module.exports = [{ ignores: ['config/**'] }, ...recommended, ...typescript];
