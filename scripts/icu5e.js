 //console.log("icu5e - icu5e.js")

 let tokens_pending_perception_roll = [];
 let chat_text = "";

Hooks.once("init", () => {
    // Create a socket event handler to listen to incomming sockets and dispatch to callbacks
    game.socket.on(`module.icu5e`, (data) => {
        // If GM and Player are on the same scene
        if (game.scenes.viewed.id == data.content.viewed_scene){
            /// Client Side
            if (data.operation === 'request_perception_roll') {
                
                    // If roll from requested actor is this actor, i.e. GM is requesting a roll from us
                    if (game.user.character.id == data.content.actor_id){

                        my_token = find_token_by_actor_id(game.user.character.id);

                        roll_selected_skill(my_token, "prc");
                    } else {
                        // Not my actor but check if I'm an owner and if I am
                        // I'm going to get prompted to roll the Perception check
                        for (const placed_token of canvas.tokens.placeables) {
                            if (placed_token.actor.id == data.content.actor_id){ // Find the Token in Question
                                if (game.user.id in placed_token.actor.data.permission){ // If I'm an owner of the token; roll Perception
                                    roll_selected_skill(placed_token, "prc")
                                    //console.log("Not my player character but I'm an owner");
                                }
                            }
                        }
                    }
            };

            /// Server Side
            if (data.operation === 'receive_perception_roll') {
                if (game.user.isGM == true){
                    gm_process_percepton_results(data);
                }
            }
        }

    });
});

//// NOTES: I don't think it should be updateToken as it seems that gets called every time you even place a token.
Hooks.on(`updateToken`, (scene, data, update, options) => {
    if (game.settings.get("icu5e", "autoRunOnTokenMove").valueOf()){
        if (update.x || update.y) { // If the x/y is updated, they moved.
            if (data.disposition != -1){ // If token is not hostile
                check_enemies_with_passive();
            }
        }
    }

    // If Using Stealth Mode for Player Tokens
    if (game.settings.get("icu5e", "playerTokenStealthMode").valueOf()){
        if (data.disposition == 1 || data.disposition == 2){ // If friendly or Neutral
            if (update.hidden == true && game.user.isGM == false){
                for (const placed_token of canvas.tokens.placeables) {
                    if (placed_token.id == update._id){ // Find the Token in Question
                        if (game.user.id in placed_token.actor.data.permission){ // If I'm an owner of the token; remain visible                                
                            placed_token.data.hidden = false;
                        } else {
                            placed_token.data.hidden = true;
                        }
                    }
                }
            }
        }
    }
});

function check_enemies_with_passive() {
    chat_text = "";

    selected_tokens = get_usable_tokens_from_selected();

    for (const selected of selected_tokens) {
        // If Token is not already in our list of tokens pending a Perception Roll
        if (!(tokens_pending_perception_roll.includes(selected.id))){
            perception_check_logic(selected, selected.actor.data.data.skills.prc.passive)
        } else {
            ui.notifications.error("Token " + selected.name + "("+ selected.id +") is already pending a roll.");
        }
    }
    if (chat_text != ""){ print_results_to_chat(chat_text); }
}

