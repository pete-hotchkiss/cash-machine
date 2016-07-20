import gulp from 'gulp';
// var jade = require('gulp-jade');
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

var ps = require('pause-stream')();
const pngquant = require('imagemin-pngquant');
/*

Load all the dependencies in our package.json file, including those not named with gulp- prefixes. Remember those with any additional hypenations in the package name get cammel-cased. So gulp-minnify-css becomes minnifyCss in the plugin scope

*/
const $ = gulpLoadPlugins(
      { pattern: '*' }
      );

const testLintOptions = {
  env: {
    mocha: true
  },
  'no-trailing-spaces': false
};

const reload = browserSync.reload;
var cpath = './app/';


/*

Define how arguments passed to taks should be applied, their appropriate alias's and where not passed, what default fall-back values should be applied.

-d [ D, deploy ]      Where passed will include addition steps in the full
                      build to package up the /dist folder, push to the host server, unpack to uat or live, and finally
                      trigger the generation of content indexes
-e [ E, environment ] Flag to mark which environment deployments should be
                      pushed to. Accepts only two options; uat or live
-p [ P, production ]  If passed defines a production build meaning
                      CSS, JS and HTML will be minfied
-r [ R, release ]     Mandatory if a -d argument is also inclided. Requires
                      a release tag number to be included, which is included in all page response headers and defines
                      the name of the packaged zip file sent to the
                      production environment
-v [ V, verbose ]     If passed switches to fully verbose console output
                      during buildprocess. Everyfile moving through the
                      pipe will be traced as it moves through the stream
*/
var argz = require('yargs')
        .help('h')
        .alias('h',['H','help'])
        .command('serve', $.configFile('.commandargs', {parse:'json'}).commands.serve.description)
        .options( $.configFile('.commandargs', {parse:'json'}).withdrawal )
        .options( $.configFile('.commandargs', {parse:'json'}).denomination )
        // Check that if a '-d' deployment flag was passed, its not missing a a release -r flag, or if present it isn't the default
        .check( function(a, b){
            if(a.w !== 'least' && a.w !== "denomination") {
              throw "Error: The withdrawl arguments (-w, -W, --withdrawl) can only accept either least or denomination";
            } else {
              return true;
            }
        })
        .check( function(a, b){
          console.log( "c", a.d );
            if(a.w == 'least' && a.d != 2000 ) {
              throw "Error: There is no need to pass a denomination flag when the app should priortise using the smallest number of notes/coins as possible.";
            } else {
              return true;
            }
        })
        .argv;
        gulp.task('arglog', ()=> {
          // console.log( $.configFile('.commandargs', {parse:'json'}).production )
          // console.log(  )

          // console.log(argz);
          // $.log(argv);
          // console.log(argz.P);
          console.log( "w", a.w );
        })


/*

Task: Jade
All markup in the application is defined in structured Jade templates. This task takes these templates, creating appropriate .temlate files, which are subsequently used by the html task to create the destination application documents, be they .php, .xml or other similar formats. Output files names are defined by values set in a JSON object on each .jade files first line.
*/
gulp.task('jade', function(cb) {

  const props = $.vinylProperties(['path, contents']);

  //
  return gulp.src(['./app/jade/index.jade', './app/jade/js-buildouts/*.jade'])
    // .pipe( $.if( argz.v, $.print()))
    .pipe( $.intercept( function(file) {
        //  Read the first line of the Jade file for any local, file level settings
        $.lineReader.eachLine(file.path, function(line, last, cb)
        {
          var ob;
          try {
              ob = JSON.parse( line.substring(4) );
              file.data = {
                'targetpath' : ob.dest_path,
                'filename' : ob.dest_name };
              ps.resume();
          } catch( err ) {
              file.data = {'targetpath' : cpath };
              ps.resume();
          }
        })
        return file;
    })).on('end', function() {
      // console.log('file interogation complete');
    })
    .pipe(ps.pause())
    .pipe($.jade({
      pretty: true
    }))
    .on('error', $.util.log)
    .pipe( $.wait(250) )
    .pipe( gulp.dest( function(file, t) {
        return String( file.data.targetpath );
    }))
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

gulp.task('lint', lint(['app/scripts/*.js'] ));

// gulp.task('serve', ['styles', 'fonts'], () => {
gulp.task('serve', ['jade', 'styles', 'replace'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules',
        '/app': 'app',
        '/tmp': '.tmp'
      }
    }
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  // gulp.watch('app/fonts/**/*', ['fonts']);
  // gulp.watch('bower.json', ['wiredep', 'fonts']);
  // gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/jade/*.jade', ['jade'])

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*',
    '.tmp/css/**/*'
  ]).on('change', reload);
});

// inject appropriate argumnet to switch build...
gulp.task('replace', function(){
  gulp.src(['app/scripts/app.js'])
    .pipe($.replace('##buildtype##', argz.w))
    .pipe($.replace('##priority-value##', argz.d))
    .pipe($.minify())
    .pipe(gulp.dest('app/scripts/dist'));
});

/*

Task: styles
Initiated as a pre-task to the minify-css task, this takes all the .scss SASS files and creates the sites css file, applying appropriate browserpre-fixes as needed. Assumes that sourcemaps are required, unless the --production flag is passed.
*/
var sass = require('gulp-sass');
gulp.task('styles', () => {
  return gulp.src(['app/styles/main.scss'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    // .pipe($.sass.sync({
    //   outputStyle: 'expanded',
    //   precision: 10,
    //   includePaths: ['.']
    // }).on('error', $.sass.logError) )
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError) )
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
  // return gulp.src('app/styles/main.scss')
  //   .pipe($.sass().on('error', sass.logError))
  //   .pipe(gulp.dest('.tmp/css'));
});
