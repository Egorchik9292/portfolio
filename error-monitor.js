const ErrorMonitor = {
    errors: [], 

    init() {
        console.log(' Мониторинг ошибок запущен');
        window.addEventListener('error', (event) => {
            this.captureError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename || window.location.href,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack || 'Нет стека',
                timestamp: new Date().toISOString()
            });
        });
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                type: 'Promise Rejection',
                message: event.reason?.message || 'Ошибка Promise',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });
        this.loadFromStorage();
        
        return this;
    },

    captureError(errorInfo) {
        console.log('Записана ошибка:', errorInfo.type);
        

        this.errors.push(errorInfo);

        if (this.errors.length > 10) {
            this.errors.shift(); 
        }  

        this.saveToStorage();
        
        if (console.error) {
            console.error('Ошибка:', errorInfo);
        }
        
        return errorInfo;
    },
    saveToStorage() {
        try {
            localStorage.setItem('site_errors', JSON.stringify(this.errors));
        } catch (e) {
            console.log('Не сохранилось в память:', e);
        }
    },
    loadFromStorage() {
        try {
            const savedErrors = localStorage.getItem('site_errors');
            if (savedErrors) {
                this.errors = JSON.parse(savedErrors);
                console.log(` Загружено ${this.errors.length} ошибок`);
            }
        } catch (e) {
            console.log('Не загрузилось из памяти:', e);
        }
    },
    getErrors() {
        return this.errors;
    },

    clearErrors() {
        this.errors = [];
        localStorage.removeItem('site_errors');
        console.log('Ошибки очищены');
    }
};

document.addEventListener('DOMContentLoaded', function() {

    ErrorMonitor.init();

    window.ErrorMonitor = ErrorMonitor;
    console.log('Система мониторинга ошибок готова');

    const testErrorBtn = document.getElementById('testErrorBtn');
    if (testErrorBtn) {
        testErrorBtn.onclick = function() {
            try {
                const errorTypes = [
                    () => { throw new Error('Тестовая ошибка: что-то пошло не так'); },
                    () => { const x = undefined; x.someMethod(); },
                    () => { JSON.parse('неправильный JSON'); }
                ];
                const randomFunc = errorTypes[Math.floor(Math.random() * errorTypes.length)];
                randomFunc();
                
            } catch (error) {
                ErrorMonitor.captureError({
                    type: 'Тестовая ошибка',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
                alert(' Ошибка записана в мониторинг');
            }
        };
    }
});