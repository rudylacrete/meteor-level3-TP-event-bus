import { Meteor } from 'meteor/meteor';
import * as eventConfig from '/imports/common/eventsConfiguration.js';

class Subscriber {
	constructor(meteorApi) {
		this._firstAddDone = false;
		this._meteorApi = meteorApi;
	}

	pushEvent(eventName, data) {
		let doc = {name: eventName, data, date: (new Date()).getTime()};
		if(this._firstAddDone) {
			this._meteorApi.changed(eventConfig.COLLECTION_NAME, eventConfig.DOC_ID, doc);
		} else {
			this._firstAddDone = true;
			this._meteorApi.added(eventConfig.COLLECTION_NAME, eventConfig.DOC_ID, doc);
		}
	}
}

subscribersList = [];

Meteor.publish(eventConfig.PUBLISH_NAME, function() {
	sub = new Subscriber(this);
	subscribersList.push(sub);
	this.onStop(function() {
		subscribersList.splice(subscribersList.indexOf(sub), 1);
	});
	// we don't publish anything before the subscribe moment
	this.ready();
});

export const Events = {
	emit(eventName, data) {
		subscribersList.forEach((subscriber) => {
			subscriber.pushEvent(eventName, data);
		});
	}
}