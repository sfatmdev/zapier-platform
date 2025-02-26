'use strict';

const _ = require('lodash');

const { DehydrateError } = require('../errors');
const resolveMethodPath = require('./resolve-method-path');
const wrapHydrate = require('./wrap-hydrate');

const createDehydrator = (input, type = 'method') => {
  const app = _.get(input, '_zapier.app');

  return (func, inputData, cacheExpiration) => {
    inputData = inputData || {};
    if (inputData.inputData) {
      throw new DehydrateError(
        'Oops! You passed a full `bundle` - really you should pass what you want under `inputData`!',
      );
    }
    const payload = {
      type,
      method: resolveMethodPath(app, func),
      // inputData vs. bundle is a legacy oddity
      bundle: _.omit(inputData, 'environment'), // don't leak the environment
    };

    if (cacheExpiration) {
      payload.cacheExpiration = cacheExpiration;
    }

    return wrapHydrate(payload);
  };
};

module.exports = createDehydrator;
