const exec = require('child_process').exec;
const options = {
  env: {
    JSON_OUTPUT: '1',
    PATH: process.env.PATH
  }
};

describe('Scenario: Run tool in CLI mode to detect secrets', () => {
  it('should print error message when no parameters were provided', (cb) => {
    const msg = 'The directory argument was not provided.';

    exec('node ./dist/cli.js', (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should print error message when no parameters were provided - JSON response', (cb) => {
    const msg = '{"result":[],"error":"The directory argument was not provided."}';

    exec('node ./dist/cli.js', options, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in empty directories', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = '';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in empty directories - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = '{"result":[]}';

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in unsupported file formats', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = '';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in unsupported file formats - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = '{"result":[]}';

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should return an error when directory does not exist', (cb) => {
    const dir = './this_dir_does_not_exist';
    const msg = `"${dir}" is not a valid directory.`;

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should return an error when directory does not exist - JSON response', (cb) => {
    const dir = './this_dir_does_not_exist';
    const msg = `{"result":[],"error":"\\"${dir}\\" is not a valid directory."}`;

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
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
>> q28Wt3nAmLt_3NGpqi2qz-jQ7`;

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should detect secrets in supported files - JSON response', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets';
    const msg = '{"result":[{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/bar.js","secrets":["zJd-55qmsY6LD53CRTqnCr_g-","gm5yb-hJWRoS7ZJTi_YUj_tbU","GxC56B6x67anequGYNPsW_-TL","MLTk-BuGS8s6Tx9iK5zaL8a_W","2g877BA_TsE-WoPoWrjHah9ta"]},{"filepath":"./test/fixtures/integration/dir.with.secrets/foo/foo.json","secrets":["d7kyociU24P9hJ_sYVkqzo-kE","q28Wt3nAmLt_3NGpqi2qz-jQ7"]}]}';

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });
});
