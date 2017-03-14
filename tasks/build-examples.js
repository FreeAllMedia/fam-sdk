import path from "path";
//import ES5to3OutputPlugin from "es5to3-webpack-plugin";

module.exports = (gulp, plugins) => {
  const paths = {
    input: path.join(__dirname, "../examples/**/*"),
    output: path.join(__dirname, "../dist/unoptimized/examples/")
  };

  gulp.task("build-examples", done => {
    gulp.src(paths.input)
      .pipe(gulp.dest(paths.output));
  });
};
