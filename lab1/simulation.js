class Simulation {
	constructor() {
		this.resources = [];
	}

	simulation() {
	}

	initializeResources() {
		const numberOfResources = Math.floor((Math.random() * 5)) + 1;

		for (let i = 1; i <= numberOfResources; i++) {
            const resource = new Resources(i);
            this.resources.push(resource);
		}
	}

	resourceAssigning() {
        
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
}
