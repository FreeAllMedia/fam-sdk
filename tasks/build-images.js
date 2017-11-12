module.exports = (gulp, plugins) => {
  const paths = {
    input: plugins.path.join(__dirname, "../source/images/*.*"),
    output: plugins.path.join(__dirname, "../dist/images/")
  };

  gulp.task("build-images", () => {
    return gulp.src(paths.input)
      .pipe(gulp.dest(paths.output));
  });
};
