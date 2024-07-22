import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.scss';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const root = createRoot(rootElement);

root.render(<div>My App</div>);
