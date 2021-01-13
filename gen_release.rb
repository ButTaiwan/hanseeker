o1 = File.open('release/handata_uni.js', 'w:utf-8')
o2 = File.open('release/handata_full.js', 'w:utf-8')

o1.print 'var dt=['
f = File.open('source/data_nosupp.txt', 'r:utf-8')
f.each { |s|
	s.chomp!
	o1.print "'" + s + "',"
}
f.close
o1.puts '];'

o2.print 'var dt=['
f = File.open('source/data_supp.txt', 'r:utf-8')
f.each { |s|
	s.chomp!
	o2.print "'" + s + "',"
}
f.close
o2.puts '];'

o1.print 'var vt={'
o2.print 'var vt={'
f = File.open('source/data_vt.txt', 'r:utf-8')
f.each { |s|
	s.chomp!
	a, b = s.split(/\t/, 2)
	o1.print "'" + a + "':'" + b + "',"
	o2.print "'" + a + "':'" + b + "',"
}
f.close
o1.puts '};'
o2.puts '};'
o1.close
o2.close

o = File.open('release/seeker.js', 'w:utf-8')
f = File.open('source/corecode.js', 'r:utf-8')
f.each { |s|
	s.chomp!
	s.gsub!(/\/\/.*$/, '')
	s.gsub!(/\s+$/, '')
	next if s =~ /^\s*$/
	o.puts if s =~ /^\S/ && s !~ /^\};?$/ 
	o.print s.gsub(/\s+/, ' ').gsub(/^ /, '').gsub(/ ([\+\-=]) /, '\1').gsub('() {', '(){')
}
f.close
o.close


o1 = File.open('release/HanSeeker_WithoutJS.html', 'w:utf-8')
o2 = File.open('release/HanSeeker_WithoutData.html', 'w:utf-8')
o3 = File.open('release/HanSeeker_StandAlone_Unicode.html', 'w:utf-8')
o4 = File.open('release/HanSeeker_StandAlone_All.html', 'w:utf-8')

f = File.open('source/HanSeeker.htm', 'r:utf-8')
f.each { |s|
	s.chomp!
	next if s =~ /^\<\!--##--\>/
	
	if s != '<!--HERE-->'
		o1.puts s
		o2.puts s
		o3.puts s
		o4.puts s
	else
		o1.puts '<script type="text/javascript" src="handata_uni.js" encoding="utf-8"></script>'
		o2.puts '<script type="text/javascript" src="handata_uni.js" encoding="utf-8"></script>'
		o3.puts '<script>'
		o4.puts '<script>'

		ff = File.open('release/handata_uni.js', 'r:utf-8')
		ff.each { |t| o3.print t }
		ff.close

		ff = File.open('release/handata_full.js', 'r:utf-8')
		ff.each { |t| o4.print t }
		ff.close

		o1.puts '<script type="text/javascript" src="seeker.js" encoding="utf-8"></script>'
		o2.puts '<script>'

		ff = File.open('release/seeker.js', 'r:utf-8')
		ff.each { |t|
			#next if t
			o2.print t
			o3.print t
			o4.print t
		}
		ff.close

		o2.puts '</script>'
		o3.puts '</script>'
		o4.puts '</script>'
	end
}
f.close

o1.close
o2.close
o3.close
o4.close
