'use strict';

// had enabled by egg
// exports.static = true;
/* exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};*/

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.validate = {
  package: 'egg-validate',
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};
