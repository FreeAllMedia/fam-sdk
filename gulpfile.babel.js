import gulp from "gulp";
import path from "path";
import runSequence from "run-sequence";
import loadPlugins from "gulp-load-plugins";
import { argv } from "yargs";

const tasksPath = path.join(__dirname, "tasks");
const taskFiles = require("fs").readdirSync(tasksPath);

const plugins = loadPlugins();
plugins.environmentName = argv.environment || "development";
plugins.path = path;
plugins.runSequence = runSequence;
plugins.webpack = require("webpack");

taskFiles.forEach(taskFile => require(path.join(tasksPath, taskFile))(gulp, plugins));