async function check_enemies_with_active() {
    let perception_roll_type = game.settings.get("icu5e", "activePerceptionRollType").valueOf();
    
    chat_text = "";

    selected_tokens = get_usable_tokens_from_selected();

    if (perception_roll_type == "Auto"){

        for (const selected of selected_tokens) {

            tokens_pending_perception_roll.push(selected.id);
            let perc_check_score = auto_roll_perception(selected);
            perception_check_logic(selected, perc_check_score)
        }

        if (chat_text != ""){ print_results_to_chat(chat_text); }

    } else if (perception_roll_type == "Request"){
        let requested_roll_timeout = game.settings.get("icu5e", "requestedRollTimeout").valueOf();
        
        //tokens_pending_perception_roll = []; // Reset Roll Results List in case of previous rolls

        for (const token of selected_tokens){

            // If Token is not already in our list of tokens pending a Perception Roll
            if (!(tokens_pending_perception_roll.includes(token.id))){
                // Append token to list of pending tokens
                tokens_pending_perception_roll.push(token.id);

                // Timeout so if the player doesn't answer, the GM auto rolls                
                setTimeout(() => {
                    if (tokens_pending_perception_roll.includes(token.id)){
                        chat_text = "";
                        perc_check_score = auto_roll_perception(token);
                        perception_check_logic(token, perc_check_score);
                        if (chat_text != ""){ print_results_to_chat(chat_text); }
                    }
                }, requested_roll_timeout);

                // Emit a socket event to players requesting a Perception Roll
                game.socket.emit('module.icu5e', {
                    operation: 'request_perception_roll',
                    user: game.user.id, 
                    content: {viewed_scene: game.scenes.viewed.id, actor_id: token.actor.id},
                });
            } else 
            {
                ui.notifications.error("Token " + token.name + "("+ token.id +") is already pending a roll.");
            }
            
        }
    }
}

// Initial Logic Steps for Revealing Tokens and Walls
function perception_check_logic(selected, perception_score){
    // Reveal Tokens
    for (const placed_token of canvas.tokens.placeables) {
        if (placed_token.data.disposition === -1){ 
            if (placed_token.data.hidden) { // If token is 'Hidden'
                // Set initial Stealth Score to the Passive Stealth; can change later in deeper function
                let token_stealth = placed_token.actor.data.data.skills.ste.passive;

                // If Perception Score is not defined; default to passive
                if (perception_score == ""){
                    perception_score = selected.actor.data.data.skills.prc.passive;
                }

                if (check_token_range(selected, placed_token)) { // If Enemy is within max distance
                    is_revealable_hostile(selected, placed_token, perception_score, token_stealth);
                }
            }
        }
    }
    
    // Reveal Walls
    let reveal_secret_doors = game.settings.get("icu5e", "revealSecretDoors").valueOf();
    if (reveal_secret_doors){
        for (const wall of canvas.walls.placeables) {
            if (wall.data.door == 2 && wall.data.ds == 0){ // If Secret and Closed
                // If wall is within range
                if (check_wall_range(selected, wall)){
                    is_revealable_wall(selected, wall, perception_score);
                }
            }
        }
    }
}

// Roll Perception Check Automatically for given Token
function auto_roll_perception(token){
    // If Token is in our list of tokens pending a Perception Roll
    if (tokens_pending_perception_roll.includes(token.id)){

        // Create new roll string: 1d20 + Perception Score
        let perception_roll_String = "1d20 + " + token.actor.data.data.skills.prc.total;

        // Roll Token Perception
        let rolled_perception = new Roll(perception_roll_String).roll();

        // Display rolled Perception as a message
        rolled_perception.toMessage({
            speaker: {
                alias: token.data.name
            },
            flavor: "Perception Check"
        });
        remove_token_id_from_array(token, tokens_pending_perception_roll);
        return rolled_perception.total;
    }
    return;
}

// Return Token given its ID
function find_token_by_token_id(token_id){
    // Find Token which matches data.content.token_id
    for (const placed_token of canvas.tokens.placeables){
        if (placed_token.id == token_id) {
            return placed_token;
        }
    }
    return;
}

// Return Token given 'Character' ID
function find_token_by_actor_id(actor_id){
    // Iterate through all the placed tokens and find my token that the GM is referencing
    for (const placed_token of canvas.tokens.placeables){
        if (placed_token.actor.id == game.user.character.id) {
            return placed_token;
        }
    }
    return;
}

