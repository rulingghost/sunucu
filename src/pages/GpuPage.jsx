import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Layers, 
  Activity, 
  HardDrive, 
  Terminal, 
  Box,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  Globe2
} from 'lucide-react';
import SubpageHeader from '../components/SubpageHeader';
import EnterpriseCtaBanner from '../components/EnterpriseCtaBanner';
import { SERVER_CATEGORIES, BILLING_CYCLES, calculatePlanPrice } from '../data/serverPlans';

export default function GpuPage({ onSelectPlan, onNavigate, onOpenConfigurator }) {
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const gpuCategory = SERVER_CATEGORIES.find(c => c.id === 'gpu-cloud');

  const gpuFaqs = [
    {
      q: 'GPU sunucularında hazır yapay zeka sürücüleri (CUDA / cuDNN) kurulu geliyor mu?',
      a: 'Evet. Siparişiniz esnasında Ubuntu 22.04 LTS (NVIDIA CUDA 12.4 + cuDNN + Docker NV-Container Toolkit) hazır kalıbını seçebilirsiniz. Sunucu açıldığında PyTorch, TensorFlow veya vLLM doğrudan GPU\'ya erişebilir durumdadır.'
    },
    {
      q: 'Ekran kartları sanallaştırılmış mı yoksa fiziksel PCIe geçişli mi (PCIe Passthrough)?',
      a: 'Tüm GPU sunucularımızda PCIe Passthrough teknolojisi kullanılır; NVIDIA kartının tüm VRAM belleği, Tensor çekirdekleri ve CUDA çekirdekleri %100 doğrudan sizin sunucunuza atanır. Performans kaybı %0\'dır.'
    },
    {
      q: 'Büyük Dil Modeli (LLM) fine-tuning ve inference için uygun mu?',
      a: 'Kesinlikle. Llama 3, Mistral, DeepSeek, Stable Diffusion ve ComfyUI gibi modelleri hem inference (çıkarım) hem de LoRA / QLoRA fine-tuning süreçlerinde sıfır darboğaz ile çalıştırabilirsiniz.'
    },
    {
      q: 'Saatlik faturalandırma mevcut mu?',
      a: 'GPU sunucularımızda kurumsal stabilite ve donanım rezervasyonu için aylık ve indirimli çoklu aylık (3, 6, 12 ay) faturalandırma uygulanmaktadır. Kurumsal müşterilerimize özel taahhütlü indirimler sunulmaktadır.'
    }
  ];

  return (
    <div className="subpage-view gpu-subpage-view">
      {/* Subpage Header */}
      <SubpageHeader 
        badge={{
          icon: <Sparkles size={14} />,
          text: 'YAPAY ZEKA, DEEP LEARNING & 3D RENDER'
        }}
        title={<>NVIDIA <span className="text-gradient">Ekran Kartlı GPU Sunucuları</span></>}
        subtitle="Büyük Dil Modelleri (LLM), yapay zeka çıkarımı (inference), model ince ayarı (fine-tuning) ve yüksek hacimli 3D render iş yükleri için NVIDIA RTX 4090 ve Kurumsal L40S Tensor Core altyapısı."
        breadcrumbs={[
          { label: 'Sunucu Çözümleri', pageId: 'gpu' },
          { label: 'Ekran Kartlı Sunucular', active: true }
        ]}
        onNavigate={onNavigate}
        trustPills={[
          { icon: <BrainCircuit size={15} color="#a855f7" />, text: 'PCIe Passthrough %100 Doğrudan VRAM' },
          { icon: <Terminal size={15} color="var(--accent-cyan)" />, text: 'CUDA 12.4 & PyTorch Hazır' },
          { icon: <ShieldCheck size={15} color="#10b981" />, text: '3.2 Tbps DDoS Kalkanı' }
        ]}
      />

      {/* Main Content */}
      <section className="section-padding" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {/* Billing Cycle Discount Selector */}
          <div className="cycle-selector-wrap">
            <span className="cycle-label">Faturalandırma Dönemi:</span>
            <div className="cycle-pills">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  className={`cycle-pill ${selectedCycle === cycle.id ? 'active' : ''}`}
                  onClick={() => setSelectedCycle(cycle.id)}
                >
                  <span>{cycle.label}</span>
                  {cycle.tag && <span className="discount-tag">{cycle.tag}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="plan-grid" style={{ marginTop: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
            {gpuCategory?.plans.map((plan) => {
              const pricing = calculatePlanPrice(plan.basePriceMonthly, selectedCycle);

              return (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="card-ribbon">
                      <span>EN ÇOK TERCİH EDİLEN AI İŞ İSTASYONU</span>
                    </div>
                  )}

                  <div className="card-header">
                    <div className="plan-category-tag">NVIDIA TENSOR CORE GPU</div>
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-processor-pill">
                      <Cpu size={14} />
                      <span>{plan.processor}</span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="card-pricing">
                    <div className="price-row">
                      <span className="currency">$</span>
                      <span className="amount">
                        {pricing.cycle.months > 1
                          ? pricing.planTotal.toLocaleString('tr-TR')
                          : pricing.discountedMonthly.toLocaleString('tr-TR')}
                      </span>
                      <span className="period">
                        /{pricing.cycle.months === 12 ? 'yıl' : pricing.cycle.months > 1 ? `${pricing.cycle.months} ay` : 'ay'}
                      </span>
                    </div>

                    {pricing.cycle.discount > 0 ? (
                      <div className="pricing-saving-badge">
                        <span>%{pricing.cycle.discount} Tasarruf</span>
                        <span className="total-term">
                          Aylık <strong>${pricing.discountedMonthly.toLocaleString('tr-TR')}</strong> eşdeğeri (+ KDV)
                        </span>
                      </div>
                    ) : (
                      <div className="pricing-monthly-note">
                        Aylık taahhütsüz faturalandırma (+ KDV)
                      </div>
                    )}
                  </div>

                  {/* Specs List */}
                  <ul className="card-specs">
                    <li>
                      <BrainCircuit size={16} className="spec-icon" color="#a855f7" />
                      <div>
                        <strong>Grafik İşlemci (GPU):</strong>
                        <span>{plan.gpu}</span>
                      </div>
                    </li>
                    <li>
                      <Cpu size={16} className="spec-icon" />
                      <div>
                        <strong>İşlemci:</strong>
                        <span>{plan.cores}</span>
                      </div>
                    </li>
                    <li>
                      <Layers size={16} className="spec-icon" />
                      <div>
                        <strong>Sistem Belleği (RAM):</strong>
                        <span>{plan.ram}</span>
                      </div>
                    </li>
                    <li>
                      <HardDrive size={16} className="spec-icon" />
                      <div>
                        <strong>NVMe Depolama:</strong>
                        <span>{plan.storage}</span>
                      </div>
                    </li>
                    <li>
                      <Activity size={16} className="spec-icon" />
                      <div>
                        <strong>Bant Genişliği:</strong>
                        <span>{plan.bandwidth}</span>
                      </div>
                    </li>
                    <li>
                      <ShieldCheck size={16} className="spec-icon" />
                      <div>
                        <strong>DDoS Koruması:</strong>
                        <span>{plan.ddos}</span>
                      </div>
                    </li>
                  </ul>

                  {/* Action CTA */}
                  <div className="card-action">
                    <button 
                      type="button"
                      className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
                      onClick={() => onSelectPlan(plan, selectedCycle)}
                    >
                      <span>GPU Sunucuyu Yapılandır</span>
                      <ArrowRight size={16} />
                    </button>
                    <div className="instant-delivery-tag">
                      <Zap size={13} color="#10b981" />
                      <span>Hazır CUDA & PyTorch İmajı ile Anında Teslim</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Software Stack Banner */}
          <div className="gpu-features-banner">
            <div className="banner-title-box">
              <h3>Yapay Zeka ve Makine Öğrenimi İçin Optimize Edilmiş Ortam</h3>
              <p>Karmaşık sürücü kurulumlarıyla zaman kaybetmeyin, projenizi doğrudan çalıştırmaya başlayın.</p>
            </div>
            <div className="banner-features-grid">
              <div className="banner-feature-item">
                <div className="bf-icon emerald"><BrainCircuit size={22} color="#10b981" /></div>
                <h4>LLM & Inference Hazır</h4>
                <p>vLLM, Ollama, TGI ve TensorRT-LLM kütüphaneleriyle yüksek TPS (tokens per second) çıkarım hızı.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon emerald"><Terminal size={22} color="#10b981" /></div>
                <h4>NVIDIA Container Toolkit</h4>
                <p>Docker konteynerleri içinden GPU'ya doğrudan donanımsal erişim sağlayan güncel runtime entegrasyonu.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon emerald"><Flame size={22} color="#10b981" /></div>
                <h4>ECC Korumalı VRAM</h4>
                <p>Uzun soluklu model eğitimlerinde veri bozulmasını engelleyen kurumsal hata düzeltmeli bellek güvencesi.</p>
              </div>
              <div className="banner-feature-item">
                <div className="bf-icon emerald"><Globe2 size={22} color="#10b981" /></div>
                <h4>Frankfurt Equinix AI Cluster</h4>
                <p>Avrupa'nın kalbinde, DE-CIX omurgası üzerinden ultra düşük gecikmeli veri akışı ve yüksek bant genişliği.</p>
              </div>
            </div>
          </div>

          {/* GPU FAQ Section */}
          <div className="subpage-faq-section">
            <div className="section-header text-center" style={{ maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <div className="section-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                <HelpCircle size={13} />
                <span>SIKÇA SORULAN SORULAR</span>
              </div>
              <h2 className="section-title">
                GPU Sunucular Hakkında <span className="text-gradient">Merak Edilenler</span>
              </h2>
            </div>

            <div className="faq-accordion" style={{ maxWidth: '850px', margin: '0 auto' }}>
              {gpuFaqs.map((faq, idx) => (
                <div key={idx} className={`faq-card ${openFaq === idx ? 'open' : ''}`}>
                  <button 
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Enterprise CTA */}
      <EnterpriseCtaBanner 
        onNavigate={onNavigate} 
        onOpenConfigurator={onOpenConfigurator}
      />
    </div>
  );
}
