let fs = require('fs');

let strings = fs.readdirSync('public/textures');

let textureMap = {};

strings.forEach(str => {
  console.log(`Loaded texture name ${str}`);
  let tokens = str.split('.');
  let name = tokens[0];

  textureMap[name] = `textures/${str}`;
});

const data = `export const textures = ${JSON.stringify(textureMap, null, 2)}`;

fs.writeFileSync('src/game/data/textures.js', data);
