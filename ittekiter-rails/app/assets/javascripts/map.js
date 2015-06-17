(function(global) {
	"use strict";

	function Ittekiter() {
		Ittekiter.prototype.setOverlay();
		Ittekiter.prototype.initMap();

		// ルート検索フィールの埋まり具合
		this.searchEnable = {
			from: false,
			to: false,
			date: false,
			time: false
		};

		// ルート検索用のデータ
		this.searchData = {
			from: null,
			to: null,
			date: null,
			time: null
		};
	}

	Ittekiter["prototype"]["initMap"] = initMap;
	Ittekiter["prototype"]["setOverlay"] = setOverlay;
	Ittekiter["prototype"]["setSize"] = setSize;
	Ittekiter["prototype"]["setEvent"] = setEvent;
	Ittekiter["prototype"]["searchRoot"] = searchRoot;
	/**
	 * マップの初期化
	 */
	function initMap() {
		var opts = {
			zoom: 8,
			center: new google.maps.LatLng(36.086338,140.10617100000002),
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(document.getElementById("map"), opts);
		this.directionsService = new google.maps.DirectionsService();
		this.directionsDisplay = new google.maps.DirectionsRenderer();
		this.directionsDisplay.setMap(this.map);
	};

	/**
	 * スタート画面の設定
	 */
	function setOverlay() {
		// ノードのキャッシング
		this.elements = {
			$set_from: $("#set_from"),
			$set_to: $("#set_to"),
			$set_date: $("#set_date"),
			$set_time: $("#set_time"),
			$change_from: $("#change_from"),
			$change_to: $("#change_to"),
			$change_date: $("#change_date"),
			$change_time: $("#change_time"),
			$base: $("#base"),
			$overlay: $("#overlay")
		};

		this.elements.$overlay__inner = this.elements.$overlay.find("#overlay__inner");

		// プレイスオートコンプリート
		var placesOptions = {
			types: ['establishment']
		};
		// スタート画面のフォーム
		this.setFrom = new google.maps.places.Autocomplete(this.elements.$set_from[0], placesOptions);
		this.setTo = new google.maps.places.Autocomplete(this.elements.$set_to[0], placesOptions);
		// サイドバーのフォーム
		this.changeFrom = new google.maps.places.Autocomplete(this.elements.$change_from[0], placesOptions);
		this.changeTo = new google.maps.places.Autocomplete(this.elements.$change_to[0], placesOptions);

		// picker.js + picker.date.js + picker.time.js + legacy.js
		// (Styling) default.css + default.date.css + default.time.css
		var pickerOptions = {
			container: '#picker_container',
			clear: ''
		}
		// スタート画面のフォーム
		this.setDate = this.elements.$set_date.pickadate(pickerOptions);
		this.setTime = this.elements.$set_time.pickatime(pickerOptions);
		// サイドバーのフォーム
		this.changeDate = this.elements.$change_date.pickadate(pickerOptions);
		this.changeTime = this.elements.$change_time.pickatime(pickerOptions);
	};

	/**
	 * 要素のサイズ設定
	 */
	function setSize() {
		// スタート画面フォームの中央配置
		var margin = $(window).height() - this.elements.$overlay__inner.find("#overlay__logo").outerHeight(true) - this.elements.$overlay__inner.find("#overlay__form").outerHeight(true);

		if (margin < 0)
			margin = 0;

		this.elements.$overlay__inner.css({
			marginTop: margin / 2
		});
	};

	/**
	 * イベントの登録
	 */
	function setEvent() {
		var it = this;

		// フォームチェック
		// オートコンプリートのサジェスチョン選択時	
		google.maps.event.addListener(it.setFrom, 'place_changed', changePlace.bind(it, 'from', it.setFrom));
		google.maps.event.addListener(it.setTo, 'place_changed', changePlace.bind(it, 'to', it.setTo));
		google.maps.event.addListener(it.changeFrom, 'place_changed', changePlace.bind(it, 'from', it.changeFrom));
		google.maps.event.addListener(it.changeTo, 'place_changed', changePlace.bind(it, 'to', it.changeTo));
		// 場所名書き換え時
		it.elements.$set_from.on("keydown keyup keypress change", checkPlace.bind(it, 'from', it.elements.$set_from));
		it.elements.$set_to.on("keydown keyup keypress change", checkPlace.bind(it, 'to', it.elements.$set_to));
		it.elements.$change_from.on("keydown keyup keypress change", checkPlace.bind(it, 'from', it.elements.$change_from));
		it.elements.$change_to.on("keydown keyup keypress change", checkPlace.bind(it, 'to', it.elements.$change_to));
		// 日時選択時
		it.elements.$set_date.on("change", changeDateTime.bind(it, 'date', it.setDate));
		it.elements.$set_time.on("change", changeDateTime.bind(it, 'time', it.setTime));
		it.elements.$change_date.on("change", changeDateTime.bind(it, 'date', it.changeDate));
		it.elements.$change_time.on("change", changeDateTime.bind(it, 'time', it.changeTime));

		// アリバイ作成(スタート画面)
		// "tap"(EventType): jquery.finger.js (click + touch)
		it.elements.$overlay.find("#make_alibi").on("tap", function() {
			// スタート画面
			// フェードアウト->非表示(display: none)->ルート検索
			// $.transition: jquery.transit.js
			it.elements.$overlay.transition({
				opacity: 0
			}, function() {
				setTimeout(function() {
					it.searchRoot();
					google.maps.event.trigger(it.map, "resize");
				}, 400);
				it.elements.$base.addClass('base--started');
				it.elements.$overlay.css({
					display: "none"
				});
			});
		});

		/*瑛彦が書いた*/
        it.elements.$overlay.find("#sign_in").on("tap",function(){
        	location.href="http://localhost:3000/auth/twitter";
        });
        it.elements.$overlay.find("#sign_out").on("tap",function(){
        	location.href="http://localhost:3000/logout";
        });
        it.elements.$overlay.find("#overlay__goimadoko").on("tap",function(){
        	
        });
        /*瑛彦が書いた*/

		// アリバイ作成(サイドバー)
		$("#change_alibi").on("tap", searchRoot.bind(it));



		// サイドバートグル
		$("#base__toggle_sidebar").on("tap", function() {
			it.elements.$base.toggleClass('base--sidebaropened');
		});

		// サイドバースワイプ
		$("body").on('flick', "#base.base--sidebaropened #sidebar", function(e) {
			if ('horizontal' == e.orientation && -1 == e.direction) {
				it.elements.$base.removeClass('base--sidebaropened');
			}
		});

		google.maps.event.addDomListener(window, "resize", function() {
			var center = it.map.getCenter();
			google.maps.event.trigger(it.map, "resize");
			it.map.setCenter(center); 
		});
	};

	/**
	 * 場所フォームチェック
	 * @param  {String}        type     'from' or 'to'(出発地 or 目的地)
	 * @param  {$}             $element input要素のjQueryオブジェクト
	 */
	function checkPlace(type, $element) {
		// 選択済みの場所データから入力フィールドが変更されていれば拒否
		if (this.searchData[type] && $element.val() !== this.searchData[type].name)
			this.searchEnable[type] = false;
		checkForm.call(this);
	}

	/**
	 * 場所変更(place_changedからの呼び出し)
	 * @param  {String}                          type         'from' or 'to'(出発地 or 目的地)
	 * @param  {google.maps.places.Autocomplete} autocomplete PlacesAutocomplate object
	 */
	function changePlace(type, autocomplete) {
		// 場所データをキャッシュ
		this.searchData[type] = autocomplete.getPlace();
		// フォームの値を同期
		$('.where_' + type).blur().val(this.searchData[type].name);
		if (typeof this.searchData[type].geometry !== "undefined")
			this.searchEnable[type] = true;
		checkForm.call(this);
	}

	/**
	 * 日時変更
	 * @param  {String}   type        'date' or 'time'(日 or 時)
	 * @param  {$.picker} picker      値を取得する pickadate or pickatime オブジェクト
	 */
	function changeDateTime(type, picker) {
		// 日時データをキャッシュ
		this.searchData[type] = picker["picka" + type]("get", "select");
		// フォームの値を同期
		$('.when_' + type).val(picker["picka" + type]("get", "value"));
		this.searchEnable[type] = true;
		checkForm.call(this);
	}

	/**
	 * アリバイ作成フォームのチェック
	 */
	function checkForm() {
		if (this.searchEnable.from && this.searchEnable.to && this.searchEnable.date && this.searchEnable.time) {
			$(".search_root").removeAttr("disabled");
		} else {
			$(".search_root").attr("disabled", "");
		}
	};

	/**
	 * ルートの検索・描画
	 */
	function searchRoot() {
		var it = this;

		console.log(it.searchData.from, it.searchData.to, it.searchData.date, it.searchData.time);
		it.elements.$base.removeClass('base--sidebaropened');

		var request = {
			origin: it.searchData.from.geometry.location,
			destination: it.searchData.to.geometry.location,
			travelMode: google.maps.TravelMode.DRIVING
		};
		it.directionsService.route(request, (function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				it.directionsDisplay.setDirections(result);
			}
		}).bind(it));

		// ExpandablePopupのテスト
		// var start = new ExpandablePopup(it.map, it.searchData.from.geometry.location, it.searchData.from.name);
		// var end = new ExpandablePopup(it.map, it.searchData.to.geometry.location, it.searchData.to.name);

		var request = {
			location: it.searchData.to.geometry.location,
			radius: '5000',
			types: ['amusement_park', 'aquarium', 'art_gallery', 'bakery', 'bowling_alley', 'cafe', 'campground', 'casino', 'cemetery', 'church', 'food', 'gym', 'health', 'hindu_temple', 'library', 'mosque', 'movie_theater', 'museum', 'park', 'restaurant', 'spa', 'stadium', 'synagogue', 'zoo']
		};

		it.placesService = new google.maps.places.PlacesService(it.map);
		it.placesService.nearbySearch(request, function (results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length && i < 5; i++) {
					var marker = new ExpandablePopup(it.map, results[i].geometry.location, results[i].name);
				}
			}
		});
	};

	/**
	 * 地図上にクリックすると拡大するポップアップを表示(InfoWindow代替)
	 * prototype.loadContentで拡大後のコンテンツを非同期読み込みするように実装してください。
	 * @param {google.maps.Map}    map     Mapオブジェクト
	 * @param {google.maps.LatLng} latlng  吹き出しの出る座標
	 * @param {String}             content 中身(縮小時)
	 */
	function ExpandablePopup(map, latlng, content) {
		this.setMap(map);
		this.latlng = latlng;
		this.content = content;
	}

	// Inheritance + Implementation
	ExpandablePopup['prototype'] = new google.maps.OverlayView();
	ExpandablePopup['prototype']['onAdd'] = expandablePopupOnAdd;
	ExpandablePopup['prototype']['draw'] = expandablePopupDraw;
	ExpandablePopup['prototype']['onRemove'] = expandablePopupOnRemove;

	// Extention
	ExpandablePopup['prototype']['modifyExpandedPopupSize'] = modifyExpandedPopupSize;
	ExpandablePopup['prototype']['initContent'] = initContent;
	ExpandablePopup['prototype']['loadContent'] = loadContent;

	/**
	 * google.maps.OvarlayView.onAdd()の実装
	 */
	function expandablePopupOnAdd() {
		var panes = this.getPanes();
		this.$popover = $('<div class="expop popover top fade in show" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>');
		$(panes.overlayMouseTarget).append(this.$popover);
		this.initContent();

		this.$popover.one('tap', expandExpandablePopup.bind(this));
	}

	/**
	 * google.maps.OvarlayView.draw()の実装
	 */
	function expandablePopupDraw() {
		this.point = this.getProjection().fromLatLngToDivPixel(this.latlng);
		this.$popover.css({
			left: this.point.x - this.width / 2,
			top: this.point.y - this.height - 11
		});
	}

	/**
	 * google.maps.OvarlayView.onRemove()の実装
	 */
	function expandablePopupOnRemove() {
		this.$popover.remove();
	}

	/**
	 * 拡張時のサイズ設定
	 */
	function modifyExpandedPopupSize() {
		var m = $("#map");
		var mw = m.width();
		var mh = m.height();

		if (mw > 767) {
			mw = 768;
		}

		this.height = mh - 55 - 40 - 10;
		this.width = mw - 40 - 10;
		this.$popover.css({
			width: this.width,
			height: this.height
		});
		this.draw();

		var prj = this.getProjection();
		var pixel = prj.fromLatLngToDivPixel(this.latlng);
		pixel.y -= this.height / 2;
		this.map.panTo(prj.fromDivPixelToLatLng(pixel));
	}

	/**
	 * 縮小時の中身の設定
	 * @param {String} content 中身
	 */
	function initContent(content) {
		if (content && typeof content !== "undefined")
			this.content = content;

		this.$popover.find('.popover-content').html(this.content);
		this.width = this.$popover.outerWidth();
		this.height = this.$popover.outerHeight();
		this.draw();
	}

	/**
	 * 非同期読み込みを実装してください
	 * @return {String} 拡大後の中身
	 */
	function loadContent() {
		// 継承先かインスタンスで実装してください。
		return this.content;
	}

	function expandExpandablePopup() {
		var popup = this;
		var $popover = popup.$popover;
		var tmpWidth = popup.width;
		var tmpHeight = popup.height;
		var tmpCenter = popup.map.getCenter();
		var tmpContent = popup.content;

		popup.content = popup.loadContent();

		popup.modifyExpandedPopupSize();

		var resize = google.maps.event.addDomListener(window, "resize", modifyExpandedPopupSize.bind(popup));
		$popover.css({
			zIndex: "+=1"
		}).delay(400).queue(function() {
			popup.draw();
			$popover.find('.popover-content').fadeOut('fast', function() {
				$popover.find('.popover-content').html('<div class="_scroll">' + popup.content + '</div>').fadeIn('fast');
			});			
			$("body").one("tap", contractExpandablePopup.bind(popup, tmpWidth, tmpHeight, tmpCenter, tmpContent, resize));
		});

		$popover.on("click mouseenter mousemove mouseleave touchstart touchmove touchend tap", function(e) {
			e.stopPropagation();
		});
	}

	/**
	 * ポップアップを元のサイズに戻す
	 * @param  {Number} width   元の幅
	 * @param  {Number} height  元の高さ
	 * @param  {Number} center  元の中心
	 * @param  {String} content 元の中身
	 */
	function contractExpandablePopup(width, height, center, content, resize) {
		var popup = this
		var $popover = popup.$popover;
		var $popoverContent = $popover.find('.popover-content');
		popup.width = width;
		popup.height = height;

		$popoverContent.fadeOut('fast', function() {
			popup.map.panTo(center);
			$popover.css({
				height: height,
				width: width,
				zIndex: "-=1"
			});
			popup.draw();
			$popoverContent.html(content).fadeIn('fast');
			$popover.one('tap', expandExpandablePopup.bind(popup));
		});

		google.maps.event.removeListener(resize);
	}

	// Exports
	if ("process" in global) {
		module["exports"] = Ittekiter;
	}
	global["Ittekiter"] = Ittekiter;

})((this || 0).self || global);

