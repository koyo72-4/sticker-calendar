export default class DayApi {
    async getDays(year) {
        const days = fetch(`/api/days/${year}`)
            .then(response => response.json());
        return days;
    }

    async createStarDay(starDayObject) {
        return fetch('/api/days', {
			method: 'POST',
			body: JSON.stringify(starDayObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }

    async addStarToDay(starDayObject) {
        const { year, month, day, goal } = starDayObject;
        return fetch(`/api/days/${year}/${month}/${day}`, {
            method: 'PUT',
            body: JSON.stringify({ goal }),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }

    async addStars(starDayObject) {
        return fetch('/api/days/today', {
			method: 'POST',
			body: JSON.stringify(starDayObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }

    async removeStars(goals) {
        return fetch('/api/days', {
			method: 'PUT',
			body: JSON.stringify({ goals }),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
