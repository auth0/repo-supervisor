const exec = require('child_process').exec;

describe('Scenario: Run tool in CLI mode to detect secrets', () => {
  it('should not detect secrets in empty directories', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = 'Not detected any secrets in files.';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should return an error in JSON format when triggered in JSON mode', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = 'Not detected any secrets in files.';
    const options = {
      env: {
        JSON_OUTPUT: '1',
        PATH: process.env.PATH
      }
    };

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
      expect(error.code, 'exit code').to.be.equal(1);

      let jsonResult;
      try {
        jsonResult = JSON.parse(stdout);
      } catch (e) {
        throw new Error(`Invalid JSON: "${stdout}"`);
      }
      expect(jsonResult.error.trim()).to.be.equal(msg);
      expect(Object.keys(jsonResult).length).to.be.equal(1);
      cb();
    });
  });

  it('should not detect secrets in unsupported file format', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = 'Not detected any secrets in files.';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error.code).to.be.equal(1);
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should detect secrets in supported files', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets';
    const msg =
`===== Potential secrets have been detected: =====
[./test/fixtures/integration/dir.with.secrets/foo/bar.js]
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

  it('should detect secrets in supported files when in JSON mode', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets';
    const msg = '{"result":{"./test/fixtures/integration/dir.with.secrets/foo/bar.js":["zJd-55qmsY6LD53CRTqnCr_g-","gm5yb-hJWRoS7ZJTi_YUj_tbU","GxC56B6x67anequGYNPsW_-TL","MLTk-BuGS8s6Tx9iK5zaL8a_W","2g877BA_TsE-WoPoWrjHah9ta"],"./test/fixtures/integration/dir.with.secrets/foo/foo.json":["d7kyociU24P9hJ_sYVkqzo-kE","q28Wt3nAmLt_3NGpqi2qz-jQ7"]}}';
    const options = {
      env: {
        JSON_OUTPUT: '1',
        PATH: process.env.PATH
      }
    };

    exec(`node ./dist/cli.js ${dir}`, options, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });
});
