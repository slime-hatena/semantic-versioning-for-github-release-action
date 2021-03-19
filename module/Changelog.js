const exec = require('@actions/exec');

const Changelog = class Changelog {
    constructor() {
        this.myOutput = '';
        this.myError = '';
    }

    async generate(from = '') {
        await exec.exec('mkdir', ['-p', '~/.npm-global']);
        await exec.exec('npm', ['config', 'set', 'prefix', '\'~/.npm-global\'']);
        await exec.exec('npm', ['install', '--global', 'lerna-changelog'], { env: { PATH: '~/.npm-global/bin:$PATH' } });

        const options = {};
        options.listeners = {
            stdout: (data) => {
                this.myOutput += data.toString();
            },
            stderr: (data) => {
                this.myError += data.toString();
            }
        };

        if (from == '') {
            await exec.exec('lerna-changelog', ['--silent'], options);
        } else {
            await exec.exec('lerna-changelog', ['--silent', `--from=${from}`], options);
        }
    }
}

module.exports = Changelog;
