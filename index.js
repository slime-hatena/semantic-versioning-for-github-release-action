const core = require('@actions/core');
// const github = require('@actions/github');
// const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    core.info(`Repository: ${core.getInput('TARGET_REPOSITORY')}`);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
