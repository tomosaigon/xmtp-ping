#!/usr/bin/env node

import { botConfig, XmtpBot, IContext } from "xmtp-bot-cli";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

let gm_peer;
if (process.env.GM_PEER === undefined) {
    gm_peer = '0x937C0d4a6294cdfa575de17382c7076b579DC176'; // gm.xmtp.eth
} else {
    gm_peer = process.env.GM_PEER;
}
if (process.env.PINGER_XMTP_KEY === undefined) {
    console.log("PINGER_XMTP_KEY is not set, creating a new wallet");
    botConfig.key = '';
} else {
    botConfig.key = process.env.PINGER_XMTP_KEY;
}

(async () => {
    let startTime: number;
    let seq = 1;
    const bot = new XmtpBot(
        async (ctx: IContext, line: string) => {
            if (line === 'exit') {
                console.log('Shutting down');
                return false;
            }
            return true;
        },
        async (ctx: IContext, message: DecodedMessage) => {
            if (ctx.client !== undefined && message.senderAddress === (ctx.client as Client).address) {
                return true;
            }

            console.log(`${message.content} from ${message.senderAddress}: seq=${seq++} time=${Date.now() - startTime} ms`);
            setPing();
            return true;
        },
    );

    const client = await bot.getClient();
    const convo = await client.conversations.newConversation(gm_peer);
    console.log(`PING ${gm_peer}`);

    function setPing() {
        setTimeout(() => {
            startTime = Date.now();
            convo.send('gm');
        }, 1000);
    }
    setPing();

    bot.run().then(() => {
        process.exit(0);
    }).catch((err) => {
        console.error(`bot.run() error: ${err}`);
        process.exit(1);
    });
})();
