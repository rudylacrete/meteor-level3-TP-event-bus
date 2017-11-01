import { Meteor } from 'meteor/meteor';
import { EventEmitter } from 'events';
import * as eventConfig from '/imports/common/eventsConfiguration.js';

export const events = new EventEmitter();
EventsCollection = new Meteor.Collection(eventConfig.COLLECTION_NAME);
Meteor.subscribe(eventConfig.PUBLISH_NAME);

EventsCollection.find().observe({
	added(event) {
		events.emit(event.name, event.data);
	},
	changed(event) {
		events.emit(event.name, event.data);
	}
});