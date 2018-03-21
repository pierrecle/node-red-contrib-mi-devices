import { Red } from "node-red";

import { YeelightServer } from "../../devices/yeelight/YeelightServer";
import {default as YeelightConfigurator} from "./YeelightConfigurator";
import {default as YeelightOut} from "./YeelightOut";

export = (RED:Red) => {
    YeelightServer.getInstance().discover();

    YeelightConfigurator(RED);
    YeelightOut(RED);
};
