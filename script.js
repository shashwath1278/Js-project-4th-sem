// Game state
let currentMode = '';
let currentLevel = 1;
let gameProgress = {
    memory: [],
    logic: [],
    shapes: [],
    wildcard: []
};

// Initialize game
$(document).ready(function() {
    loadProgress();
    createFloatingShapes();
    createParticles();
});

// Create floating background shapes
function createFloatingShapes() {
    const shapesContainer = $('<div class="floating-shapes"></div>');
    
    // Create 8 floating shapes
    for (let i = 0; i < 8; i++) {
        const shape = $('<div class="floating-shape"></div>');
        shapesContainer.append(shape);
    }
    
    $('body').append(shapesContainer);
}

// Create subtle particle effect
function createParticles() {
    const particlesContainer = $('<div class="particles"></div>');
    
    // Create particles periodically
    setInterval(() => {
        if ($('.particle').length < 15) { // Limit number of particles
            createParticle(particlesContainer);
        }
    }, 800);
    
    $('body').append(particlesContainer);
}

function createParticle(container) {
    const particle = $('<div class="particle"></div>');
    const leftPosition = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2; // 2-5 seconds
    const delay = Math.random() * 2; // 0-2 seconds delay
    
    particle.css({
        left: leftPosition + '%',
        animationDuration: animationDuration + 's',
        animationDelay: delay + 's'
    });
    
    container.append(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, (animationDuration + delay) * 1000);
}

function showHome() {
    $('.card > div:not(.confetti-container)').hide();
    $('#home-screen').fadeIn(500);
    clearConfetti();
}

function showModeSelection() {
    $('.card > div:not(.confetti-container)').hide();
    $('#mode-selection').fadeIn(500);
    clearConfetti();
}

function selectMode(mode) {
    console.log('Mode selected:', mode); // Debug logging
    currentMode = mode;
    console.log('Current mode set to:', currentMode);
    
    const modeTitle = getModeTitle(mode);
    console.log('Mode title:', modeTitle);
    
    $('#mode-title').text(modeTitle);
    console.log('Mode title element updated');
    
    generateLevelGrid();
    console.log('Level grid generated');
    
    $('.card > div:not(.confetti-container)').hide();
    console.log('All screens hidden');
    
    $('#level-selection').fadeIn(500);
    console.log('Level selection screen should be visible');
    
    // Check if level-selection element exists
    if ($('#level-selection').length === 0) {
        console.error('ERROR: #level-selection element not found in DOM!');
        alert('Error: Level selection screen not found. Please check your HTML.');
        return;
    }
    
    // Check if level-grid element exists
    if ($('#level-grid').length === 0) {
        console.error('ERROR: #level-grid element not found in DOM!');
        alert('Error: Level grid not found. Please check your HTML.');
        return;
    }
}

function showLevelSelection() {
    console.log('Showing level selection for mode:', currentMode); // Debug logging
    $('.card > div:not(.confetti-container)').hide();
    $('#level-selection').fadeIn(500);
    clearConfetti();
    
    // Ensure the mode title is set correctly
    if (currentMode) {
        $('#mode-title').text(getModeTitle(currentMode));
    }
}

function getModeTitle(mode) {
    const titles = {
        memory: 'Memory Master',
        logic: 'Logic Puzzles',
        shapes: 'Shape Matcher',
        wildcard: 'Wildcard Mode'
    };
    return titles[mode];
}

function generateLevelGrid() {
    console.log('Generating level grid for mode:', currentMode);
    console.log('Current progress:', gameProgress[currentMode]);
    const grid = $('#level-grid');
    
    if (grid.length === 0) {
        console.error('ERROR: #level-grid element not found!');
        return;
    }
    
    grid.empty();
    console.log('Grid cleared');
    
    for (let i = 1; i <= 5; i++) {
        const btn = $(`<button class="level-btn">${i}</button>`);
        
        if (gameProgress[currentMode] && gameProgress[currentMode].includes(i)) {
            btn.addClass('completed');
            console.log(`Level ${i} marked as completed`);
        }
        
        // Level 1 is always enabled, or if previous level is completed
        if (i === 1 || (gameProgress[currentMode] && gameProgress[currentMode].includes(i - 1))) {
            btn.click(() => {
                console.log(`Level ${i} clicked for mode ${currentMode}`);
                startLevel(i);
            });
            console.log(`Level ${i} enabled`);
        } else {
            btn.prop('disabled', true);
            console.log(`Level ${i} disabled - previous level not completed`);
        }
        
        grid.append(btn);
    }
    
    console.log('Level grid generation complete. Total buttons:', grid.children().length);
    console.log('Enabled levels:', gameProgress[currentMode] ? gameProgress[currentMode].length + 1 : 1);
}

