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

    async addStar(starDayObject) {
        const { year, month, day, goal } = starDayObject;
        return fetch(`/api/days/${year}/${month}/${day}`, {
            method: 'POST',
            body: JSON.stringify({ goal }),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
