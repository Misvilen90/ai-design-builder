

export const TEMPLATES_LIST: { name: string; desc: string; icon: string; id: string; components: any[] }[] = [
  {
    id: 'portfolio',
    name: 'Creative Agency Portfolio',
    desc: 'Dark mode minimal portfolio containing a hero section, responsive image gallery, and footer links.',
    icon: '🎨',
    components: [
      {
        id: 'port-nav',
        type: 'nav-bar',
        name: 'Portfolio Navbar',
        category: 'Navigation',
        icon: '🌐',
        content: {
          html: `<div class="flex justify-between items-center h-full w-full">
            <div class="font-extrabold text-sm text-indigo-400">🎨 ALEX.DEV</div>
            <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
              <span class="hover:text-white cursor-pointer text-white">Work</span>
              <span class="hover:text-white cursor-pointer">About</span>
              <span class="hover:text-white cursor-pointer">Contact</span>
            </div>
            <button class="bg-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-md text-white">Hire Me</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '12px 24px'
        },
        position: { left: 50, top: 20, width: 900, height: 60, rotate: 0, zIndex: 1 }
      },
      {
        id: 'port-hero',
        type: 'mkt-hero',
        name: 'Creative Hero',
        category: 'Marketing',
        icon: '🚀',
        content: {
          html: `<div class="flex flex-col items-center justify-center text-center h-full gap-3">
            <span class="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Creative Frontend Developer</span>
            <h2 class="text-3xl font-extrabold text-white">Designing Digital Masterpieces</h2>
            <p class="text-xs text-textMuted-dark max-w-[500px]">I craft high-performance interactive interfaces using React, Tailwind CSS, and Framer Motion.</p>
            <button class="bg-indigo-600 text-[10px] font-bold py-2.5 px-6 rounded-md text-white mt-2">Explore Projects</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '16px',
          padding: '30px'
        },
        position: { left: 50, top: 100, width: 900, height: 260, rotate: 0, zIndex: 2 }
      },
      {
        id: 'port-img1',
        type: 'media-image',
        name: 'Project 1 Image',
        category: 'Media',
        icon: '🖼️',
        content: {
          src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80',
          alt: 'Project 1'
        },
        style: { borderRadius: '8px' },
        position: { left: 50, top: 380, width: 435, height: 240, rotate: 0, zIndex: 3 }
      },
      {
        id: 'port-img2',
        type: 'media-image',
        name: 'Project 2 Image',
        category: 'Media',
        icon: '🖼️',
        content: {
          src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
          alt: 'Project 2'
        },
        style: { borderRadius: '8px' },
        position: { left: 515, top: 380, width: 435, height: 240, rotate: 0, zIndex: 4 }
      },
      {
        id: 'port-footer',
        type: 'footer-block',
        name: 'Portfolio Footer',
        category: 'Footer',
        icon: '👣',
        content: {
          html: `<div class="flex flex-col md:flex-row justify-between items-center h-full w-full gap-4 text-xs">
            <div class="flex flex-col gap-1">
              <div class="font-extrabold text-white text-sm">🎨 ALEX.DEV</div>
              <div class="text-[10px] text-textMuted-dark">© 2026 Alex. All rights reserved.</div>
            </div>
            <div class="flex gap-4 text-[10px] text-textMuted-dark font-semibold">
              <span class="hover:text-white cursor-pointer">Github</span>
              <span class="hover:text-white cursor-pointer">Twitter</span>
              <span class="hover:text-white cursor-pointer">LinkedIn</span>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '24px'
        },
        position: { left: 50, top: 640, width: 900, height: 120, rotate: 0, zIndex: 5 }
      }
    ]
  },
  {
    id: 'landing',
    name: 'Landing Page Template',
    desc: 'Classic business landing page with a hero banner, custom features list, pricing, and contact capture.',
    icon: '🚀',
    components: [
      {
        id: 'land-nav',
        type: 'nav-bar',
        name: 'Landing Navbar',
        category: 'Navigation',
        icon: '🌐',
        content: {
          html: `<div class="flex justify-between items-center h-full w-full">
            <div class="font-extrabold text-sm text-indigo-400">⚡ GENOVAX AI</div>
            <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
              <span class="hover:text-white cursor-pointer text-white">Features</span>
              <span class="hover:text-white cursor-pointer">Pricing</span>
              <span class="hover:text-white cursor-pointer">About</span>
            </div>
            <button class="bg-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-md text-white">Get Started</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '12px 24px'
        },
        position: { left: 50, top: 20, width: 900, height: 60, rotate: 0, zIndex: 1 }
      },
      {
        id: 'land-hero',
        type: 'mkt-hero',
        name: 'SaaS Hero',
        category: 'Marketing',
        icon: '🚀',
        content: {
          html: `<div class="flex flex-col md:flex-row items-center justify-between h-full gap-8">
            <div class="flex-1 flex flex-col gap-3">
              <div class="text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold">GenovaX AI Launch</div>
              <h2 class="text-2xl font-extrabold text-white leading-tight">Build Websites with Agentic AI</h2>
              <p class="text-xs text-textMuted-dark leading-relaxed">The ultimate workspace to design, prototype, and build production-ready UI interfaces instantly.</p>
              <button class="bg-indigo-600 w-36 text-[10px] font-bold py-2 px-3 rounded-md text-white mt-2">Start Designing Free</button>
            </div>
            <div class="flex-1 max-w-[340px]">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" class="rounded-lg shadow-glow border border-border-dark" />
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '16px',
          padding: '40px'
        },
        position: { left: 50, top: 100, width: 900, height: 320, rotate: 0, zIndex: 2 }
      },
      {
        id: 'land-pricing',
        type: 'business-pricing',
        name: 'Landing Pricing',
        category: 'Business',
        icon: '💎',
        content: {
          html: `<div class="flex flex-col h-full justify-between gap-3 text-center">
            <div class="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Pro Developer</div>
            <div class="text-3xl font-extrabold text-white">$49<span class="text-xs text-textMuted-dark">/mo</span></div>
            <p class="text-[10px] text-textMuted-dark">Perfect for advanced builders and growing agencies.</p>
            <div class="border-t border-border-dark/60 my-2"></div>
            <ul class="text-[10px] text-textMuted-dark flex flex-col gap-2 text-left px-2">
              <li>✨ Unlimited Page Generations</li>
              <li>📤 Export React / HTML code</li>
              <li>☁️ Custom Domain Mapping</li>
            </ul>
            <button class="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold py-2 rounded-md text-white">Subscribe Now</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
          borderColor: '#6366f1',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderRadius: '12px',
          padding: '24px'
        },
        position: { left: 50, top: 440, width: 280, height: 320, rotate: 0, zIndex: 3 }
      },
      {
        id: 'land-contact',
        type: 'form-contact',
        name: 'Landing Contact',
        category: 'Forms',
        icon: '📝',
        content: {
          html: `<form class="flex flex-col gap-3 h-full justify-between" onsubmit="return false;">
            <h4 class="text-xs font-bold text-white mb-1">Get In Touch</h4>
            <input type="text" placeholder="Name" class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white outline-none">
            <input type="email" placeholder="Email" class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white outline-none">
            <textarea placeholder="Message..." class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white h-24 outline-none resize-none"></textarea>
            <button class="bg-indigo-600 text-[10px] font-bold py-2 px-3 rounded-md text-white w-full">Send Message</button>
          </form>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.6)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '12px',
          padding: '20px'
        },
        position: { left: 360, top: 440, width: 590, height: 320, rotate: 0, zIndex: 4 }
      },
      {
        id: 'land-footer',
        type: 'footer-block',
        name: 'Landing Footer',
        category: 'Footer',
        icon: '👣',
        content: {
          html: `<div class="flex flex-col md:flex-row justify-between items-center h-full w-full gap-4 text-xs">
            <div class="flex flex-col gap-1">
              <div class="font-extrabold text-white text-sm">⚡ GENOVAX</div>
              <div class="text-[10px] text-textMuted-dark">© 2026 GenovaX. All rights reserved.</div>
            </div>
            <div class="flex gap-4 text-[10px] text-textMuted-dark font-semibold">
              <span class="hover:text-white cursor-pointer">Privacy Policy</span>
              <span class="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '24px'
        },
        position: { left: 50, top: 780, width: 900, height: 120, rotate: 0, zIndex: 5 }
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Template',
    desc: 'Sleek store outline featuring promotional banner, product card grids, shopping cart triggers, and footers.',
    icon: '🛍️',
    components: [
      {
        id: 'ecom-nav',
        type: 'nav-bar',
        name: 'ECom Navbar',
        category: 'Navigation',
        icon: '🌐',
        content: {
          html: `<div class="flex justify-between items-center h-full w-full">
            <div class="font-extrabold text-sm text-indigo-400">🛍️ LUXESHOP</div>
            <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
              <span class="hover:text-white cursor-pointer text-white">Collections</span>
              <span class="hover:text-white cursor-pointer">New Arrivals</span>
              <span class="hover:text-white cursor-pointer">Deals</span>
            </div>
            <button class="bg-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-md text-white">Cart (0)</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '12px 24px'
        },
        position: { left: 50, top: 20, width: 900, height: 60, rotate: 0, zIndex: 1 }
      },
      {
        id: 'ecom-hero',
        type: 'mkt-hero',
        name: 'ECom Hero',
        category: 'Marketing',
        icon: '🚀',
        content: {
          html: `<div class="flex flex-col items-center justify-center text-center h-full gap-3">
            <span class="text-[9px] uppercase font-bold text-amber-500 tracking-wider">Summer Clearance - 50% Off</span>
            <h2 class="text-3xl font-extrabold text-white">Upgrade Your Summer Style</h2>
            <p class="text-xs text-textMuted-dark max-w-[500px]">Handcrafted premium accessories and apparel designed for the modern minimal explorer.</p>
            <button class="bg-amber-600 text-[10px] font-bold py-2.5 px-6 rounded-md text-white mt-2">Shop Now 🛍️</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(217, 119, 6, 0.03)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '16px',
          padding: '30px'
        },
        position: { left: 50, top: 100, width: 900, height: 260, rotate: 0, zIndex: 2 }
      },
      {
        id: 'ecom-products',
        type: 'ecom-grid',
        name: 'ECom Products Grid',
        category: 'E-Commerce',
        icon: '🛍️',
        content: {
          html: `<div class="grid grid-cols-3 gap-6 h-full w-full">
            <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
              <h4 class="text-xs font-bold text-white">Classic Red Sneaker</h4>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs font-extrabold text-indigo-400">$89</span>
                <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
              </div>
            </div>
            <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
              <h4 class="text-xs font-bold text-white">Minimalist Smart Watch</h4>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs font-extrabold text-indigo-400">$199</span>
                <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
              </div>
            </div>
            <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
              <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
              <h4 class="text-xs font-bold text-white">Retro Sunglasses</h4>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs font-extrabold text-indigo-400">$45</span>
                <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
              </div>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'transparent',
          padding: '0px'
        },
        position: { left: 50, top: 380, width: 900, height: 340, rotate: 0, zIndex: 3 }
      },
      {
        id: 'ecom-footer',
        type: 'footer-block',
        name: 'ECom Footer',
        category: 'Footer',
        icon: '👣',
        content: {
          html: `<div class="flex flex-col md:flex-row justify-between items-center h-full w-full gap-4 text-xs">
            <div class="flex flex-col gap-1">
              <div class="font-extrabold text-white text-sm">🛍️ LUXESHOP</div>
              <div class="text-[10px] text-textMuted-dark">© 2026 LuxeShop. All rights reserved.</div>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '24px'
        },
        position: { left: 50, top: 740, width: 900, height: 120, rotate: 0, zIndex: 4 }
      }
    ]
  },
  {
    id: 'admin',
    name: 'Admin Dashboard Template',
    desc: 'Production ready admin workspace featuring metric cards, analytics graphs, system logs accordions, and header stats.',
    icon: '📊',
    components: [
      {
        id: 'dash-nav',
        type: 'nav-bar',
        name: 'Admin Navbar',
        category: 'Navigation',
        icon: '🌐',
        content: {
          html: `<div class="flex justify-between items-center h-full w-full">
            <div class="font-extrabold text-sm text-indigo-400">📊 SAAS METRICS</div>
            <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
              <span class="hover:text-white cursor-pointer text-white">Overview</span>
              <span class="hover:text-white cursor-pointer">Customers</span>
              <span class="hover:text-white cursor-pointer">Reports</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] bg-slate-800 px-2.5 py-1 rounded text-white font-mono">Ver 2.4</span>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '12px 24px'
        },
        position: { left: 50, top: 20, width: 900, height: 60, rotate: 0, zIndex: 1 }
      },
      {
        id: 'dash-header',
        type: 'content-heading',
        name: 'Admin Header',
        category: 'Content',
        icon: '🔤',
        content: { text: '⚡ Enterprise Operations Dashboard' },
        style: {
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '800',
          textAlign: 'left'
        },
        position: { left: 50, top: 100, width: 900, height: 40, rotate: 0, zIndex: 2 }
      },
      {
        id: 'dash-chart1',
        type: 'adv-chart',
        name: 'Operations Chart 1',
        category: 'Advanced',
        icon: '📊',
        content: {
          html: `<div class="flex flex-col gap-2 h-full justify-between">
            <div class="flex justify-between items-center">
              <span class="text-xs font-extrabold text-white">Monthly Active Users (MAU)</span>
              <span class="text-[9px] text-green-400 font-bold font-mono">+12.5%</span>
            </div>
            <div class="flex items-end gap-3 h-24 pt-2">
              <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[40%] rounded-t-sm"></div>
              <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[50%] rounded-t-sm"></div>
              <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[60%] rounded-t-sm"></div>
              <div class="bg-indigo-500 hover:bg-indigo-400 transition-colors w-full h-[90%] rounded-t-sm"></div>
            </div>
            <div class="flex justify-between text-[8px] text-slate-500 uppercase font-mono px-0.5">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.7)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '16px'
        },
        position: { left: 50, top: 160, width: 435, height: 200, rotate: 0, zIndex: 3 }
      },
      {
        id: 'dash-chart2',
        type: 'adv-chart',
        name: 'Operations Chart 2',
        category: 'Advanced',
        icon: '📊',
        content: {
          html: `<div class="flex flex-col gap-2 h-full justify-between">
            <div class="flex justify-between items-center">
              <span class="text-xs font-extrabold text-white">Net Subscription Revenue</span>
              <span class="text-[9px] text-green-400 font-bold font-mono">+$24,800</span>
            </div>
            <div class="flex items-end gap-3 h-24 pt-2">
              <div class="bg-purple-500/20 hover:bg-purple-500 transition-colors w-full h-[30%] rounded-t-sm"></div>
              <div class="bg-purple-500/20 hover:bg-purple-500 transition-colors w-full h-[55%] rounded-t-sm"></div>
              <div class="bg-purple-500 hover:bg-purple-400 transition-colors w-full h-[75%] rounded-t-sm"></div>
              <div class="bg-purple-500/20 hover:bg-purple-500 transition-colors w-full h-[95%] rounded-t-sm"></div>
            </div>
            <div class="flex justify-between text-[8px] text-slate-500 uppercase font-mono px-0.5">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.7)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '16px'
        },
        position: { left: 515, top: 160, width: 435, height: 200, rotate: 0, zIndex: 4 }
      },
      {
        id: 'dash-pricing',
        type: 'business-pricing',
        name: 'Plan Summary',
        category: 'Business',
        icon: '💎',
        content: {
          html: `<div class="flex flex-col h-full justify-between gap-1.5 text-center">
            <div class="text-[9px] font-bold text-indigo-400 uppercase">Enterprise Status</div>
            <div class="text-2xl font-black text-white">$999<span class="text-xs text-textMuted-dark">/yr</span></div>
            <p class="text-[9px] text-textMuted-dark">Active billing cycle for Acme Corp.</p>
            <div class="border-t border-border-dark/40 my-1"></div>
            <button class="bg-indigo-600 text-[9px] font-bold py-1.5 rounded-md text-white font-mono">Manage Invoice</button>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '12px',
          padding: '16px'
        },
        position: { left: 50, top: 380, width: 280, height: 200, rotate: 0, zIndex: 5 }
      },
      {
        id: 'dash-accordion',
        type: 'content-accordion',
        name: 'System Logs',
        category: 'Content',
        icon: '📂',
        content: {
          html: `<div class="w-full flex flex-col gap-2">
            <details class="bg-card-dark/40 border border-border-dark rounded p-2.5 group" open>
              <summary class="text-[10px] font-bold cursor-pointer select-none text-textMain-dark flex justify-between items-center list-none">
                <span>System Health Checks</span>
                <span class="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p class="text-[9px] text-green-400 mt-1.5 font-mono">● API Gateway: Healthy (24ms latency)</p>
              <p class="text-[9px] text-green-400 font-mono">● Database Cluster: Online (Replication factor: 3)</p>
            </details>
          </div>`
        },
        style: {
          backgroundColor: 'transparent',
          padding: '0px'
        },
        position: { left: 350, top: 380, width: 600, height: 200, rotate: 0, zIndex: 6 }
      },
      {
        id: 'dash-footer',
        type: 'footer-block',
        name: 'Admin Footer',
        category: 'Footer',
        icon: '👣',
        content: {
          html: `<div class="flex justify-between items-center h-full w-full text-xs">
            <div class="text-[10px] text-textMuted-dark">© 2026 Admin Dashboard. All rights reserved.</div>
          </div>`
        },
        style: {
          backgroundColor: 'rgba(16, 23, 38, 0.9)',
          borderColor: '#1e293b',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '8px',
          padding: '24px'
        },
        position: { left: 50, top: 600, width: 900, height: 100, rotate: 0, zIndex: 7 }
      }
    ]
  }
];
