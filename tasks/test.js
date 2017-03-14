module.exports = (gulp, plugins) => {
	const paths = {
		input: {
			source: plugins.path.join(__dirname, "../source/lib/**/*.js"),
			spec: plugins.path.join(__dirname, "../source/spec/**/*.spec.js")
		},
		output: {
			coverage: `${__dirname}/../coverage/`
		}
	};

	gulp.task("test", callback => {
		gulp.src(paths.input.source)
			.pipe(plugins.istanbul()) // Covering files
			.pipe(plugins.istanbulistanbul.hookRequire()) // Force `require` to return covered files
			.on("finish", () => {
				gulp.src(paths.input.spec)
					.pipe(plugins.mocha())
					.pipe(istanbul.writeReports({dir: paths.output.coverage, reporters: ["html", "text-summary", "lcovonly"]})) // Creating the reports after tests ran
					// .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } })) // Enforce a coverage of 100%
					.on("end", cb);
			});
	});
}
