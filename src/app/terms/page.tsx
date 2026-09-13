import type {Metadata} from "next"
import Link from "next/link"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: {absolute: "Ketentuan Layanan — tryoutin"},
    description: "Ketentuan yang berlaku buat kamu kalau pakai tryoutin.",
}

const TermsPage = () => {
    return (
        <LegalShell title="Ketentuan Layanan" description="Terakhir diperbarui: 1 Januari 2026. Perjanjian antara kamu dan tryoutin.">
            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Penerimaan ketentuan</h2>
                <p>
                    Kalau kamu bikin akun atau pakai tryoutin, berarti kamu setuju sama Ketentuan ini. Nggak setuju? Nggak masalah, tapi jangan pakai layanan ini ya.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Akun</h2>
                <p>
                    Kamu yang jagain keamanan akun kamu sendiri. Semua aktivitas yang terjadi di akun itu tanggung jawab kamu juga. Pastiin data yang kamu isi itu bener, dan umur kamu udah sesuai batas minimum yang berlaku buat pakai tryoutin.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Penggunaan yang diperbolehkan</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Jangan bagikan, jual lagi, atau sebarin konten tryout yang udah kamu beli.</li>
                    <li>Jangan curang, jangan scraping, atau ganggu layanan dan pengguna lain.</li>
                    <li>Jangan pakai tryoutin buat hal yang melanggar hukum.</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Langganan &amp; pembayaran</h2>
                <p>
                    Produk berbayar diproses lewat Midtrans. Harga udah keliatan di checkout. Kecuali diwajibkan hukum, bayaran umumnya nggak bisa dikembalikan. Kalau butuh, hubungi kita lewat{" "}
                    <Link href="/contact" className="text-primary hover:underline">halaman kontak</Link>.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Kekayaan intelektual</h2>
                <p>Semua konten tryout, soal, dan pembahasan itu milik tryoutin atau pihak yang ngasih lisensi. Kamu dapat lisensi pribadi yang terbatas buat dipake belajar aja ya.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Penyangkalan &amp; tanggung jawab</h2>
                <p>
                    tryoutin disediain &quot;apa adanya&quot; buat keperluan latihan. Kita nggak njamin kamu bakal lulus ujian. Sejauh diizinkan hukum, tryoutin nggak bertanggung jawab atas kerugian nggak langsung atau konsekuensial dari penggunaan layanan ini.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Penghentian</h2>
                <p>Kita bisa nangguhin atau ngehentikan akun yang ngelanggar Ketentuan ini. Kamu juga bisa berhenti pakai tryoutin dan minta hapus data kamu kapan aja.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Perubahan &amp; hukum yang berlaku</h2>
                <p>Kita bisa update Ketentuan ini sewaktu-waktu. Kalau kamu tetap pakai setelahnya, berarti kamu udah oke ya. Ketentuan ini diatur hukum yang berlaku di wilayah kamu.</p>
            </section>
        </LegalShell>
    )
}

export default TermsPage
