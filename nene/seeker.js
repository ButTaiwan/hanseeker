var Seeker = {dataIndex: null, seg: 1000, interval: 50, totalmsec: 0, segcnt: 0, worker: null, result: null, groups: null};
var UI = {shortcuts: [], keypadMode: null};
var _ = function(id) { return document.getElementById(id); }
var $_ = _('input');

//////////////////////////////////////// Configurations ////////////////////////////////////////

Seeker.getVersion = function() {return "1.1.0.0   (2021年11月)";};
Seeker.blockFlagMap = {'#': 0x0001, 'A': 0x0002, 'B': 0x0004, 'C': 0x0008, 'D': 0x0010, 'E': 0x0020, 'F': 0x0040, 'G': 0x0080, 'X': 0x2000, 'Y': 0x4000, 'Z': 0x8000};
Seeker.blockMap = {1: 0x0001, 2: 0x0002, 3: 0x0004, 4: 0x0008, 5: 0x0010, 6: 0x0020, 7: 0x0040, 8: 0x0080, 28: 0x2000, 29: 0x2000, 30: 0x4000};
//Seeker.blockMap = {1: 0x0001, 2: 0x0002, 3: 0x0004, 4: 0x0008, 5: 0x0010, 6: 0x0020, 7: 0x0040, 8: 0x0080, 27: 0x2000, 28: 0x2000, 29: 0x2000, 30: 0x4000, 31: 0x4000};
//Seeker.dataIndexMap = {1: -0x4DCF, 2: 0x1E2E, 3: -0x19412, 4: -0x19434, 5: -0x1943F, 6: -0x19441, 7: -0x1944F, 8: -0x1A86E, 27: 0x71DD, 28: 0x71DB, 29: -0x18B4B, 30: -0xD939D, 31: -0xDD1D4};

