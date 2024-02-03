var logger = require('./services/logger');
logger = new logger;

logger.bench('test');
logger.info('123')
logger.err('123')
logger.success('123')
logger.bench('test');
