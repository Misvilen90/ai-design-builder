// js/generator.js
import { COMPONENT_SCHEMAS } from './components.js';

export class AILayoutGenerator {
    constructor(store) {
        this.store = store;
    }

    generate(prompt) {
        const query = prompt.toLowerCase();
        let layout = [];

        if (query.includes('restaurant') || query.includes('food') || query.includes('cafe')) {
            layout = this.getRestaurantLayout();
        } else if (query.includes('agency') || query.includes('portfolio') || query.includes('creative')) {
            layout = this.getAgencyLayout();
        } else if (query.includes('pricing') || query.includes('plan')) {
            layout = this.getPricingLayout();
        } else if (query.includes('e-commerce') || query.includes('shop') || query.includes('store') || query.includes('product')) {
            layout = this.getEcommerceLayout();
        } else if (query.includes('dashboard') || query.includes('saas') || query.includes('software')) {
            layout = this.getSaaSLayout();
        } else {
            // Default elegant Landing Page layout
            layout = this.getDefaultLandingLayout();
        }

        // Parse and append additional components sequentially based on prompt keywords
        const appendQueue = [];
        
        if (query.includes('primary button') || query.includes('primary btn') || query.includes('button primary')) {
            appendQueue.push({ type: 'design-btnprimary', name: 'Primary Button', width: 180, height: 48 });
        }
        if (query.includes('secondary button') || query.includes('secondary btn') || query.includes('button secondary')) {
            appendQueue.push({ type: 'design-btnsecondary', name: 'Secondary Button', width: 180, height: 48 });
        }
        if (query.includes('cta button') || query.includes('cta btn') || query.includes('button cta') || query.includes('call to action button') || query.includes('call to action btn')) {
            appendQueue.push({ type: 'design-btncta', name: 'CTA Button', width: 200, height: 52 });
        }
        if (query.includes('icon button') || query.includes('icon btn') || query.includes('button icon')) {
            appendQueue.push({ type: 'design-btnicon', name: 'Icon Button', width: 48, height: 48 });
        }
        if (query.includes('contact form') || (query.includes('contact') && !query.includes('contact page') && !query.includes('contact nav'))) {
            appendQueue.push({ type: 'form-contact', name: 'Contact Form', width: 800, height: 260 });
        }
        if (query.includes('map') || query.includes('google map') || query.includes('location map')) {
            appendQueue.push({ type: 'media-map', name: 'Map Box', width: 800, height: 250 });
        }
        if (query.includes('chart') || query.includes('graph') || query.includes('analytics')) {
            appendQueue.push({ type: 'advanced-chart', name: 'SaaS Chart', width: 800, height: 280 });
        }
        if (query.includes('faq') || query.includes('accordion') || query.includes('collapsible')) {
            appendQueue.push({ type: 'widget-faqlist', name: 'FAQ List Accordion', width: 800, height: 320 });
        }
        if (query.includes('pricing card') || query.includes('pricing table') || (query.includes('pricing') && !query.includes('pricing page') && !query.includes('pricing layout') && !query.includes('pricing plan') && !query.includes('pricing template'))) {
            appendQueue.push({ type: 'widget-pricing', name: 'Pricing Card', width: 380, height: 360 });
        }
        if (query.includes('testimonial') || query.includes('review') || query.includes('quote testimonial')) {
            appendQueue.push({ type: 'design-testimonial', name: 'Testimonial Card', width: 800, height: 180 });
        }
        if (query.includes('team card') || query.includes('team member') || query.includes('member profile')) {
            appendQueue.push({ type: 'design-teamcard', name: 'Team Member Card', width: 340, height: 220 });
        }
        if (query.includes('video') || query.includes('player') || query.includes('video player')) {
            appendQueue.push({ type: 'media-video', name: 'Video Player', width: 800, height: 400 });
        }
        if (query.includes('input') || query.includes('text field') || query.includes('input field')) {
            appendQueue.push({ type: 'form-input', name: 'Input Field', width: 280, height: 42 });
        }
        if (query.includes('login') || query.includes('login panel') || query.includes('login form')) {
            appendQueue.push({ type: 'form-login', name: 'Login Panel', width: 350, height: 220 });
        }
        if (query.includes('stat') || query.includes('stats counter') || query.includes('counter')) {
            appendQueue.push({ type: 'widget-statscounter', name: 'Stats Counter', width: 240, height: 100 });
        }

        // Calculate starting bottom position of base template layout
        let lastBottom = 0;
        layout.forEach(compData => {
            const top = compData.position ? compData.position.top : 0;
            const height = compData.position ? compData.position.height : 140;
            if (top + height > lastBottom) {
                lastBottom = top + height;
            }
        });
        if (lastBottom === 0) {
            lastBottom = 20;
        } else {
            lastBottom += 30; // 30px gap
        }

        // Append each item dynamically
        appendQueue.forEach(item => {
            let left = 50;
            if (item.width < 800) {
                left = Math.round((800 - item.width) / 2) + 50; // center it relative to 800px frame (offset 50px)
            }
            
            layout.push({
                type: item.type,
                name: item.name,
                style: {},
                content: {},
                position: {
                    left,
                    top: lastBottom,
                    width: item.width,
                    height: item.height
                }
            });
            lastBottom += item.height + 30;
        });

        // Apply generated components to the active page
        const pageId = this.store.state.activePageId;
        const page = this.store.state.pages.find(p => p.id === pageId);
        
        if (page) {
            // Clear current page components
            page.components = [];
            
            // Add generated components with calculated positions
            layout.forEach((compData, index) => {
                const schema = COMPONENT_SCHEMAS[compData.type];
                if (!schema) {
                    console.warn(`Schema not found for type: ${compData.type}`);
                    return;
                }
                const id = `comp-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`;
                
                const newComp = {
                    id,
                    type: compData.type,
                    name: compData.name || schema.name,
                    style: { ...schema.defaultStyle, ...compData.style },
                    content: { ...schema.defaultContent, ...compData.content },
                    position: {
                        left: compData.position ? compData.position.left : 50,
                        top: compData.position ? compData.position.top : (50 + index * 180),
                        width: compData.position ? compData.position.width : 700,
                        height: compData.position ? compData.position.height : 140,
                        rotate: 0,
                        zIndex: index + 1
                    }
                };

                page.components.push(newComp);
            });

            this.store.saveHistory();
            this.store.notify();
            return true;
        }
        return false;
    }

