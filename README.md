# cross-post <img src="images/crossroad.png" width="20"/>

Slack App for cross posting messages to a different channel.

When someone asks a question in a channel, but that was not the right channel to ask, 
what do you do? Share the message to the right channel!  

But now you have people replying to the original message and others replying to the 
shared message, no one knows what is going on! It's chaos!! Help! :scream:

Don't worry, Cross Post is here to help you!

Now the message is shared to the new correct channel and a message is also sent to 
the original thread to indicated where the conversation should continue! Chaos no more!
:smile:

## Usage
1. Click on `More Actions` on the message you want to share (you don't have to be the author)  
<img src="images/select-action.png" width="400"/>
2. Select the channel you want to share    
<img src="images/share-message.png" width="400"/>
3. The Message will show up in the new channel  
<img src="images/shared-message.png" width="600"/>
4. The confirmation message will show up in the original message  
<img src="images/confirmation-message.png" width="400"/>

## Setup
### Create the App on Slack
1. Go to https://api.slack.com/apps/ and click on `Create App`  
2. Add a name (`Cross Post`) and a description (`Cross Post messages to another channel`)   
3. Add an image (You can use the `crossroad.png` file from the `images` folder)  
4. Copy the values for `SLACK_SIGNING_SECRET` and `SLACK_BOT_TOKEN` (you will add them to the `.env` file)

### Add Permissions
1. Go to OAuth & Permissions
2. Add the scopes: `chat:write`, `users:read`, `chat:write.public`, `channels:read`

### Connect your App to Slack
1. Go to the `Interactivity & Shortcuts` and turn it on
2. Add the URL for your App ending with `/slack/events`, e.g. `https://example.ngrok.io/slack/events`
3. Click on `Create New Shortcut` and select `On messages`
4. Add name (`Cross Post this message`) and description (`Cross Post this message to another channel`) 
5. Add a callback id (`cross_post`)

### Add the emojis to Slack
1. Click on the emoji on your input area and `Add Emoji`  
<img src="images/add-emoji.png" width="200"/>
2. Using the images from the `images` folder, add `parrot-in` <img src="images/parrot-in.gif" width="25"/> and `parrot-out` <img src="images/parrot-out.gif" width="25"/> to your Slack, using those exact names.  

### Production
TBD

### To test locally
1. Install node and ngrok
2. Start your app with `npm start`
3. Start your tunnel with `ngrok http 6000` (or whatever port you used on `index.js`)
4. Update the URL on Interactivity & Shortcuts to point to the URL created on the previous step

(Note: the tunnel has a session, e.g. 2h, so make sure it's still up when you're testing)
