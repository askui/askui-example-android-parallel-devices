# askui-example-android-parallel-devices
A simple example using AskUI to parallelize the execution of multiple test suites on 2 Android devices to speed up the overall execution time.

### Pre-Requests
- 2 Android Devices connected to the local device
- [adb](https://developer.android.com/tools/adb) is installed


## Install

```bash
npm install
```

## Configure

Set the following environment variables to configure the example. The `ASKUI_WORKSPACE_ID` and `ASKUI_TOKEN` are required to connect to the askui services. Read our docs on how to get them: [Windows](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started#step-4-connect-your-askui-account) [Linux](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started-linux#access-token), [macOS](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started-macos#access-token).

1. Copy the `.env.template` to `.env` and insert the value for `ASKUI_WORKSPACE_ID` and `ASKUI_TOKEN` e.g.

`.env`-example
```bash
ASKUI_WORKSPACE_ID=<your_workspace_id>
ASKUI_TOKEN=<your_workspace_token>
JEST_MAX_WORKER=1
```

2. Configure your 2 Android device with the following Guide [Setup Real Android Devices](https://docs.askui.com/docs/general/Executing%20Automations/mobile-automation#set-up-a-real-android-device)

### Windows

Nothing Todo. The AskUI Controller is available inside the AskUI Shell.

### Mac, Linux

3. *Note Mac, Linux only:* Download the controller [Mac (Intel)](https://files.askui.com/releases/askui-ui-controller/latest/darwin/x64/askui-ui-controller.dmg) | [Mac (ARM)](https://files.askui.com/releases/askui-ui-controller/latest/darwin/arm64/askui-ui-controller.dmg ) | [Linux](https://files.askui.com/releases/askui-ui-controller/latest/linux/x64/askui-ui-controller.AppImage) and copy it to this project `askui-example-android-multiple-devices/askui-ui-controller.{exe,dmg,AppImage}`


## Usage

First we check if booth android devices are connected. This should look like:
```bash
$ adb devices
emulator-5556 device product:sdk_google_phone_x86_64 model:Android_SDK_built_for_x86_64 device:generic_x86_64
emulator-5554 device product:sdk_google_phone_x86 model:Android_SDK_built_for_x86 device:generic_x86
```

Now we have to open for each AskUI Controller a terminal and start it on different ports.

### Windows
```
# Open AskUI Shell
askui-shell

# Start first AskUI Controller on Port 6769 for android device 0 (emulator-5556)
AskUI-StartController -DisplayNum 0 -Runtime android -Port 6769

# Start second AskUI Controller on Port 6770 for android device 1 (emulator-5554)
AskUI-StartController -DisplayNum 1 -Runtime android -Port 6770
```

### Linux

```bash
# Connects to the first device returned by 'adb devices'
./askui-ui-controller.AppImage --host 0.0.0.0 -p 6769 -d 0 -m -r android

# Connects to the second device returned by 'adb devices'
./askui-ui-controller.AppImage --host 0.0.0.0 -p 6869 -d 1 -m -r android
```

### macOS

```bash
# Start first AskUI Controller on Port 6769 for android device 0 (emulator-5556)
./askui-ui-controller --host 0.0.0.0 -p 6769 -d 0 -m -r android

# Start second AskUI Controller on Port 6869 for android device 1 (emulator-5554)
./askui-ui-controller --host 0.0.0.0 -p 6869 -d 1 -m -r android
```


We need now enter all AskUI Controller in the `uiControllerAndroidDeviceList` in `askui_example/helpers/askui-helper.ts`:
```typescript
...
const uiControllerAndroidDeviceList = ["ws://127.0.0.1:6769", "ws://127.0.0.1:6770"]
...
```

The `JEST_MAX_WORERS` in `.env` defines the [max number of Jest Workes](https://jestjs.io/docs/cli#--maxworkersnumstring). This number should be less or equal to the number of devices. Therefore we set it `2`:
```
...
JEST_MAX_WORKER=2
```

Then let's run the workflows with:
```bash
npm run askui
```

Each worker selects one Android device based on their `JEST_WORKER_ID` [(docs)](https://jestjs.io/docs/environment-variables#jest_worker_id). See line 16 - 31 in `askui_example/helpers/askui-helper.ts`


The output shows that one worker connects to one device, executes the test suite and then disconnects:

```

> askui-example-android-multi-device@1.0.0 askui
> npx jest ./askui_example/ --config ./askui_example/jest.config.ts --maxWorkers $(node -e "require('dotenv').config();console.log(process.env.JEST_MAX_WORKER || 1)")

[2024-02-22 19:28:38.004 +0100] INFO (askuiUiControlClient): Credentials are used from ENV variables: ASKUI_TOKEN and ASKUI_WORKSPACE_ID
[2024-02-22 19:28:38.035 +0100] INFO (askuiUiControlClient): Credentials are used from ENV variables: ASKUI_TOKEN and ASKUI_WORKSPACE_ID
[2024-02-22 19:28:41.884 +0100] INFO (askuiUiControlClient): Annotation saved under "report/20240222182841865_annotation.html".
[2024-02-22 19:28:42.194 +0100] INFO (askuiUiControlClient): Annotation saved under "report/20240222182842173_annotation.html".
 PASS  askui_example/andorid-test-suite-5.test.ts (10.756 s)
  ● Console

    console.log
      Jest Worker:  2 / 2  connect to ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:30:11

    console.log
      afterAll ' android test suite 5 ' was executed by Jest Worker:  2

      at andorid-test-suite-5.test.ts:8:13

    console.log
      ' android test suite 5 ' with 'test case 1' was executed by Jest Worker:  2

      at andorid-test-suite-5.test.ts:12:13

    console.log
      ' android test suite 5 ' with 'test case 2' was executed by Jest Worker:  2

      at andorid-test-suite-5.test.ts:17:13

    console.log
      afterAll ' android test suite 5 ' was executed by Jest Worker:  2

      at andorid-test-suite-5.test.ts:23:13

    console.log
      Jest Worker:  2 / 2  disconnected from ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:42:11

 PASS  askui_example/andorid-test-suite-2.test.ts (11.223 s)
  ● Console

    console.log
      Jest Worker:  1 / 2  connect to ' ws://127.0.0.1:6769 '

      at helpers/askui-helper.ts:30:11

    console.log
      afterAll ' android test suite 2 ' was executed by Jest Worker:  1

      at andorid-test-suite-2.test.ts:8:13

    console.log
      ' android test suite 2 ' with 'test case 1' was executed by Jest Worker:  1

      at andorid-test-suite-2.test.ts:12:13

    console.log
      ' android test suite 2 ' with 'test case 2' was executed by Jest Worker:  1

      at andorid-test-suite-2.test.ts:17:13

    console.log
      afterAll ' android test suite 2 ' was executed by Jest Worker:  1

      at andorid-test-suite-2.test.ts:23:13

    console.log
      Jest Worker:  1 / 2  disconnected from ' ws://127.0.0.1:6769 '

      at helpers/askui-helper.ts:42:11

[2024-02-22 19:28:45.861 +0100] INFO (askuiUiControlClient): Credentials are used from ENV variables: ASKUI_TOKEN and ASKUI_WORKSPACE_ID
[2024-02-22 19:28:46.339 +0100] INFO (askuiUiControlClient): Credentials are used from ENV variables: ASKUI_TOKEN and ASKUI_WORKSPACE_ID
[2024-02-22 19:28:48.340 +0100] INFO (askuiUiControlClient): Annotation saved under "report/20240222182848325_annotation.html".
[2024-02-22 19:28:48.896 +0100] INFO (askuiUiControlClient): Annotation saved under "report/20240222182848881_annotation.html".
 PASS  askui_example/andorid-test-suite-1.test.ts (5.876 s)
  ● Console

    console.log
      Jest Worker:  2 / 2  connect to ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:30:11

    console.log
      afterAll ' android test suite 1 ' was executed by Jest Worker:  2

      at andorid-test-suite-1.test.ts:8:13

    console.log
      ' android test suite 1 ' with 'test case 1' was executed by Jest Worker:  2

      at andorid-test-suite-1.test.ts:12:13

    console.log
      ' android test suite 1 ' with 'test case 2' was executed by Jest Worker:  2

      at andorid-test-suite-1.test.ts:17:13

    console.log
      afterAll ' android test suite 1 ' was executed by Jest Worker:  2

      at andorid-test-suite-1.test.ts:23:13

    console.log
      Jest Worker:  2 / 2  disconnected from ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:42:11

[2024-02-22 19:28:51.797 +0100] INFO (askuiUiControlClient): Credentials are used from ENV variables: ASKUI_TOKEN and ASKUI_WORKSPACE_ID
 PASS  askui_example/andorid-test-suite-3.test.ts (6.213 s)
  ● Console

    console.log
      Jest Worker:  1 / 2  connect to ' ws://127.0.0.1:6769 '

      at helpers/askui-helper.ts:30:11

    console.log
      afterAll ' android test suite 3 ' was executed by Jest Worker:  1

      at andorid-test-suite-3.test.ts:8:13

    console.log
      ' android test suite 3 ' with 'test case 1' was executed by Jest Worker:  1

      at andorid-test-suite-3.test.ts:12:13

    console.log
      ' android test suite 3 ' with 'test case 2' was executed by Jest Worker:  1

      at andorid-test-suite-3.test.ts:17:13

    console.log
      afterAll ' android test suite 3 ' was executed by Jest Worker:  1

      at andorid-test-suite-3.test.ts:23:13

    console.log
      Jest Worker:  1 / 2  disconnected from ' ws://127.0.0.1:6769 '

      at helpers/askui-helper.ts:42:11

[2024-02-22 19:28:54.290 +0100] INFO (askuiUiControlClient): Annotation saved under "report/20240222182854273_annotation.html".
 PASS  askui_example/andorid-test-suite-4.test.ts (5.859 s)
  ● Console

    console.log
      Jest Worker:  2 / 2  connect to ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:30:11

    console.log
      afterAll ' android test suite 4 ' was executed by Jest Worker:  2

      at andorid-test-suite-4.test.ts:8:13

    console.log
      ' android test suite 4 ' with 'test case 1' was executed by Jest Worker:  2

      at andorid-test-suite-4.test.ts:12:13

    console.log
      ' android test suite 4 ' with 'test case 2' was executed by Jest Worker:  2

      at andorid-test-suite-4.test.ts:17:13

    console.log
      afterAll ' android test suite 4 ' was executed by Jest Worker:  2

      at andorid-test-suite-4.test.ts:23:13

    console.log
      Jest Worker:  2 / 2  disconnected from ' ws://127.0.0.1:6770 '

      at helpers/askui-helper.ts:42:11


Test Suites: 5 passed, 5 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        23.038 s
Ran all test suites matching /.\/askui_example\//i.

```



Afterwards there should be two reports under html screenshots `./report/`
