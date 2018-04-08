*STATUS - 08-04-2018 - Thomas Cibils*


*Data structure :*

Data is stored by room, in each room memory. They have stored information in their memory on their needs and attached creeps. This allows modular code : filling information on one hand, and taking decisions with the data structured in the other.

 - myRooms[currentRoomIndex].memory.labels = [];
 - myRooms[currentRoomIndex].memory.need = [];
 - myRooms[currentRoomIndex].memory.attached = [];
 - myRooms[currentRoomIndex].memory.role = [];
 - myRooms[currentRoomIndex].memory.unity = [];
 - myRooms[currentRoomIndex].memory.targetRoom = [];
 - myRooms[currentRoomIndex].memory.needOrigin = [];
 - myRooms[currentRoomIndex].memory.needOriginPos = [];
 - myRooms[currentRoomIndex].memory.criticalNeed = [];
 - And buildings ID as well

This information is filled through the dedicated scripts, that set each room's needs. 
For long distance(energy & power), raw information is gathered by scouts, then the computations are done in dedicated screeps (process.), and then transposed in a dedicated script to set each room's needs.
 
Based on this informations, we cross it with a priorities tables in the main, to know which creeps to spawn in priority. There is then one block of code to spawn creeps, in a standardized way, with standard memory (easier to manage). This code manages multiple spawns.
 

*Room leveling :*

 - First level : simple harvesters to start the machine and bring some energy.
 - Second level : using fat harvesters and fast movers to bring the energy back to the spawn, extensions and containers - containers used by upgraders to upgrade the room - get them space around !
 - Third level : using fat harvesters to stack energy in links, which send the energy to another link near a deposit. From there, spread to spawn and extenions by spreaderEfficient
 - Long distance harvest. : using long distance fat harvesters and movers to long-distance harvest, based on 4 input tables by player. Requires at leat one sender link in the room.

 - Creep sizes are automatically defined in body building loops, depending especially on the room capacity for most, to make them as big as possible
 - Deposit and withdraw target are for most creeps defined in dedicated modules. Always towers first, then spawn and extensions - keep them filled !

*Other current mechanics :*
 - Markets : Automatic harvesting if terminal + extractor. Automatic sale of K,U,H,O,L. Just selling, no lab etc., stacking credits. Also selling energy if too much.
 - All levels - Defense : Tower(s) will be refilled to max ASAP and will only focus on destroying ennemies[0]. Lame. Automatic safe mode if > 4 ennemies attack parts in the room. Walls and ramparts are shit.
 - All levels - Attack  : "PureFighter" available, just plain attacking code based on flags. Lame. No nuke code.
 - Scouts moving around rooms to sign them, and gathering info
 - CPU spiking too high - remains a problem to solve.


*Room reservation :* 

To reserve a room, use roomClaimer via the console (see below), and the longDistanceBuilder parameters.
/*
Game.spawns['SpawnX'].spawnCreep([CLAIM,MOVE], 'Claimer' + Game.time,  {memory: {role: 'roomClaimer', targetRoom: 'TO BE SET', originRoom: 'TO BE SET'}});
*/


*Power harvesting*

Scouts find power sources in rooms, and store them in the rooms memories. 
Then, the power processing script descides wether its a good idea to go pick it up or not, the needed creeps, and what would be the home rooms, etc.
Them, the "set" script sets the needs to the decided home rooms. The creeps then get spawned for the harvesting, and bring back the energy in the room storage.
Finally, there is a small "power spreading creep" that passes the power from storage to power spawn.


*TODO LIST - IMPROVEMENTS*
 - CPU Management - spikes currently and stops sometimes. creep.moveTo is probably too expensive. Git branch existing to measure each role total cost.
 - Creating long-distance code to harvest buildings from dead players.
 - Multi-my-room management : energy simply get sold when room is level 8, to get credits, but I should transfer it by terminal to close rooms who still need level up
 - Lab mixing
 - Get better room claiming code, so far it's manual and dirty.
 - Use data display layout in rooms for better overview.
 - Attack code - drawning creeps first. Once I'll have boost management, creeps pairs.
 - Find energy sources and power banks with observers rather than scouts - less CPU expensive

*TODO LIST - BUGS*
 - take into account the mineral amount available for extractor need
 - fastmovers should deposit straight in storage if there is an efficient spreader
 - LDFHarvesters sometime do not get over their container
 - Better management of ramparts