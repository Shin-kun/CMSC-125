var delayed = (function() {
	var queue = [];
  
	function processQueue() {
	  if (queue.length > 0) {
		setTimeout(function () {
		  queue.shift().cb();
		  processQueue();
		}, queue[0].delay);
	  }
	}
  
	return function delayed(delay, cb) {
	  queue.push({ delay: delay, cb: cb });
  
	  if (queue.length === 1) {
		processQueue();
	  }
	};
  }());

/**** DELAY FUNCTION *****/

class Simulation {
	constructor() {
		this.users = [];
		this.resources = [];
	}

	simulation() {
		this.initializeResources();
		this.initializeUsers();
		this.resourceAssigning();
		this.start();
		this.done();
	}

	initializeUsers() {
		const numberOfUsers = Math.floor((Math.random() * 5)) + 1;

		for (let userId = 1; userId <= numberOfUsers; userId++) {
			const newUser = new User(userId);
			this.users.push(newUser);
		}
	}

	initializeResources() {
		const numberOfResources = Math.floor((Math.random() * 5)) + 1;

		for (let resourceId = 1; resourceId <= numberOfResources; resourceId++) {
			this.resources.push(resourceId);
		}
	}

	resourceAssigning() {
		const resourcesAvailable = this.resources.length;
		const assignedResources = this.getResources;

		this.users.forEach(user => {
			const numberOfResourcesAssigned = Math.floor((Math.random() * resourcesAvailable)) + 1

			for(let resourcesId = 1; resourcesId <= numberOfResourcesAssigned;) {
				let resourceToBeAssigned = assignedResources[Math.floor((Math.random() * resourcesAvailable))];
				let currentResourcesOfUser = user.resources;

				const isResourceAlreadyAssigned = currentResourcesOfUser.find(resource => resource.id === resourceToBeAssigned)

				if (isResourceAlreadyAssigned === undefined) {
					const newResource = new Resources(resourceToBeAssigned);
					currentResourcesOfUser.push(newResource);
					resourcesId++;
				}
			}

			user.resources.sort((firstResource, secondResource) => {
				return firstResource.id - secondResource.id;
			});
		});
	}

	start() {

		for(let userIndex=0; userIndex < this.users.length; userIndex++) {
			const currentUser = this.users[userIndex];
			let currentResources = currentUser.resources;
			
			delayed(1000, function(userId) {
				return function() {
					console.log('user ' + userId);
					document.getElementById('current-user-status').innerHTML = 'User ' + userId;
				};
			}(currentUser.id));
		
			this.jobExecution(currentResources, currentUser.id);
			this.printFinishedUsers(currentUser.id);
		}
	}

	done() {
		delayed(1000, function() {
			return function() {
				document.getElementById('current-user-status').innerHTML = '';
				document.getElementById('resource-status').innerHTML = 'Finished';					
			};
		}());
	}

	printFinishedUsers(userId) {
		delayed(1000, function(userId) {
			return function() {
				let userFinishedListNode = document.createElement('LI');
				let userNode = document.createTextNode('USER: ' + userId);

				userFinishedListNode.appendChild(userNode)
				document.getElementById('finished-users-list').appendChild(userFinishedListNode);
			};
		}(userId));
	}

	jobExecution(currentResources, userId) {
		for(let resourceIndex=0; resourceIndex < currentResources.length; resourceIndex++) {
			const currentResource = currentResources[resourceIndex];
			const simulation = this;

			let isDisplayOnce = true;

			while(currentResource.time > 0) {

				delayed(1000, function(resourceId, time, userId,isDisplayOnce) {
					return function() {
						console.log('resource ' + resourceId + ': ' + time + ' secs remaining');
						document.getElementById('resource-status').innerHTML = 'Resource ' + resourceId + ': ' + time + ' secs remaining';					
						simulation.putUsersOnWaitingListIfSameResource(resourceId, userId, isDisplayOnce);
					};
				}(currentResource.id, currentResource.time, userId, isDisplayOnce));

				isDisplayOnce = false;
				currentResource.decrementResource();
			}
			this.afterResourceIsFinishedCallRemoveChildren();
		}
	}

	afterResourceIsFinishedCallRemoveChildren() {
		const simulation = this;

		delayed(1000, function() {
			return function() {
				simulation.removeWaitingListChildren(); 
			};
		}());
	}

	removeWaitingListChildren() {
		const waitingList = document.getElementById('waiting-users-list');
		while (waitingList.firstChild) {
			waitingList.removeChild(waitingList.firstChild);
		}
	}

	putUsersOnWaitingListIfSameResource(resourceId, userId, isDisplayOnce) {
		if (isDisplayOnce) {
			document.getElementById('waiting-resource').innerHTML = 'Resource ' + resourceId;

			for(let i=userId; i < this.users.length; i++) {
				const resourceFound = this.users[i].resources.find(
					(resource) => {
						return resource.id === resourceId;
					});

				if(resourceFound) {
					let userWaitingListNode = document.createElement('LI');
					let userNode = document.createTextNode('USER: ' + this.users[i].id);
	
					userWaitingListNode.appendChild(userNode);
					document.getElementById('waiting-users-list').appendChild(userWaitingListNode);
				}
			}
		}
	}

	get getUsers() {
		return this.users;
	}

	get getResources() {
		return this.resources;
	}
}
