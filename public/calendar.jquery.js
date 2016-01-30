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

    $.fn.calendar = function(year, month, minDate, meetings, inputName) {
        var calendar = this;

        var today = new Date;
        if (year == null) year = today.getFullYear();
        if (month == null) month = today.getMonth();
        if (minDate == null) minDate = today;

        calendar.year = year;
        calendar.month = month;
        calendar.minDate = minDate;
        calendar.meetings = meetings;
        calendar.selected = new Array();
        calendar.inputName = inputName;

        var prevBtn = $('<a class="btn btn-default calendar-prevbtn"><</a>');
        var monthLbl = $('<span class="calendar-monthlbl"></span>');
        var yearLbl = $('<span class="calendar-yearlbl"></span>');
        var nextBtn = $('<a class="btn btn-default calendar-nextbtn">></a>');

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
                    var v = curr.toISOString().slice(0, 10);
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

                    if (!(v in meetings)) {
                        n.addClass('calendar-date-filled');
                    }

                    n.on('click', function(e) {
                        e.preventDefault();

                        var n = $(this);
                        var v = $(this).data('date');
                        var i = $.inArray(v, calendar.selected);
                        var inputId = calendar.inputName + '-' + v;

                        if (i == -1) {
                            n.addClass('calendar-date-selected');
                            calendar.selected.push(v);

                            var input = $("<input type='hidden' name='"+ calendar.inputName +"[]'/>");
                            input.attr('id', inputId);
                            input.val(v);
                            calendar.append(input);

                        } else {
                            n.removeClass('calendar-date-selected');
                            calendar.selected.splice(i, 1 );
                            $("#"+inputId).remove();
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

        this.showMonth(year, month);
    }
}( jQuery ));
