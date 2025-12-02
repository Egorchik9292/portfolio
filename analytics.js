const SimpleAnalytics = {
    events: [],  
    
    init() {
        console.log('Система аналитики запущена');

        this.trackVisit();

        this.trackClicks();

        this.trackFormSubmissions();

        this.trackScrollDepth();

        this.loadFromStorage();
        
        return this;
    },

    trackVisit() {
        const visit = {
            type: 'pageview',
            url: window.location.href,
            referrer: document.referrer || 'прямой вход',
            timestamp: new Date().toISOString(),
            screen: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        this.events.push(visit);
        this.saveToStorage();
        console.log('Записано посещение');
    },

    trackClicks() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const clickData = {
                type: 'click',
                element: target.tagName,
                id: target.id || 'нет',
                class: target.className || 'нет',
                text: target.textContent ? target.textContent.substring(0, 50) : 'нет текста',
                url: window.location.href,
                timestamp: new Date().toISOString(),
                x: event.clientX,
                y: event.clientY
            };
            
            this.events.push(clickData);
            this.saveToStorage();
        });
    },
    trackFormSubmissions() {
        document.addEventListener('submit', (event) => {
            const formData = {
                type: 'form_submit',
                formId: event.target.id || 'неизвестная форма',
                url: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            this.events.push(formData);
            this.saveToStorage();
            console.log('Форма отправлена');
        });
    },
    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if ([25, 50, 75, 100].includes(Math.floor(scrollPercent / 25) * 25)) {
                    const scrollData = {
                        type: 'scroll',
                        depth: maxScroll,
                        url: window.location.href,
                        timestamp: new Date().toISOString()
                    };
                    
                    this.events.push(scrollData);
                    this.saveToStorage();
                }
            }
        });
    },
    saveToStorage() {
        try {
            if (this.events.length > 100) {
                this.events = this.events.slice(-100);
            }
            
            localStorage.setItem('site_analytics', JSON.stringify(this.events));
        } catch (e) {
            console.log('Не сохранилась аналитика:', e);
        }
    },
    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('site_analytics');
            if (savedData) {
                this.events = JSON.parse(savedData);
                console.log(`Загружено ${this.events.length} событий`);
            }
        } catch (e) {
            console.log('Не загрузилась аналитика:', e);
        }
    },
    getReport() {
        const report = {
            totalVisits: this.events.filter(v => v.type === 'pageview').length,
            totalClicks: this.events.filter(v => v.type === 'click').length,
            totalForms: this.events.filter(v => v.type === 'form_submit').length,
            totalScrolls: this.events.filter(v => v.type === 'scroll').length,
            events: this.events
        };
        
        return report;
    },
    showAnalyticsPanel() {
        const report = this.getReport();
        const panel = document.createElement('div');
        panel.id = 'analytics-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #3498db;
            padding: 20px;
            z-index: 10000;
            max-width: 400px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            border-radius: 10px;
            font-family: Arial, sans-serif;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #3498db;">Аналитика сайта</h3>
                <button onclick="document.getElementById('analytics-panel').remove()" 
                        style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">
                    ×
                </button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p style="margin: 8px 0;"><strong>Просмотров:</strong> ${report.totalVisits}</p>
                <p style="margin: 8px 0;"><strong>Кликов:</strong> ${report.totalClicks}</p>
                <p style="margin: 8px 0;"><strong>Форм:</strong> ${report.totalForms}</p>
                <p style="margin: 8px 0;"><strong>Скроллов:</strong> ${report.totalScrolls}</p>
                <p style="margin: 8px 0;"><strong>Всего событий:</strong> ${report.events.length}</p>
            </div>
            
            <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; text-align: center;">
                <button onclick="SimpleAnalytics.clearData(); alert('Данные аналитики очищены!'); document.getElementById('analytics-panel').remove();" 
                        style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    Очистить данные
                </button>
                <button onclick="document.getElementById('analytics-panel').remove()" 
                        style="background: #95a5a6; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    Закрыть
                </button>
            </div>
        `;
        document.body.appendChild(panel);
        console.log('Панель аналитики открыта');
    },
    
    clearData() {
        this.events = [];
        localStorage.removeItem('site_analytics');
        console.log('Данные аналитики очищены');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    SimpleAnalytics.init();
    window.SimpleAnalytics = SimpleAnalytics;
    
    console.log('Система аналитики готова');
});