const mix = require('laravel-mix');

mix.js('src/app.js', 'dist')
    .sass('src/scss/app.scss', 'dist').vue()