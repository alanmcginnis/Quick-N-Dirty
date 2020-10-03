'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the wondrous ${chalk.red('generator-codepen')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'title',
        message: 'Project Title?',
        default: 'Untitled'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let packageName = () => {
      return this.props.title.replace(/\s/g , "-").toLowerCase();
    }
    this.fs.copyTpl(
      this.templatePath('_index.html'),
      this.destinationPath('index.html'),{
        documentTitle: this.props.title
      }
    );
    this.fs.copy(
      this.templatePath('_style.scss'),
      this.destinationPath('css/scss/style.scss')
    );
    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath('js/index.js')
    );
    this.fs.copy(
      this.templatePath('_webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copy(
      this.templatePath('_bs_config.json'),
      this.destinationPath('bs_config.json')
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),{
        name: packageName()
      }
    );
    this.fs.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
  }

  install() {
    this.installDependencies();
  }
};
