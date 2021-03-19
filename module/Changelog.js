const changelog = require('lerna-changelog');

const Changelog = class Changelog {
    constructor() {
        this.myOutput = '';
        this.myError = '';

        this.labels = {
            'Type: Breaking Change': 'Breaking Change',
            'Type: Feature': 'Feature',
            'Type: Bug': 'Bug fix',
            'Type: Maintenance': 'Maintenance',
            'Type: Documentation': 'Documentation',
            'Type: Refactoring': 'Refactoring'
        }
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
