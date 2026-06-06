// js/components.js

export const COMPONENT_CATEGORIES = {
    layout: { name: 'Layout Components', icon: '📐' },
    design: { name: 'Design Components', icon: '🎨' },
    structure: { name: 'Structure Components', icon: '📏' },
    effects: { name: 'Effects Components', icon: '✨' },
    media: { name: 'Media Components', icon: '📁' },
    form: { name: 'Form Components', icon: '📝' },
    widgets: { name: 'Widgets Components', icon: '🧩' },
    gallery: { name: 'Gallery Components', icon: '🖼' },
    advanced: { name: 'Advanced Components', icon: '⚙' }
};

export const COMPONENT_SCHEMAS = {
    // 1. LAYOUT COMPONENTS
    'layout-container': {
        name: 'Container',
        category: 'layout',
        icon: '📐',
        defaultStyle: {
            width: '100%',
            height: '250px',
            padding: '24px',
            margin: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: 'var(--border-color)',
            borderRadius: '12px'
        },
        defaultContent: {
            html: '<div class="builder-placeholder" style="color: var(--text-muted); display:flex; align-items:center; justify-content:center; height:100%; border-radius:8px;">💡 Container. Double click to add content or drag elements.</div>'
        }
    },
    'layout-section': {
        name: 'Section',
        category: 'layout',
        icon: '🧱',
        defaultStyle: {
            width: '100%',
            height: '350px',
            padding: '60px 40px',
            margin: '0px',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            borderRadius: '16px'
        },
        defaultContent: {
            html: '<div class="builder-placeholder" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted);">🧱 Page Section Frame. Drag design or content items inside.</div>'
        }
    },
    'layout-grid': {
        name: 'Grid (3 Cols)',
        category: 'layout',
        icon: '🎛️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '16px',
            margin: '0px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            html: `
            <div class="grid-layout" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width:100%;">
                <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 20px; text-align: center; color: var(--text-muted);">Col 1</div>
                <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 20px; text-align: center; color: var(--text-muted);">Col 2</div>
                <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 20px; text-align: center; color: var(--text-muted);">Col 3</div>
            </div>`
        }
    },
    'layout-row': {
        name: 'Row',
        category: 'layout',
        icon: '↔️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '12px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            html: '<div style="display: flex; gap: 15px; width: 100%;"><div style="flex:1; border: 1px dashed var(--border-color); padding: 15px; text-align:center; color:var(--text-muted);">Row Left</div><div style="flex:1; border: 1px dashed var(--border-color); padding: 15px; text-align:center; color:var(--text-muted);">Row Right</div></div>'
        }
    },
    'layout-column': {
        name: 'Column',
        category: 'layout',
        icon: '↕️',
        defaultStyle: {
            width: '250px',
            height: 'auto',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            html: '<div style="text-align: center; color: var(--text-muted);">Column Item</div>'
        }
    },
    'layout-spacer': {
        name: 'Spacer',
        category: 'layout',
        icon: '↔️',
        defaultStyle: {
            width: '100%',
            height: '50px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            html: '<div style="border-top: 1px dashed rgba(255,255,255,0.08); width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.2); font-size:12px;">Spacer (50px)</div>'
        }
    },
    'layout-divider': {
        name: 'Divider',
        category: 'layout',
        icon: '➖',
        defaultStyle: {
            width: '100%',
            height: '10px',
            padding: '0px',
            margin: '15px 0px'
        },
        defaultContent: {
            html: '<hr style="border: 0; border-top: 2px solid var(--border-color); opacity: 0.5; width: 100%;">'
        }
    },

    // 2. DESIGN COMPONENTS
    'design-heading': {
        name: 'Heading',
        category: 'design',
        icon: '🔠',
        defaultStyle: {
            width: '450px',
            height: 'auto',
            padding: '0px',
            margin: '0px',
            color: 'var(--text-main)',
            fontSize: '36px',
            fontWeight: '800',
            textAlign: 'left'
        },
        defaultContent: {
            text: 'Visual GenovaX'
        }
    },
    'design-text': {
        name: 'Paragraph Text',
        category: 'design',
        icon: '📝',
        defaultStyle: {
            width: '500px',
            height: 'auto',
            padding: '0px',
            color: 'var(--text-muted)',
            fontSize: '16px',
            lineHeight: '1.6',
            textAlign: 'left'
        },
        defaultContent: {
            text: 'Generate and configure responsive layouts with a visual Canva board or structured WordPress blocks. Export production-ready code in HTML/CSS, React, Tailwind, and layout JSON schemas.'
        }
    },
    'design-button': {
        name: 'Button',
        category: 'design',
        icon: '🖲️',
        defaultStyle: {
            width: '180px',
            height: '48px',
            padding: '0px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: '30px',
            borderStyle: 'none',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
        },
        defaultContent: {
            text: 'Get Started Free'
        }
    },
    'design-btnprimary': {
        name: 'Primary Button',
        category: 'design',
        icon: '🔵',
        defaultStyle: {
            width: '180px',
            height: '48px',
            padding: '0px',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            borderRadius: '8px',
            borderStyle: 'none',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
        },
        defaultContent: {
            text: 'Primary Action'
        }
    },
    'design-btnsecondary': {
        name: 'Secondary Button',
        category: 'design',
        icon: '⚪',
        defaultStyle: {
            width: '180px',
            height: '48px',
            padding: '0px',
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
            borderRadius: '8px',
            borderStyle: 'solid',
            borderWidth: '1.5px',
            borderColor: 'var(--border-color)',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
        },
        defaultContent: {
            text: 'Secondary Action'
        }
    },
    'design-btncta': {
        name: 'CTA Button',
        category: 'design',
        icon: '✨',
        defaultStyle: {
            width: '200px',
            height: '52px',
            padding: '0px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: '#ffffff',
            borderRadius: '30px',
            borderStyle: 'none',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.45)'
        },
        defaultContent: {
            text: 'Claim Offer Now'
        }
    },
    'design-btnicon': {
        name: 'Icon Button',
        category: 'design',
        icon: '⚡',
        defaultStyle: {
            width: '48px',
            height: '48px',
            padding: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-main)',
            borderRadius: '50%',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center'
        },
        defaultContent: {
            text: '⚡'
        }
    },
    'design-card': {
        name: 'Feature Card',
        category: 'design',
        icon: '🎴',
        defaultStyle: {
            width: '320px',
            height: 'auto',
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'SaaS Grid Exporter',
            desc: 'Export component groups directly to modular React functional files or responsive CSS stylesheets.',
            icon: '⚡'
        }
    },
    'design-badge': {
        name: 'Badge',
        category: 'design',
        icon: '🏷️',
        defaultStyle: {
            width: '100px',
            height: '28px',
            padding: '0px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary)',
            borderRadius: '20px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '700',
            textAlign: 'center'
        },
        defaultContent: {
            text: 'PRO VERSION'
        }
    },
    'design-alert': {
        name: 'Alert Block',
        category: 'design',
        icon: '⚠️',
        defaultStyle: {
            width: '550px',
            height: 'auto',
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: '8px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            fontSize: '14px'
        },
        defaultContent: {
            text: 'Attention: You have unsaved layout components in the Canva Editor. Click Generate or save page templates.'
        }
    },
    'design-textblock': {
        name: 'Text Block',
        category: 'design',
        icon: '🔤',
        defaultStyle: {
            width: '450px',
            height: 'auto',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'var(--text-main)'
        },
        defaultContent: {
            text: 'A clean block of formatted text. Ideal for callout content or detailed paragraphs.'
        }
    },
    'design-list': {
        name: 'List Component',
        category: 'design',
        icon: '📝',
        defaultStyle: {
            width: '300px',
            height: 'auto',
            padding: '12px',
            color: 'var(--text-muted)',
            fontSize: '14px',
            lineHeight: '1.8'
        },
        defaultContent: {
            items: ['✓ First dynamic checklist item', '✓ Second responsive visual item', '✓ Third Figma coordinate item']
        }
    },

    // 3. STRUCTURE COMPONENTS
    'structure-navbar': {
        name: 'Navbar',
        category: 'structure',
        icon: '🧭',
        defaultStyle: {
            width: '100%',
            height: '70px',
            padding: '0 24px',
            backgroundColor: 'var(--panel-bg)',
            borderStyle: 'solid',
            borderWidth: '0 0 1px 0',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            logo: '⚡ AI Builder',
            links: ['Home', 'Templates', 'Features', 'Pricing']
        }
    },
    'structure-megamenu': {
        name: 'Mega Menu',
        category: 'structure',
        icon: '🗺️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '20px 40px',
            backgroundColor: 'var(--card-bg)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            borderRadius: '12px'
        },
        defaultContent: {
            title: 'Solutions Grid',
            items: ['Wix Importer', 'Canva Builder', 'Figma Exporter', 'Elementor Sync', 'WordPress Engine']
        }
    },
    'structure-breadcrumb': {
        name: 'Breadcrumb',
        category: 'structure',
        icon: '🪨',
        defaultStyle: {
            width: '350px',
            height: 'auto',
            padding: '8px 12px',
            fontSize: '14px',
            color: 'var(--text-muted)'
        },
        defaultContent: {
            items: ['Dashboard', 'Projects', 'GenovaX', 'Canvas']
        }
    },
    'structure-sidebar': {
        name: 'Sidebar Menu',
        category: 'structure',
        icon: '📋',
        defaultStyle: {
            width: '240px',
            height: '400px',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderStyle: 'solid',
            borderWidth: '0 1px 0 0',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Project Files',
            links: ['📊 Overview', '⚙️ Settings', '🖼️ Media Library', '📂 Export Center']
        }
    },
    'structure-footer': {
        name: 'Standard Footer',
        category: 'structure',
        icon: '🪜',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '40px 24px',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-muted)'
        },
        defaultContent: {
            logo: 'GenovaX',
            links: ['Privacy Policy', 'Terms of Service', 'Affiliate API']
        }
    },
    'structure-socials': {
        name: 'Social Icons',
        category: 'structure',
        icon: '🌐',
        defaultStyle: {
            width: '250px',
            height: 'auto',
            padding: '10px 0',
            textAlign: 'center'
        },
        defaultContent: {
            platforms: ['𝕏', 'GitHub', 'LinkedIn', 'YouTube']
        }
    },
    'structure-copyright': {
        name: 'Copyright Block',
        category: 'structure',
        icon: '©️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '12px 0',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px'
        },
        defaultContent: {
            text: '© 2026 GenovaX Inc. All rights reserved globally.'
        }
    },

    // 4. EFFECTS COMPONENTS
    'effects-glass': {
        name: 'Glass Panel',
        category: 'effects',
        icon: '🧊',
        defaultStyle: {
            width: '340px',
            height: '220px',
            padding: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)'
        },
        defaultContent: {
            html: '<div style="color:var(--text-main); font-weight:700; margin-bottom:8px;">Glassmorphism Card</div><p style="color:var(--text-muted); font-size:14px; margin:0;">Beautiful frosted glass texture using backdrop-filter blur parameters.</p>'
        }
    },
    'effects-glowbox': {
        name: 'Glow Shadow Box',
        category: 'effects',
        icon: '✨',
        defaultStyle: {
            width: '320px',
            height: '180px',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--primary)',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.45)'
        },
        defaultContent: {
            html: '<div style="color:#ffffff; font-weight:600; font-size:17px; margin-bottom:10px;">✨ Neon Box Wrapper</div><p style="color:var(--text-muted); font-size:13px; margin:0;">Active neon border shadows to emphasize callouts or badges.</p>'
        }
    },
    'effects-neontext': {
        name: 'Neon Text',
        category: 'effects',
        icon: '💡',
        defaultStyle: {
            width: '400px',
            height: 'auto',
            padding: '10px',
            fontSize: '32px',
            fontWeight: '900',
            color: '#a855f7',
            textAlign: 'center',
            textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7'
        },
        defaultContent: {
            text: 'AI POWERED UI'
        }
    },

    // 5. MEDIA COMPONENTS
    'media-image': {
        name: 'Image',
        category: 'media',
        icon: '🖼️',
        defaultStyle: {
            width: '400px',
            height: '240px',
            borderRadius: '12px',
            borderStyle: 'none'
        },
        defaultContent: {
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
            alt: 'Abstract Design UI background'
        }
    },
    'media-video': {
        name: 'Video Player',
        category: 'media',
        icon: '🎥',
        defaultStyle: {
            width: '500px',
            height: '280px',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            backgroundColor: '#000000'
        },
        defaultContent: {
            src: 'https://www.w3schools.com/html/mov_bbb.mp4',
            poster: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60'
        }
    },
    'media-slider': {
        name: 'Media Slider',
        category: 'media',
        icon: '🛝',
        defaultStyle: {
            width: '100%',
            height: '300px',
            borderRadius: '16px',
            backgroundColor: 'var(--card-bg)'
        },
        defaultContent: {
            title: 'Slider Header',
            desc: 'Interactive slides list description.'
        }
    },

    // 6. FORM COMPONENTS
    'form-input': {
        name: 'Input Field',
        category: 'form',
        icon: '📥',
        defaultStyle: {
            width: '280px',
            height: '42px',
            padding: '0 12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            borderRadius: '8px',
            fontSize: '14px'
        },
        defaultContent: {
            placeholder: 'Enter your name...',
            label: 'Full Name'
        }
    },
    'form-textarea': {
        name: 'Textarea Field',
        category: 'form',
        icon: '📝',
        defaultStyle: {
            width: '320px',
            height: '100px',
            padding: '10px 12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'var(--text-main)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            borderRadius: '8px',
            fontSize: '14px'
        },
        defaultContent: {
            placeholder: 'Write message...',
            label: 'Message'
        }
    },
    'form-checkbox': {
        name: 'Checkbox Option',
        category: 'form',
        icon: '☑️',
        defaultStyle: {
            width: '240px',
            height: 'auto',
            fontSize: '14px',
            color: 'var(--text-main)'
        },
        defaultContent: {
            label: 'Accept Figma User Terms'
        }
    },
    'form-dropdown': {
        name: 'Dropdown Select',
        category: 'form',
        icon: '🔽',
        defaultStyle: {
            width: '220px',
            height: '40px',
            padding: '0 8px',
            backgroundColor: 'var(--card-bg)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-main)'
        },
        defaultContent: {
            label: 'Choose Exporter Mode',
            options: ['React Code', 'Tailwind CSS', 'HTML Framework']
        }
    },
    'form-contact': {
        name: 'Contact Form',
        category: 'form',
        icon: '📨',
        defaultStyle: {
            width: '400px',
            height: 'auto',
            padding: '30px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Contact Support',
            btnText: 'Send Message'
        }
    },

    // 7. WIDGETS COMPONENTS
    'widget-accordion': {
        name: 'Accordion',
        category: 'widgets',
        icon: '🪗',
        defaultStyle: {
            width: '450px',
            height: 'auto',
            padding: '12px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            title: 'How does AI Generation work?',
            content: 'The prompt compiler keyword engine generates structured design objects that populate the canvas viewport.'
        }
    },
    'widget-tabs': {
        name: 'Tabs Component',
        category: 'widgets',
        icon: '📑',
        defaultStyle: {
            width: '500px',
            height: 'auto',
            padding: '16px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '8px'
        },
        defaultContent: {
            tabs: ['Canvas Mode', 'Figma Sync', 'Elementor Sync'],
            content: 'Active Canva coordinate boards loaded.'
        }
    },
    'widget-pricing': {
        name: 'Pricing Table',
        category: 'widgets',
        icon: '💳',
        defaultStyle: {
            width: '320px',
            height: 'auto',
            padding: '30px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--primary)',
            textAlign: 'center'
        },
        defaultContent: {
            plan: 'Premium Pro',
            price: '$49',
            period: '/ month',
            features: ['Unlimited AI Generation', 'Figma Component Sync', 'Export React & Tailwind']
        }
    },
    'widget-progress': {
        name: 'Progress Bar',
        category: 'widgets',
        icon: '📈',
        defaultStyle: {
            width: '400px',
            height: 'auto',
            padding: '8px'
        },
        defaultContent: {
            label: 'Layout Construction Complete',
            percent: 85
        }
    },
    'widget-timeline': {
        name: 'Timeline',
        category: 'widgets',
        icon: '⏳',
        defaultStyle: {
            width: '450px',
            height: 'auto',
            padding: '15px'
        },
        defaultContent: {
            steps: [
                { title: 'Project Genesis', desc: 'Concept created to bridge canvas tools and auto-code.' },
                { title: 'AI UI V2.0', desc: 'Released advanced prompt parsing and responsive templates.' }
            ]
        }
    },

    // 8. GALLERY COMPONENTS
    'gallery-grid': {
        name: 'Image Gallery',
        category: 'gallery',
        icon: '🖼️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '16px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            title: 'Visual Assets Gallery',
            images: [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=60',
                'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&q=60',
                'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=60'
            ]
        }
    },
    'gallery-carousel': {
        name: 'Carousel Slider',
        category: 'gallery',
        icon: '🎠',
        defaultStyle: {
            width: '600px',
            height: '320px',
            borderRadius: '16px',
            backgroundColor: 'var(--card-bg)'
        },
        defaultContent: {
            images: [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=60',
                'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&q=60'
            ],
            caption: 'GenovaX Canvas Assets'
        }
    },

    // 9. ADVANCED COMPONENTS
    'advanced-shopgrid': {
        name: 'Product Grid',
        category: 'advanced',
        icon: '🛍️',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '20px'
        },
        defaultContent: {
            title: 'Featured Store Items',
            products: [
                { name: 'Developer Keyboard', price: '$189', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=60' },
                { name: 'Ergonomic Mouse', price: '$89', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=60' }
            ]
        }
    },
    'advanced-cart': {
        name: 'Shopping Cart',
        category: 'advanced',
        icon: '🛒',
        defaultStyle: {
            width: '320px',
            height: 'auto',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px'
        },
        defaultContent: {
            title: 'SaaS Cart',
            items: [
                { name: 'Enterprise Licence', qty: 1, price: '$499' }
            ]
        }
    },
    'layout-split': {
        name: 'Split Section',
        category: 'layout',
        icon: '🪟',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '20px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            html: `<div style="display: flex; gap: 20px; width: 100%;">
                <div style="flex: 1; min-height: 150px; background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 20px; display:flex; align-items:center; justify-content:center; color: var(--text-muted);">Left Grid Pane</div>
                <div style="flex: 1; min-height: 150px; background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 20px; display:flex; align-items:center; justify-content:center; color: var(--text-muted);">Right Grid Pane</div>
            </div>`
        }
    },
    'design-subtitle': {
        name: 'Subheading',
        category: 'design',
        icon: '🔤',
        defaultStyle: {
            width: '400px',
            height: 'auto',
            padding: '0px',
            color: 'var(--primary)',
            fontSize: '20px',
            fontWeight: '600',
            textAlign: 'left'
        },
        defaultContent: {
            text: 'INTELLIGENT UI COMPILER'
        }
    },
    'design-quote': {
        name: 'Blockquote',
        category: 'design',
        icon: '💬',
        defaultStyle: {
            width: '500px',
            height: 'auto',
            padding: '12px 24px',
            borderStyle: 'solid',
            borderWidth: '0 0 0 4px',
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(99,102,241,0.03)',
            color: 'var(--text-muted)',
            fontSize: '15px',
            fontStyle: 'italic'
        },
        defaultContent: {
            text: 'Design is not just what it looks like and feels like. Design is how it works.',
            author: 'Steve Jobs'
        }
    },
    'structure-alertbar': {
        name: 'Top Alert Bar',
        category: 'structure',
        icon: '🚨',
        defaultStyle: {
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center'
        },
        defaultContent: {
            text: '🚀 GenovaX v3.0 beta is active! Double click elements to edit inline.'
        }
    },
    'effects-gradientcard': {
        name: 'Gradient Card',
        category: 'effects',
        icon: '🔮',
        defaultStyle: {
            width: '320px',
            height: '200px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: '16px'
        },
        defaultContent: {
            html: '<div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:8px;">Purple Aurora</div><p style="color:rgba(255,255,255,0.8); font-size:13px; margin:0; line-height:1.5;">Glow gradient overlay card. Double click to modify this HTML or styles.</p>'
        }
    },
    'media-audio': {
        name: 'Audio Player',
        category: 'media',
        icon: '🎵',
        defaultStyle: {
            width: '320px',
            height: '75px',
            padding: '16px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Lo-Fi Coding Session',
            artist: 'AI Chill Beats',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }
    },
    'media-map': {
        name: 'Map Box',
        category: 'media',
        icon: '🗺️',
        defaultStyle: {
            width: '400px',
            height: '250px',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            location: 'San Francisco, CA',
            iframeUrl: 'https://maps.google.com/maps?q=San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed'
        }
    },
    'form-toggle': {
        name: 'Toggle Switch',
        category: 'form',
        icon: '🎚️',
        defaultStyle: {
            width: '240px',
            height: 'auto',
            color: 'var(--text-main)',
            fontSize: '14px'
        },
        defaultContent: {
            label: 'Enable Dark Mode Exporter'
        }
    },
    'form-login': {
        name: 'Login Panel',
        category: 'form',
        icon: '🔑',
        defaultStyle: {
            width: '350px',
            height: 'auto',
            padding: '30px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Access Console',
            btnText: 'Authenticate'
        }
    },
    'widget-statscounter': {
        name: 'Stats Counter',
        category: 'widgets',
        icon: '📊',
        defaultStyle: {
            width: '240px',
            height: 'auto',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            textAlign: 'center'
        },
        defaultContent: {
            number: '99.9%',
            label: 'Server Uptime Success'
        }
    },
    'widget-rating': {
        name: 'Rating Stars',
        category: 'widgets',
        icon: '⭐',
        defaultStyle: {
            width: '200px',
            height: 'auto',
            padding: '10px 0',
            textAlign: 'center'
        },
        defaultContent: {
            stars: 5,
            label: '4.9/5 stars based on 1.2k reviews'
        }
    },
    'advanced-chart': {
        name: 'SaaS Chart',
        category: 'advanced',
        icon: '📈',
        defaultStyle: {
            width: '500px',
            height: '280px',
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Weekly CPU Usage Metrics',
            svgPath: 'M 10 180 Q 120 40, 240 120 T 480 20'
        }
    },
    'layout-herosplit': {
        name: 'Hero Split Layout',
        category: 'layout',
        icon: '🪟',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '40px',
            backgroundColor: 'transparent'
        },
        defaultContent: {
            title: 'Deliver Stunning Visual Layouts',
            subtitle: 'The unified visual web compiler combining Wix flexibility, Canva absolute positions, and Figma coordinates.',
            btn1: 'Explore Sandbox',
            btn2: 'Watch Demo',
            imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80'
        }
    },
    'design-teamcard': {
        name: 'Team Member Card',
        category: 'design',
        icon: '👤',
        defaultStyle: {
            width: '280px',
            height: 'auto',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
            textAlign: 'center'
        },
        defaultContent: {
            name: 'Sarah Jenkins',
            role: 'Lead UX Architect',
            bio: 'Ex-Figma and Wix core developer designing modular absolute snapping engines.',
            imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80'
        }
    },
    'widget-faqlist': {
        name: 'FAQ List Accordion',
        category: 'widgets',
        icon: '❓',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Frequently Asked Questions',
            items: [
                { q: 'How does the absolute canvas mode work?', a: 'You can drag, resize, rotate, and align elements using absolute coordinates exactly like Canva or Figma. The snaps align bounding box borders.' },
                { q: 'Can I export clean React and CSS code?', a: 'Yes! The export center translates the absolute component nodes into structured React JSX, clean Tailwind templates, and raw CSS classes.' },
                { q: 'Is it compatible with WordPress blocks?', a: 'Yes! You can toggle between Canva Absolute coordinates mode and WordPress stackable Block sections mode.' }
            ]
        }
    },
    'advanced-projectcard': {
        name: 'Project Showcase Card',
        category: 'advanced',
        icon: '📁',
        defaultStyle: {
            width: '320px',
            height: 'auto',
            padding: '16px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Developer Portal Dashboard',
            client: 'Acme Software',
            tag: 'SaaS Platform',
            btnText: 'View Case Study',
            imgUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80'
        }
    },
    'advanced-datagrid': {
        name: 'Dashboard Data Grid',
        category: 'advanced',
        icon: '🧮',
        defaultStyle: {
            width: '100%',
            height: 'auto',
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            title: 'Active Project Subscriptions',
            rows: [
                { name: 'David Miller', role: 'Vanguard Enterprise', status: 'Active' },
                { name: 'Elena Rostova', role: 'Bistro Group', status: 'Pending' },
                { name: 'Kenji Sato', role: 'Cyberpunk Portfolio', status: 'Suspended' }
            ]
        }
    },
    'design-testimonial': {
        name: 'Testimonial Card',
        category: 'design',
        icon: '💬',
        defaultStyle: {
            width: '350px',
            height: 'auto',
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'var(--border-color)'
        },
        defaultContent: {
            quote: 'This visual compiler changed the way we build SaaS interfaces. The Figma and Canva snappability speeds up design sprints by 4x!',
            name: 'Alexander Sterling',
            company: 'Fintech Lab Group',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80'
        }
    }
};

// HELPER: Convert object-styles to CSS-string
export function styleObjectToCss(styleObj) {
    if (!styleObj) return '';
    return Object.entries(styleObj)
        .map(([key, val]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${val};`;
        })
        .join(' ');
}

