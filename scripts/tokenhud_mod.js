//console.log("icu5e - tokenhud_mod.js")

Hooks.on("renderTokenHUD", (tokdenHUD,html,app) => {
    //console.log("icu5e - renderTokenHUD Test!")
    
        if (game.user.isGM == true){
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
})