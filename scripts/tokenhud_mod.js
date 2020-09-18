//console.log("icu5e - tokenhud_mod.js")

// Hook into Token HUD
Hooks.on("renderTokenHUD", (tokenHUD,html,app) => {
    //console.log("icu5e - renderTokenHUD Test!")
    if (game.user.isGM == true){
      let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
      let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
      let roll_hostiles_stealth = game.settings.get("icu5e", "rollHostileStealth").valueOf();
      //console.log(show_icon_for, tokenHUD.object.actor.name, tokenHUD.object.actor.data.type, tokenHUD.object.data.disposition);

      // Determine which tokens should have the icon for the module
      if (show_icon_for == "All"){
        show_icon(tokenHUD,html,app);
      } else if (show_icon_for == "Characters" && tokenHUD.object.actor.data.type == "character"){
        show_icon(tokenHUD,html,app);
      } else if (show_icon_for == "Friendlies" && (tokenHUD.object.data.disposition === 0 || tokenHUD.object.data.disposition === 1)){
        show_icon(tokenHUD,html,app);
      }

      // Only show icons for Hostiles when Hostile is hidden
      if (tokenHUD.object.data.disposition === -1) {
        // Find the Selected Hostile Token that we'll work with, accounts for multiple selected tokens
        selected_hostile_token = find_selected_token(tokenHUD);
 
        if (selected_hostile_token.data.hidden){
         
          // Whether to show the GM Stealth Overide Input Box if Hostile token
          if (allow_gm_stealth_overide == true){
            // Whether to show the Stealth Roll Button if Hostile token
            if (roll_hostiles_stealth == true){
              show_stealth_roll(selected_hostile_token, tokenHUD,html,app);
            }

            show_stealth_score_box(selected_hostile_token, tokenHUD,html,app);            
          }
        }
      }
      
    }
})

// Show the Icon to 'Scan' with Perception
function show_icon(tokenHUD,html){
    let player_token_stealth_mode = game.settings.get("icu5e", "playerTokenStealthMode").valueOf();

    // The Icon you want to add to the HUD
    const scan_passive_btn = $('<i title="Scan with Passive Perception" class="control-icon fa fa-eye" ></i>');

    // Add to right or left side of hud
    html.find(".right").append(scan_passive_btn);

    // Do something when it's clicked
    scan_passive_btn.click(async () => {      
      check_enemies_with_passive();
    })

    // Active Passive Button
    const scan_roll_btn = $('<i title="Roll for Active Perception" class="control-icon fa fa-binoculars" ></i>');
    html.find(".right").append(scan_roll_btn);
    scan_roll_btn.click(async () => {
      check_enemies_with_active();
    })
}

// Show Box to allow GM to insert Stealth Score
async function show_stealth_score_box(selected_hostile_token, tokenHUD,html){
  
  // if stealth_score flag isn't defined; default it to the hostile tokens Passive Stealth
  if (selected_hostile_token.getFlag("icu5e", "stealth_score") === undefined) {
    let passive_stealth = tokenHUD.object.actor.data.data.skills.ste.passive;
    await selected_hostile_token.setFlag("icu5e", "stealth_score", passive_stealth);
  }
  // The Icon you want to add to the HUD
  const divToAdd = $('<input id="stl_scr_inp_box" title="Current Stealth Score" type="text" name="stealth_score_inp_box" value="' + selected_hostile_token.getFlag("icu5e", "stealth_score") + '"></input>');

  // Add to right or left side of hud
  html.find(".right").append(divToAdd);

  // Do something when it's clicked
  divToAdd.change(async (inputbox) => {
    // if token is not undefined
    if(selected_hostile_token === undefined ) return
    // Save the GM selected stealth score to the stealth_score flag
    await selected_hostile_token.setFlag("icu5e", "stealth_score", inputbox.target.value); // Set stealth_score Flag    
  });
}

// Show the Icon to Roll a Stealth Roll for Token
async function show_stealth_roll(selected_hostile_token, tokenHUD,html){
  // The Icon you want to add to the HUD
  const divToAdd = $('<i title="Roll for Stealth" class="control-icon fa fa-low-vision"></i>');

  // Add to right or left side of hud
  html.find(".right").append(divToAdd);

  // Do something when it's clicked
  divToAdd.click(async () => {

    // Create new roll string: 1d20 + Stealth Score
    let stealth_roll_String = "1d20 + " + selected_hostile_token.actor.data.data.skills.ste.total;

    // Roll Token Stealth
    let rolled_stealth = new Roll(stealth_roll_String).roll();

    // Display rolled stealth as a message
    rolled_stealth.toMessage({
      speaker: {
        alias: selected_hostile_token.data.name
      }
    })

    // Update 'stealth_score_inp_box' (inputbox) with new rolled stealth value
    html.find("#stl_scr_inp_box")[0].value = rolled_stealth.total;

    // if token is not undefined
    if(selected_hostile_token === undefined ) return

      // Save the new stealth score to the stealth_score flag
      await selected_hostile_token.setFlag("icu5e", "stealth_score", rolled_stealth.total); // Set stealth_score Flag
  })
}

// Find and Return the hostile token that has the tokenHUD open
function find_selected_token(tokenHUD){
  let index_of_token = 0;
  // If more than one token controlled; find token with the TokenHUD opened and that's the one we'll work with
  if (canvas.tokens.controlled.length > 1) {
    // Get ID of the token that tokenHUD was opened on
    let token_with_hud_open = canvas.tokens.controlled.find(token => token.id == tokenHUD.object.actor.token.id);
    // Get array position of token in the controlled list
    index_of_token = canvas.tokens.controlled.indexOf(token_with_hud_open);        
  } 

  return canvas.tokens.controlled[index_of_token]; // Our selected token, the token with TokenHUD opened
}