// RENDER: Generate component inner content HTML
export function renderComponentHTML(comp) {
    const type = comp.type;
    const content = comp.content || {};

    switch (type) {
        // LAYOUT
        case 'layout-container':
            return content.html;
        case 'layout-section':
            return content.html;
        case 'layout-grid':
            return content.html;
        case 'layout-row':
            return content.html;
        case 'layout-column':
            return `<div style="text-align: center; color: var(--text-muted);">${content.html || 'Column Frame'}</div>`;
        case 'layout-spacer':
            return content.html;
        case 'layout-divider':
            return content.html;

        // DESIGN
        case 'design-heading':
            return `<h2 class="editable-text" data-prop="text" style="margin: 0; font-size: inherit; font-weight: inherit; color: inherit; text-align: inherit;">${content.text}</h2>`;
        
        case 'design-text':
            return `<p class="editable-text" data-prop="text" style="margin: 0; font-size: inherit; color: inherit; line-height: inherit; text-align: inherit;">${content.text}</p>`;
        
        case 'design-button':
            return `<button class="editable-text" data-prop="text" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; text-align:inherit;">${content.text}</button>`;
        case 'design-btnprimary':
            return `<button class="editable-text" data-prop="text" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; text-align:inherit;">${content.text}</button>`;
        case 'design-btnsecondary':
            return `<button class="editable-text" data-prop="text" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; text-align:inherit;">${content.text}</button>`;
        case 'design-btncta':
            return `<button class="editable-text" data-prop="text" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; text-align:inherit;">${content.text}</button>`;
        case 'design-btnicon':
            return `<button class="editable-text" data-prop="text" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; text-align:inherit; display:flex; align-items:center; justify-content:center;">${content.text}</button>`;
        
        case 'design-card':
            return `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div class="editable-text" data-prop="icon" style="font-size:2rem; width:fit-content;">${content.icon}</div>
                <h3 class="editable-text" data-prop="title" style="font-size:1.2rem; font-weight:700; color:var(--text-main); margin:0;">${content.title}</h3>
                <p class="editable-text" data-prop="desc" style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; margin:0;">${content.desc}</p>
            </div>`;
        
        case 'design-badge':
            return `<div class="editable-text" data-prop="text" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:inherit; font-weight:inherit;">${content.text}</div>`;
        
        case 'design-alert':
            return `
            <div style="display:flex; gap:10px; align-items:center;">
                <span style="font-size:1.1rem;">⚠️</span>
                <span class="editable-text" data-prop="text" style="margin:0; flex:1;">${content.text}</span>
            </div>`;

        case 'design-textblock':
            return `<div class="editable-text" data-prop="text" style="width:100%; height:100%; text-align:inherit; font-size:inherit; line-height:inherit;">${content.text}</div>`;

        case 'design-list':
            return `
            <ul style="list-style:none; padding:0; margin:0; text-align:inherit;">
                ${(content.items || []).map((item, idx) => `
                    <li class="editable-text" data-prop="items-${idx}" style="margin-bottom:6px;">${item}</li>
                `).join('')}
            </ul>`;

        // STRUCTURE
        case 'structure-navbar':
            return `
            <div style="display:flex; justify-content:space-between; align-items:center; height:100%; width:100%;">
                <div class="editable-text" data-prop="logo" style="font-weight:800; font-size:1.2rem; color:var(--text-main);">${content.logo}</div>
                <div style="display:flex; gap:20px; align-items:center;">
                    ${(content.links || []).map(l => `<a href="#" style="color:var(--text-muted); text-decoration:none; font-size:14px; font-weight:500;">${l}</a>`).join('')}
                    <button style="padding:8px 16px; border:none; background:var(--primary); color:white; border-radius:6px; font-weight:600; font-size:13px; cursor:pointer;">Launch</button>
                </div>
            </div>`;
        
        case 'structure-megamenu':
            return `
            <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                <div class="editable-text" data-prop="title" style="font-weight:700; color:var(--text-main); font-size:0.95rem; text-transform:uppercase; letter-spacing:0.05em;">${content.title}</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-top:8px;">
                    ${(content.items || []).map(item => `
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <a href="#" style="color:var(--text-muted); text-decoration:none; font-size:14px; font-weight:500; padding:6px; border-radius:6px; transition:background 0.2s;">${item}</a>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        
        case 'structure-breadcrumb':
            return `
            <div style="display:flex; align-items:center; gap:8px; width:100%; font-size:inherit; color:inherit;">
                ${(content.items || []).map((b, i) => `
                    <span>${b}</span>
                    ${i < content.items.length - 1 ? '<span style="opacity:0.4;">/</span>' : ''}
                `).join('')}
            </div>`;
        
        case 'structure-sidebar':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; height:100%;">
                <div class="editable-text" data-prop="title" style="font-weight:800; font-size:1rem; color:var(--text-main); text-transform:uppercase; letter-spacing:0.05em;">${content.title}</div>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${(content.links || []).map(l => `<a href="#" style="color:var(--text-muted); text-decoration:none; font-size:14px; font-weight:500; display:block; padding:8px; border-radius:6px;">${l}</a>`).join('')}
                </div>
            </div>`;
        
        case 'structure-footer':
            return `
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:24px; align-items:center; width:100%;">
                <div class="editable-text" data-prop="logo" style="font-weight:800; font-size:1.1rem; color:var(--text-main);">${content.logo}</div>
                <div style="display:flex; gap:20px;">
                    ${(content.links || []).map(l => `<a href="#" style="color:var(--text-muted); text-decoration:none; font-size:13px;">${l}</a>`).join('')}
                </div>
            </div>`;
        
        case 'structure-socials':
            return `
            <div style="display:flex; gap:15px; justify-content:center; align-items:center; font-size:1.1rem; width:100%;">
                ${(content.platforms || []).map(p => `<a href="#" style="color:var(--text-muted); text-decoration:none; width:36px; height:36px; border-radius:50%; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.02);">${p}</a>`).join('')}
            </div>`;
        
        case 'structure-copyright':
            return `<div class="editable-text" data-prop="text" style="width:100%; text-align:center; font-size:inherit; color:inherit;">${content.text}</div>`;

        // EFFECTS
        case 'effects-glass':
            return content.html;
        case 'effects-glowbox':
            return content.html;
        case 'effects-neontext':
            return `<div class="editable-text" data-prop="text" style="width:100%; text-align:center;">${content.text}</div>`;

        // MEDIA
        case 'media-image':
            return `<img src="${content.src}" alt="${content.alt}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" draggable="false">`;
        
        case 'media-video':
            return `
            <div style="position:relative; width:100%; height:100%; border-radius:inherit; overflow:hidden;">
                <video src="${content.src}" poster="${content.poster}" style="width:100%; height:100%; object-fit:cover;" controls muted></video>
            </div>`;
        
        case 'media-slider':
            return `
            <div style="position:relative; width:100%; height:100%; background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=60'); background-size:cover; background-position:center; display:flex; flex-direction:column; justify-content:flex-end; padding:30px; border-radius:inherit; box-sizing:border-box;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.5rem; color:#ffffff; font-weight:700;">${content.title}</h3>
                <p class="editable-text" data-prop="desc" style="margin:8px 0 0 0; font-size:0.95rem; color:#e2e8f0; opacity:0.9;">${content.desc}</p>
            </div>`;

        // FORM
        case 'form-input':
            return `
            <div style="display:flex; flex-direction:column; gap:6px; text-align:left; width:100%;">
                <label class="editable-text" data-prop="label" style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${content.label}</label>
                <input type="text" placeholder="${content.placeholder}" style="width:100%; height:100%; border:none; background:transparent; color:inherit; font-size:inherit; outline:none;" disabled>
            </div>`;
        
        case 'form-textarea':
            return `
            <div style="display:flex; flex-direction:column; gap:6px; text-align:left; width:100%; height:100%;">
                <label class="editable-text" data-prop="label" style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${content.label}</label>
                <textarea placeholder="${content.placeholder}" style="width:100%; height:calc(100% - 22px); border:none; background:transparent; color:inherit; font-size:inherit; outline:none; resize:none;" disabled></textarea>
            </div>`;
        
        case 'form-checkbox':
            return `
            <div style="display:flex; gap:10px; align-items:center; width:100%; height:100%;">
                <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary);" checked disabled>
                <span class="editable-text" data-prop="label" style="flex:1;">${content.label}</span>
            </div>`;
        
        case 'form-dropdown':
            return `
            <div style="display:flex; flex-direction:column; gap:6px; text-align:left; width:100%;">
                <label class="editable-text" data-prop="label" style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${content.label}</label>
                <select style="width:100%; height:100%; border:none; background:transparent; color:inherit; outline:none; font-size:inherit;" disabled>
                    ${(content.options || []).map(opt => `<option>${opt}</option>`).join('')}
                </select>
            </div>`;
        
        case 'form-contact':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.2rem; color:var(--text-main); font-weight:700;">${content.title}</h3>
                <input type="text" placeholder="Your Email" style="width:100%; padding:10px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:6px; color:white; font-size:14px;" disabled>
                <textarea placeholder="Your Message" style="width:100%; height:80px; padding:10px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:6px; color:white; font-size:14px; resize:none;" disabled></textarea>
                <button class="editable-text" data-prop="btnText" style="padding:10px; background:var(--primary); color:white; font-weight:600; border:none; border-radius:6px; font-size:14px; cursor:pointer;">${content.btnText}</button>
            </div>`;

        // WIDGETS
        case 'widget-accordion':
            return `
            <div style="border: 1px solid var(--border-color); border-radius:8px; overflow:hidden; width:100%;">
                <div style="background:rgba(255,255,255,0.02); padding:14px; display:flex; justify-content:space-between; align-items:center; font-weight:600; font-size:14px; border-bottom:1px solid var(--border-color);">
                    <span class="editable-text" data-prop="title">${content.title}</span>
                    <span>▼</span>
                </div>
                <div style="padding:16px; font-size:14px; color:var(--text-muted); line-height:1.5;">
                    <p class="editable-text" data-prop="content">${content.content}</p>
                </div>
            </div>`;
        
        case 'widget-tabs':
            return `
            <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
                <div style="display:flex; border-bottom:1px solid var(--border-color);">
                    ${(content.tabs || []).map((t, idx) => `
                        <div style="padding:8px 16px; font-size:13px; font-weight:600; color:${idx === 0 ? 'var(--primary)' : 'var(--text-muted)'}; border-bottom:${idx === 0 ? '2px solid var(--primary)' : 'none'}; cursor:pointer;">${t}</div>
                    `).join('')}
                </div>
                <div class="editable-text" data-prop="content" style="padding:10px 0; font-size:14px; color:var(--text-muted);">${content.content}</div>
            </div>`;
        
        case 'widget-pricing':
            return `
            <div style="display:flex; flex-direction:column; gap:15px; width:100%;">
                <div class="editable-text" data-prop="plan" style="font-weight:700; font-size:1rem; text-transform:uppercase; color:var(--primary); letter-spacing:0.05em;">${content.plan}</div>
                <div>
                    <span class="editable-text" data-prop="price" style="font-size:2.5rem; font-weight:800; color:var(--text-main);">${content.price}</span>
                    <span class="editable-text" data-prop="period" style="font-size:0.9rem; color:var(--text-muted);">${content.period}</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin:15px 0;">
                    ${(content.features || []).map(f => `<div style="font-size:14px; color:var(--text-muted); display:flex; gap:8px; justify-content:center;"><span>✓</span> <span>${f}</span></div>`).join('')}
                </div>
                <button style="padding:12px 24px; background:var(--primary); color:white; font-weight:700; border:none; border-radius:30px; font-size:14px; width:100%; cursor:pointer;">Select Plan</button>
            </div>`;
        
        case 'widget-progress':
            return `
            <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
                    <span class="editable-text" data-prop="label">${content.label}</span>
                    <span>${content.percent}%</span>
                </div>
                <div style="width:100%; height:8px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                    <div style="width:${content.percent}%; height:100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius:10px;"></div>
                </div>
            </div>`;
        
        case 'widget-timeline':
            return `
            <div style="display:flex; flex-direction:column; gap:20px; width:100%; text-align:left;">
                ${(content.steps || []).map((step, idx) => `
                    <div style="display:flex; gap:15px;">
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <div style="width:24px; height:24px; border-radius:50%; background:var(--primary); border:4px solid var(--body-bg); z-index:2; box-shadow:0 0 10px rgba(99,102,241,0.4);"></div>
                            ${idx < content.steps.length - 1 ? '<div style="width:2px; flex:1; background:var(--border-color); margin-top:-4px;"></div>' : ''}
                        </div>
                        <div style="padding-bottom:10px;">
                            <h4 style="font-size:15px; font-weight:700; color:var(--text-main); margin:0;">${step.title}</h4>
                            <p style="font-size:13px; color:var(--text-muted); margin:4px 0 0 0; line-height:1.4;">${step.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`;

        // GALLERY
        case 'gallery-grid':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.1rem; color:var(--text-main); font-weight:700;">${content.title}</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:12px; width:100%;">
                    ${(content.images || []).map(imgSrc => `<img src="${imgSrc}" style="width:100%; height:100px; object-fit:cover; border-radius:6px;" draggable="false">`).join('')}
                </div>
            </div>`;
        
        case 'gallery-carousel':
            return `
            <div style="position:relative; width:100%; height:100%; overflow:hidden; border-radius:inherit;">
                <img src="${content.images ? content.images[0] : ''}" style="width:100%; height:100%; object-fit:cover;" draggable="false">
                <div style="position:absolute; bottom:0; left:0; right:0; padding:20px; background:linear-gradient(transparent, rgba(0,0,0,0.8)); text-align:center; color:white;">
                    <p class="editable-text" data-prop="caption" style="margin:0; font-size:14px; font-weight:500;">${content.caption}</p>
                </div>
                <div style="position:absolute; top:50%; transform:translateY(-50%); left:15px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:white; cursor:pointer;">‹</div>
                <div style="position:absolute; top:50%; transform:translateY(-50%); right:15px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:white; cursor:pointer;">›</div>
            </div>`;

        // ADVANCED
        case 'advanced-shopgrid':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.1rem; color:var(--text-main); font-weight:700;">${content.title}</h3>
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; width:100%;">
                    ${(content.products || []).map(p => `
                        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:10px; overflow:hidden; padding:12px; display:flex; flex-direction:column; gap:8px;">
                            <img src="${p.img}" style="width:100%; height:80px; object-fit:cover; border-radius:6px;" draggable="false">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="font-weight:600; font-size:13px; color:var(--text-main);">${p.name}</div>
                                <div style="font-size:12px; font-weight:700; color:var(--primary);">${p.price}</div>
                            </div>
                            <button style="width:100%; padding:6px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); border-radius:6px; color:var(--primary); font-size:11px; font-weight:700; cursor:pointer;">Buy Now</button>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        
        case 'advanced-cart':
            return `
            <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.05rem; font-weight:700; border-bottom:1px solid var(--border-color); padding-bottom:8px;">${content.title}</h3>
                ${(content.items || []).map(item => `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="font-weight:700; color:var(--primary);">${item.qty}x</span>
                            <span style="color:var(--text-main);">${item.name}</span>
                        </div>
                        <span style="font-weight:700; color:var(--text-main);">${item.price}</span>
                    </div>
                `).join('')}
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:14px; border-top:1px dashed var(--border-color); padding-top:10px; margin-top:5px;">
                    <span>Total</span>
                    <span style="color:var(--primary);">${content.items ? content.items[0].price : '$0'}</span>
                </div>
                <button style="width:100%; padding:10px; border:none; background:var(--primary); color:white; border-radius:6px; font-weight:700; font-size:13px; cursor:pointer;">Proceed to Checkout</button>
            </div>`;

        case 'layout-split':
            return content.html;

        case 'design-subtitle':
            return `<h4 class="editable-text" data-prop="text" style="margin: 0; font-size: inherit; font-weight: inherit; color: inherit; text-align: inherit; letter-spacing: 0.1em; text-transform: uppercase;">${content.text}</h4>`;

        case 'design-quote':
            return `
            <div style="display:flex; flex-direction:column; gap:8px;">
                <span style="font-size:2rem; line-height:1; opacity:0.3; margin-bottom:-10px; text-align:left;">“</span>
                <blockquote class="editable-text" data-prop="text" style="margin:0; font-size:inherit; font-style:inherit; color:inherit; text-align:left;">${content.text}</blockquote>
                <cite class="editable-text" data-prop="author" style="font-size:0.85em; font-weight:700; color:var(--text-main); font-style:normal; margin-top:5px; display:block; text-align:left;">— ${content.author}</cite>
            </div>`;

        case 'structure-alertbar':
            return `<div class="editable-text" data-prop="text" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:inherit; font-weight:inherit;">${content.text}</div>`;

        case 'effects-gradientcard':
            return content.html;

        case 'media-audio':
            return `
            <div style="display:flex; align-items:center; gap:16px; width:100%; height:100%;">
                <button style="width:36px; height:36px; border-radius:50%; border:none; background:var(--primary); color:white; font-size:1rem; display:flex; align-items:center; justify-content:center; cursor:pointer;">▶</button>
                <div style="flex:1; display:flex; flex-direction:column; gap:4px; text-align:left;">
                    <div class="editable-text" data-prop="title" style="font-size:14px; font-weight:700; color:var(--text-main);">${content.title}</div>
                    <div class="editable-text" data-prop="artist" style="font-size:11px; color:var(--text-muted);">${content.artist}</div>
                </div>
                <div style="font-size:11px; color:var(--text-muted);">3:42</div>
            </div>`;

        case 'media-map':
            return `
            <div style="position:relative; width:100%; height:100%; border-radius:inherit; overflow:hidden;">
                <iframe src="${content.iframeUrl}" style="border:0; width:100%; height:100%;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                <div style="position:absolute; bottom:10px; left:10px; padding:6px 12px; background:rgba(0,0,0,0.8); border-radius:6px; font-size:11px; font-weight:600; color:white; pointer-events:none;">
                    📍 <span class="editable-text" data-prop="location">${content.location}</span>
                </div>
            </div>`;

        case 'form-toggle':
            return `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; height:100%;">
                <span class="editable-text" data-prop="label" style="flex:1; text-align:left;">${content.label}</span>
                <div style="position:relative; width:36px; height:20px; background-color:#334155; border-radius:20px; cursor:pointer;">
                    <div style="position:absolute; top:3px; left:3px; width:14px; height:14px; background:white; border-radius:50%;"></div>
                </div>
            </div>`;

        case 'form-login':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.2rem; color:var(--text-main); font-weight:700; text-align:left;">${content.title}</h3>
                <input type="text" placeholder="Username / Email" style="width:100%; padding:10px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:6px; color:white; font-size:14px;" disabled>
                <input type="password" placeholder="Password" style="width:100%; padding:10px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:6px; color:white; font-size:14px;" disabled>
                <button class="editable-text" data-prop="btnText" style="padding:10px; background:var(--primary); color:white; font-weight:600; border:none; border-radius:6px; font-size:14px; cursor:pointer;">${content.btnText}</button>
            </div>`;

        case 'widget-statscounter':
            return `
            <div style="display:flex; flex-direction:column; gap:4px; width:100%; height:100%; justify-content:center;">
                <div class="editable-text" data-prop="number" style="font-size:2.2rem; font-weight:900; color:var(--primary);">${content.number}</div>
                <div class="editable-text" data-prop="label" style="font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${content.label}</div>
            </div>`;

        case 'widget-rating':
            return `
            <div style="display:flex; flex-direction:column; gap:8px; align-items:center; width:100%; height:100%; justify-content:center;">
                <div style="display:flex; gap:4px; color:#fbbf24; font-size:1.2rem;">
                    ${Array.from({ length: content.stars || 5 }).map(() => '★').join('')}
                </div>
                <div class="editable-text" data-prop="label" style="font-size:12px; color:var(--text-muted);">${content.label}</div>
            </div>`;

        case 'advanced-chart':
            return `
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; height:100%;">
                <div class="editable-text" data-prop="title" style="margin:0; font-size:0.95rem; font-weight:700; color:var(--text-main); text-align:left;">${content.title}</div>
                <div style="flex:1; width:100%; display:flex; align-items:flex-end; padding-top:10px;">
                    <svg viewBox="0 0 500 200" style="width:100%; height:100%; overflow:visible;">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"></stop>
                                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d="${content.svgPath} L 480 200 L 10 200 Z" fill="url(#chartGrad)"></path>
                        <path d="${content.svgPath}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round"></path>
                        <circle cx="120" cy="40" r="5" fill="var(--accent)"></circle>
                        <circle cx="240" cy="120" r="5" fill="var(--accent)"></circle>
                        <circle cx="480" cy="20" r="5" fill="var(--accent)"></circle>
                    </svg>
                </div>
            </div>`;

        case 'layout-herosplit':
            return `
            <div style="display: flex; gap: 30px; align-items: center; width: 100%; flex-wrap: wrap;">
                <div style="flex: 1.2; text-align: left; display:flex; flex-direction:column; gap:16px;">
                    <h2 class="editable-text" data-prop="title" style="margin:0; font-size:2.2rem; font-weight:800; color:var(--text-main); line-height:1.2;">${content.title}</h2>
                    <p class="editable-text" data-prop="subtitle" style="margin:0; font-size:15px; color:var(--text-muted); line-height:1.6;">${content.subtitle}</p>
                    <div style="display: flex; gap: 12px; margin-top:8px;">
                        <button class="editable-text" data-prop="btn1" style="padding:10px 20px; background:var(--primary); color:white; font-weight:600; border:none; border-radius:6px; cursor:pointer;">${content.btn1}</button>
                        <button class="editable-text" data-prop="btn2" style="padding:10px 20px; background:transparent; border:1px solid var(--border-color); color:var(--text-main); font-weight:600; border-radius:6px; cursor:pointer;">${content.btn2}</button>
                    </div>
                </div>
                <div style="flex: 0.8; min-height: 220px; border-radius:12px; overflow:hidden;">
                    <img src="${content.imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" draggable="false">
                </div>
            </div>`;

        case 'design-teamcard':
            return `
            <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%;">
                <img src="${content.imgUrl}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);" draggable="false">
                <div style="text-align:center;">
                    <h3 class="editable-text" data-prop="name" style="margin:0; font-size:15px; font-weight:700; color:var(--text-main);">${content.name}</h3>
                    <span class="editable-text" data-prop="role" style="font-size:12px; color:var(--primary); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-top:2px;">${content.role}</span>
                </div>
                <p class="editable-text" data-prop="bio" style="margin:0; font-size:13px; color:var(--text-muted); line-height:1.5; text-align:center;">${content.bio}</p>
            </div>`;

        case 'widget-faqlist':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.15rem; font-weight:700; color:var(--text-main); text-align:left; border-bottom:1px solid var(--border-color); padding-bottom:8px;">${content.title}</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${(content.items || []).map((item, idx) => `
                        <div style="text-align:left; background:rgba(255,255,255,0.01); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
                            <h4 class="editable-text" data-prop="items-${idx}-q" style="margin:0; font-size:13.5px; font-weight:700; color:var(--text-main);">${item.q}</h4>
                            <p class="editable-text" data-prop="items-${idx}-a" style="margin:6px 0 0 0; font-size:12.5px; color:var(--text-muted); line-height:1.5;">${item.a}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;

        case 'advanced-projectcard':
            return `
            <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
                <div style="width:100%; height:150px; border-radius:8px; overflow:hidden;">
                    <img src="${content.imgUrl}" style="width:100%; height:100%; object-fit:cover;" draggable="false">
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="editable-text" data-prop="tag" style="font-size:10px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em;">${content.tag}</span>
                        <span class="editable-text" data-prop="client" style="font-size:11px; color:var(--text-muted);">${content.client}</span>
                    </div>
                    <h3 class="editable-text" data-prop="title" style="margin:4px 0 0 0; font-size:14.5px; font-weight:700; color:var(--text-main);">${content.title}</h3>
                </div>
                <button class="editable-text" data-prop="btnText" style="width:100%; padding:8px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); border-radius:6px; color:var(--primary); font-size:12px; font-weight:700; cursor:pointer;">${content.btnText}</button>
            </div>`;

        case 'advanced-datagrid':
            return `
            <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
                <h3 class="editable-text" data-prop="title" style="margin:0; font-size:1.05rem; font-weight:700; text-align:left;">${content.title}</h3>
                <div style="width:100%; overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; text-align:left; font-size:12.5px;">
                        <thead>
                            <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); font-weight:600;">
                                <th style="padding:8px 4px;">User / Client</th>
                                <th style="padding:8px 4px;">Organization</th>
                                <th style="padding:8px 4px; text-align:right;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(content.rows || []).map((row, idx) => `
                                <tr style="border-bottom:1px solid rgba(255,255,255,0.02);">
                                    <td class="editable-text" data-prop="rows-${idx}-name" style="padding:8px 4px; font-weight:600; color:var(--text-main);">${row.name}</td>
                                    <td class="editable-text" data-prop="rows-${idx}-role" style="padding:8px 4px; color:var(--text-muted);">${row.role}</td>
                                    <td style="padding:8px 4px; text-align:right;">
                                        <span class="editable-text" data-prop="rows-${idx}-status" style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; background:${row.status === 'Active' ? 'rgba(16,185,129,0.1)' : row.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}; color:${row.status === 'Active' ? '#10b981' : row.status === 'Pending' ? '#f59e0b' : '#ef4444'};">${row.status}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;

        case 'design-testimonial':
            return `
            <div style="display:flex; flex-direction:column; gap:16px; width:100%; text-align:left;">
                <span style="font-size:2rem; color:var(--primary); opacity:0.3; margin-bottom:-12px; line-height:1;">“</span>
                <p class="editable-text" data-prop="quote" style="margin:0; font-size:13.5px; color:var(--text-muted); line-height:1.5; font-style:italic;">${content.quote}</p>
                <div style="display:flex; align-items:center; gap:10px; border-top:1px solid rgba(255,255,255,0.04); padding-top:12px;">
                    <img src="${content.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" draggable="false">
                    <div>
                        <h4 class="editable-text" data-prop="name" style="margin:0; font-size:13px; font-weight:700; color:var(--text-main);">${content.name}</h4>
                        <span class="editable-text" data-prop="company" style="font-size:11px; color:var(--text-muted);">${content.company}</span>
                    </div>
                </div>
            </div>`;

        default:
            return `<div style="padding:20px; color:red;">Renderer missing for ${type}</div>`;
    }
}