Seeker.parts = {
	'一':1,'丨':1,'丶':1,'丿':1,'乙':1,'亅':1,'乚':2,'㇄':3,'㇁':3,'㇂':3,'𠄌':3,'𠃊':3,'𠃋':3,'𡿨':3,'乛':3,'㇇':3,'𠃍':3,'㇏':3,
	'乀':3,'⺄':3,'𠃌':3,'㇆':3,'㇉':3,'𠃑':3,'㇊':3,'㇒':3,'㇣':3,'㇀':3,'二':1,'亠':1,'人':1,'儿':1,'入':1,'八':1,'冂':1,'冖':1,
	'冫':1,'几':1,'凵':1,'刀':1,'力':1,'勹':1,'匕':1,'匚':1,'匸':1,'十':1,'卜':1,'卩':1,'厂':1,'厶':1,'又':1,'亻':2,'𠆢':2,'丷':2,
	'刂':2,'⺈':2,'㔾':2,'讠':2,'𢎘':2,'𠂉':3,'〢':3,'𠂊':3,'𠂇':3,'㐅':3,'乂':3,'𠘧':3,'𠘨':3,'⺆':3,'丂':3,'𠀁':3,'龴':3,'𠂆':3,
	'𠄎':3,'㇋':3,'㇌':3,'⺀':3,'𠂈':3,'丩':3,'⺊':3,'丄':3,'丅':3,'丆':3,'𠃎':3,'𠄟':3,'𠄠':3,'𠄐':3,'𠃏':3,'乁':3,'𠙴':3,'七':4,
	'𠤎':4,'九':4,'口':1,'囗':1,'土':1,'士':1,'夂':1,'夊':1,'夕':1,'大':1,'女':1,'子':1,'宀':1,'寸':1,'小':1,'尢':1,'尸':1,'屮':1,
	'山':1,'巛':1,'工':1,'己':1,'巾':1,'干':1,'幺':1,'广':1,'廴':1,'廾':1,'弋':1,'弓':1,'彐':1,'彡':1,'彳':1,'川':2,'⺌':2,'𡭔':2,
	'䶹':2,'彑':2,'忄':2,'扌':2,'氵':2,'犭':2,'⺾':2,'阝':2,'⻖':2,'⻏':2,'⺕':2,'⻌':2,'丬':2,'纟':2,'飞':2,'饣':2,'䒑':3,'卄':3,
	'𭕄':3,'𠀆':3,'𠔼':3,'𠫓':3,'𣥂':3,'𡳾':3,'𠂎':3,'乇':3,'𫝀':3,'㐄':3,'𡕒':3,'乡':3,'𠚤':3,'习':3,'亼':3,'三':4,'丈':4,'也':4,
	'于':4,'上':4,'下':4,'兀':4,'丌':4,'卂':4,'亇':4,'万':4,'刄':4,'心':1,'戈':1,'戶':1,'手':1,'支':1,'攴':1,'文':1,'斗':1,'斤':1,
	'方':1,'无':1,'日':1,'曰':1,'月':1,'木':1,'欠':1,'止':1,'歹':1,'殳':1,'毋':1,'比':1,'毛':1,'氏':1,'气':1,'水':1,'火':1,'爪':1,
	'父':1,'爻':1,'爿':1,'片':1,'牙':1,'牛':1,'犬':1,'⺗':2,'攵':2,'朩':2,'毌':2,'灬':2,'爫':2,'爫':2,'牜':2,'𠂒':2,'尣':2,'⺩':2,
	'礻':2,'龰':2,'罓':2,'冈':2,'㓁':2,'⺼':2,'艹':2,'辶':2,'⻍':2,'耂':2,'⺳':3,'𦉪':3,'𠔿':3,'⺝':3,'艹':3,'卝':3,'龷':3,'廿':3,
	'丰':3,'丯':3,'𧘇':3,'𣎳':3,'𥘅':3,'龶':3,'⺜':3,'厃':3,'𠃜':3,'肀':3,'旡':3,'冘':3,'夬':3,'兂':3,'龵':3,'𦉫':3,'𠬝':3,'㸦':3,
	'𤓰':3,'𠃛':3,'夨':3,'仌':3,'王':4,'五':4,'六':4,'卅':4,'不':4,'丐':4,'及':4,'丑':4,'丹':4,'刅':4,'井':4,'开':4,'𠬛':4,'尺':4,
	'巨':4,'巴':4,'𣎴':4,'冃':4,'冄':4,'𠬞':4,'𠬜':4,'丮':4,'巿':4,'𠃚':4,'玄':1,'玉':1,'瓜':1,'瓦':1,'甘':1,'生':1,'用':1,'田':1,
	'疋':1,'疒':1,'癶':1,'白':1,'皮':1,'皿':1,'目':1,'矛':1,'矢':1,'石':1,'示':1,'禸':1,'禾':1,'穴':1,'立':1,'𤴓':2,'𤴔':2,'罒':2,
	'𦉰':2,'歺':2,'母':2,'氺':2,'衤':2,'⺬':2,'钅':2,'𢆉':3,'𦍍':3,'业':3,'𠀎':3,'㠯':3,'𠕁':3,'𡗗':3,'圥':3,'𠮠':3,'犮':3,'𢎨':3,
	'𦘒':3,'⺻':3,'龸':3,'𣦵':3,'丱':3,'𤕫':3,'𥝌':3,'𦫳':3,'𣎵':3,'屵':3,'𫇦':3,'四':4,'卌':4,'夗':4,'㐱':4,'乍':4,'乎':4,'冉':4,
	'册':4,'史':4,'央':4,'戉':4,'戊':4,'冋':4,'本':4,'民':4,'永':4,'北':4,'竹':1,'米':1,'糸':1,'缶':1,'网':1,'羊':1,'羽':1,'老':1,
	'而':1,'耒':1,'耳':1,'聿':1,'肉':1,'臣':1,'自':1,'至':1,'臼':1,'舌':1,'舛':1,'舟':1,'艮':1,'色':1,'艸':1,'虍':1,'虫':1,'血':1,
	'行':1,'衣':1,'襾':1,'𥫗':2,'糹':2,'𦍌':2,'⺶':2,'西':2,'覀':2,'齐':2,'冎':3,'龹':3,'𠂤':3,'𧰨':3,'乑':3,'𢦏':3,'产':3,'巩':3,
	'𦈢':3,'𠂭':3,'𠂢':3,'𠦃':3,'䇂':3,'㐆':3,'甶':3,'囟':3,'幵':3,'厽':3,'𠃨':3,'𠬪':3,'朿':4,'亙':4,'兆':4,'州':4,'年':4,'曲':4,
	'曳':4,'朱':4,'关':4,'見':1,'角':1,'言':1,'谷':1,'豆':1,'豕':1,'豸':1,'貝':1,'赤':1,'走':1,'足':1,'身':1,'車':1,'辛':1,'辰':1,
	'辵':1,'邑':1,'酉':1,'釆':1,'里':1,'訁':2,'𧮫':2,'𧾷':2,'𦥑':2,'镸':2,'⺸':3,'𦍋':3,'夋':3,'𦉶':3,'㒳':3,'㐬':3,'𠦒':3,'𦣞':3,
	'𦣝':3,'丣':3,'戼':3,'𠃬':3,'㕯':3,'㫃':3,'囧':3,'𦣻':3,'囱':3,'囪':3,'㡀':3,'严':3,'𠦑':3,'㳄':3,'我':4,'巠':4,'甹':4,'皀':4,
	'夆':4,'亜':4,'来':4,'金':1,'長':1,'門':1,'阜':1,'隶':1,'隹':1,'雨':1,'青':1,'非':1,'釒':2,'⻗':2,'靑':2,'飠':2,'叀':3,'亝':3,
	'𣏟':3,'㣇':3,'甾':3,'幷':3,'𨸏':3,'𣶒':3,'罙':4,'忝':4,'匋':4,'奄':4,'東':4,'疌':4,'黾':4,'靣':4,'面':1,'革':1,'韋':1,'韭':1,
	'音':1,'頁':1,'風':1,'飛':1,'食':1,'首':1,'香':1,'𩙿':2,'叚':3,'壴':3,'复':3,'亲':3,'枼':3,'昜':3,'亯':3,'𡿺':3,'𠧪':3,'県':3,
	'𥄉':3,'㲋':3,'𢑚':3,'㢴':3,'𢏚':3,'咢':4,'奐':4,'禺':4,'南':4,'馬':1,'骨':1,'高':1,'髟':1,'鬥':1,'鬯':1,'鬲':1,'鬼':1,'𤇾':3,
	'丵':3,'𠂹':3,'𣆪':3,'𩠐':3,'𡸁':3,'隺':4,'尃':4,'𧴪':4,'𥁕':4,'臽':4,'䍃':4,'芻':4,'皋':4,'魚':1,'鳥':1,'鹵':1,'鹿':1,'麥':1,
	'麻':1,'㒼':3,'𦰩':3,'𠦬':3,'𠁁':3,'桼':4,'啇':4,'袞':4,'翏':4,'啚':4,'悤':4,'粛':4,'黃':1,'黍':1,'黑':1,'黹':1,'菐':4,'巽':4,
	'粦':4,'尌':4,'朁':4,'尞':4,'厤':4,'肅':4,'𤔔':3,'𠥓':3,'黽':1,'鼎':1,'鼓':1,'鼠':1,'𦥯':3,'𦝠':3,'𢊁':3,'廌':3,'𠌶':3,'亶':4,
	'嗇':4,'睘':4,'鼻':1,'齊':1,'𨛜':3,'㥯':4,'熏':4,'齒':1,'嘼':3,'廛':4,'巤':4,'龍':1,'龜':1,'龠':1,'𩫖':3,'毚':4,'韱':4,
	'㇈':3,'󰎀':3,'󰋌':3,'󰊅':3,'󰊸':3,'󰕐':3,'𰀪':3,'巜':2,'󰓶':3,'󰒖':3,'󰓏':3,'󰒑':3,'󰋚':3,'󰓐':3,'󰒾':3,'𰃮':3,'龻':3,
	'󰓗':3,'󶃛':3,'󰒭':3,'󰒂':3,'󰒦':3,'󰊥':3,'󰊶':3,'󰓴':3,'󶏔':3,'󰑖':3,'󰑹':3,'󰑷':3,'㦰':3,'甲':4,'丙':4,'丁':4,'庚':4,
	'壬':4,'癸':4,'寅':4,'卯':4,'巳':4,'午':4,'未':4,'申':4,'戌':4,'亥':4,'󰑬':3,'󰐻':3,'丘':4,'𫶧':3,'󰑉':3,'虎':4,
	'󰒬':3,'󰊎':3,'󰐸':3,'󰐧':3,'󰐷':3,'刃':4,'𭤨':3,'𰀄':3,'吅':3,'从':3,'󰒊':3,'中':4,'󰑲':3,'󰩮':3,'𰀁':3,'𠂔':3,'𪩲':3,'亞':4
};

