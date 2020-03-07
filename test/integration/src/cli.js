/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
const exec = require('child_process').exec;

const execCMD = 'node ./dist/cli.js';
const options = {
  env: {
    JSON_OUTPUT: '1',
    PATH: process.env.PATH
  }
};

describe('Scenario: Run tool in CLI mode to detect secrets', () => {
  it('should print error message when no parameters were provided', (cb) => {
    const msg = 'Invalid number of arguments.';

    exec(execCMD, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should print error message when no parameters were provided - JSON response', (cb) => {
    const msg = '{"result":[],"error":"Invalid number of arguments."}';

    exec(execCMD, options, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in empty directories', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = '';

    exec(`${execCMD} ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in empty directories - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = '{"result":[]}';

    exec(`${execCMD} ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in unsupported file formats', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = '';

    exec(`${execCMD} ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in unsupported file formats - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = '{"result":[]}';

    exec(`${execCMD} ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should return an error when directory does not exist', (cb) => {
    const dir = './this_dir_does_not_exist';
    const msg = `"${dir}" is not a valid directory.`;

    exec(`${execCMD} ${dir}`, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should return an error when directory does not exist - JSON response', (cb) => {
    const dir = './this_dir_does_not_exist';
    const msg = `{"result":[],"error":"\\"${dir}\\" is not a valid directory."}`;

    exec(`${execCMD} ${dir}`, options, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should detect secrets in supported files', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets';
    const msg =
`[./test/fixtures/integration/dir.with.secrets/foo/bar.js]
>> zJd-55qmsY6LD53CRTqnCr_g-
>> gm5yb-hJWRoS7ZJTi_YUj_tbU
>> GxC56B6x67anequGYNPsW_-TL
>> MLTk-BuGS8s6Tx9iK5zaL8a_W
>> 2g877BA_TsE-WoPoWrjHah9ta

[./test/fixtures/integration/dir.with.secrets/foo/foo.json]
>> d7kyociU24P9hJ_sYVkqzo-kE
>> q28Wt3nAmLt_3NGpqi2qz-jQ7

[./test/fixtures/integration/dir.with.secrets/foo/foo.yaml]
>> API_KEY=iaCELgL.0imfnc4mVLWwsAawjYr4Rx-Bf50DDptlz
>> c0NhbGVpbzEyMw==83bnd2!adfiu3

[./test/fixtures/integration/dir.with.secrets/foo/foo.yml]
>> USER_ID=984267C934L692S8109S270
>> LE73!jd8DNo$%Mn!kSN`;

    exec(`${execCMD} ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should detect secrets in supported files - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets';
    const msg = '{"result":[{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/bar.js","secrets":["zJd-55qmsY6LD53CRTqnCr_g-","gm5yb-hJWRoS7ZJTi_YUj_tbU","GxC56B6x67anequGYNPsW_-TL","MLTk-BuGS8s6Tx9iK5zaL8a_W","2g877BA_TsE-WoPoWrjHah9ta"]},{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/foo.json","secrets":["d7kyociU24P9hJ_sYVkqzo-kE","q28Wt3nAmLt_3NGpqi2qz-jQ7"]},{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/foo.yaml","secrets":["API_KEY=iaCELgL.0imfnc4mVLWwsAawjYr4Rx-Bf50DDptlz","c0NhbGVpbzEyMw==83bnd2!adfiu3"]},{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/foo.yml","secrets":["USER_ID=984267C934L692S8109S270","LE73!jd8DNo$%Mn!kSN"]}]}';

    exec(`${execCMD} ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });
});
