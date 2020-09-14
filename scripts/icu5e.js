// console.log("icu5e - icu5e.js")

async function passive_check_enemies(perception_type) {

    // Get Distance Flag
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    let how_handle_multiple_tokens = game.settings.get("icu5e", "howHandleMultipleTokens").valueOf();
    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
    let display_perception_results_text = game.settings.get("icu5e", "displayPerceptionResults").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    let distance_type = game.settings.get("icu5e", "distanceCalculationType").valueOf();
    let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
    let perception_roll_type = game.settings.get("icu5e", "perceptionRollType").valueOf();

    //console.log("icu5e - max_distance: ", max_distance);
    //console.log("icu5e - howHandleMultipleTokens: ", how_handle_multiple_tokens);
    
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

            // Characters
            for (const controlled of canvas.tokens.controlled) {
                // Determine which tokens should be taken into account as controlled
                if (show_icon_for == "All"){
                    selected_tokens.push(controlled);
                } else if (show_icon_for == "Characters" && controlled.actor.data.type == "character"){                    
                    selected_tokens.push(controlled);
                } else if (show_icon_for == "Friendlies" && (controlled.data.disposition === 0 || controlled.data.disposition === 1)){                    
                    selected_tokens.push(controlled);
                }
            }
        }
    }

    let perception_results_text = "";
    let wall_in_the_way = false;

    for (const placed_token of canvas.tokens.placeables) {
        if (placed_token.data.disposition === -1){ 
            for (const selected of selected_tokens) {
                
                if (placed_token.data.hidden) { // If token is 'Hidden'
    
                    let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                    let perc_check_score = selected.actor.data.data.skills.prc.passive;
                    let calculated_distance = 0;

                    // Calculate distance based on chosen method
                    if (distance_type == "Euclidean"){
                        calculated_distance = canvas.grid.measureDistance(selected, placed_token);
                    } else if (distance_type == "Grid") {
                        // Measure grid distance
                        let gridsize = canvas.grid.size;
                        let d1 = Math.abs((selected.x - placed_token.x) / gridsize);
                        let d2 = Math.abs((selected.y - placed_token.y) / gridsize);
                        let dist = Math.max(d1, d2);

                        calculated_distance = dist * canvas.scene.data.gridDistance;
                    }

                    if ((calculated_distance <= max_distance)) { // If Enemy is within max distance

                        // Draw ray from selected token to hostile and skip token if it collides with a wall
                        if (account_for_walls == true){
                            const ray = new Ray(selected.center, placed_token.center);                            
                            const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);                            
                            wall_in_the_way = collisions.length > 0;
                            if (wall_in_the_way) {console.log("contiunuing");continue;} // Wall is in the way, skip this token
                        }

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
                            console.log(selected.name, perc_check_score);
                            // Append Chat Message
                            perception_results_text += selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]<br>\n";
                        }
                    }
                }
            }
        }
    }
      
    if (display_perception_results_text == true){
        if (perception_results_text == ""){perception_results_text = "It doesn't seem anyone was revealed."}
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: perception_results_text
        };
        ChatMessage.create(chatData, {});
    }
}

async function active_check_enemies(perception_type) {

    // Get Distance Flag
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    let how_handle_multiple_tokens = game.settings.get("icu5e", "howHandleMultipleTokens").valueOf();
    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
    let display_perception_results_text = game.settings.get("icu5e", "displayPerceptionResults").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    let distance_type = game.settings.get("icu5e", "distanceCalculationType").valueOf();
    let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
    let perception_roll_type = game.settings.get("icu5e", "perceptionRollType").valueOf();

    //console.log("icu5e - max_distance: ", max_distance);
    //console.log("icu5e - howHandleMultipleTokens: ", how_handle_multiple_tokens);
    
    //let selected_token;

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

            // Characters
            for (const controlled of canvas.tokens.controlled) {
                // Determine which tokens should be taken into account as controlled
                if (show_icon_for == "All"){
                    selected_tokens.push(controlled);
                } else if (show_icon_for == "Characters" && controlled.actor.data.type == "character"){                    
                    selected_tokens.push(controlled);
                } else if (show_icon_for == "Friendlies" && (controlled.data.disposition === 0 || controlled.data.disposition === 1)){                    
                    selected_tokens.push(controlled);
                }
            }
        }
    }

    let perception_results_text = "";
    let perception_scores_list = [];
    let wall_in_the_way = false;

