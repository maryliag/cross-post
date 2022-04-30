'use strict';

require('dotenv').config();

const { App, ExpressReceiver } = require('@slack/bolt');
const bodyParser = require('body-parser');
const actions = require('./actions');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    receiver,
});

(async () => {
    await app.start(process.env.PORT || 6000);
    console.log('Cross Post app is running!');
})();

let message;
let thread_ts;
let original_channel_id;
let shared_channel_id;

const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

receiver.router.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
receiver.router.use(bodyParser.json({ verify: rawBodyBuffer }));

// The cross_post shortcut opens a modal
app.shortcut('cross_post', async ({ shortcut, ack, logger }) => {
    try {
        // Acknowledge shortcut request
        await ack({
            response_action: "clear",
        });
        thread_ts = shortcut.message["ts"];
        original_channel_id = shortcut.channel.id;
        message = shortcut.message.text;
        let result = await actions.openModal(app, shortcut)
        if (result.error) {
            logger.error(result.error);
        }
    }
    catch (error) {
        logger.error(error);
    }
});

app.view('cross_post_callback', async ({ body, view, ack, client, logger }) => {
    try {
        // Acknowledge request
        await ack({
            response_action: "clear",
        });
        const { user } = body;

        shared_channel_id = view.state.values.channel.channel_id['selected_channel']
        let resultShare = await actions.shareMessage(client, user, view, message, original_channel_id);
        if (resultShare.error) {
            logger.error(resultShare.error);
        }

        let resultMessagePermalink = await actions.getMessagePermalink(
            client, shared_channel_id, resultShare.message['ts']);
        if (resultMessagePermalink.error) {
            logger.error(resultMessagePermalink.error);
        }

        let resultConfirmation = await actions.sendConfirmation(
            client, thread_ts, original_channel_id, shared_channel_id, resultMessagePermalink['permalink']);
        if (resultConfirmation.error) {
            logger.error(resultConfirmation.error);
        }
    }
    catch (error) {
        logger.error(error);
    }
});
