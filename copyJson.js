let fs = require('fs');
let path = require('path');
let _ = require('lodash');

let en = require('../../conf/language/view/en.json');
let jpne = require('../../conf/language/view/jpne.json');
let kora = require('../../conf/language/view/kora.json');
let sg = require('../../conf/language/view/sg.json');

function findHasKeys(compareJson,targetJson, parentKey) {
  let childrenJson = {};
  let compareData = targetJson[parentKey];
  Object.keys(compareData).forEach((key, index) => {
    if (_.has(compareJson, key) && !_.isObject(compareJson[key])) {
      childrenJson[key] = compareJson[key];
    } else if (_.has(compareJson, key) && _.isObject(compareJson[key])) {
      childrenJson[key] = findHasKeys(compareJson[key], compareData, key);
    } else {
      childrenJson[key] = compareData[key];
    }

  });
  // console.log(childrenJson);
  return childrenJson;
};
function diffLang(a, b, lang, location) {
  let keyLang = Object.keys(a);
  let changeLang = Object.keys(b);
  let newJson = {};
  //对比目标
  let enVlaue = [];
  let enKey = [];
  //被对比目标
  let values = [];
  let keys = [];
  keyLang.forEach((key, index) => {
    if (key != changeLang[index]) {
      newJson[key] = a[key];
    } else if (_.isObject(b[key])) {
      newJson[key] = findHasKeys(b[key],en, key);
    }
  });

  let Str_ans = JSON.stringify(newJson, null, 2);

  write(lang, Str_ans);

}

function write(lang, Str_ans) {
  fs.writeFile('../../conf/language/view/'+lang+'.json', Str_ans, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
}

function changeAll() {
  diffLang(en, jpne, 'jpne', location);
  diffLang(kora, 'kora', location);
  diffLang(sg, 'sg', location);
}

changeAll();
