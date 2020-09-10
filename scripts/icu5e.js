console.log("icu5e - icu5e.js")

function check_enemies() {

    // Get Distance Flag
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    let how_handle_multiple_tokens = game.settings.get("icu5e", "howHandleMultipleTokens").valueOf();
    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();

    //console.log("icu5e - max_distance: ", max_distance);
    //console.log("icu5e - howHandleMultipleTokens: ", how_handle_multiple_tokens);
    
    let selected_token;
    let perc_check_score = 0; // The final Perception score of a token


    if (canvas.tokens.controlled.length == 0){
        console.log("icu5e - this error should not have occured.");
        ui.notifications.error("icu5e - this error should not have occured.");
        return;
    } else {
        selected_tokens = []; // Create an empty array that will store selected tokens we will use

        if (how_handle_multiple_tokens == "Simple"){ // The token with the highest perception will be used
            highest_perc_check_score = 0;
            let most_perceptive_token;
        
            // Iterate through each controlled token
            canvas.tokens.controlled.forEach(token => {
                token_peception = token.actor.data.data.skills.prc.passive; // Token Passive Perception
                
                // If this tokens Passive Perception is higher than the previous highest Passive Perception
                if (token_peception > highest_perc_check_score){
                    highest_perc_check_score = token_peception;
                    most_perceptive_token = token;
                }

            });
            selected_tokens.push(most_perceptive_token);
        } else if (how_handle_multiple_tokens == "Per-Token"){
            selected_tokens = canvas.tokens.controlled;
        }
    }
    
    // Iterate through placed token
    canvas.tokens.placeables.forEach(placed_token => {
        if (placed_token.data.hidden && placed_token.data.disposition === -1){ // If token is hidden and has a 'Hostile' disposition
            
            // for each selected token (Only one if 'Simple', or all if 'Per-Token')
            selected_tokens.forEach(selected => {
                let calculated_distance = canvas.grid.measureDistance(selected, placed_token); // Calculate Distance
                if ((calculated_distance <= max_distance)) { // If Enemy is within max distance
                    let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                    let perc_check_score = selected.actor.data.data.skills.prc.passive;                    

                    if (placed_token.data.hidden) { // If still 'Hidden' (There's a chance a previous token already revealed them and toggleVisbility would rehide them)
                        if (is_perception_degradating == true){
                            perc_check_score -= Math.floor(calculated_distance / 10);
                            //console.log("Name: " + placed_token.name + ", PS: " + token_stealth + ", Dist: " + calculated_distance + ", PP: " +  perc_check_score);
                        }

                        if (perc_check_score >= token_stealth){ // If Enemy Passive Stealth <= Passive Perception
                            placed_token.toggleVisibility();
                        }
                    }
                }

            });
        }
      });

}

/*



    if (how_handle_multiple_tokens == "Simple"){ // The token with the highest perception will be used

        if(canvas.tokens.controlled.length > 1){            
            let highest_pp_controlled_obj = get_token_highest_passive_prc();
            selected_token = highest_pp_controlled_obj.most_perceptive_token;
        } else {
            // Get Controlled Token's Passive Perception
            selected_token = canvas.tokens.controlled[0];
        } 

        passive_perception = selected_token.actor.data.data.skills.prc.passive;

        //console.log(selected_token.name, "Passive Perception: ", passive_perception)
    }
    else if (how_handle_multiple_tokens == "Per-Token"){
        // Iterate through each of the selected tokens

    }

      


    // Iterate Through All Hidden Enemies
    canvas.tokens.placeables.forEach(placed_token => {
        if (placed_token.data.hidden && placed_token.data.disposition === -1){ // If token is hidden and has a 'Hostile' disposition
            let token_stealth = placed_token.actor.data.data.skills.ste.passive;
            let calculated_distance = canvas.grid.measureDistance(selected_token, placed_token); // Calculate Distance

            if ((calculated_distance <= max_distance)) { // If Enemy is within max distance         
              
                // If Enemy Passive Stealth <= Passive Perception
                if (token_stealth <= passive_perception){ // If Enemy Passive Stealth <= Passive Perception
                    placed_token.toggleVisibility();
                }
            }
            //console.log(selected_token.name + ", " + placed_token.name + ", " + "Passive Stealth: " + token_stealth + ", " + "Distance: " + calculated_distance)
        }
      });
  }
    

function get_token_highest_passive_prc(){
    highest_passive_perception = 0;
    most_perceptive_token = 0;

    canvas.tokens.controlled.forEach(toke => {
        token_peception = toke.actor.data.data.skills.prc.passive;

        if (token_peception > highest_passive_perception){
            highest_passive_perception = token_peception;
            most_perceptive_token = toke;
        }
        //console.log(toke.name, token_peception, most_perceptive_token, highest_passive_perception)
    });
    //console.log(this.most_perceptive_token.name, highest_passive_perception)

    return {most_perceptive_token, highest_passive_perception};
}

*/