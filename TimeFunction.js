// DOM variables
let currentTimeSection;
let currentTimePMAMSection;
let currentTimeFullDateSection;
let viewingMonth_YearSection;

let isMonth_YearSelectorOpen = false;

let currentWatchingOnDifferentDate;

// Identifier
let FebNumberOfDays = 28;
let monthIdentify = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthDayIdentify = ["31", "" + FebNumberOfDays + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
let dayIdentify = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let dayIdentifyShortSunday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
let dayIdentifyShortMonday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
let TimeInstance;


let hour = 0; // hours    (0 -> 23)
let minus = 0; // minus    (0 -> 59)
let second = 0; // second   (0 -> 59)
let date = 0; // date     (1  ->  31)
let day = 0; // days     (0  ->  6)
let month = 0; // Month    (0  ->  11)
let year = 0; // Year

//Main section variables
let currentStoringMonth = 0;
let previousMonth;
let currentWatchingMonth = 0;
let nextMonth;

let currentStoringYear = 0;
let currentWatchingYear = 0;

//Toggling view mode
let isSettingOpen = false;
let isMondayFirst = false;
let isWeekendOn = false;

/***
 * Onload function of the web. All functionality will start from here.
 */
function loadCalender() {

	currentTimeSection = document.getElementById('currentTime');
	currentTimePMAMSection = document.getElementById('currentTimePMAM');
	currentTimeFullDateSection = document.getElementById('currentTimeFull');

	viewingMonth_YearSection = document.getElementById('yearMonth');

	TimeInstance = new Date();
	currentWatchingOnDifferentDate = false;
	setSettingMondayFromLocal();
	setSettingWeekendFromLocal();
	initCalender();
	toggleDate();

	window.addEventListener("mousemove", function (event) {
		trackAndPositioningLight(event)
	});

	setInterval(function () {
		currentTimeRefresher();
	}, 1000);
}

/**
 * Interval function to update time.
 */
function currentTimeRefresher() {

	let PMAM = "AM";
	let convertedTime = 12;

	TimeInstance = new Date();
	hour = TimeInstance.getHours(); // hours    (0 -> 23)
	minus = TimeInstance.getMinutes(); // minus    (0 -> 59)
	second = TimeInstance.getSeconds(); // second   (0 -> 59)

	date = TimeInstance.getDate(); // date             (1  ->  31)
	day = TimeInstance.getDay(); // days             (0  ->  6)
	month = TimeInstance.getMonth(); // Month            (0  ->  11)
	year = TimeInstance.getFullYear(); // Year
	FebNumberOfDays = isLeapYear(year) ? 29 : 28;

	//setup date format 12H
	if (hour > 12) {
		convertedTime = hour - 12;
		convertedTime = (convertedTime < 10) ? "0" + convertedTime : convertedTime;
		PMAM = "PM";
	} else {
		convertedTime = (hour < 10) ? "0" + hour : hour;
	}
	if (second < 10) second = "0" + second;
	if (minus < 10) minus = "0" + minus;

	//display time on first section
	currentTimeSection.innerHTML = convertedTime + ":" + minus + ":" + second;
	currentTimePMAMSection.innerHTML = PMAM;
	let dayIden;
	if (isMondayFirst) {
		dayIden = (day === 0) ? "" + dayIdentify[7] : "" + dayIdentify[day];
	} else dayIden = dayIdentify[day];
	currentTimeFullDateSection.innerHTML = dayIden + ", " + monthIdentify[month] + " " + date + ", " + year;

	//display section section
	showSectionViewingMonth_Year();

	if (month !== currentStoringMonth && year !== currentStoringYear) {
		setupViewingMonth(month);
		showSectionDisplayDayCalender(month, year);
		currentStoringMonth = month;
		currentStoringYear = year;
	}
}

/**
 * update the toggling section information
 */
function showSectionViewingMonth_Year() {
	if (!currentWatchingOnDifferentDate) {
		viewingMonth_YearSection.innerHTML = monthIdentify[month] + " " + year;
	} else {
		viewingMonth_YearSection.innerHTML = monthIdentify[currentWatchingMonth] + " " + currentWatchingYear;
	}
}

/**
 * function to setup current month with previous and next month.
 * @param currentMonth  current month to be setup
 */
function setupViewingMonth(currentMonth) {
	//Setup month
	currentWatchingMonth = currentMonth;
	if (currentWatchingMonth === 0) {
		previousMonth = 11;
		nextMonth = currentWatchingMonth + 1;
	} else if (currentWatchingMonth === 11) {
		previousMonth = currentWatchingMonth - 1;
		nextMonth = 0;
	} else {
		previousMonth = currentWatchingMonth - 1;
		nextMonth = currentWatchingMonth + 1;
	}
}

/**
 * Displaying the calender for viewing month and year. Can pass custom Month and Year to view specific month of year.
 * @param viewingMonth  Month to be displayed
 * @param viewingYear   Year of the displayed month
 */
function showSectionDisplayDayCalender(viewingMonth, viewingYear) {
	let displaySection = document.getElementById('displayNode');
	//erase old nodes if have
	let listOldNodeDay = displaySection.getElementsByClassName('dateblockCreated');
	let listOldNodeTitle = displaySection.getElementsByClassName('title');
	for (let i = 0; i < listOldNodeDay.length; i) {
		listOldNodeDay[i].parentNode.removeChild(listOldNodeDay[i]);
	}

	for (let i = 0; i < listOldNodeTitle.length; i) {
		listOldNodeTitle[i].parentNode.removeChild(listOldNodeTitle[i]);
	}

	let calenderSlot = 7 * 6;

	let firsDayViewingMonth = new Date(viewingYear, viewingMonth, 1).getDay();
	let saturdayCount = 6;
	let sundayCount = 0;
	let daysHasGoneInCalender;
	let titleBlockChosen = dayIdentifyShortSunday;

	if (isMondayFirst) {
		titleBlockChosen = dayIdentifyShortMonday;
		if (firsDayViewingMonth === 0) {
			daysHasGoneInCalender = 6;
		} else {
			daysHasGoneInCalender = firsDayViewingMonth - 1;
		}
	} else {
		daysHasGoneInCalender = firsDayViewingMonth;
	}
	let previousMonth = (viewingMonth === 0) ? 11 : viewingMonth - 1;
	let previousMonthDays = parseInt(monthDayIdentify[previousMonth]);
	let currentMonthDays = parseInt(monthDayIdentify[viewingMonth]);

	//	Create calender title block
	titleBlockChosen.forEach(value => {
		if (isWeekendOn) {
			if (value === 'Su' || value === 'Sa') {
				renderBlockCalender(value, displaySection, false, false, true, true);
			} else {
				renderBlockCalender(value, displaySection, false, false, true);
			}
		} else renderBlockCalender(value, displaySection, false, false, true);
	});
	if (daysHasGoneInCalender === 0) daysHasGoneInCalender = 7;

	//	create block for previous month
	for (let i = 0; i < daysHasGoneInCalender; i++) {
		let dateToPrint = previousMonthDays - (daysHasGoneInCalender - i - 1);
		let tempDateHoliday;
		if (previousMonth === 11) tempDateHoliday = new Date(viewingYear - 1, previousMonth, dateToPrint);
		else tempDateHoliday = new Date(viewingYear, previousMonth, dateToPrint);
		if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
			renderBlockCalender(dateToPrint, displaySection, false, true, false, true);
		else
			renderBlockCalender(dateToPrint, displaySection, false, true);
	}
	//create block for current month
	for (let i = 1; i < currentMonthDays + 1; i++) {
		let tempDateHoliday = new Date(viewingYear, viewingMonth, i);

		if (i === date && viewingMonth === currentStoringMonth && viewingYear === currentStoringYear) {
			if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
				renderBlockCalender(i, displaySection, true, false, false, true);
			else
				renderBlockCalender(i, displaySection, true, false);
		} else {
			if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
				renderBlockCalender(i, displaySection, false, false, false, true);
			else
				renderBlockCalender(i, displaySection, false, false);
		}
	}
	//	create block for next month
	for (let i = 1; i <= calenderSlot - (daysHasGoneInCalender + currentMonthDays); i++) {
		let tempDateHoliday;
		if (nextMonth === 0) tempDateHoliday = new Date(viewingYear + 1, nextMonth, i);
		else tempDateHoliday = new Date(viewingYear, nextMonth, i);
		if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount)) {
			renderBlockCalender(i, displaySection, false, true, false, true);
		} else renderBlockCalender(i, displaySection, false, true);
	}
}