// Handle response from client regarding thier Perception Check
function gm_process_percepton_results(data){
    chat_text = "";

    token_id = data.content.token_id;

    // If Token is in our list of tokens pending a Perception Roll
    if (tokens_pending_perception_roll.includes(token_id)){
        //console.log("Token ", token_id, " was pending");
        
        let selected = find_token_by_token_id(token_id);
            
        let perc_check_score = data.content.roll_results;
        perception_check_logic(selected, perc_check_score)
        remove_token_id_from_array(selected, tokens_pending_perception_roll)

        if (chat_text != ""){ print_results_to_chat(chat_text); }
    }

}

// Remove Token ID from Array
function remove_token_id_from_array(token, array){
    var index = tokens_pending_perception_roll.indexOf(token.id);
    array.splice(index, 1);
}

// Roll the Requested Skill
async function roll_selected_skill(token, skill) {
    let roll = await token.actor.rollSkill(skill);

    if (roll != null){
        let roll_result = roll.total;

        // After the roll, we send it via a socket to the GM
        game.socket.emit('module.icu5e', {
            operation: 'receive_perception_roll',
            user: game.user.id, 
            content: {viewed_scene: game.scenes.viewed.id, token_id: token.id, roll_results: roll_result},
        });
    }
}

// Return a list of Selected Tokens that will be doing Perception Checks i.e. selected non-hostile tokens
function get_usable_tokens_from_selected(){
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

// Calculate the distance between two tokens i.e. Is friendly token within range of hostile token
function get_token_calculated_distance(selected_token, placed_token){
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
    return calculated_distance;
}

// Return if the distance between the two token is within max_distance
function check_token_range(selected_token, placed_token){
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();

    calculated_distance = get_token_calculated_distance(selected_token, placed_token)
    return (calculated_distance <= max_distance)
}

// Calculate the distance between the given token and the given wall
function get_wall_calculated_distance(selected_token, wall){
    let distance_type = game.settings.get("icu5e", "distanceCalculationType").valueOf();
    let calculated_distance = 0;

    // Calculate distance based on chosen method
    if (distance_type == "Euclidean"){
        
        /// calculated_distance = canvas.grid.measureDistance(selected_token, placed_token);

    } else if (distance_type == "Grid") {
        let gridsize = canvas.grid.size;
        let d1 = Math.abs((selected_token.x - wall.center.x) / gridsize);
        let d2 = Math.abs((selected_token.y - wall.center.y) / gridsize);
        let dist = Math.max(d1, d2);

        calculated_distance = dist * canvas.scene.data.gridDistance;
    }
    return calculated_distance;
}

// Return if the distance between the token and the wall is within max_distance
function check_wall_range(selected_token, wall){
    let max_distance = game.settings.get("icu5e", "calculateDistance").valueOf();

    calculated_distance = get_wall_calculated_distance(selected_token, wall)
    return (calculated_distance <= max_distance)
}

// Check if hostile token should be revealed; then reveal
async function is_revealable_hostile(friendly_token, hostile_token, perception_score, stealth_score){

    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    let wall_in_the_way = false;

    // Draw ray from friendly_token to hostile and skip token if it collides with a wall
    if (account_for_walls == true){
        const ray = new Ray(friendly_token.center, hostile_token.center);
        const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);
        wall_in_the_way = collisions.length > 0;
    }

    if (is_perception_degradating == true){
        // Degrade Perception by -1 per 10 feet
        perception_score -= Math.floor(get_token_calculated_distance(friendly_token, hostile_token) / 10);
    }

    // If GM Stealth Overide is Enabled and getFlag does not return undefined
    if (allow_gm_stealth_overide == true && !(hostile_token.getFlag("icu5e", "stealth_score") === undefined)) {
        stealth_score = hostile_token.getFlag("icu5e", "stealth_score");
    }
    // If Enemy Stealth Score <= Perception Score AND no walls are in the way
    if (perception_score >= stealth_score && !wall_in_the_way){
        chat_text += friendly_token.name + " revealed " + hostile_token.name + " [" + stealth_score + "]<br>";
        await hostile_token.toggleVisibility();
    }
}