    getRestaurantLayout() {
        return [
            {
                type: 'structure-navbar',
                name: 'Restaurant Navigation',
                style: { width: '800px', height: '70px', borderRadius: '8px' },
                content: { logo: '🍽️ Le Parisien', links: ['Home', 'Menu', 'Chef Spec', 'Reserve'] },
                position: { left: 50, top: 20, width: 800, height: 70 }
            },
            {
                type: 'design-heading',
                name: 'Hero Title',
                style: { width: '800px', fontSize: '42px', color: '#fbbf24', textAlign: 'center' },
                content: { text: 'Exquisite Fine Dining in the Heart of Paris' },
                position: { left: 50, top: 120, width: 800, height: 60 }
            },
            {
                type: 'design-text',
                name: 'Hero Subtext',
                style: { width: '700px', fontSize: '15px', color: 'var(--text-muted)', textAlign: 'center' },
                content: { text: 'Experience Michelin-star gastronomy curated by Chef Jean-Luc, featuring seasonal organic truffles, slow-roasted French duck, and artisan estate wines.' },
                position: { left: 100, top: 190, width: 700, height: 70 }
            },
            {
                type: 'design-button',
                name: 'Reserve Button',
                style: { width: '200px', height: '45px', backgroundColor: '#fbbf24', color: '#000000', borderRadius: '6px' },
                content: { text: 'Book Table Online' },
                position: { left: 350, top: 270, width: 200, height: 45 }
            },
            {
                type: 'gallery-grid',
                name: 'Menu Showcase',
                style: { width: '800px' },
                content: {
                    title: 'Our Signature French Dishes',
                    images: [
                        'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80', // ribeye
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80', // steak
                        'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300&q=80'  // lamb
                    ]
                },
                position: { left: 50, top: 340, width: 800, height: 180 }
            },
            {
                type: 'form-contact',
                name: 'Reservation Form',
                style: { width: '800px', backgroundColor: 'rgba(251,191,36,0.03)', borderColor: '#fbbf24' },
                content: { title: 'Online Wine & Dinner Reservation', btnText: 'Submit Inquiry' },
                position: { left: 50, top: 550, width: 800, height: 260 }
            },
            {
                type: 'structure-copyright',
                name: 'Footer License',
                style: { width: '800px', textAlign: 'center' },
                content: { text: '© 2026 Le Parisien Bistro. Michelin Guide Certified.' },
                position: { left: 50, top: 840, width: 800, height: 40 }
            }
        ];
    }

