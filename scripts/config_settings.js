//console.log("icu5e - config_settings.js")

Hooks.once("init", () => {
    //console.log("icu5e - init Test!")

    game.settings.register("icu5e", "calculateDistance", {
		name: "Calculated Distance",
		hint: "Any 'hidden' enemy within X units of the controlled token will be un-hidden/revealed.",
		scope: "world",
		config: true,
		default: 30.0,
		type: Number
	});

	game.settings.register("icu5e", "howHandleMultipleTokens", {
		name: "How to handle multiple selected tokens?",
		hint: "Simple - The token with the highest perception will be used. Per-Token - Each token will reveal when they can from tehir position.",
		scope: "world",
		config: true,
		default: "Simple",
		type: String,
		choices: {
			"Simple": "Simple",
			"Per-Token": "Per-Token"
		}
	});

  });