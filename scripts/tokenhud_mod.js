//console.log("icu5e - tokenhud_mod.js")

// Hook into Token HUD
Hooks.on("renderTokenHUD", (tokenHUD,html,app) => {
    //console.log("icu5e - renderTokenHUD Test!")
    if (game.user.isGM == true){
      let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
      let allow_gm_stealth_overide = game.settings.get("icu5e", "allowGMStealthOveride").valueOf();
      //console.log(show_icon_for, tokenHUD.object.actor.name, tokenHUD.object.actor.data.type, tokenHUD.object.data.disposition);

      // Determine which tokens should have the icon for the module
      if (show_icon_for == "All"){
        show_icon(tokenHUD,html,app);
      } else if (show_icon_for == "Characters" && tokenHUD.object.actor.data.type == "character"){
        show_icon(tokenHUD,html,app);
      } else if (show_icon_for == "Friendlies" && (tokenHUD.object.data.disposition === 0 || tokenHUD.object.data.disposition === 1)){
        show_icon(tokenHUD,html,app);
      }  
      
      // Whether to show the GM Stealth Overide Input Box
      if (tokenHUD.object.data.disposition === -1 && allow_gm_stealth_overide == true){
        show_stealth_score_box(tokenHUD,html,app);
      }

    }
})

// Show the Icon to test Perception
function show_icon(tokenHUD,html,app){
    // The Icon you want to add to the HUD
    const divToAdd = $('<i class="control-icon fa fa-eye"></i>');

    // Add to right or left side of hud
    html.find(".right").append(divToAdd);

    // Do something when it's clicked
    divToAdd.click(() => {
      //Do something when button clicked
      check_enemies();
    })
}

// Show Box to allow GM to insert Stealth Score
async function show_stealth_score_box(tokenHUD,html,app){

  let index_of_token = 0;

  // If more than one token controlled
  if (canvas.tokens.controlled.length > 1) {
    // Get ID of the token that tokenHUD was opened on
    let token_with_hud_open = canvas.tokens.controlled.find(token => token.id == tokenHUD.object.actor.token.id);
    // Get array position of token in the controlled list
    index_of_token = canvas.tokens.controlled.indexOf(token_with_hud_open);
  }

  if (!canvas.tokens.controlled[index_of_token].getFlag("icu5e", "stealth_score")) {
    let passive_stealth = tokenHUD.object.actor.data.data.skills.ste.passive;
    await canvas.tokens.controlled[index_of_token].setFlag("icu5e", "stealth_score", passive_stealth);
  }
  // The Icon you want to add to the HUD
  const divToAdd = $('<input type="text" name="stealth_score" value="' + canvas.tokens.controlled[index_of_token].getFlag("icu5e", "stealth_score") + '"></input>');

  // Add to right or left side of hud
  html.find(".right").append(divToAdd);

  // Do something when it's clicked
  divToAdd.change(async (inputbox) => {
    if(!canvas.tokens.controlled[index_of_token]) return
    await canvas.tokens.controlled[index_of_token].setFlag("icu5e", "stealth_score", inputbox.target.value); // Set stealth_score Flag    
  });
}