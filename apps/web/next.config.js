module.exports = {
    reactStrictMode: false,
    webpack: (config) => {
        const path = require('path');
        config.resolve.alias = {
            ...config.resolve.alias,
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        };
        return config;
    },
}
