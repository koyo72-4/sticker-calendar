export default class StarApi {
    async getStars(year) {
        return fetch(`/api/stars/year/${year}`)
            .then(response => response.json());
    }

    async createStarDay(starDayObject) {
        return fetch('/api/stars', {
			method: 'POST',
			body: JSON.stringify(starDayObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }

    async addStar(starDayObject) {
        return fetch('/api/stars/add', {
			method: 'PUT',
			body: JSON.stringify(starDayObject),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json());
    }
}
