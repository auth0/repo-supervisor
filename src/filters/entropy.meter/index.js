import entropy from './../../lib/entropy';
import config from './../../../config/filters/entropy.meter.json';

/**
 * If rule returns TRUE then string is not removed, otherwise string is not returned on a list
 * of secrets.
 *
 * return {
 *   isError: true|false,
 *   error: 'This is an error message.',
 *   data: [{
 *     string: "secret-password",
 *     entropy: 3.5326
 *   }]
 * };
 **/
module.exports = (strings) => {
  const error = config.errors.description;

  // Leave only strings that were not removed by pre-filters.
  const result = strings.filter(str => config.preFilters.reduce((acc, name) =>
    (acc &= require(`./pre.filters/${name}`)(str, config))
  , 1));

  // Calculate entropy for every string
  const maxEntropy = config.options.maxAllowedEntropy;
  const data = result
    .map(string => ({ string, entropy: +entropy(string).toFixed(config.options.entropyPrecision) }))
    .filter(o => o.entropy > maxEntropy);

  return {
    name: 'Entropy Meter',
    data,
    isError: data.length > 0,
    error: data.length > 0 ? error : null
  };
};