UI.strokeKeyboard = {
	vertical: true,
	className: 'strokeKB',
	groups: {
		'01畫': '一丨丶丿乙亅乚㇄㇁㇂𠄌𠃊𠃋𡿨乛㇇𠃍㇏乀⺄𠃌㇆㇉𠃑㇊㇒㇣㇀',
		'02畫': '二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又亻𠆢丷刂⺈㔾讠𢎘𠂉〢𠂊𠂇㐅乂𠘧𠘨⺆丂𠀁龴𠂆𠄎㇋㇌⺀𠂈丩⺊丄丅丆𠃎𠄟𠄠𠄐𠃏乁𠙴七𠤎九',
		'03畫': '口囗土士夂夊夕大女子宀寸小尢尸屮山巛工己巾干幺广廴廾弋弓彐彡彳川⺌𡭔䶹彑忄扌氵犭⺾阝⻖⻏⺕⻌丬纟飞饣䒑卄𭕄𠀆𠔼𠫓𣥂𡳾𠂎乇𫝀㐄𡕒乡𠚤习亼三丈也于上下兀丌卂亇万刄',
		'04畫': '心戈戶手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬⺗攵朩毌灬爫爫牜𠂒尣⺩礻龰罓冈㓁⺼艹辶⻍耂⺳𦉪𠔿⺝艹卝龷廿丰丯𧘇𣎳𥘅龶⺜厃𠃜肀旡冘夬兂龵𦉫𠬝㸦𤓰𠃛夨仌王五六卅不丐及丑丹刅井开𠬛尺巨巴𣎴冃冄𠬞𠬜丮巿𠃚',
		'05畫': '玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立𤴓𤴔罒𦉰歺母氺衤⺬钅𢆉𦍍业𠀎㠯𠕁𡗗圥𠮠犮𢎨𦘒⺻龸𣦵丱𤕫𥝌𦫳𣎵屵𫇦四卌夗㐱乍乎冉册史央戉戊冋本民永北',
		'06畫': '竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾𥫗糹𦍌⺶西覀齐冎龹𠂤𧰨乑𢦏产巩𦈢𠂭𠂢𠦃䇂㐆甶囟幵厽𠃨𠬪朿亙兆州年曲曳朱关',
		'07畫': '見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里訁𧮫𧾷𦥑镸⺸𦍋夋𦉶㒳㐬𠦒𦣞𦣝丣戼𠃬㕯㫃囧𦣻囱囪㡀严𠦑㳄我巠甹皀夆亜来',
		'08畫': '金長門阜隶隹雨青非釒⻗靑飠叀亝𣏟㣇甾幷𨸏𣶒罙忝匋奄東疌黾靣',
		'09畫': '面革韋韭音頁風飛食首香𩙿叚壴复亲枼昜亯𡿺𠧪県𥄉㲋𢑚㢴𢏚咢奐禺南',
		'其它': {
			'10畫': '馬骨高髟鬥鬯鬲鬼𤇾丵𠂹𣆪𩠐𡸁隺尃𧴪𥁕臽䍃芻皋',
			'11畫': '魚鳥鹵鹿麥麻㒼𦰩𠦬𠁁桼啇袞翏啚悤粛',
			'12畫': '黃黍黑黹菐巽粦尌朁尞厤肅𤔔𠥓',
			'13畫': '黽鼎鼓鼠𦥯𦝠𢊁廌𠌶亶嗇睘',
			'14畫': '鼻齊𨛜㥯熏',
			'15畫': '齒嘼廛巤',
			'16畫': '龍龜',
			'17畫': '龠𩫖毚韱'
		}
	}
};

