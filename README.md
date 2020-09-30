<h1>icu5e</h1>

A module for <a href="https://foundryvtt.com/">FoundryVTT</a> that lets you use Passive Perception and Active Perception checks to reveal hidden enemy tokens.

<h2>Purpose</h2>

Reveal any hidden enemies within X units if the Perception of the controlled token is greater than the Stealth of the Hostile token. The number of units can be edited within the Module Settings window. Adds an icon in the token hud (right-click the token).

<h2>Features</h2>

**Variant Passive Degradation (Module Setting)** - I've added in an option for 'Variant Perception Degradation'. This implements the passive perception losing a score of 1 per 10 feet of distance. The further the target, the worse your perception.

**Show Icon For (Module Setting)** - Disable tokenHUD icon on some tokens (Default: Characters). All - The Icon will appear on every token. Characters - Only appears on Characters. Friendlies - Only on tokens with a Friendly/Neutral disposition. The icon will only ever appear if you're GM, players do not have access to the icon.

**Allow GM Stealth Override (Module Setting)** - If enabled, Hostile tokens will now have an input box on the bottom right which will default to the tokens Passive Stealth. This input box is what will be checked against the Passive Perception to determine whether or not to reveal the token. It allows GM's who like to roll for Stealth as they're prepping a scene (like me) to use the number rolled rather than the Passive Stealth.

**Roll Hostile Stealth (Module Setting)** - Button that will roll a stealth check for the selected Hostile token and this is will be the value used against Perception to determine if the hostile token should be revealed.

**Display Perception Results (Module Setting)** - Print a chat message with each token revealed by which token. i.e. "Donny revealed Shadow [14]".

**Account for Walls (Module Settings)** - If there's a wall that blocks line of sight, the token will not be revealed.

**Active Perception Roll Type** - Auto - The Perception check will be automatically rolled by the token. Request - The player will receive a prompt requesting that they roll a Perception Check.

**Automatice Passive Perception Checks (Module Settings)[Experimental]** - Automatically check nearby tokens to reveal them when token is moved.

**Stealth Mode (Module Setting)[Experimental]** - Player token is Hidden from everyone but remains visible to the GM and the token Owner to simulate the player stealthing from everyone else.

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

<h4>Version 1.4.1</h4>
<ul>
  <li>Removed support for 'Simple' when handling multiple tokens. The module will handle multiple tokens on a Per-Token basis; each token will reveal what they can from their position.</li>
  <li>Active Perception Roll [Binocular Icon] - GM can Auto roll Perception Checks for given token or Request the roll from the players all at the click of a button.</li>
  <li>Slight Improvement to 'Automatically Scan' - Now only acts on Hostile tokens</li>
  <li>[Experimental] Stealth Mode - Player token is Hidden from everyone but remains visible to the GM and the token Owner to simulate the player stealthing from everyone else.</li>
  <li>Bug Fix: Display Perception Results is not working and not printing which hostile tokens are revealed</li>
  <li>Bug Fix: Perception Degradation had a bug that caused it to fail.</li>
  <li>Refactored a lot of code in order to be able easily add improvements in the future.</li>
</ul>

<h4>Version 1.3.8</h4>
<ul>
  <li>Groundwork for having GM auto-roll perception or request player to roll perception. Also setup a 'scan' to occur every time a token is moved using it's passive perception to experiment with it [EXPERIMENTAL!]. </li>
  <li>Bug Fix: If a token is touching a wall, it registers as a collision. </li>
  <li>Groundwork for active perception rolls.</li>
</ul>

<h4>Version 1.3.5</h4>
<ul>
  <li>Only show icons for Hostiles tokens when Hostile token is hidden to have a cleaner UI and not clutter the TokenHUD</li>
  <li>Roll Hostile Stealth (Module Setting) - Button that will roll a stealth check for the selected Hostile token and this is will be the value used against Perception to determine if the hostile token should be revealed.</li>
  <li>Display Perception Results (Module Setting) - Print a chat message with each token revealed by which token. i.e. "Donny revealed Shadow [14]".</li>
  <li>Account for Walls (Module Settings) - If there's a wall that blocks line of sight, the token will not be revealed.</li>
  <li>Distance calculation can now be done using Euclidean math or the grid distance.</li>
  <li>Bug Fix: Improved handling of switching hostile tokens to be visible to minimize buggy behavior</li>
</ul>

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
