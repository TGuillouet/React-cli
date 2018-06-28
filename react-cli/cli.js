#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

let config = require('./config.json');
let componentPath = config.path;
let style = config.style;

program
  .option('-c|--create [value]', 'Create a react component')
  .parse(process.argv);

if (program.create != '') {
  let ReactTemplate =
    `import React, { Component } from 'react';\n\nexport default class ${program.create} extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Hello world !</h1>
      </div>
    );
  }
}`;


  let ReactTestTemplate =
    `import React from 'react';
import ReactDOM from 'react-dom';
import ${program.create} from './${program.create}';
 
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${program.create} />, div);
  ReactDOM.unmountComponentAtNode(div);
});`;

  mkdirp(`./src/${componentPath}/${program.create}`, (e) => {
    if (e) throw new Error(e);
  });

  setTimeout(() => {
    // Write the Template of a react component
    fs.writeFileSync(`./src/${componentPath}/${program.create}/${program.create}.jsx`, ReactTemplate);

    // Write styles clauses (make a difference with CSS and SASS or SCSS files)
    if (style.ext === "sass" || style.ext === "scss") {
      fs.appendFileSync(`src/${style.path}_imports.${style.ext}`, `@import './src/${componentPath}/${program.create}/_${program.create}.${style.ext}';\n`);   
      fs.writeFileSync(`src/${componentPath}/${program.create}/_${program.create}.${style.ext}`, '');
    } else {
      fs.writeFileSync(`src/${componentPath}/${program.create}/${program.create}.css`, '');
    }

    // Write template for tests
    fs.writeFileSync(`./src/${componentPath}/${program.create}/${program.create}.test.js`, ReactTestTemplate);
  }, 1000);
}