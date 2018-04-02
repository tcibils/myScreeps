/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('building.terminal');
 * mod.thing == 'a thing'; // true
 */
 
var buildingTerminal = {
    run: function(terminal) {
        let energyLimit = 50000;
        if(Game.time % 200 == 0) {
            if(terminal.store[RESOURCE_KEANIUM] > 0) {
                let buyOrdersKeanium = Game.market.getAllOrders(order => order.resourceType == RESOURCE_KEANIUM && order.type == ORDER_BUY && order.price > 0.129);
                _.sortBy(buyOrdersKeanium, ['price']);
                if(!terminal.cooldown && buyOrdersKeanium.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersKeanium[0].amount, terminal.store[RESOURCE_KEANIUM]) + ' Keanium, at price ' + buyOrdersKeanium[0].price +', result : ' + Game.market.deal(buyOrdersKeanium[0].id, Math.min(buyOrdersKeanium[0].amount, terminal.store[RESOURCE_KEANIUM]), terminal.room.name))
                }
            }            
                // Automated keanium sale
            if(terminal.store[RESOURCE_HYDROGEN] > 0) {
                let buyOrdersHydrogen = Game.market.getAllOrders(order => order.resourceType == RESOURCE_HYDROGEN && order.type == ORDER_BUY && order.price > 0.305);
                _.sortBy(buyOrdersHydrogen, ['price']);
                if(!terminal.cooldown && buyOrdersHydrogen.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersHydrogen[0].amount, terminal.store[RESOURCE_HYDROGEN]) + ' Hydrogen, at price ' + buyOrdersHydrogen[0].price +', result : ' + Game.market.deal(buyOrdersHydrogen[0].id, Math.min(buyOrdersHydrogen[0].amount, terminal.store[RESOURCE_HYDROGEN]), terminal.room.name))
                }
            }
            
            if(terminal.store[RESOURCE_UTRIUM] > 0) {
                let buyOrdersUtrium = Game.market.getAllOrders(order => order.resourceType == RESOURCE_UTRIUM && order.type == ORDER_BUY && order.price > 0.106);
                _.sortBy(buyOrdersUtrium, ['price']);
                if(!terminal.cooldown && buyOrdersUtrium.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersUtrium[0].amount, terminal.store[RESOURCE_UTRIUM]) + ' Utrium, at price ' + buyOrdersUtrium[0].price +', result : ' + Game.market.deal(buyOrdersUtrium[0].id, Math.min(buyOrdersUtrium[0].amount, terminal.store[RESOURCE_UTRIUM]), terminal.room.name))
                }
            }
			
			if(terminal.store[RESOURCE_LEMERGIUM] > 0) {
                let buyOrdersLemergium = Game.market.getAllOrders(order => order.resourceType == RESOURCE_LEMERGIUM && order.type == ORDER_BUY && order.price > 0.15);
                _.sortBy(buyOrdersLemergium, ['price']);
                if(!terminal.cooldown && buyOrdersLemergium.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersLemergium[0].amount, terminal.store[RESOURCE_LEMERGIUM]) + ' Lemergium, at price ' + buyOrdersLemergium[0].price +', result : ' + Game.market.deal(buyOrdersLemergium[0].id, Math.min(buyOrdersLemergium[0].amount, terminal.store[RESOURCE_LEMERGIUM]), terminal.room.name))
                }
            }
            
            if(terminal.store[RESOURCE_OXYGEN] > 0) {
                let buyOrdersOxygen = Game.market.getAllOrders(order => order.resourceType == RESOURCE_OXYGEN && order.type == ORDER_BUY && order.price > 0.071);
                _.sortBy(buyOrdersOxygen, ['price']);
                if(!terminal.cooldown && buyOrdersOxygen.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersOxygen[0].amount, terminal.store[RESOURCE_OXYGEN]) + ' Oxygen, at price ' + buyOrdersOxygen[0].price +', result : ' + Game.market.deal(buyOrdersOxygen[0].id, Math.min(buyOrdersOxygen[0].amount, terminal.store[RESOURCE_OXYGEN]), terminal.room.name))
                }
            }
            
            if(terminal.store[RESOURCE_ENERGY] > energyLimit) {
                let buyOrdersEnergy = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY && order.type == ORDER_BUY && order.price > 0.035);
                _.sortBy(buyOrdersEnergy, ['price']);
                if(!terminal.cooldown && buyOrdersEnergy.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersEnergy[0].amount, terminal.store[RESOURCE_ENERGY]) + ' Energy, at price ' + buyOrdersEnergy[0].price +', result : ' + Game.market.deal(buyOrdersEnergy[0].id, Math.min(buyOrdersEnergy[0].amount, terminal.store[RESOURCE_ENERGY]), terminal.room.name))
                }
            }
            
            if(_.sum(terminal.store) == terminal.storeCapacity) {
                let buyOrdersEnergy = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY && order.type == ORDER_BUY);
                _.sortBy(buyOrdersEnergy, ['price']);
                if(!terminal.cooldown && buyOrdersEnergy.length > 0) {
                    console.log('Selling ' + Math.min(buyOrdersEnergy[0].amount, terminal.store[RESOURCE_ENERGY]) + ' Energy, at price ' + buyOrdersEnergy[0].price +', result : ' + Game.market.deal(buyOrdersEnergy[0].id, Math.min(buyOrdersEnergy[0].amount, terminal.store[RESOURCE_ENERGY]), terminal.room.name))
                }
            }
            
        }
    }
}

module.exports = buildingTerminal;