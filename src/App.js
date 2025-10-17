
import React, { useState } from 'react';

const CHECKOUT_URL = "https://pay.kiwify.com.br/u3om67C"; // temporário — substitua depois

function calcIdealWeight(heightCm) {
  const h = heightCm / 100;
  return 22 * h * h;
}

// kcal burned per minute walking (MET method)
function kcalPerMinute(weightKg, met = 4.0) {
  return (met * 3.5 * weightKg) / 200;
}

export default function App(){
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState('other');
  const [result, setResult] = useState(null);

  function handleSubmit(e){
    e.preventDefault();
    const w = Number(weight);
    const h = Number(height);

    const ideal = calcIdealWeight(h);
    const toLose = Math.max(0, w - ideal);
    const kcalPerKg = 7700;
    const targetKgPerWeek = 0.5;
    const weeklyDeficit = targetKgPerWeek * kcalPerKg;
    const dailyDeficit = weeklyDeficit / 7;

    const met = 4.0; // caminhada moderada
    const kcalMin = kcalPerMinute(w, met);
    const minutesPerDay = Math.ceil(dailyDeficit / kcalMin);

    const weeksNeeded = toLose > 0 ? Math.ceil(toLose / targetKgPerWeek) : 0;

    setResult({
      ideal: Number(ideal.toFixed(1)),
      toLose: Number(toLose.toFixed(1)),
      dailyDeficit: Math.round(dailyDeficit),
      minutesPerDay,
      weeksNeeded,
    });
    // scroll to result
    setTimeout(()=>{
      const el = document.getElementById('result');
      if(el) el.scrollIntoView({behavior:'smooth'});
    },100);
  }

  return (
    <div style={{maxWidth:960,margin:'32px auto',padding:20}}>
      <header style={{display:'flex',gap:16,alignItems:'center'}}>
        <div style={{width:64,height:64,borderRadius:12,background:'linear-gradient(135deg,#22c55e,#0ea5e9)'}}></div>
        <div>
          <h1 style={{margin:0,fontSize:24}}>Calculadora de Caminhada</h1>
          <p style={{margin:0,color:'#065f46'}}>Quanto você precisa caminhar por dia para chegar ao seu peso ideal</p>
        </div>
      </header>

      <main style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr',gap:18}}>
        <form onSubmit={handleSubmit} style={{background:'#ffffff',padding:18,borderRadius:12,boxShadow:'0 6px 18px rgba(3,19,22,0.08)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <label style={{display:'block'}}>
              Nome (opcional)
              <input value={name} onChange={(e)=>setName(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:8,border:'1px solid #e6f7f2'}} placeholder="Seu nome" />
            </label>

            <label style={{display:'block'}}>
              Sexo
              <select value={sex} onChange={(e)=>setSex(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:8,border:'1px solid #e6f7f2'}}>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Prefiro não dizer</option>
              </select>
            </label>

            <label style={{display:'block'}}>
              Peso atual (kg)
              <input type="number" min="20" step="0.1" value={weight} onChange={(e)=>setWeight(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:8,border:'1px solid #e6f7f2'}} />
            </label>

            <label style={{display:'block'}}>
              Altura (cm)
              <input type="number" min="80" max="250" value={height} onChange={(e)=>setHeight(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:8,border:'1px solid #e6f7f2'}} />
            </label>

            <label style={{display:'block'}}>
              Idade
              <input type="number" min="10" max="120" value={age} onChange={(e)=>setAge(e.target.value)} style={{width:'100%',padding:8,marginTop:6,borderRadius:8,border:'1px solid #e6f7f2'}} />
            </label>

            <div style={{display:'flex',alignItems:'flex-end'}}>
              <button type="submit" style={{width:'100%',padding:12,background:'linear-gradient(90deg,#10b981,#06b6d4)',color:'#fff',border:0,borderRadius:10,fontWeight:600}}>Calcular</button>
            </div>
          </div>
        </form>

        {result && (
          <section id="result" style={{background:'#ffffff',padding:18,borderRadius:12,boxShadow:'0 6px 18px rgba(3,19,22,0.06)'}}>
            <h2 style={{marginTop:0}}>Resultado</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
              <div style={{padding:12,background:'#f8fffb',borderRadius:8}}>
                <div style={{fontSize:12,color:'#065f46'}}>Peso ideal (IMC 22)</div>
                <div style={{fontSize:20,fontWeight:700}}>{result.ideal} kg</div>
              </div>

              <div style={{padding:12,background:'#fff7fb',borderRadius:8}}>
                <div style={{fontSize:12,color:'#7f1d1d'}}>Peso a perder</div>
                <div style={{fontSize:20,fontWeight:700}}>{result.toLose} kg</div>
              </div>

              <div style={{padding:12,background:'#eef2ff',borderRadius:8}}>
                <div style={{fontSize:12,color:'#1e40af'}}>Déficit diário sugerido</div>
                <div style={{fontSize:20,fontWeight:700}}>{result.dailyDeficit} kcal/dia</div>
              </div>

              <div style={{padding:12,background:'#f0fdf4',borderRadius:8}}>
                <div style={{fontSize:12,color:'#065f46'}}>Caminhada moderada</div>
                <div style={{fontSize:20,fontWeight:700}}>{result.minutesPerDay} min/dia</div>
              </div>
            </div>

            <p style={{marginTop:12,color:'#334155'}}>Com perda média de 0.5 kg/semana, você levaria aproximadamente <strong>{result.weeksNeeded} semanas</strong> para atingir o peso ideal.</p>

            <div style={{display:'flex',gap:8,marginTop:12}}>
              <a href={CHECKOUT_URL} target="_blank" rel="noreferrer" style={{padding:'10px 16px',background:'#06b6d4',color:'#fff',borderRadius:8,fontWeight:600,textDecoration:'none'}}>Quero o ebook (comprar)</a>
              <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{padding:'10px 16px',background:'#fff',border:'1px solid #e6eef0',borderRadius:8}}>Voltar ao topo</button>
            </div>

            <p style={{fontSize:12,color:'#475569',marginTop:10}}>Observação: 1 kg ≈ 7700 kcal. Estas são estimativas — consulte um profissional de saúde antes de iniciar qualquer plano.</p>
          </section>
        )}

        <footer style={{marginTop:18,textAlign:'center',color:'#0f172a'}}>
          <small>Emagreça com Saúde, a mudança começa agora! 
        </footer>
      </main>
    </div>
  );
}