//////////////////////////////////////// JavaScript Prototypes ////////////////////////////////////////

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (o, f) {
		var l = this.length; 
		if (f == null) f = 0;
		if (f < 0) f = Math.max(0, l + f);			
		for (var i = f; i < l; i++) { 
			if (this[i] === o) return i; 
		} 
		return -1; 
	};
}

if (!String.prototype.codePointAt) {
	String.prototype.codePointAt = function(i) {
		var c = this.charCodeAt(i);
		if (c >= 0xD800 && c <= 0xDBFF) return (((c & 0x03FF) << 10) | (this.charCodeAt(i+1) & 0x03FF)) + 0x10000;
		return c;
	};
}

String.prototype.charPointAt = function(i) {
	var c = this.charCodeAt(i);
	if (c >= 0xD800 && c <= 0xDBFF) return this.charAt(i) + this.charAt(i+1);
	if (c >= 0xDC00 && c <= 0xDFFF) return this.charAt(i-1) + this.charAt(i);
	return this.charAt(i);
};

//////////////////////////////////////// Core Logic ////////////////////////////////////////

Seeker.variant = function(w, v) { 
	return v && vt[w] ? vt[w] : w;
};

Seeker.arraylize = function(s, v, a) { 
	var blockFlag = 0; 
	for (var i = 0; i < s.length; i++) { 
		var w = s.charPointAt(i);
		if (w.length > 1) i++;
		if (Seeker.blockFlagMap[w]) {
			blockFlag |= Seeker.blockFlagMap[w];
		} else {
			if (w.length == 1) {
				var c = w.charCodeAt(0);
				if (c >= 0x2FF0 && c <= 0x2FFB) break;		// CJK description
			}
			a.push(Seeker.variant(w, v)); 
		}
	} 
	if (blockFlag == 0) blockFlag = 0xFFFF;
	return blockFlag;
};
	
Seeker.getCJKBlock = function(c) {
	if (c >= 0x4E00  && c <= 0x9FFC ) return 1;
	if (c >= 0x3400  && c <= 0x4DBF ) return 2;
	if (c >= 0x20000 && c <= 0x2A6DD) return 3;
	if (c >= 0x2A700 && c <= 0x2B734) return 4;
	if (c >= 0x2B740 && c <= 0x2B81D) return 5;
	if (c >= 0x2B820 && c <= 0x2CEA1) return 6;
	if (c >= 0x2CEB0 && c <= 0x2EBE0) return 7;
	if (c >= 0x30000 && c <= 0x3134A) return 8;
	if (c >= 0xF900  && c <= 0xFAD9 ) return 28;
	if (c >= 0x2F800 && c <= 0x2FA1D) return 29;
	if (c >= 0xF0270 && c <= 0xFAE7A) return 30;
	return 0;
};

Seeker.getData = function(c) { 
	if (Seeker.dataIndex == null) {
		Seeker.dataIndex = {};
		for (var i in dt) {
			var chr = dt[i].codePointAt(0);
			if (typeof(chr) != 'number') continue;
			Seeker.dataIndex[chr] = dt[i].substring(chr > 0xffff ? 2 : 1);
		}
	}
	return Seeker.dataIndex[c]; 
};

// 檢索遞迴運算
Seeker.eliminate = function(query, str, groups, ignore, divide, variant) { 
	// query: 搜尋字串的陣列(已排序)
	// str: 正要媒合的樹枝
	// divide: 硬拆
	// variant: 包容異體
	if (str == "@") return null;				// 如果此字已無法再分解

	var backup = query.concat();				// b: 備份搜尋陣列a
	var res = false;
	for (var i = 0; i < str.length; i++) { 		// 針對拆分序列中的每個字
		var w = str.charPointAt(i);
		if (w.length > 1) i++;
		if (ignore && ignore.indexOf(w) >= 0) {
			continue;
		}

		if (w == "!" && !divide) break;			// 若此字是無理拆分且非無理拆分模式
		if (w == "@" || w == "!") { 			// 某種拆分方式的起始
			if (!query.length) break;
			query.length = 0;					// 從備份重建搜尋陣列
			for (var j = 0; j < backup.length; j++) query.push(backup[j]);

		} else if (query.length) { 				// 搜尋陣列還有值
			var c = w.codePointAt(0);
			var pos = query.indexOf(Seeker.variant(w, variant)); 	// 在搜尋陣列中尋找這個字的位置
			if (pos < 0) {											// 找不到的話，把拆分字串再拆開遞迴一層
				if (Seeker.getData(c)) {
					if (Seeker.eliminate(query, Seeker.getData(c), groups, ignore, divide, variant)) {
						groups.unshift(w);
						res |= true;
					}
				}
			} else {
				query.splice(pos, 1);		// 找到了：從搜尋陣列刪除這個字
				res |= true;
			}
		}
	} 
	return res;
};

Seeker.stopMatch = function() {
	clearTimeout(Seeker.worker);
};

