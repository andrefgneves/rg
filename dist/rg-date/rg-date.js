riot.tag2('rg-date', '<div class="container"> <input type="text" class="field" onclick="{open}" value="{opts.date.date.format(format)}" readonly> <div class="calendar calendar--high" if="{opts.date.isvisible}"> <button class="calendar__control" onclick="{prevYear}">‹</button> <div class="calendar__header">{opts.date.date.format(yearFormat)}</div> <button class="calendar__control" onclick="{nextYear}">›</button> <button class="calendar__control" onclick="{prevMonth}">‹</button> <div class="calendar__header">{opts.date.date.format(monthFormat)}</div> <button class="calendar__control" onclick="{nextMonth}">›</button> <div class="calendar__day">Mo</div> <div class="calendar__day">Tu</div> <div class="calendar__day">We</div> <div class="calendar__day">Th</div> <div class="calendar__day">Fr</div> <div class="calendar__day">Sa</div> <div class="calendar__day">Su</div> <button class="calendar__date {\'calendar__date--selected\': day.selected, \'calendar__date--today\': day.today}" each="{day in startBuffer}" onclick="{select}">{day.date.format(dayFormat)}</button> <button class="calendar__date calendar__date--in-month {\'calendar__date--selected\': day.selected, \'calendar__date--today\': day.today}" each="{day in days}" onclick="{select}">{day.date.format(dayFormat)}</button> <button class="calendar__date {\'calendar__date--selected\': day.selected, \'calendar__date--today\': day.today}" each="{day in endBuffer}" onclick="{select}">{day.date.format(dayFormat)}</button> <button class="button button--block button--primary" onclick="{setToday}">Today</button> </div> </div>', 'rg-date .container,[riot-tag="rg-date"] .container { position: relative; display: inline-block; cursor: pointer; } rg-date .calendar,[riot-tag="rg-date"] .calendar { position: absolute; min-width: 400px; margin-top: .5em; left: 0; }', '', function(opts) {
var _this = this;

var toMoment = function toMoment(d) {
	if (!moment.isMoment(d)) d = moment(d);
	if (d.isValid()) return d;
	return moment();
};

var handleClickOutside = function handleClickOutside(e) {
	if (!_this.root.contains(e.target)) _this.close();
	_this.update();
};

var dayObj = function dayObj(dayDate) {
	var dateObj = dayDate || moment();

	return {
		date: dateObj,
		selected: opts.date.date.isSame(dayDate, 'day'),
		today: moment().isSame(dayDate, 'day')
	};
};

var buildCalendar = function buildCalendar() {
	_this.format = 'LL';
	_this.yearFormat = 'YYYY';
	_this.monthFormat = 'MMMM';
	_this.dayFormat = 'DD';

	_this.days = [];
	_this.startBuffer = [];
	_this.endBuffer = [];

	var begin = moment(opts.date.date).startOf('month');
	var daysInMonth = moment(opts.date.date).daysInMonth();
	var end = moment(opts.date.date).endOf('month');

	for (var i = begin.isoWeekday() - 1; i > 0; i -= 1) {
		var d = moment(begin).subtract(i, 'days');
		_this.startBuffer.push(dayObj(d));
	}

	for (var i = 0; i < daysInMonth; i++) {
		var current = moment(begin).add(i, 'days');
		_this.days.push(dayObj(current));
	}

	for (var i = end.isoWeekday() + 1; i <= 7; i++) {
		var d = moment(end).add(i - end.isoWeekday(), 'days');
		_this.endBuffer.push(dayObj(d));
	}
};

this.on('mount', function () {
	if (!opts.date) opts.date = { date: moment() };
	if (!opts.date.date) opts.date.date = moment();
	opts.date.date = toMoment(opts.date.date);

	_this.on('update', function () {
		buildCalendar();
	});
	document.addEventListener('click', handleClickOutside);
	_this.update();
});

this.on('unmount', function () {
	document.removeEventListener('click', handleClickOutside);
});

this.open = function () {
	opts.date.isvisible = true;
	_this.trigger('open');
};

this.close = function () {
	if (opts.date.isvisible) {
		opts.date.isvisible = false;
		_this.trigger('close');
	}
};

this.select = function (e) {
	opts.date.date = e.item.day.date;
	_this.trigger('select', opts.date.date);
};

this.setToday = function () {
	opts.date.date = moment();
	_this.trigger('select', opts.date.date);
};

this.prevYear = function () {
	opts.date.date = opts.date.date.subtract(1, 'year');
};

this.nextYear = function () {
	opts.date.date = opts.date.date.add(1, 'year');
};

this.prevMonth = function () {
	opts.date.date = opts.date.date.subtract(1, 'month');
};

this.nextMonth = function () {
	opts.date.date = opts.date.date.add(1, 'month');
};
}, '{ }');
