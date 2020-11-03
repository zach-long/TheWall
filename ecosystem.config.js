const site_config = require('./site.config.js');

module.exports = {
  apps : [{
    name: site_config.app_name,
    script: site_config.app_root,

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: site_config.development_port
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: site_config.production_port
    }
  }]
}