import { execSync } from 'child_process';
import * as fs from 'fs';

const package_json = JSON.parse(fs.readFileSync('./package.json'));
const submodule_version = package_json.dependencies[process.argv[2]];

execSync(`git submodule update --init ${process.argv[3]} || echo 'Done'`, { stdio: 'inherit' });
execSync(`cd ${process.argv[3]} && git fetch --all --tags && git checkout v${submodule_version}`, { stdio: 'inherit' });
