import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import logger from '../utils/logger';

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
interface ConfigStore {
  loadState: 0 | 1;
  dbURL: string;
  frontURL: string;
  backURL: string;
  textKey: string;
  bingKey: string;
  textEndpoint: string;
  bingEndpoint: string;

}
type keys = 'dbURL' | 'frontURL' | 'backURL' | 'textKey' | 'bingKey' | 'textEndpoint' | 'bingEndpoint';


let config: ConfigStore = {
  loadState: 0,
  dbURL: '',
  frontURL: '',
  backURL: '',
  textKey: '',
  bingKey: '',
  textEndpoint : '',
  bingEndpoint : ''
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
      config.loadState = 1;
    } catch (err) {
      logger.error(err, 'config');
    }
  }
  await update();
});

export async function getValue(key: keys): Promise<any> {
  while (config.loadState === 0) {
    await sleep(100);
  }
  switch (key) {
  case 'dbURL':
    return config.dbURL;
  case 'frontURL':
    return config.frontURL;
  case 'backURL':
    return config.backURL;
  case 'textKey':
    return config.textKey;
  case 'bingKey':
    return config.bingKey;
  case 'textEndpoint':
    return config.textEndpoint;
  case 'bingEndpoint':
    return config.bingEndpoint;
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
  case 'textKey':
    config.textKey = value;
  case 'bingKey':
    config.bingKey = value;
    break;
  case 'textEndpoint':
    config.textEndpoint = value;
  case 'bingEndpoint':
    config.bingEndpoint = value;
    break;
  default:
    throw new Error(`${key} is not in config`);
  }
  await update();
}
