'use strict';

/**
 * txaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::txaction.txaction');
