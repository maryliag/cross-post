module.exports = {
    openModal: context => {
        return {
            trigger_id: context.trigger_id,
            view: {
                type: 'modal',
                title: {
                    type: 'plain_text',
                    text: 'Cross Post Message'
                },
                callback_id: 'cross_post_callback',
                private_metadata: context.metadata,
                submit: {
                    type: 'plain_text',
                    text: 'Cross Post'
                },
                close: {
                    type: 'plain_text',
                    text: 'Cancel',
                    emoji: true
                },
                blocks: [
                    {
                        block_id: 'channel',
                        type: 'input',
                        element: {
                            action_id: 'channel_id',
                            type: 'channels_select',
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Cross Post to'
                        }
                    },
                ]
            }
        }
    },
    sharedMessage: context => {
        return {
            channel: context.channel_id,
            text: "Message cross posted",
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `:parrot-out: Original <${context.link}|message> sent on <#${context.original_channel_id}>. Shared here by <@${context.username}>.`
                    }
                },
                {
                    type: 'divider'
                },
            ]
        }
    },
    threadMessage: context => {
        return {
            thread_ts: context.thread_ts,
            channel: context.channel_id,
            text: "Please continue thread here.",
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Please continue thread here.`
                    }
                },
            ]
        }
    },
    getPermalink: context => {
        return {
            channel: context.channel_id,
            message_ts: context.message_ts,
        }
    },
    confirmation: context => {
        return {
            thread_ts: context.thread_ts,
            channel: context.original_channel_id,
            text: "Message cross posted",
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `:parrot-in: This message was shared to the channel <#${context.shared_channel_id}> by <@${context.username}>. Please continue this thread <${context.message_link}|there>.`
                    }
                },
            ]
        }
    }
}