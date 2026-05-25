// ============================================================
// PORTFOLIO DATA — Edit this file to update your portfolio
// ============================================================

export const personalInfo = {
  name: "Aamir Ahmed Shamsi",
  title: "IT Professional & Full Stack Developer",
  taglines: [
    "Building Scalable Digital Experiences",
    "Full Stack Developer",
    "Cloud Architect",
    "AI Integration Specialist",
    "Entrepreneur & Problem Solver",
  ],
  bio: "Passionate IT professional with 8+ years of experience designing, building, and deploying full-stack applications and cloud infrastructure. I specialize in turning complex problems into elegant, performant digital solutions — from MVP to enterprise scale.",
  location: "San Francisco, CA",
  email: "alex@example.com",
  phone: "+1 (555) 000-0000",
  website: "https://alexcarter.dev",
  resume: "/resume.pdf",
  availability: "Open to opportunities",
  avatar: "/avatar.jpg",

  social: {
    github: "https://github.com/alexcarter",
    linkedin: "https://linkedin.com/in/alexcarter",
    twitter: "https://twitter.com/alexcarter",
    instagram: "https://instagram.com/alexcarter",
    youtube: "",
    discord: "",
    whatsapp: "+15550000000",
    calendly: "https://calendly.com/alexcarter",
  },

  stats: [
    { label: "Years Experience", value: 8, suffix: "+" },
    { label: "Projects Delivered", value: 120, suffix: "+" },
    { label: "Happy Clients", value: 85, suffix: "+" },
    { label: "GitHub Stars", value: 2400, suffix: "+" },
  ],
};

