// console.log("icu5e - icu5e.js")

async function check_enemies() {

    // Get Distance Flag
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    let how_handle_multiple_tokens = game.settings.get("icu5e", "howHandleMultipleTokens").valueOf();
    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
    let display_perception_results = game.settings.get("icu5e", "displayPerceptionResults").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    

    

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

    let perception_results = "";


    ///
    /// Roll Perception Checks here - below will have each character token rolling per monster
    ///

    let wall_in_the_way = false;

    for (const placed_token of canvas.tokens.placeables) {
        if (placed_token.data.disposition === -1){ 
            for (const selected of selected_tokens) {
                if (placed_token.data.hidden) { // If token is 'Hidden'

                    let calculated_distance = canvas.grid.measureDistance(selected, placed_token); // Calculate Distance                

                    if ((calculated_distance <= max_distance)) { // If Enemy is within max distance   

                        if (account_for_walls == true){
                        
                            const ray = new Ray({ x: selected.x, y: selected.y }, { x: placed_token.x, y: placed_token.y });
                            const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);
                            
                            wall_in_the_way = collisions.length > 0;
                            
                        }

                        let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                        let perc_check_score = selected.actor.data.data.skills.prc.passive;

                        if (is_perception_degradating == true){
                            perc_check_score -= Math.floor(calculated_distance / 10); // Degrade Perception by -1 per 10 feet                            
                            //console.log("Name: " + placed_token.name + ", PS: " + token_stealth + ", Dist: " + calculated_distance + ", PP: " +  perc_check_score);
                        }

                        // If GM Stealth Overide is Enabled and getFlag does not return undefined
                        if (allow_gm_stealth_overide == true && !(placed_token.getFlag("icu5e", "stealth_score") === undefined)) {
                            token_stealth = placed_token.getFlag("icu5e", "stealth_score");
                        }

                        if (perc_check_score >= token_stealth && !wall_in_the_way){ // If Enemy Passive Stealth <= Passive Perception
                            await placed_token.toggleVisibility();
                            //console.log(selected.name, perc_check_score);
                            // Append Chat Message
                            perception_results += selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]<br>\n";
                        }
                    }
                }
            }
        }
    }
///

/// Rewrite the logic - the bug is that Grigori will reveal the enemy token and then Donny will re-reveal the same token
/// which shouldn't be happening.

///

      
    if (display_perception_results == true){
        if (perception_results == ""){perception_results = "It doesn't seem anyone was revealed."}
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: perception_results
        };
        ChatMessage.create(chatData, {});
    }
}

// Find and return the hostile token that has the tokenHUD open
function find_selected_hostile(tokenHUD){
    let index_of_token = 0;
    let selected_hostile_token;
  
    // If more than one token controlled; find token with the TokenHUD opened and that's the one we'll work with
    if (canvas.tokens.controlled.length > 1) {
      // Get ID of the token that tokenHUD was opened on
      let token_with_hud_open = canvas.tokens.controlled.find(token => token.id == tokenHUD.object.actor.token.id);
      // Get array position of token in the controlled list
      index_of_token = canvas.tokens.controlled.indexOf(token_with_hud_open);        
    } 
  
    return canvas.tokens.controlled[index_of_token]; // Our selected token, the token with TokenHUD opened
  }



/*
      canvas.tokens.placeables.forEach(placed_token => {
        if (placed_token.data.disposition === -1){ // If token has a 'Hostile' disposition

            let list_of_revealed_hostiles = [];
            // for each selected token (Only one if 'Simple', or all if 'Per-Token')
            selected_tokens.forEach(selected => {

                //// if token is in list_of_revealed_hostiles
                
                if (placed_token.data.hidden) { // If token is 'Hidden'
                        
                    let calculated_distance = canvas.grid.measureDistance(selected, placed_token); // Calculate Distance                

                    if ((calculated_distance <= max_distance)) { // If Enemy is within max distance                    

                        let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                        let perc_check_score = selected.actor.data.data.skills.prc.passive;

                        if (is_perception_degradating == true){
                            perc_check_score -= Math.floor(calculated_distance / 10); // Degrade Perception by -1 per 10 feet                            
                            //console.log("Name: " + placed_token.name + ", PS: " + token_stealth + ", Dist: " + calculated_distance + ", PP: " +  perc_check_score);
                        }

                        // If GM Stealth Overide is Enabled and getFlag does not return undefined
                        if (allow_gm_stealth_overide == true && !(placed_token.getFlag("icu5e", "stealth_score") === undefined)) {
                            token_stealth = placed_token.getFlag("icu5e", "stealth_score");
                        }

                        if (perc_check_score >= token_stealth){ // If Enemy Passive Stealth <= Passive Perception
                            placed_token.toggleVisibility();

                            //list_of_revealed_hostile.push(placed_token.id); // Add revealed hostile token ID to list_of_revealed_hostiles
                            console.log(placed_token.id)

                            ///perception_results += selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]<br>\n";
                            console.log(selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]");
                        }                        
                    }
                    
                }

            });
        }
      });*/
      