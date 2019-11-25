import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';

it('renders without crashing', () => {
	global.IntersectionObserver = class IntersectionObserver {
		constructor() {}

		observe() {
			return null;
		}

		unobserve() {
			return null;
		}
	};

	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
