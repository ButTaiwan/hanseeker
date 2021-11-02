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
	resultStep1: 299,
	resultStep2: 1999,

	addCell: function(entry) {
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
		} else if (Config.useImage[block]) {
			return '<a class="'+ cls +' img" target="_blank" href="'+ url +'" style="background-image: url(' + Config.glyphwiki + 'u' + entry.unicode.toString(16) + '.svg)">' + entry.char + '</a>';
		} else {
			return '<a class="'+ cls +'" target="_blank" href="'+ url +'">' + entry.char + '</a>';
		}
	},

	showResult: function() {
		var s = '', first = true, gstr, str, blk, lastBlock;
		for (var j in Seeker.result) Seeker.result[j].gflag = false;

		var glist = $('#groups a.on');
		$(glist.get().reverse()).each( function(i, gx) {
			var g = $(gx).data('char');
			gstr = '<h3>' + g + '</h3>';
			for (var j in Seeker.result) {
				if (Seeker.result[j].gflag) continue;
				for (var gi in Seeker.result[j].groups) {
					if (Seeker.result[j].groups[gi] == g) {
						str = Config.addCell(Seeker.result[j]);
						gstr += UI.groups != null ? str : str.replace(/ img|style="[^"]+"/g, '');
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

			str = Config.addCell(Seeker.result[j]);
			s += UI.groups != null ? str : str.replace(/ img|style="[^"]+"/g, '');
			first = false;
			//s += (founds.length >= m || i >= dt.length ? str : str.replace(/ img|style="[^"]+"/g, ''));
		}
		$('#output').html(s);
	},

	setResult: function(founds, i, m) {
		Seeker.result = founds;

		if (founds.length > m) {
			$('#counter').html('<span style="color:red">超過 ' + m + ' 字</span>');
		} else if (i >= dt.length) {
			$('#counter').html('總共 ' + founds.length + ' 字');
		} else {
			$('#counter').html('目前 ' + founds.length + ' 字... ' + Math.floor(i*100 / dt.length) + '%');
		}
		Config.showResult();
	},

	onFinished: function(founds) {
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
		UI.groups = [];
		for (var g in groups) if (groups[g] >= 3) UI.groups.push({'char': g, 'unicode': g.codePointAt(0), 'count': groups[g]});
		UI.groups.sort(function(a, b) { return b.count - a.count; });

		Config.showResult();

		var str = '', g, blk;
		for (var i in UI.groups) {
			g = UI.groups[i];
			blk = Seeker.getCJKBlock(g.unicode);

			if (Config.useImage[blk]) {
				str += '<a class="grp img" href="javascript:void(0)" data-count="' + g.count + '" data-char="' + g.char + '" style="background-image: url(' + Config.glyphwiki + 'u' + g.unicode.toString(16) + '.svg)">&nbsp;</a>';
			} else {
				str += '<a class="grp" href="javascript:void(0)" data-count="' + g.count + '" data-char="' + g.char + '">' + g.char + '</a>';
			}
		}
		$('#groups').html(str);
	}
}