const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const Output = require('./modules/Output');
const SemanticVersion = require('./modules/SemanticVersion');
const Changelog = require('./modules/Changelog');

async function run() {
  try {
    console.log(process.env.GITHUB_REF);

    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const LABEL_SETTING_FILE_PATH = core.getInput('LABEL_SETTING_FILE_PATH');
    const TAG_TO = core.getInput('TAG_TO');
    const DRY_RUN = (core.getInput('DRY_RUN').toLowerCase() === 'true');
    let COMMENT_ON_PR = (core.getInput('COMMENT_ON_PR').toLowerCase() === 'true');
    process.env.GITHUB_AUTH = GITHUB_TOKEN;
    const octokit = github.getOctokit(GITHUB_TOKEN);

    console.log(DRY_RUN);
    console.log(COMMENT_ON_PR);

    let pullRequestNumber = 0;
    if (process.env.GITHUB_REF.indexOf('refs/pull') != -1) {
      pullRequestNumber = process.env.GITHUB_REF.split('/')[2];
      Output.info(`PullRequest number: ${pullRequestNumber}`);
    }

    if (COMMENT_ON_PR && pullRequestNumber == 0) {
      Output.warn('COMMENT_ON_PR is true, but could not get the pull request number. Comments will be skipped.');
      COMMENT_ON_PR = false;
    }

    const repository = process.env.GITHUB_REPOSITORY.split('/');
    const owner = repository[0];
    const repo = repository[1];
    Output.info(`Owner: ${owner} / Repository: ${repo}`);
    Output.br();

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
          Output.warn(`${error} Tag: ${release.tag_name} / Name: ${release.name} / PreRelease: ${release.prerelease}`);
          return;
        }
        Output.info(`Tag: ${release.tag_name} / Name: ${release.name} / PreRelease: ${release.prerelease}`);
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
    Output.br();


    const labelSettings = JSON.parse(fs.readFileSync(LABEL_SETTING_FILE_PATH, 'utf8'));
    const changelog = new Changelog(labelSettings.list);
    let markdown = await changelog.generate(recentVersion.tag, TAG_TO);
    markdown = markdown.substr(markdown.indexOf('\n', markdown.indexOf('\n', markdown.indexOf('\n', 0) + 1) + 1) + 1);
    if (markdown.length == 0) {
      Output.error('The changelog was not generated. Please check the label settings and whether the pull requests have been merged.');
    } else {
      Output.success('Changelog has been generated.');
      Output.info(markdown);
    }
    Output.br();

    let isUpdateMajor = false;
    let isUpdateMinor = false;

    for (const item of labelSettings.majorChanges) {
      if (markdown.indexOf('#### ' + item) != -1) {
        isUpdateMajor = true;
        Output.success(`Found an update containing ${item}. Update major version.`);
      }
    }

    if (!isUpdateMajor) {
      for (const item of labelSettings.minorChanges) {
        if (markdown.indexOf('#### ' + item) != -1) {
          isUpdateMinor = true;
          Output.success(`Found an update containing ${item}. Update minor version.`);
        }
      }
    }

    if (isUpdateMajor) {
      ++recentVersion.major;
      recentVersion.minor = 0;
      recentVersion.patch = 0;
    } else if (isUpdateMinor) {
      ++recentVersion.minor;
      recentVersion.patch = 0;
    } else {
      ++recentVersion.patch;
    }
    recentVersion.updateTag();

    Output.success(`Next version: ${recentVersion.tag}`);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
