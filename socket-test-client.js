// socket-test-client.js
// عميل اختبار Socket.IO باستخدام Node.js

const io = require('socket.io-client');

// الإعدادات
const SERVER_URL = 'http://localhost:5050';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // ضع JWT token الصحيح هنا

class SocketTestClient {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    async connect(token = JWT_TOKEN) {
        try {
            console.log('🔄 جاري الاتصال بالخادم...');
            
            this.socket = io(SERVER_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling']
            });

            // مستمعي الأحداث
            this.setupEventListeners();
            
            return new Promise((resolve, reject) => {
                this.socket.on('connect', () => {
                    this.connected = true;
                    console.log('✅ تم الاتصال بنجاح!');
                    console.log(`📍 Socket ID: ${this.socket.id}`);
                    resolve();
                });

                this.socket.on('connect_error', (error) => {
                    console.error('❌ فشل الاتصال:', error.message);
                    reject(error);
                });
            });

        } catch (error) {
            console.error('❌ خطأ في الاتصال:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // عند الاتصال
        this.socket.on('connected', (data) => {
            console.log('🎉 رسالة الاتصال:', data);
        });

        // عدد الإشعارات غير المقروءة
        this.socket.on('unread:count', (data) => {
            console.log('📊 عدد الإشعارات غير المقروءة:', data.count);
        });

        // تحديد إشعار كمقروء
        this.socket.on('notification:read', (data) => {
            console.log('✅ تم تحديد الإشعار كمقروء:', data);
        });

        // تحديد كل الإشعارات كمقروءة
        this.socket.on('all:notifications:read', (data) => {
            console.log('✅ تم تحديد جميع الإشعارات كمقروءة:', data);
        });

        // استقبال الإشعارات العامة
        this.socket.on('notification', (data) => {
            console.log('🔔 إشعار جديد:', data);
        });

        // قطع الاتصال
        this.socket.on('disconnect', (reason) => {
            this.connected = false;
            console.log('🔌 تم قطع الاتصال:', reason);
        });

        // الأخطاء
        this.socket.on('error', (error) => {
            console.error('❌ خطأ في Socket:', error);
        });
    }

    // الحصول على عدد الإشعارات غير المقروءة
    getUnreadCount() {
        if (this.connected) {
            this.socket.emit('get:unread:count');
            console.log('📤 تم إرسال طلب عدد الإشعارات غير المقروءة');
        } else {
            console.error('❌ غير متصل بالخادم');
        }
    }

    // تحديد إشعار كمقروء
    markAsRead(notificationId) {
        if (this.connected) {
            this.socket.emit('mark:read', notificationId);
            console.log(`📤 تم إرسال طلب تحديد الإشعار ${notificationId} كمقروء`);
        } else {
            console.error('❌ غير متصل بالخادم');
        }
    }

    // تحديد جميع الإشعارات كمقروءة
    markAllAsRead() {
        if (this.connected) {
            this.socket.emit('mark:all:read');
            console.log('📤 تم إرسال طلب تحديد جميع الإشعارات كمقروءة');
        } else {
            console.error('❌ غير متصل بالخادم');
        }
    }

    // قطع الاتصال
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
            console.log('🔌 تم قطع الاتصال يدوياً');
        }
    }

    // اختبار جميع الوظائف
    async runTests() {
        console.log('🧪 بدء اختبار Socket.IO...');
        
        try {
            // 1. الاتصال
            await this.connect();
            
            // انتظر قليلاً بعد الاتصال
            await this.sleep(1000);
            
            // 2. اختبار عدد الإشعارات
            this.getUnreadCount();
            await this.sleep(1000);
            
            // 3. اختبار تحديد إشعار كمقروء
            this.markAsRead(1);
            await this.sleep(1000);
            
            // 4. اختبار تحديد الكل كمقروء
            this.markAllAsRead();
            await this.sleep(1000);
            
            console.log('🎉 اكتمل الاختبار بنجاح!');
            
        } catch (error) {
            console.error('❌ فشل الاختبار:', error);
        }
    }

    // دالة مساعدة للانتظار
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// دالة للحصول على token من سطر الأوامر
function getTokenFromArgs() {
    const args = process.argv.slice(2);
    const tokenIndex = args.findIndex(arg => arg === '--token' || arg === '-t');
    
    if (tokenIndex !== -1 && args[tokenIndex + 1]) {
        return args[tokenIndex + 1];
    }
    
    return null;
}

// التشغيل
async function main() {
    const token = getTokenFromArgs() || JWT_TOKEN;
    
    if (token === 'YOUR_JWT_TOKEN_HERE') {
        console.error('❌ الرجاء وضع JWT token الصحيح في الكود أو تمريره عبر --token');
        console.log('💡 مثال: node socket-test-client.js --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
        process.exit(1);
    }

    const client = new SocketTestClient();
    
    // تشغيل الاختبارات
    await client.runTests();
    
    // الانتظار ثم قطع الاتصال
    setTimeout(() => {
        client.disconnect();
        process.exit(0);
    }, 5000);
}

// التعامل مع إيقاف التشغيل
process.on('SIGINT', () => {
    console.log('\n👋 تم إيقاف التشغيل...');
    process.exit(0);
});

// التشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    main().catch(console.error);
}

module.exports = SocketTestClient;
