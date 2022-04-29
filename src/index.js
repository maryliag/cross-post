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

receiver.router.post('/actions', async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const { type, user, view } = payload;

    switch (type) {
        case 'message_action':
            thread_ts = payload.message["ts"];
            original_channel_id = payload.channel.id;
            let resultModal = await actions.openModal(app, payload)
            if (resultModal.error) {
                console.log(resultModal.error);
                return res.status(500).send();
            }
            return res.status(200).send();
        case 'view_submission':
            // immediately respond with an empty 200 response to let
            // Slack know the command was received.
            res.send('');
            // res.status(200).send()
            shared_channel_id = view.state.values.channel.channel_id['selected_channel']
            let resultShare = await actions.shareMessage(app, user, view);
            if (resultShare.error) {
                console.log(resultShare.error);
                return res.status(500).send();
            }

            let resultMessagePermalink = await actions.getMessagePermalink(
                app, shared_channel_id, resultShare.message['ts']);
            if (resultMessagePermalink.error) {
                console.log(resultMessagePermalink.error);
                return res.status(500).send();
            }

            let resultConfirmation = await actions.sendConfirmation(
                app, thread_ts, original_channel_id, shared_channel_id, resultMessagePermalink['permalink']);
            if (resultConfirmation.error) {
                console.log(resultConfirmation.error);
                return res.status(500).send();
            }
            break;
    }

});
