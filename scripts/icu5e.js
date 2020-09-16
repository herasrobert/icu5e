 //console.log("icu5e - icu5e.js")

 let roll_results_list = [];
 let chat_text = "";

 Hooks.once("init", () => {
    // Create a socket event handler to listen to incomming sockets and dispatch to callbacks
    game.socket.on(`module.icu5e`, (data) => {

        if (data.operation === 'request_perception_roll') {
            // GM and Player are on the same scene
            if (game.scenes.viewed.id == data.content.viewed_scene){
                // If roll from requested actor is this actor, i.e. GM is requesting a roll from us
                if (game.user.character.id == data.content.actor_id){
                    console.log("we roll");

                    let my_token;

                    // Iterate through all the placed tokens and find my token that the GM is referencing
                    for (const placed_token of canvas.tokens.placeables){
                        if (placed_token.actor.id == game.user.character.id) {
                            my_token = placed_token;
                            break;
                        }
                    }
                    
                    // got my token
                    // Request Perception Roll from player
                        // Print Perception Roll
                        // Send Perception Roll to GM

                    // if Timeout - Set timeout value within settings
                        // Send a message to GM saying timed out (afk)
                }

                // Else - this isn't our active player
                    // but if we're an owner of this token though
                        // Prompt for roll from player and handle as normal

            }


            //console.log(`User [${data.user}] says: ${data.content}`);

            //game.user.character

            //let perception_roll_String = "1d20 + " + selected.actor.data.data.skills.prc.total;

            // Player Makes a Roll

            // socket.emit back

        };

        if (data.operation === 'receive_perception_roll') {
            // if token was in list
                // if Receive Perception roll from Player                    
                        // Use the roll
                        // Parform check for enemies
                // if timeout
                    // Put a message in chat - Player was distracted
                
                // Remove Token from List of pending tokens (roll_results_list)


        }

    });
});

