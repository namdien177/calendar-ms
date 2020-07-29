/**
 * All of the field should be filled in order to have the Calender fully functional.
 * @param {String} currentTimeSection_id [Optional] The ID section where to display current time
 * @param {String} currentTimePMAMSection_id [Optional] The ID section where to display the current state of day
 * @param {String} currentTimeFullDateSection_id [Optional] The ID section where to display the current full datetime
 * @param {String} viewingMonth_YearSection_id [Optional] The ID section where to display the current viewing month and year (can be different to the now current time)
 * @param {String} displayDayCalender_id [Optional] The ID section where to display the days of a month.
 * @param yearSelectorSection_id
 * @param monthSelectorSection_id
 */
let Calendar = function (currentTimeSection_id = undefined, currentTimePMAMSection_id = undefined, currentTimeFullDateSection_id = undefined, viewingMonth_YearSection_id = undefined,
    displayDayCalender_id = undefined, yearSelectorSection_id = undefined, monthSelectorSection_id = undefined) {

    /**
     * Time display section
     * currentTimeSection = Section that display the time: hh:mm:ss 
     * currentTimePMAMSection = Section that display the state of the day: am/pm
     * currentTimeFullDateSection = Section display full date of the current day: day, month date year
     * viewingMonth_YearSection = Section display only the current viewing month of a year: month year.
     * displayDayCalenderSection = Section display the date of a month of viewing year.
     */
    let currentTimeSection = undefined;
    let currentTimePMAMSection = undefined;
    let currentTimeFullDateSection = undefined;
    let viewingMonth_YearSection = undefined;
    let displayDayCalenderSection = undefined;

    let yearSelectorSection = undefined;
    let monthSelectorSection = undefined;

    /**
     * Global variable for storing current time.
     */
    let stateDay = "AM";
    let hour = 0; // hours    (0 -> 23)
    let minus = 0; // minus    (0 -> 59)
    let second = 0; // second   (0 -> 59)
    let date = 0; // date     (1  ->  31)
    let day = 0; // days     (0  ->  6)
    let month = 0; // Month    (0  ->  11)
    let year = 0; // Year

    /**
     * Month - Year store variables.
     */
    let currentStoringMonth = undefined;

    let previousMonth = 0;
    let currentWatchingMonth = undefined;
    let nextMonth = 0;

    let currentStoringYear = undefined;
    let currentWatchingYear = undefined;

    let choosingFirstDay = undefined;
    let choosingSecondDay = undefined;

    /**
     * Identifiers arrays
     */
    let FebNumberOfDays = 28;
    let monthIdentify = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthDayIdentify = ["31", "" + FebNumberOfDays + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
    let dayIdentify = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let dayIdentifyShortSunday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let dayIdentifyShortMonday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    let holiday = [];

    /**
     * Boolean indicate the popup windows to modify/change setting.
     */
    let isMonth_YearSelectorOpen = false;
    let isSettingOpen = false;

    /**
     * Boolean indicate watching other date than now.
     */
    let currentWatchingOnDifferentDate = false;

    /**
     * User setting
     */
    let isMondayFirst = false;
    let isMondayFirst_localStorage = 'Monday_Setting';
    let button_SettingMonday = undefined;
    let button_SettingMonday_ClassName = "";
    let button_SettingMonday_ClassName_Activate = 'activated';

    let isWeekendOn = false;
    let isWeekendOn_localStorage = 'Weekends_Setting';
    let button_SettingWeekends = undefined;
    let button_SettingWeekends_ClassName = "";
    let button_SettingWeekends_ClassName_Activate = "activated";

    let timeInstance = new Date();

    this.install = function () {
        this.setSectionCurrentTime(currentTimeSection_id);
        this.setSectionCurrentTimePMAM(currentTimePMAMSection_id);
        this.setSectionCurrentTimeFullDate(currentTimeFullDateSection_id);
        this.setSectionViewingMonth_Year(viewingMonth_YearSection_id);
        this.setSectionDisplayDayCalender(displayDayCalender_id);
        this.setSectionMonthSelector(monthSelectorSection_id);
        this.setSectionYearSelector(yearSelectorSection_id);
    };

    /**
     * Use run() to start the calender. Use stop() to stop the calender.
     */
    let run = undefined;
    this.run = function () {
        this.install();
        initCalender();
        run = setInterval(timeRefresh, 1000);
    };

    /**
     * Use run() to start the calender. Use stop() to stop the calender.
     */
    this.stop = function () {
        if (run !== undefined) clearInterval(run);
        run = undefined;
    };

    /**
     * set the section to display current time (hh:mm:ss)
     * @param {String} idSection of the section
     */
    this.setSectionCurrentTime = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            currentTimeSection = document.getElementById(idSection);
        }
    };

    /**
     * set the section to display current state of a day (AM/PM)
     * @param {String} idSection of the section
     */
    this.setSectionCurrentTimePMAM = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            currentTimePMAMSection = document.getElementById(idSection);
        }
    };

    /**
     * set the section to display current full datetime (day, month date year)
     * @param {String} idSection of the section
     */
    this.setSectionCurrentTimeFullDate = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            currentTimeFullDateSection = document.getElementById(idSection);
        }
    };

    /**
     * set the section to display viewing time (month year)
     * @param {String} idSection of the section
     */
    this.setSectionViewingMonth_Year = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            viewingMonth_YearSection = document.getElementById(idSection);
        }
    };

    /**
     * set the section to display day of a month in calender.
     * @param {String} idSection of the section
     */
    this.setSectionDisplayDayCalender = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            displayDayCalenderSection = document.getElementById(idSection);
        }
    };

    this.setSectionMonthSelector = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            monthSelectorSection = document.getElementById(idSection);
        }
    };

    this.setSectionYearSelector = function (idSection = undefined) {
        if (idSection !== undefined && idSection !== null) {
            yearSelectorSection = document.getElementById(idSection);
        }
    };

    //Functions to call

    let initCalender = function () {
        year = currentStoringYear = currentWatchingYear = timeInstance.getFullYear();
        month = currentStoringMonth = currentWatchingMonth = timeInstance.getMonth();

        day = timeInstance.getDay();
        date = timeInstance.getDate();

        setupViewingMonth(currentWatchingMonth);

        local_GetSettingMonday();
        local_GetSettingWeekends();
        timeRefresh();
        showSectionViewingMonth_Year();
        showSectionDisplayDayCalender(currentStoringMonth, currentStoringYear);
    };

    function timeRefresh() {
        stateDay = "AM";
        let convertedTime = 12;

        timeInstance = new Date();
        hour = timeInstance.getHours(); // hours    (0 -> 23)
        minus = timeInstance.getMinutes(); // minus    (0 -> 59)
        second = timeInstance.getSeconds(); // second   (0 -> 59)

        date = timeInstance.getDate(); // date             (1  ->  31)
        day = timeInstance.getDay(); // days             (0  ->  6)
        month = timeInstance.getMonth(); // Month            (0  ->  11)
        year = timeInstance.getFullYear(); // Year
        FebNumberOfDays = isLeapYear(year) ? 29 : 28;

        //setup date format 12H
        if (hour > 12) {
            convertedTime = hour - 12;
            hour = (convertedTime < 10) ? "0" + convertedTime : convertedTime;
            stateDay = "PM";
        } else {
            hour = (hour < 10) ? "0" + hour : hour;
        }
        if (second < 10) second = "0" + second;
        if (minus < 10) minus = "0" + minus;

        //    Display section data (if able)
        showCurrentTimeSection();
        showCurrentStateDaySection();
        showCurrentFullDateTimeSection();

        if (month !== currentStoringMonth || year !== currentStoringYear) {
            setupViewingMonth(month);
            showSectionDisplayDayCalender(month, year);
            currentStoringMonth = month;
            currentStoringYear = year;
        }
    }

    this.showCurrentTimeSection = function () {
        showCurrentTimeSection();
    };

    function showCurrentTimeSection() {
        if (currentTimeSection !== undefined) currentTimeSection.innerHTML = hour + ":" + minus + ":" + second;
    }

    this.showCurrentStateDaySection = function () {
        showCurrentStateDaySection();
    };

    function showCurrentStateDaySection() {
        if (currentTimePMAMSection !== undefined) currentTimePMAMSection.innerHTML = stateDay;
    }

    this.showCurrentFullDateTimeSection = function () {
        showCurrentFullDateTimeSection();
    };

    function showCurrentFullDateTimeSection() {
        let dayName;
        if (isMondayFirst) {
            dayName = (day === 0) ? "" + dayIdentify[7] : "" + dayIdentify[day];
        } else dayName = dayIdentify[day];
        if (currentTimeFullDateSection !== undefined) currentTimeFullDateSection.innerHTML = dayName + ", " + monthIdentify[month] + " " + date + ", " + year;
    }

    this.showSectionViewingMonth_Year = function () {
        showSectionViewingMonth_Year();
    };

    function showSectionViewingMonth_Year() {
        if (viewingMonth_YearSection !== undefined) {
            if (!currentWatchingOnDifferentDate) {
                viewingMonth_YearSection.innerHTML = monthIdentify[month] + " " + year;
            } else {
                viewingMonth_YearSection.innerHTML = monthIdentify[currentWatchingMonth] + " " + currentWatchingYear;
            }
        }
    }

    this.showSectionDisplayDayCalender = function (viewingMonth, viewingYear) {
        showSectionDisplayDayCalender(viewingMonth, viewingYear);
    };

    function showSectionDisplayDayCalender(viewingMonth, viewingYear) {
        if (displayDayCalenderSection !== undefined) {
            //erase old nodes if have
            let listOldNodeDay = displayDayCalenderSection.getElementsByClassName('block-of-date');
            let listOldNodeTitle = displayDayCalenderSection.getElementsByClassName('block-of-title');
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
                        renderBlockCalender(value, displayDayCalenderSection, false, false, true, true);
                    } else {
                        renderBlockCalender(value, displayDayCalenderSection, false, false, true);
                    }
                } else renderBlockCalender(value, displayDayCalenderSection, false, false, true);
            });
            if (daysHasGoneInCalender === 0) daysHasGoneInCalender = 7;

            //	create block for previous month
            for (let i = 0; i < daysHasGoneInCalender; i++) {
                let dateToPrint = previousMonthDays - (daysHasGoneInCalender - i - 1);
                let tempDateHoliday;
                if (previousMonth === 11) tempDateHoliday = new Date(viewingYear - 1, previousMonth, dateToPrint);
                else tempDateHoliday = new Date(viewingYear, previousMonth, dateToPrint);
                if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
                    renderBlockCalender(dateToPrint, displayDayCalenderSection, false, true, false, true, true);
                else
                    renderBlockCalender(dateToPrint, displayDayCalenderSection, false, true, false, false, true);
            }
            //create block for current month
            for (let i = 1; i < currentMonthDays + 1; i++) {
                let tempDateHoliday = new Date(viewingYear, viewingMonth, i);

                if (i === date && viewingMonth === currentStoringMonth && viewingYear === currentStoringYear) {
                    if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
                        renderBlockCalender(i, displayDayCalenderSection, true, false, false, true);
                    else
                        renderBlockCalender(i, displayDayCalenderSection, true, false);
                } else {
                    if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount))
                        renderBlockCalender(i, displayDayCalenderSection, false, false, false, true);
                    else
                        renderBlockCalender(i, displayDayCalenderSection, false, false);
                }
            }
            //	create block for next month
            for (let i = 1; i <= calenderSlot - (daysHasGoneInCalender + currentMonthDays); i++) {
                let tempDateHoliday;
                if (nextMonth === 0) tempDateHoliday = new Date(viewingYear + 1, nextMonth, i);
                else tempDateHoliday = new Date(viewingYear, nextMonth, i);
                if (isWeekendOn && (tempDateHoliday.getDay() === saturdayCount || tempDateHoliday.getDay() === sundayCount)) {
                    renderBlockCalender(i, displayDayCalenderSection, false, true, false, true, false, true);
                } else renderBlockCalender(i, displayDayCalenderSection, false, true, false, false, false, true);
            }
        }
    }

    function renderBlockCalender(numberDate, parentNode, isThisDay = false, notThisMonth = false, titleBlock = false,
                                 isWeekendsDisplayOn = false, previous = false, next = false) {
        let dateBlock = document.createElement("div");
        let classForNormalBlock = 'block-of-date';
        let classForTitleBlock = 'block-of-title';

        if (!titleBlock) {
	        holiday.every((day, index) => {
		        if (numberDate === day.date && (day.year === null || day.year === undefined)) {
			        if (notThisMonth) {
				        if (previousMonth === day.month && previous && !next) {
					        classForNormalBlock += ' holiday';
					        return false;
				        } else if (nextMonth === day.month && !previous && next) {
					        classForNormalBlock += ' holiday';
					        return false;
				        }
			        } else {
				        if (currentWatchingMonth === day.month && !previous && !next) {
					        classForNormalBlock += ' holiday';
					        return false;
				        }
			        }
		        } else {
			        if (numberDate === day.date && day.year === currentWatchingYear) {
				        if (notThisMonth) {
					        if (previousMonth === day.month && previous && !next) {
						        classForNormalBlock += ' holiday';
						        return false;
					        } else if (nextMonth === day.month && !previous && next) {
						        classForNormalBlock += ' holiday';
						        return false;
					        }
				        } else {
					        if (currentWatchingMonth === day.month && !previous && !next) {
						        classForNormalBlock += ' holiday';
						        return false;
					        }
				        }
			        }
		        }
		        return true;
	        });
        }

        if (isWeekendsDisplayOn) {
            classForNormalBlock += ' weekends';
            classForTitleBlock += ' weekends';
        }
        if (titleBlock) {
            dateBlock.className = classForTitleBlock;
            let spanSide = document.createElement("span");
            spanSide.innerHTML = numberDate;
            dateBlock.appendChild(spanSide);
        } else {
            if (notThisMonth) {
	            classForNormalBlock += " not-this-month";
                dateBlock.className = classForNormalBlock;
            } else {
                if (isThisDay) {
	                classForNormalBlock += " current-day";
                    dateBlock.className = classForNormalBlock + " current-day";
                } else {
                    dateBlock.className = classForNormalBlock;
                }
            }
            let spanSide = document.createElement("span");
            spanSide.innerHTML = numberDate;
            dateBlock.appendChild(spanSide);
        }

        if (!titleBlock) {
	        let getMonth = currentWatchingMonth;
	        let getYear = currentWatchingYear;
	        if (notThisMonth) {
		        if (previous && !next) {
			        getMonth = (currentWatchingMonth === 0) ? 11: currentWatchingMonth - 1;
			        getYear = (currentWatchingMonth === 0) ? currentWatchingYear -1 : currentWatchingYear;
		        }
                if (!previous && next) {
                    getMonth = (currentWatchingMonth === 11) ? 0 : currentWatchingMonth + 1;
                    getYear = (currentWatchingMonth === 11) ? currentWatchingYear + 1 : currentWatchingYear;
                }
            }

	        //checking if the date is selected or not
	        if (choosingFirstDay !== undefined && choosingSecondDay !== undefined) {
		        let smallestDate = Date.UTC(choosingFirstDay.year,choosingFirstDay.month,choosingFirstDay.date);
		        let biggestDate = Date.UTC(choosingSecondDay.year,choosingSecondDay.month, choosingSecondDay.date);
		        let comp = Date.UTC(getYear, getMonth, numberDate);
		        if (comp - smallestDate >= 0 && biggestDate - comp >=0 )
			        dateBlock.className = classForNormalBlock + " selected-block";
	        }else if (choosingFirstDay !== undefined && choosingSecondDay === undefined) {
	            if (numberDate === choosingFirstDay.date && getYear === choosingFirstDay.year && choosingFirstDay.month === getMonth)
		            dateBlock.className = classForNormalBlock + " selected-block";
            }
	        dateBlock.onclick = function () {
		        clickOnDay(numberDate, getMonth, getYear);
	        }
        }
        //Add to calender
        parentNode.appendChild(dateBlock);
    }


    function button_Month_YearSelector_Click(event = undefined) {
        if (event !== undefined) {
            let clickedInsideToggle = (yearSelectorSection.parentNode.contains(event.target) || monthSelectorSection.parentNode.contains(event.target));
            if (clickedInsideToggle) {
                isMonth_YearSelectorOpen = true;
            } else {
                if (viewingMonth_YearSection.contains(event.target)) {
                    isMonth_YearSelectorOpen = !isMonth_YearSelectorOpen;
                } else {
                    isMonth_YearSelectorOpen = false;
                }
            }
        } else {
            isMonth_YearSelectorOpen = false;
        }

        if (isMonth_YearSelectorOpen) {
            renderMonthListSelector();
            renderYearListSelector(currentWatchingYear);
        } else {
            if (yearSelectorSection !== undefined) destroyDOMbyClass(yearSelectorSection.id, 'block');
            if (monthSelectorSection !== undefined) destroyDOMbyClass(monthSelectorSection.id, 'block');
        }
    }

    /**
     * Navigate the calender to chosen year.
     * @param yearSelected  the year that was selected
     */
    function viewThisYearCalender(yearSelected) {
        currentWatchingYear = yearSelected;
        currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
        button_Month_YearSelector_Click();
        showSectionViewingMonth_Year();
    }

    /**
     * scroll listener on year selector.
     */
    function onScrollUpdateYear() {
        if (yearSelectorSection !== null) {
            let elementList = yearSelectorSection.getElementsByClassName('block');
            if (yearSelectorSection.scrollTop < 30) {
                if (elementList.length > 30) {
                    destroyDOMbyClassNumber(yearSelectorSection.className, 'block', 8, true);
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
                    yearSelectorSection.insertBefore(createdNode, yearSelectorSection.getElementsByClassName('block')[0]);
                }
            } else if (yearSelectorSection.scrollTop > yearSelectorSection.scrollHeight - yearSelectorSection.scrollHeight * 0.44) {
                if (elementList.length > 30) {
                    destroyDOMbyClassNumber(yearSelectorSection.className, 'block', 8, false);
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
                    yearSelectorSection.appendChild(createdNode);
                }
            }
        }
    }

    /**
     * Render the section of choosing year. By default it will generate a list of 17 years with 8 years before and 8 years after the viewing year.
     * @param viewYear  The year that is viewing
     */
    function renderYearListSelector(viewYear) {
        if (yearSelectorSection !== undefined) {
            //	display 17 years, 8 above and 8 below.
            yearSelectorSection.onscroll = function () {
                onScrollUpdateYear();
            };
            if (viewYear !== currentWatchingYear) {
                let yearToBeRemovedAndCreated = Math.abs(viewYear - currentWatchingYear);
                for (let i = viewYear - 8; i < viewYear - 8 + yearToBeRemovedAndCreated; i++) {
                    let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
                    createdNode.onclick = function () {
                        viewThisYearCalender(i);
                    };
                    yearSelectorSection.insertBefore(createdNode, yearSelectorSection.getElementsByClassName(yearSelectorSection + '-block')[0]);
                }
                for (let i = viewYear + 8; i > viewYear + 8 - yearToBeRemovedAndCreated; i--) {
                    let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
                    createdNode.onclick = function () {
                        viewThisYearCalender(i);
                    };
                    yearSelectorSection.appendChild(createdNode);
                }
            } else {
                for (let i = viewYear - 8; i < viewYear + 9; i++) {
                    let createdNode = renderSelectorBlocks(i, viewYear, currentStoringYear);
                    createdNode.onclick = function () {
                        viewThisYearCalender(i);
                    };
                    yearSelectorSection.appendChild(createdNode)
                }
                let currentView = yearSelectorSection.getElementsByClassName(yearSelectorSection + '-block current')[0];
                currentView.scrollIntoView(true);
            }
        }
    }

    /**
     * click function on each month in selection panel.
     * @param monthSelected month to switch the calender to.
     */
    function viewThisMonthCalender(monthSelected) {
        setupViewingMonth(monthSelected);
        currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
        button_Month_YearSelector_Click();
        showSectionViewingMonth_Year();
    }

    /**
     * Rendering the section of choosing month
     */
    function renderMonthListSelector() {
        let listCreatedNode = [];
        for (let i = 0; i < 12; i++) {
            let nodeGenerated = renderSelectorBlocks(monthIdentify[i], monthIdentify[currentWatchingMonth], monthIdentify[currentStoringMonth], currentWatchingYear, currentStoringYear);
            nodeGenerated.onclick = function () {
                viewThisMonthCalender(i);
            };
            listCreatedNode.push(nodeGenerated);
        }

        for (let i = 0; i < listCreatedNode.length; i++) {
            monthSelectorSection.appendChild(listCreatedNode[i]);
        }

        if (currentWatchingMonth < 4 || currentWatchingMonth > 6) monthSelectorSection.getElementsByClassName('block')[currentWatchingMonth].scrollIntoView(true);
    }

    /**
     * Render the selection on selector (month/year).
     * The default class: <div class="block"> ... </div>
     * the default class for block that is viewing: <div class="block current"> ... </div>
     * the default class for block that is the current date: <div class="block now"> ... </div>
     * @param yearOrMonth               rendering content inside (month / year)
     * @param viewingYearOrMonth        currently matching viewing content.
     * @param storingYearOrMonth        matched the current date/time
     * @param viewingYear               The year that is currently viewing. Should be needed in rendering month to identify if the month in that year is the current month (same month and same year)
     * @param storingYear               The year that is stored in the object. Should be needed when want to mark the current month block in the current year.
     * @returns {HTMLElement}           The created HTMLElement node with content and classes.
     */
    function renderSelectorBlocks(yearOrMonth, viewingYearOrMonth, storingYearOrMonth, viewingYear = null, storingYear = null) {
        let block = document.createElement('div');
        block.innerHTML = yearOrMonth;
        let classToAssign = "block";
        if (yearOrMonth === viewingYearOrMonth) {
            classToAssign += " current";
        }
        if (yearOrMonth === storingYearOrMonth) {
            if (viewingYear === storingYear && storingYear !== undefined && viewingYear !== undefined) classToAssign += " now";
            else if (storingYear === undefined && viewingYear === undefined) classToAssign += ' now';
        }
        block.className = classToAssign;
        return block;
    }

    /**
     * go to the next month
     */
    this.clickNextMonth = function () {
        clickNextMonth();
    };

    /**
     * go to current date
     */
    this.clickReturnCurrentDate = function () {
        clickReturnCurrentDate();
    };

    /**
     * go to previous month
     */
    this.clickPreviousMonth = function () {
        clickPreviousMonth();
    };

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
        button_Month_YearSelector_Click();
        showSectionViewingMonth_Year();
    }

    /**
     * go to current date
     */
    function clickReturnCurrentDate() {
        setupViewingMonth(currentStoringMonth);
        currentWatchingOnDifferentDate = false;
        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
        button_Month_YearSelector_Click();
        showSectionViewingMonth_Year();
    }

    /**
     * go to previous month
     */
    function clickPreviousMonth() {
        let diffYear = 0;
        if (previousMonth === 11) diffYear = -1;
        setupViewingMonth(previousMonth);

        currentWatchingYear = currentWatchingYear + diffYear;
        currentWatchingOnDifferentDate = (currentWatchingMonth !== currentStoringMonth || currentWatchingYear !== currentStoringYear);
        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
        button_Month_YearSelector_Click();
        showSectionViewingMonth_Year();
    }

    /**
     * function to setup current month with previous and next month.
     * @param viewing_Year  current month to be setup
     */
    function setupViewingMonth(viewing_Year) {
        //Setup month
        currentWatchingMonth = viewing_Year;
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
     * FEATURE: this feature allow to show the weekends with special effect to imply them.
     * To use this, first call function featureShowWeekends('button_to_switch_mode_ID', [optional] 'name_style_class_when_activate')
     * Then assign the function button_SettingWeekends_Click() to the wished button to change.
     */
    this.featureShowWeekends = function (button_id, activated_class = 'activated', localStorage_name = 'Weekends_Setting') {
        if (button_id !== undefined && button_id !== null) {
            button_SettingWeekends = document.getElementById(button_id);
            if (button_SettingWeekends !== undefined && button_SettingWeekends !== null) {
                button_SettingWeekends.onclick = function () {
                    button_SettingWeekends_Click();
                };
                button_SettingWeekends_ClassName = button_SettingWeekends.className;
                button_SettingWeekends_ClassName_Activate = activated_class;
                isWeekendOn_localStorage = localStorage_name;
            }
        }
    };

    /**
     * FEATURE: this feature allow to show the weekends with special effect to imply them.
     * To use this, first call function featureShowWeekends('button_to_switch_mode_ID', [optional] 'name_style_class_when_activate')
     * Then assign the function button_SettingWeekends_Click() to the wished button to change.
     */
    function button_SettingWeekends_Click() {
        if (button_SettingWeekends !== undefined) {
            if (isWeekendOn) {
                button_SettingWeekends.className = button_SettingWeekends_ClassName;
                local_SetSettingWeekends(false);
            } else {
                button_SettingWeekends.className = button_SettingWeekends_ClassName + ' ' + button_SettingWeekends_ClassName_Activate;
                local_SetSettingWeekends(true);
            }
            isWeekendOn = !isWeekendOn;
        }
        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
    }

    /**
     * Identify whether the setting on local machine is set to imply the weekend days (saturday and sunday) or not. If browser doesn't support localStorage features, it will be automatically return as 'false' value.
     * @returns {boolean}   True for set monday as the first day of the week.
     */
    let local_CheckSettingWeekends = function () {
        let result = localStorage.getItem(isWeekendOn_localStorage);
        return (result !== null && result !== undefined && result !== "false");
    };

    /**
     * Set the current setting of show weekends to the localStorage
     * @param isWeekendOn  true for storing the setting as showing weekends.
     */
    let local_SetSettingWeekends = function (isWeekendOn = false) {
        if (isWeekendOn) {
            localStorage.setItem(isWeekendOn_localStorage, 'true');
        } else {
            localStorage.setItem(isWeekendOn_localStorage, 'false');
        }
    };

    /**
     * Get setting of Weekends view mode in localStorage.
     */
    let local_GetSettingWeekends = function () {
        if (button_SettingWeekends !== undefined) {
            isWeekendOn = local_CheckSettingWeekends();
            if (isWeekendOn) {
                button_SettingWeekends.className = button_SettingWeekends_ClassName + " " + button_SettingWeekends_ClassName_Activate;
            } else {
                button_SettingWeekends.className = button_SettingWeekends_ClassName;
            }
        }
    };

    /**
     * FEATURE: this feature allow to switch the first day of a week from sunday to monday and reverse.
     * To use this, first call function featureSwitchMonday('button_to_switch_mode_ID', [optional=Default 'activated'] 'name_style_class_when_activate', [optional=Default 'Monday_Setting'] 'local_storage_name')
     * Then assign the function button_SettingMonday_Click() to the wished button to change.
     */
    this.featureSwitchMondaySunday = function (button_id, activated_class = 'activated', localStorage_name = 'Monday_Setting') {
        if (button_id !== undefined && button_id !== null) {
            button_SettingMonday = document.getElementById(button_id);
            if (button_SettingMonday !== undefined || button_SettingMonday !== null) {
                button_SettingMonday.onclick = function () {
                    button_SettingMonday_Click();
                };
                button_SettingMonday_ClassName = button_SettingMonday.className;
                button_SettingMonday_ClassName_Activate = activated_class;
                isMondayFirst_localStorage = localStorage_name;
            } else {
                button_SettingMonday = undefined;
            }
        }
    };

    /**showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
     * FEATURE: this feature allow to switch the first day of a week from sunday to monday and reverse.
     * To use this, first call function featureSwitchMonday('button_to_switch_mode_ID', [optional] 'name_style_class_when_activate')
     * Then assign the function button_SettingMonday_Click() to the wished button to change.
     */
    function button_SettingMonday_Click() {
        if (button_SettingMonday !== undefined) {
            if (isMondayFirst) {
                button_SettingMonday.className = button_SettingMonday_ClassName;
                local_SetSettingMonday(false);
            } else {
                button_SettingMonday.className = button_SettingMonday_ClassName + " " + button_SettingMonday_ClassName_Activate;
                local_SetSettingMonday(true);
            }
            isMondayFirst = !isMondayFirst;
        }
	    showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
    }

    /**
     * Identify whether the setting on local machine is set to monday as the first day of the week or not. If browser doesn't support localStorage features, it will be automatically return as 'false' value.
     * @returns {boolean}   True for set monday as the first day of the week.
     */
    let local_CheckSettingMonday = function () {
        let result = localStorage.getItem(isMondayFirst_localStorage);
        return (result !== null && result !== undefined && result !== "false");
    };

    /**
     * Set the current setting of monday as the first day of week to the localStorage
     * @param isMondayTheFirst  true for storing the setting as monday as the first day of the week.
     */
    let local_SetSettingMonday = function (isMondayTheFirst = false) {
        if (isMondayTheFirst) {
            localStorage.setItem(isMondayFirst_localStorage, 'true');
        } else {
            localStorage.setItem(isMondayFirst_localStorage, 'false');
        }
    };

    /**
     * Identify whether the setting on local machine is set to monday as the first day of the week or not. If browser doesn't support localStorage features, it will be automatically return as 'false' value.
     * @returns {boolean}   True for set monday as the first day of the week.
     */
    let local_GetSettingMonday = function () {
        if (button_SettingMonday !== undefined) {
            isMondayFirst = local_CheckSettingMonday();
            if (isMondayFirst) {
                button_SettingMonday.className = button_SettingMonday_ClassName + " " + button_SettingMonday_ClassName_Activate;
            } else {
                button_SettingMonday.className = button_SettingMonday_ClassName;
            }
        }
    };

    /**
     * Adding a new holiday to the calender.
     * @param date  day occurs the holiday (1 - 31)
     * @param month month occurs the holiday (1 - 12)
     * @param year happens only in one year
     */
    this.newHoliday = function (date, month, year = undefined) {
        return newHoliday(date, month, year);
    };

    /**
     * Private function of adding new holiday to the calender;
     * @param date  day occurs the holiday (1 - 31)
     * @param month month occurs the holiday (1 - 12)
     * @param year  happens only in one year (1970 - 2200)
     * @returns {boolean}
     */
    let newHoliday = function (date, month, year = undefined) {
        if (!isNaN(date) && !isNaN(month) && date > 0 && date < 32 && month > 0 && month < 13) {
            let aHoliday;
            if (month === 2) {
                if (date < 30) {
                    aHoliday = {
                        date: date,
                        month: month - 1,
                        year: (year !== undefined && !isNaN(year) && year > 1970 && year < 2200) ? year : null
                    };
                } else return false;
            } else {
                aHoliday = {
                    date: date,
                    month: month - 1,
                    year: (year !== undefined && !isNaN(year) && year > 1970 && year < 2200) ? year : null
                };
            }
            holiday.push(aHoliday);
            showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
            return true;
        }
        return false;
    };

    function clickOnDay(date, month, year) {
        let dateValid = date !== undefined && date !== null  && !isNaN(date) && date > 0 && date < 32;
        let monthValid = month !== undefined && month !== null  && !isNaN(month) && month > -1 && month < 13;
        let yearValid = year !== undefined && year !== null  && !isNaN(year) && year > 1900 && year < 2200;
        if (dateValid && monthValid && yearValid){
            if ((choosingSecondDay !== undefined && choosingFirstDay !== undefined) || (choosingFirstDay === undefined && choosingSecondDay === undefined)) {
	            choosingFirstDay = {
		            date: date,
		            month:month,
		            year: year
	            };
	            choosingSecondDay = undefined;
            }else {
                if (choosingFirstDay.year > year){
                    swapChoosingDate(date, month, year);
                } else {
	                if (choosingFirstDay.month > month) {
		                swapChoosingDate(date, month, year);
	                }else {
		                if (choosingFirstDay.month === month) {
			                if (choosingFirstDay.date > date) {
				                swapChoosingDate(date, month, year);
			                }else {
				                choosingSecondDay = {
					                date: date,
					                month:month,
					                year: year
				                };
			                }
                        }else {
			                choosingSecondDay = {
				                date: date,
				                month:month,
				                year: year
			                };
                        }
                    }
                }
            }
	        showSectionDisplayDayCalender(currentWatchingMonth, currentWatchingYear);
        }
    }

    function swapChoosingDate(datePassIn, monthPassIn, yearPassIn) {
	    choosingSecondDay = {
		    date: choosingFirstDay.date,
		    month:choosingFirstDay.month,
		    year: choosingFirstDay.year
	    };
	    choosingFirstDay = {
		    date: datePassIn,
		    month:monthPassIn,
		    year: yearPassIn
	    };
    }

    this.dateRangeFrom = function(date1, date2, month1 = undefined, month2 = undefined, year1 = undefined, year2 = undefined){
        let dateObject1 = (date1 !== undefined && !isNaN(date1) && date1 > 0 && date1 < 32) ? date1: date;
	    let monthObject1 = (month1 !== undefined  && !isNaN(month1) && month1 >= 0 && month1 < 13) ? month1 :currentStoringMonth ;
	    let yearObject1 = (year1 !== undefined && !isNaN(year1) && year1 >= 1000 && year1 < 9999) ? year1 : currentStoringYear ;
	    let firstDate = new Date(yearObject1, monthObject1, dateObject1);

	    let dateObject2 = (date2 !== undefined && !isNaN(date2) && date2 > 0 && date2 < 32) ? date2: date;
	    let monthObject2 = (month2 !== undefined && !isNaN(month2) && month2 >= 0 && month2 < 13) ? month2 :currentStoringMonth ;
	    let yearObject2 = (year2 !== undefined && !isNaN(year2) && year2 >= 1000 && year2 < 9999) ? year2 : currentStoringYear ;
	    let secondDate = new Date(yearObject2, monthObject2, dateObject2);

	    return dateDifference(firstDate, secondDate);
    };
    
    let dateDifference = function (firstDate, secondDate) {
	    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
	    let utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
	    let utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());

	    return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
    };

    //    Secondary functions

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

	/**
	 * Destroy the number of children DOM from ots parent by class
	 * @param idParent  id of the parent
	 * @param classDestroy  id of the one that need to be destroyed
	 * @param number    number of children to be destroyed
	 * @param end       true for destroying children from the end of array
	 */
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
};