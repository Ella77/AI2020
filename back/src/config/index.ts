import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import logger from '../utils/logger';

interface ConfigStore {
  dbURL: string;
  frontURL: string;
  backURL: string;
}
type keys = 'dbURL' | 'frontURL' | 'backURL';


let config: ConfigStore = {
  dbURL: 'mongodb://localhost/kpmg',
  frontURL: 'http://localhost:3000',
  backURL: 'http://localhost:4000'
};

const STORE_PATH = path.join(__dirname, 'store');
async function update() {
  try {
    await jsonfile.writeFile(STORE_PATH, config);
  } catch (err) {
    throw err;
  }
}
fs.exists(STORE_PATH, async (exists) => {
  if (exists) {
    try {
      const file = await jsonfile.readFile(STORE_PATH);
      config = Object.assign(config, file);
    } catch (err) {
      logger.error(err, 'config');
    }
  }
  await update();
});

export function getValue(key: keys): any {
  switch (key) {
  case 'dbURL':
    return config.dbURL;
  case 'frontURL':
    return config.frontURL;
  case 'backURL':
    return config.backURL;
  default:
    throw new Error(`${key} is not in config`);
  }
}

export async function set(key: keys, value: any) {
  switch (key) {
  case 'dbURL':
    config.dbURL = value;
    break;
  case 'frontURL':
    config.frontURL = value;
    break;
  case 'backURL':
    config.backURL = value;
    break;
  default:
    throw new Error(`${key} is not in config`);
  }
  await update();
}