// setTimeout 分割版本
Seeker.getMatch = function(s, ignore, variant, divide, force, urlSrc) {
	// string, variant?, divide?, max, href
	clearTimeout(Seeker.worker);

	var x = [];
	var blockFlag = Seeker.arraylize(s, variant, x);
	x.sort();
	s = x.join(''); 
	if (s == '') return;

	var found = [];
	var work = function(j) {
		if (j+Seeker.seg < dt.length) Seeker.worker = setTimeout(function() { work(j+Seeker.seg); }, Seeker.segcnt > 10 ? Math.floor(Seeker.totalmsec/Seeker.segcnt+5) : Seeker.interval);
		var st = new Date();
		var t = 0; 
		for (var i = j; i < j + Seeker.seg && i < dt.length; i++) { 
			var query = x.concat();					// 複製陣列 (因為eliminate函式內會直接操作，故用concat的副作用進行複製)
			var w = dt[i].charPointAt(0);			// 目前測試的字
			var c = w.codePointAt(0);				//            的unicode
			var block = Seeker.getCJKBlock(c);
			if (ignore && ignore.indexOf(w) >= 0) continue;

			if (blockFlag) {						// 篩選要包含的Unicode分區
				var f = Seeker.blockMap[block] || 0x8000;
				if (!(blockFlag & f)) continue; 
			}
			
			//var n = 0; 							// 命中狀態
			var groups = [];
			if (Seeker.variant(w, variant) != s) { 
				Seeker.eliminate(query, dt[i].slice(w.length), groups, ignore, divide, variant); 
				if (query.length) continue; 		// 沒命中
				groups.unshift(w);
			} 
		
			var url = urlSrc;
			url = url.replace("$CHR$", w);
			url = url.replace("$ENC$", encodeURI(w));
			url = url.replace("$UCD$", c.toString());
			url = url.replace("$UCh$", c.toString(16));
			url = url.replace("$UCH$", c.toString(16).toUpperCase());
		
			var hitData = {'char': w, 'unicode': c, 'groups': groups, 'order': found.length};
			if (force || block == 1) found.push(hitData); 
			if (!force && block != 1) {
				clearTimeout(Seeker.worker);
				UI.onFinished(found);
				break;		// 新增超過m+1時break掉，雖然可能因此喪失精確命中結果，但可以明顯加速運算
			}
		}
		UI.setResult(found, i, force);
		Seeker.totalmsec += new Date()-st;
		Seeker.segcnt++;

		if (j+Seeker.seg >= dt.length) UI.onFinished(found);
	};
	Seeker.worker = setTimeout(function() { work(0); }, 10);
};

// 拆分
Seeker.exhaust = function(s, divide, recursive) { 
	var res = '';
	if (s.length) { 
		var w = s.charPointAt(0); 
		var c = w.codePointAt(0); 
		var def = Seeker.getData(c); //.substring(w.length);
		var k = 0; 
		for (var i = 0; i < def.length; i++) { 
			w = def.charPointAt(i);
			if (w.length > 1) i++;
			if ((w == "!") && !divide) break;
			if ((w == "@") || (w == "!")) { 
				if (k) res += (recursive == -1) ? "┇" : "‖"; 
				k++; 
			} else { 
				res += w;
				if (recursive) { 
					var subRes = Seeker.exhaust(w, divide, -1); 
					if (subRes.length) res += "(" + subRes + ")"; 
				} 
			} 
		} 
	} 
	return res; 
}; 

// 解構模式 (:)
Seeker.getTree = function(str, divide) {
	var html = ''; 
	if (str.length) {
		var w = str.charPointAt(0); 
		var c = w.codePointAt(0); 
		var p = Seeker.exhaust(w, divide, true);
		p = p.replace(/([\ud800-\udbff][\udc00-\udfff]|[^\ud800-\udfff])\(/g, '<span class="line">$1(<span class="sub">').replace(/\)/g, '</span>)</span>');

		if (p == '') {
			html += UI.addCell({'char': w, 'unicode': c, 'text': '(無法再分解)'});
		} else {
			var strs = p.split('‖');
			for (var i in strs) {
				html += UI.addCell({'char': w, 'unicode': c, 'text': strs[i].length ? strs[i] : "(無法再分解)"});
			}
		}
	}
	return html;
}

//////////////////////////////////////// User Interface ////////////////////////////////////////

UI.blockClasses = {1: 'BSC', 2: 'ExA', 3: 'ExB', 4: 'ExC', 5: 'ExD', 6: 'ExE', 7: 'ExF', 8: 'ExG', 27: 'CMP', 28: 'CMP', 29: 'CMP', 30: 'SUP', 31: 'SUP'};

UI.isMobile = function() {
	return navigator.userAgent =~ /Android|iOS/i;
};

