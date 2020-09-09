//console.log("icu5e - config_settings.js")

Hooks.once("init", () => {
    console.log("icu5e - init Test!")

    game.settings.register("icu5e", "calculateDistance", {
		name: "Calculated Distance",
		hint: "Any 'hidden' enemy within X units of the controlled token will be un-hidden/revealed.",
		scope: "world",
		config: true,
		default: 30.0,
		type: Number
	});
  });