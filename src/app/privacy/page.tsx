import type {Metadata} from "next"
import Link from "next/link"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: {absolute: "Kebijakan Privasi — tryoutin"},
    description: "Cara tryoutin ngumpulin, make, dan jaga data kamu.",
}

const PrivacyPage = () => {
    return (
        <LegalShell title="Kebijakan Privasi" description="Terakhir diperbarui: 1 Januari 2026. Cara tryoutin handle data kamu.">
            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Pendahuluan</h2>
                <p>
                    tryoutin (&quot;kita&quot;) bantu kamu latihan ujian lewat tryout simulasi dan latihan. Kebijakan ini jelasin data apa yang kita kumpulin, kenapa, dan pilihan apa yang kamu punya. Kalau kamu pakai tryoutin, berarti kamu setuju sama praktik yang dijelasin di sini ya.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Data yang kita kumpulin</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Data akun dari kamu: nama, email, dan detail autentikasi.</li>
                    <li>Data aktivitas: tryout yang kamu kerjakan, jawaban, skor, dan riwayat belajar buat nampilin performamu.</li>
                    <li>Data pembayaran: di-handle Midtrans (cek bagian Pembayaran di bawah) — kita nggak nyimpen nomor kartu kamu.</li>
                    <li>Data device &amp; usage: analitik dasar buat jalanin dan improve aplikasi.</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Cara kita pakai data kamu</h2>
                <p>
                    Buat jalanin akun kamu, nilai percobaanmu, bikin papan peringkat dan insight performa, proses pembayaran, dan komunikasi soal akun kamu. Kita nggak jual data pribadi kamu ke siapapun.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Pembayaran</h2>
                <p>
                    Pembayaran diproses sama Midtrans. Kalau kamu beli produk, info penagihan yang relevan disimpen Midtrans sesuai kebijakan privasi mereka, bukan sama tryoutin.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Hak kamu</h2>
                <p>
                    Tergantung lokasimu, kamu bisa minta akses, koreksi, atau hapus data pribadi kamu, dan bisa nolak pemrosesan tertentu. Untuk itu, hubungi kita lewat{" "}
                    <Link href="/contact" className="text-primary hover:underline">halaman kontak</Link>.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Penyimpanan data</h2>
                <p>Data akun dan aktivitas kamu kita simpen selama akunmu aktif, dan beberapa saat setelahnya kalau masih perlu buat kewajiban hukum atau operasional.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Perubahan</h2>
                <p>Kita bisa update kebijakan ini sewaktu-waktu. Kalau ada perubahan signifikan, tanggal &quot;Terakhir diperbarui&quot; di atas bakal dicatat.</p>
            </section>
        </LegalShell>
    )
}

export default PrivacyPage
