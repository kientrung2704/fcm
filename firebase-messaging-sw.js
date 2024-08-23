// Import the firebase app / messaging packages
importScripts(
	"https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Initialize app
const firebaseConfig = {
	apiKey: "AIzaSyBhOhcxWUXSnF0fuCEINU-_djE7mlwtqjg",
	authDomain: "mydio-422502.firebaseapp.com",
	projectId: "mydio-422502",
	storageBucket: "mydio-422502.appspot.com",
	messagingSenderId: "978883138230",
	appId: "1:978883138230:web:4fe952a523b2c71501cc17",
	measurementId: "G-JGBP5L91WZ",
};

// Initialize messaging
firebase.initializeApp(firebaseConfig);
class CustomPushEvent extends Event {
	constructor(data) {
		super("push");

		Object.assign(this, data);
		this.custom = true;
	}
}

self.addEventListener("push", (e) => {
	// Skip if event is our own custom event
	if (e.custom) return;

	// Kep old event data to override
	const oldData = e.data;

	// Create a new event to dispatch, pull values from notification key and put it in data key,
	// and then remove notification key
	const newEvent = new CustomPushEvent({
		data: {
			ehheh: oldData.json(),
			json() {
				const newData = oldData.json();
				newData.data = {
					...newData.data,
					...newData.notification,
				};
				delete newData.notification;
				return newData;
			},
		},
		waitUntil: e.waitUntil.bind(e),
	});

	// Stop event propagation
	e.stopImmediatePropagation();

	// Dispatch the new wrapped event
	dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

// Listen to bg messages
messaging.onBackgroundMessage((payload) => {
	console.log("Received a bg message: ", payload);

	const { title, body, icon, badge, ...restPayload } = payload.data;

	// Show notification when message received
	const notificationOptions = {
		body,
		data: restPayload,
	};

	return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
	// console.log('[firebase-messaging-sw.js] notificationclick ', event);

	// click_action described at https://github.com/BrunoS3D/firebase-messaging-sw.js#click-action
	if (event.notification.data && event.notification.data.click_action) {
		self.clients.openWindow(event.notification.data.click_action);
	} else {
		self.clients.openWindow(event.currentTarget.origin);
	}

	// close notification after click
	event.notification.close();
});
