import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const features = [
    {
        title: 'Minimal setup',
        description: 'One webpack.config.js and sensible defaults for React, Babel, and assets.'
    },
    {
        title: 'ESLint 10 flat config',
        description: 'Shared recommended and TypeScript overlays via @ekz/packer/recommended.'
    },
    {
        title: 'TypeScript ready',
        description: 'ts-loader, ForkTsChecker, and a shared tsconfig preset out of the box.'
    }
];

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link className={clsx('button button--secondary button--lg', styles.buttonPrimary)} to="/docs">
                        Get started
                    </Link>
                    <Link
                        className={clsx('button button--lg', styles.buttonOutline)}
                        to="/docs/migration/from-0-16">
                        Migrate from 0.16
                    </Link>
                </div>
            </div>
        </header>
    );
}

function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {features.map(({title, description}) => (
                        <div key={title} className={clsx('col col--4')}>
                            <div className="text--center padding-horiz--md padding-vert--lg">
                                <Heading as="h3">{title}</Heading>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <Layout title={siteConfig.title} description={siteConfig.tagline}>
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
