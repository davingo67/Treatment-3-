// script.js

// Ambil elemen DOM
const form = document.getElementById('formPemesanan');
const tbody = document.getElementById('tbodyRiwayat');
const emptyMsg = document.getElementById('emptyMessage');

// State: array data pemesanan
let daftarPesanan = [];
let idCounter = 0;
let idYangDiedit = null; // ID yang sedang dalam mode edit

// --- Fungsi render tabel ---
function renderTabel() {
    tbody.innerHTML = '';

    if (daftarPesanan.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    } else {
        emptyMsg.classList.add('hidden');
    }

    daftarPesanan.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;

        // No
        const tdNo = document.createElement('td');
        tdNo.textContent = index + 1;
        tr.appendChild(tdNo);

        // Jika sedang dalam mode edit untuk item ini
        if (item.id === idYangDiedit) {
            // Mode edit: tampilkan input fields
            // Nama
            const tdNama = document.createElement('td');
            const inputNama = document.createElement('input');
            inputNama.type = 'text';
            inputNama.value = item.nama;
            inputNama.className = 'edit-nama';
            tdNama.appendChild(inputNama);
            tr.appendChild(tdNama);

            // Menu (dropdown)
            const tdMenu = document.createElement('td');
            const selectMenu = document.createElement('select');
            const menuOptions = [
                'Deep Roast Oolong Milk Tea',
                'High Mountain Four Season Oolong Milk Tea',
                'Jasmine Green Milk Tea'
            ];
            menuOptions.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                if (opt === item.menu) option.selected = true;
                selectMenu.appendChild(option);
            });
            selectMenu.className = 'edit-menu';
            tdMenu.appendChild(selectMenu);
            tr.appendChild(tdMenu);

            // Jumlah
            const tdJumlah = document.createElement('td');
            const inputJumlah = document.createElement('input');
            inputJumlah.type = 'number';
            inputJumlah.min = 1;
            inputJumlah.value = item.jumlah;
            inputJumlah.className = 'edit-jumlah';
            tdJumlah.appendChild(inputJumlah);
            tr.appendChild(tdJumlah);

            // Tanggal
            const tdTanggal = document.createElement('td');
            const inputTanggal = document.createElement('input');
            inputTanggal.type = 'date';
            inputTanggal.value = item.tanggal;
            inputTanggal.className = 'edit-tanggal';
            tdTanggal.appendChild(inputTanggal);
            tr.appendChild(tdTanggal);

            // Aksi: tombol Save dan Cancel
            const tdAksi = document.createElement('td');
            tdAksi.className = 'btn-aksi';

            const btnSave = document.createElement('button');
            btnSave.textContent = '💾 Simpan';
            btnSave.className = 'btn-save';
            btnSave.addEventListener('click', () => handleSave(item.id));

            const btnCancel = document.createElement('button');
            btnCancel.textContent = '❌ Batal';
            btnCancel.className = 'btn-cancel';
            btnCancel.addEventListener('click', () => handleCancel());

            tdAksi.appendChild(btnSave);
            tdAksi.appendChild(btnCancel);
            tr.appendChild(tdAksi);
        } else {
            // Mode normal: tampilkan data teks
            const tdNama = document.createElement('td');
            tdNama.textContent = item.nama;
            tr.appendChild(tdNama);

            const tdMenu = document.createElement('td');
            tdMenu.textContent = item.menu;
            tr.appendChild(tdMenu);

            const tdJumlah = document.createElement('td');
            tdJumlah.textContent = item.jumlah + ' gelas';
            tr.appendChild(tdJumlah);

            const tdTanggal = document.createElement('td');
            const dateObj = new Date(item.tanggal + 'T00:00:00');
            tdTanggal.textContent = dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            tr.appendChild(tdTanggal);

            // Aksi: Edit dan Hapus
            const tdAksi = document.createElement('td');
            tdAksi.className = 'btn-aksi';

            const btnEdit = document.createElement('button');
            btnEdit.textContent = '✏️ Edit';
            btnEdit.className = 'btn-edit';
            btnEdit.addEventListener('click', () => handleEdit(item.id));

            const btnHapus = document.createElement('button');
            btnHapus.textContent = '🗑️ Hapus';
            btnHapus.className = 'btn-hapus';
            btnHapus.addEventListener('click', () => handleHapus(item.id));

            tdAksi.appendChild(btnEdit);
            tdAksi.appendChild(btnHapus);
            tr.appendChild(tdAksi);
        }

        tbody.appendChild(tr);
    });
}

