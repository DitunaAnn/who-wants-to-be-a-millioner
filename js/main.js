;'use strict';

$('.block').removeClass('loader-none');

setTimeout(function(){   
    document.querySelector('.block').classList.toggle('loader-none');
    // $('.block').addClass('loader-none');
    document.getElementById('bg_popup').style.display = 'block';
}, 2300);

(function(){


   if ( document.querySelector('.active__player')) {
       document.querySelector('.user__name_new').value = document.querySelector('.active__player').querySelector('.user__name').textContent;
   }  
})();

// ====================
// WINNERS LIST START
// ====================
var arrLocalStorage = []; 

if (localStorage.length != 0) {
    arrLocalStorage = localStorage.gamers ? JSON.parse(localStorage.gamers) : [];
} else {
    arrLocalStorage = [];
}

function getWinnerList() {
   

    arrLocalStorage.sort(function(a, b) {
        return b.score - a.score;
    });

    arrLocalStorage = arrLocalStorage.reduce(function(field, e1){  
        var matches = field.filter(function(e2){return e1.name== e2.name}); 
        if (matches.length == 0){ 
            field.push(e1);  
        }return field;
    }, []); 

    

    var sItem = JSON.stringify(arrLocalStorage);
            
    localStorage.setItem("gamers",sItem);

    winList = $('.winners-list');
    winList.empty();
    winList.append(`<input type='text' class="user__name_new" placeholder="Enter your Name">`);

    // созданем нового плера для выбора
    if (arrLocalStorage.length !== 0) {
        winList.append(`<div class="user-new"></div>`)
               .append(`<h3 class="title-list">Winners</h3>`);
    }

    for (var j = 0; j < arrLocalStorage.length; j++) {
        if (j < 10) {
            winList.append(`<div class="user user-${j}"></div>`);
            $(`.user-${j}`).append(`<div class="user__name">${arrLocalStorage[j].name}</div>`)
                           .append(`<div class="user__score">${arrLocalStorage[j].score} $</div>`);
        }
    };


    winList[0].addEventListener('click', function (e) {

        document.querySelectorAll('.user').forEach(e => {
            e.classList.toggle('active__player', false);
        });


    if ( e.target.closest('.user') ) {
        e.target.closest('.user').classList.add('active__player');
        document.querySelector('.user__name_new').value = document.querySelector('.active__player').querySelector('.user__name').textContent;
    } else {
        return;
    }
    });
    winList[0].addEventListener('dblclick', dblclickFunc);
   	document.addEventListener('keydown', keydownFunc); 
};

function dblclickFunc (e) {
 	if ( e.target.closest('.user') ) {
 		document.getElementById('bg_popup').style.display = 'none';
    	createGame();
	} else {
    	return;
	};
}

function nextActive (ClassToNodeList, activeClass, keyCode) {
    var NodeList = document.querySelectorAll('.' + ClassToNodeList);
    var arrNodeList = [...NodeList];
    var tempEl = document.querySelector('.' + activeClass);
    var index = arrNodeList.indexOf(tempEl);
    var nextIndex;
    if (keyCode === 38) {
        nextIndex = index <= 0 ? NodeList.length - 1 : index - 1;
    } else if (keyCode === 40) {
        nextIndex = index == NodeList.length - 1 ? 0 : index + 1;
    } else if (keyCode === 13) {
        return NodeList[index];
    };
    if (tempEl) {
        tempEl.classList.toggle(activeClass, false); 
    }
    NodeList[nextIndex].focus();
    NodeList[nextIndex].classList.add(activeClass);
    
    if ( document.querySelector('.active__player')) {
        document.querySelector('.user__name_new').value = document.querySelector('.active__player').querySelector('.user__name').textContent;
    }     
}