/***
 * Create new node for date in display section
 * @param numberDate    number of date to be generated
 * @param parentNode    display node to append the node
 * @param isThisDay     identify if the node date is the current date.
 * @param notThisMonth  identify the date is not from the current month
 * @param titleBlock    identify whether the block render is the title or not. True for rendering a title block.
 * @param isHolidayDisplayOn    identify whether the holiday (Sunday and Saturday) should be imply. True for imply.
 */
function renderBlockCalender(numberDate, parentNode, isThisDay = false, notThisMonth = false, titleBlock = false, isHolidayDisplayOn = false) {
	let dateBlock = document.createElement("div");
	let classForNormalBlock = 'dateblockCreated';
	let classForTitleBlock = 'title';

	if (isHolidayDisplayOn) {
		classForNormalBlock += ' holiday';
		classForTitleBlock += ' holiday';
	}
	if (titleBlock) {
		dateBlock.className = classForTitleBlock;
		let spanSide = document.createElement("span");
		spanSide.innerHTML = numberDate;
		dateBlock.appendChild(spanSide);
	} else {
		if (notThisMonth) {
			dateBlock.className = classForNormalBlock + " notCurrent";
		} else {
			if (isThisDay) {
				dateBlock.className = classForNormalBlock + " currentDay";
			} else {
				dateBlock.className = classForNormalBlock;
			}
		}
		let spanSide = document.createElement("span");
		spanSide.innerHTML = numberDate;
		dateBlock.appendChild(spanSide);
	}
	//Add to calender
	parentNode.appendChild(dateBlock);
}

