/**
 * DataAnalyst Bootcamp: Step-by-Step Interactive Reader Controller
 * Handles page-by-page navigation, Table of Contents dialog, progress tracking,
 * one-click code copy, and dark/light theme persistence.
 */

class BootcampApp {
    constructor() {
        this.modules = (window.BOOTCAMP_MODULES || []).sort((a, b) => a.number.localeCompare(b.number));
        this.currentModuleIndex = 0;
        this.currentStepIndex = 0;
        this.completedSteps = new Set();
        this.isDark = false;
    }

    init() {
        this.loadSavedState();
        this.initTheme();
        this.bindEvents();
        this.renderModulePills();
        this.renderCurrentStep(false);
        this.updateOverallProgress();

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    loadSavedState() {
        try {
            const savedCompleted = localStorage.getItem('da_completed_steps');
            if (savedCompleted) {
                this.completedSteps = new Set(JSON.parse(savedCompleted));
            }
            const savedModId = localStorage.getItem('da_current_mod_id');
            const savedStepIdx = parseInt(localStorage.getItem('da_current_step_idx') || '0', 10);

            if (savedModId) {
                const modIdx = this.modules.findIndex(m => m.id === savedModId);
                if (modIdx !== -1) {
                    this.currentModuleIndex = modIdx;
                    const maxSteps = this.modules[modIdx].steps.length;
                    this.currentStepIndex = (savedStepIdx >= 0 && savedStepIdx < maxSteps) ? savedStepIdx : 0;
                }
            }
        } catch (err) {
            console.warn('Could not load saved state:', err);
        }
    }

    saveCurrentPosition() {
        try {
            const mod = this.getCurrentModule();
            if (!mod) return;
            localStorage.setItem('da_current_mod_id', mod.id);
            localStorage.setItem('da_current_step_idx', String(this.currentStepIndex));
        } catch (err) {
            console.warn('Could not save position:', err);
        }
    }

    saveCompletedSteps() {
        try {
            localStorage.setItem('da_completed_steps', JSON.stringify(Array.from(this.completedSteps)));
        } catch (err) {
            console.warn('Could not save completed steps:', err);
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('da_theme');
        if (savedTheme === 'dark') {
            this.isDark = true;
            document.documentElement.classList.add('dark');
        } else {
            this.isDark = false;
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        if (this.isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('da_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('da_theme', 'light');
        }
        this.updateThemeIcon();
        this.showToast(this.isDark ? 'تم تاریک فعال شد' : 'تم روشن فعال شد');
    }

    updateThemeIcon() {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;
        btn.innerHTML = this.isDark
            ? `<i data-lucide="sun" class="w-4 h-4 text-[#FFCF68]" aria-hidden="true"></i>`
            : `<i data-lucide="moon" class="w-4 h-4 text-[#201F1E]" aria-hidden="true"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    getCurrentModule() {
        return this.modules[this.currentModuleIndex] || this.modules[0];
    }

    getCurrentStep() {
        const mod = this.getCurrentModule();
        if (!mod || !mod.steps || mod.steps.length === 0) return null;
        return mod.steps[this.currentStepIndex] || mod.steps[0];
    }

    bindEvents() {
        // Theme toggle
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

        // Prev / Next buttons (Top & Bottom)
        const prevBtns = [document.getElementById('topPrevStepBtn'), document.getElementById('bottomPrevStepBtn')];
        const nextBtns = [document.getElementById('topNextStepBtn'), document.getElementById('bottomNextStepBtn')];

        prevBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.goPrevStep());
        });

        nextBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.goNextStep());
        });

        // TOC Modal buttons
        const tocBtns = [
            document.getElementById('openTocHeaderBtn'),
            document.getElementById('topTocBtn'),
            document.getElementById('bottomTocBtn')
        ];
        tocBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.openTocDialog());
        });

        // TOC Search input
        const searchInput = document.getElementById('tocSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.renderTocModalList(e.target.value.trim());
            });
        }

        // Toggle Step Done button
        const doneBtn = document.getElementById('toggleStepDoneBtn');
        if (doneBtn) {
            doneBtn.addEventListener('click', () => this.toggleCurrentStepCompleted());
        }

        // Keyboard navigation (RTL: ArrowLeft -> Next Step, ArrowRight -> Previous Step)
        document.addEventListener('keydown', (e) => {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            const tocDialog = document.getElementById('tocDialog');
            if (activeTag === 'input' || activeTag === 'textarea' || (tocDialog && tocDialog.open)) {
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goNextStep();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goPrevStep();
            }
        });
    }

    renderModulePills() {
        const container = document.getElementById('modulePillsContainer');
        if (!container) return;

        container.innerHTML = this.modules.map((mod, idx) => {
            const isActive = idx === this.currentModuleIndex;
            const completedCount = mod.steps.filter(s => this.completedSteps.has(s.id)).length;
            const isReady = !mod.isUpcoming;
            return `
                <button type="button"
                    class="module-pill-btn ${isActive ? 'active' : ''} ${!isReady ? 'opacity-75' : ''}"
                    data-mod-idx="${idx}"
                    title="${mod.title} (${mod.steps.length} گام)">
                    <i data-lucide="${mod.icon || 'folder'}" class="w-3.5 h-3.5" aria-hidden="true"></i>
                    <span class="font-mono text-[11px]">${mod.number}</span>
                    <span>${mod.shortTitle || mod.folderName}</span>
                    ${isReady ? `<span class="text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 dark:bg-black/20' : 'bg-[#F4EFEA] dark:bg-[#2D2B28]'} font-mono">${completedCount}/${mod.steps.length}</span>` : `<span class="text-[10px] opacity-75">گام بعدی</span>`}
                </button>
            `;
        }).join('');

        container.querySelectorAll('.module-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetIdx = parseInt(btn.getAttribute('data-mod-idx'), 10);
                this.selectModule(targetIdx, 0);
            });
        });

        if (window.lucide) lucide.createIcons();
    }

    selectModule(modIdx, stepIdx = 0) {
        if (modIdx < 0 || modIdx >= this.modules.length) return;
        this.currentModuleIndex = modIdx;
        this.currentStepIndex = stepIdx;
        this.saveCurrentPosition();
        this.renderModulePills();
        this.renderCurrentStep(true);
    }

    goToStep(stepIdx) {
        const mod = this.getCurrentModule();
        if (!mod || stepIdx < 0 || stepIdx >= mod.steps.length) return;
        this.currentStepIndex = stepIdx;
        this.saveCurrentPosition();
        this.renderCurrentStep(true);
    }

    goNextStep() {
        const mod = this.getCurrentModule();
        if (!mod) return;

        // Automatically mark current step as read when advancing with the Next arrow
        const curStep = this.getCurrentStep();
        if (curStep && !mod.isUpcoming) {
            this.completedSteps.add(curStep.id);
            this.saveCompletedSteps();
            this.updateOverallProgress();
        }

        if (this.currentStepIndex < mod.steps.length - 1) {
            this.currentStepIndex++;
            this.saveCurrentPosition();
            this.renderModulePills();
            this.renderCurrentStep(true);
        } else if (this.currentModuleIndex < this.modules.length - 1) {
            this.currentModuleIndex++;
            this.currentStepIndex = 0;
            this.saveCurrentPosition();
            this.renderModulePills();
            this.renderCurrentStep(true);
            this.showToast(`وارد بخش ${this.getCurrentModule().folderName} شدید`);
        }
    }

    goPrevStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.saveCurrentPosition();
            this.renderCurrentStep(true);
        } else if (this.currentModuleIndex > 0) {
            this.currentModuleIndex--;
            const prevMod = this.getCurrentModule();
            this.currentStepIndex = Math.max(0, prevMod.steps.length - 1);
            this.saveCurrentPosition();
            this.renderModulePills();
            this.renderCurrentStep(true);
            this.showToast(`بازگشت به بخش ${prevMod.folderName}`);
        }
    }

    toggleCurrentStepCompleted() {
        const step = this.getCurrentStep();
        if (!step) return;

        if (this.completedSteps.has(step.id)) {
            this.completedSteps.delete(step.id);
            this.showToast('علامت مطالعه این گام برداشته شد');
        } else {
            this.completedSteps.add(step.id);
            this.showToast('این گام به‌عنوان مطالعه‌شده ثبت شد ✓');
        }
        this.saveCompletedSteps();
        this.updateStepDoneButton();
        this.renderStepDots();
        this.renderModulePills();
        this.updateOverallProgress();
    }

    updateStepDoneButton() {
        const step = this.getCurrentStep();
        const btn = document.getElementById('toggleStepDoneBtn');
        if (!btn || !step) return;

        const isDone = this.completedSteps.has(step.id);
        if (isDone) {
            btn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#10B981] bg-[#EBF7EE] dark:bg-[#10B981]/20 text-[#15803D] dark:text-[#34D399] text-xs font-extrabold transition cursor-pointer';
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4" aria-hidden="true"></i><span>مطالعه شد ✓</span>`;
        } else {
            btn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E3DDD4] dark:border-[#383531] bg-[#F9F7F4] dark:bg-[#2D2B28] text-[#5C564F] dark:text-[#C4BDB3] hover:border-[#B5A18B] text-xs font-bold transition cursor-pointer';
            btn.innerHTML = `<i data-lucide="circle" class="w-4 h-4" aria-hidden="true"></i><span>علامت‌گذاری به‌عنوان خوانده‌شده</span>`;
        }
        if (window.lucide) lucide.createIcons();
    }

    updateOverallProgress() {
        const activeModules = this.modules.filter(m => !m.isUpcoming);
        const totalSteps = activeModules.reduce((acc, m) => acc + m.steps.length, 0);
        const doneSteps = activeModules.reduce(
            (acc, m) => acc + m.steps.filter(s => this.completedSteps.has(s.id)).length,
            0
        );
        const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
        const textEl = document.getElementById('overallProgressText');
        if (textEl) {
            textEl.textContent = `${this.toPersianDigits(doneSteps)} از ${this.toPersianDigits(totalSteps)} گام فعال (${this.toPersianDigits(pct)}٪)`;
        }
    }

    renderStepDots() {
        const mod = this.getCurrentModule();
        const dotsContainer = document.getElementById('stepDotsContainer');
        if (!mod || !dotsContainer) return;

        dotsContainer.innerHTML = mod.steps.map((step, idx) => {
            const isActive = idx === this.currentStepIndex;
            const isDone = this.completedSteps.has(step.id);
            return `
                <button type="button"
                    role="tab"
                    aria-selected="${isActive}"
                    class="step-dot-btn ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}"
                    data-step-idx="${idx}"
                    title="گام ${this.toPersianDigits(idx + 1)}: ${step.title}">
                    ${this.toPersianDigits(idx + 1)}
                </button>
            `;
        }).join('');

        dotsContainer.querySelectorAll('.step-dot-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-step-idx'), 10);
                this.goToStep(idx);
            });
        });
    }

    renderCurrentStep(scrollToTop = true) {
        const mod = this.getCurrentModule();
        const step = this.getCurrentStep();
        if (!mod || !step) return;

        // 1. Update Top Bar Info
        document.getElementById('topModuleFolderBadge').textContent = mod.folderName;
        document.getElementById('topModuleTitleText').textContent = mod.title;
        document.getElementById('topStepCounterText').textContent =
            `گام ${this.toPersianDigits(this.currentStepIndex + 1)} از ${this.toPersianDigits(mod.steps.length)}`;

        this.renderStepDots();

        // 2. Update Step Header Metadata
        document.getElementById('stepTypeBadge').textContent = step.badge || 'آموزش گام‌به‌گام';
        document.getElementById('stepTimeText').textContent = step.estimatedTime || '۲۰ دقیقه';
        document.getElementById('stepFilePathText').textContent = mod.filePath || mod.folderName;
        document.getElementById('stepMainTitle').textContent = step.title;
        document.getElementById('stepSummaryText').textContent = step.summary || '';

        this.updateStepDoneButton();

        // 3. Render Main Lesson Prose HTML
        const contentEl = document.getElementById('stepContentHtml');
        contentEl.innerHTML = step.contentHtml || '';
        this.enhanceInlinePreBlocks(contentEl);

        // 4. Render Structured Code Blocks
        const codeSection = document.getElementById('stepCodeBlocksSection');
        const codeContainer = document.getElementById('stepCodeBlocksContainer');
        if (step.codeBlocks && step.codeBlocks.length > 0) {
            codeSection.classList.remove('hidden');
            codeContainer.innerHTML = step.codeBlocks.map((cb, idx) =>
                this.buildCodeBlockHtml(cb.code, cb.language || 'sql', cb.title || `قطعه کد ${this.toPersianDigits(idx + 1)}`, cb.description)
            ).join('');
        } else {
            codeSection.classList.add('hidden');
            codeContainer.innerHTML = '';
        }

        // 5. Render Real-World Industry Exercises
        const exSection = document.getElementById('stepExercisesSection');
        const exContainer = document.getElementById('stepExercisesContainer');
        const exCountBadge = document.getElementById('exerciseCountBadge');

        if (step.industryExercises && step.industryExercises.length > 0) {
            exSection.classList.remove('hidden');
            exCountBadge.textContent = `${this.toPersianDigits(step.industryExercises.length)} چالش واقعی صنعت`;
            exContainer.innerHTML = step.industryExercises.map((ex, idx) => `
                <div class="p-4 sm:p-6 rounded-2xl bg-[#F9F7F4] dark:bg-[#1E1C1A] border border-[#E3DDD4] dark:border-[#383531] space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DDD4] dark:border-[#383531] pb-3">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-lg bg-[#201F1E] text-[#FFCF68] dark:bg-[#FFCF68] dark:text-[#201F1E] font-extrabold text-xs flex items-center justify-center shrink-0">
                                ${this.toPersianDigits(idx + 1)}
                            </span>
                            <h3 class="font-extrabold text-sm sm:text-base text-[#201F1E] dark:text-white">${ex.title}</h3>
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="px-2.5 py-0.5 rounded-full bg-[#EBF7EE] dark:bg-[#10B981]/15 text-[#15803D] dark:text-[#34D399] text-[11px] font-bold">
                                صنعت: ${ex.industry}
                            </span>
                            <span class="px-2.5 py-0.5 rounded-full bg-[#FFF8E7] dark:bg-[#FFCF68]/15 text-[#8A6200] dark:text-[#FFCF68] text-[11px] font-bold">
                                سطح: ${ex.difficulty || 'متوسط'}
                            </span>
                        </div>
                    </div>

                    <div class="space-y-2.5 text-xs sm:text-sm leading-relaxed">
                        <div class="p-3.5 rounded-xl bg-white dark:bg-[#242220] border border-[#EFECE6] dark:border-[#2C2A27]">
                            <div class="font-extrabold text-[#201F1E] dark:text-[#FFCF68] mb-1 flex items-center gap-1.5">
                                <i data-lucide="building-2" class="w-4 h-4" aria-hidden="true"></i>
                                <span>سناریوی واقعی در شرکت:</span>
                            </div>
                            <p class="text-[#5C564F] dark:text-[#C4BDB3]">${ex.scenario}</p>
                        </div>

                        <div class="p-3.5 rounded-xl bg-white dark:bg-[#242220] border-r-4 border-r-[#10B981] border border-[#EFECE6] dark:border-[#2C2A27]">
                            <div class="font-extrabold text-[#15803D] dark:text-[#34D399] mb-1 flex items-center gap-1.5">
                                <i data-lucide="target" class="w-4 h-4" aria-hidden="true"></i>
                                <span>ماموریت و خواسته مسئله از شما:</span>
                            </div>
                            <div class="text-[#201F1E] dark:text-[#F5F2EB] font-medium">${ex.task}</div>
                        </div>
                    </div>

                    <div class="space-y-2.5 pt-1">
                        ${ex.hint ? `
                        <details class="exercise-disclosure">
                            <summary class="text-[#5C564F] dark:text-[#C4BDB3]">
                                <span class="inline-flex items-center gap-2">
                                    <i data-lucide="lightbulb" class="w-4 h-4 text-[#FFCF68]" aria-hidden="true"></i>
                                    <span>مشاهده راهنمایی تحلیلی (قبل از دیدن جواب کلیک کنید)</span>
                                </span>
                                <i data-lucide="chevron-down" class="w-4 h-4" aria-hidden="true"></i>
                            </summary>
                            <div class="p-3.5 border-t border-[#E3DDD4] dark:border-[#383531] text-xs sm:text-sm text-[#5C564F] dark:text-[#C4BDB3] bg-white dark:bg-[#242220]">
                                ${ex.hint}
                            </div>
                        </details>
                        ` : ''}

                        <details class="exercise-disclosure">
                            <summary class="text-[#15803D] dark:text-[#34D399]">
                                <span class="inline-flex items-center gap-2">
                                    <i data-lucide="check-check" class="w-4 h-4" aria-hidden="true"></i>
                                    <span>مشاهده کد کامل حل مسئله و تشریح منطق صنعتی</span>
                                </span>
                                <i data-lucide="chevron-down" class="w-4 h-4" aria-hidden="true"></i>
                            </summary>
                            <div class="p-4 border-t border-[#E3DDD4] dark:border-[#383531] bg-white dark:bg-[#242220] space-y-3">
                                ${ex.solutionCode ? this.buildCodeBlockHtml(ex.solutionCode, ex.solutionLanguage || 'sql', 'پاسخ اجرایی استاندارد پروداکشن', '') : ''}
                                ${ex.solutionExplanation ? `
                                <div class="p-3.5 rounded-xl bg-[#EBF7EE]/60 dark:bg-[#10B981]/10 border border-[#C6EBD0] dark:border-[#10B981]/25 text-xs sm:text-sm text-[#201F1E] dark:text-[#F5F2EB] leading-relaxed">
                                    <strong class="block mb-1 text-[#15803D] dark:text-[#34D399]">تشریح گام‌به‌گام منطق حل:</strong>
                                    ${ex.solutionExplanation}
                                </div>
                                ` : ''}
                            </div>
                        </details>
                    </div>
                </div>
            `).join('');
        } else {
            exSection.classList.add('hidden');
            exContainer.innerHTML = '';
        }

        // 6. Render Key Takeaways
        const takeawaysSection = document.getElementById('stepTakeawaysSection');
        const takeawaysList = document.getElementById('stepTakeawaysList');
        if (step.keyTakeaways && step.keyTakeaways.length > 0) {
            takeawaysSection.classList.remove('hidden');
            takeawaysList.innerHTML = step.keyTakeaways.map(item => `<li>${item}</li>`).join('');
        } else {
            takeawaysSection.classList.add('hidden');
            takeawaysList.innerHTML = '';
        }

        // 7. Update Prev / Next Buttons State & Labels
        this.updateNavigationButtons();

        // 8. Bind Copy Code Buttons
        this.bindCopyButtons();

        if (window.lucide) {
            lucide.createIcons();
        }

        if (scrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateNavigationButtons() {
        const mod = this.getCurrentModule();
        const isFirstModule = this.currentModuleIndex === 0;
        const isFirstStep = this.currentStepIndex === 0;
        const isLastModule = this.currentModuleIndex === this.modules.length - 1;
        const isLastStep = this.currentStepIndex === mod.steps.length - 1;

        const canGoPrev = !(isFirstModule && isFirstStep);
        const canGoNext = !(isLastModule && isLastStep);

        const topPrev = document.getElementById('topPrevStepBtn');
        const bottomPrev = document.getElementById('bottomPrevStepBtn');
        const topNext = document.getElementById('topNextStepBtn');
        const bottomNext = document.getElementById('bottomNextStepBtn');

        if (topPrev) topPrev.disabled = !canGoPrev;
        if (bottomPrev) bottomPrev.disabled = !canGoPrev;
        if (topNext) topNext.disabled = !canGoNext;
        if (bottomNext) bottomNext.disabled = !canGoNext;

        // Previous Label
        const prevTitleEl = document.getElementById('bottomPrevStepTitle');
        if (prevTitleEl) {
            if (!isFirstStep) {
                prevTitleEl.textContent = mod.steps[this.currentStepIndex - 1].title;
            } else if (!isFirstModule) {
                const prevMod = this.modules[this.currentModuleIndex - 1];
                prevTitleEl.textContent = `بخش قبلی: ${prevMod.title}`;
            } else {
                prevTitleEl.textContent = 'اولین گام دوره';
            }
        }

        // Next Label
        const nextTitleEl = document.getElementById('bottomNextStepTitle');
        if (nextTitleEl) {
            if (!isLastStep) {
                nextTitleEl.textContent = mod.steps[this.currentStepIndex + 1].title;
            } else if (!isLastModule) {
                const nextMod = this.modules[this.currentModuleIndex + 1];
                nextTitleEl.textContent = `ورود به بخش بعدی: ${nextMod.title}`;
            } else {
                nextTitleEl.textContent = 'پایان آخرین گام دوره';
            }
        }
    }

    buildCodeBlockHtml(code, language = 'sql', title = '', description = '') {
        const escapedCode = this.escapeHtml(code.trim());
        const encodedForCopy = encodeURIComponent(code.trim());
        return `
            <div class="space-y-1.5">
                ${description ? `<p class="text-xs sm:text-sm text-[#5C564F] dark:text-[#C4BDB3] font-medium">${description}</p>` : ''}
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-[#FFCF68] text-[#201F1E] font-mono font-extrabold text-[10px] uppercase">${language}</span>
                            <span class="font-sans text-xs text-[#F5F2EB] font-bold" dir="rtl">${title}</span>
                        </div>
                        <button type="button" class="copy-code-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#383531] hover:bg-[#FFCF68] text-[#F5F2EB] hover:text-[#201F1E] text-[11px] font-bold transition cursor-pointer" data-raw-code="${encodedForCopy}">
                            <i data-lucide="copy" class="w-3.5 h-3.5" aria-hidden="true"></i>
                            <span dir="rtl">کپی کد</span>
                        </button>
                    </div>
                    <pre tabindex="0" class="code-block-pre"><code class="language-${language}">${escapedCode}</code></pre>
                </div>
            </div>
        `;
    }

    enhanceInlinePreBlocks(container) {
        const preElements = container.querySelectorAll('pre');
        preElements.forEach((pre) => {
            if (pre.closest('.code-block-wrapper')) return;
            const rawText = pre.textContent.trim();
            const encoded = encodeURIComponent(rawText);
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            wrapper.innerHTML = `
                <div class="code-block-header">
                    <span class="px-2 py-0.5 rounded bg-[#FFCF68] text-[#201F1E] font-mono font-extrabold text-[10px] uppercase">CODE / DIAGRAM</span>
                    <button type="button" class="copy-code-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#383531] hover:bg-[#FFCF68] text-[#F5F2EB] hover:text-[#201F1E] text-[11px] font-bold transition cursor-pointer" data-raw-code="${encoded}">
                        <i data-lucide="copy" class="w-3.5 h-3.5" aria-hidden="true"></i>
                        <span dir="rtl">کپی</span>
                    </button>
                </div>
            `;
            pre.classList.add('code-block-pre');
            pre.setAttribute('tabindex', '0');
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
        });
    }

    bindCopyButtons() {
        document.querySelectorAll('.copy-code-btn').forEach(btn => {
            btn.onclick = async () => {
                const raw = decodeURIComponent(btn.getAttribute('data-raw-code') || '');
                try {
                    await navigator.clipboard.writeText(raw);
                    this.showToast('کد با موفقیت در کلیپ‌بورد کپی شد ✓');
                } catch {
                    // Fallback copy
                    const ta = document.createElement('textarea');
                    ta.value = raw;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    this.showToast('کد کپی شد ✓');
                }
            };
        });
    }

    openTocDialog() {
        const dialog = document.getElementById('tocDialog');
        const searchInput = document.getElementById('tocSearchInput');
        if (!dialog) return;

        if (searchInput) searchInput.value = '';
        this.renderTocModalList('');
        dialog.showModal();
    }

    renderTocModalList(query = '') {
        const body = document.getElementById('tocModalBody');
        if (!body) return;

        const q = query.toLowerCase();

        const html = this.modules.map((mod, modIdx) => {
            const matchingSteps = mod.steps
                .map((step, sIdx) => ({ step, sIdx }))
                .filter(({ step }) => {
                    if (!q) return true;
                    const hay = `${mod.title} ${mod.folderName} ${step.title} ${step.summary || ''} ${step.badge || ''}`.toLowerCase();
                    return hay.includes(q);
                });

            if (matchingSteps.length === 0) return '';

            const isCurrentMod = modIdx === this.currentModuleIndex;
            const doneCount = mod.steps.filter(s => this.completedSteps.has(s.id)).length;

            return `
                <div class="rounded-2xl border ${isCurrentMod ? 'border-[#FFCF68] bg-[#FFF8E7]/40 dark:bg-[#2D2B28]/60' : 'border-[#E3DDD4] dark:border-[#383531] bg-[#F9F7F4] dark:bg-[#1E1C1A]'} overflow-hidden">
                    <div class="p-3.5 sm:px-4 bg-white dark:bg-[#242220] border-b border-[#E3DDD4] dark:border-[#383531] flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2.5">
                            <span class="px-2.5 py-0.5 rounded-full bg-[#201F1E] text-[#FFCF68] dark:bg-[#FFCF68] dark:text-[#201F1E] font-mono text-xs font-extrabold">${mod.folderName}</span>
                            <h3 class="font-extrabold text-xs sm:text-sm text-[#201F1E] dark:text-white">${mod.title}</h3>
                        </div>
                        <span class="text-[11px] font-bold text-[#8C847B]">${this.toPersianDigits(doneCount)} از ${this.toPersianDigits(mod.steps.length)} گام</span>
                    </div>
                    <div class="divide-y divide-[#EFECE6] dark:divide-[#2C2A27]">
                        ${matchingSteps.map(({ step, sIdx }) => {
                            const isCurrentStep = isCurrentMod && sIdx === this.currentStepIndex;
                            const isDone = this.completedSteps.has(step.id);
                            const exCount = step.industryExercises ? step.industryExercises.length : 0;
                            return `
                                <button type="button"
                                    class="toc-step-item w-full text-right p-3 sm:px-4 hover:bg-[#F4EFEA] dark:hover:bg-[#2D2B28] transition flex items-center justify-between gap-3 cursor-pointer ${isCurrentStep ? 'bg-[#FFCF68]/25 dark:bg-[#FFCF68]/15 font-extrabold' : ''}"
                                    data-mod-idx="${modIdx}"
                                    data-step-idx="${sIdx}">
                                    <div class="flex items-center gap-3 overflow-hidden">
                                        <span class="w-7 h-7 rounded-lg ${isCurrentStep ? 'bg-[#201F1E] text-[#FFCF68]' : isDone ? 'bg-[#EBF7EE] text-[#15803D] dark:bg-[#10B981]/20 dark:text-[#34D399]' : 'bg-white dark:bg-[#242220] text-[#5C564F] border border-[#E3DDD4] dark:border-[#383531]'} text-xs font-extrabold flex items-center justify-center shrink-0">
                                            ${isDone ? '✓' : this.toPersianDigits(sIdx + 1)}
                                        </span>
                                        <div class="truncate">
                                            <div class="text-xs sm:text-sm font-bold text-[#201F1E] dark:text-white truncate">${step.title}</div>
                                            <div class="text-[11px] text-[#8C847B] truncate">${step.summary || ''}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1.5 shrink-0">
                                        ${exCount > 0 ? `<span class="px-2 py-0.5 rounded-full bg-[#EBF7EE] dark:bg-[#10B981]/15 text-[#15803D] dark:text-[#34D399] text-[10px] font-bold">${this.toPersianDigits(exCount)} تمرین صنعتی</span>` : `<span class="px-2 py-0.5 rounded-full bg-[#F4EFEA] dark:bg-[#2D2B28] text-[#8C847B] text-[10px] font-bold">${step.badge || 'مقدمه'}</span>`}
                                    </div>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        body.innerHTML = html || `<div class="p-8 text-center text-sm text-[#8C847B]">موردی مطابق با جستجوی شما یافت نشد.</div>`;

        body.querySelectorAll('.toc-step-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const mIdx = parseInt(btn.getAttribute('data-mod-idx'), 10);
                const sIdx = parseInt(btn.getAttribute('data-step-idx'), 10);
                const dialog = document.getElementById('tocDialog');
                if (dialog && dialog.open) dialog.close();
                this.selectModule(mIdx, sIdx);
            });
        });
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    toPersianDigits(num) {
        const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/\d/g, d => persian[parseInt(d, 10)]);
    }

    showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'px-4 py-2.5 rounded-2xl bg-[#201F1E] text-[#FFCF68] dark:bg-[#FFCF68] dark:text-[#201F1E] text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all duration-300';
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => toast.remove(), 250);
        }, 2400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bootcampApp = new BootcampApp();
    window.bootcampApp.init();
});
