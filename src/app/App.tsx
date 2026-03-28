import { useState, useRef } from 'react';
import img1 from 'figma:asset/c91d23ac257b1453d5cd58bb4005aa9f34a11c1a.png';
import img2 from 'figma:asset/28577360b71022e0b4b57bbef94d93fe1b0ed209.png';
import img3 from 'figma:asset/95f7520fb43dea5c17ffb062902a60298767ba99.png';

const garmentTypes = [
  { id: 'jacket', name: 'Куртка (Jacket)', code: '4' },
  { id: 'hoodie', name: 'Худи (Hoodie)', code: '6' },
  { id: 'jeans', name: 'Джинсы (Jeans)', code: '3' },
  { id: 'sweater', name: 'Свитер (Sweater)', code: '5' },
  { id: 'longsleeve', name: 'Лонгслив (Longsleeve)', code: '2' },
  { id: 'tshirt', name: 'Футболка (T-shirt)', code: '2' }
];

const seasons2007to2009 = [
  { id: 'ss2007', name: 'SS 2007', prefix: '29', letter: 'K' },
  { id: 'aw2007', name: 'AW 2007', prefix: '30', letter: 'A' },
  { id: 'ss2008', name: 'SS 2008', prefix: '34', letter: 'M' },
  { id: 'aw2008', name: 'AW 2008', prefix: '36', letter: 'P' },
  { id: 'ss2009', name: 'SS 2009', prefix: '44', letter: 'S' },
  { id: 'aw2009', name: 'AW 2009', prefix: '49', letter: 'K' }
];

const seasons2010to2014 = [
  { id: 'ss2010', name: 'SS 2010', prefix: '52', letter: 'A' },
  { id: 'aw2011', name: 'AW 2011', prefix: '55', letter: 'D' },
  { id: 'ss2012', name: 'SS 2012', prefix: '56', letter: 'F' },
  { id: 'aw2013', name: 'AW 2013', prefix: '59', letter: 'G' },
  { id: 'ss2014', name: 'SS 2014', prefix: '60', letter: 'H' }
];

const countries = ['ITALY', 'ROMANIA', 'TUNISIA'];