/**
 * Navigate the calender to chosen year.
 * @param yearSelected  the year that was selected
 */
function clickOnYear(yearSelected) {
	currentWatchingYear = yearSelected;
	currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
	button_Month_YearSelector_Click(undefined);
	showSectionViewingMonth_Year();
}

/**
 * Generated year on choosing panel. The list of year will be total 17 years, with 8 years before and 8 years later the chosen year.
 * @param viewYear  Current viewing year.
 */
function generatedYearList(viewYear) {
	//	display 17 years, 8 above and 8 below.
	let yearSectionBlock = document.getElementById("selectorParent-year");
	yearSectionBlock.onscroll = function () {
		onScrollUpdateYear();
	};
	if (viewYear !== currentWatchingYear) {
		let yearToBeRemovedAndCreated = Math.abs(viewYear - currentWatchingYear);
		for (let i = viewYear - 8; i < viewYear - 8 + yearToBeRemovedAndCreated; i++) {
			let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
			createdNode.onclick = function () {
				clickOnYear(i);
			};
			yearSectionBlock.insertBefore(createdNode, yearSectionBlock.getElementsByClassName('block')[0]);
		}
		for (let i = viewYear + 8; i > viewYear + 8 - yearToBeRemovedAndCreated; i--) {
			let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
			createdNode.onclick = function () {
				clickOnYear(i);
			};
			yearSectionBlock.appendChild(createdNode);
		}
	} else {
		for (let i = viewYear - 8; i < viewYear + 9; i++) {
			let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
			createdNode.onclick = function () {
				clickOnYear(i);
			};
			yearSectionBlock.appendChild(createdNode)
		}
		let currentView = yearSectionBlock.getElementsByClassName('block currentView')[0];
		currentView.scrollIntoView(true);
	}
}

/**
 * onScroll listener update year.
 * By default it will update the content once
 * 1 - top min 30
 * 2 - 50%
 */
function onScrollUpdateYear() {
	let displaySection = document.getElementById("selectorParent-year");
	let elementList = displaySection.getElementsByClassName('block');
	if (displaySection.scrollTop < 30) {
		if (elementList.length > 30) {
			destroyDOMbyClassNumber("selectorParent-year", 'block', 8, true);
		}
		let currentYear;
		try {
			currentYear = Number(elementList[0].innerHTML);
		} catch (e) {

		}
		for (let i = currentYear - 1; i > currentYear - 8; i--) {
			let createdNode = renderSelectorBlocks(i, currentYear, currentStoringYear);
			createdNode.onclick = function () {
				clickOnYear(i);
			};
			displaySection.insertBefore(createdNode, displaySection.getElementsByClassName('block')[0]);
		}
	} else if (displaySection.scrollTop > displaySection.scrollHeight - displaySection.scrollHeight * 0.44) {
		if (elementList.length > 30) {
			destroyDOMbyClassNumber("selectorParent-year", 'block', 8, false);
		}
		let currentYear;
		try {
			currentYear = Number(elementList[elementList.length - 1].innerHTML);
		} catch (e) {}
		for (let i = currentYear + 1; i < currentYear + 8; i++) {
			let createdNode = renderSelectorBlocks(i, currentYear, currentStoringYear);
			createdNode.onclick = function () {
				clickOnYear(i);
			};
			displaySection.appendChild(createdNode);
		}
	}
}