UI.initKeyboard = function(kbType) {
	var html = '<table class="' + kbType.className + '">';
	if (!kbType.vertical) {
		html += '<tr>';
		for (var g in kbType.groups) html += '<th>' + g + '</th>';
		html += '</tr><tr>';
	}
	for (var g in kbType.groups) {
		if (kbType.vertical) html += '<tr><th>' + g + '</th>';
		html += '<td>';
		if (typeof kbType.groups[g] == 'string') {
			for (var i=0; i < kbType.groups[g].length; i++) {
				var w = kbType.groups[g].charPointAt(i);
				if (w.length > 1) i++;
				if (w == ',') { html += '<br>'; continue; }
				var z = Seeker.parts[w];
				if (z) html += '<button class="han K' + z + '" data-char="' + w + '">' + w + '</button>';
			}
		} else {
			for (var gg in kbType.groups[g]) {
				html += '<span class="sub"><span class="tag">' + gg + '</span>';
				for (var i=0; i<kbType.groups[g][gg].length; i++) {
					var w = kbType.groups[g][gg].charPointAt(i);
					if (w.length > 1) i++;
					if (w == ',') { html += '<br>'; continue; }
					var z = Seeker.parts[w];
					if (z) html += '<button class="han K' + z + '" data-char="' + w + '">' + w + '</button>';
				}
				html += '</span> ';
			}
		}
		html += '</td>';
		if (kbType.vertical) html += '</tr>';
	}
	html += '</table>';
	$('#keypad').html(html);
};

// 寫入剪貼簿
UI.setClipboard = function(s) {
	s = decodeURI(s);
	if (window.clipboardData) {
		window.clipboardData.clearData();
		window.clipboardData.setData('Text', s);
	} else {
		var t = document.createElement('textarea');
		t.textContent = s;
		document.body.appendChild(t);
		t.select();
		document.execCommand('copy');
		document.body.removeChild(t);
	}
};

// 設定 Cookie
UI.setCookie = function(n, v) {
	if (window.localStorage) window.localStorage.setItem(n, v);
	else document.cookie = n +"="+ v +"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
	return v;
};

// 讀取 Cookie
UI.getCookie = function(n, v) {
	var s = null;
	if (window.localStorage) {
		s = window.localStorage.getItem(n);
	} else {
		var a = document.cookie.replace(/\s/g, '').split(';');
		for (var i in a) {
			if (a[i].indexOf(n + '=') == 0) {
				s = a[i].substring(n.length+1);
				break;
			}
		}
	}
	if (!s) return UI.setCookie(n, v);
	return s;
};

// 取得游標位置
UI.getPos = function() {
	$_.focus();
	return $_.selectionStart;
};

// 設定游標位置
UI.setPos = function(n) { $_.setSelectionRange(n, n); };

// 取得選擇文字
UI.getSel = function() { return $_.value.substring($_.selectionStart, $_.selectionEnd); };

// 清除選擇文字
UI.delSel = function() {
	var m = $_.selectionStart;
	var n = $_.selectionEnd;
	if (m != n) {
		$_.value = $_.value.substring(0, m) + $_.value.substring(n);
		$_.setSelectionRange(m, m);
	}
};

UI.key = function(w) {
	UI.delSel();
	var n = UI.getPos();
	var s = $_.value;
	$_.value = s.slice(0, n) + w + s.slice(n);
	UI.setPos(w.length > 1 ? n+2: n+1);
	UI.go();
};

// 清除檢索
UI.clearFind = function() {
	$_.value = '';
	$_.focus();
	UI.go(true);
};

// 拆漢字
UI.decompose = function() {
	var n = UI.getPos();
	if (n > 0) {
		var s = $_.value;
		var m = n-1;
		var w = s.charPointAt(m);
		if (w == '\\') {
			m--;
			w = s.charPointAt(m);
		}
		if (w.length > 1) m--;

		var d = _('subdivide').checked;
		var t = Seeker.exhaust(w, d, false);
		if (t.length) {
			$_.value = s.slice(0, m) + t + s.slice(n).replace(/\\/g, '');
			UI.setPos(m+t.length);
			UI.go();
		}
	}
};

// 部件檢索
UI.go = function(force) {
	if (UI.ime) return;
	$_.focus();
	//if (!force && !_('onthefly').checked) return;
	UI.hidePop(true);
	Seeker.groups = null;
	$('#groups').html('').hide();
	Seeker.result = null;
	var s = UI.getSel() || $_.value;
	s = s.replace(/\s/g, '');
	Seeker.stopMatch();
	if (!s) {
		$('#counter').text('');
		$('#output').text('');
	} else {
		var divide = _('subdivide').checked;
		var variant = _('variant').checked;
		//var l = [];
		if (s.charAt(0) == ':') {
			$('#output').html(Seeker.getTree(s.slice(1), divide));
		} else {
			var ignore = null;
			var tmp = s.split('-');
			if (tmp.length == 2) { s = tmp[0]; ignore = tmp[1]; }

			var url = 'href="'+ Config.url +'"';
			Seeker.getMatch(s, ignore, variant, divide, force, url);
		}
	}
};

// 更新勾選框Cookie
UI.setMode = function(chk, key) {
	UI.setCookie(key, chk.checked ? '1' : '0');
	UI.go();
};

// 鍵盤開關改變
UI.updatePad = function() {
	UI.keypadMode = $('#showkeypad:checked').length > 0;
	UI.setCookie('keypad', UI.keypadMode ? '1' : '0');
	if (UI.keypadMode) {
		UI.initKeyboard(UI.strokeKeyboard);
		$('#keypad').show();
	} else {
		$('#keypad').hide();
	}
	$_.focus();
};

UI.replaceFind = function(s) {
	if (!UI.getSel()) $_.value = '';
	UI.key(s);
};

