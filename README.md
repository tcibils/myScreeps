# myScreeps
The code I currently run in screeps.com

// STATUS - 23-03-2018 - Thomas Cibils
// Using parameter dashboard to get infos in the console.

// First level : simple harvesters to start the machine and bring some energy.
// Second level : using fat harvesters and fast movers to bring the energy back to the spawn, extensions and containers - containers used by upgraders to upgrade the room - get them space around !
// Third level : using fat harvesters to stack energy in links, which send the energy to another link near a deposit. From there, spread to spawn and extenions by spreaderEfficient
// Long distance harvest. : using long distance fat harvesters and movers to long-distance harvest, based on 4 input tables by player. Only requires a storage in the room.

// All levels : all room needs are defined in the room memory, in an adequate data structure, which is then used to take spawn decisions
// All levels : creep sizes are automatically defined in body building loops below, depending especially on the room capacity, to make them as big as possible
// All levels : deposit and withdraw target are for most creeps defined in dedicated modules. Always towers first, then spawn and extensions - keep them filled !

// Markets              : Automatic harvesting if terminal + extractor. Automatic sale of K,U,H,O. Just selling, no lab etc., stacking credits. Also selling energy if too much.
// All levels - Defense : Tower(s) will be refilled to max ASAP and will only focus on destroying ennemies[0]. Lame. Automatic safe mode if > 4 ennemies attack parts in the room. Walls and ramparts are shit.
// All levels - Attack  : "PureFighter" available, just plain attacking code based on flags. Lame.
// Scouts moving around rooms to sign them, but not gathering any info.
// Not a single fuck given about CPU so far

// To reserve a room, use roomClaimer and longDistanceBuilder, via the console (see below)

/*
// !!! DEFINE TARGET ROOM !!!
Game.spawns['Spawn5'].spawnCreep([CLAIM,MOVE], 'Claimer' + Game.time,  {memory: {role: 'roomClaimer', targetRoom: 'W42N45', originRoom: 'W42N48'}});
Game.spawns['Spawn5'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], 'LongDistanceBuilder' + Game.time,  {memory: {role: 'longDistanceBuilder', targetRoom: 'W42N45', originRoom: 'W42N48'}});
*/

// UNDER WORK


// TODO LIST - IMPROVEMENTS
// 1 - Using info on creeps spawning to use multiple spawns
// 2 - Using scouts to store global information in global memory, so that script can take global decisions
// 4 - Using such info to spawn fat attack creeps and healers to get power - as well as carriers
// Using scout info to define automatically long-distance harvesting, rather than manual entry
// 3 - Creating long-distance code to harvest buildings from dead players.
// Multi-my-room management : energy simply get sold when room is level 8, to get credits, but I should transfer it by terminal to close rooms who still need level up
// Lab mixing - useless for now, no one wants to buy refined components
// Get better room claiming code, so fat it's manual and dirty.
// Use data display layout in rooms for better overview.
// CPU Management
// Attack code

// TODO LIST - BUGS
// TO BE IMPROVED : take into account the mineral amount available for extractor need
// simple harvesters spawn too easily
// fastmovers should deposit straight in storage if there is an efficient spreader
// Optimize long distance harvesting : Energy deposit ?
// Get better long distance harvesting code : now, when they get in the room, the best path might be to get back to the first room, and they get stuck goind back and forth
// 1 - LDFHarvesters sometime do not get over their container
// Better management of ramparts