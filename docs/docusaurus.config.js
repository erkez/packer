// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Packer',
    tagline: 'Opinionated bundler configuration for React applications',
    favicon: 'img/favicon.svg',

    future: {
        v4: true
    },

    url: 'https://packer.ekz.io',
    baseUrl: '/',
    organizationName: 'erkez',
    projectName: 'packer',
    trailingSlash: false,

    onBrokenLinks: 'throw',

    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn'
        }
    },

    i18n: {
        defaultLocale: 'en',
        locales: ['en']
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    path: 'content',
                    sidebarPath: './sidebars.js',
                    routeBasePath: 'docs',
                    editUrl: 'https://github.com/erkez/packer/tree/master/docs/'
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css'
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                respectPrefersColorScheme: true
            },
            navbar: {
                title: 'Packer',
                logo: {
                    alt: 'Packer',
                    src: 'img/logo.svg'
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'docsSidebar',
                        position: 'left',
                        label: 'Docs'
                    },
                    {
                        href: 'https://github.com/erkez/packer',
                        label: 'GitHub',
                        position: 'right'
                    },
                    {
                        href: 'https://www.npmjs.com/package/@ekz/packer',
                        label: 'npm',
                        position: 'right'
                    }
                ]
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {label: 'Getting started', to: '/docs/getting-started/installation'},
                            {label: 'Vite', to: '/docs/getting-started/vite'},
                            {label: 'Migration from 0.16', to: '/docs/migration/from-0-16'}
                        ]
                    },
                    {
                        title: 'Project',
                        items: [
                            {label: 'GitHub', href: 'https://github.com/erkez/packer'},
                            {label: 'npm', href: 'https://www.npmjs.com/package/@ekz/packer'}
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Packer contributors. Built with Docusaurus.`
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['bash', 'json']
            }
        })
};

export default config;
