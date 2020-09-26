//console.log("icu5e - config_settings.js")

Hooks.once("init", () => {
    //console.log("icu5e - init Test!")

	/*game.settings.register("icu5e", "showIconFor", {
		name: "Show Icon For",
		hint: "All - The Icon will appear on every token if you're GM. Characters - Only Characters. Friendlies - Only on tokens with a Friendly/Neutral disposition.",
		scope: "world",
		config: true,
		default: "Characters",
		type: String,
		choices: {
			"All": "All",
			"Characters": "Characters",
			"Friendlies" : "Friendlies"
		}
	});*/

	game.settings.register("icu5e", "showIconFor", {
		name: "Show Icon For",
		hint: "Characters - Only Characters. Friendlies - Only on tokens with a Friendly/Neutral disposition.",
		scope: "world",
		config: true,
		default: "Characters",
		type: String,
		choices: {
			"Characters": "Characters",
			"Friendlies" : "Friendlies"
		}
	});

	game.settings.register("icu5e", "distanceCalculationType", {
		name: "How to calculate the distance?",
		hint: "Euclidean - Use math to determine distance; doesn't match grid distance and diagonal enemies are further cause math. Grid - Use the grid distance",
		scope: "world",
		config: true,
		default: "Grid",
		type: String,
		choices: {
			"Grid": "Grid",
			"Euclidean": "Euclidean"
		}
	});

    game.settings.register("icu5e", "calculateDistance", {
		name: "Calculated Distance",
		hint: "[Only if using Euclidean] Any 'hidden' enemy within X units of the controlled token will be un-hidden/revealed.",
		scope: "world",
		config: true,
		default: 32,
		type: Number
	});

	/*game.settings.register("icu5e", "howHandleMultipleTokens", {
		name: "How to handle multiple selected tokens?",
		hint: "Simple - The token with the highest perception will be used. Per-Token - Each token will reveal what they can from their position.",
		scope: "world",
		config: true,
		default: "Simple",
		type: String,
		choices: {
			"Simple": "Simple",
			"Per-Token": "Per-Token"
		}
	});*/

	game.settings.register("icu5e", "veriantPerceptionDegradation", {
		name: "Variant Perception Degradation",
		hint: "Perception receives a -1 modifier for every 10 feet of distance.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "allowGMStealthOveride", {
		name: "Allow GM Stealth Override",
		hint: "Enables an input box on Hostile tokens that defaults to Passive Stealth but GM can edit the value. This value will be used for checks if enabled.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});
	
	game.settings.register("icu5e", "rollHostileStealth", {
		name: "Roll Hostile Stealth",
		hint: "[Requires Allow GM Stealth Override] Button to roll hostile tokens stealth roll and use that value.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "displayPerceptionResults", {
		name: "Display Passive Perception Results",
		hint: "Display the results of the perception check in the chat.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "acountForWalls", {
		name: "Account For Walls",
		hint: "Walls block whether a token is revealed or not.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "activePerceptionRollType", {
		name: "Active Perception Roll Type",
		hint: "Which type of Active Perception check to use. Auto - The Perception check will be auto rolled by the token. Request - Request token owner to roll.",
		scope: "world",
		config: true,
		default: "Request",
		type: String,
		choices: {
			"Auto": "Auto",
			"Request": "Request"
		}
	});

	game.settings.register("icu5e", "requestedRollTimeout", {
		name: "Requested Roll Timeout ",
		hint: "How many milliseconds to wait for a player to perform a requested roll before the GM just automatically rolls it. Works only when 'Active Perception Roll Type' is set to Request.",
		scope: "world",
		config: true,
		default: 30000,
		type: Number
	});
	
	game.settings.register("icu5e", "revealSecretDoors", {
		name: "Reveal Secret Doors",
		hint: "[!EXPERIMENTAL!] Reveal secret doors with perception checks)",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "playerTokenStealthMode", {
		name: "Player Token Stealth Mode",
		hint: "[!EXPERIMENTAL!] Button to hide player token from everyone except the token owner and the GM.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("icu5e", "autoRunOnTokenMove", {
		name: "Automatically Scan on Token move",
		hint: "[!EXPERIMENTAL!] Automatically scan each time a token is moved. (Doesn't work with ruler it seems.)",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	

  });