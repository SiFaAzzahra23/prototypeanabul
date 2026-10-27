// ==========================================================
// PENGINGAT MAKAN & SUSU - KHUSUS 1 KUCING: MILKY 🐱🍼
// FITUR: EDIT PROFIL, GANTI JENIS KELAMIN & KELOLA FOTO
// ==========================================================

// Bersihkan cache lama jika ada
['pet_tracker_pets', 'pet_tracker_activities', 'pet_tracker_schedules', 'milky_pet_tracker_pets'].forEach(k => {
  try { localStorage.removeItem(k); } catch (e) {}
});

// Milky: Data Utama Peliharaan
const defaultMilky = {
  id: "pet-milky",
  name: "Milky",
  species: "Kucing",
  breed: "British Shorthair Kitten",
  age: "2.5 Bulan",
  weight: "1.2 kg",
  gender: "Betina",
  avatar: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80",
  statusText: "🟢 Sehat, Manja & Aktif",
  targetMilkSessions: 4,
  targetMilkVolume: 240, // ml KMR per hari
  targetFoodSessions: 3,
  targetFoodWeight: 90, // gram makanan basah per hari
  notes: "Kitten Milk Replacer (KMR) bebas laktosa hangat kuku (~36-38°C). Jangan berikan susu sapi biasa.",
  dailyProgress: {
    milkDone: 3,
    milkCurrentVolume: 180,
    foodDone: 2,
    foodCurrentWeight: 60
  },
  gallery: [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80"
  ]
};

// Aktivitas Awal Khusus Milky
const defaultActivities = [
  {
    id: "act-1",
    type: "milk",
    title: "Minum Susu Siang",
    portion: "60 ml KMR Hangat",
    timeStr: "11:30 WIB",
    relativeTime: "1 jam yang lalu",
    note: "Dihisap lahap dengan botol dot, bersendawa lancar."
  },
  {
    id: "act-2",
    type: "food",
    title: "Makan Siang Kitten Mousse",
    portion: "30 gr Wet Food",
    timeStr: "12:15 WIB",
    relativeTime: "40 mnt yang lalu",
    note: "Sangat lahap dan mendengkur puas."
  },
  {
    id: "act-3",
    type: "snack",
    title: "Camilan Creamy Snack",
    portion: "1 Stik Creamy Treat",
    timeStr: "09:30 WIB",
    relativeTime: "Pagi tadi",
    note: "Diberikan sehabis bermain kejar bola bulu."
  },
  {
    id: "act-4",
    type: "milk",
    title: "Susu Pagi Milky",
    portion: "60 ml KMR Hangat",
    timeStr: "07:00 WIB",
    relativeTime: "Pagi tadi",
    note: "Kondisi ceria, pup normal padat."
  }
];

// Jadwal & Alarm Harian Khusus Milky
const defaultSchedules = [
  {
    id: "sch-1",
    time: "07:00",
    timeLabel: "07:00 WIB",
    type: "milk",
    title: "Susu Pagi Milky",
    portion: "60 ml (KMR)",
    enabled: true
  },
  {
    id: "sch-2",
    time: "08:30",
    timeLabel: "08:30 WIB",
    type: "food",
    title: "Makan Pagi Kitten Mousse",
    portion: "30 gram",
    enabled: true
  },
  {
    id: "sch-3",
    time: "11:30",
    timeLabel: "11:30 WIB",
    type: "milk",
    title: "Susu Siang Milky",
    portion: "60 ml (KMR)",
    enabled: true
  },
  {
    id: "sch-4",
    time: "15:30",
    timeLabel: "15:30 WIB",
    type: "milk",
    title: "Susu Sore Milky",
    portion: "60 ml (KMR)",
    enabled: true
  },
  {
    id: "sch-5",
    time: "17:00",
    timeLabel: "17:00 WIB",
    type: "snack",
    title: "Camilan & Bermain",
    portion: "1 Stik Creamy",
    enabled: false
  },
  {
    id: "sch-6",
    time: "19:00",
    timeLabel: "19:00 WIB",
    type: "food",
    title: "Makan Malam Wet Food",
    portion: "30 gram",
    enabled: true
  },
  {
    id: "sch-7",
    time: "22:00",
    timeLabel: "22:00 WIB",
    type: "milk",
    title: "Susu Malam Pengantar Tidur",
    portion: "60 ml (KMR)",
    enabled: true
  }
];

