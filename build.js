({
  baseUrl: 'js',
  out: 'js/puton.js',
  include: ['libs/require','main'],
  wrap: true,
  optimize:"none",
  paths: {
    'require': 'libs/require',
    'jquery': "libs/jquery",
    'underscore': "libs/underscore",
    'backbone': "libs/backbone",
    'pouch': "libs/pouch",
    'app': "scripts/app",
    'templates': "templates/template",
    'jquery.cookie': 'libs/jquery.cookie',
    'jquery.tree': 'libs/jquery.tree',
    'state': 'libs/state',
    'sandbox': 'libs/sandbox',
    'codemirror': 'libs/codemirror'
  }
})