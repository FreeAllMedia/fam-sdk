module.exports = (gulp, plugins) => {
  const paths = {
    input: plugins.path.join(__dirname, "../source/styles/*.sass"),
    output: plugins.path.join(__dirname, "../dist/")
  };

  gulp.task("build-css", () => {
    return gulp.src(paths.input)
      .pipe(plugins.sass().on("error", plugins.sass.logError))
      .pipe(gulp.dest(paths.output));
  });
};
