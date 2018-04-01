
var processLDPowerInfo = {
    run: function() {
        
		// Starting now :
		// For each of rooms having a memory
		for(var roomInMemory in Memory.rooms) {
			if(Memory.rooms[roomInMemory].powerSources.length > 0) {
				
				// On va devoir définir de quelle(s) room(s) on va partir - très probablement forcément des niveaux 8
				
				// Il faudra trois types de creeps, en quantités différentes :
				// 1. Le frappeur
				// 2. Le healeur
				// 3. Le carry
				
				// On pourrait imaginer qu'ils viennent de rooms différentes, et s'attendent.
				// à voir chaque type dans quelles quantités
				
				// L'objectif ici sera donc de définir quels creeps on va demander à produire dans quelle room
				// Partant, on fera ensuite un script qui convertira ça en need dédié pour chaque home room.
				
				// Computings :
				// Data
				// La powerbank a 2M HP, et vit jusqu'à 5000 ticks, en renvoyant 50% des dommages.
				// Un attack body fait 30 dommages/ tick, et un heal body soigne 12 dégats/tick
				// Et un creep vit 1500 tous max
				
				// Attack creeps
				// En supposant qu'on utilise disons les 1400 ticks pour la destroy :
				// 2'000'000 / 30 = 66'667 attaques nécessaires
				// 66'667 / 1500 = 48 attaques par tour nécessaires en moyenne
				// Donc : deux attack creeps, 25 attack et 25 moves chacun. 
				// Total cost 3250, need RCL 7.
				
				// Heal creeps
				// 25 attack par tour veut dire 25*30 == 750 dmg/tour
				// Renvoie 50%, donc 375 subis par tour
				// 375/12 = 31.25, il faut donc des soins à 32 heal et 16 move, donc 2x plus lent !
				// Total cost 8800, need RCL 8
				
				// Carry creeps
				// Une power bank a environ 3'000 power. Un carry permet 50 à transporter. Un creep 25 move 25 carry peut donc 1250.
				// Il faudrait donc 2 à 4 carry creeps maxés en fonction.
				// Total cost 2500, chill sur le RCL - 6 peut être
			}
		}
    }
}

module.exports = processLDPowerInfo;
