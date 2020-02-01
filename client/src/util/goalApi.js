export default class GoalApi {
    async getGoals() {
        return fetch('/api/goals')
            .then(response => response.json());
    }

    async createGoal(goalObject) {
        return fetch('/api/goals', {
			method: 'POST',
			body: JSON.stringify(goalObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
