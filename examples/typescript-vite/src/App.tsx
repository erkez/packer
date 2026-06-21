import { useState } from 'react';

import logoUrl from '@root/assets/logo.svg';

import './App.scss';

export function App() {
    const [count, setCount] = useState(0);

    return (
        <main className="app">
            <img className="app__logo" src={logoUrl} alt="" width={48} height={48} />
            <h1 className="app__title">Packer Vite example</h1>
            <p className="app__hint">
                React, TypeScript, SCSS, static assets, ESLint, and Vite alpha support.
            </p>
            <button
                className="app__button"
                type="button"
                onClick={() => setCount((value) => value + 1)}>
                Count: {count}
            </button>
        </main>
    );
}
