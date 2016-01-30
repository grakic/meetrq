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

    $.fn.calendar = function(year, month, minDate, meetings, inputName) {
        var calendar = this;

        var today = new Date;
        if (year == null) year = today.getFullYear();
        if (month == null) month = today.getMonth();
        if (minDate == null) minDate = today;

        calendar.year = year;
        calendar.month = month;
        calendar.minDate = minDate;
        calendar.inputName = inputName;

        var requests = new Array();

        var prevBtn = $('<a class="btn btn-default calendar-prevbtn"><</a>');
        var monthLbl = $('<span class="calendar-monthlbl"></span>');
        var yearLbl = $('<span class="calendar-yearlbl"></span>');
        var nextBtn = $('<a class="btn btn-default calendar-nextbtn">></a>');

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

        function delRequestDate(n, v) {
            n.removeClass('calendar-date-selected');
            requests.splice($.inArray(v, requests), 1 );
            $('#' + calendar.inputName + '-' + v).remove();

            refreshCount(n, --meetings[v]);
        }

        function addRequestDate(n, v) {
            n.addClass('calendar-date-selected');
            requests.push(v);

            if (!(v in meetings))
                meetings[v] = 0;
            refreshCount(n, ++meetings[v]);

            var input = $("<input type='hidden' name='"+ calendar.inputName +"[]'/>");
            input.attr('id', calendar.inputName + '-' + v);
            input.val(v);

            calendar.append(input);
        }

        this.showMonth = function (year, month) {
            var firstDay = new Date(year, month, 1);
            var monthOffset = firstDay.getDay() - 1;
            firstDay = new Date(year, month, -monthOffset);

            var lastDay = new Date(year, month + 1, 0);

            if (minDate < firstDay)
                prevBtn.removeClass('disabled');
            else
                prevBtn.addClass('disabled');

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
                        refreshCount(n, meetings[v]);
                    }

                    if ($.inArray(v, requests) != -1)
                        n.addClass('calendar-date-selected');

                    n.on('click', function(e) {
                        e.preventDefault();

                        var n = $(this);
                        var v = $(this).data('date');

                        if ($.inArray(v, requests) == -1)
                            addRequestDate(n, v);
                        else
                            delRequestDate(n, v)

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

        this.showMonth(year, month);
    }
}( jQuery ));
