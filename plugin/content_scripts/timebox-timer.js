(function() {
    if (window.timerIsAlreadyLoaded) return;
    window.timerIsAlreadyLoaded = true;


    function fmtNumber(num) {
        if (num < 10) return "0" + num;
        return num;
    }
    function fmtTime(timesec) {
        let i_min = Math.floor(timesec/60);
        let i_sec = Math.floor(timesec - i_min*60);
        return fmtNumber(i_min)+":"+fmtNumber(i_sec);
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
        if (!document.getElementById("timebox-timer")) return;

        if (document.getElementById("timebox-timer").restart) {
            start_time = new Date().getTime();
            document.getElementById("timebox-timer").restart = false;
        }

        let curr_time = new Date().getTime();
        let elapsed_sec = (curr_time - start_time) / 1000;
        if (elapsed_sec >= duration) {
            document.getElementById("tbt_progressbar").setAttribute("d", describeArc(55, 55, 42.5, 0, 359.99));
            document.getElementById("tbt_remtime").textContent = fmtTime(0);
            document.getElementById("tbt_remtime").setAttribute("fill", "red");
            document.getElementById("timebox-timer").running = false;
            return;
        }

        let angle = 360 / duration * elapsed_sec;
        document.getElementById("tbt_progressbar").setAttribute("d", describeArc(55, 55, 42.5, 0, angle));
        document.getElementById("tbt_remtime").textContent = fmtTime(duration - elapsed_sec + 1);
        document.getElementById("tbt_remtime").setAttribute("fill", "#469CD9");
        document.getElementById("timebox-timer").running = true;

        requestAnimationFrame(function() {
            animate(start_time, duration)
        });
    }

    function startTimeboxTimer(minutes) {
        let duration = minutes * 60;
        let font = 'Verdana, "DejaVu Sans", "Bitstream Vera Sans", "Tahoma", "Kalimati", "Arial", "sans-serif"';

        let timer = document.getElementById("timebox-timer")
        if (timer) timer.parentNode.removeChild(timer);

        timer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        timer.setAttribute("id", "timebox-timer");
        timer.setAttribute("height", "110");
        timer.setAttribute("width", "110");
        timer.setAttribute("style", "position:fixed;right:25px;top:25px;z-index:1001;cursor:move;");
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
        remtime.setAttribute("font-family", font);
        remtime.setAttribute("font-weight", "bold");
        remtime.setAttribute("fill", "#469CD9");
        remtime.setAttribute("style", "user-select:none");
        timer.appendChild(remtime);

        let f_button = document.createElementNS("http://www.w3.org/2000/svg", "text");
        f_button.setAttribute("id", "tbt_f_button");
        f_button.setAttribute("x", "50%");
        f_button.setAttribute("y", "69%");
        f_button.setAttribute("dominant-baseline", "middle");
        f_button.setAttribute("text-anchor", "middle");
        f_button.setAttribute("font-size", "17");
        f_button.setAttribute("font-family", font);
        f_button.setAttribute("font-weight", "bold");
        f_button.setAttribute("fill", "#469CD9");
        f_button.setAttribute("style", "cursor:pointer;display:none;user-select:none");
        f_button.textContent = "F";
        timer.appendChild(f_button);

        let r_button = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        r_button.setAttribute("id", "tbt_r_button");
        r_button.setAttribute("x", 55-8);
        r_button.setAttribute("y", 26);
        r_button.setAttribute("fill", "#469CD9");
        r_button.setAttribute("stroke", "#469CD9");
        r_button.setAttribute("style", "cursor:pointer;display:none;user-select:none");
        let r_button_rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r_button_rect.setAttribute("width", "16");
        r_button_rect.setAttribute("height", "16");
        r_button_rect.setAttribute("fill", "white");
        r_button_rect.setAttribute("stroke", "white");
        r_button_rect.setAttribute("opacity", "0.01");
        r_button.appendChild(r_button_rect);
        let r_button_p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        r_button_p1.setAttribute("d", "M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z");
        r_button.appendChild(r_button_p1);
        let r_button_p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        r_button_p2.setAttribute("d", "M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z");
        r_button.appendChild(r_button_p2);
        timer.appendChild(r_button);

        let x_button = document.createElementNS("http://www.w3.org/2000/svg", "text");
        x_button.setAttribute("id", "tbt_x_button");
        x_button.setAttribute("x", "98");
        x_button.setAttribute("y", "12");
        x_button.setAttribute("dominant-baseline", "middle");
        x_button.setAttribute("text-anchor", "middle");
        x_button.setAttribute("font-size", "17");
        x_button.setAttribute("font-family", font);
        x_button.setAttribute("fill", "#469CD9");
        x_button.setAttribute("style", "cursor:pointer;display:none;user-select:none");
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
        f_text.setAttribute("style", "height:100%;display:flex;align-items:center;justify-content:center;font-family:"+font+";font-size:25vw;color:#469CD9;opacity:0.8;");
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
                timer.style.right = (document.body.clientWidth - (event.clientX + offset[0] + 110)) + "px";
                timer.style.top  = (event.clientY + offset[1]) + "px";
            }
        }, true);

        timer.addEventListener('mouseover', function() {
            f_button.style.display = "unset";
            r_button.style.display = "unset";
            x_button.style.display = "unset";
        }, true);
        timer.addEventListener('mouseout', function() {
            f_button.style.display = "none";
            r_button.style.display = "none";
            x_button.style.display = "none";
        }, true);

        f_button.addEventListener('mousedown', function(e) {
            f_button.setAttribute("fill", "red");
            f_wrapper.setAttribute("style", f_wrapper_style+"display:block;");
        }, true);
        f_button.addEventListener('mouseup', function(e) {
            f_button.setAttribute("fill", "#469CD9");
            f_wrapper.setAttribute("style", f_wrapper_style+"display:none;");
        }, true);

        r_button.addEventListener('mousedown', function(e) {
            r_button.setAttribute("fill", "red");
            r_button.setAttribute("stroke", "red");
        }, true);
        r_button.addEventListener('mouseup', function(e) {
            r_button.setAttribute("fill", "#469CD9");
            r_button.setAttribute("stroke", "#469CD9");
        }, true);
        r_button.addEventListener('click', function(e) {
            if (document.getElementById("timebox-timer").running) {
                document.getElementById("timebox-timer").restart = true;
            } else {
                requestAnimationFrame(function() {
                    animate(new Date().getTime(), duration)
                });
            }
        }, true);

        x_button.addEventListener('mousedown', function(e) {
            x_button.setAttribute("fill", "red");
        }, true);
        x_button.addEventListener('mouseup', function(e) {
            x_button.setAttribute("fill", "#469CD9");
        }, true);
        x_button.addEventListener('click', function(e) {
            timer.parentNode.removeChild(timer);
        }, true);

        requestAnimationFrame(function() {
            animate(new Date().getTime(), duration)
        });
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "start-timer") {
            startTimeboxTimer(message.timebox);
        }
    });

})();
