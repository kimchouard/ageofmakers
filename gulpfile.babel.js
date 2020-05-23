/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import del from 'del';

const plugins = loadPlugins();

import webpackConfig from './app/webpack.config';


// HTML TASKS
// --------------------------
['all', 'popup', 'game', 'list'].forEach((taskName) => {
  gulp.task(`clean-${taskName}-html`, () => {
    return del([`./build/**/${ (taskName === 'all') ? '*' : taskName }.html`]);
  });

  // No html copy on `all`
  if(taskName !== 'all') {
    gulp.task(`${taskName}-html`, gulp.series(`clean-${taskName}-html`, () => {
      return gulp.src(`app/src/${taskName}.html`)
        .pipe(plugins.rename(`${taskName}.html`))
        .pipe(gulp.dest('./build'))
    }));
  }
});


// JS TASKS
// --------------------------
['all', 'popup', 'game', 'list', 'event', 'content'].forEach((taskName) => {
  gulp.task(`clean-${taskName}-js`, () => {
    return del([`./build/${ (taskName === 'all') ? '**/*' : taskName }.js`]);
  });

  // No webpack on `all`
  if(taskName !== 'all') {
    gulp.task(`${taskName}-js`, (cb) => {
      // Set a `true` boolean as the second argument of `webpackConfig()` if it is a bg script to get the adequat webpack config
      return webpack(webpackConfig(taskName, (taskName === 'event')), (err, stats) => {
        if(err) throw new plugins.util.PluginError('webpack', err);
    
        plugins.util.log('[webpack]', stats.toString());
    
        cb();
      });
    });
  }
});



// MANIFEST TASKS
// --------------------------
gulp.task('clean-manifest', () => {
  return del(['./build/manifest.json']);
});

gulp.task('copy-manifest', gulp.series('clean-manifest', () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('./build'));
}));


// IMAGES TASKS
// --------------------------
gulp.task('clean-images', () => {
  return del(['./build/images']);
});

gulp.task('copy-images', gulp.series('clean-images', () => {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('./build/images/'));
}));

// LIBS TASKS
// --------------------------
gulp.task('clean-libs', () => {
  return del(['./build/libs']);
});

gulp.task('copy-libs', gulp.series('clean-libs', () => {
  return gulp.src('libs/*')
    .pipe(gulp.dest('./build/libs/'));
}));


// YAML TASKS
// --------------------------
gulp.task('clean-yaml', () => {
  return del(['./build/data']);
});

gulp.task('copy-yaml', gulp.series('clean-yaml', () => {
  return gulp.src('data/**/*.yaml')
    .pipe(gulp.dest('./build/data/'));
}));


// MISC TASKS
// --------------------------

// Deep Cleaning
gulp.task('clean-all', () => {
  return del(['./build']);
});



// ========================================
// MAIN TASKS
// ========================================

gulp.task('build', gulp.series('copy-manifest', 'copy-libs', 'copy-images', 'copy-yaml', 'popup-js', 'popup-html', 'event-js', 'content-js', 'game-js', 'game-html', 'list-js', 'list-html'));

gulp.task('default', gulp.series('build'));

gulp.task('watch', gulp.series('default', () => {
  gulp.watch('manifest.json', gulp.series('copy-manifest'));
  gulp.watch('images/**/*', gulp.series('copy-images'));
  gulp.watch('data/**/*.yaml', gulp.series('copy-yaml'));
  gulp.watch(['app/src/actions/**/*', 'app/src/aliases/**/*', 'app/src/fonts/**/*', 'app/src/reducers/**/*', 'app/src/sass/**/*', 'app/src/scripts/**/*', 'app/src/index.js'], gulp.series('event-js', 'content-js', 'popup-js', 'game-js', 'list-js'));
  gulp.watch(['app/src/*.html'], gulp.series('popup-html', 'game-html', 'list-html'));
}));
