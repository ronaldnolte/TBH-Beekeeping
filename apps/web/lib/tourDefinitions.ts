import { TourStep } from '../components/Tour';

export const apiarySelectionTour: TourStep[] = [
    {
        target: '#apiary-select-dropdown',
        title: 'Welcome to TBH Beekeeper! 🐝',
        content: 'This is your apiary selection screen. Let me show you around!',
        placement: 'bottom',
    },
    {
        target: '#apiary-select-dropdown',
        title: 'Select an Apiary',
        content: 'Use this dropdown to choose which apiary (bee location) you want to manage. Each apiary can have multiple hives.',
        placement: 'bottom',
    },
    {
        target: '#manage-apiaries-button',
        title: 'Manage Your Apiaries',
        content: 'Click here to create, edit, or delete apiaries. You can have as many locations as you need!',
        placement: 'bottom',
    },
    {
        target: '#task-list-section',
        title: 'Your Upcoming Tasks',
        content: 'This shows all your pending beekeeping tasks across all hives. Stay organized and never miss important activities!',
        placement: 'top',
    },
    {
        target: '#add-task-button',
        title: 'Create New Tasks',
        content: 'Click the "+ New Task" button to add reminders for feeding, treatments, inspections, or any beekeeping activity.',
        placement: 'left',
    },
    {
        target: '#help-link',
        title: 'Need More Help?',
        content: 'Click "Help" in the header anytime to access the full tutorial, FAQ, and best practices guide.',
        placement: 'bottom',
    },
    {
        target: '#apiary-select-dropdown',
        title: 'Ready to Start! 🚀',
        content: 'Select an apiary from the dropdown to view its hives and start managing your bees. Happy beekeeping!',
        placement: 'bottom',
    },
];

export const loginTour: TourStep[] = [
    {
        target: '#guest-login-button',
        title: 'Try It Out! 👤',
        content: 'Click "Continue as Guest" to explore the app with pre-loaded demo data. Perfect for testing features!',
        placement: 'top',
    },
    {
        target: '#help-tutorial-link',
        title: 'New to Beekeeping Apps? 📚',
        content: 'Click "Need help? View Tutorial" to see a comprehensive guide on how to use all features.',
        placement: 'top',
    },
];

export const apiaryDetailTour: TourStep[] = [
    {
        target: '#add-hive-button',
        title: 'Add Your First Hive 🏠',
        content: 'Click here to add a new Top Bar Hive to this apiary. You can track as many hives as you manage!',
        placement: 'bottom',
    },
    {
        target: '#weather-widget',
        title: 'Weather Forecast ⛅',
        content: 'Check the 7-day weather forecast to plan your inspections. Ideal inspection conditions are shown in green!',
        placement: 'left',
    },
    {
        target: '#hive-list',
        title: 'Your Hives',
        content: 'This shows all hives in this apiary. Click on any hive to view details, inspections, and history.',
        placement: 'top',
    },
    {
        target: '#back-button',
        title: 'Navigation',
        content: 'Use the back button to return to the apiary selection screen anytime.',
        placement: 'right',
    },
];

export const hiveDetailTour: TourStep[] = [
    {
        target: '#new-inspection-button',
        title: 'Record an Inspection 🔍',
        content: 'Click here to log your hive inspection. Record brood pattern, honey stores, queen sightings, and more!',
        placement: 'bottom',
    },
    {
        target: '#hive-snapshots',
        title: 'Bar-by-Bar Tracking',
        content: 'View and manage individual bars in your Top Bar Hive. Track which bars have brood, honey, or are empty.',
        placement: 'top',
    },
    {
        target: '#inspection-history',
        title: 'Inspection History',
        content: 'See all past inspections with dates and notes. Spot trends and track hive health over time.',
        placement: 'top',
    },
    {
        target: '#interventions-tab',
        title: 'Track Treatments 💊',
        content: 'Log treatments, feeding, and hive modifications here. Keep a complete record of interventions.',
        placement: 'bottom',
    },
    {
        target: '#tasks-tab',
        title: 'Hive-Specific Tasks ✅',
        content: 'Create tasks specific to this hive, like "Check for swarm cells" or "Add honey super".',
        placement: 'bottom',
    },
];
