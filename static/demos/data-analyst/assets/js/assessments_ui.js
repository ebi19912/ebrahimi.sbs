document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAssessments, 200);
});

let currentFcIndex = 0;
let currentQuizIndex = 0;
let currentModuleFlashcards = [];
let currentModuleQuizzes = [];
let fcShowingBack = false;

function initAssessments() {
    if (!window.bootcampApp) return;

    // Hook into renderCurrentStep to detect module changes
    const originalRender = window.bootcampApp.renderCurrentStep;
    window.bootcampApp.renderCurrentStep = function(shouldScroll) {
        originalRender.call(this, shouldScroll);
        loadAssessmentsData();
    };

    // Tab Buttons
    const btnLearn = document.getElementById('tabLearnBtn');
    const btnFlashcards = document.getElementById('tabFlashcardsBtn');
    const btnQuiz = document.getElementById('tabQuizBtn');

    // Containers
    const containerLearn = document.getElementById('learnContainer');
    const containerFc = document.getElementById('flashcardsContainer');
    const containerQuiz = document.getElementById('quizContainer');

    function switchTab(tab) {
        // Reset styles
        [btnLearn, btnFlashcards, btnQuiz].forEach(btn => {
            btn.className = 'px-4 py-2 rounded-xl text-sm font-bold text-[#8C847B] hover:text-[#201F1E] dark:hover:text-white transition cursor-pointer';
        });

        // Hide all containers
        containerLearn.classList.add('hidden');
        containerFc.classList.add('hidden');
        containerQuiz.classList.add('hidden');

        if (tab === 'learn') {
            btnLearn.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-[#383531] text-[#201F1E] dark:text-white shadow-sm transition';
            containerLearn.classList.remove('hidden');
        } else if (tab === 'flashcards') {
            btnFlashcards.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-[#383531] text-[#201F1E] dark:text-white shadow-sm transition';
            containerFc.classList.remove('hidden');
            renderFlashcard();
        } else if (tab === 'quiz') {
            btnQuiz.className = 'px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-[#383531] text-[#201F1E] dark:text-white shadow-sm transition';
            containerQuiz.classList.remove('hidden');
            renderQuiz();
        }
    }

    btnLearn.addEventListener('click', () => switchTab('learn'));
    btnFlashcards.addEventListener('click', () => switchTab('flashcards'));
    btnQuiz.addEventListener('click', () => switchTab('quiz'));

    // Flashcard UI
    const fcArea = document.getElementById('flashcardArea');
    const fcPrev = document.getElementById('fcPrevBtn');
    const fcNext = document.getElementById('fcNextBtn');

    fcArea.addEventListener('click', () => {
        const fcBack = document.getElementById('fcBack');
        if (fcBack.classList.contains('hidden')) {
            fcBack.classList.remove('hidden');
            fcShowingBack = true;
        } else {
            fcBack.classList.add('hidden');
            fcShowingBack = false;
        }
    });

    fcPrev.addEventListener('click', () => {
        if (currentFcIndex > 0) {
            currentFcIndex--;
            renderFlashcard();
        }
    });

    fcNext.addEventListener('click', () => {
        if (currentFcIndex < currentModuleFlashcards.length - 1) {
            currentFcIndex++;
            renderFlashcard();
        }
    });

    // Quiz UI
    const quizPrev = document.getElementById('quizPrevBtn');
    const quizNext = document.getElementById('quizNextBtn');

    quizPrev.addEventListener('click', () => {
        if (currentQuizIndex > 0) {
            currentQuizIndex--;
            renderQuiz();
        }
    });

    quizNext.addEventListener('click', () => {
        if (currentQuizIndex < currentModuleQuizzes.length - 1) {
            currentQuizIndex++;
            renderQuiz();
        }
    });

    // Initial load
    loadAssessmentsData();
}

function loadAssessmentsData() {
    const app = window.bootcampApp;
    const mod = app.getCurrentModule();
    if (!mod) return;

    const modId = mod.id;
    currentModuleFlashcards = (window.BOOTCAMP_FLASHCARDS && window.BOOTCAMP_FLASHCARDS[modId]) || [];
    currentModuleQuizzes = (window.BOOTCAMP_QUIZZES && window.BOOTCAMP_QUIZZES[modId]) || [];

    currentFcIndex = 0;
    currentQuizIndex = 0;

    // Auto-hide tabs if no data available OR if it's NOT the last step
    const tabFcBtn = document.getElementById('tabFlashcardsBtn');
    const tabQzBtn = document.getElementById('tabQuizBtn');
    const tabsWrapper = document.getElementById('assessmentTabsWrapper');
    
    const isLastStep = (app.currentStepIndex === mod.steps.length - 1);
    const hasAssessments = currentModuleFlashcards.length > 0 || currentModuleQuizzes.length > 0;
    
    if (!hasAssessments || !isLastStep) {
        if(tabsWrapper) tabsWrapper.style.display = 'none';
        tabFcBtn.style.display = 'none';
        tabQzBtn.style.display = 'none';
    } else {
        if(tabsWrapper) tabsWrapper.style.display = 'flex';
        tabFcBtn.style.display = currentModuleFlashcards.length > 0 ? 'inline-block' : 'none';
        tabQzBtn.style.display = currentModuleQuizzes.length > 0 ? 'inline-block' : 'none';
    }

    // Always reset to Learn tab when navigating
    document.getElementById('tabLearnBtn').click();
}

function renderFlashcard() {
    const frontEl = document.getElementById('fcFront');
    const backEl = document.getElementById('fcBack');
    const countEl = document.getElementById('fcCount');
    const prevBtn = document.getElementById('fcPrevBtn');
    const nextBtn = document.getElementById('fcNextBtn');

    if (currentModuleFlashcards.length === 0) {
        frontEl.innerText = 'فلش‌کارتی برای این بخش ثبت نشده است.';
        backEl.classList.add('hidden');
        countEl.innerText = '۰ از ۰';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    const card = currentModuleFlashcards[currentFcIndex];
    frontEl.innerText = card.front;
    backEl.innerText = card.back;
    backEl.classList.add('hidden');
    fcShowingBack = false;

    countEl.innerText = `${currentFcIndex + 1} از ${currentModuleFlashcards.length}`;
    
    prevBtn.disabled = currentFcIndex === 0;
    nextBtn.disabled = currentFcIndex === currentModuleFlashcards.length - 1;
    
    prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
}

function renderQuiz() {
    const qText = document.getElementById('quizQuestionText');
    const optsDiv = document.getElementById('quizOptions');
    const expDiv = document.getElementById('quizExplanation');
    const countEl = document.getElementById('quizCount');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');

    if (currentModuleQuizzes.length === 0) {
        qText.innerText = 'آزمونی برای این بخش ثبت نشده است.';
        optsDiv.innerHTML = '';
        expDiv.classList.add('hidden');
        countEl.innerText = '۰ از ۰';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    const q = currentModuleQuizzes[currentQuizIndex];
    qText.innerText = q.question;
    expDiv.innerText = q.explanation;
    expDiv.classList.add('hidden');

    optsDiv.innerHTML = '';
    q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-right p-4 rounded-xl border border-[#E3DDD4] dark:border-[#383531] bg-white dark:bg-[#2D2B28] hover:bg-[#F4EFEA] dark:hover:bg-[#383531] text-[#201F1E] dark:text-white font-medium transition cursor-pointer';
        btn.innerText = optText;
        btn.onclick = () => {
            // Disable all buttons
            Array.from(optsDiv.children).forEach(b => b.disabled = true);
            
            if (idx === q.correctIndex) {
                btn.classList.replace('bg-white', 'bg-[#EBF7EE]');
                btn.classList.replace('dark:bg-[#2D2B28]', 'dark:bg-[#10B981]/20');
                btn.classList.replace('border-[#E3DDD4]', 'border-[#10B981]');
                btn.classList.add('text-[#15803D]');
            } else {
                btn.classList.replace('bg-white', 'bg-[#FEE2E2]');
                btn.classList.replace('dark:bg-[#2D2B28]', 'dark:bg-[#EF4444]/20');
                btn.classList.replace('border-[#E3DDD4]', 'border-[#EF4444]');
                btn.classList.add('text-[#B91C1C]');
                
                // Highlight correct
                optsDiv.children[q.correctIndex].classList.replace('bg-white', 'bg-[#EBF7EE]');
                optsDiv.children[q.correctIndex].classList.replace('dark:bg-[#2D2B28]', 'dark:bg-[#10B981]/20');
                optsDiv.children[q.correctIndex].classList.replace('border-[#E3DDD4]', 'border-[#10B981]');
                optsDiv.children[q.correctIndex].classList.add('text-[#15803D]');
            }
            expDiv.classList.remove('hidden');
        };
        optsDiv.appendChild(btn);
    });

    countEl.innerText = `${currentQuizIndex + 1} از ${currentModuleQuizzes.length}`;
    
    prevBtn.disabled = currentQuizIndex === 0;
    nextBtn.disabled = currentQuizIndex === currentModuleQuizzes.length - 1;

    prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
}
