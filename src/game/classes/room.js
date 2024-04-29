const logger = require('../../logger');
const Match = require('./match');

class Room {
    constructor(id, roomMap) {
        this.id = id;
        this.users = new Map();
        this.match = new Match(this);
        this.roomMap = roomMap;
    }

    addUser(user) {
        let added = false;
        if (user !== null && !this.match.matchStarted) {
            this.users.set(user.uuid, user);
            this.startMatch();
            added = true;
        }
        return added;
    }

    removeUser(user) {
        let removed = false;
        const uuid = user.uuid;
        if (this.users.has(uuid)) {
            this.users.delete(uuid);
            removed = true;
        }
        return removed;
    }

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
        logger.info(`Deleting room ${this.id}`);
        this.roomMap.delete(this.id);
    }

    startMatch() {
        if (this.users.size > 0 && this.match.startCountdown === null) {
            this.match.start();
        }
    }

    broadcast(type, message) {
        this.users.forEach((user) => {
            const socket = user.socket;
            socket.emit(type, message);
        });
    }
}

module.exports = Room;