export default function App() {
  const [styleType, setStyleType] = useState<'2007-2009' | '2010-2014'>('2010-2014');
  const [garmentType, setGarmentType] = useState('jacket');
  const [season, setSeason] = useState('aw2013');
  const [country, setCountry] = useState('ITALY');
  const [customArt, setCustomArt] = useState('');
  const tag1Ref = useRef<HTMLDivElement>(null);
  const tag2Ref = useRef<HTMLDivElement>(null);
  const tag3Ref = useRef<HTMLDivElement>(null);

  const currentSeasons = styleType === '2007-2009' ? seasons2007to2009 : seasons2010to2014;
  const currentGarment = garmentTypes.find(g => g.id === garmentType);
  const currentSeason = currentSeasons.find(s => s.id === season);

  const generateArticleNumber = () => {
    const seasonPrefix = currentSeason?.prefix || '59';
    const garmentCode = currentGarment?.code || '4';
    const letter = currentSeason?.letter || 'G';
    const randomPart = Math.floor(Math.random() * 90 + 10);
    const colorCode = Math.floor(Math.random() * 900 + 100);

    return `${seasonPrefix}15${garmentCode}${letter}${randomPart}/${colorCode}`;
  };

  const [articleNumber, setArticleNumber] = useState(generateArticleNumber());

  const handleGenerate = () => {
    setArticleNumber(generateArticleNumber());
  };

  const handleStyleChange = (newStyle: '2007-2009' | '2010-2014') => {
    setStyleType(newStyle);
    if (newStyle === '2007-2009') {
      setSeason('aw2007');
    } else {
      setSeason('aw2013');
    }
  };

  const handlePrint = (tagRef: React.RefObject<HTMLDivElement>) => {
    if (!tagRef.current) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stone Island Tag</title>
            <style>
              @page { size: 50mm 70mm; margin: 0; }
              body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
            </style>
          </head>
          <body>${tagRef.current.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const handlePrintAll = () => {
    if (!tag1Ref.current || !tag2Ref.current || !tag3Ref.current) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stone Island Tags - All</title>
            <style>
              @page { size: A4; margin: 10mm; }
              body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
              .tag-container { display: flex; flex-direction: column; gap: 10mm; align-items: center; }
              @media print {
                .tag { page-break-after: always; }
                .tag:last-child { page-break-after: auto; }
              }
            </style>
          </head>
          <body>
            <div class="tag-container">
              <div class="tag">${tag1Ref.current.outerHTML}</div>
              <div class="tag">${tag2Ref.current.outerHTML}</div>
              <div class="tag">${tag3Ref.current.outerHTML}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const getTag1Content2007 = () => {
    if (garmentType === 'jacket') {
      return (
        <div className="text-left leading-[1.1] text-[6.5px]">
          <div className="mb-1.5">
            <div className="text-[9px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[7px] font-semibold tracking-tight">COMPANY S.P.A.</div>
            <div className="text-[5.5px] mt-0.5">SPW - VIA CONFINE 2161</div>
            <div className="text-[5.5px]">RAVARINO (MO) ITALIA</div>
          </div>
          <div className="text-[6px] leading-[1.15]">
            <div className="font-semibold">ESTERNO</div>
            <div>100% COTONE-COTTON</div>
            <div>BAUMWOLLE-COTON</div>
            <div>ALGODON-ALGODAO</div>
            <div className="font-semibold mt-0.5">INTERNO</div>
            <div>15% POLIAMMIDICA-NYLON</div>
            <div>POLYAMIDE-POLYAMID</div>
            <div>POLIAMIDA</div>
          </div>
          <div className="text-[6px] mt-1.5 font-semibold">
            MADE IN {country === 'ITALY' ? 'TUNISIA' : country}
          </div>
          <div className="text-[7px] mt-0.5 tracking-tight font-bold">
            ART. {customArt || articleNumber}
          </div>
          <div className="text-[5px] mt-0.5">(株) 典田貿易 03-5350-4524</div>
        </div>
      );
    } else if (garmentType === 'sweater') {
      return (
        <div className="text-left leading-[1.1] text-[6.5px]">
          <div className="mb-1.5">
            <div className="text-[9px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[7px] font-semibold tracking-tight">COMPANY S.P.A.</div>
            <div className="text-[5.5px] mt-0.5">SPW - VIA CONFINE 2161</div>
            <div className="text-[5.5px]">RAVARINO (MO) ITALIA</div>
          </div>
          <div className="text-[6px] leading-[1.15]">
            <div>80%LANA-WOOL-WOLLE</div>
            <div>LAINE-LA LANA</div>
            <div className="mt-0.5">20%POLIAMMIDICA-NYLON</div>
            <div>POLYAMIDE-POLYAMID</div>
            <div>POLIAMIDA</div>
          </div>
          <div className="text-[6px] mt-1.5 font-semibold">
            MADE IN {country === 'ITALY' ? 'TUNISIA' : country}
          </div>
          <div className="text-[7px] mt-0.5 tracking-tight font-bold">
            ART. {customArt || articleNumber}
          </div>
          <div className="text-[5px] mt-0.5">(株) 典田貿易 03-5350-4524</div>
        </div>
      );
    } else {
      return (
        <div className="text-left leading-[1.1] text-[6.5px]">
          <div className="mb-1.5">
            <div className="text-[9px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[7px] font-semibold tracking-tight">COMPANY S.P.A.</div>
            <div className="text-[5.5px] mt-0.5">SPW - VIA CONFINE 2161</div>
            <div className="text-[5.5px]">RAVARINO (MO) ITALIA</div>
          </div>
          <div className="text-[6.5px] leading-[1.15]">
            <div className="text-[7.5px] font-bold mb-0.5">100%</div>
            <div>COTONE-COTTON</div>
            <div>BAUMWOLLE-COTON</div>
            <div>ALGODAN-ALGODAO</div>
            <div>銅叉寸</div>
          </div>
          <div className="text-[6px] mt-1.5 font-semibold">
            MADE IN {country === 'ITALY' ? 'TUNISIA' : country} シア工完力後
          </div>
          <div className="text-[7px] mt-0.5 tracking-tight font-bold">
            ART. {customArt || articleNumber}
          </div>
          <div className="text-[5px] mt-0.5">(株) 典田貿易 03-5350-4524</div>
        </div>
      );
    }
  };

  const getTag1Content2010 = () => {
    if (garmentType === 'jacket') {
      return (
        <div className="text-center leading-tight">
          <div className="mb-1">
            <div className="text-[11px] font-bold tracking-wide">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
          </div>
          <div className="text-[6px] mb-1.5 leading-tight">
            <div>SPW - VIA CONFINE 2161</div>
            <div>RAVARINO (MO) ITALY</div>
          </div>
          <div className="text-[6.5px] leading-tight space-y-0.5">
            <div className="font-semibold">ESTERNO</div>
            <div className="leading-tight">100% POLIAMMIDICA - NYLON - POLYAMIDE</div>
            <div className="font-semibold mt-0.5">INTERNO</div>
            <div className="leading-tight">100% POLIAMMIDICA - NYLON - POLYAMIDE</div>
            <div className="font-semibold mt-0.5">SPALMATORA</div>
            <div className="leading-tight">100% POLIESTERE - POLYESTER</div>
          </div>
          <div className="text-[7px] mt-2 font-semibold tracking-wider">
            MADE IN {country}
          </div>
        </div>
      );
    } else if (garmentType === 'sweater') {
      return (
        <div className="text-center leading-tight">
          <div className="mb-1">
            <div className="text-[11px] font-bold tracking-wide">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
          </div>
          <div className="text-[6px] mb-2 leading-tight">
            <div>SPW - VIA CONFINE 2161</div>
            <div>RAVARINO (MO) ITALY</div>
          </div>
          <div className="text-[7px] leading-tight space-y-0.5">
            <div>80% LANA - WOOL - WOLLE - LAINE</div>
            <div>20% POLIAMMIDICA - NYLON - POLYAMIDE</div>
          </div>
          <div className="text-[7px] mt-2 font-semibold tracking-wider">
            MADE IN {country}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center leading-tight">
          <div className="mb-1">
            <div className="text-[11px] font-bold tracking-wide">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
          </div>
          <div className="text-[6px] mb-2 leading-tight">
            <div>SPW - VIA CONFINE 2161</div>
            <div>RAVARINO (MO) ITALY</div>
          </div>
          <div className="text-[7px] leading-tight space-y-0.5">
            <div>100% COTONE - COTTON</div>
            <div>BAUMWOLLE - COTON</div>
            <div>ALGODON - ALGODAO</div>
          </div>
          <div className="text-[7px] mt-2 font-semibold tracking-wider">
            MADE IN {country}
          </div>
        </div>
      );
    }
  };

  const WashingSymbols = () => (
    <div className="flex justify-center gap-1.5 mb-2">
      <span className="text-[12px]">🧺</span>
      <span className="text-[12px]">⚠</span>
      <span className="text-[12px]">🔲</span>
      <span className="text-[12px]">⊗</span>
      <span className="text-[12px]">✕</span>
    </div>
  );

  const getTag2Content2007 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <WashingSymbols />
      <div className="border-t border-dashed border-black w-full my-2"></div>
      <div className="text-center text-[5.5px] leading-[1.2] mt-1">
        <div className="font-semibold text-[6px]">SPW - VIA CONFINE 2161</div>
        <div className="mt-1 font-bold text-[6.5px]">MADE IN {country}-イタリア製</div>
        <div className="mt-0.5 font-bold text-[7px]">ART.{customArt || articleNumber}</div>
      </div>
    </div>
  );

  const getTag2Content2010 = () => {
    if (garmentType === 'jacket') {
      return (
        <div className="text-[6px] leading-[1.3] uppercase">
          <div className="mb-1.5">
            <div>LAVARE SEPARATAMENTE A 30°</div>
            <div>NON CANDEGGIARE</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>STIRARE A BASSA TEMPERATURA</div>
            <div>NON LAVARE A SECCO</div>
          </div>
          <div className="mb-1.5">
            <div>MACHINE WASH COLD</div>
            <div>DO NOT BLEACH</div>
            <div>DO NOT TUMBLE DRY</div>
            <div>COOL IRON</div>
            <div>DO NOT DRY CLEAN</div>
          </div>
          <div>
            <div>WASCHEN 30°</div>
            <div>NICHT BLEICHEN</div>
            <div>NICHT TUMBLERTROCKNEN</div>
            <div>KALT BÜGELN</div>
            <div>NICHT CHEMISCH REINIGEN</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-[6px] leading-[1.3] uppercase">
          <div className="mb-1.5">
            <div>LAVARE IN ACQUA FREDDA</div>
            <div>NON CANDEGGIARE</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>ASCIUGARE ALL'OMBRA</div>
            <div>STIRARE A BASSA TEMPERATURA</div>
            <div>NON LAVARE A SECCO</div>
          </div>
          <div>
            <div>MACHINE WASH COLD</div>
            <div>DO NOT BLEACH</div>
            <div>DO NOT TUMBLE DRY</div>
            <div>LINE DRY IN THE SHADE</div>
            <div>COOL IRON</div>
            <div>DO NOT DRY CLEAN</div>
          </div>
        </div>
      );
    }
  };

  const getTag3Content2007 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center text-[5.5px] leading-[1.2]">
        <div className="font-semibold text-[6px]">SPW - VIA CONFINE 2161</div>
        <div className="mt-1 font-bold text-[6.5px]">MADE IN {country}-イタリア製</div>
        <div className="mt-0.5 font-bold text-[7.5px]">ART.{customArt || articleNumber}</div>
      </div>
    </div>
  );

  const getTag3Content2010 = () => (
    <div className="text-center uppercase">
      <div className="text-[9px] tracking-[0.15em] mb-3 font-semibold">
        MADE IN {country}
      </div>
      <div className="text-[11px] tracking-[0.05em] font-semibold">
        ART. {customArt || articleNumber}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl mb-8 text-center font-bold">Stone Island Vintage Tags Generator</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm mb-2 font-semibold">Стиль бирок / Tag Style:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStyleChange('2007-2009')}
                className={`py-3 px-4 rounded transition-colors ${
                  styleType === '2007-2009'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                2007-2009 Vintage
              </button>
              <button
                onClick={() => handleStyleChange('2010-2014')}
                className={`py-3 px-4 rounded transition-colors ${
                  styleType === '2010-2014'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                2010-2014 Classic
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">Тип одежды:</label>
              <select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {garmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Сезон:</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {currentSeasons.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Страна:</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Свой артикул (опц.):</label>
              <input
                type="text"
                value={customArt}
                onChange={(e) => setCustomArt(e.target.value)}
                placeholder="30156A33/A"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleGenerate}
              className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
            >
              Генерировать артикул
            </button>
            <button
              onClick={handlePrintAll}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Печать всех бирок
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №1</h2>
              <button
                onClick={() => handlePrint(tag1Ref)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                Печать
              </button>
            </div>
            <div
              ref={tag1Ref}
              className="bg-white border-2 border-black mx-auto uppercase"
              style={{
                width: '50mm',
                height: '70mm',
                padding: '3mm',
                fontFamily: 'Arial, Helvetica, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {styleType === '2007-2009' ? getTag1Content2007() : getTag1Content2010()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №2</h2>
              <button
                onClick={() => handlePrint(tag2Ref)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                Печать
              </button>
            </div>
            <div
              ref={tag2Ref}
              className="bg-white border-2 border-black mx-auto uppercase"
              style={{
                width: '50mm',
                height: '70mm',
                padding: '3mm',
                fontFamily: 'Arial, Helvetica, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {styleType === '2007-2009' ? getTag2Content2007() : getTag2Content2010()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №3</h2>
              <button
                onClick={() => handlePrint(tag3Ref)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                Печать
              </button>
            </div>
            <div
              ref={tag3Ref}
              className="bg-white border-2 border-black mx-auto uppercase"
              style={{
                width: '50mm',
                height: '70mm',
                padding: '3mm',
                fontFamily: 'Arial, Helvetica, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {styleType === '2007-2009' ? getTag3Content2007() : getTag3Content2010()}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Примеры оригинальных бирок</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src={img1} alt="Example 1" className="w-full rounded border" />
            <img src={img2} alt="Example 2" className="w-full rounded border" />
            <img src={img3} alt="Example 3" className="w-full rounded border" />
          </div>
        </div>
      </div>
    </div>
  );
}