function startLevel(level) {
    console.log('Starting level:', level, 'Mode:', currentMode); // Debug logging
    currentLevel = level;
    
    console.log('About to call updateProgress()');
    try {
        updateProgress();
        console.log('updateProgress() completed successfully');
    } catch (error) {
        console.error('Error in updateProgress():', error);
        console.log('Continuing despite updateProgress() error...');
    }
    
    console.log('About to update game title');
    try {
        $('#game-title').text(`${getModeTitle(currentMode)} - Level ${level}`);
        console.log('Game title updated successfully');
    } catch (error) {
        console.error('Error updating game title:', error);
    }
    
    // Check if game-area exists
    if ($('#game-area').length === 0) {
        console.error('ERROR: #game-area element not found!');
        alert('Error: Game area not found. Please check your HTML.');
        return;
    }
    console.log('game-area element found');
    
    console.log('About to hide all screens');
    $('.card > div:not(.confetti-container)').hide();
    console.log('All screens hidden');
    
    console.log('About to show game-area');
    $('#game-area').fadeIn(500);
    console.log('game-area fadeIn initiated');
    
    clearConfetti();
    console.log('Confetti cleared');
    
    console.log('About to enter switch statement for mode:', currentMode);
    try {
        switch (currentMode) {
            case 'memory':
                console.log('Calling startMemoryGame');
                startMemoryGame(level);
                break;
            case 'logic':
                console.log('Calling startLogicGame');
                startLogicGame(level);
                break;
            case 'shapes':
                console.log('Calling startShapeGame');
                startShapeGame(level);
                break;
            case 'wildcard':
                console.log('About to call startWildcardGame, level:', level);
                startWildcardGame(level);
                console.log('startWildcardGame call completed');
                break;
            default:
                console.error('Unknown game mode:', currentMode);
                alert('Unknown game mode. Please try again.');
                showModeSelection();
        }
        console.log('Switch statement completed successfully');
    } catch (error) {
        console.error('Error starting game:', error);
        console.error('Error stack:', error.stack);
        alert('Error starting game. Please try again.');
        showModeSelection();
    }
    console.log('startLevel function completed');
}

function updateProgress() {
    try {
        console.log('updateProgress() started');
        console.log('currentMode:', currentMode);
        console.log('gameProgress:', gameProgress);
        console.log('gameProgress[currentMode]:', gameProgress[currentMode]);
        
        const completed = gameProgress[currentMode] ? gameProgress[currentMode].length : 0;
        console.log('completed levels:', completed);
        
        const progress = (completed / 5) * 100;
        console.log('progress percentage:', progress);
        
        const progressElement = $('#progress-fill');
        console.log('progress-fill element found:', progressElement.length > 0);
        
        if (progressElement.length > 0) {
            progressElement.css('width', progress + '%');
            console.log('Progress bar updated successfully');
        } else {
            console.error('ERROR: #progress-fill element not found!');
        }
    } catch (error) {
        console.error('Error in updateProgress():', error);
        console.error('Error stack:', error.stack);
    }
}

