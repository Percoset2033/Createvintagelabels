import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

// Типы одежды с описаниями составов
const garmentTypes = [
  {
    id: 'jacket',
    name: 'Куртка (Jacket)',
    code: '4',
    description: 'Техническая куртка с многослойной структурой',
    variants: ['standard', 'soft_shell', 'membrana']
  },
  {
    id: 'hoodie',
    name: 'Худи (Hoodie)',
    code: '6',
    description: 'Хлопковое худи с эластаном',
    variants: ['standard', 'heavyweight', 'vintage']
  },
  {
    id: 'zip_hoodie',
    name: 'Худи на молнии (Zip Hoodie)',
    code: '6',
    description: 'Худи на молнии',
    variants: ['standard', 'heavy']
  },
  {
    id: 'sweater_wool',
    name: 'Свитер 100% шерсть (Wool Sweater)',
    code: '5',
    description: 'Чистошерстяной трикотаж',
    variants: ['standard', 'heavy_knit']
  },
  {
    id: 'sweater_mixed',
    name: 'Свитер 80/20 (Mixed Sweater)',
    code: '5',
    description: 'Шерсть с полиамидом для прочности',
    variants: ['standard', '70_30']
  },
  {
    id: 'sweater_cashmere',
    name: 'Свитер кашемир (Cashmere Sweater)',
    code: '5',
    description: 'Премиум трикотаж с кашемиром',
    variants: ['85_15', '90_10']
  },
  {
    id: 'crewneck',
    name: 'Свитшот (Crewneck)',
    code: '6',
    description: 'Хлопковый свитшот',
    variants: ['standard', 'fleece']
  },
  {
    id: 'longsleeve',
    name: 'Лонгслив (Longsleeve)',
    code: '2',
    description: 'Футболка с длинным рукавом',
    variants: ['standard', 'heavy']
  },
  {
    id: 'tshirt',
    name: 'Футболка (T-shirt)',
    code: '2',
    description: 'Базовая хлопковая футболка',
    variants: ['standard', 'mercerized']
  }
];

// Сезоны 2007-2009
const seasons2007to2009 = [
  { id: 'ss2007', name: 'SS 2007', prefix: '29', letter: 'K' },
  { id: 'aw2007', name: 'AW 2007', prefix: '30', letter: 'A' },
  { id: 'ss2008', name: 'SS 2008', prefix: '34', letter: 'M' },
  { id: 'aw2008', name: 'AW 2008', prefix: '36', letter: 'P' },
  { id: 'ss2009', name: 'SS 2009', prefix: '44', letter: 'S' },
  { id: 'aw2009', name: 'AW 2009', prefix: '49', letter: 'K' }
];

// Сезоны 2010-2014
const seasons2010to2014 = [
  { id: 'ss2010', name: 'SS 2010', prefix: '52', letter: 'A' },
  { id: 'aw2010', name: 'AW 2010', prefix: '53', letter: 'B' },
  { id: 'ss2011', name: 'SS 2011', prefix: '54', letter: 'C' },
  { id: 'aw2011', name: 'AW 2011', prefix: '55', letter: 'D' },
  { id: 'ss2012', name: 'SS 2012', prefix: '56', letter: 'F' },
  { id: 'aw2012', name: 'AW 2012', prefix: '57', letter: 'E' },
  { id: 'ss2013', name: 'SS 2013', prefix: '58', letter: 'M' },
  { id: 'aw2013', name: 'AW 2013', prefix: '59', letter: 'G' },
  { id: 'ss2014', name: 'SS 2014', prefix: '60', letter: 'H' }
];

const countries = ['ITALY', 'ROMANIA', 'TUNISIA', 'PORTUGAL', 'TURKEY'];