    getAgencyLayout() {
        return [
            {
                type: 'structure-navbar',
                name: 'Agency Menu',
                style: { width: '800px', height: '70px', borderRadius: '8px' },
                content: { logo: '🎨 VORTEX DESIGN', links: ['Work', 'Services', 'Pricing', 'Inquire'] },
                position: { left: 50, top: 20, width: 800, height: 70 }
            },
            {
                type: 'layout-herosplit',
                name: 'Agency Hero Split',
                style: { width: '800px' },
                content: {
                    title: 'Bespoke Digital Products built for SaaS Teams',
                    subtitle: 'We blend modern layout snapping mechanics, interactive Figma parameters, and Elementor component flexibility to ship premium responsive web apps.',
                    btn1: 'View Our Works',
                    btn2: 'Schedule Call',
                    imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80'
                },
                position: { left: 50, top: 110, width: 800, height: 260 }
            },
            {
                type: 'advanced-projectcard',
                name: 'Showcase Project Left',
                style: { width: '380px' },
                content: {
                    title: 'Cloud Analytics Console Layout',
                    client: 'Astra Inc',
                    tag: 'Fintech Portal',
                    btnText: 'View Case Study',
                    imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80'
                },
                position: { left: 50, top: 395, width: 380, height: 300 }
            },
            {
                type: 'advanced-projectcard',
                name: 'Showcase Project Right',
                style: { width: '380px' },
                content: {
                    title: 'Decentralized Wallet Client UI',
                    client: 'Nexus Labs',
                    tag: 'Web3 App',
                    btnText: 'Explore System',
                    imgUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80'
                },
                position: { left: 470, top: 395, width: 380, height: 300 }
            },
            {
                type: 'design-testimonial',
                name: 'Alex Quote Testimonial',
                style: { width: '420px' },
                content: {
                    quote: 'Vortex delivered a modular SaaS platform in weeks instead of months. The Snappable UI coordinates system let us preview exact specs prior to coding.',
                    name: 'Sarah Peterson',
                    company: 'Ops Flow Corp',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80'
                },
                position: { left: 50, top: 715, width: 420, height: 220 }
            },
            {
                type: 'design-teamcard',
                name: 'Leader Member Profile',
                style: { width: '340px' },
                content: {
                    name: 'Sarah Jenkins',
                    role: 'Lead UX Architect',
                    bio: 'Ex-Figma and Wix core developer designing modular absolute snapping engines.',
                    imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80'
                },
                position: { left: 510, top: 715, width: 340, height: 220 }
            },
            {
                type: 'structure-footer',
                name: 'Agency Footer',
                style: { width: '800px', borderRadius: '8px' },
                content: { logo: 'Vortex Design', links: ['Case Studies', 'Agency Team', 'Inquire'] },
                position: { left: 50, top: 965, width: 800, height: 100 }
            }
        ];
    }

