# cross-post

On https://api.slack.com/apps/ 
Create App
Add name: Cross Post
Desc: Cross Post messages to the right channel
Image: crossroad (from images file)
Copy signing secreat and add to .env file (SLACK_SIGNING_SECRET=)

Interactivity & Shortcuts: turn on
add URL
add shortcut > on messages
name: Cross Post this message
desc: Cross Post this message to another channel
callback id: crosspost

OAuth & Permissions
Scopes: add scopes > chat:write, users:read, chat:write.public, channels:read


local test:
brew install ngrok/ngrok/ngrok
ngrok http 80
update URL on app to the api here
