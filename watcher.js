const chokidar = require('chokidar')
const colors = require('colors')
const fs = require('fs-extra')
const sass = require('node-sass')
const Path = require("path")
const replace = require('buffer-replace')
require("dotenv/config")

const themeFolder = process.env.THEME_FOLDER
const configFolder = './src/acf_config'


const watcher = chokidar.watch('./theme/**', {
    persistent: true
})

const sassWatcher = chokidar.watch('./src/scss/**', {
    persistent: true
})

const acfWatcher = chokidar.watch(process.env.THEME_OUTPUT_PATH + themeFolder + '/config/acf-json/**/*.json', {
    persistent: true
})

// EASIER LOGGING
const log = console.log.bind(console)
const watermark = `
     :::
   ::::::
  ;::::::::
 ,;::::::::::       ......                  ::
 ,,;::::::::::: .............           ::::::
 ,,,,::::::::,,,,.................     :::::::,,
 ,,,,,,,,,,,,,,,,,,..............,,,,,,,,,,,,,,,
 ,,,,,,,,,,,,,,,,,,,..........,,,,,,,,,,,,,,,,,,
 ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
   ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
      ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
         ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
            ,,,,,,,,,,,,,,,,,,,,,,,,,
                  ,,,,,,,,,,.

            ---=== BannerWave ===---
`

const pre = colors.gray(' [themeWatcher]')
const scss = colors.gray('[sass]')
const file = colors.gray('[file]')
const acf = colors.gray('[acf]')
console.log(colors.cyan(watermark))


getTemplatePath = (path) => {
    let targetPath = (process.env.THEME_OUTPUT_PATH + path).replace('themes/theme', `themes/${themeFolder}`)
    return targetPath
}

startWatcher = async () => {

    // Clean out build folder
    await fs.remove(process.env.THEME_OUTPUT_PATH + themeFolder + "/**!(config/acf-json/**)", (err) => { if (err) throw err })

    // Sass watcher
    sassWatcher.on('add', async path => {
        await compileSass()
        log(pre, scss, colors.grey('file '), colors.green(path), colors.grey('has been added'))
    })
        .on('change', async path => {
            await compileSass()
            log(pre, scss, colors.blue(path), colors.grey('has been changed'))
        })
        .on('unlink', async path => {
            await compileSass()
            log(pre, scss, colors.grey('file '), colors.red(path), colors.grey('has been removed'))
        })
        .on('error', error => log(pre, colors.brightRed(error)))
        .on('ready', async () => {
            await compileSass()
            log(pre, scss, colors.white('Sass watcher ready'))
        })

    // Add event listeners.
    watcher
        // ADDING FILES AND DIRECTORIES
        .on('add', async path => {
            await fs.copy(path, getTemplatePath(path), (err) => {
                if (err) throw err;
                log(pre, file, colors.grey('file '), colors.green(path), colors.grey('has been added'))
            })
        })
        .on('addDir', async path => {
            if (!fs.existsSync(getTemplatePath(path))) {
                await fs.mkdirSync(getTemplatePath(path))
                log(pre, file, colors.grey('folder '), colors.green(path), colors.grey('has been created'))
            }
        })

        // CHANGES
        .on('change', async path => {
            await fs.copy(path, getTemplatePath(path), (err) => {
                if (err) {
                    console.log(err)
                }
                log(pre, file, colors.blue(path), colors.grey('has been changed'))
            })
        })

        // DELETING FILES OR DIRECTORIES
        .on('unlink', async path => {
            await fs.remove(getTemplatePath(path), () => {
                log(pre, file, colors.grey('file '), colors.red(path), colors.grey('has been removed'))
            })
        })
        .on('unlinkDir', async path => {
            await fs.remove(getTemplatePath(path), () => {
                log(pre, file, colors.grey('folder '), colors.red(path), colors.grey('has been removed'))
            })
        })

        // OTHER
        .on('error', error => log(pre, colors.brightRed(error)))
        .on('ready', () => {
            log(pre, file, colors.rainbow('...---=== Initialized ===---...'))
            log(pre, file, colors.grey('writing files to'), colors.white(process.env.THEME_OUTPUT_PATH + themeFolder))
        })

    // ACF Watcher
    acfWatcher.on('add', path => {
        fs.copy(path, configFolder + '/' + Path.basename(path), (err) => {
            if (err) throw err;
            log(pre, acf, colors.grey('file '), colors.green(path), colors.grey('has been added'))
        })
    })

        // CHANGES
        .on('change', path => {
            fs.copy(path, configFolder + '/' + Path.basename(path), (err) => {
                if (err) throw err;
                log(pre, acf, colors.blue(path), colors.grey('has been changed'))
            })
        })

        // DELETING FILES OR DIRECTORIES
        .on('unlink', path => {
            fs.remove(configFolder + '/' + Path.basename(path), () => {
                log(pre, acf, colors.grey('file '), colors.red(path), colors.grey('has been removed'))
            })
        })

        // OTHER
        .on('error', error => log(pre, colors.brightRed(error)))
        .on('ready', () => {
            log(pre, acf, colors.grey('writing config files to'), colors.white(configFolder))
        })



    compileSass = async () => {
        await sass.render({
            file: './src/scss/style.scss',
            outFile: './theme/style.css',
            sourceMap: true
        }, async (err, result) => {
            if (err) { console.log(err) }
            if (result) {
                let resultCSS = result.css
                if (result.css) {
                    resultCSS = replace(resultCSS, 'THEME_NAME', process.env.THEME_NAME)
                    resultCSS = replace(resultCSS, 'THEME_DESCRIPTION', process.env.THEME_DESCRIPTION)
                    resultCSS = replace(resultCSS, 'THEME_VERSION', process.env.THEME_VERSION)
                    resultCSS = replace(resultCSS, 'THEME_AUTHOR', process.env.THEME_AUTHOR)
                }
                await fs.writeFile('./theme/style.css', resultCSS, (error) => {
                    if (error) { console.log(error) }
                })
                await fs.writeFile('./theme/style.css.map', result.map, (error) => {
                    if (error) { console.log(error) }
                })
            }
        })
        await sass.render({
            file: './src/scss/editor-style.scss',
            outFile: './theme/editor-style.css',
            sourceMap: true
        }, async (err, result) => {
            if (err) { console.log(err) }
            await fs.writeFile('./theme/editor-style.css', result.css, (error) => {
                if (error) { console.log(error) }
            })
            await fs.writeFile('./theme/editor-style.css.map', result.map, (error) => {
                if (error) { console.log(error) }
            })
        })
    }



}

startWatcher()