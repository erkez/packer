import * as React from 'react';
import { render } from 'react-dom';

import './index.scss';

const rootId = 'root';
const rootElement = document.getElementById(rootId);

render(<div>My App</div>, rootElement);
