(function( $ ) {

    var months = new Array(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    );

    function dateFormat(date) {
        var m = date.getMonth()+1;
        var d = date.getDate();
        return date.getFullYear() + '-' + (m < 10 ? '0'+m : m) + '-' + (d < 10 ? '0'+d : d);
    }

    function getMinDate() {
        var now = new Date;
        var d = now.getUTCDate();
        var m = now.getUTCMonth();
        var y = now.getUTCFullYear();
        return new Date(y, m, d);
    }

    function getMinSlot(date) {
        var now = new Date();
        var d = now.getUTCDate();
        var m = now.getUTCMonth() + 1;
        var y = now.getUTCFullYear();

        var nowDate = y + '-' + (m<10 ? '0'+m : m) + '-' + (d<10 ? '0'+d : d);
        if (date != nowDate)
            return -1;

        var h = now.getUTCHours();
        var m = now.getUTCMinutes();
        return (h < 10 ? "0" + h : h) + ":" + (m <= 30 ? "00" : "30");
    }

    $.fn.calendar = function(timepicker, meetings, inputName) {
        var calendar = this;

        calendar.inputName = inputName;

        var requests = new Array();
        var inputs = calendar.parent();

        var prevBtn = $('<a class="btn btn-default calendar-prevbtn"><</a>');
        var monthLbl = $('<span class="calendar-monthlbl"></span>');
        var yearLbl = $('<span class="calendar-yearlbl"></span>');
        var nextBtn = $('<a class="btn btn-default calendar-nextbtn">></a>');

        function showTimePicker(n, v) {
            if(!timepicker)
                addRequestDateTime(n, v, "00:00");

            var options = $("option", timepicker);
            options.prop('disabled', false);

            var minSlot = getMinSlot(v);
            var minSlotOptionIndex = -1;
            for (var i = 0; i < options.length; i++) {
                var option = $(options[i]);
                var t = option.val();
                if(minSlot != -1 && minSlotOptionIndex == -1) {
                    option.prop('disabled', true);
                    if (t == minSlot)
                        minSlotOptionIndex = i;
                }

                console.log(meetings[v], t);
                if(v in meetings && $.inArray(t, meetings[v]) != -1)
                    option.prop('disabled', true);

            }
            if (minSlotOptionIndex != -1)
                $(options[minSlotOptionIndex+1]).prop('selected', true);
            else
                $(options[0]).prop('selected', true);


            var offset = n.position();
            timepicker.css({
                display: 'block',
                position: 'absolute',
                zIndex: 9000,
                top: offset.top,
                left: offset.left,
                height: n.outerHeight()+6,
                width: n.outerWidth()+6
            });
            timepicker.focus();
            timepicker.data('n', n);
            timepicker.data('v', v);
        }

        $("input", timepicker).on('click', function() {
            var slot = $("select", timepicker).val();
            var n = timepicker.data('n');
            var v = timepicker.data('v');
            addRequestDateTime(n, v, slot);
            timepicker.css('display', 'none');
        });

        // play as modal
        if (timepicker) {
            $('html').on('click', function () {
                if (timepicker.css('display') == 'block')
                    timepicker.css('display', 'none');
            });
            $(timepicker).on('click', function (e) {
                e.stopPropagation();
            });
        }

        function refreshCount(n, count) {
            if (count == 0) {
                $(".calendar-date-count", n).remove();
                var date = n.data('date');
                delete meetings[date];
            } else {
                var c = $('.calendar-date-count', n);
                if (c.length == 0) {
                    var c = $('<div>');
                    c.addClass('calendar-date-count');
                    n.append(c);
                }
                c.text(count);
            }
        }

        function requestInputId(v, t) {
            return calendar.inputName + '-' + v + '_' + t.replace(':', '-');
        }

        function delRequestDateTime(n, v, t) {
            n.removeClass('calendar-date-selected');
            requests.splice($.inArray(v, requests), 1 );
            $('#' + requestInputId(v, t)).remove();

            refreshCount(n, meetings[v].length);
        }

        function addRequestDateTime(n, v, t) {
            n.addClass('calendar-date-selected');
            requests.push(v);

            if (!(v in meetings))
                meetings[v] = new Array();
            meetings[v].push(t);

            refreshCount(n, meetings[v].length);

            var input = $("<input type='text' name='"+ calendar.inputName +"[]'/>");
            input.addClass('calendar-input');
            input.attr('id', requestInputId(v, t));
            input.val(v + " " + t);

            inputs.append(input);
        }

        this.showMonth = function (year, month) {
            var minDate = getMinDate();
            var firstDay = new Date(year, month, 1);
            var monthOffset = firstDay.getDay() - 1;

            if (minDate < firstDay)
                prevBtn.removeClass('disabled');
            else
                prevBtn.addClass('disabled');

            firstDay = new Date(year, month, -monthOffset);
            var lastDay = new Date(year, month + 1, 0);

            calendar.days.empty();
            var week = $("<tr>");
            var curr = firstDay;
            while (curr <= lastDay) {

                var d = $("<td>");

                if (curr.getMonth() == month) {
                    var n = $("<div>");
                    var v = dateFormat(curr);
                    n.attr('id', 'calendar-date-' + v);
                    n.addClass('calendar-date');
                    n.addClass('calendar-month-' + (curr.getMonth()));
                    n.addClass('calendar-day-' + (curr.getDay()));
                    n.data('date', v);
                    n.text(curr.getDate());

                    if (curr == today)
                        n.addClass('calendar-date-today');

                    if (curr < minDate)
                        n.addClass('disabled');
                    else
                        n.addClass('enabled');

                    if (v in meetings) {
                        n.addClass('calendar-date-filled');
                        refreshCount(n, meetings[v].length);
                    }

                    if ($.inArray(v, requests) != -1)
                        n.addClass('calendar-date-selected');

                    n.on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var n = $(this);
                        if (n.hasClass('enabled')) {
                            var v = $(this).data('date');
                            showTimePicker(n, v);
                        }
                    });

                    d.append(n);
                }

                week.append(d);
                if (curr.getDay() == 6) {
                    calendar.days.append(week);
                    week = $("<tr>");
                }

                curr.setDate(curr.getDate() + 1);
            }
            calendar.days.append(week);
            monthLbl.text(months[month]);
            yearLbl.text(year);

            calendar.year = year;
            calendar.month = month;
        };

        prevBtn.on('click', function(e) {
            e.preventDefault();
            if (prevBtn.hasClass('disabled'))
                return;

            var month = calendar.month - 1;
            var year = calendar.year;
            if (month < 0) {
                month = 11;
                year = calendar.year - 1;
            }
            calendar.showMonth(year, month);
        });

        nextBtn.on('click', function(e) {
            e.preventDefault();
            if (nextBtn.hasClass('disabled'))
                return;

            var month = calendar.month + 1;
            var year = calendar.year;
            if (month > 11) {
                month = 0;
                year = calendar.year + 1;
            }
            calendar.showMonth(year, month);
        });

        this.days = $('<tbody class="calendar-days"></tbody>');


        var head = $('<div class="calendar-header">');
        head.append(prevBtn);
        head.append(monthLbl);
        head.append(yearLbl);
        head.append(nextBtn);
        this.append(head);

        var table = $('<table><thead><tr>' +
            '<th>Sun</th><th>Mon</th><th>Tue</th>' +
            '<th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>' +
            '</tr></thead></table>');
        table.append(this.days);
        this.append(table);

        var today = new Date;
        this.showMonth(today.getFullYear(), today.getMonth());
    }
}( jQuery ));