// 加入快捷按鈕
UI.addShortcut = function(w, d) {
	if (w) {
		var ex = false;
		for (var i in UI.shortcuts) {
			if (UI.shortcuts[i] == w) { ex = true; if (d) UI.shortcuts.splice(i, 1); }
		}
		if (!ex) {
			if (UI.shortcuts.length >= 20) UI.shortcuts.splice(0, 1);
			UI.shortcuts.push(w);
		}
		UI.setCookie('shortcuts', UI.shortcuts.join(' '));
	} else {
		var s = UI.getCookie('shortcuts', '');
		if (s) UI.shortcuts = s.split(/ /);
	}
	var html = '⌘ ';
	for (var i in UI.shortcuts) html += UI.createTag(UI.shortcuts[i], 'button', 'han', null, true);
	$('#scKey').html(html);
};

UI.showPop = function(e) {
	var c = e.target;
	if (c.tagName.toUpperCase() != 'BUTTON' && c.tagName.toUpperCase() != 'A') return;
	var change = function() {
		var maxX = document.body.scrollWidth - 70;
		//var x = e.pageX < 150 ? 10 : Math.floor(e.pageX < maxX ? e.pageX - 140 : maxX - 140);
		var rect = c.getBoundingClientRect();
		var x = rect.left < 150 ? 10 : Math.floor(rect.left < maxX ? rect.left - 140 : maxX - 140);
		$('#popview').css({left: x, top: Math.floor(window.scrollY + rect.bottom-2)}).show();
		var chr = $(c).attr('data-char') || c.innerText;
		var u = chr.codePointAt(0);
		var k = Seeker.getCJKBlock(u);
		$('#codetag').text('U+' + u.toString(16).toUpperCase());
		$('#bigchar').text(chr).attr({'class': 'han', 'style': ''});
		if (Config.useImage[k]) $('#bigchar').addClass('img').css({'background-image': 'url(' + Config.glyphwiki + 'u' + u.toString(16) + '.svg)'});
		UI.popTrigger = c;
		$('#menu_key').toggle(c.tagName.toUpperCase() == 'BUTTON');
		//_('menu_key').style.display = c.tagName.toUpperCase() == 'BUTTON' ? 'block' : 'none';
		$('#menu_go').toggle(c.tagName.toUpperCase() == 'A').attr('href', c.href);
		if (c.tagName.toUpperCase() == 'A') $('#menu_go').attr('href', c.href);
		var inScKey = c.parentElement && c.parentElement.id == 'scKey';  // 因為動態呈現時，c.parentElement可能經常消失
		$('#menu_add').toggle(!inScKey);
		$('#menu_del').toggle(inScKey);
	};
	UI.popTimer = setTimeout(change, UI.popTrigger == null ? 0 : 100);
};

UI.hidePop = function(e) {
	if (e !== true && e.target != UI.popTrigger) return;
	UI.popTimer = setTimeout(function () {
		$('#popview').hide();
		UI.popTrigger = null;
	}, 100);
};

UI.setSkipChar = function(chr) {
	if ($_.value.indexOf('-') < 0) $_.value += '-';
	$_.value += chr;
	UI.go();
};

UI.eventMoniter = function() {
	$_.addEventListener('keydown', function(e) {
		if (e.isComposing) return;
		if (e.code == 'Enter' || e.keyCode == 13) UI.go(true);
		if (e.code == 'Escape' || e.keyCode == 27) UI.clearFind();
	});

	$_.addEventListener('keyup', function(e) {
		if (e.isComposing) return;
		if (e.code == 'Backslash' || e.keyCode == 0x5C) UI.decompose();
	});

	$_.addEventListener('compositionstart', function() { UI.ime = true; });
	$_.addEventListener('compositionend', function() { setTimeout(function() { UI.ime = false; UI.go(); }, 1); });


	$($_).on('input', function() { UI.go(false); });
	$('#buttClear').click(UI.clearFind);
	$('#buttDecompose').click(UI.decompose);
	$('#buttGo').click(function() { UI.go(true) });

	$('#showkeypad').click(UI.updatePad);

	$('#popview').on('mouseenter', function(e) {
		clearTimeout(UI.popTimer);
		e.stopPropagation();
	});
	
	$('#popview').on('mouseleave', function(e) {
		e.stopPropagation();
		$('#popview').hide();
		UI.popTrigger = null;
	});
	
	// mouse in/out
	$('#keypad').on('mouseover', 'button', UI.showPop).on('mouseout', 'button', UI.hidePop);
	$('#scKey').on('mouseover', 'button', UI.showPop).on('mouseout', 'button', UI.hidePop);
	$('#groups').on('mouseover', 'a', UI.showPop).on('mouseout', 'a', UI.hidePop);
	$('#output').on('mouseover', 'a', UI.showPop).on('mouseout', 'a', UI.hidePop);
	//_('output').addEventListener('click', function(e) { if (e.target.tagName == 'A') e.preventDefault() }, false);

	// click events
	$('#scKey, #keypad').on('click', 'button', function(e) { UI.key(e.target.innerText); e.preventDefault(); });
	$('#groups').on('click', 'a.grp', function() { $(this).toggleClass('on'); UI.showOutput(); });
	$('#output').on('click', 'a', function(e) { e.preventDefault() } );

	$('#output').on('mouseover', '> span .line', function(e) { $(this).attr('class', 'line hover'); e.stopPropagation(); });
	$('#output').on('mouseout', '> span .line', function(e) { $(this).attr('class', 'line'); });

	$('#menu_go').click(function(e) { UI.popTrigger.click() });
	$('#menu_key').click(function(e) { UI.key($(UI.popTrigger).data('char')) });
	$('#menu_copy').click(function(e) { UI.setClipboard($(UI.popTrigger).data('char')) });
	$('#menu_query').click(function(e) { UI.replaceFind($(UI.popTrigger).data('char')) });
	$('#menu_skip').click(function(e) { UI.setSkipChar($(UI.popTrigger).data('char')) });
	$('#menu_add').click(function(e) { UI.addShortcut($(UI.popTrigger).data('char')) });
	$('#menu_del').click(function(e) { UI.addShortcut($(UI.popTrigger).data('char'), true) });
};