// --- Fungsi untuk memulai mode edit ---
function handleEdit(id) {
    // Jika sedang edit item lain, batalkan otomatis
    if (idYangDiedit !== null && idYangDiedit !== id) {
        idYangDiedit = null;
    }
    idYangDiedit = id;
    renderTabel();
}

// --- Fungsi menyimpan perubahan dari mode edit ---
function handleSave(id) {
    const tr = document.querySelector(`tr[data-id="${id}"]`);
    if (!tr) return;

    const inputNama = tr.querySelector('.edit-nama');
    const selectMenu = tr.querySelector('.edit-menu');
    const inputJumlah = tr.querySelector('.edit-jumlah');
    const inputTanggal = tr.querySelector('.edit-tanggal');

    const namaBaru = inputNama.value.trim();
    const menuBaru = selectMenu.value;
    const jumlahBaru = parseInt(inputJumlah.value);
    const tanggalBaru = inputTanggal.value;

    // Validasi
    if (namaBaru === '' || menuBaru === '' || isNaN(jumlahBaru) || jumlahBaru < 1 || tanggalBaru === '') {
        alert('⚠️ Semua field harus diisi dengan benar!');
        return;
    }

    const index = daftarPesanan.findIndex(item => item.id === id);
    if (index === -1) return;

    // Update data
    daftarPesanan[index] = {
        ...daftarPesanan[index],
        nama: namaBaru,
        menu: menuBaru,
        jumlah: jumlahBaru,
        tanggal: tanggalBaru
    };

    idYangDiedit = null;
    renderTabel();
    alert('✅ Data berhasil diperbarui!');
}

// --- Fungsi batal edit ---
function handleCancel() {
    idYangDiedit = null;
    renderTabel();
}

// --- Fungsi hapus (langsung tanpa konfirmasi) ---
function handleHapus(id) {
    if (idYangDiedit !== null) {
        alert('⚠️ Selesaikan edit terlebih dahulu!');
        return;
    }

    daftarPesanan = daftarPesanan.filter(item => item.id !== id);
    renderTabel();
    alert('🗑️ Pesanan berhasil dihapus!');
}

// --- Tambah pesanan baru ---
function tambahPesanan(nama, menu, jumlah, tanggal) {
    if (idYangDiedit !== null) {
        alert('⚠️ Selesaikan edit terlebih dahulu!');
        return false;
    }

    const newItem = {
        id: ++idCounter,
        nama: nama.trim(),
        menu: menu,
        jumlah: jumlah,
        tanggal: tanggal
    };
    daftarPesanan.push(newItem);
    renderTabel();
    alert('✅ Pesanan berhasil ditambahkan!');
    return true;
}

// --- Event submit form ---
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const namaInput = document.getElementById('nama');
    const menuSelect = document.getElementById('menu');
    const jumlahInput = document.getElementById('jumlah');
    const tanggalInput = document.getElementById('tanggal');

    const nama = namaInput.value.trim();
    const menu = menuSelect.value;
    const jumlah = parseInt(jumlahInput.value);
    const tanggal = tanggalInput.value;

    if (nama === '' || menu === '' || isNaN(jumlah) || jumlah < 1 || tanggal === '') {
        alert('⚠️ Semua field wajib diisi dengan benar!');
        return;
    }

    const berhasil = tambahPesanan(nama, menu, jumlah, tanggal);
    if (berhasil) {
        form.reset();
        document.getElementById('jumlah').value = 1;
        document.getElementById('nama').focus();
    }
});

// --- Inisialisasi data contoh ---
function initDataContoh() {
    const contoh = [
        {
            id: ++idCounter,
            nama: 'Ayu Lestari',
            menu: 'Deep Roast Oolong Milk Tea',
            jumlah: 2,
            tanggal: '2026-06-28'
        },
        {
            id: ++idCounter,
            nama: 'Rizky Pratama',
            menu: 'High Mountain Four Season Oolong Milk Tea',
            jumlah: 1,
            tanggal: '2026-06-29'
        },
        {
            id: ++idCounter,
            nama: 'Maya Sari',
            menu: 'Jasmine Green Milk Tea',
            jumlah: 3,
            tanggal: '2026-06-30'
        }
    ];
    daftarPesanan = contoh;
    idYangDiedit = null;
    renderTabel();
}

initDataContoh();