function completeLevel() {
    console.log('=== completeLevel() START ===');
    console.log('Current level:', currentLevel);
    console.log('Current mode:', currentMode);
    console.log('Progress before update:', JSON.stringify(gameProgress));
    
    // Ensure currentMode exists in gameProgress
    if (!gameProgress[currentMode]) {
        console.log('Creating progress array for mode:', currentMode);
        gameProgress[currentMode] = [];
    }
    
    if (!gameProgress[currentMode].includes(currentLevel)) {
        console.log('Adding level', currentLevel, 'to progress for mode', currentMode);
        gameProgress[currentMode].push(currentLevel);
        gameProgress[currentMode].sort((a, b) => a - b); // Ensure sorted order
        
        console.log('Calling saveProgress()');
        saveProgress();
        console.log('saveProgress() completed');
        
        console.log('Progress after update:', JSON.stringify(gameProgress));
    } else {
        console.log('Level', currentLevel, 'already completed for mode', currentMode);
    }
    
    // Check if all modes completed
    if (gameProgress.memory.length === 5 && 
        gameProgress.logic.length === 5 && 
        gameProgress.shapes.length === 5 &&
        gameProgress.wildcard.length === 5) {
        console.log('All modes completed! Showing success screen');
        showSuccessScreen();
        return;
    }
    
    // Celebrate and return to level selection
    console.log('Celebrating success and preparing to return to level selection');
    celebrateSuccess();
    
    setTimeout(() => {
        console.log('=== TIMEOUT CALLBACK START ===');
        console.log('Returning to level selection for mode:', currentMode);
        
        // Ensure we maintain the current mode context
        const modeTitle = getModeTitle(currentMode);
        console.log('Setting mode title to:', modeTitle);
        $('#mode-title').text(modeTitle);
        
        console.log('Calling showLevelSelection()');
        showLevelSelection();
        
        console.log('Calling generateLevelGrid()');
        generateLevelGrid();
        
        console.log('Level selection screen should now be visible with updated progress');
        console.log('=== TIMEOUT CALLBACK END ===');
    }, 2000);
    
    console.log('=== completeLevel() END ===');
}

function celebrateSuccess() {
    const content = $('#game-content');
    content.html(`
        <div class="celebration-container">
            <h2 style="font-family: 'Fredoka One', cursive; color: #00b894; font-size: 2rem; margin-bottom: 15px;">Level Complete! 🎉</h2>
            <p style="font-size: 1.1rem; color: #666;">Great job! You're getting smarter!</p>
        </div>
    `);
    
    // Add level complete animation to the card
    $('.card').addClass('level-complete');
    setTimeout(() => $('.card').removeClass('level-complete'), 2000);
    
    // Add confetti
    for (let i = 0; i < 25; i++) {
        setTimeout(() => createConfetti(), i * 80);
    }
}

function createConfetti() {
    const colors = ['#ff7675', '#74b9ff', '#00b894', '#fdcb6e', '#a29bfe'];
    const confetti = $('<div class="confetti"></div>');
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 1;
    const randomDuration = Math.random() * 2 + 2;
    
    confetti.css({
        left: randomLeft + '%',
        background: randomColor,
        animation: `confetti-fall ${randomDuration}s linear ${randomDelay}s forwards`
    });
    
    $('#confetti-container').append(confetti);
    
    // Remove confetti after animation
    setTimeout(() => confetti.remove(), (randomDuration + randomDelay) * 1000);
}

function clearConfetti() {
    $('#confetti-container').empty();
}

function showSuccessScreen() {
    $('.card > div:not(.confetti-container)').hide();
    $('#success-screen').fadeIn(500);
    
    // Epic confetti celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(), i * 100);
    }
}

