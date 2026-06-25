/**
 * ======================== ملف الإعدادات الأساسية ========================
 * 
 * هذا الملف يحتوي على:
 * 1. إعدادات API والخدمات الخارجية
 * 2. بيانات الأذكار الإسلامية
 * 3. إعدادات التطبيق الأساسية
 * 4. بيانات السور القرآنية
 */

// ======================== إعدادات API ========================
const API_CONFIG = {
    // Aladhan API لجلب مواقيت الصلاة
    ALADHAN_API: 'https://api.aladhan.com/v1',
    
    // OpenCage API للحصول على اسم المدينة من الإحداثيات
    OPENCAGE_API: 'https://api.opencagedata.com/geocode/v1/json',
    OPENCAGE_KEY: 'YOUR_OPENCAGE_API_KEY', // يجب تعديل هذا المفتاح
    
    // طرق الحساب المختلفة
    CALCULATION_METHODS: {
        '0': 'ISNA',
        '1': 'KARACHI',
        '2': 'KAUST',
        '3': 'MAKKAH',
        '4': 'BAGHDAD',
        '5': 'EGYPT',
        '7': 'EUROPE'
    }
};

// ======================== إعدادات التطبيق العامة ========================
const APP_CONFIG = {
    APP_NAME: 'محمود',
    APP_VERSION: '1.0.0',
    DEFAULT_CITY: 'Cairo', // المدينة الافتراضية
    DEFAULT_COUNTRY: 'Egypt', // الدولة الافتراضية
    DEFAULT_CALCULATION_METHOD: '2', // جامعة أم القرى
    STORAGE_PREFIX: 'mahmoud_', // بادئة للتخزين المحلي
    
    // إعدادات التنبيهات
    NOTIFICATION_SETTINGS: {
        IQAMA_DURATION: 20, // مدة الوضع الصامت (دقيقة)
        NOTIFICATION_ADVANCE: 5 // إظهار التنبيه قبل الأذان بـ (دقائق)
    }
};

// ======================== بيانات الأذكار الإسلامية ========================
const ATHKAR_DATA = {
    morning: [
        {
            text: 'سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته',
            count: 3,
            notes: 'من أذكار الصباح'
        },
        {
            text: 'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت',
            count: 1,
            notes: 'دعاء حسن البصري'
        },
        {
            text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور',
            count: 1,
            notes: 'دعاء الصباح'
        },
        {
            text: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
            count: 7,
            notes: 'حسن الاتكال على الله'
        }
    ],
    
    evening: [
        {
            text: 'سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته',
            count: 3,
            notes: 'من أذكار المساء'
        },
        {
            text: 'اللهم أمسينا وأمسى الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له',
            count: 1,
            notes: 'دعاء المساء'
        },
        {
            text: 'يا حي يا قيوم برحمتك أستغيث',
            count: 10,
            notes: 'من أدعية القرآن'
        }
    ],
    
    prayer: [
        {
            text: 'التحيات لله والصلوات والطيبات السلام عليك أيها النبي ورحمة الله وبركاته',
            count: 1,
            notes: 'التشهد الأول'
        },
        {
            text: 'اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وآل إبراهيم',
            count: 1,
            notes: 'الصلاة على النبي'
        },
        {
            text: 'سبحان ربي العظيم',
            count: 3,
            notes: 'تسبيح الركوع'
        },
        {
            text: 'سبحان ربي الأعلى',
            count: 3,
            notes: 'تسبيح السجود'
        }
    ],
    
    sleep: [
        {
            text: 'بسم الله الرحمن الرحيم (ثم قراءة آية الكرسي)',
            count: 1,
            notes: 'من أعظم أذكار النوم'
        },
        {
            text: 'اللهم أسلمت نفسي إليك، وتوكلت عليك، وفوضت أمري إليك، ورجعت ظهري إليك',
            count: 1,
            notes: 'دعاء النوم'
        },
        {
            text: 'سبحان الله الحمد لله لا إله إلا الله الله أكبر',
            count: 10,
            notes: 'أذكار النوم'
        }
    ]
};

// ======================== ألوان وأيقونات الصلوات ========================
const PRAYER_CONFIG = {
    prayers: {
        'Fajr': {
            name: 'الفجر',
            icon: 'fa-moon',
            color: '#2c3e50',
            arabicName: 'فجر'
        },
        'Sunrise': {
            name: 'الشروق',
            icon: 'fa-sunrise',
            color: '#f39c12',
            arabicName: 'شروق'
        },
        'Dhuhr': {
            name: 'الظهر',
            icon: 'fa-sun',
            color: '#f1c40f',
            arabicName: 'ظهر'
        },
        'Asr': {
            name: 'العصر',
            icon: 'fa-cloud',
            color: '#e74c3c',
            arabicName: 'عصر'
        },
        'Maghrib': {
            name: 'المغرب',
            icon: 'fa-sunset',
            color: '#9b59b6',
            arabicName: 'مغرب'
        },
        'Isha': {
            name: 'العشاء',
            icon: 'fa-star',
            color: '#34495e',
            arabicName: 'عشاء'
        }
    }
};

// ======================== قائمة المدن الشهيرة ========================
const POPULAR_CITIES = [
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Mecca', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262 },
    { name: 'Medina', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692 },
    { name: 'Jerusalem', country: 'Palestine', lat: 31.9454, lng: 35.2284 },
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
    { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 }
];

// ======================== دوال مساعدة للتخزين المحلي ========================
class StorageManager {
    static set(key, value) {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.error('خطأ في حفظ البيانات:', e);
        }
    }

    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(APP_CONFIG.STORAGE_PREFIX + key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('خطأ في استرجاع البيانات:', e);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(APP_CONFIG.STORAGE_PREFIX + key);
        } catch (e) {
            console.error('خطأ في حذف البيانات:', e);
        }
    }

    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(APP_CONFIG.STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('خطأ في مسح البيانات:', e);
        }
    }

    static getStorageSize() {
        try {
            let total = 0;
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(APP_CONFIG.STORAGE_PREFIX)) {
                    total += localStorage.getItem(key).length;
                }
            });
            return (total / 1024).toFixed(2) + ' KB';
        } catch (e) {
            return '0 KB';
        }
    }
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('المتصفح لا يدعم الموقع الجغرافي');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject('خطأ في الحصول على الموقع: ' + error.message);
            }
        );
    });
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('✅ تم السماح بالإشعارات');
            } else {
                console.warn('⚠️ تم رفض الإشعارات');
            }
        });
    }
}

function parseTimeToDate(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

console.log('✅ تم تحميل ملف الإعدادات بنجاح');