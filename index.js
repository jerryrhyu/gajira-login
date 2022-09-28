const core = require('@actions/core')


const Action = require('./action')

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)

async function exec () {
  try {
    if (!process.env.JIRA_BASE_URL) throw new Error('Please specify JIRA_BASE_URL env')
    if (!process.env.JIRA_API_TOKEN) throw new Error('Please specify JIRA_API_TOKEN env')
    if (!process.env.JIRA_USER_EMAIL) throw new Error('Please specify JIRA_USER_EMAIL env')

    const config = {
      baseUrl: process.env.JIRA_BASE_URL,
      token: process.env.JIRA_API_TOKEN,
      email: process.env.JIRA_USER_EMAIL,
    }

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

    const result = await new Action({
      githubEvent,
      argv: parseArgs(),
      config,
    }).execute()

    if (result) {
      core.info('Add jira comment successfully!')

      return
    }

    console.log('Failed to login.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  return {
    issue: core.getInput('issue'),
    comment: core.getInput('comment'),
  }
}

exec()