async function is_revealable_wall(selected, wall, perception_score){
    let is_perception_degradating = game.settings.get("icu5e", "veriantPerceptionDegradation").valueOf();
    let account_for_walls = game.settings.get("icu5e", "acountForWalls").valueOf();
    let wall_in_the_way = false;
    let door_stealth_score;

    // Draw ray from friendly_token to wall
    if (account_for_walls == true){
        const ray = new Ray(selected.center, wall.center);
        const collisions = WallsLayer.getWallCollisionsForRay(ray, canvas.walls.blockVision);                        
        // If the ray is colliding with more than one wall on its way to our given wall, 
        //then we assume there is a wall in the way
        wall_in_the_way = collisions.length > 1;
    }
    if (is_perception_degradating == true){
        // Degrade Perception by -1 per 10 feet
        perception_score -= Math.floor(get_wall_calculated_distance(selected, wall) / 10);
    }

    // If the wall has a flag value, set value of input box to the flag value
    if (!(wall.getFlag("icu5e", "door_stealth_score") === undefined)){
        door_stealth_score = wall.getFlag("icu5e", "door_stealth_score");
    } else {
        door_stealth_score = 50; // else default to a value of 50 which should never be reached
    }

    // If Door Stealth Score <= Perception Score AND no walls are in the way
    if (perception_score >= door_stealth_score && !wall_in_the_way){
        //chat_text += friendly_token.name + " revealed " + hostile_token.name + " [" + stealth_score + "]<br>";
        await wall.update({ds : 1})
    }
}

function print_results_to_chat(results){
    let display_perception_results_text = game.settings.get("icu5e", "displayPerceptionResults").valueOf();

    if (display_perception_results_text == true){
        if (results == ""){results = "It doesn't seem anyone was revealed."}
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: results
        };
        ChatMessage.create(chatData, {});
    }

    chat_text = "";
}

// Return Token given its ID
function find_wall_by_wall_id(wall_id){
    // Find Wall based on passed ID
    for (const wall of canvas.walls.placeables) {
        if (wall.id == wall_id){
            return selected_wall = wall;
        }
    }
    return;
}

Hooks.on('renderWallConfig', async (app, html, object) => {
    let reveal_secret_doors = game.settings.get("icu5e", "revealSecretDoors").valueOf();
    if (reveal_secret_doors){
        
        // Get Wall by ID
        let selected_wall = find_wall_by_wall_id(object.object._id);

        let door_stealth_score;
        
        // If the wall has a flag value, set value of input box to the flag value
        if (!(selected_wall.getFlag("icu5e", "door_stealth_score") === undefined)){
            door_stealth_score = selected_wall.getFlag("icu5e", "door_stealth_score");
        } else {
            door_stealth_score = 50; // else default to a value of 50 which should never be reached
        }

        
        // Path to module templates
        const my_template = '/modules/icu5e/templates/secret_door.html';

        // Get the handlebars output
        const my_html = await renderTemplate(my_template, { door_stealth_score });

        // Find form elements and inject their counterparts
        // Slightly complicated example here to show how to find a form element when
        //   it only has a name and not a class or ID, but any jQuery selector works
        const target = $(html).find('[name="door"]').parent();

        // Inject your handlebars template (can also use .before() of course)
        target.after(my_html);
    }
  });


Hooks.on('updateWall', async (app, object, changes) => {
    // If Config_Settings-Reveacl Secret Walls == True
    let reveal_secret_doors = game.settings.get("icu5e", "revealSecretDoors").valueOf();
    let selected_wall;

    if (reveal_secret_doors){
        if (changes.Reveal_DC != undefined) {
            selected_wall = find_wall_by_wall_id(object._id);
            await selected_wall.setFlag("icu5e", "door_stealth_score", object.Reveal_DC);
        }
    }
});