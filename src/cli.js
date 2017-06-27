import fs from 'fs';
import filters from './filters';

const isJSON = !!process.env.JSON_OUTPUT;
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    file = `${dir}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });

  return results;
};

const throwError = (message) => {
  if (isJSON) {
    const output = {
      error: message
    };
    console.log(JSON.stringify(output));
  } else {
    console.log(message);
  }

  process.exit(1);
};

if (process.argv.length < 3) {
  throwError('Usage: npm run cli <directory>');
}

const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  throwError(`"${dir}" is not a valid directory.`);
}

const files = walk(dir);
const filesDetected = {};

if (files.length <= 0) {
  throwError('Not found any files that could be tested.');
}

files.forEach((file) => {
  const result = filters.processFile({ filename: file }, fs.readFileSync(file), true);
  if (result.length > 0) filesDetected[file] = result[0].filter.data.map(o => o.string);
});

// if (Object.keys(filesDetected).length <= 0) {
//   throwError('Not detected any secrets in files.');
// }

if (Object.keys(filesDetected).length > 0) {
  if (isJSON) {
  const output = {
    result: filesDetected
  };

  console.log(JSON.stringify(output));
  process.exit();
}
}



Object.keys(filesDetected).forEach((prop) => {
  console.log(`[${prop}]`);

  filesDetected[prop].forEach((secret) => {
    console.log(`>> ${secret}`);
  });

  console.log('');
});
