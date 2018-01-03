# node-red-contrib-mi-devices

This module contains the following nodes to provide easy integration of the Xiaomi devices into node-red.
This module is a fork of [Harald Rietman module, node-red-contrib-xiaomi-devices](https://github.com/hrietman/node-red-contrib-xiaomi-devices)

The following devices are currently supported:

* Temperature/humidity sensor
* Aqara temperature/humidity/pressure sensor
* Magnet switch
* Aqara window/door sensor
* Button switch
* Aqara smart wireless switch
* Motion sensor
* Power plug (zigbee)
* Power plug (wifi)

## Preperation

To interact with the gateway, you need to enable the developer mode, aka LAN mode in the gateway (see below).

To control the Wifi-Plug, extensive use is made of the miio library created by [Andreas Holstenson](https://github.com/aholstenson/miio).
Make sure to check his page for compatible devices.

## Install

```
npm install node-red-contrib-mi-devices
```

## Usage

From the Xiaomi configurator screen add your different devices by selecting the type of device and a readable description. The readable discription is used on the different edit screen of the nodes to easily select the device you associate to the node.

Note that the Wifi power plug is not configured through the configurator as it is not connected to the gateway.

The Xiaomi configurator screen with ease of use to configure your different devices.

![Mi configurator in node-red](resources/mi-configurator.png?raw=true "Mi configurator in node-red")

Tip: use the configurator from the side-panel (hamburger menu, configuration nodes) to manage your devices. Node-red doesn't update underlying edit screens if the configuration panel is opened / closed from the edit node screen. (If you do, you need to first close the edit node screen and reopen it by double-clicking the node you want to edit the properties for.)

### How to use different nodes

Here an example of how to use the different nodes (screenshot of [importable flows-overview.json](flows-overview.json "Mi Devices overview")):
![Mi devices example in node-red](resources/mi-devices-overview.png?raw=true "Mi devices example in node-red")


### Sample flows

Here are different flow (screenshot of [importable flows-sample.json](flows-sample.json "Different flows using Mi Devices")):
![Mi devices example in node-red](resources/mi-devices-sample.png?raw=true "Mi devices flow sample")

## Enable LAN mode

### Gateway

1. Install MiHome App
2. Make sure you set your region to: Mainland China under settings -> Locale - required for the moment.
Mainland China and language can set on English.
3. Select your Gateway in Mi Home
4. Then the 3 dots at the top right of the screen
5. Then click on about
6. Tap under Tutorial menu (on the blank part) repeatedly
7. You should see now 3 extra options listed in Chinese until you did now enable the developer mode (like the first screenshot below, if not try all steps again!)
8. Choose the second new option
9. Then tap the first toggle switch to enable LAN functions. Note down the password (`A4D81977ED8A4177` in the second screenshot)
10. Make sure you hit the OK button (to the right of the cancel button) to save your changes

If you change here something, you lose your password!

![Gateway advanced mode](resources/xiaomi-gateway-advanced-mode.png?raw=true "Gateway advanced mode")
![Gateway LAN mode enabled](resources/xiaomi-gateway-lan-enabled.png?raw=true "Gateway LAN mode enabled")

## Roadmap

- [ ] Integrate Yeelight
- [ ] Handle Xiaomi Cube
- [ ] Add filter on "all" node
- [ ] Set action status when no token available
- [ ] Add gateway status
- [X] Update icons
- [X] Refactor socket and add on/off actions
- [X] Add device SID in output
- [X] Remove different output styles
- [X] Code cleanup

## Sources

* [Harald Rietman node-red module](https://github.com/hrietman/node-red-contrib-xiaomi-devices)
* [Domoticz Instructions](https://www.domoticz.com/wiki/Xiaomi_Gateway_(Aqara))
* [louisZl Gateway Local API](https://github.com/louisZL/lumi-gateway-local-api)
* [Domoticz Gateway Code](https://github.com/domoticz/domoticz/blob/development/hardware/XiaomiGateway.cpp)
* [Node-red UDP nodes](https://github.com/node-red/node-red/blob/master/nodes/core/io/32-udp.js)

## Credits

* [Switch icons by Setyo Ari Wibowo](https://thenounproject.com/seochan.art/)
* ["All" icon by Fatahillah](https://thenounproject.com/fatahillah/)
* [Bulb icon by Mello](https://thenounproject.com/stonuiiuntk/)
* [Glasses icon by Agrahara](https://thenounproject.com/agrahara4/)
* [Volume icons by krishna](https://thenounproject.com/krishanayuga/)
* [List icon by Landan Lloyd](https://thenounproject.com/landan/)
* [Clicks icons by Adrien Coquet](https://thenounproject.com/coquet_adrien/)
