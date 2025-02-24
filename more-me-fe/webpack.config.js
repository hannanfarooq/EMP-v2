// // webpack.config.js
// module.exports = {
//     module: {
//       rules: [
//         {
//           test: /\.css$/,
//           use: [
//             'style-loader',
//             'css-loader',
//             'postcss-loader',
//           ],
//         },
//       ],
//     },
//   }
  

const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false,
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|pdf)$/i, // Ensure PDFs are handled properly
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