/**
 * Navigate the calender to chosen month.
 * @param monthSelected the month that selected.
 */
function clickOnMonth(monthSelected) {
	setupViewingMonth(monthSelected);
	currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
	button_Month_YearSelector_Click(undefined);
	showSectionViewingMonth_Year();
}

/**
 * Generated month on choosing panel.
 */
function generatedMonthList() {
	let monthSectionBlock = document.getElementById("selectorParent-month");
	let listCreatedNode = [];
	for (let i = 0; i < 12; i++) {
		let nodeGenerated = renderSelectorBlocks(monthIdentify[i], monthIdentify[currentWatchingMonth], monthIdentify[currentStoringMonth], currentWatchingYear, currentStoringYear);
		nodeGenerated.onclick = function () {
			clickOnMonth(i);
		};
		listCreatedNode.push(nodeGenerated);
	}

	for (let i = 0; i < listCreatedNode.length; i++) {
		monthSectionBlock.appendChild(listCreatedNode[i]);
	}

	if (currentWatchingMonth < 4 || currentWatchingMonth > 6) monthSectionBlock.getElementsByClassName('block')[currentWatchingMonth].scrollIntoView(true);
}

/**
 * Generate choosing block on choosing panel
 * @param content   Content to display on each block
 * @param matchContent  To add currentView CSS class, identify the current viewing year/month.
 * @param globalContentMatch    To add now CSS class, identify the current year/month.
 * @param content2
 * @param globalContentMatch2
 * @returns {HTMLElement}   The created block HTML node.
 */
function renderSelectorBlocks(content, matchContent, globalContentMatch, content2 = null, globalContentMatch2 = null) {
	let block = document.createElement('div');
	block.innerHTML = content;
	let classToAssign = "block";
	if (content === matchContent) {
		classToAssign += " currentView";
	}
	if (content === globalContentMatch) {
		if (content2 === globalContentMatch2 && globalContentMatch2 !== undefined && content2 !== undefined) classToAssign += " now";
		else if (globalContentMatch2 === undefined && content2 === undefined) classToAssign += ' now';
	}
	block.className = classToAssign;
	return block;
}

/**
 * go to the next month
 */
function clickNextMonth() {
	let diffYear = 0;
	if (nextMonth === 0) diffYear = 1;
	setupViewingMonth(nextMonth);

	currentWatchingYear = currentWatchingYear + diffYear;
	currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
	button_Month_YearSelector_Click(undefined);
	showSectionViewingMonth_Year();
}

/**
 * go to previous month
 */
function clickPrevMonth() {
	let diffYear = 0;
	if (previousMonth === 11) diffYear = -1;
	setupViewingMonth(previousMonth);

	currentWatchingYear = currentWatchingYear + diffYear;
	currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
	button_Month_YearSelector_Click(undefined);
	showSectionViewingMonth_Year();
}

/**
 * Toggle the choosing panel (month and year choosing)
 */
function toggleDate() {
	window.addEventListener('click', function (event) {
		button_Month_YearSelector_Click(event);
		toggleMenu(event);
	});
}

/**
 * Toggle on selection panel
 * @param event event clicking (for event.target). Use 'undefined' to hide the panel.
 */
function button_Month_YearSelector_Click(event) {
	let clickedInsideToggle = (event !== undefined) ? document.getElementById('yearMonth').contains(event.target) : true;
	if (clickedInsideToggle) {
		isMonth_YearSelectorOpen = !isMonth_YearSelectorOpen;
	} else {
		let clickedInsideContent = document.getElementById('monthSelector').contains(event.target) || document.getElementById('yearSelector').contains(event.target);
		if (!clickedInsideContent) {
			isMonth_YearSelectorOpen = false;
		}
	}

	if (isMonth_YearSelectorOpen) {
		generatedMonthList();
		generatedYearList(currentWatchingYear);
		animationNodeSide(true);
	} else {
		animationNodeSide();
		destroyDOMbyClass('selectorParent-year', 'block');
		destroyDOMbyClass('selectorParent-month', 'block');
	}
}

