const { PORT } = require('./utils/config')
const app = require('./app')

const logger = require('./utils/logger')

app.listen(PORT, () => logger.info(`App is listening on port ${PORT}`))