// State Aplikasi dengan Validasi Bersih
function getCleanPetState() {
  try {
    const raw = localStorage.getItem("milky_app_profile_v3");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...defaultMilky, ...parsed };
      }
    }
  } catch (e) {
    console.error("Gagal membaca profil Milky dari LocalStorage:", e);
  }
  return { ...defaultMilky };
}

let state = {
  pet: getCleanPetState(),
  activities: JSON.parse(localStorage.getItem("milky_app_activities_v3")) || defaultActivities,
  schedules: JSON.parse(localStorage.getItem("milky_app_schedules_v3")) || defaultSchedules,
  currentPage: "dashboard",
  masterAlarmEnabled: true
};

// Simpan data ke LocalStorage
function saveState() {
  localStorage.setItem("milky_app_profile_v3", JSON.stringify(state.pet));
  localStorage.setItem("milky_app_activities_v3", JSON.stringify(state.activities));
  localStorage.setItem("milky_app_schedules_v3", JSON.stringify(state.schedules));
}

// ==========================================================
// TOAST NOTIFIKASI
// ==========================================================
function showToast(message, icon = "✨") {
  const toast = document.getElementById("toastNotice");
  const toastIcon = document.getElementById("toastIcon");
  const toastMsg = document.getElementById("toastMsg");
  
  if (!toast) return;
  toastIcon.textContent = icon;
  toastMsg.textContent = message;
  toast.classList.add("show");
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// ==========================================================
// SAPAAN & JAM DINAMIS
// ==========================================================
function updateGreeting() {
  const greetingEl = document.getElementById("userGreetingText");
  const liveClockEl = document.getElementById("livePhoneClock");
  const now = new Date();
  
  const hours = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  if (liveClockEl) liveClockEl.textContent = `${hours}:${mins}`;

  let greeting = "Selamat Datang";
  let icon = "☀️";
  if (hours >= 4 && hours < 11) {
    greeting = "Selamat Pagi";
    icon = "🌅";
  } else if (hours >= 11 && hours < 15) {
    greeting = "Selamat Siang";
    icon = "☀️";
  } else if (hours >= 15 && hours < 18) {
    greeting = "Selamat Sore";
    icon = "🌤️";
  } else {
    greeting = "Selamat Malam";
    icon = "🌙";
  }

  if (greetingEl) {
    greetingEl.innerHTML = `${icon} ${greeting}, Kak!`;
  }
}

// ==========================================================
// RENDER KARTU PROFIL MILKY DI DASHBOARD (1 HEWAN)
// ==========================================================
function renderPetChips() {
  const container = document.getElementById("petChipsContainer");
  if (!container) return;
  const pet = state.pet || defaultMilky;

  const isMale = pet.gender && pet.gender.includes("Jantan");
  const genderLabel = isMale ? "Jantan ♂" : "Betina ♀";

  container.innerHTML = `
    <div class="milky-hero-card" onclick="switchPage('profile')" title="Buka Profil Lengkap Milky">
      <div class="milky-hero-left">
        <div class="milky-hero-avatar-wrap">
          <img class="milky-hero-avatar" src="${pet.avatar || defaultMilky.avatar}" alt="${pet.name}" onerror="this.src='https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=200&q=80'">
          <div class="milky-hero-online-dot" title="Status Aktif"></div>
        </div>
        <div class="milky-hero-info">
          <h4>${pet.name} 🐾 <span style="font-size:0.75rem; font-weight:600; color:#0369A1;">(${genderLabel})</span></h4>
          <p>${pet.breed || 'British Shorthair Kitten'} • ${pet.age || '2.5 Bulan'}</p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="milky-hero-badge">
          <span>${pet.weight || '1.2 kg'}</span>
        </div>
        <button class="btn-quick-edit-milky" onclick="event.stopPropagation(); openEditProfileModal()" title="Edit Profil Milky Langsung">
          ✏️ Edit
        </button>
      </div>
    </div>
  `;
}

// ==========================================================
// RENDER DASHBOARD
// ==========================================================
function renderDashboard() {
  const pet = state.pet;

  const milkPercent = Math.min(100, Math.round((pet.dailyProgress.milkDone / pet.targetMilkSessions) * 100));
  const foodPercent = Math.min(100, Math.round((pet.dailyProgress.foodDone / pet.targetFoodSessions) * 100));

  // Kartu Susu
  const milkRatioEl = document.getElementById("dashMilkRatio");
  const milkSubEl = document.getElementById("dashMilkSub");
  const milkBarEl = document.getElementById("dashMilkBar");
  const milkPctEl = document.getElementById("dashMilkPercent");
  if (milkRatioEl) milkRatioEl.textContent = `${pet.dailyProgress.milkDone} / ${pet.targetMilkSessions} Sesi`;
  if (milkSubEl) milkSubEl.textContent = `${pet.dailyProgress.milkCurrentVolume} ml dari ${pet.targetMilkVolume} ml`;
  if (milkBarEl) milkBarEl.style.width = `${milkPercent}%`;
  if (milkPctEl) milkPctEl.textContent = `${milkPercent}%`;

  // Kartu Makanan
  const foodRatioEl = document.getElementById("dashFoodRatio");
  const foodSubEl = document.getElementById("dashFoodSub");
  const foodBarEl = document.getElementById("dashFoodBar");
  const foodPctEl = document.getElementById("dashFoodPercent");
  if (foodRatioEl) foodRatioEl.textContent = `${pet.dailyProgress.foodDone} / ${pet.targetFoodSessions} Porsi`;
  if (foodSubEl) foodSubEl.textContent = `${pet.dailyProgress.foodCurrentWeight} gr dari ${pet.targetFoodWeight} gr`;
  if (foodBarEl) foodBarEl.style.width = `${foodPercent}%`;
  if (foodPctEl) foodPctEl.textContent = `${foodPercent}%`;

  // Banner Jadwal Terdekat Milky
  const nextAlarmTimeEl = document.getElementById("nextAlarmTime");
  const nextAlarmDescEl = document.getElementById("nextAlarmDesc");
  
  const activeSchedules = state.schedules.filter(s => s.enabled);
  if (activeSchedules.length > 0) {
    const nextSch = activeSchedules[0];
    if (nextAlarmTimeEl) nextAlarmTimeEl.textContent = nextSch.time;
    if (nextAlarmDescEl) nextAlarmDescEl.textContent = `${nextSch.title} (${nextSch.portion})`;
  } else {
    if (nextAlarmTimeEl) nextAlarmTimeEl.textContent = "--:--";
    if (nextAlarmDescEl) nextAlarmDescEl.textContent = "Semua jadwal Milky hari ini selesai / nonaktif";
  }

  // Render Daftar Aktivitas Terakhir
  renderRecentActivities();
}

function renderRecentActivities() {
  const container = document.getElementById("recentActivitiesList");
  if (!container) return;

  if (state.activities.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 24px 10px; color: var(--text-muted); font-size:0.85rem;">
        Belum ada aktivitas tercatat untuk Milky hari ini.<br>Tekan tombol <strong>+ Catat</strong> di bawah!
      </div>
    `;
    return;
  }

  container.innerHTML = state.activities.slice(0, 6).map(act => {
    let icon = "🍼";
    let iconClass = "milk";
    if (act.type === "food") {
      icon = "🥩";
      iconClass = "food";
    } else if (act.type === "snack") {
      icon = "🍪";
      iconClass = "snack";
    }

    return `
      <div class="activity-item ${iconClass}">
        <div class="activity-icon-wrap">
          ${icon}
        </div>
        <div class="activity-content">
          <div class="activity-title-row">
            <span class="activity-title">${act.title}</span>
            <span class="activity-time">${act.timeStr}</span>
          </div>
          <div class="activity-sub">
            <span class="pet-mini-badge">Milky 🐱</span>
            <span>• ${act.portion}</span>
          </div>
          ${act.note ? `<div style="font-size:0.7rem; color:#64748B; margin-top:3px; font-style:italic;">"${act.note}"</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================
// RENDER PROFIL MILKY & FOTO
// ==========================================================
function renderProfile() {
  const pet = state.pet;

  const avatarImg = document.getElementById("profileAvatarImg");
  const petName = document.getElementById("profilePetName");
  const petBreed = document.getElementById("profilePetBreed");
  const petAge = document.getElementById("profileStatAge");
  const petWeight = document.getElementById("profileStatWeight");
  const petGender = document.getElementById("profileStatGender");
  const petStatus = document.getElementById("profileStatusText");

  if (avatarImg) avatarImg.src = pet.avatar;
  if (petName) petName.textContent = pet.name;
  if (petBreed) petBreed.textContent = `${pet.species} • ${pet.breed}`;
  if (petAge) petAge.textContent = pet.age;
  if (petWeight) petWeight.textContent = pet.weight;
  if (petGender) petGender.textContent = pet.gender || "Betina";
  if (petStatus) petStatus.textContent = pet.statusText;

  // Kebutuhan Nutrisi
  const nutMilkTarget = document.getElementById("nutTargetMilk");
  const nutFoodTarget = document.getElementById("nutTargetFood");
  const nutNotes = document.getElementById("nutNotesText");

  if (nutMilkTarget) nutMilkTarget.textContent = `${pet.targetMilkSessions}x Sehari (${pet.targetMilkVolume} ml)`;
  if (nutFoodTarget) nutFoodTarget.textContent = `${pet.targetFoodSessions}x Sehari (${pet.targetFoodWeight} gr)`;
  if (nutNotes) nutNotes.textContent = pet.notes;

  // Galeri
  renderGallery();
}

// Render Galeri dengan fitur Hapus & Jadikan Profil
function renderGallery() {
  const container = document.getElementById("profileGalleryGrid");
  if (!container) return;
  const pet = state.pet;

  const galleryHtml = (pet.gallery || []).map((imgUrl, idx) => `
    <div class="gallery-item">
      <img src="${imgUrl}" alt="Milky foto ${idx+1}" onclick="viewGalleryImage('${imgUrl}')" title="Klik untuk pratinjau">
      <button class="gallery-delete-btn" onclick="event.stopPropagation(); deleteGalleryPhoto(${idx})" title="Hapus foto ini">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="gallery-set-avatar-btn" onclick="event.stopPropagation(); setAsAvatar('${imgUrl}')" title="Jadikan foto profil">
        ⭐ Jadikan Profil
      </button>
    </div>
  `).join('');

  const addPlaceholder = `
    <div class="add-photo-placeholder" onclick="document.getElementById('galleryFileInput').click()" title="Tambah foto baru dari perangkat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
      <span>+ Tambah</span>
    </div>
  `;

  container.innerHTML = galleryHtml + addPlaceholder;
}

function viewGalleryImage(url) {
  showToast("Pratinjau foto Milky dibuka!", "📸");
}

// Tambah foto ke galeri dari perangkat lokal
function handleGalleryUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    if (!state.pet.gallery) state.pet.gallery = [];
    state.pet.gallery.unshift(evt.target.result);
    saveState();
    renderGallery();
    showToast("Foto baru berhasil ditambahkan ke galeri! 🎉", "📸");
  };
  reader.readAsDataURL(file);
}

// Hapus foto dari galeri
function deleteGalleryPhoto(idx) {
  if (confirm("Hapus foto ini dari galeri Milky?")) {
    state.pet.gallery.splice(idx, 1);
    saveState();
    renderGallery();
    showToast("Foto berhasil dihapus dari galeri", "🗑️");
  }
}

// Jadikan salah satu foto galeri sebagai foto profil utama
function setAsAvatar(url) {
  state.pet.avatar = url;
  saveState();
  renderProfile();
  renderDashboard();
  renderPetChips();
  showToast("Foto galeri berhasil dijadikan foto profil Milky!", "✨");
}

// Ganti foto profil langsung dari klik avatar di profil
function handleDirectAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    state.pet.avatar = evt.target.result;
    // Tambahkan juga ke galeri otomatis
    if (!state.pet.gallery) state.pet.gallery = [];
    state.pet.gallery.unshift(evt.target.result);
    saveState();
    renderProfile();
    renderDashboard();
    renderPetChips();
    showToast("Foto profil Milky berhasil diperbarui! 📸", "✨");
  };
  reader.readAsDataURL(file);
}

// Ganti foto profil dari dalam modal edit
function handleModalAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const preview = document.getElementById("editPetAvatarPreview");
    if (preview) preview.src = evt.target.result;
    showToast("Foto baru siap disimpan", "📷");
  };
  reader.readAsDataURL(file);
}

// ==========================================================
// CATAT AKTIVITAS KHUSUS MILKY
// ==========================================================
let currentActivityType = "milk";

function setActivityType(type) {
  currentActivityType = type;

  document.querySelectorAll(".type-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.type === type) {
      btn.classList.add("active");
    }
  });

  const portionChipsContainer = document.getElementById("quickPortionContainer");
  const portionInput = document.getElementById("formPortionInput");
  const portionLabel = document.getElementById("formPortionLabel");

  if (type === "milk") {
    portionLabel.textContent = "Takaran Susu KMR (ml):";
    portionInput.value = "60 ml";
    portionChipsContainer.innerHTML = `
      <div class="portion-chip" onclick="setPortion('40 ml')">40 ml</div>
      <div class="portion-chip active" onclick="setPortion('60 ml')">60 ml</div>
      <div class="portion-chip" onclick="setPortion('80 ml')">80 ml</div>
      <div class="portion-chip" onclick="setPortion('100 ml')">100 ml</div>
    `;
  } else if (type === "food") {
    portionLabel.textContent = "Porsi Makanan Basah (gram):";
    portionInput.value = "30 gram";
    portionChipsContainer.innerHTML = `
      <div class="portion-chip" onclick="setPortion('20 gram')">20 gram</div>
      <div class="portion-chip active" onclick="setPortion('30 gram')">30 gram</div>
      <div class="portion-chip" onclick="setPortion('40 gram')">40 gram</div>
      <div class="portion-chip" onclick="setPortion('50 gram')">50 gram</div>
    `;
  } else if (type === "snack") {
    portionLabel.textContent = "Takaran Camilan:";
    portionInput.value = "1 Stik Creamy Treat";
    portionChipsContainer.innerHTML = `
      <div class="portion-chip active" onclick="setPortion('1 Stik Creamy Treat')">1 Stik Creamy</div>
      <div class="portion-chip" onclick="setPortion('Freeze Dried Chicken')">Freeze Dried</div>
      <div class="portion-chip" onclick="setPortion('Vitamin Pasta 2cm')">Vitamin Pasta</div>
    `;
  }
}

function setPortion(val) {
  const portionInput = document.getElementById("formPortionInput");
  if (portionInput) portionInput.value = val;

  document.querySelectorAll(".portion-chip").forEach(c => {
    if (c.textContent.trim().toLowerCase() === val.trim().toLowerCase()) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

function setTimePreset(preset) {
  const timeInput = document.getElementById("formTimeInput");
  const now = new Date();

  document.querySelectorAll(".time-preset-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.preset === preset);
  });

  if (preset === "now") {
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${mm}`;
  } else if (preset === "15m") {
    now.setMinutes(now.getMinutes() - 15);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${mm}`;
  } else if (preset === "1h") {
    now.setHours(now.getHours() - 1);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${mm}`;
  }
}

function saveActivity(e) {
  e.preventDefault();

  const portion = document.getElementById("formPortionInput").value.trim();
  const timeVal = document.getElementById("formTimeInput").value || "12:00";
  const note = document.getElementById("formNoteInput").value.trim();
  const pet = state.pet;

  let title = "Minum Susu KMR";
  let icon = "🍼";
  if (currentActivityType === "food") {
    title = "Makan Siang/Malam";
    icon = "🥩";
    pet.dailyProgress.foodDone = Math.min(pet.targetFoodSessions, pet.dailyProgress.foodDone + 1);
    const num = parseInt(portion) || 30;
    pet.dailyProgress.foodCurrentWeight = Math.min(pet.targetFoodWeight, pet.dailyProgress.foodCurrentWeight + num);
  } else if (currentActivityType === "milk") {
    title = "Minum Susu KMR";
    icon = "🍼";
    pet.dailyProgress.milkDone = Math.min(pet.targetMilkSessions, pet.dailyProgress.milkDone + 1);
    const num = parseInt(portion) || 60;
    pet.dailyProgress.milkCurrentVolume = Math.min(pet.targetMilkVolume, pet.dailyProgress.milkCurrentVolume + num);
  } else {
    title = "Camilan & Treat";
    icon = "🍪";
  }

  const newActivity = {
    id: "act-" + Date.now(),
    type: currentActivityType,
    title: `${title} (Milky)`,
    portion: portion,
    timeStr: `${timeVal} WIB`,
    relativeTime: "Baru saja",
    note: note || "Dihabiskan dengan sangat baik"
  };

  state.activities.unshift(newActivity);
  saveState();

  document.getElementById("formNoteInput").value = "";
  showToast(`Aktivitas untuk Milky berhasil dicatat!`, icon);

  setTimeout(() => {
    switchPage("dashboard");
  }, 400);
}

// ==========================================================
// RENDER JADWAL & ALARM KHUSUS MILKY
// ==========================================================
function renderSchedules() {
  const container = document.getElementById("scheduleListContainer");
  if (!container) return;

  if (state.schedules.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 25px; color: var(--text-muted); font-size:0.85rem;">
        Belum ada jadwal alarm Milky. Klik <strong>+ Tambah Jadwal Baru</strong> untuk membuatnya!
      </div>
    `;
    return;
  }

  const sortedSchedules = [...state.schedules].sort((a, b) => a.time.localeCompare(b.time));

  container.innerHTML = sortedSchedules.map(sch => {
    let icon = "🍼";
    let iconClass = "milk";
    if (sch.type === "food") {
      icon = "🥩";
      iconClass = "food";
    } else if (sch.type === "snack") {
      icon = "🍪";
      iconClass = "snack";
    }

    return `
      <div class="schedule-card ${sch.enabled ? '' : 'disabled'}" id="card-${sch.id}">
        <div class="schedule-time-block">
          <div class="schedule-icon-pill ${iconClass}">
            ${icon}
          </div>
          <div class="schedule-details">
            <h4>${sch.time} <span style="font-size:0.75rem; font-weight:600; color:#0369A1;">WIB</span></h4>
            <p>
              <span class="schedule-badge-pet">Milky 🐱</span>
              <span>${sch.title} • ${sch.portion}</span>
            </p>
          </div>
        </div>
        <div class="schedule-controls">
          <label class="switch">
            <input type="checkbox" ${sch.enabled ? 'checked' : ''} onchange="toggleSchedule('${sch.id}', this.checked)">
            <span class="slider"></span>
          </label>
          <button class="btn-delete-schedule" onclick="deleteSchedule('${sch.id}')" title="Hapus Jadwal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleSchedule(schId, isChecked) {
  const sch = state.schedules.find(s => s.id === schId);
  if (sch) {
    sch.enabled = isChecked;
    saveState();
    renderDashboard();
    const card = document.getElementById(`card-${schId}`);
    if (card) {
      card.classList.toggle("disabled", !isChecked);
    }
    showToast(isChecked ? `Alarm Milky ${sch.time} aktif ⏰` : `Alarm Milky ${sch.time} dimatikan 🔕`, isChecked ? "🔔" : "🔕");
  }
}

function deleteSchedule(schId) {
  if (confirm("Hapus jadwal ini?")) {
    state.schedules = state.schedules.filter(s => s.id !== schId);
    saveState();
    renderSchedules();
    renderDashboard();
    showToast("Jadwal berhasil dihapus", "🗑️");
  }
}

function handleAddSchedule(e) {
  e.preventDefault();

  const timeVal = document.getElementById("addSchTime").value;
  const typeVal = document.getElementById("addSchType").value;
  const portionVal = document.getElementById("addSchPortion").value.trim() || "Standar";
  const titleVal = document.getElementById("addSchTitle").value.trim() || "Pengingat Rutin Milky";

  if (!timeVal) {
    alert("Silakan masukkan waktu jam!");
    return;
  }

  const newSchedule = {
    id: "sch-" + Date.now(),
    time: timeVal,
    timeLabel: `${timeVal} WIB`,
    type: typeVal,
    title: titleVal,
    portion: portionVal,
    enabled: true
  };

  state.schedules.push(newSchedule);
  saveState();

  closeModal('modalAddSchedule');
  renderSchedules();
  renderDashboard();
  showToast(`Jadwal Milky pukul ${timeVal} berhasil ditambahkan!`, "⏰");
}

function toggleMasterAlarms(isEnabled) {
  state.masterAlarmEnabled = isEnabled;
  state.schedules.forEach(s => s.enabled = isEnabled);
  saveState();
  renderSchedules();
  renderDashboard();
  showToast(isEnabled ? "Semua alarm Milky aktif 🔔" : "Semua alarm Milky disenyapkan 🔕", isEnabled ? "🔔" : "🔕");
}

// ==========================================================
// MODAL & EDIT PROFIL MILKY (FOTO & JENIS KELAMIN)
// ==========================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

function openEditProfileModal() {
  const pet = state.pet || defaultMilky;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = (val !== undefined && val !== null) ? val : "";
  };

  setVal("editPetName", pet.name || "Milky");
  
  const genderEl = document.getElementById("editPetGender");
  if (genderEl) {
    genderEl.value = (pet.gender && pet.gender.includes("Jantan")) ? "Jantan" : "Betina";
  }

  setVal("editPetBreed", pet.breed || "British Shorthair Kitten");
  setVal("editPetAge", pet.age || "2.5 Bulan");
  setVal("editPetWeight", pet.weight || "1.2 kg");

  const milkVol = parseInt(pet.targetMilkVolume) || 240;
  const milkSes = parseInt(pet.targetMilkSessions) || 4;
  const foodWt = parseInt(pet.targetFoodWeight) || 90;
  const foodSes = parseInt(pet.targetFoodSessions) || 3;

  setVal("editPetMilkVol", milkVol);
  setVal("editPetMilkSessions", milkSes);
  setVal("editPetFoodWeight", foodWt);
  setVal("editPetFoodSessions", foodSes);
  setVal("editPetNotes", pet.notes || "Kitten Milk Replacer (KMR) bebas laktosa hangat kuku (~36-38°C). Jangan berikan susu sapi biasa.");

  const preview = document.getElementById("editPetAvatarPreview");
  if (preview) {
    preview.src = pet.avatar || defaultMilky.avatar;
  }

  openModal('modalEditProfile');
}

function handleSaveProfile(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!state.pet) state.pet = { ...defaultMilky };
  const pet = state.pet;

  const getName = document.getElementById("editPetName");
  const getGender = document.getElementById("editPetGender");
  const getBreed = document.getElementById("editPetBreed");
  const getAge = document.getElementById("editPetAge");
  const getWeight = document.getElementById("editPetWeight");
  const getMilkVol = document.getElementById("editPetMilkVol");
  const getMilkSes = document.getElementById("editPetMilkSessions");
  const getFoodWt = document.getElementById("editPetFoodWeight");
  const getFoodSes = document.getElementById("editPetFoodSessions");
  const getNotes = document.getElementById("editPetNotes");
  const preview = document.getElementById("editPetAvatarPreview");

  if (getName && getName.value.trim()) pet.name = getName.value.trim();
  if (getGender && getGender.value) pet.gender = getGender.value;
  if (getBreed && getBreed.value.trim()) pet.breed = getBreed.value.trim();
  if (getAge && getAge.value.trim()) pet.age = getAge.value.trim();
  if (getWeight && getWeight.value.trim()) pet.weight = getWeight.value.trim();
  if (preview && preview.src) pet.avatar = preview.src;

  pet.targetMilkVolume = (getMilkVol && parseInt(getMilkVol.value)) ? parseInt(getMilkVol.value) : (parseInt(pet.targetMilkVolume) || 240);
  pet.targetMilkSessions = (getMilkSes && parseInt(getMilkSes.value)) ? parseInt(getMilkSes.value) : (parseInt(pet.targetMilkSessions) || 4);
  pet.targetFoodWeight = (getFoodWt && parseInt(getFoodWt.value)) ? parseInt(getFoodWt.value) : (parseInt(pet.targetFoodWeight) || 90);
  pet.targetFoodSessions = (getFoodSes && parseInt(getFoodSes.value)) ? parseInt(getFoodSes.value) : (parseInt(pet.targetFoodSessions) || 3);
  if (getNotes) pet.notes = getNotes.value.trim() || pet.notes;

  saveState();
  closeModal('modalEditProfile');
  renderProfile();
  renderDashboard();
  renderPetChips();
  showToast("Profil Milky berhasil diperbarui! 🎉", "✅");
}

// ==========================================================
// NAVIGASI ANTAR HALAMAN
// ==========================================================
function switchPage(pageKey) {
  state.currentPage = pageKey;

  document.querySelectorAll(".page-view").forEach(page => {
    page.classList.remove("active");
  });

  const targetPage = document.getElementById(`page-${pageKey}`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageKey);
  });

  if (pageKey === "dashboard") renderDashboard();
  if (pageKey === "profile") renderProfile();
  if (pageKey === "schedule") renderSchedules();
  if (pageKey === "record") {
    setTimePreset("now");
  }

  const appContent = document.querySelector(".app-content");
  if (appContent) appContent.scrollTop = 0;
}

// Preview Switcher (Phone Frame vs Full Screen)
function toggleViewMode(mode) {
  const btnPhone = document.getElementById("btnViewPhone");
  const btnFull = document.getElementById("btnViewFull");

  if (mode === "fullscreen") {
    document.body.classList.add("full-screen-mode");
    if (btnFull) btnFull.classList.add("active");
    if (btnPhone) btnPhone.classList.remove("active");
  } else {
    document.body.classList.remove("full-screen-mode");
    if (btnPhone) btnPhone.classList.add("active");
    if (btnFull) btnFull.classList.remove("active");
  }
}

function quickRecordAction(type) {
  switchPage('record');
  setActivityType(type);
}

// ==========================================================
// INISIALISASI SAAT HALAMAN DIMUAT
// ==========================================================
window.addEventListener("DOMContentLoaded", () => {
  updateGreeting();
  setInterval(updateGreeting, 60000);

  renderPetChips();
  renderDashboard();
  renderProfile();
  renderSchedules();
  setActivityType("milk");
  setTimePreset("now");

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        overlay.style.display = "none";
      }
    });
  });
});
