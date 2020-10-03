# Quick 'N' Dirty

> A Yeoman generator to quickly hash out design ideas.

Includes
1. Normalize CSS
2. jQuery

## Installation

1. (Optional) First, install [Yeoman](http://yeoman.io) using [npm](https://www.npmjs.com/) (assuming you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
```

2. Clone this repo to a folder of your choice on your computer. `cd` into the newly cloned repository and run the following commands.

```bash
npm i && npm link && rm -rf .git
```

### Notes on Installation

Running `npm link` will allow you to use the yeoman generator on your machine as if it were a package from Yeoman.

I have you remove the `.git` folder because you will most likely be making modifications to suit your own needs. Feel free to add your own remote and store a personlized copy in your own Github account.

## Usage

Make sure you run the following command in an empty directory.

```bash
mkdir empty-directory && cd empty-directory
```

### oh-my-zsh users
```zsh
take empty-directory
```

### Run the thing

```bash
yo qnd
```

Then run `npm start` and enjoy! 🥤

## License

AGPL-3.0 © [Alan McGinnis](alanmcginnis.com)