/*
your button sends socket event to player to request perc roll
socket listener on client side gets that, makes roll, sends socket event back with results of roll
dont need to listen to chat hooks then
now you have result of roll back on GM side, in your response listener you can do whatever you want with it
no timing problems as your code only runs whenever the results happen to get back
but if you wanted an autotime out you could add one on GM side easily
just when you fire off 1st socket event, set some UUID for the event in a local var
include UUID in all your socket comms
in your GM listener, check if UUID is still valid, if so proceed as normal
remove UUID from list when processed
then when you fire off first socket event to player, add a local setTimeout() that after 10 seconds, if hasn't heard back (i.e. UUID is still valid) run handler function
which, as mentioned above, removes UUID from list, so you can't have 2 events trigger
*/





    

    for (const placed_token of canvas.tokens.placeables) {
        if (placed_token.data.disposition === -1){ 
            for (const selected of selected_tokens) {
                let perc_check_score = 0; // The final Perception score of a token
                if (placed_token.data.hidden) { // If token is 'Hidden'
    
                    let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                    let calculated_distance = 0;

                    // Keep a list of Character tokens and the Perception Score they already rolled
                    if (!perception_scores_list.some(token => token.id === selected.id)){
                        if (perception_type == "use_roll"){
                            if (perception_roll_type == "Auto"){

                                // Create new roll string: 1d20 + Perception Score
                                let perception_roll_String = "1d20 + " + selected.actor.data.data.skills.prc.total;

                                // Roll Token Perception
                                let rolled_perception = new Roll(perception_roll_String).roll();

                                // Display rolled Perception as a message
                                rolled_perception.toMessage({
                                    speaker: {
                                        alias: selected.data.name
                                    },
                                    flavor: "icu5e-Perception Check",
                                    purpose: "tester"
                                })

                            } else if (perception_roll_type == "Request"){
                                // Emit a socket event
                                /*game.socket.emit('module.icu5e', {
                                    operation: 'roll_perception',
                                    user: game.user.id,
                                    content: '<Put UID here>',
                                });*/
                                //////// What if player isn't present?
                                // Obtain Perception Score
                                // Request roll using socket
                                // perc_check_score = rolled_value...
                            }

                            // Read chat or "pick it up with a hook on gm side if you need to do something with it" - Vance

                            // perc_check_score = rolled value
                        } else {
                            perc_check_score = selected.actor.data.data.skills.prc.passive
                        }

                        // Add token to the list we're using to keep track of which tokens already have a perception score to work with
                        perception_scores_list.push({id:selected.id, name:selected.name, perception:perc_check_score});
                        console.log(perception_scores_list);
                    }

                    if (perc_check_score == 0){ perc_check_score = perception_scores_list.find(token => token.id === selected.id).perception; }

                    // Calculate distance based on chosen method
                    if (distance_type == "Euclidean"){
                        calculated_distance = canvas.grid.measureDistance(selected, placed_token);
                    } else if (distance_type == "Grid") {
                        // Measure grid distance
                        let gridsize = canvas.grid.size;
                        let d1 = Math.abs((selected.x - placed_token.x) / gridsize);
                        let d2 = Math.abs((selected.y - placed_token.y) / gridsize);
                        let dist = Math.max(d1, d2);

                        calculated_distance = dist * canvas.scene.data.gridDistance;
                    }

                    if ((calculated_distance <= max_distance)) { // If Enemy is within max distance

                        // Draw ray from selected token to hostile and skip token if it collides with a wall
                        if (account_for_walls == true){
                            const ray = new Ray(selected.center, placed_token.center);                            
                            const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);                            
                            wall_in_the_way = collisions.length > 0;
                            if (wall_in_the_way) {console.log("contiunuing");continue;} // Wall is in the way, skip this token
                        }

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
                            console.log(selected.name, perc_check_score);
                            // Append Chat Message
                            perception_results_text += selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]<br>\n";
                        }
                    }
                }
            }
        }
    }
      
    if (display_perception_results_text == true){
        if (perception_results_text == ""){perception_results_text = "It doesn't seem anyone was revealed."}
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: perception_results_text
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



function get_rolled_perception() {

}

Hooks.on(`renderChatMessage`, (message, html, data) => {

    if (message.data.flavor == "icu5e-Perception Check"){


        
        // Roll results = message.data.content

    }
    console.log("");

    perception_scores_list.push({id:selected.id, name:selected.name, perception:perc_check_score}); 

    //console.log(message.data.flavor);
    //console.log("----",chat_message, info, msg);


    // if purpose == icu5e...
        // check UID - should be a field called user
            // run our code


});






//// NOTES: I don't think it should be updateToken as it seems that gets called every time you even place a token.
Hooks.on(`updateToken`, (scene, data, update, options) => {
    if (game.settings.get("icu5e", "autoRunOnTokenMove").valueOf()){
        if (update.x || update.y) { // If the x/y is updated, they moved.
            // if token is not hostile
                // if (token is character && Character is set) || (token is friend && friendly is set)
            check_enemies("use_passive");
        }
    }
});

/*

// Create a socket event handler to listen to incomming sockets and dispatch to callbacks
game.socket.on(`module.icu5e`, (data) => {
    console.log("111111");
    if (data.operation === 'roll_perception') {
        console.log(`User [${data.user}] says: ${data.content}`);

        // if our UID matches the UID in data.content, then we're being asked to make a perception roll

    };
    //if (data.operation === 'myOtherEvent') handleMyOtherEvent(data);
  });

*/




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

                            ///perception_results_text += selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]<br>\n";
                            console.log(selected.name + " revealed " + placed_token.name + " [" + token_stealth + "]");
                        }                        
                    }
                    
                }

            });
        }
      });*/