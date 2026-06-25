/**
 * ======================== ملف التطبيق الرئيسي ========================
 * 
 * هذا الملف يحتوي على:
 * 1. منطق تطبيق محمود الكامل
 * 2. معالجة الأحداث والتفاعلات
 * 3. جلب البيانات من API
 * 4. إدارة الحالة والتخزين المحلي
 */

// ======================== متغيرات عامة ========================
let currentLocation = {
    city: 'Cairo',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357
};

let prayerTimes = {};
let nextPrayer = null;
let countdownInterval = null;
let timeInterval = null;
let sabhaCount = 0;

// ======================== التهيئة الأولى ========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 تم بدء تطبيق محمود');
    
    // تحميل الإعدادات المحفوظة
    loadSettings();
    
    // تحديث الوقت الحالي
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // جلب مواقيت الصلاة
    fetchPrayerTimes();
    
    // تحديث المواقيت كل 6 ساعات
    setInterval(fetchPrayerTimes, 6 * 60 * 60 * 1000);
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // تحديث حالة الإنترنت
    updateNetworkStatus();
    
    // تحديث حجم المخزن
    updateStorageInfo();
    
    console.log('✅ تم تحميل التطبيق بنجاح');
});

// ======================== إعداد مستمعي الأحداث ========================
function setupEventListeners() {
    // أزرار التبويبات
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // البحث عن المدينة
    document.getElementById('search-btn').addEventListener('click', searchCity);
    document.getElementById('city-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCity();
    });
    
    // زر GPS
    document.getElementById('gps-btn').addEventListener('click', getUserLocation);
    
    // إعدادات الأذان
    document.getElementById('enable-notification-btn').addEventListener('click', enableNotifications);
    document.getElementById('adhan-volume').addEventListener('input', (e) => {
        document.getElementById('volume-display').textContent = e.target.value + '%';
        StorageManager.set('adhan_volume', e.target.value);
    });
    
    // القرآن والمسبحة
    document.getElementById('sabha-btn').addEventListener('click', incrementSabha);
    document.getElementById('sabha-reset').addEventListener('click', resetSabha);
    document.getElementById('surah-select').addEventListener('change', loadQuranSurah);
    document.getElementById('prev-ayah').addEventListener('click', previousAyah);
    document.getElementById('next-ayah').addEventListener('click', nextAyah);
    
    // الأذكار
    document.querySelectorAll('.athkar-tab').forEach(tab => {
        tab.addEventListener('click', loadAthkar);
    });
    
    // الإعدادات
    document.getElementById('calculation-method').addEventListener('change', (e) => {
        StorageManager.set('calculation_method', e.target.value);
        fetchPrayerTimes();
    });
    
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    
    // تحديث أوقات الإقامة
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
        document.getElementById(`iqama-${prayer}`).addEventListener('change', (e) => {
            StorageManager.set(`iqama_${prayer}`, e.target.value);
            updateIqamaTimes();
        });
    });
}

// ======================== تبديل التبويبات ========================
function switchTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار التبويب المطلوب
    document.getElementById(`${tabName}-section`).classList.add('active');
    
    // تحديث زر التبويب النشط
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // تحميل محتوى التبويب إذا لزم الأمر
    if (tabName === 'quran') {
        loadQuranSurahs();
    } else if (tabName === 'athkar') {
        loadAthkar({ target: document.querySelector('.athkar-tab.active') });
    }
}

