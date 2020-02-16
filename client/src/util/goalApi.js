import DayApi from './dayApi';

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

    async deleteGoals(goals) {
        return new DayApi().removeStars(goals)
            .then(async response => {
                await fetch('/api/goals', {
                    method: 'DELETE',
                    body: JSON.stringify({ goals }),
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(response => response.json());
            });
    }

    async updateGoals(goals) {
        return fetch('/api/goals', {
			method: 'PUT',
			body: JSON.stringify({ goals }),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