/**
 * Toggle to open setting menu
 */
function toggleMenu(event) {
	let clickedInsideSetting = (event !== undefined) ? document.getElementById('settingBlock').contains(event.target) : false;

	if (!clickedInsideSetting) {
		try {
			let clickedInsideButtonSetting = document.getElementById('buttonSetting').contains(event.target);
			if (clickedInsideButtonSetting) {
				if (isSettingOpen) {
					animationToggleMenu();
				} else {
					animationToggleMenu(true);
				}
			} else {
				animationToggleMenu();
			}
		} catch (e) {

		}
	}
}

/**
 * Animation of setting menu
 * @param on    True for from hide to visible.
 */
function animationToggleMenu(on = false) {
	let menu = document.getElementById('settingBlock');
	if (on) {
		menu.className = 'settingBlock isHiding';
		setTimeout(function () {
			menu.className = 'settingBlock';
		}, 400);
		isSettingOpen = true;
	} else {
		menu.className = 'settingBlock isHiding';
		setTimeout(function () {
			menu.className = 'settingBlock isHiding hiden';
		}, 400);
		isSettingOpen = false;
	}
}

/**
 * Toggle button view to place monday as first day of the week or sunday.
 */
function toggleViewMode() {
	let button = document.getElementById('switchMondayDOM');
	if (isMondayFirst) {
		button.className = 'switch-div';
		setLocalSettingMonday(false);
	} else {
		button.className = 'switch-div activated';
		setLocalSettingMonday(true);
	}
	isMondayFirst = !isMondayFirst;
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
}

/**
 * Toggle button view to imply the weekend days (saturday and sunday).
 */
function toggleWeekends() {
	let button = document.getElementById('switchWeekendDOM');
	if (isWeekendOn) {
		button.className = 'switch-div';
		setLocalSettingWeekend(false);
	} else {
		button.className = 'switch-div activated';
		setLocalSettingWeekend(true);
	}
	isWeekendOn = !isWeekendOn;
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
}

/**
 * First init the calender to create current month calender.
 */
function initCalender() {

	currentWatchingYear = TimeInstance.getFullYear();
	currentStoringYear = currentWatchingYear;
	year = currentStoringYear;

	currentStoringMonth = TimeInstance.getMonth();
	currentWatchingMonth = currentStoringMonth;
	month = currentStoringMonth;
	setupViewingMonth(currentWatchingMonth);

	day = TimeInstance.getDay();
	date = TimeInstance.getDate();

	currentTimeRefresher();
	showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
}

/**
 * Identify whether the setting on local machine is set to monday as the first day of the week or not. If browser doesn't support localStorage features, it will be automatically return as 'false' value.
 * @returns {boolean}   True for set monday as the first day of the week.
 */
function checkLocalSettingMonday() {
	let result = localStorage.getItem('MondaySetting');
	return (result !== null && result !== undefined && result !== "false");
}

/**
 * Identify whether the setting on local machine is set to imply the weekend days (saturday and sunday) or not. If browser doesn't support localStorage features, it will be automatically return as 'false' value.
 * @returns {boolean}   True for set monday as the first day of the week.
 */
function checkLocalSettingWeekend() {
	let result = localStorage.getItem('WeekendDisplay');
	return (result !== null && result !== undefined && result !== "false");
}

/**
 * Set the current setting of monday as the first day of week to the localStorage
 * @param isMondayTheFirst  true for storing the setting as monday as the first day of the week.
 */
function setLocalSettingMonday(isMondayTheFirst = false) {
	if (isMondayTheFirst) {
		localStorage.setItem('MondaySetting', 'true');
	} else {
		localStorage.setItem('MondaySetting', 'false');
	}
}

/**
 * set the setting of imply the weekends (saturday and sunday) to the local machine using localStorage.
 * @param show  the setting to be stored. True for imply option on.
 */
function setLocalSettingWeekend(show = false) {
	if (show) {
		localStorage.setItem('WeekendDisplay', 'true');
	} else {
		localStorage.setItem('WeekendDisplay', 'false');
	}
}

