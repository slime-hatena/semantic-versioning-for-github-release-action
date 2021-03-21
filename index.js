const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const Output = require('./modules/Output');
const SemanticVersion = require('./modules/SemanticVersion');
const Changelog = require('./modules/Changelog');

async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    process.env.GITHUB_AUTH = GITHUB_TOKEN;
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const repository = process.env.GITHUB_REPOSITORY.split('/');
    const owner = repository[0];
    const repo = repository[1];
    Output.info(`Owner: ${owner} / Repository: ${repo}`);

    const releases = await octokit.repos.listReleases({
      owner: owner,
      repo: repo
    });

    let recentVersion = new SemanticVersion;
    Output.info('Release list');
    releases.data.forEach(release => {
      if (!release.draft) {
        try {
          const version = new SemanticVersion;
          if (version.parse(release.tag_name).isGreater(recentVersion)) {
            recentVersion = version;
          }
        } catch (error) {
          Output.warn(`${error} Tag: ${release.tag_name} / Name: ${release.name}`);
          return;
        }
        Output.info(`Tag: ${release.tag_name} / Name: ${release.name}`);
      }
    });

    if (recentVersion.tag == '') {
      Output.warn('No valid tags found. A new tag will be created.');
      recentVersion.tag = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'; // empty tree.
      recentVersion.major = 0;
      recentVersion.minor = 0;
      recentVersion.patch = 0;
    } else {
      Output.success(`RecentTag: ${recentVersion.tag}, ${recentVersion.major} / ${recentVersion.minor} / ${recentVersion.patch} / ${recentVersion.prerelease} / ${recentVersion.meta}`);
    }

    const LABEL_SETTING_FILE_PATH = core.getInput('LABEL_SETTING_FILE_PATH');
    console.log(fs.readFileSync(LABEL_SETTING_FILE_PATH, 'utf8'));
    const labels = JSON.parse(fs.readFileSync(LABEL_SETTING_FILE_PATH, 'utf8'));
    console.log(labels);
    const changelog = new Changelog(labels);
    let markdown = await changelog.generate(recentVersion.tag);
    markdown = markdown.substr(markdown.indexOf('\n', markdown.indexOf('\n', 0) + 1) + 1);
    Output.success(markdown);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
