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
var bannedWords = [' ANAL ', ' ANUS ',' ARSE ',' ASS ',' ASSBAG ',' ASSCOCK ',' ASSES ',' ASSFACE ',' ASSFUCK ',' ASSFUCKER ',' ASSHAT ',' ASSHOLE ',' ASSHOLES ',' ASSLICKER ',' ASSWIPE ',
					' BALLSACK ',' BALL SACK ',' BALLZ ',' BASTARD ',' BITCH ',' BITCHASS ',' BITCHES ',' BITCHTITS ',' BITCHY ',' BLOWJOB ',' BLOWJOBS ',' BLOW JOB ',' BONER ',' BONERS ',' BOOB' ,' BOOBS ',' BROTHERFUCKER ',' BULLSHIT ',' BUTTFUCKER ',' BUTTPLUG ',
					' CHOAD ',' CHODE ',' CLIT ',' CLITORIS ',' COCK ',' COCKHEAD ',' COCKMASTER ',' COCKS ',' COCKSUCKER ',' COCKSUCKERS ',' COOCHIE ',' COOCHY ',' COOTER ',' CRAP ',' CUM ',' CUMDUMPSTER ',' CUMGUZZLER ',' CUMSLUT ',' CUNT ',' CUNTASS ',' CUNTFACE ',' CUNTS ',
					' DICK ',' DICKFACE ',' DICKFUCK ',' DICKHEAD ',' DICKHOLE ',' DICKMILK ',' DICKS ',' DICKSNEEZE ',' DICKSUCKER ',' DICKWAD ',' DILDO ',' DILDOS ',' DIPSHIT ',' DOOCHBAG ',' DOUCHE ',' DOUCHEBAG ',' DUMBASS ',' DUMBFUCK ',' DUMBSHIT ',' DYKE ',' DYKES ',
					' FAG ',' FAGBAG ',' FAGGOT ',' FAGGIT ',' FAGGOTS ',' FAGS ',' FATASS ',' FELLATIO ',' FUCK ',' FUCKASS ',' FUCKBOY ',' FUCKBUTT ',' FUCKED ',' FUCKS ',' F U C K ',' FUCKER ',' FUCKERS ',' FUCKFACE ',' FUCKHEAD ',' FUCKHOLE ',' FUCKIN ',' FUCKING ',' FUCKNUT ',' FUCKOFF ',' FUCKSTICK ',' FUCKTARD ',' FUCKUP ',' FUCKWAD ',
					' GAYASS ',' GAYFUCK ',' GAYLORD ',' GAYTARD ',' GAYWAD ',
					' HANDJOB ',' HARDON ',' HO ',' HOS ',' HOE ',' HOES ',' HOMODUMBSHIT ',' HUMPING ',
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

		switch(cmd) {
			case 'ban':
				banWord(channelID,args);
				break;

			case 'unban':
				unBanWord(channelID,args);
				break;
		}
		return;		
	}


	//delete message, warn user
	i = needsCensor(message);
	if(i >= 0){

		bot.deleteMessage({
			channelID: channelID, 
			messageID: event.d.id
		})

		warn(userID, i);
	}
		
});

//reformats user input to style of bannedWords array
//format: " MESSAGE1 MESSAGE2 " with all symbols removed
function formatMessage(args){
	var i = 1;
	var word = " ";
	while(i < args.length){
		word += args[i].toUpperCase().replace(/[.,\/#!$+<>%\^&\*;:{}=\-_`~()]/g,"") + " ";
		i++;
	}
	return word;
}

//adds message to bannedWords array
//reports to channel that the message has been banned
function banWord(channelID, args){
	word = formatMessage(args);

	bot.sendMessage({
		to: channelID, 
		embed: {
			color: 0xe74C3C, 
			fields: [{
				name: ":x: WORD BANNED :x:", 
				value: "the phrase \"**" + word.substring(1, word.length-1) + "**\" has been banned\n"
			}]
		}
	})
	bannedWords.push(word);
}

//removes message from bannedWords if present
//reports to channel that message was unbanned or wasn't previously banned
function unBanWord(channelID, args){
	word = formatMessage(args);
	var i = bannedWords.indexOf(word);

	//when message is currently unbanned
	if(i < 0){
		bot.sendMessage({
			to: channelID, 
			embed: {
				color: 0x2ECC71, 
				fields: [{
					name: ":white_check_mark: WORD ALREADY ALLOWED :white_check_mark:", 
					value: "the phrase \"**" + word.substring(1, word.length-1) + "**\" was not banned!\n"
				}]
			}
		})
	}

	//when message is currently banned
	else{
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
	}	
}

//checks if message is in need of censorship
//returns index of word in bannedWords if present
//returns -1 otherwise
function needsCensor(message){
	msg = " " + message.toUpperCase().replace(/[.,\/#!$+<>%\^&\*;:{}=\-_`~()]/g,"") + " ";
	
	//checks banned words
	var i = 0;
	while(i < bannedWords.length && !(msg.includes(bannedWords[i]))){
		i++;
	}

	if(i < bannedWords.length){
		return i;
	}

	return -1;
}

//sends a randomly chosen warning message to sender of censored message
function warn(userID, index){
	var rand = Math.floor(Math.random() * 5);	
	switch(rand){
		case 0:
			bot.sendMessage({
				to: userID, 
				embed: {
					color: 0xF4D03F, 
					fields: [{
						name: ":warning: THIS IS A WARNING :warning:", 
						value: "please don't say bad words :upside_down:\nBanned phrase: " + bannedWords[i] 
					}]
				}
			})
			break;
		case 1:
			bot.sendMessage({
				to: userID, 
				embed: {
					color: 0xF4D03F, 
					fields: [{
						name: ":warning: THIS IS A WARNING :warning:", 
						value: "no naughty wordies :speak_no_evil:\nBanned phrase: " + bannedWords[i] 
					}]
				}
			})
			break;
		case 2:
			bot.sendMessage({
				to: userID, 
				embed: {
					color: 0xF4D03F, 
					fields: [{
						name: ":warning: THIS IS A WARNING :warning:", 
						value: "no one likes a potty mouth :thumbsdown:\nBanned phrase: " + bannedWords[i] 
					}]
				}
			})
			break;
		case 3:
			bot.sendMessage({
				to: userID, 
				embed: {
					color: 0xF4D03F, 
					fields: [{
						name: ":warning: THIS IS A WARNING :warning:", 
						value: "my heart breaks everytime you swear :broken_heart:\nBanned phrase: " + bannedWords[i] 
					}]
				}
			})
			break;
		case 4:
			bot.sendMessage({
				to: userID, 
				embed: {
					color: 0xF4D03F, 
					fields: [{
						name: ":warning: THIS IS A WARNING :warning:", 
						value: "only losers say things like that :sunglasses:\nBanned phrase: " + bannedWords[i] 
					}]
				}
			})
			break;
	}
}
