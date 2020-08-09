var gulp = require('gulp');
var run = require('gulp-run');

var fs = require('fs');
var path = require('path');

const sourcePath = 'src/lang';
const destPath = 'src/compiled-lang';

gulp.task('compile-messages', async function () {
    const directoryPath = path.join(__dirname, sourcePath);
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            return gulp.src(path.join(sourcePath, file))
            .pipe(run(`formatjs compile ${sourcePath}/${file} --ast --out-file ${destPath}/${file}`))
        });
    });
});