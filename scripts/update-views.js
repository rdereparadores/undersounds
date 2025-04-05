const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const os = require('os')

const FRONTEND_REPO = 'https://github.com/rdereparadores/undersounds-frontend.git'
const TEMP_DIR = path.join(os.tmpdir(), 'undersounds-frontend-temp')
const VIEWS_DIR = path.join(__dirname, '..', 'src', 'views')

function runCommand(command, options = {}) {
    try {
        execSync(command, {
            stdio: 'inherit',
            ...options
        });
    } catch (error) {
        console.error(`Error al ejecutar: ${command}`)
        throw error
    }
}

async function updateViews() {
    try {
        console.log('Preparando entorno...')
        if (fs.existsSync(TEMP_DIR)) {
            await fs.remove(TEMP_DIR)
        }

        console.log('Clonando repositorio...')
        runCommand(`git clone ${FRONTEND_REPO} "${TEMP_DIR}"`)

        console.log('Instalando dependencias...')
        runCommand('npm install --legacy-peer-deps', { cwd: TEMP_DIR })

        console.log('Compilando frontend...')
        runCommand('npm run build', { cwd: TEMP_DIR })

        if (fs.existsSync(VIEWS_DIR)) {
            await fs.emptyDir(VIEWS_DIR)
        } else {
            await fs.mkdirp(VIEWS_DIR)
        }

        console.log('Copiando archivos compilados a src/views...')
        await fs.copy(path.join(TEMP_DIR, 'dist'), VIEWS_DIR)

        console.log('Limpiando archivos temporales...')
        await fs.remove(TEMP_DIR)

        console.log('Frontend actualizado correctamente!')
    } catch (error) {
        console.error('Error en el proceso:', error.message)
        process.exit(1)
    }
}

updateViews()