const Output = require('./Output');
const changelog = require('lerna-changelog');

const Changelog = class Changelog {
    constructor(labels = {}) {
        this.labels = labels;
        Output.success('Create a release note based on the following label information.');
        Object.keys(this.labels).forEach((key) => {
            Output.info(`Label: ${key} / Header: ${this.labels[key]}`);
        });
    }

    async generate(from = '') {
        let c = new changelog.Changelog({
            repo: 'Slime-hatena/semantic-versioning-for-github-release-action',
            nextVersion: undefined,
            rootPath: './',
            labels: this.labels,
            ignoreCommitters: [],
            cacheDir: '.changelog'
        });
        const m = await c.createMarkdown({
            tagFrom: from,
            tagTo: 'origin/main'
        });

        return m;
    }
}

module.exports = Changelog;
