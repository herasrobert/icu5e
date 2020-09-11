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
<a href="https://edhel.online/wiki/Icue5e#Version_1.3.0/">My Wiki</a>


<h2>Known Issues/Bugs</h2>
Token Mold can overrite all enemy tokens to Neutral or Friendly; this script only works on Hostile tokens
Because of the way the distance calculation works, add 2 units to the actual value you want. So if you want to reveal a token 10 ft away, use 12 units in Module Settings. For 30 units, use 32. I'm hoping to improve on this really soon. You can also set it to a really high value to unhide all monsters on the map as your players will likely come across them in a room.

<h2>ChangeLog</h2>

<h4>Version 1.3.0</h4>
<ul>
  <li>Variant Passive Degradation (Module Setting). I've added in an option for 'Variant Perception Degradation'. This implements the passive perception losing a score of 1 per 10 feet of distance. The further the target, the worse your perception.</li>
  <li>Show Icon For (Module Setting) Disable tokenHUD icon on some tokens (Default: Characters). All - The Icon will appear on every token. Characters - Only appears on Characters. Friendlies - Only on tokens with a Friendly/Neutral disposition. The icon will only ever appear if you're GM, players do not have access to the icon.</li>
  <li>Allow GM Stealth Override (Module Setting) - If enabled, Hostile tokens will now have an input box on the bottom right which will default to the tokens Passive Stealth. This input box is what will be checked against the Passive Perception to determine whether or not to reveal the token. It allows GM's who like to roll for Stealth as they're prepping a scene (like me) to use the number rolled rather than the Passive Stealth.</li>
</ul>

<h4>Version 1.2.0</h4>
<ul>
  <li>Only GM will see the tokenHUD button so only the GM can run it.</li>
  <li>In Module Settings, the default calculated distance has been changed to 32</li>
  <li>In Module Settings you'll also find an option for how to handle multiple tokens selected. Simple - The token with the highest perception will be used. Per-Token - Each token will reveal what they can from their position.</li>
</ul>

I can be reached on Discord with any bugs you find.