/**
 * Set the calender setting (toggle the monday as the first day of the week) to the setting from the local machine. It will be automatically set to de-activate if not found the setting.
 */
function setSettingMondayFromLocal() {
	isMondayFirst = checkLocalSettingMonday();
	let button = document.getElementById('switchMondayDOM');
	if (isMondayFirst) {
		button.className = 'switch-div activated';
	} else {
		button.className = 'switch-div';
	}
}

/**
 * Set the calender setting (imply the weekends, saturday and sunday for specific) to the setting from the local machine. It will be automatically set to de-activate if not found the setting.
 */
function setSettingWeekendFromLocal() {
	isWeekendOn = checkLocalSettingWeekend();
	let button = document.getElementById('switchWeekendDOM');
	if (isWeekendOn) {
		button.className = 'switch-div activated';
	} else {
		button.className = 'switch-div';
	}
}

/**
 * Function that will use the mouse event to calculate the relative of the light background effect (fluent effect)
 * @param e mouse event when moving or clicking...
 */
function trackAndPositioningLight(e) {
	let wScreen = document.documentElement.clientWidth;
	let hScreen = document.documentElement.clientHeight;

	let calender = document.getElementById('calenderBackground');
	let wCalender = calender.clientWidth;
	let hCalender = calender.clientHeight;

	let postMousX = e.clientX;
	let postMousY = e.clientY;

	let postX = postMousX - (wScreen - wCalender) / 2 + .5 - 25;
	let postY = postMousY - (hScreen - hCalender) / 2 + 16 - 25;

	let light = document.getElementById('lightEffect');
	light.style = 'left: ' + postX + 'px !important; top: ' + postY + 'px !important;';
}

/**
 * Animation on selection node (from left to right, visible on left side)
 * @param on    identify the condition of the DOM, true for 'is showing' and false for in hiding stage.
 */
function animationNodeSide(on = false) {
	let node1 = document.getElementById('monthSelector');
	let node2 = document.getElementById('yearSelector');
	let classToAssign = "sideOption hideSide";
	if (on) classToAssign = "sideOption";
	node1.className = classToAssign + " monthSelector";
	node2.className = classToAssign + " yearSelector";
}

/**
 * Check whether the checking year is a leap year or not.
 * @param yr    year to check
 * @returns {boolean}   True for a leap year
 */
function isLeapYear(yr) {
	return !((yr % 4) || (!(yr % 100) && (yr % 400)));
}

/**
 * Destroy the children DOM from ots parent by class
 * @param idParent  id of the parent
 * @param classDestroy  id of the one that need to be destroyed
 */
function destroyDOMbyClass(idParent, classDestroy) {
	let parentDom = document.getElementById(idParent);
	let listTobeDestroyed = parentDom.getElementsByClassName(classDestroy);
	for (let i = 0; i < listTobeDestroyed.length; i) {
		listTobeDestroyed[i].parentNode.removeChild(listTobeDestroyed[i]);
	}
}

function destroyDOMbyClassNumber(idParent, classDestroy, number, end = false) {
	let parentDom = document.getElementById(idParent);
	let listTobeDestroyed = parentDom.getElementsByClassName(classDestroy);
	if (number >= listTobeDestroyed.length) {
		destroyDOMbyClass(idParent, classDestroy);
		return;
	}
	if (end) {
		for (let i = 0; i < number; i++) {
			listTobeDestroyed[i].parentNode.removeChild(listTobeDestroyed[listTobeDestroyed.length - 1]);
		}
	} else {
		for (let i = 0; i < number; i++) {
			listTobeDestroyed[i].parentNode.removeChild(listTobeDestroyed[0]);
		}
	}

}

/**
 * Destroy the child DOM from its parent by ID
 * @param idParent  id of the parent
 * @param idDestroy id of the one that need to be destroyed!!!!
 */
function destroyDOMbyID(idParent, idDestroy) {
	let parentDom = document.getElementById(idParent);
	let tobeDestroyed = parentDom.getElementById(idDestroy);
	tobeDestroyed.parentNode.removeChild(tobeDestroyed);
}

/**
 * Copy text from selected node (via ID). Not supported for < IE 8
 * Still in testing stage
 * @param idNode    ID of the node to get content.
 */
// function copyToClipboard(idNode) {
// 	let nodeToCopy = document.getElementById("" + idNode + "");
//
// 	copyText.select();
// 	document.execCommand("copy");
// }