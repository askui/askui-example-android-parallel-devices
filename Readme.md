# askui-example-android-parallel-devices
An example using AskUI to parallelize the execution of multiple test suites on two Android devices to speed up the overall execution time.

### Pre-Requests
- Two Android devices connected to the local device
- [adb](https://developer.android.com/tools/adb) is installed

## Install

```bash
npm install
```

## Configure

Set the following environment variables to configure the example. The `ASKUI_WORKSPACE_ID` and `ASKUI_TOKEN` are required to connect to the AskUI services. Read our docs on how to get them: [Windows](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started#step-4-connect-your-askui-account) [Linux](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started-linux#access-token), [macOS](https://docs.askui.com/docs/general/Getting%20Started/Installing%20AskUI/getting-started-macos#access-token).

1. Copy the `.env.template` to `.env` and insert the value for `ASKUI_WORKSPACE_ID` and `ASKUI_TOKEN` e.g.

`.env`-example
```bash
ASKUI_WORKSPACE_ID=<your_workspace_id>
ASKUI_TOKEN=<your_workspace_token>
JEST_MAX_WORKER=1
```

2. Configure your two Android device with the following Guide [Setup Real Android Devices](https://docs.askui.com/docs/general/Executing%20Automations/mobile-automation#set-up-a-real-android-device)

### Windows

Nothing Todo. The AskUI Controller is available inside the AskUI Shell.

### Mac, Linux

3. *Note Mac, Linux only:* Download the controller [Mac (Intel)](https://files.askui.com/releases/askui-ui-controller/latest/darwin/x64/askui-ui-controller.dmg) | [Mac (ARM)](https://files.askui.com/releases/askui-ui-controller/latest/darwin/arm64/askui-ui-controller.dmg ) | [Linux](https://files.askui.com/releases/askui-ui-controller/latest/linux/x64/askui-ui-controller.AppImage) and copy it to this project `askui-example-android-multiple-devices/askui-ui-controller.{exe,dmg,AppImage}`


## Usage
First, we check if both Android devices are connected. This should look like:

```bash
$ adb devices
emulator-5556 device product:sdk_google_phone_x86_64 model:Android_SDK_built_for_x86_64 device:generic_x86_64
emulator-5554 device product:sdk_google_phone_x86 model:Android_SDK_built_for_x86 device:generic_x86
```

Now we have to open a terminal for each AskUI Controller and start it on different ports.

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
Afterward there should be two reports under html screenshots `./report/`
