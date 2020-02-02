export default class DayApi {
    async getDays(year) {
        const days = fetch(`/api/days/${year}`)
            .then(response => response.json());
        return days;
    }

    async createStar(starDayObject) {
        return fetch('/api/days', {
			method: 'POST',
			body: JSON.stringify(starDayObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