function saveProgress() {
    console.log('Saving progress:', JSON.stringify(gameProgress));
    try {
        localStorage.setItem('puzzlePortalProgress', JSON.stringify(gameProgress));
        console.log('Progress saved successfully to localStorage');
        
        // Verify the save worked
        const saved = localStorage.getItem('puzzlePortalProgress');
        const parsed = JSON.parse(saved);
        console.log('Verified saved progress:', JSON.stringify(parsed));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

function loadProgress() {
    console.log('Loading progress from localStorage');
    try {
        const saved = localStorage.getItem('puzzlePortalProgress');
        if (saved) {
            gameProgress = JSON.parse(saved);
            console.log('Progress loaded:', JSON.stringify(gameProgress));
        } else {
            console.log('No saved progress found, using default');
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        // Reset to default if there's an error
        gameProgress = {
            memory: [],
            logic: [],
            shapes: [],
            wildcard: []
        };
    }
}

function shakeElement(element) {
    element.addClass('shake');
    setTimeout(() => element.removeClass('shake'), 500);
}

// Memory Game (Simon Says)
function startMemoryGame(level) {
    const colors = ['red', 'blue', 'green', 'yellow'];
    let sequence = [];
    let playerSequence = [];
    let showingSequence = false;
    
    // Generate sequence based on level
    const sequenceLength = level + 2;
    for (let i = 0; i < sequenceLength; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Watch the sequence, then repeat it!</p>
            <div class="simon-grid">
                <button class="simon-btn red" data-color="red"></button>
                <button class="simon-btn blue" data-color="blue"></button>
                <button class="simon-btn green" data-color="green"></button>
                <button class="simon-btn yellow" data-color="yellow"></button>
            </div>
            <button class="btn" id="start-sequence">Watch Sequence</button>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    $('#start-sequence').click(function() {
        showSequence();
    });
    
    $('.simon-btn').click(function() {
        if (showingSequence) return;
        
        const color = $(this).data('color');
        playerSequence.push(color);
        
        // Light up button
        $(this).addClass('active');
        setTimeout(() => $(this).removeClass('active'), 200);
        
        // Check if correct
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            // Wrong!
            shakeElement($('.simon-grid'));
            playerSequence = [];
            setTimeout(() => {
                alert('Oops! Try again!');
                showSequence();
            }, 500);
        } else if (playerSequence.length === sequence.length) {
            // Complete!
            setTimeout(() => completeLevel(), 500);
        }
    });
    
    function showSequence() {
        showingSequence = true;
        playerSequence = [];
        $('#start-sequence').hide();
        
        sequence.forEach((color, index) => {
            setTimeout(() => {
                $(`.simon-btn[data-color="${color}"]`).addClass('active');
                setTimeout(() => {
                    $(`.simon-btn[data-color="${color}"]`).removeClass('active');
                    if (index === sequence.length - 1) {
                        showingSequence = false;
                    }
                }, 500);
            }, index * 800);
        });
    }
}

// Logic Game (Code Breaking)
function startLogicGame(level) {
    const codes = [
        { code: '1234', hint: 'Start with 1, end with 4' },
        { code: '2468', hint: 'All even numbers in order' },
        { code: '1357', hint: 'Odd numbers going up' },
        { code: '9876', hint: 'Count down from 9' },
        { code: '5050', hint: 'Same first and last, middle is zero' }
    ];
    
    const levelCode = codes[level - 1];
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Crack the 4-digit code!</p>
            <div class="hint">${levelCode.hint}</div>
            <div class="code-input">
                <input type="number" class="code-digit" min="0" max="9" maxlength="1">
                <input type="number" class="code-digit" min="0" max="9" maxlength="1">
                <input type="number" class="code-digit" min="0" max="9" maxlength="1">
                <input type="number" class="code-digit" min="0" max="9" maxlength="1">
            </div>
            <button class="btn" id="check-code">Check Code</button>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    // Handle input navigation
    $('.code-digit').on('input', function() {
        const value = $(this).val();
        if (value.length > 1) {
            $(this).val(value.slice(-1));
        }
        if (value.length === 1) {
            $(this).next('.code-digit').focus();
        }
    });
    
    $('.code-digit').on('keydown', function(e) {
        if (e.key === 'Backspace' && $(this).val() === '') {
            $(this).prev('.code-digit').focus();
        }
    });
    
    $('#check-code').click(function() {
        let enteredCode = '';
        $('.code-digit').each(function() {
            enteredCode += $(this).val() || '0';
        });
        
        if (enteredCode === levelCode.code) {
            completeLevel();
        } else {
            shakeElement($('.code-input'));
            $('.code-digit').val('').first().focus();
        }
    });
}

// Shape Game (Drag and Drop)
function startShapeGame(level) {
    const gameModes = [
        { shapes: ['circle red'], targets: ['circle red'] },
        { shapes: ['circle red', 'square blue'], targets: ['circle red', 'square blue'] },
        { shapes: ['circle red', 'square blue', 'triangle green'], targets: ['triangle green', 'circle red', 'square blue'] },
        { shapes: ['circle red', 'square blue', 'triangle green', 'circle yellow'], targets: ['circle yellow', 'triangle green', 'square blue', 'circle red'] },
        { shapes: ['circle red', 'square blue', 'triangle green', 'circle yellow', 'square purple'], targets: ['square purple', 'circle yellow', 'triangle green', 'square blue', 'circle red'] }
    ];
    
    const levelData = gameModes[level - 1];
    
    let shapesHtml = '<div class="shapes-left"><h4>Drag these shapes:</h4>';
    levelData.shapes.forEach((shape, index) => {
        const [shapeType, color] = shape.split(' ');
        shapesHtml += `<div class="draggable-shape ${shapeType} ${color}-shape" data-shape="${shape}" data-id="${index}"></div>`;
    });
    shapesHtml += '</div>';
    
    let targetsHtml = '<div class="shapes-right"><h4>To these targets:</h4>';
    levelData.targets.forEach((target, index) => {
        const [shapeType, color] = target.split(' ');
        targetsHtml += `<div class="shape-target ${shapeType} ${color}-shape" data-target="${target}" data-slot="${index}"></div>`;
    });
    targetsHtml += '</div>';
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Match the shapes to their targets!</p>
            <div class="shapes-container">
                ${shapesHtml}
                ${targetsHtml}
            </div>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    let correctPlacements = 0;
    
    $('.draggable-shape').draggable({
        revert: 'invalid',
        cursor: 'grabbing',
        zIndex: 1000
    });
    
    $('.shape-target').droppable({
        accept: function(draggable) {
            return $(draggable).data('shape') === $(this).data('target');
        },
        drop: function(event, ui) {
            const shape = ui.draggable;
            const target = $(this);
            
            // Position shape in target
            shape.position({
                my: 'center',
                at: 'center',
                of: target
            });
            
            shape.draggable('disable');
            target.addClass('filled');
            correctPlacements++;
            
            if (correctPlacements === levelData.targets.length) {
                setTimeout(() => completeLevel(), 500);
            }
        },
        hoverClass: 'ui-droppable-hover'
    });
}

// Wildcard Game (Unique Challenges)
function startWildcardGame(level) {
    console.log('startWildcardGame() function entered, level:', level);
    
    // Check if game-content exists
    if ($('#game-content').length === 0) {
        console.error('ERROR: #game-content element not found!');
        alert('Error: Game content area not found. Please check your HTML.');
        return;
    }
    console.log('game-content element found');
    
    console.log('About to enter wildcard switch statement for level:', level);
    try {
        switch (level) {
            case 1:
                console.log('Level 1 case entered, calling startReactionGame()');
                startReactionGame();
                console.log('startReactionGame() call completed');
                break;
            case 2:
                console.log('Level 2 case entered');
                startPatternCompleteGame();
                break;
            case 3:
                console.log('Level 3 case entered');
                startColorMixGame();
                break;
            case 4:
                console.log('Level 4 case entered');
                startWordScrambleGame();
                break;
            case 5:
                console.log('Level 5 case entered');
                startRhythmGame();
                break;
            default:
                console.error('Unknown wildcard level:', level);
                alert('Level not implemented yet!');
                showLevelSelection();
        }
        console.log('Wildcard switch statement completed');
    } catch (error) {
        console.error('Error in wildcard game:', error);
        console.error('Error stack:', error.stack);
        alert('Error starting wildcard game. Please try again.');
        showLevelSelection();
    }
    console.log('startWildcardGame() function completed');
}

// Level 1: Reaction Time Challenge
function startReactionGame() {
    console.log('startReactionGame() called');
    let startTime = 0;
    let gameStarted = false;
    let gameCompleted = false; // Prevent multiple completions
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Click the button as soon as it turns green!</p>
            <div id="reaction-area" style="width: 200px; height: 200px; margin: 20px auto; border-radius: 50%; background: #ff7675; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white; transition: all 0.3s;">
                Click to Start
            </div>
            <div id="reaction-result" style="font-size: 1.1rem; margin-top: 20px;"></div>
        </div>
    `;
    
    console.log('Setting game content HTML');
    $('#game-content').html(gameHtml);
    console.log('Game content HTML set, checking if reaction-area was created');
    
    if ($('#reaction-area').length === 0) {
        console.error('ERROR: #reaction-area was not created!');
        return;
    }
    
    console.log('reaction-area found, setting up click handler');
    
    $('#reaction-area').click(function() {
        if (gameCompleted) {
            console.log('Game already completed, ignoring click');
            return;
        }
        
        console.log('reaction-area clicked, gameStarted:', gameStarted);
        if (!gameStarted) {
            console.log('Starting reaction game...');
            $(this).css('background', '#fdcb6e').text('Wait...');
            const delay = Math.random() * 3000 + 1000; // 1-4 seconds
            console.log('Will turn green after:', delay, 'ms');
            setTimeout(() => {
                if (gameCompleted) {
                    console.log('Game completed during wait, not turning green');
                    return;
                }
                console.log('Turning green now!');
                $('#reaction-area').css('background', '#00b894').text('CLICK NOW!');
                startTime = Date.now();
                gameStarted = true;
            }, delay);
        } else {
            const reactionTime = Date.now() - startTime;
            console.log('Reaction time:', reactionTime, 'ms');
            
            // Mark game as completed immediately to prevent double-clicks
            gameCompleted = true;
            gameStarted = false;
            
            $('#reaction-result').text(`Your reaction time: ${reactionTime}ms`);
            
            // Very lenient threshold - almost everyone should pass
            if (reactionTime < 2000) { // 2 seconds should be achievable by anyone
                console.log('SUCCESS! Reaction time is good enough, completing level...');
                $('#reaction-area').css('background', '#00b894').text('SUCCESS!');
                $('#reaction-result').html(`Your reaction time: ${reactionTime}ms<br><span style="color: #00b894; font-weight: bold;">Great job! Level complete!</span>`);
                
                // Complete the level immediately
                console.log('About to call completeLevel() for reaction game');
                setTimeout(() => {
                    console.log('Timeout expired, calling completeLevel() now');
                    completeLevel();
                }, 1000); // Reduced delay to 1 second for faster feedback
            } else {
                console.log('Too slow, allowing retry');
                $('#reaction-result').html(`Your reaction time: ${reactionTime}ms<br><span style="color: #ff7675; font-weight: bold;">Too slow! Try again.</span>`);
                setTimeout(() => {
                    console.log('Resetting for retry');
                    gameCompleted = false; // Allow retry
                    $('#reaction-area').css('background', '#ff7675').text('Click to Start');
                    $('#reaction-result').text('');
                }, 2000);
            }
        }
    });
    
    console.log('startReactionGame() setup complete');
}

// Level 2: Pattern Completion
function startPatternCompleteGame() {
    console.log('startPatternCompleteGame() called');
    const patterns = [
        [1, 2, 4, 8, '?'], // Powers of 2
        [2, 4, 6, 8, '?'], // Even numbers
        [1, 1, 2, 3, '?'], // Fibonacci
        [10, 8, 6, 4, '?'], // Decreasing by 2
        [1, 4, 9, 16, '?'] // Perfect squares
    ];
    
    const answers = [16, 10, 5, 2, 25];
    const randomIndex = Math.floor(Math.random() * patterns.length);
    const pattern = patterns[randomIndex];
    const correctAnswer = answers[randomIndex];
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Complete the pattern!</p>
            <div class="pattern-display">
                ${pattern.map(num => `<div class="pattern-box">${num}</div>`).join('')}
            </div>
            <input type="number" id="pattern-answer" placeholder="?" style="width: 80px; padding: 10px; margin: 20px; text-align: center; font-size: 1.2rem;">
            <br>
            <button class="btn" id="check-pattern">Check Answer</button>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    $('#check-pattern').click(function() {
        const userAnswer = parseInt($('#pattern-answer').val());
        if (userAnswer === correctAnswer) {
            completeLevel();
        } else {
            shakeElement($('#pattern-answer'));
            $('#pattern-answer').val('');
        }
    });
}

// Level 3: Color Mixing Challenge
function startColorMixGame() {
    console.log('startColorMixGame() called');
    const colorMixes = [
        { colors: ['red', 'blue'], result: 'purple' },
        { colors: ['red', 'yellow'], result: 'orange' },
        { colors: ['blue', 'yellow'], result: 'green' },
        { colors: ['red', 'green'], result: 'brown' },
        { colors: ['blue', 'red', 'yellow'], result: 'black' }
    ];
    
    const randomMix = colorMixes[Math.floor(Math.random() * colorMixes.length)];
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">What color do you get when you mix:</p>
            <div class="color-mix-display">
                ${randomMix.colors.map(color => `<div class="color-circle ${color}"></div>`).join(' + ')}
                <div style="font-size: 2rem; margin: 0 10px;">=</div>
                <div class="color-circle question">?</div>
            </div>
            <div class="color-options">
                <button class="color-option purple" data-color="purple">Purple</button>
                <button class="color-option orange" data-color="orange">Orange</button>
                <button class="color-option green" data-color="green">Green</button>
                <button class="color-option brown" data-color="brown">Brown</button>
                <button class="color-option black" data-color="black">Black</button>
            </div>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    $('.color-option').click(function() {
        const selectedColor = $(this).data('color');
        if (selectedColor === randomMix.result) {
            completeLevel();
        } else {
            shakeElement($('.color-options'));
        }
    });
}

// Level 4: Word Scramble
function startWordScrambleGame() {
    console.log('startWordScrambleGame() called');
    const words = [
        { word: 'PUZZLE', scrambled: 'ZZLEPU' },
        { word: 'BRAIN', scrambled: 'NIARB' },
        { word: 'SMART', scrambled: 'TRAMS' },
        { word: 'LOGIC', scrambled: 'CIGOL' },
        { word: 'THINK', scrambled: 'KNIHT' }
    ];
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Unscramble this word:</p>
            <div class="scrambled-word">${randomWord.scrambled}</div>
            <input type="text" id="word-answer" placeholder="Enter the word" style="width: 200px; padding: 10px; margin: 20px; text-align: center; font-size: 1.2rem; text-transform: uppercase;">
            <br>
            <button class="btn" id="check-word">Check Word</button>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    $('#word-answer').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
    
    $('#check-word').click(function() {
        const userAnswer = $('#word-answer').val().trim();
        if (userAnswer === randomWord.word) {
            completeLevel();
        } else {
            shakeElement($('#word-answer'));
            $('#word-answer').val('');
        }
    });
}

// Level 5: Rhythm Matching
function startRhythmGame() {
    console.log('startRhythmGame() called');
    const rhythms = [
        [500, 500, 1000, 500], // Short-Short-Long-Short
        [1000, 500, 500, 1000], // Long-Short-Short-Long
        [500, 1000, 500, 500], // Short-Long-Short-Short
        [750, 750, 500, 500], // Medium-Medium-Short-Short
        [500, 500, 500, 1500] // Short-Short-Short-Very Long
    ];
    
    const randomRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    let playerRhythm = [];
    let lastTap = 0;
    let listening = false;
    
    const gameHtml = `
        <div style="text-align: center;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Listen to the rhythm, then tap it back!</p>
            <div id="rhythm-area" style="width: 200px; height: 200px; margin: 20px auto; border-radius: 50%; background: #74b9ff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: white;">
                Click to Hear Rhythm
            </div>
            <button class="btn" id="start-tapping" style="display: none;">Start Tapping</button>
            <div id="rhythm-feedback" style="margin-top: 20px;"></div>
        </div>
    `;
    
    $('#game-content').html(gameHtml);
    
    $('#rhythm-area').click(function() {
        if (!listening) {
            playRhythm();
        } else {
            const currentTime = Date.now();
            if (lastTap === 0) {
                lastTap = currentTime;
                playerRhythm = [];
            } else {
                const interval = currentTime - lastTap;
                playerRhythm.push(interval);
                lastTap = currentTime;
                
                if (playerRhythm.length === randomRhythm.length) {
                    checkRhythm();
                }
            }
            
            // Visual feedback
            $(this).css('background', '#00b894');
            setTimeout(() => $(this).css('background', '#74b9ff'), 100);
        }
    });
    
    function playRhythm() {
        $('#rhythm-area').text('Listen...');
        let totalTime = 0;
        
        randomRhythm.forEach((duration, index) => {
            setTimeout(() => {
                $('#rhythm-area').css('background', '#00b894');
                setTimeout(() => {
                    $('#rhythm-area').css('background', '#74b9ff');
                    if (index === randomRhythm.length - 1) {
                        setTimeout(() => {
                            $('#rhythm-area').text('Tap the Rhythm!');
                            listening = true;
                        }, 500);
                    }
                }, 200);
            }, totalTime);
            totalTime += duration;
        });
    }
    
    function checkRhythm() {
        let accurate = true;
        const tolerance = 200; // 200ms tolerance
        
        for (let i = 0; i < randomRhythm.length; i++) {
            if (Math.abs(playerRhythm[i] - randomRhythm[i]) > tolerance) {
                accurate = false;
                break;
            }
        }
        
        if (accurate) {
            completeLevel();
        } else {
            $('#rhythm-feedback').text('Not quite right! Try again.');
            setTimeout(() => {
                listening = false;
                lastTap = 0;
                playerRhythm = [];
                $('#rhythm-area').text('Click to Hear Rhythm');
                $('#rhythm-feedback').text('');
            }, 2000);
        }
    }
}
//# sourceMappingURL=script.js.map