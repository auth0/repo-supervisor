import fs from 'fs';
import filters from './filters';

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

if (process.argv.length < 3) {
  console.log('Usage: npm run cli <directory>');
  process.exit();
}

const dir = process.argv[2];

if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.log(`"${dir}" is not a valid directory.`);
  process.exit();
}

const files = walk(dir);
const filesDetected = {};

if (files.length <= 0) {
  console.log('Not found any files that could be tested.');
  process.exit();
}

files.forEach((file) => {
  const result = filters.processFile({ filename: file }, fs.readFileSync(file), true);
  if (result.length > 0) filesDetected[file] = result[0].filter.data.map(o => o.string);
});

if (Object.keys(filesDetected).length <= 0) {
  console.log('Not detected any secrets in files.');
  process.exit();
}

console.log('===== Potential secrets have been detected: =====');

Object.keys(filesDetected).forEach((prop) => {
  console.log(`[${prop}]`);

  filesDetected[prop].forEach((secret) => {
    console.log(`>> ${secret}`);
  });

  console.log('');
});
