/**
 * Main Application
 * UIとの連携、イベントハンドリング、状態管理を行う
 */

class GitWizardApp {
    constructor() {
        this.analyzer = new CommandAnalyzer(CommandDatabase);
        this.currentTab = 'analyzer';
        this.settings = this.loadSettings();
        this.currentWizard = null;
        this.currentStep = 0;
        this.init();
    }

    /**
     * アプリケーション初期化
     */
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.initializeReference();
        this.setupCommandBuilder();
        this.setupWizard();
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // タブ切り替え
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // コマンド解析
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');
        const commandInput = document.getElementById('commandInput');

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeCommand();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                commandInput.value = '';
                this.hideAnalysisResults();
            });
        }

        if (commandInput) {
            // Enterキーで解析（Shift+Enterで改行）
            commandInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.analyzeCommand();
                }
            });
        }

        // ダークモード切り替え
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // 言語切り替え（将来的に実装）
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // コマンドコピー
        const copyCommandBtn = document.getElementById('copyCommandBtn');
        if (copyCommandBtn) {
            copyCommandBtn.addEventListener('click', () => {
                this.copyGeneratedCommand();
            });
        }

        // サンプルコマンド選択
        const sampleCommandSelect = document.getElementById('sampleCommandSelect');
        if (sampleCommandSelect) {
            sampleCommandSelect.addEventListener('change', (e) => {
                const selectedCommand = e.target.value;
                if (selectedCommand) {
                    commandInput.value = selectedCommand;
                    // 自動的に解析を実行
                    this.analyzeCommand();
                    // 選択をリセット
                    e.target.value = '';
                }
            });
        }
    }

    /**
     * タブを切り替え
     */
    switchTab(tabName) {
        // すべてのタブとコンテンツを非アクティブ化
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 選択されたタブとコンテンツをアクティブ化
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(tabName);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');

        this.currentTab = tabName;
    }

    /**
     * コマンドを解析
     */
    analyzeCommand() {
        const input = document.getElementById('commandInput');
        const commandString = input.value.trim();

        if (!commandString) {
            this.showError('コマンドを入力してください');
            return;
        }

        // 解析実行
        const result = this.analyzer.analyze(commandString);

        if (result.error) {
            this.showError(result.error, result.suggestion);
            return;
        }

        // 結果を表示
        this.displayAnalysisResults(result);
    }

    /**
     * 解析結果を表示
     */
    displayAnalysisResults(result) {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.remove('hidden');

        // 警告セクション
        this.displayWarnings(result.warnings);

        // 説明セクション
        this.displayExplanation(result.explanation);

        // 危険度セクション
        this.displayDangerLevel(result.dangerLevel);

        // 代替案セクション
        this.displayAlternatives(result.alternatives);

        // 元に戻す方法セクション
        this.displayUndoMethod(result.undoMethod);

        // スムーズにスクロール
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * 警告を表示
     */
    displayWarnings(warnings) {
        const warningSection = document.getElementById('warningSection');

        if (!warnings || warnings.length === 0) {
            warningSection.classList.add('hidden');
            return;
        }

        warningSection.classList.remove('hidden');
        warningSection.innerHTML = '';

        warnings.forEach(warning => {
            const warningBox = document.createElement('div');
            warningBox.className = `warning-box warning-${warning.level}`;

            let html = `
                <div class="warning-box-header">
                    <span class="warning-icon">${this.getWarningIcon(warning.level)}</span>
                    <span>${warning.message}</span>
                </div>
                <div class="warning-content">
            `;

            if (warning.detail) {
                html += `<p><strong>詳細:</strong> ${warning.detail}</p>`;
            }

            if (warning.recommendations && warning.recommendations.length > 0) {
                html += '<p><strong>推奨事項:</strong></p><ul class="warning-list">';
                warning.recommendations.forEach(rec => {
                    html += `<li>${rec}</li>`;
                });
                html += '</ul>';
            }

            if (warning.correctCommands && warning.correctCommands.length > 0) {
                html += '<p><strong>推奨コマンド:</strong></p>';
                warning.correctCommands.forEach(cmd => {
                    html += `<code style="display: block; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px;">${cmd}</code>`;
                });
            }

            html += '</div>';
            warningBox.innerHTML = html;
            warningSection.appendChild(warningBox);
        });
    }

    /**
     * 警告アイコンを取得
     */
    getWarningIcon(level) {
        const icons = {
            'critical': '🚨',
            'warning': '⚠️',
            'caution': '⚡',
            'info': 'ℹ️'
        };
        return icons[level] || '⚠️';
    }

    /**
     * 説明を表示
     */
    displayExplanation(explanation) {
        const explanationContent = document.getElementById('explanationContent');

        let html = `<p style="margin-bottom: 1rem;">${explanation.summary}</p>`;

        if (explanation.breakdown && explanation.breakdown.length > 0) {
            html += '<div class="command-breakdown">';
            explanation.breakdown.forEach(part => {
                html += `
                    <div class="command-part">
                        <div class="command-part-name">${this.escapeHtml(part.part)}</div>
                        <div class="command-part-desc">${part.description}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (explanation.examples && explanation.examples.length > 0) {
            html += '<p style="margin-top: 1rem;"><strong>使用例:</strong></p>';
            explanation.examples.forEach(example => {
                html += `<code style="display: block; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px;">${this.escapeHtml(example)}</code>`;
            });
        }

        explanationContent.innerHTML = html;
    }

    /**
     * 危険度を表示
     */
    displayDangerLevel(dangerLevel) {
        const dangerContent = document.getElementById('dangerContent');

        const html = `
            <div class="danger-badge danger-${dangerLevel.level}">
                <span>${dangerLevel.icon}</span>
                <span>${dangerLevel.label}</span>
            </div>
            <p>${dangerLevel.description}</p>
        `;

        dangerContent.innerHTML = html;
    }

    /**
     * 代替案を表示
     */
    displayAlternatives(alternatives) {
        const alternativesSection = document.getElementById('alternativesSection');

        if (!alternatives || alternatives.length === 0) {
            alternativesSection.classList.add('hidden');
            return;
        }

        alternativesSection.classList.remove('hidden');
        const alternativesContent = document.getElementById('alternativesContent');

        let html = '';
        alternatives.forEach(alt => {
            html += `
                <div class="alternative-cmd">
                    <code>${this.escapeHtml(alt.command)}</code>
                    <p><strong>${alt.reason}</strong></p>
                    <p>${alt.description}</p>
                </div>
            `;
        });

        alternativesContent.innerHTML = html;
    }

    /**
     * 元に戻す方法を表示
     */
    displayUndoMethod(undoMethod) {
        const undoSection = document.getElementById('undoSection');

        if (!undoMethod) {
            undoSection.classList.add('hidden');
            return;
        }

        undoSection.classList.remove('hidden');
        const undoContent = document.getElementById('undoContent');

        let html = `
            <code style="display: block; margin: 1rem 0; padding: 0.75rem; background: var(--bg-primary); border-radius: 4px; font-size: 1.1rem;">${this.escapeHtml(undoMethod.command)}</code>
            <p>${undoMethod.description}</p>
        `;

        if (undoMethod.warning) {
            html += `<p style="color: var(--color-warning); margin-top: 0.5rem;"><strong>注意:</strong> ${undoMethod.warning}</p>`;
        }

        undoContent.innerHTML = html;
    }

    /**
     * 解析結果を非表示
     */
    hideAnalysisResults() {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.add('hidden');
    }

    /**
     * エラーを表示
     */
    showError(message, suggestion) {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.remove('hidden');

        const warningSection = document.getElementById('warningSection');
        warningSection.classList.remove('hidden');
        warningSection.innerHTML = `
            <div class="warning-box warning-high">
                <div class="warning-box-header">
                    <span class="warning-icon">❌</span>
                    <span>${message}</span>
                </div>
                ${suggestion ? `<div class="warning-content"><p>${suggestion}</p></div>` : ''}
            </div>
        `;

        // 他のセクションを非表示
        document.getElementById('explanationSection').style.display = 'none';
        document.getElementById('dangerSection').style.display = 'none';
        document.getElementById('alternativesSection').classList.add('hidden');
        document.getElementById('undoSection').classList.add('hidden');
    }

    /**
     * コマンドビルダーを設定
     */
    setupCommandBuilder() {
        const scenarioSelect = document.getElementById('scenarioSelect');

        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => {
                this.handleScenarioChange(e.target.value);
            });
        }
    }

    /**
     * シナリオ変更時の処理
     */
    handleScenarioChange(scenario) {
        const parameterForm = document.getElementById('parameterForm');
        const generatedCommand = document.getElementById('generatedCommand');

        if (!scenario) {
            parameterForm.classList.add('hidden');
            generatedCommand.classList.add('hidden');
            return;
        }

        // シナリオに応じたフォームを生成
        const formFields = this.getFormFieldsForScenario(scenario);
        this.renderParameterForm(formFields, scenario);
    }

    /**
     * シナリオに応じたフォームフィールドを取得
     */
    getFormFieldsForScenario(scenario) {
        const scenarios = {
            'init': [
                { name: 'repoName', label: 'リポジトリ名（オプション）', type: 'text', placeholder: 'my-project' }
            ],
            'clone': [
                { name: 'url', label: 'リポジトリURL', type: 'text', placeholder: 'https://github.com/user/repo.git', required: true }
            ],
            'fork': [
                { name: 'repo', label: 'フォークするリポジトリ', type: 'text', placeholder: 'owner/repo', required: true }
            ],
            'add': [
                { name: 'files', label: 'ファイル名（. ですべて）', type: 'text', placeholder: 'file.txt または .', required: true }
            ],
            'commit': [
                { name: 'message', label: 'コミットメッセージ', type: 'text', placeholder: '変更内容を簡潔に説明', required: true },
                { name: 'addAll', label: 'すべての変更を含める (-a)', type: 'checkbox' }
            ],
            'push': [
                { name: 'remote', label: 'リモート名', type: 'select', options: ['origin', 'upstream'], default: 'origin' },
                { name: 'branch', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true },
                { name: 'setUpstream', label: '上流ブランチを設定 (-u)', type: 'checkbox' }
            ],
            'branch-create': [
                { name: 'branchName', label: '新しいブランチ名', type: 'text', placeholder: 'feature/new-feature', required: true },
                { name: 'switchTo', label: '作成後に切り替える', type: 'checkbox', default: true }
            ],
            'branch-switch': [
                { name: 'branchName', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true }
            ],
            'branch-delete': [
                { name: 'branchName', label: '削除するブランチ名', type: 'text', placeholder: 'feature-branch', required: true },
                { name: 'force', label: '強制削除 (-D)', type: 'checkbox' }
            ],
            'merge': [
                { name: 'branchName', label: 'マージするブランチ名', type: 'text', placeholder: 'feature-branch', required: true },
                { name: 'noFf', label: 'Fast-forwardしない (--no-ff)', type: 'checkbox' }
            ],
            'pull': [
                { name: 'remote', label: 'リモート名', type: 'select', options: ['origin', 'upstream'], default: 'origin' },
                { name: 'branch', label: 'ブランチ名', type: 'text', placeholder: 'main', required: true }
            ],
            'fetch': [
                { name: 'remote', label: 'リモート名（空欄で全て）', type: 'text', placeholder: 'origin' },
                { name: 'prune', label: '削除されたブランチを整理 (--prune)', type: 'checkbox' }
            ],
            'sync-fork': [
                { name: 'branch', label: '同期するブランチ', type: 'text', placeholder: 'main', default: 'main' }
            ],
            'pr-create': [
                { name: 'title', label: 'Pull Requestのタイトル', type: 'text', placeholder: 'Add new feature' },
                { name: 'base', label: 'マージ先ブランチ', type: 'text', placeholder: 'main', default: 'main' }
            ],
            'issue-create': [
                { name: 'title', label: 'Issueのタイトル', type: 'text', placeholder: 'Bug: Something is broken', required: true }
            ]
        };

        return scenarios[scenario] || [];
    }

    /**
     * パラメータフォームをレンダリング
     */
    renderParameterForm(fields, scenario) {
        const parameterForm = document.getElementById('parameterForm');
        parameterForm.classList.remove('hidden');

        let html = '<form id="commandForm">';

        fields.forEach(field => {
            html += '<div class="form-group">';
            html += `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;

            if (field.type === 'text') {
                html += `<input type="text" id="${field.name}" name="${field.name}" class="form-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} value="${field.default || ''}">`;
            } else if (field.type === 'checkbox') {
                html += `<input type="checkbox" id="${field.name}" name="${field.name}" ${field.default ? 'checked' : ''}>`;
            } else if (field.type === 'select') {
                html += `<select id="${field.name}" name="${field.name}" class="select-input">`;
                field.options.forEach(option => {
                    html += `<option value="${option}" ${option === field.default ? 'selected' : ''}>${option}</option>`;
                });
                html += '</select>';
            }

            if (field.hint) {
                html += `<small class="form-hint">${field.hint}</small>`;
            }

            html += '</div>';
        });

        html += '<button type="submit" class="btn btn-primary">コマンドを生成</button>';
        html += '</form>';

        parameterForm.innerHTML = html;

        // フォーム送信イベント
        const form = document.getElementById('commandForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateCommand(scenario, new FormData(form));
        });

        // リアルタイムプレビュー
        form.addEventListener('input', () => {
            this.generateCommand(scenario, new FormData(form), true);
        });
    }

    /**
     * コマンドを生成
     */
    generateCommand(scenario, formData, isPreview = false) {
        const command = this.buildCommand(scenario, formData);

        if (!command) return;

        const generatedCommand = document.getElementById('generatedCommand');
        const commandOutput = document.getElementById('commandOutput');
        const builderExplanation = document.getElementById('builderExplanation');

        generatedCommand.classList.remove('hidden');
        commandOutput.textContent = command;

        // コマンドの解説を表示
        const result = this.analyzer.analyze(command);
        if (result.success) {
            builderExplanation.innerHTML = `
                <p><strong>このコマンドは:</strong> ${result.explanation.summary}</p>
                ${result.dangerLevel.level !== 'safe' ? `<p style="color: var(--color-warning); margin-top: 0.5rem;">⚠️ ${result.dangerLevel.description}</p>` : ''}
            `;
        }
    }

    /**
     * シナリオに応じたコマンドを構築
     */
    buildCommand(scenario, formData) {
        const data = Object.fromEntries(formData);

        const commands = {
            'init': () => {
                return data.repoName ? `git init ${data.repoName}` : 'git init';
            },
            'clone': () => {
                return `git clone ${data.url}`;
            },
            'fork': () => {
                return `gh repo fork ${data.repo}`;
            },
            'add': () => {
                return `git add ${data.files}`;
            },
            'commit': () => {
                const flags = data.addAll ? '-am' : '-m';
                return `git commit ${flags} "${data.message}"`;
            },
            'push': () => {
                const flags = data.setUpstream ? '-u' : '';
                return `git push ${flags} ${data.remote} ${data.branch}`.trim();
            },
            'branch-create': () => {
                return data.switchTo ? `git checkout -b ${data.branchName}` : `git branch ${data.branchName}`;
            },
            'branch-switch': () => {
                return `git switch ${data.branchName}`;
            },
            'branch-delete': () => {
                const flag = data.force ? '-D' : '-d';
                return `git branch ${flag} ${data.branchName}`;
            },
            'merge': () => {
                const flags = data.noFf ? '--no-ff' : '';
                return `git merge ${flags} ${data.branchName}`.trim();
            },
            'pull': () => {
                return `git pull ${data.remote} ${data.branch}`;
            },
            'fetch': () => {
                const flags = data.prune ? '--prune' : '';
                const remote = data.remote || '--all';
                return `git fetch ${remote} ${flags}`.trim();
            },
            'sync-fork': () => {
                return `git fetch upstream && git checkout ${data.branch || 'main'} && git merge upstream/${data.branch || 'main'}`;
            },
            'status': () => 'git status',
            'log': () => 'git log --oneline --graph',
            'diff': () => 'git diff',
            'remote': () => 'git remote -v',
            'pr-create': () => {
                let cmd = 'gh pr create';
                if (data.title) cmd += ` --title "${data.title}"`;
                if (data.base) cmd += ` --base ${data.base}`;
                return cmd;
            },
            'pr-list': () => 'gh pr list',
            'issue-create': () => {
                return `gh issue create --title "${data.title}"`;
            },
            'issue-list': () => 'gh issue list'
        };

        return commands[scenario] ? commands[scenario]() : '';
    }

    /**
     * 生成されたコマンドをコピー
     */
    copyGeneratedCommand() {
        const commandOutput = document.getElementById('commandOutput');
        const text = commandOutput.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copyCommandBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ コピーしました！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }

    /**
     * リファレンスを初期化
     */
    initializeReference() {
        this.renderReference();

        const searchInput = document.getElementById('referenceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterReference(e.target.value);
            });
        }
    }

    /**
     * リファレンスをレンダリング
     */
    renderReference(filter = '') {
        const referenceContent = document.getElementById('referenceContent');
        let html = '';

        // Git コマンド
        Object.entries(CommandDatabase.git).forEach(([cmd, info]) => {
            if (filter && !cmd.includes(filter.toLowerCase()) && !info.description.toLowerCase().includes(filter.toLowerCase())) {
                return;
            }

            const category = CommandDatabase.categories[info.category];
            html += `
                <div class="reference-card">
                    <h4>${category ? category.icon : ''} git ${cmd}</h4>
                    <p>${info.description}</p>
                    <p><strong>危険度:</strong> ${CommandDatabase.dangerLevels[info.dangerLevel].icon} ${CommandDatabase.dangerLevels[info.dangerLevel].label}</p>
                    ${info.examples ? `<p><strong>例:</strong> <code>${info.examples[0]}</code></p>` : ''}
                </div>
            `;
        });

        // GitHub CLI コマンド
        Object.entries(CommandDatabase.gh).forEach(([cmd, info]) => {
            if (filter && !cmd.includes(filter.toLowerCase()) && !info.description.toLowerCase().includes(filter.toLowerCase())) {
                return;
            }

            html += `
                <div class="reference-card">
                    <h4>🐙 gh ${cmd}</h4>
                    <p>${info.description}</p>
                    ${info.examples ? `<p><strong>例:</strong> <code>${info.examples[0]}</code></p>` : ''}
                </div>
            `;
        });

        referenceContent.innerHTML = html || '<p>該当するコマンドが見つかりませんでした。</p>';
    }

    /**
     * リファレンスをフィルタリング
     */
    filterReference(query) {
        this.renderReference(query);
    }

    /**
     * テーマを切り替え
     */
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        const themeToggle = document.getElementById('themeToggle');

        if (themeToggle) {
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        }

        this.settings.theme = isDark ? 'dark' : 'light';
        this.saveSettings();
    }

    /**
     * 言語を変更
     */
    changeLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        // 実際の言語変更処理は将来実装
        console.log(`Language changed to: ${lang}`);
    }

    /**
     * 設定を読み込み
     */
    loadSettings() {
        const defaultSettings = {
            theme: 'light',
            language: 'ja'
        };

        try {
            const saved = localStorage.getItem('gitWizardSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    /**
     * 設定を保存
     */
    saveSettings() {
        try {
            localStorage.setItem('gitWizardSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    /**
     * 設定を適用
     */
    applySettings() {
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
            }
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
        }
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * ウィザードを設定
     */
    setupWizard() {
        const wizardCards = document.querySelectorAll('.wizard-card');
        wizardCards.forEach(card => {
            card.addEventListener('click', () => {
                const wizardId = card.dataset.wizard;
                this.startWizard(wizardId);
            });
        });
    }

    /**
     * ウィザードを開始
     */
    startWizard(wizardId) {
        if (!WizardData[wizardId]) {
            console.error(`Wizard not found: ${wizardId}`);
            return;
        }

        this.currentWizard = WizardData[wizardId];
        this.currentStep = 0;
        this.renderWizard();
    }

    /**
     * ウィザードをレンダリング
     */
    renderWizard() {
        const wizardContent = document.getElementById('wizardContent');
        const wizardSelector = document.querySelector('.wizard-selector');

        if (!this.currentWizard) {
            wizardContent.classList.add('hidden');
            wizardSelector.classList.remove('hidden');
            return;
        }

        wizardSelector.classList.add('hidden');
        wizardContent.classList.remove('hidden');

        const step = this.currentWizard.steps[this.currentStep];
        const totalSteps = this.currentWizard.steps.length;

        let html = `
            <div class="wizard-header">
                <button class="btn btn-secondary" id="backToWizardsBtn">
                    ← コース一覧に戻る
                </button>
                <h2>${this.currentWizard.title}</h2>
                <div class="wizard-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStep + 1) / totalSteps) * 100}%"></div>
                    </div>
                    <div class="progress-text">ステップ ${this.currentStep + 1} / ${totalSteps}</div>
                </div>
            </div>

            <div class="wizard-step">
                <h3>${step.title}</h3>
                <div class="wizard-step-content">
                    ${step.content || ''}
                </div>
        `;

        // ステップタイプに応じたコンテンツ
        if (step.commands && step.commands.length > 0) {
            html += '<div class="wizard-commands">';
            step.commands.forEach(cmd => {
                const highlightClass = cmd.highlight ? 'highlight' : '';
                html += `
                    <div class="wizard-command ${highlightClass}">
                        <code>${this.escapeHtml(cmd.command)}</code>
                        <p>${cmd.explanation}</p>
                    </div>
                `;
            });
            html += '</div>';
        }

        // 選択肢がある場合
        if (step.choices && step.choices.length > 0) {
            html += '<div class="wizard-choices">';
            step.choices.forEach(choice => {
                html += `
                    <div class="wizard-choice">
                        <h4>${choice.icon || ''} ${choice.title}</h4>
                        ${choice.content || ''}
                        ${choice.commands ? this.renderWizardCommands(choice.commands) : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        // ダイアグラム
        if (step.diagram) {
            html += `<div class="wizard-diagram">${step.diagram}</div>`;
        }

        // ノート
        if (step.note) {
            html += `<div class="wizard-note">💡 ${step.note}</div>`;
        }

        // ヒント
        if (step.tip) {
            html += `<div class="wizard-tip">${step.tip}</div>`;
        }

        // 警告
        if (step.warning) {
            html += `<div class="wizard-warning">${step.warning}</div>`;
        }

        // 検証方法
        if (step.verification) {
            html += `<div class="wizard-verification">${step.verification}</div>`;
        }

        // 期待される出力
        if (step.expectedOutput) {
            html += `
                <div class="wizard-expected">
                    <h4>期待される出力:</h4>
                    <pre>${this.escapeHtml(step.expectedOutput)}</pre>
                </div>
            `;
        }

        // 代替案
        if (step.alternative) {
            html += `<div class="wizard-alternative">${step.alternative}</div>`;
        }

        // ナビゲーションボタン
        html += '<div class="wizard-navigation">';

        if (this.currentStep > 0) {
            html += '<button class="btn btn-secondary" id="prevStepBtn">← 前のステップ</button>';
        }

        if (this.currentStep < totalSteps - 1) {
            html += '<button class="btn btn-primary" id="nextStepBtn">次のステップ →</button>';
        } else {
            html += '<button class="btn btn-primary" id="finishWizardBtn">完了！ 🎉</button>';
        }

        html += '</div>';
        html += '</div>'; // wizard-step

        wizardContent.innerHTML = html;

        // イベントリスナーを設定
        this.setupWizardEventListeners();
    }

    /**
     * ウィザードコマンドをレンダリング
     */
    renderWizardCommands(commands) {
        let html = '<div class="wizard-commands">';
        commands.forEach(cmd => {
            const highlightClass = cmd.highlight ? 'highlight' : '';
            html += `
                <div class="wizard-command ${highlightClass}">
                    <code>${this.escapeHtml(cmd.command)}</code>
                    <p>${cmd.explanation}</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    /**
     * ウィザードイベントリスナーを設定
     */
    setupWizardEventListeners() {
        const backBtn = document.getElementById('backToWizardsBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const prevBtn = document.getElementById('prevStepBtn');
        const finishBtn = document.getElementById('finishWizardBtn');

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentWizard = null;
                this.currentStep = 0;
                this.renderWizard();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentStep++;
                this.renderWizard();
                document.getElementById('wizardContent').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentStep--;
                this.renderWizard();
                document.getElementById('wizardContent').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.showWizardCompletion();
            });
        }
    }

    /**
     * ウィザード完了画面を表示
     */
    showWizardCompletion() {
        const wizardContent = document.getElementById('wizardContent');

        const html = `
            <div class="wizard-completion">
                <div class="completion-icon">🎉</div>
                <h2>おめでとうございます！</h2>
                <p>${this.currentWizard.title} コースを完了しました。</p>

                <div class="completion-actions">
                    <button class="btn btn-primary" id="anotherWizardBtn">
                        別のコースを学ぶ
                    </button>
                    <button class="btn btn-secondary" id="tryCommandsBtn">
                        コマンドを試す
                    </button>
                </div>
            </div>
        `;

        wizardContent.innerHTML = html;

        document.getElementById('anotherWizardBtn').addEventListener('click', () => {
            this.currentWizard = null;
            this.currentStep = 0;
            this.renderWizard();
        });

        document.getElementById('tryCommandsBtn').addEventListener('click', () => {
            this.switchTab('analyzer');
        });
    }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    window.gitWizardApp = new GitWizardApp();
});
