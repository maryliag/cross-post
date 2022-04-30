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

const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

receiver.router.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
receiver.router.use(bodyParser.json({ verify: rawBodyBuffer }));

// The cross_post shortcut opens a modal
app.shortcut('cross_post', async ({ shortcut, ack, logger, client }) => {
    try {
        // Acknowledge shortcut request
        await ack({
            response_action: "clear",
        });

        let resultMessagePermalink = await actions.getMessagePermalink(
            client, shortcut.channel.id, shortcut.message['ts']);
        if (resultMessagePermalink.error) {
            logger.error(resultMessagePermalink.error);
        }
        let link = resultMessagePermalink['permalink'];

        let result = await actions.openModal(app, shortcut, link)
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

        let thread_ts = view.private_metadata.split(",")[0];
        let original_channel_id = view.private_metadata.split(",")[1];
        let link = view.private_metadata.split(",")[2];
        let shared_channel_id = view.state.values.channel.channel_id['selected_channel']
        let resultShare = await actions.shareMessage(client, user, view, original_channel_id, link);
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

exports.slack = receiver.app;
