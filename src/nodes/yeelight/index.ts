import { Red, NodeProperties } from "node-red";
import * as YeelightSearch from 'yeelight-wifi';

import { Searcher } from "./Searcher";
import {default as YeelightConfigurator} from "./YeelightConfigurator";
import {default as YeelightOut} from "./YeelightOut";

export = (RED:Red) => {
    Searcher.discover(RED);

    YeelightConfigurator(RED);
    YeelightOut(RED);
};
