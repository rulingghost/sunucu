import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star, Quote } from 'lucide-react';

export default function TestimonialsFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const testimonials = [
    {
      name: 'Mert Aksoy',
      company: 'OmniCore Gaming Network',
      role: 'Baş Sistem Mimarı',
      text: 'Hong Kong lokasyonundaki Ryzen 9 sunucularımız sayesinde Asya ve Doğu Avrupa oyuncu kitlemizde 0 paket kaybı ve inanılmaz düşük ping yakaladık. DDoS saldırılarını fark etmiyoruz bile.',
      rating: 5
    },
    {
      name: 'Dr. Selin Yurtsever',
      company: 'Aetheria AI Labs',
      role: 'CTO & Kurucu Ortak',
      text: 'NovaQ Servers’ın RTX 4090 ve L40S GPU sunucularında büyük dil modellerimizi (LLM) eğitiyoruz. Müşteri paneli üzerinden tek tıkla snapshot alabilmek ve canlı konsola bağlanmak mükemmel.',
      rating: 5
    },
    {
      name: 'Barış Güneş',
      company: 'FinTrack Bilişim A.Ş.',
      role: 'Altyapı Direktörü',
      text: 'Frankfurt Equinix kabinindeki Dedicated EPYC sunucumuz 14 aydır 1 saniye dahi kesintiye uğramadı. 7/24 ticket sistemindeki NOC mühendisleri en karmaşık BGP rDNS taleplerimizi 15 dakikada çözdü.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'Hangi veri merkezlerinde sunucu kiralayabilirim?',
      a: 'NovaQ Servers olarak sunucularımızı stratejik üç küresel merkezde barındırıyoruz: Almanya (Frankfurt - Equinix FR2), Hong Kong (Equinix HK1) ve Fransa (Paris / Gravelines - OVH Campus). Sipariş verirken dilediğiniz veri merkezini tek tıkla seçebilirsiniz.'
    },
    {
      q: 'Domain (alan adı) satışı yapıyor musunuz?',
      a: 'Hayır. NovaQ Servers olarak yalnızca yüksek performanslı sunucu kiralama, NVMe Bulut VDS, Dedicated Bare-Metal ve GPU altyapılarına odaklanmış durumdayız. Domain satın alma hizmetimiz bulunmamaktadır; mevcut alan adınızı sunucunuzun tahsis edilen statik IP adresine veya ad sunucularına (DNS) kolaylıkla yönlendirebilirsiniz.'
    },
    {
      q: 'Fiyatlandırma döngüleri ve indirimler nasıl işliyor?',
      a: 'Tüm fiyatlarımız Amerikan Doları ($) cinsindendir. Aylık standart periyodun yanı sıra, 3 Aylık (%5 İndirim), 6 Aylık (%8 İndirim) ve 1 Yıllık (%13 İndirim) avantajlı faturalandırma seçenekleri sunulmaktadır. İndirimler paket seçiminde ve sepette anında yansıtılır.'
    },
    {
      q: 'DDoS koruması fiyata dahil mi?',
      a: 'Evet. Tüm sanal ve fiziksel sunucularımızda 3.2 Tbps kapasiteli donanımsal Voxility ve Arbor Networks DDoS koruması varsayılan ve tamamen ücretsiz olarak aktiftir. Oyun sunucuları veya hassas API servisleri için ek L7 özel filtre profilleri de seçilebilir.'
    },
    {
      q: 'Müşteri panelinden hangi sunucu işlemlerini yapabilirim?',
      a: 'NovaQ Servers Müşteri Paneli üzerinden; sunucunuzu Başlatma, Yeniden Başlatma, Kapatma, Canlı Web SSH / VNC Terminaline bağlanma, anlık CPU/RAM/Disk metriklerini izleme, Ters DNS (rDNS) atama, 1 tıkla işletim sistemi yeniden kurulumu ve anlık Snapshot alma gibi tüm kurumsal yönetim işlemlerini gerçekleştirebilirsiniz.'
    }
  ];

  return (
    <section className="catalog-section" id="faq">
      <div className="container">
        {/* Testimonials */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-pill">
            <Star size={14} />
            <span>Müşteri Deneyimleri</span>
          </div>
          <h2 className="section-title">
            Kurumsal Müşterilerimizin <span className="grad-cyber-text">Görüşleri</span>
          </h2>
        </div>

        <div className="plans-grid" style={{ marginBottom: '6rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="plan-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(t.rating)].map((_, r) => (
                  <Star key={r} size={16} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                  {t.role} • {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="section-header">
          <div className="section-pill">
            <HelpCircle size={14} />
            <span>Merak Edilenler</span>
          </div>
          <h2 className="section-title">
            Sıkça Sorulan <span className="grad-cyber-text">Sorular</span>
          </h2>
          <p className="section-desc">
            NovaQ Servers sunucu kiralama süreçleri, donanımlar ve müşteri paneli hakkında 
            sıkça karşılaşılan soruların yanıtları.
          </p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                <div 
                  className="faq-header"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span className="faq-question">{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--accent-cyan)" /> : <ChevronDown size={20} color="#94a3b8" />}
                </div>
                {isOpen && (
                  <div className="faq-body">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
