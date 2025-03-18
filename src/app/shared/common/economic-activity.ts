export interface IEconomicActivity {
	value: string;
	name: string;
	id_code_ciiu: number;
	id_section_ciiu: number;
}

export const ECONOMIC_ACTIVITIES: IEconomicActivity[] = [
	{
		value: '111',
		name: 'Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas',
		id_code_ciiu: 1,
		id_section_ciiu: 1
	},
	{
		value: '112',
		name: 'Cultivo de arroz',
		id_code_ciiu: 2,
		id_section_ciiu: 1
	},
	{
		value: '113',
		name: 'Cultivo de hortalizas, raíces y tubérculos',
		id_code_ciiu: 3,
		id_section_ciiu: 1
	},
	{
		value: '114',
		name: 'Cultivo de tabaco',
		id_code_ciiu: 4,
		id_section_ciiu: 1
	},
	{
		value: '115',
		name: 'Cultivo de plantas textiles',
		id_code_ciiu: 5,
		id_section_ciiu: 1
	},
	{
		value: '119',
		name: 'Otros cultivos transitorios n.c.p.',
		id_code_ciiu: 6,
		id_section_ciiu: 1
	},
	{
		value: '121',
		name: 'Cultivo de frutas tropicales y subtropicales',
		id_code_ciiu: 7,
		id_section_ciiu: 1
	},
	{
		value: '122',
		name: 'Cultivo de plátano y banano',
		id_code_ciiu: 8,
		id_section_ciiu: 1
	},
	{
		value: '123',
		name: 'Cultivo de café',
		id_code_ciiu: 9,
		id_section_ciiu: 1
	},
	{
		value: '124',
		name: 'Cultivo de caña de azúcar',
		id_code_ciiu: 10,
		id_section_ciiu: 1
	},
	{
		value: '125',
		name: 'Cultivo de flor de corte',
		id_code_ciiu: 11,
		id_section_ciiu: 1
	},
	{
		value: '126',
		name: 'Cultivo de palma para aceite (palma africana) y otros frutos oleaginosos',
		id_code_ciiu: 12,
		id_section_ciiu: 1
	},
	{
		value: '127',
		name: 'Cultivo de plantas con las que se prepararan bebidas',
		id_code_ciiu: 13,
		id_section_ciiu: 1
	},
	{
		value: '128',
		name: 'Cultivo de especias y de plantas aromáticas y medicinales',
		id_code_ciiu: 14,
		id_section_ciiu: 1
	},
	{
		value: '129',
		name: 'Otros cultivos permanentes n.c.p.',
		id_code_ciiu: 15,
		id_section_ciiu: 1
	},
	{
		value: '130',
		name: 'Propagación de plantas (actividades de los viveros, excepto viveros forestales)',
		id_code_ciiu: 16,
		id_section_ciiu: 1
	},
	{
		value: '141',
		name: 'Cría de ganado bovino y bufalino',
		id_code_ciiu: 17,
		id_section_ciiu: 1
	},
	{
		value: '142',
		name: 'Cría de caballos y otros equinos',
		id_code_ciiu: 18,
		id_section_ciiu: 1
	},
	{
		value: '143',
		name: 'Cría de ovejas y cabras',
		id_code_ciiu: 19,
		id_section_ciiu: 1
	},
	{
		value: '144',
		name: 'Cría de ganado porcino',
		id_code_ciiu: 20,
		id_section_ciiu: 1
	},
	{
		value: '145',
		name: 'Cría de aves de corral',
		id_code_ciiu: 21,
		id_section_ciiu: 1
	},
	{
		value: '149',
		name: 'Cría de otros animales n.c.p.',
		id_code_ciiu: 22,
		id_section_ciiu: 1
	},
	{
		value: '150',
		name: 'Explotación mixta (agrícola y pecuaria)',
		id_code_ciiu: 23,
		id_section_ciiu: 1
	},
	{
		value: '161',
		name: 'Actividades de apoyo a la agricultura',
		id_code_ciiu: 24,
		id_section_ciiu: 1
	},
	{
		value: '162',
		name: 'Actividades de apoyo a la ganadería',
		id_code_ciiu: 25,
		id_section_ciiu: 1
	},
	{
		value: '163',
		name: 'Actividades posteriores a la cosecha',
		id_code_ciiu: 26,
		id_section_ciiu: 1
	},
	{
		value: '164',
		name: 'Tratamiento de semillas para propagación',
		id_code_ciiu: 27,
		id_section_ciiu: 1
	},
	{
		value: '170',
		name: 'Caza ordinaria y mediante trampas y actividades de servicios conexas',
		id_code_ciiu: 28,
		id_section_ciiu: 1
	},
	{
		value: '210',
		name: 'Silvicultura y otras actividades forestales',
		id_code_ciiu: 29,
		id_section_ciiu: 1
	},
	{
		value: '220',
		name: 'Extracción de madera',
		id_code_ciiu: 30,
		id_section_ciiu: 1
	},
	{
		value: '230',
		name: 'Recolección de productos forestales diferentes a la madera',
		id_code_ciiu: 31,
		id_section_ciiu: 1
	},
	{
		value: '240',
		name: 'Servicios de apoyo a la silvicultura',
		id_code_ciiu: 32,
		id_section_ciiu: 1
	},
	{
		value: '311',
		name: 'Pesca marítima',
		id_code_ciiu: 33,
		id_section_ciiu: 1
	},
	{
		value: '312',
		name: 'Pesca de agua dulce',
		id_code_ciiu: 34,
		id_section_ciiu: 1
	},
	{
		value: '321',
		name: 'Acuicultura marítima',
		id_code_ciiu: 35,
		id_section_ciiu: 1
	},
	{
		value: '322',
		name: 'Acuicultura de agua dulce',
		id_code_ciiu: 36,
		id_section_ciiu: 1
	},
	{
		value: '510',
		name: 'Extracción de hulla (carbón de piedra)',
		id_code_ciiu: 37,
		id_section_ciiu: 2
	},
	{
		value: '520',
		name: 'Extracción de carbón lignito',
		id_code_ciiu: 38,
		id_section_ciiu: 2
	},
	{
		value: '610',
		name: 'Extracción de petróleo crudo',
		id_code_ciiu: 39,
		id_section_ciiu: 2
	},
	{
		value: '620',
		name: 'Extracción de gas natural',
		id_code_ciiu: 40,
		id_section_ciiu: 2
	},
	{
		value: '710',
		name: 'Extracción de minerales de hierro',
		id_code_ciiu: 41,
		id_section_ciiu: 2
	},
	{
		value: '721',
		name: 'Extracción de minerales de uranio y de torio',
		id_code_ciiu: 42,
		id_section_ciiu: 2
	},
	{
		value: '722',
		name: 'Extracción de oro y otros metales preciosos',
		id_code_ciiu: 43,
		id_section_ciiu: 2
	},
	{
		value: '723',
		name: 'Extracción de minerales de níquel',
		id_code_ciiu: 44,
		id_section_ciiu: 2
	},
	{
		value: '729',
		name: 'Extracción de otros minerales metalíferos no ferrosos n.c.p.',
		id_code_ciiu: 45,
		id_section_ciiu: 2
	},
	{
		value: '811',
		name: 'Extracción de piedra, arena, arcillas comunes, yeso y anhidrita',
		id_code_ciiu: 46,
		id_section_ciiu: 2
	},
	{
		value: '812',
		name: 'Extracción de arcillas de uso industrial, caliza, caolín y bentonitas',
		id_code_ciiu: 47,
		id_section_ciiu: 2
	},
	{
		value: '820',
		name: 'Extracción de esmeraldas, piedras preciosas y semipreciosas',
		id_code_ciiu: 48,
		id_section_ciiu: 2
	},
	{
		value: '891',
		name: 'Extracción de minerales para la fabricación de abonos y productos quimicos',
		id_code_ciiu: 49,
		id_section_ciiu: 2
	},
	{
		value: '892',
		name: 'Extracción de halita (sal)',
		id_code_ciiu: 50,
		id_section_ciiu: 2
	},
	{
		value: '899',
		name: 'Extracción de otros minerales no metálicos n.c.p.',
		id_code_ciiu: 51,
		id_section_ciiu: 2
	},
	{
		value: '910',
		name: 'Actividades de apoyo para la extracción de petróleo y de gas natural',
		id_code_ciiu: 52,
		id_section_ciiu: 2
	},
	{
		value: '990',
		name: 'Actividades de apoyo para otras actividades de explotación de minas y canteras',
		id_code_ciiu: 53,
		id_section_ciiu: 2
	},
	{
		value: '1011',
		name: 'Procesamiento y conservación de carne y productos cárnicos',
		id_code_ciiu: 54,
		id_section_ciiu: 3
	},
	{
		value: '1012',
		name: 'Procesamiento y conservación de pescados, crustáceos y moluscos',
		id_code_ciiu: 55,
		id_section_ciiu: 3
	},
	{
		value: '1020',
		name: 'Procesamiento y conservación de frutas, legumbres, hortalizas y tuberculos',
		id_code_ciiu: 56,
		id_section_ciiu: 3
	},
	{
		value: '1030',
		name: 'Elaboración de aceites y grasas de origen vegetal y animal',
		id_code_ciiu: 57,
		id_section_ciiu: 3
	},
	{
		value: '1040',
		name: 'Elaboración de productos lácteos',
		id_code_ciiu: 58,
		id_section_ciiu: 3
	},
	{
		value: '1051',
		name: 'Elaboración de productos de molinería',
		id_code_ciiu: 59,
		id_section_ciiu: 3
	},
	{
		value: '1052',
		name: 'Elaboración de almidones y productos derivados del almidón',
		id_code_ciiu: 60,
		id_section_ciiu: 3
	},
	{
		value: '1061',
		name: 'Trilla de café',
		id_code_ciiu: 61,
		id_section_ciiu: 3
	},
	{
		value: '1062',
		name: 'Descafeinado, tostión y molienda del café',
		id_code_ciiu: 62,
		id_section_ciiu: 3
	},
	{
		value: '1063',
		name: 'Otros derivados del café',
		id_code_ciiu: 63,
		id_section_ciiu: 3
	},
	{
		value: '1071',
		name: 'Elaboración y refinación de azúcar',
		id_code_ciiu: 64,
		id_section_ciiu: 3
	},
	{
		value: '1072',
		name: 'Elaboración de panela',
		id_code_ciiu: 65,
		id_section_ciiu: 3
	},
	{
		value: '1081',
		name: 'Elaboración de productos de panadería',
		id_code_ciiu: 66,
		id_section_ciiu: 3
	},
	{
		value: '1082',
		name: 'Elaboración de cacao, chocolate y productos de confitería',
		id_code_ciiu: 67,
		id_section_ciiu: 3
	},
	{
		value: '1083',
		name: 'Elaboración de macarrones, fideos, alcuzcuz y productos farináceos similares',
		id_code_ciiu: 68,
		id_section_ciiu: 3
	},
	{
		value: '1084',
		name: 'Elaboración de comidas y platos preparados',
		id_code_ciiu: 69,
		id_section_ciiu: 3
	},
	{
		value: '1089',
		name: 'Elaboración de otros productos alimenticios n.c.p.',
		id_code_ciiu: 70,
		id_section_ciiu: 3
	},
	{
		value: '1090',
		name: 'Elaboración de alimentos preparados para animales',
		id_code_ciiu: 71,
		id_section_ciiu: 3
	},
	{
		value: '1101',
		name: 'Destilación, rectificación y mezcla de bebidas alcohólicas',
		id_code_ciiu: 72,
		id_section_ciiu: 3
	},
	{
		value: '1102',
		name: 'Elaboración de bebidas fermentadas no destiladas',
		id_code_ciiu: 73,
		id_section_ciiu: 3
	},
	{
		value: '1103',
		name: 'Producción de malta, elaboración de cervezas y otras bebidas malteadas',
		id_code_ciiu: 74,
		id_section_ciiu: 3
	},
	{
		value: '1104',
		name: 'Elaboración de bebidas no alcohólicas, producción de aguas minerales y de otras aguas embotelladas',
		id_code_ciiu: 75,
		id_section_ciiu: 3
	},
	{
		value: '1200',
		name: 'Elaboración de productos de tabaco',
		id_code_ciiu: 76,
		id_section_ciiu: 3
	},
	{
		value: '1311',
		name: 'Preparación e hilatura de fibras textiles',
		id_code_ciiu: 77,
		id_section_ciiu: 3
	},
	{
		value: '1312',
		name: 'Tejeduría de productos textiles',
		id_code_ciiu: 78,
		id_section_ciiu: 3
	},
	{
		value: '1313',
		name: 'Acabado de productos textiles',
		id_code_ciiu: 79,
		id_section_ciiu: 3
	},
	{
		value: '1391',
		name: 'Fabricación de tejidos de punto y ganchillo',
		id_code_ciiu: 80,
		id_section_ciiu: 3
	},
	{
		value: '1392',
		name: 'Confección de artículos con materiales textiles, excepto prendas de vestir',
		id_code_ciiu: 81,
		id_section_ciiu: 3
	},
	{
		value: '1393',
		name: 'Fabricación de tapetes y alfombras para pisos',
		id_code_ciiu: 82,
		id_section_ciiu: 3
	},
	{
		value: '1394',
		name: 'Fabricación de cuerdas, cordeles, cables, bramantes y redes',
		id_code_ciiu: 83,
		id_section_ciiu: 3
	},
	{
		value: '1399',
		name: 'Fabricación de otros artículos textiles n.c.p.',
		id_code_ciiu: 84,
		id_section_ciiu: 3
	},
	{
		value: '1410',
		name: 'Confección de prendas de vestir, excepto prendas de piel',
		id_code_ciiu: 85,
		id_section_ciiu: 3
	},
	{
		value: '1420',
		name: 'Fabricación de artículos de piel',
		id_code_ciiu: 86,
		id_section_ciiu: 3
	},
	{
		value: '1430',
		name: 'Fabricación de artículos de punto y ganchillo',
		id_code_ciiu: 87,
		id_section_ciiu: 3
	},
	{
		value: '1511',
		name: '"Curtido y recurtido de cueros, recurtido y teñido de pieles."',
		id_code_ciiu: 88,
		id_section_ciiu: 3
	},
	{
		value: '1512',
		name: 'Fabricación de artículos de viaje, bolsos de mano y artículos similares elaborados en cuero, y fabricación de artículos de talabartería y guarnicionería.',
		id_code_ciiu: 89,
		id_section_ciiu: 3
	},
	{
		value: '1513',
		name: '"Fabricación de artículos de viaje, bolsos de mano y artículos similares, artículos de talabartería y guarnicionería elaborados en otros materiales"',
		id_code_ciiu: 90,
		id_section_ciiu: 3
	},
	{
		value: '1521',
		name: 'Fabricación de calzado de cuero y piel, con cualquier tipo de suela',
		id_code_ciiu: 91,
		id_section_ciiu: 3
	},
	{
		value: '1522',
		name: 'Fabricación de otros tipos de calzado, excepto calzado de cuero y piel',
		id_code_ciiu: 92,
		id_section_ciiu: 3
	},
	{
		value: '1523',
		name: 'Fabricación de partes del calzado',
		id_code_ciiu: 93,
		id_section_ciiu: 3
	},
	{
		value: '1610',
		name: 'Aserrado, acepillado e impregnación de la madera',
		id_code_ciiu: 94,
		id_section_ciiu: 3
	},
	{
		value: '1620',
		name: '"Fabricación de hojas de madera para enchapado, fabricación de tableros contrachapados, tableros laminados, tableros de partículas y otros tableros y paneles"',
		id_code_ciiu: 95,
		id_section_ciiu: 3
	},
	{
		value: '1630',
		name: 'Fabricación de partes y piezas de madera, de carpintería y ebanistería para la construcción',
		id_code_ciiu: 96,
		id_section_ciiu: 3
	},
	{
		value: '1640',
		name: 'Fabricación de recipientes de madera',
		id_code_ciiu: 97,
		id_section_ciiu: 3
	},
	{
		value: '1690',
		name: '"Fabricación de otros productos de madera, fabricación de artículos de corcho, cestería y espartería"',
		id_code_ciiu: 98,
		id_section_ciiu: 3
	},
	{
		value: '1701',
		name: '"Fabricación de pulpas (pastas) celulósicas, papel y cartón"',
		id_code_ciiu: 99,
		id_section_ciiu: 3
	},
	{
		value: '1702',
		name: '"Fabricación de papel y cartón ondulado (corrugado), fabricación de envases, empaques y de embalajes de papel y cartón."',
		id_code_ciiu: 100,
		id_section_ciiu: 3
	},
	{
		value: '1709',
		name: 'Fabricación de otros artículos de papel y cartón',
		id_code_ciiu: 101,
		id_section_ciiu: 3
	},
	{
		value: '1811',
		name: 'Actividades de impresión',
		id_code_ciiu: 102,
		id_section_ciiu: 3
	},
	{
		value: '1812',
		name: 'Actividades de servicios relacionados con la impresión',
		id_code_ciiu: 103,
		id_section_ciiu: 3
	},
	{
		value: '1820',
		name: 'Producción de copias a partir de grabaciones originales',
		id_code_ciiu: 104,
		id_section_ciiu: 3
	},
	{
		value: '1910',
		name: 'Fabricación de productos de hornos de coque',
		id_code_ciiu: 105,
		id_section_ciiu: 3
	},
	{
		value: '1921',
		name: 'Fabricación de productos de la refinación del petróleo',
		id_code_ciiu: 106,
		id_section_ciiu: 3
	},
	{
		value: '1922',
		name: 'Actividad de mezcla de combustibles',
		id_code_ciiu: 107,
		id_section_ciiu: 3
	},
	{
		value: '2011',
		name: 'Fabricación de sustancias y productos químicos básicos',
		id_code_ciiu: 108,
		id_section_ciiu: 3
	},
	{
		value: '2012',
		name: 'Fabricación de abonos y compuestos inorgánicos nitrogenados',
		id_code_ciiu: 109,
		id_section_ciiu: 3
	},
	{
		value: '2013',
		name: 'Fabricación de plásticos en formas primarias',
		id_code_ciiu: 110,
		id_section_ciiu: 3
	},
	{
		value: '2014',
		name: 'Fabricación de caucho sintético en formas primarias',
		id_code_ciiu: 111,
		id_section_ciiu: 3
	},
	{
		value: '2021',
		name: 'Fabricación de plaguicidas y otros productos químicos de uso agropecuario',
		id_code_ciiu: 112,
		id_section_ciiu: 3
	},
	{
		value: '2022',
		name: 'Fabricación de pinturas, barnices y revestimientos similares, tintas para impresión y masillas',
		id_code_ciiu: 113,
		id_section_ciiu: 3
	},
	{
		value: '2023',
		name: '"Fabricación de jabones y detergentes, preparados para limpiar y pulir, perfumes y preparados de tocador"',
		id_code_ciiu: 114,
		id_section_ciiu: 3
	},
	{
		value: '2029',
		name: 'Fabricación de otros productos químicos n.c.p.',
		id_code_ciiu: 115,
		id_section_ciiu: 3
	},
	{
		value: '2030',
		name: 'Fabricación de fibras sintéticas y artificiales',
		id_code_ciiu: 116,
		id_section_ciiu: 3
	},
	{
		value: '2100',
		name: 'Fabricación de productos farmacéuticos, sustancias químicas medicinales y productos botánicos de uso farmacéutico',
		id_code_ciiu: 117,
		id_section_ciiu: 3
	},
	{
		value: '2211',
		name: 'Fabricación de llantas y neumáticos de caucho',
		id_code_ciiu: 118,
		id_section_ciiu: 3
	},
	{
		value: '2212',
		name: 'Reencauche de llantas usadas',
		id_code_ciiu: 119,
		id_section_ciiu: 3
	},
	{
		value: '2219',
		name: 'Fabricación de formas básicas de caucho y otros productos de caucho n.c.p.',
		id_code_ciiu: 120,
		id_section_ciiu: 3
	},
	{
		value: '2221',
		name: 'Fabricación de formas básicas de plástico',
		id_code_ciiu: 121,
		id_section_ciiu: 3
	},
	{
		value: '2229',
		name: 'Fabricación de artículos de plástico n.c.p.',
		id_code_ciiu: 122,
		id_section_ciiu: 3
	},
	{
		value: '2310',
		name: 'Fabricación de vidrio y productos de vidrio',
		id_code_ciiu: 123,
		id_section_ciiu: 3
	},
	{
		value: '2391',
		name: 'Fabricación de productos refractarios',
		id_code_ciiu: 124,
		id_section_ciiu: 3
	},
	{
		value: '2392',
		name: 'Fabricación de materiales de arcilla para la construcción',
		id_code_ciiu: 125,
		id_section_ciiu: 3
	},
	{
		value: '2393',
		name: 'Fabricación de otros productos de cerámica y porcelana',
		id_code_ciiu: 126,
		id_section_ciiu: 3
	},
	{
		value: '2394',
		name: 'Fabricación de cemento, cal y yeso',
		id_code_ciiu: 127,
		id_section_ciiu: 3
	},
	{
		value: '2395',
		name: 'Fabricación de artículos de hormigón, cemento y yeso',
		id_code_ciiu: 128,
		id_section_ciiu: 3
	},
	{
		value: '2396',
		name: 'Corte, tallado y acabado de la piedra',
		id_code_ciiu: 129,
		id_section_ciiu: 3
	},
	{
		value: '2399',
		name: 'Fabricación de otros productos minerales no metálicos n.c.p.',
		id_code_ciiu: 130,
		id_section_ciiu: 3
	},
	{
		value: '2410',
		name: 'Industrias básicas de hierro y de acero',
		id_code_ciiu: 131,
		id_section_ciiu: 3
	},
	{
		value: '2421',
		name: 'Industrias básicas de metales preciosos',
		id_code_ciiu: 132,
		id_section_ciiu: 3
	},
	{
		value: '2429',
		name: 'Industrias básicas de otros metales no ferrosos',
		id_code_ciiu: 133,
		id_section_ciiu: 3
	},
	{
		value: '2431',
		name: 'Fundición de hierro y de acero',
		id_code_ciiu: 134,
		id_section_ciiu: 3
	},
	{
		value: '2432',
		name: 'Fundición de metales no ferrosos',
		id_code_ciiu: 135,
		id_section_ciiu: 3
	},
	{
		value: '2511',
		name: 'Fabricación de productos metálicos para uso estructural',
		id_code_ciiu: 136,
		id_section_ciiu: 3
	},
	{
		value: '2512',
		name: 'Fabricación de tanques, depósitos y recipientes de metal, excepto los utilizados para el envase o transporte de mercancías',
		id_code_ciiu: 137,
		id_section_ciiu: 3
	},
	{
		value: '2513',
		name: 'Fabricación de generadores de vapor, excepto calderas de agua caliente para calefacción central',
		id_code_ciiu: 138,
		id_section_ciiu: 3
	},
	{
		value: '2520',
		name: 'Fabricación de armas y municiones',
		id_code_ciiu: 139,
		id_section_ciiu: 3
	},
	{
		value: '2591',
		name: '"Forja, prensado, estampado y laminado de metal, pulvimetalurgia"',
		id_code_ciiu: 140,
		id_section_ciiu: 3
	},
	{
		value: '2592',
		name: '"Tratamiento y revestimiento de metales, mecanizado"',
		id_code_ciiu: 141,
		id_section_ciiu: 3
	},
	{
		value: '2593',
		name: 'Fabricación de artículos de cuchillería, herramientas de mano y artículos de ferretería',
		id_code_ciiu: 142,
		id_section_ciiu: 3
	},
	{
		value: '2599',
		name: 'Fabricación de otros productos elaborados de metal n.c.p.',
		id_code_ciiu: 143,
		id_section_ciiu: 3
	},
	{
		value: '2610',
		name: 'Fabricación de componentes y tableros electrónicos',
		id_code_ciiu: 144,
		id_section_ciiu: 3
	},
	{
		value: '2620',
		name: 'Fabricación de computadoras y de equipo periférico',
		id_code_ciiu: 145,
		id_section_ciiu: 3
	},
	{
		value: '2630',
		name: 'Fabricación de equipos de comunicación',
		id_code_ciiu: 146,
		id_section_ciiu: 3
	},
	{
		value: '2640',
		name: 'Fabricación de aparatos electrónicos de consumo',
		id_code_ciiu: 147,
		id_section_ciiu: 3
	},
	{
		value: '2651',
		name: 'Fabricación de equipo de medición, prueba, navegación y control',
		id_code_ciiu: 148,
		id_section_ciiu: 3
	},
	{
		value: '2652',
		name: 'Fabricación de relojes',
		id_code_ciiu: 149,
		id_section_ciiu: 3
	},
	{
		value: '2660',
		name: 'Fabricación de equipo de irradiación y equipo electrónico de uso médico y terapéutico',
		id_code_ciiu: 150,
		id_section_ciiu: 3
	},
	{
		value: '2670',
		name: 'Fabricación de instrumentos ópticos y equipo fotográfico',
		id_code_ciiu: 151,
		id_section_ciiu: 3
	},
	{
		value: '2680',
		name: 'Fabricación de soportes magnéticos y ópticos',
		id_code_ciiu: 152,
		id_section_ciiu: 3
	},
	{
		value: '2711',
		name: 'Fabricación de motores, generadores y transformadores eléctricos.',
		id_code_ciiu: 153,
		id_section_ciiu: 3
	},
	{
		value: '2712',
		name: 'Fabricación de aparatos de distribución y control de la energía electrica',
		id_code_ciiu: 154,
		id_section_ciiu: 3
	},
	{
		value: '2720',
		name: 'Fabricación de pilas, baterías y acumuladores eléctricos',
		id_code_ciiu: 155,
		id_section_ciiu: 3
	},
	{
		value: '2731',
		name: 'Fabricación de hilos y cables eléctricos y de fibra óptica',
		id_code_ciiu: 156,
		id_section_ciiu: 3
	},
	{
		value: '2732',
		name: 'Fabricación de dispositivos de cableado',
		id_code_ciiu: 157,
		id_section_ciiu: 3
	},
	{
		value: '2740',
		name: 'Fabricación de equipos eléctricos de iluminación',
		id_code_ciiu: 158,
		id_section_ciiu: 3
	},
	{
		value: '2750',
		name: 'Fabricación de aparatos de uso domestico',
		id_code_ciiu: 159,
		id_section_ciiu: 3
	},
	{
		value: '2790',
		name: 'Fabricación de otros tipos de equipo eléctrico n.c.p.',
		id_code_ciiu: 160,
		id_section_ciiu: 3
	},
	{
		value: '2811',
		name: 'Fabricación de motores, turbinas, y partes para motores de combustión interna',
		id_code_ciiu: 161,
		id_section_ciiu: 3
	},
	{
		value: '2812',
		name: 'Fabricación de equipos de potencia hidráulica y neumática',
		id_code_ciiu: 162,
		id_section_ciiu: 3
	},
	{
		value: '2813',
		name: 'Fabricación de otras bombas, compresores, grifos y válvulas',
		id_code_ciiu: 163,
		id_section_ciiu: 3
	},
	{
		value: '2814',
		name: 'Fabricación de cojinetes, engranajes, trenes de engranajes y piezas de transmisión',
		id_code_ciiu: 164,
		id_section_ciiu: 3
	},
	{
		value: '2815',
		name: 'Fabricación de hornos, hogares y quemadores industriales',
		id_code_ciiu: 165,
		id_section_ciiu: 3
	},
	{
		value: '2816',
		name: 'Fabricación de equipo de elevación y manipulación',
		id_code_ciiu: 166,
		id_section_ciiu: 3
	},
	{
		value: '2817',
		name: 'Fabricación de maquinaria y equipo de oficina (excepto computadoras y equipo periférico)',
		id_code_ciiu: 167,
		id_section_ciiu: 3
	},
	{
		value: '2818',
		name: 'Fabricación de herramientas manuales con motor',
		id_code_ciiu: 168,
		id_section_ciiu: 3
	},
	{
		value: '2819',
		name: 'Fabricación de otros tipos de maquinaria y equipo de uso general n.c.p.',
		id_code_ciiu: 169,
		id_section_ciiu: 3
	},
	{
		value: '2821',
		name: 'Fabricación de maquinaria agropecuaria y forestal',
		id_code_ciiu: 170,
		id_section_ciiu: 3
	},
	{
		value: '2822',
		name: 'Fabricación de máquinas formadoras de metal y de máquinas herramienta',
		id_code_ciiu: 171,
		id_section_ciiu: 3
	},
	{
		value: '2823',
		name: 'Fabricación de maquinaria para la metalurgia',
		id_code_ciiu: 172,
		id_section_ciiu: 3
	},
	{
		value: '2824',
		name: 'Fabricación de maquinaria para explotación de minas y canteras y para obras de construcción',
		id_code_ciiu: 173,
		id_section_ciiu: 3
	},
	{
		value: '2825',
		name: 'Fabricación de maquinaria para la elaboración de alimentos, bebidas y tabaco',
		id_code_ciiu: 174,
		id_section_ciiu: 3
	},
	{
		value: '2826',
		name: 'Fabricación de maquinaria para la elaboración de productos textiles, prendas de vestir y cueros',
		id_code_ciiu: 175,
		id_section_ciiu: 3
	},
	{
		value: '2829',
		name: 'Fabricación de otros tipos de maquinaria y equipo de uso especial n.c.p.',
		id_code_ciiu: 176,
		id_section_ciiu: 3
	},
	{
		value: '2910',
		name: 'Fabricación de vehículos automotores y sus motores',
		id_code_ciiu: 177,
		id_section_ciiu: 3
	},
	{
		value: '2920',
		name: '"Fabricación de carrocerías para vehículos automotores, fabricación de remolques y semirremolques"',
		id_code_ciiu: 178,
		id_section_ciiu: 3
	},
	{
		value: '2930',
		name: 'Fabricación de partes, piezas (autopartes) y accesorios (lujos) para vehículos automotores',
		id_code_ciiu: 179,
		id_section_ciiu: 3
	},
	{
		value: '3011',
		name: 'Construcción de barcos y de estructuras flotantes',
		id_code_ciiu: 180,
		id_section_ciiu: 3
	},
	{
		value: '3012',
		name: 'Construcción de embarcaciones de recreo y deporte',
		id_code_ciiu: 181,
		id_section_ciiu: 3
	},
	{
		value: '3020',
		name: 'Fabricación de locomotoras y de material rodante para ferrocarriles',
		id_code_ciiu: 182,
		id_section_ciiu: 3
	},
	{
		value: '3030',
		name: 'Fabricación de aeronaves, naves espaciales y de maquinaria conexa',
		id_code_ciiu: 183,
		id_section_ciiu: 3
	},
	{
		value: '3040',
		name: 'Fabricación de vehículos militares de combate',
		id_code_ciiu: 184,
		id_section_ciiu: 3
	},
	{
		value: '3091',
		name: 'Fabricación de motocicletas',
		id_code_ciiu: 185,
		id_section_ciiu: 3
	},
	{
		value: '3092',
		name: 'Fabricación de bicicletas y de sillas de ruedas para personas con discapacidad',
		id_code_ciiu: 186,
		id_section_ciiu: 3
	},
	{
		value: '3099',
		name: 'Fabricación de otros tipos de equipo de transporte n.c.p.',
		id_code_ciiu: 187,
		id_section_ciiu: 3
	},
	{
		value: '3110',
		name: 'Fabricación de muebles',
		id_code_ciiu: 188,
		id_section_ciiu: 3
	},
	{
		value: '3120',
		name: 'Fabricación de colchones y somieres',
		id_code_ciiu: 189,
		id_section_ciiu: 3
	},
	{
		value: '3210',
		name: 'Fabricación de joyas, bisutería y artículos conexos',
		id_code_ciiu: 190,
		id_section_ciiu: 3
	},
	{
		value: '3220',
		name: 'Fabricación de instrumentos musicales',
		id_code_ciiu: 191,
		id_section_ciiu: 3
	},
	{
		value: '3230',
		name: 'Fabricación de artículos y equipo para la práctica del deporte',
		id_code_ciiu: 192,
		id_section_ciiu: 3
	},
	{
		value: '3240',
		name: 'Fabricación de juegos, juguetes y rompecabezas',
		id_code_ciiu: 193,
		id_section_ciiu: 3
	},
	{
		value: '3250',
		name: 'Fabricación de instrumentos, aparatos y materiales médicos y odontológicos (incluido mobiliario)',
		id_code_ciiu: 194,
		id_section_ciiu: 3
	},
	{
		value: '3290',
		name: 'Otras industrias manufactureras n.c.p.',
		id_code_ciiu: 195,
		id_section_ciiu: 3
	},
	{
		value: '3311',
		name: 'Mantenimiento y reparación especializado de productos elaborados en metal',
		id_code_ciiu: 196,
		id_section_ciiu: 3
	},
	{
		value: '3312',
		name: 'Mantenimiento y reparación especializado de maquinaria y equipo',
		id_code_ciiu: 197,
		id_section_ciiu: 3
	},
	{
		value: '3313',
		name: 'Mantenimiento y reparación especializado de equipo electrónico y óptico',
		id_code_ciiu: 198,
		id_section_ciiu: 3
	},
	{
		value: '3314',
		name: 'Mantenimiento y reparación especializado de equipo eléctrico',
		id_code_ciiu: 199,
		id_section_ciiu: 3
	},
	{
		value: '3315',
		name: 'Mantenimiento y reparación especializado de equipo de transporte, excepto los vehículos automotores, motocicletas y bicicletas',
		id_code_ciiu: 200,
		id_section_ciiu: 3
	},
	{
		value: '3319',
		name: 'Mantenimiento y reparación de otros tipos de equipos y sus componentes n.c.p.',
		id_code_ciiu: 201,
		id_section_ciiu: 3
	},
	{
		value: '3320',
		name: 'Instalación especializada de maquinaria y equipo industrial',
		id_code_ciiu: 202,
		id_section_ciiu: 3
	},
	{
		value: '3511',
		name: 'Generación de energía eléctrica',
		id_code_ciiu: 203,
		id_section_ciiu: 4
	},
	{
		value: '3512',
		name: 'Transmisión de energía eléctrica',
		id_code_ciiu: 204,
		id_section_ciiu: 4
	},
	{
		value: '3513',
		name: 'Distribución de energía eléctrica',
		id_code_ciiu: 205,
		id_section_ciiu: 4
	},
	{
		value: '3514',
		name: 'Comercialización de energía eléctrica',
		id_code_ciiu: 206,
		id_section_ciiu: 4
	},
	{
		value: '3520',
		name: '"Producción de gas, distribución de combustibles gaseosos por tuberías"',
		id_code_ciiu: 207,
		id_section_ciiu: 4
	},
	{
		value: '3530',
		name: 'Suministro de vapor y aire acondicionado',
		id_code_ciiu: 208,
		id_section_ciiu: 4
	},
	{
		value: '3600',
		name: 'Captación, tratamiento y distribución de agua',
		id_code_ciiu: 209,
		id_section_ciiu: 5
	},
	{
		value: '3700',
		name: 'Evacuación y tratamiento de aguas residuales',
		id_code_ciiu: 210,
		id_section_ciiu: 5
	},
	{
		value: '3811',
		name: 'Recolección de desechos no peligrosos',
		id_code_ciiu: 211,
		id_section_ciiu: 5
	},
	{
		value: '3812',
		name: 'Recolección de desechos peligrosos',
		id_code_ciiu: 212,
		id_section_ciiu: 5
	},
	{
		value: '3821',
		name: 'Tratamiento y disposición de desechos no peligrosos',
		id_code_ciiu: 213,
		id_section_ciiu: 5
	},
	{
		value: '3822',
		name: 'Tratamiento y disposición de desechos peligrosos',
		id_code_ciiu: 214,
		id_section_ciiu: 5
	},
	{
		value: '3830',
		name: 'Recuperación de materiales',
		id_code_ciiu: 215,
		id_section_ciiu: 5
	},
	{
		value: '3900',
		name: 'Actividades de saneamiento ambiental y otros servicios de gestión de desechos',
		id_code_ciiu: 216,
		id_section_ciiu: 5
	},
	{
		value: '4111',
		name: 'Construcción de edificios residenciales',
		id_code_ciiu: 217,
		id_section_ciiu: 6
	},
	{
		value: '4112',
		name: 'Construcción de edificios no residenciales',
		id_code_ciiu: 218,
		id_section_ciiu: 6
	},
	{
		value: '4210',
		name: 'Construcción de carreteras y vías de ferrocarril',
		id_code_ciiu: 219,
		id_section_ciiu: 6
	},
	{
		value: '4220',
		name: 'Construcción de proyectos de servicio público',
		id_code_ciiu: 220,
		id_section_ciiu: 6
	},
	{
		value: '4290',
		name: 'Construcción de otras obras de ingeniería civil',
		id_code_ciiu: 221,
		id_section_ciiu: 6
	},
	{
		value: '4311',
		name: 'Demolición',
		id_code_ciiu: 222,
		id_section_ciiu: 6
	},
	{
		value: '4312',
		name: 'Preparación del terreno',
		id_code_ciiu: 223,
		id_section_ciiu: 6
	},
	{
		value: '4321',
		name: 'Instalaciones eléctricas',
		id_code_ciiu: 224,
		id_section_ciiu: 6
	},
	{
		value: '4322',
		name: 'Instalaciones de fontanería, calefacción y aire acondicionado',
		id_code_ciiu: 225,
		id_section_ciiu: 6
	},
	{
		value: '4329',
		name: 'Otras instalaciones especializadas',
		id_code_ciiu: 226,
		id_section_ciiu: 6
	},
	{
		value: '4330',
		name: 'Terminación y acabado de edificios y obras de ingeniería civil',
		id_code_ciiu: 227,
		id_section_ciiu: 6
	},
	{
		value: '4390',
		name: 'Otras actividades especializadas para la construcción de edificios y obras de ingeniería civil',
		id_code_ciiu: 228,
		id_section_ciiu: 6
	},
	{
		value: '4511',
		name: 'Comercio de vehículos automotores nuevos',
		id_code_ciiu: 229,
		id_section_ciiu: 7
	},
	{
		value: '4512',
		name: 'Comercio de vehículos automotores usados',
		id_code_ciiu: 230,
		id_section_ciiu: 7
	},
	{
		value: '4520',
		name: 'Mantenimiento y reparación de vehículos automotores',
		id_code_ciiu: 231,
		id_section_ciiu: 7
	},
	{
		value: '4530',
		name: 'Comercio de partes, piezas (autopartes) y accesorios (lujos) para vehículos automotores',
		id_code_ciiu: 232,
		id_section_ciiu: 7
	},
	{
		value: '4541',
		name: 'Comercio de motocicletas y de sus partes, piezas y accesorios',
		id_code_ciiu: 233,
		id_section_ciiu: 7
	},
	{
		value: '4542',
		name: 'Mantenimiento y reparación de motocicletas y de sus partes y piezas',
		id_code_ciiu: 234,
		id_section_ciiu: 7
	},
	{
		value: '4610',
		name: 'Comercio al por mayor a cambio de una retribución o por contrata',
		id_code_ciiu: 235,
		id_section_ciiu: 7
	},
	{
		value: '4620',
		name: '"Comercio al por mayor de materias primas agropecuarias, animales vivos"',
		id_code_ciiu: 236,
		id_section_ciiu: 7
	},
	{
		value: '4631',
		name: 'Comercio al por mayor de productos alimenticios',
		id_code_ciiu: 237,
		id_section_ciiu: 7
	},
	{
		value: '4632',
		name: 'Comercio al por mayor de bebidas y tabaco',
		id_code_ciiu: 238,
		id_section_ciiu: 7
	},
	{
		value: '4641',
		name: 'Comercio al por mayor de productos textiles, productos confeccionados para uso doméstico',
		id_code_ciiu: 239,
		id_section_ciiu: 7
	},
	{
		value: '4642',
		name: 'Comercio al por mayor de prendas de vestir',
		id_code_ciiu: 240,
		id_section_ciiu: 7
	},
	{
		value: '4643',
		name: 'Comercio al por mayor de calzado',
		id_code_ciiu: 241,
		id_section_ciiu: 7
	},
	{
		value: '4644',
		name: 'Comercio al por mayor de aparatos y equipo de uso doméstico',
		id_code_ciiu: 242,
		id_section_ciiu: 7
	},
	{
		value: '4645',
		name: 'Comercio al por mayor de productos farmacéuticos, medicinales, cosméticos y de tocador',
		id_code_ciiu: 243,
		id_section_ciiu: 7
	},
	{
		value: '4649',
		name: 'Comercio al por mayor de otros utensilios domésticos n.c.p.',
		id_code_ciiu: 244,
		id_section_ciiu: 7
	},
	{
		value: '4651',
		name: 'Comercio al por mayor de computadores, equipo periférico y programas de informática',
		id_code_ciiu: 245,
		id_section_ciiu: 7
	},
	{
		value: '4652',
		name: 'Comercio al por mayor de equipo, partes y piezas electrónicos y de telecomunicaciones',
		id_code_ciiu: 246,
		id_section_ciiu: 7
	},
	{
		value: '4653',
		name: 'Comercio al por mayor de maquinaria y equipo agropecuarios',
		id_code_ciiu: 247,
		id_section_ciiu: 7
	},
	{
		value: '4659',
		name: 'Comercio al por mayor de otros tipos de maquinaria y equipo n.c.p.',
		id_code_ciiu: 248,
		id_section_ciiu: 7
	},
	{
		value: '4661',
		name: 'Comercio al por mayor de combustibles sólidos, líquidos, gaseosos y productos conexos',
		id_code_ciiu: 249,
		id_section_ciiu: 7
	},
	{
		value: '4662',
		name: 'Comercio al por mayor de metales y productos metalíferos',
		id_code_ciiu: 250,
		id_section_ciiu: 7
	},
	{
		value: '4663',
		name: 'Comercio al por mayor de materiales de construcción, artículos de ferretería, pinturas, productos de vidrio, equipo y materiales de fontanería y calefacción',
		id_code_ciiu: 251,
		id_section_ciiu: 7
	},
	{
		value: '4664',
		name: 'Comercio al por mayor de productos químicos básicos, cauchos y plásticos en formas primarias y productos químicos de uso agropecuario',
		id_code_ciiu: 252,
		id_section_ciiu: 7
	},
	{
		value: '4665',
		name: 'Comercio al por mayor de desperdicios, desechos y chatarra',
		id_code_ciiu: 253,
		id_section_ciiu: 7
	},
	{
		value: '4669',
		name: 'Comercio al por mayor de otros productos n.c.p.',
		id_code_ciiu: 254,
		id_section_ciiu: 7
	},
	{
		value: '4690',
		name: 'Comercio al por mayor no especializado',
		id_code_ciiu: 255,
		id_section_ciiu: 7
	},
	{
		value: '4711',
		name: 'Comercio al por menor en establecimientos no especializados con surtido compuesto principalmente por alimentos, bebidas o tabaco',
		id_code_ciiu: 256,
		id_section_ciiu: 7
	},
	{
		value: '4719',
		name: 'Comercio al por menor en establecimientos no especializados, con surtido compuesto principalmente por productos diferentes de alimentos (víveres en general), bebidas y tabaco',
		id_code_ciiu: 257,
		id_section_ciiu: 7
	},
	{
		value: '4721',
		name: 'Comercio al por menor de productos agrícolas para el consumo en establecimientos especializados',
		id_code_ciiu: 258,
		id_section_ciiu: 7
	},
	{
		value: '4722',
		name: 'Comercio al por menor de leche, productos lácteos y huevos, en establecimientos especializados',
		id_code_ciiu: 259,
		id_section_ciiu: 7
	},
	{
		value: '4723',
		name: 'Comercio al por menor de carnes (incluye aves de corral), productos cárnicos, pescados y productos de mar, en establecimientos especializados',
		id_code_ciiu: 260,
		id_section_ciiu: 7
	},
	{
		value: '4724',
		name: 'Comercio al por menor de bebidas y productos del tabaco, en establecimientos especializados',
		id_code_ciiu: 261,
		id_section_ciiu: 7
	},
	{
		value: '4729',
		name: 'Comercio al por menor de otros productos alimenticios n.c.p., en establecimientos especializados',
		id_code_ciiu: 262,
		id_section_ciiu: 7
	},
	{
		value: '4731',
		name: 'Comercio al por menor de combustible para automotores',
		id_code_ciiu: 263,
		id_section_ciiu: 7
	},
	{
		value: '4732',
		name: 'Comercio al por menor de lubricantes (aceites, grasas), aditivos y productos de limpieza para vehículos automotores',
		id_code_ciiu: 264,
		id_section_ciiu: 7
	},
	{
		value: '4741',
		name: 'Comercio al por menor de computadores, equipos periféricos, programas de informática y equipos de telecomunicaciones en establecimientos especializados',
		id_code_ciiu: 265,
		id_section_ciiu: 7
	},
	{
		value: '4742',
		name: 'Comercio al por menor de equipos y aparatos de sonido y de video, en establecimientos especializados',
		id_code_ciiu: 266,
		id_section_ciiu: 7
	},
	{
		value: '4751',
		name: 'Comercio al por menor de productos textiles en establecimientos especializados',
		id_code_ciiu: 267,
		id_section_ciiu: 7
	},
	{
		value: '4752',
		name: 'Comercio al por menor de artículos de ferretería, pinturas y productos de vidrio en establecimientos especializados',
		id_code_ciiu: 268,
		id_section_ciiu: 7
	},
	{
		value: '4753',
		name: 'Comercio al por menor de tapices, alfombras y cubrimientos para paredes y pisos en establecimientos especializados.',
		id_code_ciiu: 269,
		id_section_ciiu: 7
	},
	{
		value: '4754',
		name: 'Comercio al por menor de electrodomésticos y gasodomesticos de uso doméstico, muebles y equipos de iluminación',
		id_code_ciiu: 270,
		id_section_ciiu: 7
	},
	{
		value: '4755',
		name: 'Comercio al por menor de artículos y utensilios de uso domestico',
		id_code_ciiu: 271,
		id_section_ciiu: 7
	},
	{
		value: '4759',
		name: 'Comercio al por menor de otros artículos domésticos en establecimientos especializados',
		id_code_ciiu: 272,
		id_section_ciiu: 7
	},
	{
		value: '4761',
		name: 'Comercio al por menor de libros, periódicos, materiales y artículos de papelería y escritorio, en establecimientos especializados',
		id_code_ciiu: 273,
		id_section_ciiu: 7
	},
	{
		value: '4762',
		name: 'Comercio al por menor de artículos deportivos, en establecimientos especializados',
		id_code_ciiu: 274,
		id_section_ciiu: 7
	},
	{
		value: '4769',
		name: 'Comercio al por menor de otros artículos culturales y de entretenimiento n.c.p. en establecimientos especializados',
		id_code_ciiu: 275,
		id_section_ciiu: 7
	},
	{
		value: '4771',
		name: 'Comercio al por menor de prendas de vestir y sus accesorios (incluye artículos de piel) en establecimientos especializados',
		id_code_ciiu: 276,
		id_section_ciiu: 7
	},
	{
		value: '4772',
		name: 'Comercio al por menor de todo tipo de calzado y artículos de cuero y sucedáneos del cuero en establecimientos especializados.',
		id_code_ciiu: 277,
		id_section_ciiu: 7
	},
	{
		value: '4773',
		name: 'Comercio al por menor de productos farmacéuticos y medicinales, cosméticos y artículos de tocador en establecimientos especializados',
		id_code_ciiu: 278,
		id_section_ciiu: 7
	},
	{
		value: '4774',
		name: 'Comercio al por menor de otros productos nuevos en establecimientos especializados',
		id_code_ciiu: 279,
		id_section_ciiu: 7
	},
	{
		value: '4775',
		name: 'Comercio al por menor de artículos de segunda mano',
		id_code_ciiu: 280,
		id_section_ciiu: 7
	},
	{
		value: '4781',
		name: 'Comercio al por menor de alimentos, bebidas y tabaco, en puestos de venta móviles',
		id_code_ciiu: 281,
		id_section_ciiu: 7
	},
	{
		value: '4782',
		name: 'Comercio al por menor de productos textiles, prendas de vestir y calzado, en puestos de venta móviles',
		id_code_ciiu: 282,
		id_section_ciiu: 7
	},
	{
		value: '4789',
		name: 'Comercio al por menor de otros productos en puestos de venta móviles',
		id_code_ciiu: 283,
		id_section_ciiu: 7
	},
	{
		value: '4791',
		name: 'Comercio al por menor realizado a través de Internet',
		id_code_ciiu: 284,
		id_section_ciiu: 7
	},
	{
		value: '4792',
		name: 'Comercio al por menor realizado a través de casas de venta o por correo',
		id_code_ciiu: 285,
		id_section_ciiu: 7
	},
	{
		value: '4799',
		name: 'Otros tipos de comercio al por menor no realizado en establecimientos, puestos de venta o mercados.',
		id_code_ciiu: 286,
		id_section_ciiu: 7
	},
	{
		value: '4911',
		name: 'Transporte férreo de pasajeros',
		id_code_ciiu: 287,
		id_section_ciiu: 8
	},
	{
		value: '4912',
		name: 'Transporte férreo de carga',
		id_code_ciiu: 288,
		id_section_ciiu: 8
	},
	{
		value: '4921',
		name: 'Transporte de pasajeros',
		id_code_ciiu: 289,
		id_section_ciiu: 8
	},
	{
		value: '4922',
		name: 'Transporte mixto',
		id_code_ciiu: 290,
		id_section_ciiu: 8
	},
	{
		value: '4923',
		name: 'Transporte de carga por carretera',
		id_code_ciiu: 291,
		id_section_ciiu: 8
	},
	{
		value: '4930',
		name: 'Transporte por tuberías',
		id_code_ciiu: 292,
		id_section_ciiu: 8
	},
	{
		value: '5011',
		name: 'Transporte de pasajeros marítimo y de cabotaje',
		id_code_ciiu: 293,
		id_section_ciiu: 8
	},
	{
		value: '5012',
		name: 'Transporte de carga marítimo y de cabotaje',
		id_code_ciiu: 294,
		id_section_ciiu: 8
	},
	{
		value: '5021',
		name: 'Transporte fluvial de pasajeros',
		id_code_ciiu: 295,
		id_section_ciiu: 8
	},
	{
		value: '5022',
		name: 'Transporte fluvial de carga',
		id_code_ciiu: 296,
		id_section_ciiu: 8
	},
	{
		value: '5111',
		name: 'Transporte aéreo nacional de pasajeros',
		id_code_ciiu: 297,
		id_section_ciiu: 8
	},
	{
		value: '5112',
		name: 'Transporte aéreo internacional de pasajeros',
		id_code_ciiu: 298,
		id_section_ciiu: 8
	},
	{
		value: '5121',
		name: 'Transporte aéreo nacional de carga',
		id_code_ciiu: 299,
		id_section_ciiu: 8
	},
	{
		value: '5122',
		name: 'Transporte aéreo internacional de carga',
		id_code_ciiu: 300,
		id_section_ciiu: 8
	},
	{
		value: '5210',
		name: 'Almacenamiento y depósito',
		id_code_ciiu: 301,
		id_section_ciiu: 8
	},
	{
		value: '5221',
		name: 'Actividades de estaciones, vías y servicios complementarios para el transporte terrestre',
		id_code_ciiu: 302,
		id_section_ciiu: 8
	},
	{
		value: '5222',
		name: 'Actividades de puertos y servicios complementarios para el transporte acuático',
		id_code_ciiu: 303,
		id_section_ciiu: 8
	},
	{
		value: '5223',
		name: 'Actividades de aeropuertos, servicios de navegación aérea y demás actividades conexas al transporte aéreo',
		id_code_ciiu: 304,
		id_section_ciiu: 8
	},
	{
		value: '5224',
		name: 'Manipulación de carga',
		id_code_ciiu: 305,
		id_section_ciiu: 8
	},
	{
		value: '5229',
		name: 'Otras actividades complementarias al transporte',
		id_code_ciiu: 306,
		id_section_ciiu: 8
	},
	{
		value: '5310',
		name: 'Actividades postales nacionales',
		id_code_ciiu: 307,
		id_section_ciiu: 8
	},
	{
		value: '5320',
		name: 'Actividades de mensajería',
		id_code_ciiu: 308,
		id_section_ciiu: 8
	},
	{
		value: '5511',
		name: 'Alojamiento en hoteles',
		id_code_ciiu: 309,
		id_section_ciiu: 9
	},
	{
		value: '5512',
		name: 'Alojamiento en aparta-hoteles',
		id_code_ciiu: 310,
		id_section_ciiu: 9
	},
	{
		value: '5513',
		name: 'Alojamiento en centros vacacionales',
		id_code_ciiu: 311,
		id_section_ciiu: 9
	},
	{
		value: '5514',
		name: 'Alojamiento rural',
		id_code_ciiu: 312,
		id_section_ciiu: 9
	},
	{
		value: '5519',
		name: 'Otros tipos de alojamientos para visitantes',
		id_code_ciiu: 313,
		id_section_ciiu: 9
	},
	{
		value: '5520',
		name: 'Actividades de zonas de camping y parques para vehículos recreacionales',
		id_code_ciiu: 314,
		id_section_ciiu: 9
	},
	{
		value: '5530',
		name: 'Servicio por horas',
		id_code_ciiu: 315,
		id_section_ciiu: 9
	},
	{
		value: '5590',
		name: 'Otros tipos de alojamiento n.c.p.',
		id_code_ciiu: 316,
		id_section_ciiu: 9
	},
	{
		value: '5611',
		name: 'Expendio a la mesa de comidas preparadas',
		id_code_ciiu: 317,
		id_section_ciiu: 9
	},
	{
		value: '5612',
		name: 'Expendio por autoservicio de comidas preparadas',
		id_code_ciiu: 318,
		id_section_ciiu: 9
	},
	{
		value: '5613',
		name: 'Expendio de comidas preparadas en cafeterías',
		id_code_ciiu: 319,
		id_section_ciiu: 9
	},
	{
		value: '5619',
		name: 'Otros tipos de expendio de comidas preparadas n.c.p.',
		id_code_ciiu: 320,
		id_section_ciiu: 9
	},
	{
		value: '5621',
		name: 'Catering para eventos',
		id_code_ciiu: 321,
		id_section_ciiu: 9
	},
	{
		value: '5629',
		name: 'Actividades de otros servicios de comidas',
		id_code_ciiu: 322,
		id_section_ciiu: 9
	},
	{
		value: '5630',
		name: 'Expendio de bebidas alcohólicas para el consumo dentro del establecimiento',
		id_code_ciiu: 323,
		id_section_ciiu: 9
	},
	{
		value: '5811',
		name: 'Edición de libros',
		id_code_ciiu: 324,
		id_section_ciiu: 10
	},
	{
		value: '5812',
		name: 'Edición de directorios y listas de correo',
		id_code_ciiu: 325,
		id_section_ciiu: 10
	},
	{
		value: '5813',
		name: 'Edición de periódicos, revistas y otras publicaciones periódicas',
		id_code_ciiu: 326,
		id_section_ciiu: 10
	},
	{
		value: '5819',
		name: 'Otros trabajos de edición',
		id_code_ciiu: 327,
		id_section_ciiu: 10
	},
	{
		value: '5820',
		name: 'Edición de programas de informática (software)',
		id_code_ciiu: 328,
		id_section_ciiu: 10
	},
	{
		value: '5911',
		name: 'Actividades de producción de películas cinematográficas, videos, programas, anuncios y comerciales de televisión',
		id_code_ciiu: 329,
		id_section_ciiu: 10
	},
	{
		value: '5912',
		name: 'Actividades de postproducción de películas cinematográficas, videos, programas, anuncios y comerciales de televisión',
		id_code_ciiu: 330,
		id_section_ciiu: 10
	},
	{
		value: '5913',
		name: 'Actividades de distribución de películas cinematográficas, videos, programas, anuncios y comerciales de televisión',
		id_code_ciiu: 331,
		id_section_ciiu: 10
	},
	{
		value: '5914',
		name: 'Actividades de exhibición de películas cinematográficas y videos',
		id_code_ciiu: 332,
		id_section_ciiu: 10
	},
	{
		value: '5920',
		name: 'Actividades de grabación de sonido y edición de musica',
		id_code_ciiu: 333,
		id_section_ciiu: 10
	},
	{
		value: '6010',
		name: 'Actividades de programación y transmisión en el servicio de radiodifusión sonora',
		id_code_ciiu: 334,
		id_section_ciiu: 10
	},
	{
		value: '6020',
		name: 'Actividades de programación y transmisión de televisión',
		id_code_ciiu: 335,
		id_section_ciiu: 10
	},
	{
		value: '6110',
		name: 'Actividades de telecomunicaciones alámbricas',
		id_code_ciiu: 336,
		id_section_ciiu: 10
	},
	{
		value: '6120',
		name: 'Actividades de telecomunicaciones inalámbricas',
		id_code_ciiu: 337,
		id_section_ciiu: 10
	},
	{
		value: '6130',
		name: 'Actividades de telecomunicación satelital',
		id_code_ciiu: 338,
		id_section_ciiu: 10
	},
	{
		value: '6190',
		name: 'Otras actividades de telecomunicaciones',
		id_code_ciiu: 339,
		id_section_ciiu: 10
	},
	{
		value: '6201',
		name: 'Actividades de desarrollo de sistemas informáticos (planificación, análisis, diseño, programación, pruebas)',
		id_code_ciiu: 340,
		id_section_ciiu: 10
	},
	{
		value: '6202',
		name: 'Actividades de consultoría informática y actividades de administración de instalaciones informáticas',
		id_code_ciiu: 341,
		id_section_ciiu: 10
	},
	{
		value: '6209',
		name: 'Otras actividades de tecnologías de información y actividades de servicios informáticos',
		id_code_ciiu: 342,
		id_section_ciiu: 10
	},
	{
		value: '6311',
		name: 'Procesamiento de datos, alojamiento (hosting) y actividades relacionadas',
		id_code_ciiu: 343,
		id_section_ciiu: 10
	},
	{
		value: '6312',
		name: 'Portales Web',
		id_code_ciiu: 344,
		id_section_ciiu: 10
	},
	{
		value: '6391',
		name: 'Actividades de agencias de noticias',
		id_code_ciiu: 345,
		id_section_ciiu: 10
	},
	{
		value: '6399',
		name: 'Otras actividades de servicio de información n.c.p.',
		id_code_ciiu: 346,
		id_section_ciiu: 10
	},
	{
		value: '6411',
		name: 'Banco Central',
		id_code_ciiu: 347,
		id_section_ciiu: 11
	},
	{
		value: '6412',
		name: 'Bancos comerciales',
		id_code_ciiu: 348,
		id_section_ciiu: 11
	},
	{
		value: '6421',
		name: 'Actividades de las corporaciones financieras',
		id_code_ciiu: 349,
		id_section_ciiu: 11
	},
	{
		value: '6422',
		name: 'Actividades de las compañías de financiamiento',
		id_code_ciiu: 350,
		id_section_ciiu: 11
	},
	{
		value: '6423',
		name: 'Banca de segundo piso',
		id_code_ciiu: 351,
		id_section_ciiu: 11
	},
	{
		value: '6424',
		name: 'Actividades de las cooperativas financieras',
		id_code_ciiu: 352,
		id_section_ciiu: 11
	},
	{
		value: '6431',
		name: 'Fideicomisos, fondos y entidades financieras similares',
		id_code_ciiu: 353,
		id_section_ciiu: 11
	},
	{
		value: '6432',
		name: 'Fondos de cesantías',
		id_code_ciiu: 354,
		id_section_ciiu: 11
	},
	{
		value: '6491',
		name: 'Leasing financiero (arrendamiento financiero)',
		id_code_ciiu: 355,
		id_section_ciiu: 11
	},
	{
		value: '6492',
		name: 'Actividades financieras de fondos de empleados y otras formas asociativas del sector solidario',
		id_code_ciiu: 356,
		id_section_ciiu: 11
	},
	{
		value: '6493',
		name: 'Actividades de compra de cartera o factoring',
		id_code_ciiu: 357,
		id_section_ciiu: 11
	},
	{
		value: '6494',
		name: 'Otras actividades de distribución de fondos',
		id_code_ciiu: 358,
		id_section_ciiu: 11
	},
	{
		value: '6495',
		name: 'Instituciones especiales oficiales',
		id_code_ciiu: 359,
		id_section_ciiu: 11
	},
	{
		value: '6499',
		name: 'Otras actividades de servicio financiero, excepto las de seguros y pensiones n.c.p.',
		id_code_ciiu: 360,
		id_section_ciiu: 11
	},
	{
		value: '6511',
		name: 'Seguros generales',
		id_code_ciiu: 361,
		id_section_ciiu: 11
	},
	{
		value: '6512',
		name: 'Seguros de vida',
		id_code_ciiu: 362,
		id_section_ciiu: 11
	},
	{
		value: '6513',
		name: 'Reaseguros',
		id_code_ciiu: 363,
		id_section_ciiu: 11
	},
	{
		value: '6514',
		name: 'Capitalización',
		id_code_ciiu: 364,
		id_section_ciiu: 11
	},
	{
		value: '6521',
		name: 'Servicios de seguros sociales de salud',
		id_code_ciiu: 365,
		id_section_ciiu: 11
	},
	{
		value: '6522',
		name: 'Servicios de seguros sociales de riesgos profesionales',
		id_code_ciiu: 366,
		id_section_ciiu: 11
	},
	{
		value: '6531',
		name: 'Régimen de prima media con prestación definida (RPM)',
		id_code_ciiu: 367,
		id_section_ciiu: 11
	},
	{
		value: '6532',
		name: 'Régimen de ahorro individual (RAI)',
		id_code_ciiu: 368,
		id_section_ciiu: 11
	},
	{
		value: '6611',
		name: 'Administración de mercados financieros',
		id_code_ciiu: 369,
		id_section_ciiu: 11
	},
	{
		value: '6612',
		name: 'Corretaje de valores y de contratos de productos básicos',
		id_code_ciiu: 370,
		id_section_ciiu: 11
	},
	{
		value: '6613',
		name: 'Otras actividades relacionadas con el mercado de valores',
		id_code_ciiu: 371,
		id_section_ciiu: 11
	},
	{
		value: '6614',
		name: 'Actividades de las casas de cambio',
		id_code_ciiu: 372,
		id_section_ciiu: 11
	},
	{
		value: '6615',
		name: 'Actividades de los profesionales de compra y venta de divisas',
		id_code_ciiu: 373,
		id_section_ciiu: 11
	},
	{
		value: '6619',
		name: 'Otras actividades auxiliares de las actividades de servicios financieros n.c.p.',
		id_code_ciiu: 374,
		id_section_ciiu: 11
	},
	{
		value: '6621',
		name: 'Actividades de agentes y corredores de seguros',
		id_code_ciiu: 375,
		id_section_ciiu: 11
	},
	{
		value: '6629',
		name: 'Evaluación de riesgos y daños, y otras actividades de servicios auxiliares',
		id_code_ciiu: 376,
		id_section_ciiu: 11
	},
	{
		value: '6630',
		name: 'Actividades de administración de fondos',
		id_code_ciiu: 377,
		id_section_ciiu: 11
	},
	{
		value: '6810',
		name: 'Actividades inmobiliarias realizadas con bienes propios o arrendados',
		id_code_ciiu: 378,
		id_section_ciiu: 12
	},
	{
		value: '6820',
		name: 'Actividades inmobiliarias realizadas a cambio de una retribución o por contrata',
		id_code_ciiu: 379,
		id_section_ciiu: 12
	},
	{
		value: '6910',
		name: 'Actividades jurídicas',
		id_code_ciiu: 380,
		id_section_ciiu: 13
	},
	{
		value: '6920',
		name: 'Actividades de contabilidad, teneduría de libros, auditoría financiera y asesoría tributaria',
		id_code_ciiu: 381,
		id_section_ciiu: 13
	},
	{
		value: '7010',
		name: 'Actividades de administración empresarial',
		id_code_ciiu: 382,
		id_section_ciiu: 13
	},
	{
		value: '7020',
		name: 'Actividades de consultaría de gestión',
		id_code_ciiu: 383,
		id_section_ciiu: 13
	},
	{
		value: '7110',
		name: 'Actividades de arquitectura e ingeniería y otras actividades conexas de consultoría técnica',
		id_code_ciiu: 384,
		id_section_ciiu: 13
	},
	{
		value: '7120',
		name: 'Ensayos y análisis técnicos',
		id_code_ciiu: 385,
		id_section_ciiu: 13
	},
	{
		value: '7210',
		name: 'Investigaciones y desarrollo experimental en el campo de las ciencias naturales y la ingeniería',
		id_code_ciiu: 386,
		id_section_ciiu: 13
	},
	{
		value: '7220',
		name: 'Investigaciones y desarrollo experimental en el campo de las ciencias sociales y las humanidades',
		id_code_ciiu: 387,
		id_section_ciiu: 13
	},
	{
		value: '7310',
		name: 'Publicidad',
		id_code_ciiu: 388,
		id_section_ciiu: 13
	},
	{
		value: '7320',
		name: 'Estudios de mercado y realización de encuestas de opinión pública',
		id_code_ciiu: 389,
		id_section_ciiu: 13
	},
	{
		value: '7410',
		name: 'Actividades especializadas de diseño',
		id_code_ciiu: 390,
		id_section_ciiu: 13
	},
	{
		value: '7420',
		name: 'Actividades de fotografía',
		id_code_ciiu: 391,
		id_section_ciiu: 13
	},
	{
		value: '7490',
		name: 'Otras actividades profesionales, científicas y técnicas n.c.p.',
		id_code_ciiu: 392,
		id_section_ciiu: 13
	},
	{
		value: '7500',
		name: 'Actividades veterinarias',
		id_code_ciiu: 393,
		id_section_ciiu: 13
	},
	{
		value: '7710',
		name: 'Alquiler y arrendamiento de vehículos automotores',
		id_code_ciiu: 394,
		id_section_ciiu: 14
	},
	{
		value: '7721',
		name: 'Alquiler y arrendamiento de equipo recreativo y deportivo',
		id_code_ciiu: 395,
		id_section_ciiu: 14
	},
	{
		value: '7722',
		name: 'Alquiler de videos y discos',
		id_code_ciiu: 396,
		id_section_ciiu: 14
	},
	{
		value: '7729',
		name: 'Alquiler y arrendamiento de otros efectos personales y enseres domésticos n.c.p.',
		id_code_ciiu: 397,
		id_section_ciiu: 14
	},
	{
		value: '7730',
		name: 'Alquiler y arrendamiento de otros tipos de maquinaria, equipo y bienes tangibles n.c.p.',
		id_code_ciiu: 398,
		id_section_ciiu: 14
	},
	{
		value: '7740',
		name: 'Arrendamiento de propiedad intelectual y productos similares, excepto obras protegidas por derechos de autor',
		id_code_ciiu: 399,
		id_section_ciiu: 14
	},
	{
		value: '7810',
		name: 'Actividades de agencias de empleo',
		id_code_ciiu: 400,
		id_section_ciiu: 14
	},
	{
		value: '7820',
		name: 'Actividades de agencias de empleo temporal',
		id_code_ciiu: 401,
		id_section_ciiu: 14
	},
	{
		value: '7830',
		name: 'Otras actividades de suministro de recurso humano',
		id_code_ciiu: 402,
		id_section_ciiu: 14
	},
	{
		value: '7911',
		name: 'Actividades de las agencias de viaje',
		id_code_ciiu: 403,
		id_section_ciiu: 14
	},
	{
		value: '7912',
		name: 'Actividades de operadores turísticos',
		id_code_ciiu: 404,
		id_section_ciiu: 14
	},
	{
		value: '7990',
		name: 'Otros servicios de reserva y actividades relacionadas',
		id_code_ciiu: 405,
		id_section_ciiu: 14
	},
	{
		value: '8010',
		name: 'Actividades de seguridad privada',
		id_code_ciiu: 406,
		id_section_ciiu: 14
	},
	{
		value: '8020',
		name: 'Actividades de servicios de sistemas de seguridad',
		id_code_ciiu: 407,
		id_section_ciiu: 14
	},
	{
		value: '8030',
		name: 'Actividades de detectives e investigadores privados',
		id_code_ciiu: 408,
		id_section_ciiu: 14
	},
	{
		value: '8110',
		name: 'Actividades combinadas de apoyo a instalaciones',
		id_code_ciiu: 409,
		id_section_ciiu: 14
	},
	{
		value: '8121',
		name: 'Limpieza general interior de edificios',
		id_code_ciiu: 410,
		id_section_ciiu: 14
	},
	{
		value: '8129',
		name: 'Otras actividades de limpieza de edificios e instalaciones industriales',
		id_code_ciiu: 411,
		id_section_ciiu: 14
	},
	{
		value: '8130',
		name: 'Actividades de paisajismo y servicios de mantenimiento conexos',
		id_code_ciiu: 412,
		id_section_ciiu: 14
	},
	{
		value: '8211',
		name: 'Actividades combinadas de servicios administrativos de oficina',
		id_code_ciiu: 413,
		id_section_ciiu: 14
	},
	{
		value: '8219',
		name: 'Fotocopiado, preparación de documentos y otras actividades especializadas de apoyo a oficina',
		id_code_ciiu: 414,
		id_section_ciiu: 14
	},
	{
		value: '8220',
		name: 'Actividades de centros de llamadas (Call center)',
		id_code_ciiu: 415,
		id_section_ciiu: 14
	},
	{
		value: '8230',
		name: 'Organización de convenciones y eventos comerciales',
		id_code_ciiu: 416,
		id_section_ciiu: 14
	},
	{
		value: '8291',
		name: 'Actividades de agencias de cobranza y oficinas de calificación crediticia',
		id_code_ciiu: 417,
		id_section_ciiu: 14
	},
	{
		value: '8292',
		name: 'Actividades de envase y empaque',
		id_code_ciiu: 418,
		id_section_ciiu: 14
	},
	{
		value: '8299',
		name: 'Otras actividades de servicio de apoyo a las empresas n.c.p.',
		id_code_ciiu: 419,
		id_section_ciiu: 14
	},
	{
		value: '8411',
		name: 'Actividades legislativas de la administración pública',
		id_code_ciiu: 420,
		id_section_ciiu: 15
	},
	{
		value: '8412',
		name: 'Actividades ejecutivas de la administración pública',
		id_code_ciiu: 421,
		id_section_ciiu: 15
	},
	{
		value: '8413',
		name: 'Regulación de las actividades de organismos que prestan servicios de salud, educativos, culturales y otros servicios sociales, excepto servicios de seguridad social',
		id_code_ciiu: 422,
		id_section_ciiu: 15
	},
	{
		value: '8414',
		name: 'Actividades reguladoras y facilitadoras de la actividad económica',
		id_code_ciiu: 423,
		id_section_ciiu: 15
	},
	{
		value: '8415',
		name: 'Actividades de los otros órganos de control',
		id_code_ciiu: 424,
		id_section_ciiu: 15
	},
	{
		value: '8421',
		name: 'Relaciones exteriores',
		id_code_ciiu: 425,
		id_section_ciiu: 15
	},
	{
		value: '8422',
		name: 'Actividades de defensa',
		id_code_ciiu: 426,
		id_section_ciiu: 15
	},
	{
		value: '8423',
		name: 'Orden público y actividades de seguridad',
		id_code_ciiu: 427,
		id_section_ciiu: 15
	},
	{
		value: '8424',
		name: 'Administración de justicia',
		id_code_ciiu: 428,
		id_section_ciiu: 15
	},
	{
		value: '8430',
		name: 'Actividades de planes de Seguridad Social de afiliación obligatoria',
		id_code_ciiu: 429,
		id_section_ciiu: 15
	},
	{
		value: '8511',
		name: 'Educación de la primera infancia',
		id_code_ciiu: 430,
		id_section_ciiu: 16
	},
	{
		value: '8512',
		name: 'Educación preescolar',
		id_code_ciiu: 431,
		id_section_ciiu: 16
	},
	{
		value: '8513',
		name: 'Educación básica primaria',
		id_code_ciiu: 432,
		id_section_ciiu: 16
	},
	{
		value: '8521',
		name: 'Educación básica secundaria',
		id_code_ciiu: 433,
		id_section_ciiu: 16
	},
	{
		value: '8522',
		name: 'Educación media académica',
		id_code_ciiu: 434,
		id_section_ciiu: 16
	},
	{
		value: '8523',
		name: 'Educación media técnica y de formación laboral',
		id_code_ciiu: 435,
		id_section_ciiu: 16
	},
	{
		value: '8530',
		name: 'Establecimientos que combinan diferentes niveles de educación',
		id_code_ciiu: 436,
		id_section_ciiu: 16
	},
	{
		value: '8541',
		name: 'Educación técnica profesional',
		id_code_ciiu: 437,
		id_section_ciiu: 16
	},
	{
		value: '8542',
		name: 'Educación tecnológica',
		id_code_ciiu: 438,
		id_section_ciiu: 16
	},
	{
		value: '8543',
		name: 'Educación de instituciones universitarias o de escuelas tecnológicas',
		id_code_ciiu: 439,
		id_section_ciiu: 16
	},
	{
		value: '8544',
		name: 'Educación de universidades',
		id_code_ciiu: 440,
		id_section_ciiu: 16
	},
	{
		value: '8551',
		name: 'Formación académica no formal',
		id_code_ciiu: 441,
		id_section_ciiu: 16
	},
	{
		value: '8552',
		name: 'Enseñanza deportiva y recreativa',
		id_code_ciiu: 442,
		id_section_ciiu: 16
	},
	{
		value: '8553',
		name: 'Enseñanza cultural',
		id_code_ciiu: 443,
		id_section_ciiu: 16
	},
	{
		value: '8559',
		name: 'Otros tipos de educación n.c.p.',
		id_code_ciiu: 444,
		id_section_ciiu: 16
	},
	{
		value: '8560',
		name: 'Actividades de apoyo a la educación',
		id_code_ciiu: 445,
		id_section_ciiu: 16
	},
	{
		value: '8610',
		name: 'Actividades de hospitales y clínicas, con internación',
		id_code_ciiu: 446,
		id_section_ciiu: 17
	},
	{
		value: '8621',
		name: 'Actividades de la práctica médica, sin internación',
		id_code_ciiu: 447,
		id_section_ciiu: 17
	},
	{
		value: '8622',
		name: 'Actividades de la práctica odontológica',
		id_code_ciiu: 448,
		id_section_ciiu: 17
	},
	{
		value: '8691',
		name: 'Actividades de apoyo diagnóstico',
		id_code_ciiu: 449,
		id_section_ciiu: 17
	},
	{
		value: '8692',
		name: 'Actividades de apoyo terapéutico',
		id_code_ciiu: 450,
		id_section_ciiu: 17
	},
	{
		value: '8699',
		name: 'Otras actividades de atención de la salud humana',
		id_code_ciiu: 451,
		id_section_ciiu: 17
	},
	{
		value: '8710',
		name: 'Actividades de atención residencial medicalizada de tipo general',
		id_code_ciiu: 452,
		id_section_ciiu: 17
	},
	{
		value: '8720',
		name: 'Actividades de atención residencial, para el cuidado de pacientes con retardo mental, enfermedad mental y consumo de sustancias psicoactivas',
		id_code_ciiu: 453,
		id_section_ciiu: 17
	},
	{
		value: '8730',
		name: 'Actividades de atención en instituciones para el cuidado de personas mayores y/o discapacitadas',
		id_code_ciiu: 454,
		id_section_ciiu: 17
	},
	{
		value: '8790',
		name: 'Otras actividades de atención en instituciones con alojamiento',
		id_code_ciiu: 455,
		id_section_ciiu: 17
	},
	{
		value: '8810',
		name: 'Actividades de asistencia social sin alojamiento para personas mayores y discapacitadas',
		id_code_ciiu: 456,
		id_section_ciiu: 17
	},
	{
		value: '8890',
		name: 'Otras actividades de asistencia social sin alojamiento',
		id_code_ciiu: 457,
		id_section_ciiu: 17
	},
	{
		value: '9001',
		name: 'Creación literaria',
		id_code_ciiu: 458,
		id_section_ciiu: 18
	},
	{
		value: '9002',
		name: 'Creación musical',
		id_code_ciiu: 459,
		id_section_ciiu: 18
	},
	{
		value: '9003',
		name: 'Creación teatral',
		id_code_ciiu: 460,
		id_section_ciiu: 18
	},
	{
		value: '9004',
		name: 'Creación audiovisual',
		id_code_ciiu: 461,
		id_section_ciiu: 18
	},
	{
		value: '9005',
		name: 'Artes plásticas y visuales',
		id_code_ciiu: 462,
		id_section_ciiu: 18
	},
	{
		value: '9006',
		name: 'Actividades teatrales',
		id_code_ciiu: 463,
		id_section_ciiu: 18
	},
	{
		value: '9007',
		name: 'Actividades de espectáculos musicales en vivo',
		id_code_ciiu: 464,
		id_section_ciiu: 18
	},
	{
		value: '9008',
		name: 'Otras actividades de espectáculos en vivo',
		id_code_ciiu: 465,
		id_section_ciiu: 18
	},
	{
		value: '9101',
		name: 'Actividades de Bibliotecas y archivos',
		id_code_ciiu: 467,
		id_section_ciiu: 18
	},
	{
		value: '9102',
		name: 'Actividades y funcionamiento de museos, conservación de edificios y sitios históricos',
		id_code_ciiu: 468,
		id_section_ciiu: 18
	},
	{
		value: '9103',
		name: 'Actividades de jardines botánicos, zoológicos y reservas naturales',
		id_code_ciiu: 469,
		id_section_ciiu: 18
	},
	{
		value: '9200',
		name: 'Actividades de juegos de azar y apuestas',
		id_code_ciiu: 470,
		id_section_ciiu: 18
	},
	{
		value: '9311',
		name: 'Gestión de instalaciones deportivas',
		id_code_ciiu: 471,
		id_section_ciiu: 18
	},
	{
		value: '9312',
		name: 'Actividades de clubes deportivos',
		id_code_ciiu: 472,
		id_section_ciiu: 18
	},
	{
		value: '9319',
		name: 'Otras actividades deportivas',
		id_code_ciiu: 473,
		id_section_ciiu: 18
	},
	{
		value: '9321',
		name: 'Actividades de parques de atracciones y parques temáticos',
		id_code_ciiu: 474,
		id_section_ciiu: 18
	},
	{
		value: '9329',
		name: 'Otras actividades recreativas y de esparcimiento n.c.p.',
		id_code_ciiu: 475,
		id_section_ciiu: 18
	},
	{
		value: '9411',
		name: 'Actividades de asociaciones empresariales y de empleadores',
		id_code_ciiu: 476,
		id_section_ciiu: 19
	},
	{
		value: '9412',
		name: 'Actividades de asociaciones profesionales',
		id_code_ciiu: 477,
		id_section_ciiu: 19
	},
	{
		value: '9420',
		name: 'Actividades de sindicatos de empleados',
		id_code_ciiu: 478,
		id_section_ciiu: 19
	},
	{
		value: '9491',
		name: 'Actividades de asociaciones religiosas',
		id_code_ciiu: 479,
		id_section_ciiu: 19
	},
	{
		value: '9492',
		name: 'Actividades de asociaciones políticas',
		id_code_ciiu: 480,
		id_section_ciiu: 19
	},
	{
		value: '9499',
		name: 'Actividades de otras asociaciones n.c.p.',
		id_code_ciiu: 481,
		id_section_ciiu: 19
	},
	{
		value: '9511',
		name: 'Mantenimiento y reparación de computadores y de equipo periférico',
		id_code_ciiu: 482,
		id_section_ciiu: 19
	},
	{
		value: '9512',
		name: 'Mantenimiento y reparación de equipos de comunicación',
		id_code_ciiu: 483,
		id_section_ciiu: 19
	},
	{
		value: '9521',
		name: 'Mantenimiento y reparación de aparatos electrónicos de consumo',
		id_code_ciiu: 484,
		id_section_ciiu: 19
	},
	{
		value: '9522',
		name: 'Mantenimiento y reparación de aparatos domésticos y equipos domésticos y de jardinería',
		id_code_ciiu: 485,
		id_section_ciiu: 19
	},
	{
		value: '9523',
		name: 'Reparación de calzado y artículos de cuero',
		id_code_ciiu: 486,
		id_section_ciiu: 19
	},
	{
		value: '9524',
		name: 'Reparación de muebles y accesorios para el hogar',
		id_code_ciiu: 487,
		id_section_ciiu: 19
	},
	{
		value: '9529',
		name: 'Mantenimiento y reparación de otros efectos personales y enseres domésticos',
		id_code_ciiu: 488,
		id_section_ciiu: 19
	},
	{
		value: '9601',
		name: 'Lavado y limpieza, incluso la limpieza en seco, de productos textiles y de piel',
		id_code_ciiu: 489,
		id_section_ciiu: 19
	},
	{
		value: '9602',
		name: 'Peluquería y otros tratamientos de belleza',
		id_code_ciiu: 490,
		id_section_ciiu: 19
	},
	{
		value: '9603',
		name: 'Pompas fúnebres y actividades relacionadas',
		id_code_ciiu: 491,
		id_section_ciiu: 19
	},
	{
		value: '9609',
		name: 'Otras actividades de servicios personales n.c.p.',
		id_code_ciiu: 492,
		id_section_ciiu: 19
	},
	{
		value: '9700',
		name: 'Actividades de los hogares individuales como empleadores de personal doméstico',
		id_code_ciiu: 493,
		id_section_ciiu: 20
	},
	{
		value: '9810',
		name: 'Actividades no diferenciadas de los hogares individuales como productores de bienes para uso propio',
		id_code_ciiu: 494,
		id_section_ciiu: 20
	},
	{
		value: '9820',
		name: 'Actividades no diferenciadas de los hogares individuales como productores de servicios para uso propio',
		id_code_ciiu: 495,
		id_section_ciiu: 20
	},
	{
		value: '9900',
		name: 'Actividades de organizaciones y entidades extraterritoriales',
		id_code_ciiu: 496,
		id_section_ciiu: 21
	},
	{
		value: '10',
		name: 'Asalariados: Personas naturales y sucesiones ilíquidas, cuyos ingresos provengan de la relación laboral, legal o reglamentaria o que tengan su origen en ella.',
		id_code_ciiu: 497,
		id_section_ciiu: 0
	},
	{
		value: '90',
		name: 'Rentistas de Capital sólo para Personas Naturales: Personas naturales y sucesiones ilíquidas, cuyos ingresos provienen de intereses, descuentos, beneficios, ganancias, utilidades y en general, todo cuanto represente rendimiento de capital o diferencia entre el valor invertido o aportado, y el valor futuro y/o pagado o abonado al aportante o inversionista.',
		id_code_ciiu: 498,
		id_section_ciiu: 0
	}
];
