import { aui } from './helpers/askui-helper';


const test_suite_name = 'android test suite 1'
describe(test_suite_name, () => {

  beforeAll(async () => {
    console.log("afterAll '", test_suite_name, "' was executed by Jest Worker: ", process.env.JEST_WORKER_ID);
  })

  it('test case 1', async () => {
    console.log("'", test_suite_name, "' with 'test case 1' was executed by Jest Worker: ",process.env.JEST_WORKER_ID);
    await aui.annotate();
  });

  it('test case 2', async () => {
    console.log("'", test_suite_name, "' with 'test case 2' was executed by Jest Worker: ", process.env.JEST_WORKER_ID);
    await aui.click().text().exec();
  });


  afterAll( async () => {
    console.log("afterAll '", test_suite_name, "' was executed by Jest Worker: ",process.env.JEST_WORKER_ID);
  })
});