export default function App() {
  const [garmentType, setGarmentType] = useState('jacket');
  const [variant, setVariant] = useState('standard');
  const [season, setSeason] = useState('aw2013');
  const [country, setCountry] = useState('ROMANIA');
  const [customArt, setCustomArt] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [tagStyle, setTagStyle] = useState<'modern' | 'vintage'>('modern');
  const [tagFormat, setTagFormat] = useState<'separate' | 'combined'>('separate');

  const tag1Ref = useRef<HTMLDivElement>(null);
  const tag2Ref = useRef<HTMLDivElement>(null);
  const tag3Ref = useRef<HTMLDivElement>(null);
  const tag4Ref = useRef<HTMLDivElement>(null);
  const bigTagRef = useRef<HTMLDivElement>(null);

  const currentSeasons = [...seasons2007to2009, ...seasons2010to2014];
  const currentGarment = garmentTypes.find(g => g.id === garmentType);
  const currentSeason = currentSeasons.find(s => s.id === season);

  const generateArticleNumber = () => {
    const seasonPrefix = currentSeason?.prefix || '59';
    const garmentCode = currentGarment?.code || '5';
    const letter = currentSeason?.letter || 'G';
    const modelNumber = Math.floor(Math.random() * 600 + 100);
    const colorCode = Math.floor(Math.random() * 900 + 100);

    return `${seasonPrefix}155${letter}${garmentCode}${modelNumber}/${colorCode}`;
  };

  const [articleNumber, setArticleNumber] = useState(generateArticleNumber());

  const handleGenerate = () => {
    setArticleNumber(generateArticleNumber());
  };

  const handleSaveAsImage = async (tagRef: React.RefObject<HTMLDivElement>, tagName: string) => {
    if (!tagRef.current) {
      alert('Бирка не найдена!');
      return;
    }

    try {
      // Получаем все элементы и их стили ДО клонирования
      const elementsWithStyles: Array<{ element: Element; styles: CSSStyleDeclaration }> = [];
      const allOriginalElements = tagRef.current.querySelectorAll('*');

      allOriginalElements.forEach((el) => {
        elementsWithStyles.push({
          element: el,
          styles: window.getComputedStyle(el)
        });
      });

      // Теперь клонируем
      const clone = tagRef.current.cloneNode(true) as HTMLDivElement;
      const allClonedElements = clone.querySelectorAll('*');

      // Применяем стили к клонам
      allClonedElements.forEach((clonedEl, index) => {
        const htmlEl = clonedEl as HTMLElement;
        const originalStyle = elementsWithStyles[index]?.styles;

        if (originalStyle) {
          // Применяем только безопасные цвета
          const color = originalStyle.color;
          const bgColor = originalStyle.backgroundColor;

          htmlEl.style.cssText = `
            color: ${color};
            background-color: ${bgColor};
            font-size: ${originalStyle.fontSize};
            font-weight: ${originalStyle.fontWeight};
            line-height: ${originalStyle.lineHeight};
            text-align: ${originalStyle.textAlign};
            padding: ${originalStyle.padding};
            margin: ${originalStyle.margin};
            border: ${originalStyle.border};
            display: ${originalStyle.display};
            flex-direction: ${originalStyle.flexDirection};
            justify-content: ${originalStyle.justifyContent};
            align-items: ${originalStyle.alignItems};
            gap: ${originalStyle.gap};
          `;
        }
      });

      // Применяем стили к корневому клону
      const rootStyle = window.getComputedStyle(tagRef.current);
      clone.style.cssText = `
        width: ${tagRef.current.offsetWidth}px;
        height: ${tagRef.current.offsetHeight}px;
        padding: ${rootStyle.padding};
        background-color: #ffffff;
        border: 2px solid #000000;
        font-family: Arial, Helvetica, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        left: -9999px;
        top: -9999px;
      `;

      // Добавляем клон временно в DOM
      document.body.appendChild(clone);

      // Небольшая задержка для рендеринга
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 6,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: false,
        imageTimeout: 0,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
      });

      // Удаляем клон
      document.body.removeChild(clone);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const garmentName = currentGarment?.name.split(' ')[0] || 'tag';
          link.download = `sportswear-${garmentName}-${tagName}-${customArt || articleNumber}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          alert('Ошибка создания blob');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert(`Ошибка при сохранении: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  // БИРКА 1 - Основная с составом
  const getTag1Content = () => {
    const art = customArt || articleNumber;

    if (garmentType === 'jacket') {
      if (variant === 'membrana') {
        // Куртка с мембраной - как на оригинале
        return (
          <div className="text-center leading-[1.15]">
            <div className="mb-2">
              <div className="text-[13px] font-bold tracking-[0.08em] letterspacing-wide">SPORTSWEAR</div>
              <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
              <div className="text-[7px] mt-0.5 leading-[1.2]">SPW - VIA CONFINE 2161</div>
              <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
            </div>

            <div className="text-[7px] leading-[1.25] my-1.5">
              <div className="font-bold mb-0.5">INTERNO</div>
              <div className="leading-[1.1]">100%COTONE-COTTON-BAUMWOLLE-COTON</div>
              <div>ALGODON-ALGODAO-棉花</div>
            </div>

            <div className="text-[7px] leading-[1.25] my-1.5">
              <div className="font-bold mb-0.5">ESTERNO 1</div>
              <div className="leading-[1.1]">100%POLIAMMIDICA-NYLON-POLYAMIDE</div>
              <div>POLYAMID-POLIAMIDA-太方片</div>
            </div>

            <div className="text-[7px] leading-[1.25] my-1.5">
              <div className="font-bold mb-0.5">ESTERNO 2</div>
              <div className="leading-[1.1]">100%POLIAMMIDICA-NYLON-POLYAMIDE</div>
              <div>POLYAMID-POLIAMIDA-太方片</div>
            </div>

            <div className="text-[7px] leading-[1.25] my-1.5">
              <div className="font-bold mb-0.5">SPALMATORA</div>
              <div className="leading-[1.1]">100%POLIESTERE-POLYESTER-POLIESTER</div>
              <div>ポリエステル</div>
            </div>

            <div className="mt-1.5 text-[7.5px] font-semibold">
              MADE IN {country === 'ROMANIA' ? 'RUMANIA ルーマニア製' : country === 'ITALY' ? 'ITALIA イタリア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
            </div>
            <div className="text-[9px] font-bold mt-1">
              ART .{art}
            </div>
            <div className="text-[6px] mt-0.5">
              (株) 典田貿易　03-5350-4524
            </div>
          </div>
        );
      }
    } else if (garmentType === 'hoodie' || garmentType === 'zip_hoodie') {
      if (tagStyle === 'vintage') {
        // Старый стиль - компактный
        return (
          <div className="text-center leading-[1.2]">
            <div className="mb-1.5">
              <div className="text-[11px] font-bold">SPORTSWEAR</div>
              <div className="text-[8px] font-semibold">COMPANY S.P.A.</div>
              <div className="text-[6px] mt-0.5">VIA CONFINE 2161 RAVARINO(MO)ITALIA</div>
            </div>

            <div className="my-2">
              <div className="text-[12px] font-bold mb-1">95%</div>
              <div className="text-[8px] leading-[1.2]">
                <div>COTONE</div>
                <div>COTTON</div>
                <div>COTON</div>
                <div>ALGODON</div>
                <div>ALGODAO-綿-棉</div>
              </div>
            </div>

            <div className="my-2">
              <div className="text-[12px] font-bold mb-1">5%</div>
              <div className="text-[7.5px] leading-[1.2]">
                <div>ELASTAM-ELASTANE</div>
                <div>ELASTAN</div>
                <div>ELASTHANNE</div>
                <div>ELASTANO</div>
                <div>ポリウレタン-氨綸</div>
              </div>
            </div>

            <div className="mt-2 text-[8px] font-bold">
              ART. {art}
            </div>
            <div className="text-[6px] mt-0.5">
              (株) 典田貿易　03-5350-4524
            </div>
          </div>
        );
      } else {
        // Современный стиль - большой
        return (
          <div className="text-center leading-[1.2]">
            <div className="mb-2">
              <div className="text-[14px] font-bold tracking-[0.05em]">SPORTSWEAR</div>
              <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
              <div className="text-[7px] mt-1">SPW - VIA CONFINE 2161</div>
              <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
            </div>

            <div className="my-2">
              <div className="text-[14px] font-bold mb-1">95%</div>
              <div className="text-[9px] leading-[1.3]">
                <div>COTONE-COTTON</div>
                <div>BAUMWOLLE-COTON</div>
                <div>ALGODON-ALGODAO</div>
                <div className="mt-0.5">綿-棉</div>
              </div>
            </div>

            <div className="my-2">
              <div className="text-[14px] font-bold mb-1">5%</div>
              <div className="text-[8px] leading-[1.3]">
                <div>ELASTAM-ELASTANE</div>
                <div>ELASTAN-ELASTHANNE</div>
                <div>ELASTANO</div>
                <div className="mt-0.5">ポリウレタン-氨綸</div>
              </div>
            </div>

            <div className="mt-2 text-[8px] font-semibold">
              MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
            </div>
            <div className="text-[9px] font-bold mt-1">
              ART. {art}
            </div>
            <div className="text-[6px] mt-0.5">
              (株) 典田貿易　03-5350-4524
            </div>
          </div>
        );
      }
    } else if (garmentType === 'sweater_wool') {
      // 100% шерсть - большой формат
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[14px] font-bold tracking-[0.05em]">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[7px] mt-1">SPW - VIA CONFINE 2161</div>
            <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
          </div>

          <div className="my-3">
            <div className="text-[16px] font-bold mb-1">100%</div>
            <div className="text-[10px] leading-[1.3] font-semibold">
              <div>LANA</div>
              <div>WOOL-WOLLE</div>
              <div>LAINE-LA</div>
              <div className="mt-1">ウール</div>
            </div>
          </div>

          <div className="mt-2 text-[8px] font-semibold">
            MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART .{art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株)　典田貿易　03-5350-4524
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_mixed') {
      // 80/20 шерсть - большой формат
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[14px] font-bold tracking-[0.05em]">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[7px] mt-1">SPW - VIA CONFINE 2161</div>
            <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
          </div>

          <div className="text-[9px] leading-[1.3] my-2 font-semibold">
            <div>80%LANA-WOOL-WOLLE-LAINE-LA</div>
            <div className="mt-0.5">ウール</div>
          </div>

          <div className="text-[9px] leading-[1.3] my-2">
            <div className="font-semibold">20%POLIAMMIDICA-NYLON</div>
            <div>POLYAMIDE-POLYAMID</div>
            <div>POLIAMIDA-</div>
            <div className="mt-0.5">ナイロン</div>
          </div>

          <div className="mt-2 text-[8px] font-semibold">
            MADE IN {country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART. {art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_cashmere') {
      // Кашемир - большой формат
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[14px] font-bold tracking-[0.05em]">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[7px] mt-1">SPW - VIA CONFINE 2161</div>
            <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
          </div>

          <div className="text-[9px] leading-[1.3] my-2">
            <div className="font-semibold">85% COTONE-COTTON</div>
            <div>BAUMWOLLE-COTON</div>
            <div>ALGODON-ALGODAO</div>
            <div className="mt-0.5">棉</div>
          </div>

          <div className="text-[9px] leading-[1.3] my-2">
            <div className="font-semibold">15% KASHMIR-CASHMERE</div>
            <div>KASCHMIR-CACHEMIRE</div>
            <div>CACHEMIRA-CAXEMIRA</div>
            <div className="mt-0.5">カシミヤ</div>
          </div>

          <div className="mt-2 text-[8px] font-semibold">
            MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART.{art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    } else {
      // T-shirt, Longsleeve, Crewneck - базовый хлопок
      return (
        <div className="text-center leading-[1.2]">
          <div className="mb-2">
            <div className="text-[14px] font-bold tracking-[0.05em]">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[7px] mt-1">SPW - VIA CONFINE 2161</div>
            <div className="text-[7px]">RAVARINO (MO) ITALIA</div>
          </div>

          <div className="my-3">
            <div className="text-[16px] font-bold mb-1">100%</div>
            <div className="text-[9px] leading-[1.3]">
              <div>COTONE-COTTON</div>
              <div>BAUMWOLLE-COTON</div>
              <div>ALGODON-ALGODAO</div>
              <div className="mt-0.5">綿</div>
            </div>
          </div>

          <div className="mt-2 text-[8px] font-semibold">
            MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART. {art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    }
  };

  // БИРКА 2 - Инструкции по уходу
  const getTag2Content = () => {
    if (garmentType === 'jacket') {
      return (
        <div className="text-[5px] leading-[1.3]">
          <div className="flex justify-center gap-1 mb-1.5">
            <span className="text-[9px]">🧺</span>
            <span className="text-[9px]">⚠</span>
            <span className="text-[9px]">🔲</span>
            <span className="text-[9px]">⊗</span>
            <span className="text-[9px]">✕</span>
          </div>

          <div className="mb-1">
            <div>LAVARE SEPARATAMENTE A 30°C CICLO DELICATO</div>
            <div>NON CANDEGGIARE. NON LAVARE A SECCO.</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>STIRARE A MAX. 110°C SENZA VAPORE</div>
            <div>NON STIRARE LA STAMPA</div>
          </div>

          <div className="mb-1">
            <div>LAVAR SEPARADAMENTE A 30°C CICLO DELICADO</div>
            <div>NÃO USE ALVEJANTE. NÃO LAVAR A SECO.</div>
            <div>NÃO SECAR EM MÁQUINA</div>
            <div>PASSAR A FERRO MAX. 110°C SEM VAPOR</div>
          </div>

          <div className="mb-1">
            <div>MACHINE WASH SEPARATELY AT 30°C GENTLE CYCLE</div>
            <div>DO NOT BLEACH. DO NOT DRY CLEAN.</div>
            <div>DO NOT TUMBLE DRY. IRON MAX. 110°C</div>
            <div>WITHOUT STEAM. DO NOT IRON PRINT</div>
          </div>

          <div className="mb-1">
            <div>LAVER SÉPARÉMENT À 30°C PROGRAMME DOUX</div>
            <div>NE PAS JAVELLISER. NE PAS NETTOYER À SEC.</div>
            <div>NE PAS SÉCHER EN MACHINE</div>
            <div>REPASSER MAX. 110°C SANS VAPEUR</div>
          </div>

          <div className="mb-1">
            <div>SEPARAT BEI 30°C WASCHEN SCHONWASCHGANG</div>
            <div>NICHT BLEICHEN. NICHT CHEMISCH REINIGEN.</div>
            <div>NICHT IM WÄSCHETROCKNER TROCKNEN</div>
            <div>BÜGELN MAX. 110°C OHNE DAMPF</div>
          </div>

          <div>
            <div>ワリレと衣物分洗浄。可以用</div>
            <div>中温熨烫但必需低于30度</div>
            <div>不可漂白</div>
            <div>不可干洗烘干</div>
            <div>不可熨燙印花</div>
            <div>以低温熨整洗衣</div>
            <div>補羊毛不可</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-[5.5px] leading-[1.3]">
          <div className="flex justify-center gap-1 mb-1.5">
            <span className="text-[9px]">🧺</span>
            <span className="text-[9px]">⚠</span>
            <span className="text-[9px]">🔲</span>
            <span className="text-[9px]">⊗</span>
            <span className="text-[9px]">✕</span>
          </div>

          <div className="mb-1">
            <div>LAVARE SEPARATAMENTE A 30°C AL ROVESCIO</div>
            <div>NON CANDEGGIARE. NON LAVARE A SECCO.</div>
            <div>NON ASCIUGARE IN ASCIUGATRICE</div>
            <div>ASCIUGARE IN VERTICALE - HANG TO DRY</div>
            <div>STIRARE A BASSA TEMPERATURA</div>
            <div>NON STIRARE LA STAMPA</div>
          </div>

          <div className="mb-1">
            <div>LAVAR SEPARADAMENTE A 30°C DO AVESSO</div>
            <div>NÃO USE ALVEJANTE. NÃO LAVAR A SECO.</div>
            <div>NÃO SECAR EM MÁQUINA. SECAR PENDURADO</div>
          </div>

          <div className="mb-1">
            <div>WASH SEPARATELY AT 30°C INSIDE OUT</div>
            <div>DO NOT BLEACH. DO NOT DRY CLEAN.</div>
            <div>DO NOT TUMBLE DRY. HANG TO DRY</div>
            <div>IRON AT LOW TEMPERATURE</div>
            <div>DO NOT IRON PRINT</div>
          </div>

          <div>
            <div>LAVER SÉPARÉMENT À 30°C À L'ENVERS</div>
            <div>NE PAS JAVELLISER. NE PAS NETTOYER À SEC.</div>
            <div>NE PAS SÉCHER EN MACHINE. SÉCHER À PLAT</div>
            <div>REPASSER À BASSE TEMPÉRATURE</div>
          </div>
        </div>
      );
    }
  };

  // БИРКА 3 - Компактная (MADE IN + ART)
  const getTag3Content = () => {
    const art = customArt || articleNumber;

    return (
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-1.5">
          <span className="text-[9px]">🧺</span>
          <span className="text-[9px]">⚠</span>
          <span className="text-[9px]">🔲</span>
          <span className="text-[9px]">⊗</span>
          <span className="text-[9px]">✕</span>
        </div>

        <div className="border-t border-dashed border-black w-full my-1.5"></div>

        <div className="text-[7px] font-semibold">
          {country === 'ITALY' ? 'MADE IN ITALY-イタリア製' :
           country === 'ROMANIA' ? 'MADE IN ROMANIA-ルーマニア製' :
           country === 'TUNISIA' ? 'MADE IN TUNISIA-チュニジア製' :
           country === 'PORTUGAL' ? 'MADE IN PORTUGAL-ポルトガル製' :
           'MADE IN TURKEY-トルコ製'}
        </div>
        <div className="text-[8px] font-bold mt-1">
          ART.{art}
        </div>
      </div>
    );
  };

  // БИРКА 4 - Дополнительная (только MADE IN)
  const getTag4Content = () => {
    return (
      <div className="text-center">
        <div className="text-[8px] font-semibold">
          {country === 'ITALY' ? 'MADE IN ITALY イタリア製' :
           country === 'ROMANIA' ? 'MADE IN ROMANIA ルーマニア製' :
           country === 'TUNISIA' ? 'MADE IN TUNISIA チュニジア製' :
           country === 'PORTUGAL' ? 'MADE IN PORTUGAL ポルトガル製' :
           'MADE IN TURKEY トルコ製'}
        </div>
      </div>
    );
  };

  // БОЛЬШАЯ КОМБИНИРОВАННАЯ БИРКА (Состав + Инструкции)
  const getBigCombinedTagContent = () => {
    const art = customArt || articleNumber;

    if (garmentType === 'hoodie' || garmentType === 'zip_hoodie') {
      return (
        <div className="text-center leading-[1.15]">
          <div className="mb-2">
            <div className="text-[13px] font-bold tracking-wide">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[6.5px] mt-0.5">SPW - VIA CONFINE 2161 RAVARINO (MO) ITALIA</div>
          </div>

          <div className="my-2">
            <div className="text-[13px] font-bold mb-0.5">95%</div>
            <div className="text-[8px] leading-[1.2]">
              <div>COTONE-COTTON-BAUMWOLLE</div>
              <div>COTON-ALGODON-ALGODAO</div>
              <div>綿-棉</div>
            </div>
          </div>

          <div className="my-2">
            <div className="text-[13px] font-bold mb-0.5">5%</div>
            <div className="text-[7.5px] leading-[1.2]">
              <div>ELASTAM-ELASTANE-ELASTAN</div>
              <div>ELASTHANNE-ELASTANO</div>
              <div>ポリウレタン-氨綸</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[5.5px] leading-[1.25] my-2">
            <div className="mb-1">
              <div>LAVARE SEPARATAMENTE A 30°C AL ROVESCIO</div>
              <div>NON CANDEGGIARE. NON ASCIUGARE IN ASCIUGATRICE</div>
              <div>STIRARE A BASSA TEMPERATURA. NON STIRARE LA STAMPA</div>
            </div>
            <div className="mb-1">
              <div>WASH SEPARATELY AT 30°C INSIDE OUT</div>
              <div>DO NOT BLEACH. DO NOT TUMBLE DRY</div>
              <div>IRON AT LOW TEMPERATURE. DO NOT IRON PRINT</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="flex justify-center gap-1 mb-1">
            <span className="text-[9px]">🧺</span>
            <span className="text-[9px]">⚠</span>
            <span className="text-[9px]">🔲</span>
            <span className="text-[9px]">⊗</span>
            <span className="text-[9px]">✕</span>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="mt-2 text-[7.5px] font-semibold">
            MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART. {art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    } else if (garmentType === 'sweater_wool' || garmentType === 'sweater_mixed') {
      return (
        <div className="text-center leading-[1.15]">
          <div className="mb-2">
            <div className="text-[13px] font-bold tracking-wide">SPORTSWEAR</div>
            <div className="text-[9px] font-semibold">COMPANY S.P.A.</div>
            <div className="text-[6.5px] mt-0.5">SPW - VIA CONFINE 2161 RAVARINO (MO) ITALIA</div>
          </div>

          {garmentType === 'sweater_wool' ? (
            <div className="my-2">
              <div className="text-[14px] font-bold mb-0.5">100%</div>
              <div className="text-[9px] leading-[1.2] font-semibold">
                <div>LANA-WOOL-WOLLE</div>
                <div>LAINE-LÃ</div>
                <div>ウール</div>
              </div>
            </div>
          ) : (
            <>
              <div className="my-2">
                <div className="text-[9px] leading-[1.2] font-semibold">
                  <div>80% LANA-WOOL-WOLLE-LAINE-LÃ</div>
                  <div>ウール</div>
                </div>
              </div>
              <div className="my-2">
                <div className="text-[8.5px] leading-[1.2]">
                  <div className="font-semibold">20% POLIAMMIDICA-NYLON</div>
                  <div>POLYAMIDE-POLYAMID-POLIAMIDA</div>
                  <div>ナイロン</div>
                </div>
              </div>
            </>
          )}

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="text-[5.5px] leading-[1.25] my-2">
            <div className="mb-1">
              <div>LAVARE A MANO IN ACQUA FREDDA</div>
              <div>NON CANDEGGIARE. NON ASCIUGARE IN ASCIUGATRICE</div>
              <div>ASCIUGARE IN ORIZZONTALE. NON LAVARE A SECCO</div>
            </div>
            <div className="mb-1">
              <div>HAND WASH IN COLD WATER</div>
              <div>DO NOT BLEACH. DO NOT TUMBLE DRY</div>
              <div>DRY FLAT. DO NOT DRY CLEAN</div>
            </div>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="flex justify-center gap-1 mb-1">
            <span className="text-[9px]">🧺</span>
            <span className="text-[9px]">⚠</span>
            <span className="text-[9px]">🔲</span>
            <span className="text-[9px]">⊗</span>
            <span className="text-[9px]">✕</span>
          </div>

          <div className="border-t border-dashed border-black w-full my-2"></div>

          <div className="mt-2 text-[7.5px] font-semibold">
            MADE IN {country === 'ITALY' ? 'ITALY イタリア製' : country === 'ROMANIA' ? 'ROMANIA ルーマニア製' : country === 'TUNISIA' ? 'TUNISIA チュニジア製' : country === 'PORTUGAL' ? 'PORTUGAL ポルトガル製' : 'TURKEY トルコ製'}
          </div>
          <div className="text-[9px] font-bold mt-1">
            ART. {art}
          </div>
          <div className="text-[6px] mt-0.5">
            (株) 典田貿易　03-5350-4524
          </div>
        </div>
      );
    }

    // Для остальных типов - базовая комбинированная бирка
    return getTag1Content();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">SPORTSWEAR Company</h1>
          <p className="text-lg text-gray-600">Профессиональный генератор бирок для одежды Stone Island 2007-2014</p>
        </div>

        {/* Панель управления */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Тип одежды:</label>
              <select
                value={garmentType}
                onChange={(e) => {
                  setGarmentType(e.target.value);
                  const newGarment = garmentTypes.find(g => g.id === e.target.value);
                  if (newGarment?.variants) {
                    setVariant(newGarment.variants[0]);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {garmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {currentGarment && currentGarment.variants.length > 1 && (
              <div>
                <label className="block text-sm font-semibold mb-2">Вариант:</label>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {currentGarment.variants.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Сезон:</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="2007-2009">
                  {seasons2007to2009.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="2010-2014">
                  {seasons2010to2014.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Страна производства:</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Формат бирок:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTagFormat('separate')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${tagFormat === 'separate' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  4 раздельные
                </button>
                <button
                  onClick={() => setTagFormat('combined')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${tagFormat === 'combined' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  1 большая
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Стиль бирки:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTagStyle('modern')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${tagStyle === 'modern' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Современный
                </button>
                <button
                  onClick={() => setTagStyle('vintage')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${tagStyle === 'vintage' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Винтаж
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Артикул (оставьте пустым для авто):</label>
              <input
                type="text"
                value={customArt}
                onChange={(e) => setCustomArt(e.target.value)}
                placeholder="3915M422/448"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Информация о текущем типе */}
          {currentGarment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">{currentGarment.name}</h3>
                  <p className="text-sm text-blue-800">{currentGarment.description}</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Код: {currentGarment.code} | Сезон: {currentSeason?.name} | Артикул: {customArt || articleNumber}
                  </p>
                </div>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  {showInfo ? '▲ Скрыть' : '▼ Подробнее'}
                </button>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-gray-800 to-black text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              🎲 Генерировать артикул
            </button>
            <button
              onClick={() => {
                const examples = ['3915M422/448', '29155K80/A', '451553B2/886', '39155794/40', '51156035/148', '49155SB5/6076'];
                const randomExample = examples[Math.floor(Math.random() * examples.length)];
                setCustomArt(randomExample);
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              📋 Пример артикула
            </button>
            <button
              onClick={() => {
                if (tagFormat === 'combined') {
                  handleSaveAsImage(bigTagRef, 'combined-tag');
                } else {
                  handleSaveAsImage(tag1Ref, 'tag1');
                  setTimeout(() => handleSaveAsImage(tag2Ref, 'tag2'), 600);
                  setTimeout(() => handleSaveAsImage(tag3Ref, 'tag3'), 1200);
                  setTimeout(() => handleSaveAsImage(tag4Ref, 'tag4'), 1800);
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              💾 Сохранить все (PNG)
            </button>
            <button
              onClick={() => {
                setCustomArt('');
                handleGenerate();
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              🔄 Сбросить
            </button>
          </div>
        </div>

        {/* Справочная информация */}
        {showInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">📚 Справочная информация по составам</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🧥 Куртки</h4>
                <p className="text-gray-700">INTERNO: 100% Хлопок (подкладка)</p>
                <p className="text-gray-700">ESTERNO 1/2: 100% Полиамид (внешние слои)</p>
                <p className="text-gray-700">SPALMATORA: 100% Полиэстер (покрытие)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">👕 Худи/Свитшоты</h4>
                <p className="text-gray-700">95% Хлопок + 5% Эластан</p>
                <p className="text-gray-700">Мягкие, эластичные, комфортные</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🧶 Трикотаж (шерсть)</h4>
                <p className="text-gray-700">100% Шерсть - премиум качество</p>
                <p className="text-gray-700">80% Шерсть + 20% Полиамид - прочнее</p>
                <p className="text-gray-700">85% Хлопок + 15% Кашемир - люкс</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">👔 Футболки/Лонгсливы</h4>
                <p className="text-gray-700">100% Хлопок - базовый вариант</p>
                <p className="text-gray-700">Мерсеризованный хлопок - премиум</p>
              </div>
            </div>
          </div>
        )}

        {/* Бирки */}
        {tagFormat === 'combined' ? (
          /* Одна большая комбинированная бирка */
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold">Комбинированная бирка (Всё в одной)</h2>
                <button
                  onClick={() => handleSaveAsImage(bigTagRef, 'combined-tag')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-all font-medium shadow-sm"
                  title="Сохранить в высоком качестве"
                >
                  💾 Сохранить
                </button>
              </div>
              <div
                ref={bigTagRef}
                className="bg-white border-2 border-black mx-auto"
                style={{
                  width: '50mm',
                  minHeight: '120mm',
                  padding: '3mm',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {getBigCombinedTagContent()}
              </div>
            </div>
          </div>
        ) : (
          /* 4 раздельные бирки */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Бирка 1 */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold">Бирка №1 (Состав)</h2>
              <button
                onClick={() => handleSaveAsImage(tag1Ref, 'tag1')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-700 transition-all font-medium shadow-sm"
                title="Сохранить в высоком качестве (x8)"
              >
                💾 Сохранить
              </button>
            </div>
            <div
              ref={tag1Ref}
              className="bg-white border-2 border-black mx-auto"
              style={{
                width: '50mm',
                minHeight: '70mm',
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

          {/* Бирка 2 */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold">Бирка №2 (Уход)</h2>
              <button
                onClick={() => handleSaveAsImage(tag2Ref, 'tag2')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-700 transition-all font-medium shadow-sm"
                title="Сохранить в высоком качестве (x8)"
              >
                💾 Сохранить
              </button>
            </div>
            <div
              ref={tag2Ref}
              className="bg-white border-2 border-black mx-auto"
              style={{
                width: '50mm',
                minHeight: '70mm',
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

          {/* Бирка 3 */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold">Бирка №3 (Арт.)</h2>
              <button
                onClick={() => handleSaveAsImage(tag3Ref, 'tag3')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-700 transition-all font-medium shadow-sm"
                title="Сохранить в высоком качестве (x8)"
              >
                💾 Сохранить
              </button>
            </div>
            <div
              ref={tag3Ref}
              className="bg-white border-2 border-black mx-auto"
              style={{
                width: '50mm',
                minHeight: '70mm',
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

          {/* Бирка 4 */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold">Бирка №4 (Made In)</h2>
              <button
                onClick={() => handleSaveAsImage(tag4Ref, 'tag4')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-purple-700 transition-all font-medium shadow-sm"
                title="Сохранить в высоком качестве (x8)"
              >
                💾 Сохранить
              </button>
            </div>
            <div
              ref={tag4Ref}
              className="bg-white border-2 border-black mx-auto"
              style={{
                width: '50mm',
                minHeight: '30mm',
                padding: '3mm',
                fontFamily: 'Arial, Helvetica, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {getTag4Content()}
            </div>
          </div>
        </div>
        )}

        {/* Инструкция */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 Инструкция по использованию</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
            <div>
              <h4 className="font-semibold mb-2">🏷️ Генерация бирок:</h4>
              <ul className="space-y-1">
                <li>• Выберите тип одежды из списка (9 типов)</li>
                <li>• Выберите сезон (2007-2014, 15 сезонов)</li>
                <li>• Укажите страну производства (5 стран)</li>
                <li>• Введите свой артикул или сгенерируйте</li>
                <li>• <strong>НОВИНКА:</strong> Выберите формат - 4 раздельные или 1 большая</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💾 Сохранение:</h4>
              <ul className="space-y-1">
                <li>• Качество: x6 scale (идеально для печати)</li>
                <li>• Формат: PNG с белым фоном</li>
                <li>• "Сохранить все" - автоматически сохранит бирки</li>
                <li>• Каждую бирку можно сохранить отдельно</li>
                <li>• <strong>Исправлено:</strong> Поддержка современных Tailwind цветов</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎨 Форматы бирок:</h4>
              <ul className="space-y-1">
                <li>• <strong>4 раздельные:</strong> Состав, Уход, Арт., Made In</li>
                <li>• <strong>1 большая:</strong> Всё в одной бирке (состав + уход)</li>
                <li>• Современный - крупный текст (2010-2014)</li>
                <li>• Винтаж - компактный формат (2007-2009)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📋 Примеры артикулов:</h4>
              <ul className="space-y-1">
                <li>• ART.3915M422/448 (куртка, Румыния)</li>
                <li>• ART.29155K80/A (свитер 80/20, 2007)</li>
                <li>• ART.451553B2/886 (свитер, 2010)</li>
                <li>• ART.51156035/148 (худи, 2010)</li>
                <li>• ART.39155794/40 (100% шерсть, 2007)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