function keydownFunc (e) {
    switch(e.keyCode) {
    case 13:   // если нажата enter
        if ( document.querySelector('.rules_visible')) {
            eventFire(document.querySelector('.rules__btn'), 'click');
        } else if ( document.querySelector('.loss_visible')) {
            eventFire(document.querySelector('.loss__btn'), 'click');
        } else if ( document.querySelector('.exit_visible')) {
            eventFire(document.querySelector('.exit__btns_yes'), 'click');        
        } else if ( document.querySelector('.win_visible')) {
            eventFire(document.querySelector('.win__btn'), 'click');  
        } else if ( document.querySelector('#bg_popup').style.display === 'block') {
            eventFire(document.querySelector('.modal-btn'), 'click');
        } else if ( !(document.querySelector('#bg_popup').style.display === 'block')) {
            if (document.querySelector('.double-chance-half-used') && document.querySelector('.double-chance-used') ) {
                eventFire(nextActive( 'answer', 'answer-active1', e.keyCode ), 'click');
                break;
            };
            eventFire(nextActive( 'answer', 'answer-active', e.keyCode ), 'click');
        };   
        break;
    case 27:   // если нажата клавиша esc
        if ( document.querySelector('.exit_visible') ) {
            eventFire(document.querySelector('.exit__btns_no'), 'click');
        } else if ( document.querySelector('.rules_visible')) {
            eventFire(document.querySelector('.rules__btn'), 'click');
        } else if ( document.querySelector('.loss_visible')) {
            eventFire(document.querySelector('.loss__btn'), 'click');    
        } else if ( document.querySelector('.win_visible')) {
            eventFire(document.querySelector('.win__btn'), 'click');        
        } else {
            eventFire(document.querySelector('.finish'), 'click');
        }; 
        break;
    case 38:   // если нажата клавиша вверх
        if ( document.querySelector('#bg_popup').style.display === 'block' ) {
            nextActive( 'user', 'active__player', e.keyCode );
        }  else if ( !(document.querySelector('#bg_popup').style.display === 'block') && !document.querySelector('.answer-no-active') ) {
            if (document.querySelector('.double-chance-half-used') && document.querySelector('.double-chance-used') ) {
                nextActive( 'answer', 'answer-active1', e.keyCode );
                break;
            };
            nextActive( 'answer', 'answer-active', e.keyCode );
        };
        break;
    case 40:   // если нажата клавиша вниз
        if ( document.querySelector('#bg_popup').style.display === 'block' ) {
            nextActive( 'user', 'active__player', e.keyCode );
        }  else if ( !(document.querySelector('#bg_popup').style.display === 'block') && !document.querySelector('.answer-no-active') ) {
            if (document.querySelector('.double-chance-half-used') && document.querySelector('.double-chance-used') ) {
                nextActive( 'answer', 'answer-active1', e.keyCode );
                break;
            };
            nextActive( 'answer', 'answer-active', e.keyCode );
        };
        break;
    };
}

getWinnerList();

// ====================
// WINNERS LIST END
// ====================


function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}



function newCheck () {
    var tempCheck = [...document.querySelectorAll('.user__name')].map(e => e.textContent).indexOf(document.querySelector('.user__name_new').value) == -1;
    if ( document.querySelector('.user__name_new').value != '' && tempCheck ) {

        document.getElementById('bg_popup').style.display = 'block';
        $('.overlay').addClass('overlay_visible');
        $('.rules').addClass('rules_visible');
        $('.rules__btn').on('click', function() {
            $('.overlay').removeClass('overlay_visible');
            $('.rules').removeClass('rules_visible');
        	createGame();
        	document.getElementById('bg_popup').style.display = 'none';
        });

    } else {
		createGame();
    };
}

var startButton = document.querySelector('.start');
var winList;

function initialization () {
    document.querySelector('.user__name_new').autofocus = true;
    document.querySelector('.user__name_new').focus();
    startButton.addEventListener('click', startButtonFunc); 
}

initialization ();

function startButtonFunc (event) {
	newCheck ();
}

function createGame () {
    if ( document.querySelector('.winners-list').querySelector('.active__player') ) {
        var winnersActive = document.querySelector('.winners-list').querySelector('.active__player').querySelector('.user__name').textContent;
    }
    var objOptionsCurrent = {};
        if ( document.querySelector('.user__name_new').value != '' ) {
            objOptionsCurrent.name = document.querySelector('.user__name_new').value;
            document.querySelector('.user__name_new').value = '';
        } else if ( winnersActive ) {
            objOptionsCurrent.name = winnersActive;
        } else {
            document.querySelector('.user__name_new').focus();
            document.querySelector('.user__name_new').autofocus = true;
        }
    if (objOptionsCurrent.name) {
        startButton.removeEventListener('click', startButtonFunc);
        winList[0].removeEventListener('click', dblclickFunc);

        var startNewGame = new ClassGame (objOptionsCurrent);
        startNewGame.start();
        document.getElementById('bg_popup').style.display = 'none';

        $('.question-block').addClass('question-block_visible');

    } else {
        document.getElementById('bg_popup').style.display = 'block';
    }

}

