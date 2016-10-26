$(function(){
    var weather;
    var url = "http://apis.baidu.com/heweather/weather/free";
    var apikey = "0ae09eed4f3c0267cb6e6ed7e1cdda8f";

    var isWeekHasShow = false;
    var dayWeatherBox = $('.day-weather-box');
    var btnShowWeek = $('#btn-show-week');

    updateWeather("xian");
    var captainCities = [
        '北京','天津','上海','重庆','哈尔滨','长春',
        '沈阳','南昌','南京','济南','合肥','石家庄',
        '郑州','武汉','长沙','西安','太原','成都',
        '福州','杭州','贵阳','广州','海口','西宁',
        '台北','兰州','昆明','呼和浩特','拉萨','南宁',
        '香港','澳门'
    ];

    var selectCity = $('.select-city');
    for(var city in captainCities){
        var option = $('<option value="'+ captainCities[city] +'">' + captainCities[city]  +'</option>');
        selectCity.append(option);
    }
    selectCity.on('change', function(){
        if($(this).val() != 0){
            initPage($(this).val());
            selectCity.val(0);
        }
    });

    $('#btn-change-location').click(function(){
        var city = $('.input-city');
        if(city.val() != ''){
            initPage(city.val());
            window.scrollTo(0,0);
            city.val('');
        }
    });

    btnShowWeek.click(
        function(){
            if(isWeekHasShow){
                dayWeatherBox.slideUp();
                console.log("hide week");
                console.log("child num : " + dayWeatherBox.children().length);
                isWeekHasShow = false;
                btnShowWeek.text("显示本周天气");
            }else{
                if(dayWeatherBox.children().length != 0){
                    dayWeatherBox.slideDown();
                    console.log("show week");
                    console.log("child num : " + dayWeatherBox.children().length);
                    isWeekHasShow = true;
                }else{
                    var dayWeather = $('.weather-tomorrow');
                    for(var i=2; i<weather.daily_forecast.length; i++){
                        var dayClone = dayWeather.clone();
                        $('.tomorrow', dayClone).text(weather.daily_forecast[i].date.substr(5));
                        $('.tomorrow-day-weather', dayClone).text(weather.daily_forecast[i].cond.txt_d);
                        $('.tomorrow-night-weather', dayClone).text(weather.daily_forecast[i].cond.txt_n);
                        $('.tomorrow-max', dayClone).text(weather.daily_forecast[i].tmp.max);
                        $('.tomorrow-min', dayClone).text(weather.daily_forecast[i].tmp.min);
                        dayWeatherBox.append(dayClone);
                        console.log("append week");
                    }
                    isWeekHasShow = true;
                    dayWeatherBox.slideDown();
                }
                btnShowWeek.text("隐藏本周天气");
            }

        }
    );

    function initPage(city) {
        updateWeather(city);
        dayWeatherBox.empty();
        btnShowWeek.text("显示本周天气");
        isWeekHasShow = false;
    }

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
                    todayBox.
                        append(hourWeather);
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