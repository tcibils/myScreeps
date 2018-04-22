*STATUS - 22-04-2018 - Thomas Cibils*


*Global mechanism :*

Data is stored by room, in each room memory. They have stored information in their memory on their needs and attached creeps. This allows modular code : filling information on one hand, and taking decisions with the data structured in the other.

 - myRooms[currentRoomIndex].memory.labels = []; -> Free-text labels for ease of reading the memory. Not used by mechanism.
 - myRooms[currentRoomIndex].memory.need = []; -> Quantity of creeps needed
 - myRooms[currentRoomIndex].memory.attached = []; -> Quantity of creeps currently attached
 - myRooms[currentRoomIndex].memory.role = []; -> Role of the creep in question - will define its role when spawned
 - myRooms[currentRoomIndex].memory.unity = []; -> Unity of the need and attachement - in general, its number of creeps. Free text for user.
 - myRooms[currentRoomIndex].memory.targetRoom = []; -> Target room of the creep, generaly obsolete due to needOriginPos, but useful to know what is the creep target. Stored in creep memory.
 - myRooms[currentRoomIndex].memory.needOrigin = []; -> What caused the creep to be spawned - energy source, power bank, controller to reserve...
 - myRooms[currentRoomIndex].memory.needOriginPos = []; -> Position of the above
 - myRooms[currentRoomIndex].memory.criticalNeed = []; -> If critical, we'll spawn the creep with as much energy as we currently have. Spreaders can have critical need.
 - And buildings ID as well

This information is filled through the dedicated scripts, that set each room's needs. 
For long distance(energy & power), raw information is gathered by scouts, then the computations are done in dedicated screeps (process.), and then transposed in a dedicated script to set each room's needs.
 
Based on this informations, we cross it with a priorities tables in the main, to know which creeps to spawn in priority. There is then one block of code in the main to spawn creeps, in a standardized way, with standard memory (easier to manage). This code manages multiple spawns.

Finally, each creep follows its own role, each role having a dedicated script file.

 

*Room leveling :*

 - First level : simple harvesters to start the machine and bring some energy.
 - Second level : using fat harvesters and fast movers to bring the energy back to the spawn, extensions and containers - containers used by upgraders to upgrade the room - get them space around !
 - Third level : using fat harvesters to stack energy in links, which send the energy to another link near a deposit. From there, spread to spawn and extenions by spreaderEfficient
 - Long distance harvest. : using long distance fat harvesters and movers to long-distance harvest, based on 4 input tables by player. Requires at leat one sender link in the room - carefull, CPU expensive, and one spawn can not be enough to spawn all creeps needed !
 - Creep sizes are automatically defined in body building loops, depending especially on the room capacity for most, to make them as big as possible
 - Deposit and withdraw target are for most creeps defined in dedicated modules. Include refilling tower in priority in case of attack.

 
*Markets :* Automatic harvesting if terminal + extractor. Automatic sale of K,U,H,O,L. Just selling, no lab etc., stacking credits. Also selling energy if too much.

*Defense :* Room threat level automatically detected. Towers refilled by spreadersEfficients efficiently. Tower focus closest ennemy to maximize damage. Walls are getting build up to 10M HP at room level 8. Correct defense. If a player attacks the room and I can't defeat it, safe mode and email notification.

*Attack  :* "PureFighter" available, just plain attacking code based on flags. Lame. No nuke code.


*Room reservation :* 

To reserve a room, use roomClaimer via the console (see below), and the longDistanceBuilder parameters.
/*
Game.spawns['SpawnX'].spawnCreep([CLAIM,MOVE], 'Claimer' + Game.time,  {memory: {role: 'roomClaimer', targetRoom: 'TO BE SET', originRoom: 'TO BE SET'}});
*/


*Power harvesting :*

Scouts find power sources in rooms, and store them in the rooms memories. 
Then, the power processing script descides wether its a good idea to go pick it up or not, the needed creeps, and what would be the home rooms, etc.
Them, the "set" script sets the needs to the decided home rooms. The creeps then get spawned for the harvesting, and bring back the energy in the room storage.
Finally, there is a small "power spreading creep" that passes the power from storage to power spawn.


*TODO LIST - IMPROVEMENTS*
 - Defense code - spawning defensive creeps if needed, using the heal delta (ennemy heal capacity - tower fire power)
 - CPU Management - spikes currently and stops sometimes. creep.moveTo is probably too expensive. Git branch existing to measure each role total cost.
 - Creating long-distance code to harvest buildings from dead players.
 - Multi-my-room management : energy simply get sold when room is level 8, to get credits, but I should transfer it to close rooms who still need level up
 - Lab mixing
 - Using nukes (need Ghodium)
 - Get better room claiming code, so far it's manual and dirty.
 - Get better "new room deployment code", now passing the first levels is quite dirty
 - Use data display layout in rooms for better overview.
 - Attack code - drawning creeps first. Once I'll have boost management, creeps pairs.
 - Find energy sources and power banks with observers rather than scouts - less CPU expensive
 - Automate Long Distance Builders (LDB) to use global room info?

*TODO LIST - BUGS*
 - take into account the mineral amount available for extractor need
 - Rewrite the withdraw source script in the same way as the deposit source script - it's currently terrible
 

 
 *Additional - Grunt*
 
My screeps account "default" branch is automatically updated with the main branch in github. To update other branches in screeps with other branches from github, one need to use "grunt". To do so, you need "node.js", "npm" and finally grunt itself - see here http://docs.screeps.com/commit.html . Then, before launching the "grunt screeps" sequence, you need a ".screeps.json" file, which is not in the git folder (gitignore). It must be as follows :

{

	"email": "myemail@myprovider.com",

	"password": "psw",

	"branch": "targetBranch",

	"ptr": false

}

You need to create the targetBranch before launching the update.