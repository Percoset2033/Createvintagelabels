import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const garmentTypes = [
  { id: 'jacket', name: 'Куртка (Jacket)', code: '4' },
  { id: 'hoodie', name: 'Худи (Hoodie)', code: '6' },
  { id: 'sweater_wool', name: 'Свитер 100% шерсть (Wool Sweater)', code: '5' },
  { id: 'sweater_mixed', name: 'Свитер 80/20 (Mixed Sweater)', code: '5' },
  { id: 'sweater_cashmere', name: 'Свитер кашемир (Cashmere Sweater)', code: '5' },
  { id: 'jeans', name: 'Джинсы (Jeans)', code: '3' },
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

const countries = ['ITALY', 'ROMANIA', 'TUNISIA', 'PORTUGAL', 'TURKEY'];

export default function App() {
  const [styleType, setStyleType] = useState<'2007-2009' | '2010-2014'>('2010-2014');
  const [garmentType, setGarmentType] = useState('jacket');
  const [season, setSeason] = useState('aw2013');
  const [country, setCountry] = useState('ROMANIA');
  const [customArt, setCustomArt] = useState('');
  const tag1Ref = useRef<HTMLDivElement>(null);
  const tag2Ref = useRef<HTMLDivElement>(null);
  const tag3Ref = useRef<HTMLDivElement>(null);

  const currentSeasons = styleType === '2007-2009' ? seasons2007to2009 : seasons2010to2014;
  const currentGarment = garmentTypes.find(g => g.id === garmentType);
  const currentSeason = currentSeasons.find(s => s.id === season);

  const generateArticleNumber = () => {
    const seasonPrefix = currentSeason?.prefix || '45';
    const garmentCode = currentGarment?.code || '5';
    const letter = currentSeason?.letter || 'B';
    const randomPart = Math.floor(Math.random() * 900 + 100);
    const colorCode = Math.floor(Math.random() * 900 + 100);

    return `${seasonPrefix}155${letter}${garmentCode}/${colorCode}`;
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

  const handleSaveAsImage = async (tagRef: React.RefObject<HTMLDivElement>, tagName: string) => {
    if (!tagRef.current) return;

    try {
      // Увеличенное качество для печати - scale 6x
      const canvas = await html2canvas(tagRef.current, {
        scale: 6, // Повышено с 4 до 6 для лучшего качества печати
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: tagRef.current.offsetWidth,
        height: tagRef.current.offsetHeight,
        imageTimeout: 0,
        removeContainer: true
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const garmentName = garmentTypes.find(g => g.id === garmentType)?.name.split(' ')[0] || 'tag';
          link.download = `sportswear-${garmentName}-${tagName}-${customArt || articleNumber}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Ошибка при сохранении изображения. Попробуйте еще раз.');
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

  const getTag1Content = () => {
    if (garmentType === 'jacket') {
      // Куртка - как на изображении ART.3915M422/448
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[14px] font-bold tracking-[0.08em]">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold tracking-tight">COMPANY S.P.A.</div>
            <div className="text-[7px] mt-1 leading-[1.2]">SPW - VIA CONFINE 2161</div>
            <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
          </div>

          <div className="text-[7.5px] leading-[1.3] my-2">
            <div className="font-bold mb-0.5">INTERNO</div>
            <div className="leading-[1.15]">100%COTONE-COTTON-BAUMWOLLE-COTON</div>
            <div>ALGODON-ALGODAO-棉花</div>
          </div>

          <div className="text-[7.5px] leading-[1.3] my-2">
            <div className="font-bold mb-0.5">ESTERNO 1</div>
            <div className="leading-[1.15]">100%POLIAMMIDICA-NYLON-POLYAMIDE</div>
            <div>POLYAMID-POLIAMIDA-太方片</div>
          </div>

          <div className="text-[7.5px] leading-[1.3] my-2">
            <div className="font-bold mb-0.5">ESTERNO 2</div>
            <div className="leading-[1.15]">100%POLIAMMIDICA-NYLON-POLYAMIDE</div>
            <div>POLYAMID-POLIAMIDA-太方片</div>
          </div>

          <div className="text-[7.5px] leading-[1.3] my-2">
            <div className="font-bold mb-0.5">SPALMATORA</div>
            <div className="leading-[1.15]">100%POLIESTERE-POLYESTER-POLIESTER</div>
            <div>ポリエステル</div>
          </div>

          <div className="mt-2 text-[8px] font-semibold">
            MADE IN {
              country === 'ROMANIA' ? 'RUMANIA ルーマニア製' :
              country === 'ITALY' ? 'ITALIA イタリア製' :
              country === 'TUNISIA' ? 'TUNISIA チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' :
              'TURKEY トルコ製'
            }
          </div>
          <div className="text-[10px] font-bold mt-1 tracking-tight">
            ART .{customArt || articleNumber}
          </div>
          <div className="text-[6px] mt-1">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_wool') {
      // 100% Wool sweater
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[11px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[8px] font-semibold tracking-tight">COMPANY S.P.A.</div>
          </div>

          <div className="my-2">
            <div className="text-[14px] font-bold mb-1">100%</div>
            <div className="text-[9px] leading-[1.3]">
              <div>LANA-WOOL-WOLLE</div>
              <div>LAINE-LÃ</div>
              <div className="mt-0.5">ウール</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[6px] leading-[1.3]">
            <div className="flex justify-center gap-1.5 mb-1">
              <span>🧺</span><span>⚠</span><span>🔲</span><span>⊗</span><span>✕</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[7px] font-semibold">
            MADE IN {
              country === 'ITALY' ? 'ITALY-イタリア製' :
              country === 'ROMANIA' ? 'ROMANIA-ルーマニア製' :
              country === 'TUNISIA' ? 'TUNISIA-チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL-ポルトガル製' :
              'TURKEY-トルコ製'
            }
          </div>
          <div className="text-[8px] font-bold mt-0.5">
            ART.{customArt || articleNumber}
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_mixed') {
      // 80/20 Mixed sweater
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[11px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[8px] font-semibold tracking-tight">COMPANY S.P.A.</div>
          </div>

          <div className="text-[8px] leading-[1.25] my-2">
            <div className="font-semibold">80%LANA-WOOL-WOLLE-LAINE-LÃ</div>
            <div className="mt-0.5">ウール</div>
          </div>

          <div className="text-[8px] leading-[1.25] my-2">
            <div className="font-semibold">20%POLIAMMIDICA-NYLON</div>
            <div>POLYAMIDE-POLYAMID</div>
            <div>POLIAMIDA-ナイロン</div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[6px] leading-[1.3]">
            <div className="flex justify-center gap-1.5 mb-1">
              <span>🧺</span><span>⚠</span><span>🔲</span><span>⊗</span><span>✕</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[7px] font-semibold">
            MADE IN {
              country === 'ITALY' ? 'ITALY-イタリア製' :
              country === 'ROMANIA' ? 'ROMANIA-ルーマニア製' :
              country === 'TUNISIA' ? 'TUNISIA-チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL-ポルトガル製' :
              'TURKEY-トルコ製'
            }
          </div>
          <div className="text-[8px] font-bold mt-0.5">
            ART.{customArt || articleNumber}
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_cashmere') {
      // Cashmere sweater
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[11px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[8px] font-semibold tracking-tight">COMPANY S.P.A.</div>
          </div>

          <div className="text-[8px] leading-[1.3] my-2">
            <div className="font-semibold">85% COTONE-COTTON</div>
            <div>BAUMWOLLE-COTON</div>
            <div>ALGODON-ALGODAO-棉</div>
          </div>

          <div className="text-[8px] leading-[1.3] my-2">
            <div className="font-semibold">15% KASHMIR-CASHMERE</div>
            <div>KASCHMIR-CACHEMIRE</div>
            <div>CACHEMIRA-CAXEMIRA</div>
            <div className="mt-0.5">カシミヤ</div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[6px] leading-[1.3]">
            <div className="flex justify-center gap-1.5 mb-1">
              <span>🧺</span><span>⚠</span><span>🔲</span><span>⊗</span><span>✕</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[7px] font-semibold">
            MADE IN {
              country === 'ITALY' ? 'ITALY-イタリア製' :
              country === 'ROMANIA' ? 'ROMANIA-ルーマニア製' :
              country === 'TUNISIA' ? 'TUNISIA-チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL-ポルトガル製' :
              'TURKEY-トルコ製'
            }
          </div>
          <div className="text-[8px] font-bold mt-0.5">
            ART.{customArt || articleNumber}
          </div>
        </div>
      );
    } else if (garmentType === 'hoodie') {
      // Hoodie
      return (
        <div className="text-center leading-[1.15]">
          <div className="mb-2">
            <div className="text-[11px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[8px] font-semibold tracking-tight">COMPANY S.P.A.</div>
          </div>

          <div className="my-2">
            <div className="text-[11px] font-bold mb-1">95%</div>
            <div className="text-[8px] leading-[1.2]">
              <div>COTONE-COTTON</div>
              <div>COTON-ALGODON</div>
              <div>ALGODAO-綿-棉</div>
            </div>
          </div>

          <div className="my-2">
            <div className="text-[11px] font-bold mb-1">5%</div>
            <div className="text-[7.5px] leading-[1.2]">
              <div>ELASTAM-ELASTANE</div>
              <div>ELASTAN-ELASTHANNE</div>
              <div>ELASTANO-ポリウレタン-氨綸</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[6px] leading-[1.3]">
            <div className="flex justify-center gap-1.5 mb-1">
              <span>🧺</span><span>⚠</span><span>🔲</span><span>⊗</span><span>✕</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[7px] font-semibold">
            MADE IN {
              country === 'ITALY' ? 'ITALY-イタリア製' :
              country === 'ROMANIA' ? 'ROMANIA-ルーマニア製' :
              country === 'TUNISIA' ? 'TUNISIA-チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL-ポルトガル製' :
              'TURKEY-トルコ製'
            }
          </div>
          <div className="text-[8px] font-bold mt-0.5">
            ART.{customArt || articleNumber}
          </div>
        </div>
      );
    } else {
      // T-shirt, Longsleeve, Jeans
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[11px] font-bold tracking-tight">SPORTSWEAR</div>
            <div className="text-[8px] font-semibold tracking-tight">COMPANY S.P.A.</div>
          </div>

          <div className="my-2">
            <div className="text-[14px] font-bold mb-1">100%</div>
            <div className="text-[9px] leading-[1.3]">
              <div>COTONE-COTTON</div>
              <div>BAUMWOLLE-COTON</div>
              <div>ALGODON-ALGODAO</div>
              <div className="mt-0.5">綿</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[6px] leading-[1.3]">
            <div className="flex justify-center gap-1.5 mb-1">
              <span>🧺</span><span>⚠</span><span>🔲</span><span>⊗</span><span>✕</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[7px] font-semibold">
            MADE IN {
              country === 'ITALY' ? 'ITALY-イタリア製' :
              country === 'ROMANIA' ? 'ROMANIA-ルーマニア製' :
              country === 'TUNISIA' ? 'TUNISIA-チュニジア製' :
              country === 'PORTUGAL' ? 'PORTUGAL-ポルトガル製' :
              'TURKEY-トルコ製'
            }
          </div>
          <div className="text-[8px] font-bold mt-0.5">
            ART.{customArt || articleNumber}
          </div>
        </div>
      );
    }
  };

  const getTag2Content = () => {
    if (garmentType === 'jacket') {
      // Бирка 2 для куртки - инструкции по уходу
      return (
        <div className="text-[5.5px] leading-[1.35]">
          <div className="flex justify-center gap-1 mb-2">
            <span className="text-[10px]">🧺</span>
            <span className="text-[10px]">⚠</span>
            <span className="text-[10px]">🔲</span>
            <span className="text-[10px]">⊗</span>
            <span className="text-[10px]">✕</span>
          </div>

          <div className="mb-1.5">
            <div>LAVARE SEPARATAMENTE A 30°C CICLO DELICATO</div>
            <div>NON CANDEGGIARE. NON LAVARE A SECCO.</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>STIRARE A MAX. 110°C SENZA VAPORE</div>
            <div>NON STIRARE LA STAMPA</div>
          </div>

          <div className="mb-1.5">
            <div>LAVAR SEPARADAMENTE A 30°C CICLO DELICADO</div>
            <div>NÃO USE ALVEJANTE. NÃO LAVAR A SECO.</div>
            <div>NÃO SECAR EM MÁQUINA</div>
            <div>PASSAR A FERRO MAX. 110°C SEM VAPOR</div>
          </div>

          <div className="mb-1.5">
            <div>MACHINE WASH SEPARATELY AT 30°C GENTLE CYCLE</div>
            <div>DO NOT BLEACH. DO NOT DRY CLEAN.</div>
            <div>DO NOT TUMBLE DRY</div>
            <div>IRON MAX. 110°C WITHOUT STEAM</div>
            <div>DO NOT IRON PRINT</div>
          </div>

          <div className="mb-1.5">
            <div>LAVER SÉPARÉMENT À 30°C PROGRAMME DOUX</div>
            <div>NE PAS JAVELLISER. NE PAS NETTOYER À SEC.</div>
            <div>NE PAS SÉCHER EN MACHINE</div>
            <div>REPASSER MAX. 110°C SANS VAPEUR</div>
          </div>

          <div>
            <div>SEPARAT BEI 30°C WASCHEN SCHONWASCHGANG</div>
            <div>NICHT BLEICHEN. NICHT CHEMISCH REINIGEN.</div>
            <div>NICHT IM WÄSCHETROCKNER TROCKNEN</div>
            <div>BÜGELN MAX. 110°C OHNE DAMPF</div>
          </div>
        </div>
      );
    } else {
      // Бирка 2 для других изделий
      return (
        <div className="text-[5.5px] leading-[1.35]">
          <div className="flex justify-center gap-1 mb-2">
            <span className="text-[10px]">🧺</span>
            <span className="text-[10px]">⚠</span>
            <span className="text-[10px]">🔲</span>
            <span className="text-[10px]">⊗</span>
            <span className="text-[10px]">✕</span>
          </div>

          <div className="mb-1.5">
            <div>LAVARE SEPARATAMENTE A 30°C AL ROVESCIO</div>
            <div>NON CANDEGGIARE. NON LAVARE A SECCO.</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>ASCIUGARE IN VERTICALE - HANG TO DRY</div>
            <div>STIRARE A BASSA TEMPERATURA</div>
            <div>NON STIRARE LA STAMPA</div>
          </div>

          <div className="mb-1.5">
            <div>LAVAR SEPARADAMENTE A 30°C DO AVESSO</div>
            <div>NÃO USE ALVEJANTE. NÃO LAVAR A SECO.</div>
            <div>NÃO SECAR EM MÁQUINA</div>
            <div>SECAR PENDURADO</div>
          </div>

          <div className="mb-1.5">
            <div>WASH SEPARATELY AT 30°C INSIDE OUT</div>
            <div>DO NOT BLEACH. DO NOT DRY CLEAN.</div>
            <div>DO NOT TUMBLE DRY</div>
            <div>HANG TO DRY</div>
            <div>IRON AT LOW TEMPERATURE</div>
            <div>DO NOT IRON PRINT</div>
          </div>

          <div>
            <div>LAVER SÉPARÉMENT À 30°C À L'ENVERS</div>
            <div>NE PAS JAVELLISER. NE PAS NETTOYER À SEC.</div>
            <div>NE PAS SÉCHER EN MACHINE</div>
            <div>SÉCHER À PLAT - REPASSER À BASSE TEMPÉRATURE</div>
          </div>
        </div>
      );
    }
  };

  const getTag3Content = () => {
    // Бирка 3 - компактная информация
    return (
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-2">
          <span className="text-[10px]">🧺</span>
          <span className="text-[10px]">⚠</span>
          <span className="text-[10px]">🔲</span>
          <span className="text-[10px]">⊗</span>
          <span className="text-[10px]">✕</span>
        </div>

        <div className="border-t border-dashed border-black w-full my-2"></div>

        <div className="text-[7px] font-semibold leading-[1.3]">
          {
            country === 'ITALY' ? <>MADE IN ITALY-イタリア製</> :
            country === 'ROMANIA' ? <>MADE IN ROMANIA-ルーマニア製</> :
            country === 'TUNISIA' ? <>MADE IN TUNISIA-チュニジア製</> :
            country === 'PORTUGAL' ? <>MADE IN PORTUGAL-ポルトガル製</> :
            <>MADE IN TURKEY-トルコ製</>
          }
        </div>
        <div className="text-[9px] font-bold mt-1 tracking-tight">
          ART.{customArt || articleNumber}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl mb-8 text-center font-bold">SPORTSWEAR Company Бирки для Одежды</h1>
        <p className="text-center text-gray-600 mb-6">Генератор бирок для курток, свитеров, футболок и другой одежды</p>

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
                className="w-full p-2 border border-gray-300 rounded text-sm"
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
              <label className="block text-sm mb-2">Свой артикул:</label>
              <input
                type="text"
                value={customArt}
                onChange={(e) => setCustomArt(e.target.value)}
                placeholder="3915M422/448"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGenerate}
              className="bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              🎲 Генерировать артикул
            </button>
            <button
              onClick={() => {
                handleSaveAsImage(tag1Ref, 'tag1');
                setTimeout(() => handleSaveAsImage(tag2Ref, 'tag2'), 500);
                setTimeout(() => handleSaveAsImage(tag3Ref, 'tag3'), 1000);
              }}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              💾 Сохранить все как PNG
            </button>
            <button
              onClick={() => {
                const examples = ['3915M422/448', '29155K80/A', '27154D20/AS', '30156A43/A', '59155G87/B'];
                const randomExample = examples[Math.floor(Math.random() * examples.length)];
                setCustomArt(randomExample);
              }}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              📋 Пример артикула
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №1</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAsImage(tag1Ref, 'tag1')}
                  className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-700 transition-colors font-medium"
                  title="Сохранить как PNG в высоком качестве (x6)"
                >
                  💾 PNG
                </button>
                <button
                  onClick={() => handlePrint(tag1Ref)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors font-medium"
                  title="Печать"
                >
                  🖨 Print
                </button>
              </div>
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
              {getTag1Content()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №2</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAsImage(tag2Ref, 'tag2')}
                  className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                  title="Сохранить как PNG"
                >
                  💾 PNG
                </button>
                <button
                  onClick={() => handlePrint(tag2Ref)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                  title="Печать"
                >
                  🖨 Print
                </button>
              </div>
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
              {getTag2Content()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Бирка №3</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAsImage(tag3Ref, 'tag3')}
                  className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
                  title="Сохранить как PNG"
                >
                  💾 PNG
                </button>
                <button
                  onClick={() => handlePrint(tag3Ref)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                  title="Печать"
                >
                  🖨 Print
                </button>
              </div>
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
              {getTag3Content()}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">💡 Инструкция по использованию:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• <strong>Тип одежды:</strong> Выберите категорию для правильного состава материала (куртка, свитер, футболка и т.д.)</li>
            <li>• <strong>Качество печати:</strong> Кнопка "💾 PNG" сохраняет изображение в высоком качестве (scale x6) - идеально для профессиональной печати</li>
            <li>• <strong>Печать:</strong> Кнопка "🖨 Print" открывает окно печати с размером 50x70mm</li>
            <li>• <strong>Артикул:</strong> Введите свой артикул или используйте кнопку генерации случайного номера</li>
            <li>• <strong>Примеры артикулов:</strong></li>
            <li className="ml-4">- ART.3915M422/448 (куртка, Румыния)</li>
            <li className="ml-4">- ART.29155K80/A (свитер 80/20)</li>
            <li className="ml-4">- ART.30156A43/A (100% шерсть)</li>
            <li className="ml-4">- ART.27154D20/AS (футболка/лонгслив)</li>
            <li>• <strong>Все бирки:</strong> Кнопка "💾 Сохранить все как PNG" сохраняет все три бирки сразу</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
