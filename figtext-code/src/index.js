import PanelComponent from './panel.vue';

export default {
    id: 'figtext-code',
    name: 'Figma Component Manager',
    icon: 'box',
    description: 'Manage Figma components in Directus',
    component: PanelComponent,
    options: [
        {
            field: 'showAdmin',
            name: 'Show Admin Interface',
            type: 'boolean',
            meta: {
                interface: 'boolean',
                width: 'half',
            },
        },
    ],
    minWidth: 12,
    minHeight: 8,
};