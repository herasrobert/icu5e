console.log("icu5e started")

Hooks.on("renderTokenHUD", (tokdenHUD,html,app) => {
    console.log("Me! Test! Rib_Rob!")
    
    // The Icon you want to add to the HUD
    const divToAdd = $('<i class="control-icon fa fa-eye"></i>') 

    // Add to right or left side of hud
    html.find(".right").append(divToAdd)

    // Do something when it's clicked
    divToAdd.click(() => {
      //Do something when button clicked
      check_enemies();
    })
  })

  function check_enemies() {
    console.log("Click!2222")

    // Set Distance Flag

    // Get Controlled Token's Passive Perception

    // Iterate Through All Hidden Enemies
    
    // If Enemy is within X distance
        // If Enemy Passive Stealth <= Passive Perception
            //Enemy toggleVisibility
  }