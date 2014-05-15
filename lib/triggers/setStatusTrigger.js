﻿var util = require('util');
var winston = require('winston');

var BaseTrigger = require('./baseTrigger.js').BaseTrigger;

/*
Trigger that changes the bot's status.
command = string - a message must start with this + a space before a response will be given. Defaults to !status.
allowpublic = bool - allow the command to be used in a groupchat.
allowprivate = bool - allow the command to be used in a private message.

statuses = json! yay! If the given state is not allowed to be set, set the value for it to false. If it is allowed, but you want to change the name, set it to your new name. E.g. to disable snooze and set 'looking to play' suffix to 'playwithme', use statuses={'snooze':'false','play':'playwithme'};
offline status is disabled by default. Do not enable it unless you have some way to tell the bot to go back online afterward (This is not currently possible).
*/

var SetStatusTrigger = function() {
		SetStatusTrigger.super_.apply(this, arguments);
};

util.inherits(SetStatusTrigger, BaseTrigger);



var type = "SetStatusTrigger";
exports.triggerType = type;
exports.create = function(name, chatBot, options) {
		var trigger = new SetStatusTrigger(type, name, chatBot, options);
		trigger.options.command = trigger.options.command || "!status";
		trigger.options.statuses = trigger.options.statuses || {};
		trigger.options.statuses.online = trigger.options.statuses.online || "online";
		trigger.options.statuses.busy = trigger.options.statuses.busy || "busy";
		trigger.options.statuses.away = trigger.options.statuses.away || "away";
		trigger.options.statuses.snooze = trigger.options.statuses.snooze || "snooze";
		trigger.options.statuses.trade = trigger.options.statuses.trade || "trademe";
		trigger.options.statuses.play = trigger.options.statuses.play ||  "playme";
		trigger.options.statuses.offline = trigger.options.statuses.offline ||  false;
		trigger.options.allowpublic = trigger.options.allowpublic || true;
		trigger.options.allowprivate = trigger.options.allowprivate || true;
		return trigger;
};

// Return true if a message was sent
SetStatusTrigger.prototype._respondToFriendMessage = function(userId, message) {
		if(this.options.allowprivate) return this._respond(userId, message); else return false;
}

// Return true if a message was sent
SetStatusTrigger.prototype._respondToChatMessage = function(roomId, chatterId, message) {
		if(this.options.allowpublic) return this._respond(roomId, message); else return false;
}

SetStatusTrigger.prototype._respond = function(toId, message) {
		console.log(type);
		var query = this._stripCommand(message).params[1].toLowerCase();
		var statuses = trigger.options.statuses;
		if(statuses.offline!=false && query == statuses.offline.toLowerCase()){ this.chatBot.setPersonaState(0); return true; }
		if(statuses.online !=false && query == statuses.online.toLowerCase()) { this.chatBot.setPersonaState(1); return true; }
		if(statuses.busy   !=false && query == statuses.busy.toLowerCase())   { this.chatBot.setPersonaState(2); return true; }
		if(statuses.away   !=false && query == statuses.away.toLowerCase())   { this.chatBot.setPersonaState(3); return true; }
		if(statuses.snooze !=false && query == statuses.snooze.toLowerCase()) { this.chatBot.setPersonaState(4); return true; }
		if(statuses.trade  !=false && query == statuses.trade.toLowerCase())  { this.chatBot.setPersonaState(5); return true; }
		if(statuses.play   !=false && query == statuses.play.toLowerCase())   { this.chatBot.setPersonaState(6); return true; }
		return false;
}

ModerateTrigger.prototype._stripCommand = function(message) {
	if (this.options.command && message && message.toLowerCase().indexOf(this.options.command.toLowerCase() + " ") == 0) {
		return {message: message, params: message.split(' ')};
	}
	return null;
}