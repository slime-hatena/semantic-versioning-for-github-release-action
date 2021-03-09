const core = require('@actions/core');
const github = require('@actions/github');
const Output = require('./module/Output');
const SemanticVersion = require('./module/SemanticVersion');

async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const repository = core.getInput('TARGET_REPOSITORY').split('/');
    const owner = repository[0];
    const repo = repository[1];
    Output.info(`Owner: ${owner} / Repository: ${repo}`);

    const releases = await octokit.repos.listReleases({
      owner: owner,
      repo: repo
    });

    Output.info('Release list');
    releases.data.forEach(release => {
      if (!release.draft) {
        try {
          (new SemanticVersion).parse(release.tag_name);
        } catch (error) {
          Output.warn(`${error} Tag: ${release.tag_name} / Name: ${release.name}`);
          return;
        }
        Output.info(`Tag: ${release.tag_name} / Name: ${release.name}`);
      }
    });

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
