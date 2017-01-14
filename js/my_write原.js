$('document').ready(function(){
	$('#nav_main').click(function(){
		$('#table_header').fadeToggle();
		event.stopPropagation();    //  阻止事件冒泡
	});


	// 切换喇叭开始
	var myAudio = document.getElementById('audio1');
	$('#li_vioce').click(function(){
		if( $('#vioce_down').hasClass('glyphicon glyphicon-volume-down')) {
			$('#vioce_down').removeClass('glyphicon glyphicon-volume-down')
			$('#vioce_down').addClass('glyphicon glyphicon-volume-off')	
			muted();
			
		}

		else{
			$('#vioce_down').removeClass('glyphicon glyphicon-volume-off')
			$('#vioce_down').addClass('glyphicon glyphicon-volume-down')
			muted();
		}
	})
	$('#allmap').click(function(){
		myAudio.play(); 
	}) //模拟点击地图有声音

	audio = document.getElementById('audio1'); //注意：对于音频标签用原生JS获取ID才可以，jQuery不行 大坑。
	function muted(){
	    if(audio.muted){
	        audio.muted = false;
	    }else{
	        audio.muted = true; 
	    }
	}
	// 切换喇叭end
	
	//表格导出excels开始
	// $('#zxwz_content')
	Excel = $('#zxwz_content').text();
	Excel = $.trim(Excel) //去除所有空格。
    $("#btn_table_excels").click(function(){
        $(".table_excel").table2excel({
            exclude: ".noExl",
            name: 'Excel Document Name',
            filename: Excel,
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });	

	//表格导出excels end



	// 由首页切换到详情页 

	$('#tiaozhuan').click(function(){
		$('#side-menu li.zy_left').fadeOut('fast');
		$('#zy_table').fadeOut('fast');

		$('#side-menu li.ny_left').fadeIn(500);
		$('#ny_table').fadeIn(500);

		$('#wjz_numbers').html("<span id = 'wjz_numbers'>监控数目<span id='wjz_numbers_numbers'>38</span>个</span>");
		$('#nav_search').fadeOut('fast')
		$('#allmap').fadeOut('fast')
		$('#allmap1').fadeIn(500)
	});

	$('#back_zy').click(function(){
		$('#side-menu li.zy_left').fadeIn(500);
		$('#zy_table').fadeIn(500);


		$('#side-menu li.ny_left').fadeOut('fast');
		$('#ny_table').fadeOut('fast');


		$('#wjz_numbers').html("<span id = 'wjz_numbers'>伪基站数目<span id='wjz_numbers_numbers'>22</span>个</span>");
		$('#nav_search').fadeIn(500)

		$('#allmap1').fadeOut('fast')
		$('#allmap').fadeIn(500)
	});

	// 由首页切换到详情页 end

	//选择时间开始
	var t_start = null;
	var t_end = null

	laydate({
	  elem: '#start_time', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
	  event: 'focus', //响应事件。如果没有传入event，则按照默认的click
	  format: 'YYYY-MM-DD hh:mm:ss', // 
	  max: laydate.now(), //设定最大日期为当前日期
	  istime: true,
	  istoday: false, //是否显示今天

	  choose: function(datas){ //选择日期完毕的回调
		    var timestamp = Date.parse(datas);
			t_start = (timestamp / 1000)-8*60*60;
		}
	});


	laydate.skin('molv')
	laydate({
	  elem: '#end_time', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，
	  					//因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
	  event: 'focus', //响应事件。如果没有传入event，则按照默认的click
	  format: 'YYYY-MM-DD hh:mm:ss', // 
	  max: laydate.now(), //设定最大日期为当前日期
	  istime: true,
	  istoday: false, //是否显示今天
	  choose: function(datas){ //选择日期完毕的回调
		    var timestamp = Date.parse(datas);
			t_end = (timestamp / 1000)-8*60*60;
		}
	});
	// 选择时间end
	

	//统计查询 ajax 开始

	$('#statistics_btn').click(function(){
		// alert(t_start + t_end + $('#tjcx_keyword').val() + $('#tjcx_select').val() + $('#loc_province').val() + $('#loc_city').val())
		// alert($('#loc_province').select2('data').text) 
		// alert( $('#loc_city').select2('data').text)

		$.ajax({
			type : 'get',
			url : './json/data.json',
			// data : {
			// 	t_start : t_start,
			// 	t_end : t_end,
			// 	tjcx_keyword : $('#tjcx_keyword').val(),
			// 	tjcx_select : $('#tjcx_select').val(),
			// 	loc_province : $('#loc_province').select2('data').text,
			// 	loc_city : $('#loc_city').select2('data').text
			// },
			dataType : 'json',
			success : function(data){
					$('#zy_body tr td').empty();
					var html = '';

				$(data.ten_data).each(function(index,value){
					// console.log(value['place'],value['numbers'])
					html += '<tr><td style = "color:#fff;">' + value["place"] + '</td><td style = "color:#fff;">' + value["numbers"] + '</td></tr>' 
				})

				$('#zy_body').html(html)
			}
		});
	});

	//统计查询 ajax end



	// 实时查询ajax 开始
	var selectedvalue = null;
	$('.regular-radio').change(function(){
		selectedvalue = $("input[name='cx_time']:checked").val()
	})



	$('#realtime_btn').click(function(){
		// alert(selectedvalue + $('#sscx_select').val() + $('#sscx_keyword').val())
		$.ajax({
			type : 'GET',
			url : '/realtime/',
			data : {
				selectedvalue : selectedvalue,
				sscx_selectvalue : $('#sscx_select').val(), 
				sscx_keyword : $('#sscx_keyword').val()
			},
			dataType : 'json',
			success: function(data) {

			}
		});
	});

	// 实时查询ajax end
	

	function message_content() {
		$.ajax({
			type : 'get',
			url : './json/message-data.json',
			// data : {},
			dataType : 'json',
			success : function(data) {
				$('#ny_table tr td:odd').empty();
				var html = ''
				$(data.message_data).each(function(index,value){
					html +=  '<tr colspan="2"><td>'+ value["receive_time"]+'</td></tr>' + '<tr colspan="2"><td>' + value["receive_place"] + '</td></tr>'
				})
				$('#ny_table').html(html);

			}
		});	
	}	


	$('#allmap1').click(function(){
		message_content();

	});


})



