const exec = require('child_process').exec;

describe('Scenario: Run tool in CLI mode to detect secrets', () => {
  it('should not detect secrets in empty directories', (cb) => {
    const dir = './test/fixtures/integration/dir.without.any.files.to.test';
    const msg = 'Not detected any secrets in files.';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.trim()).to.be.equal(msg);
      cb();
    });
  });

  it('should not detect secrets in unsupported file format', (cb) => {
    const dir = './test/fixtures/integration/dir.with.secrets.not.supported.format';
    const msg = 'Not detected any secrets in files.';

    exec(`node ./dist/cli.js ${dir}`, (error, stdout) => {
      expect(error).to.be.null;
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
});
