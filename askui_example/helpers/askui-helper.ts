import { UiControlClient } from 'askui';
import 'dotenv/config';

// List of AskUI Controller connected to remote devices
const uiControllerAndroidDeviceList = ["ws://127.0.0.1:6769", "ws://127.0.0.1:6869"]

// Client is necessary to use the askui API
let aui: UiControlClient;

jest.setTimeout(60 * 1000 * 60);

let maxWorkers: number;
let workerId: number;
let uiControllerUrl: string;

beforeAll(async () => {
  maxWorkers = parseInt(process.env.JEST_MAX_WORKER); // Our env variable defined in .env file
  workerId = parseInt(process.env.JEST_WORKER_ID); // Each Jest Worker starts as its own process and the index begins with 1. See https://jestjs.io/docs/environment-variables#jest_worker_id

  expect(maxWorkers).toBeLessThanOrEqual(uiControllerAndroidDeviceList.length)


  // Select one Android Device per Worker
  uiControllerUrl = uiControllerAndroidDeviceList[workerId - 1]
  aui = await UiControlClient.build({
    uiControllerUrl: uiControllerUrl,
  });
  await aui.connect();  

  console.log("Jest Worker: ", workerId, "/", maxWorkers, " connect to '", uiControllerUrl, "'")
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  aui.disconnect();

  console.log("Jest Worker: ", workerId, "/", maxWorkers, " disconnected from '", uiControllerUrl, "'")
});

export { aui };
