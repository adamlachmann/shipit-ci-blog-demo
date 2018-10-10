require('dotenv').config()
const createDeployTasks = require('shipit-deploy')

const PM2_APP_NAME = 'DemoApp'

module.exports = shipit => {
  createDeployTasks(shipit)

  shipit.initConfig({
    default: {
      workspace: 'files',
      deployTo: '/home/deploy/app',
      repositoryUrl: '',
      ignores: ['.git', 'node_modules', 'ci'],
      keepReleases: 3,
      shallowClone: false
    },
    vps: {
      servers: `deploy@${process.env.SERVER_IP}`,
      branch: 'master'
    },
  })

  // Override 'fetch' step of shipit-deploy
  shipit.blTask('deploy:fetch', async () => {
    // Normally this step would've fetch project files from git
    // In this case, codeship provides those files to location defined in
    shipit.workspace = shipit.config.workspace

    shipit.log('Established path to project files.')
  })

  // before publishing, execute following tasks
  shipit.on('updated', () => {
    shipit.start([
      'installDependencies',
      'stopApp',
    ])
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && npm install --production`)

    shipit.log('Installed npm dependecies')
  })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(`pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`)
      shipit.log('Stopped app process')
    } catch (error) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  // When symlink changes, restart the app
  shipit.on('published', () => {
    shipit.start('startApp')
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${shipit.currentPath} && ` +
      ` NODE_ENV=production pm2 start index.js --name "${PM2_APP_NAME}"`
    )

    shipit.log('Started app process')
  })
}