/**
 * main
 */
$(function() {
	var ittekiter = new Ittekiter();

	ittekiter.setSize();
	ittekiter.setEvent();

	var timer = false;
	$(window).on("orientationchange resize", function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			ittekiter.setSize();
		}, 200);
	});
});

/**
 * タッチスクロール用の制御
 * ページ全体ではなく、一部のみスクロールさせたい時
 * _scrollクラスつけた要素内がスクロール可能
 * 親要素のHeightの指定が必要
 */
$(document).on({
	touchstart: function(e) {
		$.data(this, "touchStart", {
			x: e.originalEvent.changedTouches[0].pageX,
			y: e.originalEvent.changedTouches[0].pageY
		});
	},
	touchmove: function(e) {
		var start = $.data(this, "touchStart");
		start.scrolling = start.scrolling || Math.abs(e.originalEvent.changedTouches[0].pageY - start.y) - Math.abs(e.originalEvent.changedTouches[0].pageX - start.x);
		if (start.scrolling > 0 && !$(this).hasClass('disable_scroll')) {
			var stopProp = this.scrollTop ? this.scrollHeight - this.offsetHeight - this.scrollTop ? true : e.originalEvent.changedTouches[0].pageY >= start.y : this.scrollHeight - this.offsetHeight ? e.originalEvent.changedTouches[0].pageY <= start.y : false;
			console.log(this.scrollHeight, this.offsetHeight, this.scrollTop, e.originalEvent.changedTouches[0].pageY, start.y)
			if (stopProp) {
				e.stopImmediatePropagation();
			} else {
				$(this).css({
					y: (e.originalEvent.changedTouches[0].pageY - start.y) / 2.5
				});
			}
		}
		$.data(this, "touchStart", start);
	},
	touchend: function(e) {
		$(this).transition({
			y: 0
		});
		$.removeData(this, "touchStart");
	},
	touchcancel: function(e) {
		$(this).transition({
			y: 0
		});
		$.removeData(this, "touchStart");
	}
}, "._scroll");
