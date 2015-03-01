var Slack = require('..');

//var token = 'xoxp-3172901419-3172901421-3842219765-af8dc6'; //nick key
var token = 'xoxb-3860130778-EdW5JSmCAogu0xLtIxCuFvaT'; //deg bot key
var autoReconnect = true;
var autoMark = true;

var slackClient = new Slack(token, autoReconnect, autoMark);

var botResponses =
{
     wilrelessPassword: "wireless code,wireless access,password"
};

slackClient.on('open', function () {
    
    var unreads = slackClient.getUnreadCount();
    var userChannels = slackClient.getCurrentUserChannels();
    var groups = slackClient.getcurrentUserGroups();
    
    console.log("Welcome to Slack. You are @" + slackClient.self.name + " of " + slackClient.team.name);
    console.log('Your Channels: ' + userChannels.join(', '));
    console.log('Your Groups: ' + groups.join(', '));
    console.log("You have " + unreads + " unread message(s)");
    
    return true;
});
slackClient.on('file_comment_added', function (message) {
    console.log("file_comment_added event fired");
    console.log(message);
    var comment = message.comment;
    if (comment) {
        if (message.file.channels.length > 0) {
            var channel = slackClient.getChannelGroupOrDMByID(message.file.channels[0]);
            if (comment.indexOf("/UploadToSP") > -1) {
                var response = "Moving File to SharePoint Team Site... Connection Success.. " + message.file.name + " uploaded!";
                channel.send(response);
                return true;
            }
        }
    }
    return false;
});
slackClient.on('message', function (message) {
    
    var channel = slackClient.getChannelGroupOrDMByID(message.channel);
    var user = slackClient.getUserByID(message.user);
    var response = '';
    var messageType = message.type;
    var ts = message.ts;
    var text = message.text;
    var channeFormattedName = slackClient.getFormattedChannelName(channel);
    var userFormattedName = slackClient.getFormattedUserName(user);
    
    console.log("Received Message : " + messageType + " " + channeFormattedName + " " + userFormattedName + " " + ts + " \"" + text + "\"");
    //todo check if message is response to robot mention
    if (messageType === 'message' && (text != null) && (channel != null)) {
        console.log(message);
        var passwordKeys = botResponses.wilrelessPassword.split(",");
        for (var key in passwordKeys) {
            if (text.indexOf(key) > -1) {
                
                channel.send("You can find information here: https://degec.slack.com/files/nickaranz/F03RP5JG3/deg_wireless - Yeah I know it all");
                console.log("@" + slackClient.self.name + " responded with \"" + response + "\"");
                return true;
            }
        }
        
        return false;
    } else {
        var typeError = messageType !== 'message' ? "unexpected type " + messageType + "." : null;
        var textError = text == null ? 'text was undefined.' : null;
        var channelError = channel == null ? 'channel was undefined.' : null;
        var errors = [typeError, textError, channelError].filter(function (element) {
            return element !== null;
        }).join(' ');
        return console.log("@" + slackClient.self.name + " could not respond. " + errors);
    }
});
slackClient.on('error', function (error) {
    return console.error("Error: " + error);
});


slackClient.login();
