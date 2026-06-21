'use strict';

const recommended = require('@ekz/packer/recommended');
const typescript = require('@ekz/packer/typescript');

module.exports = [...recommended, ...typescript];
