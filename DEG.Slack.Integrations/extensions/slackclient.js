var SlackClient = require('slack-client');

var ExtendedClient = (function (slackClient) {
    function extendedClient(token, autoReconnect, autoMark) {
        
        var Slack = new slackClient(token, autoReconnect, autoMark);
        
        Slack.getCurrentUserChannels = function () {
            var allchannels = Slack.channels;
            var myChannels = [];
            for (var id in allchannels) {
                var channel = allchannels[id];
                if (channel.is_member) {
                    myChannels.push("#" + channel.name);
                }
            }
            return myChannels;
        };

        Slack.getcurrentUserGroups = function () {            
            var allgroups = slackClient.groups;
            var myGroups = [];
            for (var id in allgroups) {
                var group = allgroups[id];
                if (group.is_open && !group.is_archived) {
                    myGroups.push(group.name);
                }
            }
            return myGroups;
            
        };
        
        Slack.getFormattedChannelName = function (channel) {
            var channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
            channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
            return channelName;
        };
        
        Slack.getFormattedUserName = function (user) {
            var userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
            return userName;
        };
        
        
        return Slack;
    };
    
    return extendedClient;

})(SlackClient);

module.exports = ExtendedClient;