function ClassGame (objOptions) {
    this.name = objOptions.name;
    // this.id;
    var newPlayer;
    var newManegerGame;


    var classNameHTML = {
        questionHTML: '.question',
        answersHTML: {
            answers: '.answers',
            answer: '.answer',
            answerActive: 'answer-active',
            answerActive1: 'answer-active1',
            answerDisabled: 'answer-disabled',
            callAnswer: '.call-answer',
            correctAnswer: 'correct_answer'
        },
        fifty: {
            fifty: '.fifty-fifty',
            fiftyUsed: 'fifty-used'
        },
        call: {
            call: '.call',
            callUsed: 'call-used'
        },
        doubleChance: {
            doubleChance: '.double-chance',
            doubleChanceHalf: 'double-chance-half-used',
            doubleChanceUsed: 'double-chance-used'
        },
        helpChance: {
            helpChance: '.help-chance',
            helpChanceUsed: 'help-chance-used'
        },
        nextQuestionHTML: {
            nextQuestion: '.next-question',
            nextQuestionUsed: 'next-question-used'
        },
        clock:'.clock-counter',
        finishHTML: '.finish',
        level: {
            level: '.level',
            levelCurrent: 'current-level',
            levelActive: 'current-level-active',
            levelFixed: 'current-level-fixed'
        }
    };

    $.getJSON('data.json');
    var objQuestion = JSON.parse(data);

    this.start = function () {
        newPlayer = new Player(objOptions);
        var newManegerGame = new ManegerGame(newPlayer);
        newManegerGame.nextQuestion();
    };


    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

                                          
    function Player (objOptionsPlayer) {
        this.name = objOptionsPlayer.name;
        var _levelPlayer = 0;
        var _fiftyUsed = true;
        var _call = true;
        var _doubleChance = true;
        var _helpChance = true;
        var _nextQuestion = true;
        var levelHTML = document.querySelectorAll(classNameHTML.level.level);
        var th = this;
        var money = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
        var _winCurrent = [0];
        var _tempCurrent = [0];

        Object.defineProperties(this, {
            levelPlayer: {
                get: function () {
                    return _levelPlayer;
                }
            },
            fiftyUsed: {
                get: function () {
                    return _fiftyUsed;
                },
                set: function(value) {
                    _fiftyUsed = false;
                }
            },
            call: {
                get: function () {
                    return _call;
                },
                set: function(value) {
                    _call = false;
                }
            },
            doubleChance: {
                get: function () {
                    return _doubleChance;
                },
                set: function(value) {
                    _doubleChance = false;
                }
            },
            helpChance: {
                get: function () {
                    return _helpChance;
                },
                set: function(value) {
                    _helpChance = false;
                }
            },
            nextQuestionNull: {
                get: function () {
                    return _nextQuestion;
                },
                set: function(value) {
                    _nextQuestion = false;
                }
            },
            winCurrent: {
                get: function () {
                    return _winCurrent[_winCurrent.length - 1];
                },
                set: function(value) {
                    _winCurrent = [0];
                }
            },
            tempCurrent: {
                get: function () {
                    return _tempCurrent[_tempCurrent.length - 1];
                },
                set: function(value) {
                    _tempCurrent = [0];
                }
            },
            costCurrent: {
                get: function () {
                    return money[_levelPlayer];
                }
            }
        });

        function stepLevel () {
            levelHTML.forEach(function(e, i) {
            e.classList.remove(classNameHTML.level.levelCurrent);
            e.classList.remove(classNameHTML.level.levelActive);
            e.classList.remove(classNameHTML.level.levelFixed);
                if (th.levelPlayer > i) {
                _tempCurrent.push(money[i]);
                    levelHTML[i].classList.add(classNameHTML.level.levelCurrent);
                    if (th.levelPlayer > 5) {
                        levelHTML[4].classList.add(classNameHTML.level.levelFixed);
                        _winCurrent.push(money[5]);
                    }
                    if (th.levelPlayer > 10) {
                        levelHTML[9].classList.add(classNameHTML.level.levelFixed);
                        _winCurrent.push(money[10]);
                    }                       
                    if (th.levelPlayer > 14) {
                        levelHTML[14].classList.add(classNameHTML.level.levelFixed);
                        if (th.levelPlayer > 15) {
                            _winCurrent.push(money[15]);
                        }
                    }
                }
            });
            if(th.levelPlayer < 1) {
                levelHTML[th.levelPlayer].classList.add(classNameHTML.level.levelActive);
            } else if (th.levelPlayer < 16) {
                levelHTML[th.levelPlayer-1].classList.add(classNameHTML.level.levelActive);
            }      
        }

        this.incrementLevel = function () {
           _levelPlayer++;
            stepLevel();
        };

        this.resetLevel = function () {
            _levelPlayer = 0;
            _call = true;
            _fiftyUsed = true;
            _doubleChance = true;
            _helpChance = true;
            _nextQuestion = true;
            _winCurrent = [0];
            _tempCurrent = [0];
            stepLevel();
        };
    }

    function ManegerGame (player) {
        this.player = player;
        var th = this;
        var _checkbox = false;
        var obj = objQuestion;
        var _questionTempFull = [];
        var _probability = [80, 70, 60];
        var _notUsedValue = [];
        var answerTrue;


        Object.defineProperties(this, { 
            levelQuestion: {
                get: function () {
                    if (this.player.levelPlayer < 6 ) {
                       return Object.keys(obj)[0];
                    } else if (this.player.levelPlayer < 11) {
                       return Object.keys(obj)[1];
                    }
                    return Object.keys(obj)[2];
                }
            },            
            probability: {
                get: function () {
                    if (this.player.levelPlayer < 6 ) {
                        return _probability[0];
                    } else if (this.player.levelPlayer < 11) {
                        return _probability[1];
                    }
                        return _probability[2];
                }
            },
            questionTemp: {
                get: function () {
                    var temp = JSON.parse(JSON.stringify(_questionTempFull[0]));
                    var id = temp['id'];
                    for (key in temp) {
                        if (key == 'answer') {
                            for (value in temp[key]) {
                                _notUsedValue.push(temp[key][value]['text'])
                                temp[key][value]['accept'] = false;
                                temp[key][value]['idSort'] = getRandomInt(1, 1000);
                            }    
                        }          
                    }
                    return temp
                }
            },
            checkbox: {
                get: function () {
                    return checkbox;
                }
            }
        });


        
        this.questionGet = function () {
            var _randomQuestion = getRandomInt (0, obj[th.levelQuestion].length);
            _questionTempFull = obj[th.levelQuestion].splice(_randomQuestion, 1);
        };

        this.nextQuestion = function () {
            if (this.player.levelPlayer == 0 ) {
                startHelp();
            }
            this.player.incrementLevel();
            _notUsedValue = [];
            this.questionGet();
            this.clientHtml ();
            for (var key in _questionTempFull[0]['answer']) {
                if (_questionTempFull[0]['answer'][key]['accept'] == 'true') {
                    answerTrue = _questionTempFull[0]['answer'][key]['text'];
                }
            }
            _notUsedValue = _notUsedValue.filter((el, i) => el != answerTrue);
        };        

        this.nextQuestionNull = function () {
            _notUsedValue = [];
            this.questionGet();
           for (var key in _questionTempFull[0]['answer']) {
                if (_questionTempFull[0]['answer'][key]['accept'] == 'true') {
                    answerTrue = _questionTempFull[0]['answer'][key]['text'];
                }
            }
            _notUsedValue = _notUsedValue.filter((el, i) => el != answerTrue);
            this.clientHtml ();
        };

        

            // localStorage.setItem('gamers', arrLocalStorageTemp);

            // console.log(localStorage.getItem('gamers', arrLocalStorageTemp));

            // for (let key in localStorage.getItem('gamers', arrLocalStorageTemp)) {
            //     console.log(localStorage.getItem('gamers', arrLocalStorageTemp)[key]);
            // }

        this.gameOver = function () {
        var name = th.player.name, 
            score = th.player.tempCurrent;
           
            // for (let i = 0; i < arrLocalStorage.length; i++) {
            //     if (arrLocalStorage[i].name == true) {
            //         arrLocalStorage[i].score = score;
            //     } else {
            //         arrLocalStorage.push({ name: th.player.name, score: th.player.tempCurrent });
            //     }
            // }

            arrLocalStorage.push({ name: th.player.name, score: th.player.tempCurrent });

            // var sItem = JSON.stringify(arrLocalStorage);
            
            // localStorage.setItem("gamers",sItem);

            getWinnerList();  

            this.player.resetLevel();

            // document.getElementById('bg_popup').style.display = 'block';

            document.querySelectorAll('.user').forEach(e => {
                e.classList.toggle('active__player', false);
            });

            document.querySelector('.winners-list').querySelectorAll('.user__name').forEach(e => {
                if (e.textContent == th.player.name) {
                    e.parentNode.classList.add('active__player');
                    document.querySelector('.user__name_new').value = document.querySelector('.active__player').querySelector('.user__name').textContent;
                };
            });

            initialization ();

        };

        this.message = {
            gameOver: function () {
                // alert(th.player.name + ", ваш выиграш составил: " + (th.player.winCurrent+ "").replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' $ \nВсе деньги отправленны на текущий счет в Швейцарском банке' + '\nКоличество очков: ' + th.player.tempCurrent);
                var arrPhrasesLoss = ['Не сдавайтесь, попробуйте еще раз...', 
                                      'Попробуйте еще раз, и у Вас все получится!', 
                                      'Не стоит останавливаться на достигнутом, попробуйте снова...', 
                                      'Вы были очень близко к главному призу. Попробуйте еще раз...', 
                                      'Ну почти же... Как насчет попробовать еще раз?', 
                                      'Следующий раз точно закончится победой!', 
                                      'Может еще разок? Миллион был довольно близко...'];

                $('.overlay').addClass('overlay_visible');
                $('.loss').addClass('loss_visible');
                $('.loss__icon').css('background-image', 'url(img/loss-' + getRandomInt(1, 6) + '.svg)');
                $('.loss__p1').text(th.player.name + ", Ваш выиграш составил: " + (th.player.winCurrent + "").replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' $');
                $('.loss__p2').text('Вы остановились на сумме: ' + th.player.tempCurrent + ' $');
                $('.loss__p3').empty();
                $('.loss__p4').text(arrPhrasesLoss[getRandomInt(0, arrPhrasesLoss.length)]);
                if (th.player.winCurrent > 0) {
                    $('.loss__p3').text('Все деньги отправленны на текущий счет в Швейцарском банке :)');
                }
                $('.loss__btn').on('click', function() {  
                    $('.overlay').removeClass('overlay_visible');
                    $('.loss').removeClass('loss_visible');
                    $('.overlay').removeClass('overlay_visible');
                    $('.exit').removeClass('exit_visible');
                    $('.loss__icon').removeAttr('style');
                    $('.loss__p3').empty();
                    document.getElementById('bg_popup').style.display = 'block';
                    $('.question-block').removeClass('question-block_visible'); 
                });
            },
            takeMoney: function () {
                // alert(th.player.name + ", ваш выиграш составил: " + (th.player.tempCurrent + "").replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' $ \nВсе деньги отправленны на текущий счет в Швейцарском банке' + '\nКоличество очков: ' + th.player.tempCurrent);
            },
            offerTakeMoney: function () {
                // return th.player.name + ", ваш выиграш всего лишь: " + (th.player.tempCurrent + "").replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' $ \nТочно завершить???' +  '\nКоличество очков: ' + th.player.tempCurrent;
            },
            congratulations: function () {
                // alert(th.player.name + '!!! Поздарвляем, Вы миллионер!!!');
                $('.overlay').addClass('overlay_visible');
                $('.win').addClass('win_visible');
                $('.win__icon').css('background-image', 'url(img/win-1.svg)');
                $('.win__p1').text(th.player.name + '! Поздравляем, Вы миллионер!');
                $('.win__btn').on('click', function() {
                    $('.overlay').removeClass('overlay_visible');
                    $('.win').removeClass('win_visible');
                    document.getElementById('bg_popup').style.display = 'block';
                    $('.question-block').removeClass('question-block_visible');
                });
            },
            call: function () {
                return th.player.name + ', и все таки я думаю это ' + th.callManeger();
            }
        };  

        this.check = function (data) {
            if (data.indexOf(answerTrue) != -1) {
                checkbox = true;
            } else {
                checkbox = false;
            }

            return answerTrue;
        };

        this.fifty = function () {
            var fiftyArr = [];

            for (key in _questionTempFull[0]['answer']) {
                if (_questionTempFull[0]['answer'][key]['accept'] != 'true') {
                    fiftyArr.push(_questionTempFull[0]['answer'][key]['text']);
                }
            }
            var temp = fiftyArr.splice(getRandomInt (0, 3), 1);
            _notUsedValue = temp;

            return fiftyArr;
        };

        this.callManeger = function (arr) {
            var callProbability = getRandomInt (0, 100);
            if (callProbability <= this.probability ) {
                return answerTrue;
            }
                return _notUsedValue[getRandomInt (0, _notUsedValue.length)]
        };        


        function startHelp () {
            var helpHTML = document.querySelectorAll('.help');
            helpHTML.forEach(e => {
                e.classList.remove('none', 'help-chance-used', 'fifty-used', 'call-used', 'double-chance-used', 'next-question-used');
            });
            var objFunc = [
                function (x) {
                    th.player.helpChance = false;
                    helpHTML[0].classList.add('none', 'help-chance-used');
                    this.splice(x, 1);
                },            
                function (x) {
                    th.player.fiftyUsed = false;
                    helpHTML[1].classList.add('none', 'fifty-used');
                    this.splice(x, 1);
                },            
                function (x) {
                    th.player.call = false;
                    helpHTML[2].classList.add('none', 'call-used');
                    this.splice(x, 1);
                },            
                function (x) {
                    th.player.doubleChance = false;
                    helpHTML[3].classList.add('none', 'double-chance-used');
                    this.splice(x, 1);
                },            
                function (x) {
                    th.player.nextQuestionNull = false;
                    helpHTML[4].classList.add('none', 'next-question-used');
                    this.splice(x, 1);
                }
            ];

            for (let i = 0; i < 2; i++) {
                var randomFunc = getRandomInt(0, objFunc.length);
                objFunc[randomFunc](randomFunc);
            };
        };

    }

    ManegerGame.prototype.clientHtml = function () {
        var th = this;
        var questionHTML = document.querySelector(classNameHTML.questionHTML);
        var answersHTML = document.querySelector(classNameHTML.answersHTML.answers);
        var answerHTML = document.querySelectorAll(classNameHTML.answersHTML.answer);
        var questionNotAnswered = true;
        var objAnswer = th.questionTemp;
        var temp = [];
        var answerArr = [];
        var fifty = document.querySelector(classNameHTML.fifty.fifty);
        var call = document.querySelector(classNameHTML.call.call);
        var callAnswer = document.querySelector(classNameHTML.answersHTML.callAnswer);
        var doubleChance = document.querySelector(classNameHTML.doubleChance.doubleChance);
        var helpChance = document.querySelector(classNameHTML.helpChance.helpChance);
        var nextQuestionHTML = document.querySelector(classNameHTML.nextQuestionHTML.nextQuestion);
        var finishHTML = document.querySelector( classNameHTML.finishHTML);
        var clock = document.querySelector(classNameHTML.clock);

        // var isFinis = true;
        var isDoubleChance = true;

        var isHelpChance = true;
        var helpChanceTrue = false;   
        
        var isNextQuestionHTML = true;
        var isCall = true;
        var isFifty = true;
        var timerIdClock;
        var timerIdClock2;


        clock.textContent = '30';
        clockTimer ();

        function clockTimer () {
            var trueStartClock = true;
            var date;
            timerIdClock = setTimeout(function goTime() {
                if ( trueStartClock ) {
                   trueStartClock = false;
                   date = +(new Date()) + 31000;
                };
                var time = Math.floor((date - new Date()) / 1000);
                clock.textContent = time < 0 ? 0 : time > 30 ? 30 : time;
                timerIdClock2 = setTimeout(goTime, 1000);
                if (time < 0) {
                    th.message.gameOver();
                    th.gameOverHTML();
                } else if (time < 7) {
                    clock.classList.add('clock-counter_pulse');
                }
            }, 1000);
        }

        callAnswer.removeAttribute('style');

        call.addEventListener('click', callFunc); 
        function callFunc (event) {

            if (th.player.call && isCall) {
                callAnswer.style.display = 'block';
                th.player.call = false;
                this.classList.add(classNameHTML.call.callUsed);
                callAnswer.textContent = th.message.call();
            }
        }


        fifty.addEventListener('click', fiftyFunc);
        function fiftyFunc (event) {
            if (th.player.fiftyUsed && isFifty) {
                th.player.fiftyUsed = false;
                this.classList.add(classNameHTML.fifty.fiftyUsed);
                var delTwo = th.fifty();
                
                answerHTML.forEach(function(e, i) {
                    if ( delTwo.indexOf(e.textContent) != -1) {
                        e.textContent = '';
                        e.classList.add(classNameHTML.answersHTML.answerDisabled);
                    }
                });
            }
        };


        questionHTML.textContent = objAnswer['question'];
        for (key in objAnswer['answer']) {
            temp.push(objAnswer['answer'][key]);
        }
        function compareId(IdSort1, IdSort2) {
            return IdSort1['idSort'] - IdSort2['idSort'];
        }
        temp.sort(compareId);
        
        answerHTML.forEach(function(e, i) {
            e.textContent = temp[i]['text'];
            e.addEventListener('click', answerHTMLFunc);
        });
  

        doubleChance.addEventListener('click', doubleChanceFunc);
            function doubleChanceFunc (event) {
            if (th.player.doubleChance && isDoubleChance) {
                th.player.doubleChance = false;
                isHelpChance = false;
                this.classList.add(classNameHTML.doubleChance.doubleChanceHalf);
                isNextQuestionHTML = false;

                answerHTML.forEach(function(e, i) {
                    e.removeEventListener('click', answerHTMLFunc );
                    e.addEventListener('click', function(event) {
                        if (isDoubleChance) {

                            if ( document.querySelector('.answer-active') ) document.querySelector('.answer-active').classList.toggle('answer-active', false);

                            doubleChance.classList.add(classNameHTML.doubleChance.doubleChanceUsed);
                            isDoubleChance = false;
                            answerArr.push(this.textContent);
                            this.classList.add(classNameHTML.answersHTML.answerActive);
                            answerHTML.forEach(function(e, i) {
                                e.addEventListener('click', answerHTMLFunc );
                            });
                            isHelpChance = true;      
                        };
                    });
                });       
            }
        }  

        helpChance.addEventListener('click', helpChanceFunc, false);
        function helpChanceFunc (event) {
            if(th.player.helpChance && isHelpChance ) {
                th.player.helpChance = false;
                helpChanceTrue = true;
                isHelpChance = false;

                isDoubleChance = false;
                isNextQuestionHTML = false;
                isFifty = false;
                isCall = false;
                this.classList.add(classNameHTML.helpChance.helpChanceUsed);
            }
        }


        nextQuestionHTML.addEventListener('click', nextQuestionFunc, false);
        function nextQuestionFunc (event) {
            if(th.player.nextQuestionNull && isNextQuestionHTML ) {
                th.player.nextQuestionNull = false;
                this.classList.add(classNameHTML.nextQuestionHTML.nextQuestionUsed);  
                clearDisplayClassAnswer ();
                canceSubscriptionALL ();
                th.nextQuestionNull();
            };
        }     

        finishHTML.addEventListener('click', finisFunc, false);
            function finisFunc (event) {
                // var conf = confirm(th.message.offerTakeMoney());
                // if (conf) {
                //     th.message.takeMoney();
                //     th.gameOverHTML();
                // }

                var arrPhrasesExit = ['Вы готовы сдаться?', 
                                      'Неужели на этом Вы отступите?', 
                                      'Сдаетесь на полпути?', 
                                      'Вы же на полпути к победе, и хотите сдаться?', 
                                      'Вы действительно хотите потерять шанс выиграть миллион?',
                                      'И все же Вы решили сдаться?',
                                      'Решили не рисковать?',
                                      'Хотите остаться с тем, что имеете на данный момент?'];

                $('.overlay').addClass('overlay_visible');
                $('.exit').addClass('exit_visible');
                $('.exit__icon').css('background-image', 'url(img/exit-' + getRandomInt(1, 8) + '.svg)');
                $('.exit__p1').text(th.player.name + ", Ваш выиграш всего лишь: " + (th.player.tempCurrent + "").replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') +  '  $')
                $('.exit__p2').text('Вы сейчас на вопросе цена которого: ' + th.player.costCurrent + ' $');
                $('.exit__p3').text(arrPhrasesExit[getRandomInt(0, arrPhrasesExit.length)]);
                $('.exit__btns_no').on('click', function() {
                    $('.overlay').removeClass('overlay_visible');
                    $('.exit').removeClass('exit_visible');
                });
                $('.exit__btns_yes').on('click', function() {
                    document.getElementById('bg_popup').style.display = 'block';
                    $('.overlay').removeClass('overlay_visible');
                    $('.exit').removeClass('exit_visible');
                    $('.exit__icon').removeAttr('style');
                    th.gameOverHTML();   
                    $('.question-block').removeClass('question-block_visible'); 
                });

            }


        th.gameOverHTML = function () {
            clearDisplayClassAnswer ();
            clearDisplayClassHelp ();
            canceSubscriptionALL ();
            th.gameOver();
        }

        function clearDisplayClassAnswer () {
            answerHTML.forEach(function(e, i) {
                e.classList.toggle(classNameHTML.answersHTML.answerDisabled, false);
                e.classList.toggle(classNameHTML.answersHTML.answerActive, false);
                e.classList.toggle(classNameHTML.answersHTML.answerActive1, false);
                e.classList.toggle(classNameHTML.answersHTML.correctAnswer, false);
            });
            callAnswer.textContent = '';
            clock.classList.toggle('clock-counter_pulse', false);
        }        

        function clearDisplayClassHelp () {
            fifty.classList.toggle(classNameHTML.fifty.fiftyUsed, false);
            call.classList.toggle(classNameHTML.call.callUsed, false);
            doubleChance.classList.toggle(classNameHTML.doubleChance.doubleChanceUsed, false);
            doubleChance.classList.toggle(classNameHTML.doubleChance.doubleChanceHalf, false);
            helpChance.classList.toggle(classNameHTML.helpChance.helpChanceUsed, false);
            nextQuestionHTML.classList.toggle(classNameHTML.nextQuestionHTML.nextQuestionUsed, false);
        }


        function canceSubscriptionALL () {
            clearTimeout(timerIdClock);
            clearTimeout(timerIdClock2);
            call.removeEventListener('click', callFunc); 
            fifty.removeEventListener('click', fiftyFunc);
            doubleChance.removeEventListener('click', doubleChanceFunc);
            helpChance.removeEventListener('click', helpChanceFunc);
            finishHTML.removeEventListener('click', finisFunc);
            nextQuestionHTML.removeEventListener('click', nextQuestionFunc);
            answerHTML.forEach(function(e, i) {
                e.removeEventListener('click', answerHTMLFunc );
            });

        }


        function answerHTMLFunc (event) {

            var correctAnswer;
            var thisCurrent = this;
            var timerId1;
            var timerId2;
            var answerId;

            if (doubleChance.classList.contains(classNameHTML.doubleChance.doubleChanceHalf)) {
                 doubleChance.classList.toggle(classNameHTML.doubleChance.doubleChanceHalf, false);
            };
            if (questionNotAnswered && !this.classList.contains(classNameHTML.answersHTML.answerDisabled)) {
                
                canceSubscriptionALL ();

                questionNotAnswered = false;
                this.classList.add(classNameHTML.answersHTML.answerActive);

                answerArr.push(this.textContent);
                
                correctAnswer = th.check(answerArr);
                    
                for (let i = 0; i < answerHTML.length; i++) {
                    if(correctAnswer == answerHTML[i].textContent) {
                        answerId = answerHTML[i];
                    }
                };

                    answerHTML.forEach(function(e, i) {
                        e.classList.add('answer-no-active');
                    });
                    this.classList.toggle('answer-no-active', false)
                timerId1 = setTimeout(function go () {
                    answerId.classList.toggle('answer-no-active', false);
                    answerId.classList.toggle(classNameHTML.answersHTML.correctAnswer);


                    if(correctAnswer != thisCurrent.textContent) {
                        thisCurrent.classList.toggle('answer-no-active', false);
                        thisCurrent.classList.add('answer-wrong');
                    }
                }, 2000);

                setTimeout(function() {
                    // clearTimeout(timerId1);
                    // clearTimeout(timerId2);

                    answerHTML.forEach(function(e, i) {
                            e.classList.toggle('answer-no-active', false);
                            e.classList.toggle('answer-wrong', false);
                            e.classList.toggle(classNameHTML.answersHTML.correctAnswer, false);
                            e.classList.toggle(classNameHTML.answersHTML.answerDisabled, false);
                            e.classList.toggle(classNameHTML.answersHTML.answerActive, false);
                            e.classList.toggle(classNameHTML.answersHTML.answerActive1, false);
                    });

                    callAnswer.textContent = '';
                    answerArr = [];

                    if (th.checkbox || helpChanceTrue) {
                        helpChanceTrue = false;

                        if (th.player.levelPlayer > 14) {

                            th.message.congratulations();
                            th.player.incrementLevel();
                            th.gameOverHTML();
                            return;
                        };

                        th.nextQuestion();

                    } else {
                        th.message.gameOver();
                        th.gameOverHTML();
                    }
                }, 4000);
            }
        }
    }
}