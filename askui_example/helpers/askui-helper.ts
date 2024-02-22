import { UiControlClient } from 'askui';
import 'dotenv/config'

// List of AskUI Controller connected to remote devices
const uiControllerAndroidDeviceList = ["ws://127.0.0.1:6769", "ws://127.0.0.1:6770"]

// Client is necessary to use the askui API
let aui: UiControlClient;

jest.setTimeout(60 * 1000 * 60);

let maxWorkers: number;
let workerId: number;
let uiControllerUrl: string;

beforeAll(async () => {
  maxWorkers = parseInt(process.env.JEST_MAX_WORKER);
  workerId = parseInt(process.env.JEST_WORKER_ID);

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
