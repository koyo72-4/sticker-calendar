import React, { useState } from 'react';

export function useFormField(initialValue) {
	const [ value, setValue ] = useState(initialValue);
	return {
		value,
		onChange: event =>
			setValue(event.target.value)
	};
}
