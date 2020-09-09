<h1>icu5e</h1>

A module for <a href="https://foundryvtt.com/">FoundryVTT</a> that lets you draw fog of war manually.

<h2>Features</h2>
Adds an icon in the token hud (right-click the token). When clicked on the controlled token, it will reveal any hidden enemy within X units if the Passive Perception of the controlled token is greater than the Passive Stealth of the Hostile token. The number of units can be edited within the Module Settings window.

If you select more than one controlled token, you have the option to reveal enemies based on the token with the highest Passive Perception or reveal based on what each token can see. This is changed through the Module Settings window.


<h2>Install</h2>
Check the releases to the right hand side

<h2>Demo</h2>

![Alt Text](https://media.giphy.com/media/mAD0BrIgiM4HgdZX64/giphy.gif)

<h2>Version 1.0.0 Notes</h2>


<h2>Planned Future Features</h2>

Version 1.3.0 - Improve the distance calculation. 

Version 1.4.0 - I want to give the GM the option to have players roll rather than use the Passive Perception. The idea is to have the GM be able to use the characters passive perception or prompt the user to roll a perception check.

Version 1.5.0 - The hidden token will have their Passive Stealth as a default value but the GM will be able to override the value with something of their own choosing. This is useful for DM's like me who roll a stealth roll for each monster when prepping a scene.

Version 1.6.0 - I want to account for walls being in the way but maybe ignore terrain and invisible walls? Also, I'd like to limit the token hud interface to only player Actors and not NPCs or monsters.

<h2>Known Issues/Bugs</h2>
Token Mold can overrite all enemy tokens to Neutral or Friendly; this script only works on Hostile tokens
Because of the way the distance calculation works, add 2 units to the actual value you want. So if you want to reveal a token 10 ft away, use 12 units in Module Settings. For 30 units, use 32. I'm hoping to improve on this really soon. You can also set it to a really high value to unhide all monsters on the map as your players will likely come across them in a room.

<h2>ChangeLog</h2>
<h4>Version 1.2.0</h4>
<ul>
  <li>Only GM will see the tokenHUD button so only the GM can run it.</li>
  <li>In Module Settings, the default calculated distance has been changed to 32</li>
  <li>In Module Settings you'll also find an option for how to handle multiple tokens selected. Simple - The token with the highest perception will be used. Per-Token - Each token will reveal what they can from their position.</li>
</ul>

I can be reached on Discord with any bugs you find.
