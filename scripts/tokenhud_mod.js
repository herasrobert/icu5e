//console.log("icu5e - tokenhud_mod.js")

Hooks.on("renderTokenHUD", (tokdenHUD,html,app) => {
    //console.log("icu5e - renderTokenHUD Test!")
    if (game.user.isGM == true){
      let show_icon_for = game.settings.get("icu5e", "showIconFor").valueOf();
      console.log(show_icon_for, tokdenHUD.object.actor.name, tokdenHUD.object.actor.data.type, tokdenHUD.object.data.disposition);

      if (show_icon_for == "All"){
        show_icon(tokdenHUD,html,app);
      } else if (show_icon_for == "Characters" && tokdenHUD.object.actor.data.type == "character"){
        show_icon(tokdenHUD,html,app);
      } else if (show_icon_for == "Friendlies" && (tokdenHUD.object.data.disposition === 0 || tokdenHUD.object.data.disposition === 1)){
        show_icon(tokdenHUD,html,app);
      }       
      
    }
})

function show_icon(tokdenHUD,html,app){
  // The Icon you want to add to the HUD
  const divToAdd = $('<i class="control-icon fa fa-eye"></i>') 

  // Add to right or left side of hud
  html.find(".right").append(divToAdd)

  // Do something when it's clicked
  divToAdd.click(() => {
    //Do something when button clicked
    check_enemies();
  })
}