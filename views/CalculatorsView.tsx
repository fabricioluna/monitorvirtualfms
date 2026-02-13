
import React, { useState, useEffect } from 'react';

type CalcType = 'UC' | 'HabMed' | 'IESC' | 'UCCG';

const CalculatorsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCalc, setActiveCalc] = useState<CalcType>('UC');
  const [result, setResult] = useState<number | null>(null);
  const [extraPoints, setExtraPoints] = useState('');

  // UC (Teórica 4.2 + Prática 3.0 + Tutoria 2.8)
  const [numSps, setNumSps] = useState(6);
  const [spGrades, setSpGrades] = useState<string[]>(Array(6).fill(''));
  const [teoricaTotal, setTeoricaTotal] = useState('30');
  const [teoricaAcertos, setTeoricaAcertos] = useState('');
  const [praticaAnatomia, setPraticaAnatomia] = useState('');
  const [praticaMorfo, setPraticaMorfo] = useState('');

  // IESC (T 1.5 + P 1.0 + E 1.5 + Po 1.0) x 2 semestres
  const [iescGrades, setIescGrades] = useState({
    n1_teorica: '', n1_pratica: '', n1_extensao: '', n1_portfolio: '',
    n2_teorica: '', n2_pratica: '', n2_extensao: '', n2_portfolio: ''
  });

  // UCCG (T 2.5 + E 2.5) x 2 semestres
  const [uccgGrades, setUccgGrades] = useState({
    n1_teorica: '', n1_extensao: '',
    n2_teorica: '', n2_extensao: ''
  });

  // HabMed (T 1.5 + PF 1.0 + PS 2.5) x 2 semestres
  const [habmedGrades, setHabmedGrades] = useState({
    n1_formativa: '', n1_somativa: '', n1_teorica: '',
    n2_formativa: '', n2_somativa: '', n2_teorica: ''
  });

  useEffect(() => {
    setSpGrades(prev => {
      if (numSps > prev.length) return [...prev, ...Array(numSps - prev.length).fill('')];
      return prev.slice(0, numSps);
    });
  }, [numSps]);

  const handleInputChange = (setter: any, field: string, value: string) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value.replace(',', '.'))) {
      setter((prev: any) => ({ ...prev, [field]: value }));
      setResult(null);
    }
  };

  const handleExtraPointsChange = (value: string) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value.replace(',', '.'))) {
      setExtraPoints(value);
      setResult(null);
    }
  };

  // Funções de Cálculo Parcial (Escala 0-10 para visualização)
  const getTutoriaPartial = () => {
    const sps = spGrades.map(v => parseFloat(v.replace(',', '.')) || 0);
    return (sps.reduce((a, b) => a + b, 0) / (sps.length || 1)) / 10; 
  };

  const getTeoricaPartial = () => {
    const total = parseFloat(teoricaTotal) || 1;
    const acertos = parseFloat(teoricaAcertos.replace(',', '.')) || 0;
    return (acertos / total) * 10;
  };

  const getPraticaPartial = () => {
    const a = parseFloat(praticaAnatomia.replace(',', '.')) || 0;
    const m = parseFloat(praticaMorfo.replace(',', '.')) || 0;
    return ((a + m) / 20) * 10;
  };

  // Scores em Escala 0-5.0 (Pois somados dão 10)
  const getIescN1Score = () => {
    const t = parseFloat(iescGrades.n1_teorica.replace(',', '.')) || 0;
    const p = parseFloat(iescGrades.n1_pratica.replace(',', '.')) || 0;
    const e = parseFloat(iescGrades.n1_extensao.replace(',', '.')) || 0;
    const po = parseFloat(iescGrades.n1_portfolio.replace(',', '.')) || 0;
    return (t * 0.15) + (p * 0.10) + (e * 0.15) + (po * 0.10);
  };

  const getIescN2Score = () => {
    const t = parseFloat(iescGrades.n2_teorica.replace(',', '.')) || 0;
    const p = parseFloat(iescGrades.n2_pratica.replace(',', '.')) || 0;
    const e = parseFloat(iescGrades.n2_extensao.replace(',', '.')) || 0;
    const po = parseFloat(iescGrades.n2_portfolio.replace(',', '.')) || 0;
    return (t * 0.15) + (p * 0.10) + (e * 0.15) + (po * 0.10);
  };

  const getUccgN1Score = () => {
    const t = parseFloat(uccgGrades.n1_teorica.replace(',', '.')) || 0;
    const e = parseFloat(uccgGrades.n1_extensao.replace(',', '.')) || 0;
    return (t * 0.25) + (e * 0.25);
  };

  const getUccgN2Score = () => {
    const t = parseFloat(uccgGrades.n2_teorica.replace(',', '.')) || 0;
    const e = parseFloat(uccgGrades.n2_extensao.replace(',', '.')) || 0;
    return (t * 0.25) + (e * 0.25);
  };

  const getHabmedN1Score = () => {
    const f = parseFloat(habmedGrades.n1_formativa.replace(',', '.')) || 0;
    const s = parseFloat(habmedGrades.n1_somativa.replace(',', '.')) || 0;
    const t = parseFloat(habmedGrades.n1_teorica.replace(',', '.')) || 0;
    return (f * 0.10) + (s * 0.25) + (t * 0.15);
  };

  const getHabmedN2Score = () => {
    const f = parseFloat(habmedGrades.n2_formativa.replace(',', '.')) || 0;
    const s = parseFloat(habmedGrades.n2_somativa.replace(',', '.')) || 0;
    const t = parseFloat(habmedGrades.n2_teorica.replace(',', '.')) || 0;
    return (f * 0.10) + (s * 0.25) + (t * 0.15);
  };

  const calculateAverage = () => {
    let baseAverage = 0;
    const extra = parseFloat(extraPoints.replace(',', '.')) || 0;

    if (activeCalc === 'UC') {
      baseAverage = (getTeoricaPartial() * 0.42) + (getPraticaPartial() * 0.30) + (getTutoriaPartial() * 0.28);
    } else if (activeCalc === 'IESC') {
      baseAverage = getIescN1Score() + getIescN2Score();
    } else if (activeCalc === 'UCCG') {
      baseAverage = getUccgN1Score() + getUccgN2Score();
    } else if (activeCalc === 'HabMed') {
      baseAverage = getHabmedN1Score() + getHabmedN2Score();
    }

    setResult(parseFloat((baseAverage + extra).toFixed(2)));
  };

  const inputClass = "w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-[#003366] outline-none text-[#003366] font-bold text-center text-lg transition-all placeholder:text-gray-200 shadow-inner";
  const labelClass = "text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest ml-1";
  const sectionTitleClass = "text-xs font-black text-[#003366] uppercase tracking-[0.2em] mb-4 flex items-center justify-between gap-2 w-full";
  const partialBadgeClass = "bg-[#f4f7f6] px-3 py-1 rounded-lg text-[9px] font-black text-[#003366] border border-gray-100 flex items-center gap-1.5";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <button onClick={onBack} className="group flex items-center text-[#003366] font-bold mb-10 transition-all hover:text-[#D4A017]">
        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Voltar para Home
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-[#003366] uppercase tracking-tighter mb-2">Calculadora de Médias</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Padrão Oficial - Ciclo Acadêmico FMS</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {(['UC', 'HabMed', 'IESC', 'UCCG'] as CalcType[]).map(type => (
          <button 
            key={type} 
            onClick={() => { setActiveCalc(type); setResult(null); }} 
            className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${activeCalc === type ? 'bg-[#003366] text-white border-[#003366] shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
          >
            {type === 'HabMed' ? 'Hab. Médicas' : type === 'UC' ? 'Unidade Curricular' : type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          
          {activeCalc === 'UC' ? (
            <div className="space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-[#D4A017] text-[#003366] w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">1</span> Tutoria (SPs) - Peso 2.8</div>
                  <div className={partialBadgeClass}><span className="opacity-40">MÉDIA:</span><span>{(getTutoriaPartial() * 10).toFixed(2)} / 10</span></div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-[10px] font-black uppercase text-gray-400">Qtd. de SPs:</label>
                  <select value={numSps} onChange={e => setNumSps(parseInt(e.target.value))} className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-[#003366] outline-none border-2 border-transparent focus:border-[#D4A017]">
                    {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} SPs</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {spGrades.map((grade, idx) => (
                    <div key={idx}>
                      <label className="text-[8px] font-black text-gray-300 uppercase mb-1 block">SP {idx + 1}</label>
                      <input type="text" value={grade} onChange={e => { const val = e.target.value; if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val.replace(',', '.'))) { const newG = [...spGrades]; newG[idx] = val; setSpGrades(newG); } }} placeholder="0-100" className={`${inputClass} !p-3 !text-sm`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-[#003366] text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">2</span> Prova Teórica - Peso 4.2</div>
                  <div className={partialBadgeClass}><span className="opacity-40">MÉDIA:</span><span>{getTeoricaPartial().toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Total de Questões Válidas</label><input type="text" value={teoricaTotal} onChange={e => setTeoricaTotal(e.target.value)} placeholder="Ex: 30" className={inputClass} /></div>
                  <div><label className={labelClass}>Suas Questões Corretas</label><input type="text" value={teoricaAcertos} onChange={e => setTeoricaAcertos(e.target.value)} placeholder="Ex: 21" className={inputClass} /></div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">3</span> Prova Prática - Peso 3.0</div>
                  <div className={partialBadgeClass}><span className="opacity-40">MÉDIA:</span><span>{getPraticaPartial().toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Anatomia (0 a 10 Acertos)</label><input type="text" value={praticaAnatomia} onChange={e => { const val = e.target.value; if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val.replace(',', '.'))) setPraticaAnatomia(val); }} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Morfofuncional (0 a 10 Acertos)</label><input type="text" value={praticaMorfo} onChange={e => { const val = e.target.value; if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val.replace(',', '.'))) setPraticaMorfo(val); }} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
            </div>
          ) : activeCalc === 'IESC' ? (
            <div className="space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-green-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N1</span> Semestre 1 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N1:</span><span>{(getIescN1Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teórica (1.5)</label><input type="text" value={iescGrades.n1_teorica} onChange={e => handleInputChange(setIescGrades, 'n1_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática (1.0)</label><input type="text" value={iescGrades.n1_pratica} onChange={e => handleInputChange(setIescGrades, 'n1_pratica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Extensão (1.5)</label><input type="text" value={iescGrades.n1_extensao} onChange={e => handleInputChange(setIescGrades, 'n1_extensao', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Portfólio (1.0)</label><input type="text" value={iescGrades.n1_portfolio} onChange={e => handleInputChange(setIescGrades, 'n1_portfolio', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N2</span> Semestre 2 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N2:</span><span>{(getIescN2Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teórica (1.5)</label><input type="text" value={iescGrades.n2_teorica} onChange={e => handleInputChange(setIescGrades, 'n2_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática (1.0)</label><input type="text" value={iescGrades.n2_pratica} onChange={e => handleInputChange(setIescGrades, 'n2_pratica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Extensão (1.5)</label><input type="text" value={iescGrades.n2_extensao} onChange={e => handleInputChange(setIescGrades, 'n2_extensao', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Portfólio (1.0)</label><input type="text" value={iescGrades.n2_portfolio} onChange={e => handleInputChange(setIescGrades, 'n2_portfolio', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
            </div>
          ) : activeCalc === 'UCCG' ? (
            <div className="space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-green-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N1</span> Semestre 1 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N1:</span><span>{(getUccgN1Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teórica (2.5)</label><input type="text" value={uccgGrades.n1_teorica} onChange={e => handleInputChange(setUccgGrades, 'n1_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Extensão (2.5)</label><input type="text" value={uccgGrades.n1_extensao} onChange={e => handleInputChange(setUccgGrades, 'n1_extensao', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N2</span> Semestre 2 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N2:</span><span>{(getUccgN2Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Teórica (2.5)</label><input type="text" value={uccgGrades.n2_teorica} onChange={e => handleInputChange(setUccgGrades, 'n2_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Extensão (2.5)</label><input type="text" value={uccgGrades.n2_extensao} onChange={e => handleInputChange(setUccgGrades, 'n2_extensao', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
            </div>
          ) : activeCalc === 'HabMed' ? (
            <div className="space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-green-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N1</span> Semestre 1 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N1:</span><span>{(getHabmedN1Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><label className={labelClass}>Teórica (1.5)</label><input type="text" value={habmedGrades.n1_teorica} onChange={e => handleInputChange(setHabmedGrades, 'n1_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática Formativa (1.0)</label><input type="text" value={habmedGrades.n1_formativa} onChange={e => handleInputChange(setHabmedGrades, 'n1_formativa', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática Somativa (2.5)</label><input type="text" value={habmedGrades.n1_somativa} onChange={e => handleInputChange(setHabmedGrades, 'n1_somativa', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                <div className={sectionTitleClass}>
                  <div className="flex items-center gap-2"><span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">N2</span> Semestre 2 (Peso 5.0)</div>
                  <div className={partialBadgeClass}><span className="opacity-40">NOTA N2:</span><span>{(getHabmedN2Score() * 2).toFixed(2)} / 10</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><label className={labelClass}>Teórica (1.5)</label><input type="text" value={habmedGrades.n2_teorica} onChange={e => handleInputChange(setHabmedGrades, 'n2_teorica', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática Formativa (1.0)</label><input type="text" value={habmedGrades.n2_formativa} onChange={e => handleInputChange(setHabmedGrades, 'n2_formativa', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                  <div><label className={labelClass}>Prática Somativa (2.5)</label><input type="text" value={habmedGrades.n2_somativa} onChange={e => handleInputChange(setHabmedGrades, 'n2_somativa', e.target.value)} placeholder="0-10" className={inputClass} /></div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Ajuste Final: Pontuação Extra - Sempre ao final da coluna de inputs */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-dashed border-[#D4A017]/30 animate-in fade-in duration-1000">
            <h3 className="text-[10px] font-black uppercase text-[#D4A017] tracking-[0.2em] mb-4 flex items-center gap-2">
              🚀 Ajuste de Rendimento: Pontuação Extra
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <label className={labelClass}>Bônus a somar na média final</label>
                <input 
                  type="text" 
                  value={extraPoints} 
                  onChange={e => handleExtraPointsChange(e.target.value)} 
                  placeholder="Ex: 0.5" 
                  className={`${inputClass} !text-3xl focus:border-[#D4A017] !bg-orange-50/30`} 
                />
              </div>
              <div className="hidden sm:block w-px h-20 bg-gray-100"></div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                  Utilize este campo para somar pontos de monitoria, participação em projetos de extensão ou arredondamentos institucionais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Lateral (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 sticky top-32 flex flex-col h-fit">
            <h3 className="text-center text-[10px] font-black uppercase text-[#003366] tracking-[0.3em] mb-6 opacity-40">Resumo da Média Final</h3>
            
            <button 
              onClick={calculateAverage} 
              className="w-full bg-[#003366] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#D4A017] hover:text-[#003366] transition-all mb-8 group"
            >
              <span className="group-hover:scale-110 inline-block transition-transform">Calcular Nota</span>
            </button>

            <div className="flex flex-col items-center justify-center py-12 rounded-[3rem] bg-gray-50 border-2 border-dashed border-gray-100 mb-8 overflow-hidden">
              {result !== null ? (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className={`text-8xl font-black mb-4 tracking-tighter ${result >= 7 ? 'text-green-500' : result >= 5 ? 'text-[#D4A017]' : 'text-red-500'}`}>
                    {result}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${result >= 7 ? 'text-green-600' : 'text-red-400'}`}>
                    {result >= 7 ? '🎉 Aprovado!' : result >= 5 ? '⚠️ Em Recuperação' : '❌ Reprovado'}
                  </p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <span className="text-5xl block mb-4 opacity-10">🧮</span>
                  <p className="text-gray-300 font-bold italic text-[11px] leading-relaxed">
                    Insira as notas nas seções ao lado e clique em calcular.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Composição {activeCalc}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                {activeCalc === 'UC' && "Tutoria (2.8) + Teórica (4.2) + Prática (3.0)"}
                {activeCalc === 'HabMed' && "N1: T(1.5)+PF(1)+PS(2.5) / N2: T(1.5)+PF(1)+PS(2.5)"}
                {activeCalc === 'IESC' && "N1: T(1.5)+P(1)+E(1.5)+Po(1) / N2: T(1.5)+P(1)+E(1.5)+Po(1)"}
                {activeCalc === 'UCCG' && "N1: Teórica (2.5) + Extensão (2.5) / N2: Teórica (2.5) + Extensão (2.5)"}
              </p>
              
              {parseFloat(extraPoints.replace(',', '.')) > 0 && (
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 animate-pulse">
                  <p className="text-[9px] text-[#D4A017] font-black uppercase text-center">+ {extraPoints} Pontos Extras Aplicados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsView;
