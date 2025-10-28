// ==========================================================
// MODUL UCAPAN TAMU (WishesModule)
// Bertanggung jawab untuk mengambil dan menampilkan data ucapan
// ==========================================================

const WishesModule = (() => {

    // ⚠️ GANTI DENGAN GAS URL LU YANG UDAH DI-DEPLOY!
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbysWtMf0gZZglN8fNCcniP8KC7dBaBMgapZSI7mY-HMUlovJ636LSPxolcawb8WUwXi/exec';

    // Utility sederhana untuk mencegah XSS (Cross-Site Scripting)
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        // Menggunakan util.escapeHtml dari app.js jika sudah ada dan di-export
        if (typeof util !== 'undefined' && util.escapeHtml) {
            return util.escapeHtml(unsafe);
        }
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Fungsi untuk menampilkan data ke HTML
    const renderWishes = (wishes) => {
        const wishesContainer = document.getElementById('wishes-container');
        wishesContainer.innerHTML = ''; // Kosongkan container

        if (wishes.length === 0) {
            wishesContainer.innerHTML = '<p class="text-muted">Belum ada ucapan dari tamu.</p>';
            return;
        }

        // Tampilkan ucapan terbaru di atas (opsional, bisa lu hapus kalau mau yang lama di atas)
        wishes.reverse();

        wishes.forEach(wish => {
            // Asumsi kolom dari Google Sheet (sudah di-lowercase oleh GAS): 'tanggal', 'nama', 'ucapan', 'kehadiran'
            
            // Konversi tanggal (diasumsikan kolom 'tanggal' di Sheet berisi timestamp yang valid)
            let dateStr = wish.tanggal ? new Date(wish.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
            }) : 'Baru Saja';

            // Tentukan badge kehadiran
            const statusKehadiran = wish.status ? String(wish.status).toLowerCase() : '';
            const badge = statusKehadiran === 'hadir'
                ? '<span class="badge text-bg-success">Hadir</span>'
                : '<span class="badge text-bg-warning">Doa Terbaik</span>';

            const cardHtml = `
                <div class="col-lg-6 col-md-12">
                    <div class="card shadow-lg h-100 border-0" style="background-color: #ffe2e6;">
                        <div class="card-body text-start">
                            <p class="card-title text-pink-dark">
                                ${escapeHtml(wish.nama)} 
                                ${badge}
                            </p>
                            <p class="card-text">
                                ${escapeHtml(wish.ucapan)}
                            </p>
                        </div>
                        <div class="card-footer text-end text-muted small border-0" style="background-color: transparent;">
                            ${dateStr}
                        </div>
                    </div>
                </div>
            `;
            wishesContainer.innerHTML += cardHtml;
        });
    };


    // Fungsi utama untuk fetch data
    const fetchWishes = async () => {
        const wishesContainer = document.getElementById('wishes-container');
        const spinner = document.querySelector('#ucapan .spinner-border');
        
        // Tampilkan spinner
        if (spinner) spinner.style.display = 'block';
        if (wishesContainer) wishesContainer.innerHTML = '';

        try {
            // Panggil GAS dengan parameter action=getWishes
            const response = await fetch(GAS_URL + '?action=getWishes'); 
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data ucapan (HTTP Error).');
            }
            
            const data = await response.json(); 
            
            // Sembunyikan spinner
            if (spinner) spinner.style.display = 'none';

            // Render data yang sudah didapat
            renderWishes(data);

        } catch (error) {
            console.error("Error fetching wishes:", error);
            // Tampilkan pesan error jika gagal
            if (spinner) spinner.style.display = 'none'; 
            if (wishesContainer) wishesContainer.innerHTML = '<p class="text-danger">Gagal memuat ucapan. Silakan coba refresh.</p>';
        }
    };
    
    // Eksport fungsi yang bisa dipanggil dari luar (app.js)
    return {
        fetchWishes: fetchWishes
    };
})();