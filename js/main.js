$(function(){
    /**
     * 定义全局变量
     *
     * weather 存储请求的天气信息的结果
     * url     天气API
     * apikey  api请求头里所要求的key值
     *
     * isWeekHasShow 标示是否显示一周的天气
     * dayWeatherBox 显示一周天气的容器
     * btnShowWeek   触发显示一周天气的按键
     */
    var weather;
    var url = "http://apis.baidu.com/heweather/weather/free";
    var apikey = "0ae09eed4f3c0267cb6e6ed7e1cdda8f";

    var isWeekHasShow = false;
    var dayWeatherBox = $('.day-weather-box');
    var btnShowWeek = $('#btn-show-week');

    //初始化天气，默认地点西安
    updateWeather("xian");
    var captainCities = [
        '北京','天津','上海','重庆','哈尔滨','长春',
        '沈阳','南昌','南京','济南','合肥','石家庄',
        '郑州','武汉','长沙','西安','太原','成都',
        '福州','杭州','贵阳','广州','海口','西宁',
        '台北','兰州','昆明','呼和浩特','拉萨','南宁',
        '香港','澳门'
    ];

    //选择城市的列表
    var selectCity = $('.select-city');
    //初始化省会城市列表
    for(var city in captainCities){
        var option = $('<option value="'+ captainCities[city] +'">' + captainCities[city]  +'</option>');
        selectCity.append(option);
    }

    //当城市改变时，初始化页面
    selectCity.on('change', function(){
        if($(this).val() != 0){
            initPage($(this).val());
            selectCity.val(0);
        }
    });

    //手动输入城市时，初始化页面
    $('#btn-change-location').click(function(){
        var city = $('.input-city');
        if(city.val() != ''){
            initPage(city.val());
            window.scrollTo(0,0);
            city.val('');
        }
    });

    //显示或隐藏一周天气
    btnShowWeek.click(
        function(){
            //隐藏一周天气
            if(isWeekHasShow){
                dayWeatherBox.slideUp();
                isWeekHasShow = false;
                btnShowWeek.text("显示本周天气");
            }else{
                //判断是否加载过一周的天气，如果没加载过，先加载数据
                if(dayWeatherBox.children().length == 0) {
                    var dayWeather = $('.weather-tomorrow');
                    for(var i=2; i<weather.daily_forecast.length; i++){
                        var dayClone = dayWeather.clone();
                        $('.tomorrow', dayClone).text(weather.daily_forecast[i].date.substr(5));
                        $('.tomorrow-day-weather', dayClone).text(weather.daily_forecast[i].cond.txt_d);
                        $('.tomorrow-night-weather', dayClone).text(weather.daily_forecast[i].cond.txt_n);
                        $('.tomorrow-max', dayClone).text(weather.daily_forecast[i].tmp.max);
                        $('.tomorrow-min', dayClone).text(weather.daily_forecast[i].tmp.min);
                        dayWeatherBox.append(dayClone);
                    }
                }
                //显示一周天气
                isWeekHasShow = true;
                dayWeatherBox.slideDown();
                btnShowWeek.text("隐藏本周天气");
            }

        }
    );
    //更新天气并初始化页面
    function initPage(city) {
        updateWeather(city);
        dayWeatherBox.empty();
        btnShowWeek.text("显示本周天气");
        isWeekHasShow = false;
    }
    //ajax请求更新页面天气信息
    function updateWeather(city) {
        $.ajax({
            type: 'GET',
            data: {city: city},
            url: url,
            beforeSend: function (request) {
                request.setRequestHeader('apikey', apikey);
            },
            success: function (data) {
                for (var field in data) {
                    if(data[field][0].status == "unknown city"){
                        confirm("你输入的城市名不正确");
                        return;
                    }
                    weather = data[field][0];
                    break;
                }
                console.log(weather);
                $('.current-city').text(weather.basic.city);
                $('.update-time').text(weather.basic.update.loc.substr(11));
                $('.now-weather').text(weather.now.cond.txt);
                $('.now-temp-num').text(weather.now.tmp);
                $('.now-description').text(weather.suggestion.comf.txt);
                $('.today-day-weather').text(weather.daily_forecast[0].cond.txt_d);
                $('.today-night-weather').text(weather.daily_forecast[0].cond.txt_n);
                $('.today-max').text(weather.daily_forecast[0].tmp.max);
                $('.today-min').text(weather.daily_forecast[0].tmp.min);
                var todayBox = $('.today-weather-box');
                //var hourTemple = $('.hour-temple');
                for (var i = 0; i < weather.hourly_forecast.length; i++) {
                    var hourWeather = $('<div class="hour today-hour"><span class="hour-time">' + weather.hourly_forecast[i].date.substr(11)
                        + '</span><span class="hour-temp">' + weather.hourly_forecast[i].tmp + '℃</span></div>');
                    /*var hourClone = hourWeather.clone();
                     $('.hour-time', hourClone).text(weather.hourly_forecast[i].date.substr(11));
                     $('.hour-temp-num', hourClone).text(weather.hourly_forecast[i].tmp);*/
                    todayBox.append(hourWeather);
                }
                //hourTemple.remove();
                $('.tomorrow-day-weather').text(weather.daily_forecast[1].cond.txt_d);
                $('.tomorrow-night-weather').text(weather.daily_forecast[1].cond.txt_n);
                $('.tomorrow-max').text(weather.daily_forecast[1].tmp.max);
                $('.tomorrow-min').text(weather.daily_forecast[1].tmp.min);
            }
        });
    }
});