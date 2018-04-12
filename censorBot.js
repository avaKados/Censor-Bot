//references:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.youtube.com/watch?v=ak8ZoizL82Y

const Discord = require('discord.io');
var config = require('./config.json');

//sources: http://www.bannedwordlist.com/lists/swearWords.txt
//https://www.noswearing.com/dictionary
var bannedWords = ['anal', 'anus','arse','ass','ass-hat','assbag','asscock','asses','assface','assfuck','assfucker','asshat''asshole','assholes','asslicker','asswipe',
		'ballsack','ball sack','balls','bastard','bitch','bitchass','bitches','bitchtits','bitchy','blowjob','blowjobs','blow job','boner','boners','boob','boobs','brotherfucker','bullshit','buttfucker','buttplug',
		'choad','chode',,'clit','clitoris','cock','cockhead','cockmaster','cocks','cocksucker','cocksuckers','coochie','coochy','cooter','crap','cum','cumdumpster','cumguzzler','cumslut','cunt','cuntass','cuntface','cunts',
		'dick','dickface','dickfuck','dickhead','dickhole','dickmilk','dicks','dicksneeze','dicksucker','dickwad','dildo','dildos','dipshit','doochbag','douche','douchebag','dumbass','dumbfuck','dumbshit','dyke','dykes',
		'fag','fagbag','faggot','faggit','faggots','fags','fatass','fellatio','fuck','fuckass','fuckboy','fuckbutt','fucked','fucks','f u c k','fucker','fuckers','fuckface','fuckhead','fuckhole','fuckin','fucking','fucknut','fuckoff','fuckstick','fucktard','fuckup','fuckwad',
		'gayass','gayfuck','gaylord','gaytard','gaywad',
		'handjob','hardon','hard on','ho','hos','hoe','hoes','homodumbshit','humping',
		'jackass','jackoff','jack off','jagoff','jizz',
		'kooch','kootch','kunt','kunts',
		'labia','lameass','lardass','lesbo',
		'mcfagget','minge','mothafucka','motherfucking','motherfucker','mother fucker','motherfuckers','muff',
		'nigger','niggers','nutsack','nutsacks',
		'penis','piss','pissed','poonani','pube','pubes','puss','pussies','pussy',
		'queef','queerhole',
		'retard','rimjob','rimjobs',
		'schlong','scrotum','scrotums','sex','shit','shitbag','shitbrains','shitcanned','shitcunt','shitdick','shitface','shitfaced','shithead','shithole','shits','shitstain','shitting','shitty','s hit','skank','skanks','skullfuck','slut','slutbag','sluts','smegma','splooge','suckass',
		'tard','testicle','testicles','tit','titfuck','tits','titty','tittyfuck','titties','twat','twats','twatwaffle',
		'unclefucker','unclefuckers',
		'vag','vagina','vaginas','vajayjay',
		'wank','whore','whores','whoreface'];

//initialize bot
var bot = new Discord.Client({
		token: config.token,
		autorun: true
});

bot.on('ready', function(){
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

//check each message for banned words
bot.on('message', function(user, userID, channelId, message, event){
	bannedWords.forEach9function(item, index, array){
		if(message == item){
			message.delete()
			message.author.send("Don't say stupid shit, dumbfuck")
		}
	}
});
