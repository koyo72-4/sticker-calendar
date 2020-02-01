import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { App } from '../components/App';

Enzyme.configure({ adapter: new Adapter() });

global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	observe() {
		return null;
	}
	unobserve() {
		return null;
	}
};

describe('App', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('renders a calendar', () => {
		const component = shallow(<App />);
		expect(component).toMatchSnapshot();
	});
});
