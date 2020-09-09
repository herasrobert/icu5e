//console.log("icu5e - icu5e.js")

function check_enemies() {

    if(canvas.tokens.controlled.length != 1){
        ui.notifications.error("Please select only one token to observe from");
        return;
    }
      
    // Get Distance Flag
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    //console.log("max_distance: ", max_distance);

    // Get Controlled Token's Passive Perception
    let controlled_token = canvas.tokens.controlled[0];
    let passive_perception = controlled_token.actor.data.data.skills.prc.passive;
    //console.log(controlled_token.name, "Passive Perception: ", passive_perception)
      
    // Iterate Through All Hidden Enemies
    canvas.tokens.placeables.forEach(placed_token => {
        let token_stealth = placed_token.actor.data.data.skills.ste.passive;

        if (placed_token.data.hidden){ // If token is hidden

            let calculated_distance = canvas.grid.measureDistance(controlled_token, placed_token); // Calculate Distance

            if ((calculated_distance < max_distance) && placed_token.data.disposition === -1) { // If Enemy is within max distance         
              
                // If Enemy Passive Stealth <= Passive Perception
                if (token_stealth <= passive_perception){ // If Enemy Passive Stealth <= Passive Perception
                    placed_token.toggleVisibility();
                }
            }
            //console.log(controlled_token.name + ", " + placed_token.name + ", " + "Passive Stealth: " + token_stealth + ", " + "Distance: " + calculated_distance)
        }
      });
  }
    