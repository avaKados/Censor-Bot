//references:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.youtube.com/watch?v=ak8ZoizL82Y
//https://github.com/izy521/discord.io/issues/144
//https://discordapp.com/developers/docs/resources/channel#embed-object-embed-field-structure


const Discord = require('discord.io');
var config = require('./config.json');

//words banned from the server
//sources: http://www.bannedwordlist.com/lists/swearWords.txt
//https://www.noswearing.com/dictionary
var bannedWords = [' ANAL ', ' ANUS ',' ARSE ',' ASS ',' ASS-HAT ',' ASSBAG ',' ASSCOCK ',' ASSES ',' ASSFACE ',' ASSFUCK ',' ASSFUCKER ',' ASSHAT ',' ASSHOLE ',' ASSHOLES ',' ASSLICKER ',' ASSWIPE ',
					' BALLSACK ',' BALL SACK ',' BALLZ ',' BASTARD ',' BITCH ',' BITCHASS ',' BITCHES ',' BITCHTITS ',' BITCHY ',' BLOWJOB ',' BLOWJOBS ',' BLOW JOB ',' BONER ',' BONERS ',' BOOB' ,' BOOBS ',' BROTHERFUCKER ',' BULLSHIT ',' BUTTFUCKER ',' BUTTPLUG ',
					' CHOAD ',' CHODE ',' CLIT ',' CLITORIS ',' COCK ',' COCKHEAD ',' COCKMASTER ',' COCKS ',' COCKSUCKER ',' COCKSUCKERS ',' COOCHIE ',' COOCHY ',' COOTER ',' CRAP ',' CUM ',' CUMDUMPSTER ',' CUMGUZZLER ',' CUMSLUT ',' CUNT ',' CUNTASS ',' CUNTFACE ',' CUNTS ',
					' DICK ',' DICKFACE ',' DICKFUCK ',' DICKHEAD ',' DICKHOLE ',' DICKMILK ',' DICKS ',' DICKSNEEZE ',' DICKSUCKER ',' DICKWAD ',' DILDO ',' DILDOS ',' DIPSHIT ',' DOOCHBAG ',' DOUCHE ',' DOUCHEBAG ',' DUMBASS ',' DUMBFUCK ',' DUMBSHIT ',' DYKE ',' DYKES ',
					' FAG ',' FAGBAG ',' FAGGOT ',' FAGGIT ',' FAGGOTS ',' FAGS ',' FATASS ',' FELLATIO ',' FUCK ',' FUCKASS ',' FUCKBOY ',' FUCKBUTT ',' FUCKED ',' FUCKS ',' F U C K ',' FUCKER ',' FUCKERS ',' FUCKFACE ',' FUCKHEAD ',' FUCKHOLE ',' FUCKIN ',' FUCKING ',' FUCKNUT ',' FUCKOFF ',' FUCKSTICK ',' FUCKTARD ',' FUCKUP ',' FUCKWAD ',
					' GAYASS ',' GAYFUCK ',' GAYLORD ',' GAYTARD ',' GAYWAD ',
					' HANDJOB ',' HARDON ',' HARD-ON ',' HO ',' HOS ',' HOE ',' HOES ',' HOMODUMBSHIT ',' HUMPING ',
					' JACKASS ',' JACKOFF ',' JACK OFF ',' JAGOFF ',' JIZZ ',
					' KOOCH ',' KOOTCH ',' KUNT ',' KUNTS ',
					' LABIA ',' LAMEASS ',' LARDASS ',' LESBO ',
					' MCFAGGET ',' MINGE ',' MOTHAFUCKA ',' MOTHERFUCKING ',' MOTHERFUCKER ',' MOTHER FUCKER ',' MOTHERFUCKERS ',' MUFF ',
					' NIGGER ',' NIGGERS ',' NUTSACK ',' NUTSACKS ',
					' PENIS ',' PISS ',' PISSED ',' POONANI ',' PUBE ',' PUBES ',' PUSS ',' PUSSIES ',' PUSSY ',
					' QUEEF ',' QUEERHOLE ',
					' RETARD ',' RETARDS ',' RIMJOB ',' RIMJOBS ',
					' SCHLONG ',' SCROTUM ',' SCROTUMS ',' SEX ',' SEXY ',' SHIT ',' SHITBAG ',' SHITBRAINS ',' SHITCANNED ',' SHITCUNT ',' SHITDICK ',' SHITFACE ',' SHITFACED ',' SHITHEAD ',' SHITHOLE ',' SHITS ',' SHITSTAIN ',' SHITTING ',' SHITTY ',' SHIT ',' SKANK ',' SKANKS ',' SKULLFUCK ',' SLUT ',' SLUTBAG ',' SLUTS ',' SMEGMA ',' SPLOOGE ',' SUCKASS ',
					' TARD ',' TESTICLE ',' TESTICLES ',' TIT ',' TITFUCK ',' TITS ',' TITTY ',' TITTYFUCK ',' TITTIES ',' TWAT ',' TWATS ',' TWATWAFFLE ',
					' UNCLEFUCKER ',' UNCLEFUCKERS ',
					' VAG ',' VAGINA ',' VAGINAS ',' VAJAYJAY ',
					' WANK ',' WHORE ',' WHORES ',' WHOREFACE ']

//initialize bot
var bot = new Discord.Client({
	token: config.token,
	autorun: true
});

bot.on('ready', function(event){
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

//check each message for banned words
bot.on('message', function(user, userID, channelID, message, event){

	//admins may use command prefixed with "*" to ban another word for the session
	//note: does not carry over between sessions
	if(message.substring(0,1) == config.prefix){
		var args = message.substring(1).split(' ');

		var cmd = args[0];

		var i = 1;
		var word = " ";
		while(i < args.length){
			word += args[i].toUpperCase() + " ";
			i++;
		}
		
		switch(cmd) {
			case 'ban':
				bot.sendMessage({
					to: channelID, 
					embed: {
						color: 0xe74C3C, 
						fields: [{
							name: ":x: "value", WORD BANNED :x:", 
							value: "the phrase \"**" + word.substring(1, word.length-1) + "**\" has been banned\n"
						}]
					}
				})
				bannedWords.push(word);
				break;
			case 'unban':
				var i = bannedWords.indexOf(word);
				bot.sendMessage({
					to: channelID, 
					embed: {
						color: 0x2ECC71, 
						fields: [{
							name: ":white_check_mark: WORD UNBANNED :white_check_mark:", 
							value: "the phrase \"**" + word.substring(1, word.length-1) + "**\" has been unbanned!\n"
						}]
					}
				})
				bannedWords.splice(i, 1);
				break;	
		}
		return;		
	}

	var needsCensor = false;
	msg = " " + message.toUpperCase() + " ";
	
	//checks banned words
	var i = 0;
	while(i < bannedWords.length && !(msg.includes(bannedWords[i]))){
		i++;
	}
	if(i < bannedWords.length){
		needsCensor = true;
	}


	//delete message, warn user
	if(needsCensor){
		bot.deleteMessage({channelID: channelID, messageID: event.d.id})
		bot.sendMessage({to: userID, message: "Don't say that stupid junk"})
				
	}
		
});
