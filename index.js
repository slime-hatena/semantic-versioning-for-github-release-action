const core = require('@actions/core');
// const github = require('@actions/github');
// const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    let repository = core.getInput('TARGET_REPOSITORY').split('/');
    let user = repository[0];
    let repo = repository[1];
    core.info(`User: ${user} / Repository: ${repo}`);

    var releases = octokit.Repository.Release.GetAll(user, repo);
    releases.forEach(release => {
      Console.WriteLine(
        "The latest release is tagged at {0} and is named {1}",
        release.TagName,
        release.Name
      );
    });

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
