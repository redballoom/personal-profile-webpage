import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  User, Briefcase, Code, BookOpen, 
  Compass, Github, ExternalLink, Menu, X 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// 定义数据类型
interface Project {
  id: number;
  name: string;
  description: string;
  techStack: string[];
  category: string[];
  link?: string;
  repo?: string;
  achievements?: {
    title: string;
    value: string;
  }[];
}

interface Skill {
  name: string;
  level: number;
  category: 'rpa' | 'ai' | 'other';
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface Plan {
  period: 'short' | 'medium' | 'long';
  title: string;
  description: string;
}

// 模拟数据
const PROJECTS: Project[] = [
  {
    id: 1,
    name: "BOSS自动化打招呼&沟通回复",
    description: "基于影刀RPA、飞书多维表格、coze智能体的自动化项目，配合紫鸟浏览器可管理多个BOSS账号。",
    techStack: ["Python", "影刀RPA", "COZE Agent"],
    category: ["rpa", "ai"],
    repo: "https://github.com/example/rpa-platform",
    achievements: [
      { title: "流程自动化率", value: "80%" },
      { title: "节省工时", value: "100小时/月" }
    ]
  },
  {
    id: 2,
    name: "小红书二创&发布自动化",
    description: "基于coze工作流和飞书多维表，通过飞书多维的发送HTTP请求调用coze工作流API实现",
    techStack: ["COZE Workflow"],
    category: ["ai"],
    link: "https://ml-deploy.example.com",
    achievements: [
      { title: "流程自动化率", value: "90%" },
      { title: "节省工时", value: "-" }
    ]
  },
  {
    id: 3,
    name: "基于AI生成的网页搭建",
    description: "通过coze空间的网页生成功能，根据我提供的prompt生成符合要求的网页，下载到本地后，通过claude code辅助开发，为其添加适配性和交互效果",
    techStack: ["React", "TypeScript", "AI", "claud code"],
    category: ["other"],
    repo: "https://github.com/example/data-visualization",
    achievements: [
      { title: "数据更新频率", value: "实时" },
      { title: "用户满意度", value: "92%" }
    ]
  }
];

const SKILLS: Skill[] = [
  // RPA&自动化技术
  { name: "影刀RPA", level: 85, category: "rpa" },
  { name: "Automation Anywhere", level: 40, category: "rpa" },
  { name: "playwright", level: 50, category: "rpa" },
  { name: "drissionPage", level: 60, category: "rpa" },
  { name: "selenium", level: 50, category: "rpa" },
  // AI辅助开发能力
  { name: "vibe coding", level: 80, category: "ai" },
  { name: "COZE Agent & COZE Workflow", level: 75, category: "ai" },
  { name: "Claude code cli", level: 70, category: "ai" },
  { name: "trae", level: 65, category: "ai" },
  // 编程语言能力
  { name: "Python", level: 95, category: "other" },
  { name: "Javascript", level: 85, category: "other" },
  { name: "Nodejs", level: 80, category: "other" }
];

const TIMELINE: TimelineItem[] = [
  {
    year: "2019",
    title: "自学编程",
    description: "系统学习python、javascript编程语言，同时了解到爬虫方向，持续学习..."
  },
  {
    year: "2023",
    title: "AI技术入门",
    description: "chat-GPT3.5出世，我开始了解提示词和使用AI辅助编程，完成一些爬虫的兼职等。"
  },
  {
    year: "2024",
    title: "在校兼职接单",
    description: "有了AI的辅助，我开始频繁接爬虫单子，不断锻炼数据抓取和数据清洗分析的能力。"
  },
  {
    year: "2024-至今",
    title: "AI+RPA融合应用",
    description: "我见识到claude code和codex等国外AI编程工具的强大能力，结合Agent能实现很多能力之外的技术，便开始专注于AI与RPA技术的融合应用，开发智能自动化解决方案，提升业务流程智能化水平"
  }
];

const PLANS: Plan[] = [
  {
    period: "short",
    title: "短期规划 (1年内)",
    description: "深化AI与RPA融合技术研究，完成3-5个创新性项目，提升技术影响力"
  },
  {
    period: "medium",
    title: "中期规划 (1-3年)",
    description: "成为行业内AI+RPA领域的技术专家，发表相关技术文章，参与行业标准制定"
  },
  {
    period: "long",
    title: "长期规划 (3年以上)",
    description: "建立自己的技术团队或工作室，为企业提供定制化的智能自动化解决方案"
  }
];

// 技术分布数据
const TECH_DISTRIBUTION = [
  { name: "RPA&自动化技术", value: SKILLS.filter(s => s.category === "rpa").length, color: "#3b82f6" },
  { name: "AI辅助开发能力", value: SKILLS.filter(s => s.category === "ai").length, color: "#10b981" },
  { name: "编程语言能力", value: SKILLS.filter(s => s.category === "other").length, color: "#8b5cf6" }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const sections = useRef<{[key: string]: HTMLElement | null}>({
    intro: null,
    skills: null,
    projects: null,
    timeline: null,
    plans: null
  });
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // 过滤项目
  const filteredProjects = activeCategory 
    ? PROJECTS.filter(project => project.category.includes(activeCategory))
    : PROJECTS;

  // 滚动到指定区域
  const scrollToSection = (sectionId: string) => {
    sections.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // 监听滚动，更新导航高亮
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // 找出当前可见的区域
      for (const [id, element] of Object.entries(sections.current)) {
        if (!element) continue;
        
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          // 这里可以添加导航高亮逻辑
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(`min-h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800 text-gray-100' : 'from-gray-50 to-gray-100 text-gray-800'} transition-colors duration-300`)}>
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              个人项目展示
            </span>
          </div>
          
           {/* 桌面导航 */}
          <div className="hidden md:flex space-x-4">
            {[
              { id: 'intro', icon: <User size={16} />, label: '简介' },
              { id: 'skills', icon: <Code size={16} />, label: '技术栈' },
              { id: 'projects', icon: <Briefcase size={16} />, label: '项目' },
              { id: 'timeline', icon: <BookOpen size={16} />, label: '学习历程' },
              { id: 'plans', icon: <Compass size={16} />, label: '未来规划' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full transition-all hover:bg-opacity-20 hover:bg-gray-700/10"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all hover:bg-opacity-20 hover:bg-gray-700/10"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
          
           {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="切换主题"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="菜单"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
         {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-opacity-95 backdrop-blur-lg shadow-lg"
          >
            <div className="container mx-auto px-4 py-2 flex flex-col">
              {[
                { id: 'intro', icon: <User size={20} />, label: '简介' },
                { id: 'skills', icon: <Code size={20} />, label: '技术栈' },
                { id: 'projects', icon: <Briefcase size={20} />, label: '项目' },
                { id: 'timeline', icon: <BookOpen size={20} />, label: '学习历程' },
                { id: 'plans', icon: <Compass size={20} />, label: '未来规划' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-3 p-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.icon}
                  <span className="text-lg">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* 个人简介区 */}
        <section 
          ref={el => sections.current.intro = el}
          className="py-16 md:py-24"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-70"></div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                {/* 使用生成的图片 */}
                <img 
                  src="https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/9c2d6eb674a542afa4329c92e8e43793.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1792839396&x-signature=hzNliDQm%2Fs8f3euEzdWl1WSkVAk%3D&x-wf-file_name=tx+%281%29.png" 
                  alt="个人照片" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">吴文豪</h1>
            <p className="text-xl md:text-2xl mb-6 text-gray-500 dark:text-gray-400">
              RPA开发 | AI + RPA 方向
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['影刀RPA', 'vibe coding', '网络爬虫', '数据分析', 'COZE&workflow', '大模型接口调用'].map(tag => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              专注于AI与RPA技术的融合应用，致力于开发高效、智能的业务流程自动化解决方案，
              帮助企业提升运营效率，降低人工成本。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                aria-label="查看GitHub"
              >
                <Github size={18} />
                <span>查看GitHub</span>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="访问个人博客"
              >
                <ExternalLink size={18} />
                <span>个人博客</span>
              </motion.a>
            </div>
          </motion.div>
        </section>
        
        {/* 技术栈展示区 */}
        <section 
          ref={el => sections.current.skills = el}
          className="py-16"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">技术栈</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                精通RPA、AI及全栈开发技术，持续学习和探索新技术领域
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* 技术分布饼图 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4">技术分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={TECH_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {TECH_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* RPA&自动化技术 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">RPA&自动化技术</h3>
                <div className="space-y-4">
                  {SKILLS.filter(skill => skill.category === 'rpa').map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          viewport={{ once: true }}
                          className="h-full bg-blue-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* AI和其他技术 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* AI辅助开发能力 */}
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">AI辅助开发能力</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.filter(skill => skill.category === 'ai').map((skill) => (
                      <span 
                        key={skill.name}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 编程语言能力 */}
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">编程语言能力</h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.filter(skill => skill.category === 'other').map((skill) => (
                      <span 
                        key={skill.name}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* 项目展示区 */}
        <section 
          ref={el => sections.current.projects = el}
          className="py-16"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">项目展示</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                精选个人项目，涵盖RPA、AI和全栈开发等多个领域
              </p>
              
              {/* 项目筛选 */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !activeCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  全部项目
                </button>
                <button
                  onClick={() => setActiveCategory('rpa')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === 'rpa' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  RPA项目
                </button>
                <button
                  onClick={() => setActiveCategory('ai')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === 'ai' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  AI项目
                </button>
                <button
                  onClick={() => setActiveCategory('other')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === 'other' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  其他项目
                </button>
              </div>
            </motion.div>
            
            {/* 项目列表 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="h-48 overflow-hidden">
                    {/* 为每个项目生成相关图片 */}
                    <img 
                      src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(project.name)}`}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{project.description}</p>
                    
                    {/* 技术栈标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map(tech => (
                        <span 
                          key={tech}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* 项目成果 */}
                    {project.achievements && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {project.achievements.map((achievement, i) => (
                          <div 
                            key={i}
                            className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-center"
                          >
                            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.title}</p>
                            <p className="font-bold">{achievement.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* 项目链接 */}
                    <div className="flex justify-between mt-4">
                      {project.repo && (
                        <a 
                          href={project.repo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="查看代码仓库"
                        >
                          <Github size={16} />
                          <span>代码仓库</span>
                        </a>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="查看项目"
                        >
                          <ExternalLink size={16} />
                          <span>查看项目</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 空状态处理 */}
              {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">没有找到匹配的项目</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
         {/* 学习历程区 */}
         <section 
           ref={el => sections.current.timeline = el}
           className="py-16"
         >
           <div className="max-w-4xl mx-auto">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="text-center mb-12"
             >
               <h2 className="text-3xl md:text-4xl font-bold mb-4">学习历程</h2>
               <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                 记录技术成长的重要节点和里程碑
               </p>
             </motion.div>
             
              <div className="relative">
                {/* 时间线 */}
                <motion.div 
                  className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-500/30 dark:bg-blue-500/20"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                ></motion.div>
                
                {/* 时间线项目 */}
                <div className="space-y-16 relative">
                  {TIMELINE.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative flex flex-col md:items-center"
                    >
                      {/* 中心圆点 */}
                      <motion.div 
                        className="absolute left-1/2 transform -translate-x-1/2 z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.2,
                          type: "spring",
                          stiffness: 300,
                          damping: 10
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </motion.div>
                      
                      {/* 年份标签 */}
                      <motion.div 
                        className="absolute left-1/2 transform -translate-x-1/2 -top-12"
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium shadow-sm">
                          {item.year}
                        </span>
                      </motion.div>
                      
                      {/* 内容区域 - 偶数在左，奇数在右 */}
                      <motion.div 
                        className={`mt-12 md:w-1/2 ${
                          index % 2 === 0 
                            ? 'md:pr-16 md:text-right md:ml-auto md:mr-0' 
                            : 'md:pl-16 md:ml-0 md:mr-auto'
                        }`}
                        initial={{ 
                          x: index % 2 === 0 ? 50 : -50,
                          opacity: 0
                        }}
                        whileInView={{ 
                          x: 0, 
                          opacity: 1 
                        }}
                        transition={{ 
                          duration: 0.7, 
                          delay: 0.3
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <div className={`p-6 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 ${
                          index % 2 === 0 
                            ? 'md:mr-6' 
                            : 'md:ml-6'
                        }`}>
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
           </div>
         </section>
        
        {/* 未来规划区 */}
        <section 
          ref={el => sections.current.plans = el}
          className="py-16 mb-8"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">未来规划</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                职业发展的短期、中期和长期目标
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLANS.map((plan, index) => {
                let colorClass = '';
                let icon = '';
                
                switch(plan.period) {
                  case 'short':
                    colorClass = 'bg-blue-500';
                    icon = '🚀';
                    break;
                  case 'medium':
                    colorClass = 'bg-green-500';
                    icon = '📈';
                    break;
                  case 'long':
                    colorClass = 'bg-purple-500';
                    icon = '🌟';
                    break;
                  default:
                    colorClass = 'bg-gray-500';
                    icon = '🎯';
                }
                
                return (
                  <motion.div
                    key={plan.period}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
                  >
                    <div className={`${colorClass} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{plan.title}</h3>
                        <span className="text-2xl">{icon}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 个人项目展示网站 | 使用 React + TypeScript + Tailwind CSS 构建
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="GitHub">
              <i className="fab fa-github text-xl"></i>
            </a>
            <a href="#" className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="LinkedIn">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="#" className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="Twitter">
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}