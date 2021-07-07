const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
function resolveExposes(globPath) {
  const files = glob.sync(globPath),
    exposes = {};
  files.forEach(function (filepath) {
    const split = filepath.split("/");
    const name = "/" + split.slice(1, split.length - 1).join("/");
    const value = split.slice(0, split.length - 1).join("/");
    exposes[name] = value;
  });
  console.log("exposes", exposes);
  return exposes;
}

const Components = resolveExposes("src/componetns/**/index.tsx");
module.exports = {
  entry: {
    Button: './src/Button.tsx',
    Input: './src/Input.tsx',
  },
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
    proxy: {
      "/api": {
        target: "http://39.106.114.130:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
      "/system": {
        target: "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/system": "/",
        },
      },
      "/systemjs-app": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  output: {
    filename: "[name].js",
    publicPath: "http://localhost:3001/",
    library: {
      // root: "MyLibrary",
      // amd: "my-library",
      // commonjs: "my-common-library",
      type: "system",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
      },
      {
        test: /\.(css)$/,
        // include: path.resolve(__dirname, './src'),// 这里会直接到 src 文件下找 less/css 文件进行编译，这里是项目优化的一个小技巧
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              //  您可以在此处指定publicPath
              //  默认情况下，它在webpackOptions.output中使用publicPath
              publicPath: "./",
            },
          },
          "css-loader",
          "postcss-loader",
          // "less-loader",
        ],
      },
    ],
  },
  externals: ["react","react-dom","antd"],
  plugins: [
    // new ModuleFederationPlugin({
    //   name: "app1",
    //   library: { type: "var", name: "app1" },
    //   filename: "remoteEntry.js",
    //   exposes: {
    //     // Button: "./src/Button.tsx",
    //     ...Components,
    //   },
    //   remotes: ["custom-component-applicantion"],
    //   shared: {
    //     react: {
    //       import: "react", // the "react" package will be used a provided and fallback module
    //       shareKey: "react", // under this name the shared module will be placed in the share scope
    //       shareScope: "default", // share scope with this name will be used
    //       singleton: true, // only a single version of the shared module is allowed
    //     },
    //     "react-dom": {
    //       singleton: true, // only a single version of the shared module is allowed
    //     },
    //     antd: {
    //       singleton: true,
    //     },
    //   },
    // }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/common.css",
    }),
  ],
};
