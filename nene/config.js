var Config = {
	// $CHR$ 表示未經編碼的漢字變數
	// $ENC$ 表示經URI編碼的漢字變數
	// $UCD$ 表示漢字的10進制Unicode變數
	// $UCh$ 表示漢字的16進制小寫Unicode變數
	// $UCH$ 表示漢字的16進制大寫Unicode變數
	url: 'https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=$ENC$',

	// GlyphWiki網站的圖片網址
	glyphwiki: 'https://glyphwiki.org/glyph/',

	// 指定哪個Range要採用圖片顯示 (true=圖片顯示，false=文字顯示)
	useImage: {1: false, 2: false, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 27: false, 28: true, 29: true, 30: false, 31: false},
	resultStep1: 99,
	resultStep2: 9999,

	// 產生結果方塊
	// w : Unicode字元
	// c : Unicode碼
	// m : 命中狀態 0=精確命中 >0=模糊命中 <0=漢字解構
	// a : 執行動作
	// t : 顯示文字
	// 回傳空字串表示捨棄此字
	addCell: function(w, c, m, a, t) {
		var f = (m < 0) ? 'decmp' : (m ? 'fuzzy' : 'exact');
		var k = Seeker.getCJKBlock(c);
		var b = UI.blockClasses[k] || 'OTH';
		if (t) {
			return '<span class="'+ f +' '+ b +'">' + t + '</span>';
		} else if (Config.useImage[k]) {
			return '<a class="'+ f +' '+ b +' img" target="_blank" '+ a +' style="background-image: url(' + Config.glyphwiki + 'u' + c.toString(16) + '.svg)">' + w + '</a> ';
		} else {
			return '<a class="'+ f +' '+ b +'" target="_blank" '+ a +'>' + w + '</a> ';
		}
	},

	setResult: function(a, i, m) {
		_('counter').innerHTML = (a.length > m) ? ('<span style="color:red">超過 ' + m + ' 字</span>') :
							(i >= dt.length ? '總共 ' + a.length + ' 字' : '目前 ' + a.length + ' 字... ' + Math.floor(i*100 / dt.length) + '%');
		var s = '';
		for (var j in a) s += (a.length >= m || i >= dt.length ? a[j] : a[j].replace(/ img|style="[^"]+"/g, '')) + ' ';							
		_('output').innerHTML = s;
	}
}