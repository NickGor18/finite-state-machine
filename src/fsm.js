class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.cur_state = config.initial;
        this.story = [this.cur_state];
        this.story_count=0;
        this.statesList = [];
        this.eventsStates = {};

        for(let state in this.config.states) {
            this.statesList.push(state);

            for(let key in this.config.states[state]['transitions']) {
                if(this.eventsStates[key]){ 
                    this.eventsStates[key].push(state);
                } else { 
                    this.eventsStates[key] = [state];
                }
            }
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.cur_state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.config.states[state]){
            this.cur_state = state;
            this.story_count++;
            this.story[this.story_count] = this.cur_state;
        }
        else throw Error("Undefind state");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let cur_state = this.config.states[this.cur_state]['transitions'][event];
        if(cur_state==undefined) throw Error("Undefind state")
        this.changeState(cur_state);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.cur_state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(event == null){
            return this.statesList;
        } 
        if(!this.eventsStates[event]) return [];
        return this.eventsStates[event];
        
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.story_count == 0) return false;
        this.story_count--;
        let state = this.story[this.story_count];
        this.cur_state= state;
        
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let state = this.story[this.story_count + 1];

        if(!state) return false;

        this.cur_state = state;
        this.story_count++;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.story_count = 0;
        this.story = [this.config.initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
