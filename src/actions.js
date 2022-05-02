const payloads = require("./payloads");

// Open Modal containing the select for the channel to share the message and the text message.
const openModal = async (app, payload, link) => {
    const viewData = payloads.openModal({
        trigger_id: payload.trigger_id,
        user_id: payload.user.id,
        username: payload.user.username,
        metadata: payload.message["ts"] + "," + payload.channel.id + "," + link,
    });
    return app.client.views.open(viewData);
};

// Sharing the message to a new channel.
const shareMessage = async (client, user, view, original_channel_id, link) => {
    const values = view.state.values;
    const messageData = payloads.sharedMessage({
        original_channel_id: original_channel_id,
        channel_id: values.channel.channel_id['selected_channel'],
        user_id: user.id,
        username: user.username,
        link: link,
    });

    return client.chat.postMessage(messageData);
}

// Creates a thread on the shared message.
const threadMessage = async (client, view, thread_ts) => {
    const values = view.state.values;
    const messageData = payloads.threadMessage({
        channel_id: values.channel.channel_id['selected_channel'],
        thread_ts: thread_ts,
    });

    return client.chat.postMessage(messageData);
}

// Get the link for the message just shared.
const getMessagePermalink = async (client, channel_id, message_ts) => {
    const messageData = payloads.getPermalink({
        channel_id: channel_id,
        message_ts: message_ts,
    });

    return client.chat.getPermalink(messageData);
}

// Post confirmation on the original message, pointing to the new thread.
const sendConfirmation = async (client, thread_ts, original_channel_id, shared_channel_id, message_link) => {
    const messageData = payloads.confirmation({
        thread_ts: thread_ts,
        original_channel_id: original_channel_id,
        shared_channel_id: shared_channel_id,
        message_link: message_link
    });

    return client.chat.postMessage(messageData);
}

module.exports = { openModal, shareMessage, threadMessage, getMessagePermalink, sendConfirmation };