// ======================== جلب مواقيت الصلاة من API ========================
async function fetchPrayerTimes() {
    try {
        const method = StorageManager.get('calculation_method', '2');
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const url = `${API_CONFIG.ALADHAN_API}/cal/${year}/${month}?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&method=${method}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            const todayData = data.data[day - 1];
            prayerTimes = todayData.timings;
            
            // حفظ في localStorage
            StorageManager.set('prayer_times', prayerTimes);
            StorageManager.set('location', currentLocation);
            
            // تحديث العرض
            displayPrayerTimes();
            updateNextPrayer();
            updateCountdown();
            
            console.log('✅ تم تحديث مواقيت الصلاة');
        }
    } catch (error) {
        console.error('❌ خطأ في جلب مواقيت الصلاة:', error);
        // استخدام البيانات المحفوظة
        const saved = StorageManager.get('prayer_times');
        if (saved) {
            prayerTimes = saved;
            displayPrayerTimes();
            showToast('تم استخدام البيانات المحفوظة', 'info');
        }
    }
}

// ======================== عرض مواقيت الصلاة ========================
function displayPrayerTimes() {
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunrise'];
    
    prayers.forEach(prayer => {
        if (prayerTimes[prayer]) {
            document.getElementById(`time-${prayer}`).textContent = prayerTimes[prayer];
            
            // عرض وقت الإقامة
            if (prayer !== 'Sunrise') {
                const iqamaMinutes = parseInt(StorageManager.get(`iqama_${prayer.toLowerCase()}`, '10'));
                const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
                const iqamaTime = new Date();
                iqamaTime.setHours(hours, minutes + iqamaMinutes);
                const iqamaStr = String(iqamaTime.getHours()).padStart(2, '0') + ':' + 
                               String(iqamaTime.getMinutes()).padStart(2, '0');
                document.getElementById(`iqama-${prayer}`).textContent = iqamaStr;
            }
        }
    });
}

// ======================== تحديث الوقت الحالي ========================
function updateCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // تحديث العد التنازلي
    updateCountdown();
}

// ======================== تحديث الصلاة القادمة والعد التنازلي ========================
function updateNextPrayer() {
    const now = new Date();
    const prayers = [
        { name: 'الفجر', key: 'Fajr' },
        { name: 'الشروق', key: 'Sunrise' },
        { name: 'الظهر', key: 'Dhuhr' },
        { name: 'العصر', key: 'Asr' },
        { name: 'المغرب', key: 'Maghrib' },
        { name: 'العشاء', key: 'Isha' }
    ];
    
    for (let prayer of prayers) {
        if (prayerTimes[prayer.key]) {
            const [hours, minutes] = prayerTimes[prayer.key].split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0);
            
            if (prayerTime > now) {
                nextPrayer = { name: prayer.name, time: prayerTime, key: prayer.key };
                document.getElementById('next-prayer-name').textContent = prayer.name;
                return;
            }
        }
    }
    
    // إذا لم تكن هناك صلاة متبقية اليوم، الفجر غداً
    nextPrayer = {
        name: 'الفجر (غداً)',
        time: new Date(new Date().setDate(new Date().getDate() + 1)),
        key: 'Fajr'
    };
    document.getElementById('next-prayer-name').textContent = 'الفجر (غداً)';
}

// ======================== العد التنازلي المزدوج ========================
function updateCountdown() {
    if (!nextPrayer) return;
    
    const now = new Date();
    const diff = nextPrayer.time - now;
    
    if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('countdown-adhan').textContent = timeStr;
        
        // العد التنازلي للإقامة (بعد الأذان بـ 10 دقائق تقريباً)
        const iqamaMinutes = parseInt(StorageManager.get(`iqama_${nextPrayer.key.toLowerCase()}`, '10'));
        const iqamaTime = new Date(nextPrayer.time.getTime() + iqamaMinutes * 60000);
        const iqamaDiff = iqamaTime - now;
        
        if (iqamaDiff > 0) {
            const iqamaHours = Math.floor(iqamaDiff / 3600000);
            const iqamaMin = Math.floor((iqamaDiff % 3600000) / 60000);
            const iqamaSec = Math.floor((iqamaDiff % 60000) / 1000);
            
            const iqamaStr = `${String(iqamaHours).padStart(2, '0')}:${String(iqamaMin).padStart(2, '0')}:${String(iqamaSec).padStart(2, '0')}`;
            document.getElementById('countdown-iqama').textContent = iqamaStr;
        }
        
        // تشغيل الأذان عند وصول الوقت
        if (diff < 1000 && diff > 0) {
            triggerAdhan();
        }
    }
}

// ======================== تشغيل الأذان ========================
function triggerAdhan() {
    // التحقق من تفعيل الأذان لهذه الصلاة
    const prayerLower = nextPrayer.key.toLowerCase();
    if (!document.getElementById(`adhan-${prayerLower}`).checked) {
        console.log('⏸️ الأذان معطل لهذه الصلاة');
        return;
    }
    
    console.log('🔊 تشغيل الأذان: ' + nextPrayer.name);
    
    // إظهار إشعار
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('محمود - أذان ' + nextPrayer.name, {
            body: 'حان وقت صلاة ' + nextPrayer.name,
            icon: '🕌'
        });
    }
    
    showToast('⏰ حان وقت صلاة ' + nextPrayer.name, 'success');
    
    // تفعيل الوضع الصامت إذا كان مفعل
    if (document.getElementById('silent-mode').checked) {
        activateSilentMode();
    }
}

// ======================== الوضع الصامت الذكي ========================
function activateSilentMode() {
    console.log('🔇 تفعيل الوضع الصامت لمدة 20 دقيقة');
    showToast('🔇 تم تفعيل الوضع الصامت', 'info');
}

// ======================== البحث عن المدينة ========================
async function searchCity() {
    const searchTerm = document.getElementById('city-search').value.trim();
    
    if (!searchTerm) {
        showToast('⚠️ الرجاء إدخال اسم مدينة', 'warning');
        return;
    }
    
    // البحث في القائمة الشهيرة أولاً
    const results = POPULAR_CITIES.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (results.length > 0) {
        displaySearchResults(results);
    } else {
        showToast('❌ لم يتم العثور على نتائج', 'error');
    }
}

// ======================== عرض نتائج البحث ========================
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    
    results.forEach(city => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `<strong>${city.name}</strong>, ${city.country}`;
        item.addEventListener('click', () => selectCity(city));
        container.appendChild(item);
    });
    
    container.classList.remove('hidden');
}

// ======================== اختيار مدينة ========================
function selectCity(city) {
    currentLocation = city;
    document.getElementById('city-name').textContent = city.name;
    document.getElementById('country-name').textContent = city.country;
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('city-search').value = '';
    
    // جلب مواقيت الصلاة الجديدة
    fetchPrayerTimes();
    showToast('✅ تم تحديث الموقع: ' + city.name, 'success');
}

// ======================== الحصول على موقع المستخدم ========================
async function getUserLocation() {
    try {
        document.getElementById('gps-btn').disabled = true;
        const location = await getLocation();
        
        // محاولة الحصول على اسم المدينة
        currentLocation.latitude = location.latitude;
        currentLocation.longitude = location.longitude;
        
        // استخدام خدمة تحويل الإحداثيات إلى عنوان (يمكن تحسينها)
        document.getElementById('city-name').textContent = 'جاري تحديد الموقع...';
        
        // معاينة: سنستخدم المدينة الافتراضية للآن
        showToast('✅ تم تحديد موقعك الجغرافي', 'success');
        fetchPrayerTimes();
    } catch (error) {
        showToast('❌ ' + error, 'error');
    } finally {
        document.getElementById('gps-btn').disabled = false;
    }
}

// ======================== تفعيل التنبيهات الصوتية ========================
function enableNotifications() {
    requestNotificationPermission();
    requestAudioPermission();
    showToast('✅ تم تفعيل التنبيهات', 'success');
}

// ======================== المسبحة الإلكترونية ========================
function incrementSabha() {
    sabhaCount++;
    document.getElementById('sabha-counter').textContent = sabhaCount;
    
    // حفظ العداد
    StorageManager.set('sabha_count', sabhaCount);
}

function resetSabha() {
    sabhaCount = 0;
    document.getElementById('sabha-counter').textContent = '0';
    StorageManager.set('sabha_count', 0);
    showToast('✅ تم إعادة تعيين المسبحة', 'success');
}

// ======================== القرآن الكريم ========================
function loadQuranSurahs() {
    const select = document.getElementById('surah-select');
    
    QURAN_SURAHS.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.id;
        option.textContent = `${surah.id}. ${surah.name} (${surah.ayahCount} آية)`;
        select.appendChild(option);
    });
}

function loadQuranSurah() {
    const surahId = document.getElementById('surah-select').value;
    
    if (!surahId) {
        document.getElementById('quran-content').innerHTML = '<p class="placeholder-text">اختر سورة لبدء القراءة</p>';
        return;
    }
    
    // محاكاة تحميل القرآن (يمكن ربطها بـ API قرآن)
    const surah = QURAN_SURAHS.find(s => s.id == surahId);
    document.getElementById('quran-content').innerHTML = `
        <h2>${surah.arabicName}</h2>
        <p style="font-size: 16px; line-height: 2; margin: 20px 0;">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ<br><br>
            محتوى السورة سيتم تحميله من API<br>
            <small style="color: var(--text-secondary);">يمكن ربط API Quranic للحصول على النص الكامل</small>
        </p>
    `;
    document.getElementById('ayah-counter').textContent = `السورة ${surah.id} - ${surah.ayahCount} آية`;
}

function previousAyah() {
    showToast('⬅️ الآية السابقة', 'info');
}

function nextAyah() {
    showToast('➡️ الآية التالية', 'info');
}

// ======================== الأذكار الإسلامية ========================
function loadAthkar(e) {
    // إزالة الحالة النشطة من جميع الأزرار
    document.querySelectorAll('.athkar-tab').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const athkarType = e.target.dataset.athkar;
    const athkarList = ATHKAR_DATA[athkarType];
    const container = document.getElementById('athkar-content');
    
    container.innerHTML = '';
    
    athkarList.forEach((athkar, index) => {
        const item = document.createElement('div');
        item.className = 'athkar-item';
        item.innerHTML = `
            <p class="athkar-text">${athkar.text}</p>
            <div>
                <span class="athkar-count">${athkar.count} مرات</span>
                <span class="athkar-note">${athkar.notes}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// ======================== الإعدادات ========================
function loadSettings() {
    // تحميل مستوى الصوت
    const volume = StorageManager.get('adhan_volume', '70');
    document.getElementById('adhan-volume').value = volume;
    document.getElementById('volume-display').textContent = volume + '%';
    
    // تحميل طريقة الحساب
    const method = StorageManager.get('calculation_method', '2');
    document.getElementById('calculation-method').value = method;
    
    // تحميل أوقات الإقامة
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
        const iqama = StorageManager.get(`iqama_${prayer}`, prayer === 'maghrib' ? '5' : '10');
        document.getElementById(`iqama-${prayer}`).value = iqama;
    });
    
    // تحميل العداد
    sabhaCount = StorageManager.get('sabha_count', 0);
    document.getElementById('sabha-counter').textContent = sabhaCount;
    
    // تحميل الموقع المحفوظ
    const location = StorageManager.get('location');
    if (location) {
        currentLocation = location;
        document.getElementById('city-name').textContent = location.city;
        document.getElementById('country-name').textContent = location.country;
    }
    
    // تحميل مواقيت الصلاة المحفوظة
    const times = StorageManager.get('prayer_times');
    if (times) {
        prayerTimes = times;
        displayPrayerTimes();
    }
}

function updateIqamaTimes() {
    displayPrayerTimes();
}

function clearAllData() {
    if (confirm('هل تريد فعلاً مسح جميع البيانات المحفوظة؟')) {
        StorageManager.clear();
        location.reload();
    }
}

// ======================== حالة الإنترنت ========================
function updateNetworkStatus() {
    const statusElement = document.getElementById('offline-status');
    
    if (navigator.onLine) {
        statusElement.textContent = '✅ متصل بالإنترنت';
        statusElement.style.color = 'var(--success-color)';
    } else {
        statusElement.textContent = '❌ غير متصل بالإنترنت';
        statusElement.style.color = 'var(--danger-color)';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// ======================== معلومات التخزين ========================
function updateStorageInfo() {
    const size = StorageManager.getStorageSize();
    document.getElementById('storage-used').textContent = size;
}

// ======================== إخطارات Toast ========================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ======================== تحديث ديناميكي لمواقيت الصلاة ========================
setInterval(() => {
    updateNextPrayer();
    updateCountdown();
}, 1000);

console.log('✅ تم تحميل app.js بنجاح');