function passive_check_enemies() {

    let display_perception_results_text = game.settings.get("icu5e", "displayPerceptionResults").valueOf();

    selected_tokens = get_selected_tokens();

    let perception_results_text = "<Bugged - Fix It>";

    for (const placed_token of canvas.tokens.placeables) {
        if (placed_token.data.disposition === -1){ 
            for (const selected of selected_tokens) {                
                if (placed_token.data.hidden) { // If token is 'Hidden'    
                    let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                    let perc_check_score = selected.actor.data.data.skills.prc.passive;

                    if (is_within_range(selected, placed_token)) { // If Enemy is within max distance
                        check_hostile_token(selected, placed_token, perc_check_score, token_stealth);
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


async function active_check_enemies() {
    let perception_roll_type = game.settings.get("icu5e", "perceptionRollType").valueOf();
    let display_perception_results_text = game.settings.get("icu5e", "displayPerceptionResults").valueOf();
    
    chat_text = "";

    selected_tokens = get_selected_tokens();

    if (perception_roll_type == "Auto"){

        for (const selected of selected_tokens) {
            // Create new roll string: 1d20 + Perception Score
            let perception_roll_String = "1d20 + " + selected.actor.data.data.skills.prc.total;

            // Roll Token Perception
            let rolled_perception = new Roll(perception_roll_String).roll();

            // Display rolled Perception as a message
            rolled_perception.toMessage({
                speaker: {
                    alias: selected.data.name
                },
                flavor: "Perception Check"
            });
            let perc_check_score = rolled_perception.total;

            for (const placed_token of canvas.tokens.placeables) {
                if (placed_token.data.disposition === -1){ 
                    if (placed_token.data.hidden) { // If token is 'Hidden'
                        let token_stealth = placed_token.actor.data.data.skills.ste.passive;

                        if (is_within_range(selected, placed_token)) { // If Enemy is within max distance
                            check_hostile_token(selected, placed_token, perc_check_score, token_stealth);
                        }
                    }
                }
            }
        }

        
        /*
        if (display_perception_results_text == true){
            //if (chat_text == ""){chat_text = "It doesn't seem anyone was revealed."}
            let chatData = {
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: chat_text
            };
            ChatMessage.create(chatData, {});
        }*/






    } else if (perception_roll_type == "Request"){
        roll_results_list == []; // Reset Roll Results List in case of previous rolls

        for (const token of  selected_tokens){

            // Emit a socket event to players requesting a Perception Roll
            game.socket.emit('module.icu5e', {
                operation: 'request_perception_roll',
                user: game.user.id, 
                content: {viewed_scene: game.scenes.viewed.id, actor_id: token.actor.id},
            });

            // Append token to list of pending tokens (roll_results_list)
            
        }


        // token.actor.data.permission 
        

    }
}



// Return a list of Selected Tokens that will be doing Perception Checks i.e. selected non-hostile tokens
function get_selected_tokens(){
    let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
    
    // Create an empty array that will store selected tokens we will use
    let selected_tokens = []; 

    if (canvas.tokens.controlled.length == 0){
        console.log("icu5e - this error should not have occured.");
        ui.notifications.error("icu5e - this error should not have occured.");
        return;
    } else {
        for (const controlled of canvas.tokens.controlled) {
            // Determine which tokens should be taken into account as controlled
            if (show_icon_for == "Characters" && controlled.actor.data.type == "character"){
                selected_tokens.push(controlled);
            } else if (show_icon_for == "Friendlies" && (controlled.data.disposition === 0 || controlled.data.disposition === 1)){                    
                selected_tokens.push(controlled);
            }
        }
    }
    return selected_tokens;
}

// Check if Token is within defined range of another token i.e. Is friendly token within range of hostile token
function is_within_range(selected_token, placed_token){
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();
    let distance_type = game.settings.get("icu5e", "distanceCalculationType").valueOf();
    let calculated_distance = 0;

    // Calculate distance based on chosen method
    if (distance_type == "Euclidean"){
        calculated_distance = canvas.grid.measureDistance(selected_token, placed_token);
    } else if (distance_type == "Grid") {
        // Measure grid distance
        let gridsize = canvas.grid.size;
        let d1 = Math.abs((selected_token.x - placed_token.x) / gridsize);
        let d2 = Math.abs((selected_token.y - placed_token.y) / gridsize);
        let dist = Math.max(d1, d2);

        calculated_distance = dist * canvas.scene.data.gridDistance;
    }
    return (calculated_distance <= max_distance);
}

// Check if hostile token should be revealed; then reveal
async function check_hostile_token(friendly_token, hostile_token, perception_score, stealth_score){

    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    let wall_in_the_way = false;

    // Draw ray from friendly_token to hostile and skip token if it collides with a wall
    if (account_for_walls == true){
        const ray = new Ray(friendly_token.center, hostile_token.center);                            
        const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);                            
        wall_in_the_way = collisions.length > 0;
        if (wall_in_the_way) {
            console.log("contiunuing"); 
            return; //continue;
        } // Wall is in the way, skip this token
    }

    if (is_perception_degradating == true){
        perception_score -= Math.floor(calculated_distance / 10); // Degrade Perception by -1 per 10 feet                            
        //console.log("Name: " + hostile_token.name + ", PS: " + stealth_score + ", Dist: " + calculated_distance + ", PP: " +  perception_score);
    }

    // If GM Stealth Overide is Enabled and getFlag does not return undefined
    if (allow_gm_stealth_overide == true && !(hostile_token.getFlag("icu5e", "stealth_score") === undefined)) {
        stealth_score = hostile_token.getFlag("icu5e", "stealth_score");
    }
    // If Enemy Passive Stealth <= Passive Perception AND no walls are in the way
    if (perception_score >= stealth_score && !wall_in_the_way){ 
        await hostile_token.toggleVisibility();
        chat_text += friendly_token.name + " revealed " + hostile_token.name + " [" + stealth_score + "]<br>";
        //console.log(friendly_token.name, "revealed ", hostile_token.name);
    }
}




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




//// NOTES: I don't think it should be updateToken as it seems that gets called every time you even place a token.
Hooks.on(`updateToken`, (scene, data, update, options) => {
    if (game.settings.get("icu5e", "autoRunOnTokenMove").valueOf()){
        if (update.x || update.y) { // If the x/y is updated, they moved.
            // if token is not hostile
                // if (token is character && Character is set) || (token is friend && friendly is set)
                passive_check_enemies();
        }
    }
});







/*
----ORIGINAL LOGIC----
for (const placed_token of canvas.tokens.placeables) {
    if (placed_token.data.disposition === -1){ 
        for (const selected of selected_tokens) {
            let perc_check_score = 0; // The final Perception score of a token
            if (placed_token.data.hidden) { // If token is 'Hidden'

                let token_stealth = placed_token.actor.data.data.skills.ste.passive;
                let calculated_distance = 0;

                // Keep a list of Character tokens and the Perception Score they already rolled
                if (!perception_scores_list.some(token => token.id === selected.id)){
                  
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
                            game.socket.emit('module.icu5e', {
                                operation: 'roll_perception',
                                user: game.user.id,
                                content: '<Put UID here>',
                            });
                            //////// What if player isn't present?
                            // Obtain Perception Score
                            // Request roll using socket
                            // perc_check_score = rolled_value...
                        }

                        // Read chat or "pick it up with a hook on gm side if you need to do something with it" - Vance

                        // perc_check_score = rolled value
                   

                    // Add token to the list we're using to keep track of which tokens already have a perception score to work with
                    //perception_scores_list.push({id:selected.id, name:selected.name, perception:perc_check_score});
                    //console.log(perception_scores_list);
                }

                //if (perc_check_score == 0){ perc_check_score = perception_scores_list.find(token => token.id === selected.id).perception; }

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
}*/










//------------------------

//----EARLIER LOGIC----
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