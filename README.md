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

![Xiaomi configurator in node-red](https://raw.githubusercontent.com/pierrecle/node-red-contrib-mi-devices/master/xiaomi-configurator.png)

Tip: use the configurator from the side-panel (hamburger menu, configuration nodes) to manage your devices. Node-red doesn't update underlying edit screens if the configuration panel is opened / closed from the edit node screen. (If you do, you need to first close the edit node screen and reopen it by double-clicking the node you want to edit the properties for.)


Here an example of how to use the different nodes.

![Xiaomi devices example in node-red](/xiaomi-devices-overview.png?raw=true)

## Enable LAN mode

### Gateway

1. Install MiHome App
2. Make sure you set your region to: Mainland China under settings -> Locale - required for the moment.
Mainland China and language can set on English.
3. Select your Gateway in Mi Home
4. Then the 3 dots at the top right of the screen
5. Then click on about
6. Tap under Tutorial menu (on the blank part) repeatedly
7. You should see now 3 extra options listed in Chinese until you did now enable the developer mode. [ if not try all steps again!]
8. Choose the second new option
9. Then tap the first toggle switch to enable LAN functions. Note down the password (`A4D81977ED8A4177` in the screenshot).
10. Make sure you hit the OK button (to the right of the cancel button) to save your changes.

If you change here something, you lose your password!

![Gateway advanced mode](/xiaomi-gateway-advanced-mode.png?raw=true "Gateway advanced mode")
![Gateway LAN mode enabled](/xiaomi-gateway-lan-enabled.png?raw=true "Gateway LAN mode enabled")

## Roadmap

- [ ] Integrate Yeelight
- [ ] Handle Xiaomi Cube

## Sources

* [Harald Rietman node-red module](https://github.com/hrietman/node-red-contrib-xiaomi-devices)
* [Domoticz Instructions](https://www.domoticz.com/wiki/Xiaomi_Gateway_(Aqara))
* [louisZl Gateway Local API](https://github.com/louisZL/lumi-gateway-local-api)
* [Domoticz Gateway Code](https://github.com/domoticz/domoticz/blob/development/hardware/XiaomiGateway.cpp)
* [Node-red UDP nodes](https://github.com/node-red/node-red/blob/master/nodes/core/io/32-udp.js)
