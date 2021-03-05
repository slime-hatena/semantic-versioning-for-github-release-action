const core = require('@actions/core');
// const github = require('@actions/github');
// const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    // const octokit = github.getOctokit(GITHUB_TOKEN);


    core.info(`Repository: ${core.getInput('GITHUB_REPOSITORY')}`);

    // var releases = client.Repository.Release.GetAll("octokit", "octokit.net");
    // var latest = releases[0];
    // Console.WriteLine(
    //   "The latest release is tagged at {0} and is named {1}",
    //   latest.TagName,
    //   latest.Name
    // );

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
