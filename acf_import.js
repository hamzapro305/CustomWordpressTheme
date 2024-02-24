require("dotenv/config")
const fs = require('fs-extra')
const colors = require('colors')

const srcFolder = `${process.env.THEME_OUTPUT_PATH}/${process.env.THEME_FOLDER}/config/acf-json`
const destFolder = './src/acf_config'

async function runImport() {
    await fs.remove(destFolder).catch(err => console.error(err))
    console.log(colors.grey('remove old folder '), colors.green(srcFolder), colors.grey('successful'))

    await fs.mkdir(destFolder).catch(err => console.error(err))
    console.log(colors.grey('make directory '), colors.green(srcFolder), colors.grey('successful'))
    
    await fs.copy(srcFolder, destFolder).catch(err => console.error(err))
    console.log(colors.grey('folder '), colors.green(srcFolder), colors.grey('has been copied to the repo'))
}

runImport()