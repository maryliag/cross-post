const payloads = require("./payloads");

// Open Modal containing the select for the channel to share the message and the text message.
const openModal = async (app, payload) => {
    const viewData = payloads.openModal({
        trigger_id: payload.trigger_id,
        user_id: payload.user.id,
        username: payload.user.username,
    });
    return app.client.views.open(viewData);
};

// Sharing the message to a new channel.
const shareMessage = async (app, user, view, message, original_channel_id) => {
    const values = view.state.values;
    const messageData = payloads.sharedMessage({
        original_channel_id: original_channel_id,
        channel_id: values.channel.channel_id['selected_channel'],
        user_id: user.id,
        username: user.username,
        message: message,
    });

    return app.client.chat.postMessage(messageData);
}

// Get the link for the message just shared.
const getMessagePermalink = async (app, channel_id, message_ts) => {
    const messageData = payloads.getPermalink({
        channel_id: channel_id,
        message_ts: message_ts,
    });

    return app.client.chat.getPermalink(messageData);
}

// Post confirmation on the original message, pointing to the new thread.
const sendConfirmation = async (app, thread_ts, original_channel_id, shared_channel_id, message_link) => {
    const messageData = payloads.confirmation({
        thread_ts: thread_ts,
        original_channel_id: original_channel_id,
        shared_channel_id: shared_channel_id,
        message_link: message_link
    });

    return app.client.chat.postMessage(messageData);
}

module.exports = { openModal, shareMessage, getMessagePermalink, sendConfirmation };