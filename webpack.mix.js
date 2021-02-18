const mix = require('laravel-mix');

mix.js('src/app.js', 'dist').vue().babel('dist/app.js', 'dist/app.es5.js')
    .sass('src/scss/app.scss', 'dist')