// 產生漢字按鈕
UI.createTag = function(c, tag, cls, extra, hideChar, running) {
	var code = c.codePointAt(0);
	var tagBody = Config.useImage[Seeker.getCJKBlock(code)] && !running ?
		' img" data-char="' + c + '" style="background-image: url(' + Config.glyphwiki + 'u' + code.toString(16) + '.svg)">' + (hideChar ? '&nbsp;' : c) :
		'" data-char="' + c + '">' + c;
	return '<' + tag + ' ' + (extra || '') + ' class="' + (cls || '') + tagBody + '</' + tag + '>';
};

// 產生Output框內的搜尋結果文字
UI.addCell = function(entry, running) {
	var block = Seeker.getCJKBlock(entry.unicode);
	var cls = (UI.blockClasses[block] || 'OTH');

	var url = Config.url;
	url = url.replace("$CHR$", entry.char);
	url = url.replace("$ENC$", encodeURI(entry.char));
	url = url.replace("$UCD$", entry.unicode.toString());
	url = url.replace("$UCh$", entry.unicode.toString(16));
	url = url.replace("$UCH$", entry.unicode.toString(16).toUpperCase());

	if (entry.text) {
		return '<span class="'+ cls +'">' + entry.text + '</span>';
	} else {
		return UI.createTag(entry.char, 'a', cls, 'target="_blank" href="'+ url +'"', false, running);
	}
};

// 顯示查詢結果
UI.setResult = function(founds, i, force) {
	Seeker.result = founds;
	var msg = force ? '' : '<span style="color:red">(基本)</span> ';
	msg += Seeker.groups ? '總共找到 ' + founds.length + ' 字' : '目前找到 ' + founds.length + ' 字... ' + Math.floor(i*100 / dt.length) + '%';
	$('#counter').html(msg);
	UI.showOutput();
};

// 顯示查詢結果 (Output部分)
UI.showOutput = function() {
	var s = '', first = true, gstr, blk, lastBlock;
	for (var j in Seeker.result) Seeker.result[j].gflag = false;

	var glist = $('#groups a.on');
	$(glist.get().reverse()).each( function(i, gx) {
		var g = $(gx).data('char');
		gstr = UI.createTag(g, 'h3', '', '', false);
		for (var j in Seeker.result) {
			if (Seeker.result[j].gflag) continue;
			for (var gi in Seeker.result[j].groups) {
				if (Seeker.result[j].groups[gi] == g) {
					gstr += UI.addCell(Seeker.result[j], Seeker.groups == null);
					Seeker.result[j].gflag = true;
					break;
				}
			}
		}
		s = gstr + '<br>\n' + s;
	});

	for (var j in Seeker.result) {
		if (Seeker.result[j].gflag) continue;
		blk = Seeker.getCJKBlock(Seeker.result[j].unicode);
		if (blk != lastBlock && !first) s += '<br>';
		lastBlock = blk;

		s += UI.addCell(Seeker.result[j], Seeker.groups == null);
		first = false;
	}
	$('#output').html(s);
};

UI.onFinished = function(founds) {
	Seeker.result = founds;
	var groups = {};
	for (var j in founds) {
		if (founds[j].groups) {
			//if (!founds[j].groups.length) continue;
			for (var gi in founds[j].groups) {
				var g = founds[j].groups[gi];
				if (!groups[g]) groups[g] = 0;
				groups[g]++;
			}
		}
	}
	Seeker.groups = [];
	for (var g in groups) if (groups[g] >= 3) Seeker.groups.push({'char': g, 'unicode': g.codePointAt(0), 'count': groups[g]});
	Seeker.groups.sort(function(a, b) { return b.count - a.count; });
	UI.showOutput();

	var str = '', g, blk;
	for (var i in Seeker.groups) {
		g = Seeker.groups[i];
		str += UI.createTag(g.char, 'a', 'grp', 'href="javascript:void(0)" data-count="' + g.count + '"', true);
	}
	if (str != '') $('#groups').html(str).slideDown();
};

// 初始化
UI.init = function() {
	// UI
	$('#version').html(Seeker.getVersion());

	var cnt = 0;
	for (var i in dt) if (dt[i].substring(dt[i].length-1) != '╳') cnt++;
	$('#datasize').text(cnt);

	// Status
	$('#variant').prop('checked', UI.getCookie('variant', '1') == '1');
	$('#subdivide').prop('checked', UI.getCookie('subdivide', '0') == '1');
	$('#showkeypad').prop('checked', UI.getCookie('keypad', '0') == '1');
	UI.addShortcut();

	// Events
	UI.eventMoniter();
	UI.updatePad();
};

window.onload = UI.init;