    getPricingLayout() {
        return [
            {
                type: 'design-heading',
                name: 'Pricing Heading',
                style: { width: '800px', fontSize: '32px', textAlign: 'center', color: 'var(--text-main)' },
                content: { text: 'Predictable Pricing Plans for Teams' },
                position: { left: 50, top: 20, width: 800, height: 50 }
            },
            {
                type: 'widget-pricing',
                name: 'Free Tier',
                style: { width: '380px', height: '360px', borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' },
                content: { plan: 'Starter Pack', price: '$0', period: '/ forever', features: ['Up to 5 Pages CRUD', 'Basic HTML Exporter', 'WordPress Style Library'] },
                position: { left: 50, top: 90, width: 380, height: 360 }
            },
            {
                type: 'widget-pricing',
                name: 'Pro Tier',
                style: { width: '380px', height: '360px', borderColor: 'var(--primary)', boxShadow: '0 0 20px rgba(99,102,241,0.25)' },
                content: { plan: 'Studio Master', price: '$79', period: '/ month', features: ['Unlimited Pages & Canva Canvas', 'React & Tailwind Exporters', 'Figma Sync Integrations'] },
                position: { left: 470, top: 90, width: 380, height: 360 }
            },
            {
                type: 'widget-progress',
                name: 'Server Load Widget',
                style: { width: '800px' },
                content: { label: 'Active Developer Licence Registrations', percent: 92 },
                position: { left: 50, top: 480, width: 800, height: 60 }
            }
        ];
    }

    getEcommerceLayout() {
        return [
            {
                type: 'structure-navbar',
                name: 'Store Nav',
                style: { width: '800px', height: '70px', borderRadius: '8px' },
                content: { logo: '🛒 SaaS Hardware', links: ['Shop All', 'Cart', 'Tracking', 'Support'] },
                position: { left: 50, top: 20, width: 800, height: 70 }
            },
            {
                type: 'advanced-shopgrid',
                name: 'Featured Products',
                style: { width: '500px' },
                content: { title: 'Hottest Developer Gear' },
                position: { left: 50, top: 110, width: 500, height: 380 }
            },
            {
                type: 'advanced-cart',
                name: 'Shopping Cart',
                style: { width: '280px', height: '240px' },
                content: { title: 'Checkout Bag' },
                position: { left: 570, top: 110, width: 280, height: 240 }
            },
            {
                type: 'design-alert',
                name: 'Promo Alert',
                style: { width: '800px', backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.3)' },
                content: { text: '🎉 Summer Discount: Use code AIEXPORTS at checkout for 20% off all developer subscriptions.' },
                position: { left: 50, top: 510, width: 800, height: 50 }
            }
        ];
    }

    getSaaSLayout() {
        return [
            {
                type: 'structure-navbar',
                name: 'SaaS Navigation',
                style: { width: '800px', height: '70px', borderRadius: '8px' },
                content: { logo: '⚡ Genovax SaaS', links: ['Features', 'API Dev', 'Integrations', 'Console'] },
                position: { left: 50, top: 20, width: 800, height: 70 }
            },
            {
                type: 'layout-herosplit',
                name: 'SaaS Product Hero',
                style: { width: '800px' },
                content: {
                    title: 'The Unified AI Layout compiler sandbox',
                    subtitle: 'Track metrics, manage layers stack ordering, toggle light/dark theme models, and generate production templates with ease.',
                    btn1: 'Start Testing',
                    btn2: 'API Docs',
                    imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80'
                },
                position: { left: 50, top: 110, width: 800, height: 260 }
            },
            {
                type: 'advanced-datagrid',
                name: 'Users Data Grid',
                style: { width: '800px' },
                content: { title: 'Active Tenant Subscriptions status' },
                position: { left: 50, top: 395, width: 800, height: 260 }
            },
            {
                type: 'widget-faqlist',
                name: 'Product Accordion FAQ',
                style: { width: '800px' },
                content: { title: 'Frequently Asked Questions & Support' },
                position: { left: 50, top: 675, width: 800, height: 320 }
            },
            {
                type: 'structure-copyright',
                name: 'Copyright',
                style: { width: '800px', textAlign: 'center' },
                position: { left: 50, top: 1015, width: 800, height: 40 }
            }
        ];
    }

    getDefaultLandingLayout() {
        return [
            {
                type: 'structure-alertbar',
                name: 'Promo Alert Bar',
                style: { width: '800px', height: '40px' },
                content: { text: '🚀 GenovaX v3.0 beta is active! Double click elements to edit inline.' },
                position: { left: 50, top: 20, width: 800, height: 40 }
            },
            {
                type: 'structure-navbar',
                name: 'Landing Nav',
                style: { width: '800px', height: '70px', borderRadius: '8px' },
                content: { logo: '🤖 GenovaX', links: ['Home', 'Workspace', 'Export Docs'] },
                position: { left: 50, top: 75, width: 800, height: 70 }
            },
            {
                type: 'layout-herosplit',
                name: 'Landing Split Hero',
                style: { width: '800px' },
                content: {
                    title: 'Create Responsive UI Layouts in Real-time',
                    subtitle: 'Describe what you want using simple sentences. The prompt compiler will generate layout components like cards, progress bars, price charts, alerts, and navigation links. Modify styles instantly in the properties selector panel.',
                    btn1: 'Explore Canva',
                    btn2: 'Load Samples',
                    imgUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80'
                },
                position: { left: 50, top: 165, width: 800, height: 260 }
            },
            {
                type: 'design-testimonial',
                name: 'Customer Quote Testimonial',
                style: { width: '800px' },
                content: {
                    quote: 'We compiled our landing layouts using this generator and copied the Tailwind HTML output direct to our React app. It saved us days of manual positioning.',
                    name: 'Alexander Sterling',
                    company: 'Fintech Lab Group',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80'
                },
                position: { left: 50, top: 450, width: 800, height: 180 }
            },
            {
                type: 'widget-faqlist',
                name: 'Landing FAQ Accordion',
                style: { width: '800px' },
                content: { title: 'Product Features FAQ' },
                position: { left: 50, top: 650, width: 800, height: 320 }
            },
            {
                type: 'structure-footer',
                name: 'Footer Navigation',
                style: { width: '800px', borderRadius: '8px' },
                content: { logo: 'GenovaX', links: ['Home', 'Templates', 'Export Center'] },
                position: { left: 50, top: 990, width: 800, height: 100 }
            }
        ];
    }
}
