document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');

    // --- 核心变量 ---
    const adminPassword = 'admin'; 
    let articles = [];
    let resources = [];
    let supabase = null;

    // --- 元素获取 ---
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const pageSections = document.querySelectorAll('.page-section');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginBtn = document.getElementById('login-btn');
    const adminPassInput = document.getElementById('admin-password');
    const adminBtn = document.getElementById('adminBtn');
    
    const articlesList = document.getElementById('articles-list');
    const resourcesList = document.getElementById('resources-list');
    
    const saveArticleBtn = document.getElementById('save-article-btn');
    const saveResourceBtn = document.getElementById('save-resource-btn');
    const saveDbBtn = document.getElementById('save-db-config');

    const articleSearch = document.getElementById('article-search');
    const resourceSearch = document.getElementById('resource-search');

    // --- 初始化数据库连接 ---
    function initDB() {
        const defaultUrl = 'https://qrjsykdbgqozsvsjiunq.supabase.co';
        const defaultKey = 'sb_publishable_8hN7rj9qJbxNxY1T5Gbvlg_AaDyiNV9';
        
        const config = JSON.parse(localStorage.getItem('supabase_config')) || { url: defaultUrl, key: defaultKey };

        if (config.url && config.key) {
            try {
                supabase = window.supabase.createClient(config.url, config.key);
                console.log('数据库连接成功');
                loadDataFromDB();
            } catch (e) {
                console.error('数据库连接失败:', e);
                loadDataFromLocal();
            }
        } else {
            loadDataFromLocal();
        }
    }

    async function loadDataFromDB() {
        if (!supabase) return;
        
        // 加载文章
        const { data: artData, error: artErr } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (!artErr) articles = artData;

        // 加载资源
        const { data: resData, error: resErr } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
        if (!resErr) resources = resData;

        renderArticles();
        renderResources();
    }

    function loadDataFromLocal() {
        articles = JSON.parse(localStorage.getItem('articles')) || [
            { id: 1, title: '欢迎来到我的博客', content: '这是本地存储的文章。请在后台配置数据库以实现公网同步。', date: '2025-12-25' }
        ];
        resources = JSON.parse(localStorage.getItem('resources')) || [
            { id: 1, name: 'PCL2 启动器', link: 'https://wwyu.lanzoue.com/ib8ic2puytij', desc: '本地存储的示例资源' }
        ];
        renderArticles();
        renderResources();
    }

    // --- 初始化 ---
    initDB();
    checkAdminRoute();

    // --- URL 路由访问逻辑 ---
    function checkAdminRoute() {
        const isHashAdmin = window.location.hash === '#admin';
        const isQueryAdmin = window.location.search.includes('admin');
        const isPathAdmin = window.location.pathname.endsWith('/admin') || window.location.pathname.endsWith('/admin/');
        
        if (isHashAdmin || isQueryAdmin || isPathAdmin) {
            adminBtn.style.display = 'flex';
        }
    }
    window.addEventListener('hashchange', checkAdminRoute);
    
    // --- 页面切换逻辑 ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            pageSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${target}-section`) section.classList.add('active');
            });
        });
    });

    // --- 搜索逻辑 ---
    articleSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = articles.filter(a => a.title.toLowerCase().includes(term) || a.content.toLowerCase().includes(term));
        renderArticles(filtered);
    });

    resourceSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = resources.filter(r => r.name.toLowerCase().includes(term) || (r.description && r.description.toLowerCase().includes(term)));
        renderResources(filtered);
    });

    // --- 管理员逻辑 ---
    loginBtn.addEventListener('click', () => {
        if (adminPassInput.value === adminPassword) {
            adminLogin.style.display = 'none';
            adminDashboard.style.display = 'block';
            renderArticles();
            renderResources();
            
            // 填充数据库配置表单
            const config = JSON.parse(localStorage.getItem('supabase_config')) || { 
                url: 'https://qrjsykdbgqozsvsjiunq.supabase.co', 
                key: 'sb_publishable_8hN7rj9qJbxNxY1T5Gbvlg_AaDyiNV9' 
            };
            document.getElementById('db-url').value = config.url || '';
            document.getElementById('db-key').value = config.key || '';
        } else {
            alert('密码错误！');
        }
    });

    saveDbBtn.addEventListener('click', () => {
        const url = document.getElementById('db-url').value;
        const key = document.getElementById('db-key').value;
        if (!url || !key) return alert('请填写完整配置');
        
        localStorage.setItem('supabase_config', JSON.stringify({ url, key }));
        alert('配置已保存，正在尝试连接...');
        location.reload();
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
        });
    });

    // --- 发布逻辑 ---
    saveArticleBtn.addEventListener('click', async () => {
        const title = document.getElementById('article-title').value;
        const content = document.getElementById('article-content').value;
        if (!title || !content) return alert('请填写完整信息');
        
        const newArticle = { title, content, date: new Date().toLocaleDateString() };
        
        if (supabase) {
            const { error } = await supabase.from('articles').insert([newArticle]);
            if (error) return alert('发布失败: ' + error.message);
        } else {
            newArticle.id = Date.now();
            articles.unshift(newArticle);
            localStorage.setItem('articles', JSON.stringify(articles));
        }
        
        alert('文章发布成功！');
        document.getElementById('article-title').value = '';
        document.getElementById('article-content').value = '';
        supabase ? loadDataFromDB() : renderArticles();
    });

    saveResourceBtn.addEventListener('click', async () => {
        const name = document.getElementById('resource-name').value;
        const link = document.getElementById('resource-link').value;
        const description = document.getElementById('resource-desc').value;
        if (!name || !link) return alert('请填写完整信息');
        
        const newResource = { name, link, description };
        
        if (supabase) {
            const { error } = await supabase.from('resources').insert([newResource]);
            if (error) return alert('上传失败: ' + error.message);
        } else { 
            newResource.id = Date.now();
            resources.unshift(newResource);
            localStorage.setItem('resources', JSON.stringify(resources));
        }
        
        alert('资源上传成功！');
        document.getElementById('resource-name').value = '';
        document.getElementById('resource-link').value = '';
        document.getElementById('resource-desc').value = '';
        supabase ? loadDataFromDB() : renderResources();
    });

    // --- 渲染逻辑 ---
    function renderArticles(data = articles) {
        articlesList.innerHTML = data.map(article => {
            const displayDate = article.date || (article.created_at ? new Date(article.created_at).toLocaleDateString() : '未知日期');
            return `
                <article class="post-card">
                    <h3>${article.title}</h3>
                    <div class="post-meta">发布于 ${displayDate}</div>
                    <div class="post-content markdown-body">${marked.parse(article.content || '')}</div>
                    ${adminDashboard.style.display === 'block' ? `<button class="delete-btn" onclick="deleteArticle('${article.id}')">删除</button>` : ''}
                </article>
            `;
        }).join('') || '<p>暂无文章</p>';
    }

    function renderResources(data = resources) {
        resourcesList.innerHTML = data.map(res => `
            <div class="resource-item">
                <div class="resource-info">
                    <h4>${res.name}</h4>
                    <p>${res.description || '暂无描述'}</p>
                </div>
                <div class="resource-actions">
                    <a href="${res.link}" target="_blank" class="download-btn">前往下载</a>
                    ${adminDashboard.style.display === 'block' ? `<button class="delete-btn" onclick="deleteResource('${res.id}')">删除</button>` : ''}
                </div>
            </div>
        `).join('') || '<p>暂无资源</p>';
    }

    // --- 全局删除函数 ---
    window.deleteArticle = async (id) => {
        if (!confirm('确定要删除这篇文章吗？')) return;
        if (supabase) {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) return alert('删除失败');
            loadDataFromDB();
        } else {
            articles = articles.filter(a => a.id != id);
            localStorage.setItem('articles', JSON.stringify(articles));
            renderArticles();
        }
    };

    window.deleteResource = async (id) => {
        if (!confirm('确定要删除这个资源吗？')) return;
        if (supabase) {
            const { error } = await supabase.from('resources').delete().eq('id', id);
            if (error) return alert('删除失败');
            loadDataFromDB();
        } else {
            resources = resources.filter(r => r.id != id);
            localStorage.setItem('resources', JSON.stringify(resources));
            renderResources();
        }
    };

    // --- 音乐控制 ---
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (music && musicToggle) {
        let isPlaying = false;
        music.volume = 0.5;
        musicToggle.addEventListener('click', () => {
            if (isPlaying) { music.pause(); musicToggle.classList.remove('playing'); }
            else { music.play().then(() => musicToggle.classList.add('playing')).catch(err => console.error(err)); }
            isPlaying = !isPlaying;
        });
    }

    // 初始化
    initDB();
});