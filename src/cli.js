import fs from 'fs';
import { format } from 'util';
import filters from './filters';
import config from './../config/main.json';

const MESSAGE_MISSING_PARAMS = 'The directory argument was not provided.';
const MESSAGE_INVALID_DIRECTORY = '"%s" is not a valid directory.';

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
  throwError(MESSAGE_MISSING_PARAMS);
}

const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
  throwError(format(MESSAGE_INVALID_DIRECTORY, dir));
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
