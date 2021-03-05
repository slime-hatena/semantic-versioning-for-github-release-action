const core = require('@actions/core');
const github = require('@actions/github');
// const wait = require('./wait');


async function warn(text) {
  core.info(`\u001b[43m${text}`);
}

async function isSemanticVersion(version) {
  let count = (version.match(/\./g) || []).length;
  return (count == 2);
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    let repository = core.getInput('TARGET_REPOSITORY').split('/');
    let owner = repository[0];
    let repo = repository[1];
    core.info(`Owner: ${owner} / Repository: ${repo}`);

    let releases = await octokit.repos.listReleases({
      owner: owner,
      repo: repo
    });

    core.info('Release list');
    releases.data.forEach(release => {
      if (!release.draft) {
        let t = isSemanticVersion(release.tag_name);
        console.log(t);
        if (t) {
          core.info(`Tag: ${release.tag_name} / Name: ${release.name}`);
        } else {
          warn(`Wrong tags as semantic versioning. Tag: ${release.tag_name} / Name: ${release.name}`)
        }
      }
    });

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
