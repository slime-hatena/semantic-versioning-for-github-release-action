const core = require('@actions/core');
const github = require('@actions/github');
const parseSemanticVersion = require('./module/parseSemanticVersion');

function warn(text) {
  core.info(`\u001b[33m${text}`);
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const repository = core.getInput('TARGET_REPOSITORY').split('/');
    const owner = repository[0];
    const repo = repository[1];
    core.info(`Owner: ${owner} / Repository: ${repo}`);

    const releases = await octokit.repos.listReleases({
      owner: owner,
      repo: repo
    });

    core.info('Release list');
    releases.data.forEach(release => {
      if (!release.draft) {
        try {
          parseSemanticVersion(release.tag_name);
        } catch (error) {
          warn(`${error} Tag: ${release.tag_name} / Name: ${release.name}`);
          return;
        }
        core.info(`Tag: ${release.tag_name} / Name: ${release.name}`);
      }
    });

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
