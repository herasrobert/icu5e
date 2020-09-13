//console.log("icu5e - config_settings.js")

Hooks.once("init", () => {
    //console.log("icu5e - init Test!")

	game.settings.register("icu5e", "showIconFor", {
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
	});

    game.settings.register("icu5e", "calculateDistance", {
		name: "Calculated Distance",
		hint: "Any 'hidden' enemy within X units of the controlled token will be un-hidden/revealed.",
		scope: "world",
		config: true,
		default: 32,
		type: Number
	});

	game.settings.register("icu5e", "howHandleMultipleTokens", {
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
	});

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
		name: "Display Perception Results",
		hint: "Display the results of the perception check in the chat.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

  });