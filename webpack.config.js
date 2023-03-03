module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: { 
      dashboard: '/src/app/Dashboard.js',
      adminlog: '/src/app/AdminLog.js',
      voter: '/src/app/Voter.js',
      pollingstation: '/src/app/PollingStation.js',
    },
    output: {
      path: __dirname + '/src/public/js',
      filename: '[name].bundle.js',
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            }
          }
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ] 
    }
  }