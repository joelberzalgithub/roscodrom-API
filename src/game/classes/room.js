const logger = require('../../logger');
const Match = require('./match');

/**
 * Represents a room where users can join and participate in matches.
 */
class Room {
    /**
     * Creates an instance of Room.
     * @param {string} id - The unique identifier of the room.
     * @param {Map} roomMap - The map containing all rooms.
     */
    constructor(id, roomMap) {
        this.id = id;
        this.users = new Map();
        this.match = new Match(this, 5000, 5000);
        this.roomMap = roomMap;
    }

    /**
     * Adds a user to the room and starts the match if it hasn't started yet.
     * @param {object} user - The user to be added to the room.
     * @returns {boolean} - True if the user was successfully added, false otherwise.
     */
    addUser(user) {
        let added = false;
        if (user !== null && !this.match.matchStarted) {
            this.users.set(user.uuid, user);
            this.startMatch();
            added = true;
        }
        return added;
    }

    /**
     * Removes a user from the room.
     * @param {object} user - The user to be removed from the room.
     * @returns {boolean} - True if the user was successfully removed, false otherwise.
     */
    removeUser(user) {
        let removed = false;
        const uuid = user.uuid;
        if (this.users.has(uuid)) {
            this.users.delete(uuid);
            removed = true;
        }
        return removed;
    }

    /**
     * Removes all users from the room and deletes the room.
     */
    removeAllUsers() {
        this.broadcast('kicked', JSON.stringify({
            reason: 'match ended'
        }));
        this.users.forEach((key) => {
            const removed = this.removeUser(key);
            if (!removed) {
                logger.error(`Something went wrong while removing user ${key} from room ${this.id}`);
            }
        });
        logger.warn(`Deleting room ${this.id}`);
        this.roomMap.delete(this.id);
    }

    /**
     * Starts the match if there are users in the room and the match countdown hasn't started yet.
     */
    startMatch() {
        if (this.users.size > 0 && !this.match.matchStarted) {
            this.match.start();
        }
    }    

    /**
     * Broadcasts a message to all users in the room.
     * @param {string} type - The type of message to be broadcasted.
     * @param {string} message - The message to be broadcasted.
     */
    broadcast(type, message) {
        this.users.forEach((user) => {
            const socket = user.socket;
            socket.emit(type, message);
        });
    }
}

module.exports = Room;