export const techStack = [
  {
    category: "Frontend",
    icon: "Monitor",
    color: "#60a5fa",
    items: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "Next.js", level: 92, icon: "▲" },
      { name: "TypeScript", level: 90, icon: "🔷" },
      { name: "Tailwind CSS", level: 95, icon: "🎨" },
      { name: "Framer Motion", level: 80, icon: "✨" },
      { name: "Vue.js", level: 75, icon: "💚" },
    ],
  },
  {
    category: "Backend",
    icon: "Server",
    color: "#a78bfa",
    items: [
      { name: "Node.js", level: 90, icon: "🟢" },
      { name: "Python", level: 88, icon: "🐍" },
      { name: "FastAPI", level: 85, icon: "⚡" },
      { name: "GraphQL", level: 80, icon: "◈" },
      { name: "REST APIs", level: 95, icon: "🔗" },
      { name: "Go", level: 65, icon: "🐹" },
    ],
  },
  {
    category: "Databases",
    icon: "Database",
    color: "#34d399",
    items: [
      { name: "PostgreSQL", level: 88, icon: "🐘" },
      { name: "MongoDB", level: 85, icon: "🍃" },
      { name: "Redis", level: 80, icon: "🔴" },
      { name: "Supabase", level: 85, icon: "⚡" },
      { name: "MySQL", level: 82, icon: "🐬" },
      { name: "Prisma", level: 85, icon: "▲" },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: "Cloud",
    color: "#f59e0b",
    items: [
      { name: "AWS", level: 82, icon: "☁️" },
      { name: "Docker", level: 88, icon: "🐳" },
      { name: "Kubernetes", level: 72, icon: "⚙️" },
      { name: "Vercel", level: 95, icon: "▲" },
      { name: "GitHub Actions", level: 90, icon: "🔄" },
      { name: "Terraform", level: 68, icon: "🏗️" },
    ],
  },
  {
    category: "AI & ML",
    icon: "Cpu",
    color: "#f472b6",
    items: [
      { name: "OpenAI API", level: 90, icon: "🤖" },
      { name: "LangChain", level: 82, icon: "🔗" },
      { name: "Anthropic", level: 85, icon: "🧠" },
      { name: "TensorFlow", level: 65, icon: "📊" },
      { name: "Hugging Face", level: 70, icon: "🤗" },
      { name: "Pinecone", level: 75, icon: "🌲" },
    ],
  },
  {
    category: "Mobile",
    icon: "Smartphone",
    color: "#fb923c",
    items: [
      { name: "React Native", level: 80, icon: "📱" },
      { name: "Expo", level: 82, icon: "⚡" },
      { name: "Flutter", level: 60, icon: "🎯" },
      { name: "PWA", level: 85, icon: "🌐" },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "NexaFlow — AI Workflow Automation",
    description:
      "Enterprise-grade workflow automation platform powered by GPT-4. Drag-and-drop builder, 200+ integrations, real-time collaboration, and one-click deployments. Processes 50M+ automated tasks per month.",
    longDescription:
      "NexaFlow is a no-code/low-code platform that allows teams to build, test, and deploy automated workflows in minutes. It integrates with OpenAI to provide intelligent decision-making nodes and supports 200+ third-party services including Slack, Salesforce, HubSpot, and AWS. The platform handles 50M+ automated tasks monthly with 99.9% uptime.",
    tech: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
    github: "https://github.com/alexcarter/nexaflow",
    demo: "https://nexaflow.io",
    vercel: "https://nexaflow.vercel.app",
    image: "/projects/nexaflow.jpg",
    featured: true,
    status: "Live",
    category: "SaaS",
    tags: ["AI", "Automation", "SaaS", "Enterprise"],
    date: "2024-01",
    client: "NexaFlow Inc.",
    stars: 842,
    metrics: { users: "12K+", uptime: "99.9%", tasks: "50M+/month" },
  },
  {
    id: 2,
    title: "CryptoLens — DeFi Analytics Dashboard",
    description:
      "Real-time DeFi analytics platform tracking 5000+ tokens across 15 chains. Features portfolio tracking, whale alerts, on-chain analysis, and AI-powered market insights.",
    longDescription:
      "A comprehensive DeFi analytics platform that provides real-time data visualization for decentralized finance. Features include multi-chain portfolio tracking, whale wallet monitoring, liquidity pool analysis, and AI-generated market reports.",
    tech: ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB", "WebSocket", "TailwindCSS"],
    github: "https://github.com/alexcarter/cryptolens",
    demo: "https://cryptolens.app",
    vercel: "",
    image: "/projects/cryptolens.jpg",
    featured: true,
    status: "Live",
    category: "Web3",
    tags: ["DeFi", "Analytics", "Web3", "Crypto"],
    date: "2023-08",
    client: "CryptoLens Labs",
    stars: 634,
    metrics: { tokens: "5000+", chains: "15", users: "28K+" },
  },
  {
    id: 3,
    title: "ShipFast — Startup Boilerplate",
    description:
      "Production-ready Next.js boilerplate with auth, payments, emails, and more. Used by 3000+ developers to launch their startups 10x faster.",
    longDescription:
      "ShipFast is an opinionated Next.js starter kit that includes everything a startup needs: Stripe payments, Auth.js authentication, transactional emails, AI integration, Supabase backend, and beautiful UI components.",
    tech: ["Next.js", "TypeScript", "Stripe", "Supabase", "Resend", "OpenAI", "Tailwind"],
    github: "https://github.com/alexcarter/shipfast",
    demo: "https://shipfa.st",
    vercel: "https://shipfast.vercel.app",
    image: "/projects/shipfast.jpg",
    featured: true,
    status: "Live",
    category: "Template",
    tags: ["Boilerplate", "SaaS", "Template", "Next.js"],
    date: "2023-11",
    client: "Open Source",
    stars: 3200,
    metrics: { developers: "3000+", stars: "3.2K", forks: "480" },
  },
  {
    id: 4,
    title: "MindMap AI — Visual Knowledge Base",
    description:
      "AI-powered mind mapping tool that generates visual knowledge graphs from text, PDFs, and URLs. Features real-time collaboration and smart auto-linking.",
    tech: ["React", "TypeScript", "FastAPI", "OpenAI", "D3.js", "PostgreSQL"],
    github: "https://github.com/alexcarter/mindmap-ai",
    demo: "https://mindmap-ai.app",
    vercel: "",
    image: "/projects/mindmap.jpg",
    featured: false,
    status: "Live",
    category: "AI Tool",
    tags: ["AI", "Productivity", "Knowledge"],
    date: "2024-03",
    client: "Personal Project",
    stars: 421,
    metrics: { users: "5K+", maps: "100K+" },
  },
  {
    id: 5,
    title: "DevPortal — Developer Documentation Platform",
    description:
      "Beautiful, fast documentation platform built for developer tools. Markdown-based, versioned docs with AI-powered search and interactive API playground.",
    tech: ["Next.js", "MDX", "TypeScript", "Algolia", "TailwindCSS", "Vercel"],
    github: "https://github.com/alexcarter/devportal",
    demo: "https://devportal.dev",
    vercel: "https://devportal.vercel.app",
    image: "/projects/devportal.jpg",
    featured: false,
    status: "Live",
    category: "Dev Tool",
    tags: ["Documentation", "Developer Tools", "Open Source"],
    date: "2023-06",
    client: "Open Source",
    stars: 892,
    metrics: { sites: "200+", pageviews: "1M+/month" },
  },
  {
    id: 6,
    title: "CloudOps Dashboard — Infrastructure Monitor",
    description:
      "Multi-cloud infrastructure monitoring and cost optimization platform. Track AWS, GCP, and Azure resources with automated cost-saving recommendations.",
    tech: ["React", "TypeScript", "Node.js", "AWS SDK", "Terraform", "PostgreSQL"],
    github: "",
    demo: "",
    vercel: "",
    image: "/projects/cloudops.jpg",
    featured: false,
    status: "Private",
    category: "Enterprise",
    tags: ["Cloud", "DevOps", "Enterprise", "AWS"],
    date: "2023-09",
    client: "Fortune 500 Client",
    stars: 0,
    metrics: { saved: "$2M+/yr", resources: "10K+" },
  },
];

export const services = [
  {
    icon: "Code2",
    title: "Full Stack Development",
    description:
      "End-to-end web applications from pixel-perfect frontends to robust, scalable backends. React, Next.js, Node.js, and more.",
    features: ["Custom web apps", "API development", "Performance optimization", "Code review"],
    color: "#818cf8",
    price: "From $3,000",
  },
  {
    icon: "Cpu",
    title: "AI Integration",
    description:
      "Embed cutting-edge AI into your product. LLM-powered features, RAG systems, intelligent automation, and AI-driven user experiences.",
    features: ["LLM integration", "RAG pipelines", "AI chatbots", "Custom ML models"],
    color: "#a78bfa",
    price: "From $2,500",
  },
  {
    icon: "Zap",
    title: "Workflow Automation",
    description:
      "Eliminate manual tasks and streamline operations with intelligent automation. Zapier-style flows and custom scripts.",
    features: ["Process automation", "API orchestration", "Scheduled jobs", "Event-driven systems"],
    color: "#34d399",
    price: "From $1,500",
  },
  {
    icon: "Cloud",
    title: "Cloud Architecture",
    description:
      "Design and deploy scalable, cost-efficient cloud infrastructure on AWS, GCP, or Azure. From setup to CI/CD pipelines.",
    features: ["AWS/GCP/Azure", "Docker & K8s", "CI/CD pipelines", "Cost optimization"],
    color: "#60a5fa",
    price: "From $2,000",
  },
  {
    icon: "Palette",
    title: "UI/UX Design",
    description:
      "Craft intuitive, beautiful interfaces that users love. Design systems, component libraries, and pixel-perfect implementation.",
    features: ["Design systems", "Figma prototypes", "Component libraries", "Accessibility"],
    color: "#f472b6",
    price: "From $1,800",
  },
  {
    icon: "BarChart3",
    title: "Technical Consulting",
    description:
      "Strategic guidance on tech stack selection, architecture decisions, and engineering best practices to accelerate your business.",
    features: ["Tech stack audit", "Architecture review", "Team mentoring", "Roadmap planning"],
    color: "#fb923c",
    price: "From $200/hr",
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO",
    company: "FinTech Startup",
    avatar: "/testimonials/sarah.jpg",
    content:
      "Aamir delivered our entire platform in 3 months — on time, on budget, and beyond our expectations. The code quality is exceptional and the architecture is built to scale. Highly recommend!",
    rating: 5,
    project: "Payment Platform",
  },
  {
    name: "Marcus Chen",
    role: "Founder",
    company: "DataViz Inc.",
    avatar: "/testimonials/marcus.jpg",
    content:
      "The AI integration Aamir built transformed our product completely. Our user engagement jumped 300% after launch. He understood our vision and executed it flawlessly.",
    rating: 5,
    project: "AI Analytics Dashboard",
  },
  {
    name: "Priya Patel",
    role: "VP Engineering",
    company: "SaaS Corp",
    avatar: "/testimonials/priya.jpg",
    content:
      "Aamir's technical depth is impressive. He optimized our backend performance by 10x and reduced our AWS costs by 40%. He's not just a developer — he's a true technical partner.",
    rating: 5,
    project: "Infrastructure Optimization",
  },
  {
    name: "James Rodriguez",
    role: "CEO",
    company: "E-Commerce Brand",
    avatar: "/testimonials/james.jpg",
    content:
      "We went from 0 to 50K users in 4 months. Aamir built our entire tech stack and it handled the traffic without a hitch. Exceptional work, exceptional communication.",
    rating: 5,
    project: "E-Commerce Platform",
  },
];

export const experiences = [
  {
    title: "Senior Full Stack Engineer",
    company: "TechVentures Inc.",
    period: "2022 — Present",
    description:
      "Lead development of flagship SaaS products serving 100K+ users. Architected microservices migration reducing latency by 60%.",
    tech: ["Next.js", "Python", "AWS", "Kubernetes"],
    type: "work",
  },
  {
    title: "Founder & CTO",
    company: "NexaFlow",
    period: "2021 — Present",
    description:
      "Founded and built AI workflow automation startup from zero to 12K+ customers. Raised $1.2M seed round.",
    tech: ["Next.js", "FastAPI", "OpenAI", "AWS"],
    type: "entrepreneurship",
  },
  {
    title: "Full Stack Developer",
    company: "Digital Agency X",
    period: "2019 — 2022",
    description:
      "Delivered 40+ client projects across e-commerce, fintech, and SaaS. Led team of 6 developers.",
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    type: "work",
  },
  {
    title: "B.Sc. Computer Science",
    company: "University of Technology",
    period: "2015 — 2019",
    description:
      "Graduated with honors. Specialized in distributed systems and machine learning. Published 2 research papers.",
    tech: [],
    type: "education",
  },
];

export const certifications = [
  { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", year: 2023, badge: "☁️" },
  { name: "Google Cloud Professional Developer", issuer: "Google Cloud", year: 2022, badge: "🌐" },
  { name: "Certified Kubernetes Administrator", issuer: "CNCF", year: 2022, badge: "⚙️" },
  { name: "MongoDB Certified Developer", issuer: "MongoDB", year: 2021, badge: "🍃" },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];
