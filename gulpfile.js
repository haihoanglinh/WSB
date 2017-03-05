'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var spritesmith = require('gulp.spritesmith');

gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten({ includeParents: 0} ))
        .pipe(gulp.dest('css'));
});


gulp.task('sprite:member', function () {
  var memberTypeSprite = gulp.src('./images/team/member_type_icons/*.png').pipe(spritesmith({
    imgName: 'member_types_spritesheet.png',
    imgPath: '../images/team/member_types_spritesheet.png',
    cssName: '_member_types_sprites.scss'
  }));
  return memberTypeSprite.pipe(gulp.dest('./images/team/'));
});

gulp.task('sprite:contact', function () {
  var memberTypeSprite = gulp.src('./images/contact/member_type_icons/*.png').pipe(spritesmith({
    imgName: 'member_types_green_spritesheet.png',
    imgPath: '../images/contact/member_types_green_spritesheet.png',
    cssName: '_member_types_sprites.scss'
  }));
  return memberTypeSprite.pipe(gulp.dest('./images/contact/'));
});

gulp.task('sprite:contactw', function () {
  var memberTypeSprite = gulp.src('./images/contact/member_type_icons_white/*.png').pipe(spritesmith({
    imgName: 'member_types_white_spritesheet.png',
    imgPath: '../images/contact/member_types_white_spritesheet.png',
    cssName: '_member_types_sprites_w.scss'
  }));
  return memberTypeSprite.pipe(gulp.dest('./images/contact/'));
});

gulp.task('sprite:menu', function () {
    var iconMenuUserSprite = gulp.src('./images/icon-menu/*.png').pipe(spritesmith({
        imgName: 'icon_menu_user_dropdown.png',
        imgPath: '../images/icon-menu/icon_menu_user_dropdown.png',
        cssName: '_icon_menu_user_dropdown.scss'
    }));
    return iconMenuUserSprite.pipe(gulp.dest('./images/icon-menu/'));
});

gulp.task('sprite:insight', function () {
    var iconMenuUserSprite = gulp.src('./images/insights/*.png').pipe(spritesmith({
        imgName: 'insight_spritesheet.png',
        imgPath: '../images/insights/insight_spritesheet.png',
        cssName: '_insight_spritesheet.scss'
    }));
    return iconMenuUserSprite.pipe(gulp.dest('./images/insights/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass'], function() {

});