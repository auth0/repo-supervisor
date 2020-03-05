const fs = require('fs');
const format = require('util').format;
const filters = require('./filters');
const config = require('./../config/main.json');

const isJSON = !!process.env.JSON_OUTPUT;
const excludedPaths = config.cli.excludedPaths.map(x => new RegExp(x));

function isExcluded(file) {
  return excludedPaths.find(regex => file.match(regex));
}

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    if (isExcluded(file)) return;
    file = `${dir}/${file}`;
    const stat = fs.lstatSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });

  return results;
};

const throwError = (message) => {
  console.log(isJSON ? JSON.stringify({ result: [], error: message }) : message);
  process.exit(1);
};

if (process.argv.length < 3) {
  throwError(config.cli.messages.invalidArguments);
}

const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
  throwError(format(config.cli.messages.invalidDirectory, dir));
}

const files = walk(dir);
const filesDetected = [];

files.forEach((file) => {
  const result = filters.processFile({ filename: file }, fs.readFileSync(file), true);

  if (result.length > 0) {
    filesDetected.push({
      filepath: file,
      secrets: result[0].filter.data.map(o => o.string)
    });
  }
});

if (isJSON) {
  const output = {
    result: filesDetected.length > 0 ? filesDetected : []
  };

  console.log(JSON.stringify(output));
  process.exit();
}

filesDetected.forEach((entry) => {
  console.log(format(`[${entry.filepath}]`));

  entry.secrets.forEach((secret) => {
    console.log(`>> ${secret}`);
  });

  console.log('');
});
