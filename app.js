const getRandomValue = function (min,max){
    return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
    data(){
        return{
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: [],
            specialCooldown: -1,
        };
    },
    computed: {
        //Update health bar depending on monster health
        monsterBarStyles(){
            if(this.monsterHealth < 0){
                return {width: '0%'}
            }
            return {width: this.monsterHealth + '%'}
        },
        //Update health bar depending on player health
        playerBarStyles(){
            if(this.playerHealth < 0){
                return {width: '0%'}
            }
            return {width: this.playerHealth + '%'}
        },
        //Special attack coodown
        specialAttackCooldown(){
            if(this.specialCooldown >= 0){
                const specialAttackDisable = (this.currentRound - this.specialCooldown) < 3;
                if(!specialAttackDisable){
                    this.specialCooldown = -1;
                }
                return specialAttackDisable;
            }else{
                return false;
            }
        }
    },
    watch: {
        playerHealth(value){
            if(value <= 0 && this.monsterHealth <= 0){
                //Draw
                this.winner = 'draw';
            } else if (value <= 0) {
                //Player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value){
            if(value <= 0 && this.playerHealth <= 0){
                //Draw
                this.winner = 'draw';
            } else if (value <= 0){
                //Monster lost
                this.winner = 'player';
            }
        }
    },
    methods:{
        startGame(){
            //Reset all data properties
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
            this.specialCooldown = -1;

        },
        attackMonster(){
            //Atack min = 5 dmg , max = 12 dmg
            const attackValue = getRandomValue(5 , 12);
            this.monsterHealth = this.monsterHealth - attackValue;
            //Monster attack player after player attack
            this.attackPlayer();
            //Log the actions
            this.addLogMessage('player', 'attack', attackValue);
            //Update the round after an attack
            this.currentRound++;
        },
        //Monster attack
        attackPlayer(){
            //Atack min = 8 dmg , max = 15 dmg
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            //Log the action
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster(){
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.specialCooldown = this.currentRound;
            //Update the round after a special attack
            this.attackPlayer()
            //Monster attack player after player special attack
            this.addLogMessage('player', 'special atack', attackValue);
            //Log the action
            this.currentRound++;
        },
        healPlayer(){
            const healValue = getRandomValue(8, 20);
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            };
            this.attackPlayer();
            //Log the action
            this.addLogMessage('player', 'heal', healValue);
            //Monster attack player before healing
            this.currentRound++;
        },
        surrender(){
            this.winner = 'monster';
        },
        addLogMessage(who, action, value){
            this.logMessages.unshift({
                actionBy: who,
                actionType: action,
                actionValue: value
            })
        }
    }
});

app.mount('#game');