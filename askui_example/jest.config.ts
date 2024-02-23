import type { Config } from '@jest/types';
import 'dotenv/config'


const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: '@askui/jest-allure-circus',
  setupFilesAfterEnv: ['./helpers/askui-helper.ts'],
  sandboxInjectedGlobals: [
    'Math',
  ],
  maxWorkers: process.env.JEST_MAX_WORKER ? parseInt(process.env.JEST_MAX_WORKER) : 1
};

// eslint-disable-next-line import/no-default-export
export default config;
