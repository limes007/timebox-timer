(function() {
    if (window.timerIsAlreadyLoaded) return;
    window.timerIsAlreadyLoaded = true;


    function fmtNumber(num) {
        if (num < 10) return "0" + num;
        return num;
    }
    function fmtTimeMS(timesec) {
        let time = new Date(timesec);
        return fmtNumber(time.getMinutes())+":"+fmtNumber(time.getSeconds());
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle){
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }

    function animate(start_time, duration){
        let curr_time = new Date().getTime();
        let elapsed_sec = (curr_time - start_time) / 1000;
        if (elapsed_sec >= duration) {
            document.getElementById("tbt_progressbar").setAttribute("d", describeArc(55, 55, 42.5, 0, 359.99));
            document.getElementById("tbt_remtime").textContent = fmtTimeMS(0);
            document.getElementById("tbt_remtime").setAttribute("fill", "red");
            return;
        }

        let angle = 360 / duration * elapsed_sec;
        document.getElementById("tbt_progressbar").setAttribute("d", describeArc(55, 55, 42.5, 0, angle));
        document.getElementById("tbt_remtime").textContent = fmtTimeMS( (duration - elapsed_sec + 1) * 1000);

        requestAnimationFrame(function() {
            animate(start_time, duration)
        });
    }

    function startTimeboxTimer(minutes) {
        let duration = minutes * 60;
        let left = document.body.clientWidth - 110 - 25;

        let timer = document.getElementById("timebox-timer")
        if (timer) timer.parentNode.removeChild(timer);

        timer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        timer.setAttribute("id", "timebox-timer");
        timer.setAttribute("height", "110");
        timer.setAttribute("width", "110");
        timer.setAttribute("style", "position:fixed;left:"+left+"px;top:25px;z-index:1001;");
        document.body.appendChild(timer);

        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "55");
        circle.setAttribute("cy", "55");
        circle.setAttribute("r", "42.5");
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "#469CD9");
        circle.setAttribute("stroke-width", "15");
        circle.setAttribute("stroke-opacity", "0.8");
        timer.appendChild(circle);

        let progressbar = document.createElementNS("http://www.w3.org/2000/svg", "path");
        progressbar.setAttribute("id", "tbt_progressbar");
        progressbar.setAttribute("fill", "none");
        progressbar.setAttribute("stroke", "white");
        progressbar.setAttribute("stroke-width", "9");
        timer.appendChild(progressbar);

        let remtime = document.createElementNS("http://www.w3.org/2000/svg", "text");
        remtime.setAttribute("id", "tbt_remtime");
        remtime.setAttribute("x", "50%");
        remtime.setAttribute("y", "50%");
        remtime.setAttribute("dominant-baseline", "middle");
        remtime.setAttribute("text-anchor", "middle");
        remtime.setAttribute("font-size", "17");
        remtime.setAttribute("font-family", "Verdana");
        remtime.setAttribute("font-weight", "bold");
        remtime.setAttribute("fill", "#469CD9");
        remtime.setAttribute("style", "cursor: move;");
        timer.appendChild(remtime);

        let f_button = document.createElementNS("http://www.w3.org/2000/svg", "text");
        f_button.setAttribute("id", "tbt_f_button");
        f_button.setAttribute("x", "50%");
        f_button.setAttribute("y", "69%");
        f_button.setAttribute("dominant-baseline", "middle");
        f_button.setAttribute("text-anchor", "middle");
        f_button.setAttribute("font-size", "17");
        f_button.setAttribute("font-family", "Verdana");
        f_button.setAttribute("font-weight", "bold");
        f_button.setAttribute("fill", "#469CD9");
        f_button.setAttribute("style", "cursor: pointer;display:none;");
        f_button.textContent = "F";
        timer.appendChild(f_button);

        let x_button = document.createElementNS("http://www.w3.org/2000/svg", "text");
        x_button.setAttribute("id", "tbt_x_button");
        x_button.setAttribute("x", "98");
        x_button.setAttribute("y", "12");
        x_button.setAttribute("dominant-baseline", "middle");
        x_button.setAttribute("text-anchor", "middle");
        x_button.setAttribute("font-size", "17");
        x_button.setAttribute("font-family", "Verdana");
        x_button.setAttribute("fill", "#469CD9");
        x_button.setAttribute("style", "cursor: pointer;display:none;");
        x_button.textContent = "x";
        timer.appendChild(x_button);

        let f_wrapper = document.getElementById("timebox-timer-f-wrapper")
        if (f_wrapper) f_wrapper.parentNode.removeChild(f_wrapper);

        f_wrapper = document.createElement("div");
        f_wrapper.setAttribute("id", "timebox-timer-f-wrapper");
        let f_wrapper_style = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;"
        f_wrapper.setAttribute("style", f_wrapper_style+"display:none;");
        document.body.appendChild(f_wrapper);

        let f_text = document.createElement("span");
        f_text.textContent = "FOCUS!";
        f_text.setAttribute("style", "height:100%;display:flex;align-items:center;justify-content:center;font-family:Verdana;font-size:25vw;color:#469CD9;opacity:0.8;");
        f_wrapper.appendChild(f_text);


        let isDownOnTimer = false;
        let offset = [0,0];
        timer.addEventListener('mousedown', function(e) {
            isDownOnTimer = true;
            offset = [
                timer.getBoundingClientRect().left - e.clientX,
                timer.getBoundingClientRect().top - e.clientY
            ];
        }, true);

        timer.addEventListener('mouseup', function() {
            isDownOnTimer = false;
        }, true);

        document.addEventListener('mousemove', function(event) {
            if (isDownOnTimer) {
                event.preventDefault();
                timer.style.left = (event.clientX + offset[0]) + "px";
                timer.style.top  = (event.clientY + offset[1]) + "px";
            }
        }, true);

        timer.addEventListener('mouseover', function() {
            f_button.setAttribute("style", "cursor: pointer;");
            x_button.setAttribute("style", "cursor: pointer;");
        }, true);
        timer.addEventListener('mouseout', function() {
            f_button.setAttribute("style", "display:none;");
            x_button.setAttribute("style", "display:none;");
        }, true);

        f_button.addEventListener('mousedown', function(e) {
            f_button.setAttribute("fill", "red");
            f_wrapper.setAttribute("style", f_wrapper_style+"display:block;");
        }, true);

        f_button.addEventListener('mouseup', function(e) {
            f_button.setAttribute("fill", "#469CD9");
            f_wrapper.setAttribute("style", f_wrapper_style+"display:none;");
        }, true);

        x_button.addEventListener('click', function(e) {
            timer.parentNode.removeChild(timer);
        }, true);

        let start_time = new Date().getTime();
        requestAnimationFrame(function() {
            animate(start_time, duration)
        });
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "start-timer") {
            startTimeboxTimer(message.timebox);
        }
    });

})();
