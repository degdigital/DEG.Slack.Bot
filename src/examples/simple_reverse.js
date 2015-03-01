var Slack = require('..');

//var token = 'xoxp-3172901419-3172901421-3842219765-af8dc6'; //nick key
var token = 'xoxb-3860130778-EdW5JSmCAogu0xLtIxCuFvaT'; //deg bot key
var autoReconnect = true;
var autoMark = true;

var slackClient = new Slack(token, autoReconnect, autoMark);

slackClient.on('open', onConnectionOpen);
slackClient.on('file_comment_added', onCommentAdded);
slackClient.on('message', onMessageAdded);
slackClient.on('error', onConnError);
slackClient.login();

var onConnectionOpen = function () {
    
    var unreads = slackClient.getUnreadCount();
    
    var userChannels = (function () {
        var allchannels = slackClient.channels;
        var myChannels = [];
        for (var id in allchannels) {
            var channel = allchannels[id];
            if (channel.is_member) {
                myChannels.push("#" + channel.name);
            }
        }
        return myChannels;
    })();
    
    var groups = (function () {
        var allgroups = slackClient.groups;
        var myGroups = [];
        for (var id in allgroups) {
            var group = allgroups[id];
            if (group.is_open && !group.is_archived) {
                myGroups.push(group.name);
            }
        }
        return myGroups;
    })();
    
    console.log("Welcome to Slack. You are @" + slackClient.self.name + " of " + slackClient.team.name);
    console.log('Your Channels: ' + userChannels.join(', '));
    console.log('Your Groups: ' + groups.join(', '));
    console.log("You have " + unreads + "unread message(s)");
    return true;
};

var onCommentAdded = function (message) {
    console.log(message);
    if (message.comment) {
        channel = slackClient.getChannelGroupOrDMByID(message.file.channels[0]);
        response = "Moving File to SharePoint Team Site... Connection Success.. " + message.file.name + "uploaded!";
        channel.send(response);
    }
    
    return console.log("file comment added from callback");
};

var onMessageAdded = function (message) {
    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slackClient.getChannelGroupOrDMByID(message.channel);
    user = slackClient.getUserByID(message.user);
    response = '';
    type = message.type, ts = message.ts, text = message.text;
    channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
    console.log("Received: " + type + " " + channelName + " " + userName + " " + ts + " \"" + text + "\"");
    if (type === 'message' && (text != null) && (channel != null)) {
        response = "I am listening!" //text.split('').reverse().join('');
        channel.send(response);
        return console.log("@" + slackClient.self.name + " responded with \"" + response + "\"");
    } else {
        typeError = type !== 'message' ? "unexpected type " + type + "." : null;
        textError = text == null ? 'text was undefined.' : null;
        channelError = channel == null ? 'channel was undefined.' : null;
        errors = [typeError, textError, channelError].filter(function (element) {
            return element !== null;
        }).join(' ');
        return console.log("@" + slackClient.self.name + " could not respond. " + errors);
    }
};
var onConnError = function (error) {
    return console.error("Error: " + error);
};