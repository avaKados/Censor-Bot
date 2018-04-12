const Discord = require('discord.io');
var auth = require('./auth.json');

//initialize bot
var bot = new Discord.client({
		token: "", autorun: true
});

bot.on('ready', function(){
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelId, message, event){
		if(message == 'ping'){
			bot.sendMessage({
				to: channelID,
				message: "pong-pong"
			});
		}
});
