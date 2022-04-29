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
                callback_id: 'crosspost',
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
                    {
                        block_id: 'message',
                        type: 'input',
                        element: {
                            action_id: 'message',
                            type: 'plain_text_input',
                            multiline: true,
                            initial_value: `${context.message}`,
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Message'
                        }
                    },
                ]
            }
        }
    },
    sharedMessage: context => {
        return {
            channel: context.channel_id,
            text: context.message,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `:parrot-out: Message from @${context.username}`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: context.message
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
                        text: `:parrot-in: Your message was shared to channel <#${context.shared_channel_id}>. Please continue this thread <${context.message_link}|here>.`
                    }
                },
            ]
        }
    }
}